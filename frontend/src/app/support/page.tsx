import Header from "@/assets/header";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { FC } from "react";

const SupportSection: FC = () => {
  return (
    <div>
      <Header />
      <div className="min-h-screen grid grid-cols-1 md:grid-cols-2 bg-background text-foreground">
        <aside className="relative flex flex-col justify-center items-center bg-customColor-header px-4 sm:px-8 py-8 sm:py-10">
          <div className="absolute inset-0 flex justify-center items-center">
            <Image
              src="/luz.png"
              alt="Light Effect"
              width={400}
              height={400}
              objectFit="contain"
              className="z-0"
              style={{ filter: 'blur(100px)', opacity: 0.5 }}
            />
          </div>
          <div className="flex flex-col items-center justify-center z-10 space-y-6 text-center px-4 h-full">
            <div className="relative">
              <Image
                src="/support.png"
                alt="Card Image"
                width={200}
                height={200}
                objectFit="contain"
                className="relative z-10"
              />
            </div>
            <p className="text-xl sm:text-2xl text-white leading-snug">
              Did you know that Innovatio & Blogchain has a Pool in the Cardano
              network and you can support our mission by simply delegating us?
            </p>
            <Button className="border-white border-2 rounded-full bg-inherit hover:bg-inherit">
              Delegate Now
            </Button>
          </div>
        </aside>
        <main className="flex flex-col justify-center items-center bg-gradient-to-b from-white to-cyan-100 text-black px-4 sm:px-8 py-8 sm:py-10">
          <div className="space-y-6 text-center px-4 flex flex-col justify-center h-full">
            <div className="mb-4">
              <Image
                src="/support2.png"
                alt="Support Illustration"
                width={150}
                height={200}
                className="max-w-full"
              />
            </div>
            <p className="text-xl sm:text-2xl leading-snug">
              Remember that Blogchain is maintained thanks to the donations of
              its readers, if you have the opportunity, do not hesitate to
              support our cause.
            </p>
            <div className="flex flex-col md:flex-row md:space-x-4 space-y-4 md:space-y-0">
              <Button className="px-4 py-2 bg-black text-white rounded-full hover:bg-gray-800 transition duration-300">
                BTC
              </Button>
              <Button className="px-4 py-2 bg-black text-white rounded-full hover:bg-gray-800 transition duration-300">
                ADA
              </Button>
              <Button className="px-4 py-2 bg-black text-white rounded-full hover:bg-gray-800 transition duration-300">
                ETH (Polygon Network)
              </Button>
              <Button className="px-4 py-2 bg-black text-white rounded-full hover:bg-gray-800 transition duration-300">
                EOS
              </Button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default SupportSection;
