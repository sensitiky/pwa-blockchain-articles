"use client";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useState } from "react";
import { DatePicker } from "./calendar";

interface HeaderProps {
  isAuthenticated: boolean;
}

export default function Header({ isAuthenticated }: HeaderProps) {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const handleStepChange = (landing: number) => {
    setCurrentStep(landing);
  };

  const handleStartNewCampaign = () => {
    if (!isAuthenticated) {
      router.push("/authentication");
    } else {
      router.push("/new-campaign");
    }
  };

  return (
    <div>
      <div className="lg:hidden flex items-center justify-between px-4 lg:px-6 h-14 border-b">
        <Link href="/" className="flex items-center" prefetch={false}>
          <Image
            src="/Logo.svg"
            alt="logo"
            width={150}
            height={24}
            className="h-auto w-[150px]"
          />
          <span className="sr-only">Acme Inc</span>
        </Link>
        <Sheet>
          <SheetTrigger>
            <Button className="bg-customColor-innovatio3 rounded-full px-4 py-2 text-sm font-medium">
              Menu
            </Button>
          </SheetTrigger>
          <SheetContent>
            <SheetHeader>
              <SheetTitle>Navigation</SheetTitle>
              <SheetDescription>
                This is the mobile navigation menu.
              </SheetDescription>
            </SheetHeader>
            <nav className="flex flex-col gap-4">
              <Link
                href="#"
                className="text-sm font-medium hover:underline underline-offset-4"
                prefetch={false}
              >
                How it works
              </Link>
              <Link
                href="#"
                className="text-sm font-medium hover:underline underline-offset-4"
                prefetch={false}
              >
                About us
              </Link>
              <Link
                href="#"
                className="text-sm font-medium hover:underline underline-offset-4"
                prefetch={false}
              >
                Help with the Campaign
              </Link>
              <Button
                variant="outline"
                className="bg-customColor-innovatio2 rounded-full px-4 py-2 text-sm font-medium hover:bg-white"
                onClick={handleStartNewCampaign}
              >
                Start New Campaign
              </Button>
              <Button className="bg-customColor-innovatio3 rounded-full px-4 py-2 text-sm font-medium">
                Connect Wallet
              </Button>
            </nav>
          </SheetContent>
        </Sheet>
      </div>

      <header className="hidden lg:flex items-center justify-between px-4 lg:px-6 h-14 border-b">
        <Link href="/" className="flex items-center" prefetch={false}>
          <Image
            src="/Logo.svg"
            alt="logo"
            width={150}
            height={24}
            className="h-auto w-[150px]"
          />
          <span className="sr-only">Acme Inc</span>
        </Link>
        <nav className="flex items-center mx-auto ml-10 gap-6">
          <Link
            href="#"
            className="text-sm font-medium hover:underline underline-offset-4"
            prefetch={false}
          >
            How it works
          </Link>
          <Link
            href="#"
            className="text-sm font-medium hover:underline underline-offset-4"
            prefetch={false}
          >
            About us
          </Link>
          <Link
            href="#"
            className="text-sm font-medium hover:underline underline-offset-4"
            prefetch={false}
          >
            Help with the Campaign
          </Link>
        </nav>
        <div className="flex items-center gap-4">
          <DatePicker />
          <Button
            variant="outline"
            className="bg-customColor-innovatio2 rounded-full px-4 py-2 text-sm font-medium border-2 border-customColor-innovatio3 hover:bg-customColor-innovatio3 hover:text-customColor-innovatio2"
            onClick={handleStartNewCampaign}
          >
            Start New Campaign
          </Button>
          <Button className="bg-customColor-innovatio3 rounded-full px-4 py-2 border-2 border-customColor-innovatio2 text-sm font-medium hover:border-customColor-innovatio3 hover:bg-customColor-innovatio hover:text-customColor-innovatio3">
            Connect Wallet
          </Button>
        </div>
      </header>
    </div>
  );
}
