import { useState } from "react";
import { apiFetch } from "../utils/api";

interface Props {
  onAuthSuccess: (user: any) => void;
}

export default function AuthForm({ onAuthSuccess }: Props) {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
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
      }
    } catch (err: any) {
      alert(err.message);
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-4">
        {isLogin ? "Connexion" : "Inscription"}
      </h2>

      {!isLogin && (
        <input
          name="username"
          placeholder="Pseudo"
          value={formData.username}
          onChange={handleChange}
          className="w-full p-2 mb-2 border rounded"
        />
      )}
      <input
        name="email"
        type="email"
        placeholder="Email"
        value={formData.email}
        onChange={handleChange}
        className="w-full p-2 mb-2 border rounded"
      />
      <input
        name="password"
        type="password"
        placeholder="Mot de passe"
        value={formData.password}
        onChange={handleChange}
        className="w-full p-2 mb-4 border rounded"
      />

      <button
        onClick={handleSubmit}
        className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700"
      >
        {isLogin ? "Se connecter" : "S’inscrire"}
      </button>

      <p className="text-sm mt-3 text-center">
        {isLogin ? "Pas de compte ?" : "Déjà inscrit ?"}{" "}
        <button className="text-blue-600" onClick={() => setIsLogin(!isLogin)}>
          {isLogin ? "Créer un compte" : "Se connecter"}
        </button>
      </p>
    </div>
  );
}
