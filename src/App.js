import React, { useState, useRef, useEffect, useMemo } from "react";
import QUESTIONS from "./questions";
import IntroScreen from "./components/IntroScreen";
import QuizScreen from "./components/QuizScreen";
import FeedbackScreen from "./components/FeedbackScreen";
import ResultsScreen from "./components/ResultsScreen";

const RISK_META = {
  red: { label: "Alta gravedad", points: 3 },
  yellow: { label: "Gravedad media", points: 2 },
  green: { label: "Baja gravedad", points: 1 },
};

const TOTAL_LIVES = 3;

export default function App() {
  const [mode, setMode] = useState(null); // exam | practice | challenge
  const [dni, setDni] = useState("");
  const [questions, setQuestions] = useState([]);
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [finished, setFinished] = useState(false);
  const [showFeedback, setShowFeedback] = useState(null); // { correct, question }
  const [lives, setLives] = useState(TOTAL_LIVES);

  const [secondsLeft, setSecondsLeft] = useState(null);
  const timerRef = useRef(null);

  useEffect(() => {
    if (!questions.length || finished || showFeedback) return;

    const q = questions[index];
    if (!q) return;
    clearInterval(timerRef.current);

    if (mode === "practice") {
      setSecondsLeft(null);
      return;
    }

    const total = mode === "challenge" ? Math.min(q.timeLimit ?? 30, 15) : q.timeLimit ?? 30;
    let remaining = total;
    setSecondsLeft(remaining);

    timerRef.current = setInterval(() => {
      remaining -= 1;
      setSecondsLeft(remaining);
      if (remaining <= 0) {
        clearInterval(timerRef.current);
        handleTimeout(q.id);
      }
    }, 1000);

    return () => clearInterval(timerRef.current);
  }, [index, questions, mode, finished, showFeedback]);

  function start(modeChoice) {
    setMode(modeChoice);
    setIndex(0);
    setAnswers({});
    setFinished(false);
    setShowFeedback(null);
    setLives(TOTAL_LIVES);

    if (modeChoice === "exam") {
      const reds = QUESTIONS.filter((q) => q.risk === "red");
      const yellows = QUESTIONS.filter((q) => q.risk === "yellow");
      const greens = QUESTIONS.filter((q) => q.risk === "green");
      const pick = [
        ...shuffle(reds).slice(0, 3),
        ...shuffle(yellows).slice(0, 6),
        ...shuffle(greens).slice(0, 11),
      ].filter(Boolean);
      setQuestions(shuffle(pick.length ? pick : QUESTIONS));
    } else if (modeChoice === "challenge") {
      setQuestions(shuffle(QUESTIONS).slice(0, 5));
    } else {
      setQuestions(shuffle(QUESTIONS));
    }
  }

  function shuffle(arr) {
    return [...arr].sort(() => Math.random() - 0.5);
  }

  function handleTimeout(qid) {
    if (!answers[qid]) {
      setAnswers((prev) => ({ ...prev, [qid]: { optionId: null, correct: false } }));
      const nextLives = lives - 1;
      setLives(nextLives);
      if (nextLives <= 0) {
        setShowFeedback(null);
        setFinished(true);
      } else {
        setShowFeedback({ correct: false, question: questions[index] });
      }
    }
  }

  function selectOption(qid, optId) {
    const q = questions.find((x) => x.id === qid);
    const opt = q.options.find((o) => o.id === optId);
    const correct = !!opt?.correct;
    setAnswers((prev) => ({ ...prev, [qid]: { optionId: optId, correct } }));
    if (correct) {
      setShowFeedback({ correct: true, question: q });
    } else {
      const nextLives = lives - 1;
      setLives(nextLives);
      if (nextLives <= 0) {
        setShowFeedback(null);
        setFinished(true);
      } else {
        setShowFeedback({ correct: false, question: q });
      }
    }
    clearInterval(timerRef.current);
  }

  function goNext() {
    if (index + 1 < questions.length) {
      setIndex(index + 1);
      setShowFeedback(null);
    } else {
      setFinished(true);
    }
  }

  function restart() {
    setMode(null);
    setQuestions([]);
    setAnswers({});
    setIndex(0);
    setFinished(false);
    setShowFeedback(null);
    setLives(TOTAL_LIVES);
  }

  if (!mode) {
    return <IntroScreen dni={dni} setDni={setDni} start={start} />;
  }

  if (finished) {
    return (
      <ResultsScreen
        questions={questions}
        answers={answers}
        restart={restart}
        RISK_META={RISK_META}
        endedByLives={lives <= 0}
      />
    );
  }

  if (showFeedback) {
    return (
      <FeedbackScreen
        data={showFeedback}
        answer={answers[showFeedback.question.id]}
        goNext={goNext}
      />
    );
  }

  return (
    <QuizScreen
      question={questions[index]}
      index={index}
      total={questions.length}
      answers={answers}
      selectOption={selectOption}
      secondsLeft={secondsLeft}
      mode={mode}
      RISK_META={RISK_META}
      lives={lives}
      totalLives={TOTAL_LIVES}
    />
  );
}
