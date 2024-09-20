import Image from 'next/image';
import React from 'react';
import Link from 'next/link';
import { useAuth } from '../../context/authContext';

interface FooterProps {
  setShowLoginModal?: (show: boolean) => void;
}

const Footer: React.FC<FooterProps> = ({ setShowLoginModal }) => {
  const { isAuthenticated } = useAuth();

  const handleWriteBlogClick = (e: any) => {
    if (!isAuthenticated) {
      e.preventDefault();
      if (setShowLoginModal) {
        setShowLoginModal(true);
      }
    }
  };

  return (
    <footer className="bg-[#000916] w-full font-normal text-white py-6 border-t border-gray-200 backdrop-blur-md">
      <div className="mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center">
        <div className="flex flex-col lg:flex-row justify-between items-center w-full mb-6 space-y-6 lg:space-y-0">
          <div className="flex flex-col lg:flex-row items-center text-center lg:text-left mx-4 mb-4 lg:mb-0">
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
          <div className="flex w-full lg:w-1/2 justify-center lg:justify-start mb-4 lg:mb-0">
            <p className="text-white text-center lg:text-left">
              Blogchain is a community forum where enthusiasts, professionals
              and influencers write and share educational and informative
              articles related to the web3 and the technological world, soak up
              knowledge and meet new content creators, follow them on their new
              social networks and debate without any censorship or editorial
              line.
            </p>
          </div>
          <div className="flex flex-col lg:flex-row text-white w-full lg:w-auto space-y-4 lg:space-y-0 lg:space-x-8">
            <div className="flex flex-col m-4 lg:m-0">
              <Link href="/" className="text-[16px] mb-2 hover:text-gray-300">
                Blogchain
              </Link>
              <Link
                href="/articles"
                className="text-[14px] mb-2 hover:text-gray-300"
              >
                Home
              </Link>
              <Link
                href="/about"
                className="text-[14px] mb-2 hover:text-gray-300"
              >
                About Us
              </Link>
              <Link
                href="/support"
                className="text-[14px] mb-2 hover:text-gray-300"
              >
                Support Us
              </Link>
            </div>
            <div className="flex flex-col m-4 lg:m-0">
              <Link
                href="/articles"
                className="text-[16px] mb-2 hover:text-gray-300"
              >
                Articles
              </Link>
              {isAuthenticated ? (
                <Link
                  href="/newarticles"
                  className="text-[14px] mb-2 hover:text-gray-300"
                >
                  Write a blog
                </Link>
              ) : (
                <Link
                  href="#header"
                  className="text-[14px] mb-2 hover:text-gray-300"
                  onClick={handleWriteBlogClick}
                >
                  Write a blog
                </Link>
              )}
              <Link href="/" className="text-[14px] mb-2 hover:text-gray-300">
                Home of <br />
                content
              </Link>
            </div>
            {isAuthenticated && (
              <div className="flex flex-col m-4 lg:m-0">
                <Link
                  href="/users?section=personal"
                  className="text-[16px] hover:text-gray-300"
                >
                  Profile
                </Link>
                <Link
                  href="/users?section=personal"
                  className="text-[14px] hover:text-gray-300"
                >
                  My profile
                </Link>
                <Link
                  href="/users?section=saved"
                  className="text-[14px] hover:text-gray-300"
                >
                  My favorites
                </Link>
                <Link
                  href="/users?section=articles"
                  className="text-[14px] hover:text-gray-300"
                >
                  My articles
                </Link>
              </div>
            )}
          </div>
        </div>
        <div className="border-t font-normal border-gray-200 pt-4 flex justify-center w-full">
          <p>&copy; 2024 Blogchain. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
