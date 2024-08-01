import Header from "@/assets/header";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { FC } from "react";

const SupportSection: FC = () => {
  return (
    <div>
      <Header />
      <div className="min-h-screen grid grid-cols-1 md:grid-cols-2 bg-background text-foreground">
        <aside className="relative flex flex-col justify-center items-center bg-customColor-header px-6 sm:px-12 py-10 sm:py-16">
          <div className="absolute inset-0 flex justify-center items-center">
            <Image
              src="/luz.png"
              alt="Light Effect"
              width={400}
              height={400}
              className="z-0"
              style={{ filter: "blur(100px)", opacity: 0.5 }}
            />
          </div>
          <div className="flex flex-col items-center justify-center z-10 space-y-8 text-center px-6 h-full">
            <p className="text-xl sm:text-2xl text-white leading-snug">
              Remember that Blogchain is maintained thanks to the donations of
              its readers, if you have the opportunity, do not hesitate to
              support our cause.
            </p>
          </div>
        </aside>
        <main className="flex flex-col justify-center items-center bg-gradient-to-b from-white to-cyan-100 text-black px-6 sm:px-12 py-10 sm:py-16">
          <div className="space-y-8 text-center px-6 flex flex-col justify-center h-full">
            <p className="text-xl sm:text-2xl leading-snug">
              We are accepting donations in fiat and cryptocurrencies. If you
              want to support us, choose the channel that suits better and
              contribute to keep this forum alive:
            </p>
            <div className="flex flex-col md:flex-row md:space-x-4 space-y-4 md:space-y-0">
              <Button className="px-6 py-3 bg-black text-white rounded-full hover:bg-gray-800 transition duration-300">
                Wallet Address List
              </Button>
              <Button className="px-6 py-3 bg-black text-white rounded-full hover:bg-gray-800 transition duration-300">
                SEPA Transfers
              </Button>
              <Button className="px-6 py-3 bg-black text-white rounded-full hover:bg-gray-800 transition duration-300">
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
