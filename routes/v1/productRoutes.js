import express from 'express';
import { createProduct } from '../../controllers/productController.js';
import upload from '../../middleware/multer.js';
import { authenticateToken } from '../../middleware/authenticateToken.js';

const router =  express.Router();

// routes for all your product related endpoints


// the 5 is the maximum number of image that can be uploaded, the image is the filed name


router.post('/product', authenticateToken, upload.array('images', 5), createProduct)

 

export default router; 