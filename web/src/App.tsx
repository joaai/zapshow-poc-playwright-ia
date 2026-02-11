import React, { useEffect, useState } from "react";

const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:3001";

export default function App() {
  const [token, setToken] = useState<string | null>(null);
  const [events, setEvents] = useState<any[]>([]);

  useEffect(() => {
    if (token) fetchEvents();
  }, [token]);

  async function fetchEvents() {
    const res = await fetch(`${API_BASE}/events`);
    const data = await res.json();
    setEvents(data);
  }

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);
    const email = formData.get("email")?.toString() || "";
    const password = formData.get("password")?.toString() || "";
    const res = await fetch(`${API_BASE}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    if (res.ok) {
      const body = await res.json();
      setToken(body.token);
    } else {
      alert("login failed");
    }
  }

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);
    const title = formData.get("title")?.toString() || "";
    const description = formData.get("description")?.toString() || "";
    const res = await fetch(`${API_BASE}/events`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, description }),
    });
    if (res.status === 201) {
      form.reset();
      fetchEvents();
    } else {
      alert("error creating");
    }
  }

  if (!token) {
    return (
      <main>
        <h1>Login</h1>
        <form onSubmit={handleLogin}>
          <label>
            Email
            <input name="email" type="email" aria-label="Email" />
          </label>
          <label>
            Password
            <input name="password" type="password" aria-label="Password" />
          </label>
          <button type="submit">Login</button>
        </form>
      </main>
    );
  }

  return (
    <main>
      <h1>Events</h1>
      <form onSubmit={handleCreate} aria-label="create-event-form">
        <label>
          Title
          <input name="title" aria-label="Title" />
        </label>
        <label>
          Description
          <input name="description" aria-label="Description" />
        </label>
        <button type="submit">Create Event</button>
      </form>

      <ul>
        {events.map((e) => (
          <li key={e.id}>
            {e.title} — {e.description}
          </li>
        ))}
      </ul>
    </main>
  );
}
