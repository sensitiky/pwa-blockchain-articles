"use client";
import Header from "@/assets/header";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { FC, useState } from "react";

const SupportSection: FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  return (
    <div className="h-screen">
      <Header />
      <div className="h-screen grid grid-cols-1 md:grid-cols-2 bg-background text-foreground">
        <aside className="relative flex flex-col justify-center items-center bg-[#000916] px-6 sm:px-12 py-10 sm:py-16 h-screen">
          <div className="absolute inset-0 flex justify-center items-center">
            <Image
              src="/bg-about.gif"
              alt="Light Effect"
              width={1000}
              height={1000}
              className="z-0"
              unoptimized
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
            <Image
              src="/support us 1.png"
              width={300}
              height={300}
              alt="Support Us ilustration"
            />
          </div>
        </aside>
        <main className="flex flex-col justify-center items-center bg-gradient-to-b from-white to-cyan-100 text-black px-6 sm:px-12 py-10 sm:py-16">
          <div className="font-medium space-y-8 text-center px-6 flex flex-col justify-center h-full">
            <p className="text-xl sm:text-2xl leading-snug text-[#263238] text-justify justify-center">
              We are accepting donations in fiat <br />
              and cryptocurrencies, choose the <br />
              channel that suits you best and <br />
              contribute to keep this forum alive.
            </p>
            <div className="justify-center flex flex-col md:flex-row md:space-x-4 space-y-4 md:space-y-0">
              <Button className="px-6 py-3 bg-[#000916] text-white rounded-full hover:bg-gray-800 transition duration-300">
                Wallet Address List
              </Button>
              <Button
                className="px-6 py-3 bg-[#000916] text-white rounded-full hover:bg-gray-800 transition duration-300"
                onClick={openModal}
              >
                SEPA Transfers
              </Button>
              <Button className="px-6 py-3 bg-[#000916] text-white rounded-full hover:bg-gray-800 transition duration-300">
                Paypal & Venmo
              </Button>
            </div>
            <Image
              src="/support us 2.png"
              width={300}
              height={300}
              alt="Support Us ilustration"
            />
          </div>
        </main>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-xl shadow-lg text-center">
            <h2 className="text-2xl font-bold mb-4 text-center">
              SEPA <br />
              Transfer Details
            </h2>
            <p className="text-lg font-medium">LT44 3500 0100 1569 5296</p>
            <Button
              className="mt-6 px-4 py-2 bg-[#000916] text-white rounded-full hover:bg-[#000916]/80 transition duration-300"
              onClick={closeModal}
            >
              Close
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SupportSection;
