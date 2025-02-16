import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const App = () => {
    const [quizzes, setQuizzes] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchQuizzes = async () => {
            try {
                const res = await axios.get("http://localhost:5000/api/quiz/list", {
                    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
                });
                setQuizzes(res.data);
            } catch (error) {
                console.error("Error fetching quizzes", error);
            }
        };
        fetchQuizzes();
    }, []);

    const handleStartQuiz = (quizId) => {
        navigate(`/quiz/${quizId}`);
    };

    const handleLogout = () => {
        localStorage.removeItem("token");
        navigate("/login");
    };

    return (
        <div>
            <h2>Welcome to Online Quiz System</h2>
            <button onClick={handleLogout}>Logout</button>
            <h3>Available Quizzes</h3>
            <ul>
                {quizzes.map((quiz) => (
                    <li key={quiz.id}>
                        {quiz.title} - {quiz.duration} min 
                        <button onClick={() => handleStartQuiz(quiz.id)}>Start Quiz</button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default App;
