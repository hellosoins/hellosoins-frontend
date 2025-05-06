// TableList.jsx
import React, { useState } from 'react';
import { Edit, Trash, PlusCircle } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { useQuery } from '@tanstack/react-query';
import { getAllPraticienApproches } from '@/services/trouble-solutions-services';
import { TailSpin } from 'react-loader-spinner';

// Fonction pour regrouper les solutions par spécialité
const groupSolutionsBySpecialite = (solutions) => {
  const groupsObj = solutions.reduce((acc, solution) => {
    if (!acc[solution.specialite]) {
      acc[solution.specialite] = [];
    }
    acc[solution.specialite].push(solution);
    return acc;
  }, {});
  
  const order = [];
  solutions.forEach((solution) => {
    if (!order.includes(solution.specialite)) {
      order.push(solution.specialite);
    }
  });
  
  return order.map(specialite => ({
    specialite,
    solutions: groupsObj[specialite]
  }));
};

const TableList = (props) => {
  const { data: approches = [], isLoading: isLoadingSpecialities, isError: isErrorSpecialities } = useQuery({
    queryKey: ['praticien-approches'],
    queryFn: getAllPraticienApproches,
    staleTime: 1000 * 60 * 10,
  });
  
  // État pour gérer l'accordéon sur mobile
  const [expandedTroubleIds, setExpandedTroubleIds] = useState([]);

  const toggleTroubleExpansion = (id) => {
    setExpandedTroubleIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  // Construction des lignes pour le tableau (affichage grand écran)
  const rows = [];
  approches.forEach((category) => {
    // Calcul du nombre total de lignes pour la catégorie (pour gérer rowSpan)
    const totalRowsCategory = category.troubles.reduce(
      (acc, trouble) => acc + trouble.solutions.length,
      0
    );
    let categoryRendered = false;

    category.troubles.forEach((trouble) => {
      const specialiteGroups = groupSolutionsBySpecialite(trouble.solutions);
      const totalRowsTrouble = trouble.solutions.length;
      let troubleRendered = false;

      specialiteGroups.forEach((group) => {
        let groupRendered = false;
        group.solutions.forEach((solution, solIndex) => {
          rows.push(
            <tr
              key={`cat-${category.id}-trouble-${trouble.id}-specialite-${group.specialite}-sol-${solution.id}`}
              className="divide-y divide-gray-200"
            >
              {/* Colonne Catégorie */}
              {!categoryRendered && (
                <td rowSpan={totalRowsCategory} className="px-4 py-2 align-top border whitespace-nowrap">
                  {category.categorie}
                </td>
              )}
              {/* Colonne Trouble */}
              {!troubleRendered && (
                <td rowSpan={totalRowsTrouble} className="w-[200px] whitespace-normal px-4 py-2 border">
                  {trouble.name}
                </td>
              )}
              {/* Colonne Solution */}
              <td className="px-4 py-2 border whitespace-nowrap">
                {solution.name}
              </td>
              {/* Colonne Spécialité */}
              {!groupRendered && (
                <td rowSpan={group.solutions.length} className="px-4 py-2 align-top border whitespace-nowrap">
                  {group.specialite}
                </td>
              )}
              {/* Colonnes Durée, Tarif et Action (affichées une seule fois par Trouble) */}
              {!troubleRendered && solIndex === 0 && (
                <>
                  
                  <td rowSpan={totalRowsTrouble} className="px-4 py-2 align-top border whitespace-nowrap">
                    <button 
                      onClick={() => props.onEditTrouble(trouble)}
                      className="mr-2 text-blue-600 hover:text-blue-900" 
                      title="Modifier"
                    >
                      <Edit className="inline-block w-5 h-5" size={15} />
                    </button>
                    <button 
                      onClick={() => props.onDeleteTrouble(trouble)}
                      className="text-red-600 hover:text-red-900" 
                      title="Supprimer"
                    >
                      <Trash className="inline-block w-5 h-5" size={15} />
                    </button>
                  </td>
                </>
              )}
            </tr>
          );
          categoryRendered = true;
          troubleRendered = true;
          groupRendered = true;
        });
      });
    });
  });

  const handleDeleteTrouble = () => {
    alert('Test');
  }

  if (isLoadingSpecialities) return<div className="p-4 text-center w-full flex items-center justify-center h-full"><TailSpin
      height="40"
      width="40"
      color="#4fa94d"
      ariaLabel="tail-spin-loading"
      radius="1"
      visible={true}
  /></div>;

  const handleEditTrouble = (trouble) => {
    // Préparer les données complètes du trouble avec ses solutions
    const fullTroubleData = {
      ...trouble,
      solutions: trouble.solutions // Conserver les solutions existantes
    };
    props.onEditTrouble(fullTroubleData);
  };

  return (
    <>
      {/* Vue tableau pour grand écran */}
      <div className="hidden sm:block mb-4 overflow-x-auto">
        <table className="min-w-full table-fixed bg-white border border-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="w-1/7 px-4 py-2 text-xs font-medium text-left border-b">Catégorie</th>
              <th className="w-1/7 px-4 py-2 text-xs font-medium text-left border-b">Trouble</th>
              <th className="w-1/7 px-4 py-2 text-xs font-medium text-left border-b">Solution</th>
              <th className="w-1/7 px-4 py-2 text-xs font-medium text-left border-b">Spécialité</th>
              <th className="w-1/7 px-4 py-2 text-xs font-medium text-left border-b">Action</th>
            </tr>
          </thead>
          <tbody className="text-xs">
            {rows}
          </tbody>
        </table>
        <div className="flex items-center justify-start w-full mt-4">
          <Button 
            onClick={props.onAddTrouble} 
            className="inline-flex bg-white items-center px-4 py-2 text-xs font-bold text-[#0f2b3d] border-2 border-[#0f2b3d] rounded-sm hover:bg-[#14384f] hover:text-white"
          >
            <PlusCircle size={15} /> Ajouter une spécialité
          </Button>
        </div>
      </div>

      {/* Vue accordéon pour mobile */}
      <div className="block sm:hidden">
        {approches.map((category) => (
          <div key={category.id} className="mb-4 border rounded">
            <div className="bg-gray-100 px-4 py-2 font-bold">
              {category.categorie}
            </div>
            {category.troubles.map((trouble) => (
              <div key={trouble.id} className="border-t">
                <div 
                  className="flex justify-between items-center px-4 py-2 cursor-pointer" 
                  onClick={() => toggleTroubleExpansion(trouble.id)}
                >
                  <div>
                    <div className="font-semibold">{trouble.name}</div>
                    <div className="text-xs text-gray-600">
                      Durée : {trouble.duree} — Tarif : {trouble.tarif}
                    </div>
                  </div>
                  <div className="text-xl">
                    {expandedTroubleIds.includes(trouble.id) ? '−' : '+'}
                  </div>
                </div>
                {expandedTroubleIds.includes(trouble.id) && (
                  <div className="px-4 py-2">
                    {groupSolutionsBySpecialite(trouble.solutions).map((group) => (
                      <div key={group.specialite} className="mb-2">
                        <div className="text-sm font-bold">{group.specialite}</div>
                        <ul>
                          {group.solutions.map((solution) => (
                            <li key={solution.id} className="text-sm pl-4">
                              {solution.name}
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                    <div className="flex space-x-2 mt-2">
                    <button 
  onClick={() => handleEditTrouble(trouble)} // Utiliser la nouvelle fonction
  className="mr-2 text-blue-600 hover:text-blue-900" 
  title="Modifier"
>
  <Edit className="inline-block w-5 h-5" size={15} />
</button>
                      <button
                          className="text-red-600 hover:text-red-900"  
                          title="Supprimer"
                      >
                        <Trash className="inline-block w-5 h-5" size={15} />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        ))}
        <div className="flex items-center justify-start w-full mt-4">
          <Button 
            onClick={props.onAddTrouble} 
            className="inline-flex bg-white items-center px-4 py-2 text-xs font-bold text-[#0f2b3d] border-2 border-[#0f2b3d] rounded-sm hover:bg-[#14384f] hover:text-white"
          >
            <PlusCircle size={15} /> Ajouter une spécialité
          </Button>
        </div>
      </div>
    </>
  );
};

export default TableList;
