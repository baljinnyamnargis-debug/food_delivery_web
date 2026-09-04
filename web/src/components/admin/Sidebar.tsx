"use client";

import { LayoutGrid, Settings, Truck } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation"; 

export const Sidebar = () => {
  const pathname = usePathname();
  const menuItems = [
    { name: "Food menu", href: "/admin/menu", active: pathname === "/admin/menu", icon: LayoutGrid},
    { name: "Orders", href: "/admin/orders", active: pathname === "/admin/orders", icon: Truck},
    { name: "Settings", href: "/admin/settings", active: pathname === "/admin/settings", icon: Settings},
  ];

  return (
    <div className="flex flex-col w-[205px] h-screen bg-white py-9 px-5 items-start gap-10 shrink-0 border-r border-gray-100">
      <nav className="flex flex-col w-full gap-2 text-sm font-medium">
        {menuItems.map((item, index) => {
          const IconComponent = item.icon;
        
        return (
          <Link
            key={index}
            href={item.href}
            className={`flex gap-2 w-full px-4 py-2.5 rounded-xl transition-colors ${
              item.active
                ? "bg-black text-white font-semibold"
                : "text-gray-500 hover:bg-black hover:text-white"
            }`}
          >
            <IconComponent className="w-5 h-5" />
            <span>{item.name}</span>
            
          </Link>
        );
})}
      </nav>
      
    </div>
  );
};