import express from "express"
import mongoose from "mongoose";
const app = express();

mongoose.connect('mongodb://127.0.0.1:27017/node_cache');

const productSchema = new mongoose.Schema({
    name: String,
    description: String,
    price: Number,
    category: String,
    specs: Object,
});
const Product = mongoose.model('Product', productSchema);

app.get('/product' ,async (req , res) => {
    // console.log(req.path)
    // console.log(req.query)
    // const params = req.query;
    // // Object.keys(params).map((key)=> {
    // //     console.log("KEY -> " , key , "VALUE -> " , params[key]);
    // // })
    // Object.values(params).map((value) => {
    //     console.log("VALUE : " , value);
    // })

    const query = {};
    if (req.query.category){
        query.category = req.query.category;
    }
    const products = await Product.find(query);

    return res.json(products);
})



app.listen(4000, () => console.log("Server is listening at PORT 4000"))