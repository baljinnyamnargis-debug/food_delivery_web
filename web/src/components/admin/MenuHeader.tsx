"use client";

import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import AddCategoryDialog from "@/components/admin/AddCategoryDialog";
import { CategoryType, DishType } from "@/types/common";

interface MenuHeaderProps {
  loading: boolean;
  getCategories: () => void;
  selectedCategory: string;
  setSelectedCategory: (id: string) => void;
  dishes: DishType[];
  cleanCategories: CategoryType[];
}

export const MenuHeader = ({
  loading,
  getCategories,
  selectedCategory,
  setSelectedCategory,
  dishes,
  cleanCategories,
}: MenuHeaderProps) => {
  return (
    <div className="flex flex-wrap gap-4 items-center">
      <div
        onClick={() => setSelectedCategory("all")}
        className={`flex items-center rounded-full py-2 px-4 border cursor-pointer text-sm font-medium transition-colors ${
          selectedCategory === "all"
            ? "bg-red-600 text-white border-red-600"
            : "bg-gray-50 text-gray-800 border-gray-200 hover:bg-gray-100"
        }`}
      >
        All dishes
        <Badge
          className={`ml-2 ${selectedCategory === "all" ? "bg-white text-red-600" : "bg-primary text-white"}`}
        >
          {dishes.length}
        </Badge>
      </div>

      {loading ? (
        <>
          <Skeleton className="h-10 w-24 rounded-full" />
          <Skeleton className="h-10 w-24 rounded-full" />
        </>
      ) : (
        cleanCategories.map((category) => {
          const dishCount = dishes.filter((d) => {
            if (typeof d.category === "object" && d.category !== null) {
              return (d.category as any)._id === category._id;
            }
            return d.category === category._id;
          }).length;

          const isSelected = selectedCategory === category._id;

          return (
            <div
              key={category._id}
              onClick={() => setSelectedCategory(category._id)}
              className={`flex items-center rounded-full py-2 px-4 border cursor-pointer text-sm font-medium transition-colors ${
                isSelected
                  ? "bg-red-600 text-white border-red-600"
                  : "bg-gray-50 text-gray-800 border-gray-200 hover:bg-gray-100"
              }`}
            >
              {category.categoryName}
              <Badge
                className={`ml-2 ${isSelected ? "bg-white text-red-600" : "bg-primary text-white"}`}
              >
                {dishCount}
              </Badge>
            </div>
          );
        })
      )}

      <AddCategoryDialog getCategories={getCategories} />
    </div>
  );
};
