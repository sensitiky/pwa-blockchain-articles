import Image from "next/image";
import React from "react";
import Link from "next/link";

const Footer = () => {
  return (
    <footer className="bg-[#000916] min-w-full py-6 border-t border-gray-200 backdrop-blur-md">
      <div className="min-w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-start items-center gap-4">
          <span className="text-xl font-bold text-white flex items-center">
            Blogchain <span className="font-light mx-2">By</span>
          </span>
          <Image
            src="/footer.png"
            alt="Innovatio logo"
            width={100}
            height={24}
          />
        </div>
        <div className="mt-6 flex justify-center space-x-4">
          <Link href="https://discord.com/invite/hA36SVempM?utm_source=Discord&utm_medium=Invite">
            <Image
              className="filter invert"
              src="/discord.svg"
              alt="discord"
              width={24}
              height={24}
            />
          </Link>
          <Link href="https://x.com/innovatio_space">
            <Image
              className="filter invert"
              src="/twitter.svg"
              alt="twitter"
              width={24}
              height={24}
            />
          </Link>
          <Link href="https://www.instagram.com/innovatiospace/">
            <Image
              src="/instagram.svg"
              alt="instagram"
              width={24}
              height={24}
              className="filter invert"
            />
          </Link>
          <Link href="https://www.facebook.com/innovatiospace">
            <Image
              src="/facebook.svg"
              alt="facebook"
              width={24}
              height={24}
              className="filter invert"
            />
          </Link>
        </div>
        <div className="mt-6 border-t border-gray-200 pt-4 flex justify-center text-gray-300">
          <p>&copy; 2024 Innovatio. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
