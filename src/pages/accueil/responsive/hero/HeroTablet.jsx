import React from "react";
import image from '../../image/hero-accueil.png';
import iconia from "../../image/IAhellosoins.png";
import { CircleHelp, MapPin, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/Button";

const HeroTablet = () => {
  return (<>
<div className="bg-[#E1EEFF] mt-[10vh] w-full px-[5vh] flex flex-col h-[90vh] items-center justify-center">
         <h1 className="text-[5vw] text-center font-bold mb-4 text-black leading-tight">
          Trouvez  
          l’accompagnement  
          qui vous <span className="text-[#5DA781]">correspond.</span>
        </h1>
        <p className="text-[2vw] text-center text-gray-600 mb-[10vh]">
          Vous ne savez pas quelle pratique de médecine douce choisir{" "}
          <span className="text-helloSoin font-bold">HelloSoins</span> vous aide
          à trouver celle qui vous correspond, en fonction de ce que vous
          ressentez.
        </p>
        {/* ←– Formulaire de recherche –→ */}
                <form
                  className="w-full flex items-center justify-center bg-white border rounded py-3 px-3 text-xs"
                >
                  {/* Spécialité */}
                  <div className="flex items-center flex-1 h-full">
                    <select
                      className="w-full h-full bg-transparent outline-none
                                 text-[2vw] font-medium pl-[1vw]"
                    >
                      <option>Spécialité</option>
                      <option>Ostéopathie</option>
                      <option>Acupuncture</option>
                      <option>Hypnose</option>
                    </select>
                    
                  </div>
        
                  {/* Séparateur */}
                  <div className="h-[50%] w-[1px] bg-gray-300 mx-[1vw]" />
        
                  {/* Localisation */}
                  <div className="flex items-center flex-1 h-full">
                    <MapPin className="w-[1.2vw] h-[1.2vw] text-gray-500 mr-[0.8vw]" />
                    <input
                      type="text"
                      placeholder="Où êtes-vous ?"
                      className="w-full h-full bg-transparent outline-none
                                 text-[2vw] font-medium"
                    />
                  </div>
        
                  {/* Bouton */}
                  <Button className="bg-[#5DA781] text-white text-xs
                                     font-semibold px-[2vw] rounded">
                    Trouver mon praticien
                  </Button>
                </form>
<div className="flex items-center justify-center w-full text-white">
        <div className="flex w-3/4 my-10 bg-helloSoin  rounded-lg shadow-sm p-4">
          <div className="w-full">
            <div className="w-full flex items-start justify-start gap-2 font-bold text-sm">
              <CircleHelp />{" "}
              <div>
                Besoin d’aide pour choisir un praticien ? <br />
                <span className="font-normal text-sm">
                  Parlez à notre assistant
                </span>
              </div>
            </div>
            <div className="w-full flex items-center mt-2 justify-end gap-2 font-bold text-sm">
              <Button className="bg-white text-blue-gray-600 text-sm font-bold w-1/2">
                Démarrer la conversation
              </Button>{" "}
              <div className="h-[7vh] w-[10vw]">
                <img
                  src={iconia}
                  alt="iconIA"
                  className="w-full h-full"
                />
              </div>
            </div>
          </div>
        </div>
      </div>


</div>

  </>)
}
export default HeroTablet