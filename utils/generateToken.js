import jwt from 'jsonwebtoken'

export const generateToken = (userId) => {

   // Check what the secret truly is *before* signing
   console.log("generateToken: JWT_SECRET value:", process.env.JWT_SECRET);
   console.log("generateToken: userId being signed:", userId); // Crucial: check if userId is correct

   if (!process.env.JWT_SECRET) {
      console.error("generateToken Error: JWT_SECRET is undefined! Cannot sign token.");
      throw new Error("JWT Secret not configured.");
   }

    
   const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
      expiresIn: '7d'
   })
   return token;
}     