"use client";
import React, { useState, useEffect } from "react";
import { Bar, Line, Doughnut } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from "chart.js";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import io from "socket.io-client";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

const users = [{ username: "usertester", password: "tester" }];

const AuthWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isUserAuthenticated, setIsUserAuthenticated] = useState(false);
  const [username, setUsername] = useState("");
  const [username2, setUsername2] = useState("");
  const [password, setPassword] = useState("");
  const [password2, setPassword2] = useState("");
  const [metrics, setMetrics] = useState<any>(null);
  const [activeUsers, setActiveUsers] = useState(0);
  const API_URL = process.env.NEXT_PUBLIC_API_URL_DEV;
  const router = useRouter();

  useEffect(() => {
    const authState = localStorage.getItem("isAuthenticated");
    const authUserState = localStorage.getItem("isUserAuthenticated");
    if (authState === "true") {
      setIsAuthenticated(true);
      fetchMetrics(); // Fetch metrics when authenticated
      setupWebSocket(); // Configurar WebSocket
    } else if (authUserState === "true") {
      setIsUserAuthenticated(true);
      setupWebSocket(); // Configurar WebSocket
    }
  }, []);

  const setupWebSocket = () => {
    const socket = io(API_URL || ""); // Conectar con el servidor WebSocket

    // Recibir actualizaciones sobre usuarios activos
    socket.on("usersUpdate", (count: number) => {
      setActiveUsers(count); // Actualizar el estado con el número de usuarios activos
    });

    return () => {
      socket.disconnect(); // Desconectar el WebSocket cuando el componente se desmonta
    };
  };

  const handleAdminLogin = () => {
    if (
      (username === "ayax" && password === "admin") ||
      (username === "admin" && password === "admin")
    ) {
      setIsAuthenticated(true);
      localStorage.setItem("isAuthenticated", "true");
      fetchMetrics(); // Fetch metrics when authenticated
      setupWebSocket(); // Configurar WebSocket
    } else {
      alert("Invalid credentials for Admin");
    }
  };

  const handleUserLogin = () => {
    const user = users.find(
      (user) => user.username === username2 && user.password === password2
    );
    if (user) {
      setIsUserAuthenticated(true);
      localStorage.setItem("isUserAuthenticated", "true");
      setupWebSocket(); // Configurar WebSocket
    } else {
      alert("Invalid credentials for User");
    }
  };

  const fetchMetrics = async () => {
    try {
      const response = await fetch(`${API_URL}/metrics`);
      const data = await response.json();
      setMetrics(data);
    } catch (error) {
      console.error("Error fetching metrics:", error);
    } finally {
      // Call fetchMetrics again after 30 seconds
      setTimeout(fetchMetrics, 30000);
    }
  };

  // Initial call to fetchMetrics
  useEffect(() => {
    fetchMetrics();
  }, []);

  const logout = () => {
    setIsAuthenticated(false);
    setIsUserAuthenticated(false);
    localStorage.removeItem("isAuthenticated");
    localStorage.removeItem("isUserAuthenticated");
    router.push("/");
  };

  if (!isAuthenticated && !isUserAuthenticated) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 space-y-10">
        {/* Admin Login Form */}
        <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-sm">
          <h1 className="text-2xl font-semibold mb-6">Admin Login</h1>
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full p-2 mb-4 border rounded-lg"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-2 mb-4 border rounded-lg"
          />
          <button
            onClick={handleAdminLogin}
            className="w-full bg-blue-500 text-white p-2 rounded-lg"
          >
            Login as Admin
          </button>
        </div>

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

  if (isAuthenticated) {
    if (!metrics) {
      return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
          <div className="text-xl font-semibold">Loading metrics...</div>
        </div>
      );
    }

    const userMetricsData = {
      labels: ["Total Users", "Content Creators"],
      datasets: [
        {
          label: "Users",
          data: [metrics.userCount, metrics.contentCreatorCount],
          backgroundColor: ["#4CAF50", "#FF9800"],
        },
      ],
    };

    const activeUsersData = {
      labels: ["DAU", "WAU", "MAU", "Current"],
      datasets: [
        {
          label: "Active Users",
          data: [metrics.dau, metrics.wau, metrics.mau, activeUsers], // Agregar usuarios activos en tiempo real
          backgroundColor: "#2196F3",
        },
      ],
    };

    const articlesByCategoryData = {
      labels: metrics.articlesByCategory.map((item: any) => item.category_name),
      datasets: [
        {
          label: "Articles by Category",
          data: metrics.articlesByCategory.map((item: any) =>
            parseInt(item.count, 10)
          ),
          backgroundColor: "#FFC107",
        },
      ],
    };

    const retentionRateData = {
      labels: ["Retention Rate"],
      datasets: [
        {
          label: "Retention Rate",
          data: [metrics.retentionRate],
          backgroundColor: ["#FF6384"],
        },
      ],
    };

    const averageReadTimeData = {
      labels: ["Average Read Time"],
      datasets: [
        {
          label: "Average Read Time",
          data: [
            metrics.averageReadTime.average !== null
              ? metrics.averageReadTime.average
              : 0,
          ],
          backgroundColor: ["#36A2EB"],
        },
      ],
    };

    const savedArticlesData = {
      labels: metrics.savedArticles.map((item: any) => item.title),
      datasets: [
        {
          label: "Saved Articles",
          data: metrics.savedArticles.map((item: any) =>
            parseInt(item.count, 10)
          ),
          backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56"],
        },
      ],
    };

    return (
      <div className="min-h-screen bg-gray-100 p-4">
        <header className="flex items-center justify-end p-4">
          <Button
            onClick={logout}
            className="bg-primary text-white rounded-full hover:bg-primary/80"
          >
            Cerrar Sesión
          </Button>
        </header>
        <h1 className="text-3xl font-semibold mb-6 text-center">
          Metrics Dashboard
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-white p-4 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">User Metrics</h2>
            <Bar data={userMetricsData} />
          </div>
          <div className="bg-white p-4 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">Active Users</h2>
            <Line data={activeUsersData} />
          </div>
          <div className="bg-white p-4 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">Articles by Category</h2>
            <Bar data={articlesByCategoryData} />
          </div>
          <div className="bg-white p-4 rounded-lg shadow-md ">
            <h2 className="text-xl font-semibold mb-4">Retention Rate</h2>
            <Doughnut data={retentionRateData} />
          </div>
          <div className="bg-white p-4 rounded-lg shadow-md ">
            <h2 className="text-xl font-semibold mb-4">Average Read Time</h2>
            <Doughnut data={averageReadTimeData} />
          </div>
          <div className="bg-white p-4 rounded-lg shadow-md ">
            <h2 className="text-xl font-semibold mb-4">Saved Articles</h2>
            <Doughnut data={savedArticlesData} />
          </div>
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
