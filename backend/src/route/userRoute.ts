import { Router } from "express";
import { login, signup } from "../controller/userController";

export const userRoute = Router();

userRoute.post('/login', login);
userRoute.post('/register', signup);