import { useState } from "react";
import { apiFetch } from "./api";

export default function AuthForm({ onAuthed }) {
  const [mode, setMode] = useState("login");
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
    <div className="panel" style={{ maxWidth: 360, margin: "0 auto" }}>
      <h2>{mode === "login" ? "Log in" : "Register"}</h2>

      <form onSubmit={handleSubmit} className="stack">
        <input
          className="input"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          autoComplete="username"
        />

        <input
          className="input"
          placeholder="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoComplete={mode === "login" ? "current-password" : "new-password"}
        />

        <button className="button buttonPrimary" disabled={loading}>
          {loading
            ? "Loading..."
            : mode === "login"
            ? "Log in"
            : "Create account"}
        </button>
      </form>

      {error && <p className="error">{error}</p>}

      <button
        type="button"
        className="button"
        style={{ marginTop: 8 }}
        onClick={() => setMode(mode === "login" ? "register" : "login")}
      >
        Switch to {mode === "login" ? "Register" : "Login"}
      </button>
    </div>
  );
}
