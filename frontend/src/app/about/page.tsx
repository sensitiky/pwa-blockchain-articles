import Header from "@/assets/header";
import Image from "next/image";
import { FC } from "react";

const LandingSection: FC = () => {
  return (
    <div>
      <Header />
      <div className="min-h-screen grid grid-cols-1 md:grid-cols-2 bg-background text-foreground">
        <aside className="flex flex-col justify-center bg-customColor-header px-4 sm:px-8 py-8 sm:py-10">
          <div className="space-y-6">
            <div className="flex items-start space-x-3">
              <Image
                src="/logo about us.png"
                alt="Logo"
                width={300}
                height={300}
                className="max-w-full"
              />
            </div>
            <p className="text-xl sm:text-2xl text-white leading-snug">
              Facilitate the adoption of
              <span className="font-bold"> web3 technologies </span>
              through
              <span className="font-bold"> educational and informative </span>
              content from the community,
              <span className="font-bold"> know, learn, and criticize.</span>
            </p>
          </div>
          <div className="mt-6 sm:mt-10 flex justify-center">
            <Image
              src="/about us.png"
              alt="Illustration"
              width={300}
              height={200}
              className="max-w-full"
            />
          </div>
        </aside>
        <main className="flex flex-col justify-center bg-gradient-to-b from-white to-cyan-100 text-black px-4 sm:px-8 py-8 sm:py-10">
          <div className="space-y-6">
            <p className="text-xl sm:text-2xl leading-snug">
              Are you an enthusiast of blockchain{" "}
              <br className="hidden sm:block" />
              technology and new opportunities in{" "}
              <br className="hidden sm:block" />
              the web3 world?{" "}
              <span className="font-bold">
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
              <button className="px-4 py-2 bg-black text-white rounded-full hover:bg-gray-800 transition duration-300">
                Be a blogchainer
              </button>
              <button className="px-4 py-2 bg-black text-white rounded-full hover:bg-gray-800 transition duration-300">
                Discord Community
              </button>
              <button className="px-4 py-2 bg-black text-white rounded-full hover:bg-gray-800 transition duration-300">
                Innovatio Social Media
              </button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default LandingSection;
