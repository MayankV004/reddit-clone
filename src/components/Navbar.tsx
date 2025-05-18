"use client";
import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Moon, Settings, UserRoundPen } from "lucide-react";
import { useTheme } from "next-themes";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useSession, signOut } from "next-auth/react";
import { AuthButtons } from "./auth/AuthButtons";

function Navbar() {
  const { theme, setTheme } = useTheme();
  const { data: session } = useSession();

  return (
    <header className="bg-white  dark:text-white dark:bg-zinc-900 shadow-sm sticky top-0 z-10 ">
      <div className="container dark:border-b-2 mx-auto flex flex-1 items-center justify-between h-13 border-4">
        {/* Logo and title */}
        <div >
          <Link href="/" className=" flex  items-center space-x-2">
            <Image src="/Reddit_Logo.webp" alt="Logo" width={30} height={30} />
            <span className="text-orange-500 text-2xl font-bold">reddit</span>
          </Link>
        </div>

        <nav className=" absolute right-4 ">
          {session ? (
            <>
              {/* Avatar */}
              <DropdownMenu>
                {/* // Using asChild to render Custom Components Like Avatar */}
                <DropdownMenuTrigger asChild>
                  <Avatar className="cursor-pointer">
                    <AvatarImage src={session.user.image || undefined} />
                    <AvatarFallback>
                      {session.user?.username?.substring(0, 2).toUpperCase() ||
                        "UN"}
                    </AvatarFallback>
                  </Avatar>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-48 mt-2">
                  <DropdownMenuLabel>
                    {session.user?.username || "My Account"}
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />

                  <Link href="/profile">
                    <DropdownMenuItem>
                      <UserRoundPen /> Profile
                    </DropdownMenuItem>
                  </Link>

                  <Link href="#">
                    <DropdownMenuItem>
                      <Settings /> Settings
                    </DropdownMenuItem>
                  </Link>

                  <DropdownMenuItem asChild>
                    <div className="flex items-center justify-between w-full">
                      <div className="flex items-center gap-2">
                        <Moon />
                        <Label className="text-sm">Dark Mode</Label>
                      </div>
                      <Switch
                        checked={theme === "dark"}
                        onCheckedChange={(checked) =>
                          setTheme(checked ? "dark" : "light")
                        }
                      />
                    </div>
                  </DropdownMenuItem>

                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    className="text-red-600 cursor-pointer"
                    onClick={() => signOut()}
                  >
                    Log out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <AuthButtons />
          )}
        </nav>
        <div className="md:hidden">{!session && <AuthButtons />}</div>
      </div>
    </header>
  );
}

export default Navbar;
