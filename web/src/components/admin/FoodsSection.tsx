"use client";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import AddDishDialog from "@/components/admin/AddDishDialog";
import FoodCard from "@/components/admin/FoodCard";
import { CategoryType, DishType } from "@/types/common";

interface FoodsSectionProps {
  categoriesToRender: CategoryType[];
  dishes: DishType[];
  loading: boolean;
  loadingCategoryId: string | null;
  setLoadingCategoryId: (id: string | null) => void;
  getDishes: () => void;
  isAdmin?: boolean;
  onAddDishToCart?: (dish: DishType, quantity: number) => void; 
}

const FoodsSection = ({
  categoriesToRender,
  dishes,
  loading,
  loadingCategoryId,
  setLoadingCategoryId,
  getDishes,
  isAdmin = false,
  onAddDishToCart,
}: FoodsSectionProps) => {
  const gridLayoutClass = isAdmin
    ? "grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-5"
    : "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5";

  if (loading) {
    return (
      <div className={`p-6 space-y-4 w-full ${isAdmin ? "bg-white rounded-xl" : ""}`}>
        <Skeleton className={`h-6 w-48 ${isAdmin ? "bg-gray-200" : "bg-white/20"}`} />
        <div className={gridLayoutClass}>
          <Skeleton className="h-[260px] rounded-xl" />
          <Skeleton className="h-[260px] rounded-xl hidden md:block" />
          <Skeleton className="h-[260px] rounded-xl hidden lg:block" />
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col w-full gap-6">
      {categoriesToRender.map((category) => {
        const filteredDishes = dishes.filter((dish) => {
          if (typeof dish.category === "object" && dish.category !== null) {
            return (dish.category as any)._id === category._id;
          }
          return dish.category === category._id;
        });

        if (filteredDishes.length === 0 && !isAdmin) return null;

        return (
          <div
            key={category._id}
            className={`flex flex-col gap-4 w-full transition-all ${
              isAdmin
                ? "bg-white p-6 rounded-xl border border-gray-100 shadow-sm"
                : "bg-transparent p-0 border-none shadow-none"
            }`}
          >
            <div className="flex items-center gap-2">
              <h3 className={`text-lg font-bold ${isAdmin ? "text-gray-800" : "text-white"}`}>
                {category.categoryName}
              </h3>
              {isAdmin && <Badge variant="secondary">{filteredDishes.length}</Badge>}
            </div>

            <div className={gridLayoutClass}>
              {isAdmin && (
                <Card className="flex flex-col items-center justify-center min-h-[260px] border-2 border-dashed border-red-200 bg-red-50/10 hover:bg-red-50/40 transition-colors rounded-xl shadow-none p-4 text-center">
                  <AddDishDialog
                    getDishes={getDishes}
                    categoryId={category._id}
                    categoryName={category.categoryName}
                    setIsDishLoading={(loading: boolean) => {
                      setLoadingCategoryId(loading ? category._id : null);
                    }}
                  />
                  <span className="text-sm font-medium mt-3 text-gray-500">
                    Add to {category.categoryName}
                  </span>
                </Card>
              )}

              {isAdmin && loadingCategoryId === category._id && (
                <Card className="overflow-hidden bg-white border border-gray-100 flex flex-col justify-between rounded-xl p-4 space-y-4 min-h-[260px]">
                  <Skeleton className="h-[150px] w-full rounded-lg" />
                  <div className="space-y-2">
                    <Skeleton className="h-5 w-1/2" />
                    <Skeleton className="h-4 w-full" />
                  </div>
                </Card>
              )}

              {filteredDishes.map((dish) => (
                <FoodCard 
                  key={dish._id} 
                  dish={dish} 
                  isAdmin={isAdmin} 
                  onAddDishToCart={onAddDishToCart} 
                />
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default FoodsSection;
