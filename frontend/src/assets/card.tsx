import React from "react";
import Image from "next/image";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface InfoProps {
  onNext: () => void;
}

const Info: React.FC<InfoProps> = ({ onNext }) => {
  const data = [
    {
      title: "620",
      description: "Launched campaigns",
      imageSrc: "/reunion.png",
    },
    {
      title: "2.210.000",
      description: "ADA contributed",
      imageSrc: "/badge.png",
    },
    {
      title: "2361",
      description: "Collaborators",
      imageSrc: "/profit.png",
    },
  ];

  return (
    <div className="mt-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {data.map((item, index) => (
        <Card
          key={index}
          className="backdrop-blur-sm border-none bg-background/60 dark:bg-default-100/50 rounded-2xl shadow-lg h-[282px] w-[518px]"
        >
          <Avatar className="mx-auto flex flex-col mt-2 ml-4">
            <AvatarImage src="https://github.com/shadcn.png" />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
          <CardHeader className="text-center">
            <CardTitle className="text-4xl font-bold">{item.title}</CardTitle>
            <CardDescription className="text-xl">
              {item.description}
            </CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center">
            <Image
              src={item.imageSrc}
              alt={item.description}
              height={200}
              width={200}
              className="mx-auto flex-col mt-4"
            />
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default Info;
