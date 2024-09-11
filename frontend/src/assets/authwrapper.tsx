"use client";
import React, { useState, useEffect } from "react";

const users = [{ username: "usertester", password: "tester" }];

const AuthWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isUserAuthenticated, setIsUserAuthenticated] = useState(false);

  const [username2, setUsername2] = useState("");

  const [password2, setPassword2] = useState("");

  useEffect(() => {
    const authState = localStorage.getItem("isAuthenticated");
    const authUserState = localStorage.getItem("isUserAuthenticated");
    if (authState === "true") {
      setIsAuthenticated(true);
    } else if (authUserState === "true") {
      setIsUserAuthenticated(true);
    }
  }, []);

  const handleUserLogin = () => {
    const user = users.find(
      (user) => user.username === username2 && user.password === password2
    );
    if (user) {
      setIsUserAuthenticated(true);
      localStorage.setItem("isUserAuthenticated", "true");
    } else {
      alert("Invalid credentials for User");
    }
  };

  if (!isAuthenticated && !isUserAuthenticated) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 space-y-10">
        {/* User Login Form */}
        <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-sm">
          <h1 className="text-2xl font-semibold mb-6">User Login</h1>
          <input
            type="text"
            placeholder="Username"
            value={username2}
            onChange={(e) => setUsername2(e.target.value)}
            className="w-full p-2 mb-4 border rounded-lg"
          />
          <input
            type="password"
            placeholder="Password"
            value={password2}
            onChange={(e) => setPassword2(e.target.value)}
            className="w-full p-2 mb-4 border rounded-lg"
          />
          <button
            onClick={handleUserLogin}
            className="w-full bg-green-500 text-white p-2 rounded-lg"
          >
            Login as User
          </button>
        </div>
      </div>
    );
  }

  if (isUserAuthenticated) {
    return <>{children}</>;
  }

  return null;
};

export default AuthWrapper;
