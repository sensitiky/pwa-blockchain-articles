import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useRouter } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export function DropdownMenuAvatar({ user }: { user: { name: string; profilePicture: string } }) {
  const router = useRouter();

  const handleUserNavigation = (path: string) => {
    router.push(path);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="p-0 rounded-full">
          <Avatar className="rounded-full">
            <AvatarImage src={user.profilePicture} />
            <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        <DropdownMenuLabel>My Account</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem onClick={() => handleUserNavigation("/users/profile")}>
            Profile
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleUserNavigation("/users/billing")}>
            Billing
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleUserNavigation("/users/settings")}>
            Settings
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem onClick={() => handleUserNavigation("/users/team")}>
            Team
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleUserNavigation("/users/new-team")}>
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
