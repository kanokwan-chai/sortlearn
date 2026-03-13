import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import "../styles/admin-dashboard.css";

const SCORE_API = "https://script.google.com/macros/s/AKfycbxaSnMhAZYVgAwDS7VOgJuINzO2Wn3r8EBMPMFt84nbjy4tn-O5i6OUQIHj19L9jFNJ/exec"; 

export default function AdminDashboard() {
  const [students, setStudents] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("ALL");
  const [activeAlgo, setActiveAlgo] = useState("ALL_ALGO"); 
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user || user.email !== "kanokwanmail2547@gmail.com") { 
      alert("⚠️ สำหรับแอดมินเท่านั้น!");
      navigate("/home");
    } else {
      fetchStudentData();
    }
  }, [navigate]);

  const fetchStudentData = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${SCORE_API}?action=getScores`);
      const data = await response.json();
      setStudents(data);
    } catch (error) { console.error("Error:", error); } 
    finally { setLoading(false); }
  };

  // ✨ Reset อัลกอริทึมย่อยทุกครั้งที่เปลี่ยน Tab หลัก
  useEffect(() => {
    setActiveAlgo("ALL_ALGO");
  }, [activeTab]);

  // 🔍 ระบบกรองข้อมูล (ชื่อ + ประเภทกิจกรรม + ชื่ออัลกอริทึม/เกม)
  const filteredData = students.filter((item) => {
    const matchesSearch = `${item.firstname} ${item.lastname}`.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTab = activeTab === "ALL" || item.type === activeTab;
    
    // ✨ ดึงชื่อกิจกรรมหรือชื่อเกมมาเช็กคำสำคัญ (เช่น Selection, Bubble)
    const fullName = (item.activityName || item.gameName || "").toLowerCase();
    const matchesAlgo = activeAlgo === "ALL_ALGO" || fullName.includes(activeAlgo.toLowerCase());

    return matchesSearch && matchesTab && matchesAlgo;
  });

  const handleExport = () => {
    const header = "วันที่,ชื่อ,นามสกุล,กิจกรรม,คะแนน,รายละเอียดคำตอบ\n";
    const csvContent = filteredData.map(st => 
      `${new Date(st.timestamp).toLocaleString("th-TH")},${st.firstname},${st.lastname},${st.activityName || st.gameName},${st.score},"${st.allAnswers || "-"}"`
    ).join("\n");
    
    const blob = new Blob(["\uFEFF" + header + csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `Report_${activeTab}_${activeAlgo}_${new Date().toLocaleDateString()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <MainLayout>
      <div className="admin-container fade-in">
        <header className="admin-header">
          <h1>📊 Admin Dashboard</h1>
        </header>

        {/* 1️⃣ Tabs หลัก */}
        <div className="admin-tabs">
          {["ALL", "PRETEST", "POSTTEST", "VIDEO_QA", "GAMES"].map((tab) => (
            <button 
              key={tab}
              className={`tab-btn ${activeTab === tab ? "active" : ""}`}
              onClick={() => setActiveTab(tab)}
            >
              {tab === "ALL" ? "ทั้งหมด" : tab}
            </button>
          ))}
        </div>

        {/* 2️⃣ Sub-Tabs ย่อย (เพิ่มเงื่อนไขให้โชว์ที่ GAMES ด้วย ✨) */}
        {(activeTab === "PRETEST" || activeTab === "POSTTEST" || activeTab === "VIDEO_QA" || activeTab === "GAMES") && (
          <div className="admin-sub-tabs fade-in">
            {["ALL_ALGO", "Selection", "Bubble", "Insertion", "Merge", "Quick", "HEAP"].map((algo) => (
              <button 
                key={algo}
                className={`sub-tab-btn ${activeAlgo === algo ? "active" : ""}`}
                onClick={() => setActiveAlgo(algo)}
              >
                {algo === "ALL_ALGO" ? "ทุกอัลกอริทึม" : algo}
              </button>
            ))}
          </div>
        )}

        <div className="admin-controls glass">
          <div className="search-box">
            <span className="icon">🔍</span>
            <input 
              type="text" 
              placeholder={`ค้นหาใน ${activeTab}...`} 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button onClick={handleExport} className="btn-export">
            📥 โหลดไฟล์ {activeTab} {activeAlgo !== "ALL_ALGO" ? `(${activeAlgo})` : ""}
          </button>
        </div>

        <div className="admin-stats">
          <div className="stat-card glass">
            <small>รายการที่พบ</small>
            <h2>{filteredData.length}</h2>
          </div>
          <div className="stat-card glass">
            <small>คะแนนเฉลี่ย ({activeAlgo === "ALL_ALGO" ? activeTab : activeAlgo})</small>
            <h2>
              {filteredData.length > 0 
                ? (filteredData.reduce((acc, curr) => acc + Number(curr.score), 0) / filteredData.length).toFixed(2)
                : 0}
            </h2>
          </div>
        </div>

        {loading ? (
          <div className="loader-box"><div className="spinner"></div><p>กำลังจัดเรียงข้อมูล...</p></div>
        ) : (
          <div className="admin-table-wrapper glass">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>ชื่อ-นามสกุล</th>
                  <th>กิจกรรม</th>
                  <th>คะแนน</th>
                  <th className="hide-mobile">รายละเอียดคำตอบ</th>
                  <th className="hide-mobile">วันที่/เวลา</th>
                </tr>
              </thead>
              <tbody>
                {filteredData.length > 0 ? (
                  filteredData.map((st, idx) => (
                    <tr key={idx}>
                      <td><strong>{st.firstname} {st.lastname}</strong></td>
                      <td><span className={`badge-type ${st.type}`}>{st.activityName || st.gameName}</span></td>
                      <td className="score-cell">{st.score}</td>
                      <td className="hide-mobile" style={{ fontSize: '12px', color: '#666', maxWidth: '280px' }}>
                        {st.allAnswers ? st.allAnswers.split(" | ").join(", ") : "-"}
                      </td>
                      <td className="hide-mobile">{new Date(st.timestamp).toLocaleString("th-TH")}</td>
                    </tr>
                  ))
                ) : (
                  <tr><td colSpan="5" style={{ textAlign: 'center', padding: '40px' }}>ไม่พบข้อมูลในเงื่อนไขที่เลือก</td></tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </MainLayout>
  );
}