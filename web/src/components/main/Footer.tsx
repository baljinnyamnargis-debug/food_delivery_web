"use client";

import Link from "next/link";
import { FaFacebook, FaInstagram } from "react-icons/fa"; // 👈 1. FacebookIcon -> Facebook болгож засав
import Image from "next/image";

export const Footer = () => {
  return (
    <footer className="w-full bg-[#18181b] text-white">
      {/* 1. Дээд талын улаан Banner хэсэг */}
      <div className="w-full bg-[#ef4444] py-4 overflow-hidden whitespace-nowrap">
        <div className="flex justify-between items-center px-8 text-white font-bold text-xl md:text-2xl tracking-wide gap-8">
          <span>Fresh fast delivered</span>
          <span>Fresh fast delivered</span>
          <span>Fresh fast delivered</span>
          <span>Fresh fast delivered</span>
          <span>Fresh fast delivered</span>
        </div>
      </div>

      {/* 2. Үндсэн Footer контент хэсэг */}
      <div className="max-w-7xl mx-auto px-6 pt-16 pb-12 flex flex-col gap-12">
        <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-5 gap-8">
          
          {/* Лого & Тайлбар */}
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
               <Image src="/Logo Container.png" width={146} height={44} alt="logo" />
            </div>
            {/* <p className="text-xs text-gray-400 pl-1">Swift delivery</p> */}
          </div>

          {/* NOMNOM цэс */}
          <div className="flex flex-col gap-4">
            <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
              NOMNOM
            </h4>
            <ul className="flex flex-col gap-2 text-sm text-gray-300">
              <li><Link href="/" className="hover:text-white transition-colors">Home</Link></li>
              <li><Link href="/contact" className="hover:text-white transition-colors">Contact us</Link></li>
              <li><Link href="/delivery" className="hover:text-white transition-colors">Delivery zone</Link></li>
            </ul>
          </div>

          {/* MENU цэс (2 багана) */}
          <div className="md:col-span-2 flex flex-col gap-4">
            <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
              MENU
            </h4>
            <div className="grid grid-cols-2 gap-x-8 gap-y-2 text-sm text-gray-300">
              <Link href="/menu/appetizers" className="hover:text-white transition-colors">Appetizers</Link>
              <Link href="/menu/side-dish" className="hover:text-white transition-colors">Side dish</Link>
              <Link href="/menu/salads" className="hover:text-white transition-colors">Salads</Link>
              <Link href="/menu/brunch" className="hover:text-white transition-colors">Brunch</Link>
              <Link href="/menu/pizzas" className="hover:text-white transition-colors">Pizzas</Link>
              <Link href="/menu/desserts" className="hover:text-white transition-colors">Desserts</Link>
              <Link href="/menu/main-dishes" className="hover:text-white transition-colors">Main dishes</Link>
              <Link href="/menu/beverages" className="hover:text-white transition-colors">Beverages</Link>
              {/* 👈 2. Давхардсан Desserts-ийг устгасан */}
              <Link href="/menu/fish-seafood" className="hover:text-white transition-colors">Fish & Sea foods</Link>
            </div>
          </div>

          {/* FOLLOW US (Сошиал сүлжээ) */}
          <div className="flex flex-col gap-4">
            <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
              FOLLOW US
            </h4>
            <div className="flex gap-4">
              <a href="#" className="w-8 h-8 rounded-full bg-white text-black flex items-center justify-center hover:bg-gray-200 transition-colors">
                <FaFacebook size={18} /> {/* 👈 1. FacebookIcon-ийг Facebook болгов */}
              </a>
              <a href="#" className="w-8 h-8 rounded-full border border-gray-600 text-white flex items-center justify-center hover:bg-neutral-800 transition-colors">
                <FaInstagram size={18} />
              </a>
            </div>
          </div>

        </div>

        {/* Зааглагч шугам */}
        <hr className="border-gray-800" />

        {/* 3. Доод талын Захирагчийн болон Бодлогын эрхүүд */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-gray-500">
          <p>Copyright 2024 © Nomnom LLC</p>
          <div className="flex gap-6">
            <Link href="/privacy" className="hover:text-gray-400 transition-colors">Privacy policy</Link>
            <Link href="/terms" className="hover:text-gray-400 transition-colors">Terms and condition</Link> {/* 👈 3. Үгний алдаа засав */}
            <Link href="/cookie" className="hover:text-gray-400 transition-colors">Cookie policy</Link>
          </div>
        </div>

      </div>
    </footer>
  );
};

export default Footer;