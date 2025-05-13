import React, { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/Button";
import { Controller, useForm } from "react-hook-form";
import { useNavigate, useLocation } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/Avatar";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/Dialog";
import { 
  ArrowLeftCircle,
  Linkedin,
  Facebook,
  Save,
  WandSparkles
} from "lucide-react";
import { API_URL } from "@/services/api";
import axios from "axios";
import svg from "./image.svg";
import PhoneManager from "@/components/common/phone-manager";

const MANDATORY_FIELDS = 15;

const CompleteProfile = () => {

  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const location = useLocation();
  const initialImgFile = location.state?.imgFile || null;

  const {
    control,
    register,
    handleSubmit,
    watch,
    formState: { errors: formErr },
    trigger,
    setValue,
  } = useForm();

  // États pour les champs du formulaire et les erreurs
  const [initialData, setInitialData] = useState(null);
  const [imgFile] = useState(initialImgFile);
  const [profilePic, setProfilePic] = useState(initialImgFile);
  const [profilPhotoFile, setProfilPhotoFile] = useState(null);
  const [civilite, setCivilite] = useState("Monsieur");
  const [nom, setNom] = useState("");
  const [prenom, setPrenom] = useState("");
  const [dateNaissance, setDateNaissance] = useState("");
  const [email, setEmail] = useState("");
  const [telephone, setTelephone] = useState("");
  const [mobile, setMobile] = useState("");
  const [adresse, setAdresse] = useState("");
  const [codePostal, setCodePostal] = useState("");
  const [ville, setVille] = useState("");
  const [siret, setSiret] = useState("");
  const [siren, setSiren] = useState("");
  const [linkedinLink, setLinkedinLink] = useState("");
  const [facebookLink, setFacebookLink] = useState("");
  const [consultationTypes, setConsultationTypes] = useState([]);
  const [description, setDescription] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [targetDescription, setTargetDescription] = useState("");
  const typingIntervalRef = useRef(null);
  // Liste des options { id, description }
  const [availablePatientTypes, setAvailablePatientTypes] = useState([]);
  const [availablePaymentMethods, setAvailablePaymentMethods] = useState([]);
  const [siretDetails, setSiretDetails] = useState(null);
  const [siretDisplayDetails, setSiretDisplayDetails] = useState(null);
  const [etablissements, setEtablissements] = useState([]);
const [selectedEtablissement, setSelectedEtablissement] = useState(null);


  const [codePostalValide, setCodePostalValide] = useState(false);
  const [adresseValide, setAdresseValide] = useState(false);
  const [loadingCodePostal, setLoadingCodePostal] = useState(false);
  const [loadingAdresse, setLoadingAdresse] = useState(false);

  // Sélections actuelles (IDs)
  const [patientTypeIds, setPatientTypeIds] = useState([]);
  const [paymentMethodIds, setPaymentMethodIds] = useState([]);

  const [progress, setProgress] = useState(0);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isVerifyingSiret, setIsVerifyingSiret] = useState(false);
  const [siretError, setSiretError] = useState("");
  const [siretSuccess, setSiretSuccess] = useState(false);
  const [denomination, setDenomination] = useState("");
// Siret actuellement sélectionné dans le dropdown
const [selectedSiret, setSelectedSiret] = useState("");
  
// FETCH DES DONNEES ENREGISTREES
  useEffect(() => {
    const fetchOptions = async () => {
      const token = localStorage.getItem("authToken");
      const [ptRes, pmRes] = await Promise.all([
        axios.get(`${API_URL}/praticien/options/patient-types`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        axios.get(`${API_URL}/praticien/options/payment-methods`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);
      setAvailablePatientTypes(ptRes.data.data); // ex. [{id:1,description:"Hommes"},…]
      setAvailablePaymentMethods(pmRes.data.data);
    };
    const fetchSelections = async () => {
      const token = localStorage.getItem("authToken");
      const [selPt, selPm] = await Promise.all([
        axios.get(`${API_URL}/praticien/patient-types`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        axios.get(`${API_URL}/praticien/payment-methods`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);
      setPatientTypeIds(selPt.data.data.map((t) => t.id_patient_type));
      setPaymentMethodIds(selPm.data.data.map((m) => m.id_payment_method));
    };
    const fetchPractitioner = async () => {
      try {
        const token = localStorage.getItem("authToken");
        const resp = await axios.get(
          `${API_URL}/praticien/get-info-praticien`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        if (resp.data.success) {
          const d = resp.data.data;
          setInitialData(d);
          // If no local selection, show server image
          if (!profilPhotoFile) {
            setProfilePic(d.profil_photo || initialImgFile);
          }
          setInitialData(d);
          setProfilePic(d.profil_photo || initialImgFile);
          setInitialData(d);
          setCivilite(d.situation || "Monsieur");
          setNom(d.lastname || "");
          setPrenom(d.firstname || "");
          setDateNaissance(d.birthdate || "");
          setEmail(d.mail || "");
          setTelephone(d.phone_number || "");
          setMobile(d.mobile_number || "");
          setAdresse(d.adress || "");
          setCodePostal(d.postal_code || "");
          setVille(d.city || "");
          setSiret(d.practitioner_info.siret || "");
          // Pré-remplissage du Siren (9 premiers chiffres du Siret)
          const fetchedSiret = d.practitioner_info.siret || "";
          setSiren(fetchedSiret.slice(0, 9));

          setLinkedinLink(d.practitioner_info.linkedin_link || "");
          setFacebookLink(d.practitioner_info.facebook_link || "");
          setDescription(d.practitioner_info.profil_description || "");
          setConsultationTypes(
            [
              d.practitioner_info.is_office_consult && "Cabinet",
              d.practitioner_info.is_visio_consult && "Visio",
              d.practitioner_info.is_home_consult && "Domicile",
            ].filter(Boolean)
          );
        }
      } catch (err) {
        console.error("Erreur chargement données :", err);
      }
    };
    fetchOptions();
    fetchSelections();
    fetchPractitioner();
  }, []);

// gestion commune 
const [communes, setCommunes] = useState([]);
const [showCommunesDropdown, setShowCommunesDropdown] = useState(false);


// MISE A JOUR % DE COMPLETION PROFIL
  useEffect(() => {
    const fields = [
      profilePic ? 1 : 0,
      civilite.trim() ? 1 : 0,
      nom.trim() ? 1 : 0,
      prenom.trim() ? 1 : 0,
      dateNaissance.trim() ? 1 : 0,
      email.trim() ? 1 : 0,
      mobile?.trim() ? 1 : 0,
      adresse.trim() ? 1 : 0,
      codePostal.trim() ? 1 : 0,
      ville.trim() ? 1 : 0,
      siret.trim() ? 1 : 0,
      description.trim() ? 1 : 0,
      consultationTypes.length > 0 ? 1 : 0,
      patientTypeIds.length > 0 ? 1 : 0,
      paymentMethodIds.length > 0 ? 1 : 0,
    ];
    const filled = fields.reduce((acc, cur) => acc + cur, 0);
    setProgress(Math.round((filled / MANDATORY_FIELDS) * 100));
    validateFields();
  }, [
    profilePic,
    civilite,
    nom,
    prenom,
    dateNaissance,
    email,
    mobile,
    adresse,
    codePostal,
    ville,
    siret,
    description,
    consultationTypes,
    patientTypeIds,
    paymentMethodIds,
  ]);

  //gestion code postal
  // Ajouter en haut du composant
  useEffect(() => {
    if (codePostal.length === 5 && !ville) {
      validateCodePostal(codePostal);
    }
  }, [codePostal, ville]); // Déclencher quand le code postal change

// GESTION NUMERO-DE-SIRET
  const selectEtablissement = (etab) => {
    setSelectedEtablissement(etab);
    setSiret(etab.siret);
    // Pré-remplissage des champs :
    const address = [etab.numero_voie, etab.type_voie, etab.libelle_voie].filter(Boolean).join(" ");
    setAdresse(address);
    setCodePostal(etab.code_postal || "");
    setVille(etab.libelle_commune || "");
    setSiretDisplayDetails(etab);
  };

const handleVerifySiren = async () => {
  const cleanedSiren = siren.replace(/\s/g, "");
  setIsVerifyingSiret(true);
  setSiretError("");
  setSiretSuccess(false);

  if (cleanedSiren.length !== 9) {
    setSiretError("Le SIREN doit contenir exactement 9 chiffres");
    setIsVerifyingSiret(false);
    return false;
  }

  try {
    const proxyUrl = "https://api.corsproxy.io/";
    const response = await axios.get(
      `${proxyUrl}https://data.siren-api.fr/v3/unites_legales/${cleanedSiren}`,
      { headers: { "X-Client-Secret": "cIUGdgdH5qiqyFOcQY4ZuK3wkSRBpbqQ", "X-Requested-With": "XMLHttpRequest" } }
    );

    const unite = response.data.unite_legale;
    const liste = Array.isArray(unite.etablissements) ? unite.etablissements : [];
    setEtablissements(liste);

    if (liste.length === 0) {
      throw new Error("Aucun établissement trouvé");
    }

    // Pré-sélection : siège social si présent
    const siege = liste.find((e) => e.etablissement_siege) || liste[0];
    selectEtablissement(siege);

    setDenomination(unite.denomination || "");
    setSiretSuccess(true);
    return true;

  } catch (error) {
    console.error(error);
    setSiretError("Erreur lors de la vérification du SIREN");
    return false;

  } finally {
    setIsVerifyingSiret(false);
  }
};




// GESTION DU SAISIE-DE-DESCRIPTION
  useEffect(() => {
    if (!isTyping || !targetDescription) return;

    let idx = 0;
    typingIntervalRef.current = setInterval(() => {
      setDescription((prev) => prev + targetDescription[idx]);
      idx += 1;
      if (idx >= targetDescription.length) {
        clearInterval(typingIntervalRef.current);
        setIsTyping(false);
      }
    }, 50);

    return () => clearInterval(typingIntervalRef.current);
  }, [isTyping, targetDescription]);
  const generateExampleDescription = () => {
    setIsTyping(true);
    setDescription("");

    const examples = [
      "Professionnel de santé formé à [votre diplôme], j'accompagne mes patients avec une approche bienveillante et personnalisée. Mon expérience variée me permet de m'adapter à différents profils et situations.",
      "Après une certification en [votre diplôme], j'ai développé une méthodologie centrée sur l'écoute active et les techniques adaptatives. Mes consultations visent à créer un environnement propice à l'épanouissement personnel.",
      "Praticien en [votre domaine] avec plusieurs années d'expérience, je combine savoir-faire traditionnel et innovations récentes. Mon objectif est de proposer un accompagnement sur mesure pour chaque individu.",
      "Spécialiste dans mon domaine, je mets à profit mes compétences acquises grâce à [votre diplôme] pour offrir des solutions concrètes. Mes consultations s'adaptent aux besoins spécifiques de chaque patient.",
    ];

    const randomExample = examples[Math.floor(Math.random() * examples.length)];
    let idx = 0;

    if (typingIntervalRef.current) clearInterval(typingIntervalRef.current);

    typingIntervalRef.current = setInterval(() => {
      setDescription((prev) => {
        if (idx >= randomExample.length) {
          clearInterval(typingIntervalRef.current);
          setIsTyping(false);
          return prev;
        }
        const nextChar = randomExample.charAt(idx);
        idx += 1;
        return prev + nextChar;
      });
    }, 30);
  };
  

  useEffect(() => {
    return () => {
      if (typingIntervalRef.current) clearInterval(typingIntervalRef.current);
    };
  }, []);


// GESTION VALIDATION DES CHAMPS OBLIGATOIRES
  const validateFields = async () => {
    const newErrors = {};
    if (!profilePic) newErrors.profilePic = "La photo de profil est requise.";

    if (!civilite.trim()) newErrors.civilite = "La civilité est requise.";

    if (!nom.trim()) newErrors.nom = "Le nom est requis.";

    if (!prenom.trim()) newErrors.prenom = "Le prénom est requis.";

    if (!dateNaissance.trim())newErrors.dateNaissance = "La date de naissance est requise.";

    if (!email.trim()) newErrors.email = "L'email est requis.";

    else if (!/^\S+@\S+\.\S+$/.test(email)) newErrors.email = "Le format de l'email est invalide.";

    if (!mobile.trim()) newErrors.mobile = "Le numéro mobile est requis.";

    if (!adresse.trim())newErrors.adresse = "L'adresse est requise.";

    if (!codePostal.trim()) {
      newErrors.codePostal = "Le code postal est requis.";
    } else if (!/^\d{5}$/.test(codePostal)) {
      newErrors.codePostal = "Code postal invalide (5 chiffres requis)";
    }
    // else if (!(await validateCodePostal(codePostal))) {
    //   newErrors.codePostal = "Code postal non reconnu";
    // }

    if (!ville.trim()) newErrors.ville = "La ville est requise.";

    if (!siren.trim()) {
  newErrors.siret = "Le numéro de SIREN est requis.";
} else if (siren.replace(/\s/g, "").length !== 9) {
  newErrors.siret = "Le SIREN doit contenir exactement 9 chiffres";
}

    if (!description.trim())newErrors.description = "La description est requise.";

    if (consultationTypes.length === 0) newErrors.consultationTypes = "Veuillez sélectionner au moins un type de consultation.";
    
    if (patientTypeIds.length === 0) newErrors.patientTypes = "Veuillez sélectionner au moins un type de patient.";
    
    if (paymentMethodIds.length === 0)newErrors.paymentMethods = "Veuillez sélectionner au moins un moyen de paiement.";
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const validateCodePostal = async (cp) => {
  setLoadingCodePostal(true);
  try {
    const response = await axios.get(`https://geo.api.gouv.fr/communes?codePostal=${cp}`);
    setCommunes(response.data);
    
    if (response.data.length > 0) {
      if (response.data.length === 1) {
        setVille(response.data[0].nom);
        setShowCommunesDropdown(false);
      } else {
        setShowCommunesDropdown(true);
      }
      return true;
    }
    return false;
    
  } catch (error) {
    console.error("Erreur validation code postal:", error);
    return false;
  } finally {
    setLoadingCodePostal(false);
  }
};
  const validateAdresse = async (adresseSaisie, cp) => {
  setLoadingAdresse(true);
  try {
    const { data } = await axios.get(`https://api-adresse.data.gouv.fr/search/`, {
      params: {
        q: adresseSaisie,
        postcode: cp,
        autocomplete: 0,
        limit: 1
      }
    });

    if (data.features?.length > 0) {
      const props = data.features[0].properties;
      // Mettre à jour l'adresse formatée ET la ville
      setAdresse(props.name);
      setVille(props.city);
      setCodePostal(props.postcode);
      return true;
    }
    return false;
  } catch (error) {
    console.error("Erreur validation adresse :", error);
    return false;
  } finally {
    setLoadingAdresse(false);
  }
};
  

// GESTION DES AUTRES CHANGEMENT OU ETAT : CHECKBOX, DROP PHOTO, DATE
  const profilePicRef = useRef();
  const handleModifyProfile = () => navigate("/profil");
  const TODAY = new Date().toISOString().slice(0, 10);
  const MIN_DATE = "1960-01-01";
  const MAX_AGE_DATE = (() => {
    const d = new Date();
    d.setFullYear(d.getFullYear() - 65);
    return d.toISOString().slice(0, 10);
  })();
  const MAX_ADULT_DATE = (() => {
    const d = new Date();
    d.setFullYear(d.getFullYear() - 18);
    return d.toISOString().slice(0, 10);
  })();

  const handleToggle = (option, state, setState) => {
    setState(
      state.includes(option)
        ? state.filter((item) => item !== option)
        : [...state, option]
    );
  };
  const handleChangePhoto = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setProfilPhotoFile(file);
      setProfilePic(URL.createObjectURL(file));
    }
  };
  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file) {
      setProfilPhotoFile(file);
      setProfilePic(URL.createObjectURL(file));
    }
  };

  const getProfilePicSrc = () => {
    if (profilPhotoFile) {
      if (
        !profilePicRef.current ||
        profilePicRef.current.file !== profilPhotoFile
      ) {
        profilePicRef.current = {
          file: profilPhotoFile,
          url: URL.createObjectURL(profilPhotoFile),
        };
      }
      return profilePicRef.current.url;
    }
    if (profilePic) return `${API_URL}/image${profilePic}`;
    return undefined;
  };

  const handleDateChange = (e) => {
    setDateNaissance(e.target.value);
    setErrors((prev) => ({ ...prev, dateNaissance: undefined })); // clear error
  };
  const validateDate = () => {
    if (dateNaissance.length !== 10) return;
    const sel = new Date(dateNaissance);
    const min = new Date(MIN_DATE);
    const maxAge = new Date(MAX_AGE_DATE);
    const maxAdult = new Date(MAX_ADULT_DATE);

    if (sel < min) {
      setDateNaissance(MIN_DATE);
      setErrors((prev) => ({
        ...prev,
        dateNaissance: "Date de naissance trop ancienne.",
      }));
    } else if (sel > maxAdult) {
      setDateNaissance(MAX_ADULT_DATE);
      setErrors((prev) => ({
        ...prev,
        dateNaissance: "Vous devez avoir au moins 18 ans.",
      }));
    } else if (sel < maxAge) {
      setDateNaissance(MAX_AGE_DATE);
      setErrors((prev) => ({
        ...prev,
        dateNaissance: "L'âge maximum est de 65 ans.",
      }));
    }
  };
  

// ENVOIE DU FORMULAIRE FINAL POUR ENREGISTREMENT DES MODIFICATIONS
  const handleSubmitForm = async () => {
    const isValid = await validateFields();
    if(isValid == false)return; // Verification de toute les champs

    // if (!siretSuccess) {
    //   const confirmVerification = window.confirm(
    //     "Le SIRET n'a pas été vérifié. Souhaitez-vous tout de même soumettre le formulaire ?"
    //   );
    //   if (!confirmVerification) return;
    // }

    setIsSubmitting(true);
    try {
      const isFirstCompletion = !initialData?.practitioner_info;
      const token = localStorage.getItem("authToken");
      const formData = new FormData();

      const isSiretValid = await handleVerifySiren(); // ✅ Maintenant on vérifie le SIREN
if (!isSiretValid) {
  setSiretError("SIREN invalide. Veuillez corriger le numéro.");
  setIsSubmitting(false);
  return;
}


      // Ajout de isCompletion dans formData
      formData.append("isCompletion", isFirstCompletion.toString());

      // Ajout des autres champs
      Object.entries({
        firstname: prenom,
        lastname: nom,
        mail: email,
        birthdate: dateNaissance,
        situation: civilite,
        mobile_number: mobile,
        phone_number: telephone,
        adress: adresse,
        postal_code: codePostal,
        city: ville,
        siret: siret,
        profil_description: description,
        facebook_link: facebookLink,
        linkedin_link: linkedinLink,
      }).forEach(([k, v]) => formData.append(k, v));

      // Types de consultation
      formData.append(
        "is_office_consult",
        consultationTypes.includes("Cabinet")
      );
      formData.append("is_visio_consult", consultationTypes.includes("Visio"));
      formData.append(
        "is_home_consult",
        consultationTypes.includes("Domicile")
      );

      if (profilPhotoFile) formData.append("profil_photo", profilPhotoFile);

      // Toujours utiliser POST
      const resp = await axios.post(
        `${API_URL}/praticien/complete-profil`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      // Après avoir enregistré le profil :
      await axios.post(
        `${API_URL}/praticien/patient-types`,
        { patientTypeIds },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      await axios.post(
        `${API_URL}/praticien/payment-methods`,
        { paymentMethodIds },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (resp.data.success) navigate("/profil", { state: { profileNow: getProfilePicSrc() } });
    } catch (err) {
      console.error("Erreur soumission :", err);
      alert(err.response?.data?.message || "Erreur lors de la sauvegarde");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="relative">
      {/* En-tête */}
      <div className="flex items-center justify-between px-4 my-2 rounded">
        <div className="flex items-start space-x-4">
          <button
            type="button"
            onClick={handleModifyProfile}
            className="inline-flex items-center px-4 py-2 mt-auto text-xs font-medium text-white bg-[#0f2b3d] rounded hover:bg-[#14384f]"
          >
            <ArrowLeftCircle className="w-4 h-4" size={15} />
          </button>
          <div className="flex flex-col">
            <h2 className="text-sm font-semibold text-gray-800">
              Informations de votre profil
            </h2>
            <span className="text-xs text-gray-800">
              Mettez à jour vos informations personnelles.
            </span>
          </div>
        </div>
        {/* Cercle de progression */}
        <div className="flex items-center">
          <svg className="w-8 h-8" viewBox="0 0 36 36">
            <path
              className="text-gray-300"
              strokeWidth="3.8"
              stroke="currentColor"
              fill="none"
              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
            />
            <path
              className="text-blue-600"
              strokeWidth="3.8"
              strokeDasharray={`${progress}, 100`}
              stroke="currentColor"
              fill="none"
              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
            />
            <text
              x="18"
              y="20.35"
              className="text-xs font-semibold fill-gray-600"
              textAnchor="middle"
            >
              {progress}%
            </text>
          </svg>
        </div>
      </div>

      {/* Section photo de profil */}
      <div className="flex items-center justify-between p-4 mx-5 mb-4 border rounded-md">
        <div className="flex items-center space-x-4">
          <Avatar className="w-24 h-24 rounded ring-gray-300">
            <AvatarImage
              src={getProfilePicSrc()}
              alt="Photo de profil"
              className="object-cover w-full h-full rounded-none"
            />
            <AvatarFallback>
              <svg
                fill="currentColor"
                viewBox="0 0 24 24"
                className="w-6 h-6 text-gray-500"
              >
                <path d="M12 12c2.7 0 4.89-2.2..." />
              </svg>
            </AvatarFallback>
          </Avatar>
          {errors.profilePic && (
            <span className="text-xs text-red-600">{errors.profilePic}</span>
          )}
          <span className="text-xs font-semibold text-gray-700 hidden md:block">
            Photo de profil
          </span>

          <div
            className="flex flex-col items-center justify-center p-4 border-2 border-[#5DA781] border-dashed rounded-md cursor-pointer w-120"
            onClick={() => fileInputRef.current?.click()}
            onDragOver={(e) => e.preventDefault()}
            onDrop={handleDrop}
          >
            <img
              src={svg}
              alt="upload icon"
              className="w-5 h-5 mb-2 text-[#5DA781]"
              style={{
                filter:
                  "invert(43%) sepia(77%) saturate(180%) hue-rotate(75deg)",
              }}
            />
            <label className="text-xs text-[#5DA781]">
              Cliquer ou glisser-déposer
            </label>
            <input
              type="file"
              accept="image/*"
              ref={fileInputRef}
              className="hidden"
              onChange={handleChangePhoto}
            />
            <p className="mt-1 text-xs text-[#5DA781]">
              SVG, PNG, JPG ou GIF (max. 400 x 400px)
            </p>
          </div>
        </div>
      </div>

      {/* Formulaire d'informations */}
      <div className="flex flex-col md:flex-row items-start w-full px-6 my-4">
        {/* Gauche: infos persos */}
        <div className="w-full md:w-1/2 rounded-md mr-4 space-y-4">
          {/* Civilité */}
          <div>
            <label className="block text-xs font-medium text-gray-700">
              Civilité <span className="text-red-700">*</span>
            </label>
            <select
              value={civilite}
              onChange={(e) => setCivilite(e.target.value)}
              className={`mt-1 block w-full text-xs rounded border px-3 py-2 ${
                errors.civilite ? "border-red-500" : "border-gray-300"
              }`}
            >
              <option>Monsieur</option>
              <option>Madame</option>
              <option>Mademoiselle</option>
            </select>
            {errors.civilite && (
              <p className="text-red-600 text-xs">{errors.civilite}</p>
            )}
          </div>

          {/* Nom */}
          <div>
            <label className="block text-xs font-medium text-gray-700">
              Nom <span className="text-red-700">*</span>
            </label>
            <input
              type="text"
              value={nom}
              onChange={(e) => setNom(e.target.value)}
              placeholder="Votre nom"
              className={`mt-1 block w-full text-xs rounded border px-3 py-2 ${
                errors.nom ? "border-red-500" : "border-gray-300"
              }`}
            />
            {errors.nom && <p className="text-red-600 text-xs">{errors.nom}</p>}
          </div>

          {/* Prénom */}
          <div>
            <label className="block text-xs font-medium text-gray-700">
              Prénom <span className="text-red-700">*</span>
            </label>
            <input
              type="text"
              value={prenom}
              onChange={(e) => setPrenom(e.target.value)}
              placeholder="Votre prenom"
              className={`mt-1 block w-full text-xs rounded border px-3 py-2 ${
                errors.prenom ? "border-red-500" : "border-gray-300"
              }`}
            />
            {errors.prenom && (
              <p className="text-red-600 text-xs">{errors.prenom}</p>
            )}
          </div>

          {/* Date de naissance */}
          <div>
            <label className="block text-xs font-medium text-gray-700">
              Date de naissance <span className="text-red-700">*</span>
            </label>
            <input
              type="date"
              min={MIN_DATE}
              max={MAX_ADULT_DATE} // ne pas autoriser > aujourd’hui :contentReference[oaicite:9]{index=9}
              value={dateNaissance}
              onChange={handleDateChange} // mise à jour sans validation
              onBlur={validateDate} // validation seulement au blur :contentReference[oaicite:10]{index=10}
              className={`mt-1 block w-full text-xs rounded border px-3 py-2 ${
                errors.dateNaissance ? "border-red-500" : "border-gray-300"
              }`}
            />
            {errors.dateNaissance && (
              <p className="text-red-600 text-xs">{errors.dateNaissance}</p>
            )}
          </div>

          {/* Email */}
          <div>
            <label className="block text-xs font-medium text-gray-700">
              Email <span className="text-red-700">*</span>
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="exemple@gmail.com"
              className={`mt-1 block w-full text-xs rounded border px-3 py-2 ${
                errors.email ? "border-red-500" : "border-gray-300"
              }`}
            />
            {errors.email && (
              <p className="text-red-600 text-xs">{errors.email}</p>
            )}
          </div>

          {/* Téléphone */}
          <div>
            <label className="block text-xs font-medium text-gray-700">
              Téléphone (facultatif)
            </label>
            {/* Téléphone */}
            <PhoneManager
              value={telephone}
              onChange={setTelephone}
              placeholder="Entrez votre numéro téléphone"
              className="h-[32px] px-1 text-sm border rounded-md"
              name="telephone"
            />
          </div>

          {/* Mobile */}
          <div>
            <label className="block text-xs font-medium text-gray-700">
              Mobile <span className="text-red-700">*</span>
            </label>
            {/* Mobile */}
            <PhoneManager
              value={mobile}
              onChange={(value) => setMobile(value || "")}
              placeholder="Entrez votre numéro mobile"
              className="h-[32px] px-1 text-sm border rounded-md"
              name="mobile"
            />
            {errors.mobile && (
              <p className="text-red-600 text-xs">{errors.mobile}</p>
            )}
          </div>
          
          {/* SIREN */}
<div>
  <label className="block text-xs font-medium text-gray-700">
    Numéro de Siren <span className="text-red-700">*</span>
  </label>
  <div className="flex gap-2">
    <input
      type="text"
      value={siren}
      onChange={(e) => {
        const formatted = e.target.value.replace(/\D/g, "").slice(0, 9);
        setSiren(formatted);
      }}
      onBlur={handleVerifySiren}
      placeholder="123456789"
      className={`mt-1 block w-full text-xs rounded border px-3 py-2 ${
        siretError ? "border-red-500" : "border-gray-300"
      }`}
      inputMode="numeric"
    />
  </div>
  { siretSuccess && etablissements.length > 1 && (
  <div className="mt-2">
    <label className="block text-xs font-medium text-gray-700">
      Choisissez un établissement
    </label>
    <select
      className="mt-1 block w-full text-xs rounded border px-3 py-2"
      value={selectedEtablissement?.siret || ""}
      onChange={(e) => {
        const etab = etablissements.find((x) => x.siret === e.target.value);
        selectEtablissement(etab);
      }}
    >
      {etablissements.map((etab) => (
        <option key={etab.siret} value={etab.siret}>
          {etab.siret} – {etab.etablissement_siege ? "Siège" : `NIC ${etab.nic}`}
        </option>
      ))}
    </select>
  </div>
)}

  {siretError && <p className="text-red-500 text-xs">{siretError}</p>}
  {siretSuccess && siretDisplayDetails && (
  <div className="mt-2 p-2 bg-gray-100 text-xs rounded">
    <p><strong>Entreprise :</strong> {denomination}</p>
    <p><strong>SIRET :</strong> {siret}</p>
    <p><strong>Adresse :</strong> {adresse}</p>
    <p><strong>Ville :</strong> {ville} {codePostal}</p>
  </div>
)}

</div>


          {/* Adresse */}
          <div>
            <label className="block text-xs font-medium text-gray-700">
              Adresse <span className="text-red-700">*</span>
            </label>
            <div className="relative">
              <input
                type="text"
                value={adresse}
                onChange={(e) => setAdresse(e.target.value)}
                placeholder="15 Rue des Lilas"
                className={`mt-1 block w-full text-xs rounded border px-3 py-2 ${
                  errors.adresse ? "border-red-500" : "border-gray-300"
                }`}
              />
              {loadingAdresse && (
                <div className="absolute right-2 top-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-600"></div>
                </div>
              )}
            </div>
            {errors.adresse && (
              <p className="text-red-600 text-xs">{errors.adresse}</p>
            )}
            {adresseValide && !errors.adresse && (
              <p className="text-green-600 text-xs mt-1">✓ Adresse validée</p>
            )}
          </div>

          {/* Code Postal */}
          <div className="relative">
            <label className="block text-xs font-medium text-gray-700">
              Code Postal <span className="text-red-700">*</span>
            </label>
            <div className="relative">
              <input
                type="text"
                value={codePostal}
                onChange={async (e) => {
                  const value = e.target.value.replace(/\D/g, '').slice(0, 5);
                  setCodePostal(value);
                  setVille('');
                  setCommunes([]);

                  if (value.length === 5) {
                    await validateCodePostal(value);
                  } else {
                    setShowCommunesDropdown(false);
                  }
                }}
                placeholder="75001"
                className={`mt-1 block w-full text-xs rounded border px-3 py-2 ${
                  errors.codePostal ? "border-red-500" : "border-gray-300"
                }`}
                inputMode="numeric"
              />
              {loadingCodePostal && (
                <div className="absolute right-2 top-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-600"></div>
                </div>
              )}
            </div>
            {errors.codePostal && (
              <p className="text-red-600 text-xs">{errors.codePostal}</p>
            )}
          </div>

          {/*  Ville */}
          <div className="relative">
            <label className="block text-xs font-medium text-gray-700">
              Ville <span className="text-red-700">*</span>
            </label>
            <input
              type="text"
              value={ville}
              onChange={e => {
                setVille(e.target.value);
                setShowCommunesDropdown(false);
              }}
              onFocus={() => communes.length > 1 && setShowCommunesDropdown(true)}
              placeholder="Sélectionnez une ville"
              className={`mt-1 block w-full text-xs rounded border px-3 py-2 ${
                errors.ville ? "border-red-500" : "border-gray-300"
              }`}
            />
            
            {showCommunesDropdown && communes.length > 1 && (
              <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded shadow-lg max-h-40 overflow-y-auto">
                {communes.map((commune) => (
                  <div
                    key={commune.code}
                    className="px-3 py-2 text-xs hover:bg-gray-100 cursor-pointer"
                    onClick={() => {
                      setVille(commune.nom);
                      setShowCommunesDropdown(false);
                    }}
                  >
                    {commune.nom}
                  </div>
                ))}
              </div>
            )}
            
            {errors.ville && <p className="text-red-600 text-xs">{errors.ville}</p>}
          </div>

          {/* Description */}
          <div>
            <div className="flex justify-between items-center">
              <label className="block text-xs font-medium text-gray-700">
                Description <span className="text-red-700">*</span>
              </label>
              <button
                type="button"
                onClick={generateExampleDescription}
                disabled={isTyping}
                className="text-xs text-[#5DA781] hover:underline flex items-center gap-2"
              >
                <WandSparkles size={15} />
                {isTyping ? "Génération en cours..." : "Générer un exemple"}
              </button>
            </div>
            <textarea
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Exemple : Spécialiste en [votre spécialité], je propose..."
              disabled={isTyping}
              className={`mt-1 block w-full text-xs rounded border px-3 py-2 ${
                errors.description ? "border-red-500" : "border-gray-300"
              }`}
            />
            {errors.description && (
              <p className="text-red-600 text-xs">{errors.description}</p>
            )}
          </div>

          {/* Checkboxes: consultations */}
          <div>
            <label className="block text-xs font-medium text-gray-700">
              Type de consultations <span className="text-red-700">*</span>
            </label>
            <div className="flex space-x-4 mt-1 text-xs">
              {["Cabinet", "Visio", "Domicile"].map((opt) => (
                <label key={opt} className="inline-flex items-center">
                  <input
                    type="checkbox"
                    checked={consultationTypes.includes(opt)}
                    onChange={() =>
                      handleToggle(opt, consultationTypes, setConsultationTypes)
                    }
                    className="mr-1"
                  />
                  {opt}
                </label>
              ))}
            </div>
            {errors.consultationTypes && (
              <p className="text-red-600 text-xs">{errors.consultationTypes}</p>
            )}
          </div>

          {/* Checkboxes: patient types */}
          <div>
            <label className="block text-xs font-medium text-gray-700">
              Type de patient <span className="text-red-700">*</span>
            </label>
            <div className="flex flex-wrap gap-2 mt-1 text-xs">
              {availablePatientTypes
                .slice() // pour ne pas muter l’état
                .sort((b, a) => a.id_patient_type - b.id_patient_type)
                .map((opt) => {
                  const isTousPublics = opt.description === "Tous publics";
                  const isChecked = patientTypeIds.includes(
                    opt.id_patient_type
                  );

                  return (
                    <label
                      key={opt.id_patient_type}
                      className="inline-flex items-center"
                    >
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => {
                          if (isTousPublics) {
                            // Si "Tous publics" est coché, sélectionner tous les types
                            if (isChecked) {
                              // Décocher "Tous publics" → tout décocher
                              setPatientTypeIds([]);
                            } else {
                              // Cocher "Tous publics" → sélectionner tous les IDs
                              setPatientTypeIds(
                                availablePatientTypes.map(
                                  (o) => o.id_patient_type
                                )
                              );
                            }
                          } else {
                            // Comportement normal pour les autres cases
                            setPatientTypeIds((prevIds) => {
                              const nextIds = isChecked
                                ? prevIds.filter(
                                    (id) => id !== opt.id_patient_type
                                  )
                                : [...prevIds, opt.id_patient_type];

                              // Vérifier si tous les types sont sélectionnés
                              const allIds = availablePatientTypes.map(
                                (o) => o.id_patient_type
                              );
                              const tousPublicsId = availablePatientTypes.find(
                                (o) => o.description === "Tous publics"
                              )?.id_patient_type;

                              if (tousPublicsId !== undefined) {
                                const allSelected = allIds.every((id) =>
                                  nextIds.includes(id)
                                );
                                if (
                                  allSelected &&
                                  !nextIds.includes(tousPublicsId)
                                ) {
                                  return [...nextIds, tousPublicsId];
                                } else if (
                                  !allSelected &&
                                  nextIds.includes(tousPublicsId)
                                ) {
                                  return nextIds.filter(
                                    (id) => id !== tousPublicsId
                                  );
                                }
                              }

                              return nextIds;
                            });
                          }
                        }}
                        className="mr-1"
                      />
                      {opt.description}
                    </label>
                  );
                })}
            </div>

            {errors.patientTypes && (
              <p className="text-red-600 text-xs">{errors.patientTypes}</p>
            )}
          </div>

          {/* Checkboxes: payment methods */}
          <div>
            <label className="block text-xs font-medium text-gray-700">
              Moyens de paiement <span className="text-red-700">*</span>
            </label>
            <div className="flex flex-wrap gap-2 mt-1 text-xs">
              {availablePaymentMethods.map((opt) => (
                <label
                  key={opt.id_payment_method}
                  className="inline-flex items-center"
                >
                  <input
                    type="checkbox"
                    checked={paymentMethodIds.includes(opt.id_payment_method)}
                    onChange={() => {
                      setPaymentMethodIds((ids) =>
                        ids.includes(opt.id_payment_method)
                          ? ids.filter((i) => i !== opt.id_payment_method)
                          : [...ids, opt.id_payment_method]
                      );
                    }}
                    className="mr-1"
                  />
                  {opt.description}
                </label>
              ))}
            </div>
            {errors.paymentMethods && (
              <p className="text-red-600 text-xs">{errors.paymentMethods}</p>
            )}
          </div>
        </div>

        {/* Droite: réseaux sociaux */}
        <div className="w-full md:w-1/2 border p-4 rounded mt-4 md:mt-0 space-y-4">
          <span className="text-sm font-semibold text-gray-900">
            Réseaux sociaux
          </span>
          <div className="flex items-center space-x-2">
            <Linkedin className="w-5 h-5 text-blue-600" />
            <input
              type="text"
              value={linkedinLink}
              onChange={(e) => setLinkedinLink(e.target.value)}
              placeholder="Lien LinkedIn (facultatif)"
              className="mt-1 block w-full text-xs rounded border px-3 py-2 border-gray-300"
            />
          </div>
          <div className="flex items-center space-x-2">
            <Facebook className="w-5 h-5 text-blue-800" />
            <input
              type="text"
              value={facebookLink}
              onChange={(e) => setFacebookLink(e.target.value)}
              placeholder="Lien Facebook (facultatif)"
              className="mt-1 block w-full text-xs rounded border px-3 py-2 border-gray-300"
            />
          </div>
        </div>
      </div>

      {/* Bouton de sauvegarde */}
      <div className="flex justify-start p-6">
        <Button
          onClick={handleSubmitForm}
          disabled={isSubmitting}
          className="flex items-center px-4 py-2 text-white text-xs font-medium rounded"
        >
          <Save className="w-4 h-4 mr-2" />
          {isSubmitting ? "Enregistrement..." : "Enregistrer"}
        </Button>
      </div>
      {/* Dialog des détails SIRET */}
      <Dialog open={!!siretDetails} onOpenChange={() => setSiretDetails(null)}>
        <DialogContent className="sm:max-w-[625px] mx-2 max-w-[95%] text-xs sm:text-xs">
          <DialogHeader>
            <DialogTitle className="text-sm">
              Détails de l'établissement
            </DialogTitle>
          </DialogHeader>

          {siretDetails && (
            <div className="overflow-x-auto py-2 text-xs">
              <table className="min-w-full table-auto border-collapse">
                <tbody>
                  <tr className="border-b">
                    <td className="px-2 py-1 break-all">
                      {siretDetails.enseigne_1 ||
                        siretDetails.denomination_usuelle}
                    </td>
                  </tr>
                  <tr className="border-b">
                    <th className="text-left px-2 py-1 font-medium">SIRET</th>
                    <td className="px-2 py-1 break-all">
                      {siretDetails.siret}
                    </td>
                  </tr>
                  <tr className="border-b">
                    <th className="text-left px-2 py-1 font-medium">Adresse</th>
                    <td className="px-2 py-1">
                      {[
                        siretDetails.numero_voie,
                        siretDetails.type_voie,
                        siretDetails.libelle_voie,
                      ].join(" ")}
                    </td>
                  </tr>
                  <tr className="border-b">
                    <th className="text-left px-2 py-1 font-medium">
                      Code postal
                    </th>
                    <td className="px-2 py-1">{siretDetails.code_postal}</td>
                  </tr>
                  <tr className="border-b">
                    <th className="text-left px-2 py-1 font-medium">Ville</th>
                    <td className="px-2 py-1">
                      {siretDetails.libelle_commune}
                    </td>
                  </tr>
                  <tr className="border-b">
                    <th className="text-left px-2 py-1 font-medium">
                      Activité principale
                    </th>
                    <td className="px-2 py-1 break-all">
                      {siretDetails.activite_principale}
                    </td>
                  </tr>
                  <tr className="border-b">
                    <th className="text-left px-2 py-1 font-medium">Statut</th>
                    <td
                      className="px-2 py-1 font-semibold ${
                siretDetails.etat_administratif === 'A' ? 'text-green-600' : 'text-red-600'
              }"
                    >
                      {siretDetails.etat_administratif === "A"
                        ? "Actif"
                        : "Fermé"}
                    </td>
                  </tr>
                  <tr>
                    <th className="text-left px-2 py-1 font-medium">
                      Création
                    </th>
                    <td className="px-2 py-1">
                      {new Date(
                        siretDetails.date_creation
                      ).toLocaleDateString()}
                    </td>
                  </tr>
                  <tr>
                    <th className="text-left px-2 py-1 font-medium">
                      Dernière mise à jour
                    </th>
                    <td className="px-2 py-1">
                      {new Date(
                        siretDetails.date_dernier_traitement
                      ).toLocaleDateString()}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CompleteProfile;