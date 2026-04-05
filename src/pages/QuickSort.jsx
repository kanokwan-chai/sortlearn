import React from "react";
import MainLayout from "../layouts/MainLayout";
import "../styles/lesson-detail.css";
import bg2 from "../assets/bg-pattern.png";

export default function QuickSort() {
  const quickSortHoareCode = [
    {
      line: 1,
      text: (
        <>
          <span className="keyword">Algorithm</span> QuickSort(A, low, high)
        </>
      ),
      level: 0,
    },
    { line: 2, text: <><span className="keyword">Begin</span></>, level: 0 },

    {
      line: 3,
      text: (
        <>
          <span className="keyword">If</span> low &lt; high <span className="keyword">Then</span>
        </>
      ),
      level: 1,
    },

    {
      line: 4,
      text: (
        <>
          p ← <span className="function">Partition</span>(A, low, high)
        </>
      ),
      level: 2,
    },

    {
      line: 5,
      text: (
        <>
          <span className="function">QuickSort</span>(A, low, p)
        </>
      ),
      level: 2,
    },

    {
      line: 6,
      text: (
        <>
          <span className="function">QuickSort</span>(A, p + 1, high)
        </>
      ),
      level: 2,
    },

    { line: 7, text: <><span className="keyword">End if</span></>, level: 1 },
    { line: 8, text: <><span className="keyword">End</span></>, level: 0 },
  ];
  const partitionHoareCode = [
    {
      line: 1,
      text: (
        <>
          <span className="keyword">Algorithm</span> Partition(A, low, high)
        </>
      ),
      level: 0,
    },
    { line: 2, text: <><span className="keyword">Begin</span></>, level: 0 },

    { line: 3, text: <>pivot ← A[low]</>, level: 1 },
    { line: 4, text: <>i ← low - 1</>, level: 1 },
    { line: 5, text: <>j ← high + 1</>, level: 1 },

    {
      line: 6,
      text: (
        <>
          <span className="keyword">While</span> True <span className="keyword">do</span>
        </>
      ),
      level: 1,
    },

    {
      line: 7,
      text: (
        <>
          <span className="keyword">Repeat</span>
        </>
      ),
      level: 2,
    },
    { line: 8, text: <>i ← i + 1</>, level: 3 },
    {
      line: 9,
      text: (
        <>
          <span className="keyword">Until</span> A[i] ≥ pivot
        </>
      ),
      level: 2,
    },

    {
      line: 10,
      text: (
        <>
          <span className="keyword">Repeat</span>
        </>
      ),
      level: 2,
    },
    { line: 11, text: <>j ← j - 1</>, level: 3 },
    {
      line: 12,
      text: (
        <>
          <span className="keyword">Until</span> A[j] ≤ pivot
        </>
      ),
      level: 2,
    },

    {
      line: 13,
      text: (
        <>
          <span className="keyword">If</span> i ≥ j <span className="keyword">Then</span>
        </>
      ),
      level: 2,
    },
    { line: 14, text: <><span className="keyword">return</span> j</>, level: 3 },
    { line: 15, text: <><span className="keyword">End if</span></>, level: 2 },

    {
      line: 16,
      text: (
        <>
          <span className="keyword">swap</span> A[i], A[j]
        </>
      ),
      level: 2,
    },

    { line: 17, text: <><span className="keyword">End while</span></>, level: 1 },
    { line: 18, text: <><span className="keyword">End</span></>, level: 0 },
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
        <CodeBlock title="Pseudo Code : QuickSort " code={quickSortHoareCode} />
        <CodeBlock title="Pseudo Code : Partition " code={partitionHoareCode} />

        {/* ================= ตัวอย่าง ================= */}
        <section className="fade-in-up">
          <h3 className="section-header">🧮 ตัวอย่างการจัดเรียง (Quick Sort)</h3>

          <div className="concept-card">
            <p><strong>Input:</strong> [7, 2, 13, 9, 1, 10]</p>
            <p>Pivot = 10</p>

            <pre style={{ textAlign: "center" }}>
              {`
        Index :   0   1   2   3   4   5
        Array :  [7,  2, 13,  9,  1, 10]

        L = 0
        R = 4
        `}
            </pre>

            <p>1️⃣ เริ่มเปรียบเทียบ</p>

            <p>
              <strong>L (Left Pointer)</strong> : หา <strong>ค่าที่มากกว่า Pivot</strong> จากด้านซ้าย
              <br />
              <strong>R (Right Pointer)</strong> : หา <strong>ค่าที่น้อยกว่า Pivot</strong> จากด้านขวา
            </p>

            <div style={{ display: "flex", justifyContent: "center" }}>
              <pre className="array-demo">
                {`
        Index :  0   1   2   3   4   5
        Array : [7,  2, 13,  9,  1, 10]
                ↑L              ↑R
        `}
              </pre>
            </div>

            <p>2️⃣ L หาค่าที่มากกว่า Pivot</p>

            <p>
              L เลื่อนจากซ้ายไปขวา
              <br />
              7 &lt; 10 ✔ ผ่าน
              <br />
              2 &lt; 10 ✔ ผ่าน
              <br />
              13 &gt; 10 ❗ หยุด
            </p>

            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "20px" }}>
              <pre className="array-demo">
                {`
        Index :  0   1   2   3   4   5
        Array : [7,  2, 13,  9,  1, 10]
                    ↑L          ↑R
        `}
              </pre>
              <pre className="array-demo">
                {`
        Index :  0   1   2   3   4   5
        Array : [7,  2, 13,  9,  1, 10]
                        ↑L       ↑R
        `}
              </pre>
            </div>

            <p>
              ตอนนี้ L พบค่า <strong>13</strong> ซึ่งมากกว่า Pivot
            </p>


            <p>3️⃣ R หาค่าที่น้อยกว่า Pivot</p>

            <p>
              R เลื่อนจากขวาไปซ้าย
              <br />
              1 &lt; 10 ❗ หยุด
            </p>

            <div style={{ display: "flex", justifyContent: "center" }}>
              <pre className="array-demo">
                {`
        Index :  0   1   2   3   4   5
        Array : [7,  2, 13,  9,  1, 10]
                        ↑L       ↑R
        `}
              </pre>
            </div>

            <p>
              ตอนนี้ R พบค่า <strong>1</strong> ซึ่งน้อยกว่า Pivot
            </p>


            <p>4️⃣ สลับค่า</p>

            <p>
              เนื่องจาก
              <br />
              L &gt; Pivot และ R &lt; Pivot
              <br />
              จึงสลับค่า <strong>13</strong> กับ <strong>1</strong>
            </p>

            <div style={{ display: "flex", justifyContent: "center" }}>
              <pre className="array-demo">
                {`
        Array : [7,  2,  1,  9, 13, 10]
        `}
              </pre>
            </div>


            <p>5️⃣ เลื่อน Pointer ต่อ</p>

            <p>
              L เดินต่อ
              <br />
              9 &lt; 10 ✔ ผ่าน
            </p>

            <div style={{ display: "flex", justifyContent: "center" }}>
              <pre className="array-demo">
                {`
        Array : [7,  2,  1,  9, 13, 10]
                            ↑R↑L
        `}
              </pre>
            </div>

            <p>
              ตอนนี้ <strong>L &gt; R</strong>
              จึงหยุด Partition
            </p>


            <p>6️⃣ วาง Pivot ในตำแหน่งที่ถูกต้อง</p>

            <p>
              สลับ Pivot (10) กับตำแหน่ง L
            </p>

            <div style={{ display: "flex", justifyContent: "center" }}>
              <pre className="array-demo">
                {`
        Array : [7,  2,  1,  9, 10, 13]
        `}
              </pre>
            </div>


            <p>7️⃣ แบ่งอาร์เรย์</p>

            <div style={{ display: "flex", justifyContent: "center" }}>
              <pre className="array-demo">
                {`
        [7, 2, 1, 9] | 10 | [13]
        `}
              </pre>
            </div>

            <p>
              ค่าด้านซ้ายทั้งหมด &lt; Pivot
              ค่าด้านขวาทั้งหมด &gt; Pivot
            </p>


            <p>8️⃣ ทำ Quick Sort กับฝั่งซ้าย</p>

            <div style={{ display: "flex", justifyContent: "center" }}>
              <pre className="array-demo">
                {`
        Sort [7, 2, 1, 9]

        → [1, 2, 7, 9]
        `}
              </pre>
            </div>


            <p>
              <strong>Output :</strong> [1, 2, 7, 9, 10, 13]
            </p>

          </div>
        </section>

        {/* ================= TIME COMPLEXITY ================= */}
        <section className="fade-in-up">
          <h3 className="section-header">📊 การวิเคราะห์ประสิทธิภาพเชิงเวลา</h3>

          <div className="formula-card">
            <p>
              ประสิทธิภาพของ Quick Sort ขึ้นอยู่กับการเลือก Pivot และการแบ่งข้อมูลในแต่ละครั้ง
            </p>
            <h2 className="math-big">O(n) = n log n (Average)</h2>
            <p>
              ในกรณีที่แบ่งข้อมูลได้สมดุล จะมีประสิทธิภาพใกล้เคียง <strong className="highlight-o">O(n log n)</strong>
            </p>
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
                  <td>Pivot สามารถแบ่งข้อมูลออกเป็นสองส่วนที่มีขนาดใกล้เคียงกัน</td>
                </tr>

                <tr>
                  <td>กรณีโดยเฉลี่ย (Average Case)</td>
                  <td>O(n log n)</td>
                  <td>ข้อมูลมีลักษณะสุ่ม ทำให้การแบ่งข้อมูลค่อนข้างสมดุล</td>
                </tr>

                <tr>
                  <td>กรณีที่เลวร้ายที่สุด (Worst Case)</td>
                  <td>O(n²)</td>
                  <td>Pivot แบ่งข้อมูลไม่สมดุล เช่น เลือกค่าที่มากที่สุดหรือเล็กที่สุดเสมอ</td>
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
                <li><strong>ทำงานได้รวดเร็วมาก:</strong> เป็นหนึ่งในอัลกอริทึมที่เร็วที่สุดในทางปฏิบัติ</li>
                <li><strong>Average Case ดี:</strong> มีประสิทธิภาพ O(n log n)</li>
                <li><strong>In-place Sorting:</strong> ใช้หน่วยความจำเพิ่มเติมน้อย</li>
                <li><strong>เหมาะกับข้อมูลจำนวนมาก:</strong> ใช้งานได้ดีในระบบจริง</li>
              </ul>
            </div>


            <div className="pc-card cons">
              <div className="pc-header">
                <h3>❌ ข้อเสีย</h3>
              </div>

              <ul className="pc-clean-list">
                <li><strong>Worst Case เป็น O(n²):</strong> ถ้าเลือก Pivot ไม่ดี</li>
                <li><strong>ขึ้นอยู่กับการเลือก Pivot:</strong> Pivot ที่ไม่เหมาะสมทำให้ประสิทธิภาพลดลง</li>
                <li><strong>ไม่เป็น Stable Sort:</strong> ลำดับของข้อมูลที่เท่ากันอาจเปลี่ยนได้</li>
                <li><strong>ใช้ Recursion:</strong> ต้องใช้ Stack Memory เพิ่มเติม</li>
              </ul>
            </div>

          </div>
        </section>


        {/* ================= VIDEO ================= */}
        <div className="lesson-detail-video fade-in-up">
          <h3>🎬 พร้อมดูการทำงานของ Quick Sort หรือยัง?</h3>

          <p style={{ marginBottom: '30px', opacity: 0.9 }}>
            รับชมแอนิเมชันการเลือก Pivot การแบ่งข้อมูล (Partition) และการเรียงลำดับแบบ Recursive ทีละขั้นตอน
          </p>

          <a href="/sortlearn/video/quick-sort" className="video-btn-styled">
            เข้าสู่บทเรียนวิดีโอ ▶
          </a>
        </div>

      </div>
    </MainLayout>
  );
}