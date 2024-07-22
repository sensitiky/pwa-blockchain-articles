import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useRouter } from "next/navigation";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

interface User {
  firstName?: string;
  lastName?: string;
  date?: Date;
  email?: string;
  usuario?: string;
  country?: string;
  medium?: string;
  instagram?: string;
  facebook?: string;
  twitter?: string;
  linkedin?: string;
  bio?: string;
  avatar?: string;
  postCount?: number;
}

export function DropdownMenuAvatar({ user }: { user: User }) {
  const router = useRouter();

  const handleUserNavigation = (path: string) => {
    router.push(path);
  };

  const avatarUrl = user.avatar?.startsWith("http")
    ? user.avatar
    : `https://blogchain.onrender.com${user.avatar}`;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="p-0 rounded-full">
          <Avatar className="rounded-full">
            <img
              src={avatarUrl}
              alt="User Avatar"
              className="rounded-full w-full h-full object-cover"
            />
            <AvatarFallback>
              {user.firstName?.charAt(0) || user.email?.charAt(0)}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        <DropdownMenuLabel>My Account</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem
            onClick={() => handleUserNavigation("/users/profile")}
          >
            Profile
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => handleUserNavigation("/users/billing")}
          >
            Billing
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => handleUserNavigation("/users/settings")}
          >
            Settings
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem onClick={() => handleUserNavigation("/users/team")}>
            Team
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => handleUserNavigation("/users/new-team")}
          >
            New Team
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => handleUserNavigation("/logout")}>
          Log out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
