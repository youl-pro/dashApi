import { useState, useEffect } from "react";
import Navbar from "./components/navbar/Navbar";
import Sidebar from "./components/sidebar/sidebar";
import DashComponents from "./components/dashboard/dashbordComponents";
import Task from "./components/task/Task";
import Important from "./components/important/Important";
import Notification from "./components/notifications/Notification";
import Setting from "./components/settings/Settings";
import Projects from "./components/projects/Projects";
import LoginPage from "./components/loginPage/loginPage";
import RegisterPage from "./components/loginPage/RegisterPage"; 

function App() {
  const [currentPage, setCurrentPage] = useState("dashboard");
  const [notifications, setNotifications] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  //l'utilisateur connecté (null = personne n'est connecté)
  const [user, setUser] = useState(null);
  // la page affichée quand on n'est pas connecté ("login" ou "register")
  const [authPage, setAuthPage] = useState("login");

  function handleMarkAsRead(id) {
    fetch(`https://localhost:7038/api/Notifications/${id}/read`, {
      method: "PATCH",
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Erreur lors du marquage comme lu");
        }
        setNotifications(
          notifications.map((n) => (n.id === id ? { ...n, isRead: true } : n))
        );
      })
      .catch((error) => console.error(error));
  }

  useEffect(() => {
    fetch("https://localhost:7038/api/Notifications")
      .then((response) => response.json())
      .then((data) => setNotifications(data))
      .catch((error) => console.error(error));
  }, []);

  function handleDelete(id) {
    fetch(`https://localhost:7038/api/notifications/${id}`, {
      method: "DELETE",
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Erreur lors de la suppression");
        }
        setNotifications(notifications.filter((notification) => notification.id !== id));
      })
      .catch((error) => console.error(error));
  }

  // si personne n'est connecté, on affiche la connexion ou l'inscription.
  // Ce bloc est APRÈS tous les useState et useEffect (règle de React : les hooks
  // ne doivent jamais être sautés par un return).
  if (user === null) {
    return authPage === "login" ? (
      <LoginPage
        onConnecte={setUser}
        onAllerInscription={() => setAuthPage("register")}
      />
    ) : (
      <RegisterPage onAllerConnexion={() => setAuthPage("login")} />
    );
  }

  return (
    <div className="Container">
      <Navbar
        notifications={notifications}
        setCurrentPage={setCurrentPage}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
      />

      <div className="content">
        <Sidebar setCurrentPage={setCurrentPage} />

        <div className="affiche">
          {currentPage === "dashboard" && (
            <div id="dashboard">
              <DashComponents setCurrentPage={setCurrentPage} />
            </div>
          )}

         {currentPage === "task" && <Task searchTerm={searchTerm} userId={user.id} />}

          {currentPage === "important" && <Important />}

          {currentPage === "projects" && <Projects searchTerm={searchTerm} userId={user.id} />}

          {currentPage === "settings" && <Setting />}

          {currentPage === "notifications" && (
            <Notification
              onDelete={handleDelete}
              onMarkAsRead={handleMarkAsRead}
              notifications={notifications}
            />
          )}
        </div>
      </div>
    </div>
  );
}

export default App;