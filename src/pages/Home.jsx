import React from "react";
import MainLayout from "../layouts/MainLayout";
import { Link } from "react-router-dom";
import LessonProgress from "../components/LessonProgress"; // ✅ Import ตัวใหม่เข้ามา

import "../styles/home.css";

// Assets
import girl from "../assets/girl.png";
import boy from "../assets/boy.png";
import pattern from "../assets/bg.png";
import selectionImg from "../assets/lessons/selection.png";
import insertionImg from "../assets/lessons/insertion.png";
import bubbleImg from "../assets/lessons/bubble.png";
import heapImg from "../assets/lessons/heap.png";
import quickImg from "../assets/lessons/quick.png";
import mergeImg from "../assets/lessons/merge.png";

export default function Home() {
  
  // ฟังก์ชันเช็คว่าผ่านครบหรือยัง (เอาไว้ซ่อนปุ่ม)
  const isLessonDone = (lessonKey) => {
    const user = JSON.parse(localStorage.getItem("user")) || {};
    const username = user.firstname || "guest";
    const key = `progress_${username}_${lessonKey}`;
    const data = JSON.parse(localStorage.getItem(key)) || {};
    
    // เงื่อนไข: คะแนนสอบต้องมีค่า และ เกม/วิดีโอต้องเป็น true
    return (
      data.pretest !== null && 
      data.posttest !== null && 
      data.game === true && 
      data.video === true
    );
  };

  return (
    <MainLayout>
      {/* ---------------- HERO SECTION ---------------- */}
      <section className="hero" style={{ backgroundImage: `url(${pattern})` }}>
        <img src={girl} className="hero-girl" alt="girl" />
        <div className="hero-center">
            <p className="hero-sub">สื่อการเรียนรู้ออนไลน์</p>
            <h1 className="hero-title">SortLearn Online</h1>
            <br/>
            <Link to="/pretest" className="hero-btn">
              แบบทดสอบก่อนเรียน
            </Link>
        </div>
        <img src={boy} className="hero-boy" alt="boy" />
      </section>
      <div className="hero-wave"></div>

      {/* ---------------- CONTENT SECTION ---------------- */}
      <h1 className="lesson-header">หัวข้อการเรียนรู้</h1>

      <div className="lesson-grid">

        {/* 1. SELECTION SORT */}
        <div className="lesson-card">
          <img src={selectionImg} className="lesson-img" alt="Selection Sort" />
          <h3 className="lesson-title">SELECTION SORT</h3>
          
          {/* แสดงสถานะความคืบหน้า */}
          <LessonProgress lessonKey="selection" />

          {/* ซ่อนปุ่มถ้าผ่านแล้ว */}
          {!isLessonDone("selection") && (
            <Link to="/selection-sort" className="lesson-btn">เข้าบทเรียน ▶</Link>
          )}
        </div>

        {/* 2. INSERTION SORT */}
        <div className="lesson-card">
          <img src={insertionImg} className="lesson-img" alt="Insertion Sort" />
          <h3 className="lesson-title">INSERTION SORT</h3>
          <LessonProgress lessonKey="insertion" />
          {!isLessonDone("insertion") && (
            <Link to="/insertion-sort" className="lesson-btn">เข้าบทเรียน ▶</Link>
          )}
        </div>

        {/* 3. BUBBLE SORT */}
        <div className="lesson-card">
          <img src={bubbleImg} className="lesson-img" alt="Bubble Sort" />
          <h3 className="lesson-title">BUBBLE SORT</h3>
          <LessonProgress lessonKey="bubble" />
          {!isLessonDone("bubble") && (
            <Link to="/bubble-sort" className="lesson-btn">เข้าบทเรียน ▶</Link>
          )}
        </div>

        {/* 4. HEAP SORT */}
        <div className="lesson-card">
          <img src={heapImg} className="lesson-img" alt="Heap Sort" />
          <h3 className="lesson-title">HEAP SORT</h3>
          <LessonProgress lessonKey="heap" />
          {!isLessonDone("heap") && (
            <Link to="/heap-sort" className="lesson-btn">เข้าบทเรียน ▶</Link>
          )}
        </div>

        {/* 5. QUICK SORT */}
        <div className="lesson-card">
          <img src={quickImg} className="lesson-img" alt="Quick Sort" />
          <h3 className="lesson-title">QUICK SORT</h3>
          <LessonProgress lessonKey="quick" />
          {!isLessonDone("quick") && (
            <Link to="/quick-sort" className="lesson-btn">เข้าบทเรียน ▶</Link>
          )}
        </div>

        {/* 6. MERGE SORT */}
        <div className="lesson-card">
          <img src={mergeImg} className="lesson-img" alt="Merge Sort" />
          <h3 className="lesson-title">MERGE SORT</h3>
          <LessonProgress lessonKey="merge" />
          {!isLessonDone("merge") && (
            <Link to="/merge-sort" className="lesson-btn">เข้าบทเรียน ▶</Link>
          )}
        </div>

      </div>
    </MainLayout>
  );
}