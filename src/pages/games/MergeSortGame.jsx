import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import MainLayout from "../../layouts/MainLayout";
import { getAuth } from "../../utils/auth";

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
  { id: "reindeer", name: "Reindeer Guardian", skillName: "เกราะน้ำแข็ง", hp: 5, bonus: 10, img: reindeer, color: "#fbbf24" },
  { id: "spirit", name: "Ice Spirit", skillName: "จิตวิญญาณแห่งความเร็ว", hp: 2, bonus: 45, img: spirit, color: "#0ea5e9" },
  { id: "penguin", name: "Penguin Explorer", skillName: "นักสำรวจสมดุล", hp: 3, bonus: 25, img: penguin, color: "#f8fafc" }
];

/* ---------------- 2. HELPER FUNCTIONS (จัดนอก Component เพื่อความเร็ว) ---------------- */
const getCurrentUserKey = () => {
  try {
    const user = JSON.parse(localStorage.getItem("user")) || {};
    return user.email || user.firstname || "guest";
  } catch (e) { return "guest"; }
};

const submitScoreToSheet = (finalTotal) => {
  try {
    const { email, token } = getAuth(); 
    const user = JSON.parse(localStorage.getItem("user")) || {};

    const payload = {
      activity: "GAMES",
      firstname: user.firstname || "Guest",
      lastname: user.lastname || "-",
      gameName: "Merge Sort Adventure",
      score: finalTotal
    };

    fetch(SCORE_API, {
      method: "POST",
      mode: "no-cors",
      body: JSON.stringify({ ...payload, email, token }),
      headers: { "Content-Type": "text/plain;charset=utf-8" }
    });
  } catch (error) { console.error("Submit Error:", error); }
};

/* ---------------- 3. MAIN COMPONENT ---------------- */
export default function MergeSortGame() {
  const navigate = useNavigate();
  
  // Game States
  const [screen, setScreen] = useState("character");
  const [score, setScore] = useState(0);
  const [finalScore, setFinalScore] = useState(0);
  const [unlockedLevel, setUnlockedLevel] = useState(1);
  const [currentLevelIdx, setCurrentLevelIdx] = useState(0);
  const [character, setCharacter] = useState(null);

  // Logic States
  const [root, setRoot] = useState(null);
  const [phase, setPhase] = useState("DIVIDE");
  const [instruction, setInstruction] = useState("");
  const [hp, setHp] = useState(3);
  const [mistakes, setMistakes] = useState(0);
  const [time, setTime] = useState(null);

  // Merging States
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

  const playSound = (type) => {
    const s = sounds.current[type];
    if (s) { s.currentTime = 0; s.play().catch(() => {}); }
  };

  /* --- ✅ 1. CHECK STATUS (ตรวจสอบการโหลดเกม) --- */
  useEffect(() => {
    const userKey = getCurrentUserKey();
    const storageKey = `progress_${userKey}_merge`;
    const saved = JSON.parse(localStorage.getItem(storageKey));

    if (saved) {
      setScore(saved.score || 0);
      const lvl = (saved.unlockedLevel > 3) ? 1 : (saved.unlockedLevel || 1);
      setUnlockedLevel(lvl);

      if (lvl === 1) {
        setCharacter(null);
        setScreen("character");
      } else if (saved.charId) {
        const char = CHARACTERS.find(c => c.id === saved.charId);
        if (char) { setCharacter(char); setScreen("level"); }
      }
    }
  }, []);

  /* --- ✅ 2. TIMER SYSTEM --- */
  useEffect(() => {
    let timerId;
    if (screen === "game" && time > 0) {
      timerId = setInterval(() => {
        setTime(prev => {
          if (prev <= 1) { clearInterval(timerId); setScreen("fail"); return 0; }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timerId);
  }, [screen, time]);

  /* --- ✅ 3. MERGE CHECK LOGIC --- */
  useEffect(() => {
    if (phase === "MERGING" && mergeLeft.length === 0 && mergeRight.length === 0 && mergeResult.length > 0) {
      activeNode.values = [...mergeResult];
      activeNode.isMerged = true;
      setScore(s => s + 50);
      setRoot({ ...root });
      setPhase("MERGE_SELECT");
      setActiveNode(null);

      if (root.isMerged) {
        playSound("win");
        const bonus = 200 + (time * 2);
        handleLevelComplete(bonus);
      } else {
        setInstruction("✅ ผสานสำเร็จ! เลือกโหนดถัดไป");
      }
    }
  }, [mergeLeft, mergeRight, mergeResult]);

  /* --- ✅ 4. CORE PROGRESS LOGIC (จบด่าน/ส่งคะแนน/เล่นซ้ำ) --- */
  const handleLevelComplete = (lvlScore) => {
    const userKey = getCurrentUserKey();
    const storageKey = `progress_${userKey}_merge`;
    const existingData = JSON.parse(localStorage.getItem(storageKey)) || {};

    const newTotal = score + lvlScore;
    setScore(newTotal);
    setFinalScore(newTotal);

    const isFinal = (currentLevelIdx + 1) === LEVELS.length;

    if (isFinal) {
      submitScoreToSheet(newTotal);
      localStorage.setItem(storageKey, JSON.stringify({
        ...existingData, game: true, score: 0, charId: null, unlockedLevel: 1
      }));
      setScreen("result");
    } else {
      const next = currentLevelIdx + 2;
      setUnlockedLevel(next);
      localStorage.setItem(storageKey, JSON.stringify({
        ...existingData, score: newTotal, unlockedLevel: next
      }));
      setScreen("level");
    }
  };

  /* --- ✅ 5. GAME ACTIONS --- */
  const startLevel = (idx) => {
    const lvl = LEVELS[idx];
    const nums = [];
    while (nums.length < lvl.size) {
      const r = Math.floor(Math.random() * 99) + 1;
      if (!nums.includes(r)) nums.push(r);
    }
    setRoot({ id: "root", values: nums, left: null, right: null, isMerged: false, isLeaf: nums.length === 1 });
    setHp(character.hp);
    setMistakes(0);
    setTime(lvl.time + character.bonus);
    setPhase("DIVIDE");
    setInstruction("❄️ กดที่กล่องตัวเลขเพื่อ 'แยกครึ่ง (Divide)'");
    setScreen("game");
  };

  const handleDivide = (node) => {
    if (phase !== "DIVIDE" || node.values.length <= 1 || node.left) return;
    playSound("split");
    const mid = Math.floor(node.values.length / 2);
    node.left = { id: crypto.randomUUID(), values: node.values.slice(0, mid), left: null, right: null, isMerged: mid === 1, isLeaf: mid === 1 };
    node.right = { id: crypto.randomUUID(), values: node.values.slice(mid), left: null, right: null, isMerged: (node.values.length - mid) === 1, isLeaf: (node.values.length - mid) === 1 };
    setScore(s => s + 10);
    setRoot({ ...root });
    
    const checkComplete = (n) => {
      if (!n.left && n.values.length > 1) return false;
      return (n.left ? checkComplete(n.left) : true) && (n.right ? checkComplete(n.right) : true);
    };
    if (checkComplete(root)) {
      setPhase("MERGE_SELECT");
      setInstruction("✨ แยกเสร็จแล้ว! เลือกโหนดคู่ล่างสุดเพื่อ 'ผสาน (Merge)'");
    }
  };

  const selectMergeTarget = (node) => {
    if (phase !== "MERGE_SELECT") return;
    const findNext = (n) => {
      if (!n || n.isMerged) return null;
      if (n.left && !n.left.isMerged) return findNext(n.left);
      if (n.right && !n.right.isMerged) return findNext(n.right);
      if (n.left?.isMerged && n.right?.isMerged) return n;
      return null;
    };
    const target = findNext(root);
    if (node.id !== target?.id) {
      setInstruction("⚠️ ต้องจัดการก้อนซ้ายให้เสร็จก่อนนะ!");
      applyError();
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

  const handleChoice = (side) => {
    if (!isCompared) { applyError(); return; }
    const lVal = mergeLeft[0], rVal = mergeRight[0];
    const mode = LEVELS[currentLevelIdx].mode;
    let correct;
    if (lVal !== undefined && rVal !== undefined) correct = mode === "asc" ? (lVal <= rVal ? "left" : "right") : (lVal >= rVal ? "left" : "right");
    else correct = lVal !== undefined ? "left" : "right";

    if (side === correct) {
      playSound("correct");
      const picked = side === "left" ? lVal : rVal;
      setMergeResult(prev => [...prev, picked]);
      if (side === "left") setMergeLeft(prev => prev.slice(1));
      else setMergeRight(prev => prev.slice(1));
      setScore(s => s + 20);
      setIsCompared(false);
    } else { setInstruction("❌ เลือกผิดแล้ว!"); applyError(); }
  };

  const applyError = () => {
    playSound("wrong");
    setHp(h => { if (h <= 1) { setScreen("fail"); return 0; } return h - 1; });
    setScore(s => Math.max(0, s - 10));
    setMistakes(m => m + 1);
  };

  const renderTree = (node) => {
    if (!node) return null;
    const isSelected = activeNode?.id === node.id;
    return (
      <div className="tree-node-wrapper">
        <div className={`node-box ${node.isMerged ? "merged" : ""} ${isSelected ? "active" : ""} ${node.values.length === 1 ? "leaf" : ""}`}
             onClick={() => phase === "DIVIDE" ? handleDivide(node) : selectMergeTarget(node)}>
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

    // ✅ ถ้าฝั่งใดฝั่งหนึ่งหมด ให้เผยตัวเลขอีกฝั่งโดยอัตโนมัติ ไม่ต้องกด Compare
useEffect(() => {
  if (phase === "MERGING" && (mergeLeft.length === 0 || mergeRight.length === 0)) {
    setIsCompared(true);
    if (mergeLeft.length === 0 && mergeRight.length > 0) {
      setInstruction("❄️ ฝั่งซ้ายหมดแล้ว! เลือกเลขฝั่งขวาที่เหลือลงมาให้หมด");
    } else if (mergeRight.length === 0 && mergeLeft.length > 0) {
      setInstruction("❄️ ฝั่งขวาหมดแล้ว! เลือกเลขฝั่งซ้ายที่เหลือลงมาให้หมด");
    }
  }
}, [mergeLeft, mergeRight, phase]);
  /* --- ✅ 6. RENDER SCREENS --- */
  if (screen === "character") return (
    <MainLayout>
      <div id="ms-adventure-scoped">
        <div className="snow-theme-bg" style={{backgroundImage: `url(${bgMerge})`}}>
          <h1 className="title">❄️ MERGE SORT ADVENTURE ❄️</h1>
          <div className="char-grid">
            {CHARACTERS.map(c => (
              <div key={c.id} className="char-tablet" onClick={() => {
                const userKey = getCurrentUserKey();
                const storageKey = `progress_${userKey}_merge`;
                const old = JSON.parse(localStorage.getItem(storageKey)) || {};
                localStorage.setItem(storageKey, JSON.stringify({ ...old, charId: c.id }));
                playSound("click"); setCharacter(c); setScreen("level");
              }}>
                <div className="char-header"><h3>{c.name}</h3></div>
                <div className="char-body"><img src={c.img} alt={c.name} /></div>
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
            <div className="status-banner-compact glass">
              <h1 className="title-text">❄️ MISSION CONTROL ❄️</h1>
              <div className="banner-stats">
                <div className="stat-item">SCORE: <span>{score}</span></div>
                <div className="stat-item">PROGRESS: <span>{unlockedLevel}/3</span></div>
              </div>
            </div>
            <div className="level-highway-pro">
              <div className="highway-line-pro"></div>
              <div className="nodes-flex-row">
                {LEVELS.map((lvl, idx) => {
                  const isCurrent = (idx + 1) === unlockedLevel;
                  const isCleared = (idx + 1) < unlockedLevel;
                  return (
                    <div key={lvl.id} className="mission-point-wrapper">
                      {isCurrent && <div className="avatar-pointer"><img src={character?.img} className="avatar-mini-pro" /></div>}
                      <button className={`giant-circle-btn ${isCurrent ? 'active pulse' : ''} ${isCleared ? 'cleared' : ''} ${idx+1 > unlockedLevel ? 'locked' : ''}`}
                              disabled={idx+1 !== unlockedLevel} onClick={() => { playSound("click"); setCurrentLevelIdx(idx); setScreen("rule"); }}>
                        {isCleared ? "✅" : lvl.id}
                      </button>
                      <div className="node-info-pill visible"><strong>ด่าน {lvl.id}</strong><p>{lvl.label}</p></div>
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

  if (screen === "rule") return (
    <MainLayout>
      <div id="ms-adventure-scoped">
        <div className="snow-theme-bg" style={{ backgroundImage: `url(${bgMerge})` }}>
          <div className="rules-compact-card glass fade-in">
            <h1 className="title-small">❄️ HOW TO PLAY ❄️</h1>
            <div className="rules-main-content">
              <div className="rules-side-profile">
                <img src={character?.img} style={{width: '100px'}} />
                <h3>{character?.name}</h3>
              </div>
              <div className="rules-steps-list">
                <p>1. <b>DIVIDE:</b> แยกข้อมูลจนเหลือ 1</p>
                <p>2. <b>SELECT:</b> เลือกโหนดเพื่อรวม</p>
                <p>3. <b>COMPARE:</b> กดเปรียบเทียบก่อนเลือก</p>
                <p>4. <b>SORT:</b> เลือกเลขตามลำดับที่กำหนด</p>
              </div>
            </div>
            <button className="btn-mission-start" onClick={() => startLevel(currentLevelIdx)}>เริ่มภารกิจ 🚀</button>
          </div>
        </div>
      </div>
    </MainLayout>
  );

  if (screen === "result") return (
    <MainLayout>
      <div className="snow-theme-bg result-scene" style={{backgroundImage: `url(${bgMerge})`}}>
        <div className="result-panel glass-dark fade-in">
          <div className="result-icon">🏆</div>
          <h2 className="result-title">MISSION COMPLETE</h2>
          <div className="result-stats glass">
            <div className="r-stat">💎 SCORE <span>{finalScore.toLocaleString()}</span></div>
            <div className="r-stat">❌ MISTAKES <span>{mistakes}</span></div>
          </div>
          <div className="result-actions" style={{display:'flex', gap:'15px'}}>
            <button className="next-btn" style={{background:'rgba(255,255,255,0.2)', border:'2px solid white'}}
                    onClick={() => { setScore(0); setUnlockedLevel(1); setCurrentLevelIdx(0); setCharacter(null); setScreen("character"); }}>
              เล่นอีกครั้ง 🔄
            </button>
            <button className="next-btn" onClick={() => navigate("/home")}>กลับหน้าหลัก 🏠</button>
          </div>
        </div>
      </div>
    </MainLayout>
  );

  if (screen === "fail") return (
    <MainLayout>
      <div className="snow-theme-bg fail-scene" style={{backgroundImage: `url(${bgMerge})`}}>
        <div className="fail-panel glass-dark fade-in">
          <div className="fail-icon">⏰</div>
          <h1 className="fail-title">MISSION FAILED</h1>
          <button className="btn-retry" onClick={() => setScreen("level")}>🗺️ กลับไปแผนที่</button>
        </div>
      </div>
    </MainLayout>
  );

  // Default Gameplay Screen
  return (
    <MainLayout>
      <div id="ms-adventure-scoped">
        <div className="gameplay-container snow-theme-bg" style={{ backgroundImage: `url(${bgMerge})` }}>
          <div className="game-hud-v2 glass-dark-pro">
            <div className="hud-left">❤️ {hp} | 💎 {score}</div>
            <div className="hud-center">⏳ {Math.floor(time/60)}:{String(time%60).padStart(2,'0')}</div>
            <div className="hud-right">{LEVELS[currentLevelIdx].label}</div>
          </div>
          <div className={`instruction-master-v2 info fade-in`}><p>{instruction}</p></div>
          <div className="main-workspace-final-v1 fade-in">
            {phase === "MERGING" ? (
              <div className="battle-crystal-frame glass-dark-pro">
                <div className="comparison-row" style={{ display: 'flex', alignItems: 'center', gap: '30px', marginBottom: '30px' }}>

  {/* ✅ กล่องซ้าย ✅ */}
  <div className="crystal-node-pro" style={{ 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center',
      // ถ้าเลขหมด (isCompared เป็น true และความยาวเป็น 0) ให้จางลงมากเป็นพิเศษ
      opacity: (isCompared && mergeLeft.length === 0) ? 0.2 : 1,
      transition: '0.3s'
  }}>
    {isCompared ? (
      /* --- เมื่อกดเทียบแล้ว --- */
      <span key="left-num" style={{ fontSize: '2.2rem', fontWeight: '900', color: '#fff' }}>
        {/* ✅ ถ้ามีเลขโชว์เลข ถ้าไม่มีปล่อยว่างไปเลย ✅ */}
        {mergeLeft.length > 0 ? mergeLeft[0] : ""}
      </span>
    ) : (
      /* --- เมื่อยังไม่กดเทียบ --- */
      <span key="left-q" style={{ fontSize: '2.5rem', fontWeight: '900', color: '#fff', opacity: 0.3 }}>
        ?
      </span>
    )}
  </div>

  <div className="vs-emblem-neon" style={{ fontSize: '1.2rem', color: '#00d2ff', fontWeight: 'bold', opacity: 0.6 }}>VS</div>

  {/* ✅ กล่องขวา ✅ */}
  <div className="crystal-node-pro" style={{ 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center',
      opacity: (isCompared && mergeRight.length === 0) ? 0.2 : 1,
      transition: '0.3s'
  }}>
    {isCompared ? (
      <span key="right-num" style={{ fontSize: '2.2rem', fontWeight: '900', color: '#fff' }}>
        {/* ✅ ถ้ามีเลขโชว์เลข ถ้าไม่มีปล่อยว่างไปเลย ✅ */}
        {mergeRight.length > 0 ? mergeRight[0] : ""}
      </span>
    ) : (
      <span key="right-q" style={{ fontSize: '2.5rem', fontWeight: '900', color: '#fff', opacity: 0.3 }}>
        ?
      </span>
    )}
  </div>

</div>

                <div className="control-action-panel">
                  <button className="btn-gem" disabled={!isCompared || !mergeLeft.length} onClick={()=>handleChoice("left")}>เลือกซ้าย</button>
                  <button
  className="btn-compare-gem-main"
  disabled={mergeLeft.length === 0 || mergeRight.length === 0} // 👈 เพิ่มบรรทัดนี้
  onClick={() => {
    playSound("click");
    setIsCompared(true);
  }}
>
  <span>เปรียบเทียบ</span>
</button>
                  <button className="btn-gem" disabled={!isCompared || !mergeRight.length} onClick={()=>handleChoice("right")}>เลือกขวา</button>
                </div>
                {/* -------- ส่วนแสดงผลเลขที่เรียงแล้ว (แนวนอน) -------- */}
{/* --- ส่วนแสดงผลตัวเลขที่เรียงแล้ว (Output Tray ใหม่) --- */}
<div style={{
  width: '100%',
  maxWidth: '800px', // จำกัดความกว้างเพื่อให้ดูสมดุล
  margin: '30px auto 0', // ยกให้สูงขึ้นจากขอบล่างนิดหน่อย
  padding: '20px',
  background: 'rgba(15, 23, 42, 0.6)', // สีพื้นหลังเข้มขึ้นเพื่อเน้นความโปร่งแสง
  backdropFilter: 'blur(15px)', // เพิ่มเอฟเฟกต์เบลอพื้นหลัง
  borderRadius: '24px', // ขอบโค้งมนดูนุ่มนวล
  border: '2px solid rgba(148, 163, 184, 0.3)', // ขอบสีเงินบางๆ
  boxShadow: '0 15px 35px rgba(0, 0, 0, 0.4), inset 0 0 15px rgba(148, 163, 184, 0.1)', // เงาลึก
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: '15px' // ระยะห่างระหว่าง Title และ Container
}}>
  
  {/* หัวข้อเล็กๆ */}
  <span style={{
    fontSize: '0.8rem',
    textTransform: 'uppercase', // ตัวพิมพ์ใหญ่ทั้งหมด
    letterSpacing: '2px', // ระยะห่างระหว่างตัวอักษร
    color: '#94a3b8', // สีเทาอ่อน
    opacity: 0.8,
    fontWeight: '600'
  }}>
    ลำดับที่จัดเรียงแล้ว
  </span>

  {/* Container สำหรับตัวเลขแบบแนวราบ (Flex Row) */}
  <div style={{ 
    display: 'flex', 
    flexDirection: 'row', 
    flexWrap: 'wrap', // ให้ตัดบรรทัดได้ถ้ามีตัวเลขเยอะเกิน
    gap: '15px', 
    justifyContent: 'center', // จัดกึ่งกลางแนวนอน
    width: '100%',
    minHeight: '70px',
    padding: '10px 0'
  }}>
    
    {mergeResult.map((v, i) => (
      /* เม็ดยา (Pill) แสดงผลตัวเลข */
      <div key={i} className="fade-in-pop" style={{
        // สไลต์ Plll
        padding: '10px 25px',
        background: 'linear-gradient(135deg, rgba(56, 189, 248, 0.3), rgba(14, 165, 233, 0.1))', // Gradient สีฟ้าโปร่งแสง
        borderRadius: '50px', // เม็ดยาสมบูรณ์
        
        // สไตล์ขอบและเงา
        border: '1px solid rgba(56, 189, 248, 0.4)', 
        boxShadow: '0 0 15px rgba(56, 189, 248, 0.2)', // เรืองแสงสีฟ้าอ่อน
        
        // สไตล์ตัวเลข
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minWidth: '70px'
      }}>
        <span style={{
          fontSize: '1.6rem',
          fontWeight: 'bold',
          color: '#e2e8f0', // สีขาวนวล
          fontFamily: 'sans-serif', // เลือก Font ที่คุณชอบ
          textShadow: '0 2px 5px rgba(0, 0, 0, 0.3)' // เงาใต้ตัวอักษรให้ดูชัด
        }}>
          {v}
        </span>
      </div>
    ))}

    {/* สถานะรอ (Placeholder) */}
    {mergeResult.length === 0 && (
      <div style={{
        color: 'rgba(148, 163, 184, 0.4)',
        fontStyle: 'italic',
        fontSize: '1.1rem',
        marginTop: '15px'
      }}>
        รอการผสานข้อมูล...
      </div>
    )}
  </div>
</div>
              </div>
            ) : (
              <div className="tree-exploration-v2">{renderTree(root)}</div>
            )}
          </div>
        </div>
      </div>
    </MainLayout>
  );
}