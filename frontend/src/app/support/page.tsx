'use client';
import Footer from '@/assets/footer';
import Header from '@/assets/header';
import LoginCard from '@/assets/login';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import Link from 'next/link';
import { FC, useState } from 'react';

const SupportSection: FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalOpen2, setIsModalOpen2] = useState(false);
  const [showLoginCard, setShowLoginCard] = useState(false);

  const handleCloseModal = () => setShowLoginCard(false);
  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);
  const openModal2 = () => setIsModalOpen2(true);
  const closeModal2 = () => setIsModalOpen2(false);

  return (
    <div className="h-screen">
      <Header />
      <div className="h-screen grid grid-cols-1 md:grid-cols-2 bg-background text-foreground">
        <aside className="relative flex flex-col justify-center items-center bg-[#000916] px-6 sm:px-12 py-10 sm:py-16 h-screen">
          <div className="absolute inset-0 flex justify-center items-center z-10">
            <Image
              src="/bg-about.gif"
              width={1920}
              height={1080}
              className="object-cover w-full h-full opacity-25"
              alt="Background"
            />
          </div>
          <div className="font-medium flex flex-col items-center justify-center z-10 space-y-8 text-center px-6 h-full">
            <p className="text-justify text-xl sm:text-2xl text-white leading-snug font-normal">
              Remember that Blogchain is
              <br /> maintained thanks to the donations of
              <br />
              its readers, if you have the opportunity,
              <br /> do not hesitate to support our cause.
            </p>
            <Image
              src="/support1.svg"
              width={300}
              height={300}
              alt="Support Us ilustration"
            />
          </div>
        </aside>
        <main className="flex flex-col justify-center items-center bg-gradient-to-b from-white to-cyan-100 text-black">
          <div className="font-medium space-y-8 text-center px-6 flex flex-col justify-center h-full mb-10">
            <p className="text-xl sm:text-2xl leading-snug text-[#263238] text-justify justify-center font-normal">
              We are accepting donations in fiat <br />
              and cryptocurrencies, choose the <br />
              channel that suits you best and <br />
              contribute to keep this forum alive.
            </p>
            <div className="justify-center flex flex-col md:flex-row md:space-x-4 space-y-4 md:space-y-0">
              <Button
                className="text-base px-6 py-3 bg-[#000916] text-white rounded-full hover:bg-gray-800 transition duration-300 font-normal"
                onClick={openModal2}
              >
                Wallet Address List
              </Button>
              <Button
                className="text-base px-6 py-3 bg-[#000916] text-white rounded-full hover:bg-gray-800 transition duration-300 font-normal"
                onClick={openModal}
              >
                SEPA Transfers
              </Button>
              <Link
                href="https://www.paypal.com/pools/c/98g7nR5w4z"
                target="_blank"
              >
                <Button className="text-base px-6 py-3 bg-[#000916] text-white rounded-full hover:bg-gray-800 transition duration-300 font-normal">
                  Paypal
                </Button>
              </Link>
            </div>
            <Image
              src="/support2.svg"
              width={300}
              height={300}
              className="ml-20"
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
      {isModalOpen2 && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-8 rounded-xl shadow-lg text-center max-w-lg mx-auto">
            <h2 className="text-3xl font-bold mb-6 text-center text-[#000916]">
              USDT Transfer Details
            </h2>
            <div className="space-y-6">
              <div className="flex flex-col items-center">
                <h3 className="text-xl font-semibold text-[#000916]">
                  USDT BEP20
                </h3>
                <p className="text-lg font-medium text-gray-700 break-all">
                  0x5d8ce0cf4d34aa8b7a9146efdc51982d1a9d8e83
                </p>
              </div>
              <div className="flex flex-col items-center">
                <h3 className="text-xl font-semibold text-[#000916]">
                  USDT TRC20
                </h3>
                <p className="text-lg font-medium text-gray-700 break-all">
                  TKv2pTH6ffRrgaE1wU6KWCdV3ZSqcKA4cc
                </p>
              </div>
              <div className="flex flex-col items-center">
                <h3 className="text-xl font-semibold text-[#000916]">
                  USDT MATIC
                </h3>
                <p className="text-lg font-medium text-gray-700 break-all">
                  0x5d8ce0cf4d34aa8b7a9146efdc51982d1a9d8e83
                </p>
              </div>
              <div className="flex flex-col items-center">
                <h3 className="text-xl font-semibold text-[#000916]">
                  USDT SOL
                </h3>
                <p className="text-lg font-medium text-gray-700 break-all">
                  8gXVM1wTE2s7uhv7WymCcE4E8TiKHf7p2YoEF11aaH7W
                </p>
              </div>
            </div>
            <button
              className="mt-8 px-6 py-3 bg-[#000916] text-white rounded-full hover:bg-[#000916]/80 transition duration-300"
              onClick={closeModal2}
            >
              Close
            </button>
          </div>
        </div>
      )}
      <Footer setShowLoginModal={setShowLoginCard} />
      {showLoginCard && (
        <div className="w-screen fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="relative bg-white p-8 rounded-lg shadow-lg">
            <button
              onClick={handleCloseModal}
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
            >
              <Image
                src="/close-circle-svgrepo-com.png"
                alt="Remove"
                width={1920}
                height={1080}
                className="size-7 cursor-pointer hover:animate-pulse"
              />
            </button>
            <LoginCard onClose={handleCloseModal} />
          </div>
        </div>
      )}
    </div>
  );
};

export default SupportSection;
