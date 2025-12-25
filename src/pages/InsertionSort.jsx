import React from "react";
import MainLayout from "../layouts/MainLayout";
import "../styles/lesson-detail.css"; 
import bg2 from "../assets/bg-pattern.png"; 

export default function InsertionSortLesson() {
  return (
    <MainLayout>
      {/* ---------------- HERO SECTION ---------------- */}
      <div className="lesson-detail-hero" style={{ backgroundImage: `url(${bg2})` }}>
        <div className="hero-center">
            <p className="hero-sub">บทเรียน</p>
            <h1 className="hero-title">Insertion Sort</h1>
            <p className="hero-desc">การจัดเรียงข้อมูลแบบแทรก</p>
        </div>
      </div>

      <div className="lesson-detail-container">
        
        {/* 1. CONCEPT */}
        <section className="fade-in-up">
          <h3 className="section-header">🔍 ความหมาย</h3>
          <div className="concept-card">
            <p>
              <strong>Insertion Sort</strong> คือการจัดเรียงลำดับโดยแบ่งข้อมูลออกเป็น 2 ส่วน คือ 
              <span className="highlight-text">"ส่วนที่เรียงแล้ว"</span> และ 
              <span className="highlight-text">"ส่วนที่ยังไม่เรียง"</span> 
              โดยระบบจะดึงข้อมูลจากส่วนที่ยังไม่เรียงทีละตัว มา <strong>"แทรก (Insert)"</strong> 
              ลงในตำแหน่งที่เหมาะสมในส่วนที่เรียงแล้ว
            </p>
          </div>
        </section>

        {/* 2. STEPS */}
        <section className="fade-in-up">
          <h3 className="section-header">🚀 4 ขั้นตอนการทำงาน</h3>
          <div className="steps-grid">
            <div className="step-item">
              <span className="step-number">01</span>
              <div className="step-content">
                <h4>เริ่มต้น (Start)</h4>
                <ul className="step-list">
                  <li>เริ่มพิจารณาจากข้อมูล <strong>ตำแหน่งแรกสุด</strong></li>
                  <li>ถือว่าตำแหน่งแรกถูกเรียงลำดับแล้ว (เพราะมีตัวเดียว)</li>
                </ul>
              </div>
            </div>
            <div className="step-item">
              <span className="step-number">02</span>
              <div className="step-content">
                <h4>เปรียบเทียบ (Compare)</h4>
                <ul className="step-list">
                  <li>เริ่มเปรียบเทียบค่าที่ <strong>ตำแหน่งถัดไป</strong> กับข้อมูลที่อยู่ก่อนหน้า</li>
                  <li>เพื่อหาตำแหน่งที่เหมาะสมในการแทรก</li>
                </ul>
              </div>
            </div>
            <div className="step-item">
              <span className="step-number">03</span>
              <div className="step-content">
                <h4>แทรก (Insert)</h4>
                <ul className="step-list">
                  <li>ถ้าข้อมูลตัวใหม่มีค่าน้อยกว่า (หรือมากกว่า) ข้อมูลก่อนหน้า</li>
                  <li>ให้ <strong>เลื่อน (Shift)</strong> ข้อมูลเก่าไปข้างหลัง แล้วแทรกข้อมูลใหม่ลงในช่องว่าง</li>
                </ul>
              </div>
            </div>
            <div className="step-item">
              <span className="step-number">04</span>
              <div className="step-content">
                <h4>ทำซ้ำ (Repeat)</h4>
                <ul className="step-list">
                  <li>ทำซ้ำขั้นตอนที่ 1-3 กับข้อมูลตัวถัดไปเรื่อยๆ</li>
                  <li>จนกระทั่งข้อมูลทั้งหมดถูกจัดเรียงเรียบร้อย</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* 3. PSEUDO CODE (แก้ไขสัญลักษณ์พิเศษแล้ว) */}
        <section className="fade-in-up">
          <h3 className="section-header">💻 ตัวอย่างโค้ด (Pseudo Code)</h3>
          <div className="pseudo-code-box">
             <div className="code-line"><span className="line-num">1</span> <span className="keyword">Function</span> insertionSort(array, n)</div>
             <div className="code-line"><span className="line-num">2</span> &nbsp;&nbsp; <span className="keyword">For</span> unsorted = 1 <span className="keyword">to</span> n - 1</div>
             <div className="code-line"><span className="line-num">3</span> &nbsp;&nbsp;&nbsp;&nbsp; nextItem = array[unsorted]</div>
             <div className="code-line"><span className="line-num">4</span> &nbsp;&nbsp;&nbsp;&nbsp; loc = unsorted</div>
             <div className="code-line"><span className="line-num">5</span> &nbsp;&nbsp;&nbsp;&nbsp; <span className="comment">// วนลูปเพื่อเลื่อนข้อมูล (Shift) หาช่องว่าง</span></div>
             {/* แก้ไขเครื่องหมาย > เป็น &gt; เพื่อไม่ให้ error */}
             <div className="code-line"><span className="line-num">6</span> &nbsp;&nbsp;&nbsp;&nbsp; <span className="keyword">While</span> (loc &gt; 0 <span className="keyword">AND</span> array[loc-1] &gt; nextItem)</div>
             <div className="code-line"><span className="line-num">7</span> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; array[loc] = array[loc-1] <span className="comment">// เลื่อนข้อมูลไปขวา</span></div>
             <div className="code-line"><span className="line-num">8</span> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; loc = loc - 1</div>
             <div className="code-line"><span className="line-num">9</span> &nbsp;&nbsp;&nbsp;&nbsp; <span className="keyword">End While</span></div>
             <div className="code-line"><span className="line-num">10</span>&nbsp;&nbsp;&nbsp;&nbsp; array[loc] = nextItem <span className="comment">// แทรกข้อมูลลงในตำแหน่งที่ถูกต้อง</span></div>
             <div className="code-line"><span className="line-num">11</span> <span className="keyword">End Function</span></div>
          </div>
        </section>

        {/* 4. EXAMPLES (ครบ 4 รอบ) */}
        <section className="fade-in-up">
          <h3 className="section-header">💡 ตัวอย่างการทำงาน</h3>
          
          <div className="comparison-grid">
            {/* กล่องซ้าย: น้อยไปมาก */}
            <div className="example-card asc">
               <div className="card-header">
                 <h4>📉 เรียงจากน้อยไปมาก (Ascending)</h4>
                 <p>ข้อมูลตัวอย่าง: <strong>[ 2, 5, 4, 1, 3 ]</strong></p>
               </div>
               <div className="card-body">
                 <div className="step-row">
                    <span className="label">รอบ 1</span>
                    <div className="detail">
                       นำ <strong>5</strong> เทียบ 2 ⮕ 5 มากกว่า ⮕ ไม่ต้องสลับ<br/>
                       <span className="array">2, 5, 4, 1, 3</span>
                    </div>
                 </div>
                 <div className="step-row">
                    <span className="label">รอบ 2</span>
                    <div className="detail">
                       นำ <strong>4</strong> เทียบ 5 ⮕ 4 น้อยกว่า ⮕ แทรก 4 ระหว่าง 2 กับ 5<br/>
                       <span className="array">2, 4, 5, 1, 3</span>
                    </div>
                 </div>
                 <div className="step-row">
                    <span className="label">รอบ 3</span>
                    <div className="detail">
                       นำ <strong>1</strong> เทียบทั้งหมด ⮕ 1 น้อยสุด ⮕ แทรกไว้หน้าสุด<br/>
                       <span className="array">1, 2, 4, 5, 3</span>
                    </div>
                 </div>
                 {/* ✅ รอบที่ 4 */}
                 <div className="step-row">
                    <span className="label">รอบ 4</span>
                    <div className="detail">
                       นำ <strong>3</strong> เทียบ 5,4,2 ⮕ แทรก 3 หลัง 2<br/>
                       <span className="array">1, 2, 3, 4, 5</span>
                    </div>
                 </div>
                 <div className="step-row finish">
                    <span className="label">จบ</span>
                    <div className="detail">
                       ข้อมูลเรียงสมบูรณ์: <span className="array final">1, 2, 3, 4, 5</span>
                    </div>
                 </div>
               </div>
            </div>

            {/* กล่องขวา: มากไปน้อย */}
            <div className="example-card desc">
               <div className="card-header">
                 <h4>📈 เรียงจากมากไปน้อย (Descending)</h4>
                 <p>ข้อมูลตัวอย่าง: <strong>[ 12, 2, 3, 20, 47 ]</strong></p>
               </div>
               <div className="card-body">
                 <div className="step-row">
                    <span className="label">รอบ 1</span>
                    <div className="detail">
                       นำ <strong>2</strong> เทียบ 12 ⮕ 2 น้อยกว่า ⮕ ไม่เลื่อน (ถูกแล้ว)<br/>
                       <span className="array">12, 2, 3, 20, 47</span>
                    </div>
                 </div>
                 <div className="step-row">
                    <span className="label">รอบ 2</span>
                    <div className="detail">
                       นำ <strong>3</strong> เทียบ 2 ⮕ 3 มากกว่า ⮕ แทรก 3 หน้า 2<br/>
                       <span className="array">12, 3, 2, 20, 47</span>
                    </div>
                 </div>
                 <div className="step-row">
                    <span className="label">รอบ 3</span>
                    <div className="detail">
                       นำ <strong>20</strong> เทียบ 12 ⮕ 20 มากกว่า ⮕ แทรก 20 หน้าสุด<br/>
                       <span className="array">20, 12, 3, 2, 47</span>
                    </div>
                 </div>
                 {/* ✅ รอบที่ 4 */}
                 <div className="step-row">
                    <span className="label">รอบ 4</span>
                    <div className="detail">
                       นำ <strong>47</strong> เทียบ 20 ⮕ 47 มากกว่า ⮕ แทรก 47 หน้าสุด<br/>
                       <span className="array">47, 20, 12, 3, 2</span>
                    </div>
                 </div>
                 <div className="step-row finish">
                    <span className="label">จบ</span>
                    <div className="detail">
                       ข้อมูลเรียงสมบูรณ์: <span className="array final">47, 20, 12, 3, 2</span>
                    </div>
                 </div>
               </div>
            </div>
          </div>
        </section>

        {/* 5. EFFICIENCY */}
        <section className="fade-in-up">
          <h3 className="section-header">📊 ประสิทธิภาพเชิงเวลา (Time Complexity)</h3>
          
          <div className="formula-card">
             <p>สูตรคำนวณจำนวนการเปรียบเทียบ (Worst Case)</p>
             <h2 className="math-big"> n(n - 1) / 2 </h2>
             <p style={{fontSize:'0.9rem', color:'#666'}}>*คำนวณจากผลรวม 1 + 2 + 3 + ... + (n-1)</p>
          </div>

          <div className="table-container" style={{marginTop:'30px'}}>
             <h4>ตารางวิเคราะห์ Time Complexity (Big-O)</h4>
             <table className="analysis-table big-o">
               <thead>
                 <tr>
                   <th>กรณี</th>
                   <th>Time Complexity</th>
                   <th>คำอธิบาย</th>
                 </tr>
               </thead>
               <tbody>
                 <tr>
                   <td>กรณีดีที่สุด (Best Case)</td>
                   <td className="highlight-o" style={{color:'#2e7d32'}}>O(n)</td>
                   <td>เมื่อข้อมูลถูกจัดเรียงอยู่แล้ว (แค่เทียบ ไม่ต้องเลื่อน)</td>
                 </tr>
                 <tr>
                   <td>กรณีเฉลี่ย (Average Case)</td>
                   <td className="highlight-o">O(n²)</td>
                   <td>ประสิทธิภาพทั่วไปเมื่อข้อมูลสุ่มพอประมาณ</td>
                 </tr>
                 <tr>
                   <td>กรณีเลวร้ายที่สุด (Worst Case)</td>
                   <td className="highlight-o" style={{color:'#c62828'}}>O(n²)</td>
                   <td>เมื่อข้อมูลเรียงกลับด้านทั้งหมด (ต้องเลื่อนทุกรอบ)</td>
                 </tr>
               </tbody>
             </table>
          </div>
        </section>

        {/* 6. PROS & CONS */}
        <section className="fade-in-up">
          <h3 className="section-header">⚖️ ข้อดี vs ข้อเสีย</h3>
          <div className="pc-clean-grid">
            
            {/* ข้อดี */}
            <div className="pc-card pros">
              <div className="pc-header">
                 <span className="pc-icon">✅</span>
                 <h3>ข้อดี</h3>
              </div>
              <ul className="pc-clean-list">
                <li>
                  <strong>เหมาะกับข้อมูลน้อย:</strong> ทำงานได้เร็วมากถ้าข้อมูลมีจำนวนไม่เยอะ (หลักร้อย)
                </li>
                <li>
                  <strong>Adaptive (ยืดหยุ่น):</strong> ถ้าข้อมูล "เกือบเรียงแล้ว" จะทำงานเร็วมาก (ใกล้เคียง O(n))
                </li>
                <li>
                  <strong>Simple & Stable:</strong> โค้ดเข้าใจง่าย และลำดับของข้อมูลที่เท่ากันจะไม่สลับที่ (Stable)
                </li>
                <li>
                  <strong>Low Memory:</strong> ไม่ต้องใช้พื้นที่หน่วยความจำเพิ่ม (In-place)
                </li>
              </ul>
            </div>

            {/* ข้อเสีย */}
            <div className="pc-card cons">
              <div className="pc-header">
                 <span className="pc-icon">❌</span>
                 <h3>ข้อเสีย</h3>
              </div>
              <ul className="pc-clean-list">
                <li>
                  <strong>ช้าเมื่อข้อมูลมาก:</strong> ไม่เหมาะกับข้อมูลหลักพัน-หมื่นขึ้นไป เพราะเป็น O(n²)
                </li>
                <li>
                  <strong>การเลื่อนข้อมูลเยอะ:</strong> ในกรณี Worst Case ต้องมีการเลื่อน (Shift) ข้อมูลในอาเรย์หลายตำแหน่ง
                </li>
                <li>
                  <strong>ประสิทธิภาพต่ำกว่าตัวอื่น:</strong> เทียบกับ Quick Sort หรือ Merge Sort จะช้ากว่ามากในข้อมูลขนาดใหญ่
                </li>
              </ul>
            </div>

          </div>
        </section>

        {/* VIDEO BUTTON */}
        <div className="lesson-detail-video fade-in-up">
          <p style={{color: '#fff', marginBottom: '20px', fontWeight:'bold', textShadow:'0 2px 4px rgba(0,0,0,0.2)'}}>
            ยังไม่เห็นภาพ? ไปดูวิดีโอสาธิตการแทรกข้อมูลกันเลย! 👇
          </p>
          <a href="/video/insertion-sort" className="video-btn-styled">
            🎬 ไปที่วิดีโอการเรียนรู้
          </a>
        </div>

      </div>
    </MainLayout>
  );
}