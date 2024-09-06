import Footer from "@/assets/footer";
import Header from "@/assets/header";
import Image from "next/image";
import Link from "next/link";
import { FC } from "react";

const LandingSection: FC = () => {
  return (
    <div className="h-full">
      <Header />
      <div className="bg-[#000916] min-h-screen flex flex-col">
        <div className="flex-grow grid grid-cols-1 md:grid-cols-2 bg-background text-foreground relative">
          <h1 className="hidden sm:block z-40 absolute text-center w-full text-4xl sm:text-5xl font-extrabold text-white top-11 transform -translate-y-1/2 ml-2 mt-10">
            Know, learn{" "}
            <span className="text-[#000916]/80 ml-2"> and criticize.</span>
          </h1>
          <main
            id="main-about"
            className="overflow-hidden flex flex-col items-center justify-center bg-[#000916] px-4 py-20 sm:px-12 sm:py-40 font-medium relative min-h-screen"
          >
            <div className="relative flex flex-col items-center space-y-8 z-20">
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
              <div className="max-w-2xl justify-center">
                <p
                  id="about-text-1"
                  className="text-lg sm:text-2xl leading-snug text-white text-left"
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
              <Image
                src="/About1.png"
                width={320}
                height={230}
                alt="About Ilustration"
              />
            </div>
            <div className="absolute inset-0 flex justify-center items-center z-10">
              <img
                src="/bg-about.gif"
                className="object-cover w-full h-full opacity-25"
                alt="Background"
              />
            </div>
          </main>

          <main
            id="main-about-2"
            className="flex flex-col items-center py-80 justify-center bg-gradient-to-b from-white to-cyan-100 text-black px-6 sm:px-12 sm:py-80 font-medium"
          >
            <div className="space-y-8 max-w-lg w-full">
              {/* Texto alineado a la izquierda */}
              <p
                id="about-text-2"
                className="text-left text-xl sm:text-2xl leading-snug text-[#263238] font-normal"
              >
                Are you an enthusiast of blockchain{" "}
                <br className="hidden sm:block" />
                technology and new opportunities in{" "}
                <br className="hidden sm:block" />
                the web3 world?{" "}
                <span className="font-extrabold">
                  Join our <br className="hidden sm:block" />
                  community
                </span>{" "}
                of entrepreneurs, <br className="hidden sm:block" />
                developers, and early adopters and{" "}
                <br className="hidden sm:block" />
                follow us on our social networks so{" "}
                <br className="hidden sm:block" />
                you don't miss a thing.
              </p>

              {/* Botones centrados */}
              <div className="flex flex-col items-center md:flex-row md:space-x-4 space-y-4 md:space-y-0">
                <Link href="https://linktr.ee/innovatiospace" target="_blank">
                  <button className="px-6 py-3 bg-[#000916] text-white rounded-full hover:bg-[#000916]/80 transition duration-300">
                    Innovatio Social Media
                  </button>
                </Link>
                <Link
                  href="https://discord.com/invite/hA36SVempM?utm_source=Discord&utm_medium=Invite"
                  target="_blank"
                >
                  <button className="px-6 py-3 bg-[#000916] text-white rounded-full hover:bg-[#000916]/80 transition duration-300">
                    Discord Community
                  </button>
                </Link>
              </div>

              {/* Imagen centrada */}
              <div className="flex justify-center">
                <Image
                  src="/About2.png"
                  width={300}
                  height={235}
                  className="overflow-hidden mr-20"
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
