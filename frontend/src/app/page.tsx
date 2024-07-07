"use client";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React from "react";

export default function Home() {
  const router = useRouter();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-white to-blue-50 text-center">
      <div className="absolute top-4 left-4 text-lg font-semibold">
        Innovatio Home
      </div>
      <header className="w-full py-4 bg-slate-900 shadow-md">
        <nav className="flex justify-between items-center container mx-auto px-4">
          <div className="text-2xl font-bold">innovatio</div>
          <ul className="flex space-x-6">
            <li>
              <a href="#" className="hover:text-blue-500">
                How it works
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-blue-500">
                About us
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-blue-500">
                Community
              </a>
            </li>
          </ul>
          <div className="space-x-4">
            <button className="px-4 py-2 border rounded hover:bg-gray-100">
              Start new campaign
            </button>
            <button className="px-4 py-2 border rounded hover:bg-gray-100">
              Connect wallet
            </button>
          </div>
        </nav>
      </header>
      <main className="flex-grow flex flex-col items-center justify-center space-y-6">
        <h1 className="text-3xl md:text-5xl font-bold max-w-2xl">
          In order to continue with the creation process you must register with
          your Google account or connect wallet
        </h1>
        <div className="flex space-x-4">
          <button
            onClick={() => router.push("/login")}
            className="flex items-center px-6 py-2 bg-white border border-gray-300 rounded hover:bg-gray-100"
          >
            <Image
              src="/google-icon.png"
              alt="Google"
              className="w-6 h-6 mr-2"
              width={500}
              height={500}
            />
            Sign up with Google
          </button>
          <button className="px-6 py-2 bg-black text-white rounded hover:bg-gray-800">
            Connect Wallet
          </button>
        </div>
      </main>
    </div>
  );
}
