import React, { useEffect, useState } from "react";
import MainLayout from "../../layouts/MainLayout";
import "../../styles/test.css";
import { useNavigate } from "react-router-dom";
import { quizImages } from "../../utils/imageMap";

const FALLBACK_USER = { firstname: "Kanokwan", lastname: "TestSystem" };

export default function BubblePosttest() {
  const navigate = useNavigate();

  const [questions, setQuestions] = useState([]);
  const [current, setCurrent] = useState(0);
  const [score, setScore] = useState(0);
  const [userAnswers, setUserAnswers] = useState([]); // ✨ เก็บคำตอบ 1, 2, 3 เข้า Admin
  const [loading, setLoading] = useState(true);
  const [showResult, setShowResult] = useState(false);
  const [isAlreadyDone, setIsAlreadyDone] = useState(false);

  const QUESTION_API = "https://script.google.com/macros/s/AKfycbwyxhS44YfJ743L1MIb57lN0CSpq5EUOZWMuUKSw7npDemfARhfeseneXrrVVxpLifC2w/exec";
  const SCORE_API = "https://script.google.com/macros/s/AKfycbxaSnMhAZYVgAwDS7VOgJuINzO2Wn3r8EBMPMFt84nbjy4tn-O5i6OUQIHj19L9jFNJ/exec";

  const getUserKey = () => {
    let user = {};
    try { user = JSON.parse(localStorage.getItem("user")) || {}; } catch { }
    if (user.email) return user.email;
    let guestId = localStorage.getItem("guest_id");
    if (!guestId) {
      guestId = crypto.randomUUID();
      localStorage.setItem("guest_id", guestId);
    }
    return `guest_${guestId}`;
  };

  // ---------------- LOAD + CHECK (ซิงค์กับฐานข้อมูลจริง) ----------------
  useEffect(() => {
    const userKey = getUserKey();
    const progressKey = `progress_${userKey}_bubble`;
    const history = JSON.parse(localStorage.getItem(progressKey)) || {};

    const checkAndLoad = async () => {
      // เช็กในฐานข้อมูลเผื่อแอดมินลบคะแนนให้ทำใหม่
      if (history.posttest !== undefined && history.posttest !== null) {
        try {
          const response = await fetch(`${SCORE_API}?action=getScores`);
          const allData = await response.json();
          const user = JSON.parse(localStorage.getItem("user")) || {};

          const stillExists = allData.some(st =>
            (st.firstname === user.firstname || st.firstname === userKey) &&
            st.activityName === "Bubble Sort Posttest"
          );

          if (stillExists) {
            setScore(history.posttest);
            setIsAlreadyDone(true);
            setShowResult(true);
            setLoading(false);
            return;
          } else {
            localStorage.removeItem(progressKey);
          }
        } catch (e) {
          setScore(history.posttest);
          setIsAlreadyDone(true);
          setShowResult(true);
          setLoading(false);
          return;
        }
      }

      fetch(`${QUESTION_API}?type=pretest_bubble`)
        .then(res => res.json())
        .then(data => {
          setQuestions(data || []);
          setLoading(false);
        })
        .catch(() => setLoading(false));
    };

    checkAndLoad();
  }, []);

  // ---------------- FINISH ----------------
  useEffect(() => {
    if (!isAlreadyDone && !loading && questions.length > 0 && current >= questions.length) {
      submitScore();
      setShowResult(true);
    }
  }, [current, loading, questions, isAlreadyDone]);

  // ---------------- SAVE SCORE ----------------
  const submitScore = async () => {
    const userKey = getUserKey();
    let user = {};
    try { user = JSON.parse(localStorage.getItem("user")) || {}; } catch { }

    const payload = {
      activity: "POSTTEST",
      firstname: user.firstname || userKey,
      lastname: user.lastname || FALLBACK_USER.lastname,
      testName: "Bubble Sort Posttest",
      score: score,
      allAnswers: userAnswers.join(" | ") // ✨ ส่งคำตอบไปเก็บใน Sheet
    };

    try {
      await fetch(SCORE_API, {
        method: "POST",
        headers: { "Content-Type": "text/plain;charset=utf-8" },
        body: JSON.stringify(payload),
      });
    } catch { }

    const progressKey = `progress_${userKey}_bubble`;
    const currentData = JSON.parse(localStorage.getItem(progressKey)) || {};
    localStorage.setItem(progressKey, JSON.stringify({ ...currentData, posttest: score }));
  };

  const handleAnswer = (choiceIndex) => {
    const q = questions[current];
    if (!q) return;

    // ✨ เก็บเป็นเลขข้อ (1, 2, 3, 4)
    const choiceNumber = choiceIndex + 1;
    setUserAnswers(prev => [...prev, choiceNumber]);

    if (parseInt(q.answer) === choiceIndex) setScore(prev => prev + 1);
    setCurrent(prev => prev + 1);
  };

  if (loading) return <MainLayout><div className="loading">กำลังตรวจสอบสิทธิ์...</div></MainLayout>;

  if (showResult) {
    return (
      <MainLayout>
        <div className="test-hero" style={{ backgroundImage: `url(${require('../../assets/bg-pattern.png')})` }}>
          <div className="hero-center">
            <h1 className="test-title">BUBBLE SORT</h1>
            <h3 className="test-sub">ผลการทดสอบหลังเรียน</h3>
          </div>
        </div>

        <div className="test-box-container" style={{ display: 'flex', justifyContent: 'center' }}>
          <div className="result-card-fancy fade-in">
            {isAlreadyDone && (
              <div style={{ color: '#e53e3e', fontWeight: 'bold', marginBottom: '10px', fontSize: '14px' }}>
                ⚠️ คุณทำแบบทดสอบนี้ไปแล้ว
              </div>
            )}
            <span className="result-icon">🎉</span>
            <div className="result-score-circle">
              <span className="score-big" style={{ color: '#333333' }}>{score}</span>
              <span className="score-divider" style={{ color: '#666666' }}>/</span>
              <span className="score-total" style={{ color: '#666666' }}>{questions.length || 10}</span>
            </div>
            <button className="result-btn-next" onClick={() => navigate("/sortlearn/home")}>กลับหน้าหลัก 🏠</button>
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="test-hero" style={{ backgroundImage: `url(${require('../../assets/bg-pattern.png')})` }}>
        <div className="hero-center">
          <h1 className="test-title">BUBBLE SORT</h1>
          <h3 className="test-sub">แบบทดสอบหลังเรียน</h3>
        </div>
      </div>

      <div className="test-box-container" style={{ display: 'flex', justifyContent: 'center' }}>
        <div className="test-box shadow-sm">
          <div className="test-number">{questions[current]?.no}</div>
          <div className="test-question">{questions[current]?.question}</div>

          {questions[current]?.image && quizImages[questions[current].image] && (
            <div className="test-image-box" style={{ textAlign: 'center', marginBottom: '15px' }}>
              <img src={quizImages[questions[current].image]} alt="โจทย์ประกอบ" style={{ maxWidth: '100%', borderRadius: '8px', border: '1px solid #ddd' }} />
            </div>
          )}

          <div className="choice-grid">
            {questions[current]?.choices.map((choice, idx) => (
              <button key={idx} className="choice-btn" onClick={() => handleAnswer(idx)}>
                {choice}
              </button>
            ))}
          </div>
        </div>
      </div>
    </MainLayout>
  );
}