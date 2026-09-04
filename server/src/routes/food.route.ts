import { Hono } from "hono";
import { createFood, getFood, putFood, deleteFood } from "../controllers/food.controller.js";



const foodRoute = new Hono();

foodRoute.post("/", createFood);
foodRoute.get("/", getFood);
foodRoute.put("/:id", putFood);
foodRoute.delete("/:id", deleteFood);


export default foodRoute;