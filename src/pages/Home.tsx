import { useEffect, useMemo, useState } from "react";
type Note = { id: number; title: string; body: string; updated: string };

const steps = [
  "Create the shell",
  "Make it installable",
  "Make it offline",
  "Test the boundary",
  "Deploy it",
];

const starterNotes: Note[] = [
  {
    id: 1,
    title: "What makes a PWA?",
    body: "A manifest, a service worker, and a reliable user experience.",
    updated: "Today",
  },
];

export default function Home() {
  const [notes, setNotes] = useState<Note[]>(() => {
    try {
      return JSON.parse(localStorage.getItem("notes") || "null") || starterNotes;
    } catch {
      return starterNotes;
    }
  });

  const [done, setDone] = useState<number[]>([]);
  const [online, setOnline] = useState(navigator.onLine);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");

  const progress = useMemo(
    () => Math.round((done.length / steps.length) * 100),
    [done]
  );

  useEffect(() => {
    localStorage.setItem("notes", JSON.stringify(notes));
  }, [notes]);

  useEffect(() => {
    const on = () => setOnline(true);
    const off = () => setOnline(false);

    window.addEventListener("online", on);
    window.addEventListener("offline", off);

    return () => {
      window.removeEventListener("online", on);
      window.removeEventListener("offline", off);
    };
  }, []);

  function addNote() {
    if (!title.trim() || !body.trim()) return;

    setNotes([
      { id: Date.now(), title: title.trim(), body: body.trim(), updated: "Just now" },
      ...notes,
    ]);

    setTitle("");
    setBody("");
  }

  return (
    <div className="shell">
      <div style={{
  textAlign: "center",
  padding: "12px 20px",
  borderBottom: "1px solid #ddd",
  background: "#f8f9fa"
}}>
  <strong>Afolayan Fahad Olamilekan</strong>
  <div>Electrical Engineering</div>
  <div>Matric No: 2024/1/97308EE</div>
</div>
      <header>
        <span className="brand">Offline Notes Lab</span>
        <span className="status">{online ? "Online" : "Offline"}</span>
      </header>

      <div className="layout">
        <aside>
          <div className="workshop">
            <p className="eyebrow">WORKSHOP MAP</p>
            <div className="steps">
              {steps.map((step, index) => (
                <button
                  key={step}
                  className={done.includes(index) ? "step done" : "step"}
                  onClick={() =>
                    setDone((current) =>
                      current.includes(index)
                        ? current.filter((x) => x !== index)
                        : [...current, index]
                    )
                  }
                >
                  {done.includes(index) ? "✓ " : `${index + 1}. `}
                  {step}
                </button>
              ))}
            </div>
            <div className="progress-wrap">
              <div className="progress">
                <div className="progress-bar" style={{ width: `${progress}%` }} />
              </div>
              <small>{progress}% complete</small>
            </div>
          </div>

          <small className="aside-small">
            FOUNDATION TRACK
          </small>
        </aside>

        <main>
          <section className="hero">
            <h1>Keep learning when the network leaves.</h1>
            <p className="lede">
              Save a note, refresh the page, then test the same experience with
              the network turned off.
            </p>
          </section>

          <section className="columns">
            <section className="notes-panel">
              <div className="section-title">
                <span className="eyebrow">Notes from the lab</span>
              </div>
              <div className="notes-list">
                {notes.map((note) => (
                  <article className="note" key={note.id}>
                    <h3>{note.title}</h3>
                    <p>{note.body}</p>
                    <small>{note.updated}</small>
                  </article>
                ))}
              </div>
            </section>

            <section className="form-panel">
              <form
                className="note-form"
                onSubmit={(event) => {
                  event.preventDefault();
                  addNote();
                }}
              >
                <h2>Write a note</h2>
                <label>
                  Title
                  <input
                    type="text"
                    value={title}
                    onChange={(event) => setTitle(event.target.value)}
                  />
                </label>
                <label>
                  Observation
                  <textarea
                    value={body}
                    onChange={(event) => setBody(event.target.value)}
                    rows={5}
                  />
                </label>
                <button type="submit">Save locally</button>
              </form>
            </section>
          </section>
        </main>
      </div>
    </div>
  );
}
