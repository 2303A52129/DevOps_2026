const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
const Product = require("./models/Product");
const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.post("/products", async (req, res) => {
    try {
        const newProduct = new Product(req.body);
        const savedProduct = await newProduct.save();
        res.status(201).json(savedProduct);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});
app.get("/products", async (req, res) => {
    const products = await Product.find();
    res.json(products);
});
app.get("/products/:id", async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        res.json(product);
    } catch {
        res.status(404).json({ message: "Product not found" });
    }
});
app.put("/products/:id", async (req, res) => {
    try {
        const updatedProduct = await Product.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );
        res.json(updatedProduct);
    } catch {
        res.status(400).json({ message: "Update failed" });
    }
});
app.delete("/products/:id", async (req, res) => {
    try {
        await Product.findByIdAndDelete(req.params.id);
        res.json({ message: "Product deleted" });
    } catch {
        res.status(400).json({ message: "Delete failed" });
    }
});

// Server
const PORT = 3000;
mongoose.connect("mongodb://127.0.0.1:27017/inventoryDB")
.then(() => console.log("MongoDB Connected"))
.catch(err => console.log(err));
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});