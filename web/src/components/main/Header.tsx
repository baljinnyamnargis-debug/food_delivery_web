"use client";

import Image from "next/image";
import { Button } from "../ui/button";
import { useContext, useEffect, useState } from "react"; 
import { UserContext } from "@/context/UserContext";
import {
  ChevronRight,
  MapPin,
  ShoppingCartIcon,
  User2Icon,
} from "lucide-react";
import Link from "next/link";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface HeaderProps {
  onCartClick?: () => void;
  cartCount?: number;
  onAddressClick?: () => void;
  currentAddress?: string; 
}

export const Header: React.FC<HeaderProps> = ({ 
  onCartClick, 
  cartCount = 0, 
  onAddressClick,
  currentAddress = "" 
}) => {
  const context = useContext(UserContext);
  const [isMounted, setIsMounted] = useState(false); 

  useEffect(() => {
    setIsMounted(true);
  }, []);

  return (
    <div className="w-full bg-[#181818] flex justify-between items-center py-3 px-28">
      <div>
        <Image src="/Logo Container.png" width={146} height={44} alt="logo" />
      </div>

      <div className="flex items-center gap-[12.81px]">
        
        {!context?.user && (
          <Button 
            onClick={onAddressClick} 
            className="flex items-center gap-1 bg-white text-black px-4 py-2 rounded-full border border-gray-200 cursor-pointer hover:bg-gray-50 transition"
          >
            <MapPin className="w-5 h-5 text-red-500" />
            <span className="text-sm font-medium text-red-500">Delivery address:</span>
            <span className="text-gray-500 truncate max-w-[150px]">
              {currentAddress || "Add location"}
            </span>
            <ChevronRight className="w-4 h-4 text-gray-400" />
          </Button>
        )}

        <Button
          onClick={onCartClick} 
          className="relative flex items-center justify-center w-9 h-9 bg-white text-gray-700 px-4 py-2 rounded-full border border-gray-200 hover:scale-105 hover:shadow-md active:scale-95 hover:text-white cursor-pointer"
        >
          <ShoppingCartIcon className="w-5 h-5 text-gray-700" />
          

          {isMounted && cartCount > 0 && (
            <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 flex items-center justify-center bg-red-500 text-[10px] font-bold text-white rounded-full ring-2 ring-white">
              {cartCount}
            </span>
          )}
        </Button>

        {context?.user ? (
          <>
            <Button 
              onClick={onAddressClick} 
              className="flex items-center gap-1 bg-white text-black px-4 py-2 rounded-full border border-gray-200 cursor-pointer hover:bg-gray-50 transition"
            >
              <MapPin className="w-5 h-5 text-red-500" />
              <span className="text-sm font-medium text-red-500">Delivery address:</span>
              <span className="text-gray-500 truncate max-w-[150px]">
                {currentAddress || "Add location"} 
              </span>
              <ChevronRight className="w-4 h-4 text-gray-400" />
            </Button>

            <Popover>
              <PopoverTrigger asChild>
                <Button className="flex items-center justify-center w-9 h-9 bg-red-500 px-4 py-2 rounded-full border-none hover:bg-gray-50 transition-colors hover:text-black cursor-pointer">
                  <User2Icon />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="text-black font-normal font-semibold w-[200px] bg-white rounded-lg shadow-lg p-4 flex flex-col items-center justify-center gap-2">
                {context.user.email}
                <Button
                  variant="secondary"
                  onClick={() => context.logout()}
                  className="bg-gray-200 hover:bg-gray-400 cursor-pointer mt-2 w-[80px] h-[36px] text-[#18181B] rounded-lg text-sm font-medium"
                >
                  Sign out
                </Button>
              </PopoverContent>
            </Popover>
          </>
        ) : (
          <div className="flex gap-4">
            <Link href="/signup">
              <Button className="bg-[#F4F4F5] hover:bg-[#f4f4f55f] text-black cursor-pointer rounded-full px-4 py-2 text-sm font-medium">
                Sign up
              </Button>
            </Link>
            <Link href="/signin">
              <Button className="bg-red-500 hover:bg-red-700 text-white cursor-pointer rounded-full px-4 py-2 text-sm font-medium">
                Sign in
              </Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};
