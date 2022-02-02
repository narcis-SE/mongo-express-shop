import { ObjectId } from "mongodb"; 

export default interface Cart{
    _id?: ObjectId;
    product: string;
    price: number;
    quantity: number;
}