import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import MainLayout from "../../layouts/MainLayout";

// ASSETS
import bgMining from "../../assets/bg-quick.png"; 
import charArin from "../../assets/q1.png";       
import charLuna from "../../assets/q2.png";     
import charMira from "../../assets/q3.png";   
 
import "../../styles/quick-game.css";

const LESSON_KEY = "quicksort_mining_final";

const CHARACTERS = [
  { 
    id: "arin", 
    nameEn: "Arin Goldhand", 
    nameTh: "อาริน มือทอง", 
    skill: "Time++", 
    skillIcon: "⏳",
    // เน้นตัวเลขเวลาที่เพิ่มขึ้นชัดเจน
    desc: "⚡ เพิ่มเวลาในการขุดแร่ให้อีก 40 วินาที", 
    hp: 3, 
    timeBonus: 40, 
    color: "#ffca28", 
    img: charArin 
  },
  { 
    id: "luna", 
    nameEn: "Luna Ember", 
    nameTh: "ลูน่า เอ็มเบอร์", 
    skill: "Hybrid", 
    skillIcon: "⚖️",
    // บอกทั้งค่าเวลาและจำนวนครั้งที่พลาดได้
    desc: "✨ เพิ่มเวลา 20 วินาที และป้องกันความผิดพลาดได้ 4 ครั้ง", 
    hp: 4, 
    timeBonus: 20, 
    color: "#4fc3f7", 
    img: charLuna 
  },
  { 
    id: "mira", 
    nameEn: "Mira Stonewhisper", 
    nameTh: "มิร่า สโตนวิสเปอร์", 
    skill: "HP++", 
    skillIcon: "🛡️",
    // เน้นจำนวนครั้งที่พลาดได้สูงสุด
    desc: "🪨 ป้องกันความผิดพลาดจากการขุดได้สูงสุด 5 ครั้ง", 
    hp: 5, 
    timeBonus: 0, 
    color: "#ab47bc", 
    img: charMira 
  }
];
const LEVELS = [
  { id: 1, name: "ด่านที่ 1: เหมืองเริ่มต้น", count: 5, baseTime: 60 },
  { id: 2, name: "ด่านที่ 2: หุบเขาพาร์ทิชัน", count: 7, baseTime: 90 },
  { id: 3, name: "ด่านที่ 3: ปริศนาศิลาสุดท้าย", count: 10, baseTime: 120 }
];

export default function QuickSortGame() {
  const navigate = useNavigate();
  const timerRef = useRef(null);

  // --- STATES ---
  const [gameState, setGameState] = useState("SELECT_CHAR"); 
  const [selectedChar, setSelectedChar] = useState(null);
  const [completedLevels, setCompletedLevels] = useState([]); 
  const [score, setScore] = useState(0);
  const [hp, setHp] = useState(3);
  const [timeLeft, setTimeLeft] = useState(0);

  // Gameplay
  const [currentLevel, setCurrentLevel] = useState(null);
  const [array, setArray] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [currentTask, setCurrentTask] = useState(null);
  const [pivotIdx, setPivotIdx] = useState(null);
  const [compareIdx, setCompareIdx] = useState(null);
  const [leftSide, setLeftSide] = useState([]);
  const [rightSide, setRightSide] = useState([]);
  const [sortedIndices, setSortedIndices] = useState(new Set());

  // Restore Progress
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user")) || {};
    const key = `progress_${user.id || "guest"}_${LESSON_KEY}`;
    const saved = JSON.parse(localStorage.getItem(key));
    if (saved) {
      if (saved.completedLevels) setCompletedLevels(saved.completedLevels);
      if (saved.score) setScore(saved.score);
      if (saved.charId) {
        setSelectedChar(CHARACTERS.find(c => c.id === saved.charId));
        setGameState("MAP");
      }
    }
  }, []);

  // --- CORE LOGIC ---
  const handleSelectChar = (char) => {
    setSelectedChar(char);
    setGameState("MAP");
  };

  const clickLevel = (lvl) => {
    if (completedLevels.includes(lvl.id)) return;
    setCurrentLevel(lvl);
    setGameState("RULES"); // แสดงกติกาก่อนทุกด่าน
  };

  const startGame = () => {
    const newArr = Array.from({ length: currentLevel.count }, () => Math.floor(Math.random() * 95) + 1);
    setArray(newArr);
    setTasks([{ low: 0, high: currentLevel.count - 1 }]);
    setSortedIndices(new Set());
    setHp(selectedChar.hp);
    setTimeLeft(currentLevel.baseTime + selectedChar.timeBonus);
    setPivotIdx(null);
    setGameState("PLAYING");
  };

  // Quick Sort Cycle
  useEffect(() => {
    if (gameState === "PLAYING" && tasks.length > 0 && pivotIdx === null) {
      setCurrentTask(tasks[0]);
    } else if (gameState === "PLAYING" && tasks.length === 0) {
      const nextDone = [...completedLevels, currentLevel.id];
      setCompletedLevels(nextDone);
      setScore(s => s + 200);
      setGameState(nextDone.length === 3 ? "WIN" : "MAP");
    }
  }, [tasks, gameState, pivotIdx]);

  const selectPivot = (idx) => {
    if (gameState !== "PLAYING" || pivotIdx !== null) return;
    setPivotIdx(idx);
    let f = currentTask.low; if (f === idx) f++;
    setCompareIdx(f);
    setGameState("PARTITIONING");
  };

  const handlePartition = (side) => {
    const pVal = array[pivotIdx];
    const cVal = array[compareIdx];
    const isCorrect = (side === "LEFT" && cVal < pVal) || (side === "RIGHT" && cVal >= pVal);
    if (isCorrect) {
      if (side === "LEFT") setLeftSide(p => [...p, cVal]);
      else setRightSide(p => [...p, cVal]);
      let n = compareIdx + 1; if (n === pivotIdx) n++;
      if (n > currentTask.high) setGameState("MERGING");
      else setCompareIdx(n);
    } else {
      setHp(h => h <= 1 ? (setGameState("GAMEOVER"), 0) : h - 1);
    }
  };

  const finalizeStep = () => {
    const pVal = array[pivotIdx];
    const sub = [...leftSide, pVal, ...rightSide];
    const main = [...array];
    sub.forEach((v, i) => { main[currentTask.low + i] = v; });
    const pos = currentTask.low + leftSide.length;
    setSortedIndices(prev => new Set(prev).add(pos));
    setArray(main);
    setTasks(prev => [...[{low: currentTask.low, high: pos-1}, {low: pos+1, high: currentTask.high}].filter(t => t.low < t.high), ...prev.slice(1)]);
    setLeftSide([]); setRightSide([]); setPivotIdx(null); setGameState("PLAYING");
  };

  return (
    <MainLayout>
      <div className="mining-app-container" style={{ backgroundImage: `url(${bgMining})` }}>
        <div className="content-layer">
          
          {/* 💊 HUD CAPSULE */}
          {(gameState === "PLAYING" || gameState === "PARTITIONING" || gameState === "MERGING") && (
            <div className="hud-capsule fade-in">
               <div>❤️ {hp}</div>
               <div className="timer-pill">⏳ {timeLeft}s</div>
               <div>💎 {score}</div>
            </div>
          )}

          {/* 👤 CHARACTER SELECT */}
          {gameState === "SELECT_CHAR" && (
            <div className="centered-selection fade-in">
              <h1 className="neon-title">QuickSort Master Miner</h1>
              <h2 className="neon-title1">ยอดนักขุดเหมือง</h2>
              
              <div className="char-grid-balanced">
                {CHARACTERS.map(c => (
                  <div 
                    key={c.id} 
                    className="mining-char-card premium-card" 
                    onClick={() => handleSelectChar(c)}
                    style={{ '--char-color': c.color }}
                  >
                    {/* ส่วนแสดงรูปภาพพร้อมเอฟเฟกต์ออร่าพื้นหลัง */}
                    <div className="card-image-wrapper">
                      <img src={c.img} alt={c.nameEn} />
                    </div>

                    <div className="card-content">
                      <div className="name-tag">
                        <p className="en">{c.nameEn}</p>
                        <p className="th">{c.nameTh}</p>
                      </div>

                      {/* ✅ เพิ่มส่วนคำอธิบายรายละเอียดของตัวละคร */}
                      <p className="char-desc">{c.desc}</p>

                      <div 
                        className="skill-badge" 
                        style={{
                          background: c.color, 
                          color: '#000', 
                          padding: '4px 15px', 
                          borderRadius: '10px', 
                          marginTop: '10px', 
                          fontSize: '0.85rem', 
                          fontWeight: '900',
                          display: 'inline-block',
                          boxShadow: `0 0 15px ${c.color}66`
                        }}
                      >
                        {c.skillIcon} {c.skill}
                      </div>
                    </div>

                    {/* ✅ เพิ่มลูกเล่น Shimmer แสงวิ่งผ่านการ์ดเมื่อ Hover */}
                    <div className="shimmer"></div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 📜 RULES MODAL */}
          {gameState === "RULES" && (
            <div className="rules-overlay">
              <div className="rules-card-fixed fade-in">
                <div className="rules-body">
                  <h2>📜 MISSION RULES</h2>
                  <p>1. เลือก <b>Pivot</b> จากกลุ่มหินเป้าหมาย</p>
                  <p>2. แยกหิน: <b>น้อยกว่า</b> ไปซ้าย / <b>มากกว่า</b> ไปขวา</p>
                  <p>3. วาง Pivot เพื่อล็อกตำแหน่ง (สีเขียว)</p>
                </div>
                <div className="rules-footer">
                  <button className="btn-start-mission" onClick={startGame}>START MISSION</button>
                </div>
              </div>
            </div>
          )}

          {/* 🚚 MAP TRACK - ปรับปรุงใหม่ให้รถทับราง */}
          {/* --- 🛤️ MINING PATH: WIDE & BREATHE EDITION --- */}
{gameState === "MAP" && (
  <div className="mining-map-wrapper fade-in">
    {/* ส่วนหัวข้อ: ดันขึ้นด้านบนเล็กน้อย */}
    <div className="map-header-group">
      <h1 className="main-title-gold">QuickSort Master Miner</h1>
      <h2 className="sub-title-silver">ยอดนักขุดเหมือง</h2>
      
      <div className="score-capsule-v4">
        <span className="gem-icon">💎</span> 
        <span className="score-text">คะแนนสะสม: {score}</span>
      </div>
    </div>

    {/* ระบบรางรถไฟ: ขยายให้กว้าง (90%) เพื่อไม่ให้อึดอัด */}
    <div className="railway-system-v4">
      
      {/* 🛒 รถขนแร่: วางทับบนราง (ล้อทับเส้นพอดี) */}
      <div 
        className="mine-cart-v4" 
        style={{ left: `${(completedLevels.length / (LEVELS.length - 1)) * 100}%` }}
      >
        <div className="cart-visual">🛒</div>
      </div>

      {/* 🛤️ รางเหล็ก */}
      <div className="master-rail-v4">
        {/* เส้นความคืบหน้า */}
        <div 
          className="rail-progress-v4" 
          style={{ width: `${(completedLevels.length / (LEVELS.length - 1)) * 100}%` }}
        ></div>

        {/* จุดด่าน: กระจายตัวเต็มความกว้าง */}
        {LEVELS.map((lvl, idx) => {
          const isDone = completedLevels.includes(lvl.id);
          const isCurrent = completedLevels.length === idx;
          const isLocked = idx > completedLevels.length;

          return (
            <div 
              key={lvl.id} 
              className={`node-container-v4 ${isDone ? 'done' : ''} ${isCurrent ? 'active' : ''} ${isLocked ? 'locked' : ''}`}
              style={{ left: `${(idx / (LEVELS.length - 1)) * 100}%` }}
            >
              <button 
                className="node-button-v4"
                onClick={() => clickLevel(lvl)}
                disabled={isLocked}
              >
                {isLocked ? "🔒" : isDone ? "💎" : lvl.id}
                {isCurrent && <div className="active-glow-aura"></div>}
              </button>
              
              {/* ชื่อด่าน: จัดวางไม่ให้ทับกัน */}
              <div className="node-label-v4">
                <p className="node-title-text">{lvl.name}</p>
                {isCurrent && <p className="status-tag">ด่านปัจจุบัน</p>}
              </div>
            </div>
          );
        })}
      </div>
    </div>

    {/* คำแนะนำด้านล่างสุด: ดันลงไปให้ห่างจากราง */}
    <div className="map-footer-v4">
       คลิกที่ด่านปัจจุบันเพื่อเริ่มภารกิจขุดแร่
    </div>
  </div>
)}

          {/* 🎮 GAMEPLAY */}
          {(gameState === "PLAYING" || gameState === "PARTITIONING" || gameState === "MERGING") && (
            <div className="tree-game-layout fade-in">
               <div className="level-row main" style={{display: 'flex', gap: '10px'}}>
                  {array.map((v, i) => (
                    <div key={i} className={`stone ${pivotIdx===i?'pivot':''} ${sortedIndices.has(i)?'sorted':''} ${currentTask && i>=currentTask.low && i<=currentTask.high?'':'dim'}`}
                      onClick={() => selectPivot(i)}>{v}</div>
                  ))}
               </div>

               {gameState !== "PLAYING" && (
                 <div className="recursion-branches fade-in" style={{display: 'flex', width: '100%', justifyContent: 'space-around', marginTop: '50px'}}>
                    <div className="branch">
                       <p>{"< Pivot"}</p>
                       <div style={{display: 'flex', gap: '5px'}}>{leftSide.map((v,i) => <div key={i} className="stone" style={{width: '40px', height: '50px', fontSize: '1rem'}}>{v}</div>)}</div>
                    </div>
                    <div className="center">
                       {gameState === "PARTITIONING" ? (
                         <div style={{textAlign: 'center'}}>
                            <div className="stone pivot" style={{fontSize: '2rem', width: '80px', height: '100px', margin: '0 auto 20px'}}>{array[compareIdx]}</div>
                            <button onClick={() => handlePartition("LEFT")}>⬅️</button>
                            <button onClick={() => handlePartition("RIGHT")}>➡️</button>
                         </div>
                       ) : <button onClick={finalizeStep}>PLACE PIVOT ✨</button>}
                    </div>
                    <div className="branch">
                       <p>{">= Pivot"}</p>
                       <div style={{display: 'flex', gap: '5px'}}>{rightSide.map((v,i) => <div key={i} className="stone" style={{width: '40px', height: '50px', fontSize: '1rem'}}>{v}</div>)}</div>
                    </div>
                 </div>
               )}
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  );
}