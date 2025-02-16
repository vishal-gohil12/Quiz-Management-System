import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Card, CardContent, CardHeader } from "../ui/card";
import axios from "axios";
import { backend_url } from "@/BackendURL";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!username || !password) {
      setError("Both fields are required");
      return;
    }
   try {
    const res = await axios.post(`${backend_url}/user/login`, { username, password });
    if(res.data.status) {
      navigate('/dashboard');
    }
   } catch {
    alert("username or password is worng");
   }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="text-center bg-white p-8">
          <h2 className="text-3xl font-bold text-gray-900">Welcome to Quizo</h2>
          <p className="mt-2 text-sm text-gray-600">
            Sign in to manage your quizzes
          </p>
        </CardHeader>
        <CardContent className="p-8">
          <form className="space-y-4" onSubmit={handleLogin}>
            <Input
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <Input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            {error && <p className="text-red-500 text-sm">{error}</p>}
            <Button className="w-full" type="submit">
              Login
            </Button>
            <p className="text-sm text-gray-500 text-center">
              Demo Credentials: demoTeacher / demoTeacher
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
