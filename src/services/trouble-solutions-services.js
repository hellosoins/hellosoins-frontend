import axios from 'axios';
const API_URL = import.meta.env.VITE_API_BASE_URL;

export const fetchTroubleSolutions = async () => {
    const response = await axios.get(`${API_URL}/trouble-solution/getTroubleSolution`);
    return response.data;
};

export const saveTroubleApproche = async (requestData) => {
    const token = localStorage.getItem('authToken');
    const api = axios.create({
        baseURL: API_URL,
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
    });
    
    try {
        const response = await api.post('/praticien/add-approaches', requestData);
        console.log('Thérapies sauvegardée:', response.data);
        return response.data;
    } catch (error) {
        console.error(
            'Erreur lors de la sauvegarde du thérapie:',
            error.response ? error.response.data : error.message
        );
        throw error;
    }
}

export const deleteTroubleApproche = async (requestData) => {
    const token = localStorage.getItem('authToken');
    const api = axios.create({
        baseURL: API_URL,
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
    });
    
    try {
        const response = await api.post('/praticien/delete-approaches', requestData);
        console.log('Thérapie supprimées:', response.data);
        return response.data;
    } catch (error) {
        console.error(
            'Erreur lors de la suppression du thérapie:',
            error.response ? error.response.data : error.message
        );
    }
}

export const getAllPraticienApproches = async () => {
    const token = localStorage.getItem('authToken');
    const response = await axios.get(`${API_URL}/praticien/get-approaches`,
    {
        headers: {
        Authorization: `Bearer ${token}`,
        },
    });
    return response.data.data;
}

export const updateTroubleApproche = async (troubleData) => {
    const token = localStorage.getItem('authToken');
    const api = axios.create({
        baseURL: API_URL,
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
    });
    
    try {
        if(!troubleData){ throw new Error("Aucune approche n'a été mise à jour"); }
        
        const response = await api.post('/praticien/update-approaches', troubleData);
        console.log('Thérapie mis à jour:', response.data);
        return response.data;
    } catch (error) {
        console.error(
            'Erreur lors de la mise a jour du thérapie:',
            error.response ? error.response.data : error.message
        );
        throw error;
    }
};