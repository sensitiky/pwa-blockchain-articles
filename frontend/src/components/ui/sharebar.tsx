import React from 'react';
import { FaFacebook, FaTwitter, FaLinkedin, FaMedium } from 'react-icons/fa';
import styled from 'styled-components';

const ShareBarContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #f1f1f1;
  padding: 0.5rem;
  border-radius: 0.5rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  animation: fadeIn 0.3s ease-in-out;

  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateY(-10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;

const ShareBar = ({ postUrl }: { postUrl: string }) => {
  const shareLinks = {
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${postUrl}`,
    twitter: `https://twitter.com/intent/tweet?url=${postUrl}`,
    linkedin: `https://www.linkedin.com/shareArticle?mini=true&url=${postUrl}`,
    medium: `https://medium.com/p/import?url=${postUrl}`,
  };

  return (
    <ShareBarContainer>
      <a href={shareLinks.facebook} target="_blank" rel="noopener noreferrer">
        <FaFacebook className="size-5 text-blue-600 mx-2" />
      </a>
      <a href={shareLinks.twitter} target="_blank" rel="noopener noreferrer">
        <FaTwitter className="size-5 text-blue-400 mx-2" />
      </a>
      <a href={shareLinks.linkedin} target="_blank" rel="noopener noreferrer">
        <FaLinkedin className="size-5 text-blue-700 mx-2" />
      </a>
      <a href={shareLinks.medium} target="_blank" rel="noopener noreferrer">
        <FaMedium className="size-5 text-black mx-2" />
      </a>
    </ShareBarContainer>
  );
};

export default ShareBar;
