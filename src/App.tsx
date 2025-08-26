import { useState, useEffect } from "react";

// Types
interface Table {
  _id: string;
  name: string;
  players: string[];
}

function App() {
  const [tables, setTables] = useState<Table[]>([]);
  const [newTableName, setNewTableName] = useState("");

  // Charger les tables depuis le backend
  useEffect(() => {
    fetch("http://localhost:5000/table")
      .then((res) => res.json())
      .then((data) => setTables(data))
      .catch((err) => console.error("Erreur chargement tables:", err));
  }, []);

  // Créer une nouvelle table
  const addTable = async () => {
    if (!newTableName.trim()) return;

    const res = await fetch("http://localhost:5000/table", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: newTableName }),
    });

    const table = await res.json();
    setTables([...tables, table]);
    setNewTableName("");
  };

  // Ajouter un joueur
  const addPlayer = async (tableId: string, playerName: string) => {
    if (!playerName.trim()) return;

    const res = await fetch(`http://localhost:5000/table/${tableId}/players`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ playerName }),
    });

    const updatedTable = await res.json();

    // Mettre à jour la table dans le state
    setTables(
      tables.map((t) => (t._id === updatedTable._id ? updatedTable : t))
    );
  };

  return (
    <div style={{ padding: "20px", fontFamily: "Arial" }}>
      <h1>🎲 Mini JDR - Tables de jeu (MongoDB)</h1>

      {/* Formulaire création table */}
      <div>
        <input
          type="text"
          placeholder="Nom de la table"
          value={newTableName}
          onChange={(e) => setNewTableName(e.target.value)}
        />
        <button onClick={addTable}>Créer la table</button>
      </div>

      <hr />

      {/* Liste des tables */}
      {tables.map((table) => (
        <div
          key={table._id}
          style={{
            border: "1px solid #ccc",
            padding: "10px",
            marginBottom: "10px",
          }}
        >
          <h2>{table.name}</h2>
          <ul>
            {table.players.map((player, i) => (
              <li key={i}>{player}</li>
            ))}
          </ul>

          {/* Formulaire ajout joueur */}
          <AddPlayerForm
            onAdd={(playerName) => addPlayer(table._id, playerName)}
          />
        </div>
      ))}
    </div>
  );
}

// 🔹 Composant formulaire ajout joueur
interface AddPlayerFormProps {
  onAdd: (playerName: string) => void;
}

function AddPlayerForm({ onAdd }: AddPlayerFormProps) {
  const [playerName, setPlayerName] = useState("");

  const handleAdd = () => {
    if (playerName.trim()) {
      onAdd(playerName);
      setPlayerName("");
    }
  };

  return (
    <div>
      <input
        type="text"
        placeholder="Nom du joueur"
        value={playerName}
        onChange={(e) => setPlayerName(e.target.value)}
      />
      <button onClick={handleAdd}>Ajouter joueur</button>
    </div>
  );
}

export default App;
