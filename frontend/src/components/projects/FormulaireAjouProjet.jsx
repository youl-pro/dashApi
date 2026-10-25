import { useState } from "react";
import styles from "../task/Formulaire.module.css";

// userId est reçu de Projects (la personne connectée)
function FormulaireAjouProjet({ userId, onClose, onProjectCreated }) {
  // l'état userId et son champ ont disparu
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  function handleSubmit(e) {
    e.preventDefault();

    //on ne vérifie plus userId, il vient de la connexion
    if (!name || !description) {
      setErrorMessage("Merci de remplir tous les champs!");
      return;
    }
    setErrorMessage("");

    fetch("https://localhost:7038/api/projects", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: name,
        description: description,
        userId: userId, // l'id de l'utilisateur connecté
      }),
    })
      .then((response) => {
        if (!response.ok) {
          return response.text().then((text) => {
            console.error("Erreur serveur :", text);
            // on affiche le message de l'API s'il est lisible
            setErrorMessage(
              text && !text.startsWith("{") ? text : "Impossible de créer le projet."
            );
            throw new Error("Erreur lors de la création");
          });
        }
        return response.json();
      })
      .then((data) => {
        onProjectCreated(data);
      })
      .catch((error) => console.error(error));
  }

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <div className={styles.formRow}>

          <div className={styles.formCol}>
            <input
              type="text"
              placeholder="Nom du projet"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <input
              type="text"
              placeholder="Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          {/*le champ « ID de l'utilisateur » est supprimé */}

          <div className={styles.formCol}>
            <button type="submit">Créer</button>
            <button type="button" onClick={onClose}>Annuler</button>
          </div>

          <div>
            {errorMessage && <p style={{ color: "red", fontWeight: "bold" }}>{errorMessage}</p>}
          </div>

        </div>
      </form>
    </div>
  );
}

export default FormulaireAjouProjet;