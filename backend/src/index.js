import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"
import connectDB from "./config/db.js"
import authRoutes from "./routes/auth.routes.js"
import productRoutes from './routes/product.routes.js'
import config from "./config/config.js"
import cartRoutes from './routes/cart.routes.js'
import reviewRoutes from './routes/review.routes.js'
import wishlistRoutes from './routes/wishlist.routes.js'

const PORT = config.PORT

const app = express()

// CORS must be first!
app.use(cors({
    // origin: 'http://localhost:5173',
    origin: [
        'http://localhost:5173',
        'https://sibgha-collection.vercel.app'
    ],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}))

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())

connectDB()

// Routes
app.use('/api/auth', authRoutes)
app.use('/api/products', productRoutes)

app.get('/', (req, res) => res.send('<h1>Welcom to Sibgha Collection</h1>'))
app.use('/api/cart', cartRoutes)

app.use('/api/reviews', reviewRoutes)

app.use('/api/wishlist', wishlistRoutes)

app.listen(PORT, () => { console.log(`Sibgha Server is connected : http://localhost:${PORT}`) })

