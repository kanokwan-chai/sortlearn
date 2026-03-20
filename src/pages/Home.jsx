import React, { useState, useEffect } from "react"; 
import { Link, useNavigate } from "react-router-dom"; 
import MainLayout from "../layouts/MainLayout";
import LessonProgress from "../components/LessonProgress"; 

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
  // 1️⃣ ประกาศตัวแปรที่ Error ไปก่อนหน้านี้
  const navigate = useNavigate(); 
  const [isFinishedAll, setIsFinishedAll] = useState(false);

  // ฟังก์ชันเช็ค User Key
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

  // ฟังก์ชันเช็คว่าแต่ละบทเรียนผ่านหรือยัง
  const isLessonDone = (lessonKey) => {
    const userKey = getUserKey();
    const key = `progress_${userKey}_${lessonKey}`;
    const data = JSON.parse(localStorage.getItem(key)) || {};

    return (
      data.pretest != null &&
      data.posttest != null &&
      data.video === true &&
      data.game === true
    );
  };
  

  // 2️⃣ ตรวจสอบความคืบหน้าทั้งหมด (เรียนครบ 6 อันหรือยัง)
  useEffect(() => {
    const algos = ['selection', 'insertion', 'bubble', 'heap', 'quick', 'merge'];
    const complete = algos.every(algo => isLessonDone(algo));
    setIsFinishedAll(complete);
  }, []);

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
        {/* การ์ดบทเรียนต่างๆ (ใส่ LessonProgress และเช็คปุ่มเหมือนเดิม) */}
        <div className="lesson-card">
          <img src={selectionImg} className="lesson-img" alt="Selection Sort" />
          <h3 className="lesson-title">SELECTION SORT</h3>
          <LessonProgress lessonKey="selection" />
          {!isLessonDone("selection") && (
            <Link to="/selection-sort" className="lesson-btn">เข้าบทเรียน ▶</Link>
          )}
        </div>

        <div className="lesson-card">
          <img src={insertionImg} className="lesson-img" alt="Insertion Sort" />
          <h3 className="lesson-title">INSERTION SORT</h3>
          <LessonProgress lessonKey="insertion" />
          {!isLessonDone("insertion") && (
            <Link to="/insertion-sort" className="lesson-btn">เข้าบทเรียน ▶</Link>
          )}
        </div>

        <div className="lesson-card">
          <img src={bubbleImg} className="lesson-img" alt="Bubble Sort" />
          <h3 className="lesson-title">BUBBLE SORT</h3>
          <LessonProgress lessonKey="bubble" />
          {!isLessonDone("bubble") && (
            <Link to="/bubble-sort" className="lesson-btn">เข้าบทเรียน ▶</Link>
          )}
        </div>

        <div className="lesson-card">
          <img src={heapImg} className="lesson-img" alt="Heap Sort" />
          <h3 className="lesson-title">HEAP SORT</h3>
          <LessonProgress lessonKey="heap" />
          {!isLessonDone("heap") && (
            <Link to="/heap-sort" className="lesson-btn">เข้าบทเรียน ▶</Link>
          )}
        </div>

        <div className="lesson-card">
          <img src={quickImg} className="lesson-img" alt="Quick Sort" />
          <h3 className="lesson-title">QUICK SORT</h3>
          <LessonProgress lessonKey="quick" />
          {!isLessonDone("quick") && (
            <Link to="/quick-sort" className="lesson-btn">เข้าบทเรียน ▶</Link>
          )}
        </div>

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