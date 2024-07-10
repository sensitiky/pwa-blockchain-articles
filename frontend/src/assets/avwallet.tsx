import React from 'react';

interface AvatarProps {
  wallet: string;
}

const AvatarWallet: React.FC<AvatarProps> = ({ wallet }) => {
  const truncatedWallet = `${wallet.slice(0, 5)}...${wallet.slice(-5)}`;
  return (
    <div className="flex items-center gap-3 p-2 bg-customColor-innovatio rounded-2xl shadow-lg">
      <div className="flex-shrink-0">
        <div className="w-10 h-10 bg-customColor-innovatio3 rounded-full flex items-center justify-center">
          <span className="text-white text-xl">🌐</span>
        </div>
      </div>
      <div className="text-lg font-medium text-gray-900">
        {truncatedWallet}
      </div>
    </div>
  );
};

export default AvatarWallet;
