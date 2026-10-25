import styles from "./dashboard.module.css";
import {
  ListTodo,
  Star,
  Globe,
  ShieldCheck,
  Settings,
} from "lucide-react";

function DashComponents({ setCurrentPage }) {
  return (
    <div className={styles.dashComponents}>
      <div className={styles.iconeLigne}>
        <div className={styles.icone}>
          <h1>Tasks</h1>
          <ListTodo size={60} />
          <button onClick={() => setCurrentPage("task")}>Voir</button>
        </div>

        <div className={styles.icone}>
          <h1>Importants</h1>
          <Star size={60} />
          <button onClick={() => setCurrentPage("important")}>Voir</button>
        </div>
          <div className={styles.icone}>
          <h1>Projects</h1>
          <Globe size={60} />
          <button onClick={() => setCurrentPage("projects")}>Voir</button>
        </div>

     
      </div>

      <div className={styles.iconeLigne}>
        

        <div className={styles.icone}>
          <h1>Settings</h1>
          <Settings size={60} />
          <button onClick={() => setCurrentPage("settings")}>Voir</button>
        </div>
      </div>
    </div>
  );
}

export default DashComponents;
