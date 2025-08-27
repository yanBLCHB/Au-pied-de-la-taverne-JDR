import { useState } from "react";
import { apiFetch } from "../utils/api";

interface Props {
  onAuthSuccess: (user: any) => void;
}

export default function AuthForm({ onAuthSuccess }: Props) {
  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    if (
      !formData.email ||
      !formData.password ||
      (!isLogin && !formData.username)
    ) {
      alert("Veuillez remplir tous les champs requis");
      return;
    }

    setIsLoading(true);
    try {
      if (isLogin) {
        const data = await apiFetch("/auth/login", {
          method: "POST",
          body: JSON.stringify({
            email: formData.email,
            password: formData.password,
          }),
        });
        localStorage.setItem("token", data.token);
        onAuthSuccess(data.user);
      } else {
        await apiFetch("/auth/register", {
          method: "POST",
          body: JSON.stringify(formData),
        });
        alert("Inscription réussie, connectez-vous !");
        setIsLogin(true);
        setFormData({ username: "", email: "", password: "" });
      }
    } catch (err: any) {
      alert(err.message || "Une erreur est survenue");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container">
      <h1 className="title">🏰 Au Pied de la Taverne</h1>
      <p className="subtitle">
        {isLogin ? "Accédez à vos aventures" : "Rejoignez la communauté des aventuriers"}
      </p>

      <form onSubmit={(e) => { e.preventDefault(); handleSubmit(); }}>
        {!isLogin && (
          <div className="form-group">
            <label className="label">Nom d'Aventurier</label>
            <input
              name="username"
              placeholder="Votre nom d'aventurier"
              value={formData.username}
              onChange={handleChange}
              className="input"
              required
            />
          </div>
        )}

        <div className="form-group">
          <label className="label">Email</label>
          <input
            name="email"
            type="email"
            placeholder="votre@email.com"
            value={formData.email}
            onChange={handleChange}
            className="input"
            required
          />
        </div>

        <div className="form-group">
          <label className="label">Mot de Passe</label>
          <input
            name="password"
            type="password"
            placeholder="Votre mot de passe"
            value={formData.password}
            onChange={handleChange}
            className="input"
            required
          />
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="button"
        >
          {isLoading ? (
            <>
              <span className="loading"></span>
              {isLogin ? "Connexion..." : "Inscription..."}
            </>
          ) : (
            <>
              {isLogin ? "🚪 Se connecter" : "📜 S'inscrire"}
            </>
          )}
        </button>
      </form>

      <div className="switch-form">
        <p className="switch-text">
          {isLogin ? "Nouveau dans la région ?" : "Déjà un aventurier ?"}
        </p>
        <button
          onClick={() => {
            setIsLogin(!isLogin);
            setFormData({ username: "", email: "", password: "" });
          }}
          className="switch-button"
        >
          {isLogin ? "📜 Créer un compte" : "🔑 Se connecter"}
        </button>
      </div>
    </div>
  );
}
