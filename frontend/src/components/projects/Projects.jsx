import styles from "./projects.module.css";
import { useState, useEffect } from "react";
import FormulaireAjouProjet from "./FormulaireAjouProjet";

// userId est reçu de App.jsx (l'id de la personne connectée)
function Projects({ searchTerm = "", userId }) {
  const [projects, setProjects] = useState([]);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    // ?userId=... dit à l'API de renvoyer seulement les projets de cet utilisateur
    fetch(`https://localhost:7038/api/Projects?userId=${userId}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Erreur lors de la récupération des projets");
        }
        return response.json();
      })
      .then((data) => {
        setProjects(data);
      })
      .catch((error) => {
        console.error(error);
      });
  }, [userId]); //on recharge si l'utilisateur change

  function handleDelete(id) {
    // ?userId=... pour que l'API vérifie que le projet est bien à cet utilisateur
    fetch(`https://localhost:7038/api/projects/${id}?userId=${userId}`, {
      method: "DELETE",
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Erreur lors de la suppression");
        }
        setProjects(projects.filter((project) => project.id !== id));
      })
      .catch((error) => console.error(error));
  }

  const filteredProjects = projects.filter((project) =>
    project.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div id="projets">
      <div className={styles.title}>
        <h1>Projets</h1>
        <button onClick={() => setShowForm(true)}>Ajouter</button>
      </div>

      {showForm && (
        <FormulaireAjouProjet
          userId={userId} //le formulaire en a besoin pour créer le projet
          onClose={() => setShowForm(false)}
          onProjectCreated={(newProject) => {
            setProjects([...projects, newProject]);
            setShowForm(false);
          }}
        />
      )}

      {!showForm && (
        <div>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>ID</th>
                <th>Projet</th>
                <th>Description</th>
                <th>Date de creation</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {filteredProjects.map((project) => (
                <tr key={project.id}>
                  <td>{project.id}</td>
                  <td>{project.name}</td>
                  <td>{project.description}</td>
                  <td>{new Date(project.createdAt).toLocaleDateString("fr-CA")}</td>
                  <td>
                    <button onClick={() => handleDelete(project.id)}>Supprimer</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default Projects;