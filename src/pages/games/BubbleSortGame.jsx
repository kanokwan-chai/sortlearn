import React, { useState, useEffect, useRef, useCallback } from "react";
import MainLayout from "../../layouts/MainLayout";
import { useNavigate } from "react-router-dom";
import "../../styles/bubble-game.css";


// Assets Mapping
import bgUnderwater from "../../assets/bg-underwater.png";
import charJellyfish from "../../assets/b1.png"; 
import charDolphin from "../../assets/b3.png";   
import charStarfish from "../../assets/b2.png";  
import sfxClick from "../../assets/sounds/click.mp3";
import sfxCorrect from "../../assets/sounds/correct.mp3";
import sfxWrong from "../../assets/sounds/wrong.mp3";
import sfxBubble from "../../assets/sounds/bubble.mp3";
import sfxWin from "../../assets/sounds/win.mp3";

// ✅ CONFIG
const LESSON_KEY = "bubble"; 
const SCORE_API = "https://script.google.com/macros/s/AKfycbxaSnMhAZYVgAwDS7VOgJuINzO2Wn3r8EBMPMFt84nbjy4tn-O5i6OUQIHj19L9jFNJ/exec";

const LEVELS = [
  { id: 1, name: "โซนปะการัง", count: 4, baseTime: 50, maxVal: 50, order: "ASC", desc: "น้อย ⮕ มาก" },
  { id: 2, name: "ร่องลึกสมุทร", count: 5, baseTime: 45, maxVal: 75, order: "DESC", desc: "มาก ⮕ น้อย" },
  { id: 3, name: "เมืองบาดาล", count: 6, baseTime: 40, maxVal: 99, order: "ASC", desc: "น้อย ⮕ มาก" }
];

const CHARACTERS = [
  { id: "jellyfish", name: "Jellyfish", skill: "Vitality ❤️", desc: "เริ่มเกมด้วย HP 5", hp: 5, bonusTime: 0, shield: 0, img: charJellyfish, color: "#e1bee7", icon: "❤️" },
  { id: "dolphin", name: "Dolphin", skill: "Swift ⏰", desc: "เพิ่มเวลา +30 วินาที", hp: 3, bonusTime: 30, shield: 0, img: charDolphin, color: "#81d4fa", icon: "⏰" },
  { id: "starfish", name: "Starfish", skill: "Aegis 🛡️", desc: "มีโล่กันพลาด 2 ครั้ง", hp: 3, bonusTime: 0, shield: 2, img: charStarfish, color: "#ff8a80", icon: "🛡️" }
];

export default function BubbleSortGame() {
  const navigate = useNavigate();

  const getUserKey = () => {
  let user = {};
  try { user = JSON.parse(localStorage.getItem("user")) || {}; } catch {}

  if (user.email) return user.email;

  let guestId = localStorage.getItem("guest_id");
  if (!guestId) {
    guestId = crypto.randomUUID();
    localStorage.setItem("guest_id", guestId);
  }
  return `guest_${guestId}`;
};

  // --- STATE ---
  const [gameState, setGameState] = useState("LOADING");
  const [selectedChar, setSelectedChar] = useState(null);
  const [levelIdx, setLevelIdx] = useState(0);
  const [unlockedLevel, setUnlockedLevel] = useState(1);
  const [bubbles, setBubbles] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [passCompleted, setPassCompleted] = useState(0);
  const [score, setScore] = useState(0);
  const [hp, setHp] = useState(3);
  const [timeLeft, setTimeLeft] = useState(0);
  const [shield, setShield] = useState(0);
  const [feedback, setFeedback] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  const timerRef = useRef(null);
  const scoreRef = useRef(0);

  /* ================= SAVE PROGRESS ================= */
  const saveProgress = useCallback((data) => {
    const userKey = getUserKey();
    const key = `progress_${userKey}_${LESSON_KEY}`;
    const old = JSON.parse(localStorage.getItem(key)) || {};
    localStorage.setItem(key, JSON.stringify({ ...old, ...data }));
  }, []);

  const playSound = (type) => {
    const src = { click: sfxClick, correct: sfxCorrect, wrong: sfxWrong, bubble: sfxBubble, win: sfxWin }[type];
    if (src) {
      const audio = new Audio(src);
      audio.currentTime = 0;
      audio.play().catch(() => {});
    }
  };

  useEffect(() => {
    const userKey = getUserKey();
    const key = `progress_${userKey}_${LESSON_KEY}`;
    const saved = JSON.parse(localStorage.getItem(key));

    if (saved) {
      if (saved.charId)
        setSelectedChar(CHARACTERS.find(c => c.id === saved.charId));
      if (saved.score) {
        setScore(saved.score);
        scoreRef.current = saved.score;
      }
      if (saved.level) setUnlockedLevel(saved.level);
      if (saved.game === true) setGameState("ALREADY_DONE");
      else if (saved.charId) setGameState("MAP");
      else setGameState("SELECT_CHAR");
    } else {
      setGameState("SELECT_CHAR");
    }
  }, []);

  useEffect(() => {
    if (gameState === "PLAYING" && timeLeft > 0) {
      timerRef.current = setInterval(() => setTimeLeft(t => t - 1), 1000);
    } else if (timeLeft === 0 && gameState === "PLAYING") {
      handleGameOver("หมดเวลา! ออกซิเจนหมดแล้ว 🫧");
    }
    return () => clearInterval(timerRef.current);
  }, [gameState, timeLeft]);

  const handleSelectChar = (char) => {
    playSound("click");
    setSelectedChar(char);
    saveProgress({ charId: char.id });
    setGameState("MAP");
  };

  const initLevel = (idx) => {
    if (idx + 1 > unlockedLevel) return;
    playSound("click");
    setLevelIdx(idx);
    const lvl = LEVELS[idx];
    const nums = new Set();
    while (nums.size < lvl.count) nums.add(Math.floor(Math.random() * 98) + 1);
    setBubbles(Array.from(nums));
    setHp(selectedChar.hp);
    setShield(selectedChar.shield);
    setTimeLeft(lvl.baseTime + selectedChar.bonusTime);
    setCurrentIndex(0);
    setPassCompleted(0);
    setFeedback("");
    setGameState("RULES");
  };

  const handleDecision = (userWantsSwap) => {
    if (isProcessing) return;
    const i = currentIndex;
    const isAsc = LEVELS[levelIdx].order === "ASC";
    const mustSwap = isAsc ? (bubbles[i] > bubbles[i + 1]) : (bubbles[i] < bubbles[i + 1]);

    if (userWantsSwap === mustSwap) {
      setIsProcessing(true);
      playSound(userWantsSwap ? "bubble" : "correct");
      setScore(s => s + 25);
      scoreRef.current += 25;
      let newB = [...bubbles];
      if (userWantsSwap) [newB[i], newB[i + 1]] = [newB[i + 1], newB[i]];
      setBubbles(newB);
      setTimeout(() => {
        const nextI = currentIndex + 1;
        const limit = bubbles.length - 1 - passCompleted;
        if (nextI < limit) { setCurrentIndex(nextI); }
        else {
          if (passCompleted + 1 >= bubbles.length - 1) { handleWin(); }
          else { setPassCompleted(p => p + 1); setCurrentIndex(0); setFeedback("หนึ่งรอบสำเร็จ! 🫧"); }
        }
        setIsProcessing(false);
      }, 500);
    } else {
      if (shield > 0) { setShield(s => s - 1); setFeedback("🛡️ โล่ป้องกันช่วยไว้!"); }
      else {
        playSound("wrong");
        setHp(prev => { if (prev <= 1) setGameState("GAMEOVER"); return prev - 1; });
      }
    }
  };

  const handleWin = () => {
    playSound("win");
    const finalScore = scoreRef.current + (hp * 100) + (timeLeft * 10);
    const isLastLevel = levelIdx === LEVELS.length - 1;
    const nextLvlNum = levelIdx + 2;
    const updateData = { score: finalScore };

    if (isLastLevel) {
      updateData.game = true;
      updateData.level = LEVELS.length + 1;
       updateData.bubble = true;
      setGameState("WIN");
      submitScoreToSheet(finalScore);
    } else {
      updateData.level = Math.max(unlockedLevel, nextLvlNum);
      setGameState("MAP");
    }
    setUnlockedLevel(updateData.level || unlockedLevel);
    setScore(finalScore);
    scoreRef.current = finalScore;
    saveProgress(updateData);
  };

  const handleGameOver = (msg) => {
    playSound("wrong");
    setFeedback(msg);
    setGameState("GAMEOVER");
  };

  // ✅ แก้ไข: ปิดปีกกาฟังก์ชันให้ถูกต้องและใส่ fetch logic
  const submitScoreToSheet = async (finalScore) => {
    const user = JSON.parse(localStorage.getItem("user")) || {};
    const payload = { 
        activity: "GAMES", 
        firstname: user.firstname || "Guest", 
        lastname: user.lastname || "-", 
        gameName: "Bubble Sort Ocean", 
        score: finalScore 
    };

    try { 
        await fetch(SCORE_API, { 
            method: "POST", 
            body: JSON.stringify(payload), 
            headers: { "Content-Type": "text/plain" } 
        }); 
    } catch (e) {
        console.error("Submit Error:", e);
    }
  };

  return (
    <MainLayout>
      <div className="game-container" style={{ 
        backgroundImage: `url(${bgUnderwater})`,
        backgroundSize: 'cover', backgroundPosition: 'center',
        minHeight: 'calc(100vh - 80px)', display: 'flex', flexDirection: 'column'
      }}>
        
        {/* --- 1. SELECT CHARACTER --- */}
        {gameState === "SELECT_CHAR" && (
          <div className="ui-screen fade-in" style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '20px', background: 'transparent', position: 'relative', zIndex: 10 }}>
            <h1 style={{ fontSize: '4rem', fontWeight: '900', color: '#fff', textShadow: '0 0 15px rgba(175, 230, 246, 0.7), 0 5px 15px rgba(44, 134, 161, 0.2)', marginBottom: '5px' }}>
              BUBBLE SORT OCEAN
            </h1>
            <p style={{ color: '#fff', fontSize: '1.3rem', fontWeight: 'bold', textShadow: '0 2px 10px rgba(0,0,0,0.3)', marginBottom: '30px' }}>
                เลือกผู้สำรวจที่มีความสามารถเหมาะกับคุณ
            </p>
            <div className="char-grid" style={{ display: 'flex', gap: '20px' }}>
              {CHARACTERS.map(c => (
                <div key={c.id} className="char-card" onClick={() => handleSelectChar(c)}
                    style={{ background: 'rgba(255, 255, 255, 0.3)', backdropFilter: 'blur(12px)', border: '2px solid rgba(255, 255, 255, 0.5)', padding: '25px 15px', borderRadius: '35px', width: '220px', textAlign: 'center', cursor: 'pointer', transition: '0.4s ease', boxShadow: '0 10px 25px rgba(0,0,0,0.1)' }}>
                  <div style={{ width: '110px', height: '110px', margin: '0 auto 15px', borderRadius: '50%', background: '#fff', padding: '8px', border: `5px solid ${c.color}`, boxShadow: `0 0 15px ${c.color}66` }}>
                    <img src={c.img} alt={c.name} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                  </div>
                  <h2 style={{ color: '#fff', fontSize: '1.8rem', fontWeight: 'bold', textShadow: '0 2px 5px rgba(0,0,0,0.2)', margin: '5px 0' }}>{c.name}</h2>
                  <div style={{ color: '#ffeb3b', fontSize: '1rem', fontWeight: 'bold', margin: '5px 0', textShadow: '0 2px 4px rgba(0,0,0,0.3)' }}>{c.icon} {c.skill}</div>
                  <p style={{ color: '#fff', fontSize: '0.9rem', opacity: 0.95, lineHeight: '1.3', marginBottom: '15px' }}>{c.desc}</p>
                  <button style={{ marginTop: '5px', background: 'linear-gradient(45deg, #00d2ff, #3a7bd5)', color: '#fff', border: 'none', padding: '10px 30px', borderRadius: '25px', fontWeight: 'bold', fontSize: '1rem', cursor: 'pointer' }}>CHOOSE</button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* --- 2. MAP LAYER: จัดการใหม่ให้สวยและตรงกลาง --- */}
{gameState === "MAP" && (
  <div className="ui-screen fade-in" style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '20px', background: 'transparent' }}>
    <div className="map-glass" style={{ 
      background: 'rgba(255, 255, 255, 0.15)', 
      backdropFilter: 'blur(25px)', 
      padding: '50px 30px', 
      borderRadius: '50px', 
      textAlign: 'center', 
      width: '95%', 
      maxWidth: '750px', 
      border: '2px solid rgba(255, 255, 255, 0.3)', 
      boxShadow: '0 25px 50px rgba(0,0,0,0.4)' 
    }}>
      {/* ส่วนหัว: Compass และ Anchor */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '30px' }}>
        <span style={{ fontSize: '3rem', filter: 'drop-shadow(0 0 10px rgba(255,255,255,0.5))' }}>🧭</span>
        <h1 style={{ color: '#fff', fontSize: '3.2rem', fontWeight: '900', textShadow: '0 0 20px rgba(0, 210, 255, 0.7)', margin: '0 20px' }}>เส้นทางสำรวจ</h1>
        <span style={{ fontSize: '3rem', filter: 'drop-shadow(0 0 10px rgba(0,210,255,0.5))' }}>⚓</span>
      </div>

      <div className="map-path" style={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center', 
        gap: '40px', 
        position: 'relative', 
        padding: '50px 0' 
      }}>
        
        {/* ✅ ปรับปรุงเส้นเชื่อมด่านให้เหมือนในรูป (เส้นบางลงและอยู่กึ่งกลางพอดี) */}
        <div style={{ 
          position: 'absolute', 
          top: '50%', 
          left: '26%', 
          right: '26%', 
          height: '5px', 
          background: 'rgba(255, 255, 255, 0.2)', 
          transform: 'translateY(-500%)', 
          zIndex: 1,
          borderRadius: '10px'
        }}></div>

        {LEVELS.map((l, i) => {
          const levelNum = i + 1;
          const isDone = levelNum < unlockedLevel; 
          const isCurrent = levelNum === unlockedLevel; 
          const isLocked = levelNum > unlockedLevel; 

          return (
            <React.Fragment key={l.id}>
              <div className="node-item" style={{ position: 'relative', zIndex: 5 }}>
                {/* ตัวละครลอยเหนือด่านปัจจุบัน */}
                {isCurrent && (
                  <div style={{ position: 'absolute', top: '-85px', left: '50%', transform: 'translateX(-50%)', animation: 'float 3s ease-in-out infinite' }}>
                    <img src={selectedChar?.img} style={{ width: '75px', height: '75px', objectFit: 'contain', filter: 'drop-shadow(0 0 15px #fff)' }} alt="Player" />
                  </div>
                )}
                
                <button 
                  onClick={() => initLevel(i)} 
                  disabled={!isCurrent} 
                  style={{ 
                    width: '95px', 
                    height: '95px', 
                    borderRadius: '50%', 
                    border: isCurrent ? '5px solid #ffeb3b' : '4px solid rgba(255,255,255,0.2)', 
                    fontSize: '2rem', 
                    fontWeight: '900', 
                    
                    /* 🚩 จุดตายอยู่ตรงนี้ครับ! */
                    background: isCurrent 
                      ? 'radial-gradient(circle, #fdd835, #fbc02d)' 
                      : (isDone ? '#4caf50' : '#4a6274'), // ✅ เปลี่ยนจาก 'rgba(...)' เป็นสีทึบ '#4a6274' (สีเทาอมน้ำเงิน)
                      
                    color: '#fff', 
                    cursor: isCurrent ? 'pointer' : 'not-allowed',
                    boxShadow: isCurrent ? '0 0 25px rgba(253, 216, 53, 0.6)' : 'none',
                    transition: '0.3s all',
                    zIndex: 5 // ✅ มั่นใจว่าปุ่มอยู่เหนือเส้น (เส้นเป็น 1 ปุ่มเป็น 5)
                  }}
                >
                  {isDone ? "✓" : (isLocked ? "🔒" : levelNum)}
                </button>
                <span style={{ color: '#fff', display: 'block', marginTop: '20px', fontWeight: 'bold', fontSize: '1.1rem' }}>{l.name}</span>
              </div>
            </React.Fragment>
          );
        })}
      </div>

      {/* ปุ่ม EXIT สีแดง */}
      <button 
        className="btn-back" 
        onClick={() => navigate("/games")} 
        style={{ 
          marginTop: '40px', 
          background: 'linear-gradient(90deg, #ff8a80, #ff5252)', 
          color: '#fff', 
          padding: '14px 60px', 
          borderRadius: '35px', 
          border: 'none', 
          fontWeight: '900', 
          fontSize: '1.2rem',
          cursor: 'pointer',
          boxShadow: '0 10px 20px rgba(255, 82, 82, 0.3)'
        }}
      >
        EXIT GAME
      </button>
    </div>
  </div>
)}

        {/* --- 3. PLAYING --- */}
        {gameState === "PLAYING" && (
            <div className="playing-container fade-in" style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '20px' }}>
                <div className="hud-bar" style={{ width: '95%', background: 'rgba(0,0,0,0.3)', display: 'flex', justifyContent: 'space-between', padding: '15px 30px', borderRadius: '50px', alignItems: 'center', marginBottom: '30px' }}>
          <div className="mission-badge" style={{ 
                      background: 'rgba(0,0,0,0.4)', 
                      color: '#fff', 
                      padding: '10px 30px', 
                      borderRadius: '20px', 
                      marginBottom: '20px', 
                      border: '1px solid #00d2ff',
                      textAlign: 'center'
                  }}>
            🎯 ภารกิจด่านที่ {levelIdx + 1}: เรียงลำดับจาก <b>{LEVELS[levelIdx].desc}</b>
        </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                        <img src={selectedChar?.img} style={{ width: '55px', background: '#fff', borderRadius: '50%', border: `3px solid ${selectedChar.color}` }} alt="C" />
                        <div style={{ color: '#fff' }}><b>{selectedChar?.name}</b><br/>{'❤️'.repeat(hp)}{shield > 0 && ` 🛡️x${shield}`}</div>
                    </div>
                    <div style={{ fontSize: '2.5rem', color: '#ffeb3b', fontWeight: 'bold' }}>⏰ {timeLeft}s</div>
                    <div style={{ color: '#fff', textAlign: 'right' }}>Score: <b>{score}</b><br/>{LEVELS[levelIdx].desc}</div>
                </div>
                <div className="bubble-stage" style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', width: '100%' }}>
                  <div className="bubbles-row" style={{ display: 'flex', gap: '25px', marginBottom: '50px' }}>
                    {bubbles.map((val, idx) => {
                      const isSorted = idx >= bubbles.length - passCompleted; 
                      const isActive = idx === currentIndex || idx === currentIndex + 1;
                      return (
                        <div key={idx} className={`bubble-item ${isActive ? 'active-pair' : ''} ${isSorted ? 'sorted' : ''}`}
                          style={{ width: '95px', height: '95px', borderRadius: '50%', background: isSorted ? '#4caf50' : '#0288d1', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2.2rem', color: '#fff', fontWeight: 'bold', border: isActive ? '6px solid #ffca28' : '3px solid rgba(255,255,255,0.3)', transform: isActive ? 'scale(1.1)' : 'scale(1)' }}>
                          {val}
                        </div>
                      );
                    })}
                  </div>
                  {feedback && <div className="feedback-message" style={{ fontSize: '1.4rem', color: '#fff' }}>{feedback}</div>}
                </div>
                <div className="game-footer" style={{ display: 'flex', gap: '30px', marginBottom: '40px' }}>
                  <button className="btn-action swap" onClick={() => handleDecision(true)} disabled={isProcessing} style={{ padding: '15px 70px', borderRadius: '50px', border: 'none', background: 'linear-gradient(45deg, #2196f3, #00d2ff)', color: '#fff', fontSize: '1.6rem', fontWeight: 'bold' }}>SWAP 🔄</button>
                  <button className="btn-action keep" onClick={() => handleDecision(false)} disabled={isProcessing} style={{ padding: '15px 70px', borderRadius: '50px', border: 'none', background: 'linear-gradient(45deg, #4caf50, #8bc34a)', color: '#fff', fontSize: '1.6rem', fontWeight: 'bold' }}>KEEP ✅</button>
                </div>
            </div>
        )}

        {/* --- 4. RESULT: ปรับให้เล็กลงและดูแพงขึ้น --- */}
{(gameState === "WIN" || gameState === "ALREADY_DONE") && (
  <div className="overlay-screen fade-in" style={{ 
    flex: 1, 
    display: 'flex', 
    alignItems: 'center', 
    justifyContent: 'center',
    padding: '20px'
  }}>
    <div className="glass-ui" style={{ 
      padding: '30px 40px', // ✅ ลดจาก 50px เหลือ 30px
      maxWidth: '400px',    // ✅ บีบความกว้างลงจาก 480px ให้ดูกระชับ
      width: '100%', 
      textAlign: 'center', 
      background: 'rgba(255, 255, 255, 0.2)', 
      backdropFilter: 'blur(20px)', 
      borderRadius: '45px', 
      border: '2px solid rgba(255, 255, 255, 0.4)',
      boxShadow: '0 20px 50px rgba(0, 0, 0, 0.3)'
    }}>
      {/* ไอคอนถ้วยรางวัล */}
      <span style={{ fontSize: '3.5rem', display: 'block', marginBottom: '10px' }}>🏆</span>
      
      <h1 style={{ 
        fontSize: '2.4rem', // ✅ ลดจาก 3.2rem เพื่อไม่ให้ล้น
        color: '#fff', 
        fontWeight: '900',
        marginBottom: '5px',
        textShadow: '0 0 15px rgba(255, 235, 59, 0.5)' 
      }}>
        ภารกิจสำเร็จ!
      </h1>

      {/* วงกลมโชว์ตัวละคร (ปรับขนาดเล็กลง) */}
      <div style={{ 
        width: '120px', // ✅ ลดจาก 150px
        height: '120px', // ✅ ลดจาก 150px
        margin: '20px auto', 
        borderRadius: '50%', 
        background: '#fff', 
        border: '5px solid #ffca28', // เปลี่ยนเป็นสีทองให้เข้ากับถ้วย
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        boxShadow: '0 0 20px rgba(255, 202, 40, 0.4)'
      }}>
          {selectedChar && <img src={selectedChar.img} alt="Char" style={{ width: '80%', objectFit: 'contain' }} />}
      </div>

      {/* ตัวเลขคะแนน (ปรับให้พอดี) */}
      <div style={{ 
        fontSize: '4rem', // ✅ ลดจาก 5.5rem เพื่อความสมดุล
        fontWeight: '900', 
        color: '#fff',
        marginBottom: '5px',
        letterSpacing: '2px'
      }}>
        {score.toLocaleString()}
      </div>
      <p style={{ color: 'rgba(255,255,255,0.8)', marginBottom: '25px', fontSize: '1rem' }}>คะแนนรวมที่ทำได้</p>

      {/* ปุ่มกลับหน้าหลัก */}
      <button 
        className="btn-res" 
        onClick={() => navigate("/home")} 
        style={{ 
          background: 'linear-gradient(90deg, #00d2ff, #3a7bd5)', 
          color: '#fff', 
          padding: '12px 50px', // ✅ ลดจาก 18px 70px ให้ดูคลีนขึ้น
          borderRadius: '30px', 
          border: 'none', 
          fontWeight: '900',
          fontSize: '1.1rem',
          cursor: 'pointer',
          boxShadow: '0 10px 20px rgba(58, 123, 213, 0.3)',
          transition: '0.3s'
        }}
        onMouseOver={(e) => e.target.style.transform = 'scale(1.05)'}
        onMouseOut={(e) => e.target.style.transform = 'scale(1)'}
      >
        กลับหน้าหลัก 🏠
      </button>
    </div>
  </div>
)}

        {/* --- 5. GAMEOVER --- */}
        {gameState === "GAMEOVER" && (
          <div className="overlay-screen fade-in" style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div className="glass-ui" style={{ padding: '50px 40px', maxWidth: '480px', textAlign: 'center', background: 'rgba(82, 192, 255, 0.2)', backdropFilter: 'blur(20px)', borderRadius: '55px', border: '3px solid rgba(82, 97, 255, 0.5)' }}>
              <span style={{ fontSize: '4.5rem' }}>💀</span>
              <h1 style={{ fontSize: '3rem', color: '#fff', fontWeight: '900' }}>ภารกิจล้มเหลว!</h1>
              <p style={{ color: '#fff', fontSize: '1.2rem', marginBottom: '30px' }}>{feedback || "พลังงานของคุณหมดลงแล้ว"}</p>
              <button className="btn-res" onClick={() => setGameState("MAP")} style={{ background: 'linear-gradient(90deg, #5266ff, #17cdff)', color: '#fff', padding: '18px 70px', borderRadius: '60px', border: 'none', fontWeight: 'bold' }}>กลับไปหน้าแผนที่ 📍</button>
            </div>
          </div>
        )}

        {/* --- 6. RULES --- */}
        {gameState === "RULES" && (
            <div className="ui-screen fade-in" style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <div className="glass-ui" style={{ padding: '45px', maxWidth: '550px', textAlign: 'center', background: 'rgba(255,255,255,0.2)', borderRadius: '45px', backdropFilter: 'blur(15px)' }}>
                    <h2 style={{ color: '#fff', fontSize: '2.5rem' }}>📜 กติกา: {LEVELS[levelIdx].name}</h2>
                    <div style={{ textAlign: 'left', color: '#fff', fontSize: '1.3rem', lineHeight: '1.8' }}>
                        <p>🎯 ภารกิจ: <span style={{color: '#ffeb3b'}}>{LEVELS[levelIdx].desc}</span></p>
                        <p>• <b>SWAP:</b> กดเมื่อเลขเรียงผิดลำดับ</p>
                        <p>• <b>KEEP:</b> กดเมื่อเลขเรียงถูกต้องแล้ว</p>
                    </div>
                    <button onClick={() => setGameState("PLAYING")} style={{ marginTop: '35px', background: '#ffeb3b', padding: '15px 50px', borderRadius: '35px', border: 'none', fontWeight: 'bold' }}>เริ่มสำรวจ!</button>
                </div>
            </div>
        )}

      </div>
    </MainLayout>
  );
}
