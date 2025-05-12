import React, { useState, useEffect } from 'react'
import { InfoIcon, MapPinHouse, Star, CreditCard } from 'lucide-react'
import { useQuery } from '@tanstack/react-query';
import { 
  getPraticienSpecialites,
  getPaymentMethods,
  getPatientTypes
} from '@/services/profile-service';
import { formatPhoneNumber } from 'react-phone-number-input'
import { formatNumero } from '@/services/api';

const Information = ({ practitionerData }) => {
  // États pour les données fetchées
  const [error, setError] = useState(null)

  const { 
    data: patientTypes = [], 
    isLoading: isLoadingPatients, 
    isError: isErrorPatients, 
    error: patientsError 
  } = useQuery({
    queryKey: ['patient-types'],
    queryFn: getPatientTypes,
  });
  
  const { 
    data: paymentMethods = [], 
    isLoading: isLoadingPayments, 
    isError: isErrorPayments, 
    error: paymentsError 
  } = useQuery({
    queryKey: ['payment-methods'],
    queryFn: getPaymentMethods,
  });

  const { 
    data: practSpecialities = [] , 
    isLoading: isLoadPractSpecialities, 
    isError: isErrPractSpecialities, 
    error: errPractSpecialities } = useQuery({
    queryKey: ['practicien-specialities'],
    queryFn: getPraticienSpecialites,
  });

  // Images de cabinet
  const cabinetImages = [
    "https://cdn.studiometa.fr/https://www.be-mydesk.com/img/cms/Cabinet%20m%C3%A9dical/Cab/17278.jpg?twic=v1/max=1680",
    "https://www.manohisoa-medical.com/wp-content/uploads/bfi_thumb/Slide-cabinet-medical-manohisoa-accueil-34ze9ftb74bqorb1ej0jy8.jpg",
    "https://media.istockphoto.com/id/1171739282/fr/photo/salle-dexamen-m%C3%A9dical.jpg?s=612x612&w=0&k=20&c=tu2X2NssRW_Xu8__973BZeSQsOiJnfR5rxvMB9qLXHQ="
  ]

  const formatPhoneNumber = phone => {
    if (!phone) return ''
    let cleaned = phone.replace(/\D/g, '')
    if (cleaned.startsWith('33')) cleaned = '0' + cleaned.slice(2)
    return cleaned.match(/.{1,2}/g)?.join(' ') || cleaned
  }

  const formatSIRET = siret => {
    if (!siret) return ''
    const cleaned = siret.replace(/\D/g, '')
    return cleaned.match(/.{1,3}/g)?.join(' ') || cleaned
  }

  if (error) {
    return <p className="text-red-500">{error}</p>
  }

  return (
    <div className="grid grid-cols-1 gap-4 mb-4 md:grid-cols-2">
      {/* Infos pro */}
      <div className="p-4 space-y-4 bg-white border rounded">
        <h2 className="flex items-center gap-2 mb-2 text-sm font-semibold text-[#5DA781]">
          <InfoIcon size={17} /> Informations professionnelles
        </h2>
        <div className="space-y-4 text-xs text-gray-700">
          <div className="flex  flex-col md:flex-row mb-1">
            <div className="w-full md:w-1/3 pr-2 font-semibold text-left">
              Description :
            </div>
            <div className="w-full md:w-2/3">
              {practitionerData.practitioner_info.profil_description}
            </div>
          </div>
          <div className="flex flex-col md:flex-row mb-1">
            <div className="w-full md:w-1/3 pr-2 font-semibold text-left">
              Civilité :
            </div>
            <div className="w-full md:w-2/3">
              {practitionerData.situation}
            </div>
          </div>
          <div className="flex flex-col md:flex-row mb-1">
            <div className="w-full md:w-1/3 pr-2 font-semibold text-left">
              Type de patient :
            </div>
            <div className="w-full md:w-2/3 overflow-hidden">
              {
              isLoadingPatients 
              ? (<span>Chargement...</span>) 
              : patientTypes.length > 0 
                ? (
                  <div className="flex flex-wrap gap-2">
                    {patientTypes.map((type, idx) => (
                      <span key={idx} className="px-2 py-1 bg-gray-100 rounded">
                        {type}
                      </span>
                    ))}
                  </div>) 
                : (isErrorPatients 
                  ? (<span className="text-xs text-red-500">{patientsError.message}</span>) 
                  : (<span className="text-xs text-gray-600">Aucun type de patient défini.</span>))
              }
            </div>
          </div>
          <div className="flex flex-col md:flex-row mb-1">
            <div className="w-full md:w-1/3 pr-2 font-semibold text-left">
              Téléphone :
            </div>
            <div className="w-full md:w-2/3">
              {formatNumero(practitionerData.mobile_number)}
            </div>
          </div>
          <div className="flex flex-col md:flex-row mb-1">
            <div className="w-full md:w-1/3 pr-2 font-semibold text-left">
              SIRET :
            </div>
            <div className="w-full md:w-2/3">
              {formatSIRET(practitionerData.practitioner_info.siret)}
            </div>
          </div>
        </div>
      </div>

      {/* Cabinet */}
      <div className="p-4 bg-white border rounded">
        <h2 className="flex items-center gap-2 mb-2 text-sm font-semibold text-[#5DA781]">
          <MapPinHouse size={17} /> Cabinet
        </h2>
        {cabinetImages.length > 1 ? (
          <div className="grid grid-cols-2 gap-2 mb-2">
            {cabinetImages.map((src, idx) => (
              <img
                key={idx}
                src={src}
                alt={`Cabinet ${idx + 1}`}
                className="object-cover w-full h-40 rounded"
              />
            ))}
          </div>
        ) : (
          <img
            src={cabinetImages[0]}
            alt="Cabinet"
            className="object-cover w-full h-40 mb-2 rounded"
          />
        )}
        <p className="text-xs text-gray-600">
          Votre cabinet peut être décrit ici : son ambiance, son équipement, sa localisation, etc.
        </p>
      </div>

      {/* Spécialités */}
      <div className="p-4 bg-white border rounded overflow-y-auto max-h-70">
        <table className="w-full text-xs">
          <thead className="bg-gray-200">
            <tr>
              <th className="px-2 py-1 text-left text-[#5DA781]">Spécialité</th>
              <th className="px-2 py-1 text-left text-[#5DA781]">Durée</th>
              <th className="px-2 py-1 text-left text-[#5DA781]">Tarif</th>
            </tr>
          </thead>
          <tbody>
            {isLoadPractSpecialities 
            ? (<p className="text-xs text-gray-600">Chargement des spécialités...</p>)
            : (!isErrPractSpecialities 
                ? (practSpecialities.length > 0 
                    ? (practSpecialities.map((spec, i) => (
                      <tr key={i} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-100'}>
                        <td className="px-2 py-3 text-gray-700">{spec.speciality.designation}</td>
                        <td className="px-2 py-1">-</td>
                        <td className="px-2 py-1">-</td>
                      </tr>
                    ))) 
                    : (<p className="text-xs text-gray-600">Aucun spécialité défini.</p>))
                : (<p className="text-xs text-red-500">{errPractSpecialities.message}</p>)
            )}
          </tbody>
        </table>
      </div>

      {/* Moyens de paiement */}
      <div className="bg-white ">
        <div className='rounded border p-4'>
        <h2 className="flex items-center gap-2 mb-2 text-sm font-semibold text-[#5DA781]">
          <CreditCard size={17} /> Moyens de paiement
        </h2>
        {
        isLoadingPayments 
        ? (<p>Chargement de vos modes de paiement...</p>) 
        : paymentMethods.length > 0 
          ? (<ul className="space-y-1 text-xs text-gray-700">
              {paymentMethods.map((moyen, idx) => (
                <li key={idx} className="flex items-center">
                  <span className="inline-block w-2 h-2 mr-2 bg-[#405969] rounded-full" />
                  {moyen}
                </li>
              ))}
            </ul>) 
          : (isErrorPayments
            ? (<p className="text-xs text-red-500">{paymentsError.message}</p>)
            : (<p className="text-xs text-gray-600">Aucun moyen de paiement défini.</p>))
        }
        </div>

        {/* Note et avis */}
        <div className="flex flex-col items-center mt-2 md:flex-row md:items-start border rounded p-4">
          <div className="flex flex-col items-start">
            <div className="flex items-center space-x-1">
              <span className="text-xl font-semibold text-gray-800">4.4/5</span>
              <div className="flex">
                {[...Array(4)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 text-yellow-400" fill="currentColor" />
                ))}
                <Star className="w-4 h-4 text-gray-300" />
              </div>
            </div>
            <p className="text-xs text-gray-600">120 avis</p>
          </div>
          <div className="flex-1 mt-4 md:mt-0 md:ml-6 space-y-2">
            {[5, 4, 3, 2, 1].map((rate, i) => (
              <div key={rate} className="flex items-center text-xs">
                <span className="w-6">{rate}</span>
                <div className="flex-1 h-2 mx-2 bg-gray-200 rounded-full">
                  <div
                    className="h-full bg-yellow-400 rounded-full"
                    style={{ width: `${[60, 20, 10, 5, 5][i]}%` }}
                  />
                </div>
                <span className="w-8 text-right">{[72, 24, 12, 6, 6][i]}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Information
