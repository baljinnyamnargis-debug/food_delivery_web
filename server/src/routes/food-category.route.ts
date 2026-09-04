import { Hono } from "hono";
import { 
    createFoodCategory, 
    deleteFoodCategory, 
    getFoodCategories, 
    putFoodCategory
} from "../controllers/food-category.controller.js";


const foodCategoryRoute = new Hono();

foodCategoryRoute.post("/", createFoodCategory);
foodCategoryRoute.get("/", getFoodCategories);
foodCategoryRoute.put("/:id", putFoodCategory);
foodCategoryRoute.delete("/:id", deleteFoodCategory);


export default foodCategoryRoute;