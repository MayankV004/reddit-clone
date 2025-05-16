"use client";
import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Search, Plus, MessageCircleMore, Bell } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Moon , Settings , UserRoundPen} from 'lucide-react';
import { useTheme } from "next-themes";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useSession , signOut } from "next-auth/react";
import { AuthButtons } from "./auth/AuthButtons";

function Navbar() {
  
  const { theme , setTheme} = useTheme();
  const {data : session} = useSession();
  
  return (
    <header className="bg-white  dark:text-white dark:bg-zinc-900 shadow-sm sticky top-0 z-10 ">
      <div className="container dark:border-b-2 mx-auto flex items-center justify-between h-13 px-4">
        {/* Logo and title */}
        <Link href="/" className="flex items-center space-x-2">
          <Image src="/Reddit_Logo.webp" alt="Logo" width={30} height={30} />
          <span className="text-orange-500 text-2xl font-bold">reddit</span>
        </Link>

        {/* Search Box */} 
        <form
          action=""
          className="w-full sm:max-w-md flex flex-1 items-center gap-5 px-2 dark:bg-zinc-700 dark:border-2 dark:border-zinc-800 bg-gray-100 border-2 border-gray-200 rounded-full py-1.5 text-sm focus:ring-2 focus:ring-blue-500 "
        >
          <Search className="w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search Reddit"
            className=" flex-1 bg-transparent focus:outline-none placeholder:text-gray-500"
          />
          <button type="submit" hidden />
        </form>

        {/* Navigation links */}

        <nav className="hidden md:flex items-center ">
          {
            session? (<>
              <Link href="#">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <div className="hover:bg-gray-100 dark:hover:bg-zinc-700 p-2 rounded-full transition duration-200 ease-in-out flex items-center">
                    <MessageCircleMore />
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Open Chat</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </Link>

          <Link href="#">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <div className="flex items-center space-x-1 dark:hover:bg-zinc-700 hover:bg-gray-100 p-2 rounded-full transition duration-200 ease-in-out">
                    <Plus />
                    <span className="text-sm block">Create</span>
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Create Post</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </Link>
          <Link href="#">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <div className="flex items-center dark:hover:bg-zinc-700 space-x-1 hover:bg-gray-100 p-2 rounded-full transition duration-200 ease-in-out">
                    <Bell />
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Open Inbox</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </Link>  
          {/* Avatar */}
          <DropdownMenu>
          {/* // Using asChild to render Custom Components Like Avatar */}
            <DropdownMenuTrigger asChild> 
              <Avatar className="cursor-pointer">
                <AvatarImage src={session.user.image || undefined}  />
                <AvatarFallback>{session.user?.username?.substring(0,2).toUpperCase()|| "UN"}</AvatarFallback>
              </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-48 mt-2">
              <DropdownMenuLabel>{session.user?.username || "My Account"}</DropdownMenuLabel>
              <DropdownMenuSeparator />

              <Link href="/profile">
                <DropdownMenuItem><UserRoundPen/> Profile</DropdownMenuItem>
              </Link>

              <Link href="#">
                <DropdownMenuItem><Settings/> Settings</DropdownMenuItem>
              </Link>

              <DropdownMenuItem asChild>
                <div className="flex items-center justify-between w-full">
                  <div className="flex items-center gap-2">
                    <Moon/>
                    <Label className="text-sm">Dark Mode</Label>
                  </div>
                  <Switch
                    checked={theme === "dark"}
                    onCheckedChange={(checked) => setTheme(checked ? "dark" : "light")}
                  />
                </div>
                  
                
              </DropdownMenuItem>

             
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="text-red-600 cursor-pointer"
                onClick={()=>signOut()}
              >
                Log out
              </DropdownMenuItem>
 
            </DropdownMenuContent>
          </DropdownMenu>
            </>):(<AuthButtons/>)
          }
          
        </nav>
        <div className="md:hidden">
          {!session && <AuthButtons />}
        </div>
      </div>
    </header>
  );
}

export default Navbar;
