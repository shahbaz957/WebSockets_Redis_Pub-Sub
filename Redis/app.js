import express from "express";
import mongoose from "mongoose";
import { createClient } from "redis";
const app = express();

const client = await createClient()
  .on("error", (err) => console.log("ERROR : ", err))
  .connect();

mongoose.connect("mongodb://127.0.0.1:27017/node_cache");

const productSchema = new mongoose.Schema({
  name: String,
  description: String,
  price: Number,
  category: String,
  specs: Object,
});
const Product = mongoose.model("Product", productSchema);

app.get("/product", async (req, res) => {
  const key = generateCacheKey(req);
  const cachedProducts = await client.get(key);
  if (cachedProducts) {
    console.log("Cache HIT");
    res.json(JSON.parse(cachedProducts));
    return;
  }
  console.log("Cache Miss");
  const query = {};
  if (req.query.category) {
    query.category = req.query.category;
  }
  const products = await Product.find(query);
  if (products.length) {
    await client.set(key, JSON.stringify(products));
  }
  return res.json(products);
});

function generateCacheKey(req) {
  const baseUrl = req.path.replace(/^\/+|\/+$/g, "").replace(/\//g, ":"); // replace all the / with :
  // for /product/api ---> product:api
  const params = req.query;
  const sortedParams = Object.keys(params)
    .sort()
    .map((key) => `${key}=${params[key]}`)
    .join("&");

  return sortedParams ? `${baseUrl}:${sortedParams}` : baseUrl;
}

app.listen(4000, () => console.log("Server is listening at PORT 4000"));

// console.log(req.path)
// console.log(req.query)
// const params = req.query;
// // Object.keys(params).map((key)=> {
// //     console.log("KEY -> " , key , "VALUE -> " , params[key]);
// // })
// Object.values(params).map((value) => {
//     console.log("VALUE : " , value);
// })
