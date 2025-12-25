import React from "react";
import { Link } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import "../styles/game-list.css";
import bgPattern from "../assets/bg2.png";

import selectionImg from "../assets/lessons/selection.png";
import insertionImg from "../assets/lessons/insertion.png";
import bubbleImg from "../assets/lessons/bubble.png";
import heapImg from "../assets/lessons/heap.png";
import quickImg from "../assets/lessons/quick.png";
import mergeImg from "../assets/lessons/merge.png";

export default function GameList() {
  
  const games = [
    { id: 1, title: "Selection Sort", img: selectionImg, link: "/games/selection-sort" },
    { id: 2, title: "Insertion Sort", img: insertionImg, link: "/games/insertion-sort" },
    { id: 3, title: "Bubble Sort",    img: bubbleImg,    link: "/games/bubble-sort" },
    { id: 4, title: "Heap Sort",      img: heapImg,      link: "/games/heap-sort" },
    { id: 5, title: "Quick Sort",     img: quickImg,     link: "/games/quick-sort" },
    { id: 6, title: "Merge Sort",     img: mergeImg,     link: "/games/merge-sort" },
  ];

  return (
    <MainLayout>
      <div
        className="pretest-hero"
        style={{ backgroundImage: `url(${bgPattern})` }}
      >
        <h2 className="pretest-subtitle">เกมการเรียนรู้</h2>
        <h1 className="pretest-title">Games</h1>

      </div>

      {/* GRID SECTION */}
      <div className="game-list-container">
        <div className="game-grid">
          {games.map((item) => (
            <Link to={item.link} key={item.id} className="game-arcade-card">
              
              {/* ส่วนบน: หน้าจอรูปภาพ */}
              <div className="arcade-screen">
                <div className="screen-glare"></div> {/* แสงสะท้อนหน้าจอ */}
                <img src={item.img} alt={item.title} />
              </div>

              {/* ส่วนล่าง: ชื่อเกมและปุ่ม Start */}
              <div className="arcade-controls">
                <h3 className="arcade-title">{item.title}</h3>
                
                <div className="start-btn-wrapper">
                  <button className="arcade-start-btn">
                    START GAME ▶
                  </button>
                </div>
              </div>

            </Link>
          ))}
        </div>
      </div>
    </MainLayout>
  );
}