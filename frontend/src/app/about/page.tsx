import Footer from "@/assets/footer";
import Header from "@/assets/header";
import { CardBody, CardContainer, CardItem } from "@/components/ui/3d-card";
import Image from "next/image";
import { FC } from "react";

const LandingSection: FC = () => {
  return (
    <div className="h-full">
      <Header />
      <div className="bg-customColor-header min-h-screen flex flex-col">
        <div className="flex-grow grid grid-cols-1 md:grid-cols-2 bg-background text-foreground relative">
          <h1 className="absolute text-center w-full text-4xl sm:text-5xl font-bold text-white top-11 transform -translate-y-1/2">
            Know, learn{" "}
            <span className="text-customColor-innovatio3">and criticize.</span>
          </h1>
          <main id="main-about" className="h-full py-40 flex flex-col justify-center bg-customColor-header px-6 sm:px-12 sm:py-40">
            <div className="space-y-8">
              <div className="ml-10 mt-10 flex items-start space-x-4">
                <Image
                  src="/logo about us.png"
                  alt="Logo"
                  width={300}
                  height={300}
                  className="max-w-full"
                />
              </div>
              <div className="relative">
                <Image
                  src="/luz.png"
                  alt="Light Effect"
                  width={400}
                  height={400}
                  className="absolute top-0 left-0 z-0"
                  style={{ filter: "blur(100px)", opacity: 0.5 }}
                />
                <p id="about-text-1" className="ml-10 mt-10 relative text-xl sm:text-2xl text-white z-50 leading-snug">
                  <span className="font-bold">
                    Empowering Web3 education
                    <br />
                  </span>
                  <span className="font-bold">and adoption </span>
                  through
                  <br />
                  <span className="font-bold">
                    {" "}
                    community-driven content
                    <br />
                  </span>
                  and
                  <span className="font-bold"> critical thinking.</span>
                </p>
              </div>
            </div>
          </main>
          <main id="main-about-2" className="flex py-80 justify-center bg-gradient-to-b from-white to-cyan-100 text-black px-6 sm:px-12 sm:py-80">
            <div className="space-y-8">
              <p id="about-text-2" className="text-xl sm:text-2xl leading-snug">
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
                <button className="px-6 py-3 bg-black text-white rounded-full hover:bg-gray-800 transition duration-300">
                  Discord Community
                </button>
                <button className="px-6 py-3 bg-black text-white rounded-full hover:bg-gray-800 transition duration-300">
                  Innovatio Social Media
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