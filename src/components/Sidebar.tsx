"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Home,
  Users,
  MessageCircle,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface NavItem {
  label: string;
  href: string;
  icon: React.ReactNode;
}

const navItems: NavItem[] = [
  { label: "Home", href: "/", icon: <Home size={20} /> },
  { label: "Communities", href: "/communities", icon: <Users size={20} /> },
  { label: "Messages", href: "#", icon: <MessageCircle size={20} /> },
];

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState<boolean>(true);

  

  return (
    <motion.aside
      initial={{ width: isOpen ? 200 : 56 }}
      animate={{ width: isOpen ? 200 : 56 }}
      transition={{ type: "spring", stiffness: 200, damping: 25 }}
      className=" bg-white border-r overflow-hidden flex flex-col dark:bg-zinc-900 dark:border-zinc-700 h-full shadow-sm"
    >
      {/* Toggle */}
      <div className="flex justify-end p-2">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsOpen((o) => !o)}
          aria-label={isOpen ? "Collapse sidebar" : "Expand sidebar"}
        >
          {isOpen ? <ChevronLeft /> : <ChevronRight />}
        </Button>
      </div>

      {/* Nav */}
      <nav className="flex-1 ">
        <ul className="space-y-1">
          {navItems.map(({ label, href, icon }) => (
            <li key={href}>
              <Link
                href={href}
                className="
                  flex items-center
                  gap-3
                  px-3 py-2
                  text-sm font-medium
                  rounded-md
                  hover:bg-gray-100
                  dark:hover:bg-zinc-800
                  transition
                "
              >
                {icon}
                {isOpen && <span>{label}</span>}
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      {/* Footer */}
      <div className="p-4">
        {isOpen && <span className="text-xs text-gray-500">v1.0.0</span>}
      </div>
    </motion.aside>
  );
}
