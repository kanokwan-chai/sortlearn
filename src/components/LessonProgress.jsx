import React from "react";
import "../styles/lesson-progress.css";

export default function LessonProgress({ lessonKey }) {
  const user = JSON.parse(localStorage.getItem("user")) || {};
  const username = user.firstname || "guest";
  
  const progressKey = `progress_${username}_${lessonKey}`;
  
  // ✅✅✅ จุดที่แก้: ผสานข้อมูลจริง เข้ากับค่าเริ่มต้น (Default) ✅✅✅
  const rawData = JSON.parse(localStorage.getItem(progressKey)) || {};
  
  const data = {
    pretest: null,  // ค่าเริ่มต้น: ยังไม่ทำ
    posttest: null, // ค่าเริ่มต้น: ยังไม่ทำ
    game: false,    // ค่าเริ่มต้น: ยังไม่เล่น
    video: false,   // ค่าเริ่มต้น: ยังไม่ดู
    ...rawData      // เอาข้อมูลจริงมาทับ (ถ้าอันไหนไม่มี มันจะใช้ค่าเริ่มต้นแทน ไม่เป็น undefined แล้ว)
  };

  // เช็คว่าผ่านครบมั้ย
  const isComplete = 
    data.pretest !== null && 
    data.posttest !== null && 
    data.game === true && 
    data.video === true;

  return (
    <div className="progress-container">
       {/* 1. ตารางสถานะ */}
       <div className="progress-grid">
         <StatusItem type="test" icon="📝" label="ก่อนเรียน" val={data.pretest} isScore forceGreen={isComplete} />
         <StatusItem type="video" icon="🎬" label="วิดีโอ" val={data.video} forceGreen={isComplete} />
         <StatusItem type="game" icon="🎮" label="เกม" val={data.game} forceGreen={isComplete} />
         <StatusItem type="test" icon="📝" label="หลังเรียน" val={data.posttest} isScore forceGreen={isComplete} />
       </div>

       {/* 2. ปุ่มจบ */}
       {isComplete && (
         <div className="lesson-btn-finished">
            เรียนเสร็จแล้ว 🎉
         </div>
       )}
    </div>
  );
}

function StatusItem({ type, icon, label, val, isScore, forceGreen }) {
  let statusClass = "pending";
  let displayVal = "🔒";

  let isDone = false;
  if (isScore) {
    // ✅ เพิ่มการเช็ค: ต้องมีค่า และต้องไม่เป็น undefined
    if (val !== null && val !== undefined) isDone = true;
  } else {
    if (val === true) isDone = true;
  }

  if (isDone) {
    statusClass = "done";
    displayVal = isScore ? `${val}/10` : "ผ่าน"; 
  }

  // ถ้าผ่านครบหมด ให้เป็นสีเขียว
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