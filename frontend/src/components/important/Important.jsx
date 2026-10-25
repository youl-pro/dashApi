import { useState, useEffect } from "react";
import styles from "./important.module.css";

function Important() {
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    fetch("https://localhost:7038/api/taskItems")
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
  }, []);

  return (
    <div id="important">
      <div className={styles.title}>
        <h1> Tâches importants</h1>
      </div>

      <ul className={styles.list}>
        {tasks
          .filter((task) => task.isImportant)
          .map((task) => (
            <li key={task.id}>{task.title}</li>
          ))}
      </ul>
    </div>
  );
}

export default Important;