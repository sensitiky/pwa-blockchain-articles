import { Button } from "@/components/ui/button";
import Link from "next/link";
import { SVGProps } from "react";

export default function Header() {
  return (
    <div>
      <header className="flex items-center justify-between px-4 lg:px-6 h-14 border-b">
        <Link href="#" className="flex items-center" prefetch={false}>
          <MountainIcon className="h-6 w-6" />
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

function MountainIcon(
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
      <path d="m8 3 4 8 5-5 5 15H2L8 3z" />
    </svg>
  );
}
