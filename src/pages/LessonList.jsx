import React from "react";
import { Link } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";

import "../styles/lessons-new.css";
import bg2 from "../assets/bg2.png";
import nextIcon from "../assets/next.png"; // ลูกศร

export default function LessonsList() {
  const lessons = [
    {
      id: 1,
      text: "Selection Sort (การจัดเรียงแบบเลือก)",
      link: "/selection-sort"
    },
    {
      id: 2,
      text: "Insertion Sort (การจัดเรียงแบบแทรก)",
      link: "/insertion-sort"
    },
    {
      id: 3,
      text: "Bubble Sort (การจัดเรียงแบบฟอง)",
      link: "/bubble-sort"
    },
    {
      id: 4,
      text: "Heap Sort (การจัดเรียงแบบฮีป)",
      link: "/heap-sort"
    },
    {
      id: 5,
      text: "Quick Sort (การจัดเรียงแบบรวดเร็ว)",
      link: "/quick-sort"
    },
    {
      id: 6,
      text: "Merge Sort (การจัดเรียงแบบผสาน)",
      link: "/merge-sort"
    }
  ];

  return (
    <MainLayout>
      {/* ---------------- HERO ---------------- */}
      <div
        className="lesson-hero-v2"
        style={{ backgroundImage: `url(${bg2})` }}
      >
        <h2 className="lesson-hero-sub">เนื้อหาการเรียนรู้</h2>
        <h1 className="lesson-hero-title">Lessons</h1>
      </div>

      {/* ---------------- LIST ---------------- */}
      <div className="lesson-list-container">
        {lessons.map((item) => (
          <Link key={item.id} to={item.link} className="lesson-row-v2">
            <span className="lesson-text-v2">{item.text}</span>
            <img src={nextIcon} className="lesson-arrow-v2" alt="next" />
          </Link>
        ))}
      </div>
    </MainLayout>
  );
}
