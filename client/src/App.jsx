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
        const b = await apiFetch("/beds");
        setBeds(b);
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

  if (loading) return <p>Loading...</p>;

  return (
    <div style={{ padding: 16 }}>
      <h1>Garden Buddy</h1>

      {!user ? (
        <AuthForm
          onAuthed={async (u) => {
            setUser(u);
            const b = await apiFetch("/beds");
            setBeds(b);
          }}
        />
      ) : (
        <>
          <p>
            Logged in as <strong>{user.username}</strong>{" "}
            <button onClick={logout}>Logout</button>
          </p>

          <BedsPage beds={beds} setBeds={setBeds} />
        </>
      )}
    </div>
  );
}
