import React, { useState, useEffect, useRef } from "react";
import MainLayout from "../../layouts/MainLayout";
// ✅ IMPORT CSS
import "../../styles/selection-game.css"; 
import { useNavigate } from "react-router-dom";

// Image Imports
import bgMain from "../../assets/bg-selection.png"; 
import charS1 from "../../assets/s1.png"; 
import charS2 from "../../assets/s2.png"; 
import charS3 from "../../assets/s3.png"; 

//Sound Imports
import sfxClick from "../../assets/sounds/click.mp3";
import sfxCorrect from "../../assets/sounds/correct.mp3";
import sfxWrong from "../../assets/sounds/wrong.mp3";
import sfxSwap from "../../assets/sounds/click.mp3";
import sfxWin from "../../assets/sounds/win.mp3";

const LESSON_KEY = "selection"; 

const LEVELS = [
  { id: 1, name: "โซนฝึกหัด", count: 5, order: "ASC", baseTime: 60, desc: "เรียง 'น้อย ⮕ มาก'" },
  { id: 2, name: "โซนต้องห้าม", count: 7, order: "DESC", baseTime: 90, desc: "เรียง 'มาก ⮕ น้อย'" },
  { id: 3, name: "หอคอยลับ", count: 10, order: "ASC", baseTime: 120, desc: "เรียง 'น้อย ⮕ มาก' (10 เล่ม)" }
];

const CHARACTERS = [
  { id: "guardian", name: "The Guardian", skillName: "ถึกทน (HP++)", desc: "เลือดเยอะที่สุด (5 ❤️)", hp: 5, timeBonus: 0, img: charS1, color: "#ffca28", iconSkill: "❤️" },
  { id: "timekeeper", name: "Time Keeper", skillName: "ยืดเวลา (Time++)", desc: "มีเวลาเยอะกว่า (+45s)", hp: 3, timeBonus: 45, img: charS2, color: "#4fc3f7", iconSkill: "⏰" },
  { id: "librarian", name: "Grand Librarian", skillName: "สมดุล (Balance)", desc: "ค่าพลังสมดุล", hp: 4, timeBonus: 15, img: charS3, color: "#ab47bc", iconSkill: "⏰❤️" }
];

const SCORE_API = "https://script.google.com/macros/s/AKfycbxaSnMhAZYVgAwDS7VOgJuINzO2Wn3r8EBMPMFt84nbjy4tn-O5i6OUQIHj19L9jFNJ/exec";

export default function SelectionGame() {
  const navigate = useNavigate();

  // State
  const [gameState, setGameState] = useState("LOADING");
  const [currentLevelIdx, setCurrentLevelIdx] = useState(0);
  const [selectedChar, setSelectedChar] = useState(null);
  const [unlockedLevel, setUnlockedLevel] = useState(1);

  const [books, setBooks] = useState([]);
  const [sortedIndex, setSortedIndex] = useState(0);
  const [candidateIndex, setCandidateIndex] = useState(0);
  const [compareIndex, setCompareIndex] = useState(1);
  const [phase, setPhase] = useState("COMPARING");

  const [score, setScore] = useState(0);
  const [hp, setHp] = useState(3);
  const [timeLeft, setTimeLeft] = useState(0);
  const [feedback, setFeedback] = useState("");

  const timerRef = useRef(null);

  // --- SOUND SYSTEM ---
  const playSound = (type) => {
    let src = null;
    switch (type) {
        case "click": src = sfxClick; break;
        case "correct": src = sfxCorrect; break;
        case "wrong": src = sfxWrong; break;
        case "swap": src = sfxSwap; break;
        case "win": src = sfxWin; break;
        default: break;
    }
    if (src) {
        const audio = new Audio(src);
        audio.volume = 0.5; 
        audio.play().catch(e => console.log("Audio play error", e));
    }
  };

  // --- SAVE SYSTEM ---
  const saveProgressToStorage = (newData) => {
    try {
        const user = JSON.parse(localStorage.getItem("user")) || {};
        const userKey =
  user.email ||
  user.id ||
  user.username ||
  user.firstname ||
  "guest";

        const storageKey = `progress_${userKey}_${LESSON_KEY}`;

        const currentData = JSON.parse(localStorage.getItem(storageKey)) || {};
        
        const mergedData = { ...currentData, ...newData };
        localStorage.setItem(storageKey, JSON.stringify(mergedData));
    } catch (e) {
        console.error("Save Error", e);
    }
  };

  // --- ✅ 1. CHECK STATUS & RESTORE (แก้เรื่องคะแนนไม่ขึ้น) ---
  useEffect(() => {
    const checkGameStatus = () => {
      try {
        const user = JSON.parse(localStorage.getItem("user")) || {};
        const userKey =
  user.email ||
  user.id ||
  user.username ||
  user.firstname ||
  "guest";

        const storageKey = `progress_${userKey}_${LESSON_KEY}`;

        
        const savedData = JSON.parse(localStorage.getItem(storageKey)) || {};

        // 1. ถ้าจบเกมแล้ว
        if (savedData.game === true) {
          setGameState("ALREADY_WIN");
          return;
        }

        // 2. กู้คืนคะแนน (สำคัญ!)
        if (typeof savedData.score === 'number') {
             setScore(savedData.score);
        }

        // 3. กู้คืน Level
        if (savedData.level && savedData.level > 1) {
             setUnlockedLevel(savedData.level);
        }

        // 4. ถ้าเคยเลือกตัวละครแล้ว -> ข้ามไป Map เลย
        if (savedData.charId) {
             const char = CHARACTERS.find(c => c.id === savedData.charId);
             if (char) {
                 setSelectedChar(char);
                 setGameState("MAP");
             } else {
                 setGameState("SELECT_CHAR");
             }
        } else {
             setGameState("SELECT_CHAR");
        }

      } catch (e) {
        console.error("Check status error", e);
        setGameState("SELECT_CHAR");
      }
    };
    checkGameStatus();
  }, []);

  // Timer
  useEffect(() => {
    if (gameState === "PLAYING" && timeLeft > 0) {
      if (timerRef.current) clearInterval(timerRef.current);
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timerRef.current);
            handleGameOver("หมดเวลา! 🕒");
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [gameState, timeLeft]);

  // --- ACTIONS ---
  const generateBooks = (count) => {
    const arr = [];
    while (arr.length < count) {
      const r = Math.floor(Math.random() * 99) + 1;
      if (!arr.includes(r)) arr.push(r);
    }
    return arr;
  };

  const handleSelectChar = (char) => {
    playSound("click");
    setSelectedChar(char);
    setHp(char.hp);
    
    // บันทึกตัวละคร
    saveProgressToStorage({ charId: char.id });

    setGameState("RULES"); 
  };

  const confirmRulesAndGoToMap = () => {
    playSound("click");
    setGameState("MAP");
  };

  const selectLevelFromMap = (levelIdx) => {
    // ✅ Logic ใหม่: เล่นได้เฉพาะด่านปัจจุบัน (unlockedLevel) เท่านั้น
    // levelIdx เริ่มที่ 0, unlockedLevel เริ่มที่ 1
    // ด่านปัจจุบันคือเมื่อ levelIdx + 1 === unlockedLevel
    if (levelIdx + 1 !== unlockedLevel) return;

    playSound("click");
    setCurrentLevelIdx(levelIdx);
    
    const level = LEVELS[levelIdx];
    setBooks(generateBooks(level.count));
    setTimeLeft(level.baseTime + selectedChar.timeBonus);
    setHp(selectedChar.hp); 
    
    setSortedIndex(0);
    setCandidateIndex(0);
    setCompareIndex(1);
    setPhase("COMPARING");
    setFeedback(`เริ่มภารกิจ: ${level.name}`);
    setGameState("PLAYING");
  };

  // --- GAME LOGIC ---
  const handlePickNew = () => { playSound("click"); checkAnswer(true); };
  const handleKeepCurrent = () => { playSound("click"); checkAnswer(false); };

  const checkAnswer = (playerChoseNew) => {
    const level = LEVELS[currentLevelIdx];
    const isAsc = level.order === "ASC"; 
    const currentVal = books[candidateIndex]; 
    const newVal = books[compareIndex];       
    const isNewBetter = isAsc ? (newVal < currentVal) : (newVal > currentVal);

    if (playerChoseNew === isNewBetter) {
      playSound("correct");
      setFeedback("✅ ถูกต้อง!");
      setScore(s => s + 10);
      if (playerChoseNew) setCandidateIndex(compareIndex);
      nextStep();
    } else {
      playSound("wrong");
      setFeedback(`❌ ผิด! ลองใหม่นะ`);
      setHp(prev => {
        const newHp = prev - 1;
        if (newHp <= 0) handleGameOver("พลังชีวิตหมด 💀");
        return newHp;
      });
      setScore(s => Math.max(0, s - 20));
    }
  };

  const nextStep = () => {
    const nextComp = compareIndex + 1;
    if (nextComp < books.length) {
      setCompareIndex(nextComp);
    } else {
      setPhase("READY_TO_SWAP");
      setFeedback("🔍 เจอแล้ว! กดสลับเลย");
    }
  };

  const handleSwap = () => {
    playSound("swap");
    const newBooks = [...books];
    [newBooks[sortedIndex], newBooks[candidateIndex]] = [newBooks[candidateIndex], newBooks[sortedIndex]];
    setBooks(newBooks);
    setScore(s => s + 50);
    const nextSorted = sortedIndex + 1;
    setSortedIndex(nextSorted);

    if (nextSorted >= books.length - 1) {
      setFeedback("🎉 ยอดเยี่ยม! รอสักครู่...");
      setTimeout(() => {
        handleLevelComplete();
      }, 1500); 
    } else {
      setCandidateIndex(nextSorted);
      setCompareIndex(nextSorted + 1);
      setPhase("COMPARING");
      setFeedback("📚 เยี่ยม! หาเล่มต่อไป...");
    }
  };

  const handleLevelComplete = () => {
    clearInterval(timerRef.current);
    playSound("win");
    const levelScore = 100; 
    const newTotalScore = score + levelScore;
    setScore(newTotalScore);

    // ✅ บันทึก Level และ Score ทันทีที่จบด่าน
    const nextLvl = currentLevelIdx + 2;
    const updateData = { score: newTotalScore }; 
    
    if (nextLvl > unlockedLevel) {
        setUnlockedLevel(prev => Math.max(prev, nextLvl));
        updateData.level = nextLvl;
    }
    saveProgressToStorage(updateData);

    if (currentLevelIdx + 1 < LEVELS.length) {
      setGameState("MAP"); 
    } else {
      handleGameWin(newTotalScore);
    }
  };

  const handleGameOver = (msg) => { 
    playSound("wrong");
    clearInterval(timerRef.current);
    setFeedback(msg); 
    setGameState("GAMEOVER"); 
  };

  const handleGameWin = (finalScore) => { 
    clearInterval(timerRef.current);
    playSound("win");
    
    saveProgressToStorage({ 
        game: true, 
        level: LEVELS.length + 1,
        score: finalScore 
    });

    saveScoreToSheet(finalScore); 
    setGameState("WIN"); 
  };

  const saveScoreToSheet = async (finalScore) => {
    let user = {}; try { user = JSON.parse(localStorage.getItem("user")) || {}; } catch(e){}
    const payload = {
      activity: "GAMES",
      firstname: user.firstname || "Guest",
      lastname: user.lastname || "Player",
      gameName: "Selection Sort Saga",
      score: finalScore
    };
    try { await fetch(SCORE_API, { method: "POST", body: JSON.stringify(payload), headers: {"Content-Type": "text/plain;charset=utf-8"} }); } catch(e){}
  };

  const renderStars = (finalScore) => {
    let stars = 1;
    if (finalScore > 500) stars = 3;
    else if (finalScore > 300) stars = 2;
    return (
      <div className="star-row">
        {Array.from({length: 3}).map((_, i) => <span key={i} className={`star ${i < stars ? 'filled' : ''}`}>⭐</span>)}
      </div>
    );
  };

  const currentLevel = LEVELS[currentLevelIdx];
  const isAscending = currentLevel?.order === "ASC";

  return (
    <MainLayout>
      <div className="game-container" style={{ backgroundImage: `url(${bgMain})` }}>
        
        {gameState === "LOADING" && <div></div>}

        {/* ALREADY WIN */}
        {gameState === "ALREADY_WIN" && (
          <div className="overlay-screen fade-in">
             <div className="win-card pop-in" style={{maxWidth:'550px'}}>
                <div className="win-header">MISSION COMPLETED</div>
                <div className="win-body">
                  <div style={{fontSize:'5rem', marginBottom:'15px'}}>🏆</div>
                  <p className="win-desc">คุณได้พิชิตหอสมุดแห่งนี้เรียบร้อยแล้ว!</p>
                  <p style={{color:'#aaa', fontSize:'0.9rem'}}>ไม่สามารถเล่นซ้ำได้</p>
                </div>
                <div className="btn-group-center">
                  <button className="btn-primary" onClick={() => navigate("/home")}>กลับหน้าหลัก</button>
                </div>
             </div>
          </div>
        )}

        {/* SELECT CHAR */}
        {gameState === "SELECT_CHAR" && (
          <div className="overlay-screen fade-in">
            <div className="title-wrapper">
              <h1 className="game-title main">Selection Sort</h1>
              <h2 className="game-title sub">The Magic Library</h2>
            </div>
            <div className="char-grid-horizontal">
      {CHARACTERS.map(char => (
        <div key={char.id} className="magic-book-card-v4" onClick={() => handleSelectChar(char)}>
           {/* ✅ ลบพื้นหลังสีดำออกเพื่อให้ตัวละครลอยเด่น */}
           <div className="char-img-box-transparent">
             <img src={char.img} alt={char.name} className="char-portrait-floating" />
             <div className="moonlight-glow"></div>
           </div>
           
           <div className="char-info-v4">
             <h3 className="char-name-bright">{char.name}</h3>
             <div className="char-skill-v4" style={{borderColor: char.color}}>
               <span style={{color: char.color}}>{char.iconSkill} {char.skillName}</span>
             </div>
             <p className="char-desc-cream">{char.desc}</p>
             <button className="mahogany-select-btn">เลือก</button>
           </div>
        </div>
      ))}
    </div>
  </div>
)}
    
        {/* RULES */}
        {gameState === "RULES" && (
          <div className="overlay-backdrop fade-in">
             <div className="modal-box paper-theme">
                <h2>📜 กติกาภารกิจ</h2>
                <div className="rules-content">
                  <div className="selected-preview">
                    <img src={selectedChar.img} alt="Selected"/>
                    <div>
                        <strong>{selectedChar.name}</strong><br/>
                        <span>สกิล: {selectedChar.iconSkill} {selectedChar.skillName}</span>
                    </div>
                  </div>
                  <ul>
                    <li>1️⃣ <strong>Scan:</strong> หาเล่มที่ น้อย/มาก ที่สุด</li>
                    <li>2️⃣ <strong>Select:</strong> เลือกเล่มนั้นเพื่อถือไว้</li>
                    <li>3️⃣ <strong>Swap:</strong> สลับไปไว้ข้างหน้า</li>
                  </ul>
                  <p>พลังชีวิตและเวลาจะถูกรีเซ็ตใหม่ทุกด่าน!</p>
                </div>
                <button className="btn-large" onClick={confirmRulesAndGoToMap}>ไปที่แผนที่ 🗺️</button>
             </div>
          </div>
        )}

        {/* MAP */}
{gameState === "MAP" && (
  <div className="overlay-screen fade-in">
    <div className="map-panel glass-panel">
      <h2>🗺️ แผนที่หอสมุด</h2>
      <div className="map-score">คะแนนสะสม: <span>{score}</span></div>
      
      <div className="map-path-container">
        {/* ✅ ส่วนที่เพิ่ม: เส้นพื้นหลังและเส้นความคืบหน้า */}
        <div className="map-line-background"></div>
        <div 
          className="map-line-progress"
          style={{
            width: `calc(${((unlockedLevel - 1) / (LEVELS.length - 1)) * 100}% - 90px)`
          }}
        ></div>

        {LEVELS.map((level, idx) => {
          const isCompleted = idx + 1 < unlockedLevel;
          const isCurrent = idx + 1 === unlockedLevel;
          const isLocked = idx + 1 > unlockedLevel;

          let nodeClass = "map-node";
          if (isCompleted) nodeClass += " completed";
          if (isCurrent) nodeClass += " current";
          if (isLocked) nodeClass += " locked";

          return (
            <div key={level.id} className="map-node-wrapper">
              {isCurrent && (
                <div className="map-avatar">
                  <img src={selectedChar.img} alt="Me" className="avatar-bounce"/>
                </div>
              )}
              <button 
                className={nodeClass}
                onClick={() => selectLevelFromMap(idx)}
                disabled={!isCurrent}
              >
                {isCompleted ? "✔" : (isLocked ? "🔒" : level.id)}
              </button>
              <div className="map-label">{level.name}</div>
            </div>
          );
        })}
      </div>
      <p className="map-hint">คลิกที่ด่านปัจจุบันเพื่อเริ่มเล่น</p>
    </div>
  </div>
)}

        {/* GAMEPLAY */}
        {gameState === "PLAYING" && (
          <div className="gameplay-wrapper fade-in">
            <div className="compact-hud glass-panel">
               <div className="hud-char">
                  <img src={selectedChar.img} alt="char" className="hud-avatar"/>
                  <div className="hud-info-box">
                    <span className="hud-name">{selectedChar.name}</span>
                    <span className="hud-skill" style={{color: selectedChar.color}}>
                        {selectedChar.iconSkill} {selectedChar.skillName}
                    </span>
                  </div>
               </div>
               <div className="hud-center">
                  <span className="hud-level-label">{currentLevel.name}</span>
                  <div className={`timer-text ${timeLeft <= 10 ? 'urgent' : ''}`}>
                    ⏳ {Math.floor(timeLeft / 60)}:{String(timeLeft % 60).padStart(2, '0')}
                  </div>
               </div>
               <div className="hud-stats">
                  <div className="score-pill">💎 {score}</div>
                  <div className="hp-bar">
                    {Array.from({length: hp}).map((_, i) => (
                      <span key={i} className={`heart-icon ${i < hp ? 'alive' : 'dead'}`}>❤️</span>
                    ))}
                  </div>
               </div>
            </div>

            <div className="game-stage">
               <div className={`feedback-bubble ${feedback.includes("❌") ? "bad" : "good"}`}>{feedback}</div>
               <div className="bookshelf-container">
                  <div className="bookshelf-wood">
                    {books.map((val, idx) => {
                      let statusClass = "book-normal";
                      if (idx < sortedIndex) statusClass = "book-sorted"; 
                      else if (idx === candidateIndex) statusClass = "book-candidate"; 
                      else if (idx === compareIndex && phase === "COMPARING") statusClass = "book-comparing";

                      return (
                        <div key={idx} className={`book-item ${statusClass}`}>
                           <div className="book-spine"><span className="book-val">{val}</span></div>
                           {statusClass === "book-candidate" && <div className="indicator hold">👑</div>}
                           {statusClass === "book-comparing" && <div className="indicator look">👀</div>}
                        </div>
                      );
                    })}
                  </div>
               </div>
               <div className="control-panel glass-panel">
                  {phase === "COMPARING" ? (
                    <>
                      <div className="prompt-text">
                        โจทย์: หาค่า <strong>{isAscending ? "น้อยที่สุด (Min)" : "มากที่สุด (Max)"}</strong><br/>
                        เทียบ <strong>{books[compareIndex]}</strong> กับตัวที่ถือ <strong>{books[candidateIndex]}</strong>
                      </div>
                  <div className="btn-group-container">
                    {/* ปุ่มเปลี่ยนเล่ม (Pick/Swap) - ใช้สีเหลืองทองตัดกับไม้ */}
                    <button className="btn-library-action pick" onClick={handlePickNew}>
                      <div className="btn-content">
                        <span className="btn-icon">📖</span>
                        <div className="btn-text-wrapper">
                          <span className="main-text">สลับเล่มใหม่</span>
                          <small className="sub-text">เล่มนี้ใช่กว่าเยอะ!</small>
                        </div>
                      </div>
                      <div className="btn-glow-gold"></div>
                    </button>

                    {/* ปุ่มเก็บเล่มเดิม (Keep) - ใช้สีเขียวใบไม้แบบคลาสสิก */}
                    <button className="btn-library-action keep" onClick={handleKeepCurrent}>
                      <div className="btn-content">
                        <span className="btn-icon">🔒</span>
                        <div className="btn-text-wrapper">
                          <span className="main-text">เก็บเล่มเดิม</span>
                          <small className="sub-text">ตัวเดิมดีที่สุดแล้ว</small>
                        </div>
                      </div>
                      <div className="btn-glow-green"></div>
                    </button>
                  </div>
                    </>
                  ) : (
                    <button className="btn-swap glowing" onClick={handleSwap}>✨ สลับตำแหน่ง (Swap) ✨</button>
                  )}
               </div>
            </div>
          </div>
        )}

        {/* WIN / GAMEOVER */}
        {(gameState === "WIN" || gameState === "GAMEOVER") && (
          <div className="overlay-backdrop fade-in">
             {gameState === "WIN" ? (
               <div className="win-card pop-in">
                  <div className="win-header">MISSION COMPLETE</div>
                  <div className="win-body">
                    {renderStars(score)}
                    <div className="score-label">TOTAL SCORE</div>
                    <div className="score-big">{score}</div>
                    <p className="win-desc">สุดยอดบรรณารักษ์แห่งตำนาน!</p>
                  </div>
                  <div className="btn-group-center">
                    <button className="btn-primary" onClick={() => navigate("/home")}>กลับหน้าหลัก</button>
                  </div>
               </div>
             ) : (
               <div className="modal-overlay fade-in">
                  <div className="library-modal-box pop-in">
                    {/* ไอคอนและหัวข้อหลัก */}
                    <div className="modal-header">
                      <span className="modal-icon-large">⌛</span>
                      <h1 className="modal-title">ภารกิจสิ้นสุด</h1>
                    </div>

                    {/* ข้อความแจ้งเตือน/ฟีดแบ็ก */}
                    <div className="modal-content">
                      <p className="feedback-text">{feedback || "พลังงานของคุณหมดลงแล้ว..."}</p>
                    </div>

                    {/* ปุ่มกดสไตล์ห้องสมุด */}
                    <div className="modal-actions">
                      <button className="btn-library-action retry" onClick={() => window.location.reload()}>
                        <div className="btn-content">
                          <span className="btn-icon">🔄</span>
                          <div className="btn-text-wrapper">
                            <span className="main-text">ลองใหม่อีกครั้ง</span>
                            <small className="sub-text">กลับไปแก้ตัวในหอสมุด</small>
                          </div>
                        </div>
                        <div className="btn-glow-retry"></div>
                      </button>
                    </div>
                  </div>
                </div>
             )}
          </div>
        )}
      </div>
    </MainLayout>
  );
}