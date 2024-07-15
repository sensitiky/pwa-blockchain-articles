import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { JSX, SVGProps } from "react";
import Header from "@/assets/header";

export default function Component() {
  return (
    <div className="bg-customColor-header">
      <Header />
      <div className="grid min-h-screen grid-cols-[280px_1fr] bg-customColor-header text-foreground">
        <aside className="border-r border-border px-6 py-8">
          <div className="flex flex-col gap-8">
            <div className="space-y-2">
              <h2 className="text-white text-2xl font-bold">Welcome</h2>
              <p className="text-gray-300">
                Manage your articles and account settings.
              </p>
            </div>
            <nav className="space-y-1">
              <Link
                href="/users/personal"
                className="text-gray-300 flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground"
                prefetch={false}
              >
                <UserIcon className="h-5 w-5" />
                Personal Information
              </Link>
              <Link
                href="#"
                className="text-gray-300 flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground"
                prefetch={false}
              >
                <LockIcon className="h-5 w-5" />
                Log In & Security
              </Link>
              <Link
                href="#"
                className="text-gray-300 flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground"
                prefetch={false}
              >
                <BookmarkIcon className="h-5 w-5" />
                Saved Articles
              </Link>
              <Link
                href="#"
                className="text-gray-300 flex items-center gap-2 rounded-md bg-accent px-3 py-2 text-sm font-medium transition-colors hover:bg-accent/90"
                prefetch={false}
              >
                <FilePenIcon className="h-5 w-5" />
                My Articles
              </Link>
              <Link
                href="#"
                className="text-gray-300 flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground"
                prefetch={false}
              >
                <TrashIcon className="h-5 w-5" />
                Delete Account
              </Link>
            </nav>
          </div>
        </aside>
        <div className="flex-1 bg-gradient-to-t from-white to-[#f0f8ff] flex flex-col items-center pt-12 md:pt-24 px-4 md:px-6">
          <div className="flex items-center gap-4">
            <Avatar className="w-24 h-24 md:w-32 md:h-32">
              <AvatarImage src="/placeholder-user.jpg" />
              <AvatarFallback>NB</AvatarFallback>
            </Avatar>
            <h1 className="text-3xl md:text-4xl font-bold">Hi, Nicolas</h1>
          </div>
          <div className="w-full max-w-2xl mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="grid gap-1">
                <Label>Name</Label>
                <div className="flex items-center justify-between">
                  <span>Bolardo Nicolas</span>
                  <Separator className="flex-1 ml-4" />
                </div>
              </div>
              <div className="grid gap-1">
                <Label>Date</Label>
                <div className="flex items-center justify-between">
                  <span>April 28, 1989</span>
                  <Separator className="flex-1 ml-4" />
                </div>
              </div>
              <div className="grid gap-1">
                <Label>Email</Label>
                <div className="flex items-center justify-between">
                  <span>nicolasbolardo@gmail.com</span>
                  <Separator className="flex-1 ml-4" />
                </div>
              </div>
              <div className="grid gap-1">
                <Label>Country</Label>
                <div className="flex items-center justify-between">
                  <span className="text-red-500">Not proportioned</span>
                  <Separator className="flex-1 ml-4" />
                </div>
              </div>
              <Link
                href="#"
                className="text-primary underline"
                prefetch={false}
              >
                Edit information
              </Link>
            </div>
            <div className="space-y-4">
              <div className="space-y-2">
                <h2 className="text-2xl font-bold">My Bio</h2>
                <p className="text-gray-300">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed
                  euismod, nisl nec ultricies lacinia, nisl nisl aliquam nisl,
                  eget aliquam nisl nisl sit amet nisl.
                </p>
              </div>
              <div className="flex gap-4">
                <Link
                  href="#"
                  className="text-primary hover:underline"
                  prefetch={false}
                >
                  <FacebookIcon className="w-6 h-6" />
                </Link>
                <Link
                  href="#"
                  className="text-primary hover:underline"
                  prefetch={false}
                >
                  <InstagramIcon className="w-6 h-6" />
                </Link>
                <Link
                  href="#"
                  className="text-primary hover:underline"
                  prefetch={false}
                >
                  <TwitterIcon className="w-6 h-6" />
                </Link>
                <Link
                  href="#"
                  className="text-primary hover:underline"
                  prefetch={false}
                >
                  <LinkedinIcon className="w-6 h-6" />
                </Link>
              </div>
            </div>
          </div>
          <div className="w-full max-w-2xl mt-8 flex items-center justify-between">
            <Badge variant="secondary" className="flex items-center gap-2">
              <PencilIcon className="w-4 h-4" />
              Content Creator
            </Badge>
            <div className="text-gray-300">171 articles</div>
          </div>
        </div>
      </div>
    </div>
  );
}

function FacebookIcon(
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
      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
    </svg>
  );
}

function InstagramIcon(
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
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
    </svg>
  );
}

function LinkedinIcon(
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
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
      <rect width="4" height="12" x="2" y="9" />
      <circle cx="4" cy="4" r="2" />
    </svg>
  );
}

function PencilIcon(props: JSX.IntrinsicAttributes & SVGProps<SVGSVGElement>) {
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
      <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
      <path d="m15 5 4 4" />
    </svg>
  );
}

function TwitterIcon(props: JSX.IntrinsicAttributes & SVGProps<SVGSVGElement>) {
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
      <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
    </svg>
  );
}

function XIcon(props: JSX.IntrinsicAttributes & SVGProps<SVGSVGElement>) {
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
      <path d="M18 6 6 18" />
      <path d="m6 6 12 12" />
    </svg>
  );
}

function BookmarkIcon(
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
      <path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z" />
    </svg>
  );
}

function FilePenIcon(props: JSX.IntrinsicAttributes & SVGProps<SVGSVGElement>) {
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
      <path d="M12 22h6a2 2 0 0 0 2-2V7l-5-5H6a2 2 0 0 0-2 2v10" />
      <path d="M14 2v4a2 2 0 0 0 2 2h4" />
      <path d="M10.4 12.6a2 2 0 1 1 3 3L8 21l-4 1 1-4Z" />
    </svg>
  );
}

function FilterIcon(props: JSX.IntrinsicAttributes & SVGProps<SVGSVGElement>) {
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
      <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
    </svg>
  );
}

function LockIcon(props: JSX.IntrinsicAttributes & SVGProps<SVGSVGElement>) {
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
      <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
  );
}

function TrashIcon(props: JSX.IntrinsicAttributes & SVGProps<SVGSVGElement>) {
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
      <path d="M3 6h18" />
      <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
      <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
    </svg>
  );
}

function UserIcon(props: JSX.IntrinsicAttributes & SVGProps<SVGSVGElement>) {
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
      <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  );
}
