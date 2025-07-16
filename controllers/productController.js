import prisma from '../config/prisma.js';
import { uploadToCloudinary } from '../utils/uploadToCloudinary.js';


export const createProduct = async (req, res) => {
    const { name, description, price, category, image } = req.body
    const productImages = req.files
    const userId = req.user.id

    try {
        if (!name || !description || !category || !price) {
            return res.status(400).json({ message: ' Please provide name, description, category and price' })
        }

        // Validate userId (should always be present if authentication middleware works)
        if (!userId) {
            // This case should ideally not be hit if auth middleware is correctly applied
            return res.status(401).json({ message: 'User not authenticated or user ID missing.' });
        }

        let imageUrls = []



        // 5. Handle image uploads to Cloudinary
        if (productImages && productImages.length > 0) {
            // Map each file to an upload promise
            const uploadPromises = productImages.map(async (file) => {
                // Generate a unique filename for Cloudinary, using originalname for better identification
                // Consider adding more robust unique ID generation (e.g., using 'uuid' library)
                const uniqueFileName = `product_${Date.now()}_${Math.random().toString(36).substring(2, 8)}_${file.originalname.replace(/\s+/g, '_')}`;

                try {
                    // uploadToCloudinary should return the secure_url directly
                    const secureUrl = await uploadToCloudinary(file.buffer, uniqueFileName);
                    return secureUrl;
                } catch (uploadError) {
                    // Log the specific upload error but don't stop the whole process immediately
                    console.error(`Failed to upload image ${file.originalname}:`, uploadError);
                    // Decide how to handle this:
                    // 1. Re-throw to fail the whole product creation if any image fails
                    throw new Error(`Failed to upload image: ${file.originalname}`);
                    // 2. Or, push a placeholder/null and continue (less ideal for product images)
                    // return null;
                }
            });

            // Wait for all upload promises to resolve
            try {
                // Filter out any potential nulls if you chose option 2 above
                imageUrls = (await Promise.all(uploadPromises)).filter(url => url !== null);
            } catch (uploadAllError) {
                // If any upload failed and re-threw, catch it here
                return res.status(500).json({ message: uploadAllError.message || 'Error uploading one or more images.' });
            }

            // Optional: If no images uploaded despite files being present, or if all failed
            if (imageUrls.length === 0 && productImages.length > 0) {
                return res.status(500).json({ message: 'No images were successfully uploaded to Cloudinary.' });
            }
        } else {
            // Optional: If product requires at least one image
            // return res.status(400).json({ message: 'At least one product image is required.' });
            console.log("No product images provided for this product.");
        }




        const product = await prisma.product.create({
            data: {
                name,
                description,
                price: parseFloat(price),
                category,
                images: imageUrls,
                userId: userId
            }
        })

        return res.status(201).json({
            message: 'Product created successfully',
            product
        })

    } catch (error) {
        console.error(error)
        return res.status(500).json({ message: 'Internal server error:', error })
    }
}