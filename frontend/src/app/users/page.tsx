"use client";
import Link from "next/link";
import { SVGProps, useState } from "react";
import { FaCamera } from "react-icons/fa";
import Select from "react-select";
import countryList from "react-select-country-list";
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Header from "@/assets/header";

export default function Users() {
  const [selectedSection, setSelectedSection] = useState("personal");
  const [editMode, setEditMode] = useState(false);
  const [bioEditMode, setBioEditMode] = useState(false);
  const [bio, setBio] = useState(
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed euismod, nisl nec ultricies lacinia, nisl nisl aliquam nisl, eget aliquam nisl nisl sit amet nisl."
  );
  const [userInfo, setUserInfo] = useState({
    name: "Bolardo Nicolas",
    date: "April 28, 1989",
    email: "nicolasbolardo@gmail.com",
    country: ["Not provided"],
  });
  const [profileImage, setProfileImage] = useState<string>("/shadcn.jpg");
  const options = countryList().getData();

  const handleEditToggle = () => {
    setEditMode(!editMode);
  };

  const handleBioEditToggle = () => {
    setBioEditMode(!bioEditMode);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUserInfo({ ...userInfo, [name]: value });
  };

  const handleCountryChange = (selectedOption: any) => {
    setUserInfo({ ...userInfo, country: [selectedOption.label] });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (reader.result) {
          setProfileImage(reader.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleEditBio = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setBio(e.target.value);
  };

  const renderContent = () => {
    switch (selectedSection) {
      case "personal":
        return (
          <div className="flex-1 flex flex-col items-center pt-12 md:pt-24 px-4 md:px-6">
            <div className="flex items-center gap-6">
              <Avatar className="w-24 h-24 md:w-32 md:h-32">
                <AvatarImage src={profileImage} />
                <AvatarFallback>NB</AvatarFallback>
              </Avatar>
              <label htmlFor="profile-image-upload" className="cursor-pointer">
                <FaCamera className="w-6 h-6 text-primary" />
                <input
                  id="profile-image-upload"
                  type="file"
                  className="hidden"
                  onChange={handleImageChange}
                />
              </label>
              <h1 className="text-3xl md:text-4xl font-bold">Hi, Nicolas</h1>
            </div>
            <div className="w-full max-w-2xl mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="grid gap-1">
                  <Label>Name</Label>
                  {editMode ? (
                    <Input
                      name="name"
                      value={userInfo.name}
                      onChange={handleInputChange}
                    />
                  ) : (
                    <div className="flex items-center justify-between">
                      <span>{userInfo.name}</span>
                      <Separator className="flex-1 ml-4" />
                    </div>
                  )}
                </div>
                <div className="grid gap-1">
                  <Label>Date</Label>
                  {editMode ? (
                    <Input
                      name="date"
                      value={userInfo.date}
                      onChange={handleInputChange}
                    />
                  ) : (
                    <div className="flex items-center justify-between">
                      <span>{userInfo.date}</span>
                      <Separator className="flex-1 ml-4" />
                    </div>
                  )}
                </div>
                <div className="grid gap-1">
                  <Label>Email</Label>
                  {editMode ? (
                    <Input
                      name="email"
                      value={userInfo.email}
                      onChange={handleInputChange}
                    />
                  ) : (
                    <div className="flex items-center justify-between">
                      <span>{userInfo.email}</span>
                      <Separator className="flex-1 ml-4" />
                    </div>
                  )}
                </div>
                <div className="grid gap-1">
                  <Label>Country</Label>
                  {editMode ? (
                    <Select
                      options={options}
                      value={{
                        label: userInfo.country[0],
                        value: userInfo.country[0],
                      }}
                      onChange={handleCountryChange}
                      className="w-full"
                    />
                  ) : (
                    <div className="flex items-center justify-between">
                      <span
                        className={
                          userInfo.country.includes("Not provided")
                            ? "text-red-500"
                            : ""
                        }
                      >
                        {userInfo.country.join(", ")}
                      </span>
                      <Separator className="flex-1 ml-4" />
                    </div>
                  )}
                </div>
                <Button
                  variant="outline"
                  className="w-full bg-inherit border-none hover:bg-inherit hover:underline text-black"
                  onClick={handleEditToggle}
                >
                  {editMode ? "Save Changes" : "Edit Information"}
                </Button>
              </div>
              <div className="space-y-4">
                <div className="space-y-2">
                  <h2 className="text-2xl font-bold">My Bio</h2>
                  {bioEditMode ? (
                    <textarea
                      value={bio}
                      onChange={handleEditBio}
                      rows={10}
                      className="w-full p-2 border rounded resize-none"
                    />
                  ) : (
                    <p className="text-gray-500">{bio}</p>
                  )}
                </div>
                <Button
                  variant="outline"
                  className="w-full bg-inherit border-none hover:bg-inherit hover:underline text-black"
                  onClick={handleBioEditToggle}
                >
                  {bioEditMode ? "Save Changes" : "Edit Bio"}
                </Button>
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
            </div>
          </div>
        );
      case "security":
        return (
          <div className="flex-1 p-6 sm:p-10">
            <div className="mx-auto max-w-3xl">
              <div className="flex items-center gap-4">
                <Avatar className="h-16 w-16">
                  <AvatarImage src="/shadcn.jpg" />
                  <AvatarFallback>NC</AvatarFallback>
                </Avatar>
                <div>
                  <h1 className="text-2xl font-bold">Hi, Nicolas</h1>
                  <p className="text-muted-foreground">
                    Welcome to your profile settings.
                  </p>
                </div>
              </div>
              <Separator className="my-6" />
              <div className="grid gap-6">
                <div className="grid gap-2">
                  <div className="flex items-center justify-between">
                    <div className="text-sm font-medium">Password</div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      Provided
                      <Button variant="ghost" size="icon">
                        <FilePenIcon className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="text-sm font-medium">Medium</div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      Not Provided
                      <Button variant="ghost" size="icon">
                        <FilePenIcon className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="text-sm font-medium">Instagram</div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      Provided
                      <Button variant="ghost" size="icon">
                        <FilePenIcon className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="text-sm font-medium">Facebook</div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      Provided
                      <Button variant="ghost" size="icon">
                        <FilePenIcon className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="text-sm font-medium">Twitter</div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      Not Provided
                      <Button variant="ghost" size="icon">
                        <FilePenIcon className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="text-sm font-medium">LinkedIn</div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      Provided
                      <Button variant="ghost" size="icon">
                        <FilePenIcon className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
                <Button className="w-full bg-inherit border-none hover:bg-inherit text-black hover:underline hover:underline-offset-4 hover:decoration-black">
                  Save Changes
                </Button>{" "}
              </div>
            </div>
          </div>
        );
      case "saved":
        return (
          <section className="w-full py-12 md:py-24 lg:py-32">
            <div className="container px-4 md:px-6">
              <h2 className="text-center text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                Your favorite items
              </h2>
              <div className="mt-10 grid gap-6">
                <div className="flex items-center rounded-none border-b-2 bg-card p-4 sm:p-6">
                  <Avatar className="mr-4">
                    <AvatarImage src="/shadcn.jpg" />
                    <AvatarFallback>NM</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <h3 className="text-lg font-bold">
                      Why Blockchain is Hard
                    </h3>
                    <p className="text-muted-foreground">
                      The hype around blockchain is massive. To hear the
                      blockchain hype train tell it, blockchain will now: Solve
                      income inequality. Make all data secure forever. Make
                      everything much more efficient and trustless. Save dying.
                    </p>
                  </div>
                  <img
                    src="/test.jpg"
                    width={80}
                    height={80}
                    alt="Placeholder"
                    className="rounded-full"
                  />
                  <Button variant="ghost" className="ml-4">
                    <HeartIcon className="h-5 w-5" />
                  </Button>
                </div>
                <div className="flex items-center rounded-none border-b-2 bg-card p-4 sm:p-6">
                  <Avatar className="mr-4">
                    <AvatarImage src="/shadcn.jpg" />
                    <AvatarFallback>NM</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <h3 className="text-lg font-bold">
                      Why Blockchain is Hard
                    </h3>
                    <p className="text-muted-foreground">
                      The hype around blockchain is massive. To hear the
                      blockchain hype train tell it, blockchain will now: Solve
                      income inequality. Make all data secure forever. Make
                      everything much more efficient and trustless. Save dying.
                    </p>
                  </div>
                  <img
                    src="/test.jpg"
                    width={80}
                    height={80}
                    alt="Placeholder"
                    className="rounded-full"
                  />
                  <Button variant="ghost" className="ml-4">
                    <HeartIcon className="h-5 w-5" />
                  </Button>
                </div>
                <div className="flex items-center rounded-none border-b-2 bg-card p-4 sm:p-6">
                  <Avatar className="mr-4">
                    <AvatarImage src="/shadcn.jpg" />
                    <AvatarFallback>NM</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <h3 className="text-lg font-bold">
                      Why Blockchain is Hard
                    </h3>
                    <p className="text-muted-foreground">
                      The hype around blockchain is massive. To hear the
                      blockchain hype train tell it, blockchain will now: Solve
                      income inequality. Make all data secure forever. Make
                      everything much more efficient and trustless. Save dying.
                    </p>
                  </div>
                  <img
                    src="/test.jpg"
                    width={80}
                    height={80}
                    alt="Placeholder"
                    className="rounded-full"
                  />
                  <Button variant="ghost" className="ml-4">
                    <HeartIcon className="h-5 w-5" />
                  </Button>
                </div>
              </div>
            </div>
          </section>
        );
      case "articles":
        return (
          <>
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
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
            <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-1">
              <Card>
                <CardHeader className="flex items-center justify-between">
                  <div className="space-y-1">
                    <h3 className="text-lg font-semibold">
                      Why Blockchain is Hard
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      A deep dive into the complexities of blockchain
                      technology.
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
                      A deep dive into the complexities of blockchain
                      technology.
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
          </>
        );
      case "delete":
        return <div>Delete Account Content</div>;
      default:
        return null;
    }
  };

  return (
    <div className="bg-customColor-header">
      <Header />
      <div className="grid min-h-screen grid-cols-[400px_1fr] bg-background text-foreground">
        <aside className="border-r border-border bg-customColor-header px-6 py-8">
          <div className="flex flex-col gap-8">
            <div className="space-y-2">
              <h2 className="text-white text-2xl font-bold">Welcome</h2>
              <p className="text-customColor-welcome">
                Manage your articles and account settings.
              </p>
            </div>
            <nav className="space-y-1">
              <button
                onClick={() => setSelectedSection("personal")}
                className="text-gray-300 flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors hover:text-white hover:underline hover:underline-offset-4 hover:decoration-yellow-500"
              >
                <UserIcon className="h-5 w-5" />
                Personal Information
              </button>
              <button
                onClick={() => setSelectedSection("security")}
                className="text-gray-300 flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors hover:text-white hover:underline hover:underline-offset-4 hover:decoration-yellow-500"
              >
                <LockIcon className="h-5 w-5" />
                Security & Social Links
              </button>
              <button
                onClick={() => setSelectedSection("saved")}
                className="text-gray-300 flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors hover:text-white hover:underline hover:underline-offset-4 hover:decoration-yellow-500"
              >
                <BookmarkIcon className="h-5 w-5" />
                Saved Articles
              </button>
              <button
                onClick={() => setSelectedSection("articles")}
                className="text-gray-300 flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors hover:text-white hover:underline hover:underline-offset-4 hover:decoration-yellow-500"
              >
                <FilePenIcon className="h-5 w-5" />
                My Articles
              </button>
            </nav>
          </div>
        </aside>
        <main className="p-6 md:p-8">{renderContent()}</main>
      </div>
    </div>
  );
}
function HeartIcon(props: JSX.IntrinsicAttributes & SVGProps<SVGSVGElement>) {
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
      <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
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
