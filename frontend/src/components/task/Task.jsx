import { useEffect, useState } from "react";
import styles from "./task.module.css";
import FormulaireDAjout from "./FormulaireDAjout";
import FormulaireModifier from "./FormulaireModifier";

// userId est reçu de App.jsx (l'id de la personne connectée)
function Task({ searchTerm = "", userId }) {
  const [tasks, setTasks] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [taskUpdate, setTaskUpdate] = useState(null);

  useEffect(() => {
    // ?userId=... demande à l'API seulement les tâches des projets de cet utilisateur
    fetch(`https://localhost:7038/api/taskItems?userId=${userId}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Erreur lors de la récupération des tâches");
        }
        return response.json();
      })
      .then((data) => {
        setTasks(data);
      })
      .catch((error) => {
        console.error(error);
      });
  }, [userId]); // on recharge si l'utilisateur change

  function handleDelete(id) {
    // ?userId=... pour que l'API vérifie que la tâche est bien à cet utilisateur
    fetch(`https://localhost:7038/api/taskitems/${id}?userId=${userId}`, {
      method: "DELETE",
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Erreur lors de la suppression");
        }
        setTasks(tasks.filter((task) => task.id !== id));
      })
      .catch((error) => console.error(error));
  }

  const filteredTasks = tasks.filter((task) =>
    task.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div id="task">
      <div className={styles.title}>
        <h1>Task</h1>
        <button onClick={() => setShowForm(true)}>Insert</button>
        {showForm && (
          <FormulaireDAjout
            userId={userId} // le formulaire en a besoin pour créer la tâche
            onClose={() => setShowForm(false)}
            onTaskCreated={(newTask) => {
              setTasks([...tasks, newTask]);
              setShowForm(false);
            }}
          />
        )}
      </div>

      {!showForm && !taskUpdate && (
        <div>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Task</th>
                <th>Status</th>
                <th>Project lié</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredTasks.map((task) => (
                <tr key={task.id}>
                  <td>{task.title}</td>
                  <td>{task.status}</td>
                  <td>{task.projectId}</td>
                  <td>
                    <button onClick={() => setTaskUpdate(task)}>Update</button>{" "}
                    <button onClick={() => handleDelete(task.id)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {taskUpdate && (
        <FormulaireModifier
          task={taskUpdate}
          userId={userId} // le formulaire en a besoin pour modifier la tâche
          onClose={() => setTaskUpdate(null)}
          onTaskUpdated={(updatedTask) => {
            setTasks(tasks.map((t) => (t.id === updatedTask.id ? updatedTask : t)));
            setTaskUpdate(null);
          }}
        />
      )}
    </div>
  );
}

export default Task;