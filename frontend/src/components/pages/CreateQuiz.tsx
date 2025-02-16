import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Button } from "../ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "../ui/card";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { backend_url } from "@/BackendURL";

interface Option {
  text: string;
  isCorrect: boolean;
}

interface MCQ {
  questionText: string;
  options: Option[];
}

interface QuizData {
  title: string;
  description: string;
  username: string;
  questions: MCQ[];
}

export default function CreateQuiz() {
  const navigate = useNavigate();
  
  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [username, setUsername] = useState<string>("demoTeacher");
  const [questions, setQuestions] = useState<MCQ[]>(
    Array.from({ length: 5 }, () => ({
      questionText: "",
      options: [
        { text: "", isCorrect: false },
        { text: "", isCorrect: false },
        { text: "", isCorrect: false },
        { text: "", isCorrect: false },
      ],
    }))
  );
  const [error, setError] = useState<string>("");

  const handleQuestionChange = (qIndex: number, value: string) => {
    const newQuestions = [...questions];
    newQuestions[qIndex].questionText = value;
    setQuestions(newQuestions);
  };

  const handleOptionChange = (qIndex: number, oIndex: number, value: string) => {
    const newQuestions = [...questions];
    newQuestions[qIndex].options[oIndex].text = value;
    setQuestions(newQuestions);
  };

  const handleCorrectOptionChange = (qIndex: number, oIndex: number) => {
    const newQuestions = [...questions];
    newQuestions[qIndex].options = newQuestions[qIndex].options.map((opt, idx) => ({
      ...opt,
      isCorrect: idx === oIndex,
    }));
    setQuestions(newQuestions);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim() || !description.trim()) {
      setError("Quiz title and description are required.");
      return;
    }
    for (let i = 0; i < questions.length; i++) {
      const q = questions[i];
      if (!q.questionText.trim()) {
        setError(`Question ${i + 1} text is required.`);
        return;
      }
      for (let j = 0; j < q.options.length; j++) {
        if (!q.options[j].text.trim()) {
          setError(`All options for question ${i + 1} are required.`);
          return;
        }
      }
      if (!q.options.some((opt) => opt.isCorrect)) {
        setError(`Please select a correct option for question ${i + 1}.`);
        return;
      }
    }
    setError("");

    const quizData: QuizData = {
      title,
      description,
      username,
      questions,
    };

    try {
      await axios.post(`${backend_url}/quizzes`, quizData, {
        headers: { "Content-Type": "application/json" },
      });
      navigate("/dashboard");
    } catch (err) {
      console.error("Error creating quiz:", err);
      setError("Failed to create quiz. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-8">
      <Card className="max-w-4xl mx-auto shadow-lg">
        <CardHeader className="bg-gray-100 p-4 rounded-t">
          <CardTitle className="text-2xl font-semibold">Create New Quiz</CardTitle>
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
            <div>
              <label htmlFor="teacherUsername" className="block text-sm font-medium text-gray-700">
                Teacher Username
              </label>
              <Input
                id="teacherUsername"
                placeholder="Enter teacher username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="mt-1 w-full"
              />
            </div>
            {questions.map((q, qIndex) => (
              <div key={qIndex} className="border p-4 rounded bg-white shadow-sm">
                <h3 className="text-lg font-medium mb-2">Question {qIndex + 1}</h3>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700">
                    Question Text
                  </label>
                  <Input
                    placeholder="Enter question text"
                    value={q.questionText}
                    onChange={(e) => handleQuestionChange(qIndex, e.target.value)}
                    className="mt-1 w-full"
                  />
                </div>
                <div className="space-y-2">
                  {q.options.map((option, oIndex) => (
                    <div key={oIndex} className="flex items-center space-x-2">
                      <Input
                        placeholder={`Option ${oIndex + 1}`}
                        value={option.text}
                        onChange={(e) => handleOptionChange(qIndex, oIndex, e.target.value)}
                        className="flex-1"
                      />
                      <label className="flex items-center space-x-1 cursor-pointer">
                        <input
                          type="radio"
                          name={`correctOption-${qIndex}`}
                          checked={option.isCorrect}
                          onChange={() => handleCorrectOptionChange(qIndex, oIndex)}
                          className="form-radio h-4 w-4 text-blue-600"
                        />
                        <span className="text-sm">Correct</span>
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            ))}
            {error && <p className="text-red-500 text-sm">{error}</p>}
            <div className="flex justify-between">
              <Button variant="outline" onClick={() => navigate('/dashboard')}>
                Cancel
              </Button>
              <Button type="submit">
                Create Quiz
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
