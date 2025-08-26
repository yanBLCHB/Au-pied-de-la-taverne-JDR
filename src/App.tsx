import { useState, useEffect } from "react";

// Types
interface Table {
  _id: string;
  name: string;
  description: string;
  mj: string;
  players: string[];
  status: "En préparation" | "En cours" | "Terminée";
  restrictedToAdherents: boolean;
  maxPlayers: number;
  sessionDate: string;
  createdAt: string;
}

function App() {
  const [tables, setTables] = useState<Table[]>([]);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    mj: "",
    maxPlayers: 4,
    sessionDate: "",
    restrictedToAdherents: false,
    status: "En préparation" as "En préparation" | "En cours" | "Terminée",
  });

  // Charger les tables depuis le backend
  useEffect(() => {
    fetch("http://localhost:5000/table")
      .then((res) => res.json())
      .then((data) => setTables(data))
      .catch((err) => console.error("Erreur chargement tables:", err));
  }, []);

  // Gérer les champs du formulaire
  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  // Créer une nouvelle table
  const addTable = async () => {
    if (!formData.name.trim() || !formData.mj.trim() || !formData.sessionDate) {
      alert("Veuillez remplir tous les champs obligatoires");
      return;
    }

    try {
      const res = await fetch("http://localhost:5000/table", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        const errData = await res.json();
        alert("Erreur : " + errData.error);
        return;
      }

      const table = await res.json();
      setTables([...tables, table]);

      setFormData({
        name: "",
        description: "",
        mj: "",
        maxPlayers: 4,
        sessionDate: "",
        restrictedToAdherents: false,
        status: "En préparation",
      });
    } catch (err) {
      alert("Erreur réseau");
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 p-6 font-sans">
      <h1 className="text-4xl font-extrabold text-center mb-10 text-gray-800">
        🎲 Gestion des Tables JDR
      </h1>

      {/* Formulaire */}
      <div className="max-w-xl mx-auto bg-white p-8 rounded-2xl shadow-xl space-y-6 mb-12">
        <h2 className="text-2xl font-semibold text-gray-700">
          Créer une nouvelle table
        </h2>

        {/* Nom */}
        <div>
          <label className="block text-gray-600 mb-1">Nom *</label>
          <input
            type="text"
            name="name"
            placeholder="Nom de la table"
            value={formData.name}
            onChange={handleChange}
            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-400 outline-none"
          />
        </div>

        {/* Description */}
        <div>
          <label className="block text-gray-600 mb-1">Description</label>
          <textarea
            name="description"
            placeholder="Description de la table"
            value={formData.description}
            onChange={handleChange}
            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-400 outline-none"
          />
        </div>

        {/* MJ */}
        <div>
          <label className="block text-gray-600 mb-1">
            MJ (ID utilisateur) *
          </label>
          <input
            type="text"
            name="mj"
            placeholder="ID du MJ"
            value={formData.mj}
            onChange={handleChange}
            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-400 outline-none"
          />
        </div>

        {/* Nombre max */}
        <div>
          <label className="block text-gray-600 mb-1">
            Nombre max de joueurs *
          </label>
          <input
            type="number"
            name="maxPlayers"
            min="1"
            value={formData.maxPlayers}
            onChange={handleChange}
            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-400 outline-none"
          />
        </div>

        {/* Date */}
        <div>
          <label className="block text-gray-600 mb-1">Date de session *</label>
          <input
            type="datetime-local"
            name="sessionDate"
            value={formData.sessionDate}
            onChange={handleChange}
            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-400 outline-none"
          />
        </div>

        {/* Statut */}
        <div>
          <label className="block text-gray-600 mb-1">Statut</label>
          <select
            name="status"
            value={formData.status}
            onChange={handleChange}
            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-400 outline-none"
          >
            <option value="En préparation">En préparation</option>
            <option value="En cours">En cours</option>
            <option value="Terminée">Terminée</option>
          </select>
        </div>

        {/* Checkbox */}
        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            name="restrictedToAdherents"
            checked={formData.restrictedToAdherents}
            onChange={handleChange}
            className="w-5 h-5"
          />
          <span>Réservé aux adhérents</span>
        </div>

        {/* Bouton */}
        <button
          onClick={addTable}
          className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-blue-700 transition shadow-lg"
        >
          ➕ Créer la table
        </button>
      </div>

      {/* Liste des tables */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {tables.map((table) => (
          <div
            key={table._id}
            className="bg-white p-6 rounded-2xl shadow-md hover:shadow-xl transition"
          >
            <h2 className="text-xl font-bold text-gray-800 mb-2">
              {table.name}
            </h2>
            <p className="text-gray-600 mb-2">{table.description}</p>
            <p className="text-sm text-gray-500">
              MJ: {table.mj} | {table.players?.length ?? 0}/{table.maxPlayers}{" "}
              joueurs
            </p>
            <p className="text-sm text-gray-500">
              Date: {new Date(table.sessionDate).toLocaleString()}
            </p>
            <p className="text-sm">
              <span
                className={`px-2 py-1 rounded ${
                  table.status === "En cours"
                    ? "bg-green-200 text-green-800"
                    : table.status === "Terminée"
                    ? "bg-gray-300 text-gray-700"
                    : "bg-yellow-200 text-yellow-800"
                }`}
              >
                {table.status}
              </span>
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
