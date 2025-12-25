import { LoginWidget, RegisterWidget } from "@/widgets/auth";
import { useAuthPage } from "./useAuthPage";

export function AuthPage() {
  const { isLogin, toggleMode } = useAuthPage();

  return (
    <div>
      {isLogin ? (
        <LoginWidget onToggleMode={toggleMode} />
      ) : (
        <RegisterWidget onToggleMode={toggleMode} />
      )}
    </div>
  );
}
