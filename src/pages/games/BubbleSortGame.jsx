import React, { useState, useEffect } from "react";
import MainLayout from "../../layouts/MainLayout";
import { useNavigate } from "react-router-dom";
import "../../styles/bubble-game.css";

import bgUnderwater from "../../assets/bg-underwater.png"; 
import charStarfish from "../../assets/starfish.png"; 
import charDolphin from "../../assets/dolphin.png";   
import charJellyfish from "../../assets/jellyfish.png"; 
import sfxBubble from "../../assets/sounds/bubble.mp3"; 

const SCORE_API = "https://script.google.com/macros/s/AKfycbxaSnMhAZYVgAwDS7VOgJuINzO2Wn3r8EBMPMFt84nbjy4tn-O5i6OUQIHj19L9jFNJ/exec";

const LEVELS = [
  { id: 1, name: "Sea Zone", count: 4, order: "ASC", mission: "Sort: Small ⮕ Large" },
  { id: 2, name: "Blue Lake", count: 5, order: "DESC", mission: "Sort: Large ⮕ Small" },
  { id: 3, name: "Deep Ocean", count: 6, order: "ASC", mission: "Sort: Small ⮕ Large" }
];

const CHARACTERS = [
  { id: "starfish", name: "ปลาดาว", enName: "Starfish", skill: "Shield", desc: "ป้องกันพลาด 1 ครั้ง/ด่าน", hp: 5, img: charStarfish, color: "#ff8a80" },
  { id: "dolphin", name: "โลมา", enName: "Dolphin", skill: "Speed", desc: "เพิ่มเวลาสำรวจ +45 วินาที", hp: 3, img: charDolphin, color: "#81d4fa" },
  { id: "jellyfish", name: "แมงกะพรุน", enName: "Jellyfish", skill: "X2 Score", desc: "รับคะแนนเปลือกหอย 2 เท่า", hp: 4, img: charJellyfish, color: "#e1bee7" }
];

export default function BubbleSortGame() {
  const navigate = useNavigate();
  const [gameState, setGameState] = useState("SELECT_CHAR");
  const [selectedChar, setSelectedChar] = useState(null);
  const [currentLevelIdx, setCurrentLevelIdx] = useState(0);
  const [unlockedLevel, setUnlockedLevel] = useState(1);
  const [bubbles, setBubbles] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [passCompleted, setPassCompleted] = useState(0);
  const [score, setScore] = useState(0);
  const [hp, setHp] = useState(3);
  const [timeLeft, setTimeLeft] = useState(0);
  const [feedback, setFeedback] = useState("");
  const [shieldActive, setShieldActive] = useState(false);

  const playSound = (src) => { try { new Audio(src).play(); } catch(e) {} };

  const startLevel = (idx) => {
    setCurrentLevelIdx(idx);
    const level = LEVELS[idx];
    setBubbles(Array.from({ length: level.count }, () => Math.floor(Math.random() * 90) + 1));
    setTimeLeft(60 + (selectedChar.id === "dolphin" ? 45 : 0));
    setHp(selectedChar.hp);
    setCurrentIndex(0);
    setPassCompleted(0);
    setShieldActive(selectedChar.id === "starfish");
    setGameState("MISSION_START");
  };

  useEffect(() => {
    if (gameState === "PLAYING" && timeLeft > 0) {
      const t = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
      return () => clearInterval(t);
    } else if (timeLeft === 0 && gameState === "PLAYING") setGameState("GAMEOVER");
  }, [gameState, timeLeft]);

  const handleAction = (swap) => {
    const i = currentIndex, j = i + 1;
    const isAsc = LEVELS[currentLevelIdx].order === "ASC";
    const needsSwap = isAsc ? bubbles[i] > bubbles[j] : bubbles[i] < bubbles[j];

    if (swap === needsSwap) {
      playSound(sfxBubble);
      setFeedback("✨ ถูกต้อง!");
      let newB = [...bubbles];
      if (swap) [newB[i], newB[j]] = [newB[j], newB[i]];
      setBubbles(newB);
      
      const points = selectedChar.id === "jellyfish" ? 40 : 20;
      setScore(prev => {
        const newScore = prev + points;
        advanceGame(newB, newScore); // ส่งคะแนนล่าสุดไปคำนวณต่อ
        return newScore;
      });
    } else {
      if (shieldActive) {
        setFeedback("🛡️ โล่ป้องกันช่วยไว้!");
        setShieldActive(false);
      } else {
        setFeedback("🫧 ลองใหม่นะ!");
        setHp(h => {
          if (h <= 1) setGameState("GAMEOVER");
          return h - 1;
        });
      }
    }
  };

  const advanceGame = (currentBubbles, currentScore) => {
    let nextI = currentIndex + 1;
    if (nextI >= currentBubbles.length - 1 - passCompleted) {
      const nextPass = passCompleted + 1;
      if (nextPass >= currentBubbles.length - 1) {
        setTimeout(() => handleLevelComplete(currentScore), 800);
      } else {
        setPassCompleted(nextPass);
        setCurrentIndex(0);
      }
    } else {
      setCurrentIndex(nextI);
    }
  };

  const handleLevelComplete = (finalScoreForLevel) => {
    const nextIdx = currentLevelIdx + 1;
    setUnlockedLevel(prev => Math.max(prev, nextIdx + 1));
    
    if (nextIdx < LEVELS.length) {
      setGameState("MAP"); 
    } else {
      setGameState("WIN");
      saveScore(finalScoreForLevel + 500); // บวกโบนัสจบเกม และส่งคะแนนที่แน่นอนที่สุด
    }
  };

  const saveScore = async (fs) => {
    const u = JSON.parse(localStorage.getItem("user")) || { firstname: "Guest", lastname: "Player" };
    const payload = { activity: "GAMES", firstname: u.firstname, lastname: u.lastname, gameName: "Bubble Sponge", score: fs };
    try { 
      await fetch(SCORE_API, { method: "POST", mode: "no-cors", body: JSON.stringify(payload), headers: { "Content-Type": "text/plain" } }); 
    } catch (e) { console.error("Save Error", e); }
  };

  return (
    <MainLayout>
      <div className="game-root" style={{ backgroundImage: `url(${bgUnderwater})` }}>
        
        {/* 1. เลือกตัวละคร */}
        {gameState === "SELECT_CHAR" && (
          <div className="glass-card">
            <h1>🌊 เลือกฮีโร่ใต้น้ำ (Select Your Hero)</h1>
            <div className="char-grid">
              {CHARACTERS.map(c => (
                <div key={c.id} className="char-item" onClick={() => { setSelectedChar(c); setGameState("RULES"); }}>
                  <img src={c.img} className="char-img" alt={c.name} />
                  <h3>{c.enName} ({c.name})</h3>
                  <div style={{background: c.color, borderRadius: '10px', padding: '5px', fontSize: '0.85rem', color: '#000'}}>
                    <strong>{c.skill}:</strong> {c.desc}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 2. กติกา (เพิ่มความชัดเจน) */}
        {gameState === "RULES" && (
          <div className="glass-card">
            <h2>📜 กติกาการเล่น (Rules)</h2>
            <div style={{textAlign: 'left', margin: '30px auto', maxWidth: '500px', fontSize: '1.2rem'}}>
              <p>🫧 เปรียบเทียบฟองสบู่คู่ที่มี <strong>"แสงล้อมรอบ"</strong></p>
              <p>🔄 ลำดับผิด ⮕ กด <strong>"สลับตำแหน่ง (Swap)"</strong></p>
              <p>✅ ลำดับถูก ⮕ กด <strong>"ถูกต้องแล้ว (Correct)"</strong></p>
            </div>
            <button className="btn-game btn-blue" onClick={() => setGameState("MAP")}>เข้าสู่แผนที่</button>
          </div>
        )}

        {/* 3. แผนที่ (แก้ไข Logic ปลดล็อก) */}
        {gameState === "MAP" && (
          <div className="glass-card">
            <h2>📍 แผนที่ระดับความลึก (Unlocked Map)</h2>
            <div className="char-grid">
              {LEVELS.map((l, i) => (
                <div key={l.id} className="char-item" 
                  style={{opacity: i+1 <= unlockedLevel ? 1 : 0.4, cursor: i+1 <= unlockedLevel ? 'pointer' : 'not-allowed'}}
                  onClick={() => i+1 <= unlockedLevel && startLevel(i)}>
                  <h1 style={{fontSize: '3rem', margin: '0'}}>{i+1 < unlockedLevel ? "✅" : l.id}</h1>
                  <p><strong>{l.name}</strong></p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 4. หน้าเล่นเกม */}
        {gameState === "PLAYING" && (
          <div style={{width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
            <div style={{position:'absolute', top:'20px', width:'90%', display:'flex', justifyContent:'space-between', fontSize:'1.6rem', fontWeight:'bold', textShadow:'2px 2px 4px rgba(0,0,0,0.5)'}}>
              <div>❤️ HP: {hp}</div>
              <div style={{color: '#ffeb3b'}}>⏳ {timeLeft}s</div>
              <div>🐚 {score}</div>
            </div>
            <div className="glass-card" style={{marginTop:'60px'}}>
              <h2 style={{color: '#ffeb3b'}}>{LEVELS[currentLevelIdx].name}</h2>
              <div className="bubble-row">
                {bubbles.map((v, idx) => (
                  <div key={idx} className={`bubble-sphere ${idx === currentIndex || idx === currentIndex + 1 ? 'active' : ''} ${idx >= bubbles.length - passCompleted ? 'sorted' : ''}`}>{v}</div>
                ))}
              </div>
              <div style={{height:'35px', fontWeight:'bold', fontSize:'1.3rem'}}>{feedback}</div>
              <div style={{marginTop:'25px'}}>
                <button className="btn-game btn-pink" onClick={() => handleAction(true)}>🔄 สลับ (Swap)</button>
                <button className="btn-game btn-blue" onClick={() => handleAction(false)}>✅ ถูกแล้ว (Correct)</button>
              </div>
            </div>
          </div>
        )}

        {/* 5. หน้า Mission Start */}
        {gameState === "MISSION_START" && (
          <div className="glass-card">
            <h1>🚩 MISSION: {LEVELS[currentLevelIdx].name}</h1>
            <p style={{fontSize: '1.5rem', color: '#ffeb3b'}}>{LEVELS[currentLevelIdx].mission}</p>
            <button className="btn-game btn-blue" onClick={() => setGameState("PLAYING")}>Start!</button>
          </div>
        )}

        {/* 6. หน้า Win/GameOver */}
        {(gameState === "WIN" || gameState === "GAMEOVER") && (
          <div className="glass-card">
            <h1>{gameState === "WIN" ? "🏆 ภารกิจสำเร็จ!" : "💀 จบเกม"}</h1>
            <p style={{fontSize: '1.8rem'}}>คะแนนเปลือกหอยสะสม: {score}</p>
            <button className="btn-game btn-blue" onClick={() => window.location.reload()}>เล่นใหม่อีกครั้ง</button>
            <button className="btn-game btn-pink" onClick={() => navigate("/home")}>กลับหน้าหลัก</button>
          </div>
        )}
      </div>
    </MainLayout>
  );
}