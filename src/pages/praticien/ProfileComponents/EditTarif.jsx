import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/Button';
import { Save, Trash2 } from 'lucide-react';

const ALL_SPECIALITIES = [
  'Énergétique Traditionnelle Chinoise',
  'Réflexologie',
  'Hypnothérapie',
  'Tui Na',
  'Reiki',
];
const ALL_LIEUX = [
  'Cabinet Équilibre',
  'Cabinet Bien-Être',
  'Cabinet Montmartre',
  'Domicile',
];

export default function EditTarif({
  mode,          // 'add' ou 'edit'
  existing,      // l’objet tarif existant (pour 'edit'), ou undefined
  onClose,       // ferme le form
  onSave,        // callback (newTarif) pour add, ou (updatedTarif) pour edit
}) {
  const isEdit = mode === 'edit';

  const [speciality, setSpeciality] = useState('');
  const [lieux, setLieux] = useState([]);
  const [color, setColor] = useState('#009688');
  const [services, setServices] = useState([]);

  useEffect(() => {
    if (isEdit && existing) {
      setSpeciality(existing.speciality);
      setLieux(existing.lieux);
      const m = existing.color.match(/#?[0-9A-Fa-f]{6}/);
      setColor(m ? (m[0].startsWith('#') ? m[0] : `#${m[0]}`) : '#009688');
      setServices(
        Object.entries(existing.services).map(([type, { duree, tarif }]) => ({
          type,
          duree: parseInt(duree, 10),
          tarif: parseInt(tarif, 10),
        }))
      );
    }
    if (!isEdit) {
      setServices([
        'Premier RDV',
        'Suivi de RDV',
        'Urgences',
        'VAD (Visite à Domicile)',
      ].map(type => ({ type, duree: '', tarif: '' })));
    }
  }, [isEdit, existing]);

  const handleLieuxChange = e => {
    const { value, checked } = e.target;
    setLieux(prev =>
      checked ? [...prev, value] : prev.filter(l => l !== value)
    );
  };

  const handleServiceChange = (i, field, val) => {
    setServices(svcs =>
      svcs.map((s, idx) => (idx === i ? { ...s, [field]: val } : s))
    );
  };

  const handleSubmit = e => {
    e.preventDefault();
    const payload = {
      id: isEdit ? existing.id : Date.now(),
      colour: `bg-[${color}]`,
      speciality,
      lieux,
      services: services.reduce(
        (acc, { type, duree, tarif }) => ({
          ...acc,
          [type]: { duree: `${duree} min`, tarif: `${tarif} €` },
        }),
        {}
      ),
    };
    onSave(payload);
    onClose();
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white rounded p-4 text-xs"
    >
      {/* Spécialité */}
      <label className="block mb-4">
        <span className="font-bold text-gray-700">
          Spécialité <span className="text-red-400">*</span>
        </span>
        <select
          required
          className="mt-1 block w-full md:w-1/2 border rounded px-3 py-2"
          value={speciality}
          onChange={e => setSpeciality(e.target.value)}
        >
          <option value="">Sélectionner une spécialité</option>
          {ALL_SPECIALITIES.map(s => (
            <option key={s}>{s}</option>
          ))}
        </select>
      </label>

      {/* Lieux */}
      <fieldset className="mb-4">
        <legend className="font-bold text-gray-700 mb-2">
          Cabinet d'application
        </legend>
        <div className="flex flex-wrap gap-2">
          {ALL_LIEUX.map(l => (
            <label key={l} className="inline-flex items-center space-x-1">
              <input
                type="checkbox"
                value={l}
                checked={lieux.includes(l)}
                onChange={handleLieuxChange}
                className="mr-1"
              />
              <span>{l}</span>
            </label>
          ))}
        </div>
      </fieldset>

      {/* Services */}
      <div className="mb-4">
        <span className="font-bold text-gray-700 block mb-2">
          Types de consultation
        </span>
        {services.map((svc, i) => (
          <div
            key={svc.type}
            className="flex flex-col md:flex-row md:items-center w-full md:space-x-2 space-y-4 md:space-y-2 mb-2"
          >
            <span className="w-full md:w-40 font-bold text-gray-900">
              {svc.type}
            </span>
            <div className="w-full md:w-1/3 text-gray-700 space-y-1">
              <label>
                Durée <span className="text-red-400">*</span> (min)
              </label>
              <input
                type="number"
                placeholder="Durée (min)"
                required
                className="w-full border rounded px-2 py-2"
                value={svc.duree}
                onChange={e => handleServiceChange(i, 'duree', e.target.value)}
              />
            </div>
            <div className="w-full md:w-1/3 text-gray-700 space-y-1">
              <label>
                Tarif <span className="text-red-400">*</span> (€)
              </label>
              <input
                type="number"
                placeholder="Tarif (€)"
                required
                className="w-full border rounded px-2 py-2"
                value={svc.tarif}
                onChange={e => handleServiceChange(i, 'tarif', e.target.value)}
              />
            </div>
            <Button
              size="sm"
              onClick={() =>
                setServices(s => s.filter((_, idx) => idx !== i))
              }
              className="bg-red-600 text-white w-auto md:w-auto"
            >
              <Trash2 size={16} /> <span className='sm:hidden'>Supprimer</span>
            </Button>
          </div>
        ))}
      </div>

      {/* Couleur */}
      <div className="mb-4 flex flex-col">
        <span className="font-bold text-gray-700 mb-1">
          Choisir une couleur
        </span>
        <input
          type="color"
          className="w-12 h-12 border-none"
          value={color}
          onChange={e => setColor(e.target.value)}
        />
      </div>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row sm:space-x-2 space-y-2 sm:space-y-0">
        <Button type="submit" className="text-xs w-full sm:w-auto">
          <Save /> {isEdit ? 'Mettre à jour' : 'Enregistrer'}
        </Button>
        <Button variant="outline" onClick={onClose} className="w-full sm:w-auto">
          Annuler
        </Button>
      </div>
    </form>
  );
}
