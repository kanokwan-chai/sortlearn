import React from "react";
import MainLayout from "../layouts/MainLayout";
import "../styles/lesson-detail.css"; 
import bg2 from "../assets/bg-pattern.png"; 

export default function HeapSort() {

  const n = "n";

  return (
    <MainLayout>

      {/* ---------------- HERO SECTION ---------------- */}
      <div className="lesson-detail-hero" style={{ backgroundImage: `url(${bg2})` }}>
        <div className="hero-center">
            <p className="hero-sub">หน่วยการเรียนรู้ที่ 4</p>
            <h1 className="hero-title">Heap Sort</h1>
            <p className="hero-desc">การจัดเรียงข้อมูลแบบฮีป</p>
        </div>
      </div>

      <div className="lesson-detail-container">

        {/* 1. ความหมาย */}
        <section className="fade-in-up">
          <h3 className="section-header">🔍 ความหมายของ Heap Sort</h3>
          <div className="concept-card">
            <p>
              <strong>Heap Sort</strong> คือ อัลกอริทึมการจัดเรียงข้อมูลที่ใช้โครงสร้าง
              <span className="highlight-text"> ต้นไม้ฮีป (Heap)</span> 
              เพื่อดึงค่าที่มากที่สุดหรือน้อยที่สุดออกมาทีละตัว 
              แล้วนำไปวางในตำแหน่งที่ถูกต้อง จนข้อมูลเรียงครบ
            </p>
          </div>
        </section>

        {/* 2. โครงสร้างฮีป */}
        <section className="fade-in-up">
          <h3 className="section-header">🌳 โครงสร้างต้นไม้ฮีป</h3>
          <div className="concept-card">
            <p>
              ฮีปเป็น <strong>Complete Binary Tree</strong> 
              ที่ทุกระดับเต็ม ยกเว้นระดับล่างสุดที่เรียงจากซ้ายไปขวา
            </p>
            <p style={{marginTop: "15px"}}>
              ต้องเป็นไปตาม <strong>Heap Property</strong> 
              คือ ความสัมพันธ์ระหว่าง Parent และ Child
            </p>
          </div>
        </section>

        {/* 3. ชนิดของฮีป */}
        <section className="fade-in-up">
          <h3 className="section-header">🧩 ชนิดของฮีป</h3>
          <div className="pc-clean-grid">

            <div className="pc-card pros">
              <div className="pc-header">
                <h3>🔺 Max Heap</h3>
              </div>
              <ul className="pc-clean-list">
                <li>Parent ≥ Child</li>
                <li>ค่ามากสุดอยู่ที่ Root</li>
                <li>ใช้เรียงจากน้อยไปมาก</li>
              </ul>
            </div>

            <div className="pc-card cons">
              <div className="pc-header">
                <h3>🔻 Min Heap</h3>
              </div>
              <ul className="pc-clean-list">
                <li>Parent ≤ Child</li>
                <li>ค่าน้อยสุดอยู่ที่ Root</li>
                <li>ใช้เรียงจากมากไปน้อย</li>
              </ul>
            </div>

          </div>
        </section>

        {/* 4. ขั้นตอน */}
        <section className="fade-in-up">
          <h3 className="section-header">🚀 ขั้นตอน Heap Sort (Max Heap)</h3>
          <div className="steps-grid">
            <div className="step-item">
              <span className="step-number">01</span>
              <div className="step-content">
                <h4>Build Heap</h4>
                <p>สร้าง Max Heap จากข้อมูลทั้งหมด</p>
              </div>
            </div>
            <div className="step-item">
              <span className="step-number">02</span>
              <div className="step-content">
                <h4>Swap Root</h4>
                <p>สลับค่ารากกับตำแหน่งสุดท้าย</p>
              </div>
            </div>
            <div className="step-item">
              <span className="step-number">03</span>
              <div className="step-content">
                <h4>Reduce Heap</h4>
                <p>ลดขนาดฮีปลง 1</p>
              </div>
            </div>
            <div className="step-item">
              <span className="step-number">04</span>
              <div className="step-content">
                <h4>Heapify</h4>
                <p>ปรับโครงสร้างใหม่ แล้วทำซ้ำ</p>
              </div>
            </div>
          </div>
        </section>

        {/* 5. ตัวอย่างการจัดเรียง */}
        <section className="fade-in-up">
          <h3 className="section-header">🧮 ตัวอย่างการจัดเรียง</h3>
          <div className="concept-card">
            <p><strong>ข้อมูลเริ่มต้น:</strong> 20, 15, 9, 10, 12, 4, 2</p>
            <p style={{marginTop: "10px"}}>
              1️⃣ สร้าง Max Heap → 20 อยู่ที่ Root  
              <br/>
              2️⃣ สลับ 20 กับ 2 → [2, 15, 9, 10, 12, 4, 20]  
              <br/>
              3️⃣ Heapify ใหม่ → 15 ขึ้นเป็น Root  
              <br/>
              4️⃣ ทำซ้ำจนเหลือ 1 ค่า  
              <br/><br/>
              ✅ ผลลัพธ์สุดท้าย: <strong>2, 4, 9, 10, 12, 15, 20</strong>
            </p>
          </div>
        </section>

        {/* 6. Pseudo Code */}
        {/* ================= PSEUDO CODE HEAPIFY ================= */}
        <section className="fade-in-up">
        <h3 className="section-header">💻 Pseudo Code : Heapify</h3>

        <div className="concept-card">
            <p>
            <strong>หน้าที่:</strong> ฟังก์ชัน Heapify ใช้สำหรับปรับโครงสร้างต้นไม้ฮีป
            ให้เป็นไปตามกฎ <strong>Heap Property</strong> 
            โดยจะตรวจสอบโหนดพ่อกับโหนดลูก และสลับค่าถ้าจำเป็น
            </p>
        </div>

        <div className="pseudo-code-box">
            <div className="code-line">Algorithm Heapify(A, n, i)</div>
            <div className="code-line">Begin</div>
            <div className="code-line">&nbsp;&nbsp;largest ← i</div>
            <div className="code-line">&nbsp;&nbsp;left ← 2*i + 1</div>
            <div className="code-line">&nbsp;&nbsp;right ← 2*i + 2</div>

            <div className="code-line">&nbsp;&nbsp;If left &lt; n and A[left] &gt; A[largest] Then</div>
            <div className="code-line">&nbsp;&nbsp;&nbsp;&nbsp;largest ← left</div>
            <div className="code-line">&nbsp;&nbsp;End if</div>

            <div className="code-line">&nbsp;&nbsp;If right &lt; n and A[right] &gt; A[largest] Then</div>
            <div className="code-line">&nbsp;&nbsp;&nbsp;&nbsp;largest ← right</div>
            <div className="code-line">&nbsp;&nbsp;End if</div>

            <div className="code-line">&nbsp;&nbsp;If largest ≠ i Then</div>
            <div className="code-line">&nbsp;&nbsp;&nbsp;&nbsp;swap A[i] and A[largest]</div>
            <div className="code-line">&nbsp;&nbsp;&nbsp;&nbsp;Heapify(A, n, largest)</div>
            <div className="code-line">&nbsp;&nbsp;End if</div>

            <div className="code-line">End Algorithm</div>
        </div>
        </section>


        {/* ================= PSEUDO CODE HEAP SORT ================= */}
        <section className="fade-in-up">
        <h3 className="section-header">💻 Pseudo Code : Heap Sort</h3>

        <div className="concept-card">
            <p>
            <strong>หน้าที่:</strong> อัลกอริทึมหลักสำหรับการจัดเรียงข้อมูล
            โดยเริ่มจากการสร้าง <strong>Max Heap</strong>
            แล้วดึงค่ามากที่สุด (Root) ไปไว้ท้ายอาร์เรย์
            จากนั้นปรับโครงสร้างฮีปใหม่ ทำซ้ำจนเรียงครบ
            </p>
        </div>

        <div className="pseudo-code-box">
            <div className="code-line">Algorithm Heap_Sort(A)</div>
            <div className="code-line">Begin</div>

            <div className="code-line">&nbsp;&nbsp;n ← length(A)</div>

            <div className="code-line">&nbsp;&nbsp;For i ← (n div 2) - 1 to 0 do</div>
            <div className="code-line">&nbsp;&nbsp;&nbsp;&nbsp;Heapify(A, n, i)</div>
            <div className="code-line">&nbsp;&nbsp;End for</div>

            <div className="code-line">&nbsp;&nbsp;For i ← n - 1 to 1 do</div>
            <div className="code-line">&nbsp;&nbsp;&nbsp;&nbsp;swap A[0] and A[i]</div>
            <div className="code-line">&nbsp;&nbsp;&nbsp;&nbsp;Heapify(A, i, 0)</div>
            <div className="code-line">&nbsp;&nbsp;End for</div>

            <div className="code-line">End Algorithm</div>
        </div>
        </section>

        {/* 7. Time Complexity */}
        <section className="fade-in-up">
          <h3 className="section-header">📊 ประสิทธิภาพเชิงเวลา</h3>
          <div className="formula-card">
            <h2 className="math-big">O(n log n)</h2>
            <p>Best / Average / Worst Case เท่ากัน</p>
          </div>
        </section>

        {/* 8. ข้อดี ข้อเสีย */}
        <section className="fade-in-up">
          <h3 className="section-header">⚖️ ข้อดี และ ข้อเสีย</h3>
          <div className="pc-clean-grid">
            <div className="pc-card pros">
              <div className="pc-header">
                <h3>✅ ข้อดี</h3>
              </div>
              <ul className="pc-clean-list">
                <li>มี Time Complexity แน่นอน O(n log n)</li>
                <li>เป็น In-place Sorting</li>
                <li>เหมาะกับข้อมูลจำนวนมาก</li>
              </ul>
            </div>

            <div className="pc-card cons">
              <div className="pc-header">
                <h3>❌ ข้อเสีย</h3>
              </div>
              <ul className="pc-clean-list">
                <li>ขั้นตอนซับซ้อน</li>
                <li>ไม่เป็น Stable Sort</li>
                <li>ไม่เหมาะกับข้อมูลขนาดเล็กมาก</li>
              </ul>
            </div>
          </div>
        </section>

        {/* 9. Video CTA */}
        <div className="lesson-detail-video fade-in-up">
          <h3>🎬 พร้อมดูการทำงานของ Heap Sort หรือยัง?</h3>
          <p style={{marginBottom: '30px', opacity: 0.9}}>
            รับชมแอนิเมชันการสร้างฮีปและการ Heapify แบบละเอียดทีละขั้นตอน
          </p>
          <a href="/video/heap-sort" className="video-btn-styled">
            เข้าสู่บทเรียนวิดีโอ ▶
          </a>
        </div>

      </div>
    </MainLayout>
  );
}