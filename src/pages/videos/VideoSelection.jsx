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
  const [isAlreadyDone, setIsAlreadyDone] = useState(false);

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

    if (history.video === true) {
      setIsAlreadyDone(true);
      setLoading(false);
      return;
    }

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

    fetch(SAVE_SCORE_URL, {
      method: "POST",
      headers: { "Content-Type": "text/plain;charset=utf-8" },
      body: JSON.stringify({
        activity: "VIDEO_QA",
        firstname: user.firstname || FALLBACK_USER.firstname,
        lastname: user.lastname,
        email: user.email,
        videoName: "Selection Sort",
        score: finalScore,
      }),
    });

        const userKey = getUserKey();
const key = `progress_${userKey}_selection`;
localStorage.setItem(key, JSON.stringify({ video: true }));

  };

  // ================================================
  // UI เริ่มต้น ถ้าเคยดูแล้ว
  // ================================================
if (isAlreadyDone) return (
  <MainLayout>
          <div className="lesson-detail-hero" style={{ backgroundImage: `url(${bg2})` }}>
            <div className="hero-center">
                <p className="hero-sub">บทเรียน</p>
                <h1 className="hero-title">Selection Sort</h1>
            </div>
          </div>

    <div className="video-quiz-container">
      <div className="done-box">
        
        <div className="done-icon">🎉</div>

        <h2 className="done-title">
          คุณเคยดูวิดีโอและตอบคำถามครบแล้ว
        </h2>

        <p className="done-text">
          ระบบบันทึกความสำเร็จไว้เรียบร้อย สามารถกลับไปหน้าหลักหรือเลือกบทเรียนต่อไปได้เลย
        </p>

        <button className="done-btn" onClick={() => navigate("/home")}>
          กลับหน้าหลัก 🏠
        </button>

      </div>
    </div>
  </MainLayout>
);


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
              videoId="rXuv1BpCuzU"
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
                  <button className="restart-btn" onClick={() => navigate("/home")}>
                    กลับหน้าหลัก
                  </button>
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
