import { useState } from "react";
import "./LoginPage.css";

function LoginPage({ onConnecte, onAllerInscription }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleLogin(event) {
    event.preventDefault();
    setMessage("");
    setLoading(true);

    try {
      const response = await fetch(
        "https://localhost:7038/api/users/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: email,
            password: password,
          }),
        }
      );

      const data = await response.json().catch(() => null);

      if (!response.ok) {
        throw new Error(
          typeof data === "string"
            ? data
            : data?.message ||
              data?.title ||
              "Courriel ou mot de passe incorrect."
        );
      }

      setMessage(`Connexion réussie ! Bienvenue ${data.name}.`);
      console.log("Réponse du serveur :", data);
         onConnecte(data);
    } catch (error) {
      console.error("Erreur de connexion :", error);

      setMessage(
        error.message === "Failed to fetch"
          ? "Impossible de joindre l'API. Vérifie le certificat HTTPS et la configuration CORS."
          : error.message
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="login-page">
      <div className="login-card">
        <h1>Connexion</h1>

        <form onSubmit={handleLogin}>
          <label htmlFor="email" className="form-label">
            Adresse courriel
          </label>

          <input
            type="email"
            id="email"
            className="form-control"
            placeholder="nom@exemple.com"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
          />

          <label htmlFor="password" className="form-label mt-3">
            Mot de passe
          </label>

          <input
            type="password"
            id="password"
            className="form-control"
            placeholder="Entrez votre mot de passe"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required
          />

          <button
            type="submit"
            className="btn btn-primary w-100 mt-4"
            disabled={loading}
          >
            {loading ? "Connexion..." : "Se connecter"}
          </button>
 
 <button type="button" className="btn btn-link w-100 mt-2" onClick={onAllerInscription}>
  Pas de compte ? S'inscrire
</button>
          {message && (
            <p className="mt-3" role="status">
              {message}
            </p>
          )}
        </form>
      </div>
    </div>
  );
}

export default LoginPage;
