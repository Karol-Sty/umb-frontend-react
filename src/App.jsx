import { useEffect, useState } from "react";

function App() {
  const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:8080";
  const API = `${API_BASE}/index.php`;

  const [tareas, setTareas] = useState([]);
  const [titulo, setTitulo] = useState("");

  useEffect(() => {
    cargar();
  }, []);

  async function cargar() {
    try {
      const res = await fetch(API);
      const data = await res.json();
      setTareas(data);
    } catch (e) {
      console.error(e);
    }
  }

  async function agregar(e) {
    e.preventDefault();
    if (!titulo.trim()) return;
    await fetch(API, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ titulo }),
    });
    setTitulo("");
    cargar();
  }

  async function toggle(t) {
    await fetch(API, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: t.id, completada: !t.completada }),
    });
    cargar();
  }

  async function eliminar(id) {
    await fetch(`${API}?id=${id}`, { method: "DELETE" });
    cargar();
  }

  return (
    <div style={{ padding: 20, maxWidth: 700, margin: "auto" }}>
      <h1>Lista de tareas</h1>
      <form onSubmit={agregar}>
        <input
          value={titulo}
          onChange={(e) => setTitulo(e.target.value)}
          placeholder="Nueva tarea..."
        />
        <button>Agregar</button>
      </form>
      <ul>
        {tareas.map((t) => (
          <li
            key={t.id}
            style={{ display: "flex", gap: 8, alignItems: "center" }}
          >
            <input
              type="checkbox"
              checked={t.completada}
              onChange={() => toggle(t)}
            />
            <span
              style={{ textDecoration: t.completada ? "line-through" : "none" }}
            >
              {t.titulo}
            </span>
            <button onClick={() => eliminar(t.id)}>Eliminar</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
