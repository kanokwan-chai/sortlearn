import React, { useState, useRef, useEffect } from "react";
import MainLayout from "../../layouts/MainLayout";
import "../../styles/video-quiz.css";
import bg2 from "../../assets/bg-pattern.png";
import { useNavigate } from "react-router-dom";
import YouTube from "react-youtube";

const FALLBACK_USER = {
  firstname: "Kanokwan",
  lastname: "TestSystem",
  email: "kanokwan@test.com"
};

export default function InsertionSortVideo() {

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
  const [showWarning, setShowWarning] = useState(false);
  const [isAlreadyDone, setIsAlreadyDone] = useState(false);

  const GET_QUIZ_URL =
    "https://script.google.com/macros/s/AKfycbwyxhS44YfJ743L1MIb57lN0CSpq5EUOZWMuUKSw7npDemfARhfeseneXrrVVxpLifC2w/exec";

  const SAVE_SCORE_URL =
    "https://script.google.com/macros/s/AKfycbxaSnMhAZYVgAwDS7VOgJuINzO2Wn3r8EBMPMFt84nbjy4tn-O5i6OUQIHj19L9jFNJ/exec";

  // ---------------- LOAD QUIZ + CHECK PROGRESS ----------------
  useEffect(() => {
    let user = {};
    try { user = JSON.parse(localStorage.getItem("user")) || {}; } catch {}

    const firstname = user.firstname || FALLBACK_USER.firstname;

    const progressKey = `progress_${firstname}_insertion`;
    const history = JSON.parse(localStorage.getItem(progressKey)) || {};

    if (history.video === true) {
      setIsAlreadyDone(true);
      setLoading(false);
      return;
    }

    fetch(`${GET_QUIZ_URL}?type=video_insertion`)
      .then(res => res.json())
      .then(data => {
        const sorted = data.sort((a,b)=>a.time-b.time);
        setQuestions(sorted);
        setLoading(false);
      })
      .catch(()=>setLoading(false));
  }, []);

  // ---------------- TIME CHECK (ห้ามข้าม + ยิงคำถาม) ----------------
  useEffect(() => {
    if (!playerRef.current) return;

    const check = setInterval(() => {
      if (loading || showQuiz) return;


      const t = playerRef.current.getCurrentTime();

      // ❌ กันข้าม
      if (t > maxWatchedRef.current + 1) {
        playerRef.current.seekTo(maxWatchedRef.current, true);
        playerRef.current.pauseVideo();
        setShowWarning(true);
        return;
      }

      if (t > maxWatchedRef.current)
        maxWatchedRef.current = t;

      const q = questions[currentQIndex];
      if (q && Math.floor(t) >= Number(q.time) && !answeredIds.includes(q.id)) {
        playerRef.current.pauseVideo();
        setShowQuiz(true);
      }

    }, 400);

    return () => clearInterval(check);
  });

  const closeWarning = () => {
    setShowWarning(false);
    if (!showQuiz) playerRef.current.playVideo();
  };

  const onReady = (e) => {
    playerRef.current = e.target;
  };

  // ---------------- SAVE SCORE ----------------
  const saveScore = (s) => {
    let user = {};
    try { user = JSON.parse(localStorage.getItem("user")) || {}; } catch {}

    fetch(SAVE_SCORE_URL, {
      method: "POST",
      headers: { "Content-Type": "text/plain;charset=utf-8" },
      body: JSON.stringify({
        activity: "VIDEO_QA",
        firstname: user.firstname || FALLBACK_USER.firstname,
        lastname: user.lastname,
        email: user.email,
        videoName: "Insertion Sort",
        score: s
      })
    });

    const key = `progress_${(user.firstname || FALLBACK_USER.firstname)}_insertion`;
    localStorage.setItem(key, JSON.stringify({ video: true }));
  };

  // ---------------- QUIZ ----------------
  const handleSubmit = () => {
    if (selected === null) return;

    const q = questions[currentQIndex];
    let next = score;

    if (parseInt(selected) === parseInt(q.answer))
      next++;

    setScore(next);
    setAnsweredIds([...answeredIds, q.id]);

    if (currentQIndex + 1 < questions.length) {
      setCurrentQIndex(currentQIndex + 1);
      setSelected(null);
      setShowQuiz(false);
      playerRef.current.playVideo();
    } else {
      setIsFinished(true);
      setShowQuiz(true);
      saveScore(next);
    }
  };

  // ---------------- ALREADY DONE UI ----------------
  if (isAlreadyDone) return (
    <MainLayout>
      <div className="lesson-detail-hero" style={{ backgroundImage: `url(${bg2})` }}>
        <div className="hero-center">
          <h1 className="hero-title">Insertion Sort</h1>
        </div>
      </div>

      <div className="video-quiz-container">
        <div className="done-box">
          <div className="done-icon">🎉</div>
          <h2 className="done-title">คุณเคยดูและตอบคำถามครบแล้ว</h2>
          <p className="done-text">
            ระบบบันทึกเรียบร้อยแล้ว สามารถไปบทเรียนถัดไปได้เลย
          </p>

          <button className="done-btn" onClick={() => navigate("/home")}>
            กลับหน้าหลัก 🏠
          </button>
        </div>
      </div>
    </MainLayout>
  );

  // ---------------- MAIN UI ----------------
  return (
    <MainLayout>

      <div className="lesson-detail-hero" style={{ backgroundImage: `url(${bg2})` }}>
        <div className="hero-center">
          <p className="hero-sub">บทเรียน</p>
          <h1 className="hero-title">Insertion Sort</h1>
        </div>
      </div>

      <div className="video-quiz-container">
        <div className="section-title">
          <h3>วิดีโอการเรียนรู้</h3>
        </div>

        <div className="pink-activity-wrapper">

          <div className="video-wrapper">
            <YouTube
              videoId="DRVNXO7_DKY"
              onReady={onReady}
              opts={{
                playerVars: {
                  controls: 1,
                  rel: 0,
                  modestbranding: 1
                }
              }}
            />
          </div>

          {showWarning && (
            <div className="custom-modal-overlay">
              <div className="custom-modal-box">
                <span className="custom-modal-icon">🚫</span>
                <h3 className="custom-modal-title">ห้ามข้ามวิดีโอ!</h3>
                <p className="custom-modal-text">
                  กรุณาดูเนื้อหาตามลำดับ
                  <br/>และตอบคำถามให้ครบถ้วน
                </p>
                <button className="custom-modal-btn" onClick={closeWarning}>
                  ตกลง
                </button>
              </div>
            </div>
          )}

          {(!loading && showQuiz) && (
            <div className="quiz-card-blue fade-in">

              {!isFinished ? (
                <>
                  <div className="quiz-header-row">
                    <h3>คำถามข้อที่ {currentQIndex+1}</h3>
                    <div className="score-badge">⭐ {score}</div>
                  </div>

                  <div className="question-box">
                    <p>{questions[currentQIndex]?.question}</p>
                  </div>

                  <div className="options-grid">
                    {questions[currentQIndex]?.options.map((o,i)=>(
                      <div
                        key={i}
                        className={`option-pill ${selected===i?"active":""}`}
                        onClick={()=>setSelected(i)}
                      >
                        {o}
                      </div>
                    ))}
                  </div>

                  <button
                    className="submit-btn-pink"
                    disabled={selected===null}
                    onClick={handleSubmit}
                  >
                    ส่งคำตอบ
                  </button>
                </>
              ):(
                <div className="quiz-result">
                  <h2>🎉 ยินดีด้วย!</h2>
                  <p>คุณทำได้ {score}/{questions.length} คะแนน</p>

                  <button className="restart-btn" onClick={()=>navigate("/home")}>
                    กลับหน้าหลัก
                  </button>
                </div>
              )}

            </div>
          )}
        </div>
      </div>
    </MainLayout>
  );
}
