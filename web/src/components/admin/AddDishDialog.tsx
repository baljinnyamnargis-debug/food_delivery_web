"use client";

import { Button } from "@/components/ui/button";
import { Plus, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import axios from "axios";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { uploadFile } from "@/lib/uploadFile";

interface AddDishDialogProps {
  getDishes: () => void;
  categoryId: string;
  categoryName: string;
  setIsDishLoading: (loading: boolean) => void;
}

const AddDishDialog = ({
  getDishes,
  categoryId,
  categoryName,
  setIsDishLoading,
}: AddDishDialogProps) => {
  const [formData, setFormData] = useState({
    foodName: "",
    price: "",
    ingredients: "",
    image: "",
  });

  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null); // 📍 Preview зураг хадгалах state

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // 📍 Зураг сонгох үед ажиллах функц
  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const uploadedFile = e.target.files?.[0];
    if (uploadedFile) {
      setFile(uploadedFile);
      setPreviewUrl(URL.createObjectURL(uploadedFile)); // Preview URL үүсгэнэ
    }
  };

  // 📍 Сонгосон зургийг арилгах функц
  const handleRemoveImage = () => {
    setFile(null);
    setPreviewUrl(null);
  };

  const addNewDish = async () => {
    if (!file) {
      alert("Хоолны зургийг заавал оруулна уу!");
      return;
    }

    const { foodName, price, ingredients, image } = formData;

    if (!foodName.trim() || !price.trim()) {
      alert("Хоолны нэр болон үнэ заавал байх ёстой!");
      return;
    }

    try {
      setIsDishLoading(true);

      const imageUrl = await uploadFile(file);

      await axios.post("http://localhost:3001/food", {
        foodName: foodName.trim(),
        price: Number(price),
        ingredients: ingredients.trim(),
        image: image.trim() || imageUrl,
        category: categoryId,
      });

      // Форм болон зургийг цэвэрлэнэ
      setFormData({
        foodName: "",
        price: "",
        ingredients: "",
        image: "",
      });
      setFile(null);
      setPreviewUrl(null);

      getDishes();
    } catch (error) {
      console.error("Хоол нэмэхэд алдаа гарлаа:", error);
    } finally {
      setIsDishLoading(false);
    }
  };

  const isFormValid = formData.foodName.trim() && formData.price.trim() && file;

  return (
    <Dialog>
      <DialogTrigger asChild>
        <button
          className="flex items-center justify-center h-12 w-12 rounded-full bg-red-600
         hover:bg-red-700 text-white shadow-md transition-transform active:scale-95"
        >
          <Plus size={24} />
        </button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add new dish to "{categoryName}"</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col gap-4 my-2">
          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-700">
              Food Name *
            </label>
            <Input
              name="foodName"
              value={formData.foodName}
              onChange={handleChange}
              placeholder="Type food name"
            />
          </div>
          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-700">
              Food price (₮) *
            </label>
            <Input
              name="price"
              type="number"
              value={formData.price}
              onChange={handleChange}
              placeholder="Enter price..."
            />
          </div>

          {/* 📍 Food Image & Preview Хэсэг */}
          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-700">
              Food Image *
            </label>

            {previewUrl ? (
              /* Зураг сонгогдсон үед харагдах Preview */
              <div className="relative w-full h-40 rounded-lg overflow-hidden border border-gray-200 group">
                <img
                  src={previewUrl}
                  alt="Food Preview"
                  className="w-full h-full object-cover"
                />
                <button
                  type="button"
                  onClick={handleRemoveImage}
                  className="absolute top-2 right-2 bg-black/60 hover:bg-black text-white p-1 rounded-full transition cursor-pointer"
                >
                  <X size={16} />
                </button>
              </div>
            ) : (
              /* Зураг сонгоогүй үед харагдах File Input */
              <Input
                type="file"
                accept="image/*"
                onChange={handleFile}
              />
            )}
          </div>

          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-700">
              Ingredients
            </label>
            <Textarea
              name="ingredients"
              value={formData.ingredients}
              onChange={handleChange}
              placeholder="List ingredients"
            />
          </div>
        </div>

        <DialogClose asChild>
          <Button
            onClick={addNewDish}
            disabled={!isFormValid}
            className="w-full bg-red-600 hover:bg-red-700 text-white"
          >
            Add Dish
          </Button>
        </DialogClose>
      </DialogContent>
    </Dialog>
  );
};

export default AddDishDialog;
