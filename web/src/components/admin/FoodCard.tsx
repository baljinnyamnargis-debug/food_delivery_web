"use client";

import { useState } from "react";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { DishType } from "@/types/common";
import EditDishDialog from "./EditDishDialog";
import { Plus, Minus } from "lucide-react";

interface FoodCardProps {
  dish: DishType;
  isAdmin?: boolean;
  getDishes?: () => void;
  setIsDishLoading?: (loading: boolean) => void;
  onAddDishToCart?: (dish: DishType, quantity: number) => void;
}

const FoodCard = ({ 
  dish, 
  isAdmin = false, 
  getDishes = () => {}, 
  setIsDishLoading = () => {},
  onAddDishToCart
}: FoodCardProps) => {
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [toastMessage, setToastMessage] = useState<string | null>(null); 

  const handleAddToCartClick = () => {
    if (onAddDishToCart) {
      onAddDishToCart(dish, quantity);
    }
    
    setToastMessage("Food is being added to the cart!");
    
    setTimeout(() => setToastMessage(null), 2000);

    setIsDetailOpen(false);
    setQuantity(1);
  };

  return (
    <>
      {toastMessage && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-[101] bg-green-500 text-white px-6 py-3 rounded-full shadow-lg font-bold animate-in fade-in slide-in-from-top-4">
          {toastMessage}
        </div>
      )}

      <Card className="overflow-hidden bg-white border border-gray-100 hover:shadow-md transition-shadow flex flex-col justify-between rounded-xl relative group">
        <div>
          <div className="h-[150px] w-full overflow-hidden relative bg-gray-100">
            <img
              src={dish.image || "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=400"}
              alt={dish.foodName}
              className="w-full h-full object-cover"
            />

            {isAdmin && (
              <div className="absolute top-2 right-2 opacity-90 group-hover:opacity-100 transition-opacity">
                <EditDishDialog 
                  dish={dish}
                  getDishes={getDishes}
                  setIsDishLoading={setIsDishLoading}
                />
              </div>
            )}
          </div>

          <CardHeader className="p-4">
            <div className="flex justify-between items-start gap-2">
              <CardTitle className="text-base font-bold line-clamp-1">
                {dish.foodName}
              </CardTitle>
              <span className="text-red-500 font-semibold text-sm whitespace-nowrap">
                {dish.price.toLocaleString()}₮
              </span>
            </div>
            <CardDescription className="line-clamp-2 mt-1 text-xs">
              {dish.ingredients}
            </CardDescription>
          </CardHeader>
        </div>

        {!isAdmin && (
          <div className="p-4 pt-0 flex justify-end">
            <button 
              onClick={() => setIsDetailOpen(true)}
              className="flex h-8 w-8 items-center justify-center rounded-full bg-white text-red-500 border border-gray-200 hover:bg-red-500 hover:text-white transition-all shadow-sm active:scale-95"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
        )}
      </Card>

      {isDetailOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="relative flex flex-col md:flex-row w-full max-w-2xl overflow-hidden rounded-3xl bg-white text-black shadow-2xl">
            <button 
              onClick={() => setIsDetailOpen(false)}
              className="absolute right-4 top-4 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-black/40 text-white hover:bg-black/60 transition"
            >
              ✕
            </button>

            <div className="w-full md:w-1/2 h-64 md:h-auto relative bg-gray-50">
              <img 
                src={dish.image || "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=400"} 
                alt={dish.foodName} 
                className="w-full h-full object-cover"
              />
            </div>

            <div className="w-full md:w-1/2 p-6 flex flex-col justify-between">
              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">{dish.foodName}</h3>
                <p className="text-sm text-gray-500 line-clamp-4 mb-4">{dish.ingredients}</p>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between border-t border-b border-gray-100 py-3">
                  <div>
                    <span className="text-xs text-gray-400 block">Total price</span>
                    <span className="text-xl font-extrabold text-gray-900">
                      {(dish.price * quantity).toLocaleString()}₮
                    </span>
                  </div>

                  <div className="flex items-center gap-3 bg-gray-100 rounded-full px-3 py-1.5">
                    <button onClick={() => setQuantity(q => Math.max(1, q - 1))} className="p-1 text-gray-500 hover:text-black">
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="font-bold text-sm min-w-[20px] text-center">{quantity}</span>
                    <button onClick={() => setQuantity(q => q + 1)} className="p-1 text-gray-500 hover:text-black">
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <button 
                  onClick={handleAddToCartClick}
                  className="w-full bg-[#ef4444] text-white py-3 rounded-xl font-bold text-sm shadow-md hover:bg-red-600 transition"
                >
                  Add to cart
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default FoodCard;
