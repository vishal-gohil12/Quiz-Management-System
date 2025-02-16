import { BrowserRouter ,Routes, Route, Navigate } from "react-router-dom";
import Login from "./components/pages/Login";
import Dashboard from "./components/pages/Dashboard";
import CreateEditQuizPage from "./components/pages/QuizPage";
import CreateQuiz from "./components/pages/CreateQuiz";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
      <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<Login />}/>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/quiz">
          <Route path="new" element={<CreateQuiz />} />
          <Route path="edit/:id" element={<CreateEditQuizPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}