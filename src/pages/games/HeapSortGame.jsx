import React, { useState, useEffect, useRef, useMemo } from "react";
import MainLayout from "../../layouts/MainLayout";
import "../../styles/heap-game.css"; 

// ✅ Assets Mapping
import bgForest from "../../assets/bg-forest.png";
import h1 from "../../assets/h1.png"; 
import h2 from "../../assets/h2.png"; 
import h3 from "../../assets/h3.png"; 

const STAGES = [
  { id: 1, title: "ปลุกพลังรากไม้", sub: "(Build Max Heap)", icon: "🌱", type: "MAX", 
    goal: "กรอกมวลสาร 7 ชนิด แล้วจัดโครงสร้างให้ค่ามากที่สุดอยู่บนยอดไม้ (Root)", 
    rules: "กฎ Max-Heap: ตัวแม่ต้องมีค่ามากกว่าหรือเท่ากับตัวลูกเสมอ" },
  { id: 2, title: "เก็บเกี่ยวแห่งลำดับ", sub: "(Ascending Sort)", icon: "🌾", type: "MAX", 
    goal: "เรียงลำดับจากน้อย ⮕ มาก โดยการสกัดค่ามากที่สุดไปไว้ท้ายอาร์เรย์", 
    rules: "สลับ Root (ค่ามากสุด) ลงไปล็อคไว้ที่ตำแหน่งท้ายแถว แล้วซ่อมฮีพใหม่" },
  { id: 3, title: "มนตราสะท้อน", sub: "(Descending Sort)", icon: "🔮", type: "MIN", 
    goal: "เรียงลำดับจากมาก ⮕ น้อย โดยใช้กฎ Min-Heap", 
    rules: "กฎ Min-Heap: แม่ต้องน้อยกว่าหรือเท่ากับลูก\nสลับ Root (ค่าน้อยสุด) ไปเก็บไว้ท้ายแถว" }
];

const GUARDIANS = [
  { id: "h1", name: "Elder Oakheart", ability: "เกราะพฤกษา", desc: "ป้องกันความผิดพลาดได้ 2 ครั้ง", img: h1, hp: 4, time: 90 },
  { id: "h2", name: "Pixie Lumina", ability: "พรแห่งกาลเวลา", desc: "เพิ่มเวลาจัดเรียงให้อีก 45 วินาที", img: h2, hp: 4, time: 135 },
  { id: "h3", name: "King Sage", ability: "เนตรนักปราชญ์", desc: "เริ่มภารกิจด้วย HP สูงสุด 5 หน่วย", img: h3, hp: 5, time: 80 }
];
// --- SCORE CONFIG ---
const LESSON_KEY = "heap";
const SCORE_API = "https://script.google.com/macros/s/AKfycbxaSnMhAZYVgAwDS7VOgJuINzO2Wn3r8EBMPMFt84nbjy4tn-O5i6OUQIHj19L9jFNJ/exec";


export default function HeapSortGame() {
// =========================================================
// 🧩 ส่วนที่ 1: State Management (การจัดการสถานะ)
// =========================================================
const [gameState, setGameState] = useState("HOME"); 
const [selectedChar, setSelectedChar] = useState(null);
const [currentLvlIdx, setCurrentLvlIdx] = useState(0); // 0: สร้าง Heap, 1: สกัดค่า
const [heap, setHeap] = useState([]); // ข้อมูลต้นไม้
const [inputArray, setInputArray] = useState(new Array(7).fill("")); 
const [isInputDone, setIsInputDone] = useState(false);
const [sortedArray, setSortedArray] = useState(new Array(7).fill(null)); // รางเก็บมวลสาร
const [selectedIdx, setSelectedIdx] = useState(null); // สำหรับการคลิกสลับโหนด
const [score, setScore] = useState(0);
const [hp, setHp] = useState(3);
const [timeLeft, setTimeLeft] = useState(0);
const [violationIdx, setViolationIdx] = useState(null); // จุดที่ผิดกฎ Heap
const [isAnimating, setIsAnimating] = useState(false);
const [isVerified, setIsVerified] = useState(false);
const [isScoreSent, setIsScoreSent] = useState(false);
const [hasCompletedGame, setHasCompletedGame] = useState(false);
const [hasInitTime, setHasInitTime] = useState(false);



const stage = STAGES[currentLvlIdx];

// --- Refs สำหรับ Timer และ Input ---
const timerRef = useRef(null);
const inputRefs = useRef([]);

// --- ตำแหน่งพิกัดต้นไม้ (ล็อกกึ่งกลางเลข) ---
// ✅ ปรับพิกัด Y ให้กระชับขึ้น (เดิม 40, 120, 210)
const treePos = useMemo(() => [
  { x: "50%", y: "25px" },   // Root (Level 0)
  { x: "32%", y: "90px" },   // Level 1
  { x: "68%", y: "90px" },   // Level 1
  { x: "23%", y: "160px" },  // Level 2
  { x: "41%", y: "160px" },  // Level 2
  { x: "59%", y: "160px" },  // Level 2
  { x: "77%", y: "160px" }   // Level 2
], []);

// =========================================================
// 🛠️ ส่วนที่ 2: Helper Functions (ฟังก์ชันช่วยเหลือ)
// =========================================================

const initGameData = (char) => {
  setIsScoreSent(false);
  setSelectedChar(char);
  setInputArray(new Array(7).fill(""));
  setIsInputDone(false);
  setSortedArray(new Array(7).fill(null));
  setHp(char.hp);
  setTimeLeft(char.time);
  setScore(0);
  setGameState("MAP");
};

const handleInputChange = (idx, val) => {
  const nextInput = [...inputArray];
  nextInput[idx] = val.replace(/\D/g, '').slice(0, 2); 
  setInputArray(nextInput);
};

// =========================================================
// 🌿 ส่วนที่ 3: ลอจิกด่านที่ 1 (Build Max-Heap) - ห้ามยุ่ง
// =========================================================

const manifestOrbs = () => {
  if (inputArray.some(v => v === "")) return alert("กรุณากรอกมวลสารให้ครบ!");
  let data = inputArray.map(Number);

  // ตรวจสอบกฎ Max-Heap (แม่ >= ลูก)
  const checkHeap = (arr) => {
    for (let i = 0; i <= Math.floor(arr.length / 2) - 1; i++) {
      const L = 2 * i + 1, R = 2 * i + 2;
      if ((L < arr.length && arr[i] < arr[L]) || (R < arr.length && arr[i] < arr[R])) return false;
    }
    return true;
  };

  // ถ้าถูกอยู่แล้วให้สลับเพื่อความท้าทาย
  if (checkHeap(data)) data = [...data].sort(() => Math.random() - 0.5);

  setHeap(data);
  setIsInputDone(true);
};
// ✅ เพิ่มฟังก์ชันนี้กลับเข้าไป เพื่อให้กด Enter แล้วเลื่อนช่องกรอกได้
  const handleKeyDown = (e, idx) => {
    if (e.key === "Enter") {
      e.preventDefault();
      if (idx < 6) {
        // เลื่อนโฟกัสไปช่องถัดไป
        inputRefs.current[idx + 1]?.focus();
      } else {
        // ถ้าช่องสุดท้ายแล้ว ให้เริ่มสร้างมวลสาร
        manifestOrbs();
      }
    }
  };

// ✅ แทรกก่อน handleManualCheck
const checkHeapProperty = (arr, type) => {
  for (let i = 0; i <= Math.floor(arr.length / 2) - 1; i++) {
    const L = 2 * i + 1, R = 2 * i + 2;
    if (type === "MAX") {
      // กฎ Max-Heap: แม่ต้อง >= ลูก
      if ((L < arr.length && arr[i] < arr[L]) || (R < arr.length && arr[i] < arr[R])) return i;
    } else {
      // กฎ Min-Heap: แม่ต้อง <= ลูก
      if ((L < arr.length && arr[i] > arr[L]) || (R < arr.length && arr[i] > arr[R])) return i;
    }
  }
  return null;
};

const handleManualCheck = () => {
  if (isAnimating || heap.length === 0) return;
  let firstErrorIdx = null;
  for (let i = 0; i <= Math.floor(heap.length / 2) - 1; i++) {
    const L = 2 * i + 1, R = 2 * i + 2;
    if ((L < heap.length && heap[i] < heap[L]) || (R < heap.length && heap[i] < heap[R])) {
      firstErrorIdx = i; break;
    }
  }

  if (firstErrorIdx !== null) {
    // 💔 กรณีจัดผิด: หัก HP และคะแนน
    setHp(prev => Math.max(0, prev - 1)); 
    setScore(prev => Math.max(0, prev - 50));
    setViolationIdx(firstErrorIdx);
    setIsVerified(false);
    if (hp <= 1) setGameState("RESULT");
  } else {
    // 🏆 กรณีถูกต้อง: แสดงข้อความและย้ายด่าน
    if (!isVerified) {
      setScore(prev => prev + 100);
      setViolationIdx(null);
      setIsVerified(true); // จะทำให้คำอธิบายขึ้นข้อความสำเร็จ
    }
  }
};

// =========================================================
// 🏆 ส่วนที่ 4: ลอจิกด่านที่ 2 (Extraction & Sort) - เพิ่มใหม่
// =========================================================

const performExtraction = (currentHeap) => {
  setIsAnimating(true);
  const nextHeap = [...currentHeap];
  const harvestedVal = nextHeap.pop(); // ดึงตัวที่สลับมาไว้ท้ายสุดออก
  setHeap(nextHeap);
  
  const newSorted = [...sortedArray];
  // 🛠️ แก้ปัญหาช่องว่าง: ค้นหาช่องว่าง (null) ตัวสุดท้ายจากขวาไปซ้ายเพื่อเรียงให้ชิดกัน
  const emptyIdx = newSorted.lastIndexOf(null);
  if (emptyIdx !== -1) {
    newSorted[emptyIdx] = harvestedVal;
  }
  
  setSortedArray(newSorted);
  setScore(s => s + 200);
  setIsAnimating(false);
  setIsVerified(false);
};

const handleExtractionCheck = () => {
  if (isAnimating || heap.length === 0) return;
  const errorIdx = checkHeapProperty(heap, stage.type);
  
if (errorIdx !== null) {
  setViolationIdx(errorIdx);
  setHp(prev => Math.max(0, prev - 1));
  setScore(prev => Math.max(0, prev - 50));

  if (hp <= 1)
    setGameState("RESULT");
  return;
}


  setIsAnimating(true); setViolationIdx(null);
  const nextHeap = [...heap];
  const lastIdx = nextHeap.length - 1;
  [nextHeap[0], nextHeap[lastIdx]] = [nextHeap[lastIdx], nextHeap[0]]; // สลับ Root กับตัวท้าย
  setHeap(nextHeap);

  setTimeout(() => {
    const harvestedVal = nextHeap.pop(); setHeap([...nextHeap]);
    const newSorted = [...sortedArray];
    const emptyIdx = newSorted.lastIndexOf(null);
    if (emptyIdx !== -1) newSorted[emptyIdx] = harvestedVal; // เก็บลงคลัง
    setSortedArray(newSorted); setScore(s => s + 150);
    setIsAnimating(false); setIsVerified(false);

if (nextHeap.length === 0) {
  if (currentLvlIdx === 1) {
    setCurrentLvlIdx(2);
    setIsInputDone(false); 
    setHeap([]);
    setSortedArray(new Array(7).fill(null));
    if (selectedChar) setTimeLeft(selectedChar.time); // 👈 เพิ่ม: รีเซ็ตเวลาสำหรับด่าน 3
    setGameState("MAP");
  } else if (currentLvlIdx === 2) {
    setGameState("RESULT");
  }
}

  }, 800);
};


useEffect(() => {
    let interval = null;
    // เงื่อนไข: เริ่มเดินเมื่อกำลังเล่น และกรอกข้อมูลเสร็จแล้ว เท่านั้น
    if (gameState === "PLAYING" && isInputDone && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(prev => prev - 1); // ลดเวลาลงทีละ 1 วินาที
      }, 1000);
    } else if (timeLeft === 0 && gameState === "PLAYING") {
      setGameState("RESULT"); // เวลาหมดส่งไปหน้าสรุปผล
    }
    // คืนค่าเพื่อล้าง Timer เมื่อ Component ปิดลง หรือสถานะเปลี่ยน
    return () => clearInterval(interval);
  }, [gameState, isInputDone, timeLeft === 0]);

  useEffect(() => {
  try {
    const user = JSON.parse(localStorage.getItem("user")) || {};
    const username = user.firstname || "guest";
    const storageKey = `progress_${username}_${LESSON_KEY}`;
    const savedData = JSON.parse(localStorage.getItem(storageKey)) || {};

    if (savedData.game === true) {
      setHasCompletedGame(true);
      setGameState("ALREADY_WIN");
    }
  } catch (e) {
    console.error("Check heap progress error", e);
  }
}, []);

// =========================================================
// 🕹️ ส่วนที่ 5: Interaction & Navigation (การโต้ตอบ)
// =========================================================

const handleNodeClick = (idx) => {
  if (gameState !== "PLAYING" || !isInputDone || isAnimating) return;
  if (selectedIdx === null) setSelectedIdx(idx);
  else {
    if (selectedIdx === idx) { setSelectedIdx(null); return; }
    
    // 🚀 ตรวจสอบเงื่อนไขการสกัด: สลับ Root (0) กับตัวสุดท้ายของ Heap ปัจจุบัน
    const isRootLastSwap = (selectedIdx === 0 && idx === heap.length - 1) || (idx === 0 && selectedIdx === heap.length - 1);
    const wasValidHeap = checkHeapProperty(heap, stage.type) === null;

    setIsAnimating(true);
    const nextHeap = [...heap];
    [nextHeap[selectedIdx], nextHeap[idx]] = [nextHeap[idx], nextHeap[selectedIdx]];
    setHeap(nextHeap);
    setSelectedIdx(null);

    // ✅ ถ้าอยู่ด่านสกัด (2 หรือ 3) และสลับ Root-Last โดยที่ Heap ถูกต้องก่อนสลับ
    if (currentLvlIdx > 0 && isRootLastSwap && wasValidHeap) {
      // เลขจะวิ่งไปที่อาเรย์ทันทีโดยไม่ต้องกดปุ่มสกัด
      setTimeout(() => performExtraction(nextHeap), 600);
    } else {
      setTimeout(() => setIsAnimating(false), 500);
    }
  }
};

const processHeapAction = () => {
  if (currentLvlIdx === 0 && isVerified) {
    setCurrentLvlIdx(1); 
    setGameState("MAP");
    setIsVerified(false);
    setIsInputDone(false); // 👈 เพิ่ม: เพื่อหยุดตัวนับเวลาของด่านเก่า
    if (selectedChar) setTimeLeft(selectedChar.time); // 👈 เพิ่ม: รีเซ็ตเวลาทันที
  }
};
// ✅ เพิ่มฟังก์ชันช่วยสร้างคำอธิบาย (วางไว้ก่อน return)
const getInstructionText = () => {
  if (violationIdx !== null) {
    const rule = stage.type === "MAX" ? "แม่ต้องมากกว่าหรือเท่ากับลูก" : "แม่ต้องน้อยกว่าหรือเท่ากับลูก";
    return `⚠️ ตรวจพบพลังแปรปรวน! ตามกฎ ${rule} (ตรวจสอบที่โหนดค่า ${heap[violationIdx]})`;
  }
  
  if (currentLvlIdx > 0 && isInputDone) {
    const errorIdx = checkHeapProperty(heap, stage.type);
    return errorIdx === null 
      ? "💎 ฮีพสมบูรณ์แล้ว! ลองสลับ 'โหนดราก' กับ 'โหนดสุดท้าย' เพื่อสกัดมวลสาร" 
      : "🛠️ ฮีพพังอยู่! โปรดสลับตำแหน่ง (Re-heapify) ให้ถูกต้องตามกฎก่อนสกัดค่าถัดไป";
  }

  return currentLvlIdx === 0 
    ? "🌿 ภารกิจ: สลับตำแหน่งมวลสารเพื่อให้โหนดแม่มีค่ามากกว่าลูกทุกกิ่งก้าน" 
    : "🔮 ภารกิจ: จัด Min-Heap (แม่น้อยกว่าลูก) เพื่อสกัดค่าไปเรียงลำดับ มาก ⮕ น้อย";
};
const saveProgressToStorage = (newData) => {
  try {
    const user = JSON.parse(localStorage.getItem("user")) || {};
    const username = user.firstname || "guest";
    const storageKey = `progress_${username}_${LESSON_KEY}`;
    const currentData = JSON.parse(localStorage.getItem(storageKey)) || {};
    const mergedData = { ...currentData, ...newData };
    localStorage.setItem(storageKey, JSON.stringify(mergedData));
  } catch (e) {
    console.error("Save progress error", e);
  }
};

const saveScoreToSheet = async (finalScore) => {
  try {
      const user = JSON.parse(localStorage.getItem("user")) || {};
      const payload = {
          activity: "GAMES",
          firstname: user.firstname || "Guest",
          lastname: user.lastname || "-",
          gameName: "Heap Sort Game",
          score: finalScore
      };
      await fetch(SCORE_API, {
          method: "POST",
          body: JSON.stringify(payload),
          headers: { "Content-Type": "text/plain;charset=utf-8" }
      });
  } catch (e) { 
      console.error("Save failed", e); 
  }
};

useEffect(() => {
  if (gameState === "RESULT" && !isScoreSent) {
    setIsScoreSent(true);
    saveScoreToSheet(score);
  }
}, [gameState, isScoreSent]);



return (
    <MainLayout>
      <div className="alchemist-main-viewport" style={{ backgroundImage: `url(${bgForest})` }}>
                {gameState === "ALREADY_WIN" && (
          <div className="magical-overlay-v8">
            <div className="result-card-v8 success-theme">
              <h2 className="title-heading-v8">🏆 ภารกิจ Heap Sort สำเร็จแล้ว</h2>
              <p className="result-subtitle">
                คุณได้ผ่านเกม Heap Sort ครบทุกด่านแล้ว
              </p>
              <button
                className="gold-action-btn-v8"
                onClick={() => window.location.href = "/home"}
              >
                กลับหน้าหลัก
              </button>
            </div>
          </div>
        )}

        {gameState === "HOME" && (
          <div className="selection-overlay">
            {/* Header Capsule - ปรับขนาดเล็กลงเพื่อให้พอดีจอ */}
            <div className="capsule-header-v2">Magical Alchemist</div>
            
            <div className="compact-char-grid">
              {GUARDIANS.map(g => (
                <div key={g.id} className="compact-card">
                  <div className="card-inner-border">
                    <div className="card-img-container">
                      <img src={g.img} alt={g.name} className="char-img-small" />
                    </div>
                    
                    <div className="card-content-v2">
                       <h4 className="char-name-v2">{g.name}</h4>
                       <p className="power-tag"><strong>{g.ability}</strong></p>
                       <p className="power-desc">{g.desc}</p>
                    </div>

                    <button 
                      className="btn-select-v2" 
                      onClick={() => { 
                        setSelectedChar(g);   // ✅ บันทึกตัวละครลง State
                        initGameData(g);      // ✅ เรียกใช้ชื่อฟังก์ชันให้ตรงกัน
                        setGameState("MAP");  // ✅ เปลี่ยนหน้าไปแผนที่
                      }}
                    >
                      เลือกตัวละคร
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}


          {/* --- หน้าแผนที่ด่าน (Stage Nodes) ตามภาพ 02.26.54.png --- */}
          {gameState === "MAP" && (
            <div className="magical-overlay-v8">
              <div className="map-panel-v9">
                <h2 className="map-title-v9">Stage Nodes</h2>
                
                <div className="map-grid-v9">
                  {STAGES.map((s, i) => {
                    const isUnlocked = i <= currentLvlIdx;
                    const isCurrent = i === currentLvlIdx;
                    
                    return (
                      <div 
                        key={s.id} 
                        className={`map-card-v9 ${isUnlocked ? 'unlocked' : 'locked'} ${isCurrent ? 'active' : ''}`}
                        onClick={() => isUnlocked && setGameState("RULES")}
                      >
                        <div className="node-circle-v9">
                          {/* แสดงไอคอนตามสถานะ: ถ้าล็อคโชว์กุญแจ ถ้าปลดแล้วโชว์ไอคอนด่าน */}
                          {!isUnlocked ? (
                            <span className="lock-icon-v9">🔒</span>
                          ) : (
                            <span className="stage-icon-v9">{s.icon}</span>
                          )}
                        </div>
                        <div className="node-info-v9">
                          <p className="node-label-v9">ด่าน {s.id}</p>
                          <p className="node-name-v9">{s.title}</p>
                          <p className="node-sub-v9">{s.sub}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

            {/* --- หน้ากติกา (Rules Screen) --- */}
            {gameState === "RULES" && (
              <div className="magical-overlay-v8">
                <div className="rules-panel-v9">
                  {/* แถบหัวขวบนขนาดเล็ก */}
                  <div className="rules-tag-v9">ภารกิจนักแปรธาตุ</div>
                  
                  <div className="rules-content-v9">
                    <div className="rules-header-v9">
                      <span className="rules-icon-v9">{stage.icon}</span>
                      <div className="rules-title-group-v9">
                        <h3>ด่านที่ {stage.id} : {stage.title}</h3>
                        <small>{stage.sub}</small>
                      </div>
                    </div>

                    <div className="rules-body-v9">
                      <div className="rules-section-v9">
                        <h4>🎯 เป้าหมาย</h4>
                        <p>{stage.goal}</p>
                      </div>
                      
                      <div className="rules-divider-v9"></div>
                      
                      <div className="rules-section-v9">
                        <h4>📜 วิธีการเล่น</h4>
                        {/* แยกบรรทัดกติกาด้วยการใช้ newline (\n) */}
                        {stage.rules.split('\n').map((line, index) => (
                          <p key={index}>✨ {line}</p>
                        ))}
                      </div>
                    </div>

                    {/* ปุ่มเริ่มเล่น */}
                    <button 
                      className="gold-action-btn-v8 rules-start-btn-v9" 
                      onClick={() => setGameState("PLAYING")}
                    >
                      เริ่มร่ายเวท! 🪄
                    </button>
                  </div>
                </div>
              </div>
            )}
 
            <div className="alchemist-main-viewport">
  {gameState === "PLAYING" && selectedChar && (
    <div className="arena-layout-v11">
      
      {/* 🟢 1. HUD: แสดงข้อมูลตัวละคร, เวลา, คะแนน และหัวใจ (คงเดิม) */}
      <div className="hud-top-capsule-v12">
        <div className="hud-portrait-v11">
          <img src={selectedChar.img} alt="Guardian" />
        </div>
        <div className="hud-content-v12">
          <span className="char-name-badge">{selectedChar.name}</span>
          <div className="stat-group">
            <span className="timer-text">⏰ {timeLeft}s</span>
            <span className="score-text">✨ {score}</span>
            <span className="hp-hearts">HP: {'❤️'.repeat(hp)}</span>
          </div>
        </div>
      </div>

      {!isInputDone && (currentLvlIdx === 0 || currentLvlIdx === 2) ? (
        
        /* 📜 หน้ากรอกมวลสาร (Alchemy Input Zone) */
        <div className="alchemy-input-zone fade-in">
          <div className="alchemy-board-v13">
            <h2 className="alchemy-title-v13">🏺 {currentLvlIdx === 0 ? "ผสมมวลสารต้นกำเนิด" : "อัญเชิญมวลสารสะท้อน (Min-Heap)"}</h2>
            <div className="orb-input-group">
              {inputArray.map((v, i) => (
                <input 
                  key={i} type="text" className="magic-orb-input" 
                  ref={el => inputRefs.current[i] = el}
                  value={v} onChange={e => handleInputChange(i, e.target.value)}
                  onKeyDown={e => handleKeyDown(e, i)} placeholder="?" 
                />
              ))}
            </div>
            <div className="input-instruction-v13">กรอกมวลสาร 7 ชนิด เพื่อเตรียมเข้าสู่ภารกิจด่านที่ {currentLvlIdx + 1}</div>
            <button className="alchemy-summon-btn-v14" onClick={manifestOrbs}>
              ร่ายเวทอัญเชิญมวลสาร ✨
            </button>
          </div>
        </div>
      ) : (
        /* 🌳 3. ส่วนการเล่นเกม: ปรับ Layout ให้เป๊ะตามภาพที่ 2 */
        <div className="magic-board-card fade-in">
          
          {/* ✅ ชื่อด่านด้านบนกระดาน */}
          <h3 className="lvl-label">
            🌱 ด่านที่ {currentLvlIdx + 1} : {currentLvlIdx === 0 ? "Build Max Heap (ปลุกพลังรากไม้)" : "Heap Sort Extraction (เก็บเกี่ยวผลผลิต)"}
          </h3>

          {/* 🌾 รางเก็บมวลสารที่จัดเรียงแล้ว (Sorted Array)] */}
            {currentLvlIdx >  0 && (
            <div className="array-shelf-top fade-in">
              <div className="shelf-label-v2">🌾 คลังมวลสารที่จัดเรียงแล้ว </div>
              <div className="shelf-row-horizontal">
                {sortedArray.map((v, i) => (
                  <div key={i} className={`shelf-slot-v2 ${v !== null ? 'harvested' : ''}`}>
                    {v}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 🌳 5. พื้นที่ต้นไม้ (กลางกระดาน) - ล็อกพิกัดให้เส้นตรงเลขเป๊ะ */}
          <div className="tree-rendering-v11" style={{ height: '280px', position: 'relative' }}>
            <svg className="connector-v11" style={{ position: 'absolute', width: '100%', height: '100%', top: 0, left: 0, pointerEvents: 'none' }}>
              {/* พิกัดใหม่: y=25 (Root), y=90 (L1), y=160 (L2) */}
              {heap.length > 1 && <line x1="50%" y1="25" x2="32%" y2="90" stroke="white" strokeWidth="2.5" opacity="0.6" />}
              {heap.length > 2 && <line x1="50%" y1="25" x2="68%" y2="90" stroke="white" strokeWidth="2.5" opacity="0.6" />}
              {heap.length > 3 && <line x1="32%" y1="90" x2="23%" y2="160" stroke="white" strokeWidth="2.5" opacity="0.6" />}
              {heap.length > 4 && <line x1="32%" y1="90" x2="41%" y2="160" stroke="white" strokeWidth="2.5" opacity="0.6" />}
              {heap.length > 5 && <line x1="68%" y1="90" x2="59%" y2="160" stroke="white" strokeWidth="2.5" opacity="0.6" />}
              {heap.length > 6 && <line x1="68%" y1="90" x2="77%" y2="160" stroke="white" strokeWidth="2.5" opacity="0.6" />}
            </svg>

            {heap.map((val, idx) => (
              <div 
                key={`${idx}-${val}`} 
                className={`orb-v11-v2 ${violationIdx === idx ? 'violated-v2' : ''} ${selectedIdx === idx ? 'picked-v2' : ''}`}
                style={{ 
                    left: treePos[idx].x, 
                    top: treePos[idx].y, 
                    position: 'absolute' // 👈 ล็อกไว้เพื่อไม่ให้เลขเรียงแนวดิ่ง
                }}
                onClick={() => handleNodeClick(idx)}
              >
                {val}
              </div>
            ))}
          </div>

          {/* ✍️ 6. ช่องคำอธิบาย (Description Box): ตามภาพที่ 2 */}
          <div className="description-box-v12">
            <span className="desc-label">คำอธิบาย : </span>
            <div className="desc-text-display">
              {getInstructionText()}
            </div>
          </div>

          {/* 🕹️ 7. ปุ่มดำเนินการขนาดใหญ่ (Action Footer) */}
          <div className="action-footer-v12">
            {currentLvlIdx === 0 ? (
              /* --- ด่าน 1: ตรวจสอบ Max-Heap --- */
              <>
                {!isVerified ? (
                  <button className="gold-action-btn-huge" onClick={handleManualCheck}>
                    ตรวจสอบ Max-Heap 🌳
                  </button>
                ) : (
                  <button className="gold-action-btn-huge success" onClick={processHeapAction}>
                    สร้างฮีพสำเร็จ! ไปต่อ ⮕
                  </button>
                )}
              </>
            ) : (
              /* --- ด่าน 2: สกัดมวลสาร (Heap Sort) --- */
              <button className="gold-action-btn-huge extract" onClick={handleExtractionCheck}>
                สกัดมวลสาร (Heap Sort)
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  )}
</div>

        {/* --- 🏆 RESULT --- */}
        {/* --- 🏆 RESULT: แยก Success และ Failure --- */}
{gameState === "RESULT" && selectedChar && (
  <div className="magical-overlay-v8">
    {/* ตรวจสอบว่าชนะหรือแพ้ */}
    {hp > 0 && timeLeft > 0 ? (
      /* 🎊 กรณีสำเร็จ (Success) */
      <div className="result-card-v8 success-theme">
        <h2 className="title-heading-v8" style={{ color: '#d4af37' }}>✨ ภารกิจสำเร็จ ✨</h2>
        <p className="result-subtitle">ท่านได้ก้าวเข้าสู่ตำแหน่ง "มหาปราชญ์แห่งฮีพ"</p>
        
        <div className="result-img-circle-v8 gold-glow">
          <img src={selectedChar.img} alt="Guardian" />
        </div>
        
        <div className="score-container-v8">
          <p>คะแนนรวมมวลสาร</p>
          <p className="final-score-v8">{score}</p>
        </div>

        <div className="star-rating">⭐⭐⭐⭐⭐</div>
        
        <button className="gold-action-btn-v8" onClick={() => window.location.reload()}>
          🔄 กลับหน้าหลัก
        </button>
      </div>
    ) : (
      /* 💀 กรณีล้มเหลว (Failure) */
      <div className="result-card-v8 failure-theme">
        <h2 className="title-heading-v8" style={{ color: '#c62828' }}>💀 ภารกิจล้มเหลว</h2>
        <p className="result-subtitle">
          {timeLeft === 0 ? "เวลาแห่งมนตราสิ้นสุดลง..." : "พลังชีวิตของท่านสูญสิ้น..."}
        </p>
        
        <div className="result-img-circle-v8 shadow-glow" style={{ filter: 'grayscale(1)' }}>
          <img src={selectedChar.img} alt="Guardian" />
        </div>
        
        <div className="score-container-v8">
          <p>คะแนนที่เก็บรวบรวมได้</p>
          <p className="final-score-v8" style={{ color: '#555' }}>{score}</p>
        </div>

        <div className="star-rating" style={{ opacity: 0.3 }}>⭐⭐⭐</div>
        
        <button className="gold-action-btn-v8" style={{ background: '#555' }} onClick={() => window.location.reload()}>
          🔄 ลองใหม่อีกครั้ง
        </button>
      </div>
    )}
  </div>
)}

      </div>
    </MainLayout>
  );
}