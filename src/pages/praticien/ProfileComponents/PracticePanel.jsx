import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { ChevronRight } from 'lucide-react';
import BadgeImg from './NATUROPATHIE.png';
import EditTarif from './EditTarif';

// Exemple de données de pratiques
const practices = [
  {
    id: 1,
    title: 'Acupuncture',
    cabinets: ['Cabinet Équilibre', 'Cabinet Montmartre'],
    badge: BadgeImg,
    color: 'bg-red-500'
  },
  {
    id: 2,
    title: 'Naturopathie',
    cabinets: ['Cabinet Bien-Être', 'À domicile'],
    badge: BadgeImg,
    color: 'bg-green-500'
  },
  {
    id: 3,
    title: 'Ostéopathie',
    cabinets: ['Cabinet Bien-Être'],
    badge: BadgeImg,
    color: 'bg-blue-500'
  },
  {
    id: 4,
    title: 'Thérapeute',
    cabinets: ['À domicile'],
    badge: BadgeImg,
    color: 'bg-yellow-500'
  }
];

// Collecte tous les cabinets uniques
const allCabinets = Array.from(new Set(practices.flatMap(p => p.cabinets)));

export default function PracticePanel() {
  const [selectedId, setSelectedId] = useState(practices[0].id);
  const [selectionMap, setSelectionMap] = useState({});
  const [isEditing, setIsEditing] = useState(false); // 👈 Nouveau state

  const selected = practices.find(p => p.id === selectedId) || practices[0];

  const toggleCabinet = cabinet => {
    setSelectionMap(prev => {
      const current = prev[selectedId] || [];
      const updated = current.includes(cabinet)
        ? current.filter(c => c !== cabinet)
        : [...current, cabinet];
      return { ...prev, [selectedId]: updated };
    });
  };

  return (<>
  {!isEditing && (
  <div className="flex flex-col md:flex-row w-full gap-6">
      {/* Liste des pratiques */}
      <div className="space-y-2 md:w-1/2 border p-4 rounded">
        <h2 className="text-sm font-semibold">Liste des pratiques</h2>
        <p className="text-xs text-muted-foreground">
          Gérez facilement vos spécialités et proposez des services adaptés aux besoins de vos patients.
        </p>
        <div className="space-y-2">
          {practices.map(p => (
            <div
              key={p.id}
              onClick={() => {
                setSelectedId(p.id);
                setIsEditing(false); // 👈 Réinitialise la vue détail
              }}
              className={`cursor-pointer border border-gray-400 rounded text-xs p-4 flex items-center justify-between ${p.id === selectedId ? 'ring-2 ring-indigo-500' : ''}`}
            >
              <div className="flex items-center space-x-3">
                <div className={`${p.color} w-4 h-4 rounded`} />
                <div>
                  <div className="font-medium">{p.title}</div>
                  <div className="text-xs text-gray-800">
                    {p.cabinets.join(', ')}
                  </div>
                </div>
              </div>
              <Button variant="outline" size="sm" className="flex items-center">
                <span className="hidden md:inline">Voir Détail</span>
                <ChevronRight />
              </Button>
            </div>
          ))}
        </div>
      </div>

      {/* Détail */}
      <aside className="md:w-1/2 border p-4 rounded text-xs bg-white">
        <div className="space-y-2">
          <div className="flex items-center space-x-4">
            <div className={`${selected.color} w-10 h-10 rounded`} />
            <div>
              <div className="text-sm font-bold">{selected.title}</div>
            </div>
            <img src={selected.badge} alt="badge" className="w-10 h-10 rounded self-end" />
          </div>

          
            <>
              {/* Description */}
              <div>
                <h3 className="font-semibold">Description</h3>
                <p className="text-xs text-muted-foreground">
                  La {selected.title.toLowerCase()} est une approche holistique visant à préserver et renforcer la santé grâce à des méthodes naturelles...
                </p>
              </div>

              {/* Cabinets */}
              <div>
                <h3 className="font-semibold">Cabinets disponibles</h3>
                <div className="flex flex-col space-y-2 mt-2">
                  {allCabinets.map(cabinet => (
                    <label key={cabinet} className="flex items-center space-x-2">
                      <Checkbox
                        checked={(selectionMap[selectedId] || []).includes(cabinet)}
                        onCheckedChange={() => toggleCabinet(cabinet)}
                        size={2}
                      />
                      <span className="text-xs">{cabinet}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Tableau des RDV */}
              <table className="w-full text-left border-collapse mt-4">
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

              {/* Gérer bouton */}
              <div className="mt-4">
                <Button variant="outline" size="sm" onClick={() => setIsEditing(true)}>
                  Gérer le type de RDV
                </Button>
              </div>
            </>
         

         
        </div>
      </aside>
       
    </div>
     )}
    {isEditing && (
            <>
              <EditTarif practice={selected} onCancel={() => setIsEditing(false)}/>
             
            </>
          )}
  </>
    
  );
}
