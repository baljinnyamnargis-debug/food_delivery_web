export type CategoryType = {
  categoryName: string;
  _id: string;
};

export type DishType = {
  _id: string;
  foodName: string;
  price: number;
  ingredients: string;
  image: string;
  category: string;
};