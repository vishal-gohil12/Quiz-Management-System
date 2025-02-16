import { Request, Response } from "express";
import { Question, Quiz } from "../type/types";
import { prisma } from "..";

export const postQuiz = async (req: Request, res: Response) => {
    const { title, description, username, questions } : Quiz = req.body;

    if (!title || !description || !username || !Array.isArray(questions) || questions.length === 0) {
        res.status(400).json({ error: 'Missing required fields.' });
        return;
    }

    try {
        const teacher = await prisma.user.findUnique({
            where: { username },
        });

        if (!teacher) {
            res.status(404).json({ error: 'Teacher not found.' });
            return;
        }

        const quiz = await prisma.quiz.create({
            data: {
                title,
                description,
                teacher: { connect: { id: teacher?.id }},
                questions: {
                    create: questions.map((q: Question) => {
                        return {
                            questionText: q.questionText,
                            options: {
                                create: q.options
                            }
                        }
                    })
                }
            }
        });

        res.status(201).json({
            quiz: quiz
        });
    } catch {
        res.status(500).json({ error: 'Failed to create quiz' });
    }
}

export const getAllQuiz = async(req: Request, res: Response) => {
    try {
        const teacherNameQuery = req.query.teacherName;
        
        if (!teacherNameQuery || typeof teacherNameQuery !== "string") {
            res.status(400).json({ error: "Invalid or missing teacher name." });
            return;
          }

        const teacher = await prisma.user.findUnique({
            where: { username: teacherNameQuery }
        });

        if (!teacher) {
            res.status(404).json({ error: "Teacher not found." });
            return;
        }

        const quizzes = await prisma.quiz.findMany({
            where: {teacherId: teacher.id },
            include: {
                questions: {
                    include: {
                        options: true
                    }
                }
            }
        });

        res.status(200).json({ quizzes });

    } catch {
        res.status(500).json({ error: 'Failed to get quiz' });
    }
}

export const getQuizById = async (req: Request, res: Response) => {
    const { id } = req.params;

    try {
        const quiz = await prisma.quiz.findUnique({
            where: {
                id
            },
            select: {
                title: true,
                description: true,
            },
        });
        if (!quiz) {
            res.status(404).json({ error: "Quiz not found." });
            return;
        }
      
        res.status(200).json({ quiz });
    } catch {
        res.status(500).json({ error: 'Failed to get quiz' });
    }
}

export const updateQuizById = async (req: Request, res: Response) => {
    const { id } = req.params;
    const { title, description } = req.body;

    if (!title && !description) {
        res.status(400).json({ error: "At least one field (title or description) is required to update." });
    }

    try {
        const data: { title?: string; description?: string } = {};
        if (title) data.title = title;
        if (description) data.description = description;
    
        const updatedQuiz = await prisma.quiz.update({
          where: { id },
          data,
          select: {
            title: true,
            description: true,
          },
        });
    
        res.status(200).json({ quiz: updatedQuiz });
    } catch (error: any) {
        console.error("Error updating quiz:", error);
        res.status(500).json({ error: 'Failed to update quiz' });
    }
    
}

export const deleteQuiz = async (req: Request, res: Response) => {
    const { id } = req.params;

    try {
        await prisma.question.deleteMany({
            where: { quizId: id }
        });

        await prisma.quiz.delete({
            where: {id}
        })
  
        res.status(200).json({ message: "Quiz deleted successfully." });
    } catch (error) {
        console.error("Error deleting quiz:", error);
        res.status(500).json({ error: "Internal server error." });
    }
}

