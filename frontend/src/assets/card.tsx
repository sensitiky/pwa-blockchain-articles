import React from "react";
import Image from "next/image";

interface CardProps {
  value: string;
  text: string;
}

const Card: React.FC<CardProps> = ({ value, text }) => {
  return (
    <div className="relative flex items-center justify-between p-6 rounded-lg shadow-md bg-white bg-opacity-30 backdrop-blur-md">
      <Image
        src="/Rectangle 112.png"
        alt="card"
        layout="fill"
        objectFit="cover"
        className="absolute inset-0 w-[100px] h-[500px] rounded-lg"
      />
      <div className="relative z-10">
        <div className="text-5xl font-bold text-black">{value}</div>
        <div className="text-gray-700">{text}</div>
      </div>
    </div>
  );
};

export default Card;
