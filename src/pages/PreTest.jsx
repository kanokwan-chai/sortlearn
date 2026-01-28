import React from "react";
import { Link } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import "../styles/pretest.css";
import preBg from "../assets/bg2.png";


export default function PreTest() {
  const lessons = [
    { id: 1, text: "Selection Sort", icon: "🔍", link: "/pretest/selection" },
    { id: 2, text: "Insertion Sort", icon: "🧩", link: "/pretest/insertion" },
    { id: 3, text: "Bubble Sort", icon: "🔵", link: "/pretest/bubble" },
    { id: 4, text: "Heap Sort", icon: "🏔️", link: "/pretest/heap" },
    { id: 5, text: "Quick Sort", icon: "⚡", link: "/pretest/quick" },
    { id: 6, text: "Merge Sort", icon: "🔗", link: "/pretest/merge" },
  ];

  return (
    <MainLayout>
      {/* ---------------- HERO ---------------- */}
      <div
        className="pretest-hero"
        style={{ backgroundImage: `url(${preBg})` }}
      >
        <h2 className="pretest-subtitle">แบบทดสอบก่อนเรียน</h2>
        <h1 className="pretest-title">Pre-Test</h1>

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
