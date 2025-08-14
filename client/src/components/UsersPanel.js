import React, { useEffect, useState } from "react";

function UsersPanel() {
  // List of users from the server
  const [users, setUsers] = useState([]);
  // Input field for creating/updating a username
  const [username, setUsername] = useState("");
  // Tracks the user currently being edited (null means adding new)
  const [editingUser, setEditingUser] = useState(null);

  // Retrieve all users from the backend
  const fetchUsers = async () => {
    try {
      const res = await fetch("/api/users");
      if (!res.ok) throw new Error("Failed to fetch users");
      const data = await res.json();
      setUsers(data);
    } catch (err) {
      console.error("❌ Error fetching users:", err);
    }
  };

  // Load users on initial render
  useEffect(() => {
    fetchUsers();
  }, []);

  // Create a new user or update an existing one
  const handleAddOrUpdate = async () => {
    try {
      const url = editingUser ? `/api/users/${editingUser.id}` : "/api/users";
      const method = editingUser ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username }),
      });

      if (!res.ok) throw new Error("Failed to save user");

      // Reset form state and refresh list
      setUsername("");
      setEditingUser(null);
      fetchUsers();
    } catch (err) {
      console.error("❌ Error adding/updating user:", err);
    }
  };

  // Fill the input with the selected user's data for editing
  const handleEdit = (user) => {
    setUsername(user.username);
    setEditingUser(user);
  };

  // Delete a user after confirmation
  const handleDelete = async (id) => {
    if (!window.confirm("Delete user?")) return;
    try {
      const res = await fetch(`/api/users/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete user");
      fetchUsers();
    } catch (err) {
      console.error("❌ Error deleting user:", err);
    }
  };

  return (
    <div style={{ padding: "2rem", maxWidth: "500px", margin: "0 auto" }}>
      <h2>User Management</h2>

      {/* Username input */}
      <input
        type="text"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        placeholder="Enter username"
        style={{ width: "100%", padding: "0.5rem", marginBottom: "1rem" }}
      />

      {/* Add/Update button changes label depending on mode */}
      <button onClick={handleAddOrUpdate}>
        {editingUser ? "Update User" : "Add User"}
      </button>

      {/* List of users with Edit/Delete controls */}
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
