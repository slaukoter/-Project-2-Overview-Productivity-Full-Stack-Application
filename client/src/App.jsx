import { useEffect, useState } from "react";
import { apiFetch } from "./api";
import AuthForm from "./AuthForm";
import BedsPage from "./BedsPage";

export default function App() {
  const [user, setUser] = useState(null);
  const [beds, setBeds] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function boot() {
      try {
        const u = await apiFetch("/check_session");
        setUser(u);

        const data = await apiFetch("/beds?page=1&per_page=10");
        setBeds(data.items);
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
      <div className="header">
        <h1 className="title">Garden Buddy</h1>
        {user ? (
          <span className="subtle">Logged in as {user.username}</span>
        ) : (
          <span className="subtle">Please log in</span>
        )}
      </div>

      <div className="panel">
        {!user ? (
          <AuthForm
            onAuthed={async (u) => {
              setUser(u);
              const data = await apiFetch("/beds?page=1&per_page=10");
              setBeds(data.items);
            }}
          />
        ) : (
          <>
            <div className="row" style={{ justifyContent: "space-between" }}>
              <span className="subtle">Session authenticated</span>
              <button className="button buttonDanger" onClick={logout}>
                Logout
              </button>
            </div>

            <div className="divider" />

            <BedsPage beds={beds} setBeds={setBeds} />
          </>
        )}
      </div>
    </div>
  );
}
