import express from 'express';

export const cartsRouter = express.Router();

const cartsRoutes = (cartManager) => {
    cartsRouter.post("/", async (req, res) => {
        try {
            const newCart = await cartManager.createCart();
            res.status(201).json(newCart);
        } catch (error) {
            res.status(500).send("Error creating cart: " + error.message);
        }
    });

    cartsRouter.get("/:cid", async (req, res) => {
        try {
            const id = req.params.cid;
            const cart = await cartManager.getCartById(id);
            if (cart) {
                res.json(cart);
            } else {
                res.status(404).send("Carrito no encontrado");
            }
        } catch (error) {
            res.status(500).send("Error retrieving cart: " + error.message);
        }
    });

    cartsRouter.post("/:cid/product/:pid", async (req, res) => {
        try {
            const cartId = req.params.cid;
            const productId = parseInt(req.params.pid);
            const cart = await cartManager.addProductToCart(cartId, productId);
            if (cart) {
                res.json(cart);
            } else {
                res.status(400).send("Error: no se puede agregar el producto al carrito");
            }
        } catch (error) {
            res.status(500).send("Error adding product to cart: " + error.message);
        }
    });

    return cartsRouter;
};

export default cartsRoutes;
