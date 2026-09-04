import { Hono } from 'hono';
import { createOrder, getFoodOrderByUserId, getFoodOrders } from '../controllers/food-order.controller.js';

const foodOrderRoute = new Hono();

foodOrderRoute.post("/", createOrder);
foodOrderRoute.get("/:userId", getFoodOrderByUserId);
foodOrderRoute.get("/", getFoodOrders);

export default foodOrderRoute;