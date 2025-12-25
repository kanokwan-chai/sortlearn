import React from "react";
import MainLayout from "../layouts/MainLayout";
import "../styles/lesson-detail.css"; 
import bg2 from "../assets/bg-pattern.png"; 

export default function SelectionSortLesson() {
  return (
    <MainLayout>
      {/* HERO SECTION - อ้างอิงจากภาพถ่ายหน้าจอ 02.50.02.jpg */}
      <div className="lesson-detail-hero" style={{ backgroundImage: `url(${bg2})` }}>
        <div className="hero-center">
            <p className="hero-sub">บทเรียน</p>
            <h1 className="hero-title">Selection Sort</h1>
            <p className="hero-desc">การจัดเรียงข้อมูลแบบเลือก</p>
        </div>
      </div>

      <div className="lesson-detail-container">
        
        {/* 1. ความหมาย - อ้างอิงจากภาพถ่ายหน้าจอ 02.11.33.png */}
        <section className="fade-in-up">
          <h3 className="section-header">🔍 ความหมายของการจัดเรียงข้อมูลแบบเลือก</h3>
          <div className="concept-card">
            <p>
              <strong>Selection Sort</strong> หมายถึง การจัดเรียงข้อมูลโดยการ 
              <span className="highlight-text">“เลือกค่า” ที่น้อยที่สุดหรือมากที่สุด</span> 
              จากชุดข้อมูลที่ยังไม่ได้จัดเรียง แล้วนำมาวางในตำแหน่งที่ถูกต้องในแต่ละรอบ
            </p>
                      </div>
        </section>

        {/* 2. สรุปหลักการสำคัญ - อ้างอิงจากภาพถ่ายหน้าจอ 02.19.13.png และ 02.22.16.png */}
        <section className="fade-in-up">
          <h3 className="section-header">🚀 สรุปหลักการสำคัญ</h3>
          <div className="steps-grid">
            <div className="step-item">
              <span className="step-number">01</span>
              <div className="step-content">
                <h4>ค้นหา (Find)</h4>
                <p>มองหาตัวเลขที่น้อยที่สุดในกลุ่มข้อมูลที่เหลือ</p>
              </div>
            </div>
            <div className="step-item">
              <span className="step-number">02</span>
              <div className="step-content">
                <h4>สลับ (Swap)</h4>
                <p>นำตัวที่พบไปสลับกับตำแหน่งแรกสุดของกลุ่มนั้น</p>
              </div>
            </div>
            <div className="step-item">
              <span className="step-number">03</span>
              <div className="step-content">
                <h4>วนซ้ำ (Repeat)</h4>
                <p>เริ่มหาใหม่ในตำแหน่งถัดไปโดยข้ามตัวที่เรียงแล้ว</p>
              </div>
            </div>
            <div className="step-item">
              <span className="step-number">04</span>
              <div className="step-content">
                <h4>จบการทำงาน (Complete)</h4>
                <p>ทำซ้ำจนกระทั่งข้อมูลทุกตัวเรียงลำดับถูกต้อง</p>
              </div>
            </div>
          </div>
        </section>

        {/* 3. ขั้นตอนการจัดเรียงและ Pseudo Code - อ้างอิงจากภาพถ่ายหน้าจอ 02.12.02.png */}
        <section className="fade-in-up">
          <h3 className="section-header">💻 ขั้นตอนการจัดเรียงข้อมูล (Pseudo Code)</h3>
          <div className="pseudo-code-box">
             <div className="code-line">
               <span className="line-num">1</span> <span className="keyword">เริ่มต้น</span>: หาข้อมูลที่มี ค่าน้อยที่สุดหรือมากที่สุด จากชุดข้อมูลทั้งหมด
             </div>
             <div className="code-line">
               <span className="line-num">2</span> &nbsp;&nbsp;&nbsp;&nbsp; <strong>Pseudo Code</strong>: min_index = i, For j = i + 1 to n - 1, If array[j] &lt; array[min_index]
             </div>
             <div className="code-line">
               <span className="line-num">3</span> <span className="keyword">สลับ</span>: นำข้อมูลที่หาได้ ไปสลับกับข้อมูลในตำแหน่งแรกสุด ของชุดข้อมูล
             </div>
             <div className="code-line">
               <span className="line-num">4</span> &nbsp;&nbsp;&nbsp;&nbsp; <strong>Pseudo Code</strong>: Swap(array[i], array[min_index])
             </div>
             <div className="code-line">
               <span className="line-num">5</span> <span className="keyword">วนซ้ำ</span>: เริ่มค้นหาข้อมูลที่เหลือถัดไป โดยไม่รวมตำแหน่งที่จัดเรียงไว้แล้ว
             </div>
             <div className="code-line">
               <span className="line-num">6</span> &nbsp;&nbsp;&nbsp;&nbsp; <strong>Pseudo Code</strong>: For i = 0 to n - 2
             </div>
             <div className="code-line">
               <span className="line-num">7</span> <span className="keyword">จบทรง</span>: ทำซ้ำจนกระทั่งลูป i ทำงานถึงตัวสุดท้าย ข้อมูลจึงเรียงเสร็จสมบูรณ์
             </div>
             <div className="code-line">
               <span className="line-num">8</span> &nbsp;&nbsp;&nbsp;&nbsp; <strong>Pseudo Code</strong>: End Function
             </div>
          </div>
        </section>

        {/* 4. ตัวอย่างการจัดเรียง (Trace) - อ้างอิงจากภาพถ่ายหน้าจอ 02.11.52.png */}
        <section className="fade-in-up">
          <h3 className="section-header">💡 ตัวอย่างการทำงาน (Ascending Order)</h3>
          <p style={{marginBottom: '20px'}}>เริ่มจากข้อมูล [ 2, 5, 4, 1, 3 ] ในแต่ละรอบจะเลือกค่าน้อยที่สุด (Min) แล้วนำไปวางด้านหน้า</p>
                    <div className="table-container">
             <table className="analysis-table">
               <thead>
                 <tr><th>ขั้นตอน</th><th>ตัวอย่างข้อมูล</th><th>Pseudo Code</th></tr>
               </thead>
               <tbody>
                 <tr><td>เริ่มต้น</td><td>[ 2, 5, 4, 1, 3 ]</td><td>selectionSort(array, n)</td></tr>
                 <tr><td>รอบที่ 1</td><td>(2), 5, 4, 1, 3</td><td>min_index = i</td></tr>
                 <tr><td>ค้นหา</td><td>2, 5, 4, (1), 3</td><td>If array[j] &lt; array[min_index]</td></tr>
                 <tr><td>สลับ (Swap)</td><td>1, 5, 4, 2, 3</td><td>Swap(array[i], array[min_index])</td></tr>
                 <tr><td>สิ้นสุด</td><td>[ 1, 2, 3, 4, 5 ]</td><td>End Function</td></tr>
               </tbody>
             </table>
          </div>
        </section>

        {/* 5. ประสิทธิภาพเชิงเวลา - อ้างอิงจากภาพถ่ายหน้าจอ 02.12.10.png และ 02.31.19.png */}
        <section className="fade-in-up">
          <h3 className="section-header">📊 รอบการทำงานและประสิทธิภาพ</h3>
          
          <div className="table-container">
             <h4>จำนวนครั้งที่เปรียบเทียบ (เมื่อมีข้อมูล n ตัว)</h4>
             <table className="analysis-table">
               <thead>
                 <tr><th>รอบการทำงาน</th><th>จำนวนครั้งที่เปรียบเทียบ</th></tr>
               </thead>
               <tbody>
                 <tr><td>รอบที่ 1</td><td>n - 1 ครั้ง</td></tr>
                 <tr><td>รอบที่ 2</td><td>n - 2 ครั้ง</td></tr>
                 <tr><td>รอบที่ 3</td><td>n - 3 ครั้ง</td></tr>
                 <tr><td>รอบที่ n</td><td>1 ครั้ง</td></tr>
               </tbody>
             </table>
          </div>

          <div className="formula-card">
             <p>สูตรคำนวณจำนวนครั้งการเปรียบเทียบทั้งหมด:</p>
             <h2 className="math-big"> n(n - 1) / 2 </h2>
             <p>Big-O Complexity: O(n²) ทุกกรณี</p>
          </div>

          <div className="table-container" style={{marginTop:'30px'}}>
             <h4>การวิเคราะห์ Time Complexity (Big-O)</h4>
             <table className="analysis-table big-o">
               <thead>
                 <tr><th>กรณี</th><th>Time Complexity</th><th>คำอธิบาย</th></tr>
               </thead>
               <tbody>
                 <tr><td>กรณีดีที่สุด (Best Case)</td><td>O(n²)</td><td>แม้ข้อมูลจะเรียงอยู่แล้ว ก็ยังต้องเปรียบเทียบครบทุกคู่</td></tr>
                 <tr><td>กรณีเฉลี่ย (Average Case)</td><td>O(n²)</td><td>ประสิทธิภาพทั่วไปของอัลกอริทึม</td></tr>
                 <tr><td>กรณีเลวร้ายที่สุด (Worst Case)</td><td>O(n²)</td><td>ช้าที่สุด เช่น ข้อมูลเรียงกลับลำดับทั้งหมด</td></tr>
               </tbody>
             </table>
          </div>
        </section>

        {/* 6. ข้อดี และ ข้อเสีย - อ้างอิงจากภาพถ่ายหน้าจอ 02.22.00.png และ 02.27.10.png */}
        <section className="fade-in-up">
          <h3 className="section-header">⚖️ ข้อดี และ ข้อเสีย</h3>
          <div className="pros-cons-grid">
            <div className="pc-column">
              <h4>✅ ข้อดี</h4>
              <ul className="pc-list">
                <li>เหมาะกับชุดข้อมูลขนาดเล็ก</li>
                <li>โค้ดเรียบง่าย เข้าใจง่าย</li>
                <li>ไม่ต้องใช้หน่วยความจำเพิ่มเติม</li>
              </ul>
            </div>
            <div className="pc-column">
              <h4>❌ ข้อเสีย</h4>
              <ul className="pc-list">
                <li>ไม่เหมาะกับชุดข้อมูลจำนวนมาก</li>
                <li>ประสิทธิภาพต่ำ เพราะมีค่าเป็น O(n²) ทุกกรณี</li>
              </ul>
            </div>
          </div>
        </section>

        {/* VIDEO BUTTON */}
        <div className="lesson-detail-video fade-in-up">
          <p style={{color: '#fff', marginBottom: '20px', fontWeight:'bold', textShadow:'0 2px 4px rgba(0,0,0,0.2)'}}>
            เพื่อให้เห็นภาพการทำงานที่ชัดเจนยิ่งขึ้น ไปลองดูวิดีโอกันเลย! 👇
          </p>
          <a href="/video/selection-sort" className="video-btn-styled">🎬 ไปที่วิดีโอการเรียนรู้</a>
        </div>

      </div>
    </MainLayout>
  );
}