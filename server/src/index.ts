import { Hono } from 'hono';
import foodCategoryRoute from './routes/food-category.route.js';
import { cors } from 'hono/cors';
import foodRoute from './routes/food.route.js';
import userRoute from './routes/user.route.js';
import foodOrderRoute from './routes/food-order.route.js';


const app = new Hono();

app.use("/*", cors());

app.route("/category", foodCategoryRoute);
app.route("/food", foodRoute);
app.route("/user", userRoute);
app.route("/foodOrder", foodOrderRoute);


export default app;
