import { Button } from "@/components/ui/button";
import Link from "next/link";
import { SVGProps } from "react";
import Image from "next/image";
import { useRouter } from 'next/navigation';

interface HeaderProps {
  isAuthenticated: boolean;
}

export default function Header({ isAuthenticated }: HeaderProps) {
  const router = useRouter();

  const handleStartNewCampaign = () => {
    if (!isAuthenticated) {
      router.push('/test'); // Redirect to the registration page if not authenticated
    } else {
      router.push('/new-campaign'); // Redirect to the new campaign page if authenticated
    }
  };

  return (
    <div>
      <header className="flex items-center justify-between px-4 lg:px-6 h-14 border-b">
        <Link href="/" className="flex items-center" prefetch={false}>
          <Image src="/Logo.svg" alt="logo" width={150} height={24} className="h-auto w-[150px]" />
          <span className="sr-only">Acme Inc</span>
        </Link>
        <nav className="hidden lg:flex items-center gap-6">
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
        <div className="hidden lg:flex items-center gap-4">
          <Link href="#" className="flex items-center gap-2" prefetch={false}>
            <CalendarIcon className="h-5 w-5" />
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
        </div>
      </header>
    </div>
  );
}

function CalendarIcon(
  props: JSX.IntrinsicAttributes & SVGProps<SVGSVGElement>
) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M8 2v4" />
      <path d="M16 2v4" />
      <rect width="18" height="18" x="3" y="4" rx="2" />
      <path d="M3 10h18" />
    </svg>
  );
}