import { useState } from "react";
import styles from "./Formulaire.module.css";

// userId est reçu de Task (la personne connectée)
function FormulaireDAjout({ userId, onClose, onTaskCreated }) {
  const [title, setTitle] = useState("");
  const [status, setStatus] = useState("");
  const [priority, setPriority] = useState("");
  const [projectId, setProjectId] = useState("");
  const [isImportant, setIsImportant] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  function handleSubmit(e) {
    e.preventDefault();

    if (!title || !status || !priority || !projectId) {
      setErrorMessage("Merci de remplir tous les champs!");
      return;
    }
    setErrorMessage("");

    // ?userId=... permet à l'API de vérifier que le projet est bien à cet utilisateur
    fetch(`https://localhost:7038/api/taskitems?userId=${userId}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: title,
        status: status,
        priority: priority,
        isImportant: isImportant,
        projectId: parseInt(projectId),
      }),
    })
      .then((response) => {
        if (!response.ok) {
          return response.text().then((text) => {
            console.error("Erreur serveur :", text);
            //  on affiche le message de l'API (« Projet introuvable. ») s'il est lisible
            setErrorMessage(
              text && !text.startsWith("{") ? text : "Impossible de créer la tâche."
            );
            throw new Error("Erreur lors de la création");
          });
        }
        return response.json();
      })
      .then((data) => {
        onTaskCreated(data);
      })
      .catch((error) => console.error(error));
  }

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <div className={styles.formRow}>

          <div className={styles.formCol}>
            <input type="text" placeholder="Titre" value={title} onChange={(e) => setTitle(e.target.value)} />
            <input type="text" placeholder="Statut" value={status} onChange={(e) => setStatus(e.target.value)} />
          </div>

          <div className={styles.formCol}>
            <input type="text" placeholder="Priorité" value={priority} onChange={(e) => setPriority(e.target.value)} />
            <input type="number" placeholder="ID du projet" value={projectId} onChange={(e) => setProjectId(e.target.value)} />
          </div>

          <div className={styles.formCol}>
            <label>
              <input
                type="checkbox"
                checked={isImportant}
                onChange={(e) => setIsImportant(e.target.checked)}
              />
              Marquer comme importante
            </label>
          </div>

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

export default FormulaireDAjout;