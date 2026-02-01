import React, { useState, useEffect, useRef, useMemo } from "react";
import MainLayout from "../../layouts/MainLayout";
import "../../styles/heap-game.css"; 
import { useNavigate } from "react-router-dom";


// ✅ 1. Assets Mapping (ห้ามลบ) [cite: 75, 76]
import bgForest from "../../assets/bg-forest.png";
import h1 from "../../assets/h1.png"; import h2 from "../../assets/h2.png"; import h3 from "../../assets/h3.png"; 
import sfxClick from "../../assets/sounds/click.mp3"; import sfxCorrect from "../../assets/sounds/correct.mp3";
import sfxWrong from "../../assets/sounds/wrong.mp3"; import sfxWin from "../../assets/sounds/win.mp3";

// ✅ 2. Constants (ชุดข้อมูลที่ผ่านการตรวจสอบแล้ว) [cite: 4, 5, 77, 78]
const STAGES = [
    { id: 1, title: "ปลุกพลังรากไม้", icon: "🌱", type: "MAX", goal: "สร้าง Max & Min Heap" },
    { id: 2, title: "เก็บเกี่ยวแห่งลำดับ", icon: "🌾", type: "SORT_ASC", goal: "เรียงลำดับ น้อย -> มาก" },
    { id: 3, title: "มนตราสะท้อน", icon: "🔮", type: "SORT_DESC", goal: "เรียงลำดับ มาก -> น้อย" }
];

const STAGE_DETAILS = {
    0: { goal: "สร้าง Max-Heap และ Min-Heap", hint: "พ่อต้องมากกว่าลูก (Max) หรือน้อยกว่าลูก (Min)", note: "คลิกเลือกโหนด 2 อันเพื่อสลับตำแหน่งกัน" },
    1: { goal: "เรียงลำดับมวลสารจาก น้อยไปมาก", hint: "สกัดค่าที่มากที่สุดจากยอดต้นไม้", note: "สลับ Root กับตำแหน่งสุดท้ายเพื่อสกัด" },
    2: { goal: "เรียงลำดับมวลสารจาก มากไปน้อย", hint: "สกัดค่าที่น้อยที่สุดจากยอดต้นไม้", note: "สลับ Root กับตำแหน่งสุดท้ายเพื่อสกัด" }
};

const STAGES_DATA = [
    { nodes: 7, type: "BUILD_MAX", title: "ด่านที่ 1: การหลอมรวม (Max-Heap)", goal: "สร้าง Max-Heap (พ่อ ≥ ลูก)", level: 1 },
    { nodes: 7, type: "BUILD_MIN", title: "ด่านที่ 1: มนตราสะท้อน (Min-Heap)", goal: "สร้าง Min-Heap (พ่อ ≤ ลูก)", level: 1 },
    { nodes: 7, type: "SORT_ASC", title: "ด่านที่ 2: ระเบียบพฤกษา (น้อย → มาก)", goal: "เรียงลำดับมวลสารจาก น้อยไปหามาก", level: 2 },
    { nodes: 7, type: "SORT_DESC", title: "ด่านที่ 3: มหากาพย์รากไม้ (มาก → น้อย)", goal: "เรียงลำดับมวลสารจาก มากไปหาน้อย", level: 3 }
];

const GUARDIANS = [
    { id: "h1", name: "Elder Oakheart", ability: "เกราะพฤกษา", icon: "🛡️", desc: "ป้องกันความผิดพลาดได้ 2 ครั้ง", img: h1, hp: 4, time: 90 },
    { id: "h2", name: "Pixie Lumina", ability: "พรแห่งกาลเวลา", icon: "⏳", desc: "เพิ่มเวลาจัดเรียงให้อีก 45 วินาที", img: h2, hp: 4, time: 135 },
    { id: "h3", name: "King Sage", ability: "เนตรนักปราชญ์", icon: "❤️", desc: "เริ่มภารกิจด้วย HP สูงสุด 5 หน่วย", img: h3, hp: 5, time: 80 }
];


export default function HeapSortGame() {
    const navigate = useNavigate();
    // ================= 3. State Management (ครบถ้วนห้ามลบ) [cite: 7-10, 80-84] =================
    const [gameState, setGameState] = useState("LOADING");
    const [selectedChar, setSelectedChar] = useState(null);
    const [currentTaskIdx, setCurrentTaskIdx] = useState(0); 
    const [currentLvlIdx, setCurrentLvlIdx] = useState(0);
    const [heap, setHeap] = useState(new Array(7).fill(null)); 
    const [inputArray, setInputArray] = useState(new Array(7).fill("")); 
    const [isInputDone, setIsInputDone] = useState(false);
    const [sortedArray, setSortedArray] = useState(new Array(7).fill(null));
    const [selectedIdx, setSelectedIdx] = useState(null); 
    const [score, setScore] = useState(0);
    const [hp, setHp] = useState(3);
    const [timeLeft, setTimeLeft] = useState(0);
    const [violationIdx, setViolationIdx] = useState(null); 
    const [isAnimating, setIsAnimating] = useState(false);
    const [isVerified, setIsVerified] = useState(false);
    const [isScoreSent, setIsScoreSent] = useState(false);
    const [savedMaxHeap, setSavedMaxHeap] = useState(null);
    const [savedMinHeap, setSavedMinHeap] = useState(null);
    const [swappingPair, setSwappingPair] = useState([]);



    
// ✅ 1. ตั้งค่า Config (ห้ามลบ)
const LESSON_KEY = "heap"; 
const SCORE_API = "https://script.google.com/macros/s/AKfycbxaSnMhAZYVgAwDS7VOgJuINzO2Wn3r8EBMPMFt84nbjy4tn-O5i6OUQIHj19L9jFNJ/exec";

// ✅ 2. ฟังก์ชันส่งคะแนนที่ฉลาดขึ้น (ส่งที่หน้า RESULT เท่านั้น)
// ✅ 1. ฟังก์ชันส่งคะแนน: จะทำงานเมื่อบันทึกว่า "ผ่าน" เท่านั้น
const saveScoreToSheet = async (finalScore) => {
    if (isScoreSent) return; 

    try {
        const user = JSON.parse(localStorage.getItem("user")) || {};
const userKey =
  user.email ||
  user.id ||
  user.username ||
  user.firstname ||
  "guest";

        const payload = {
            activity: "GAMES",
            firstname: user.firstname || userKey,
            lastname: user.lastname || "-",
            gameName: "Heap Sort Game",
            score: finalScore,
            status: "COMPLETED" // ส่งเฉพาะคนที่จบด่าน 3 จริงๆ
        };

        await fetch(SCORE_API, {
            method: "POST",
            body: JSON.stringify(payload),
            headers: { "Content-Type": "text/plain;charset=utf-8" }
        });
        setIsScoreSent(true);
    } catch (e) { console.error("Score sending failed", e); }
};

// ✅ แก้ไข useEffect ตัวแรก (บรรทัดที่ 138-169)
useEffect(() => {
    const resumeJourney = () => {
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

            // 🚫 ถ้าเล่นจบแล้ว (game: true) ให้โชว์หน้า ALREADY_WIN พร้อมคะแนนที่บันทึกไว้
            if (savedData.game === true) {
                setGameState("ALREADY_WIN");
                setScore(savedData.score || 0); // โชว์คะแนนที่จบไปแล้ว
                return;
            }

            // 🛡️ ถ้าเคยเลือกตัวละครไว้แล้ว (กำลังเล่นค้างอยู่)
            if (savedData.charId) {
                const char = GUARDIANS.find(g => g.id === savedData.charId);
                if (char) {
                    setSelectedChar(char);
                    // ✅ ดึงคะแนนล่าสุดที่ "กำลังเล่นค้างอยู่" มาใช้
                    if (savedData.currentScore !== undefined) setScore(savedData.currentScore);
                    setHp(savedData.hp !== undefined ? savedData.hp : char.hp);
                    setCurrentLvlIdx(savedData.level ? savedData.level - 1 : 0);
                    setGameState("MAP"); 
                }
            } else {
                setGameState("HOME");
            }
        } catch (e) { setGameState("HOME"); }
    };

    if (gameState === "LOADING") resumeJourney();
}, [gameState]);

// ✅ 2. ตัวควบคุมการส่ง: ห้ามส่งถ้าไม่ใช่ "ชัยชนะในด่านสุดท้าย"
useEffect(() => {
    // เงื่อนไข: ต้องอยู่หน้า RESULT + ต้องเป็นด่านที่ 3 + ต้องยังมี HP (ชนะ)
    const isStage3Win = currentTaskIdx === 3 && hp > 0;

    if (gameState === "RESULT" && isStage3Win && !isScoreSent) {
        saveScoreToSheet(score);
    }
}, [gameState, score, isScoreSent, currentTaskIdx, hp]);

// ✅ ฟังก์ชันบันทึกความก้าวหน้า (วางไว้ก่อน useEffect)
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

    const inputRefs = useRef([]);
const treePos = useMemo(() => {
    // ✅ ยกขึ้นให้สูงสุด: ด่าน 1 เริ่มที่ 30px | ด่าน 2-3 เริ่มที่ 50px
    const startY = currentTaskIdx < 2 ? 30 : 50; 
    const stepY = 75; // ✅ บีบระยะห่างระหว่างชั้นให้แคบลง (เดิม 85)

    return [
        { x: "50%", y: startY }, // Root
        { x: "20%", y: startY + stepY }, { x: "80%", y: startY + stepY }, // ชั้น 1
        
        /* ✅ ชั้นล่างสุดจะอยู่ที่พิกัด 200px (จากเดิม 300px+) ลอยพ้นปุ่มสกัดแน่นอนครับ */
        { x: "10%", y: startY + stepY * 2 }, { x: "35%", y: startY + stepY * 2 },  
        { x: "65%", y: startY + stepY * 2 }, { x: "90%", y: startY + stepY * 2 }  
    ];
}, [currentTaskIdx]);

    // ================= 4. Logic Functions (ลอจิกจากไฟล์ที่ใช้งานได้จริง) [cite: 16-42, 87-121] =================
    const playSound = (sfx) => { new Audio(sfx).play().catch(() => {}); };

    const initGameData = (guardian) => {
        playSound(sfxClick); setSelectedChar(guardian); setHp(guardian.hp); setTimeLeft(guardian.time);
        setScore(0); setCurrentTaskIdx(0); setCurrentLvlIdx(0);
        setHeap(new Array(7).fill(null)); setInputArray(new Array(7).fill("")); setSortedArray(new Array(7).fill(null));
        setIsInputDone(false); setIsVerified(false); setViolationIdx(null); setSelectedIdx(null); setGameState("MAP");
    };

    const handleArrayInputChange = (idx, val) => {
        const next = [...inputArray];
        next[idx] = val.replace(/\D/g, '').slice(0, 2); 
        setInputArray(next);
    };

    const handleKeyDown = (e, idx) => {
        if (e.key === "Enter") {
            e.preventDefault();
            if (idx < 6) inputRefs.current[idx + 1]?.focus();
            else manifestOrbs();
        }
    };

    const manifestOrbs = () => {
    const validInputs = inputArray.filter(v => v.trim() !== "");
    if (validInputs.length < 7) return triggerToast("กรุณากรอกมวลสารให้ครบ 7 ชนิด! 🏺"); // ✅
    const nums = validInputs.map(Number);
    if (new Set(nums).size !== 7) return triggerToast("ห้ามใส่เลขซ้ำกันนะ! ⚠️"); // ✅
    
    playSound(sfxClick);
    const shuffled = [...nums].sort(() => Math.random() - 0.5);
    setHeap(shuffled);
    setIsInputDone(true);
    
    // เช็คตั้งแต่เริ่มเลยว่าสุ่มออกมาแล้วพังไหม
    const initialError = checkHeapProperty(shuffled, STAGES_DATA[currentTaskIdx].type);
    setViolationIdx(initialError);
};

const handleNodeClick = (idx) => {
    if (gameState !== "PLAYING" || !isInputDone || isAnimating) return;
    
    if (selectedIdx === null) {
        setSelectedIdx(idx); 
        setSwappingPair([]); 
        playSound(sfxClick);
    } else {
        if (selectedIdx === idx) { setSelectedIdx(null); return; }
        
        setIsAnimating(true);
        setSwappingPair([selectedIdx, idx]);
        
        const nextHeap = [...heap];
        [nextHeap[selectedIdx], nextHeap[idx]] = [nextHeap[idx], nextHeap[selectedIdx]];
        
        // ✨ จุดสำคัญ: คำนวณความผิดพลาดล่วงหน้าจากข้อมูลใหม่
        const errorIdx = checkHeapProperty(nextHeap, STAGES_DATA[currentTaskIdx].type);
        
        // 🚀 อัปเดตทุกอย่างพร้อมกัน (React จะ Batch ให้เอง)
        setHeap(nextHeap); 
        setViolationIdx(errorIdx); // อัปเดตสถานะทันที ไม่ต้องรอ setTimeout
        setSelectedIdx(null);
        playSound(sfxClick);
        
        setTimeout(() => { 
            setIsAnimating(false); 
            setSwappingPair([]); 
        }, 500);
    }
};

const checkHeapProperty = (arr, type) => {
    // ✅ ด่าน 2 (SORT_ASC) ใช้ MAX | ด่าน 3 (SORT_DESC) ใช้ MIN
    const isMaxMode = type.includes("MAX") || type === "SORT_ASC"; 
    
    for (let i = 0; i <= 2; i++) {
        const L = 2 * i + 1, R = 2 * i + 2;
        const parentVal = arr[i];
        if (parentVal === null) continue;

        if (isMaxMode) {
            // Logic: พ่อต้องไม่น้อยกว่าลูก
            if ((L < 7 && arr[L] !== null && parentVal < arr[L]) || 
                (R < 7 && arr[R] !== null && parentVal < arr[R])) return i;
        } else {
            // ✅ สำหรับ BUILD_MIN และ SORT_DESC: พ่อต้องไม่มากกว่าลูก
            if ((L < 7 && arr[L] !== null && parentVal > arr[L]) || 
                (R < 7 && arr[R] !== null && parentVal > arr[R])) return i;
        }
    }
    return null;
};

    // ✅ ปรับปรุง handleManualCheck ให้เช็ค HP แม่นยำขึ้น
const handleManualCheck = () => {
    if (heap.includes(null)) {
        return triggerToast("อัญเชิญมวลสารให้ครบก่อน!"); // เปลี่ยนจาก alert
    }
    const currentTask = STAGES_DATA[currentTaskIdx];
    const errorIdx = checkHeapProperty(heap, currentTask.type);

    if (errorIdx !== null) {
        playSound(sfxWrong);
        setViolationIdx(errorIdx);
        setHp(prevHp => {
            const newHp = Math.max(0, prevHp - 1);
            if (newHp === 0) setGameState("RESULT"); 
            return newHp;
        });
        setIsVerified(false);
    } else {
        playSound(sfxCorrect);
        setScore(s => s + 100);
        setViolationIdx(null);
        setIsVerified(true);
    }
};

// ✅ ตรรกะสกัดสารด่าน 2: เรียงน้อยไปมาก สกัดค่ามากสุดไปท้ายแถว
const handleExtraction = () => {
    if (isAnimating || heap.every(v => v === null)) return;

    const currentTask = STAGES_DATA[currentTaskIdx];
    const lastIdx = heap.map(v => v !== null).lastIndexOf(true);
    const harvested = heap[lastIdx]; 
    
    // ✅ หาค่าเป้าหมายตามประเภทด่าน
    const currentTarget = currentTask.type === "SORT_ASC" 
        ? Math.max(...heap.filter(v => v !== null)) // ด่าน 2: หาค่ามากสุด
        : Math.min(...heap.filter(v => v !== null)); // ด่าน 3: หาค่าน้อยสุด
    
    if (harvested !== currentTarget) {
        playSound(sfxWrong);
        setViolationIdx(lastIdx);
        setHp(prev => Math.max(0, prev - 1));
        triggerToast(currentTask.type === "SORT_ASC" ? "ต้องเป็นมวลสารที่มากที่สุด!" : "ต้องเป็นมวลสารที่น้อยที่สุด! ⚠️");
        return;
    }

    setIsAnimating(true);
    const nextHeap = [...heap];
    nextHeap[lastIdx] = null; 
    setHeap(nextHeap);

    const newSorted = [...sortedArray];
    const targetSlot = newSorted.lastIndexOf(null);
    if (targetSlot !== -1) newSorted[targetSlot] = harvested;
    setSortedArray(newSorted);
    setScore(s => s + 150);
    playSound(sfxCorrect);

    // ✨ เช็คสมดุลใหม่ (ด่าน 3 ใช้ลอจิก MIN)
    const errorType = currentTask.type === "SORT_ASC" ? "MAX" : "MIN";
    const errorAfterExtract = checkHeapProperty(nextHeap, errorType);
    setViolationIdx(errorAfterExtract);

setTimeout(() => {
        setIsAnimating(false);
        // ✨ เมื่อต้นไม้ว่างเปล่า (สกัดครบ 7 ตัว)
        if (nextHeap.every(v => v === null)) {
            playSound(sfxWin);
            setIsVerified(true); // ✅ สั่งให้ปุ่ม Next ปรากฏขึ้นแทนปุ่มสกัดสาร
        }
    }, 600);
};

// 1. สร้าง State สำหรับเก็บข้อความแจ้งเตือน
const [toast, setToast] = useState({ show: false, msg: "" });

// 2. ฟังก์ชันสำหรับเรียกใช้งาน (แทนที่ alert)
const triggerToast = (message) => {
    setToast({ show: true, msg: message });
    
    // ให้หายไปเองหลังจาก 3 วินาที
    setTimeout(() => {
        setToast({ show: false, msg: "" });
    }, 3000);
};
// ตัวอย่างการใช้งานในฟังก์ชันเช็คเลขซ้ำ
const checkDuplicate = (newVal) => {
    if (heap.includes(newVal)) {
        triggerToast("ห้ามใส่เลขซ้ำกันนะ! ✨"); // ✅ เรียกใช้แทน alert()
        return false;
    }
    return true;
};

// ✨ คำแนะนำภารกิจแบบ Real-time (ช่วยให้ Sidebar ไม่ดีเลย์และรองรับด่าน 3)
// ✨ คำแนะนำภารกิจ (ต้องมีตัวแปรนี้เพื่อให้ Sidebar ทำงานได้ครับ)
const missionStatus = useMemo(() => {
    const activeElements = heap.filter(v => v !== null);
    if (activeElements.length === 0 && isInputDone) return "🧪 สกัดสารสำเร็จแล้ว! กดปุ่มต่อไปเพื่อเดินทางต่อ";

    if (currentTaskIdx < 2) {
        if (violationIdx !== null) return `⚠️ โหนด ${violationIdx + 1} ผิดกฎ! จัดเรียงให้ถูกต้อง`;
        return STAGES_DATA[currentTaskIdx].goal;
    }

    const lastIdx = heap.map(v => v !== null).lastIndexOf(true);
    const currentTarget = currentTaskIdx === 2 ? Math.max(...activeElements) : Math.min(...activeElements);

    if (violationIdx !== null) {
        return `⚠️ สมดุลพังทลาย! สร้าง ${currentTaskIdx === 2 ? 'Max' : 'Min'}-Heap ใหม่ก่อนสกัดสาร`;
    }

    if (heap[lastIdx] === currentTarget && lastIdx !== 0) {
        return "✨ มวลสารเป้าหมายอยู่จุดสกัดแล้ว! กด 'สกัดสาร' ได้เลย";
    }

    if (heap[0] === currentTarget && lastIdx !== 0) {
        return "💎 สมดุลแล้ว! สลับ Root กับโหนดสุดท้ายเพื่อเตรียมสกัด";
    }

    return "🔄 จัดเรียงมวลสารให้สมดุลตามกฎ Heap";
}, [heap, violationIdx, currentTaskIdx, isInputDone]);

const handleSelectGuardian = (guardian) => {
    playSound(sfxClick); //
    setSelectedChar(guardian); //
    setHp(guardian.hp); //
    setTimeLeft(guardian.time); //
    
    // ✅ บันทึกพันธสัญญาลง LocalStorage ทันที
    saveProgressToStorage({ 
        charId: guardian.id,
        hp: guardian.hp,
        timeLeft: guardian.time,
        level: 1,
        score: 0
    }); 
    
    setGameState("MAP"); // พาส่งไปยังหน้าแผนที่
};


    useEffect(() => {
        let timer = null;
        if (gameState === "PLAYING" && isInputDone && timeLeft > 0) {
            timer = setInterval(() => setTimeLeft(p => p - 1), 1000);
        } else if (timeLeft === 0 && gameState === "PLAYING") setGameState("RESULT");
        return () => clearInterval(timer);
    }, [gameState, isInputDone, timeLeft]);
    useEffect(() => {
    if (hp <= 0 && gameState === "PLAYING") {
        setGameState("RESULT"); // 💀 เลือดหมด = จบเกมทันที
    }
}, [hp, gameState]);


    // ================= 5. Rendering (รวมครบทุกสถานะหน้าจอ) =================
    return (
        <MainLayout>
            <div className="alchemist-viewport" style={{ backgroundImage: `url(${bgForest})` }}>
                <div className="game-screen-center">

                    {/* 🔮 หน้า HOME [cite: 124-131] */}
                    {gameState === "HOME" && (
                        <div className="magical-home-container-wood fade-in">
                            <header className="home-header-capsule-wood">
                                <div className="header-shine"></div>
                                <h1 className="main-title-wood">✦ MAGICAL ALCHEMIST ✦</h1>
                                <p className="sub-title-wood">เลือกผู้พิทักษ์เพื่อเริ่มภารกิจแปรธาตุ</p>
                            </header>
                            <div className="guardian-grid-row-wood">
                                {GUARDIANS.map(g => (
                                    <div key={g.id} className="guardian-card-wood" onClick={() => initGameData(g)}>
                                        <div className="portrait-wrap-wood"><img src={g.img} alt={g.name} className="portrait-img-wood" /></div>
                                        <div className="guardian-info-wood">
                                            <div className="guardian-name-frame-wood"><h3 className="name-text-wood">{g.name}</h3></div>
                                            <div className="ability-badge-wood"><span className="badge-icon">{g.icon}</span> {g.ability}</div>
                                            <p className="description-text-wood">{g.desc}</p>
                                            <div className="button-container-wood"><button className="start-mission-btn-wood">เริ่มภารกิจ 🪄</button></div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* 🗺️ หน้า MAP: แผนที่แนวราบ [cite: 132-137] */}
                    {gameState === "MAP" && (
                        <div className="magical-home-container-wood map-horizontal-view fade-in">
                            <header className="home-header-capsule-wood map-header-adjust">
                                <h1 className="main-title-wood">ALCHEMY WORLD</h1>
                                <p className="sub-title-wood">เส้นทางแห่งผลึกมรกตศักดิ์สิทธิ์</p>
                            </header>
                            <div className="linear-map-container">
                                <div className="magic-trail-line"></div>
                                <div className="nodes-linear-row">
                                    {STAGES.map((s, i) => {
                                        const isLocked = i > currentLvlIdx; const isCurrent = i === currentLvlIdx;
                                        return (
                                            <div key={s.id} className="node-linear-item">
                                                {i < STAGES.length - 1 && <div className={`linear-connector ${i < currentLvlIdx ? 'connector-active' : ''}`}></div>}
                                                <div className={`node-orb ${isLocked ? 'orb-locked' : 'orb-unlocked'} ${isCurrent ? 'orb-active' : ''}`}
                                                    onClick={() => !isLocked && (playSound(sfxClick), setGameState("RULES"))}>
                                                    <div className="orb-inner"><span className="orb-icon">{isLocked ? "🔒" : s.icon}</span></div>
                                                    <div className="orb-label-frame"><span className="orb-label-text">ด่าน {s.id}</span></div>
                                                    <div className="orb-hover-info"><h5>{s.title}</h5><p>{isLocked ? "มนตรายังไม่คลาย..." : s.goal}</p></div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* 📜 หน้า RULES: คัมภีร์กติกา [cite: 64-73] */}
                    {gameState === "RULES" && (
                        <div className="magical-home-container-wood fade-in">
                            <header className="home-header-capsule-wood map-header-adjust"><h1 className="main-title-wood">ALCHEMY RULES</h1>
                            <p className="sub-title-wood">กฎแห่งการเล่นแร่แปรธาตุ</p>
                            </header>
                            <div className="rules-scroll-wrapper">
                                <div className="alchemy-rules-board-compact">
                                    <div className="rules-title-frame"><h2 className="rules-stage-name">{STAGES[currentLvlIdx].title}</h2></div>
                                    <div className="rules-content-area">
                                        <h3 className="stage-goal-text">{STAGE_DETAILS[currentLvlIdx].goal}</h3>
                                        <div className="rules-detail-box-v3">
                                            <ul className="rules-checklist-v3">
                                                <li><span className="star-bullet">✦</span><p>จัดเรียงตามหลัก <b>Heap Sort</b></p></li>
                                                <li><span className="star-bullet">✦</span><p><b>คำแนะนำ:</b> {STAGE_DETAILS[currentLvlIdx].hint}</p></li>
                                                <li><span className="star-bullet">✦</span><p><span className="highlight-label">วิธีจัด:</span> {STAGE_DETAILS[currentLvlIdx].note}</p></li>
                                            </ul>
                                        </div>
                                    </div>
                                    <button className="start-mission-btn-wood1" onClick={() => setGameState("PLAYING")}>เริ่มการแปรธาตุ 🪄</button>
                                </div>
                            </div>
                        </div>
                    )}

{/* 🎮 หน้า PLAYING: Arena v15 */}
{gameState === "PLAYING" && selectedChar && (
    <div className="arena-container-v15 fade-in">
        <div className="top-hud-capsule-v15">
            <div className="hud-left-hero">
                <div className="avatar-mini-v15"><img src={selectedChar.img} alt="hero" /></div>
                <span className="hero-name-v15">{selectedChar.name}</span>
            </div>
            <div className="hud-right-stats"><span>⏳ {timeLeft}s | ✨ {score} | ❤️ {hp}</span></div>
        </div>

        {/* ✅ โซนการเล่นหลัก: แบ่งซ้าย (กรอบแปรธาตุ) ขวา (แผ่นภารกิจ) */}
        <div className="arena-play-zone" style={{ display: 'flex', gap: '25px', alignItems: 'flex-start', justifyContent: 'center', width: '100%' }}>
            
            {/* 🏺 ฝั่งซ้าย: กรอบแปรธาตุสีขาวหลัก */}
            <div className={`alchemy-main-card-v15 ${!isInputDone ? 'array-input-phase' : ''}`} style={{ margin: '0' }}>
                <h2 className="phase-title">🏺 {STAGES_DATA[currentTaskIdx].title}</h2>

                {!isInputDone ? (
                    /* --- ช่วงกรอกข้อมูล --- */
                    <div className="array-input-zone-v1 fade-in">
                        <p className="sub-title-wood" style={{ color: '#2e7d32', marginBottom: '15px' }}>
                            กรอกมวลสาร 7 ชนิดลงในแถวอาร์เรย์เพื่อเตรียมสร้าง Heap
                        </p>
                        <div className="array-shelf">
                            {inputArray.map((v, i) => (
                                <input key={`arr-${i}`} ref={el => inputRefs.current[i] = el}
                                    className="array-slot-input" value={v}
                                    onChange={(e) => handleArrayInputChange(i, e.target.value)}
                                    onKeyDown={(e) => handleKeyDown(e, i)}
                                    placeholder="?"
                                />
                            ))}
                        </div>
                        <button className="action-btn-v15" onClick={manifestOrbs} style={{ marginTop: '25px' }}>
                            อัญเชิญมวลสารลงต้นไม้ ✨
                        </button>
                    </div>
                ) : (
                    /* --- ช่วงต้นไม้แปรธาตุ --- */
                    <div className="tree-phase-v1 fade-in">
                        {/* 🏺 แท่นวางมวลสาร (ด่าน 2 และ 3) */}
                        {currentTaskIdx >= 2 && (
                            <div className="sorting-shelf-v15 fade-in" style={{ marginTop: '20px', marginBottom: '20px' }}>
                                <p style={{ fontSize: '0.9rem', color: '#2e7d32', fontWeight: 'bold' }}>
                                    {currentTaskIdx === 2 
                                        ? "✨ มวลสารที่เรียงลำดับแล้ว (น้อย → มาก):" 
                                        : "✨ มวลสารที่เรียงลำดับแล้ว (มาก → น้อย):"}
                                </p>
                                <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', marginTop: '10px' }}>
                                    {sortedArray.map((num, i) => (
                                        <div key={i} className={`magic-slot ${num ? 'filled' : ''}`} style={{
                                            width: '50px', height: '50px', border: '3px solid #8d6e63',
                                            borderRadius: '12px', display: 'flex', alignItems: 'center',
                                            justifyContent: 'center',
                                            background: num ? '#2e7d32' : '#f5f5f5',
                                            color: num ? '#fff' : '#ccc', fontWeight: 'bold'
                                        }}>
                                            {num || "?"}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* 🌳 พื้นที่ต้นไม้และเส้นเชื่อม */}
                        <div className="tree-area-v15" style={{ height: '380px', position: 'relative' }}>
                            <svg style={{ position: 'absolute', width: '100%', height: '100%', pointerEvents: 'none', overflow: 'visible' }}>
    {/* ✅ ใช้พิกัด x, y จาก treePos ตรงๆ (ลบหน่วย px ออกจาก attribute) */}
    {heap[1] !== null && <line x1={treePos[0].x} y1={treePos[0].y} x2={treePos[1].x} y2={treePos[1].y} stroke="#8d6e63" strokeWidth="4" />}
    {heap[2] !== null && <line x1={treePos[0].x} y1={treePos[0].y} x2={treePos[2].x} y2={treePos[2].y} stroke="#8d6e63" strokeWidth="4" />}

    {heap[3] !== null && <line x1={treePos[1].x} y1={treePos[1].y} x2={treePos[3].x} y2={treePos[3].y} stroke="#8d6e63" strokeWidth="4" />}
    {heap[4] !== null && <line x1={treePos[1].x} y1={treePos[1].y} x2={treePos[4].x} y2={treePos[4].y} stroke="#8d6e63" strokeWidth="4" />}
    
    {heap[5] !== null && <line x1={treePos[2].x} y1={treePos[2].y} x2={treePos[5].x} y2={treePos[5].y} stroke="#8d6e63" strokeWidth="4" />}
    {heap[6] !== null && <line x1={treePos[2].x} y1={treePos[2].y} x2={treePos[6].x} y2={treePos[6].y} stroke="#8d6e63" strokeWidth="4" />}
</svg>

                            {heap.map((val, idx) => (
                                val !== null && (
                                    <div key={idx} 
                                        className={`node-pos-static ${violationIdx === idx ? 'error' : ''} ${(selectedIdx === idx || swappingPair.includes(idx)) ? 'selected' : ''}`}
                                        style={{ left: treePos[idx].x, top: treePos[idx].y, position: 'absolute', cursor: 'pointer' }}
                                        onClick={() => !isVerified && handleNodeClick(idx)} 
                                    >
                                        <span className="orb-val-static">{val}</span>
                                    </div>
                                )
                            ))}
                        </div>

                        {/* 🕹️ ปุ่มควบคุมการเล่น */}
                        <div className="footer-area-v15" style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
                            {(currentTaskIdx <= 1 || isVerified) ? (
                                !isVerified ? (
                                    <button className="action-btn-v15" onClick={handleManualCheck}>ตรวจสอบความสมดุล 🌳</button>
                                ) : (
                                    <button className="action-btn-v15 next" onClick={() => {
    playSound(sfxClick); 
    setIsVerified(false);
    setViolationIdx(null);
    
    const resetForSort = () => {
        setHp(selectedChar.hp); 
        setTimeLeft(selectedChar.time); 
        setSortedArray(new Array(7).fill(null)); 
        setIsInputDone(true);
    };

    if (currentTaskIdx === 0) { 
        // ✅ 1. จบด่าน 1.1 (Max) -> ไป 1.2 (Min) 
        // เปิดรางให้กรอกใหม่ตามคำสั่งครับ
        setSavedMaxHeap([...heap]); 
        setCurrentTaskIdx(1); 
        
        setHeap(new Array(7).fill(null));     // ล้างต้นไม้เก่า
        setInputArray(new Array(7).fill("")); // ✅ เปิดรางให้กรอกมวลสารใหม่
        setIsInputDone(false);                // ✅ ย้อนกลับไปหน้ากรอกเลข
        setHp(selectedChar.hp);               // คืนเลือดเต็ม
        // ไม่ต้องเด้ง RULES คั่น ตามที่เคยตกลงกันไว้ครับ
    } 
    else if (currentTaskIdx === 1) {
        // ✅ 2. จบด่าน 1.2 (Min) -> ไปหน้ากติกา ด่าน 2
        // ใช้ currentScore เพื่อไม่ให้คะแนนเก่า 2300 มาปนกับรอบนี้
        saveProgressToStorage({ currentScore: score, level: 2 }); 

        setSavedMinHeap([...heap]);
        setCurrentTaskIdx(2); 
        setCurrentLvlIdx(1); 
        resetForSort();
        setHeap([...savedMaxHeap]);
        setViolationIdx(checkHeapProperty(savedMaxHeap, "SORT_ASC"));
        setGameState("RULES"); 
    } 
    else if (currentTaskIdx === 2) {
        // ✅ 3. จบด่าน 2 -> ไปหน้ากติกา ด่าน 3
        saveProgressToStorage({ currentScore: score, level: 3 });

        setCurrentTaskIdx(3); 
        setCurrentLvlIdx(2); 
        resetForSort();
        setHeap([...savedMinHeap]);
        setViolationIdx(checkHeapProperty(savedMinHeap, "SORT_DESC"));
        setGameState("RULES");
    }
    else if (currentTaskIdx === 3) {
        // ✅ 4. จบด่าน 3 -> บันทึกคะแนนจริงที่เล่นได้รอบนี้ (เช่น 2150)
        saveProgressToStorage({ game: true, score: score }); 
        setGameState("RESULT"); 
        playSound(sfxWin);
    }
}}>
    {currentTaskIdx === 3 ? "ดูผลลัพธ์ 🏆" : "ต่อไป ⮕"}
</button>
                                )
                            ) : (
                                <button className="action-btn-v15" onClick={handleExtraction}>สกัดสาร ✨</button>
                            )}
                        </div>
                    </div>
                )}
            </div>

            {/* 📜 ฝั่งขวา: แผ่นศิลาภารกิจ */}
            <div className="mission-sidebar-v15">
                <div className={`tablet-refined ${violationIdx !== null ? 'warning-active' : ''}`}>
                    <div className="tablet-inner-border">
                        <header className="tablet-header">ภารกิจ</header>
                        <div className="tablet-divider"></div>
                        <div className="tablet-body">
                            <p className="goal-text">{missionStatus}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div> {/* สิ้นสุด arena-play-zone */}
    </div>
)}

{gameState === "RESULT" && (
  <div className="magical-home-container-wood result-view-clean fade-in">
    
    {/* ✨ เอฟเฟกต์ละอองเวทมนตร์ลอยรอบๆ */}
    <div className="magic-particles"></div>

    <div className="victory-medal-crest">
      {/* 🏆 ส่วนยอดดวงตรา */}
      <div className="medal-crown">
        <span className="crown-icon">👑</span>
      </div>

      <div className="medal-body">
        <h2 className="victory-text-glow">{currentTaskIdx === 3 && hp > 0 ? "MISSION CLEAR" : "MISSION FAILED"}</h2>
        
        {/* 💎 วงล้อคะแนนแบบกระจกเวทมนตร์ */}
        <div className="score-glass-circle">
          <div className="score-inner-glow"></div>
          <span className="score-label-mini">TOTAL SCORE</span>
          <h1 className="score-number-big">{score.toLocaleString()}</h1>
        </div>

        <div className="victory-rank-text">
                    {currentTaskIdx === 3 && hp > 0 
                        ? (score >= 2000 ? "💎 จอมเวทย์ระดับตำนาน" : "🌟 นักแปรธาตุขั้นสูง")
                        : `สิ้นฤทธิ์ที่ด่าน: ${STAGES_DATA[currentTaskIdx].title}`}
                </div>
      </div>

      {/* 🔄 ปุ่มกดสไตล์มินิมอลแต่หรู */}
      <div className="button-container-wood result-btn-box">
        <button className="start-mission-btn-wood restart-btn-gold" onClick={() => window.location.reload()}>
          🔄 กลับสู่หน้าหลัก
        </button>
      </div>
    </div>
  </div>
)}

{/* 🏆 หน้า ALREADY_WIN: โชว์เมื่อจอมเวทย์เคยพิชิตภารกิจไปแล้ว */}
{gameState === "ALREADY_WIN" && (
    <div className="magical-home-container-wood result-view-clean fade-in">
        
        {/* ✨ เอฟเฟกต์ละอองเวทมนตร์ลอยรอบๆ */}
        <div className="magic-particles"></div>

        <div className="victory-medal-crest">
            {/* 🏆 ส่วนยอดดวงตรา */}
            <div className="medal-crown">
                <span className="crown-icon">👑</span>
            </div>

            <div className="medal-body">
                <h2 className="victory-text-glow1">ท่านได้ศึกษาศาสตร์การแปรธาตุครบถ้วนแล้ว</h2>

                <div className="victory-rank-text">
                    {/* แสดงระดับความสำเร็จสูงสุดที่เคยทำไว้ */}
                    ระดับ: {score >= 2000 ? "💎 จอมเวทย์ระดับตำนาน" : "🌟 นักแปรธาตุขั้นสูง"}
                </div>
            </div>

            {/* 🔄 ปุ่มกดสไตล์มินิมอลแต่หรู */}
            <div className="button-container-wood result-btn-box">
                <button className="start-mission-btn-wood restart-btn-gold" onClick={() => navigate("/home")}>
                    🔄 กลับสู่หน้าหลัก
                </button>
            </div>
        </div>
    </div>
)}
                </div>
                {/* 🧧 กล่องแจ้งเตือนภายในเกม */}
{toast.show && (
    <div className="game-toast-v15">
        <div className="toast-content">
            <span className="toast-icon">⚠️</span>
            <p>{toast.msg}</p>
        </div>
    </div>
)}
            </div>
        </MainLayout>
    );
}