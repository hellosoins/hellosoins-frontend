import axios from 'axios';
import { user_test } from '@/components/common/constant';
import { jwtDecode } from 'jwt-decode';

const API_URL = import.meta.env.VITE_API_BASE_URL;
export {
  API_URL
}


// Login avec mot de passe
export const login_user = async (user_mail, mot_de_passe) => {
  try {
    const response = await axios.post(`${API_URL}/auth/login`, {
      mail: user_mail,
      password: mot_de_passe,
    });

    return response.data;
  } catch (error) {
    // Gestion d'erreur améliorée
    const errorMessage = error.response?.data?.message || error.message;
    console.error("Erreur lors de la connexion:", errorMessage);
    throw new Error(errorMessage);
  }
};

// Login sans mot de passe
export async function login_by_email(mail) {
  try {
    const response = await axios.post(`${API_URL}/auth/emailLogin`, { mail });

    return response.data;
  } catch (error) {
    const errorMessage = error.response?.data?.message || error.message;
    console.error("Erreur lors de la connexion sans mot de passe:", errorMessage);
    throw new Error(errorMessage);
  }
}

// Fonction utilitaire pour vérifier la validité du token
export function isAuthenticated() {
  const token = localStorage.getItem('authToken');
  if (!token) return false;

  const decoded = jwtDecode(token);
  return decoded.exp > Date.now() / 1000;
}

// Exemple d'utilisation dans un composant
/*
async function handlePasswordlessLogin(email) {
  try {
    const result = await login_by_email(email);
    if (!result.token) {
      // Afficher un message "Check your email"
    }
  } catch (err) {
    // Gérer l'erreur
  }
}
*/


export const api_login_test = async (user_mail, mot_de_passe) => {
  try {
    console.log({
      test: user_mail,
      Ttest: user_test.user_mail,
    })
    if( user_mail == user_test.user_mail ){
      if( mot_de_passe == user_test.mot_de_passe ){
        return {
          message: "Connexion reussi !",
          token: "fake_token_21353wgoi42sqp",
          user: user_test
        }
      }
      throw {
        message: "Mot de passe incorrect !",
      }
    }
    throw {
      message: "Adresse email incorrect !",
    }
  } catch (error) {
    console.error("Erreur lors de la connexion", error);
    throw error;
  }
};

export const getProfilPraticien = () =>{

  const data_user = {
    user_name: "Jean",
    user_forname: "Bosco",
    user_phone: "+1 (555) 123-22222",
    user_mail: "jean@mail.jean",
    photo_url: "https://demos.creative-tim.com/test/corporate-ui-dashboard/assets/img/team-3.jpg",
    siret_number: "12345678",
    ville: "Tananarive",
    xp: 10,
    specialite:["Dermatologue", "Acupuncture", "Massage traditionnelle"],
    consultation: ["Au cabinet", "Domicile"],
    total_rdv: 22, 
  }

  // Appel axiosa implementer
  return data_user;
}

export const register_user = async(requestData) => {
  try {
    const response = await axios.post(`${API_URL}/register`, requestData);
    return response.data;
  } catch (error) {
    const errorMessage = error.response.data.message;
    console.error("Erreur lors de l'inscription", errorMessage);
    throw errorMessage;
  }
}

// Envoi du code de validation
export const sendValidationCode = async ({ mail, phone_number, name }) => {
  try {
    const payload = { mail, numero: phone_number };
    if (name) payload.name = name;

    const response = await axios.post(
      `${API_URL}/validation/send-code`,
      payload
    );

    return response.data;
  } catch (error) {
    const errorMessage = error.response?.data?.message || error.message;
    console.error('Erreur lors de l\'envoi du code :', errorMessage);
    throw new Error(errorMessage);
  }
};

// Vérification du code de validation
export const verifyValidationCode = async ({ mail, code }) => {
  try {
    const response = await axios.post(
      `${API_URL}/validation/verify-code`,
      { mail, code }
    );

    return response.data;
  } catch (error) {
    const errorMessage = error.response?.data?.message || error.message;
    console.error('Erreur lors de la vérification du code :', errorMessage);
    throw new Error(errorMessage);
  }
};


// Récupération du numéro et du nom via l'email
export const getNumberAndName = async (mail) => {
  try {
    const response = await axios.post(
      `${API_URL}/auth/get-mobile`,
      { mail }
    );

    if (!response.data.success) {
      throw new Error('Échec de la récupération du mobile et du nom');
    }

    return {
      mail: response.data.mail,
      mobile_number: response.data.mobile_number,
      name: response.data.name,
    };
  } catch (error) {
    const errorMessage = error.response?.data?.message || error.message;
    console.error('Erreur lors de la récupération du mobile et du nom :', errorMessage);
    throw new Error(errorMessage);
  }
};

export const formatNumero = (numero) => {
  // 1. On ne conserve que les chiffres
  const digits = numero.replace(/\D/g, "");
  
  // 2. On prend les 9 derniers chiffres
  const lastNine = digits.slice(-9);
  
  // 3. On préfixe d’un seul zéro
  const masked = "0" + lastNine;
  
  // 4. On groupe par paires et on joint avec un espace
  return masked.match(/.{1,2}/g)?.join(" ") ?? masked;
}


export const getEtablissementsFromSiret = async (siret) => {
  if (!siret) return [];

  const response = await fetch(`https://api.insee.fr/entreprises/sirene/V3/siret/${siret}`, {
    headers: {
      Authorization: `Bearer ${process.env.NEXT_PUBLIC_INSEE_API_KEY}`,
    },
  });

  if (!response.ok) {
    throw new Error("Impossible de récupérer les informations d’établissement.");
  }

  const data = await response.json();
  return {
    siren: data.etablissement.siren,
    etablissement: [
      data.etablissement.numeroVoie,
      data.etablissement.typeVoie,
      data.etablissement.libelleVoie,
      data.etablissement.codePostal,
      data.etablissement.libelleCommune,
    ]
      .filter(Boolean)
      .join(" "),
  };
};
