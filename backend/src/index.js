import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"
import connectDB from "./config/db.js"
import authRoutes from "./routes/auth.routes.js"
import productRoutes from './routes/product.routes.js';


import config from "./config/config.js"
const PORT = config.PORT




const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin: `http://localhost:5173`,
    credentials: true
}))

connectDB();

//Routes
app.use('/api/auth', authRoutes)
app.use('/api/products', productRoutes);


app.listen(PORT, () => { console.log(`Sibgha Server is connected : http://localhost:${PORT}`) })

app.get('/', (req, res) => res.send('<h1>Welcom to Sibgha Collection</h1>'))