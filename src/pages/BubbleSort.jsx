import React from "react";
import MainLayout from "../layouts/MainLayout";
import "../styles/lesson-detail.css";
import bg2 from "../assets/bg-pattern.png";

export default function BubbleSort() {
  // กำหนด n เป็นค่าคงที่เพื่อใช้แสดงผลในสูตร
  const n = "n";
  const code = [
    {
      line: 1,
      text: (
        <>
          <span className="keyword">Algorithm</span> Bubble_Sort(A)
          <span className="comment"> // A คือชุดข้อมูลที่ต้องการจัดเรียง</span>
        </>
      ),
      level: 0,
    },
    { line: 2, text: <><span className="keyword">Begin</span></>, level: 0 },

    {
      line: 3,
      text: (
        <>
          <span className="keyword">For</span> i ← 0 to {n}-2 <span className="keyword">do</span>
          <span className="comment"> // วนรอบเพื่อควบคุมจำนวนรอบของการจัดเรียง</span>
        </>
      ),
      level: 1,
    },

    {
      line: 4,
      text: (
        <>
          <span className="keyword">For</span> j ← 0 to {n}-2-i <span className="keyword">do</span>
          <span className="comment"> // วนรอบเปรียบเทียบข้อมูลที่อยู่ติดกัน</span>
        </>
      ),
      level: 2,
    },

    {
      line: 5,
      text: (
        <>
          <span className="keyword">If</span> A[j] &gt; A[j+1] <span className="keyword">Then</span>
          <span className="comment"> // เปรียบเทียบค่าที่อยู่ติดกัน</span>
        </>
      ),
      level: 3,
    },

    {
      line: 6,
      text: (
        <>
          <span className="keyword">swap</span> A[j] and A[j+1]
          <span className="comment"> // สลับค่าถ้าด้านหน้ามากกว่าด้านหลัง</span>
        </>
      ),
      level: 4,
    },

    { line: 7, text: <><span className="keyword">End if</span></>, level: 3 },
    { line: 8, text: <><span className="keyword">End for</span></>, level: 2 },
    { line: 9, text: <><span className="keyword">End for</span></>, level: 1 },

    { line: 10, text: <><span className="keyword">End</span></>, level: 0 },
  ];

  return (
    <MainLayout>
      {/* ---------------- HERO SECTION ---------------- */}
      <div className="lesson-detail-hero" style={{ backgroundImage: `url(${bg2})` }}>
        <div className="hero-center">
          <p className="hero-sub">หน่วยการเรียนรู้ที่ 3</p>
          <h1 className="hero-title">Bubble Sort</h1>
          <p className="hero-desc">การจัดเรียงข้อมูลแบบฟอง</p>
        </div>
      </div>

      <div className="lesson-detail-container">

        {/* 1. ความหมาย - อ้างอิงหน้าที่ 1/5 */}
        <section className="fade-in-up">
          <h3 className="section-header">🔍 ความหมายของการจัดเรียงข้อมูลแบบฟอง</h3>
          <div className="concept-card">
            <p>
              <strong>การจัดเรียงข้อมูลแบบฟอง (Bubble Sort)</strong> หมายถึง การจัดเรียงข้อมูลโดยการ
              <span className="highlight-text">“เปรียบเทียบค่า” ข้อมูลที่อยู่ติดกันในแต่ละรอบ</span>
              ถ้าข้อมูลที่เปรียบเทียบไม่อยู่ในตำแหน่งที่ถูกต้องจะทำการสลับตำแหน่ง (Swap)
              ทำการเปรียบเทียบทีละคู่ติดกันไปเรื่อยๆ จนถึงคู่สุดท้าย
            </p>
          </div>
        </section>

        {/* 2. ขั้นตอนการทำงาน (2x2 Grid) - ปรับเนื้อหาให้เข้ากับ Bubble Sort */}
        <section className="fade-in-up">
          <h3 className="section-header">🚀 ขั้นตอนวิธีการจัดเรียงข้อมูล</h3>
          <div className="steps-grid">
            <div className="step-item">
              <span className="step-number">01</span>
              <div className="step-content">
                <h4>เปรียบเทียบข้อมูล</h4>
                <p>เริ่มต้นเปรียบเทียบข้อมูลคู่แรกที่อยู่ติดกัน (ตำแหน่งที่ j และ j+1)</p>
              </div>
            </div>
            <div className="step-item">
              <span className="step-number">02</span>
              <div className="step-content">
                <h4>ตรวจสอบเงื่อนไข</h4>
                <p>หากค่าด้านหน้ามากกว่าค่าด้านหลัง ให้ทำการสลับตำแหน่งกัน</p>
              </div>
            </div>
            <div className="step-item">
              <span className="step-number">03</span>
              <div className="step-content">
                <h4>เลื่อนตำแหน่ง</h4>
                <p>ขยับไปเปรียบเทียบข้อมูลคู่ถัดไป ทำซ้ำไปเรื่อยๆ จนสิ้นสุดชุดข้อมูลในรอบนั้น</p>
              </div>
            </div>
            <div className="step-item">
              <span className="step-number">04</span>
              <div className="step-content">
                <h4>ฟองสบู่ลอยตัว</h4>
                <p>ข้อมูลที่มากที่สุดจะไปอยู่ในตำแหน่งท้ายสุด (เหมือนฟองสบู่ที่ลอยขึ้นเหนือน้ำ)</p>
              </div>
            </div>
          </div>
        </section>

        {/* 3. Pseudo Code Box - อ้างอิงจากหน้าที่ 1/5 */}
        <section className="fade-in-up">
          <h3 className="section-header">💻 รหัสเทียม (Pseudo Code)</h3>

          <div className="pseudo-code-box">
            {code.map((line) => (
              <div key={line.line} className="code-line">
                <span className="line-num">{line.line}</span>

                <span
                  className="code-text"
                  style={{ "--level": line.level }}
                >
                  {line.text}
                </span>
              </div>
            ))}
          </div>
        </section>

        {/* 4. ประสิทธิภาพเชิงเวลา  */}
        <section className="fade-in-up">
          <h3 className="section-header">📊 การวิเคราะห์ประสิทธิภาพเชิงเวลา</h3>

          <div className="formula-card">
            <p>สูตรคำนวณจำนวนครั้งในการเปรียบเทียบในกรณีที่แย่ที่สุด (Worst Case):</p>
            <h2 className="math-big"> C(n) = n(n - 1) / 2 </h2>
            <p>ประสิทธิภาพเชิงเวลาสูงสุด: <strong className="highlight-o">O(n²)</strong></p>
          </div>

          <div className="table-container" style={{ marginTop: '30px' }}>
            <table className="analysis-table big-o">
              <thead>
                <tr><th>กรณี (Case)</th><th>Time Complexity</th><th>คำอธิบาย</th></tr>
              </thead>
              <tbody>
                <tr>
                  <td>กรณีที่ดีที่สุด (Best Case)</td>
                  <td>O(n)</td>
                  <td>ข้อมูลเรียงลำดับอยู่แล้วในแต่ละรอบของลูป จะไม่มีการสลับค่าเกิดขึ้นเลย</td>
                </tr>
                <tr>
                  <td>กรณีโดยเฉลี่ย (Average Case)</td>
                  <td>O(n²)</td>
                  <td>ข้อมูลมีลักษณะสุ่ม (Random Order) โดยเฉลี่ยจะมีการสลับค่าประมาณครึ่งหนึ่ง</td>
                </tr>
                <tr>
                  <td>กรณีที่เลวร้ายที่สุด (Worst Case)</td>
                  <td>O(n²)</td>
                  <td>ข้อมูลเรียงลำดับในทิศทางตรงกันข้าม (เช่น มากไปน้อย) ต้องเปรียบเทียบและสลับค่ามากที่สุด</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* 5. ข้อดี และ ข้อเสีย - อ้างอิงหน้าที่ 5/5 */}
        <section className="fade-in-up">
          <h3 className="section-header">⚖️ วิเคราะห์ข้อดี และ ข้อเสีย</h3>
          <div className="pc-clean-grid">
            <div className="pc-card pros">
              <div className="pc-header">
                <h3>✅ ข้อดี</h3>
              </div>
              <ul className="pc-clean-list">
                <li><strong>ความเรียบง่าย:</strong> เป็นอัลกอริทึมที่เข้าใจง่าย ไม่ซับซ้อน</li>
                <li><strong>ประสิทธิภาพดีที่สุด:</strong> ในกรณีที่ข้อมูลเรียงอยู่แล้วจะเป็น O(n)</li>
                <li><strong>In-place Sorting:</strong> ใช้หน่วยความจำเพิ่มเติมในระหว่างการจัดเรียงน้อยมาก</li>
                <li><strong>Stable Sort:</strong> เป็นอัลกอริทึมแบบเสถียร (รักษาลำดับสัมพัทธ์ของข้อมูลที่เท่ากัน)</li>
              </ul>
            </div>

            <div className="pc-card cons">
              <div className="pc-header">
                <h3>❌ ข้อเสีย</h3>
              </div>
              <ul className="pc-clean-list">
                <li><strong>ไม่เหมาะกับข้อมูลมาก:</strong> มีประสิทธิภาพต่ำเมื่อชุดข้อมูลมีขนาดใหญ่</li>
                <li><strong>ความเร็ว:</strong> ใช้เวลาในการประมวลผลค่อนข้างนานเมื่อเทียบกับอัลกอริทึมขั้นสูง</li>
                <li><strong>ประสิทธิภาพถดถอย:</strong> เมื่อข้อมูลเพิ่มขึ้น ประสิทธิภาพจะลดลงอย่างชัดเจน (O(n²))</li>
              </ul>
            </div>
          </div>
        </section>

        {/* 6. Video CTA */}
        <div className="lesson-detail-video fade-in-up">
          <h3>🎬 พร้อมดูการทำงานของ Bubble Sort หรือยัง?</h3>
          <p style={{ marginBottom: '30px', opacity: 0.9 }}>
            รับชมแอนิเมชันการเปรียบเทียบและการสลับที่ของ "ฟองสบู่" เพื่อความเข้าใจที่ชัดเจนยิ่งขึ้น
          </p>
          <a href="/sortlearn/video/bubble-sort" className="video-btn-styled">
            เข้าสู่บทเรียนวิดีโอ ▶
          </a>
        </div>

      </div>
    </MainLayout>
  );
}