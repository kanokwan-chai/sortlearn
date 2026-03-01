import React from "react";
import MainLayout from "../layouts/MainLayout";
import "../styles/lesson-detail.css"; 
import bg2 from "../assets/bg-pattern.png"; 

export default function MergeSort() {

  return (
    <MainLayout>

      {/* ---------------- HERO ---------------- */}
      <div className="lesson-detail-hero" style={{ backgroundImage: `url(${bg2})` }}>
        <div className="hero-center">
          <p className="hero-sub">หน่วยการเรียนรู้ที่ 6</p>
          <h1 className="hero-title">Merge Sort</h1>
          <p className="hero-desc">การจัดเรียงข้อมูลแบบผสาน</p>
        </div>
      </div>

      <div className="lesson-detail-container">

        {/* ================= ความหมาย ================= */}
        <section className="fade-in-up">
          <h3 className="section-header">🔍 ความหมายของ Merge Sort</h3>
          <div className="concept-card">
            <p>
              <strong>Merge Sort</strong> คืออัลกอริทึมการจัดเรียงที่ใช้แนวคิด 
              <span className="highlight-text">Divide and Conquer</span>
              โดยแบ่งข้อมูลออกเป็นส่วนย่อย ๆ จนเหลือเพียงตัวเดียว 
              แล้วจึงผสาน (Merge) กลับเข้าด้วยกันพร้อมจัดลำดับให้ถูกต้อง
            </p>
          </div>
        </section>

        {/* ================= หลักการทำงาน ================= */}
        <section className="fade-in-up">
          <h3 className="section-header">⚙️ หลักการ Divide & Conquer</h3>
          <div className="concept-card">
            <p>
              1️⃣ แบ่งข้อมูลออกเป็น 2 ส่วน  
              <br/>
              2️⃣ เรียกตัวเองซ้ำ (Recursion) เพื่อแบ่งต่อ  
              <br/>
              3️⃣ ผสานข้อมูลกลับเข้าด้วยกันโดยเปรียบเทียบค่า
            </p>
          </div>
        </section>

        {/* ================= PSEUDO CODE MERGESORT ================= */}
        <section className="fade-in-up">
          <h3 className="section-header">💻 Pseudo Code : MergeSort</h3>

          <div className="pseudo-code-box">
            <div className="code-line">Algorithm MergeSort(A, left, right)</div>
            <div className="code-line">Begin</div>
            <div className="code-line">&nbsp;&nbsp;If left &lt; right Then</div>
            <div className="code-line">&nbsp;&nbsp;&nbsp;&nbsp;mid ← (left + right) / 2</div>
            <div className="code-line">&nbsp;&nbsp;&nbsp;&nbsp;MergeSort(A, left, mid)</div>
            <div className="code-line">&nbsp;&nbsp;&nbsp;&nbsp;MergeSort(A, mid + 1, right)</div>
            <div className="code-line">&nbsp;&nbsp;&nbsp;&nbsp;Merge(A, left, mid, right)</div>
            <div className="code-line">&nbsp;&nbsp;End if</div>
            <div className="code-line">End Algorithm</div>
          </div>

          <div className="concept-card" style={{marginTop:"20px"}}>
            <strong>หน้าที่:</strong> แบ่งข้อมูลออกเป็นสองส่วนจนเหลือสมาชิกตัวเดียว 
            แล้วเรียกฟังก์ชัน Merge เพื่อผสานกลับ
          </div>
        </section>


        {/* ================= PSEUDO CODE MERGE ================= */}
        <section className="fade-in-up">
          <h3 className="section-header">💻 Pseudo Code : Merge</h3>

          <div className="pseudo-code-box">
            <div className="code-line">Algorithm Merge(A, left, mid, right)</div>
            <div className="code-line">Begin</div>
            <div className="code-line">&nbsp;&nbsp;i ← left</div>
            <div className="code-line">&nbsp;&nbsp;j ← mid + 1</div>
            <div className="code-line">&nbsp;&nbsp;While i ≤ mid AND j ≤ right Do</div>
            <div className="code-line">&nbsp;&nbsp;&nbsp;&nbsp;If A[i] ≤ A[j] Then</div>
            <div className="code-line">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Put A[i] into sorted position</div>
            <div className="code-line">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;i ← i + 1</div>
            <div className="code-line">&nbsp;&nbsp;&nbsp;&nbsp;Else</div>
            <div className="code-line">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Put A[j] into sorted position</div>
            <div className="code-line">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;j ← j + 1</div>
            <div className="code-line">&nbsp;&nbsp;&nbsp;&nbsp;End If</div>
            <div className="code-line">&nbsp;&nbsp;End While</div>
            <div className="code-line">&nbsp;&nbsp;Put remaining elements into sorted position</div>
            <div className="code-line">End Algorithm</div>
          </div>

          <div className="concept-card" style={{marginTop:"20px"}}>
            <strong>หน้าที่:</strong> เปรียบเทียบข้อมูลฝั่งซ้ายและขวา 
            แล้วผสานให้เรียงลำดับถูกต้อง
          </div>
        </section>


        {/* ================= ตัวอย่าง ================= */}
        <section className="fade-in-up">
          <h3 className="section-header">🧮 ตัวอย่างการจัดเรียง</h3>
          <div className="concept-card">
            <p><strong>Input:</strong> [5, 7, 11, 1, 9, 3]</p>
            <p>
              แบ่ง → [5,7,11] และ [1,9,3]  
              <br/>
              แบ่งต่อจนเหลือตัวเดียว  
              <br/>
              ผสานกลับทีละระดับ  
              <br/>
              <strong>Output:</strong> [1, 3, 5, 7, 9, 11]
            </p>
          </div>
        </section>


        {/* ================= TIME COMPLEXITY ================= */}
        <section className="fade-in-up">
          <h3 className="section-header">📊 ประสิทธิภาพเชิงเวลา</h3>
          <div className="formula-card">
            <h2 className="math-big">O(n log n)</h2>
            <p>Best Case = Average Case = Worst Case</p>
          </div>
        </section>


        {/* ================= ข้อดี ข้อเสีย ================= */}
        <section className="fade-in-up">
          <h3 className="section-header">⚖️ ข้อดี และ ข้อเสีย</h3>

          <div className="pc-clean-grid">

            <div className="pc-card pros">
              <div className="pc-header">
                <h3>✅ ข้อดี</h3>
              </div>
              <ul className="pc-clean-list">
                <li>มี Time Complexity สม่ำเสมอ O(n log n)</li>
                <li>เหมาะกับข้อมูลจำนวนมาก</li>
                <li>เป็น Stable Sort</li>
              </ul>
            </div>

            <div className="pc-card cons">
              <div className="pc-header">
                <h3>❌ ข้อเสีย</h3>
              </div>
              <ul className="pc-clean-list">
                <li>ใช้หน่วยความจำเพิ่มในการผสานข้อมูล</li>
                <li>ไม่เป็น In-place Sorting</li>
                <li>โครงสร้างซับซ้อนกว่าวิธีพื้นฐาน</li>
              </ul>
            </div>

          </div>
        </section>


        {/* ================= VIDEO ================= */}
        <div className="lesson-detail-video fade-in-up">
          <h3>🎬 พร้อมดูการทำงานของ Merge Sort หรือยัง?</h3>
          <a href="/video/merge-sort" className="video-btn-styled">
            เข้าสู่บทเรียนวิดีโอ ▶
          </a>
        </div>

      </div>
    </MainLayout>
  );
}