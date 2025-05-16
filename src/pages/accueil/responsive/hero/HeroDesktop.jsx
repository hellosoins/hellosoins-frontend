import React from "react";
import image from '../../image/hero-accueil.png';
import iconia from "../../image/IAhellosoins.png";
import { CircleHelp, MapPin, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/Button";

const HeroDesktop = () => {
  return (
    <section className="bg-[#E1EEFF] relative flex flex-col lg:flex-row items-center min-h-screen px-[3vw]">
      {/* Left side: Title & Subtitle */}
      <div className="lg:w-1/2 py-[5vh] z-10">
        <h1 className="text-[3vw] font-bold mb-4 text-black leading-tight">
          Trouvez
          l’accompagnement
          qui vous <span className="text-[#5DA781]">correspond.</span>
        </h1>
        <p className="text-[1.2vw] text-gray-600 mb-[10vh]">
          Vous ne savez pas quelle pratique de médecine douce choisir{" "}
          <span className="text-helloSoin font-bold">HelloSoins</span> vous aide
          à trouver celle qui vous correspond, en fonction de ce que vous
          ressentez.
        </p>

        {/* ←– Formulaire de recherche –→ */}
        <form
          className="w-1/2 absolute bottom-[8vh] left-[3vw] right-[3vw]
                     flex items-center bg-white bg-opacity-90 backdrop-blur-sm
                     rounded-full border h-[8vh] px-[2vw] z-20"
        >
          {/* Spécialité */}
          <div className="flex items-center flex-1 h-full">
            <select
              className="w-full h-full bg-transparent outline-none
                         text-[1vw] font-medium pl-[1vw]"
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
                         text-[1vw] font-medium"
            />
          </div>

          {/* Bouton */}
          <Button className="bg-[#5DA781] text-white text-[1vw]
                             font-semibold h-[6vh] px-[2vw] rounded-full">
            Trouver mon praticien
          </Button>
        </form>
      </div>

      {/* Right side: Image Hero */}
      <div className="flex w-full items-center justify-end h-[90vh] mt-[10vh]">
        <img src={image} alt="Hero" className="h-full" />
      </div>

      {/* Bulle d'assistant IA (déjà présent) */}
      <div className="flex items-center justify-end absolute bottom-0 left-0 w-full text-white">
        <div className="flex w-[30vw] bg-helloSoin h-[20vh] mr-[3vw] mb-[2vh] rounded-lg shadow-sm p-4">
          <div className="w-full">
            <div className="w-full flex items-start justify-start gap-2 font-bold text-[1vw]">
              <CircleHelp />{" "}
              <div>
                Besoin d’aide pour choisir un praticien ? <br />
                <span className="font-normal text-[0.9vw]">
                  Parlez à notre assistant
                </span>
              </div>
            </div>
            <div className="w-full flex items-center mt-2 justify-end gap-2 font-bold text-sm">
              <Button className="bg-white text-blue-gray-600 text-[0.9vw] font-bold w-1/2">
                Démarrer la conversation
              </Button>{" "}
              <div className="h-[6vh] w-[4vw]">
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
    </section>
  );
};

export default HeroDesktop;
