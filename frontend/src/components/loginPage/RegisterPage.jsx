import { useState } from "react";
import "./LoginPage.css"; // on réutilise le style de la page de connexion

// onAllerConnexion : une fonction reçue de App, pour revenir à la page de connexion
function RegisterPage({ onAllerConnexion }) {
  // Un état par champ du formulaire
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  // Le message affiché sous le bouton, et l'état d'attente
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleRegister(event) {
    event.preventDefault(); // empêche le rechargement de la page à l'envoi du formulaire
    setMessage("");
    setLoading(true);

    try {
      // POST vers l'API : c'est CreateUser, la route d'inscription
      const response = await fetch("https://localhost:7038/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: name, email: email, password: password }),
      });

      if (!response.ok) {
        // L'API répond par un texte (ex. "Ce courriel est déjà utilisé.")
        const texte = await response.text();
        setMessage(texte && !texte.startsWith("{") ? texte : "Inscription impossible.");
        return;
      }

      // Succès : on vide le formulaire et on confirme
      setMessage("Compte créé ! Vous pouvez maintenant vous connecter.");
      setName("");
      setEmail("");
      setPassword("");
    } catch (error) {
      console.error("Erreur d'inscription :", error);
      setMessage("Impossible de joindre l'API.");
    } finally {
      setLoading(false); // dans tous les cas, on arrête l'état d'attente
    }
  }

  return (
    <div className="login-page">
      <div className="login-card">
        <h1>Inscription</h1>

        <form onSubmit={handleRegister}>
          <label htmlFor="name" className="form-label">Nom</label>
          <input
            type="text"
            id="name"
            className="form-control"
            value={name}
            onChange={(event) => setName(event.target.value)}
            required
          />

          <label htmlFor="email" className="form-label mt-3">Adresse courriel</label>
          <input
            type="email"
            id="email"
            className="form-control"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
          />

          <label htmlFor="password" className="form-label mt-3">Mot de passe</label>
          <input
            type="password"
            id="password"
            className="form-control"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            minLength={6}
            required
          />

          <button type="submit" className="btn btn-primary w-100 mt-4" disabled={loading}>
            {loading ? "Création..." : "Créer mon compte"}
          </button>

          {message && <p className="mt-3" role="status">{message}</p>}

          {/* type="button" : ce bouton ne soumet pas le formulaire */}
          <button type="button" className="btn btn-link w-100 mt-2" onClick={onAllerConnexion}>
            Déjà un compte ? Se connecter
          </button>
        </form>
      </div>
    </div>
  );
}

export default RegisterPage;