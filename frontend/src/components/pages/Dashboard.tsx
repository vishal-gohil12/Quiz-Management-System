import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Pencil, Trash2, LogOut, Plus } from 'lucide-react';

import { Button } from '../ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '../ui/card';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '../ui/alert-dialog';
import axios from 'axios';

export interface Quiz {
  id: string;
  title: string;
  description: string;
  createdAt: string;
  teacherId: string;
}

export default function DashboardPage() {
  const navigate = useNavigate();
  const teacherName = "demoTeacher"; 

  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchQuizzes() {
      try {
        const response = await fetch(
          `http://localhost:3000/quizzes?teacherName=${encodeURIComponent(teacherName)}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch quizzes");
        }

        const data = await response.json();
        setQuizzes(data.quizzes);
      } catch (error) {
        console.error("Error fetching quizzes:", error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchQuizzes();
  }, [teacherName]);

  function handleLogout() {
    navigate('/login');
  }

  async function handleDeleteQuiz(quizId: string) {
    try {
      await axios.delete(`http://localhost:3000/quizzes/${quizId}`);
      setQuizzes(quizzes.filter((quiz) => quiz.id !== quizId));
    }  catch (error) {
      console.error("Error deleting quiz:", error);
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row justify-between items-center mb-8">
          <div className="mb-4 sm:mb-0">
            <h1 className="text-3xl font-bold text-gray-900">Quizo</h1>
            <p className="text-gray-600">Welcome back, {teacherName}</p>
          </div>
          <div className="flex space-x-4">
            <Button onClick={() => navigate('/quiz/new')} className="flex items-center">
              <Plus className="mr-2 h-4 w-4" />
              Create Quiz
            </Button>
            <Button variant="outline" onClick={handleLogout} className="flex items-center">
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </Button>
          </div>
        </div>
        {/* Quizzes Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {quizzes.map((quiz) => (
            <Card key={quiz.id} className="shadow hover:shadow-lg transition-shadow">
              <CardHeader className="bg-gray-100 p-4 rounded-t">
                <CardTitle className="text-xl font-semibold">{quiz.title}</CardTitle>
                <CardDescription className="text-gray-600 mt-1">
                  {quiz.description}
                </CardDescription>
              </CardHeader>
              <CardContent className="p-4 flex flex-col justify-between">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">
                    Created: {new Date(quiz.createdAt).toLocaleDateString()}
                  </span>
                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => navigate(`/quiz/edit/${quiz.id}`)}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="outline" size="icon">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Delete Quiz</AlertDialogTitle>
                          <AlertDialogDescription>
                            Are you sure you want to delete this quiz? This action cannot be undone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction onClick={() => handleDeleteQuiz(quiz.id)}>
                            Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
