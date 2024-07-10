import Image from "next/image";
import React from "react";
import Link from "next/link";

const Footer = () => {
  return (
    <footer className="py-6 border-t border-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <Image
              src="/Logo.svg"
              alt="Innovatio logo"
              width={200}
              height={24}
              className=" mb-4"
            />
            <p className="text-gray-600 text-sm">
              Help different crowdfunding campaigns become a reality thanks to
              your contributions, invest in projects, fund purposes and get
              rewards.
            </p>
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 text-lg mb-4">
              How it works
            </h3>
            <ul className="space-y-2">
              <li>
                <Link href="#" className="hover:underline text-gray-600">
                  Campaign Flow
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:underline text-gray-600">
                  Investment Flow
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:underline text-gray-600">
                  Milestones & Control
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:underline text-gray-600">
                  Q & A
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 text-lg mb-4">
              About us
            </h3>
            <ul className="space-y-2">
              <li>
                <Link href="#" className="hover:underline text-gray-600">
                  Introduction
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:underline text-gray-600">
                  Team & Members
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:underline text-gray-600">
                  Discord Community
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:underline text-gray-600">
                  Social Media
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 text-lg mb-4">
              Help with the Campaigns
            </h3>
            <ul className="space-y-2">
              <li>
                <Link href="#" className="hover:underline text-gray-600">
                  Ideas of Campaign
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:underline text-gray-600">
                  Tokenomics
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:underline text-gray-600">
                  Digital Marketing Strategy
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:underline text-gray-600">
                  Contact our team
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-8 flex justify-center space-x-6">
          <Link href="#" className="text-gray-500 hover:text-gray-900">
            <Image src="/discord.svg" alt="discord" width={24} height={24} />
          </Link>
          <Link href="#" className="text-gray-500 hover:text-gray-900">
            <Image src="/twitter.svg" alt="twitter" width={24} height={24} />
          </Link>
          <Link href="#" className="text-gray-500 hover:text-gray-900">
            <Image
              src="/instagram.svg"
              alt="instagram"
              width={24}
              height={24}
            />
          </Link>
          <Link href="#" className="text-gray-500 hover:text-gray-900">
            <Image src="/facebook.svg" alt="facebook" width={24} height={24} />
          </Link>
        </div>
        <div className="mt-8 border-t border-gray-200 pt-4 flex justify-center text-gray-500 text-sm">
          <p>&copy; 2024 Innovatio. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
