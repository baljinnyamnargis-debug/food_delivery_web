import { Hono } from "hono";
import { signUp, signIn } from "../controllers/user.controller.js";

const userRoute = new Hono();

userRoute.post("/signup", signUp);
userRoute.post("/signin", signIn);

export default userRoute;