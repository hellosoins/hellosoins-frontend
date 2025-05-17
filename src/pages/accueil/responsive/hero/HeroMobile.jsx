import React from "react";
import image from '../../image/hero-accueil.png';
import iconia from "../../image/IAhellosoins.png";
import { CircleHelp, MapPin, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/Button";

const HeroMobile = () => {
  return (<>
<div className="bg-[#E1EEFF] w-full px-[5vh] flex flex-col mt-[10vh] h-[90vh] items-center justify-center">
         <h1 className="text-3xl text-center font-bold mb-4 text-black leading-tight">
          Trouvez  
          l’accompagnement  
          qui vous <span className="text-[#5DA781]">correspond.</span>
        </h1>
        <p className="text-xs text-center text-gray-600 mb-[10vh]">
          Vous ne savez pas quelle pratique de médecine douce choisir{" "}
          <span className="text-helloSoin font-bold">HelloSoins</span> vous aide
          à trouver celle qui vous correspond, en fonction de ce que vous
          ressentez.
        </p>
         <form
      className="w-full flex flex-col items-center justify-center bg-white border rounded p-4 text-xs space-y-4"
    >
      {/* Spécialité */}
      <div className="w-full flex items-center h-full">
        <select
          className="w-full bg-transparent outline-none text-xs font-medium text-gray-500"
        >
          <option>Spécialité</option>
          <option>Ostéopathie</option>
          <option>Acupuncture</option>
          <option>Hypnose</option>
        </select>
      </div>

      {/* Séparateur horizontal */}
      <div className="w-full h-[1px] bg-gray-300" />

      {/* Localisation */}
      <div className="w-full flex items-center h-full text-xs">
        <MapPin className=" text-gray-500 mr-[0.8vw]" />
        <input
          type="text"
          placeholder="Où êtes-vous ?"
          className="w-full bg-transparent outline-none text-xs font-medium"
        />
      </div>

      {/* Bouton */}
      <Button className="bg-[#5DA781] text-white text-xs font-semibold px-[2vw] rounded">
        Trouver mon praticien
      </Button>
    </form>    <div className="w-full flex items-center mt-4 justify-end gap-2 font-bold text-sm">
              <Button className="bg-white text-blue-gray-600 text-sm font-bold w-1/2">
                Commencer
              </Button>{" "}
              <div className="h-[40px] w-[45px]">
                <img
                  src={iconia}
                  alt="iconIA"
                  className="w-full h-full"
                />
              </div>
            </div>



</div>

  </>)
}
export default HeroMobile