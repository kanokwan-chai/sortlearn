import React, { useEffect, useState } from "react";
import MainLayout from "../../layouts/MainLayout";
import "../../styles/test.css"; 
import { useNavigate } from "react-router-dom";

const FALLBACK_USER = { firstname: "Kanokwan", lastname: "TestSystem" };

// ✅ กำหนด Lesson Key ให้ตรงกับที่ใช้ใน LessonProgress (ต้องเป็น 'insertion')
const LESSON_KEY = "insertion"; 

export default function InsertionPosttest() {
  const navigate = useNavigate();

  const [questions, setQuestions] = useState([]);
  const [current, setCurrent] = useState(0);
  const [score, setScore] = useState(0);
  const [loading, setLoading] = useState(true);
  const [showResult, setShowResult] = useState(false);
  
  // ✅ เพิ่ม State เช็คว่าทำไปแล้วหรือยัง
  const [isAlreadyDone, setIsAlreadyDone] = useState(false);

  const QUESTION_API = "https://script.google.com/macros/s/AKfycbwyxhS44YfJ743L1MIb57lN0CSpq5EUOZWMuUKSw7npDemfARhfeseneXrrVVxpLifC2w/exec";
  const SCORE_API    = "https://script.google.com/macros/s/AKfycbxaSnMhAZYVgAwDS7VOgJuINzO2Wn3r8EBMPMFt84nbjy4tn-O5i6OUQIHj19L9jFNJ/exec";

  // 1. โหลดคำถาม + เช็คประวัติ (Lock System)
  useEffect(() => {
    // ดึงชื่อ user
    let user = {};
    const keys = ["currentUser", "user", "userData", "auth", "login"];
    for (const key of keys) {
      const data = localStorage.getItem(key);
      if (data) { try { user = JSON.parse(data); break; } catch(e){} }
    }
    const firstname = user.firstname || FALLBACK_USER.firstname;

    // ✅ สร้าง Key ให้ตรงกับ LessonProgress เป๊ะๆ
    const progressKey = `progress_${firstname}_${LESSON_KEY}`;
    const history = JSON.parse(localStorage.getItem(progressKey)) || {};

    // ✅ เช็ค: ถ้ามีค่า posttest อยู่แล้ว (ไม่เป็น null) แสดงว่าทำแล้ว -> ล็อกทันที
    if (history.posttest !== undefined && history.posttest !== null) {
      setScore(history.posttest);
      setIsAlreadyDone(true);
      setShowResult(true);
      setLoading(false);
      return; // จบการทำงาน ไม่ต้องโหลดโจทย์
    }

    // ถ้ายังไม่ทำ ให้โหลดโจทย์ (ใช้ type ให้ตรงกับ Google Sheet ของคุณ)
    fetch(`${QUESTION_API}?type=pretest_insertion`) 
      .then((res) => res.json())
      .then((data) => {
        setQuestions(data || []);
        setLoading(false);
      })
      .catch((err) => { setLoading(false); });
  }, []);

  // 2. จบการทดสอบ
  useEffect(() => {
    // เพิ่มเงื่อนไข !isAlreadyDone เพื่อกันไม่ให้ Save ซ้ำตอนโหลดประวัติ
    if (!isAlreadyDone && !loading && questions.length > 0 && current >= questions.length) {
      submitScore();
      setShowResult(true);
    }
  }, [current, loading, questions, isAlreadyDone]);

  // 3. บันทึกคะแนน
  const submitScore = async () => {
    let user = {};
    try { user = JSON.parse(localStorage.getItem("user")) || {}; } catch(e){}
    const firstname = user.firstname || user.firstName || FALLBACK_USER.firstname;
    
    // ส่งเข้า Google Sheet
    const payload = {
      activity: "POSTTEST",
      firstname: firstname,
      lastname: user.lastname || user.lastName || FALLBACK_USER.lastname,
      testName: "Insertion Sort Posttest",
      score: score,
    };
    try {
      await fetch(SCORE_API, {
        method: "POST",
        redirect: "follow",
        headers: { "Content-Type": "text/plain;charset=utf-8" },
        body: JSON.stringify(payload),
      });
    } catch (error) { console.error("บันทึกพลาด", error); }

    // ✅✅✅ บันทึกลง LocalStorage ให้ LessonProgress เห็น ✅✅✅
    const progressKey = `progress_${firstname}_${LESSON_KEY}`;
    const currentData = JSON.parse(localStorage.getItem(progressKey)) || {};
    
    // อัปเดต key 'posttest'
    localStorage.setItem(progressKey, JSON.stringify({
      ...currentData,   
      posttest: score   
    }));
  };

  const handleAnswer = (choiceIndex) => {
    const currentQ = questions[current];
    if (!currentQ) return; 
    const correct = parseInt(currentQ.answer);
    if (choiceIndex === correct) setScore((prev) => prev + 1);
    setCurrent((prev) => prev + 1);
  };

  if (loading) return <MainLayout><div className="loading">กำลังตรวจสอบสิทธิ์...</div></MainLayout>;

  // ✅ หน้าผลลัพธ์ (Result)
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
              
              {/* ✅ แจ้งเตือนถ้าเคยทำแล้ว */}
              {isAlreadyDone && (
                <div style={{color:'#e53e3e', fontWeight:'bold', marginBottom:'10px'}}>
                  ⚠️ คุณทำแบบทดสอบนี้ไปแล้ว
                </div>
              )}

              <span className="result-icon">🎉</span>
              
              <div className="result-score-circle">
                {/* ✅ ฝังสี #333 ให้อ่านออกแน่นอน */}
                <span className="score-big" style={{ color: '#333333' }}>{score}</span>
                
                {/* ✅ โชว์ / 10 เสมอ */}
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

  // ป้องกัน Error ก่อน render
  if (!questions[current]) {
     // ถ้าไม่มีโจทย์เลย (อาจจะดึง API ไม่ได้) ให้แสดง Error
     if (questions.length === 0) {
         return (
             <MainLayout>
                 <div className="loading">ไม่พบข้อมูลข้อสอบ</div>
             </MainLayout>
         );
     }
    return <MainLayout><div className="loading">กำลังประมวลผลคะแนน...</div></MainLayout>;
  }

  // ✅ หน้าทำข้อสอบ
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