import { Context } from "hono";
import { connectDb } from '../lib/connectDB.js';
import { UserModel } from "../model/user.model.js";
import bcrypt from "bcryptjs";

export const signUp = async (c: Context) => {
    await connectDb();

    const { email, password } = await c.req.json();

    if (!email) {
        return c.json(
            {
                message: "Emailee yavuulna uu",
            },
            400
        );
    };

    if (!password) {
        return c.json(
            {
                message: "Passwordoo yavuulna uu",
            },
            400
        );
    }
    const signedUp = await UserModel.find({ email });

    console.log("SIGNED UP", signedUp);

    if (signedUp.length > 0) {
        return c.json(
            {
                message: "Burtgeltei baina",
            },
            400
        );       
    }

    const hashedPassword = bcrypt.hashSync(password, 10);

    const newUser = await UserModel.create({
        email,
        password: hashedPassword,
    });

    return c.json({
        message: "Amjilttai hereglegch burtgelee",
        user: newUser,
    });
};


export const signIn = async(c: Context) => {
     await connectDb();

    const { email, password } = await c.req.json();

    if (!email) {
        return c.json(
            {
                message: "Emailee yavuulna uu",
            },
            400
        );
    };

    if (!password) {
        return c.json(
            {
                message: "Passwordoo yavuulna uu",
            },
            400
        );
    }
    const user = await UserModel.findOne({ email });

    if (!user) {
        return c.json({
            message: "Ehleed burtguulne uu",
        });
    }

    const isCorrect = bcrypt.compareSync(password, user.password!);

    if (!isCorrect) {
        return c.json(
            {
                message: "Password buruu baina",
            },
            400
        );
    }

    return c.json({
        message: "Amjilttai navterlee",
        user,
    });

};