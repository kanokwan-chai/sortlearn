import React, { useEffect, useState } from "react";
import MainLayout from "../../layouts/MainLayout";
import "../../styles/test.css"; 
import { useNavigate } from "react-router-dom";
import { quizImages } from "../../utils/imageMap";

const FALLBACK_USER = { firstname: "Kanokwan", lastname: "TestSystem" };
const LESSON_KEY = "insertion"; 

export default function InsertionPosttest() {
  const navigate = useNavigate();

  const [questions, setQuestions] = useState([]);
  const [current, setCurrent] = useState(0);
  const [score, setScore] = useState(0);
  const [loading, setLoading] = useState(true);
  const [showResult, setShowResult] = useState(false);
  const [isAlreadyDone, setIsAlreadyDone] = useState(false);

  const QUESTION_API =
    "https://script.google.com/macros/s/AKfycbwyxhS44YfJ743L1MIb57lN0CSpq5EUOZWMuUKSw7npDemfARhfeseneXrrVVxpLifC2w/exec";
  const SCORE_API =
    "https://script.google.com/macros/s/AKfycbxaSnMhAZYVgAwDS7VOgJuINzO2Wn3r8EBMPMFt84nbjy4tn-O5i6OUQIHj19L9jFNJ/exec";

  // ✅ ฟังก์ชันเดียว ใช้ทั้งไฟล์
  const getUserKey = () => {
    let user = {};
    try {
      user = JSON.parse(localStorage.getItem("user")) || {};
    } catch {}

    if (user.email) return user.email;

    let guestId = localStorage.getItem("guest_id");
    if (!guestId) {
      guestId = crypto.randomUUID();
      localStorage.setItem("guest_id", guestId);
    }
    return `guest_${guestId}`;
  };

  // ---------------- LOAD + CHECK HISTORY ----------------
  useEffect(() => {
    const userKey = getUserKey();
    const progressKey = `progress_${userKey}_${LESSON_KEY}`;

    const history = JSON.parse(localStorage.getItem(progressKey)) || {};

    if (history.posttest !== undefined && history.posttest !== null) {
      setScore(history.posttest);
      setIsAlreadyDone(true);
      setShowResult(true);
      setLoading(false);
      return;
    }

    fetch(`${QUESTION_API}?type=pretest_insertion`)
      .then((res) => res.json())
      .then((data) => {
        setQuestions(data || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  // ---------------- FINISH QUIZ ----------------
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
    try {
      user = JSON.parse(localStorage.getItem("user")) || {};
    } catch {}

    const payload = {
      activity: "POSTTEST",
      firstname: user.firstname || userKey,
      lastname: user.lastname || FALLBACK_USER.lastname,
      testName: "Insertion Sort Posttest",
      score: score,
    };

  try {
    await fetch(SCORE_API, {
      method: "POST",
      headers: { "Content-Type": "text/plain;charset=utf-8" },
      body: JSON.stringify(payload),
    });
  } catch {}

  const progressKey = `progress_${userKey}_${LESSON_KEY}`;
  const currentData = JSON.parse(localStorage.getItem(progressKey)) || {};

  localStorage.setItem(
    progressKey,
    JSON.stringify({ ...currentData, posttest: score })
  );
};


  const handleAnswer = (choiceIndex) => {
    const currentQ = questions[current];
    if (!currentQ) return; 
    const correct = parseInt(currentQ.answer);
    if (choiceIndex === correct) setScore((prev) => prev + 1);
    setCurrent((prev) => prev + 1);
  };

  if (loading) return <MainLayout><div className="loading">กำลังตรวจสอบสิทธิ์...</div></MainLayout>;

  if (showResult) {
    return (
      <MainLayout>
        <div className="test-hero" style={{backgroundImage: `url(${require('../../assets/bg-pattern.png')})`}}>
          <div className="hero-center">
            <h1 className="test-title">INSERTION SORT</h1>
            <h3 className="test-sub">ผลคะแนนหลังเรียน</h3>
          </div>
        </div>
        <div className="test-box-container" style={{display:'flex', justifyContent:'center'}}>
          <div className="result-card-fancy fade-in">
              {isAlreadyDone && (
                <div style={{color:'#e53e3e', fontWeight:'bold', marginBottom:'10px'}}>
                  ⚠️ คุณทำแบบทดสอบนี้ไปแล้ว
                </div>
              )}
              <span className="result-icon">🎉</span>
              <div className="result-score-circle">
                <span className="score-big" style={{ color: '#333333' }}>{score}</span>
                <span className="score-divider" style={{ color: '#666666' }}>/</span>
                <span className="score-total" style={{ color: '#666666' }}>
                    {questions.length > 0 ? questions.length : 10}
                </span>
              </div>
              <button className="result-btn-next" onClick={() => navigate("/home")}>
                กลับหน้าหลัก 🏠
              </button>
          </div>
        </div>
      </MainLayout>
    );
  }

  if (!questions[current]) {
     if (questions.length === 0) {
         return <MainLayout><div className="loading">ไม่พบข้อมูลข้อสอบ</div></MainLayout>;
     }
    return <MainLayout><div className="loading">กำลังประมวลผลคะแนน...</div></MainLayout>;
  }

  return (
    <MainLayout>
      <div className="test-hero" style={{backgroundImage: `url(${require('../../assets/bg-pattern.png')})`}}>
        <div className="hero-center">
            <h1 className="test-title">INSERTION SORT</h1>
            <h3 className="test-sub">แบบทดสอบหลังเรียน</h3>
        </div>
      </div>

      <div className="test-box-container">
          <div className="test-box">
            <div className="test-header">
                <span className="test-number">ข้อที่ {questions[current].no}</span>
            </div>

            <div className="test-question">{questions[current].question}</div>

            {/* 🟢 จุดที่ 2: เพิ่มการแสดงรูปภาพประกอบโจทย์ */}
            {questions[current].image && quizImages[questions[current].image] && (
              <div className="test-image-box" style={{ textAlign: 'center', marginBottom: '15px' }}>
                <img 
                  src={quizImages[questions[current].image]} 
                  alt="โจทย์ประกอบ" 
                  style={{ maxWidth: '100%', borderRadius: '8px', border: '1px solid #ddd' }} 
                />
              </div>
            )}

            <div className="choice-grid">
              {questions[current].choices.map((choice, idx) => (
                <button
                  key={idx}
                  className="choice-btn"
                  onClick={() => handleAnswer(idx)}
                >
                  {choice}
                </button>
              ))}
            </div>
          </div>
      </div>
    </MainLayout>
  );
}