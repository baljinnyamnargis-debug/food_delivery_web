"use client";

import React from 'react';
import { useRouter } from 'next/navigation';

interface LoginAlertModalProps {
  isOpen: boolean;
  onClose: () => void;
  message?: string;
}

export const LoginAlertModal: React.FC<LoginAlertModalProps> = ({ isOpen, onClose, message }) => {
  const router = useRouter();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center bg-black/60 backdrop-blur-xs">
      <div className="relative w-full max-w-sm rounded-2xl bg-white p-6 text-center text-black shadow-2xl">
        <button onClick={onClose} className="absolute right-4 top-4 text-gray-400 hover:text-black">✕</button>

        <h3 className="text-lg font-bold text-gray-900 mb-6 mt-2">
          {message || "Authentication required"}
        </h3>
        
        <div className="flex gap-3">
          <button 
            onClick={() => router.push('/signin')}
            className="flex-1 bg-[#18181b] text-white py-2.5 rounded-xl font-semibold text-sm hover:bg-black transition"
          >
            Log in
          </button>
          <button 
            onClick={() => router.push('/signup')}
            className="flex-1 border border-gray-200 text-gray-800 py-2.5 rounded-xl font-semibold text-sm hover:bg-gray-50 transition"
          >
            Sign up
          </button>
        </div>
      </div>
    </div>
  );
};