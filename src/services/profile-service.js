// src/services/profile-service.js
import axios from 'axios';
const API_URL = import.meta.env.VITE_API_BASE_URL;

const getAuthToken = () => localStorage.getItem('authToken');

// src/services/profile-service.js
export const getPraticienInfo = async () => {
  // Si le token est manquant, lancez une erreur
  const token = getAuthToken();
  if (!token) {throw new Error("Token non trouvé. Connectez-vous."); }

  const response = await axios.get(
    `${API_URL}/praticien/get-info-praticien`,
    {
      headers: {
        Authorization: `Bearer ${token}`, // Format correct : "Bearer <token>"
      },
    }
  );

  return response.data.data;
};

// Requetes pour Information du praticien 
export const getPraticienSpecialites = async () => {
  const token = getAuthToken();
  if (!token) {throw new Error("Token non trouvé. Connectez-vous."); }
  const response = await axios.get(`${API_URL}/praticien/get-speciality-praticien`,
    {
      headers: {
      Authorization: `Bearer ${token}`,
      },
  });
  return response.data.data;
};

export const getPatientTypes = async () => {
  const token = getAuthToken();
  if (!token) throw new Error("Token non trouvé. Connectez-vous.");
  
  const response = await axios.get(`${API_URL}/praticien/patient-types`, {
    headers: {
      Authorization: `Bearer ${token}`,
    }
  });
  return response.data.data.map(pt => pt.description);
};

export const getPaymentMethods = async () => {
  const token = getAuthToken();
  if (!token) throw new Error("Token non trouvé. Connectez-vous.");
  
  const response = await axios.get(`${API_URL}/praticien/payment-methods`, {
    headers: {
      Authorization: `Bearer ${token}`,
    }
  });
  return response.data.data.map(pm => pm.description);
};