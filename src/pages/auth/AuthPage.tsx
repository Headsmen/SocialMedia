import { LoginWidget } from "@/widgets/auth-login";
import { RegisterWidget } from "@/widgets/auth-register";
import { useAuthPage } from "./model/useAuthPage";

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
