import React, { useState, useEffect } from "react";
import "../styles/lesson-progress.css";

export default function LessonProgress({ lessonKey }) {

  const user = JSON.parse(localStorage.getItem("user")) || {};
  const username = user.firstname || "guest";

  const progressKey = `progress_${username}_${lessonKey}`;

  // ---------- STATE ----------
  const [data, setData] = useState({
    pretest: null,
    posttest: null,
    game: false,
    video: false
  });

  // ---------- โหลดค่าจาก LocalStorage ----------
  const loadProgress = () => {
    const rawData = JSON.parse(localStorage.getItem(progressKey)) || {};

    setData({
      pretest: null,
      posttest: null,
      game: false,
      video: false,
      ...rawData
    });
  };

  useEffect(() => {
    loadProgress();
    // eslint-disable-next-line
  }, []);

  // ---------- ปุ่มลบประวัติ ----------
  const clearProgress = () => {
    localStorage.removeItem(progressKey);
    loadProgress();
    alert("ล้างประวัติชั่วคราวเรียบร้อยแล้ว ✨");
  };

  // ---------- เช็คเรียนครบ ----------
  const isComplete =
    data.pretest !== null &&
    data.posttest !== null &&
    data.game === true &&
    data.video === true;

  return (
    <div className="progress-container">

      {/* ตาราง */}
      <div className="progress-grid">
        <StatusItem type="test" icon="📝" label="ก่อนเรียน" val={data.pretest} isScore forceGreen={isComplete} />
        <StatusItem type="video" icon="🎬" label="วิดีโอ" val={data.video} forceGreen={isComplete} />
        <StatusItem type="game" icon="🎮" label="เกม" val={data.game} forceGreen={isComplete} />
        <StatusItem type="test" icon="📝" label="หลังเรียน" val={data.posttest} isScore forceGreen={isComplete} />
      </div>

      {/* ปุ่มจบ */}
      {isComplete && (
        <div className="lesson-btn-finished">
          เรียนเสร็จแล้ว 🎉
        </div>
      )}

      {/* ปุ่มล้างประวัติ */}
      <div style={{ textAlign: "center", marginTop: "10px" }}>
        <button
          style={{
            background: "#ff6b6b",
            color: "white",
            border: "none",
            padding: "8px 18px",
            borderRadius: "10px",
            cursor: "pointer",
            fontWeight: "bold"
          }}
          onClick={clearProgress}
        >
          ลบประวัติการเรียนชั่วคราว ♻️
        </button>
      </div>

    </div>
  );
}

function StatusItem({ type, icon, label, val, isScore, forceGreen }) {

  let statusClass = "pending";
  let displayVal = "🔒";
  let isDone = false;

  if (isScore) {
    if (val !== null && val !== undefined) isDone = true;
  } else {
    if (val === true) isDone = true;
  }

  if (isDone) {
    statusClass = "done";
    displayVal = isScore ? `${val}/10` : "ผ่าน";
  }

  const finalType = forceGreen ? "all-green" : type;

  return (
    <div className={`p-item ${statusClass} ${finalType}`}>
      <div className="p-icon-box">{icon}</div>
      <div className="p-info">
        <span className="p-label">{label}</span>
        <span className="p-status-text">{isDone ? "เรียบร้อย" : "ยังไม่เริ่ม"}</span>
      </div>
      <div className="p-val-badge">{displayVal}</div>
    </div>
  );
}
