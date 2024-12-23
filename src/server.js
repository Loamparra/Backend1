import { productos } from "./services/prod.service.js";
import express from "express";

const app = express();
const PORT = 5000;

app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.get("/api/products", async(req, res ) => {
    const products = await productos.getAll();

    res.status(200).json(products);

});

app.get("/api/products/:id", async (req, res) => {
    const { id } = req.params;

    const product = await productos.getbyId({ id });

    if(!product){
        return res.status(404).json({ messege: "Product not found"});  
    }
    res.status(200).json(product);

})

app.post("/api/products", async (req, res) => {
    const {name, content, description } = req.body;
    
    try {
        const product = await productos.create({ name, content, description });

    res.status(201).json(product);
    } catch (error){
        res.status(500).json({ message: "Internal server error"});
    }
})

app.put("/api/products/id", async(req, res) =>{
    const { id } = req.params;
    
    const {name , content, description } = req.body;

    try {
        const product = await productos.update({ id, name, content, description });

    if(!product) {
        return res.status(404).json({ message: "Product not found"});
    }
    res.status(200).json(product);
    } catch (error){
        res.status(500).json({ message: "Internal server error"})
    }
})

app.delete("/api/products/id", async (req, res) =>{
    const { id } = req.params;

    try {
        const product = await productos.delete({ id });

        if (!product){
            return res.status(404).json({ message: "Post not found"});
        }

        res.status(204).end();
        } catch (error){
        res.status(500).json({ message: "Internal server error"});
    }
});

app.listen(PORT, ()=> {
    console.log(`server running on http://localhost:${PORT}`);
});