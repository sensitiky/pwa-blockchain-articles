import Header from "@/assets/header";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { FC } from "react";

const SupportSection: FC = () => {
  return (
    <div>
      <Header />
      <div className="min-h-screen grid grid-cols-1 md:grid-cols-2 bg-background text-foreground">
        <aside className="mb-8 relative flex flex-col justify-center items-center bg-[#000916] px-6 sm:px-12 py-10 sm:py-16">
          <div className="absolute inset-0 flex justify-center items-center">
            <Image
              src="/bg-about.gif"
              alt="Light Effect"
              width={1000}
              height={1000}
              className="z-0"
              style={{ opacity: 0.25 }}
            />
          </div>
          <div className="font-medium flex flex-col items-center justify-center z-10 space-y-8 text-center px-6 h-full">
            <p className="text-justify text-xl sm:text-2xl text-white leading-snug">
              Remember that Blogchain is
              <br /> maintained thanks to the donations of
              <br />
              its readers, if you have the opportunity,
              <br /> do not hesitate to support our cause.
            </p>
          </div>
        </aside>
        <main className="flex flex-col justify-center items-center bg-gradient-to-b from-white to-cyan-100 text-black px-6 sm:px-12 py-10 sm:py-16">
          <div className="font-medium space-y-8 text-center px-6 flex flex-col justify-center h-full">
            <p className="text-xl sm:text-2xl leading-snug text-[#263238] text-justify">
              We are accepting donations in fiat <br />
              and cryptocurrencies, choose the <br />
              channel that suits you best and <br />
              contribute to keep this forum alive.
            </p>
            <div className="justify-center flex flex-col md:flex-row md:space-x-4 space-y-4 md:space-y-0">
              <Button className="px-6 py-3 bg-[#000916] text-white rounded-full hover:bg-gray-800 transition duration-300">
                Wallet Address List
              </Button>
              <Button className="px-6 py-3 bg-[#000916] text-white rounded-full hover:bg-gray-800 transition duration-300">
                SEPA Transfers
              </Button>
              <Button className="px-6 py-3 bg-[#000916] text-white rounded-full hover:bg-gray-800 transition duration-300">
                Paypal & Venmo
              </Button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default SupportSection;
