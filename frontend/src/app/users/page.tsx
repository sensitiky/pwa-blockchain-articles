import Link from "next/link";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuCheckboxItem,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { JSX, SVGProps } from "react";
import Header from "@/assets/header";

export default function Users() {
  return (
    <div className="bg-customColor-header">
      {" "}
      <Header />
      <div className="grid min-h-screen grid-cols-[500px_1fr] bg-background text-foreground">
        <aside className="border-r border-border bg-customColor-header px-6 py-8">
          <div className="flex flex-col gap-8">
            <div className="space-y-2">
              <h2 className="text-yellow-300 text-2xl font-bold">Welcome</h2>
              <p className="text-customColor-welcome">
                Manage your articles and account settings.
              </p>
            </div>
            <nav className="space-y-1">
              <Link
                href="/users/personal"
                className="text-gray-300 flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors hover:text-white hover:underline hover:underline-offset-4 hover:decoration-yellow-500"
                prefetch={false}
              >
                <UserIcon className="h-5 w-5" />
                Personal Information
              </Link>
              <Link
                href="#"
                className="text-gray-300 flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors hover:text-white hover:underline hover:underline-offset-4 hover:decoration-yellow-500"
                prefetch={false}
              >
                <LockIcon className="h-5 w-5" />
                Log In & Security
              </Link>
              <Link
                href="#"
                className="text-gray-300 flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors hover:text-white hover:underline hover:underline-offset-4 hover:decoration-yellow-500"
                prefetch={false}
              >
                <BookmarkIcon className="h-5 w-5" />
                Saved Articles
              </Link>
              <Link
                href="#"
                className="text-gray-300 flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors hover:text-white hover:underline hover:underline-offset-4 hover:decoration-yellow-500"
                prefetch={false}
              >
                <FilePenIcon className="h-5 w-5" />
                My Articles
              </Link>
              <Link
                href="#"
                className="text-gray-300 flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors hover:text-white hover:underline hover:underline-offset-4 hover:decoration-yellow-500"
                prefetch={false}
              >
                <TrashIcon className="h-5 w-5" />
                Delete Account
              </Link>
            </nav>
          </div>
        </aside>
        <main className="p-6 md:p-8">
          <div className="flex items-center justify-between py-4">
            <h1 className="text-2xl font-bold">Your articles</h1>
            <div className="flex items-center gap-4">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="gap-2">
                    <ArrowUpDownIcon className="h-4 w-4" />
                    Order
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>Order by</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuCheckboxItem checked>
                    Date (newest first)
                  </DropdownMenuCheckboxItem>
                  <DropdownMenuCheckboxItem>
                    Date (oldest first)
                  </DropdownMenuCheckboxItem>
                  <DropdownMenuCheckboxItem>Title</DropdownMenuCheckboxItem>
                </DropdownMenuContent>
              </DropdownMenu>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="gap-2">
                    <FilterIcon className="h-4 w-4" />
                    State
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>Filter by state</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuCheckboxItem checked>
                    Published
                  </DropdownMenuCheckboxItem>
                  <DropdownMenuCheckboxItem>Draft</DropdownMenuCheckboxItem>
                  <DropdownMenuCheckboxItem>Deleted</DropdownMenuCheckboxItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
          <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2">
            <Card>
              <CardHeader className="flex items-center justify-between">
                <div className="space-y-1">
                  <h3 className="text-lg font-semibold">
                    Why Blockchain is Hard
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    A deep dive into the complexities of blockchain technology.
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Badge
                    variant="secondary"
                    className="bg-green-500/20 text-green-500"
                  >
                    Published
                  </Badge>
                  <div className="flex gap-2">
                    <Link
                      href="#"
                      aria-label="Share on Twitter"
                      prefetch={false}
                    >
                      <TwitterIcon className="h-5 w-5 text-muted-foreground hover:text-primary" />
                    </Link>
                    <Link
                      href="#"
                      aria-label="Share on Facebook"
                      prefetch={false}
                    >
                      <FacebookIcon className="h-5 w-5 text-muted-foreground hover:text-primary" />
                    </Link>
                    <Link
                      href="#"
                      aria-label="Share on LinkedIn"
                      prefetch={false}
                    >
                      <LinkedinIcon className="h-5 w-5 text-muted-foreground hover:text-primary" />
                    </Link>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">June 02, 2022</p>
              </CardContent>
              <CardFooter>
                <Button variant="outline" size="sm">
                  Read Article
                </Button>
              </CardFooter>
            </Card>
            <Card>
              <CardHeader className="flex items-center justify-between">
                <div className="space-y-1">
                  <h3 className="text-lg font-semibold">
                    Why Blockchain is Hard
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    A deep dive into the complexities of blockchain technology.
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Badge
                    variant="secondary"
                    className="bg-yellow-500/20 text-yellow-500"
                  >
                    Draft
                  </Badge>
                  <div className="flex gap-2">
                    <Link
                      href="#"
                      aria-label="Share on Twitter"
                      prefetch={false}
                    >
                      <TwitterIcon className="h-5 w-5 text-muted-foreground hover:text-primary" />
                    </Link>
                    <Link
                      href="#"
                      aria-label="Share on Facebook"
                      prefetch={false}
                    >
                      <FacebookIcon className="h-5 w-5 text-muted-foreground hover:text-primary" />
                    </Link>
                    <Link
                      href="#"
                      aria-label="Share on LinkedIn"
                      prefetch={false}
                    >
                      <LinkedinIcon className="h-5 w-5 text-muted-foreground hover:text-primary" />
                    </Link>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">June 02, 2022</p>
              </CardContent>
              <CardFooter>
                <Button variant="outline" size="sm">
                  Read Article
                </Button>
              </CardFooter>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
}

function ArrowUpDownIcon(
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
      <path d="m21 16-4 4-4-4" />
      <path d="M17 20V4" />
      <path d="m3 8 4-4 4 4" />
      <path d="M7 4v16" />
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
