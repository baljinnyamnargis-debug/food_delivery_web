"use client";

import React, { useState, useEffect, useContext } from "react";
import { UserContext } from "@/context/UserContext";
import axios from "axios";

interface AddressModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (address: string) => void;
  currentAddress: string;
}

export const AddressModal: React.FC<AddressModalProps> = ({
  isOpen,
  onClose,
  onSave,
  currentAddress,
}) => {
  const context = useContext(UserContext);
  const [address, setAddress] = useState(currentAddress);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setAddress(currentAddress);
    }
  }, [isOpen, currentAddress]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!address.trim()) return;

    setIsSubmitting(true);
    try {
      const userId = context?.user?._id || context?.user?.id;
      
      if (userId) {
        await axios.post("/api/user/add-address", {
          userId,
          newAddress: address.trim(),
        });
      }
    } catch (error) {
      console.log("Backend хаяг хадгалах зам одоогоор бэлэн биш байна. Локал хадгаллаа.");
    } finally {
      onSave(address.trim());
      onClose();
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[150] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="w-full max-w-4xl rounded-3xl bg-white overflow-hidden text-black shadow-2xl flex flex-col md:flex-row h-[500px] animate-in fade-in zoom-in-95 duration-200">
        
        <div className="w-full md:w-1/2 h-full bg-gray-100 relative">
          <iframe
            title="Google Map Picker"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d42777.29173905581!2d106.885664!3d47.918873!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x5d9692550d2c06b5%3A0x9db210ba584bf7f5!2sUlaanbaatar!5e0!3m2!1sen!2smn!4v1700000000000"
            className="w-full h-full border-none"
            allowFullScreen
            loading="lazy"
          />
          <div className="absolute top-4 left-4 bg-white px-3 py-1.5 rounded-full shadow-md text-xs font-semibold text-gray-700">
            📍 Select your location
          </div>
        </div>

        <div className="w-full md:w-1/2 p-8 flex flex-col justify-between bg-white">
          <div>
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-bold text-gray-900">
                Please write your delivery address!
              </h3>
              <button 
                type="button"
                onClick={onClose} 
                className="text-gray-400 hover:text-black text-lg p-1 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                  Complete Address Description
                </label>
                <textarea
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Жишээ нь: ХУД, 15-р хороо, Рапид харш хотхон, 25-р байр, 3 тоот..."
                  className="w-full h-40 p-4 border border-gray-200 rounded-2xl text-sm outline-none resize-none focus:border-red-500 focus:ring-1 focus:ring-red-500 transition shadow-xs text-black bg-white"
                  required
                />
              </div>
            </form>
          </div>

          <div className="flex items-center gap-3 border-t border-gray-100 pt-4">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="flex-1 py-3 text-sm font-bold text-gray-500 hover:bg-gray-50 rounded-xl transition border border-gray-200 cursor-pointer disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              type="submit"
              disabled={isSubmitting}
              className="flex-1 py-3 bg-red-500 text-white rounded-xl text-sm font-bold hover:bg-red-600 shadow-md hover:shadow-lg transition active:scale-[0.98] cursor-pointer disabled:opacity-50"
            >
              {isSubmitting ? "Saving..." : "Deliver Here"}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};