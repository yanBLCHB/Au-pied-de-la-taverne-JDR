import { useState } from "react";
import { apiFetch } from "../utils/api";

interface Props {
  onTableCreated: (table: any) => void;
}

export default function CreateTableForm({ onTableCreated }: Props) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    maxPlayers: 4,
    sessionDate: "",
    restrictedToAdherents: false,
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;
    if (type === "checkbox") {
      const target = e.target as HTMLInputElement;
      setFormData({ ...formData, [name]: target.checked });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async () => {
    if (!formData.name || !formData.description || !formData.sessionDate) {
      alert("Veuillez remplir tous les champs requis");
      return;
    }

    setIsLoading(true);
    try {
      const table = await apiFetch("/table", {
        method: "POST",
        body: JSON.stringify(formData),
      });
      onTableCreated(table);
      setFormData({
        name: "",
        description: "",
        maxPlayers: 4,
        sessionDate: "",
        restrictedToAdherents: false,
      });
      setIsExpanded(false);
    } catch (err: any) {
      alert(err.message || "Une erreur est survenue lors de la création de la table");
    } finally {
      setIsLoading(false);
    }
  };

  if (!isExpanded) {
    return (
      <div style={{ textAlign: "center", marginBottom: "30px" }}>
        <button
          onClick={() => setIsExpanded(true)}
          style={{
            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            color: "white",
            border: "none",
            padding: "15px 30px",
            borderRadius: "10px",
            cursor: "pointer",
            fontSize: "1.1rem",
            fontWeight: "600",
            boxShadow: "0 5px 15px rgba(102, 126, 234, 0.3)",
          }}
        >
          🎲 Créer une Nouvelle Table de Jeu
        </button>
        <p style={{ color: "#ffffffff", marginTop: "15px", fontSize: "0.9rem" }}>
          Rassemblez vos compagnons d'aventure pour une session épique !
        </p>
      </div>
    );
  }

  return (
    <div
      style={{
        background: "white",
        borderRadius: "20px",
        boxShadow: "0 20px 40px rgba(0,0,0,0.1)",
        padding: "30px",
        maxWidth: "800px",
        margin: "0 auto 30px",
      }}
    >
      <h2 style={{ fontSize: "1.5rem", marginBottom: "20px", color: "#2d3748", textAlign: "center" }}>
        🎭 Nouvelle Aventure
      </h2>
      <p style={{ color: "#718096", marginBottom: "25px", textAlign: "center" }}>
        Créez votre table de jeu et invitez vos compagnons
      </p>

      <form onSubmit={(e) => { e.preventDefault(); handleSubmit(); }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px", marginBottom: "20px" }}>
          <div>
            <label style={{ display: "block", fontWeight: "500", color: "#4a5568", marginBottom: "8px" }}>
              🏷️ Nom de l'Aventure
            </label>
            <input
              name="name"
              placeholder="Ex: La Quête du Dragon d'Or"
              value={formData.name}
              onChange={handleChange}
              style={{
                width: "100%",
                padding: "12px 16px",
                border: "2px solid #e2e8f0",
                borderRadius: "10px",
                fontSize: "1rem",
                background: "#f7fafc",
              }}
              required
            />
          </div>

          <div>
            <label style={{ display: "block", fontWeight: "500", color: "#4a5568", marginBottom: "8px" }}>
              👥 Nombre Maximum de Joueurs
            </label>
            <input
              type="number"
              name="maxPlayers"
              min="2"
              max="8"
              value={formData.maxPlayers}
              onChange={handleChange}
              style={{
                width: "100%",
                padding: "12px 16px",
                border: "2px solid #e2e8f0",
                borderRadius: "10px",
                fontSize: "1rem",
                background: "#f7fafc",
              }}
            />
          </div>
        </div>

        <div style={{ marginBottom: "20px" }}>
          <label style={{ display: "block", fontWeight: "500", color: "#4a5568", marginBottom: "8px" }}>
            📖 Description de l'Aventure
          </label>
          <textarea
            name="description"
            placeholder="Décrivez votre scénario, l'univers, les défis qui attendent vos joueurs..."
            value={formData.description}
            onChange={handleChange}
            rows={4}
            style={{
              width: "100%",
              padding: "12px 16px",
              border: "2px solid #e2e8f0",
              borderRadius: "10px",
              fontSize: "1rem",
              background: "#f7fafc",
              resize: "none",
            }}
            required
          />
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px", marginBottom: "25px" }}>
          <div>
            <label style={{ display: "block", fontWeight: "500", color: "#4a5568", marginBottom: "8px" }}>
              📅 Date et Heure de Session
            </label>
            <input
              type="datetime-local"
              name="sessionDate"
              value={formData.sessionDate}
              onChange={handleChange}
              style={{
                width: "100%",
                padding: "12px 16px",
                border: "2px solid #e2e8f0",
                borderRadius: "10px",
                fontSize: "1rem",
                background: "#f7fafc",
              }}
              required
            />
          </div>

          <div>
            <label style={{ display: "block", fontWeight: "500", color: "#4a5568", marginBottom: "8px" }}>
              🔒 Restrictions
            </label>
            <div style={{ 
              display: "flex", 
              alignItems: "center", 
              padding: "12px 16px", 
              background: "#f7fafc", 
              borderRadius: "10px", 
              border: "2px solid #e2e8f0" 
            }}>
              <input
                type="checkbox"
                name="restrictedToAdherents"
                checked={formData.restrictedToAdherents}
                onChange={handleChange}
                style={{ marginRight: "10px" }}
              />
              <span style={{ color: "#4a5568", fontSize: "0.9rem" }}>
                Réservé aux adhérents de la guilde
              </span>
            </div>
          </div>
        </div>

        <div style={{ display: "flex", gap: "15px" }}>
          <button
            type="submit"
            disabled={isLoading}
            style={{
              flex: "1",
              background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              color: "white",
              border: "none",
              padding: "14px 20px",
              borderRadius: "10px",
              cursor: "pointer",
              fontSize: "1rem",
              fontWeight: "600",
              opacity: isLoading ? "0.6" : "1",
            }}
          >
            {isLoading ? "🎯 Création..." : "🎯 Créer l'Aventure"}
          </button>
          
          <button
            type="button"
            onClick={() => {
              setFormData({
                name: "",
                description: "",
                maxPlayers: 4,
                sessionDate: "",
                restrictedToAdherents: false,
              });
              setIsExpanded(false);
            }}
            style={{
              background: "#e2e8f0",
              color: "#4a5568",
              border: "none",
              padding: "14px 20px",
              borderRadius: "10px",
              cursor: "pointer",
              fontSize: "1rem",
              fontWeight: "600",
            }}
          >
            ❌ Annuler
          </button>
        </div>
      </form>
    </div>
  );
}
