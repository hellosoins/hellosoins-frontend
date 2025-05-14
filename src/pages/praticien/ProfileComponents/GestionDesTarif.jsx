import React, { useState, useMemo } from 'react';
import { Button } from '@/components/ui/Button';
import { Edit, PlusCircle, Trash2, ChevronDown, ChevronUp, ArrowLeft, InfoIcon, MoveLeft, ArrowBigDown } from 'lucide-react';
import EditTarif from './EditTarif';
import Badge from './NATUROPATHIE.png';

// Sample tariff data
const tarifData = [
  {
    id: 1,
    color: 'bg-green-500',
    speciality: 'Énergétique Traditionnelle Chinoise',
    lieux: ['Cabinet Montmartre'],
    services: {
      'Premier RDV': { duree: '45 min', tarif: '50 €' },
      'Suivi de RDV': { duree: '25 min', tarif: '30 €' },
      'Urgences': { duree: '45 min', tarif: '60 €' },
      'VAD (Visite à Domicile)': { duree: '30 min', tarif: '70 €' }
    }
  },
  // ... autres spécialisations
];

export default function GestionDesTarif({handleCancel}) {
  const [openId, setOpenId] = useState(null);
  const [selected, setSelected] = useState(null);
  const [mode, setMode] = useState({ type: 'list', id: null });
  const [data, setData] = useState(tarifData);

  // Extraire et dédupliquer tous les cabinets
  const allCabinets = useMemo(() => {
    return Array.from(new Set(data.flatMap(item => item.lieux)));
  }, [data]);

  const handleEdit = id => setMode({ type: 'edit', id });
  const handleAdd = () => setMode({ type: 'add', id: null });
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
      <p className="text-orange-700">🚧 ( À rendre fonctionnel )</p>

      {/* Desktop: one table per cabinet with header */}
      <div className="hidden md:block w-full overflow-x-auto space-y-8">
        {allCabinets.map(cab => {
          const items = data.filter(item => item.lieux.includes(cab));
          return (
            <div key={cab}>
              {/* Title for cabinet group */}
              <div className='w-full flex flex-col sm:flex-row items-start justify-between my-2'>
                <h2 className="text-sm   font-semibold text-gray-800 mb-2">{cab}</h2>
                <Button variant="outline" className="flex items-center text-xs border-2 border-gray-800" onClick={handleCancel}>
                  <ArrowLeft size={16} className="mr-1" />Retour
                </Button>
              </div>
              <table className="min-w-full table-auto border-collapse text-xs">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-2 text-start font-medium">Spécialité</th>
                    <th className="px-1 py-2 text-start font-medium">Type de RDV</th>
                    <th className="px-1 py-2 text-start font-medium">Durée</th>
                    <th className="px-1 py-2 text-start font-medium">Tarif</th>
                    <th className="px-4 py-2 text-start font-medium">Action</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {items.map(({ id, color, speciality, services }) => {
                    const types = Object.keys(services);
                    return (
                      <tr key={`${cab}-${id}`} onClick={() => setSelected({ cab, id, color, speciality, services })} className="hover:bg-gray-50 cursor-pointer">
                        {/* Spécialité + couleur */}
                        <td className="py-2 flex items-start">
                          <div className={`${color} rounded mr-2 w-3 h-3`} />
                          <span>{speciality}</span>
                        </td>
                        {/* RDV, durée, tarif */}
                        <td className="px-1 py-2 align-top text-start">
                          <div className="space-y-1">
                            {types.map(t => <div key={t}>{t}</div>)}
                          </div>
                        </td>
                        <td className="px-1 py-2 align-top text-start">
                          <div className="space-y-1">
                            {types.map(t => <div key={t}>{services[t].duree}</div>)}
                          </div>
                        </td>
                        <td className="px-1 py-2 align-top text-start">
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
            </div>
          );
        })}

        <div className="mt-4 flex gap-2 justify-start">
                    <Button variant="outline" className="flex items-center text-xs border-2 border-gray-800" onClick={handleAdd}>
            <PlusCircle size={16} className="mr-1" />Ajouter un tarif
          </Button>

        </div>
      </div>

      {/* Mobile: unchanged accordion */}
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
          <dd className='text-[#5DA781]'>{selected.lieux}</dd>
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
