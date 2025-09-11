import { NextRequest } from "next/server";
import { products } from "@/app/product-data";
import { connectToDb } from "../../../db";

type ShoppingCart = Record<string, string[]>;

const carts: ShoppingCart = {
    '1': ['123', '234'],
    '2': ['345', '456'],
    '3': ['234']
}

type Params = {
    id: string;
}

export async function GET(request: NextRequest, { params }: { params: Params }) {
    const { db } = await connectToDb();

    const userId = params.id;
    // const productIds = carts[userId];
    // const productIds = await db.collection('carts').findOne({ userId })
    const userCart = await db.collection('carts').findOne({ userId })

    // if (productIds === undefined) {
    if (!userCart) {
        return new Response(JSON.stringify([]), {
            status: 200,
            headers: {
            'Content-Type': 'application/json'
            }
        });
    }

    const cartIds = userCart.cartIds;
    // const cartProducts = productIds.map(id => products.find(p => p.id === id));
    const cartProducts = await db.collection('products').find({ id: { $in: cartIds } }).toArray();

    return new Response(JSON.stringify(cartProducts), {
        status: 200,
        headers: {
            'Content-Type': 'application/json'
        }
    });
}

type CartBody = {
    productId: string
}

export async function POST(request: NextRequest, { params }: { params: Params }) {
    const { db } = await connectToDb();

    const userId = params.id;
    const body: CartBody = await request.json();
    const productId = body.productId;

    // carts[userId]= carts[userId] ? carts[userId].concat(productId) : [productId]

    const updatedCart = await db.collection('carts').findOneAndUpdate(
        // the criteria to look for
        { userId },
        // push the productId onto the cart Id's prop of this document
        { $push: { cartIds: productId} },
        // upsert is the term for adding missing data when we want to make a change to it
        // returnDocument: 'after' tells MongoDB when to return the document.
        { upsert: true, returnDocument: 'after' }
    )

    // const cartProducts = carts[userId].map(id => products.find(p => p.id === id));
    // .find({ id: { $in: updatedCart.cartIds } }) - looks for products where the id
    // is INSIDE the list of ids stored in updatedCart.cartIds
    const cartProducts = await db.collection('products').find({ id: { $in: updatedCart.cartIds } }).toArray();

    return new Response(JSON.stringify(products), {
        status: 201,
        headers: {
            'Content-Type': 'application/json'
        }
    })
}

export async function DELETE(request: NextRequest, { params }: { params: Params }) {
    const { db } = await connectToDb();
    const userId = params.id;
    const body = await request.json();
    const productId = body.productId

    // carts[userId] = carts[userId] ? carts[userId].filter(pid => pid !== productId) : [];
    const updatedCart = await db.collection('carts').findOneAndUpdate(
        { userId },
        { $pull: { cartIds: productId} },
        { returnDocument: 'after' }
    );

    if (!updatedCart) {
        return new Response(JSON.stringify([]), {
        status: 202,
        headers: {
            'Content-Type': 'application/json'
        }})
    }

    // const cartProducts = carts[userId].map(id => products.find(p => p.id === id));
    const cartProducts = await db.collection('products').find({ id: { $in: updatedCart.cartIds } }).toArray();

    // return new Response(JSON.stringify(cartProducts), {
    //     status: 202,
    //     headers: {
    //         'Content-Type': 'application/json'
    //     }
    // })
}