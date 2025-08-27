import { useEffect, useState } from "react";
import AuthForm from "./components/AuthForm";
import CreateTableForm from "./components/CreateTableForm";
import { apiFetch } from "./utils/api";

function App() {
  const [user, setUser] = useState<any>(null);
  const [tables, setTables] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Charger utilisateur connecté (si token en localStorage)
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      apiFetch("/auth/me")
        .then(setUser)
        .catch(() => localStorage.removeItem("token"))
        .finally(() => setIsLoading(false));
    } else {
      setIsLoading(false);
    }
  }, []);

  // Charger tables quand l'utilisateur est connecté
  useEffect(() => {
    if (user) {
      apiFetch("/table")
        .then(setTables)
        .catch((err) => console.error("Erreur chargement tables:", err));
    }
  }, [user]);

  if (isLoading) {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        }}
      >
        <div style={{ color: "white", textAlign: "center" }}>
          <div
            style={{
              width: "40px",
              height: "40px",
              border: "4px solid rgba(255,255,255,0.3)",
              borderTop: "4px solid white",
              borderRadius: "50%",
              animation: "spin 1s linear infinite",
              margin: "0 auto 20px",
            }}
          ></div>
          <p>Chargement...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <AuthForm onAuthSuccess={setUser} />;
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        padding: "20px",
      }}
    >
      {/* Header avec déconnexion */}
      <div
        style={{
          background: "white",
          borderRadius: "20px",
          boxShadow: "0 20px 40px rgba(0,0,0,0.1)",
          padding: "30px",
          maxWidth: "1200px",
          margin: "0 auto 20px",
          textAlign: "center",
        }}
      >
        <h1
          style={{ fontSize: "2rem", marginBottom: "20px", color: "#2d3748" }}
        >
          🎉 Bienvenue {user.username} !
        </h1>
        <p style={{ color: "#718096", marginBottom: "20px" }}>
          Vous êtes maintenant connecté à votre espace JDR.
        </p>
        <button
          onClick={() => {
            localStorage.removeItem("token");
            setUser(null);
          }}
          style={{
            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            color: "white",
            border: "none",
            padding: "12px 24px",
            borderRadius: "10px",
            cursor: "pointer",
            fontSize: "1rem",
          }}
        >
          🚪 Se déconnecter
        </button>
      </div>

      {/* Formulaire de création de table */}
      <CreateTableForm
        onTableCreated={(newTable) => setTables([...tables, newTable])}
      />

      {/* Section des tables de jeu */}
      <div
        style={{
          background: "white",
          borderRadius: "20px",
          boxShadow: "0 20px 40px rgba(0,0,0,0.1)",
          padding: "30px",
          maxWidth: "1200px",
          margin: "0 auto",
        }}
      >
        <h2
          style={{
            fontSize: "1.5rem",
            marginBottom: "20px",
            color: "#2d3748",
            textAlign: "center",
          }}
        >
          🎲 Tables de Jeu Disponibles
        </h2>

        {tables.length === 0 ? (
          <div style={{ textAlign: "center", padding: "40px" }}>
            <div style={{ fontSize: "3rem", marginBottom: "20px" }}>🎭</div>
            <p style={{ color: "#718096", marginBottom: "10px" }}>
              Aucune table de jeu pour le moment
            </p>
            <p style={{ color: "#a0aec0" }}>
              Soyez le premier à créer une aventure !
            </p>
          </div>
        ) : (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
              gap: "20px",
            }}
          >
            {tables.map((table) => (
              <div
                key={table._id}
                style={{
                  background: "#f7fafc",
                  border: "2px solid #e2e8f0",
                  borderRadius: "15px",
                  padding: "20px",
                  transition: "all 0.3s ease",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-5px)";
                  e.currentTarget.style.boxShadow =
                    "0 10px 25px rgba(0,0,0,0.1)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = "none";
                }}
              >
                <h3
                  style={{
                    fontSize: "1.2rem",
                    marginBottom: "15px",
                    color: "#2d3748",
                    fontWeight: "600",
                  }}
                >
                  {table.name}
                </h3>
                <p
                  style={{
                    color: "#4a5568",
                    marginBottom: "15px",
                    lineHeight: "1.5",
                  }}
                >
                  {table.description}
                </p>
                <div style={{ marginBottom: "15px" }}>
                  <span
                    style={{
                      background: "#667eea",
                      color: "white",
                      padding: "4px 12px",
                      borderRadius: "20px",
                      fontSize: "0.8rem",
                      fontWeight: "500",
                    }}
                  >
                    👥 {table.players?.length || 0}/{table.maxPlayers} joueurs
                  </span>
                </div>
                <div
                  style={{
                    color: "#718096",
                    fontSize: "0.9rem",
                    marginBottom: "15px",
                  }}
                >
                  📅{" "}
                  {new Date(table.sessionDate).toLocaleDateString("fr-FR", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </div>
                {table.restrictedToAdherents && (
                  <div
                    style={{
                      color: "#667eea",
                      fontSize: "0.9rem",
                      marginBottom: "15px",
                    }}
                  >
                    🔒 Réservé aux adhérents
                  </div>
                )}
                <div style={{ display: "flex", gap: "10px" }}>
                  <button
                    style={{
                      flex: "1",
                      background:
                        "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                      color: "white",
                      border: "none",
                      padding: "10px",
                      borderRadius: "8px",
                      cursor: "pointer",
                      fontSize: "0.9rem",
                      fontWeight: "500",
                    }}
                  >
                    🎯 Rejoindre
                  </button>
                  <button
                    style={{
                      background: "#e2e8f0",
                      color: "#4a5568",
                      border: "none",
                      padding: "10px",
                      borderRadius: "8px",
                      cursor: "pointer",
                      fontSize: "0.9rem",
                      fontWeight: "500",
                    }}
                  >
                    👁️ Voir
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
