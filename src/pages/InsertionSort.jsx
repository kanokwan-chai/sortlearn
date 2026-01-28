import React from "react";
import MainLayout from "../layouts/MainLayout";
import "../styles/lesson-detail.css"; 
import bg2 from "../assets/bg-pattern.png"; 

export default function InsertionSortLesson() {
  // ประกาศตัวแปร n เพื่อป้องกัน Error [eslint] 'n' is not defined ในสูตรคำนวณ
  const n = "n"; 

  return (
    <MainLayout>
      {/* ---------------- HERO SECTION ---------------- */}
      <div className="lesson-detail-hero" style={{ backgroundImage: `url(${bg2})` }}>
        <div className="hero-center">
            <p className="hero-sub">หน่วยการเรียนรู้ที่ 2</p>
            <h1 className="hero-title">Insertion Sort</h1>
            <p className="hero-desc">การจัดเรียงข้อมูลแบบแทรก</p>
        </div>
      </div>

      <div className="lesson-detail-container">
        
        {/* 1. CONCEPT - อ้างอิงจากใบเนื้อหา หน้า 1/8 */}
        <section className="fade-in-up">
          <h3 className="section-header">🔍 ความหมายของการจัดเรียงข้อมูลแบบแทรก</h3>
          <div className="concept-card">
            <p>
              <strong>การจัดเรียงข้อมูลแบบแทรก (Insertion Sort)</strong> หมายถึง การจัดเรียงลำดับโดยการพิจารณาข้อมูลทีละตัว 
              แล้วนำข้อมูลนั้นไป <span className="highlight-text">“แทรก” ในตำแหน่งที่เหมาะสม</span> 
              ของชุดข้อมูลที่จัดเรียงเรียบร้อยแล้ว โดยจะแบ่งพื้นที่ออกเป็น 2 ส่วน คือส่วนที่จัดเรียงแล้ว และส่วนที่ยังไม่ได้จัดเรียง
            </p>
          </div>
        </section>

        {/* 2. STEPS - อ้างอิงจากใบเนื้อหา หน้า 1/8 */}
        <section className="fade-in-up">
          <h3 className="section-header">🚀 ขั้นตอนวิธีการจัดเรียงข้อมูล</h3>
          <div className="steps-grid">
            <div className="step-item">
              <span className="step-number">01</span>
              <div className="step-content">
                <h4>เริ่มต้นตำแหน่งแรก</h4>
                <p>เริ่มที่ตำแหน่งแรกสุด โดยถือว่าข้อมูลตัวแรกนั้นเรียงลำดับเรียบร้อยแล้ว (Sorted)</p>
              </div>
            </div>
            <div className="step-item">
              <span className="step-number">02</span>
              <div className="step-content">
                <h4>เปรียบเทียบค่าถัดไป</h4>
                <p>นำข้อมูลในตำแหน่งถัดไป (Unsorted) มาเปรียบเทียบกับข้อมูลที่อยู่ก่อนหน้าในส่วนที่เรียงแล้ว</p>
              </div>
            </div>
            <div className="step-item">
              <span className="step-number">03</span>
              <div className="step-content">
                <h4>แทรกในตำแหน่งที่เหมาะสม</h4>
                <p>ถ้าข้อมูลที่พิจารณามีค่าน้อยกว่า ให้เลื่อน (Shift) ข้อมูลก่อนหน้าไปทางขวา แล้วแทรกข้อมูลใหม่ลงไป</p>
              </div>
            </div>
            <div className="step-item">
              <span className="step-number">04</span>
              <div className="step-content">
                <h4>ทำซ้ำจนครบ</h4>
                <p>ทำซ้ำขั้นตอนเดิมกับข้อมูลตัวถัดไปเรื่อยๆ จนกระทั่งข้อมูลทั้งหมดถูกจัดเรียงครบถ้วน</p>
              </div>
            </div>
          </div>
        </section>

        
        {/* 3. PSEUDO CODE - อ้างอิงจากใบเนื้อหา หน้า 1/8 และ 4/8 */}
        <section className="fade-in-up">
          <h3 className="section-header">💻 รหัสเทียม (Pseudo Code)</h3>
          <div className="pseudo-code-box">
             <div className="code-line">
               <span className="line-num">1</span> <span className="keyword">Algorithm</span> Insertion_Sort(A)
             </div>
             <div className="code-line">
               <span className="line-num">2</span> <span className="keyword">Begin</span>
             </div>
             <div className="code-line">
               <span className="line-num">3</span> &nbsp;&nbsp; n ← length(A)
             </div>
             <div className="code-line">
               <span className="line-num">4</span> &nbsp;&nbsp; <span className="keyword">For</span> i ← 1 to n - 1 <span className="keyword">do</span> <span className="comment">// เริ่มพิจารณาตัวที่สอง</span>
             </div>
             <div className="code-line">
               <span className="line-num">5</span> &nbsp;&nbsp;&nbsp;&nbsp; key ← A[i] <span className="comment">// เก็บค่าที่จะนำไปแทรก</span>
             </div>
             <div className="code-line">
               <span className="line-num">6</span> &nbsp;&nbsp;&nbsp;&nbsp; j ← i - 1 <span className="comment">// ตำแหน่งก่อนหน้า</span>
             </div>
             <div className="code-line">
               <span className="line-num">7</span> &nbsp;&nbsp;&nbsp;&nbsp; <span className="keyword">While</span> j ≥ 0 <span className="keyword">and</span> A[j] &gt; key <span className="keyword">do</span>
             </div>
             <div className="code-line">
               <span className="line-num">8</span> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; A[j+1] ← A[j] <span className="comment">// เลื่อนข้อมูลไปทางขวา</span>
             </div>
             <div className="code-line">
               <span className="line-num">9</span> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; j ← j - 1
             </div>
             <div className="code-line">
               <span className="line-num">10</span> &nbsp;&nbsp;&nbsp;&nbsp; <span className="keyword">End while</span>
             </div>
             <div className="code-line">
               <span className="line-num">11</span> &nbsp;&nbsp;&nbsp;&nbsp; A[j+1] ← key <span className="comment">// แทรกข้อมูลลงในตำแหน่งที่ถูกต้อง</span>
             </div>
             <div className="code-line">
               <span className="line-num">12</span> &nbsp;&nbsp; <span className="keyword">End for</span>
             </div>
             <div className="code-line">
               <span className="line-num">13</span> <span className="keyword">End Algorithm</span>
             </div>
          </div>
        </section>

        {/* 4. EFFICIENCY - อ้างอิงจากใบเนื้อหา หน้า 6/8 */}
        <section className="fade-in-up">
          <h3 className="section-header">📊 การวิเคราะห์ประสิทธิภาพเชิงเวลา</h3>
          
          <div className="formula-card">
             <p>สูตรคำนวณจำนวนครั้งในการเปรียบเทียบทั้งหมด (Worst Case):</p>
             <h2 className="math-big"> C(n) = n(n - 1) / 2 </h2>
             <p>ประสิทธิภาพเชิงเวลา (Time Complexity): <strong className="highlight-o">O({n}²)</strong></p>
          </div>

          
          <div className="table-container" style={{marginTop:'30px'}}>
             <table className="analysis-table big-o">
               <thead>
                 <tr><th>กรณี (Case)</th><th>Time Complexity</th><th>คำอธิบาย</th></tr>
               </thead>
               <tbody>
                 <tr>
                    <td>กรณีที่ดีที่สุด (Best Case)</td>
                    <td className="highlight-o" style={{color:'#2e7d32'}}>O({n})</td>
                    <td>ข้อมูลเรียงลำดับอยู่แล้ว เปรียบเทียบเพียงรอบละ 1 ครั้ง และไม่มีการเลื่อนข้อมูล</td>
                 </tr>
                 <tr>
                    <td>กรณีโดยเฉลี่ย (Average Case)</td>
                    <td>O({n}²)</td>
                    <td>ข้อมูลอยู่ในลักษณะสุ่ม ต้องเลื่อนตำแหน่งข้อมูลโดยเฉลี่ยครึ่งหนึ่งในแต่ละรอบ</td>
                 </tr>
                 <tr>
                    <td>กรณีที่เลวร้ายที่สุด (Worst Case)</td>
                    <td className="highlight-o" style={{color:'#c62828'}}>O({n}²)</td>
                    <td>ข้อมูลเรียงลำดับตรงกันข้ามทั้งหมด ต้องเลื่อนข้อมูลในส่วนที่เรียงแล้วทั้งหมดทุกรอบ</td>
                 </tr>
               </tbody>
             </table>
          </div>
        </section>

        {/* 5. PROS & CONS - อ้างอิงจากใบเนื้อหา หน้า 4/8 และ 7/8 */}
        <section className="fade-in-up">
          <h3 className="section-header">⚖️ วิเคราะห์ข้อดี และ ข้อเสีย</h3>
          <div className="pc-clean-grid">
            <div className="pc-card pros">
              <div className="pc-header">
                <h3>✅ ข้อดี</h3>
              </div>
              <ul className="pc-clean-list">
                <li><strong>เข้าใจง่าย:</strong> อัลกอริทึมมีขั้นตอนไม่ซับซ้อน เข้าใจได้ง่าย</li>
                <li><strong>ยืดหยุ่นสูง:</strong> ทำงานได้เร็วมากเมื่อข้อมูลเกือบเรียงลำดับแล้ว (Adaptive)</li>
                <li><strong>หน่วยความจำ:</strong> ใช้พื้นที่เพิ่มเติมน้อยมาก (In-place Sorting)</li>
                <li><strong>เสถียรภาพ:</strong> เป็นการจัดเรียงแบบเสถียร (Stable Sort) ข้อมูลที่เท่ากันจะไม่สลับที่กัน</li>
              </ul>
            </div>

            <div className="pc-card cons">
              <div className="pc-header">
                <h3>❌ ข้อเสีย</h3>
              </div>
              <ul className="pc-clean-list">
                <li><strong>ข้อมูลขนาดใหญ่:</strong> ไม่เหมาะสมกับชุดข้อมูลที่มีจำนวนมาก</li>
                <li><strong>ประสิทธิภาพลดลง:</strong> เมื่อข้อมูลเรียงกลับด้าน จะต้องเลื่อนข้อมูลจำนวนมากทำให้ทำงานช้าลง</li>
                <li><strong>เชิงเวลา:</strong> กรณีแย่ที่สุดมีความซับซ้อนสูงถึง O({n}²)</li>
              </ul>
            </div>
          </div>
        </section>

        {/* 6. Video CTA */}
        <div className="lesson-detail-video fade-in-up">
          <h3>🎬 พร้อมเรียนรู้วิธีการแทรกข้อมูลหรือยัง?</h3>
          <p style={{marginBottom: '30px', opacity: 0.9}}>
            รับชมวิดีโอแอนิเมชันสาธิตขั้นตอนการทำงานของ Insertion Sort เพื่อช่วยให้คุณเห็นภาพการแทรกข้อมูลที่ชัดเจนยิ่งขึ้น
          </p>
          <a href="/video/insertion-sort" className="video-btn-styled">
            เข้าสู่บทเรียนวิดีโอ ▶
          </a>
        </div>

      </div>
    </MainLayout>
  );
}