import Header from "@/assets/header";
import Image from "next/image";
import Link from "next/link";
import { FC } from "react";

const LandingSection: FC = () => {
  return (
    <div className="h-full">
      <Header />
      <div className="bg-[#000916] min-h-screen flex">
        <div className="flex-grow grid grid-cols-1 md:grid-cols-2 text-foreground relative">
          {/* Título centrado y grande en el medio */}
          <h1 className="hidden sm:block z-40 absolute text-center w-full text-4xl font-extrabold text-white top-11 transform -translate-y-1/2 ml-2 mt-10">
            Know, learn{" "}
            <span className="text-[#000916] ml-2">and criticize.</span>
          </h1>

          {/* Sección Izquierda - Fondo Oscuro */}
          <main className="flex flex-col items-center justify-center bg-[#000916] px-4 py-20 font-medium relative">
            <div className="relative flex flex-col items-center space-y-4 z-20">
              {/* Logo y nombre */}
              <div className="flex flex-col sm:flex-row items-center space-y-2 space-x-1">
                <h2 className="text-3xl font-bold text-white">Blogchain</h2>
                <Image
                  src="/innovatio.png"
                  alt="Logo"
                  width={50}
                  height={50}
                  className="w-12 h-12 m-2"
                  unoptimized
                />
                <h2 className="text-3xl font-bold text-[#ffc017]">Innovatio</h2>
              </div>

              {/* Texto de introducción */}
              <div className="max-w-2xl text-left">
                <p
                  id="about-text-1"
                  className="text-lg sm:text-2xl leading-snug text-white"
                >
                  <span className="font-extrabold">
                    Empowering Web3 education
                    <br className="hidden sm:inline" />
                  </span>
                  <span className="font-extrabold">and adoption </span>
                  through
                  <br className="hidden sm:inline" />
                  <span className="font-extrabold">
                    community-driven content
                    <br className="hidden sm:inline" />
                  </span>
                  and
                  <span className="font-extrabold"> critical thinking.</span>
                </p>
              </div>

              {/* Ilustración */}
              <Image
                src="/about1.svg"
                width={300}
                height={200}
                alt="About Ilustration"
              />
            </div>
            {/* Fondo de imagen borroso */}
            <div className="absolute inset-0 flex justify-center items-center z-10">
              <img
                src="/bg-about.gif"
                className="object-cover w-full h-full opacity-25"
                alt="Background"
              />
            </div>
          </main>

          {/* Sección Derecha - Fondo Claro */}
          <main className="flex flex-col items-center justify-center bg-gradient-to-b from-white to-cyan-100 text-black px-6 font-medium">
            <div className="space-y-2 max-w-lg w-1/2 text-left mb-[1.6em]">
              {/* Texto descriptivo */}
              <p className="text-xl text-[#263238] font-normal">
                Are you an enthusiast of blockchain{" "}
                <br className="hidden sm:block" />
                technology and new opportunities in{" "}
                <br className="hidden sm:block" />
                the web3 world?{" "}
                <span className="font-extrabold">Join our community</span> of
                entrepreneurs, developers, and early adopters and follow us on
                our social networks so you don't miss a thing.
              </p>

              {/* Botones estilizados */}
              <div className="flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-4">
                <Link href="https://linktr.ee/innovatiospace" target="_blank">
                  <button className="px-6 py-3 bg-[#000916] text-white rounded-full hover:bg-[#000916]/80 transition duration-300 font-normal">
                    Innovatio Social Media
                  </button>
                </Link>
                <Link
                  href="https://discord.com/invite/hA36SVempM?utm_source=Discord&utm_medium=Invite"
                  target="_blank"
                >
                  <button className="px-6 py-3 bg-[#000916] text-white rounded-full hover:bg-[#000916]/80 transition duration-300 font-normal">
                    Discord Community
                  </button>
                </Link>
              </div>

              {/* Segunda Ilustración */}
              <div className="flex justify-center">
                <Image
                  src="/about2.svg"
                  width={250}
                  height={200}
                  className="mr-20"
                  alt="Social Media About"
                />
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default LandingSection;
