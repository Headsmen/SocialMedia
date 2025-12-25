import { useState } from "react";

export const useAuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);

  const toggleMode = () => setIsLogin(!isLogin);

  return {
    isLogin,
    toggleMode,
  };
};
