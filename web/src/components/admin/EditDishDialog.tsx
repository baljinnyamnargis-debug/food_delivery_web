"use client";

import { Button } from "@/components/ui/button";
import { Edit } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useState, useEffect, useRef } from "react";
import axios from "axios";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { uploadFile } from "@/lib/uploadFile";
import { toast } from "sonner";
import { DishType } from "@/types/common";

interface EditDishDialogProps {
  dish: DishType;
  getDishes: () => void;
  setIsDishLoading: (loading: boolean) => void;
}

const EditDishDialog = ({
  dish,
  getDishes,
  setIsDishLoading,
}: EditDishDialogProps) => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState({
    foodName: dish.foodName,
    price: String(dish.price),
    ingredients: dish.ingredients || "",
  });

  useEffect(() => {
    setFormData({
      foodName: dish.foodName,
      price: String(dish.price),
      ingredients: dish.ingredients || "",
    });
    setFile(null);
    
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }, [dish, open]); 

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleEditDish = async () => {
    const { foodName, price, ingredients } = formData;

    if (!foodName.trim() || !price.trim()) {
      toast.error("Food name and price are required!");
      return;
    }

    try {
      setLoading(true);
      setIsDishLoading(true);

      let finalImageUrl = dish.image;
      if (file) {
        const uploadedUrl = await uploadFile(file);
        if (uploadedUrl) {
          finalImageUrl = uploadedUrl;
        } else {
          throw new Error("Image upload failed");
        }
      }

      await axios.put(`https://food-delivery-server-dun.vercel.app/food/${dish._id}`, {
        foodName: foodName.trim(),
        price: Number(price),
        ingredients: ingredients.trim(),
        image: finalImageUrl,
        category: dish.category,
      });

      toast.success("Dish updated successfully!");
      getDishes();
      setOpen(false);
    } catch (error) {
      console.error("Хоол засварлахад алдаа гарлаа:", error);
      toast.error("Failed to update dish.");
    } finally {
      setLoading(false);
      setIsDishLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="icon" variant="outline" className="h-8 w-8 text-blue-600 border-blue-200 hover:bg-blue-50">
          <Edit size={16} />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit "{dish.foodName}"</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col gap-4 my-2">
          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-700">Food Name *</label>
            <Input
              name="foodName"
              value={formData.foodName}
              onChange={handleChange}
              placeholder="Type food name"
              disabled={loading}
            />
          </div>
          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-700">Food price (₮) *</label>
            <Input
              name="price"
              type="number"
              value={formData.price}
              onChange={handleChange}
              placeholder="Enter price..."
              disabled={loading}
            />
          </div>
          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-700">
              Food Image <span className="text-xs text-gray-400">(Leave empty to keep current)</span>
            </label>
            <Input
              type="file"
              accept="image/*"
              onChange={handleFile}
              disabled={loading}
              ref={fileInputRef} 
            />
          </div>
          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-700">Ingredients</label>
            <Textarea
              name="ingredients"
              value={formData.ingredients}
              onChange={handleChange}
              placeholder="List ingredients"
              disabled={loading}
            />
          </div>
        </div>

        <Button
          onClick={handleEditDish}
          disabled={!formData.foodName.trim() || !formData.price.trim() || loading}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white"
        >
          {loading ? "Updating..." : "Save Changes"}
        </Button>
      </DialogContent>
    </Dialog>
  );
};

export default EditDishDialog;