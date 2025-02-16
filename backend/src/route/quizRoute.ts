import { Router } from "express";
import { deleteQuiz, getAllQuiz, getQuizById, postQuiz, updateQuizById } from "../controller/quizController";

export const quizRoute = Router();

quizRoute.get('/quizzes', getAllQuiz);
quizRoute.get('/quizzes/:id', getQuizById);

quizRoute.post('/quizzes', postQuiz);

quizRoute.put('/quizzes/:id', updateQuizById);

quizRoute.delete('/quizzes/:id', deleteQuiz);