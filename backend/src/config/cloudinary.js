import { v2 as cloudinary } from 'cloudinary'
import multer from 'multer'
import config from './config.js'

// Configure Cloudinary
cloudinary.config({
    cloud_name: config.CLOUDINARY_CLOUD_NAME,
    api_key: config.CLOUDINARY_API_KEY,
    api_secret: config.CLOUDINARY_API_SECRET
})

// Use memory storage
const storage = multer.memoryStorage()

// Create Upload Middleware
export const upload = multer({ storage })
export default cloudinary