import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import "../styles/admin-dashboard.css";

// 📊 1. Imports
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

// 📊 2. Register ChartJS
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

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

  useEffect(() => {
    setActiveAlgo("ALL_ALGO");
  }, [activeTab]);

  const filteredData = students.filter((item) => {
    const matchesSearch = `${item.firstname} ${item.lastname}`.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTab = activeTab === "ALL" || item.type === activeTab;
    const fullName = (item.activityName || item.gameName || "").toLowerCase();
    const matchesAlgo = activeAlgo === "ALL_ALGO" || fullName.includes(activeAlgo.toLowerCase());
    return matchesSearch && matchesTab && matchesAlgo;
  });

  // 📊 3. ฟังก์ชันคำนวณคะแนนเฉลี่ยสำหรับกราฟ
  const getAvgForChart = (type, algo) => {
    const filtered = students.filter(s => s.type === type && (s.activityName || "").toLowerCase().includes(algo.toLowerCase()));
    if (filtered.length === 0) return 0;
    return (filtered.reduce((acc, curr) => acc + Number(curr.score), 0) / filtered.length).toFixed(2);
  };

  const algos = ["Selection", "Bubble", "Insertion", "Merge", "Quick", "Heap"];
  const chartData = {
    labels: algos,
    datasets: [
      {
        label: 'ก่อนเรียน (Pre-test)',
        data: algos.map(a => getAvgForChart('PRETEST', a)),
        backgroundColor: 'rgba(186, 230, 253, 0.8)',
        borderRadius: 6,
      },
      {
        label: 'หลังเรียน (Post-test)',
        data: algos.map(a => getAvgForChart('POSTTEST', a)),
        backgroundColor: 'rgba(30, 64, 175, 0.9)',
        borderRadius: 6,
      }
    ]
  };

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

        {/* 2️⃣ Sub-Tabs ย่อย */}
        {(activeTab === "PRETEST" || activeTab === "POSTTEST" || activeTab === "VIDEO_QA" || activeTab === "GAMES") && (
          <div className="admin-sub-tabs fade-in">
            {["ALL_ALGO", "Selection", "Bubble", "Insertion", "Merge", "Quick", "Heap"].map((algo) => (
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

        {/* 🔍 ส่วนค้นหาและ Export */}
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

        {/* 📉 1. กราฟวิเคราะห์: โชว์เฉพาะหน้า "ทั้งหมด (ALL)" เท่านั้น ✨ */}
        {activeTab === "ALL" && !loading && students.length > 0 && (
          <div className="admin-chart-wrapper glass fade-in" style={{ padding: '20px', marginBottom: '30px' }}>
            <h3 style={{ marginBottom: '20px', color: '#1e3a8a', textAlign: 'center' }}>📈 ภาพรวมพัฒนาการเรียนรู้</h3>
            <div style={{ height: '300px' }}>
              <Bar 
                data={chartData} 
                options={{ responsive: true, maintainAspectRatio: false }} 
              />
            </div>
          </div>
        )}

        {/* 📊 2. ส่วนสรุปตัวเลข (Stats): แก้ไขให้ "ซ่อน" ในหน้า ALL ✨ */}
        {activeTab !== "ALL" && (
          <div className="admin-stats fade-in">
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
        )}

        {loading ? (
          <div className="loader-box"><div className="spinner"></div><p>กำลังจัดเรียงข้อมูล...</p></div>
        ) : (
          <div className="admin-table-wrapper glass">
            {/* ... ส่วนของ Table เหมือนเดิม ... */}
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