"use client";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import axios from "axios";

const AddCategoryDialog = ({
  getCategories,
}: {
  getCategories: () => void;
}) => {
  const [value, setvalue] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setvalue(e.target.value);
  };

  const addNewCategory = async () => {
    const trimmedValue = value.trim();

    if (!trimmedValue) {
      alert("Category нэр хоосон байж болохгүй!");
      return;
    }

    try {
      await axios.post("https://food-delivery-server-dun.vercel.app/category", {
        categoryName: trimmedValue,
      });

      setvalue("");
      getCategories();
    } catch (error) {
      console.error("Алдаа гарлаа", error);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="rounded-full bg-red-600 h-10 w-10 p-2">
          <Plus size={24} />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add new category</DialogTitle>
        </DialogHeader>
        <p>Category Name</p>
        <Input onChange={handleChange} placeholder="Type category name..." />
        <DialogClose asChild>
          <Button onClick={addNewCategory} disabled={!value.trim()}>
            Add
          </Button>
        </DialogClose>
      </DialogContent>
    </Dialog>
  );
};
export default AddCategoryDialog;
