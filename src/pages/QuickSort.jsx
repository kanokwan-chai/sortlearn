import React from "react";
import MainLayout from "../layouts/MainLayout";
import "../styles/lesson-detail.css"; 
import bg2 from "../assets/bg-pattern.png"; 

export default function QuickSort() {

  return (
    <MainLayout>

      {/* ---------------- HERO ---------------- */}
      <div className="lesson-detail-hero" style={{ backgroundImage: `url(${bg2})` }}>
        <div className="hero-center">
          <p className="hero-sub">หน่วยการเรียนรู้ที่ 5</p>
          <h1 className="hero-title">Quick Sort</h1>
          <p className="hero-desc">การจัดเรียงข้อมูลแบบรวดเร็ว</p>
        </div>
      </div>

      <div className="lesson-detail-container">

        {/* ================= ความหมาย ================= */}
        <section className="fade-in-up">
          <h3 className="section-header">🔍 ความหมายของ Quick Sort</h3>
          <div className="concept-card">
            <p>
              <strong>Quick Sort</strong> คืออัลกอริทึมการจัดเรียงที่ใช้แนวคิด 
              <span className="highlight-text">Divide and Conquer</span> 
              โดยเลือกค่าหนึ่งเป็น <strong>Pivot</strong> 
              แล้วแบ่งข้อมูลออกเป็นสองกลุ่ม:
            </p>
            <ul>
              <li>ค่าที่น้อยกว่า Pivot</li>
              <li>ค่าที่มากกว่า Pivot</li>
            </ul>
            <p>จากนั้นเรียกอัลกอริทึมซ้ำกับทั้งสองฝั่งจนเรียงครบ</p>
          </div>
        </section>

        {/* ================= ขั้นตอนการทำงาน ================= */}
        <section className="fade-in-up">
          <h3 className="section-header">⚙️ ขั้นตอนการทำงาน</h3>
          <div className="steps-grid">
            <div className="step-item">
              <span className="step-number">01</span>
              <div className="step-content">
                <h4>เลือก Pivot</h4>
                <p>เลือกสมาชิกตัวหนึ่ง (เช่น ตัวสุดท้าย)</p>
              </div>
            </div>
            <div className="step-item">
              <span className="step-number">02</span>
              <div className="step-content">
                <h4>แบ่งกลุ่มข้อมูล</h4>
                <p>จัดค่าที่น้อยกว่าไว้ฝั่งซ้าย มากกว่าไว้ฝั่งขวา</p>
              </div>
            </div>
            <div className="step-item">
              <span className="step-number">03</span>
              <div className="step-content">
                <h4>วาง Pivot</h4>
                <p>นำ Pivot ไปไว้ตำแหน่งที่ถูกต้อง</p>
              </div>
            </div>
            <div className="step-item">
              <span className="step-number">04</span>
              <div className="step-content">
                <h4>เรียกซ้ำ (Recursion)</h4>
                <p>ทำซ้ำกับฝั่งซ้ายและขวา</p>
              </div>
            </div>
          </div>
        </section>

        {/* ================= PSEUDO CODE ================= */}
        <section className="fade-in-up">
          <h3 className="section-header">💻 Pseudo Code</h3>

          <div className="pseudo-code-box">
            <div className="code-line">Algorithm QuickSort(arr, l, r)</div>
            <div className="code-line">Begin</div>
            <div className="code-line">&nbsp;&nbsp;If l &lt; r Then</div>
            <div className="code-line">&nbsp;&nbsp;&nbsp;&nbsp;pivot ← arr[r]</div>
            <div className="code-line">&nbsp;&nbsp;&nbsp;&nbsp;i ← l - 1</div>
            <div className="code-line">&nbsp;&nbsp;&nbsp;&nbsp;For j ← l To r - 1 Do</div>
            <div className="code-line">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;If arr[j] &lt; pivot Then</div>
            <div className="code-line">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;i ← i + 1</div>
            <div className="code-line">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Swap arr[i] and arr[j]</div>
            <div className="code-line">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;End If</div>
            <div className="code-line">&nbsp;&nbsp;&nbsp;&nbsp;End For</div>
            <div className="code-line">&nbsp;&nbsp;&nbsp;&nbsp;Swap arr[i + 1] and arr[r]</div>
            <div className="code-line">&nbsp;&nbsp;&nbsp;&nbsp;p ← i + 1</div>
            <div className="code-line">&nbsp;&nbsp;&nbsp;&nbsp;QuickSort(arr, l, p - 1)</div>
            <div className="code-line">&nbsp;&nbsp;&nbsp;&nbsp;QuickSort(arr, p + 1, r)</div>
            <div className="code-line">&nbsp;&nbsp;End If</div>
            <div className="code-line">End Algorithm</div>
          </div>
        </section>

        {/* ================= ตัวอย่าง ================= */}
        <section className="fade-in-up">
          <h3 className="section-header">🧮 ตัวอย่างการจัดเรียง</h3>
          <div className="concept-card">
            <p><strong>Input:</strong> [7, 2, 13, 9, 1, 10]</p>
            <p>
              เลือก 10 เป็น Pivot  
              <br/>
              แบ่งกลุ่ม → [7, 2, 9, 1] | 10 | [13]  
              <br/>
              ทำซ้ำจนเรียงครบ  
              <br/>
              <strong>Output:</strong> [1, 2, 7, 9, 10, 13]
            </p>
          </div>
        </section>

        {/* ================= TIME COMPLEXITY (แก้ถูกต้อง) ================= */}
        <section className="fade-in-up">
          <h3 className="section-header">📊 ประสิทธิภาพเชิงเวลา</h3>

          <div className="table-container">
            <table className="analysis-table big-o">
              <thead>
                <tr>
                  <th>กรณี</th>
                  <th>Time Complexity</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Best Case</td>
                  <td>O(n log n)</td>
                </tr>
                <tr>
                  <td>Average Case</td>
                  <td>O(n log n)</td>
                </tr>
                <tr>
                  <td>Worst Case</td>
                  <td>O(n²)</td>
                </tr>
              </tbody>
            </table>
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
                <li>ทำงานได้รวดเร็วมากในทางปฏิบัติ</li>
                <li>Average Case เป็น O(n log n)</li>
                <li>เป็น In-place Sorting</li>
                <li>เหมาะกับข้อมูลจำนวนมาก</li>
              </ul>
            </div>

            <div className="pc-card cons">
              <div className="pc-header">
                <h3>❌ ข้อเสีย</h3>
              </div>
              <ul className="pc-clean-list">
                <li>Worst Case เป็น O(n²)</li>
                <li>ขึ้นอยู่กับการเลือก Pivot</li>
                <li>ไม่เป็น Stable Sort</li>
                <li>ใช้หน่วยความจำ Stack จาก Recursion</li>
              </ul>
            </div>

          </div>
        </section>

        {/* ================= VIDEO ================= */}
        <div className="lesson-detail-video fade-in-up">
          <h3>🎬 พร้อมดูการทำงานของ Quick Sort หรือยัง?</h3>
          <a href="/video/quick-sort" className="video-btn-styled">
            เข้าสู่บทเรียนวิดีโอ ▶
          </a>
        </div>

      </div>
    </MainLayout>
  );
}