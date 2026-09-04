
import mongoose from "mongoose";

const URI = process.env.MONGODB_URI;

export const connectDb = async () => {
    try {
        if (!URI) {
            console.log("URI BAIHGUI BNA");
            return;
        }

    await mongoose.connect(URI);
    console.log("DB TEI AMJILTTAI HOLBOGDLOO");

    } catch (error) {
    console.log(" DB TEI HOLBOGDHOD ALDAA GARLAA", error)
};
};