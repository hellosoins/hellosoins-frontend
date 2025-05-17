import { useState, useEffect } from "react"; // Ajouter useEffect ici
import { LoginForm } from "@/components/common/login-form";
import CodeVerification from "@/components/common/CodeVerification";
import { Loader } from '@/components/ui/Loader';
import logo from "../../assets/hs2.svg";

export default function LoginPage() {
  const [codeDeShow, setCodeDeShow] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Corrigé : useEffect est maintenant importé
  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 3000);
    console.log("loading...")
    return () => clearTimeout(timer);
  }, []);

  const handleCodeShow = () => setCodeDeShow(true);

  if (isLoading) {
    return (
      <div className="fixed inset-0 bg-white flex items-center justify-center">
        <Loader />
      </div>
    );
  }

  if (!codeDeShow) {
    return (
      <div className="flex w-full min-h-svh flex-col items-center justify-center gap-6 bg-white">
        <div className="fixed top-0 w-full flex items-center justify-start bg-white z-50">
          <img src={logo} className="mt-2 px-4 w-[130px] h-[40px]" alt="Logo" />
        </div>
        <div className="w-full max-w-sm md:max-w-lg">
          <LoginForm showCode={handleCodeShow} />
        </div>
      </div>
    );
  }

  return <CodeVerification />;
}