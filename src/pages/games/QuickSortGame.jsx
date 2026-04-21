import React, { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import MainLayout from "../../layouts/MainLayout";
import { getAuth } from "../../utils/auth";

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

const LESSON_KEY = "quick"; 
const SCORE_API = "https://script.google.com/macros/s/AKfycbxaSnMhAZYVgAwDS7VOgJuINzO2Wn3r8EBMPMFt84nbjy4tn-O5i6OUQIHj19L9jFNJ/exec";
const CHARACTERS = [
  {
    id: "arin",
    nameEn: "Arin Goldhand",
    nameTh: "อาริน มือทอง",
    desc: "⚡ เพิ่มเวลาขุดแร่ +40 วินาที",
    hp: 3,
    timeBonus: 40,
    img: charArin,
  },
  {
    id: "luna",
    nameEn: "Luna Ember",
    nameTh: "ลูน่า เอ็มเบอร์",
    desc: "⚖️ HP 4 และเพิ่มเวลา +20 วินาที",
    hp: 4,
    timeBonus: 20,
    img: charLuna,
  },
  {
    id: "mira",
    nameEn: "Mira Stonewhisper",
    nameTh: "มิร่า สโตนวิสเปอร์",
    desc: "🛡️ ป้องกันความผิดพลาดได้ 5 ครั้ง",
    hp: 5,
    timeBonus: 0,
    img: charMira,
  },
];

const LEVELS = [
  { id: 1, name: "ด่านที่ 1", count: 5, sortMode: 'asc', timeLimit: 90 },  // 5 ตัว / น้อย -> มาก
  { id: 2, name: "ด่านที่ 2", count: 7, sortMode: 'desc', timeLimit: 100 }, // 7 ตัว / มาก -> น้อย
  { id: 3, name: "ด่านที่ 3", count: 9, sortMode: 'asc', timeLimit: 120 }  // 9 ตัว / น้อย -> มาก
];
const getUserKey = () => {
  let user = {};
  try { user = JSON.parse(localStorage.getItem("user")) || {}; } catch(e) {}
  if (user.email) return user.email;
  let guestId = localStorage.getItem("guest_id");
  if (!guestId) {
    guestId = crypto.randomUUID();
    localStorage.setItem("guest_id", guestId);
  }
  return `guest_${guestId}`;
};

export default function QuickSortGame() {
  const navigate = useNavigate();

  // --- 1. UI & PROGRESS STATES ---
  const [gameState, setGameState] = useState("CHARACTER");
  const [screen, setScreen] = useState("character");
  const [character, setCharacter] = useState(null);
  const [level, setLevel] = useState(null);
  const [hp, setHp] = useState(3);
  const [time, setTime] = useState(60);
  const [totalScore, setTotalScore] = useState(0);
const [unlockedLevel, setUnlockedLevel] = useState(1);
  const [score, setScore] = useState(0);
  const [selectedChar, setSelectedChar] = useState(null);
  

  // --- 2. GAME LOGIC STATES ---
  const [array, setArray] = useState([]);
  const [stack, setStack] = useState([]);
  const [currentRange, setCurrentRange] = useState({ low: 0, high: 4 });
  const [pivotIndex, setPivotIndex] = useState(null);
  const [leftPtr, setLeftPtr] = useState(null);
  const [rightPtr, setRightPtr] = useState(null);
  const [phase, setPhase] = useState("IDLE");
  const [sortedIndices, setSortedIndices] = useState([]);

  // --- 3. REFS & SUBMISSION ---
  const scoreRef = useRef(0);
  const sounds = useRef({
    click: new Audio(sfxClick),
    correct: new Audio(sfxCorrect),
    wrong: new Audio(sfxWrong),
    win: new Audio(sfxWin),
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

const saveProgress = useCallback((data) => {
  const userKey = getUserKey();
  const key = `progress_${userKey}_${LESSON_KEY}`;
  const old = JSON.parse(localStorage.getItem(key)) || {};

  const merged = { ...old, ...data };
  localStorage.setItem(key, JSON.stringify(merged));
}, []);

const submitScoreToSheet = async (finalScore) => {
  const user = JSON.parse(localStorage.getItem("user")) || {};

  const { email, token } = getAuth(); // ✅ เพิ่มตรงนี้

  const payload = { 
    activity: "GAMES", 
    firstname: user.firstname || "Guest", 
    lastname: user.lastname || "-", 
    gameName: "Quick Sort Mine", 
    score: finalScore 
  };

  try { 
    await fetch(SCORE_API, { 
      method: "POST",
      mode: "no-cors",
      body: JSON.stringify({
        ...payload,
        email,
        token
      })
    });
  } catch (e) { 
    console.error("Submit Error:", e); 
  }
};

  const playSfx = (name) => {
  const sfx = sounds.current[name];
  if (sfx) {
    sfx.pause();
    sfx.currentTime = 0;
    sfx.play().catch(() => {});
  }
};
  const playClick = () => playSfx("click");

// --- แก้ไขใน startLevel และ moveRight ---
const startLevel = (lvl) => {
  if (!lvl) return;

  const numbers = [];
  while (numbers.length < lvl.count) {
    const n = Math.floor(Math.random() * 99) + 1;
    if (!numbers.includes(n)) {
      numbers.push(n);
    }
  }

  const arr = numbers;

  setArray(arr);
  setLevel(lvl);
  setHp(character?.hp || 3);
  setScore(0);
  setTime(lvl.timeLimit + (character?.timeBonus || 0));
  setSortedIndices([]);
  setStack([]);
  setCurrentRange({ low: 0, high: arr.length - 1 });
  setPivotIndex(null);
  setLeftPtr(null);
  setRightPtr(null);
  setPhase("PICK_PIVOT");
  setScreen("game");
};

const handleWrongMove = (message) => {

  playSfx("wrong");

  setScore(s => Math.max(0, s - 10)); // 🔻 ลดคะแนน

  setHp(prev => {
    const nextHp = Math.max(0, prev - 1);
    if (nextHp === 0) setScreen("gameover");
    return nextHp;
  });
};

// --- ฟังก์ชันหยุด L: เช็คว่าหยุดถูกตัวตามเงื่อนไขด่านไหม ---
const stopL = () => {
  const val = array[leftPtr];
  const pVal = array[pivotIndex];

  const isCorrect = level.sortMode === "asc"
    ? val > pVal
    : val < pVal;

  if (!isCorrect && leftPtr < pivotIndex) {
    handleWrongMove("หยุด L ผิดตำแหน่ง!");
    return;
  }

  setPhase("SCAN_RIGHT");
};

const placePivot = () => {

  if (leftPtr < rightPtr) {
    handleWrongMove("ยังไม่สวนกัน ห้ามวาง Pivot!");
    return;
  }

  const newArr = [...array];
  const pVal = newArr[pivotIndex];

  [newArr[leftPtr], newArr[pivotIndex]] =
    [newArr[pivotIndex], newArr[leftPtr]];

  // 🔥 ตรวจว่าฝั่งซ้ายและขวาถูกจริงไหม
  const leftSide = newArr.slice(currentRange.low, leftPtr);
  const rightSide = newArr.slice(leftPtr + 1, currentRange.high + 1);

  const leftValid = level.sortMode === "asc"
    ? leftSide.every(n => n <= pVal)
    : leftSide.every(n => n >= pVal);

  const rightValid = level.sortMode === "asc"
    ? rightSide.every(n => n >= pVal)
    : rightSide.every(n => n <= pVal);

  if (!(leftValid && rightValid)) {
    handleWrongMove("วาง Pivot ผิดตำแหน่ง!");
    return;
  }

  setArray(newArr);
  setScore(s => s + 100);
  handlePartitionComplete(leftPtr);
};

const handlePivot = (idx) => {
  if (phase !== "PICK_PIVOT") return;

  // 🚩 จุดที่แก้: ต้องเลือกตัวขวาสุดของ "ช่วงปัจจุบัน" เท่านั้น
  if (idx !== currentRange.high) {
    handleWrongMove("ต้องเลือกคริสตัลขวาสุดของกลุ่มที่ไฮไลต์อยู่เป็น Pivot ค่ะ!");
    return;
  }

  setPivotIndex(idx);
  // ตั้งค่า L และ R เริ่มต้นภายในช่วงที่กำหนด
  setLeftPtr(currentRange.low);
  setRightPtr(currentRange.high - 1);
  setPhase("SCAN_LEFT");
  playSfx("correct");
};

// ขยับ L ให้กระโดดไปข้างหน้า
const moveLeft = () => {
  if (leftPtr >= pivotIndex) return;

  const pivotVal = array[pivotIndex];
  const currentVal = array[leftPtr];

  const shouldStop = level.sortMode === "asc"
    ? currentVal > pivotVal
    : currentVal < pivotVal;

  // ถ้าตำแหน่งปัจจุบันควรหยุด แต่ยังจะเลื่อนต่อ = ผิด
  if (shouldStop) {
    handleWrongMove("เลยตำแหน่งที่ควรหยุดของ L!");
    return;
  }

  setLeftPtr(prev => prev + 1);
};

// ขยับ R ให้กระโดดถอยหลัง
const moveRight = () => {
  if (rightPtr <= currentRange.low) return;

  const pivotVal = array[pivotIndex];
  const currentVal = array[rightPtr];

  const shouldStop = level.sortMode === "asc"
    ? currentVal < pivotVal
    : currentVal > pivotVal;

  if (shouldStop) {
    handleWrongMove("เลยตำแหน่งที่ควรหยุดของ R!");
    return;
  }

  setRightPtr(prev => prev - 1);
};

// ปุ่มหยุด (Confirm) เพื่อล็อกตำแหน่ง
const stopR = () => {
  const val = array[rightPtr];
  const pVal = array[pivotIndex];

  const isCorrect = level.sortMode === "asc"
    ? val < pVal
    : val > pVal;

  if (!isCorrect && rightPtr > leftPtr) {
    handleWrongMove("หยุด R ผิดตำแหน่ง!");
    return;
  }

  setPhase("CHECK");
};
const checkAndSwap = () => {

  if (leftPtr >= rightPtr) {
    handleWrongMove("สวนกันแล้ว ห้ามสลับ!");
    return;
  }

  const leftVal = array[leftPtr];
  const rightVal = array[rightPtr];
  const pivotVal = array[pivotIndex];

  let isCorrect;

  if (level.sortMode === "asc") {
    // Asc: ซ้ายต้องมากกว่า pivot และขวาต้องน้อยกว่า pivot
    isCorrect = leftVal > pivotVal && rightVal < pivotVal;
  } else {
    // Desc
    isCorrect = leftVal < pivotVal && rightVal > pivotVal;
  }

  if (!isCorrect) {
    handleWrongMove("สลับผิดเงื่อนไข!");
    return;
  }

  // ✅ swap จริง
  const newArr = [...array];
  [newArr[leftPtr], newArr[rightPtr]] =
    [newArr[rightPtr], newArr[leftPtr]];

  setArray(newArr);
  setScore(s => s + 50);
  setLeftPtr(prev => prev + 1);
  setRightPtr(prev => prev - 1);
  setPhase("SCAN_LEFT");
};

// --- 🚩 4. คะแนนไม่มั่ว และเห็นเลขเรียงครบก่อนจบ ---
  const handlePartitionComplete = (pivotPos) => {
    const newSorted = [...sortedIndices, pivotPos];
    setSortedIndices(newSorted);

    const nextStack = [...stack];
    const { low, high } = currentRange;

    if (pivotPos + 1 < high) nextStack.push({ low: pivotPos + 1, high: high });
    else if (pivotPos + 1 === high) newSorted.push(high); // เก็บตกตัวที่เหลือ 1 ตัว

    if (low < pivotPos - 1) nextStack.push({ low: low, high: pivotPos - 1 });
    else if (low === pivotPos - 1) newSorted.push(low);

    setSortedIndices(newSorted);

    if (nextStack.length > 0) {
      const nextRange = nextStack.pop();
      setStack(nextStack);
      setCurrentRange(nextRange);
      setPivotIndex(null);
      setPhase("PICK_PIVOT");
    } else {
    // 🏆 กรณีเรียงครบทุกตัวแล้วจริงๆ
    setTimeout(() => {
  handleLevelComplete();
}, 1500);
  }
};


const getInstructionText = () => {
  // 1. ตรวจสอบโหมดการเรียงของด่านปัจจุบัน
  const isAsc = level?.sortMode === 'asc'; 

  // 2. ส่งคืนข้อความตาม Phase และเงื่อนไข Hoare Partition
  switch (phase) {
    case "PICK_PIVOT":
      return "⛏️ ภารกิจ: คลิกเลือกคริสตัลขวาสุดเพื่อกำหนดค่า Pivot";

    case "SCAN_LEFT":
      return isAsc 
        ? "🔍 ขั้นตอนที่ 1: ขยับ L ไปทางขวา เพื่อหาค่าที่ 'มากกว่า' Pivot" 
        : "🔍 ขั้นตอนที่ 1: ขยับ L ไปทางขวา เพื่อหาค่าที่ 'น้อยกว่า' Pivot";

    case "SCAN_RIGHT":
      return isAsc 
        ? "🔍 ขั้นตอนที่ 2: ขยับ R ไปทางซ้าย เพื่อหาค่าที่ 'น้อยกว่า' Pivot" 
        : "🔍 ขั้นตอนที่ 2: ขยับ R ไปทางซ้าย เพื่อหาค่าที่ 'มากกว่า' Pivot";

    case "CHECK":
      // ตรวจสอบว่าตัวชี้สวนกันหรือยังตามภาพลอจิกของคุณ
      if (leftPtr >= rightPtr) {
        return "🏁 ตัวชี้สวนกันแล้ว! (L >= R) ตามหลักการต้องกด 'วาง Pivot' ทันที";
      }
      return "🔄 พบค่าที่ผิดฝั่งทั้งคู่แล้ว! กดปุ่ม 'สลับ L ↔ R' เพื่อจัดระเบียบ";

    case "FINAL_SWAP":
      return "🏁 ขั้นตอนสุดท้าย: สลับ Pivot เข้าไปแทนที่ตำแหน่ง L เพื่อจบการแบ่งส่วน";

    default:
      return "เตรียมพร้อมเริ่มการขุดแร่!";
  }
};
  // --- 4. DATA SUBMISSION (ที่เคย Error) ---
  const submitScore = async () => {
    if (isSubmitting || isSubmitted) return;
    setIsSubmitting(true);
    try {
      const user = JSON.parse(localStorage.getItem("user")) || { username: "Guest" };
      await fetch(SCORE_API, {
        method: "POST",
        mode: "no-cors",
        body: JSON.stringify({
          username: user.username || user.firstname || "Anonymous",
          character: character?.nameEn,
          totalScore: totalScore,
          lesson: LESSON_KEY,
          date: new Date().toLocaleString()
        }),
      });
      setIsSubmitted(true);
      alert("บันทึกคะแนนลง Leaderboard เรียบร้อย!");
    } catch (e) {
      console.error("Submit error", e);
      alert("ไม่สามารถส่งคะแนนได้ กรุณาลองใหม่");
    } finally {
      setIsSubmitting(false);
    }
  };
// --- 🚩 ส่วนที่ 2: การคำนวณคะแนนในขั้นตอนต่างๆ ---
const updateGameScore = (points) => {
    setScore(prev => {
        const newScore = Math.max(0, prev + points);
        return newScore;
    });
};
const handleLevelComplete = () => {
  // 1. คำนวณคะแนนที่ทำได้ "เฉพาะด่านนี้"
  const levelBonus = 200;
  const timeBonus = time * 2; 
  const currentLvlScore = score + levelBonus + timeBonus; // คะแนนด่านนี้ + โบนัส

  const userKey = getUserKey();
  const key = `progress_${userKey}_${LESSON_KEY}`;
  const old = JSON.parse(localStorage.getItem(key)) || {};

  // 🔥 จุดสำคัญ: ส่งคะแนนด่านนี้เข้า Sheet ทันที (ไม่เอาไปรวมกับด่านอื่นใน Sheet)
  submitScoreToSheet(currentLvlScore); 

  // 2. คำนวณคะแนนรวม "เฉพาะรอบนี้" เพื่อแสดงผลใน Map/Final
  // ถ้าเป็นด่าน 1 ให้เริ่มนับจาก 0 เสมอ ไม่เอา old.score มาบวก
  const isFirstLevel = level.id === 1;
  const newRunTotal = (isFirstLevel ? 0 : (old.score || 0)) + currentLvlScore;

  if (level.id === LEVELS.length) {
    // 🏆 จบด่านสุดท้าย (ด่าน 3)
    playSfx("win");

    const completedData = {
      ...old,
      score: 0,        // รีเซ็ตคะแนนสะสมเป็น 0 เพื่อไม่ให้รอบหน้ามาดึงไปบวกต่อ
      game: true,      // ปลดล็อก Dashboard
      level: 1,        // รอบหน้าเริ่มด่าน 1
      charId: null,    // รอบหน้าเลือกตัวละครใหม่
      submitted: true
    };
    localStorage.setItem(key, JSON.stringify(completedData));

    setTotalScore(newRunTotal); // โชว์คะแนนรวมของรอบนี้ในหน้า Final
    setScreen("final");
  } else {
    // ⏩ จบด่านปกติ (1 หรือ 2)
    const nextLevelId = level.id + 1;
    const updated = { 
      ...old, 
      score: newRunTotal, // เก็บผลรวมของด่าน 1+2 ไว้เพื่อไปบวกต่อในด่าน 3
      level: nextLevelId 
    };
    localStorage.setItem(key, JSON.stringify(updated));
    
    setUnlockedLevel(nextLevelId);
    setTotalScore(newRunTotal);
    setScreen("level");
  }
};

  useEffect(() => {
  if (screen !== "game") return;

  const timer = setInterval(() => {
    setTime(prev => {
      if (prev <= 1) {
        clearInterval(timer);
        setScreen("gameover");
        return 0;
      }
      return prev - 1;
    });
  }, 1000);
  return () => clearInterval(timer);
}, [screen]);
useEffect(() => {
  if (screen === "game" && (!level || array.length === 0)) {
    setScreen("level");
  }
}, [screen, level, array]);

useEffect(() => {
  const key = `progress_${getUserKey()}_${LESSON_KEY}`;
  const saved = JSON.parse(localStorage.getItem(key));

  if (!saved) {
    setScreen("character");
    return;
  }

  setTotalScore(saved.score || 0);

  // 🚩 ถ้าเล่นจบแล้ว (game: true) หรือยังไม่ได้เลือกตัวละคร ให้ไปหน้าเลือกตัวละคร
  if (saved.game === true || !saved.charId) {
    // ถ้าจบแล้วและ unlockedLevel ยังค้างที่ด่านสุดท้าย ให้รีเซ็ต UI state
    setUnlockedLevel(1);
    setScreen("character");
    return;
  }

  // 🚩 ถ้ากำลังเล่นค้างอยู่ ให้โหลดตัวละครและไปหน้าแผนที่
  const found = CHARACTERS.find(c => c.id === saved.charId);
  if (found) {
    setCharacter(found);
    setHp(found.hp);
    setUnlockedLevel(saved.level || 1);
    setScreen("level");
  } else {
    setScreen("character");
  }
}, []);
  
  // ------------------ SCREENS ------------------

if (screen === "character") {
  return (
    <MainLayout>
      <div
        className="mine-screen"
        style={{ backgroundImage: `url(${bgMining})` }}
      >
        <div className="mine-overlay"></div>

        <div className="mine-header">
          ⛏️ QUICK SORT MINE
          <div className="mine-subtitle">
            เลือกนักขุดแร่เพื่อเริ่มภารกิจจัดเรียงคริสตัล
          </div>
        </div>

        <div className="mine-grid">
          {CHARACTERS.map((c) => (
            <div
              key={c.id}
              className="mine-card"
              onClick={() => {
  setCharacter(c);
  setHp(c.hp);

  saveProgress({ charId: c.id });

  setScreen("level");
}}
            >
              <div className="mine-avatar">
                <img src={c.img} alt={c.nameEn} />
              </div>

              <h3>{c.nameEn}</h3>
              <p>{c.desc}</p>

              <div className="mine-btn">
                เริ่มขุดแร่ 🔥
              </div>
            </div>
          ))}
        </div>
      </div>
    </MainLayout>
  );
}
if (screen === "final") {
  return (
    <MainLayout>
      <div className="final-mine-overlay" style={{ backgroundImage: `url(${bgMining})`, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <div className="final-dark-layer" style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.85)' }}></div>

        <div className="final-mine-card" style={{ 
          position: 'relative', zIndex: 1, padding: '40px', borderRadius: '30px', 
          background: 'rgba(30, 20, 10, 0.9)', border: '2px solid #ffcc00', textAlign: 'center', maxWidth: '500px' 
        }}>
          <div style={{ fontSize: '4rem', marginBottom: '10px' }}>🏆</div>
          <h1 style={{ color: '#ffcc00', fontSize: '2.5rem', marginBottom: '10px' }}>ภารกิจสำเร็จ!</h1>
          <div style={{ fontSize: '3.5rem', color: '#fff', fontWeight: 'bold', margin: '20px 0' }}>{totalScore.toLocaleString()}</div>
          <p style={{ color: '#aaa', marginBottom: '30px' }}>คะแนนรวมทั้งหมดที่คุณทำได้</p>

          <div style={{ display: 'flex', gap: '15px' }}>
            <button
              className="final-mine-btn"
              onClick={() => {
                // รีเซ็ต State ในเครื่องให้เริ่มด่าน 1 ใหม่
                setScore(0);
                setTotalScore(0);
                setUnlockedLevel(1); 
                setCharacter(null);
                setScreen("character"); // ไปหน้าเลือกตัวละคร
              }}
            >
              เล่นอีกครั้ง 🔄
            </button>
            <button 
              className="final-mine-btn" 
              style={{ background: '#333', color: '#fff', flex: 1 }}
              onClick={() => navigate("/home")}
            >
              🏠 หน้าหลัก
            </button>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}

if (screen === "level") {
  const userKey = getUserKey();
  const key = `progress_${userKey}_${LESSON_KEY}`;
  const savedProgress = JSON.parse(localStorage.getItem(key));
  
  // ✅ แก้ตรงนี้: ให้เช็คว่า "จบเกมจริงๆ" เฉพาะตอนที่ด่านปลดล็อกเกินจำนวนด่านที่มี
  // ถ้า unlockedLevel ยังเป็น 1-3 แปลว่าผู้เล่นกำลังเล่นรอบใหม่ ให้โชว์แมพปกติ
  const isGameFinishedNow = unlockedLevel > LEVELS.length;

  const progressPercent =
    unlockedLevel <= 1
      ? 0
      : ((unlockedLevel - 1) / (LEVELS.length - 1)) * 100;

  return (
    <MainLayout>
      <div className="mine-map-screen-v2" style={{ backgroundImage: `url(${bgMining})` }}>
        <div className="mine-overlay-dark"></div>
        <div className="mine-map-panel-v2">
          <h2 className="mine-map-title">⛏️ แผนที่เส้นทางเหมือง</h2>

          {/* ✅ เปลี่ยนเงื่อนไขการโชว์ข้อความสำเร็จ */}
          {isGameFinishedNow && (
            <div style={{ marginBottom: "20px", padding: "10px", background: "rgba(0,255,120,0.1)", borderRadius: "10px", color: "#a8ff78" }}>
              🎉 ภารกิจสำเร็จครบทุกด่านแล้ว!
            </div>
          )}

          <div className="mine-progress-container">
            <div className="mine-track-base"></div>
            <div className="mine-track-progress" style={{ width: `${progressPercent}%` }}></div>

            {LEVELS.map((lvl) => {
              const isCurrent = lvl.id === unlockedLevel;
              // ✅ แก้ตรงนี้: ให้เครื่องหมายถูกโชว์เฉพาะด่านที่ผ่านมาแล้วในรอบ "ปัจจุบัน" เท่านั้น
              const isDone = lvl.id < unlockedLevel; 
              const isLocked = lvl.id > unlockedLevel;

              return (
                <button
                  key={lvl.id}
                  className={`mine-node-v2 
                    ${isCurrent ? "current" : ""} 
                    ${isDone ? "completed" : ""} 
                    ${isLocked ? "locked" : ""}`
                  }
                  // ✅ แก้ตรงนี้: ปลดล็อก disabled ให้กดเล่นด่านปัจจุบันได้เสมอ แม้จะเคยจบเกมไปแล้ว
                  disabled={!isCurrent} 
                  onClick={() => {
                    playClick();
                    setLevel(lvl);
                    setScreen("rule");
                  }}
                >
                  {isDone ? "✔" : lvl.id}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </MainLayout>
  );
}

if (screen === "rule") {
  return (
    <MainLayout>
      <div
        className="mine-rule-overlay fade-in"
        style={{ backgroundImage: `url(${bgMining})` }}
      >
        <div className="mine-rule-card">

          <h2 className="mine-rule-title">
            ⛏️ ภารกิจจัดเรียงคริสตัล (Quick Sort)
          </h2>

          <div className="mine-rule-layout-balanced">

  {/* LEFT SIDE */}
  {character && (
    <div className="rule-left">
      <div className="rule-avatar-wrapper">
        <img src={character.img} alt="char" />
      </div>

      <h3 className="rule-char-name">{character.nameEn}</h3>

      <div className="rule-char-stats">
        <div>❤️ HP: {character.hp}</div>
        <div>⏳ เวลาโบนัส: +{character.timeBonus}s</div>
      </div>
    </div>
  )}

  {/* RIGHT SIDE */}
  <div className="rule-right">

    <div className="rule-steps-box">
      <div>💎 เลือก <strong>Pivot</strong></div>
      <div>⬅️ ขยับ L เพื่อหาแร่ที่ควรสลับ</div>
      <div>➡️ ขยับ R เช่นเดียวกัน</div>
      <div>🔄 Swap แร่ซ้าย–ขวา</div>
      <div>🏁 Final Swap วาง Pivot ให้ถูกตำแหน่ง</div>
      <div>♻️ แบ่งซ้าย–ขวา แล้วทำซ้ำ</div>
    </div>

    <div className="rule-warning-box">
      ⚠️ ถ้า HP หมด หรือเวลาเหลือ 0 ภารกิจล้มเหลว!
    </div>

    <button
      className="rule-start-btn"
      onClick={() => {
        playClick();
        startLevel(level);
      }}
    >
      🚀 เริ่มขุดเหมือง
    </button>

  </div>
</div>
          {/* ===== END LAYOUT ===== */}

        </div>
      </div>
    </MainLayout>
  );
}


if (screen === "result") {
  // ✅ เพิ่มบรรทัดนี้เพื่อหาว่ามีด่านถัดไปไหม (แก้ Error nextLvl is not defined)
  const nextLvl = LEVELS.find(l => l.id === level?.id + 1);

  return (
    <MainLayout>
      <div className="mine-result-screen-centered">
        {/* เลเยอร์มืดด้านหลังเพื่อให้ข้อความสีขาวสว่างจึ้ง */}
        <div className="result-overlay" style={{ position: 'absolute', inset: 0, backgroundColor: 'rgba(0,0,0,0.8)' }}></div>

        <div className="result-card-v8 glass-panel-neon pop-in">
          <h1 className="neon-text-white-bold" style={{ color: '#FFFFFF', textShadow: '0 0 10px #00f2ff, 0 0 20px #00f2ff', fontSize: '2.8rem', fontWeight: '900' }}>
            ภารกิจสำเร็จ!
          </h1>

          <div className="score-main-v8" style={{ background: 'rgba(255,255,255,0.05)', padding: '20px', borderRadius: '20px', margin: '20px 0' }}>
            <p className="score-label-v8" style={{ color: '#00f2ff', fontWeight: 'bold' }}>คะแนนที่ทำได้ในด่านนี้</p>
            {/* ตัวเลขคะแนนสีขาวสว่างเด่นชัด */}
            <h2 className="score-number-v8" style={{ color: '#FFFFFF', fontSize: '4rem', margin: '10px 0' }}>{score}</h2>
          </div>

          <div className="score-footer-v8" style={{ color: '#a8ff78', fontWeight: 'bold', marginBottom: '30px' }}>
          </div>

          <div className="result-actions-v8" style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            {/* ปุ่มด่านถัดไป: ไม่มีปุ่มเล่นซ้ำตามกฎที่คุณตั้งไว้ */}
            {nextLvl ? (
  <button 
    className="btn-v8-next"
    onClick={() => {
      // 🚩 1. ปลดล็อกด่านถัดไป
      const nextLevelId = nextLvl.id;

      setUnlockedLevel(nextLevelId);

      saveProgress({
        level: nextLevelId
      });

      // 🚩 2. เริ่มด่านใหม่
      startLevel(nextLvl);
    }}
    style={{
      padding: '15px',
      borderRadius: '15px',
      background: 'linear-gradient(135deg, #00f2ff, #007bff)',
      color: 'white',
      fontWeight: 'bold',
      border: 'none',
      cursor: 'pointer'
    }}
  >
    เข้าสู่เหมืองด่านถัดไป ⛏️
  </button>
) : (
  <button 
    className="btn-v8-next"
    onClick={() => setScreen("level")}
    style={{
      padding: '15px',
      borderRadius: '15px',
      background: 'linear-gradient(135deg, #00f2ff, #007bff)',
      color: 'white',
      fontWeight: 'bold',
      border: 'none',
      cursor: 'pointer'
    }}
  >
    จบภารกิจ กลับหน้าแผนที่ 🗺️
  </button>
)}
          </div>
        </div>
      </div>
    </MainLayout>
  );
}

//ใช้ตัวนี้ตัวเดียวพอครับ
if (screen === "gameover") {
  return (
    <MainLayout>
      <div className="mine-gameover-screen" style={{ backgroundImage: `url(${bgMining})` }}>
        <div className="mine-dark-overlay"></div>
        <div className="gameover-card pop-in">
          <div className="skull-icon">💀</div>
          <h2 className="gameover-title">ภารกิจล้มเหลว</h2>
          <p className="gameover-sub">พลังชีวิตหมดแล้ว คริสตัลพังหมดเหมือง!</p>
          <div className="gameover-score">💎 คะแนนที่ได้: {score}</div>
          <div className="gameover-buttons">
            <button className="retry-btn" onClick={() => startLevel(level)}>🔄 ลองใหม่</button>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}

return (
  <MainLayout>
    {/* คอนเทนเนอร์หลัก: จัดกึ่งกลางและใช้พื้นหลังเหมือง */}
    <div className="mine-game-screen" style={{ 
      backgroundImage: `url(${bgMining})`, 
      backgroundSize: 'cover', 
      backgroundPosition: 'center',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      minHeight: '100vh',
      padding: '20px'
    }}>
      
      {/* 1. HUD: แสดงสถานะเกมด้วยสีโทนพาสเทลอ่อน (Soft Colors) */}
      <div className="hud-capsule-landscape" style={{ background: 'rgba(0, 0, 0, 0.7)', border: '1px solid rgba(255, 255, 255, 0.2)' }}>
        <div className="soft-mint-text" style={{ color: '#b2fab4' }}>⏳ {time}s</div>
        <div className="soft-purple-text" style={{ fontWeight: '800', color: '#d7bdf2' }}>
          {level?.name} ({level?.sortMode === 'asc' ? "น้อยไปมาก" : "มากไปน้อย"})
        </div>
        <div className="soft-pink-text" style={{ color: '#ffb3ba' }}>❤️ {hp}</div>
        <div className="soft-blue-text" style={{ color: '#bae1ff' }}>💎 {score}</div>
      </div>

      {/* 2. พื้นที่เล่นเกม: กล่องคำอธิบายและคริสตัล */}
      <div className="game-main-area" style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', width: '100%' }}>
        
        {/* กล่องคำอธิบายภารกิจแบบ Compact: สีฟ้าพาสเทล */}
        <div className="instruction-compact-v8" style={{ 
          background: 'rgba(0, 0, 0, 0.85)', 
          border: '1.5px solid #00f2ff', 
          padding: '12px 25px', 
          borderRadius: '12px',
          marginBottom: '30px',
          width: 'fit-content',
          maxWidth: '650px',
          textAlign: 'center'
        }}>
          <div style={{ color: '#ffb3ba', fontSize: '0.9rem', marginBottom: '4px', fontWeight: 'bold' }}>
            ภารกิจรอบนี้: {currentRange.low} ถึง {currentRange.high}
          </div>
          <p style={{ color: '#bae1ff', fontSize: '1.2rem', fontWeight: 'bold', margin: 0, lineHeight: '1.4' }}>
            {getInstructionText()} 
          </p>
        </div>

        {/* แถวคริสตัล: จัดกึ่งกลางและแยกสีตัวที่เรียงเสร็จแล้ว */}
        <div className="crystal-row" style={{ display: 'flex', justifyContent: 'center', gap: '15px', alignItems: 'flex-end' }}>
          {array.map((num, idx) => {
            const isSorted = sortedIndices.includes(idx); // เช็คว่าตัวนี้เรียงเสร็จหรือยัง
            const isInRange = idx >= currentRange.low && idx <= currentRange.high; // อยู่ในรอบที่เล่นอยู่ไหม

            return (
              <div key={idx} className={`crystal-item-v4 ${idx === pivotIndex ? "pivot" : ""}`} style={{ textAlign: 'center', opacity: isInRange || isSorted ? 1 : 0.3 }}>
                
                {/* คำว่า PIVOT ปรากฏด้านบนตัวเลข (สีเหลืองทองทึบ) */}
                <div style={{ 
                  height: '25px', 
                  color: '#ffcc00', 
                  fontSize: '0.85rem', 
                  fontWeight: 'bold',
                  visibility: idx === pivotIndex ? 'visible' : 'hidden' 
                }}>
                  PIVOT
                </div>

                <div className="crystal-box-v4" 
                     style={{ 
                       background: isSorted ? '#1a1a1a' : '#000', // เรียงแล้วจะมืดลง
                       color: isSorted ? '#666' : '#ffffff', // เรียงแล้วเลขจะจางลง อ่านง่ายไม่เรืองแสง
                       border: idx === pivotIndex ? '3px solid #ffcc00' : (isSorted ? '2px solid #222' : '2px solid #444'),
                       cursor: isInRange && phase === "PICK_PIVOT" ? 'pointer' : 'default'
                     }}
                     onClick={() => isInRange && phase === "PICK_PIVOT" && handlePivot(idx)}>
                  {num}
                </div>

                {/* ตัวชี้ L และ R (สีเขียวและแดงพาสเทล) */}
{/* ตัวชี้ L และ R: จะแสดงก็ต่อเมื่อเลือก Pivot เรียบร้อยแล้วเท่านั้น */}
<div className="pointer-space" style={{ height: '35px', marginTop: '8px', position: 'relative' }}>
  {/* 🚩 เพิ่มเงื่อนไข phase !== "PICK_PIVOT" เข้าไป */}
  {phase !== "PICK_PIVOT" && idx === leftPtr && (
    <div className="ptr-v4 l" style={{ color: '#b2fab4', fontWeight: '900', fontSize: '1.2rem' }}>L</div>
  )}
  
  {/* 🚩 เพิ่มเงื่อนไข phase !== "PICK_PIVOT" เข้าไป */}
  {phase !== "PICK_PIVOT" && idx === rightPtr && (
    <div className="ptr-v4 r" style={{ color: '#ffb3ba', fontWeight: '900', fontSize: '1.2rem' }}>R</div>
  )}
</div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 3. แผงควบคุม 6 ปุ่ม: จัดกึ่งกลางด้านล่าง */}
      <div className="controls-wrapper-bottom" style={{ width: '100%', display: 'flex', justifyContent: 'center', paddingBottom: '30px' }}>
        <div className="controls-panel-landscape" style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(6, 1fr)', 
          gap: '12px', 
          background: 'rgba(0,0,0,0.6)', 
          padding: '15px', 
          borderRadius: '15px' 
        }}>
          <button disabled={phase !== "SCAN_LEFT"} onClick={moveLeft} className="btn-ctrl-v2">🔵 ขยับ L</button>
          <button disabled={phase !== "SCAN_LEFT"} onClick={stopL} className="btn-ctrl-v2">🛑 หยุด L</button>
          <button disabled={phase !== "SCAN_RIGHT"} onClick={moveRight} className="btn-ctrl-v2">🔴 ขยับ R</button>
          <button disabled={phase !== "SCAN_RIGHT"} onClick={stopR} className="btn-ctrl-v2">🛑 หยุด R</button>
          {/* ปุ่มสลับและปุ่มวาง: ตรวจลอจิกการสวนกันตามภาพ image_18d77b.png */}
          <button disabled={phase !== "CHECK" || leftPtr >= rightPtr} onClick={checkAndSwap} className="btn-ctrl-v2">🔄 สลับ</button>
          <button disabled={phase !== "CHECK" || leftPtr < rightPtr} onClick={placePivot} className="btn-ctrl-v2">🏁 วาง Pivot</button>
        </div>
      </div>

    </div>
  </MainLayout>
);
}