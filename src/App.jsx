// App.js de React
import React, { useState } from "react";
import "./App.css";

function App() {
  const [table, setTable] = useState("");
  const [number, setNumber] = useState("");  // Nouveau state pour gérer le numéro envoyé
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);  // Gérer les erreurs

  const handleSubmit = (event) => {
    event.preventDefault(); // Empêche le rechargement de la page
    setLoading(true); // Commencer le chargement
  
    // Envoyer le numéro au backend
    fetch(`http://localhost:5000/table/${number}`)
      .then((response) => {
        console.log("Réponse brute :", response); // Ajouter ce log pour voir la réponse brute
        return response.json();  // Tenter de parser en JSON
      })
      .then((data) => {
        if (data.table) {
          setTable(data.table); // Afficher la table retournée
        } else {
          setError("Table non trouvée.");
        }
        setLoading(false); // Arrêter le chargement
      })
      .catch((error) => {
        console.error("Erreur lors de la récupération de la table:", error);
        setError("Une erreur est survenue.");
        setLoading(false); // Arrêter le chargement
      });
  };
  

  return (
    <div className="App">
      <div className="construction-container">
        <h1>hellosoins.com</h1>
        <h2>Site en construction</h2>
        <p>Nous travaillons activement à la mise en ligne de notre site.</p>
        <p>Restez connectés !</p>
      </div>
      <h1>Afficher une Table en Fonction du Numéro</h1>

      {/* Formulaire pour envoyer le numéro */}
      <form onSubmit={handleSubmit}>
        <label>
          numero :
          <input
            type="number"
            value={number}
            onChange={(e) => setNumber(e.target.value)}
            min="1"
            required
          />
        </label>
        <button type="submit">Afficher la Table</button>
      </form>

      {/* Affichage de la table ou du message d'erreur */}
      {loading ? (
        <p>Chargement...</p>
      ) : error ? (
        <p style={{ color: "red" }}>{error}</p>
      ) : table ? (
        <p>La table : <strong>{table}</strong></p>
      ) : (
        <p>Aucune table sélectionnée.</p>
      )}
    </div>
  );
}

export default App;
