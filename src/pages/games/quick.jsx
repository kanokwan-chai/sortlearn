import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import MainLayout from "../../layouts/MainLayout";

// --- ASSETS ---
import bgMining from "../../assets/bg-quick.png";
import charArin from "../../assets/q1.png";
import charLuna from "../../assets/q2.png";
import charMira from "../../assets/q3.png";

import sfxClick from "../../assets/sounds/click.mp3";
import sfxCorrect from "../../assets/sounds/correct.mp3";
import sfxWrong from "../../assets/sounds/wrong.mp3";
import sfxWin from "../../assets/sounds/win.mp3";

import "../../styles/quick-game.css";

// --- CONSTANTS ---
const SCORE_API = "https://script.google.com/macros/s/AKfycbxaSnMhAZYVgAwDS7VOgJuINzO2Wn3r8EBMPMFt84nbjy4tn-O5i6OUQIHj19L9jFNJ/exec";

const CHARACTERS = [
  { id: "arin", nameEn: "Arin Goldhand", nameTh: "อาริน มือทอง", desc: "⚡ เพิ่มเวลาขุดแร่ +40 วินาที", hp: 3, timeBonus: 40, color: "#ffca28", img: charArin },
  { id: "luna", nameEn: "Luna Ember", nameTh: "ลูน่า เอ็มเบอร์", desc: "⚖️ HP 4 และเพิ่มเวลา +20 วินาที", hp: 4, timeBonus: 20, color: "#4fc3f7", img: charLuna },
  { id: "mira", nameEn: "Mira Stonewhisper", nameTh: "มิร่า สโตนวิสเปอร์", desc: "🛡️ ป้องกันความผิดพลาดได้ 5 ครั้ง", hp: 5, timeBonus: 0, color: "#ab47bc", img: charMira }
];

const LEVELS = [
  { id: 1, name: "ด่านที่ 1: เหมืองเริ่มต้น", count: 5, baseTime: 60, task: "เรียงลำดับจาก น้อย ➡️ มาก" },
  { id: 2, name: "ด่านที่ 2: หุบเขาพาร์ทิชัน", count: 7, baseTime: 90, task: "เรียงลำดับจาก มาก ➡️ น้อย" },
  { id: 3, name: "ด่านที่ 3: ปริศนาศิลาสุดท้าย", count: 12, baseTime: 150, task: "เรียงลำดับจาก น้อย ➡️ มาก (ระดับความยากเพิ่มขึ้น)" }
];

// --- HELPER: SOUND ---
const playSound = (audioFile) => {
  if (!audioFile) return;
  const audio = new Audio(audioFile);
  audio.play().catch(() => { });
};

export default function QuickSortGame() {
  const navigate = useNavigate();

  // --- STATES ---
  const [gameState, setGameState] = useState("SELECT_CHAR");
  const [selectedMiner, setSelectedMiner] = useState(null);
  const [selectedLevel, setSelectedLevel] = useState(null);
  const [completedLevels, setCompletedLevels] = useState([]);
  const [score, setScore] = useState(0);
  const [hp, setHp] = useState(3);
  const [timeLeft, setTimeLeft] = useState(0);
  const [resultStatus, setResultStatus] = useState(null);
  const [gameOverReason, setGameOverReason] = useState("");

  const [array, setArray] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [currentTask, setCurrentTask] = useState(null);
  const [pivotIdx, setPivotIdx] = useState(null);
  const [leftPtr, setLeftPtr] = useState(null);
  const [rightPtr, setRightPtr] = useState(null);
  const [sortedIndices, setSortedIndices] = useState(new Set());

  // --- TIMER ---
  useEffect(() => {
    let timer;
    const activeStates = ["PLAYING", "MOVE_LEFT", "MOVE_RIGHT", "CHECK_SWAP", "FINAL_SWAP"];
    if (activeStates.includes(gameState) && timeLeft > 0) {
      timer = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
    } else if (timeLeft === 0 && activeStates.includes(gameState)) {
      handleGameOver("TIME_UP");
    }
    return () => clearInterval(timer);
  }, [timeLeft, gameState]);

  // --- HANDLERS ---
  const handleSelectChar = (char) => {
    playSound(sfxClick);
    setSelectedMiner(char);
    setGameState("MAP");
  };

  const clickLevel = (lvl) => {
    playSound(sfxClick);
    setSelectedLevel(lvl);
    setGameState("LEVEL_INTRO");
  };

  // --- Updated CORE QUICK SORT LOGIC ---

// 1. ฟังก์ชันเริ่มเกม (Initialization)
const startGame = () => {
  playSound(sfxClick);
  setHp(selectedMiner.hp);
  setTimeLeft(selectedLevel.baseTime + selectedMiner.timeBonus);
  setScore(0);

  const newArr = Array.from(
    { length: selectedLevel.count },
    () => Math.floor(Math.random() * 95) + 1
  );

  setArray(newArr);
  // เริ่มต้นด้วย Task แรกคือทั้ง Array
  setTasks([{ low: 0, high: newArr.length - 1 }]);
  setCurrentTask(null);
  setPivotIdx(null);
  setLeftPtr(null);
  setRightPtr(null);
  setGameState("PLAYING");
};

// 2. จัดการคิวของ Task (Main Loop - Watcher)
useEffect(() => {
  if (gameState !== "PLAYING") return;

  // ถ้ายังไม่มี task ปัจจุบัน → ดึง task ใหม่
  if (!currentTask && tasks.length > 0) {
    const next = tasks[0];

    setTasks(prev => prev.slice(1));

    if (next.low < next.high) {
      setCurrentTask(next);
    } else {
      setCurrentTask(null);
    }
  }

  // 🔥 ชนะเมื่อไม่มี task จริงๆ
  if (!currentTask && tasks.length === 0 && array.length > 0) {
    handleWinLevel();
  }

}, [tasks, currentTask, gameState]);


// 3. เลือก Pivot (ต้องเป็นตัวสุดท้ายของช่วงปัจจุบัน)
const selectPivot = (idx) => {
  if (gameState !== "PLAYING" || !currentTask) return;

  if (idx !== currentTask.high) {
    playSound(sfxWrong);
    decreaseHp();
    return;
  }

  playSound(sfxCorrect);
  setPivotIdx(idx);
  setLeftPtr(currentTask.low);
  setRightPtr(currentTask.high - 1);
  setGameState("MOVE_LEFT");
};

const handlePointerAction = (action) => {
  if (pivotIdx === null || !currentTask) return;

  const pivotVal = array[pivotIdx];
  const isAsc = selectedLevel.id !== 2;

  // ---------------- LEFT POINTER (L) ----------------
  if (gameState === "MOVE_LEFT") {
    const val = array[leftPtr];
    const shouldMove = isAsc ? val < pivotVal : val > pivotVal;

    if (action === "MOVE") {
      // L วิ่งไปได้จนถึงตัวก่อน Pivot (high)
      if (leftPtr < currentTask.high) {
        playSound(sfxClick);
        setLeftPtr(prev => prev + 1);
      }
    }
    else if (action === "STOP") {
      if (!shouldMove || leftPtr === currentTask.high) {
        playSound(sfxCorrect);
        setGameState("MOVE_RIGHT"); // หยุดแล้วไปให้ R วิ่งต่อ
      } else {
        decreaseHp(); // ค่ายังน้อยกว่า Pivot ต้องวิ่งต่อสิ!
      }
    }
  }

  // ---------------- RIGHT POINTER (R) ----------------
  else if (gameState === "MOVE_RIGHT") {
    const val = array[rightPtr];
    const shouldMove = isAsc ? val > pivotVal : val < pivotVal;

    if (action === "MOVE") {
      // ตรงนี้คือสิ่งที่คุณต้องการ: R สามารถวิ่งสวน L ไปทางซ้ายได้ (ไปจนถึง low)
      if (rightPtr > currentTask.low) {
        playSound(sfxClick);
        setRightPtr(prev => prev - 1);
      } else {
        // ถ้าวิ่งจนสุดทางซ้ายแล้วยังไม่เจอค่าที่ต้องหยุด ให้ไป Final Swap
        setGameState("FINAL_SWAP");
      }
    }
    else if (action === "STOP") {
      if (!shouldMove) {
        playSound(sfxCorrect);
        
        // --- จุดตัดสินใจ (Decision Point) ---
        if (leftPtr < rightPtr) {
          // ถ้ายังไม่สวนกัน (เหมือนรูปที่ 1) -> ให้สลับ L กับ R
          setGameState("CHECK_SWAP");
        } else {
          // ถ้าสวนกันแล้ว (เหมือนรูปที่ 2) -> ให้ไปสลับ Pivot กับ L
          setGameState("FINAL_SWAP");
        }
      } else {
        decreaseHp(); // ค่ายังมากกว่า Pivot ต้องวิ่งต่อ!
      }
    }
  }
};

const executeSwap = (isFinal) => {
  const newArr = [...array];

  if (!isFinal) {
    // 🔁 สลับ L กับ R ตามปกติ
    [newArr[leftPtr], newArr[rightPtr]] = [newArr[rightPtr], newArr[leftPtr]];
    setArray(newArr);
    playSound(sfxCorrect);

    setLeftPtr(prev => prev + 1);
    setRightPtr(prev => prev - 1);
    setGameState("MOVE_LEFT");
  } 
  else {
    // ✨ FINAL SWAP: วาง Pivot ในตำแหน่ง L
    [newArr[leftPtr], newArr[pivotIdx]] = [newArr[pivotIdx], newArr[leftPtr]];
    setArray(newArr);
    playSound(sfxWin);

    const splitIdx = leftPtr; 
    const nextTasks = [];

    // --- ลอจิก: ทำซ้ายก่อนขวา ---
    // 1. ใส่ฝั่งขวาลงไปใน List ก่อน
    if (splitIdx + 1 < currentTask.high) {
      nextTasks.push({ low: splitIdx + 1, high: currentTask.high });
    }
    // 2. ใส่ฝั่งซ้ายตามลงไป 
    if (splitIdx - 1 > currentTask.low) {
      nextTasks.push({ low: currentTask.low, high: splitIdx - 1 });
    }

    // 3. เอาไปต่อ "ข้างหน้า" ของ tasks เดิม (LIFO Style)
    // เพื่อให้รอบหน้าเครื่องดึงเอา 'ฝั่งซ้ายล่าสุด' ออกมาทำก่อน
    setTasks(prev => [...nextTasks, ...prev]);

    // Reset สถานะสำหรับรอบถัดไป
    setPivotIdx(null);
    setLeftPtr(null);
    setRightPtr(null);
    setCurrentTask(null);
    setGameState("PLAYING");
  }
};


// Helper: ลดเลือด
const decreaseHp = () => {
  playSound(sfxWrong);
  setHp(h => {
    const newHp = h - 1;
    if (newHp <= 0) {
      handleGameOver("HP_ZERO");
      return 0;
    }
    return newHp;
  });
};

// 6. เพิ่มเงื่อนไขใน useEffect ของ CHECK_SWAP (Auto-Transition)
useEffect(() => {
  if (gameState === "CHECK_SWAP") {
    if (leftPtr >= rightPtr) {
      setGameState("FINAL_SWAP");
    }
  }
}, [gameState, leftPtr, rightPtr]);


// --- FUNCTIONS สำหรับจัดการสถานะ จบเกม/ชนะ ---

// 1. จัดการเมื่อแพ้ (เวลาหมด หรือ HP หมด)
const handleGameOver = (reason) => {
  playSound(sfxWrong);
  setGameOverReason(reason);
  setResultStatus("LOSE");
  setGameState("RESULTS");
};

// 2. จัดการเมื่อเรียงสำเร็จ (ชนะ)
const handleWinLevel = () => {
  playSound(sfxWin);
  setResultStatus("WIN");
  // เพิ่มคะแนนโบนัสเมื่อผ่านด่าน
  setScore(prev => prev + 500);
  // เก็บประวัติด่านที่ผ่านแล้ว
  setCompletedLevels(prev => [...prev, selectedLevel.id]);
  setGameState("RESULTS");
};

  return (
    <MainLayout>
      <div className="mining-app-container" style={{ backgroundImage: `url(${bgMining})` }}>
        <div className="content-layer">

          {/* 🛤️ HUD RAIL */}
          {["PLAYING", "MOVE_LEFT", "MOVE_RIGHT", "CHECK_SWAP", "FINAL_SWAP"].includes(gameState) && (
            <div className="hud-rail-wrapper fade-in">
              <div className="hud-rail-glass">
                <div className="rail-section"><div className="rail-badge">LV.{selectedLevel?.id || 1}</div></div>
                <div className="rail-divider"></div>
                <div className="rail-section">
                  <span className="rail-icon">❤️</span> <span className="rail-value">{hp}</span>
                  <span className="rail-icon pulse">⏳</span> <span className="rail-value gold">{timeLeft}s</span>
                  <span className="rail-icon">💎</span> <span className="rail-value blue">{score}</span>
                </div>
                <div className="rail-divider"></div>
                <div className="rail-section">
                  <span className="rail-value-text" style={{ color: selectedMiner?.color }}>{selectedMiner?.nameTh}</span>
                  <div className="rail-avatar-ring" style={{ borderColor: selectedMiner?.color }}>
                    <img src={selectedMiner?.img} alt="char" />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 👤 CHARACTER SELECTION */}
          {gameState === "SELECT_CHAR" && (
            <div className="centered-selection fade-in">
              <h1 className="neon-title">QuickSort Master Miner</h1>
              <h2 className="neon-title1">ยอดนักขุดเหมือง</h2>
              <div className="char-grid-balanced">
                {CHARACTERS.map(c => (
                  <div key={c.id} className="mining-char-card premium-card" onClick={() => handleSelectChar(c)} style={{ '--char-color': c.color }}>
                    <div className="card-image-wrapper"><img src={c.img} alt={c.nameEn} /></div>
                    <div className="card-content">
                      <div className="name-tag">
                        <p className="en">{c.nameEn}</p>
                        <p className="th">{c.nameTh}</p>
                      </div>
                      <p className="char-desc">{c.desc}</p>
                      <div className="skill-badge" style={{ background: c.color, color: '#000', padding: '4px 15px', borderRadius: '10px', marginTop: '10px', fontSize: '0.85rem', fontWeight: '900', display: 'inline-block', boxShadow: `0 0 15px ${c.color}66` }}>
                        {c.skillIcon} {c.skill}
                      </div>
                    </div>
                    <div className="shimmer"></div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 🗺️ MINING MAP */}
          {gameState === "MAP" && (
            <div className="mining-map-wrapper fade-in">
              <div className="map-header-zone">
                <h1 className="main-title-gold">QuickSort Master Miner</h1>
                <h2 className="sub-title-silver">ยอดนักขุดเหมือง</h2>
              </div>
              <div className="score-display-v6">
                <div className="score-capsule-v6">
                  <span className="gem-icon">💎</span>
                  <span className="score-text">คะแนนสะสม: {score}</span>
                </div>
              </div>
              <div className="rail-system-v6">
                <div className="truck-v6" style={{ left: `${(completedLevels.length / (LEVELS.length - 1)) * 100}%` }}>
                  <div className="truck-emoji">🚚</div>
                </div>
                <div className="master-rail-v6">
                  <div className="progress-fill-v6" style={{ width: `${(completedLevels.length / (LEVELS.length - 1)) * 100}%` }}></div>
                  {LEVELS.map((lvl, idx) => {
                    const isDone = completedLevels.includes(lvl.id);
                    const isCurrent = completedLevels.length === idx;
                    const isLocked = idx > completedLevels.length;
                    return (
                      <div key={lvl.id} className={`node-v6-box ${isDone ? 'done' : ''} ${isCurrent ? 'active' : ''}`} style={{ left: `${(idx / (LEVELS.length - 1)) * 100}%` }}>
                        <button className="node-btn-v6" onClick={() => !isLocked && clickLevel(lvl)} disabled={isLocked}>
                          {isDone ? "💎" : isLocked ? "🔒" : lvl.id}
                          {isCurrent && <div className="glow-ring-v6"></div>}
                        </button>
                        <div className="node-label-v6">
                          <p className="label-name">{lvl.name}</p>
                          {isCurrent && <p className="label-status">ด่านปัจจุบัน</p>}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
              <div className="map-footer-v7">คลิกที่ด่านปัจจุบันเพื่อเริ่มภารกิจ</div>
            </div>
          )}

          {/* 🎮 GAMEPLAY */}
{["PLAYING", "MOVE_LEFT", "MOVE_RIGHT", "CHECK_SWAP", "FINAL_SWAP"].includes(gameState) && (
  <div className="tree-game-layout fade-in">

    {/* 📜 Mission & Context */}
    <div className="mission-instruction-box">
      <div className="task-badge">ภารกิจปัจจุบัน</div>
      <p className="mission-text-display">
        {selectedLevel?.task} 
        {currentTask && <span className="range-text"> (ขอบเขตดัชนี: {currentTask.low} - {currentTask.high})</span>}
      </p>
    </div>

    {/* 💎 ARRAY DISPLAY */}
  <div className="level-row main">
  {array.map((v, i) => {
    const isPivot = i === pivotIdx;
    const isLeft = i === leftPtr;
    const isRight = i === rightPtr;
    const isOutOfRange = currentTask && (i < currentTask.low || i > currentTask.high);

    return (
      <div key={i} className="gem-container">
        {/* 1. Pivot Label (อยู่บนสุด) */}
        <div className={`pivot-label-area ${isPivot ? "active" : ""}`}>
          {isPivot ? "PIVOT" : ""}
        </div>

        {/* 2. กล่องตัวเลข */}
        <div
          className={`gem-stone ${isPivot ? "pivot" : ""} ${isOutOfRange ? "dimmed" : ""}`}
          onClick={() => gameState === "PLAYING" && selectPivot(i)}
        >
          <span>{v}</span>
        </div>

        {/* 3. Pointers (อยู่ล่างสุด) */}
        <div className="pointer-area">
          {isLeft && <div className="pointer-label left-p">⬆️ L</div>}
          {isRight && <div className="pointer-label right-p">⬆️ R</div>}
        </div>
      </div>
    );
  })}
</div>

    {/* 🎮 CONTROL PANEL */}
    <div className="logic-control-panel fade-in">
      
      {/* 💡 ACTION HINTS: แสดงคำแนะนำตามสถานะเกม */}
      <div className="status-message-box">
        {gameState === "PLAYING" && !currentTask && <div className="hint pulse">กำลังเตรียมข้อมูล...</div>}
        {gameState === "PLAYING" && currentTask && <div className="hint neon">เลือกค่าด้านขวาสุดเพื่อใช้เป็น Pivot ⛏️</div>}
        
        {gameState === "MOVE_LEFT" && (
          <div className="hint-group">
            <span className="icon">👉</span> 
            <span>พิจารณาฝั่ง <b>LEFT</b> (ค่า: {array[leftPtr]})</span>
            <small>ต้องหยุดเมื่อเจอค่าที่ {selectedLevel.id === 2 ? "น้อยกว่าหรือเท่ากับ" : "มากกว่าหรือเท่ากับ"} Pivot ({array[pivotIdx]})</small>
          </div>
        )}

        {gameState === "MOVE_RIGHT" && (
          <div className="hint-group">
            <span className="icon">👈</span> 
            <span>พิจารณาฝั่ง <b>RIGHT</b> (ค่า: {array[rightPtr]})</span>
            <small>ต้องหยุดเมื่อเจอค่าที่ {selectedLevel.id === 2 ? "มากกว่าหรือเท่ากับ" : "น้อยกว่าหรือเท่ากับ"} Pivot ({array[pivotIdx]})</small>
          </div>
        )}

        {gameState === "CHECK_SWAP" && <div className="hint gold-glow">ตรวจพบตัวเลขที่ผิดตำแหน่ง! กด "สลับ" เพื่อดำเนินการต่อ 🔁</div>}
        {gameState === "FINAL_SWAP" && <div className="hint win-glow">Pointer ชนกันแล้ว! วาง Pivot ลงในตำแหน่งที่ถูกต้อง ✨</div>}
      </div>

      {/* 🔹 BUTTONS: แสดงตามสถานะ */}
      <div className="control-actions-wrapper" style={{ display: 'flex', gap: '15px' }}>
    {/* ในส่วน Control Panel */}
{(gameState === "MOVE_LEFT" || gameState === "MOVE_RIGHT") && (
  <>
    <button className="btn-logic move-btn" onClick={() => handlePointerAction("MOVE")}>
      ➡️ ขยับต่อ
    </button>
    <button className="btn-logic stop-btn" onClick={() => handlePointerAction("STOP")}>
      ⛔ หยุดตรวจสอบ
    </button>
  </>
)}

    {gameState === "CHECK_SWAP" && (
      <button className="btn-logic swap-btn" onClick={() => executeSwap(false)}>
        🔁 สลับค่า L และ R
      </button>
    )}

    {gameState === "FINAL_SWAP" && (
      <button className="btn-logic final-btn" onClick={() => executeSwap(true)}>
        ✨ วางตำแหน่ง Pivot
      </button>
    )}
  </div>
</div>
  </div>
)}


          {/* 💎 LEVEL INTRO */}
          {gameState === "LEVEL_INTRO" && (
            <div className="mine-intro-overlay fade-in">
              <div className="mine-intro-card">
                <div className="level-medal"><span>LV.{selectedLevel?.id || "1"}</span></div>
                <h1 className="mine-title">{selectedLevel?.name}</h1>
                <div className="gold-divider"></div>
                <div className="mission-paper">
                  <div className="mission-label"><span>📜</span> ภารกิจหลัก</div>
                  <p className="mission-desc">ใช้ลอจิก <span className="highlight-word">QuickSort</span> คัดแยกหินแร่ โดยเปรียบเทียบกับค่า <span className="highlight-word">Pivot</span> ให้ถูกต้อง</p>
                  <div className="rule-box">⬅️ น้อยกว่า (ซ้าย) | มากกว่า (ขวา) ➡️</div>
                  <div className="tags-row">
                    <span className="tag-gold">🎯 Partitioning</span>
                    <span className="tag-dark">⚡ {selectedMiner?.skill}</span>
                  </div>
                </div>
                <button className="btn-gold-start" onClick={() => startGame()}><span className="btn-label">ลุยกันเลย! ⛏️</span></button>
                <div className="miner-footer">
                  <div className="miner-avatar-circle">{selectedMiner?.img && <img src={selectedMiner.img} alt="miner" />}</div>
                  <p><b>{selectedMiner?.nameTh}</b> พร้อมขุดเจาะแล้ว!</p>
                </div>
              </div>
            </div>
          )}

          {/* 🏆 RESULTS */}
          {gameState === "RESULTS" && (
            <div className="result-overlay fade-in">
              <div className={`result-card ${resultStatus === 'WIN' ? 'border-gold' : 'border-red'}`}>
                <h1 className={resultStatus === 'WIN' ? 'text-win' : 'text-lose'}>{resultStatus === 'WIN' ? 'MISSION SUCCESS' : 'MISSION FAILED'}</h1>
                <div className="stat-grid">
                  <div className="stat-item-box"><span>คะแนนจากการขุด</span><span className="val-total">{score}</span></div>
                </div>
                <div className="result-footer">
                  <button className="btn-retry" onClick={() => { playSound(sfxClick); setGameState("MAP"); }}>กลับสู่แผนที่</button>
                </div>
              </div>
            </div>
          )}

        </div>
      </div>
    </MainLayout>
  );
}