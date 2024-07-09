//Landing page WIPc
"use client";
import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Cookie from "universal-cookie";
import Header from "@/assets/header";
import Image from "next/image";
import ProjectCard from "@/assets/draft";
import Footer from "@/assets/footer";
import Info from "@/assets/card";

const cookies = new Cookie();

const HomePage: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<{ username: string } | null>(null);
  const router = useRouter();
  
  useEffect(() => {
    const token = cookies.get("token");
    if (token) {
      fetchUserSession(token);
    }
  }, []);

  const fetchUserSession = async (token: string) => {
    try {
      const response = await fetch("http://localhost:4000/users/session", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setUser(data.user);
        setIsAuthenticated(true);
      } else {
        console.error("Failed to fetch user session");
      }
    } catch (error) {
      console.error("Error fetching user session:", error);
    }
  };

  const logout = () => {
    setIsAuthenticated(false);
    setUser(null);
    cookies.remove("token");
  };

  return (
    <div className="bg-customColor-innovatio">
      <Header isAuthenticated={isAuthenticated} />
      <h1>
        {isAuthenticated ? `Logged in as ${user?.username}` : "Not logged in"}
      </h1>
      <Button onClick={logout}>Logout</Button>
      <Link href="/test">
        <Button className="rounded-full">Signup</Button>
      </Link>
      <section>
        <h1 className="font-bold text-customColor-innovatio3 text-7xl flex-col mx-auto justify-between w-[600px]">
          Invest and found
        </h1>
        <p className="text-gray-500 text-xl flex-col mx-auto justify-between w-[600px]">
          Help different crowdfunding campaigns become a <br />
          reality thanks to your contributions, invest in projects,
          <br /> fund purposes and get rewards.
        </p>
      </section>
      <Image
        src="/Saly-1.png"
        alt="personas"
        height={500}
        width={500}
        className="mx-auto justify-between items-end flex-col mb-8 mr-8 rounded-sm"
      />
      <Info
        onNext={function (): void {
          throw new Error("Function not implemented.");
        }}
      />
      <ProjectCard
        status={""}
        category={""}
        title={""}
        description={""}
        raised={0}
        target={0}
        milestones={0}
      />
      <Footer />
    </div>
  );
};

export default HomePage;
