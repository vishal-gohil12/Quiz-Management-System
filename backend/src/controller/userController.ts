import { Request, Response } from "express";
import { prisma } from "..";
import { User } from "../type/types";

export const login = async (req: Request, res: Response) => {
    try {
        const { username, password } : User = req.body;

        if (!username || !password) {
            res.status(400).json({ error: 'Username and password are required.' });
            return;
        }

        const user = await prisma.user.findUnique({
            where: { username },
         });

        if (!user) {
            res.status(401).json({ error: 'Invalid credentials.' });
            return;
        }

        res.status(200).json({
            status: true,
            message: "login"
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ error: 'Internal server error.' });
    }
}   

export const signup = async (req: Request, res: Response) => { 
    try {
        const { username, password } : User = req.body;
        if (!username || !password) {
            res.status(400).json({ error: 'Username and password are required.' });
            return;
        }

        const user = await prisma.user.create({
            data: {
                username, password
            }
        });

        if(!user) {
            res.status(400).json({status: false, message: "user is not created"});
            return;
        }

        res.status(200).json({
            message: 'user is created.',
            status: true
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ error: 'Internal server error.' });
    }
}