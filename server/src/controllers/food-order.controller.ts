import { Context } from 'hono';
import { connectDb } from '../lib/connectDB.js';
import { FoodOrderModel } from '../model/food-order.model.js';
import { FoodModel } from '../model/food.model.js';

export const createOrder = async (c: Context) => {
    try {
        await connectDb();

        const input = await c.req.json();
        const { user, foodOrderItems, address } = input;

        if (!foodOrderItems || !Array.isArray(foodOrderItems) || foodOrderItems.length === 0) {
            return c.json({ message: "Food order items are required." }, 400);
        }

        const itemPrices = await Promise.all(
            foodOrderItems.map(async (item: { food: string; quantity: number }) => {
                const food = await FoodModel.findById(item.food);

                if (!food) {
                    throw new Error(`Food with ID ${item.food} not found.`);
                }

                return food!.price! * item.quantity;
            })
        );

        const totalPrice = itemPrices.reduce((sum, price) => sum + price, 0);

        // Schema дээрх 'foodOrderItem' нэрийг ашиглаж хадгална
        const response = await FoodOrderModel.create({
            user,
            foodOrderItem: foodOrderItems, 
            address: address,               
            totalPrice: totalPrice + 5000, 
        });

        return c.json({
            message: "Order created successfully",
            response,
        }, 201); 

    } catch (error: any) {
        console.error("ERROR CREATING ORDER:", error);
        return c.json({
            message: error.message || "An unexpected error occurred."
        }, 400);
    }
};

export const getFoodOrderByUserId = async (c: Context) => {
    try {
        await connectDb();  
        const userId = c.req.param("userId");
        
        const foodOrders = await FoodOrderModel.find({ user: userId })
            .populate("user")
            .populate("foodOrderItem.food"); // 👈 Зөвхөн Schema дээр байгаа нэрийг populate хийнэ

        return c.json({
            message: "Food orders retrieved successfully",
            foodOrders, 
        });
    } catch (error: any) {
        return c.json({ message: error.message }, 500);
    }
};

export const getFoodOrders = async (c: Context) => {
    try {
        await connectDb();  

        const foodOrders = await FoodOrderModel.find()
            .populate("user")
            .populate("foodOrderItem.food"); // 👈 StrictPopulateError үүсгэж байсан буруу populate-ийг хасав

        return c.json({
            message: "Food orders retrieved successfully",
            foodOrders, 
        });
    } catch (error: any) {
        return c.json({ message: error.message }, 500);
    }
};