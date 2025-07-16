// this file handles the actual uploading to cloudinary

import v2 from './cloudinary.js'


export const uploadToCloudinary = async (fileBuffer, fileName) => {
    const upload = new Promise((resolve, reject) => {
        v2.uploader
         .upload_stream(
            { folder: "e-commerce/screenshots", public_id: fileName},
            (err, result) => {
                if(err || !result?.secure_url) return reject(err);
                resolve(result?.secure_url)
            }
         )
         .end(fileBuffer)
    })

    return upload;
}
