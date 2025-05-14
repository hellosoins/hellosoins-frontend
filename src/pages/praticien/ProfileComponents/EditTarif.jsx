import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/Button';
import { Save, Trash2, PlusCircle } from 'lucide-react';

export default function EditTarif({
  mode,          // 'add' or 'edit'
  existing,      // existing tarif object for 'edit', or undefined
  onClose,       // close form callback
  onSave,        // save callback
}) {
  const isEdit = mode === 'edit';

  const [speciality, setSpeciality] = useState('');
  const [color, setColor] = useState('#009688');
  const [services, setServices] = useState([]);
  const [lieux, setLieux] = useState([]);

  useEffect(() => {
    if (isEdit && existing) {
      setSpeciality(existing.speciality);
      setLieux(existing.lieux || []);
      const m = existing.color.match(/#?[0-9A-Fa-f]{6}/);
      setColor(m ? (m[0].startsWith('#') ? m[0] : `#${m[0]}`) : '#009688');
      setServices(
        Object.entries(existing.services).map(([type, { duree, tarif }]) => ({
          type,
          duree: parseInt(duree, 10) || '',
          tarif: parseInt(tarif, 10) || '',
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

  const handleServiceChange = (i, field, val) => {
    setServices(svcs =>
      svcs.map((s, idx) => (idx === i ? { ...s, [field]: val } : s))
    );
  };

  const addService = () => {
    setServices(s => [...s, { type: '', duree: '', tarif: '' }]);
  };

  const handleLieuxChange = e => {
    // split comma-separated values and trim
    const values = e.target.value.split(',').map(v => v.trim()).filter(v => v);
    setLieux(values);
  };

  const handleSubmit = e => {
    e.preventDefault();
    const payload = {
      id: isEdit ? existing.id : Date.now(),
      color: `bg-[${color}]`,
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
    <form onSubmit={handleSubmit} className="bg-white rounded p-4 text-xs">
      {/* Lieux (comma-separated) */}
      <label className="block mb-4">
        <span className="font-bold text-gray-700">
          Cabinet(s) (séparés par des virgules) <span className="text-red-400">*</span>
        </span>
        <input
          type="text"
          required
          className="mt-1 block w-full md:w-1/2 border rounded px-3 py-2"
          value={lieux.join(', ')}
          onChange={handleLieuxChange}
          placeholder="Ex: Cabinet Montmartre, Cabinet Bastille"
        />
      </label>

      {/* Spécialité */}
      <label className="block mb-4">
        <span className="font-bold text-gray-700">
          Spécialité <span className="text-red-400">*</span>
        </span>
        <input
          type="text"
          required
          className="mt-1 block w-full md:w-1/2 border rounded px-3 py-2"
          value={speciality}
          onChange={e => setSpeciality(e.target.value)}
          placeholder="Nom de la spécialité"
        />
      </label>

      {/* Services */}
      <div className="mb-4">
        <div className="flex justify-start items-start mb-2">
          <span className="font-bold text-gray-700">Types de consultation</span>
        </div>
        {services.map((svc, i) => (
          <div
            key={i}
            className="flex flex-col md:flex-row md:items-center w-full md:space-x-2 mb-4"
          >
            <div className="w-full md:w-40 text-gray-900 space-y-1">
              <label>Type <span className="text-red-400">*</span></label>
              <input
                type="text"
                required
                placeholder="Nom du type"
                className="w-full border rounded px-2 py-2"
                value={svc.type}
                onChange={e => handleServiceChange(i, 'type', e.target.value)}
              />
            </div>
            <div className="w-full md:w-1/3 text-gray-700 space-y-1">
              <label>Durée (min) <span className="text-red-400">*</span></label>
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
              <label>Tarif (€) <span className="text-red-400">*</span></label>
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
              onClick={() => setServices(s => s.filter((_, idx) => idx !== i))}
              className="bg-red-600 text-white mt-2 md:mt-0"
            >
              <Trash2 size={16} /> <span className="sm:hidden">Supprimer</span>
            </Button>
          </div>
        ))}
        <Button size="sm" onClick={addService} className="flex items-center bg-blue-gray-800 rounded shadow-none">
          <PlusCircle size={16} /> <span className="ml-1">Ajouter</span>
        </Button>
      </div>

      {/* Couleur */}
      <div className="mb-4 flex flex-col space-y-2 items-start">
        <span className="font-bold text-gray-700">Choisir une couleur</span>
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