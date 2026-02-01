import "../styles/lesson-progress.css";

export default function LessonProgress({ lessonKey }) {
  // ✅ ใช้ userKey เดียวกับที่คุณใช้บันทึกคะแนน
  const getUserKey = () => {
    let user = {};
    try {
      user = JSON.parse(localStorage.getItem("user")) || {};
    } catch {}

    if (user.email) return user.email;

    let guestId = localStorage.getItem("guest_id");
    if (!guestId) {
      guestId = crypto.randomUUID();
      localStorage.setItem("guest_id", guestId);
    }
    return `guest_${guestId}`;
  };

  const userKey = getUserKey();
  const progressKey = `progress_${userKey}_${lessonKey}`;

  // ✅ ผสาน default + ข้อมูลจริง
  const rawData = JSON.parse(localStorage.getItem(progressKey)) || {};
  const data = {
    pretest: null,
    posttest: null,
    game: false,
    video: false,
    ...rawData,
  };

  // เช็คว่าผ่านครบมั้ย
  const isComplete =
    data.pretest !== null &&
    data.posttest !== null &&
    data.game === true &&
    data.video === true;

  return (
    <div className="progress-container">
      <div className="progress-grid">
        <StatusItem type="test" icon="📝" label="ก่อนเรียน" val={data.pretest} isScore forceGreen={isComplete} />
        <StatusItem type="video" icon="🎬" label="วิดีโอ" val={data.video} forceGreen={isComplete} />
        <StatusItem type="game" icon="🎮" label="เกม" val={data.game} forceGreen={isComplete} />
        <StatusItem type="test" icon="📝" label="หลังเรียน" val={data.posttest} isScore forceGreen={isComplete} />
      </div>

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
