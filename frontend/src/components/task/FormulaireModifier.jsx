import { useState } from "react";
import styles from "./Formulaire.module.css";

// userId est reçu de Task (la personne connectée)
function FormulaireModifier({ task, userId, onClose, onTaskUpdated }) {
  const [title, setTitle] = useState(task.title);
  const [status, setStatus] = useState(task.status);
  const [priority, setPriority] = useState(task.priority);
  const [projectId, setProjectId] = useState(task.projectId);
  const [isImportant, setIsImportant] = useState(task.isImportant);
  const [errorMessage, setErrorMessage] = useState("");

  function handleSubmit(e) {
    e.preventDefault();

    if (!title || !status || !priority || !projectId) {
      setErrorMessage("Merci de remplir tous les champs!");
      return;
    }
    setErrorMessage("");

    //  ?userId=... pour que l'API vérifie que la tâche est bien à cet utilisateur
    fetch(`https://localhost:7038/api/taskitems/${task.id}?userId=${userId}`, {
      method: "PUT",
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
            // l'ancien message parlait d'un projet inexistant, ce qui n'est plus la seule cause
            setErrorMessage("Impossible de modifier la tâche.");
            throw new Error("Erreur lors de la modification");
          });
        }
        return response.json();
      })
      .then((data) => {
        onTaskUpdated(data);
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
            {/* readOnly, car l'API refuse de déplacer une tâche vers un autre projet */}
            <input type="number" placeholder="ID du projet" value={projectId} readOnly />
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
            <button type="submit">Update</button>
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

export default FormulaireModifier;