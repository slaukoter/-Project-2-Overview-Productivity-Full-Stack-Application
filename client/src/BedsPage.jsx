import { useState } from "react";
import { apiFetch } from "./api";

export default function BedsPage({ beds, setBeds }) {
  const [name, setName] = useState("");
  const [location, setLocation] = useState("");
  const [error, setError] = useState("");

  async function addBed(e) {
    e.preventDefault();
    setError("");
    try {
      const newBed = await apiFetch("/beds", {
        method: "POST",
        body: JSON.stringify({ name, location }),
      });
      setBeds((prev) => [...prev, newBed]);
      setName("");
      setLocation("");
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <div>
      <h2>Your Beds</h2>

      <form
        onSubmit={addBed}
        style={{ display: "flex", gap: 8, marginBottom: 12 }}
      >
        <input
          placeholder="Bed name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          placeholder="Location (optional)"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
        />
        <button>Add</button>
      </form>

      {error && <p style={{ color: "crimson" }}>{error}</p>}

      <ul>
        {beds.map((b) => (
          <li key={b.id}>
            <strong>{b.name}</strong> {b.location ? `— ${b.location}` : ""}
          </li>
        ))}
      </ul>
    </div>
  );
}
