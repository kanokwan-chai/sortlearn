import React from "react";
import MainLayout from "../layouts/MainLayout";
import "../styles/lesson-detail.css"; 
import bg2 from "../assets/bg-pattern.png"; 

export default function SelectionSortLesson() {
  // กำหนด n เป็นค่าคงที่เพื่อใช้แสดงผลในสูตร
  const n = "n"; 

  const code = [
  { line: 1, text: <><span className="keyword">Algorithm</span> Selection_Sort(A)</>, level: 0 },
  { line: 2, text: <><span className="keyword">Begin</span></>, level: 0 },

  { line: 3, text: <><span className="keyword">For</span> i ← 0 to n-2 <span className="keyword">do</span> <span className="comment">// วนรอบกำหนดตำแหน่งแรก</span></>, level: 1 },
  { line: 4, text: <>min ← i</>, level: 2 },

  { line: 5, text: <><span className="keyword">For</span> j ← i+1 to n-1 <span className="keyword">do</span> <span className="comment">// ค้นหาค่าน้อยที่สุด</span></>, level: 2 },
  { line: 6, text: <><span className="keyword">If</span> A[j] &lt; A[min] <span className="keyword">Then</span></>, level: 3 },
  { line: 7, text: <>min ← j</>, level: 4 },
  { line: 8, text: <><span className="keyword">End if</span></>, level: 3 },
  { line: 9, text: <><span className="keyword">End for</span></>, level: 2 },

  { line: 10, text: <><span className="keyword">swap</span> A[i] and A[min] <span className="comment">// สลับข้อมูลให้ถูกต้อง</span></>, level: 2 },
  { line: 11, text: <><span className="keyword">End for</span></>, level: 1 },

  { line: 12, text: <><span className="keyword">End</span></>, level: 0 },
  ];

  return (
    <MainLayout>
      {/* ---------------- HERO SECTION ---------------- */}
      <div className="lesson-detail-hero" style={{ backgroundImage: `url(${bg2})` }}>
        <div className="hero-center">
            <p className="hero-sub">หน่วยการเรียนรู้ที่ 1</p>
            <h1 className="hero-title">Selection Sort</h1>
            <p className="hero-desc">การจัดเรียงข้อมูลแบบเลือก</p>
        </div>
      </div>

      <div className="lesson-detail-container">
        
        {/* 1. ความหมาย - อ้างอิงหน้าที่ 1/5 */}
        <section className="fade-in-up">
          <h3 className="section-header">🔍 ความหมายของการจัดเรียงข้อมูลแบบเลือก</h3>
          <div className="concept-card">
            <p>
              <strong>การจัดเรียงข้อมูลแบบเลือก (Selection Sort)</strong> หมายถึง การจัดเรียงข้อมูลโดยการ 
              <span className="highlight-text">“เลือกค่า” ที่น้อยที่สุดหรือมากที่สุด</span> 
              จากชุดข้อมูลที่ยังไม่ได้จัดเรียง แล้วนำมาวางในตำแหน่งที่ถูกต้องในแต่ละรอบ
            </p>
          </div>
        </section>

        

        {/* 2. ขั้นตอนการทำงาน (2x2 Grid) - อ้างอิงหน้าที่ 4 และ 8/17 */}
        <section className="fade-in-up">
          <h3 className="section-header">🚀 ขั้นตอนวิธีการจัดเรียงข้อมูล</h3>
          <div className="steps-grid">
            <div className="step-item">
              <span className="step-number">01</span>
              <div className="step-content">
                <h4>กำหนดตำแหน่ง</h4>
                <p>วนรอบกำหนดตำแหน่งแรกของข้อมูลที่ยังไม่จัดเรียง เพื่อเริ่มการค้นหาในแต่ละรอบ</p>
              </div>
            </div>
            <div className="step-item">
              <span className="step-number">02</span>
              <div className="step-content">
                <h4>ค้นหาค่า</h4>
                <p>วนรอบค้นหาข้อมูลที่มีค่าน้อยที่สุดในชุดข้อมูลส่วนที่ยังไม่จัดเรียงที่เหลืออยู่</p>
              </div>
            </div>
            <div className="step-item">
              <span className="step-number">03</span>
              <div className="step-content">
                <h4>เปรียบเทียบ</h4>
                <p>เปรียบเทียบค่าปัจจุบันในรอบนั้นกับค่าที่น้อยที่สุดที่บันทึกไว้ เพื่ออัปเดตตำแหน่งค่าที่น้อยที่สุด</p>
              </div>
            </div>
            <div className="step-item">
              <span className="step-number">04</span>
              <div className="step-content">
                <h4>สลับที่</h4>
                <p>สลับค่าที่ตำแหน่งเริ่มต้นของรอบนั้น กับค่าที่น้อยที่สุดที่พบจากการค้นหา</p>
              </div>
            </div>
          </div>
        </section>

        {/* 3. Pseudo Code Box - แก้ไขให้เหมือนรูปภาพที่คุณแนบมา (ไม่มีตัว $) */}
        <section className="fade-in-up">
          <h3 className="section-header">💻 รหัสเทียม (Pseudo Code)</h3>

          <div className="pseudo-code-box">
            {code.map((line) => (
              <div className="code-line">
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

        {/* 4. ประสิทธิภาพเชิงเวลา - อ้างอิงหน้าที่ 12-13/17 */}
        <section className="fade-in-up">
          <h3 className="section-header">📊 การวิเคราะห์ประสิทธิภาพเชิงเวลา</h3>
          
          <div className="formula-card">
             <p>สูตรคำนวณจำนวนครั้งในการเปรียบเทียบทั้งหมด:</p>
             {/* 🟢 แก้ไขตรงนี้: เขียนเป็นข้อความธรรมดา ไม่ใช้ {n} ต่อหน้าวงเล็บ */}
             <h2 className="math-big"> C(n) = n(n - 1) / 2 </h2>
             <p>ประสิทธิภาพเชิงเวลา (Time Complexity): <strong className="highlight-o">O(n²)</strong></p>
          </div>

          

          <div className="table-container" style={{marginTop:'30px'}}>
             <table className="analysis-table big-o">
               <thead>
                 <tr><th>กรณี (Case)</th><th>Time Complexity</th><th>คำอธิบาย</th></tr>
               </thead>
               <tbody>
                 <tr>
                    <td>กรณีที่ดีที่สุด (Best Case)</td>
                    <td>O(n²)</td>
                    <td>แม้ข้อมูลจะเรียงลำดับอยู่แล้ว จำนวนรอบเปรียบเทียบยังคงเท่าเดิม</td>
                 </tr>
                 <tr>
                    <td>กรณีโดยเฉลี่ย (Average Case)</td>
                    <td>O(n²)</td>
                    <td>กรณีที่ข้อมูลยังไม่จัดเรียงสุ่มสลับกันไปมา</td>
                 </tr>
                 <tr>
                    <td>กรณีที่เลวร้ายที่สุด (Worst Case)</td>
                    <td>O(n²)</td>
                    <td>กรณีข้อมูลเรียงลำดับตรงกันข้ามกับที่ต้องการทั้งหมด</td>
                 </tr>
               </tbody>
             </table>
             <p style={{marginTop:'15px', fontSize:'0.9rem', color:'#666'}}>
                *หมายเหตุ: สำหรับ Selection Sort ไม่ว่ากรณีใดจำนวนรอบเปรียบเทียบจะเท่ากับ n-1 เสมอ
             </p>
          </div>
        </section>

        {/* 5. ข้อดี และ ข้อเสีย - อ้างอิงหน้าที่ 13/17 */}
        <section className="fade-in-up">
          <h3 className="section-header">⚖️ วิเคราะห์ข้อดี และ ข้อเสีย</h3>
          <div className="pc-clean-grid">
            <div className="pc-card pros">
              <div className="pc-header">
                <h3>✅ ข้อดี</h3>
              </div>
              <ul className="pc-clean-list">
                <li><strong>ความเข้าใจ:</strong> อัลกอริทึมเข้าใจง่าย ไม่ซับซ้อน </li>
                <li><strong>ความเหมาะสม:</strong> เหมาะสำหรับชุดข้อมูลที่มีขนาดเล็ก </li>
                <li><strong>หน่วยความจำ:</strong> ไม่ต้องใช้หน่วยความจำเพิ่มเติมระหว่างการจัดเรียง </li>
              </ul>
            </div>

            <div className="pc-card cons">
              <div className="pc-header">
                <h3>❌ ข้อเสีย</h3>
              </div>
              <ul className="pc-clean-list">
                <li><strong>ประสิทธิภาพ:</strong> ไม่เหมาะกับชุดข้อมูลที่มีจำนวนมาก </li>
                <li><strong>เชิงเวลา:</strong> ประสิทธิภาพเชิงเวลาเป็น O(n²) ในทุกกรณี </li>
              </ul>
            </div>
          </div>
        </section>

        {/* 6. Video CTA (Glassmorphism Style) */}
        <div className="lesson-detail-video fade-in-up">
          <h3>🎬 พร้อมเรียนรู้ผ่านวิดีโอหรือยัง?</h3>
          <p style={{marginBottom: '30px', opacity: 0.9}}>
            รับชมวิดีโอแอนิเมชันประกอบการอธิบายขั้นตอนของ Selection Sort เพื่อเสริมสร้างความเข้าใจที่ชัดเจนยิ่งขึ้น
          </p>
          <a href="/video/selection-sort" className="video-btn-styled">
            เข้าสู่บทเรียนวิดีโอ ▶
          </a>
        </div>

      </div>
    </MainLayout>
  );
}