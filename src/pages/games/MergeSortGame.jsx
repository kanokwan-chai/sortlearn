import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import MainLayout from "../../layouts/MainLayout";

// Assets
import bgMerge from "../../assets/mergecity.png";
import penguin from "../../assets/m1.png";
import spirit from "../../assets/m2.png";
import reindeer from "../../assets/m3.png";
import sfxCorrect from "../../assets/sounds/correct.mp3";
import sfxWrong from "../../assets/sounds/wrong.mp3";
import sfxWin from "../../assets/sounds/win.mp3";
import sfxSplit from "../../assets/sounds/split.mp3";
import sfxClick from "../../assets/sounds/click.mp3";

import "../../styles/merge-game.css";

const LESSON_KEY = "merge"; 
const SCORE_API = "https://script.google.com/macros/s/AKfycbxaSnMhAZYVgAwDS7VOgJuINzO2Wn3r8EBMPMFt84nbjy4tn-O5i6OUQIHj19L9jFNJ/exec";

/* ---------------- 1. CONFIG ---------------- */
const LEVELS = [
  { id: 1, size: 6, mode: "asc", label: "ด่าน 1: น้อยไปมาก", time: 90 },
  { id: 2, size: 8, mode: "desc", label: "ด่าน 2: มากไปน้อย", time: 110 },
  { id: 3, size: 10, mode: "asc", label: "ด่าน 3: น้อยไปมาก", time: 120 }
];

const CHARACTERS = [
  { 
    id: "reindeer", 
    name: "Reindeer Guardian", 
    skillName: "เกราะน้ำแข็ง (Durability)", 
    desc: "เหมาะสำหรับผู้เริ่มต้น มีโอกาสผิดพลาดได้มากที่สุด",
    hp: 5,           // เลือดเยอะที่สุดเพื่อรองรับความผิดพลาดในการเรียง
    bonus: 10,       // โบนัสเวลาเล็กน้อย
    img: reindeer, 
    color: "#fbbf24" // สีทองสว่าง (High Contrast)
  },
  { 
    id: "spirit", 
    name: "Ice Spirit", 
    skillName: "จิตวิญญาณแห่งความเร็ว (Speedster)", 
    desc: "เหมาะสำหรับผู้ที่แม่นยำและต้องการทำเวลาสูงสุด",
    hp: 2,           // เลือดน้อย ต้องใช้ความแม่นยำสูง
    bonus: 45,       // โบนัสเวลาเยอะที่สุด (+45 วินาที)
    img: spirit, 
    color: "#0ea5e9" // สีฟ้าสดใส
  },
  { 
    id: "penguin", 
    name: "Penguin Explorer", 
    skillName: "นักสำรวจสมดุล (Balanced)", 
    desc: "ค่าพลังระดับกลาง เหมาะสำหรับทุกระดับการเล่น",
    hp: 3,           // เลือดระดับปกติ
    bonus: 25,       // โบนัสเวลาปานกลาง (+25 วินาที)
    img: penguin, 
    color: "#f8fafc" // สีขาวสะอาดตา
  }
];

/* ---------------- 2. COMPONENT ---------------- */
export default function MergeSortGame() {
  const navigate = useNavigate();
  // Game Flow States
  const [screen, setScreen] = useState("character"); // character, level, game, result
  const [finalScore, setFinalScore] = useState(0);
  const [currentLevelIdx, setCurrentLevelIdx] = useState(0);
  const [character, setCharacter] = useState(null);

  // Game Logic States
  const [root, setRoot] = useState(null);
  const [phase, setPhase] = useState("DIVIDE"); // DIVIDE, MERGE_SELECT, MERGING
  const [instruction, setInstruction] = useState("");
  
  // Stats
  const [hp, setHp] = useState(3);
  const [mistakes, setMistakes] = useState(0);
  const [time, setTime] = useState(null);

  // Merging Workspace
  const [activeNode, setActiveNode] = useState(null);
  const [mergeLeft, setMergeLeft] = useState([]);
  const [mergeRight, setMergeRight] = useState([]);
  const [mergeResult, setMergeResult] = useState([]);
  const [isCompared, setIsCompared] = useState(false);

  const sounds = useRef({
  correct: new Audio(sfxCorrect),
  wrong: new Audio(sfxWrong),
  win: new Audio(sfxWin),
  split: new Audio(sfxSplit),
  click: new Audio(sfxClick)
});
const playClick = () => playSound("click");
  const playSound = (type) => {
    const s = sounds.current[type];
    if (s) { s.currentTime = 0; s.play().catch(() => {}); }
  };

  /* ---------------- 3. CORE FUNCTIONS ---------------- */ 
  // ✅ เพิ่มฟังก์ชันนี้ไว้บนสุดเพื่อหา Key ของผู้ใช้แต่ละคน
  const getCurrentUserKey = () => {
    try {
      const user = JSON.parse(localStorage.getItem("user")) || {};
      return user.email || user.firstname || "guest";
    } catch (e) {
      return "guest";
    }
  };
  const getStorageKey = () => {
  const userKey = getCurrentUserKey();
  return `progress_${userKey}_merge`;
};

  const getRandomArray = (size) => {

  const nums = [];

  while (nums.length < size) {

    const n = Math.floor(Math.random() * 99) + 1;

    if (!nums.includes(n)) {
      nums.push(n);
    }

  }

  return nums;
};

  const startLevel = (idx) => {
  const lvl = LEVELS[idx];
  const arr = getRandomArray(lvl.size);
  
  // 1. ตั้งค่า Logic ภายในก่อน
  setRoot({
    id: "root",
    values: arr,
    left: null,
    right: null,
    isMerged: false,
    isLeaf: arr.length === 1
  });

  // 2. ตั้งค่า Stats ให้เรียบร้อย
  setHp(character.hp);
  setMistakes(0);
  
  // ✅ ตั้งค่าเวลาให้มีค่าก่อนเปลี่ยนหน้าจอ
  const totalTime = lvl.time + character.bonus;
  setTime(totalTime); 
  
  setPhase("DIVIDE");
  setInstruction("❄️ กดที่กล่องตัวเลขเพื่อ 'แยกครึ่ง (Divide)'");
  
  // 3. เปลี่ยนหน้าจอเป็นลำดับสุดท้าย
  setScreen("game");
};

  // 4️⃣ Divide Logic
  const handleDivide = (node) => {
    if (phase !== "DIVIDE" || node.values.length <= 1 || node.left) return;

    playSound("split");
    const mid = Math.floor(node.values.length / 2);
    node.left = {
      id: crypto.randomUUID(),
      values: node.values.slice(0, mid),
      left: null, right: null, isMerged: mid === 1, isLeaf: mid === 1
    };
    node.right = {
      id: crypto.randomUUID(),
      values: node.values.slice(mid),
      left: null, right: null, isMerged: (node.values.length - mid) === 1, isLeaf: (node.values.length - mid) === 1
    };

    setScore(s => s + 10);
    setRoot({ ...root });
    checkDividePhaseComplete();
  };

  const checkDividePhaseComplete = () => {
    const check = (n) => {
      if (!n.left && n.values.length > 1) return false;
      return (n.left ? check(n.left) : true) && (n.right ? check(n.right) : true);
    };
    if (check(root)) {
      setPhase("MERGE_SELECT");
      setInstruction("✨ แยกเสร็จแล้ว! เลือกโหนดคู่ล่างสุดเพื่อ 'ผสาน (Merge)'");
    }
  };

  // 5️⃣ Merge Logic
const isLeafPair = (node) => {
  return node.left?.isMerged && node.right?.isMerged;
};


const selectMergeTarget = (node) => {

  if (phase !== "MERGE_SELECT") return;

 const nextNode = findNextMergeNode(root);

if (node.id !== nextNode?.id) {
  setInstruction("⚠️ ต้องรวมฝั่งซ้ายให้เสร็จก่อน!");
  return;
}

  setActiveNode(node);
  setMergeLeft([...node.left.values]);
  setMergeRight([...node.right.values]);
  setMergeResult([]);
  setIsCompared(false);

  setPhase("MERGING");
  setInstruction("🔍 กดเปรียบเทียบก่อนเลือกตัวเลข");

};
  // 6️⃣ ตรวจสอบการเลือก (ถูก/ผิด)
  const handleChoice = (side) => {
  if (!isCompared) {
    setInstruction("❌ ห้ามเลือกก่อนกดเปรียบเทียบ!");
    applyError();
    return;
  }

const lVal = mergeLeft.length ? mergeLeft[0] : null;
const rVal = mergeRight.length ? mergeRight[0] : null;
  const mode = LEVELS[currentLevelIdx].mode;

  let correctSide;

if (lVal !== null && rVal !== null) {

  correctSide =
    mode === "asc"
      ? (lVal <= rVal ? "left" : "right")
      : (lVal >= rVal ? "left" : "right");

} else if (lVal !== null) {

  correctSide = "left";

} else {

  correctSide = "right";

}

  if (side === correctSide) {
    playSound("correct");

    const picked = side === "left" ? lVal : rVal;

    setMergeResult(prev => [...prev, picked]);

    if (side === "left") {
      setMergeLeft(prev => prev.slice(1));
    } else {
      setMergeRight(prev => prev.slice(1));
    }

    setScore(s => s + 20);
    setIsCompared(false);

  } else {
    setInstruction("❌ เลือกผิดแล้ว!");
    applyError();
  }
};

const getMood = () => {
  if (instruction.includes("❌") || instruction.includes("⚠️")) return "alert";
  if (instruction.includes("✅") || instruction.includes("🎉")) return "success";
  if (instruction.includes("🔍")) return "action";
  return "info";
};

const applyError = () => {
    playSound("wrong");
    setHp(h => {
      if (h <= 1) { 
        setScreen("fail"); // ✅ เด้งไปหน้าแพ้แทนการเริ่มใหม่ทันที
        return 0; 
      }
      return h - 1;
    });
    setScore(s => Math.max(0, s - 10)); // หักคะแนนความผิดพลาด
    setMistakes(m => m + 1);
  };
const isSubtreeMerged = (node) => {
  if (!node) return true;

  if (!node.isMerged && node.left && node.right) {
    return false;
  }

  return (
    isSubtreeMerged(node.left) &&
    isSubtreeMerged(node.right)
  );
};
const findNextMergeNode = (root) => {

  if (!root) return null;

  const level = currentLevelIdx + 1;

  // LEVEL 1-2 ปกติ
  if (level < 3) {

    const left = findNextMergeNode(root.left);
    if (left) return left;

    const right = findNextMergeNode(root.right);
    if (right) return right;

    if (
      root.left &&
      root.right &&
      root.left.isMerged &&
      root.right.isMerged &&
      !root.isMerged
    ) {
      return root;
    }

    return null;
  }

  // ⭐ LEVEL 3

  let candidates = [];

  const walk = (node, depth = 0) => {

    if (!node) return;

    if (
      node.left &&
      node.right &&
      node.left.isMerged &&
      node.right.isMerged &&
      !node.isMerged
    ) {
      candidates.push({ node, depth });
    }

    walk(node.left, depth + 1);
    walk(node.right, depth + 1);
  };

  // ⭐ ค้นเฉพาะฝั่งซ้ายก่อน
  walk(root.left);

  if (candidates.length > 0) {
    candidates.sort((a, b) => b.depth - a.depth);
    return candidates[0].node;
  }

  // ⭐ ถ้าซ้ายเสร็จแล้ว ค่อยไปขวา
  walk(root.right);

  if (candidates.length > 0) {
    candidates.sort((a, b) => b.depth - a.depth);
    return candidates[0].node;
  }

  // ⭐ สุดท้าย merge root
  if (
    root.left &&
    root.right &&
    root.left.isMerged &&
    root.right.isMerged &&
    !root.isMerged
  ) {
    return root;
  }

  return null;
};

  useEffect(() => {
    if (phase === "MERGING" && mergeLeft.length === 0 && mergeRight.length === 0 && mergeResult.length > 0) {
      activeNode.values = [...mergeResult];
      activeNode.isMerged = true;
      setScore(s => s + 50); // ✅ โบนัสเมื่อผสาน Sub-array สำเร็จ
      setRoot({ ...root });
      setPhase("MERGE_SELECT");
      setActiveNode(null);

      if (root.isMerged) {
  playSound("win");
  setInstruction("🎉 ยอดเยี่ยม! คุณผสานครบทุกโหนดแล้ว");

  const levelBonus = (time * 2) + (hp * 50);

  handleLevelComplete(levelBonus);
} else {
        setInstruction("✅ ผสานสำเร็จ! เลือกโหนดถัดไป");
      }
    }
  }, [mergeLeft, mergeRight, mergeResult]);

  // Timer
  // 2. แก้ไขเมื่อเวลาหมด (Timer)
  useEffect(() => {
  let timerId;

  if (screen === "game" && time > 0) {
    timerId = setInterval(() => {

      setTime(prev => {

        if (prev <= 1) {
          clearInterval(timerId);
          setScreen("fail");
          return 0;
        }

        return prev - 1;

      });

    }, 1000);
  }

  return () => clearInterval(timerId);

}, [screen, time]);

  /* ---------------- 4. RENDER UI ---------------- */

// ✅ เพิ่มฟังก์ชันบันทึกตัวละครแบบแยกบัญชี
  const handleSelectCharacter = (c) => {
    const userKey = getCurrentUserKey();
    const storageKey = `progress_${userKey}_merge`;
    
    // ดึงข้อมูลเดิม (เช่น score, level) มาอัปเดต
    const existingData = JSON.parse(localStorage.getItem(storageKey)) || {};
    const updatedData = { ...existingData, charId: c.id };
    
    localStorage.setItem(storageKey, JSON.stringify(updatedData));
    
    setCharacter(c);
    setScreen("level");
  };

  const renderTree = (node) => {
    if (!node) return null;
    const isSelected = activeNode?.id === node.id;
    return (
      <div className="tree-node-wrapper">
        <div 
          className={`node-box ${node.isMerged ? "merged" : ""} ${isSelected ? "active" : ""} ${node.values.length === 1 ? "leaf" : ""}`}
          onClick={() => phase === "DIVIDE" ? handleDivide(node) : selectMergeTarget(node)}
        >
          {node.values.join(", ")}
        </div>
        {(node.left || node.right) && (
          <div className="tree-children">
            {renderTree(node.left)}
            {renderTree(node.right)}
          </div>
        )}
      </div>
    );
  };
  // ✅ แก้ไข useEffect ตัวนี้ให้ดึงข้อมูลตาม User Key
  useEffect(() => {
  const userKey = getCurrentUserKey();
  const storageKey = `progress_${userKey}_merge`;
  const savedData = JSON.parse(localStorage.getItem(storageKey));
  
  // ถ้าเจอข้อมูลตัวละครที่เคยเลือกไว้
  if (savedData?.charId) {
    const savedChar = CHARACTERS.find(c => c.id === savedData.charId);
    if (savedChar) {
      setCharacter(savedChar);
      setScreen("level"); // ✅ เด้งไปหน้าเลือกด่านทันที
    }
  }
}, []);

// ✅ เริ่มต้นที่ 0 และด่าน 1 เสมอสำหรับบัญชีใหม่
const [score, setScore] = useState(0); 
const [unlockedLevel, setUnlockedLevel] = useState(1);

useEffect(() => {

  const userKey = getCurrentUserKey();
  const storageKey = `progress_${userKey}`;

  const saved = JSON.parse(localStorage.getItem(storageKey));

  if (saved) {

    setScore(saved.score || 0);
    setUnlockedLevel(saved.unlockedLevel || 1);

    if (saved.unlockedLevel > LEVELS.length) {
      setFinalScore(saved.score || 0);
      setScreen("finished");
    }

  }

}, []);

const handleLevelComplete = (finalLevelScore) => {

  const userKey = getCurrentUserKey();
  const storageKey = `progress_${userKey}`;

  const existingData =
    JSON.parse(localStorage.getItem(storageKey)) || {};

  const newTotalScore = score + finalLevelScore;
  setScore(newTotalScore);

  // ⭐ ต้องมีตัวนี้
  const nextLvl = currentLevelIdx + 2;

  let updatedLevel = unlockedLevel;

  if (nextLvl > unlockedLevel) {
    updatedLevel = nextLvl;
    setUnlockedLevel(nextLvl);
  }

  const updateData = {
    ...existingData,
    score: newTotalScore,
    unlockedLevel: updatedLevel
  };

  localStorage.setItem(storageKey, JSON.stringify(updateData));

  if (currentLevelIdx + 1 === LEVELS.length) {
    handleFinalWin(newTotalScore);
  } else {
    setScreen("level");
  }
};

useEffect(() => {
  const userKey = getCurrentUserKey();
  const storageKey = `progress_${userKey}`;

  const saved = JSON.parse(localStorage.getItem(storageKey));

  if (saved) {
    setScore(saved.score || 0);
    setUnlockedLevel(saved.unlockedLevel || 1);
  }
}, []);

// 3. ส่งคะแนนรวมเข้า Google Sheet เมื่อจบด่าน 3
const handleFinalWin = (finalScore) => {
  setFinalScore(finalScore);
  const user = JSON.parse(localStorage.getItem("user")) || {};

const userKey = getCurrentUserKey();
const progressKey = `progress_${userKey}_merge`;

const progress =
  JSON.parse(localStorage.getItem(progressKey)) || {};

localStorage.setItem(
  progressKey,
  JSON.stringify({
    ...progress,
    game: true
  })
);

  const payload = {
    activity: "GAMES",
    firstname: user.firstname || "Guest",
    lastname: user.lastname || "Player",
    gameName: "Merge Sort Adventure",
    score: finalScore
  };

  fetch(SCORE_API, {
    method: "POST",
    body: JSON.stringify(payload),
    headers: { "Content-Type": "text/plain;charset=utf-8" }
  }).catch(() => {});

  setScreen("result");
};

 /*====== หน้าจอ ======*/ 

if (screen === "character") return (
  <MainLayout>
    <div id="ms-adventure-scoped">
      <div className="snow-theme-bg" style={{backgroundImage: `url(${bgMerge})`}}>
        <h1 className="title">❄️ MERGE SORT ADVENTURE ❄️</h1>
        
        <div className="char-grid">
          {CHARACTERS.map(c => (
          <div 
            key={c.id} 
            className={`char-tablet ${character?.id === c.id ? 'last-picked' : ''}`} 
            onClick={() => {
            playClick();
            handleSelectCharacter(c);
          }}
          >
              <div className="char-header">
                <h3>{c.name}</h3>
              </div>
              
              <div className="char-body">
                <div className="char-platform"></div>
                <img src={c.img} alt={c.name} />
              </div>
              
              <div className="char-footer">
                <div className="stat-pill">❤️ HP: {c.hp}</div>
                <div className="stat-pill">⏳ Bonus: +{c.bonus}s</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  </MainLayout>
);

if (screen === "level") return (
  <MainLayout>
    <div id="ms-adventure-scoped">
      <div className="snow-theme-bg" style={{backgroundImage: `url(${bgMerge})`}}>
        <div className="mission-map-pro fade-in">
          
          {/* Header Area: แถบคะแนนที่อ่านง่ายชัดเจนบนสีกรมท่าเข้ม */}
          <div className="status-banner-compact glass">
            <h1 className="title-text">❄️ MISSION CONTROL ❄️</h1>
            <div className="banner-stats">
              <div className="stat-item">SCORE: <span>{score}</span></div>
              <div className="stat-item">PROGRESS: <span>{unlockedLevel}/3</span></div>
            </div>
          </div>

          {/* Map Area: เส้นทางแนวนอนที่สมดุลและวงกลมใหญ่ */}
          <div className="level-highway-pro">
            <div className="highway-line-pro"></div>
            
            <div className="nodes-flex-row">
              {LEVELS.map((lvl, idx) => {

  const isCurrent = (idx + 1) === unlockedLevel;
  const isCleared = (idx + 1) < unlockedLevel;
  const isLocked = (idx + 1) > unlockedLevel;
  const isFinished = unlockedLevel > LEVELS.length;

  return (
                  <div key={lvl.id} className="mission-point-wrapper">
                    {/* ตัวละครลอยอยู่ใกล้กับวงกลมในระยะที่พอดี (ไม่ห่างเกินไป) */}
                    {isCurrent && (
                      <div className="avatar-pointer">
                        <div className="tag-you">YOU</div>
                        <img src={character?.img} alt="Me" className="avatar-mini-pro" />
                      </div>
                    )}
                    <button 
                      className={`giant-circle-btn 
                          ${isCurrent ? 'active pulse' : ''} 
                          ${isCleared ? 'cleared' : ''} 
                          ${isLocked ? 'locked' : ''}`
                      }

                      disabled={!isCurrent || isFinished}

                      onClick={() => {
                        if (isCurrent) {
                          playClick();
                          setCurrentLevelIdx(idx);
                          setScreen("rule");
                        }
                      }}
                    >
                      {isCurrent ? lvl.id : isCleared ? "✅" : "🔒"}
                    </button>

                    {/* ป้ายชื่อด่านด้านล่าง: พื้นหลังเข้มอ่านออกง่าย */}
                    <div className={`node-info-pill ${(isCurrent || isCleared) ? 'visible' : 'hidden'}`}>
                      <strong>ด่าน {lvl.id}</strong>
                      <p>{lvl.label}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  </MainLayout>
);

if (screen === "rule") {
  return (
    <MainLayout>
      <div id="ms-adventure-scoped">
        <div className="snow-theme-bg" style={{ backgroundImage: `url(${bgMerge})` }}>
          <div className="rules-compact-card glass fade-in">
            
            <div className="rules-header">
              <h1 className="title-small">❄️ HOW TO PLAY ❄️</h1>
              <p className="subtitle">ทำความเข้าใจภารกิจก่อนเริ่มผจญภัย</p>
            </div>
            
            <div className="rules-main-content">
              {/* ฝั่งซ้าย: ข้อมูลตัวละคร (ย่อส่วน) */}
              <div className="rules-side-profile">
                <div className="mini-frost-avatar">
                  <img src={character?.img} alt={character?.name} />
                </div>
                <div className="char-mini-info">
                  <h3>{character?.name}</h3>
                  <div className="mini-stats">
                    <span>❤️ HP: {character?.hp}</span>
                    <span>⏳ +{character?.bonus}s</span>
                  </div>
                </div>
              </div>

              {/* ฝั่งขวา: กติกา 4 ขั้นตอน (แบบประหยัดพื้นที่) */}
              <div className="rules-steps-list">
                {[
                  { id: 1, title: "DIVIDE", desc: "คลิกกล่องเพื่อแยก (Split) ข้อมูล" },
                  { id: 2, title: "SELECT", desc: "เลือกโหนดคู่ล่างสุดที่พร้อมจะรวม" },
                  { id: 3, title: "COMPARE", desc: "กด 'เปรียบเทียบ' ก่อนเลือกตัวเลขเสมอ" },
                  { id: 4, title: "SORT", desc: "เลือกเลขตามเงื่อนไขด่าน (น้อยไปมาก/มากไปน้อย)" }
                ].map(step => (
                  <div key={step.id} className="compact-step-item">
                    <div className="step-num-icon">{step.id}</div>
                    <div className="step-text">
                      <strong>{step.title}:</strong> {step.desc}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="rules-footer">
              <button className="btn-mission-start" onClick={() => 
                startLevel(currentLevelIdx)}>
                เริ่มภารกิจ 🚀
              </button>
            </div>

          </div>
        </div>
      </div>
    </MainLayout>
  );
}


if (screen === "finished") return (

  <MainLayout>

    <div 
      className="snow-theme-bg result-scene"
      style={{backgroundImage:`url(${bgMerge})`}}
    >

      <div className="result-overlay"></div>

      <div className="result-panel glass-dark fade-in">

        <div className="result-icon">🏆</div>

        <h2 className="result-title">
          ภารกิจสำเร็จ!
        </h2>

        <p className="result-sub">
          คุณผ่าน Merge Sort Adventure แล้ว
        </p>

        <div className="final-score">
          {finalScore.toLocaleString()}
        </div>

        <p className="result-desc">
          คะแนนรวมที่ทำได้
        </p>

        <button
          className="next-btn"
          onClick={() => navigate("/home")}
        >
          กลับหน้าหลัก 🏠
        </button>

      </div>

    </div>

  </MainLayout>

);

if (screen === "result") return (
  <MainLayout>

    <div 
      className="snow-theme-bg result-scene"
      style={{backgroundImage: `url(${bgMerge})`}}
    >

      <div className="result-overlay"></div>

      <div className="result-panel glass-dark fade-in">

        <div className="result-icon">🏆</div>

        <h2 className="result-title">
          MISSION COMPLETE
        </h2>

        <p className="result-sub">
          คุณจัดเรียงข้อมูลด้วย Merge Sort ได้สำเร็จ!
        </p>

        <div className="result-stats glass">

          <div className="r-stat">
            💎 SCORE
            <span>{score}</span>
          </div>

          <div className="r-stat">
            ❌ MISTAKES
            <span>{mistakes}</span>
          </div>

        </div>

        <div className="result-actions">

          <button
            className="next-btn"
            onClick={() => {
              if (currentLevelIdx < LEVELS.length - 1) {
                const next = currentLevelIdx + 1;
                setCurrentLevelIdx(next);
                startLevel(next);
              } else {
                navigate("/lessons/home");
              }
            }}
          >
            {currentLevelIdx < LEVELS.length - 1 
              ? "🚀 ไปด่านถัดไป" 
              : "🏠 กลับหน้าหลัก"}
          </button>

        </div>

      </div>

    </div>

  </MainLayout>
);

if (screen === "fail") return (
  <MainLayout>
    <div id="ms-adventure-scoped">

      <div 
        className="snow-theme-bg fail-scene"
        style={{backgroundImage: `url(${bgMerge})`}}
      >

        <div className="fail-overlay"></div>

        <div className="fail-panel glass-dark fade-in">

          <div className="fail-icon">⏰</div>

          <h1 className="fail-title">
            MISSION FAILED
          </h1>

          <p className="fail-desc">
            {time === 0 
              ? "เวลาหมดเสียก่อน!" 
              : "พลังชีวิตของคุณหมดลงแล้ว"} 
            <br/>
          </p>

          <div className="fail-stats glass">

            <div className="f-stat">
              💎 SCORE
              <span>{score}</span>
            </div>

            <div className="f-stat">
              ❌ MISTAKES
              <span>{mistakes}</span>
            </div>

          </div>

          <div className="fail-actions">

            <button
              className="btn-retry"
              onClick={() => startLevel(currentLevelIdx)}
            >
              🔄 ลองใหม่อีกครั้ง
            </button>

            <button
              className="btn-map"
              onClick={() => setScreen("level")}
            >
              🗺️ กลับไปหน้าแผนที่
            </button>

          </div>

        </div>

      </div>
    </div>
  </MainLayout>
);

return (
  <MainLayout>
    <div id="ms-adventure-scoped">

      {/* ❄️ SNOW WORLD BACKGROUND */}
      <div
        className="gameplay-container snow-theme-bg"
        style={{ backgroundImage: `url(${bgMerge})` }}
      >
        <div className="snow-overlay"></div>
        <div className="ambient-glow"></div>

        {/* ================= HUD ================= */}
        <div className="game-hud-v2 glass-dark-pro">

          <div className="hud-left">
            <div className="hud-stat hp">
              <span className="icon">❤️</span>
              <span className="value">{hp}</span>
            </div>

            <div className="hud-stat score">
              <span className="icon">💎</span>
              <span className="value gold-text">{score}</span>
            </div>
          </div>

          <div className="hud-center">
            <div className={`timer-pill ${time <= 10 ? "urgent" : ""}`}>
              <span className="timer-icon">⏳</span>
              <span className="timer-text">
                {Math.floor(time / 60)}:
                {String(time % 60).padStart(2, "0")}
              </span>
            </div>
          </div>

          <div className="hud-right">
            <div className="mode-tag-v2">
              {LEVELS[currentLevelIdx].mode === "asc"
                ? "น้อย ⮕ มาก"
                : "มาก ⮕ น้อย"}
            </div>
          </div>

        </div>

        {/* ================= INSTRUCTION ================= */}
        <div className={`instruction-master-v2 ${getMood()} fade-in`}>

          <div className="instruction-glow"></div>

          <div className="inner-content">
            <span className="mood-icon">
              {getMood() === "action" ? "⚡" : "❄️"}
            </span>

            <p className="instruction-text">
              {instruction}
            </p>
          </div>

        </div>

        {/* ================= MAIN WORKSPACE ================= */}
        <div className="main-workspace-final-v1 fade-in">

          {phase === "MERGING" ? (

            <div className="battle-crystal-frame glass-dark-pro">

              {/* -------- Comparison Arena -------- */}
              <div className="comparison-row">

                <div
                  className={`crystal-node-pro left ${
                    isCompared ? "reveal" : "hide"
                  }`}
                >
                  <div className="fog-layer"></div>

                  <span className="number-val">
                    {mergeLeft.length > 0 ? mergeLeft[0] : "-"}
                  </span>

                  <small className="label">
                    ฝั่งซ้าย
                  </small>
                </div>

                <div className="vs-emblem-neon">
                  <span>VS</span>
                </div>

                <div
                  className={`crystal-node-pro right ${
                    isCompared ? "reveal" : "hide"
                  }`}
                >
                  <div className="fog-layer"></div>

                  <span className="number-val">
                    {mergeRight.length > 0 ? mergeRight[0] : "-"}
                  </span>

                  <small className="label">
                    ฝั่งขวา
                  </small>
                </div>

              </div>

              {/* -------- Control Panel -------- */}
              <div className="control-action-panel">

                <button
                  className="btn-gem pick-left"
                  disabled={mergeLeft.length === 0 || !isCompared}
                  onClick={() => handleChoice("left")}
                >
                  ← เลือกเลือกแผ่นน้ำแข็งฝั่งซ้าย
                </button>

                <button
                  className="btn-compare-gem-main"
                  onClick={() => {
                    playClick();
                    setIsCompared(true);
                    setInstruction(
                      "🔍 เลือกค่าที่ถูกต้องตามเงื่อนไขด่าน"
                    );
                  }}
                >
                  <div className="shine-sweep"></div>
                  <span>เปรียบเทียบ</span>
                </button>

                <button
                  className="btn-gem pick-right"
                  disabled={mergeRight.length === 0 || !isCompared}
                  onClick={() => handleChoice("right")}
                >
                  เลือกแผ่นน้ำแข็งฝั่งขวา →
                </button>

              </div>

              {/* -------- Output Result -------- */}
              <div className="output-sequence-stable glass-dark">

                <span className="tray-info">
                  ลำดับที่จัดเรียงแล้ว
                </span>

                <div className="sequence-container-grid">

                  {mergeResult.map((v, i) => (
                    <div
                      key={`node-${v}-${i}`}
                      className="output-crystal-pill fade-in-pop"
                    >
                      {v}
                    </div>
                  ))}

                  {mergeResult.length === 0 && (
                    <div className="sequence-placeholder">
                      รอการผสานข้อมูล...
                    </div>
                  )}

                </div>

              </div>

            </div>

          ) : (

            <div className="tree-exploration-v2">
              {renderTree(root)}
            </div>

          )}

        </div>

      </div>
    </div>
  </MainLayout>
);
}