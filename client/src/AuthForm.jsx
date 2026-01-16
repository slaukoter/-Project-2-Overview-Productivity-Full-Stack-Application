import { useState } from "react";
import { apiFetch } from "./api";

export default function AuthForm({ onAuthed }) {
  const [mode, setMode] = useState("login"); // or "register"
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const user = await apiFetch(mode === "login" ? "/login" : "/register", {
        method: "POST",
        body: JSON.stringify({ username, password }),
      });
      onAuthed(user);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ maxWidth: 360 }}>
      <h2>{mode === "login" ? "Log in" : "Register"}</h2>

      <form onSubmit={handleSubmit} style={{ display: "grid", gap: 8 }}>
        <input
          placeholder="username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          autoComplete="username"
        />
        <input
          placeholder="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoComplete={mode === "login" ? "current-password" : "new-password"}
        />
        <button disabled={loading}>
          {loading
            ? "Loading..."
            : mode === "login"
            ? "Log in"
            : "Create account"}
        </button>
      </form>

      {error && <p style={{ color: "crimson" }}>{error}</p>}

      <button
        type="button"
        onClick={() => setMode(mode === "login" ? "register" : "login")}
        style={{ marginTop: 8 }}
      >
        Switch to {mode === "login" ? "Register" : "Login"}
      </button>
    </div>
  );
}
