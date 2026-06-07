import Product from '../models/product.model.js';
import { v2 as cloudinary } from 'cloudinary'

// Get all products
export const getAllProducts = async (req, res) => {
    try {
        const { category, minPrice, maxPrice, search } = req.query;

        // Build filter object
        let filter = { isActive: true };

        if (category) filter.category = category;

        if (minPrice || maxPrice) {
            filter.price = {};
            if (minPrice) filter.price.$gte = Number(minPrice);
            if (maxPrice) filter.price.$lte = Number(maxPrice);
        }

        if (search) {
            filter.name = { $regex: search, $options: 'i' };
        }

        const products = await Product.find(filter).sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: products.length,
            products
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get single product
export const getProductById = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);

        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        res.status(200).json({
            success: true,
            product
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Create product - admin only
export const createProduct = async (req, res) => {
    try {
        const { name, description, price, category, stock } = req.body;

        // Get image URLs from cloudinary
        // Upload images to cloudinary
        const imageUrls = []

        if (req.files && req.files.length > 0) {
            for (const file of req.files) {
                const result = await new Promise((resolve, reject) => {
                    cloudinary.uploader.upload_stream(
                        { folder: 'sibgha-collection' },
                        (error, result) => {
                            if (error) reject(error)
                            else resolve(result)
                        }
                    ).end(file.buffer)
                })
                imageUrls.push(result.secure_url)
            }
        }

        const product = await Product.create({
            name,
            description,
            price,
            category,
            stock,
            images: imageUrls
        })

        res.status(201).json({
            success: true,
            message: 'Product created successfully',
            product
        })

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Update product - admin only
export const updateProduct = async (req, res) => {
    try {
        const { name, description, price, category, stock } = req.body

        const updateData = { name, description, price, category, stock }

        // If new images uploaded
        if (req.files && req.files.length > 0) {
            const imageUrls = []
            for (const file of req.files) {
                const result = await new Promise((resolve, reject) => {
                    cloudinary.uploader.upload_stream(
                        { folder: 'sibgha-collection' },
                        (error, result) => {
                            if (error) reject(error)
                            else resolve(result)
                        }
                    ).end(file.buffer)
                })
                imageUrls.push(result.secure_url)
            }
            updateData.images = imageUrls
        }

        const product = await Product.findByIdAndUpdate(
            req.params.id,
            updateData,
            { new: true, runValidators: true }
        )

        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        res.status(200).json({
            success: true,
            message: 'Product updated successfully',
            product
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Delete product - admin only
export const deleteProduct = async (req, res) => {
    try {
        const product = await Product.findByIdAndUpdate(
            req.params.id,
            { isActive: false },
            { new: true }
        );

        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        res.status(200).json({
            success: true,
            message: 'Product deleted successfully'
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};