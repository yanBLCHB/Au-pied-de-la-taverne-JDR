import { useEffect, useState } from "react";
import AuthForm from "./components/AuthForm";
import TableForm from "./components/TableForm";
import { apiFetch } from "./utils/api";

function App() {
  const [user, setUser] = useState<any>(null);
  const [tables, setTables] = useState<any[]>([]);

  // Charger utilisateur connecté (si token en localStorage)
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      apiFetch("/auth/me")
        .then(setUser)
        .catch(() => localStorage.removeItem("token"));
    }
  }, []);

  // Charger tables
  useEffect(() => {
    apiFetch("/table")
      .then(setTables)
      .catch((err) => console.error(err));
  }, []);

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <AuthForm onAuthSuccess={setUser} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-3xl font-bold text-center mb-6">
        🎲 Bienvenue {user.username}
      </h1>

      <TableForm onTableCreated={(t) => setTables([...tables, t])} />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
        {tables.map((table) => (
          <div key={table._id} className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-bold">{table.name}</h2>
            <p>{table.description}</p>
            <p>
              Joueurs: {table.players?.length ?? 0}/{table.maxPlayers}
            </p>
            <p>Date: {new Date(table.sessionDate).toLocaleString()}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
