import { useState } from "react";
import { apiFetch } from "../utils/api";

interface Props {
  onTableCreated: (table: any) => void;
}

export default function TableForm({ onTableCreated }: Props) {
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
    const { name, value, type, checked } = e.target;
    setFormData({ ...formData, [name]: type === "checkbox" ? checked : value });
  };

  const handleSubmit = async () => {
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
    } catch (err: any) {
      alert(err.message);
    }
  };

  return (
    <div className="max-w-lg mx-auto bg-white p-6 rounded-lg shadow-md space-y-3">
      <h2 className="text-xl font-bold mb-4">Créer une nouvelle table</h2>
      <input
        name="name"
        placeholder="Nom"
        value={formData.name}
        onChange={handleChange}
        className="w-full p-2 border rounded"
      />
      <textarea
        name="description"
        placeholder="Description"
        value={formData.description}
        onChange={handleChange}
        className="w-full p-2 border rounded"
      />
      <input
        type="number"
        name="maxPlayers"
        value={formData.maxPlayers}
        onChange={handleChange}
        className="w-full p-2 border rounded"
      />
      <input
        type="datetime-local"
        name="sessionDate"
        value={formData.sessionDate}
        onChange={handleChange}
        className="w-full p-2 border rounded"
      />
      <label className="flex items-center space-x-2">
        <input
          type="checkbox"
          name="restrictedToAdherents"
          checked={formData.restrictedToAdherents}
          onChange={handleChange}
        />
        <span>Réservé aux adhérents</span>
      </label>
      <button
        onClick={handleSubmit}
        className="w-full bg-green-600 text-white p-2 rounded hover:bg-green-700"
      >
        ➕ Créer
      </button>
    </div>
  );
}
