import React from "react";
import MainLayout from "../layouts/MainLayout";
import "../styles/lesson-detail.css";
import bg2 from "../assets/bg-pattern.png";

export default function HeapSort() {

  const n = "n";
  // ================= DATA =================
  const heapifyCode = [
    {
      line: 1,
      text: (
        <>
          <span className="keyword">Algorithm</span> Heapify(A, n, i)
        </>
      ),
      level: 0,
    },
    { line: 2, text: <><span className="keyword">Begin</span></>, level: 0 },

    { line: 3, text: <>largest ← i</>, level: 1 },
    { line: 4, text: <>left ← 2*i + 1</>, level: 1 },
    { line: 5, text: <>right ← 2*i + 2</>, level: 1 },

    {
      line: 6,
      text: (
        <>
          <span className="keyword">If</span> left &lt; n <span className="keyword">and</span> A[left] &gt; A[largest] <span className="keyword">Then</span>
        </>
      ),
      level: 1,
    },
    { line: 7, text: <>largest ← left</>, level: 2 },
    { line: 8, text: <><span className="keyword">End if</span></>, level: 1 },

    {
      line: 9,
      text: (
        <>
          <span className="keyword">If</span> right &lt; n <span className="keyword">and</span> A[right] &gt; A[largest] <span className="keyword">Then</span>
        </>
      ),
      level: 1,
    },
    { line: 10, text: <>largest ← right</>, level: 2 },
    { line: 11, text: <><span className="keyword">End if</span></>, level: 1 },

    {
      line: 12,
      text: (
        <>
          <span className="keyword">If</span> largest ≠ i <span className="keyword">Then</span>
        </>
      ),
      level: 1,
    },
    {
      line: 13,
      text: (
        <>
          <span className="keyword">swap</span> A[i] and A[largest]
        </>
      ),
      level: 2,
    },
    { line: 14, text: <>Heapify(A, n, largest)</>, level: 2 },
    { line: 15, text: <><span className="keyword">End if</span></>, level: 1 },

    { line: 16, text: <><span className="keyword">End</span></>, level: 0 },
  ];

  const heapSortCode = [
    {
      line: 1,
      text: (
        <>
          <span className="keyword">Algorithm</span> Heap_Sort(A)
        </>
      ),
      level: 0,
    },
    { line: 2, text: <><span className="keyword">Begin</span></>, level: 0 },

    { line: 3, text: <>n ← length(A)</>, level: 1 },

    {
      line: 4,
      text: (
        <>
          <span className="keyword">For</span> i ← (n div 2) - 1 to 0 <span className="keyword">do</span>
        </>
      ),
      level: 1,
    },
    { line: 5, text: <>Heapify(A, n, i)</>, level: 2 },
    { line: 6, text: <><span className="keyword">End for</span></>, level: 1 },

    {
      line: 7,
      text: (
        <>
          <span className="keyword">For</span> i ← n - 1 to 1 <span className="keyword">do</span>
        </>
      ),
      level: 1,
    },
    {
      line: 8,
      text: (
        <>
          <span className="keyword">swap</span> A[0] and A[i]
        </>
      ),
      level: 2,
    },
    { line: 9, text: <>Heapify(A, i, 0)</>, level: 2 },
    { line: 10, text: <><span className="keyword">End for</span></>, level: 1 },

    { line: 11, text: <><span className="keyword">End</span></>, level: 0 },
  ];

  // ================= COMPONENT =================
  const CodeBlock = ({ title, code }) => (
    <section className="fade-in-up">
      <h3 className="section-header">💻 {title}</h3>

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
  );

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
            <p style={{ marginTop: "15px" }}>
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
          <h3 className="section-header">🧮 ตัวอย่างการจัดเรียง (Heap Sort)</h3>

          <div className="concept-card">

            <p><strong>ข้อมูลเริ่มต้น (Array):</strong> 20, 15, 9, 10, 12, 4, 2</p>

            <p style={{ marginTop: "15px" }}>
              1️⃣ แปลง Array ให้เป็น <strong>Max Heap</strong>
            </p>

            <pre style={{ textAlign: "center" }}>
              {`
                20
              /    \\
            15      9
          /  \\    / \\
        10   12   4   2
        `}
            </pre>

            <p>
              ✔ ค่าใหญ่สุดจะอยู่ที่ Root
            </p>

            <p style={{ marginTop: "15px" }}>
              2️⃣ เริ่ม Heap Sort (สลับ Root กับตัวท้าย)
            </p>

            <pre style={{ textAlign: "center" }}>
              {`
                2
              /    \\
            15      9
          /  \\    /
        10   12   4

        Sorted: [20]
        `}
            </pre>

            <p>
              🔧 จากนั้นต้องทำ <strong>Heapify</strong> เพื่อปรับ Heap ใหม่
            </p>

            <pre style={{ textAlign: "center" }}>
              {`
                15
              /    \\
            12      9
          /  \\    /
        10    2   4
        `}
            </pre>

            <p style={{ marginTop: "15px" }}>
              3️⃣ ทำซ้ำ (Swap + Heapify)
            </p>

            <pre style={{ textAlign: "center" }}>
              {`
                4
              /    \\
            12      9
          /  \\
        10    2

        Sorted: [15, 20]
        `}
            </pre>

            <pre style={{ textAlign: "center" }}>
              {`
                12
              /    \\
            10      9
          /
          4

        Sorted: [15, 20]
        `}
            </pre>

            <p style={{ marginTop: "10px" }}>
              🔁 ทำซ้ำขั้นตอนนี้จน Heap เหลือ 1 ค่า
              <br /><br />
              ✅ ผลลัพธ์สุดท้าย:
              <strong> 2, 4, 9, 10, 12, 15, 20</strong>
            </p>

          </div>
        </section>

        {/* 6. Pseudo Code */}
        <CodeBlock title="Pseudo Code : Heapify" code={heapifyCode} />
        <CodeBlock title="Pseudo Code : Heap Sort" code={heapSortCode} />

        {/* 7. ประสิทธิภาพเชิงเวลา */}
        <section className="fade-in-up">
          <h3 className="section-header">📊 การวิเคราะห์ประสิทธิภาพเชิงเวลา</h3>

          <div className="formula-card">
            <p>จำนวนขั้นตอนของ Heap Sort เกิดจากการสร้าง Heap และการ Heapify ซ้ำหลายครั้ง</p>
            <h2 className="math-big"> T(n) = n log n </h2>
            <p>ประสิทธิภาพเชิงเวลาสูงสุด: <strong className="highlight-o">O(n log n)</strong></p>
          </div>

          <div className="table-container" style={{ marginTop: '30px' }}>
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
                  <td>แม้ว่าข้อมูลจะเรียงอยู่แล้ว Heap Sort ยังคงต้องสร้าง Heap และทำ Heapify จนครบทุกโหนด</td>
                </tr>

                <tr>
                  <td>กรณีโดยเฉลี่ย (Average Case)</td>
                  <td>O(n log n)</td>
                  <td>ข้อมูลมีลักษณะสุ่ม ต้องมีการสร้าง Heap และปรับโครงสร้าง Heap หลายครั้ง</td>
                </tr>

                <tr>
                  <td>กรณีที่เลวร้ายที่สุด (Worst Case)</td>
                  <td>O(n log n)</td>
                  <td>ไม่ว่าข้อมูลจะเรียงแบบใด Heap Sort ยังคงมีจำนวนขั้นตอนเท่ากัน</td>
                </tr>

              </tbody>
            </table>
          </div>
        </section>


        {/* 8. ข้อดี และ ข้อเสีย */}
        <section className="fade-in-up">
          <h3 className="section-header">⚖️ วิเคราะห์ข้อดี และ ข้อเสีย</h3>

          <div className="pc-clean-grid">

            <div className="pc-card pros">
              <div className="pc-header">
                <h3>✅ ข้อดี</h3>
              </div>

              <ul className="pc-clean-list">
                <li><strong>Time Complexity คงที่:</strong> ทุกกรณีมีประสิทธิภาพ O(n log n)</li>
                <li><strong>เหมาะกับข้อมูลขนาดใหญ่:</strong> ทำงานได้ดีแม้ข้อมูลจำนวนมาก</li>
                <li><strong>In-place Sorting:</strong> ใช้หน่วยความจำเพิ่มเติมน้อย</li>
                <li><strong>ไม่ขึ้นกับรูปแบบข้อมูล:</strong> ไม่ว่าข้อมูลจะเรียงหรือสุ่ม ประสิทธิภาพยังคงเท่าเดิม</li>
              </ul>
            </div>


            <div className="pc-card cons">
              <div className="pc-header">
                <h3>❌ ข้อเสีย</h3>
              </div>

              <ul className="pc-clean-list">
                <li><strong>ขั้นตอนซับซ้อน:</strong> เข้าใจยากกว่าอัลกอริทึมพื้นฐาน เช่น Bubble Sort</li>
                <li><strong>ไม่เป็น Stable Sort:</strong> ลำดับของข้อมูลที่เท่ากันอาจเปลี่ยนได้</li>
                <li><strong>ไม่เหมาะกับข้อมูลขนาดเล็ก:</strong> สำหรับข้อมูลจำนวนน้อยอัลกอริทึมอื่นอาจเร็วกว่า</li>
              </ul>
            </div>

          </div>
        </section>


        {/* 9. Video CTA */}
        <div className="lesson-detail-video fade-in-up">
          <h3>🎬 พร้อมดูการทำงานของ Heap Sort หรือยัง?</h3>
          <p style={{ marginBottom: '30px', opacity: 0.9 }}>
            รับชมแอนิเมชันการสร้าง Max Heap และขั้นตอน Heapify เพื่อเข้าใจการทำงานของ Heap Sort อย่างชัดเจน
          </p>
          <a href="/sortlearn/video/heap-sort" className="video-btn-styled">
            เข้าสู่บทเรียนวิดีโอ ▶
          </a>
        </div>

      </div>
    </MainLayout>
  );
}