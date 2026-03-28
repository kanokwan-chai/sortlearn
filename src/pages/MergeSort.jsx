import React from "react";
import MainLayout from "../layouts/MainLayout";
import "../styles/lesson-detail.css"; 
import bg2 from "../assets/bg-pattern.png"; 

export default function MergeSort() {
  const mergeCode = [
  {
    line: 1,
    text: (
      <>
        <span className="keyword">Algorithm</span> Merge(A, left, mid, right)
      </>
    ),
    level: 0,
  },
  { line: 2, text: <><span className="keyword">Begin</span></>, level: 0 },

  { line: 3, text: <>i ← left</>, level: 1 },
  { line: 4, text: <>j ← mid + 1</>, level: 1 },

  {
    line: 5,
    text: (
      <>
        <span className="keyword">While</span> i ≤ mid <span className="keyword">and</span> j ≤ right <span className="keyword">do</span>
      </>
    ),
    level: 1,
  },

  {
    line: 6,
    text: (
      <>
        <span className="keyword">If</span> A[i] ≤ A[j] <span className="keyword">Then</span>
      </>
    ),
    level: 2,
  },
  { line: 7, text: <>put A[i] into sorted array</>, level: 3 },
  { line: 8, text: <>i ← i + 1</>, level: 3 },

  { line: 9, text: <><span className="keyword">Else</span></>, level: 2 },
  { line: 10, text: <>put A[j] into sorted array</>, level: 3 },
  { line: 11, text: <>j ← j + 1</>, level: 3 },

  { line: 12, text: <><span className="keyword">End if</span></>, level: 2 },
  { line: 13, text: <><span className="keyword">End while</span></>, level: 1 },

  {
    line: 14,
    text: (
      <>
        put remaining elements into sorted array
      </>
    ),
    level: 1,
  },

  { line: 15, text: <><span className="keyword">End</span></>, level: 0 },
];
const mergeSortCode = [
  {
    line: 1,
    text: (
      <>
        <span className="keyword">Algorithm</span> MergeSort(A, left, right)
      </>
    ),
    level: 0,
  },
  { line: 2, text: <><span className="keyword">Begin</span></>, level: 0 },

  {
    line: 3,
    text: (
      <>
        <span className="keyword">If</span> left &lt; right <span className="keyword">Then</span>
      </>
    ),
    level: 1,
  },

  { line: 4, text: <>mid ← (left + right) div 2</>, level: 2 },

  {
    line: 5,
    text: (
      <>
        <span className="function">MergeSort</span>(A, left, mid)
      </>
    ),
    level: 2,
  },

  {
    line: 6,
    text: (
      <>
        <span className="function">MergeSort</span>(A, mid + 1, right)
      </>
    ),
    level: 2,
  },

  {
    line: 7,
    text: (
      <>
        <span className="function">Merge</span>(A, left, mid, right)
      </>
    ),
    level: 2,
  },

  { line: 8, text: <><span className="keyword">End if</span></>, level: 1 },
  { line: 9, text: <><span className="keyword">End</span></>, level: 0 },
];
const CodeBlock = ({ title, code }) => (
  <section className="fade-in-up">
    <h3 className="section-header">💻 {title}</h3>

    <div className="pseudo-code-box">
      {code.map((line) => (
        <div key={line.line} className="code-line">
          <span className="line-num">{line.line}</span>

          <span
            className="code-text"
            style={{ paddingLeft: `${line.level * 20}px` }}
          >
            {line.text}
          </span>
        </div>
      ))}
    </div>
  </section>
);
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
        <CodeBlock title="Pseudo Code : Merge" code={mergeCode} />
        <CodeBlock title="Pseudo Code : Merge Sort" code={mergeSortCode} />


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
    <h2 className="math-big">O(n) = n log₂ n</h2>
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