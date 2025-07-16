import jwt from 'jsonwebtoken'

export const authenticateToken = (req, res, next) => { 
    let token = req.cookies?.token

    if(!token){
        res.status(401).json({ message: 'Not authorized: no token provided' })
        return;    

    }

    // explicit check for JWT_SECRET to avoid typescript errors
    if(!process.env.JWT_SECRET){
        res.status(500).json({message: 'JWT Secret not found'})   
        return;
    }

    try {            
        const decoded = jwt.verify(token, process.env.JWT_SECRET);  
        console.log("Decoded Token Payload:", decoded);
        req.user = decoded.userId; 
        console.log(req.user)  
        next();        
    } catch (error) {
        res.status(401).json({ message: 'Token is invalid'})    
        return;
    }
}
   