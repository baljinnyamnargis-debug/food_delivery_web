import { connectDb } from '../lib/connectDB.js';
import { FoodCategoryModel } from '../model/food-category.model.js';
import { Context } from 'hono';


export const createFoodCategory = async (c: Context) => {
  await connectDb();
  const input = await c.req.json();
    
  await FoodCategoryModel.create({
        categoryName: input.categoryName,
  });
    
  return c.json({
    message: "Successfully created food category",
  });
};

export const getFoodCategories = async (c: Context) => {
  await connectDb();

  const foodCategories = await FoodCategoryModel.find();

  return c.json({
    message: "Categories",
    foodCategories,
  });
};

export const putFoodCategory = async (c: Context) => {
  await connectDb();
  const id = c.req.param("id");
  const input = await c.req.json();

  const response = await FoodCategoryModel.findByIdAndUpdate(id, {
    categoryName: input.categoryName,
  });

  return c.json({
    message: "Successfully updated",
    response,
  });
};

export const deleteFoodCategory = async (c: Context) => {
  await connectDb();
  const id = c.req.param("id");

  const response = await FoodCategoryModel.findByIdAndDelete(id);

  return c.json({
    message: "Successfully deleted",
    response,
  });
}