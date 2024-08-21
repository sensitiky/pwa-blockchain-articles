import Footer from "@/assets/footer";
import Header from "@/assets/header";
import Image from "next/image";
import { FC } from "react";

const LandingSection: FC = () => {
  return (
    <div className="h-full">
      <Header />
      <div className="bg-[#000916] min-h-screen flex flex-col">
        <div className="flex-grow grid grid-cols-1 md:grid-cols-2 bg-background text-foreground relative">
          <h1 className="hidden sm:block z-50 absolute text-center w-full text-4xl sm:text-5xl font-extrabold text-white top-11 transform -translate-y-1/2 ml-2 mt-10">
            Know, learn{" "}
            <span className="text-[#000916]/80 ml-2"> and criticize.</span>
          </h1>
          <main
            id="main-about"
            className="overflow-hidden flex py-80 justify-center bg-[#000916] px-6 sm:px-12 sm:py-80 font-medium relative"
          >
            <div className="relative flex flex-col items-start space-y-4 z-20">
              <div className="relative z-20 mb-4">
                <Image
                  src="/logo about us.png"
                  alt="Logo"
                  width={300}
                  height={300}
                  className="max-w-full"
                  unoptimized
                />
              </div>
              <div className="relative z-20">
                <p
                  id="about-text-1"
                  className="text-xl sm:text-2xl leading-snug text-white"
                >
                  <span className="font-extrabold">
                    Empowering Web3 education
                    <br />
                  </span>
                  <span className="font-extrabold">and adoption </span>
                  through
                  <br />
                  <span className="font-extrabold">
                    {" "}
                    community-driven content
                    <br />
                  </span>
                  and
                  <span className="font-extrabold"> critical thinking.</span>
                </p>
              </div>
            </div>
            <div className="absolute inset-0 flex justify-center items-center z-10 mb-[15rem]">
              <img
                src="/bg-about.gif"
                className="hidden sm:block w-[100rem] h-[65rem]"
                style={{ opacity: 0.25 }}
              />
              <img
                src="/bg-about.gif"
                className="block sm:hidden w-full h-full"
                style={{ opacity: 0.25 }}
              />
            </div>
          </main>
          <main
            id="main-about-2"
            className="flex py-80 justify-center bg-gradient-to-b from-white to-cyan-100 text-black px-6 sm:px-12 sm:py-80 font-medium"
          >
            <div className="space-y-8">
              <p
                id="about-text-2"
                className="text-xl sm:text-2xl leading-snug text-[#263238]"
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
              <div className="flex flex-col md:flex-row md:space-x-4 space-y-4 md:space-y-0">
                <button className="px-6 py-3 bg-[#000916] text-white rounded-full hover:bg-[#000916]/80 transition duration-300">
                  Innovatio Social Media
                </button>
                <button className="px-6 py-3 bg-[#000916] text-white rounded-full hover:bg-[#000916]/80 transition duration-300">
                  Discord Community
                </button>
              </div>
            </div>
          </main>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default LandingSection;
