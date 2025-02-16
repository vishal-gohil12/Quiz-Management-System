import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { Button } from "../ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "../ui/card";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { backend_url } from "@/BackendURL";

interface QuizData {
  title: string;
  description: string;
}

export default function CreateEditQuizPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(!!id);

  useEffect(() => {
    if (id) {
      axios
        .get(`${backend_url}/quizzes/${id}`)
        .then((response) => {
          const quiz: QuizData = response.data.quiz;
          setTitle(quiz.title);
          setDescription(quiz.description);
          setIsLoading(false);
        })
        .catch((err) => {
          console.error("Error fetching quiz:", err);
          setIsLoading(false);
        });
    }
  }, [id]);
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) {
      setError("Quiz title and description are required.");
      return;
    }
    setError("");

    const quizData: QuizData = {
      title,
      description
    };

    try {
      if (id) {
        await axios.put(`${backend_url}/quizzes/${id}`, quizData, {
          headers: { "Content-Type": "application/json" },
        });
      } else {
        await axios.post(`${backend_url}/quiz`, quizData, {
          headers: { "Content-Type": "application/json" },
        });
      }
      navigate("/dashboard");
    } catch (err) {
      console.error("Error submitting quiz:", err);
      setError("Failed to submit quiz. Please try again.");
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-8">
      <Card className="max-w-4xl mx-auto shadow-lg">
        <CardHeader className="bg-gray-100 p-4 rounded-t">
          <CardTitle className="text-2xl font-semibold">
            {id ? "Edit Quiz" : "Create New Quiz"}
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="quizTitle" className="block text-sm font-medium text-gray-700">
                Quiz Title
              </label>
              <Input
                id="quizTitle"
                placeholder="Enter quiz title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="mt-1 w-full"
              />
            </div>
            <div>
              <label htmlFor="quizDescription" className="block text-sm font-medium text-gray-700">
                Quiz Description
              </label>
              <Textarea
                id="quizDescription"
                placeholder="Enter quiz description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="mt-1 w-full h-24"
              />
            </div>
            {error && <p className="text-red-500 text-sm">{error}</p>}
            <div className="flex justify-between">
              <Button variant="outline" onClick={() => navigate('/dashboard')}>
                Cancel
              </Button>
              <Button type="submit">
                {id ? "Update Quiz" : "Create Quiz"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
