import React, { useState } from "react";
import { Button } from "@/components/ui/Button";
import {
  MapPinIcon,
  Building,
  PhoneCall,
  CalendarCheck,
  PlusCircle,
  PenSquare,
  CheckCircle,
  Calendar,
} from "lucide-react";
import { ToggleLeft, ToggleRight } from "lucide-react";
import CabinetForm from "./CabinetForm";
import GestionDesTarif from "./GestionDesTarif";

const Cabinets = () => {
  const [isActive, setIsActive] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [isTypeAppointment, setIsTypeAppointment] = useState(false)
  const [formData, setFormData] = useState({
    cabinetName: "",
    address: "",
    address2: "",
    phone: "",
    pmr: null,
    description: "",
    photos: [],
  });

  const handleToggle = () => setIsActive((prev) => !prev);
  const handleEditClick = () => setIsEditing(true);
  
  const handleCancel = () => {
    setIsEditing(false);
    setFormData({
      cabinetName: "",
      address: "",
      address2: "",
      phone: "",
      pmr: null,
      description: "",
      photos: [],
    });
  };

  const handleCancelType = () => {
    setIsTypeAppointment(false)
  }

   const handleSeeTypeAppointment = () => {
    setIsTypeAppointment(true)
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Enregistrement cabinet :", formData);
    setIsEditing(false);
  };

  return (
    <div>
      {isEditing ? (
        <CabinetForm
          formData={formData}
          setFormData={setFormData}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
        />
      )  : isTypeAppointment ? (
        <GestionDesTarif
          handleCancel={handleCancelType}
        />
      ) : (
        <div className="flex flex-col space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-orange-700">🚧 ( À rendre fonctionnel )</p>
            <Button
              variant="default"
              size="sm"
              className="text-xs bg-white text-gray-900 border border-gray-900 shadow-none"
              onClick={handleEditClick}
            >
              <PlusCircle className="mr-1" /> Ajouter un cabinet
            </Button>
          </div>
          <div
            className={`border rounded px-4 py-2 ${
              isActive ? "bg-white" : "bg-gray-100"
            }`}
          >
            <div className="my-2">
              <div className="flex flex-col mb-2 sm:mb-0 sm:flex-row items-start justify-between text-sm font-bold gap-2 ">
                <div className="flex items-center text-sm font-bold gap-2 ">
                                  <div onClick={handleToggle} className="cursor-pointer">
                  {isActive ? (
                    <ToggleRight size={35} color="#5DA781" />
                  ) : (
                    <ToggleLeft size={35} color="red" />
                  )}
                </div>
                <p className="text-gray-700">Cabinet Montmartre - Paris 18e</p>
                </div>
                <Button variant="default" onClick={handleEditClick} className='text-xs rounded shadow-none'>
                  <PenSquare className="mr-1" /> Modifier 
                </Button>
              </div>
              <div className="mt-1 text-xs text-gray-600">
                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-1">
                    <MapPinIcon size={18} /> 12 Rue des Abbesses, 75009 Paris
                  </div>
                  <div className="flex items-center gap-1">
                    <Building size={18} /> 2<sup>e</sup> étage, interphone 07
                  </div>
                  <div className="flex items-center gap-1">
                    <PhoneCall size={18} /> 01 45 67 89 10
                  </div>
                  <div className="flex items-center gap-1">
                    <CheckCircle size={18} /> <p>Acces PMR : <span className="text-green-400 font-bold">OUI</span></p>
                  </div>
                </div>
              </div>
            </div>

            <div className="mb-2">
              <p className="text-xs leading-relaxed text-gray-900">
                Adipiscing periaut ut labore exumdol do quis. Adipiscing et
                deserunt pretium est laborios consequat minim. Lorem cillum
                cupidatat irure do. Duis nisi est cupidatat eu labore et velit
                officia et deserunt consectetur cupidatat aliqua cillum ad sit
                voluptate.
              </p>
            </div>

            <div className="flex flex-col gap-4">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 w-full">
                <img
                  src="https://img.freepik.com/photos-gratuite/salle-travail-vide-medecins-bureau-technologie_482257-14017.jpg"
                  alt="Cabinet 1"
                  className="w-full h-auto rounded-md shadow-sm"
                />
                <img
                  src="https://img.freepik.com/photos-gratuite/cabinet-medical-moderne-vide-ayant-documents-maladie-table-equipee-mobilier-contemporain-lieu-travail-hospitalier-sans-personne-pret-pour-consultation-maladie-soutien-medical_482257-35871.jpg"
                  alt="Cabinet 2"
                  className="w-full h-auto rounded-md shadow-sm"
                />
                <img
                  src="https://img.freepik.com/photos-gratuite/personne-au-bureau-du-materiel-instruments-medicaux-pour-effectuer-visite-controle-patient-pour-soins-sante-armoire-vide-outils-pour-consulter-personnes-malades-espace-professionnel_482257-31975.jpg"
                  alt="Cabinet 3"
                  className="w-full h-auto rounded-md shadow-sm"
                />
              </div>
              <div className="flex flex-col sm:flex-row w-full items-start justify-start self-start gap-2">
                <Button variant="default" className="bg-[#3d7056] hover:bg-helloGray text-xs rounded">
                  <Calendar className="mr-1" /> Organiser l'agenda
                </Button>
                <Button variant="default" onClick={handleSeeTypeAppointment} className=" text-white bg-blue-gray-800 text-xs hover:bg-gray-800 rounded">
                  <CalendarCheck className="mr-1" /> Type de rendez-vous
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cabinets;