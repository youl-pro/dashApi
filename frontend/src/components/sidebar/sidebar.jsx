import { useState } from "react";
import styles from "./sidebar.module.css";

function Sidebar({ setCurrentPage }) {
  const [taskVisibility, setTaskVisibility] = useState(false);
  const [projectVisibility, setProjectVisibility] = useState(false);

  return (
    <div className={styles.sidebar}>
      <ul>
        <li>
          <button
            onClick={() => {
              setTaskVisibility((prev) => !prev);
            }}
          >
            Taskflow
          </button>

          {taskVisibility && (
            <ul>
              <li>
                <button
                  onClick={() => {
                    setCurrentPage("dashboard");
                  }}
                >
                  Dashboard
                </button>
              </li>

              <li>
                <button
                  onClick={() => {
                    setCurrentPage("task");
                  }}
                >
                  Task
                </button>
              </li>

              <li>
                <button
                  onClick={() => {
                    setCurrentPage("important");
                  }}
                >
                  Important
                </button>
              </li>
            </ul>
          )}
        </li>

        <li>
          <button
            onClick={() => {
              setProjectVisibility((prev) => !prev);
            }}
          >
            Projets
          </button>

          {projectVisibility && (
            <ul>
              <li>
                <button
                  onClick={() => {
                    setCurrentPage("projects");
                  }}
                >
                Projects
                </button>
              </li>
            </ul>
          )}
        </li>

        <li>
          <button
            onClick={() => {
              setCurrentPage("settings");
            }}
          >
            Settings
          </button>
        </li>
      </ul>
    </div>
  );
}

export default Sidebar;
