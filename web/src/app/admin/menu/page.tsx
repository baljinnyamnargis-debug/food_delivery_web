"use client";

import { useContext, useEffect, useState } from "react";
import axios from "axios";
import FoodSection from "@/components/admin/FoodsSection";
import { MenuHeader } from "@/components/admin/MenuHeader";
import { Sidebar } from "@/components/admin/Sidebar";
import { CategoryType, DishType } from "@/types/common";
import { UserContext } from "@/context/UserContext";

const Page = () => {
  const [categories, setCategories] = useState<CategoryType[]>([]);
  const [dishes, setDishes] = useState<DishType[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [loadingCategoryId, setLoadingCategoryId] = useState<string | null>(
    null,
  );

  const context = useContext(UserContext);
  console.log("CONTEXT", context);

  const getCategories = async () => {
    setLoading(true);
    try {
      const response = await axios.get("http://localhost:3001/category");
      setCategories(response.data?.foodCategories || []);
    } catch (error) {
      console.error("Категори татахад алдаа гарлаа:", error);
    } finally {
      setLoading(false);
    }
  };

  const getDishes = async () => {
    try {
      const response = await axios.get("http://localhost:3001/food");
      setDishes(response.data?.food || []);
    } catch (error) {
      console.error("Хоолны дата татахад алдаа гарлаа:", error);
    }
  };

  useEffect(() => {
    getCategories();
    getDishes();
  }, []);

  const cleanCategories = categories.filter(
    (c) => c.categoryName.toLowerCase().trim() !== "all dishes",
  );

  const categoriesToRender =
    selectedCategory === "all"
      ? cleanCategories
      : cleanCategories.filter((c) => c._id === selectedCategory);

  return (
    <div className="flex h-screen w-full bg-secondary gap-6 overflow-hidden">
      <Sidebar />

      <div className="flex flex-col p-6 gap-6 w-full overflow-y-auto mr-[40px]">
        <div className="w-full rounded-xl p-6 space-y-4 bg-white shrink-0 shadow-sm border border-gray-50">
          <h3 className="text-xl font-semibold text-gray-800">
            Dishes Category
          </h3>
          <MenuHeader
            loading={loading}
            getCategories={getCategories}
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
            dishes={dishes}
            cleanCategories={cleanCategories}
          />
        </div>

        <FoodSection
          categoriesToRender={categoriesToRender}
          dishes={dishes}
          loading={loading}
          loadingCategoryId={loadingCategoryId}
          setLoadingCategoryId={setLoadingCategoryId}
          getDishes={getDishes}
          isAdmin={true}
        />
      </div>
    </div>
  );
};

export default Page;
