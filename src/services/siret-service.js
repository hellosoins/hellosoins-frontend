import axios from 'axios';

// Remplace par ton endpoint réel s’il est protégé (avec token), adapte ici
export const fetchSiretData = async (siret) => {
  if (!siret) throw new Error('Aucun SIRET fourni');

  const cleanedSiret = siret.replace(/\D/g, '');

  const { data } = await axios.get(
    `https://api.insee.fr/entreprises/sirene/V3/siret/${cleanedSiret}`,
    {
      headers: {
        Authorization: `Bearer ${process.env.NEXT_PUBLIC_INSEE_TOKEN}`, // ou hardcodé temporairement
      },
    }
  );

  return {
    siren: data.etablissement.siren,
    denomination:
      data.etablissement.uniteLegale.denominationUniteLegale ||
      data.etablissement.uniteLegale.nomUniteLegale ||
      'Non défini',
  };
};
