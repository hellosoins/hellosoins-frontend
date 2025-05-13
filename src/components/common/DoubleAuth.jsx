import { useRef, useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/Button";
import logo from "../../assets/hs2.svg";
import { verifyValidationCode, sendValidationCode } from "@/services/api";
import { setLocalData } from '@/services/common-services'
const DoubleAuth = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { name, mail, numero, token } = location.state || {};

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm();
  
  const inputRefs = useRef([]);
  const [isLoading, setIsLoading] = useState(false);
  const [resendTimer, setResendTimer] = useState(0);
  const [errorMessage, setErrorMessage] = useState("");

  // Configuration du viewport mobile
  useEffect(() => {
    const viewport = document.querySelector("meta[name=viewport]");
    const contentValue = "width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no";
    viewport?.setAttribute("content", contentValue);
  }, []);


function formatNumero(numero) {
  // 1. On ne conserve que les chiffres
  const digits = numero.replace(/\D/g, "");
  
  // 2. On prend les 9 derniers chiffres
  const lastNine = digits.slice(-9);
  
  // 3. On préfixe d’un seul zéro
  const masked = "0" + lastNine;
  
  // 4. On groupe par paires et on joint avec un espace
  return masked.match(/.{1,2}/g)?.join(" ") ?? masked;
}


  // Gestion du timer pour le renvoi de code
  useEffect(() => {
    let interval;
    if (resendTimer > 0) {  
      interval = setInterval(() => {
        setResendTimer((prev) => (prev > 0 ? prev - 1 : 0));
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [resendTimer]);

  const onSubmit = async (data) => {
    try {
      setIsLoading(true);
      setErrorMessage("");
      const code = Object.values(data).join('');
      
      await verifyValidationCode({ 
        mail: mail, 
        code 
      });
      

      localStorage.setItem('authToken', token);
      
      navigate('/praticien/premierpas');
    } catch (error) {
      setErrorMessage(error.message || "Code invalide ou erreur de vérification");
    } finally {
      setIsLoading(false);
    }
  };

  const handleResend = async () => {
    if (resendTimer > 0) return;
    
    try {
      setIsLoading(true);
      await sendValidationCode({ 
        mail, 
        phone_number: numero, 
        name 
      });
      setResendTimer(600); // 10 minutes
    } catch (error) {
      setErrorMessage("Échec du renvoi du code - " + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInput = (e, index) => {
    const { value } = e.target;
    if (value.length > 1) return;
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  // Handle paste of full code
  const handlePaste = (e) => {
    e.preventDefault();
    const pasteData = e.clipboardData.getData('Text').trim();
    if (/^\d{6}$/.test(pasteData)) {
      pasteData.split('').forEach((digit, idx) => {
        const fieldName = `code${idx + 1}`;
        setValue(fieldName, digit);
        if (inputRefs.current[idx]) {
          inputRefs.current[idx].value = digit;
        }
      });
      // focus last input
      inputRefs.current[5]?.focus();
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <div className="fixed top-0 w-full flex items-center justify-start bg-white z-50">
        <img src={logo} className="mt-2 px-4 w-[130px] h-[40px]" alt="Logo" />
      </div>
      
      <div className="w-full max-w-md bg-white flex justify-center items-center flex-col rounded-md px-6 pt-4">
        <div className="text-center mb-4 w-full flex justify-center items-center">
  <div className="text-md mt-4 font-bold text-gray-900 mb-8">
     Vérification additionnelle requise
  </div>
</div>
<div className="text-sm mt-4 text-center font-medium text-gray-500 my-8 w-full">
  <p className="flex flex-col items-center justify-center gap-4 w-full">
    Veuillez saisir le code de validation envoyé à votre adresse mail 
    <span className="text-gray-500">
      <span className="underline text-[#5DA781]"> {mail} </span> 
      {/* et au numéro 
      <span className="underline text-[#5DA781]"> {formatNumero(numero)} </span>. */}
    </span>
  </p>
</div>


        {errorMessage && (
          <div className="text-red-500 text-sm mb-4">{errorMessage}</div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="w-full">
          <div
              className="flex space-x-2 justify-center"
              onPaste={handlePaste}
            >
              {[1, 2, 3, 4, 5, 6].map((item, index) => {
                const reg = register(`code${item}`, {
                  required: "Chiffre requis",
                  pattern: { value: /^[0-9]$/, message: "Doit être un chiffre" },
                });

                return (
                  <input
                    key={item}
                    type="text"
                    maxLength={1}
                    className="w-10 h-10 text-center border rounded"
                    name={reg.name}
                    onChange={(e) => {
                      reg.onChange(e);
                      handleInput(e, index);
                    }}
                    onBlur={reg.onBlur}
                    ref={(el) => {
                      reg.ref(el);
                      inputRefs.current[index] = el;
                    }}
                    placeholder="-"
                    disabled={isLoading}
                  />
                );
              })}
            </div>
          
          <div className="text-center">
            <button
              type="button"
              onClick={handleResend}
              className="underline text-xs text-gray-600 my-8"
              disabled={isLoading || resendTimer > 0}
            >
              {resendTimer > 0 
                ? `Nouvel envoi possible dans ${Math.floor(resendTimer/60)}:${resendTimer%60 < 10 ? '0' : ''}${resendTimer%60}`
                : "Renvoyer le code"}
            </button>
          </div>

          <Button
            type="submit"
            className="w-full bg-helloBlue hover:bg-helloBlue/90 text-white rounded-full"
            disabled={isLoading}
          >
            {isLoading ? "Vérification..." : "Valider le compte"}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default DoubleAuth;