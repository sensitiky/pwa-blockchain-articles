//Creacion de campaña
"use client";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import AvatarWallet from "@/assets/avwallet";

const Step1: React.FC<{ onNext: () => void }> = ({ onNext }) => (
  <form className="space-y-4 mt-10">
    <div className="space-y-2">
      <Label htmlFor="title" className="block text-2xl ">
        Title
      </Label>
      <Input
        id="title"
        type="text"
        placeholder="Title of project"
        className="border border-gray-300 p-2 w-1/2 rounded-xl h-16"
      />
    </div>
    <div className="space-y-2">
      <Label htmlFor="category" className="block">
        Category
      </Label>
      <DropdownMenu>
        <DropdownMenuTrigger>
          <Input
            id="category"
            type="text"
            placeholder="Category"
            className="border border-gray-300 rounded-xl p-2 w-96 h-16"
          />
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuLabel>My Account</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem>Profile</DropdownMenuItem>
          <DropdownMenuItem>Billing</DropdownMenuItem>
          <DropdownMenuItem>Team</DropdownMenuItem>
          <DropdownMenuItem>Subscription</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
    <div className="space-y-2">
      <Label htmlFor="description" className="block">
        Description
      </Label>
      <textarea
        id="description"
        placeholder="Talk a bit about description. Minimum 200 characters."
        className="border border-gray-300 rounded-md p-2 w-full h-[350px]"
      />
    </div>
    <Button
      className="flex flex-col h-[45px] w-[200px] justify-between items-center mx-auto text-white bg-customColor-innovatio3 rounded-full px-4 py-2 border-customColor-innovatio3 border-2 hover:bg-customColor-innovatio hover:text-customColor-innovatio3"
      onClick={onNext}
    >
      Continue
    </Button>
  </form>
);

const Step2: React.FC<{ onNext: () => void }> = ({ onNext }) => (
  <div className="mt-10">
    <h2 className="text-2xl font-bold mb-4">Step 2: Details</h2>
    <form className="space-y-4">
      <div className="flex space-x-4">
        <input
          type="text"
          placeholder="Detail 1"
          className="border border-gray-300 p-2 w-1/2 rounded-full"
        />
        <input
          type="text"
          placeholder="Detail 2"
          className="border border-gray-300 rounded-full p-2 w-1/2"
        />
      </div>
      <textarea
        placeholder="Provide more details here."
        className="border border-gray-300 rounded-md p-2 w-full h-[350px]"
      />
      <Button
        className="flex flex-col h-[45px] w-[200px] justify-between items-center mx-auto text-white bg-customColor-innovatio3 rounded-full px-4 py-2 border-customColor-innovatio3 border-2 hover:bg-customColor-innovatio hover:text-customColor-innovatio3"
        onClick={onNext}
      >
        Continue
      </Button>
    </form>
  </div>
);
const Step3: React.FC<{ onNext: () => void }> = ({ onNext }) => (
  <div className="mt-10">
    <h2 className="text-2xl font-bold mb-4">
      Insert your brand, project, and community links
    </h2>
    <form className="space-y-4 flex flex-col">
      <input
        type="text"
        placeholder="Website"
        className="border border-gray-300 p-2 w-full rounded-full"
      />
      <input
        type="text"
        placeholder="Facebook"
        className="border border-gray-300 p-2 w-full rounded-full"
      />
      <input
        type="text"
        placeholder="Instagram"
        className="border border-gray-300 p-2 w-full rounded-full"
      />
      <input
        type="text"
        placeholder="Discord"
        className="border border-gray-300 p-2 w-full rounded-full"
      />
      <input
        type="text"
        placeholder="X"
        className="border border-gray-300 p-2 w-full rounded-full"
      />
      <Button
        className="flex flex-col h-[45px] w-[200px] justify-between items-center mx-auto text-white bg-customColor-innovatio3 rounded-full px-4 py-2 border-customColor-innovatio3 border-2 hover:bg-customColor-innovatio hover:text-customColor-innovatio3"
        onClick={onNext}
      >
        Continue
      </Button>
    </form>
  </div>
);

const Step4: React.FC<{ onNext: () => void }> = ({ onNext }) => {
  // Simulación de datos obtenidos de la base de datos
  const teamMembers = [
    { name: "Nicolas Bo", role: "Director" },
    { name: "Robert Smith", role: "Director" },
    { name: "Albert Bergman", role: "Director" },
  ];

  return (
    <div className="flex min-h-screen">
      <div className="w-1/3 bg-customColor-innovatio3 text-white p-10 flex flex-col justify-center">
        <h1 className="text-4xl font-bold mb-10">
          Present your team members :)
        </h1>
        <div className="flex flex-col space-y-4">
          {teamMembers.map((member, index) => (
            <div key={index} className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-gray-400 rounded-full"></div>
              <div>
                <h3 className="text-xl font-semibold">{member.name}</h3>
                <p>{member.role}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="w-2/3 bg-gray-100 p-10">
        <div className="flex justify-end">
          <Link href="/">
            <Button className="bg-gray-200 rounded-full px-4 py-2">Exit</Button>
          </Link>
        </div>
        <Link href="/">
          <button>
            <Image src="/back.png" width={18} height={18} alt="chevron" />
          </button>
        </Link>

        <div className="mt-10">
          <h2 className="text-2xl font-bold mb-4">Add Members</h2>
          <form className="space-y-4 flex flex-col">
            <input
              type="text"
              placeholder="Name"
              className="border border-gray-300 p-2 w-full rounded-full"
            />
            <input
              type="text"
              placeholder="Role"
              className="border border-gray-300 p-2 w-full rounded-full"
            />
            <textarea
              placeholder="Tell it as a description. Maximum 650 characters."
              className="border border-gray-300 p-2 w-full rounded-md"
            />
            <div className="flex space-x-4">
              <button className="w-10 h-10 bg-gray-400 rounded-full"></button>
              <button className="w-10 h-10 bg-gray-400 rounded-full"></button>
              <button className="w-10 h-10 bg-gray-400 rounded-full"></button>
              <button className="w-10 h-10 bg-gray-400 rounded-full"></button>
            </div>
            <div className="flex space-x-4">
              <input
                type="text"
                placeholder="Permissions"
                className="border border-gray-300 p-2 w-full rounded-full"
              />
              <input
                type="text"
                placeholder="Email"
                className="border border-gray-300 p-2 w-full rounded-full"
              />
            </div>
            <div className="flex justify-between">
              <Button
                className="flex h-[45px] w-[200px] justify-center items-center text-white bg-customColor-innovatio3 rounded-full px-4 py-2 border-customColor-innovatio3 border-2 hover:bg-customColor-innovatio hover:text-customColor-innovatio3"
                onClick={onNext}
              >
                Continue creating
              </Button>
              <Button
                className="flex h-[45px] w-[200px] justify-center items-center text-white bg-black rounded-full px-4 py-2 border-black border-2 hover:bg-gray-700 hover:text-white"
                onClick={onNext}
              >
                Add member
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
const CreateCampaignScreen: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const users = [
    { id: 1, wallet: "0xba1234567890abcdef1234567890abcdef123456" },
   
  ];
  const handleStepChange = (step: number) => {
    setCurrentStep(step);
  };

  return (
    <div className="flex min-h-screen">
      <div className="w-1/3 bg-customColor-innovatio3 text-white p-10 flex flex-col justify-center items-center">
        <h1 className="text-5xl border-separate text-pretty font-bold mb-10">
          Lets Start with <br /> the inicial
          <br /> description
        </h1>
        <div className="relative flex flex-col space-y-4">
          <Button
            className=" text-white bg-customColor-innovatio3 rounded-full px-4 py-2 border-customColor-innovatio border-2 hover:bg-customColor-innovatio hover:text-customColor-innovatio3"
            onClick={() => handleStepChange(1)}
          >
            Step 1
          </Button>
          <Button
            id="Step 2"
            className="text-white bg-customColor-innovatio3 rounded-full px-4 py-2 border-customColor-innovatio border-2 hover:bg-customColor-innovatio hover:text-customColor-innovatio3"
            onClick={() => handleStepChange(2)}
          >
            Step 2
          </Button>
          <Button
            className="text-white bg-customColor-innovatio3 rounded-full px-4 py-2 border-customColor-innovatio border-2 hover:bg-customColor-innovatio hover:text-customColor-innovatio3"
            onClick={() => handleStepChange(3)}
          >
            Step 3
          </Button>
          <Button
            className="text-white bg-customColor-innovatio3 rounded-full px-4 py-2 border-customColor-innovatio border-2 hover:bg-customColor-innovatio hover:text-customColor-innovatio3"
            onClick={() => handleStepChange(4)}
          >
            Step 4
          </Button>
        </div>
      </div>
      <div className="w-2/3 bg-gray-100 p-10">
        <div className="flex justify-end">
          <Avatar className="mx-auto flex flex-col mt-2.5 mr-4">
            <AvatarImage src="https://github.com/shadcn.png" />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
          {users.map((user) => (
            <AvatarWallet key={user.id} wallet={user.wallet} />
          ))}
        </div>
        <Link href="/">
          <button>
            <Image src="/back.png" width={18} height={18} alt="chevron" />
          </button>
        </Link>

        {currentStep === 1 && <Step1 onNext={() => handleStepChange(2)} />}
        {currentStep === 2 && <Step2 onNext={() => handleStepChange(3)} />}
        {currentStep === 3 && <Step3 onNext={() => handleStepChange(4)} />}
        {currentStep === 4 && <Step4 onNext={() => handleStepChange(1)} />}
      </div>
    </div>
  );
};

export default CreateCampaignScreen;
