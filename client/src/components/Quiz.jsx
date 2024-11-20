import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { db } from "../firebase"; // Import Firestore db
import { collection, query, where, getDocs, runTransaction } from "firebase/firestore"; // Firestore methods
import { auth } from "../firebase"; // Import Firebase Auth for current user

const Quiz = () => {
  const [questions, setQuestions] = useState([]);
  const [userAnswers, setUserAnswers] = useState({});
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetch quiz questions from the API
    axios
      .get('https://quizapi.io/api/v1/questions', {
        params: {
          apiKey: "eC6KdFkjESqGTyr8uye55uKHSdh8URRugFheUvJl",
          category: 'code',
          difficulty: 'Easy',
          limit: 10,
        },
      })
      .then((response) => {
        const formattedQuestions = response.data.map((question) => ({
          ...question,
          incorrect_answers: Array.isArray(question.incorrect_answers)
            ? question.incorrect_answers
            : [],
        }));
        setQuestions(formattedQuestions);
      })
      .catch((error) => {
        console.error('Error fetching questions:', error);
        setError('Failed to load questions. Please try again later.');
      });
  }, []);

  // Handle user's answer selection
  const handleAnswerSelect = (questionId, selectedAnswer) => {
    setUserAnswers((prevAnswers) => ({
      ...prevAnswers,
      [questionId]: selectedAnswer,
    }));
  };

  // Move to the next question
  const handleNextQuestion = () => {
    setCurrentQuestionIndex((prevIndex) => prevIndex + 1);
  };

  // Calculate score
  const calculateScore = () => {
    let score = 0;
    questions.forEach((question) => {
      if (userAnswers[question.id] === question.correct_answer) {
        score += 1;
      }
    });
    return score;
  };

  // Save quiz history to Firestore
  const saveQuizHistory = async (quizName, score) => {
    const user = auth.currentUser;
    if (!user) {
      console.error('No user is currently signed in.');
      return;
    }

    const email = user.email;
    const studentsRef = collection(db, "students");

    const q = query(studentsRef, where("email", "==", email));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      console.error("No student found with this email.");
      return;
    }

    const studentDoc = querySnapshot.docs[0];
    const studentDocRef = studentDoc.ref;

    const quizHistoryEntry = {
      quizName,
      score,
      date: new Date().toISOString(),
    };

    try {
      await runTransaction(db, async (transaction) => {
        const studentDoc = await transaction.get(studentDocRef);

        if (!studentDoc.exists()) {
          throw new Error("Student document does not exist.");
        }

        const studentData = studentDoc.data();

        if (!Array.isArray(studentData.quizHistory)) {
          transaction.update(studentDocRef, { quizHistory: [] });
        }

        transaction.update(studentDocRef, {
          quizHistory: [...(studentData.quizHistory || []), quizHistoryEntry],
        });
      });

      console.log('Quiz history successfully saved!');
    } catch (error) {
      console.error('Error saving quiz history:', error);
      setError('Failed to save quiz history. Please try again later.');
    }
  };

  // Handle quiz submission
  const handleSubmitQuiz = () => {
    const score = calculateScore();
    saveQuizHistory('Sample Quiz', score);
    setQuizCompleted(true);
  };

  if (error) {
    return <div className="text-danger text-center">{error}</div>;
  }

  if (quizCompleted) {
    const score = calculateScore();
    return (
      <div className="text-center">
        <h3>Quiz Completed!</h3>
        <p>Your score: {score}/{questions.length}</p>
      </div>
    );
  }

  if (questions.length === 0) {
    return <div className="text-center">Loading quiz questions...</div>;
  }

  const currentQuestion = questions[currentQuestionIndex];

  return (
    <div className="container-fluid quiz-container">
      <div className="quiz-header text-center my-4">
        <h2>Quiz: {currentQuestion.category}</h2>
        <p>Question {currentQuestionIndex + 1} of {questions.length}</p>
      </div>

      <div className="question mb-4">
        <h3>{currentQuestion.question}</h3>
        {currentQuestion.description && (
          <p><strong>Description:</strong> {currentQuestion.description}</p>
        )}

        <div className="options row">
          {Object.entries(currentQuestion.answers)
            .filter(([_, value]) => value) // Only display non-null answers
            .map(([key, answer]) => {
              const isSelected = userAnswers[currentQuestion.id] === key;
              return (
                <div key={key} className="col-md-6 mb-3">
                  <div className="form-check">
                    <input
                      type="radio"
                      className="form-check-input"
                      name={currentQuestion.id}
                      value={key}
                      checked={isSelected}
                      onChange={() => handleAnswerSelect(currentQuestion.id, key)}
                      id={`option-${key}`}
                    />
                    <label className="form-check-label" htmlFor={`option-${key}`}>
                      {answer}
                    </label>
                  </div>
                </div>
              );
            })}
        </div>
      </div>

      <div className="quiz-footer text-center">
        {currentQuestionIndex < questions.length - 1 ? (
          <button className="btn btn-primary" onClick={handleNextQuestion}>
            Next Question
          </button>
        ) : (
          <button className="btn btn-success" onClick={handleSubmitQuiz}>
            Submit Quiz
          </button>
        )}
      </div>
    </div>
  );
};

export default Quiz;