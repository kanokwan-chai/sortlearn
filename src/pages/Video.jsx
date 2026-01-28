import React from "react";
import { Link } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import "../styles/video-list.css";
import bgPattern from "../assets/bg2.png";

// Import รูปปก (ตามที่คุณส่งมา)
import selectionImg from "../assets/lessons/selection.png";
import insertionImg from "../assets/lessons/insertion.png";
import bubbleImg from "../assets/lessons/bubble.png";
import heapImg from "../assets/lessons/heap.png";
import quickImg from "../assets/lessons/quick.png";
import mergeImg from "../assets/lessons/merge.png";

export default function VideoList() {
  
  const videos = [
    { id: 1, title: "Selection Sort", img: selectionImg, link: "/video/selection-sort" },
    { id: 2, title: "Insertion Sort", img: insertionImg, link: "/video/insertion-sort" },
    { id: 3, title: "Bubble Sort",    img: bubbleImg,    link: "/video/bubble-sort" },
    { id: 4, title: "Heap Sort",      img: heapImg,      link: "/video/heap-sort" },
    { id: 5, title: "Quick Sort",     img: quickImg,     link: "/video/quick-sort" },
    { id: 6, title: "Merge Sort",     img: mergeImg,     link: "/video/merge-sort" },
  ];

  return (
    <MainLayout>
      {/* ---------------- HERO SECTION ---------------- */}
      {/* ใช้รูป bg-pattern แต่มี Flag สีขาวทับด้านขวาตามแบบ */}
      <div className="video-list-hero" style={{ backgroundImage: `url(${bgPattern})` }}>
        <div className="hero-content">
          <h2 className="hero-sub-title">วิดีโอการเรียนรู้</h2>
          <h1 className="hero-main-title">Videos</h1>
        </div>
        
        {/* สามเหลี่ยมสีขาวด้านขวา (Flag Decoration) */}
        <div className="hero-flag-right"></div>
      </div>

      {/* ---------------- GRID SECTION ---------------- */}
      <div className="video-list-container">
        <div className="video-grid">
          {videos.map((item) => (
            <Link to={item.link} key={item.id} className="game-style-card">
              
              {/* กรอบรูปสีขาวด้านบน */}
              <div className="card-image-frame">
                <img src={item.img} alt={item.title} />
              </div>

              {/* ปุ่ม Play วงกลมด้านล่าง */}
              <div className="card-play-area">
                <div className="play-circle">
                  <svg viewBox="0 0 24 24" fill="currentColor" className="play-icon">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </div>
              </div>

            </Link>
          ))}
        </div>
      </div>
    </MainLayout>
  );
}