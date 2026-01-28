import React from "react";
import { Link } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import "../styles/pretest.css"; // ✅ ใช้ CSS ตัวเดิมได้เลย ธีมเดียวกัน
import preBg from "../assets/bg2.png"; // พื้นหลังเดิม หรือเปลี่ยนรูปใหม่ก็ได้

export default function PostTest() {
  // เปลี่ยน Link ให้ชี้ไปที่หน้า Posttest ของแต่ละเรื่อง
  const lessons = [
    { id: 1, text: "Selection Sort", icon: "🔍", link: "/posttest/selection" },
    { id: 2, text: "Insertion Sort", icon: "🧩", link: "/posttest/insertion" },
    { id: 3, text: "Bubble Sort", icon: "🔵", link: "/posttest/bubble" },
    { id: 4, text: "Heap Sort", icon: "🏔️", link: "/posttest/heap" },
    { id: 5, text: "Quick Sort", icon: "⚡", link: "/posttest/quick" },
    { id: 6, text: "Merge Sort", icon: "🔗", link: "/posttest/merge" },
  ];

  return (
    <MainLayout>
      {/* ---------------- HERO ---------------- */}
      <div
        className="pretest-hero"
        style={{ backgroundImage: `url(${preBg})` }}
      >
        <h2 className="pretest-subtitle">แบบทดสอบหลังเรียน</h2>
        <h1 className="pretest-title">Post-Test</h1>
      </div>

      {/* ---------------- GRID ---------------- */}
      <div className="pretest-grid">
        {lessons.map((item) => (
          <Link key={item.id} to={item.link} className="pretest-card">
            
            <div className="pretest-circle">{item.id}</div>

            <div className="pretest-info">
              <span className="pretest-icon">{item.icon}</span>
              <span className="pretest-text">{item.text}</span>
            </div>

          </Link>
        ))}
      </div>
    </MainLayout>
  );
}