import Header from "@/assets/header";
import { CardBody, CardContainer, CardItem } from "@/components/ui/3d-card";
import Image from "next/image";
import { FC } from "react";

const LandingSection: FC = () => {
  return (
    <div>
      <Header />
      <div className="py-12 bg-customColor-header min-h-screen flex flex-col">
        <div className="flex-grow grid grid-cols-1 md:grid-cols-2 bg-background text-foreground">
          <aside className="flex flex-col justify-center bg-customColor-header px-6 sm:px-12 py-10 sm:py-16">
            <div className="space-y-8">
              <div className="flex items-start space-x-4">
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
            <div className="mt-8 sm:mt-12 flex justify-center">
              <CardContainer className="inter-var mx-auto">
                <CardBody className="bg-inherit text-card-foreground border-none rounded-lg shadow-none w-full h-full transition-transform relative flex justify-center items-center">
                  <CardItem translateZ="50" className="relative z-10">
                    <Image
                      src="/about us.png"
                      alt="Blogchain About"
                      width={300}
                      height={300}
                      objectFit="contain"
                      className="relative z-10"
                    />
                  </CardItem>
                </CardBody>
              </CardContainer>
            </div>
          </aside>
          <main className="flex flex-col justify-center bg-gradient-to-b from-white to-cyan-100 text-black px-6 sm:px-12 py-10 sm:py-16">
            <div className="space-y-8">
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
                <button className="px-6 py-3 bg-black text-white rounded-full hover:bg-gray-800 transition duration-300">
                  Be a blogchainer
                </button>
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
    </div>
  );
};

export default LandingSection;