import Image from "next/image";
import React from "react";
import Link from "next/link";

const Footer = () => {
  return (
    <footer className="bg-customColor-header min-w-full py-4 border-t border-gray-300 backdrop-blur-sm">
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
            className="text-customColor-letras"
          />
        </div>
        <div className="mt-8 flex justify-center space-x-6">
          <Link href="#">
            <Image
              className="filter invert"
              src="/discord.svg"
              alt="discord"
              width={24}
              height={24}
            />
          </Link>
          <Link href="#">
            <Image
              className="filter invert"
              src="/twitter.svg"
              alt="twitter"
              width={24}
              height={24}
            />
          </Link>
          <Link href="#">
            <Image
              src="/instagram.svg"
              alt="instagram"
              width={24}
              height={24}
              className="filter invert"
            />
          </Link>
          <Link href="#">
            <Image
              src="/facebook.svg"
              alt="facebook"
              width={24}
              height={24}
              className="filter invert"
            />
          </Link>
        </div>
        <div className="mt-8 border-t border-white pt-4 flex justify-center text-gray-300">
          <p>&copy; 2024 Innovatio. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
