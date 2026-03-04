import React, { useState, useEffect, useRef } from "react";
import MainLayout from "../../layouts/MainLayout";

import bgMerge from "../../assets/mergecity.png";
import penguin from "../../assets/m1.png";
import spirit from "../../assets/m2.png";
import reindeer from "../../assets/m3.png";

import sfxClick from "../../assets/sounds/click.mp3";
import sfxCorrect from "../../assets/sounds/correct.mp3";
import sfxWrong from "../../assets/sounds/wrong.mp3";
import sfxWin from "../../assets/sounds/win.mp3";
import sfxSplit from "../../assets/sounds/split.mp3";

import "../../styles/merge-game.css";

/* ---------------- CONFIG ---------------- */
const LESSON_KEY = "merge";
const SCORE_API = "https://script.google.com/macros/s/AKfycbxaSnMhAZYVgAwDS7VOgJuINzO2Wn3r8EBMPMFt84nbjy4tn-O5i6OUQIHj19L9jFNJ/exec";

const getUserKey = () => {
  let user = {};
  try { user = JSON.parse(localStorage.getItem("user")) || {}; } catch(e){}

  if (user.email) return user.email;

  let guestId = localStorage.getItem("guest_id");
  if (!guestId) {
    guestId = crypto.randomUUID();
    localStorage.setItem("guest_id", guestId);
  }
  return `guest_${guestId}`;
};

const CHARACTERS = [
  {
    id: "penguin",
    name: "Penguin Explorer",
    img: penguin,
    hp: 4,
    timeBonus: 20,
    scoreBonus: 0,
    ability: "นักสำรวจแห่งตรรกะ • เพิ่มเวลา +20 วิ"
  },
  {
    id: "spirit",
    name: "Ice Spirit",
    img: spirit,
    hp: 3,
    timeBonus: 0,
    scoreBonus: 15,
    ability: "วิญญาณแห่ง Merge • +15 คะแนนต่อการรวม"
  },
  {
    id: "reindeer",
    name: "Reindeer Guardian",
    img: reindeer,
    hp: 5,
    timeBonus: 10,
    scoreBonus: 0,
    ability: "ผู้พิทักษ์แดนน้ำแข็ง • HP สูงสุด"
  }
];

const LEVELS = [
  { id: 1, size: 6, mode: "asc", min: 1, max: 50, time: 90 },
  { id: 2, size: 8, mode: "desc", min: 1, max: 99, time: 110 },
  { id: 3, size: 10, mode: "asc", min: 100, max: 500, time: 120 }
];


/* ---------------- COMPONENT ---------------- */

export default function MergeSortGame() {

  const [screen, setScreen] = useState("character");
  const [character, setCharacter] = useState(null);
  const [unlockedLevel, setUnlockedLevel] = useState(1);

  const [level, setLevel] = useState(null);
  const [tree, setTree] = useState(null);
  const [phase, setPhase] = useState("SPLIT");

  const [hp, setHp] = useState(3);
  const [time, setTime] = useState(0);
  const [score, setScore] = useState(0);

  const [activeNode, setActiveNode] = useState(null);
  const [mergeLeft, setMergeLeft] = useState([]);
  const [mergeRight, setMergeRight] = useState([]);
  const [mergeResult, setMergeResult] = useState([]);


  const [totalScore, setTotalScore] = useState(0);
  const [isGameDone, setIsGameDone] = useState(false);

  const [root, setRoot] = useState(null);
  const [currentNode, setCurrentNode] = useState(null);
  const [divideCount, setDivideCount] = useState(0);

  
  const sounds = useRef({
  click: new Audio(sfxClick),
  correct: new Audio(sfxCorrect),
  wrong: new Audio(sfxWrong),
  win: new Audio(sfxWin),
  split: new Audio(sfxSplit)   // 👈 เพิ่มตรงนี้
});

  const play = (name) => {
    const s = sounds.current[name];
    if (!s) return;
    s.pause();
    s.currentTime = 0;
    s.play().catch(()=>{});
  };

  /* ---------------- GAME START ---------------- */

const createNode = (values) => ({
  id: crypto.randomUUID(),
  values,
  left: null,
  right: null,
  merged: false
});

const generateArray = (size, min, max) => {
  const nums = new Set();
  while (nums.size < size) {
    nums.add(Math.floor(Math.random() * (max - min + 1)) + min);
  }
  return Array.from(nums);
};

  const startLevel = (lvl) => {

  const arr = generateArray(lvl.size, lvl.min, lvl.max);
  const rootNode = createNode(arr);

  setRoot(rootNode);
  setLevel(lvl);

  setPhase("DIVIDE");
  setCurrentNode(null);

  setMergeLeft([]);
  setMergeRight([]);
  setMergeResult([]);

  setHp(character.hp);
  setTime(lvl.time + character.timeBonus);
  setScore(0);
  setDivideCount(c => c + 1);

  setScreen("game");
};

  const handleLevelComplete = () => {
  const levelBonus = 200;
  const currentScore = score + levelBonus;

  const key = `progress_${getUserKey()}_${LESSON_KEY}`;
  const old = JSON.parse(localStorage.getItem(key)) || {};

  const finalTotal = (old.score || 0) + currentScore;

  // ----- ด่านสุดท้าย -----
  if (level.id === LEVELS.length) {

    const updated = {
      ...old,
      score: finalTotal,
      level: LEVELS.length,
      game: true
    };

    localStorage.setItem(key, JSON.stringify(updated));

    setTotalScore(finalTotal);
    setUnlockedLevel(LEVELS.length);
    setIsGameDone(true);
    setScreen("final");
    return;
  }

    const splitNode = (node) => {

  if (node.values.length <= 1) return;

  const mid = Math.floor(node.values.length / 2);

  node.left = createNode(node.values.slice(0, mid));
  node.right = createNode(node.values.slice(mid));

  setRoot({ ...root });

  if (checkAllLeaf(root)) {
    setPhase("MERGE");
  }
};
const checkAllLeaf = (node) => {
  if (!node) return true;

  if (node.values.length > 1 && !node.left) return false;

  return checkAllLeaf(node.left) && checkAllLeaf(node.right);
};


const selectMergeNode = (node) => {

  if (!node.left || !node.right) return;

  if (!node.left.merged || !node.right.merged) return;

  setCurrentNode(node);

  setMergeLeft([...node.left.values]);
  setMergeRight([...node.right.values]);
  setMergeResult([]);
};


const chooseValue = (side) => {

  if (!mergeLeft.length && !mergeRight.length) return;

  const l = mergeLeft[0];
  const r = mergeRight[0];

  let correct;

  if (level.mode === "asc") {
    correct = l <= r ? "left" : "right";
  } else {
    correct = l >= r ? "left" : "right";
  }

  if (side !== correct) {
    handleWrong();
    return;
  }

  if (side === "left") {
    setMergeResult(prev => [...prev, l]);
    setMergeLeft(prev => prev.slice(1));
  } else {
    setMergeResult(prev => [...prev, r]);
    setMergeRight(prev => prev.slice(1));
  }

  setScore(s => s + 50 + character.scoreBonus);
};

  // ----- ด่านปกติ -----
  const nextLevel = level.id + 1;

  const updated = {
    ...old,
    score: finalTotal,
    level: nextLevel
  };

  localStorage.setItem(key, JSON.stringify(updated));

  setUnlockedLevel(nextLevel);
  setTotalScore(finalTotal);
  setScreen("level");
};
  

  /* ---------------- SPLIT ---------------- */

  const checkAllLeaf = (node) => {
  if (!node) return true;

  // ถ้า node ยังมีค่ามากกว่า 1 แต่ยังไม่มีลูก = ยังไม่แตกครบ
  if (node.values.length > 1 && !node.left) return false;

  return checkAllLeaf(node.left) && checkAllLeaf(node.right);
};

  const splitNode = (node) => {

  if (node.values.length <= 1) return;

  play("split");              // 🔊 เสียงแตก
  setScore(s => s + 20);      // 💎 ได้คะแนน

  const mid = Math.floor(node.values.length / 2);

  node.left = createNode(node.values.slice(0, mid));
  node.right = createNode(node.values.slice(mid));

  setRoot({ ...root });

  if (checkAllLeaf(root)) {
    setTimeout(() => {
      setPhase("MERGE");
    }, 500);
  }
};
const hintSplit = () => {
  const findNode = (node) => {
    if (!node) return null;

    if (node.values.length > 1 && !node.left) {
      return node;
    }

    return findNode(node.left) || findNode(node.right);
  };

  const target = findNode(root);

  if (target) {
    alert("ลองแตก node นี้ดูนะ ❄");
  }
};
const autoMerge = () => {
  if (!currentNode) return;

  const l = mergeLeft[0];
  const r = mergeRight[0];

  const correct =
    level.mode === "asc"
      ? l <= r ? "left" : "right"
      : l >= r ? "left" : "right";

  chooseValue(correct);
};

const expandLayer = () => {

  const expand = (node) => {
    if (!node) return;

    if (node.values.length > 1 && !node.left) {
      splitNode(node);
      return;
    }

    expand(node.left);
    expand(node.right);
  };

  expand(root);
};

  const checkSplitComplete = () => {
    const allLeaf = (node) => {
      if (!node) return true;
      if (node.values.length > 1 && !node.left) return false;
      return allLeaf(node.left) && allLeaf(node.right);
    };

    if (allLeaf(tree)) {
      setPhase("MERGE_SELECT");
    }
  };

  const handleWrong = () => {
  setHp(prev => {
    const next = prev - 1;
    if (next <= 0) {
      setScreen("gameover");
      return 0;
    }
    return next;
  });
};


const TreeNode = ({ node, onSplit, onMergeSelect, phase }) => {

  if (!node) return null;

  const isLeaf = !node.left && !node.right;

  return (
    <div className="tree-node">

      <div
        className={`node-box ${isLeaf ? "leaf" : ""} ${
          node.values.length > 1 && phase === "DIVIDE" ? "can-split" : ""
        }`}
        onClick={() => {
          if (phase === "DIVIDE" && node.values.length > 1) {
            onSplit(node);
          }

          if (phase === "MERGE") {
            onMergeSelect && onMergeSelect(node);
          }
        }}
      >
        {node.values.join(", ")}
      </div>

      {node.left && node.right && (
        <div className="tree-children">
          <TreeNode
            node={node.left}
            onSplit={onSplit}
            onMergeSelect={onMergeSelect}
            phase={phase}
          />
          <TreeNode
            node={node.right}
            onSplit={onSplit}
            onMergeSelect={onMergeSelect}
            phase={phase}
          />
        </div>
      )}

    </div>
  );
};
  /* ---------------- MERGE ---------------- */

  const selectMergeNode = (node) => {

    if (!node.left || !node.right) {
      handleWrong();
      return;
    }

    if (!node.left.merged || !node.right.merged) {
      handleWrong();
      return;
    }

    setActiveNode(node);
    setMergeLeft([...node.left.values]);
    setMergeRight([...node.right.values]);
    setMergeResult([]);
    setPhase("MERGE_COMPARE");
  };

  const chooseValue = (side) => {

  if (!mergeLeft.length && !mergeRight.length) return;

  const l = mergeLeft[0];
  const r = mergeRight[0];

  const correctSide = l <= r ? "left" : "right";

  if (side !== correctSide) {
    handleWrong();
    return;
  }

  if (side === "left") {
    setMergeResult(prev => [...prev, l]);
    setMergeLeft(prev => prev.slice(1));
  } else {
    setMergeResult(prev => [...prev, r]);
    setMergeRight(prev => prev.slice(1));
  }

  setScore(s => s + 50);
};

  useEffect(() => {
  if (phase !== "MERGE_COMPARE") return;

  if (mergeLeft.length === 0 || mergeRight.length === 0) {

    const remaining = mergeLeft.length ? mergeLeft : mergeRight;
    const final = [...mergeResult, ...remaining];

    setTree({ values: final });
    setScore(s => s + 150);

    if (final.length === level.size) {
      play("win");
      setScreen("win");
      return;
    }

    setPhase("SPLIT");
  }

}, [mergeLeft, mergeRight]);

useEffect(() => {

  if (phase !== "MERGE") return;
  if (!currentNode) return;

  if (mergeLeft.length === 0 || mergeRight.length === 0) {

    const remaining = mergeLeft.length ? mergeLeft : mergeRight;
    const final = [...mergeResult, ...remaining];

    currentNode.values = final;
    currentNode.merged = true;

    setRoot({ ...root });
    setCurrentNode(null);

    if (root.merged || final.length === level.size) {
      setScreen("win");
    }
  }

}, [mergeLeft, mergeRight]);

  /* ---------------- TIMER ---------------- */

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
  const key = `progress_${getUserKey()}_${LESSON_KEY}`;
  const saved = JSON.parse(localStorage.getItem(key));

  if (!saved) {
    setScreen("character");
    return;
  }

  // โหลดตัวละคร
  if (saved.charId) {
    const found = CHARACTERS.find(c => c.id === saved.charId);
    if (found) setCharacter(found);
  }

  setUnlockedLevel(saved.level || 1);
  setTotalScore(saved.score || 0);

  if (saved.game === true) {
    setIsGameDone(true);
    setScreen("final");
    return;
  }

  setScreen("level");
}, []);
useEffect(() => {
  const key = `progress_${getUserKey()}_${LESSON_KEY}`;
  const saved = JSON.parse(localStorage.getItem(key));

  if (saved?.level) {
    setUnlockedLevel(saved.level);
  }
}, []);

useEffect(() => {
  if (screen !== "game") return;

  const timer = setInterval(() => {
    setTime(t => {
      if (t <= 1) {
        clearInterval(timer);
        setHp(0);
        return 0;
      }
      return t - 1;
    });
  }, 1000);

  return () => clearInterval(timer);
}, [screen]);

  /* ---------------- SCREENS ---------------- */

  if (screen === "character") {
  return (
    <MainLayout>
      <div
        className="frost-hero-pro"
        style={{ backgroundImage: `url(${bgMerge})` }}
      >
        <div className="frost-overlay-pro"></div>

        <h1 className="frost-title-pro">
          ❄ MERGE CITY ❄
        </h1>

        <div className="frost-card-container-pro">
          {CHARACTERS.map((c) => (
            <div
              key={c.id}
              className={`frost-card-pro ${
                character?.id === c.id ? "active" : ""
              }`}
              onClick={() => {
              setCharacter(c);

              const key = `progress_${getUserKey()}_${LESSON_KEY}`;
              const old = JSON.parse(localStorage.getItem(key)) || {};

              localStorage.setItem(key, JSON.stringify({
                ...old,
                charId: c.id
              }));

              setScreen("level");
            }}
            >
              <div className="frost-avatar-pro">
                <img src={c.img} alt={c.name} />
              </div>

              <h2 className="frost-name-pro">{c.name}</h2>

              <div className="ability-bar-pro">
                {c.ability}
              </div>

              <div className="stat-row-pro">
                <span>❤️ {c.hp}</span>
                <span>⏳ +{c.timeBonus}s</span>
                {c.scoreBonus > 0 && (
                  <span>✨ +{c.scoreBonus}/Merge</span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </MainLayout>
  );
}

if (screen === "level") {

  const userKey = getUserKey();
  const key = `progress_${userKey}_${LESSON_KEY}`;
  const savedProgress = JSON.parse(localStorage.getItem(key));
  const isGameDone = savedProgress?.game === true;

  const progressPercent =
    unlockedLevel <= 1
      ? 0
      : ((unlockedLevel - 1) / (LEVELS.length - 1)) * 100;

  return (
    <MainLayout>
      <div
        className="frost-map-screen-pro"
        style={{ backgroundImage: `url(${bgMerge})` }}
      >
        <div className="frost-overlay-pro"></div>

        <div className="frost-map-panel-pro">

          <h1 className="frost-title-pro">
            ❄ MERGE CITY ❄
          </h1>

          <p className="frost-sub-pro">
            เลือกด่านแห่งอาณาจักรน้ำแข็ง
          </p>

          <div className="frost-progress-wrapper">

            <div className="frost-line-base"></div>

            <div
              className="frost-line-progress"
              style={{ width: `${progressPercent}%` }}
            ></div>

            {LEVELS.map((lvl) => {

              const isCurrent = lvl.id === unlockedLevel;
              const isDone = isGameDone ? true : lvl.id < unlockedLevel;
              const isLocked = !isGameDone && lvl.id > unlockedLevel;

              return (
                <button
                  key={lvl.id}
                  disabled={isGameDone || !isCurrent}
                  className={`
                    frost-node-pro
                    ${isCurrent && !isGameDone ? "active" : ""}
                    ${isDone ? "completed" : ""}
                    ${isLocked ? "locked" : ""}
                  `}
                  onClick={() => {
                    if (isGameDone) return;
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
        className="rule-screen-pro"
        style={{ backgroundImage: `url(${bgMerge})` }}
      >
        <div className="rule-overlay-pro"></div>

        <div className="rule-panel-pro">

          <h1 className="rule-title-pro">
            ❄ กติกาแห่งอาณาจักรน้ำแข็ง ❄
          </h1>

          <div className="rule-content-grid">

            {/* LEFT SIDE */}
            <div className="rule-left">

              <img src={character.img} alt={character.name} />

              <h2>{character.name}</h2>

              <div className="rule-stats">
                ❤️ {character.hp}
                &nbsp; | &nbsp;
                ⏳ +{character.timeBonus}s
                {character.scoreBonus > 0 && (
                  <> &nbsp; | &nbsp; ✨ +{character.scoreBonus}/Merge</>
                )}
              </div>

            </div>

            {/* RIGHT SIDE */}
            <div className="rule-right">

              <div className="rule-step-card">
                <span>1</span>
                แบ่งข้อมูลเป็น 2 ฝั่ง (Left / Right)
              </div>

              <div className="rule-step-card">
                <span>2</span>
                เลือกค่าที่ถูกต้องเพื่อเรียงลำดับ
              </div>

              <div className="rule-step-card">
                <span>3</span>
                เลือกผิดจะเสีย HP และเวลา
              </div>

              <div className="rule-step-card">
                <span>4</span>
                เรียงครบทุกค่าจะผ่านด่านทันที
              </div>

            </div>

          </div>

          <div className="rule-warning-pro">
            ⚠ หาก HP หมด หรือเวลาเป็น 0 ภารกิจจะล้มเหลว
          </div>

          <button
            className="rule-start-pro"
            onClick={() => startLevel(level)}
          >
            🚀 เริ่มภารกิจ
          </button>

        </div>
      </div>
    </MainLayout>
  );
}

  if (screen === "gameover") {
    return (
      <MainLayout>
        <div className="merge-over">
          <h2>💀 Game Over</h2>
          <button onClick={() => setScreen("level")}>กลับ</button>
        </div>
      </MainLayout>
    );
  }

  if (screen === "win") {
    return (
      <MainLayout>
        <div className="merge-win">
          <h2>🏆 ผ่านด่าน!</h2>
          <div>คะแนน: {score}</div>
          <button onClick={() => setScreen("level")}>กลับ</button>
        </div>
      </MainLayout>
    );
  }

  /* ---------------- GAME UI ---------------- */

  return (
  <MainLayout>
    <div
      className="merge-game"
      style={{ backgroundImage: `url(${bgMerge})` }}
    >

      {/* ===== HUD ===== */}
      <div className="hud">
        ❤️ {hp} | ⏳ {time} | 💎 {score}
      </div>
      <div className="control-panel">

  {phase === "DIVIDE" && (
    <>
      <button onClick={expandLayer}>
        🔥 แตกทั้งชั้น
      </button>

      <button onClick={hintSplit}>
        💡 Hint
      </button>
    </>
  )}

  {phase === "MERGE" && (
    <>
      <button onClick={autoMerge}>
        ⚡ Merge อัตโนมัติ
      </button>
    </>
  )}

</div>

      {/* ===== PHASE: DIVIDE ===== */}
      {phase === "DIVIDE" && root && (
        <div className="divide-zone">

          <h2 className="zone-title">❄ Divide Zone ❄</h2>
            <div className="divide-progress">
  ❄ แบ่งแล้ว {divideCount} ครั้ง
</div>
          <div className="tree-container">

            <TreeNode
              node={root}
              onSplit={splitNode}
              phase={phase}
            />

          </div>

        </div>
      )}

      {/* ===== PHASE: MERGE ===== */}
      {phase === "MERGE" && (
        <div className="merge-zone">

          <h2 className="zone-title">🔀 Merge Zone 🔀</h2>

          {!currentNode && (
            <div className="tree-container">
              <TreeNode
                node={root}
                onMergeSelect={selectMergeNode}
                phase={phase}
              />
            </div>
          )}

          {currentNode && (
            <div className="merge-panel">

              <div className="merge-side-wrapper">
                <h3>Left</h3>
                <button
                  className="merge-side"
                  onClick={() => chooseValue("left")}
                  disabled={mergeLeft.length === 0}
                >
                  {mergeLeft.join(", ")}
                </button>
              </div>

              <div className="merge-side-wrapper">
                <h3>Right</h3>
                <button
                  className="merge-side"
                  onClick={() => chooseValue("right")}
                  disabled={mergeRight.length === 0}
                >
                  {mergeRight.join(", ")}
                </button>
              </div>

              <div className="merge-result">
                Result: {mergeResult.join(", ")}
              </div>

            </div>
          )}

        </div>
      )}

    </div>
  </MainLayout>
);
}