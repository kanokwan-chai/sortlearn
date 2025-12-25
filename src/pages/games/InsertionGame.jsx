import React, { useState, useEffect, useRef } from "react";
import MainLayout from "../../layouts/MainLayout";
import "../../styles/insertion-master.css"; 
import { useNavigate } from "react-router-dom";

// Image Imports
import imgPunter from "../../assets/i1.png"; 
import imgLuck from "../../assets/i2.png"; 
import imgAccountant from "../../assets/i3.png"; 
import bgToonCasino from "../../assets/bg-insertion.png"; 

// ✅ SOUND IMPORTS (ต้องมีไฟล์ใน src/assets/sounds/)
// ถ้าชื่อไฟล์ไม่ตรง แก้ให้ตรงนะครับ
import sfxClick from "../../assets/sounds/click.mp3";
import sfxCorrect from "../../assets/sounds/correct.mp3";
import sfxWrong from "../../assets/sounds/wrong.mp3";
import sfxSwap from "../../assets/sounds/click.mp3";
import sfxWin from "../../assets/sounds/win.mp3";

// --- CONFIG ---
const LESSON_KEY = "insertion"; 
const SCORE_API = "https://script.google.com/macros/s/AKfycbxaSnMhAZYVgAwDS7VOgJuINzO2Wn3r8EBMPMFt84nbjy4tn-O5i6OUQIHj19L9jFNJ/exec";

const LEVELS = [
  { id: 1, name: "BRONZE TABLE", count: 5, order: "ASC", time: 60, desc: "เรียงจาก น้อย ⮕ มาก" },
  { id: 2, name: "SILVER TABLE", count: 7, order: "DESC", time: 90, desc: "เรียงจาก มาก ⮕ น้อย" },
  { id: 3, name: "GOLD TABLE", count: 10, order: "ASC", time: 120, desc: "เดิมพันสูง! น้อย ⮕ มาก" }
];

// ✅ ข้อมูลตัวละคร + อิโมจิ
const DEALERS = [
  { 
    id: "punter", 
    name: "The Punter", 
    skill: "เพิ่มพลังชีวิต (HP++)", 
    desc: "เริ่มเกมด้วย 5 ❤️", 
    hp: 5, 
    bonusTime: 0, 
    img: imgPunter, 
    iconSkill: "❤️" 
  },
  { 
    id: "luck", 
    name: "Lady Luck", 
    skill: "เพิ่มเวลา (Time++)", 
    desc: "เวลา +45 วินาที", 
    hp: 4, 
    bonusTime: 45, 
    img: imgLuck, 
    iconSkill: "⏰" 
  },
  { 
    id: "accountant", 
    name: "The Accountant", 
    skill: "ประกันความเสี่ยง (Insurance)", 
    desc: "มี 🛡️ โล่ป้องกัน 2 ชั้น", 
    hp: 4, 
    bonusTime: 10, 
    img: imgAccountant, 
    iconSkill: "🛡️" 
  }
];

export default function InsertionGame() {
  const navigate = useNavigate();

  // --- STATE ---
  const [gameState, setGameState] = useState("LOADING");
  const [unlockedLevel, setUnlockedLevel] = useState(1);
  const [levelIdx, setLevelIdx] = useState(0);
  const [dealer, setDealer] = useState(null);

  const [cards, setCards] = useState([]);
  const [sortedIndex, setSortedIndex] = useState(0); 
  const [keyIndex, setKeyIndex] = useState(1);
  const [compareIndex, setCompareIndex] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false); 

  const [score, setScore] = useState(0);
  const [hp, setHp] = useState(3);
  const [timeLeft, setTimeLeft] = useState(0);
  const [feedback, setFeedback] = useState("");
  
  const [insurance, setInsurance] = useState(0);

  const timerRef = useRef(null);
  const scoreRef = useRef(0);

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
        audio.play().catch(e => console.log("Audio Error:", e));
    }
  };

  // --- SAVE SYSTEM ---
  const saveProgressToStorage = (newData) => {
    try {
        const user = JSON.parse(localStorage.getItem("user")) || {};
        const username = user.firstname || "guest";
        const storageKey = `progress_${username}_${LESSON_KEY}`;
        const currentData = JSON.parse(localStorage.getItem(storageKey)) || {};
        
        const mergedData = { ...currentData, ...newData };
        localStorage.setItem(storageKey, JSON.stringify(mergedData));
    } catch (e) {
        console.error("Save Error", e);
    }
  };

  // --- 1. CHECK STATUS ---
  useEffect(() => {
    const checkGameStatus = () => {
      try {
        const user = JSON.parse(localStorage.getItem("user")) || {};
        const username = user.firstname || "guest";
        const storageKey = `progress_${username}_${LESSON_KEY}`;
        const savedData = JSON.parse(localStorage.getItem(storageKey)) || {};

        if (savedData.game === true) {
          setGameState("ALREADY_WIN");
          return;
        }

        // กู้คืนข้อมูล
        if (savedData.score) setScore(savedData.score);
        if (savedData.level && savedData.level > 1) setUnlockedLevel(savedData.level);

        // ถ้าเลือกตัวละครแล้ว ข้ามไป Map
        if (savedData.charId) {
             const char = DEALERS.find(d => d.id === savedData.charId);
             if (char) {
                 setDealer(char);
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

  // --- TIMER ---
  useEffect(() => {
    if (gameState === "PLAYING" && timeLeft > 0) {
      timerRef.current = setInterval(() => {
        setTimeLeft(t => {
          if (t <= 1) {
            handleGameOver("หมดเวลา! ดีลเลอร์ปิดโต๊ะแล้ว");
            return 0;
          }
          return t - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timerRef.current);
  }, [gameState, timeLeft]);

  // --- ACTIONS ---
  const generateUniqueCards = (count) => {
    const nums = new Set();
    while (nums.size < count) {
      nums.add(Math.floor(Math.random() * 99) + 1);
    }
    return Array.from(nums);
  };

  const handleSelectDealer = (d) => {
    playSound("click");
    setDealer(d);
    setScore(0);
    scoreRef.current = 0;
    saveProgressToStorage({ charId: d.id });
    setGameState("MAP");
  };

  const handleSelectLevel = (idx) => {
    // เล่นได้เฉพาะด่านปัจจุบัน (ด่านที่ผ่านมาแล้วเล่นซ้ำไม่ได้)
    if (idx + 1 !== unlockedLevel) return;

    playSound("click");
    setLevelIdx(idx);
    setGameState("RULES");
  };

  const startGame = () => {
    playSound("click");
    const lvl = LEVELS[levelIdx];
    const newCards = generateUniqueCards(lvl.count);
    setCards(newCards);
    
    setSortedIndex(0);
    setKeyIndex(1);
    setCompareIndex(0);
    setIsProcessing(false);

    setHp(dealer.hp);
    setTimeLeft(lvl.time + dealer.bonusTime);
    
    if (dealer.id === 'accountant') {
        setInsurance(2); 
    } else {
        setInsurance(0);
    }

    setFeedback(`เริ่มเกม! Key Card ใบที่ 2 คือ ${newCards[1]}`);
    setGameState("PLAYING");
  };

  const updateScore = (points) => {
    setScore(prev => prev + points);
    scoreRef.current += points;
  };

  // --- GAME LOGIC ---
  const handleAction = (action) => {
    if (isProcessing) return; 

    const isAsc = LEVELS[levelIdx].order === "ASC";
    const keyVal = cards[keyIndex];
    const compareVal = cards[compareIndex];
    const needShift = isAsc ? (keyVal < compareVal) : (keyVal > compareVal);

    if (action === "SHIFT") {
        if (needShift) {
            playSound("swap"); // 🔊
            const newCards = [...cards];
            [newCards[compareIndex], newCards[compareIndex+1]] = [newCards[compareIndex+1], newCards[compareIndex]];
            setCards(newCards);
            setKeyIndex(keyIndex - 1);
            
            if (compareIndex > 0) {
                setCompareIndex(compareIndex - 1);
                setFeedback("Shift แล้ว! เทียบตัวต่อไป...");
            } else {
                setFeedback("สุดทางแล้ว! กด INSERT เพื่อวาง");
            }
            updateScore(10);
        } else {
            playSound("wrong"); // 🔊
            handleMistake("ผิด! ตำแหน่งนี้ถูกต้องแล้ว (ต้อง Insert)");
        }
    } 
    else if (action === "INSERT") {
        if (!needShift) {
            playSound("correct"); // 🔊
            updateScore(20); 
            setFeedback("✅ ถูกต้อง! วางไพ่สำเร็จ..."); 
            setIsProcessing(true); 

            setTimeout(() => {
                nextRound();
            }, 1000); 
        } else {
            playSound("wrong"); // 🔊
            handleMistake("ผิด! ยังสลับได้อีก (ต้อง Shift)");
        }
    }
  };

  const nextRound = () => {
    const nextLimit = sortedIndex + 1;
    if (nextLimit >= cards.length) {
        setSortedIndex(nextLimit); 
        setKeyIndex(-1); 
        setCompareIndex(-1);
        setFeedback("🎉 ยินดีด้วย! เรียงไพ่ครบทุกใบแล้ว!");
        
        setTimeout(() => {
            handleWin();
            setIsProcessing(false); 
        }, 1500);
    } else {
        setSortedIndex(nextLimit);
        setKeyIndex(nextLimit + 1);
        setCompareIndex(nextLimit);
        setFeedback(`🃏 Key Card ใบใหม่มาแล้ว: ${cards[nextLimit + 1]}`);
        setIsProcessing(false); 
    }
  };

  const handleMistake = (msg) => {
    if (insurance > 0) {
        setInsurance(prev => prev - 1);
        setFeedback(`🛡️ โล่ทำงาน! ป้องกันความเสียหาย (เหลือ ${insurance - 1})`);
        return; 
    }
    setFeedback(`❌ ${msg}`);
    setHp(prev => {
        const newHp = prev - 1;
        if (newHp <= 0) handleGameOver("พลังชีวิตหมด! คุณแพ้เดิมพัน");
        return newHp;
    });
  };

  const saveScoreToSheet = async (finalScore) => {
    try {
        const user = JSON.parse(localStorage.getItem("user")) || {};
        const payload = {
            activity: "GAMES",
            firstname: user.firstname || "Guest",
            lastname: user.lastname || "-",
            gameName: "Insertion Casino (Toon)",
            score: finalScore
        };
        await fetch(SCORE_API, {
            method: "POST",
            body: JSON.stringify(payload),
            headers: { "Content-Type": "text/plain;charset=utf-8" }
        });
    } catch (e) { console.error("Save failed", e); }
  };

  const handleWin = () => {
    playSound("win"); // 🔊
    let finalScore = scoreRef.current + (hp * 50) + timeLeft;
    setScore(finalScore);
    scoreRef.current = finalScore;

    // บันทึกความก้าวหน้า
    const nextLvl = levelIdx + 2;
    const updateData = { score: finalScore };
    if (nextLvl > unlockedLevel) {
        setUnlockedLevel(prev => Math.max(prev, nextLvl));
        updateData.level = nextLvl;
    }
    saveProgressToStorage(updateData);

    if (levelIdx === LEVELS.length - 1) {
        saveScoreToSheet(finalScore);
        saveProgressToStorage({ game: true, level: LEVELS.length + 1 });
    }

    setGameState("FINISH");
  };

  const handleGameOver = (msg) => {
    playSound("wrong"); // 🔊
    setFeedback(msg);
    setGameState("GAMEOVER");
  };

  const renderCard = (val, idx) => {
    let classes = "poker-card";
    
    if (idx <= sortedIndex) classes += " sorted";
    if (idx === keyIndex) {
        if (isProcessing) classes += " sorted"; 
        else classes = "poker-card key"; 
    }
    if (!isProcessing && idx === compareIndex) classes = "poker-card compare"; 
    if (gameState === "FINISH" || (sortedIndex >= cards.length)) {
        classes = "poker-card sorted";
    }

    return (
        <div key={idx} className={classes}>
            {val}
        </div>
    );
  };

  return (
    <MainLayout>
      <div className="casino-wrapper" style={{ backgroundImage: `url(${bgToonCasino})` }}>
        
        {gameState === "LOADING" && <div></div>}

        {/* ALREADY WIN */}
        {gameState === "ALREADY_WIN" && (
          <div className="casino-overlay fade-in">
             <div className="casino-panel" style={{maxWidth:'600px'}}>
                <div style={{fontSize:'5rem', marginBottom:'20px'}}>🏆</div>
                <h1 style={{color:'#E65100', textShadow:'2px 2px 0 #FFF'}}>MISSION COMPLETED</h1>
                <p style={{fontSize:'1.5rem', color:'#5D4037', fontWeight:'bold'}}>
                   คุณได้พิชิต Insertion Casino เรียบร้อยแล้ว!
                </p>
                <div style={{marginTop:'30px'}}>
                  <button className="casino-btn btn-back" onClick={() => navigate("/home")}>กลับหน้าหลัก</button>
                </div>
             </div>
          </div>
        )}

        {/* SELECT CHAR */}
        {gameState === "SELECT_CHAR" && (
            <div className="casino-panel fade-in">
                <div className="casino-header" style={{background:'none', border:'none', padding:0}}>
                    <h1 className="casino-title">INSERTION CASINO</h1>
                    <div className="casino-subtitle">The Dealer's Challenge</div>
                </div>

                <h2 style={{color:'#E65100', fontSize:'2.2rem'}}>เลือกดีลเลอร์ของคุณ</h2>
                <div className="dealer-grid">
                    {DEALERS.map(d => (
                        <div key={d.id} className="dealer-card" onClick={() => handleSelectDealer(d)}>
                            <img src={d.img} alt={d.name} className="dealer-img"/>
                            <div className="dealer-name">{d.name}</div>
                            {/* ✅ แสดงไอคอนสกิล */}
                            <div className="dealer-skill">
                                {d.iconSkill} {d.skill}
                            </div>
                            <div style={{fontSize:'0.8rem', color:'#795548', marginTop:'5px'}}>{d.desc}</div>
                        </div>
                    ))}
                </div>
            </div>
        )}

        {/* MAP */}
        {gameState === "MAP" && (
            <div className="casino-panel fade-in">
                <h2 style={{color:'#E65100', fontSize:'2.2rem'}}>เลือกโต๊ะพนัน</h2>
                <div style={{color:'#795548', fontWeight:'bold', fontSize:'1.5rem', marginBottom:'20px'}}>
                    คะแนนสะสม: {score}
                </div>

                <div className="map-container">
                    {LEVELS.map((lvl, idx) => {
                        const isCompleted = idx + 1 < unlockedLevel;
                        const isCurrent = idx + 1 === unlockedLevel;
                        const isLocked = idx + 1 > unlockedLevel;

                        let nodeClass = "map-node";
                        if (isCompleted) nodeClass += " completed";
                        if (isCurrent) nodeClass += " current";
                        if (isLocked) nodeClass += " locked";

                        return (
                            <React.Fragment key={lvl.id}>
                                <div 
                                    className={nodeClass}
                                    onClick={() => handleSelectLevel(idx)}
                                >
                                    {isCompleted ? "✔" : (isLocked ? "🔒" : lvl.id)}
                                </div>
                                {idx < LEVELS.length - 1 && <div className={`map-line ${idx + 2 <= unlockedLevel ? 'active' : ''}`}></div>}
                            </React.Fragment>
                        )
                    })}
                </div>
            </div>
        )}

        {/* RULES */}
        {gameState === "RULES" && (
            <div className="casino-overlay fade-in">
                <div className="casino-panel" style={{maxWidth:'600px'}}>
                    <h2 style={{color:'#E65100', fontSize:'2.5rem'}}>📜 กติกา: {LEVELS[levelIdx].name}</h2>
                    <div style={{textAlign:'left', fontSize:'1.3rem', lineHeight:'2', margin:'30px', color:'#5D4037', fontWeight:'500'}}>
                        <p>🎯 <strong>เป้าหมาย:</strong> {LEVELS[levelIdx].desc}</p>
                        <p>🃏 <strong>Key Card (สีทอง):</strong> ไพ่ที่คุณถืออยู่</p>
                        <p>🔴 <strong>Compare (สีแดง):</strong> ไพ่ที่กำลังเปรียบเทียบ</p>
                        <p>⬅️ <strong>SHIFT:</strong> กดเมื่อไพ่ผิดลำดับ (ต้องสลับ)</p>
                        <p>⬇️ <strong>INSERT:</strong> กดเมื่อตำแหน่งถูกต้อง (วาง)</p>
                    </div>
                    <button className="casino-btn btn-insert" onClick={startGame}>เริ่มเดิมพัน!</button>
                </div>
            </div>
        )}

        {/* GAMEPLAY */}
        {gameState === "PLAYING" && (
            <div style={{width:'95%', maxWidth:'1200px'}} className="fade-in">
                <div className="hud-container">
                    <div style={{display:'flex', gap:'15px', alignItems:'center'}}>
                        <img src={dealer.img} style={{width:'70px', borderRadius:'50%', border:'3px solid #FFB300', backgroundColor:'#FFF'}}/>
                        <div>
                            <div style={{color:'#E65100', fontWeight:'900', fontSize:'1.3rem'}}>{dealer.name}</div>
                            <div style={{fontSize:'1rem', color:'#795548'}}>
                                {dealer.iconSkill} {dealer.skill.split("(")[0]}
                            </div>
                        </div>
                    </div>
                    <div style={{fontSize:'2.5rem', color:'#FF6F00', fontWeight:'900', textShadow:'1px 1px 0 #FFF'}}>
                        ⏰ {timeLeft}
                    </div>
                    <div style={{textAlign:'right'}}>
                        <div style={{color:'#009688', fontSize:'1.3rem'}}>Score: {score}</div>
                        <div style={{color:'#FF5252', fontSize:'1.8rem'}}>
                            {'❤️'.repeat(hp)} 
                            {insurance > 0 && <span style={{fontSize:'1.2rem', marginLeft:'10px', color:'#1976D2'}}>🛡️x{insurance}</span>}
                        </div>
                    </div>
                </div>

                {/* ✅ โจทย์ช่วยจำ (แสดงตลอดเวลา) */}
                <div className="level-rule-display">
                    โจทย์: {LEVELS[levelIdx].desc}
                </div>

                <div className="game-legend">
                    <div className="legend-item">
                        <div className="legend-box key"></div>
                        <span>Key Card (สีทอง): ไพ่ที่คุณถืออยู่</span>
                    </div>
                    <div className="legend-item">
                        <div className="legend-box compare"></div>
                        <span>Compare (สีแดง): ไพ่ที่กำลังเปรียบเทียบ</span>
                    </div>
                </div>

                <div className="table-area">
                    {/* ✅ แก้ไข class สำหรับข้อความ Feedback */}
                    <div className="feedback-message">
                        {feedback}
                    </div>
                    <div className="card-row">
                        {cards.map((val, idx) => renderCard(val, idx))}
                    </div>
                </div>

                <div className="control-bar" style={{justifyContent:'center'}}>
                    <button 
                        className="casino-btn btn-shift" 
                        onClick={() => handleAction("SHIFT")}
                        disabled={isProcessing} 
                        style={{opacity: isProcessing ? 0.5 : 1}}
                    >
                        ⬅️ SHIFT
                    </button>
                    <button 
                        className="casino-btn btn-insert" 
                        onClick={() => handleAction("INSERT")}
                        disabled={isProcessing} 
                        style={{opacity: isProcessing ? 0.5 : 1}}
                    >
                        ⬇️ INSERT
                    </button>
                </div>
            </div>
        )}

        {/* FINISH / GAMEOVER */}
        {(gameState === "FINISH" || gameState === "GAMEOVER") && (
            <div className="casino-overlay fade-in">
                <div className="casino-panel">
                    <h1 style={{fontSize:'4.5rem', margin:'0', color: gameState==="FINISH" ? '#43A047' : '#E53935', textShadow:'2px 2px 0 #FFF'}}>
                        {gameState === "FINISH" ? "WINNER!" : "GAME OVER"}
                    </h1>
                    
                    <p style={{fontSize:'1.6rem', color:'#795548', fontWeight:'bold'}}>
                        {gameState === "FINISH" ? "ยินดีด้วย! คุณชนะเดิมพันโต๊ะนี้" : "เสียใจด้วย โชคของคุณหมดแล้ว..."}
                    </p>
                    <div style={{fontSize:'3.5rem', fontWeight:'900', color:'#E65100', margin:'20px 0', textShadow:'1px 1px 0 #FFF'}}>
                        Score: {score}
                    </div>
                    <div className="control-bar" style={{justifyContent:'center'}}>
                        <button className="casino-btn btn-back" onClick={() => navigate("/home")}>กลับหน้าหลัก</button>
                        {gameState === "FINISH" && levelIdx < 2 && (
                            <button className="casino-btn btn-insert" onClick={() => setGameState("MAP")}>ด่านถัดไป ➡️</button>
                        )}
                        {gameState === "GAMEOVER" && (
                            <button className="casino-btn btn-insert" onClick={() => setGameState("MAP")}>ลองใหม่ 🔄</button>
                        )}
                    </div>
                </div>
            </div>
        )}

      </div>
    </MainLayout>
  );
}