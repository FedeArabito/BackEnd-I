import fs from 'fs/promises';
import express from 'express';
import ProductManager from './classes/ProductManager.js';
import CartManager from './classes/CartManager.js';
import productsRouter from './routes/productRoutes.js';
import cartsRouter from './routes/cartRoutes.js'; 
import viewsRoutes from './routes/viewsRoutes.js';
import { engine } from 'express-handlebars';
import { Server } from 'socket.io';


const cartManager = new CartManager("./src/data/carts.json");
const productManager = new ProductManager("./src/data/products.json");

const PORT = 8080;
const app = express();

app.use(express.json());
app.use(express.static("./src/public"));

app.engine('handlebars', engine());
app.set('view engine', 'handlebars');
app.set('views', './src/views');

app.use("/api/products", productsRouter(productManager));
app.use("/api/carts", cartsRouter(cartManager));
app.use ("/", viewsRoutes);


const httpServer = app.listen(PORT, () => {
    console.log("Servidor escuchando en el puerto " + PORT);
});


const io = new Server(httpServer);

io.on('connection', async (socket) => {
    console.log('Usuario conectado');
    const products = await productManager.getProducts();

    socket.emit('products', products);

    socket.on("deleteProducts", async (id) => {
        await productManager.deleteProduct(id);
    
        io.sockets.emit("products", await productManager.getProducts());
    });


    socket.on("newProduct", async (product) => {
        await productManager.addProduct(product);

        io.sockets.emit("products", await productManager.getProducts());
    });
});