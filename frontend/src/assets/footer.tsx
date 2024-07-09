import Image from "next/image";
import React from "react";
import Link from "next/link";

const Footer = () => {
  return (
    <footer className="bg-customColor-innovatio py-1 px-8 border-t border-gray-200">
      <div className="max-w-7xl mx-auto ml-1 mb-10 grid grid-cols-1 md:grid-cols-4 gap-8 text-gray-700">
        <div>
          <Image
            src="/Logo.svg"
            alt="logo"
            width={150}
            height={24}
            className="h-auto w-[150px]"
          />
          <p>
            Make different crowdfunding campaigns to invest & find the new
            innovations and future projects for your growth.
          </p>
        </div>
        <div>
          <h3 className="font-bold text-black text-lg mb-4">More Info</h3>
          <ul>
            <li>
              <Link href="#" className="hover:underline">
                Campaign Flow
              </Link>
            </li>
            <li>
              <Link href="#" className="hover:underline">
                Investment Plan
              </Link>
            </li>
            <li>
              <Link href="#" className="hover:underline">
                Releases & Events
              </Link>
            </li>
            <li>
              <Link href="#" className="hover:underline">
                Q&A
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <h3 className="font-bold text-lg text-black mb-4">Know us</h3>
          <ul>
            <li>
              <Link href="#" className="hover:underline">
                Introduction
              </Link>
            </li>
            <li>
              <Link href="#" className="hover:underline">
                Team Members
              </Link>
            </li>
            <li>
              <Link href="#" className="hover:underline">
                Discord Community
              </Link>
            </li>
            <li>
              <Link href="#" className="hover:underline">
                Social Media
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <h3 className="font-bold text-lg text-black mb-4">Help with the Campaigns</h3>
          <ul>
            <li>
              <Link href="#" className="hover:underline">
                How to Campaign
              </Link>
            </li>
            <li>
              <Link href="#" className="hover:underline">
                Support
              </Link>
            </li>
            <li>
              <Link href="#" className="hover:underline">
                Marketing
              </Link>
            </li>
            <li>
              <Link href="#" className="hover:underline">
                Creator Support
              </Link>
            </li>
          </ul>
        </div>
      </div>
      <div className="flex space-x-4 mt-4 md:mt-0 p-4">
          <Link href="#" className="hover:underline">
            <Image src="/discord.svg" alt="discord" width={24} height={24}/>
          </Link>
          <Link href="#" className="hover:underline">
            <Image src="/twitter.svg" alt="twitter" width={24} height={24}/>
          </Link>
          <Link href="#" className="hover:underline">
            <Image src="/instagram.svg" alt="instagram" width={24} height={24}/>
          </Link>
          <Link href="#" className="hover:underline">
            <Image src="/facebook.svg" alt="facebook" width={24} height={24}/>
          </Link>
        </div>
      <div className="max-w-7xl mx-auto mt-10 flex flex-col md:flex-row justify-between items-center text-gray-500">
        <p className="flex-col justify-between items-center mx-auto">&copy; 2024 Innovatio. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
