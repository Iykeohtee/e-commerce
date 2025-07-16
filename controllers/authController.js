import prisma from '../config/prisma.js';
import bcrypt from 'bcrypt';
import { generateToken } from '../utils/generateToken.js';


// implementing the register functionality/controller
export const register = async (req, res) => {
    const { name, email, password, confirmPassword, bio } = req.body

    // check if all the fields are provided
    if (!name || !email || !password || !confirmPassword || !bio) {
        return res.status(400).json({ message: "All fields are required" });
    }

    //  check if password and confirmPassword match
    if (password !== confirmPassword) {
        return res.status(400).json({ message: 'Password do not match' })
    }

    // check if user exist in database
    const existingUser = await prisma.user.findUnique({
        where: { email }
    })

    if (existingUser) {
        return res.status(400).json({ message: 'User already exists' })
    }

    //    hash your password using bcrypt
    const hashedPassword = await bcrypt.hash(password, 10)

    // generate a random six digit code on registeration
    const code = Math.ceil(Math.random() * 1000000).toString();


    // create the user in database
    await prisma.user.create({
        data: {
            name,
            email,
            bio,
            password: hashedPassword,
            verificationToken: code
        }
    })

    return res.status(200).json({
        message: 'User registered successfully',
        user: {
            name,
            email,
            bio,
            isVerified: false
        }
    })
}



// implementing the verifyEmail controller/endpoint
export const verifyEmail = async (req, res) => {
    const { email, token } = req.body

    if (!email || !token) {
        return res.status(400).json({ message: 'All fields are required' })
    }

    const user = await prisma.user.findUnique({ where: { email } })

    if (!user) {
        return res.status(404).json({ message: 'User with this email cannot be found' })
    }

    if (user.verificationToken !== token) {
        return res.status(400).json({ message: 'Incorrect or expired token' })
    }

    if (user.verificationToken === token) {
        user.verificationToken = null
        user.isVerified = true
    }

    const JWTtoken = generateToken(user.id);

    res.cookie('token', JWTtoken, {
        httpOnly: true,
        secure: true,
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000 
    })

    await prisma.user.update({    
        where: { email },
        data: {
            verificationToken: null,
            isVerified: true
        }
    })

    return res.status(200).json({
        message: 'Email verification successful',
        user: {
            name: user.name,
            email: user.email,
            bio: user.bio,
            isVerified: user.isVerified
        }
    })

}


export const login = async (req, res) => {
    const { email, password } = req.body

    //    check for empty fields
    if (!email || !password) {
        return res.status(400).json({ message: 'All fields are required' })
    }

    // check for existingUser 
    const existingUser = await prisma.user.findUnique({ 
        where: { email }
    })

    if(!existingUser){
        return res.status(404).json({ message: 'Incorrect credentials'})
    }

    // compare passwords
    const comparePassword = await bcrypt.compare(password, existingUser.password)

     if(!comparePassword){
        return res.status(400).json({ message: 'Incorrect credentials' })
     }


    const JWTtoken = generateToken(existingUser._id);

     
    res.cookie('token', JWTtoken, {
        httpOnly: true,
        secure: true,
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000 
    })
     
     return res.status(400).json({
        message: 'Login successful',
        user: {
            name: existingUser.name,
            email: existingUser.email,   
            bio: existingUser.bio,
            isVerified: existingUser.isVerified
        }
    })
     
}


export const logout = (req, res) => {
    res.clearCookie('token', {
        httpOnly: true,
        secure: true,
        sameSite: 'strict',
    })

    return res.status(200).json({ message: 'Logged out successfully'})
}

