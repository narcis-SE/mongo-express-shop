import express from "express";
import Cart from "../models/Cart";
import { getClient } from "../db";
import { ObjectId } from "mongodb";
//import { ResultStorage } from "firebase-functions/v1/testLab";

const cartRoutes = express.Router();

cartRoutes.get("/cart-items",async (req, res) => {
    try{
        const client = await getClient();
        const product = String(req.query.product || "");
        const maxPrice = parseInt(req.query.price as string);
        //const test = 1000;
        const pageSize = parseInt(req.query.quantity as string);
        if(product){
            const results = await client.db().collection<Cart>('cartItems').find({product: product}).toArray();
            console.log(results);
            res.json(results);
        } else if(maxPrice){
            const results = await client.db().collection<Cart>('cartItems').find({price: {$gte: maxPrice}}).toArray();
            console.log(results);
            res.json(results);
        } else if(pageSize){
            const results = await client.db().collection<Cart>('cartItems').find().limit(pageSize).toArray();
            console.log(results);
            res.json(results);
        }else{
            const results = await client.db().collection<Cart>('cartItems').find().toArray(); 
            console.log(results);
            res.json(results);
        }

    } catch(e){
        console.error("Error: ", e);
        res.status(500).json({message: "Internal Server Error"});
    }
    
})


cartRoutes.get("/cart-items/:id", async(req, res) => {
    const id = req.params.id;
    
    try{
        console.log("Function checkk");
        const client = await getClient();
        const cart = await client.db().collection<Cart>('cartItems')
        .findOne({_id: new ObjectId(id)});
        console.log(cart); 
        if(cart){
            console.log("here")
            res.json(cart);
        } else{
            res.status(404).json({message: "Not Found"})
        }
    } catch (err){/*some error code idk :/ */ }
})

cartRoutes.post("/cart-items", async (req, res) => {
    const cart = req.body as Cart;
    try{
        const client = await getClient();
        await client.db()
            .collection<Cart>('cartItems')
            .insertOne(cart)
            res.status(201).json(cart);
    } catch (err){
        console.error("Error: ", err);
    }
})

cartRoutes.put("/cart-items/:id", async (req, res)=>{
    const id = req.params.id;
    const data = req.body as Cart;
    delete data._id;

    try{
        const client = await getClient();
        const result = await client.db().collection<Cart>('cartItems')
            .replaceOne({_id: new ObjectId(id)}, data);
        if(result.modifiedCount === 0 ){
            res.status(404).json({message: "Not Found"});
        } else{
            data._id = new ObjectId(id);
            res.json(data);
            res.status(201).json({message: "Created"})
        }

    } catch(err){/*  some error idk */}
})

cartRoutes.delete("/cart-items/:id", async(req, res) =>{
    const id = req.params.id;

    try{
        const client = await getClient();
        const result = await client.db().collection<Cart>('cartItems')
            .deleteOne({_id: new ObjectId(id)});
            if(result.deletedCount === 0){
                res.status(404).json({message: "Not Found"})
            } else{
                res.status(204).end();
            }
    } catch (err){/* some errrrrror */}
});
export default cartRoutes;