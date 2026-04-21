import React, { useState, useRef, useEffect } from "react";
import YouTube from "react-youtube";
import MainLayout from "../../layouts/MainLayout";
import "../../styles/video-quiz.css";
import bg2 from "../../assets/bg-pattern.png";
import { useNavigate } from "react-router-dom";



const FALLBACK_USER = {
  firstname: "Kanokwan",
  lastname: "TestSystem",
  email: "kanokwan@test.com",
};

export default function SelectionSortVideo() {

  const navigate = useNavigate();
  const playerRef = useRef(null);
  const maxWatchedRef = useRef(0);

  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [showQuiz, setShowQuiz] = useState(false);
  const [selected, setSelected] = useState(null);
  const [score, setScore] = useState(0);
  const [isFinished, setIsFinished] = useState(false);
  const [answeredIds, setAnsweredIds] = useState([]);
  const [showModal, setShowModal] = useState(false);

  const GET_QUIZ_URL =
    "https://script.google.com/macros/s/AKfycbwyxhS44YfJ743L1MIb57lN0CSpq5EUOZWMuUKSw7npDemfARhfeseneXrrVVxpLifC2w/exec";

  const SAVE_SCORE_URL =
    "https://script.google.com/macros/s/AKfycbxaSnMhAZYVgAwDS7VOgJuINzO2Wn3r8EBMPMFt84nbjy4tn-O5i6OUQIHj19L9jFNJ/exec";

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

  // -------- LOAD QUESTIONS ----------
  useEffect(() => {
    let user = {};
    try {
      user = JSON.parse(localStorage.getItem("user")) || {};
    } catch {}

    const userKey = getUserKey();
const progressKey = `progress_${userKey}_selection`;

    const history = JSON.parse(localStorage.getItem(progressKey)) || {};

    fetch(`${GET_QUIZ_URL}?type=video_selection`)
      .then((res) => res.json())
      .then((data) => {
        setQuestions(data.sort((a, b) => a.time - b.time));
        setLoading(false);
      });
  }, []);

  // -------- BLOCK SEEK + TRIGGER QUESTIONS ----------
  useEffect(() => {
    if (!playerRef.current) return;

    const interval = setInterval(() => {
      if (loading || showQuiz) return;


      const t = playerRef.current.getCurrentTime();

      // ❌ กันข้าม
      if (t > maxWatchedRef.current + 1) {
        playerRef.current.seekTo(maxWatchedRef.current, true);
        playerRef.current.pauseVideo();
        setShowModal(true);
        return;
      }

      if (t > maxWatchedRef.current) maxWatchedRef.current = t;

      // ยิงคำถาม
      const q = questions[currentQIndex];
      if (q && Math.floor(t) >= Number(q.time) && !answeredIds.includes(q.id)) {
        playerRef.current.pauseVideo();
        setShowQuiz(true);
      }
    }, 400);

    return () => clearInterval(interval);
  });

  const onReady = (e) => {
    playerRef.current = e.target;
  };

  // -------- SUBMIT ANSWER ----------
  const handleSubmit = () => {
    if (selected === null) return;

    const q = questions[currentQIndex];
    let nextScore = score;

    if (parseInt(selected) === parseInt(q.answer)) nextScore++;

    setScore(nextScore);
    setAnsweredIds([...answeredIds, q.id]);

    if (currentQIndex + 1 < questions.length) {
      setCurrentQIndex(currentQIndex + 1);
      setSelected(null);
      setShowQuiz(false);
      playerRef.current.playVideo();
    } else {
      setIsFinished(true);
      saveScore(nextScore);
    }
  };

  // -------- SAVE SCORE ----------
const saveScore = (finalScore) => {
    let user = {};
    try {
      user = JSON.parse(localStorage.getItem("user")) || {};
    } catch {}

    // 1. ส่งคะแนนเข้า Google Sheet (มันจะเพิ่มแถวใหม่ต่อท้ายไปเรื่อยๆ เอง)
    fetch(SAVE_SCORE_URL, {
      method: "POST",
      headers: { "Content-Type": "text/plain;charset=utf-8" },
      body: JSON.stringify({
        activity: "VIDEO_QA",
        firstname: user.firstname || FALLBACK_USER.firstname,
        lastname: user.lastname || "",
        email: user.email || "guest",
        videoName: "Selection Sort",
        score: finalScore,
      }),
    });

    // 2. บันทึกความคืบหน้าเพื่อให้ Dashboard (หน้าหลัก) ขึ้นว่า "ผ่าน"
    const userKey = getUserKey();
    const key = `progress_${userKey}_selection`;
    const currentProgress = JSON.parse(localStorage.getItem(key)) || {};
    
    // บันทึกว่า video: true เพื่อปลดล็อคบทเรียนอื่น แต่ไม่ทำให้หน้านี้ล็อค
    localStorage.setItem(key, JSON.stringify({ ...currentProgress, video: true }));
  };

  // ================================================
  // MAIN UI
  // ================================================
  return (
    <MainLayout>
      <div className="lesson-detail-hero" style={{ backgroundImage: `url(${bg2})` }}>
        <div className="hero-center">
          <p className="hero-sub">บทเรียน</p>
          <h1 className="hero-title">Selection Sort</h1>
        </div>
      </div>

      <div className="video-quiz-container">
        <div className="pink-activity-wrapper">

          <div className="video-wrapper">
            <YouTube
              videoId="jUm4L5xZRcY"
              onReady={onReady}
              opts={{
                playerVars: { controls: 1, rel: 0, modestbranding: 1 },
              }}
            />
          </div>

          {/* QUIZ CARD */}
          {(!loading && showQuiz) && (
            <div className="quiz-card-blue fade-in">
              {!isFinished ? (
                <>
                  <div className="quiz-header-row">
                    <h3>คำถามข้อที่ {currentQIndex + 1}</h3>
                    <div className="score-badge">⭐ {score}</div>
                  </div>

                  <div className="question-box">
                    <p>{questions[currentQIndex]?.question}</p>
                  </div>

                  <div className="options-grid">
                    {questions[currentQIndex]?.options.map((o, i) => (
                      <div
                        key={i}
                        className={`option-pill ${selected === i ? "active" : ""}`}
                        onClick={() => setSelected(i)}
                      >
                        {o}
                      </div>
                    ))}
                  </div>

                  <button
                    className="submit-btn-pink"
                    disabled={selected === null}
                    onClick={handleSubmit}
                  >
                    ส่งคำตอบ
                  </button>
                </>
              ) : (
                <div className="quiz-result">
                  <h2>🎉 ยินดีด้วย</h2>
                  <p>คุณทำได้ {score}/{questions.length} คะแนน</p>
                  <p style={{ fontSize: '0.9rem', color: '#666', marginBottom: '20px' }}>
                    บันทึกคะแนนรอบนี้เรียบร้อยแล้ว!
                  </p>
                  
                  <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
                    {/* ปุ่มเริ่มใหม่โดยการรีโหลดหน้า */}
                    <button className="restart-btn" onClick={() => window.location.reload()}>
                      เรียนซ้ำอีกครั้ง 🔄
                    </button>
                    
                    <button className="restart-btn" style={{ background: '#333' }} onClick={() => navigate("/home")}>
                      กลับหน้าหลัก 🏠
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* MODAL ห้ามข้าม */}
      {showModal && (
        <div className="custom-modal-overlay">
          <div className="custom-modal-box">
            <span className="custom-modal-icon">🚫</span>
            <h2 className="custom-modal-title">ไม่สามารถข้ามได้</h2>
            <p className="custom-modal-text">
              เพื่อความเข้าใจที่ครบถ้วน ระบบไม่อนุญาตให้กรอข้ามวิดีโอ
              กรุณาดูต่อ 😊
            </p>
            <button className="custom-modal-btn" onClick={() => setShowModal(false)}>
              เข้าใจแล้ว
            </button>
          </div>
        </div>
      )}
    </MainLayout>
  );
}
