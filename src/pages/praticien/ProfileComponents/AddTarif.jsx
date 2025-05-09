import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Trash2 } from 'lucide-react';

// types de RDV par défaut
const DEFAULT_SERVICES = [
  'Premier RDV',
  'Suivi de RDV',
  'Urgences',
  'VAD (Visite à Domicile)'
];

export default function AddTarif({ onClose, onSave }) {
  const [speciality, setSpeciality] = useState('');
  const [lieux, setLieux] = useState([]);
  const [color, setColor] = useState('#009688');
  const [services, setServices] = useState(
    DEFAULT_SERVICES.map(type => ({
      type,
      duree: '',
      tarif: '',
    }))
  );

  const handleLieuxChange = (e) => {
    const { value, checked } = e.target;
    setLieux(prev =>
      checked
        ? [...prev, value]
        : prev.filter(l => l !== value)
    );
  };

  const handleServiceChange = (index, field, value) => {
    setServices(s =>
      s.map((svc, i) =>
        i === index ? { ...svc, [field]: value } : svc
      )
    );
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newTarif = {
      id: Date.now(),
      color: `bg-[${color}]`,
      speciality,
      lieux,
      services: services.reduce(
        (acc, { type, duree, tarif }) => ({
          ...acc,
          [type]: { duree: duree + ' min', tarif: tarif + ' €' }
        }),
        {}
      )
    };
    onSave(newTarif);
    onClose();
  };

  return (
    <form className="max-w-2xl mx-auto p-6 bg-white rounded" onSubmit={handleSubmit}>
      <h2 className="text-xl font-semibold mb-4">Ajouter un tarif</h2>

      {/* Spécialité */}
      <label className="block mb-4">
        <span className="block font-medium">Spécialité</span>
        <select
          className="mt-1 block w-full border rounded px-3 py-2"
          value={speciality}
          onChange={e => setSpeciality(e.target.value)}
          required
        >
          <option value="">Sélectionner une spécialité</option>
          <option>Énergétique Traditionnelle Chinoise</option>
          <option>Réflexologie</option>
          <option>Hypnothérapie</option>
          <option>Tui Na</option>
          <option>Reiki</option>
        </select>
      </label>

      {/* Lieux */}
      <fieldset className="mb-4">
        <legend className="font-medium mb-2">Cabinet d'application</legend>
        {['Cabinet Équilibre', 'Cabinet Bien-Être', 'Cabinet Montmartre', 'Domicile'].map(l => (
          <label key={l} className="inline-flex items-center mr-4">
            <input
              type="checkbox"
              value={l}
              className="mr-1"
              onChange={handleLieuxChange}
            />
            {l}
          </label>
        ))}
      </fieldset>

      {/* Services */}
      <div className="mb-4">
        <span className="font-medium block mb-2">Types de consultation</span>
        {services.map((svc, i) => (
          <div key={svc.type} className="flex items-center space-x-2 mb-2">
            <span className="w-40">{svc.type}</span>
            <input
              type="number"
              placeholder="Durée (min)"
              className="w-24 border rounded px-2 py-1"
              value={svc.duree}
              onChange={e => handleServiceChange(i, 'duree', e.target.value)}
              required
            />
            <input
              type="number"
              placeholder="Tarif (€)"
              className="w-24 border rounded px-2 py-1"
              value={svc.tarif}
              onChange={e => handleServiceChange(i, 'tarif', e.target.value)}
              required
            />
            <Button
              variant="ghost"
              size="sm"
              onClick={() =>
                setServices(s => s.filter((_, idx) => idx !== i))
              }
            >
              <Trash2 size={16} />
            </Button>
          </div>
        ))}
      </div>

      {/* Couleur */}
      <label className="block mb-6">
        <span className="block font-medium">Couleur</span>
        <input
          type="color"
          className="mt-1"
          value={color}
          onChange={e => setColor(e.target.value)}
        />
      </label>

      {/* Actions */}
      <div className="flex space-x-2">
        <Button type="submit">Enregistrer</Button>
        <Button variant="outline" onClick={onClose}>Annuler</Button>
      </div>
    </form>
  );
}
