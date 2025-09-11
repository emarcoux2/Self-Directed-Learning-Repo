import { products } from "@/app/product-data"
import { connectToDb } from "../db";

export async function GET() {
    // connect to the db
    const { db } = await connectToDb();

    // picks the products collection - one of our tables in MongoDB
    // .find searches the collection, and {} grabs all the products
    // .toArray turns the results into a JavaScript array
    const products = await db.collection('products').find({}).toArray();

    return new Response(JSON.stringify(products), {
        status: 200,
        headers: {
            'Content-Type': 'application/json'
        }
    });
}