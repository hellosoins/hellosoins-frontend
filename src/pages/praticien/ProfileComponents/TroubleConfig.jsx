// TroubleConfig.jsx
import React, { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/Button";
import { ArrowLeftCircle, PlusCircle, Save, XCircle } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  fetchTroubleSolutions,
  saveTroubleApproche,
  updateTroubleApproche,
} from "@/services/trouble-solutions-services";
import { TailSpin } from "react-loader-spinner";
import { addToast } from "@heroui/react";
import { Listbox } from "@headlessui/react";
import { ChevronUpDownIcon } from "@heroicons/react/24/outline";

const TroubleConfig = (props) => {
  const queryClient = useQueryClient();
  const [troubles, setTroubles] = useState([]);
  const [specialties, setSpecialties] = useState([]);
  const [newSolutionSpecialty, setNewSolutionSpecialty] = useState(null);
  const [searchTerm, setSearchTerm] = useState(
    props.isUpdate && props.initialTrouble ? props.initialTrouble.name : ""
  );
  const [selectedTrouble, setSelectedTrouble] = useState(
    props.isUpdate && props.initialTrouble
      ? {
          ...props.initialTrouble,
          solutions: props.initialTrouble.solutions || [],
        }
      : null
  );
  // Pour gérer les solutions sur le dropdown
  const [avalaibleSoltion, setAvalaibleSolution] = useState(
    props.isUpdate && props.initialTrouble
      ? props.initialTrouble.solutions || []
      : null
  );
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [addSolutionChecked, setAddSolutionChecked] = useState(false);
  const [newSolution, setNewSolution] = useState("");
  const dropdownRef = useRef(null);
  const [isUpdate, setIsUpdate] = useState(props.isUpdate || false);

  // GESTION CHARGEMENT DESD DONNEES
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["trouble-solutions"],
    queryFn: fetchTroubleSolutions,
  });
  useEffect(() => {
    if (!data) return;

    // initialisation habituelle des specialties & troubles
    const mappedSpecialties = data.speciality.map((s) => ({
      id: s.id_speciality,
      name: s.designation,
    }));
    setSpecialties(mappedSpecialties);
    setTroubles(data.troubleSolutions);
    if (mappedSpecialties.length)
      setNewSolutionSpecialty(mappedSpecialties[0].id);

    // ⬅️ on ne touche pas cette partie, elle vient écraser si besoin à partir des données serveur
    if (isUpdate && props.initialTrouble) {
      const foundTrouble = data.troubleSolutions.find(
        (tr) => tr.id === props.initialTrouble.id
      );
      // // Filtrage des solutions du troubles
      // var choice = props.initialTrouble;
      // var filteredTrouble = [];
      // foundTrouble.solutions.forEach(foundSolution => {
      //   choice.solutions.forEach(choiceSolution => {
      //     if(foundSolution.solution == choiceSolution.id){
      //       filteredTrouble.push(foundSolution);
      //     }
      //   })
      // });
      // choice.solutions = filteredTrouble;
      const choice = { ...props.initialTrouble }; // Copie pour éviter la mutation
      const choiceSolutionIds = new Set(choice.solutions.map((s) => s.id));

      const filteredTrouble = foundTrouble.solutions.filter((fs) =>
        choiceSolutionIds.has(fs.solution)
      );
      // .filter((v, i, a) => a.findIndex(t => t.id === v.id) === i); // Déduplication

      const updatedChoice = {
        ...choice,
        solutions: filteredTrouble,
      };
      console.log({ title: "Tous", foundTrouble });
      console.log({ title: "Choix", updatedChoice });

      if (foundTrouble) {
        setSelectedTrouble(updatedChoice); // à modifier par les choix
        setAvalaibleSolution(foundTrouble.solutions);
        setSearchTerm(foundTrouble.name);
      }
    }
  }, [data, isUpdate, props.initialTrouble]);

  // fonction de retour
  const handleBack = () => {
    setIsUpdate(false);
    props.onBack();
  };

  // Filtrer les troubles (insensible à la casse)
  const filteredTroubles = troubles.filter((trouble) =>
    trouble.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // GESTION SUPPRESSION D'UN SOLUTION
  const handleDeleteSolution = (solutionToDelete) => {
    if (!selectedTrouble) return;
    const updatedSolutions = selectedTrouble.solutions.filter(
      (sol) => sol.name !== solutionToDelete.name
    );
    const updatedTroubles = troubles.map((trouble) => {
      if (trouble.id === selectedTrouble.id) {
        return { ...trouble, solutions: updatedSolutions };
      }
      return trouble;
    });
    // setTroubles(updatedTroubles);
    setSelectedTrouble({ ...selectedTrouble, solutions: updatedSolutions });
  };

  // GESTION AJOUT D'UN SOLUTION
  const handleAddSolution = () => {
    if (!selectedTrouble || newSolution.trim() === "") return;
    const newSol = {
      name: newSolution.trim(),
      specialty: newSolutionSpecialty,
    };
    const updatedSolutions = [...selectedTrouble.solutions, newSol];
    const updatedTroubles = troubles.map((trouble) => {
      if (trouble.id === selectedTrouble.id) {
        return { ...trouble, solutions: updatedSolutions };
      }
      return trouble;
    });
    setTroubles(updatedTroubles);
    setSelectedTrouble({ ...selectedTrouble, solutions: updatedSolutions });
    setNewSolution("");
    setNewSolutionSpecialty(specialties[0].id); // A REVERIFIER
  };

  // GESTION DE SELECTION DE SOLUTION
  // Fonction pour gérer la sélection/déselection des solutions
  const handleSolutionToggle = (e, solution) => {
    const isChecked = e.target.checked;
    setSelectedTrouble((prev) => ({
      ...prev,
      solutions: isChecked
        ? [...prev.solutions, solution]
        : prev.solutions.filter((s) => s.solution !== solution.solution),
    }));
  };

  // GESTION AJOUT DE NOUVEAU TROUBLE
  const useSaveTroubleApproche = () => {
    return useMutation({
      mutationFn: saveTroubleApproche,
      onSuccess: (data) => {
        console.log("Approches ajoutées avec succès :", data);
        queryClient.invalidateQueries(["praticien-approches"]);
        addToast({
          title: "Ajout réussie de la thérapie.",
          color: "success",
          duration: 3000,
        });
        props.onBack();
      },
      onError: (error) => {
        console.error("Erreur pendant l'ajout :", error);
        addToast({
          title: `Erreur lors d'insertion: ${error.response.data.error}`,
          color: "danger",
          duration: 5000,
        });
      },
    });
  };
  const {
    mutate: saveApproche,
    isSaveLoading,
    isSaveSuccess,
    isSaveError,
    saveError,
  } = useSaveTroubleApproche();
  const handleSubmitPraticienApproches = () => {
    saveApproche(selectedTrouble);
  };

  // GESTION UPDATE DE TROUBLE
  const useUpdateTroubleApproche = () => {
    return useMutation({
      mutationFn: updateTroubleApproche,
      onSuccess: (data) => {
        console.log("Approches ajoutées avec succès :", data);
        queryClient.invalidateQueries(["praticien-approches"]);
        addToast({
          title: "Mise a jour réussie de la thérapie.",
          color: "success",
          duration: 3000,
        });
        props.onBack();
      },
      onError: (error) => {
        console.error("Erreur pendant la mise a jour :", error);
        addToast({
          title: error.message,
          color: "danger",
          duration: 5000,
        });
      },
    });
  };
  const {
    mutate: updateApproche,
    isUpdateLoading,
    isUpdateSuccess,
    isUpdateError,
    UpdateError,
  } = useUpdateTroubleApproche();
  const handleUpdatePraticienApproches = () => {
    updateApproche(selectedTrouble);
  };

  const getSpecialtyName = (id) => {
    const spec = specialties.find((s) => s.id === id);
    return spec ? spec.name : "";
  };

  if (isLoading)
    return (
      <div className="p-4 text-center w-full flex items-center justify-center h-full">
        <TailSpin
          height="40"
          width="40"
          color="#4fa94d"
          ariaLabel="tail-spin-loading"
          radius="1"
          visible={true}
        />
      </div>
    );
  if (isError) return <div>Erreur : {error.message}</div>;

  return (
    <div className="mx-4 mb-9">
      <div className="flex items-center justify-between">
        <span className="text-sm font-semibold">
          <span className="text-[#5DA781] text-sm">
            {isUpdate ? (
              <>
                Mettre à jour vos Thérapies{" "}
                <span className="text-gray-700 font-normal text-xs"></span>
              </>
            ) : (
              "Ajouter vos Thérapies"
            )}
          </span>
        </span>
        <Button
          onClick={handleBack}
          className="text-xs font-semibold text-gray-700 bg-gray-200 rounded shadow-none hover:bg-gray-400 hover:text-gray-700"
        >
          <ArrowLeftCircle /> Retour
        </Button>
      </div>

      <div className="flex flex-col md:flex-row items-start justify-between w-full gap-4 mt-4 text-xs">
        {/* Colonne Troubles */}
        <div className="w-full md:w-1/2 px-4 ">
          <div className="w-full py-2 text-gray-700 border-b-2 border-gray-700">
            <span>Selectionner un trouble</span>
          </div>
          <div className="relative mt-2" ref={dropdownRef}>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setIsDropdownOpen(true);
              }}
              onFocus={() => setIsDropdownOpen(true)}
              placeholder="Rechercher un trouble..."
              className="w-full p-2 border border-gray-300 rounded"
            />
            {isDropdownOpen && filteredTroubles.length > 0 && (
              <ul className="absolute z-10 w-full mt-1 overflow-y-auto bg-white border border-gray-300 max-h-60">
                {filteredTroubles.map((trouble) => (
                  <li
                    key={trouble.id}
                    onClick={() => {
                      setSelectedTrouble(trouble);
                      setAvalaibleSolution(trouble.solutions);
                      setSearchTerm(trouble.name);
                      setIsDropdownOpen(false);
                      setAddSolutionChecked(false);
                    }}
                    className="p-2 cursor-pointer hover:bg-gray-100"
                  >
                    {trouble.name}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        {/* Colonne Solutions */}
        <div className="w-full md:w-1/2 px-4 ">
          <div className="w-full py-2 text-gray-700 border-b-2 border-gray-700">
            <span>Présentez vos solutions</span>
          </div>
          <div className="mt-2">
            {selectedTrouble ? (
              <>
                {/* Ajour de nouveau solution */}
                <div className="mt-4">
                  <label className="inline-flex items-center">
                    <input
                      type="checkbox"
                      checked={addSolutionChecked}
                      onChange={(e) => setAddSolutionChecked(e.target.checked)}
                      className="form-checkbox"
                    />
                    <span className="ml-2 text-sm">
                      Ajouter une nouvelle solution
                    </span>
                  </label>
                  {addSolutionChecked && (
                    <div className="flex flex-col gap-2 mt-2">
                      <input
                        type="text"
                        value={newSolution}
                        onChange={(e) => setNewSolution(e.target.value)}
                        placeholder="Nouvelle solution"
                        className="p-2 border border-gray-300 rounded"
                      />
                      <select
                        value={newSolutionSpecialty}
                        onChange={(e) =>
                          setNewSolutionSpecialty(parseInt(e.target.value))
                        }
                        className="p-2 border border-gray-300 rounded"
                      >
                        {specialties.map((spec) => (
                          <option key={spec.id} value={spec.id}>
                            {spec.name}
                          </option>
                        ))}
                      </select>
                      <Button
                        onClick={handleAddSolution}
                        className="text-xs font-semibold text-white bg-[#20273e] w-1/2 self-end rounded shadow-none hover:bg-blue-600"
                      >
                        <PlusCircle size={15} /> Ajouter
                      </Button>
                    </div>
                  )}
                </div>
                {/* Choix de solution existante */}
                <div className="flex flex-col gap-1">
                  <hr />
                  <div className="relative">
                    <Listbox value={selectedTrouble.solutions} multiple>
                      {({ open }) => (
                        <>
                          <Listbox.Button className="w-full p-2 border border-gray-300 rounded text-left flex justify-between items-center">
                            <span className="truncate">
                              {selectedTrouble.solutions.length > 0
                                ? `${selectedTrouble.solutions.length} solution(s) sélectionnée(s)`
                                : "Sélectionner des solutions"}
                            </span>
                            <ChevronUpDownIcon className="h-5 w-5 text-gray-400" />
                          </Listbox.Button>

                          <Listbox.Options className="absolute z-10 mt-1 w-full max-h-60 overflow-auto border border-gray-300 bg-white rounded-md shadow-lg">
                            {avalaibleSoltion.map((solution, index) => (
                              <Listbox.Option
                                key={index}
                                value={solution}
                                className={({ active }) =>
                                  `cursor-default select-none relative p-2 ${
                                    active ? "bg-[#5DA781]/10" : ""
                                  }`
                                }
                              >
                                {({ selected }) => (
                                  <label className="flex items-center gap-2 cursor-pointer">
                                    <input
                                      type="checkbox"
                                      checked={selected}
                                      onChange={(e) =>
                                        handleSolutionToggle(e, solution)
                                      }
                                      className="form-checkbox h-4 w-4 text-[#5DA781] rounded focus:ring-[#5DA781]"
                                    />
                                    <span className="flex-1">
                                      {solution.name}
                                      <span className="ml-2 text-xs text-gray-500">
                                        ({getSpecialtyName(solution.specialty)})
                                      </span>
                                    </span>
                                  </label>
                                )}
                              </Listbox.Option>
                            ))}
                          </Listbox.Options>
                        </>
                      )}
                    </Listbox>
                  </div>
                  {/* lISTES DES SELECTIONNEES */}
                  <ul className="list-disc list-inside">
                    {selectedTrouble.solutions.map((solution, index) => (
                      <li
                        key={index}
                        className="flex text-white font-bold items-center justify-between p-4 my-1 border rounded bg-[#5DA781]"
                      >
                        <span>
                          {solution.name}
                          <span className="ml-2 text-xs font-normal">
                            ({getSpecialtyName(solution.specialty)})
                          </span>
                        </span>
                        <button
                          onClick={() => handleDeleteSolution(solution)}
                          className="ml-2"
                        >
                          <XCircle size={15} color="white" />
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              </>
            ) : isUpdate ? (
              <p className="text-helloSoin">Vous êtes en modes edition ...</p>
            ) : (
              <p className="text-gray-500">
                Veuillez sélectionner un trouble pour voir et modifier ses
                solutions.
              </p>
            )}
          </div>
        </div>
      </div>
      <Button
        onClick={
          isUpdate
            ? handleUpdatePraticienApproches
            : handleSubmitPraticienApproches
        }
        className="mt-6 ml-4 text-xs font-bold text-white rounded shadow-none"
      >
        <Save size={15} /> {isUpdate ? "Modifier" : "Enregistrer"}
      </Button>
    </div>
  );
};

export default TroubleConfig;
