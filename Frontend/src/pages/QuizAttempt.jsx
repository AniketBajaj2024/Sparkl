import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

const QuizAttempt = () => {
    const { quizId } = useParams();
    const navigate = useNavigate();
    const [questions, setQuestions] = useState([]);
    const [responses, setResponses] = useState({});
    const [attemptId, setAttemptId] = useState(null);

    useEffect(() => {
        const fetchQuestions = async () => {
            try {
                const token = localStorage.getItem("token");

                // Start the quiz attempt
                const attemptRes = await axios.post(
                    "http://localhost:5000/api/attempt/start",
                    { quiz_id: quizId },
                    { headers: { Authorization: `Bearer ${token}` } }
                );
                setAttemptId(attemptRes.data.attempt_id);

                // Fetch questions for the quiz
                const res = await axios.get(
                    `http://localhost:5000/api/question/quiz/${quizId}`,
                    { headers: { Authorization: `Bearer ${token}` } }
                );
                setQuestions(res.data);
            } catch (error) {
                console.error("Error fetching questions", error);
            }
        };

        fetchQuestions();
    }, [quizId]);

    const handleOptionSelect = (questionId, optionId) => {
        setResponses({ ...responses, [questionId]: optionId });
    };

    const handleSubmit = async () => {
        try {
            const token = localStorage.getItem("token");
            const formattedResponses = Object.keys(responses).map((questionId) => ({
                question_id: Number(questionId),
                selected_option_id: responses[questionId]
            }));

            await axios.post(
                "http://localhost:5000/api/attempt/submit",
                { attempt_id: attemptId, responses: formattedResponses },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            alert("Quiz submitted successfully!");
            navigate("/");
        } catch (error) {
            console.error("Error submitting quiz", error);
        }
    };

    return (
        <div>
            <h2>Quiz Attempt</h2>
            {questions.map((q) => (
                <div key={q.question_id}>
                    <h3>{q.question_text}</h3>
                    {q.options.map((opt) => (
                        <div key={opt.id}>
                            <input
                                type="radio"
                                name={`question_${q.question_id}`}
                                value={opt.id}
                                onChange={() => handleOptionSelect(q.question_id, opt.id)}
                            />
                            {opt.text}
                        </div>
                    ))}
                </div>
            ))}
            <button onClick={handleSubmit}>Submit Quiz</button>
        </div>
    );
};

export default QuizAttempt;
