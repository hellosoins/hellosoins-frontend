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
import EditTarif from "./EditTarif";


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
      ) : isTypeAppointment ? (
        <EditTarif
          onCancel={handleCancelType}
        />
      ) : (
        <div className="flex flex-col space-y-4">
          <div className="flex items-center justify-end">
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
            className={`border rounded px-4 py-2 ${isActive ? "bg-white" : "bg-gray-100"
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
                <div className="flex flex-col sm:flex-row gap-2">
                  <Button variant="default" className=" hover:bg-helloGray text-xs rounded shadow-none">
                    <Calendar className="mr-1" /> Consulter l'agenda
                  </Button>
                  <Button onClick={handleEditClick} className='text-xs rounded shadow-none bg-white text-[#3d7056] border-2 border-[#3d7056]'>
                    <PenSquare className="mr-1" /> Modifier le cabinet
                  </Button>
                </div>
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

            <div className="flex flex-col gap-4 border-b-2 pb-4">
              <div className="grid grid-cols-2 sm:grid-cols-6 gap-4 w-full">
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

            </div>
            <div className="w-full flex flex-col">
              <p className="my-2 text-gray-800 text-sm font-bold">Spécialité appliqués </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full text-xs">
                <div className="bg-[#BCE2D326] p-4 rounded-xl w-full">
                  {/* En‑tête */}
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded bg-[#E74C3C]" />
                      <h2 className="font-semibold text-gray-800">Hypnose</h2>
                    </div>
                    <PenSquare className="w-4 h-4 text-gray-500 cursor-pointer hover:text-gray-700" onClick={handleSeeTypeAppointment}/>
                  </div>

                  {/* Sous‑titre */}
                  <p className="text-gray-600 mb-2">Type de rendez-vous</p>

                  {/* Tableau des types de rendez-vous */}
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr>
                        <th className="pb-2 border-b border-gray-300 font-medium text-gray-700">Type</th>
                        <th className="pb-2 border-b border-gray-300 font-medium text-gray-700">Durée</th>
                        <th className="pb-2 border-b border-gray-300 font-medium text-gray-700">Tarif</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      <tr>
                        <td className="py-2 text-gray-800">Premier RDV</td>
                        <td className="py-2 text-gray-600">45 minutes</td>
                        <td className="py-2 font-medium text-gray-800">45 €</td>
                      </tr>
                      <tr>
                        <td className="py-2 text-gray-800">Suivi de RDV</td>
                        <td className="py-2 text-gray-600">25 minutes</td>
                        <td className="py-2 font-medium text-gray-800">30 €</td>
                      </tr>
                      <tr>
                        <td className="py-2 text-gray-800">Urgences</td>
                        <td className="py-2 text-gray-600">30 minutes</td>
                        <td className="py-2 font-medium text-gray-800">40 €</td>
                      </tr>
                      <tr>
                        <td className="py-2 text-gray-800">
                          VAD <span className="text-xs text-gray-500">(visio à domicile)</span>
                        </td>
                        <td className="py-2 text-gray-600">35 minutes</td>
                        <td className="py-2 font-medium text-gray-800">60 €</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

              </div>
              <div className="flex my-2 flex-col sm:flex-row w-full items-start justify-start self-start gap-2">

                <Button variant="default" onClick={handleSeeTypeAppointment} className=" text-gray-700 bg-white text-xs hover:bg-gray-100 border-2 border-gray-700 shadow-none rounded">
                  <PlusCircle className="mr-1" /> Ajouter une spécialité
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