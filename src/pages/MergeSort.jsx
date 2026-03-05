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
  <h3 className="section-header">🧮 ตัวอย่างการจัดเรียง (Merge Sort)</h3>

  <div className="concept-card">

<p><strong>Input:</strong> [5, 7, 11, 1, 9, 3]</p>

<p>1️⃣ เริ่มจากแบ่งอาร์เรย์ออกเป็นสองส่วน</p>

<div style={{display:"flex", justifyContent:"center"}}>
<pre className="array-demo">
{`
          [5, 7, 11, 1, 9, 3]
            /           \\
      [5, 7, 11]     [1, 9, 3]
`}
</pre>
</div>

<p>2️⃣ แบ่งต่อจนเหลือค่าเดียว</p>

<div style={{display:"flex", justifyContent:"center"}}>
<pre className="array-demo">
{`
        [5,7,11]           [1,9,3]
        /     \\           /     \\
     [5]    [7,11]      [1]     [9,3]
              /  \\               /  \\
            [7]  [11]           [9]  [3]
`}
</pre>
</div>

<p>3️⃣ เริ่มผสาน (Merge) จากล่างขึ้นบน</p>

<div style={{display:"flex", justifyContent:"center"}}>
<pre className="array-demo">
{`
[7] + [11] → [7,11]

[9] + [3] → [3,9]
`}
</pre>
</div>

<p>4️⃣ ผสานระดับถัดไป</p>

<div style={{display:"flex", justifyContent:"center"}}>
<pre className="array-demo">
{`
[5] + [7,11] → [5,7,11]

[1] + [3,9] → [1,3,9]
`}
</pre>
</div>

<p>5️⃣ ผสานขั้นสุดท้าย</p>

<div style={{display:"flex", justifyContent:"center"}}>
<pre className="array-demo">
{`
[5,7,11] + [1,3,9]

→ [1,3,5,7,9,11]
`}
</pre>
</div>

<p>
<strong>Output:</strong> [1, 3, 5, 7, 9, 11]
</p>

  </div>
</section>


{/* ================= TIME COMPLEXITY ================= */}
<section className="fade-in-up">
  <h3 className="section-header">📊 การวิเคราะห์ประสิทธิภาพเชิงเวลา</h3>

  <div className="formula-card">
    <p>Merge Sort ใช้แนวคิด Divide and Conquer โดยแบ่งข้อมูลออกเป็นส่วนย่อยและผสานกลับ</p>
    <h2 className="math-big">T(n) = n log₂ n</h2>
    <p>
      ประสิทธิภาพเชิงเวลาในทุกกรณีคือ 
      <strong className="highlight-o"> O(n log n)</strong>
    </p>
  </div>

  <div className="table-container" style={{marginTop:'30px'}}>
    <table className="analysis-table big-o">
      <thead>
        <tr>
          <th>กรณี (Case)</th>
          <th>Time Complexity</th>
          <th>คำอธิบาย</th>
        </tr>
      </thead>
      <tbody>

        <tr>
          <td>กรณีที่ดีที่สุด (Best Case)</td>
          <td>O(n log n)</td>
          <td>ข้อมูลถูกแบ่งออกเป็นส่วนย่อยและผสานกลับตามขั้นตอนปกติ</td>
        </tr>

        <tr>
          <td>กรณีโดยเฉลี่ย (Average Case)</td>
          <td>O(n log n)</td>
          <td>ข้อมูลมีลักษณะสุ่ม แต่ยังคงต้องแบ่งและผสานข้อมูลทุกระดับ</td>
        </tr>

        <tr>
          <td>กรณีที่เลวร้ายที่สุด (Worst Case)</td>
          <td className="highlight-o" style={{color:"#c62828"}}>{"O(n²)"}</td>
          <td>เกิดขึ้นเมื่อข้อมูลเรียงลำดับอยู่แล้วหรือกลับลำดับกัน และเลือก Pivot เป็นค่าแรกหรือค่าสุดท้าย</td>
        </tr>

      </tbody>
    </table>
  </div>
</section>

{/* ================= ข้อดี ข้อเสีย ================= */}
<section className="fade-in-up">
  <h3 className="section-header">⚖️ วิเคราะห์ข้อดี และ ข้อเสีย</h3>

  <div className="pc-clean-grid">

    <div className="pc-card pros">
      <div className="pc-header">
        <h3>✅ ข้อดี</h3>
      </div>

      <ul className="pc-clean-list">
        <li><strong>Time Complexity คงที่:</strong> ทุกกรณีมีประสิทธิภาพ O(n log n)</li>
        <li><strong>Stable Sort:</strong> รักษาลำดับของข้อมูลที่มีค่าเท่ากัน</li>
        <li><strong>เหมาะกับข้อมูลจำนวนมาก:</strong> ทำงานได้ดีเมื่อชุดข้อมูลมีขนาดใหญ่</li>
        <li><strong>เหมาะกับการประมวลผลแบบแบ่งส่วน:</strong> ใช้แนวคิด Divide and Conquer</li>
      </ul>
    </div>

    <div className="pc-card cons">
      <div className="pc-header">
        <h3>❌ ข้อเสีย</h3>
      </div>

      <ul className="pc-clean-list">
        <li><strong>ใช้หน่วยความจำเพิ่ม:</strong> ต้องมีพื้นที่สำหรับการผสานข้อมูล</li>
        <li><strong>ไม่เป็น In-place Sorting:</strong> ต้องใช้ Array ชั่วคราว</li>
        <li><strong>ขั้นตอนซับซ้อนกว่า:</strong> เมื่อเทียบกับอัลกอริทึมพื้นฐาน เช่น Bubble Sort</li>
      </ul>
    </div>

  </div>
</section>


{/* ================= VIDEO ================= */}
<div className="lesson-detail-video fade-in-up">
  <h3>🎬 พร้อมดูการทำงานของ Merge Sort หรือยัง?</h3>

  <p style={{marginBottom:'30px', opacity:0.9}}>
    รับชมแอนิเมชันการแบ่งข้อมูล (Divide) และการผสานข้อมูล (Merge) แบบทีละขั้นตอน
  </p>

  <a href="/video/merge-sort" className="video-btn-styled">
    เข้าสู่บทเรียนวิดีโอ ▶
  </a>
</div>

      </div>
    </MainLayout>
  );
}