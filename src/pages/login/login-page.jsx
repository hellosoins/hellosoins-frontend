import { useState } from "react";
import { LoginForm } from "@/components/common/login-form";
import CodeVerification from "@/components/common/CodeVerification";
import logo from "../../assets/hs2.svg";

export default function LoginPage() {
  // 1. Correct order: [state, setState]
  const [codeDeShow, setCodeDeShow] = useState(false);

  const handleCodeShow = () => setCodeDeShow(true);
  // 2. While codeDeShow is false, show the LoginForm
  if (!codeDeShow) {
    return (
      <div className="flex w-full min-h-svh flex-col items-center justify-center gap-6 bg-white">
        <div className="fixed top-0 w-full flex items-center justify-start bg-white z-50">
          <img src={logo} className="mt-2 px-4 w-[130px] h-[40px]" alt="Logo" />
        </div>
        <div className="w-full max-w-sm md:max-w-lg">
          {/* 3. Pass the handler, not its invocation */}
          <LoginForm showCode={handleCodeShow} />
        </div>
      </div>
    );
  }

  // 4. Once codeDeShow is true, show the CodeVerification screen
  return <CodeVerification />;
}
