import { useState } from "react";

// Définition des types
interface Table {
  name: string;
  players: string[];
}

function App() {
  const [tables, setTables] = useState<Table[]>([]);
  const [newTableName, setNewTableName] = useState<string>("");

  // Ajouter une nouvelle table
  const addTable = () => {
    if (!newTableName.trim()) return;
    setTables([...tables, { name: newTableName, players: [] }]);
    setNewTableName("");
  };

  // Ajouter un joueur à une table
  const addPlayer = (index: number, playerName: string) => {
    if (!playerName.trim()) return;
    const updatedTables = [...tables];
    updatedTables[index].players.push(playerName);
    setTables(updatedTables);
  };

  return (
    <div style={{ padding: "20px", fontFamily: "Arial" }}>
      <h1>🎲 Mini JDR - Tables de jeu</h1>

      {/* Formulaire de création de table */}
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
      {tables.map((table, index) => (
        <div
          key={index}
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

          {/* Ajouter un joueur */}
          <AddPlayerForm onAdd={(playerName) => addPlayer(index, playerName)} />
        </div>
      ))}
    </div>
  );
}

// Composant séparé : formulaire d'ajout de joueur
interface AddPlayerFormProps {
  onAdd: (playerName: string) => void;
}

function AddPlayerForm({ onAdd }: AddPlayerFormProps) {
  const [playerName, setPlayerName] = useState<string>("");

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
