"use client";
import React, { useState, useEffect } from "react";

const users = [
  { username: "admin", password: "admin" },
  { username: "ayax", password: "test" },
  { username: "user2", password: "password2" },
  { username: "user3", password: "password3" },
  { username: "user4", password: "password4" },
  { username: "user5", password: "password5" },
  { username: "user6", password: "password6" },
  { username: "user7", password: "password7" },
  { username: "user8", password: "password8" },
  { username: "user9", password: "password9" },
  { username: "user10", password: "password10" },
  { username: "user11", password: "password11" },
  { username: "user12", password: "password12" },
  { username: "user13", password: "password13" },
  { username: "user14", password: "password14" },
  { username: "user15", password: "password15" },
  { username: "user16", password: "password16" },
];

const AuthWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    const authState = localStorage.getItem("isAuthenticated");
    if (authState === "true") {
      setIsAuthenticated(true);
    }
  }, []);

  const handleLogin = () => {
    const user = users.find(
      (user) => user.username === username && user.password === password
    );
    if (user) {
      setIsAuthenticated(true);
      localStorage.setItem("isAuthenticated", "true");
    } else {
      alert("Invalid credentials");
    }
  };

  if (isAuthenticated) {
    return <>{children}</>;
  }

  return (
    <div className="auth-wrapper">
      <div className="auth-form">
        <h1>Login</h1>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="auth-input"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="auth-input"
        />
        <button onClick={handleLogin} className="auth-button">
          Login
        </button>
      </div>
    </div>
  );
};

export default AuthWrapper;
