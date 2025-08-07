import React, { useEffect, useState } from "react";

function UsersPanel() {
  const [users, setUsers] = useState([]);
  const [username, setUsername] = useState("");
  const [editingUser, setEditingUser] = useState(null);

  const fetchUsers = async () => {
    const res = await fetch("/api/users");
    const data = await res.json();
    setUsers(data);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleAddOrUpdate = async () => {
    const url = editingUser ? `/api/users/${editingUser.id}` : "/api/users";
    const method = editingUser ? "PUT" : "POST";

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username }),
    });

    if (res.ok) {
      setUsername("");
      setEditingUser(null);
      fetchUsers();
    }
  };

  const handleEdit = (user) => {
    setUsername(user.username);
    setEditingUser(user);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete user?")) return;
    await fetch(`/api/users/${id}`, { method: "DELETE" });
    fetchUsers();
  };

  return (
    <div style={{ padding: "2rem", maxWidth: "500px", margin: "0 auto" }}>
      <h2>User Management</h2>

      <input
        type="text"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        placeholder="Enter username"
        style={{ width: "100%", padding: "0.5rem", marginBottom: "1rem" }}
      />
      <button onClick={handleAddOrUpdate}>
        {editingUser ? "Update User" : "Add User"}
      </button>

      <ul style={{ marginTop: "2rem" }}>
        {users.map((user) => (
          <li key={user.id} style={{ marginBottom: "0.5rem" }}>
            {user.username}{" "}
            <button onClick={() => handleEdit(user)}>Edit</button>{" "}
            <button onClick={() => handleDelete(user.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default UsersPanel;
