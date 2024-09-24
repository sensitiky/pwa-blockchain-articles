"use client";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function NotFound() {
  const router = useRouter();

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#000916]">
      <div className="text-center space-y-8 max-w-md px-4">
        <div className="flex justify-center">
          <Image
            src="/404.gif"
            width={300}
            height={300}
            alt="404"
            className="mx-auto"
          />
        </div>
        <h1 className="text-9xl font-bold text-yellow-500">404</h1>
        <div className="space-y-4">
          <p className="text-3xl font-semibold text-white">
            Oops! Page not found
          </p>
          <p className="text-xl text-gray-400">
            The page you're looking for doesn't exist or has been moved.
          </p>
        </div>
        <div className="flex justify-center">
          <button
            onClick={() => router.push("/")}
            className="px-6 py-3 bg-yellow-500 text-[#000916] font-semibold rounded-full hover:bg-yellow-400 transition duration-300"
          >
            Go Home
          </button>
        </div>
      </div>
    </div>
  );
}
