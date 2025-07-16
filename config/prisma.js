import { PrismaClient } from '../generated/prisma/index.js';


// creating a centralized PrismaClient instance to be used by other files
const prisma = new PrismaClient();

export default prisma;