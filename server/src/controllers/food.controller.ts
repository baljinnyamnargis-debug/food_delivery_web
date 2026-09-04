import { connectDb } from '../lib/connectDB.js';
import { FoodModel } from '../model/food.model.js';
import { Context } from 'hono';


export const createFood = async (c: Context) => {
    await connectDb();

    const input = await c.req.json();

    const response = await FoodModel.create(
        {
            foodName: input.foodName,
            price: input.price,
            ingredients: input.ingredients,
            image: input.image,
            category:input.category,
        },
    );

    return c.json({
        message: "Amjilttai hool nemegdlee",
        response,
    });
};

export const getFood = async (c: Context) => {
  await connectDb();

  const food = await FoodModel.find();

  return c.json({
    message: "Food",
    food,
  });
};

export const putFood = async (c: Context) => {
  await connectDb();
  const id = c.req.param("id");
  const input = await c.req.json();

  const response = await FoodModel.findByIdAndUpdate(id, input, {
    new: true
  });

  return c.json({
    message: "Successfully updated",
    response,
  });
};


export const deleteFood = async (c: Context) => {
  await connectDb();
  const id = c.req.param("id");

  const response = await FoodModel.findByIdAndDelete(id);

  return c.json({
    message: "Successfully deleted",
    response,
  });
}