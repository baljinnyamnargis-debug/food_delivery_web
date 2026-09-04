"use client";

import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
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

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const [file, setFile] = useState<File>();

  const addNewDish = async () => {
    if (!file) {
      console.log("ZURAGAA ORUULNA UU");
      return;
    }

    const imageUrl = await uploadFile(file);

    const { foodName, price, ingredients, image } = formData;

    if (!foodName.trim() || !price.trim()) {
      alert("Хоолны нэр болон үнэ заавал байх ёстой!");
      return;
    }

    try {
      setIsDishLoading(true);

      await axios.post("http://localhost:3001/food", {
        foodName: foodName.trim(),
        price: Number(price),
        ingredients: ingredients.trim(),
        image: image.trim() || imageUrl,
        category: categoryId,
      });

      setFormData({
        foodName: "",
        price: "",
        ingredients: "",
        image: "",
      });

      getDishes();
    } catch (error) {
      console.error("Хоол нэмэхэд алдаа гарлаа:", error);
    } finally {
      setIsDishLoading(false);
    }
  };

  const handleFile = (e: any) => {
    const uploadedFile = e.target.files[0];

    setFile(uploadedFile);
  };

  const isFormValid = formData.foodName.trim() && formData.price.trim();

  return (
    <Dialog>
      <DialogTrigger asChild>
    {/* Plus tovchluuriin zai */}
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
          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-700">
              Food Image
            </label>
            <Input
              type="file"
              name="image"
              value={formData.image}
              onChange={handleFile}
              placeholder="Choose a file or drag and drop it here"
            />
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
