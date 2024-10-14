import {Router} from 'express';
import ProductManager  from '../classes/ProductManager.js';

const router = Router();
const productManager = new ProductManager("./src/data/products.json");

router.get("/realtimeproducts", async (req, res) => {
    res.render("realtimeproducts");
});

router.get("/", async (req, res) => {
    try {
        const products = await productManager.getProducts();
        res.render("home", {products});
    } catch (error) {
        res.status(500).send("Error: Error interno del servidor");
    }
});

export default router