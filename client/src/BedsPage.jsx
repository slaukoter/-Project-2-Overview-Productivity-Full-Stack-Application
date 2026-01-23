import { useState } from "react";
import { apiFetch } from "./api";

export default function BedsPage({ beds, setBeds, loadBeds }) {
  const [name, setName] = useState("");
  const [location, setLocation] = useState("");
  const [error, setError] = useState("");

  const [openBedId, setOpenBedId] = useState(null);
  const [openPlantId, setOpenPlantId] = useState(null);

  // Plant form state
  const [plantName, setPlantName] = useState("");
  const [plantVariety, setPlantVariety] = useState("");
  const [plantNotes, setPlantNotes] = useState("");

  // Log form state
  const [careType, setCareType] = useState("water");
  const [logDate, setLogDate] = useState("");
  const [logNotes, setLogNotes] = useState("");

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

  async function addPlant(e, bedId) {
    e.preventDefault();
    setError("");

    if (!plantName.trim()) {
      setError("Plant name is required");
      return;
    }

    try {
      await apiFetch("/plants", {
        method: "POST",
        body: JSON.stringify({
          name: plantName,
          variety: plantVariety || null,
          notes: plantNotes || null,
          bed_id: bedId,
        }),
      });

      await loadBeds(1, 10);

      setPlantName("");
      setPlantVariety("");
      setPlantNotes("");
    } catch (err) {
      setError(err.message);
    }
  }

  async function deletePlant(plantId) {
    setError("");
    try {
      await apiFetch(`/plants/${plantId}`, { method: "DELETE" });
      await loadBeds(1, 10);
      if (openPlantId === plantId) setOpenPlantId(null);
    } catch (err) {
      setError(err.message);
    }
  }

  async function addLog(e, plantId) {
    e.preventDefault();
    setError("");

    const payload = {
      care_type: careType,
      notes: logNotes || null,
    };
    if (logDate.trim()) payload.date = logDate.trim();

    try {
      await apiFetch(`/plants/${plantId}/logs`, {
        method: "POST",
        body: JSON.stringify(payload),
      });

      await loadBeds(1, 10);

      setCareType("water");
      setLogDate("");
      setLogNotes("");
    } catch (err) {
      setError(err.message);
    }
  }

  async function deleteLog(logId) {
    setError("");
    try {
      await apiFetch(`/logs/${logId}`, { method: "DELETE" });
      await loadBeds(1, 10);
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <div className="stack">
      <div className="row" style={{ justifyContent: "space-between" }}>
        <h2 style={{ margin: 0 }}>Your Beds</h2>
        <span className="badge">{beds.length} total</span>
      </div>

      <form onSubmit={addBed} className="row">
        <input
          className="input"
          placeholder="Bed name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          style={{ flex: "1 1 220px" }}
        />
        <input
          className="input"
          placeholder="Location (optional)"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          style={{ flex: "1 1 220px" }}
        />
        <button className="button buttonPrimary" type="submit">
          Add Bed
        </button>
      </form>

      {error && <p className="error">{error}</p>}

      <ul className="list">
        {beds.map((b) => (
          <li key={b.id} className="card">
            <div className="cardHeader">
              <div className="row">
                <button
                  className="button"
                  type="button"
                  onClick={() => {
                    const next = openBedId === b.id ? null : b.id;
                    setOpenBedId(next);
                    setOpenPlantId(null);
                  }}
                >
                  {openBedId === b.id ? "Hide" : "View"}
                </button>

                <div>
                  <div style={{ fontWeight: 700 }}>{b.name}</div>
                  <div className="subtle">
                    {b.location ? b.location : "No location set"}
                  </div>
                </div>
              </div>

              <span className="badge">
                {b.plants?.length ? `${b.plants.length} plants` : "0 plants"}
              </span>
            </div>

            {openBedId === b.id && (
              <>
                <div className="divider" />

                <div className="stack">
                  <h4 style={{ margin: 0 }}>Plants</h4>

                  {b.plants?.length ? (
                    <ul className="list">
                      {b.plants.map((p) => (
                        <li key={p.id} className="card">
                          <div className="cardHeader">
                            <div className="row">
                              <button
                                className="button"
                                type="button"
                                onClick={() =>
                                  setOpenPlantId(
                                    openPlantId === p.id ? null : p.id
                                  )
                                }
                              >
                                {openPlantId === p.id ? "Hide" : "Logs"}
                              </button>

                              <div>
                                <div style={{ fontWeight: 700 }}>{p.name}</div>
                                <div className="subtle">
                                  {p.variety ? p.variety : "No variety"}
                                </div>
                              </div>
                            </div>

                            <button
                              className="button buttonDanger"
                              type="button"
                              onClick={() => deletePlant(p.id)}
                            >
                              Delete Plant
                            </button>
                          </div>

                          {openPlantId === p.id && (
                            <>
                              <div className="divider" />

                              <div className="stack">
                                <div
                                  className="row"
                                  style={{ justifyContent: "space-between" }}
                                >
                                  <h5 style={{ margin: 0 }}>Care Logs</h5>
                                  <span className="badge">
                                    {p.care_logs?.length
                                      ? `${p.care_logs.length} logs`
                                      : "0 logs"}
                                  </span>
                                </div>

                                {p.care_logs?.length ? (
                                  <ul className="list">
                                    {p.care_logs.map((log) => (
                                      <li key={log.id} className="card">
                                        <div
                                          className="row"
                                          style={{
                                            justifyContent: "space-between",
                                          }}
                                        >
                                          <div>
                                            <div style={{ fontWeight: 700 }}>
                                              {log.care_type}
                                              <span className="subtle">
                                                {"  "}({log.date})
                                              </span>
                                            </div>
                                            {log.notes ? (
                                              <div className="subtle">
                                                {log.notes}
                                              </div>
                                            ) : (
                                              <div className="subtle">
                                                No notes
                                              </div>
                                            )}
                                          </div>

                                          <button
                                            className="button buttonDanger"
                                            type="button"
                                            onClick={() => deleteLog(log.id)}
                                          >
                                            Delete
                                          </button>
                                        </div>
                                      </li>
                                    ))}
                                  </ul>
                                ) : (
                                  <p className="subtle" style={{ margin: 0 }}>
                                    No care logs yet.
                                  </p>
                                )}

                                <form
                                  onSubmit={(e) => addLog(e, p.id)}
                                  className="stack"
                                >
                                  <select
                                    className="select"
                                    value={careType}
                                    onChange={(e) =>
                                      setCareType(e.target.value)
                                    }
                                  >
                                    <option value="water">water</option>
                                    <option value="fertilize">fertilize</option>
                                    <option value="prune">prune</option>
                                  </select>

                                  <input
                                    className="input"
                                    placeholder="Date (YYYY-MM-DD) optional"
                                    value={logDate}
                                    onChange={(e) => setLogDate(e.target.value)}
                                  />

                                  <input
                                    className="input"
                                    placeholder="Notes (optional)"
                                    value={logNotes}
                                    onChange={(e) =>
                                      setLogNotes(e.target.value)
                                    }
                                  />

                                  <button
                                    className="button buttonPrimary"
                                    type="submit"
                                  >
                                    Add Care Log
                                  </button>
                                </form>
                              </div>
                            </>
                          )}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="subtle" style={{ margin: 0 }}>
                      No plants yet.
                    </p>
                  )}

                  <div className="divider" />

                  <h4 style={{ margin: 0 }}>Add a Plant</h4>

                  <form
                    onSubmit={(e) => addPlant(e, b.id)}
                    className="stack"
                    style={{ maxWidth: 420 }}
                  >
                    <input
                      className="input"
                      placeholder="Plant name (required)"
                      value={plantName}
                      onChange={(e) => setPlantName(e.target.value)}
                    />
                    <input
                      className="input"
                      placeholder="Variety (optional)"
                      value={plantVariety}
                      onChange={(e) => setPlantVariety(e.target.value)}
                    />
                    <input
                      className="input"
                      placeholder="Notes (optional)"
                      value={plantNotes}
                      onChange={(e) => setPlantNotes(e.target.value)}
                    />
                    <button className="button buttonPrimary" type="submit">
                      Add Plant
                    </button>
                  </form>
                </div>
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
