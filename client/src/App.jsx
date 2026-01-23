import { useEffect, useState } from "react";
import { apiFetch } from "./api";
import AuthForm from "./AuthForm";
import BedsPage from "./BedsPage";

export default function App() {
  const [user, setUser] = useState(null);
  const [beds, setBeds] = useState([]);
  const [loading, setLoading] = useState(true);

  async function loadBeds(page = 1, perPage = 10) {
    const data = await apiFetch(`/beds?page=${page}&per_page=${perPage}`);
    setBeds(data.items);
  }

  useEffect(() => {
    async function boot() {
      try {
        const u = await apiFetch("/check_session");
        setUser(u);
        await loadBeds();
      } catch {
        // not logged in
      } finally {
        setLoading(false);
      }
    }
    boot();
  }, []);

  async function logout() {
    await apiFetch("/logout", { method: "DELETE" });
    setUser(null);
    setBeds([]);
  }

  if (loading) {
    return (
      <div className="container">
        <div className="panel">
          <p className="subtle">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <header className="header">
        <h1 className="title">Garden Buddy</h1>
        <span className="subtle">
          {user ? `Logged in as ${user.username}` : "Please log in"}
        </span>
      </header>

      <div className="panel">
        {!user ? (
          <AuthForm
            onAuthed={async (u) => {
              setUser(u);
              await loadBeds();
            }}
          />
        ) : (
          <>
            <div className="row space-between">
              <span className="subtle">Session authenticated</span>
              <button className="button buttonDanger" onClick={logout}>
                Logout
              </button>
            </div>

            <div className="divider" />

            <BedsPage beds={beds} setBeds={setBeds} loadBeds={loadBeds} />
          </>
        )}
      </div>
    </div>
  );
}
