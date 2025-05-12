import React, { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Edit, PlusCircle, Trash2, ChevronDown, ChevronUp, ArrowLeft, InfoIcon } from 'lucide-react';
import EditTarif from './EditTarif';
import Badge from './NATUROPATHIE.png'
import { InformationCircleIcon } from '@heroicons/react/24/outline';
const tarifData = [
  {
    id: 1,
    color: 'bg-green-500',
    speciality: 'Énergétique Traditionnelle Chinoise',
    lieux: ['Cabinet Montmartre', 'Cabinet Équilibre'],
    services: {
      'Premier RDV': { duree: '45 min', tarif: '50 €' },
      'Suivi de RDV': { duree: '25 min', tarif: '30 €' },
      'Urgences':     { duree: '45 min', tarif: '60 €' },
      'VAD (Visite à Domicile)': { duree: '30 min', tarif: '70 €' }
    }
  },
  {
    id: 2,
    color: 'bg-blue-500',
    speciality: 'Réflexologie',
    lieux: ['Cabinet Montmartre', 'Domicile'],
    services: {
      'Premier RDV': { duree: '45 min', tarif: '45 €' },
      'Suivi de RDV': { duree: '25 min', tarif: '25 €' },
      'Urgences':     { duree: '45 min', tarif: '45 €' },
      'VAD (Visite à Domicile)': { duree: '30 min', tarif: '75 €' }
    }
  },
  {
    id: 3,
    color: 'bg-purple-500',
    speciality: 'Hypnothérapie',
    lieux: ['Cabinet Équilibre'],
    services: {
      'Premier RDV': { duree: '45 min', tarif: '45 €' },
      'Suivi de RDV': { duree: '25 min', tarif: '40 €' },
      'VAD (Visite à Domicile)': { duree: '30 min', tarif: '60 €' },
      'Urgences':     { duree: '45 min', tarif: '50 €' }
    }
  },
];

export default function GestionDesTarif() {
  const [openId, setOpenId] = useState(null);
  const [selected, setSelected] = useState(null);
  const [mode, setMode] = useState({ type: 'list', id: null });
  const [data, setData] = useState(tarifData);

  const handleEdit  = id => setMode({ type: 'edit', id });
  const handleAdd   = () => setMode({ type: 'add', id: null });
  const handleClose = () => setMode({ type: 'list', id: null });

  const toggle = id => setOpenId(openId === id ? null : id);

  const handleSave = newOrUpdated => {
    setData(d =>
      mode.type === 'add'
        ? [...d, newOrUpdated]
        : d.map(t => (t.id === newOrUpdated.id ? newOrUpdated : t))
    );
    handleClose();
  };

  // Mode ajout/édition
  if (mode.type !== 'list') {
    const existing = data.find(t => t.id === mode.id);
    return (
      <EditTarif
        mode={mode.type}
        existing={existing}
        onClose={handleClose}
        onSave={handleSave}
      />
    );
  }

  return (
    <>
      {/* Desktop et mobile : table (overflow-x masqué) */}
      <div className="hidden md:block w-full overflow-x-hidden">
        <table className="min-w-full table-auto border-collapse text-xs">
          <thead className="bg-gray-50">
            <tr>
              <th className="w-1/6 px-4 py-2 text-start font-medium">Spécialités</th>
              <th className="w-1/6 px-4 py-2 text-start font-medium">Lieu de pratique</th>
              <th className="w-1/3 px-4 py-2 text-start font-medium">Type de RDV</th>
              <th className="w-1/6 px-4 py-2 text-start font-medium">Durée</th>
              <th className="w-1/6 px-4 py-2 text-start font-medium">Tarif</th>
              <th className="px-4 py-2 text-start font-medium">Action</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {data.map(({ id, color, speciality, lieux, services }) => {
              const types = Object.keys(services);
              return (
                <tr
                  key={id}
                  className={`hover:bg-gray-50 text-gray-700 cursor-pointer ${
                    selected?.id === id ? 'bg-gray-100' : ''
                  }`}
                  onClick={() => setSelected({ id, color, speciality, lieux, services })}
                >
                  <td className="py-2 flex items-start">
                    <div className={`${color} rounded mr-2`}><p className="text-transparent">cc</p></div>
                    <span>{speciality}</span>
                  </td>
                  <td className="px-4 py-2 align-top text-start">{lieux.join(', ')}</td>
                  <td className="px-4 py-2 align-top text-start">
                    <div className="space-y-1">
                      {types.map(t => <div key={t}>{t}</div>)}
                    </div>
                  </td>
                  <td className="px-4 py-2 align-top text-start">
                    <div className="space-y-1">
                      {types.map(t => <div key={t}>{services[t].duree}</div>)}
                    </div>
                  </td>
                  <td className="px-4 py-2 align-top text-start">
                    <div className="space-y-1">
                      {types.map(t => <div key={t}>{services[t].tarif}</div>)}
                    </div>
                  </td>
                  <td className="px-4 py-2 align-top text-start">
                    <div className="flex space-x-2">
                      <Button variant="ghost" className="flex items-center" onClick={() => handleEdit(id)}>
                        <Edit size={16} className="mr-1" />
                      </Button>
                      <Button variant="ghost" className="flex items-center text-red-500">
                        <Trash2 size={16} className="mr-1" />
                      </Button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        <div className="mt-4 flex justify-start">
          <Button variant="outline" className="flex items-center text-xs border-2 border-gray-800" onClick={handleAdd}>
            <PlusCircle size={16} className="mr-1" />Ajouter une spécialité
          </Button>
        </div>
      </div>

      {/* Mobile : accordéon */}
      <div className="md:hidden space-y-4 mt-6">
        {data.map(({ id, color, speciality, lieux, services }) => {
          const types = Object.keys(services);
          const isOpen = openId === id;
          return (
            <div key={id} className="border rounded-lg overflow-hidden">
              <button
                onClick={() => toggle(id)}
                className="w-full flex justify-between items-center px-4 py-3 bg-gray-100"
              >
                <div className="flex items-center">
                  <div className={`${color} rounded mr-2 w-3 h-3`} />
                  <span className="font-medium">{speciality}</span>
                </div>
                {isOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
              </button>
              {isOpen && (
                <div className="px-4 py-2 bg-white space-y-2">
                  <div>
                    <strong>Lieu(s) :</strong> {lieux.join(', ')}
                  </div>
                  <div className="space-y-1">
                    {types.map(t => (
                      <div key={t} className="flex justify-between">
                        <span>{t}</span>
                        <span>{services[t].duree} / {services[t].tarif}</span>
                      </div>
                    ))}
                  </div>
                  <div className="flex space-x-2 pt-2">
                    <Button variant="ghost" className="flex items-center" onClick={() => handleEdit(id)}>
                      <Edit size={16} className="mr-1" />Modifier
                    </Button>
                    <Button variant="ghost" className="flex items-center text-red-500">
                      <Trash2 size={16} className="mr-1" />Supprimer
                    </Button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Overlay Sidebar (survole tout) */}
      {selected && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-40"
            onClick={() => setSelected(null)}
          />
          {/* Sidebar */}
          <aside className="fixed top-0 right-0 h-full w-11/12 xs:w-2/3 md:w-1/3 bg-white shadow-xl z-50 p-6 overflow-y-auto">
      
      {/* En-tête : icône couleur + titre + badge + bouton modifier */}
      <div className="w-full">
        <div className="w-full flex items-center justify-between mb-4">
          <div className='flex items-center justify-start gap-3'>
          <div className={`${selected.color} w-12 h-12 rounded`} />
          <div>
            {/* Titre + sous-titre “Cabinet” */}
            <h2 className="text-xs font-semibold text-gray-800">{selected.speciality}</h2>
            <span className="inline-block mt-1 bg-gray-100 text-gray-600 text-xs py-1 px-2 rounded-full">
              Cabinet
            </span>
          </div>
          </div>
                        {/* Badge de certification */}
          <div className="w-12 h-12">
            <img
              src={Badge}
              alt="Badge certifié HelloSoins"
              className="w-full h-full object-contain"
            />
          </div>

        </div>
      </div>



      {/* Détail de la pratique */}
      <h3 className="text-sm font-bold text-gray-900 mb-4">Détail de la spécialité</h3>
      <dl className="grid grid-cols-1 gap-y-2 text-xs text-gray-600">
        <div className="flex justify-start space-x-3">
          <dt className="font-medium">Spécialité :</dt>
          <dd>{selected.speciality}</dd>
        </div>
        <div className="flex justify-start space-x-3">
          <dt className="font-medium">Lieu de pratique :</dt>
          <dd className='text-[#5DA781]'>{selected.lieux.join(' | ')}</dd>
        </div>
      </dl>

      {/* Tableau des types de RDV */}
      <table className="w-full mt-6 text-xs border-collapse">
        <thead>
          <tr className="border-b">
            <th className="py-2 text-left font-medium">Type de consultation</th>
            <th className="py-2 text-left font-medium">Durée</th>
            <th className="py-2 text-left font-medium">Tarif</th>
          </tr>
        </thead>
        <tbody className="divide-y">
          {Object.entries(selected.services).map(([type, { duree, tarif }]) => (
            <tr key={type}>
              <td className="py-2">{type}</td>
              <td className="py-2">{duree}</td>
              <td className="py-2">{tarif}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Actions en bas
      <div className="flex items-center justify-start gap-2 mt-4 ">
        <Button  className="justify-center text-xs shadow-none rounded" onClick={() => handleEdit(selected.id)}>
          <Edit size={16} className="mr-1" />Modifier
        </Button>
        <Button  className="justify-center bg-red-500 text-xs shadow-none rounded">
          <Trash2 size={16} className="mr-1" />Supprimer
        </Button>
      </div> */}
      <Button variant="outline" className="text-xs mt-4 shadow-none rounded border-2" onClick={() => setSelected(null)}>
          <ArrowLeft/> Retour
      </Button>

      <div className='w-full my-4 flex items-start gap-2 justify-start'>
       <InfoIcon className='text-gray-700'/> <p className='text-xs text-gray-700'>Si vous n’êtes pas encore certifié, veuillez poursuivre votre <a href="" className='underline text-[#5DA781]'>demande de certification ici</a></p>
      </div>
    </aside>
        </>
      )}
    </>
  );
}
