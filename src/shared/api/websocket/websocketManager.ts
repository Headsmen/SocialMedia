import { WorkerMessageType, SocketEvents } from "./config/events";
import type { WorkerMessage, InitPayload } from "./types";

type EventCallback = (payload: any) => void;

class WebSocketManager {
  private worker: Worker | null = null;
  private eventHandlers: Map<string, Set<EventCallback>> = new Map();
  private isInitialized = false;
  private isConnected = false;

  initialize(url: string, token?: string) {
    if (this.isInitialized) {
      return;
    }

    try {
      this.worker = new Worker("/websocket.worker.js");

      this.worker.addEventListener("message", this.handleWorkerMessage);

      this.worker.addEventListener("error", (error) => {
        this.emit("error", { message: error.message });
      });

      const initPayload: InitPayload = { url, token };
      this.postToWorker({
        type: WorkerMessageType.INIT,
        payload: initPayload,
      });

      this.isInitialized = true;
    } catch (error) {
      throw error;
    }
  }

  connect() {
    if (!this.isInitialized) {
      return;
    }

    this.postToWorker({ type: WorkerMessageType.CONNECT });
  }

  disconnect() {
    if (!this.isInitialized) {
      return;
    }

    this.postToWorker({ type: WorkerMessageType.DISCONNECT });
    this.isConnected = false;
  }

  emit(event: SocketEvents | string, payload?: any) {
    if (!this.isInitialized) {
      return;
    }

    this.postToWorker({
      type: WorkerMessageType.EMIT,
      event,
      payload,
    });
  }

  on(event: string, callback: EventCallback) {
    if (!this.eventHandlers.has(event)) {
      this.eventHandlers.set(event, new Set());
    }

    this.eventHandlers.get(event)!.add(callback);

    // Возвращаем функцию отписки
    return () => {
      this.off(event, callback);
    };
  }

  /**
   * Отписаться от события
   */
  off(event: string, callback: EventCallback) {
    const handlers = this.eventHandlers.get(event);
    if (handlers) {
      handlers.delete(callback);
      if (handlers.size === 0) {
        this.eventHandlers.delete(event);
      }
    }
  }

  /**
   * Отписаться от всех событий
   */
  offAll(event?: string) {
    if (event) {
      this.eventHandlers.delete(event);
    } else {
      this.eventHandlers.clear();
    }
  }

  /**
   * Проверка подключения
   */
  get connected(): boolean {
    return this.isConnected;
  }

  /**
   * Уничтожить менеджер
   */
  destroy() {
    this.disconnect();

    if (this.worker) {
      this.worker.removeEventListener("message", this.handleWorkerMessage);
      this.worker.terminate();
      this.worker = null;
    }

    this.eventHandlers.clear();
    this.isInitialized = false;
    this.isConnected = false;
  }

  /**
   * Обработка сообщений от Worker
   */
  private handleWorkerMessage = (event: MessageEvent<WorkerMessage>) => {
    const { type, event: eventName, payload } = event.data;

    switch (type) {
      case WorkerMessageType.SOCKET_EVENT:
        if (eventName) {
          // Обновляем статус подключения
          if (eventName === "connect") {
            this.isConnected = true;
          } else if (eventName === "disconnect") {
            this.isConnected = false;
          }

          // Вызываем все обработчики для этого события
          this.triggerEvent(eventName, payload);
        }
        break;

      case WorkerMessageType.ERROR:
        this.triggerEvent("error", payload);
        break;

      default:
    }
  };

  private postToWorker(message: WorkerMessage) {
    if (!this.worker) {
      return;
    }

    this.worker.postMessage(message);
  }

  private triggerEvent(event: string, payload: any) {
    const handlers = this.eventHandlers.get(event);
    if (handlers) {
      handlers.forEach((callback) => {
        try {
          callback(payload);
        } catch (error) {}
      });
    }
  }
}

export const websocketManager = new WebSocketManager();
