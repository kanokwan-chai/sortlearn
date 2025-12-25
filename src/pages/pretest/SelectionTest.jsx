import React, { useEffect, useState } from "react";
import MainLayout from "../../layouts/MainLayout";
import "../../styles/test.css"; 
import { useNavigate } from "react-router-dom";
import { quizImages } from "../../utils/imageMap"; // 🟢 เพิ่มบรรทัดนี้

const FALLBACK_USER = { firstname: "Kanokwan", lastname: "TestSystem" };

export default function SelectionTest() {
  const navigate = useNavigate();
  const [questions, setQuestions] = useState([]);
  const [current, setCurrent] = useState(0);
  const [score, setScore] = useState(0);
  const [loading, setLoading] = useState(true);
  const [showResult, setShowResult] = useState(false);
  const [isAlreadyDone, setIsAlreadyDone] = useState(false);

  const QUESTION_API = "https://script.google.com/macros/s/AKfycbwyxhS44YfJ743L1MIb57lN0CSpq5EUOZWMuUKSw7npDemfARhfeseneXrrVVxpLifC2w/exec";
  const SCORE_API    = "https://script.google.com/macros/s/AKfycbxaSnMhAZYVgAwDS7VOgJuINzO2Wn3r8EBMPMFt84nbjy4tn-O5i6OUQIHj19L9jFNJ/exec";

  useEffect(() => {
    let user = {};
    const keys = ["user", "currentUser"];
    for (const key of keys) {
      const data = localStorage.getItem(key);
      if (data) { try { user = JSON.parse(data); break; } catch(e){} }
    }
    const firstname = user.firstname || FALLBACK_USER.firstname;
    const progressKey = `progress_${firstname}_selection`;
    const history = JSON.parse(localStorage.getItem(progressKey)) || {};

    if (history.pretest !== undefined && history.pretest !== null) {
      setScore(history.pretest);
      setIsAlreadyDone(true);
      setShowResult(true);
      setLoading(false);
      return;
    }

    fetch(`${QUESTION_API}?type=pretest_selection`) 
      .then((res) => res.json())
      .then((data) => {
        setQuestions(data);
        setLoading(false);
      })
      .catch((err) => { setLoading(false); });
  }, []);

  useEffect(() => {
    if (!isAlreadyDone && !loading && questions.length > 0 && current >= questions.length) {
      submitScore();
      setShowResult(true);
    }
  }, [current, loading, questions, isAlreadyDone]);

  const submitScore = async () => {
    let user = {}; try { user = JSON.parse(localStorage.getItem("user")) || {}; } catch(e){}
    const firstname = user.firstname || FALLBACK_USER.firstname;
    const payload = { activity: "PRETEST", firstname: firstname, lastname: user.lastname, testName: "Selection Sort", score: score };
    try { fetch(SCORE_API, { method: "POST", redirect: "follow", headers: { "Content-Type": "text/plain;charset=utf-8" }, body: JSON.stringify(payload) }); } catch (error) {}
    const progressKey = `progress_${firstname}_selection`;
    const currentData = JSON.parse(localStorage.getItem(progressKey)) || {};
    localStorage.setItem(progressKey, JSON.stringify({ ...currentData, pretest: score }));
  };

  const handleAnswer = (choiceIndex) => {
    if (!questions[current]) return;
    const correct = parseInt(questions[current].answer);
    if (choiceIndex === correct) setScore((prev) => prev + 1);
    setCurrent((prev) => prev + 1);
  };

  if (loading) return <MainLayout><div className="loading">กำลังโหลดข้อสอบ...</div></MainLayout>;

  if (showResult) {
    return (
      <MainLayout>
        <div className="test-hero" style={{backgroundImage: `url(${require('../../assets/bg-pattern.png')})`}}>
          <div className="hero-center">
            <h1 className="test-title">SELECTION SORT</h1>
            <h3 className="test-sub">ผลการทดสอบก่อนเรียน</h3>
          </div>
        </div>
        <div className="test-box-container" style={{display:'flex', justifyContent:'center'}}>
          <div className="result-card-fancy fade-in">
              {isAlreadyDone && <div style={{color:'#e53e3e', fontWeight:'bold', marginBottom:'10px'}}>⚠️ คุณทำแบบทดสอบนี้ไปแล้ว</div>}
              <span className="result-icon">🎉</span>
              <div className="result-score-circle">
                <span className="score-big" style={{ color: '#333333' }}>{score}</span>
                <span className="score-divider" style={{ color: '#666666' }}>/</span>
                <span className="score-total" style={{ color: '#666666' }}>{questions.length || 10}</span>
              </div>
              <button className="result-btn-next" onClick={() => navigate("/home")}>กลับหน้าหลัก 🏠</button>
          </div>
        </div>
      </MainLayout>
    );
  }

  if (!questions[current]) return <MainLayout><div className="loading">กำลังประมวลผล...</div></MainLayout>;

  return (
    <MainLayout>
      <div className="test-hero" style={{backgroundImage: `url(${require('../../assets/bg-pattern.png')})`}}>
        <div className="hero-center">
            <h1 className="test-title">SELECTION SORT</h1>
            <h3 className="test-sub">แบบทดสอบก่อนเรียน</h3>
        </div>
      </div>
      <div className="test-box-container" style={{display:'flex', justifyContent:'center'}}>
          <div className="test-box">
            <div className="test-number">{questions[current].no}</div>
            <div className="test-question">{questions[current].question}</div>
            
            {/* 🟢 ส่วนแสดงรูปภาพดึงจากไฟล์ในเครื่อง */}
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
                <button key={idx} className="choice-btn" onClick={() => handleAnswer(idx)}>{choice}</button>
              ))}
            </div>
          </div>
      </div>
    </MainLayout>
  );
}