import express from 'express';
import ProductManager from './classes/ProductManager.js';

import productsRouter from './routes/productRoutes.js';
import cartsRouter from './routes/cartRoutes.js'; 
import viewsRoutes from './routes/viewsRoutes.js';
import { engine } from 'express-handlebars';
import { Server } from 'socket.io';
import mongoose from 'mongoose';



const PORT = 8080;
const app = express();

app.use(express.json());
app.use(express.static("./src/public"));
app.use(express.urlencoded({ extended: true }));

app.engine('handlebars', engine());
app.set('view engine', 'handlebars');
app.set('views', './src/views');

app.use("/api/products", productsRouter);
app.use("/api/carts", cartsRouter);
app.use ("/", viewsRoutes);


const httpServer = app.listen(PORT, async () => {
    await mongoose.connect('mongodb://127.0.0.1:27017/coder70275');
    console.log("Servidor escuchando en el puerto " + PORT);
});

const productManager = new ProductManager()

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