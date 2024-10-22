// components/AdminLogin.tsx
"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import "./admin.css";

const AdminLogin = () => {
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const response = await fetch("/api/auth", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name, password }),
    });

    if (!response.ok) {
      const data = await response.json();
      setError(data.error || "Login failed");
      return;
    } else {
      const data = await response.json();

      if (data.token) {
        localStorage.setItem("token", data.token);
      }

      // Redirect to the home page
      router.push("/");
    }

    // Handle successful login (e.g., redirect, show a success message, etc.)
    console.log("Login successful");
  };

  return (
    <form onSubmit={handleSubmit} className="form-group">
      <label>Name</label>
      <input
        placeholder="name"
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
      />

      <label>Password</label>
      <input
        type="password"
        placeholder="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />
      <button type="submit">Login</button>
      {error && <p style={{ color: "red" }}>{error}</p>}
    </form>
  );
};

export default AdminLogin;
