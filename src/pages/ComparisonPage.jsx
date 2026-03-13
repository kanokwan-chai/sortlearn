import React, { useState, useEffect } from "react";
import MainLayout from "../layouts/MainLayout";
import "../styles/comparison.css"; 
import bg2 from "../assets/bg2.png";

// ฟังก์ชันหน่วงเวลาสำหรับการแสดงผล Animation
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export default function ComparisonPage() {
  const [algo1, setAlgo1] = useState("bubble");
  const [algo2, setAlgo2] = useState("heap"); // ตั้ง Default เป็น Heap ให้เลยครับ
  const [array1, setArray1] = useState([]);
  const [array2, setArray2] = useState([]);
  const [isSorting, setIsSorting] = useState(false);
  const [stats1, setStats1] = useState({ compare: 0, swap: 0 });
  const [stats2, setStats2] = useState({ compare: 0, swap: 0 });
  const [winner, setWinner] = useState(null);

  const algos = {
    bubble: { name: "Bubble Sort", complexity: "O(n²)", desc: "ช้ากว่าเพราะต้องวนตรวจทีละคู่ซ้ำๆ หลายรอบ" },
    selection: { name: "Selection Sort", complexity: "O(n²)", desc: "ช้าเพราะต้องหาค่าที่น้อยที่สุดใหม่ทุกรอบจนครบ" },
    insertion: { name: "Insertion Sort", complexity: "O(n²)", desc: "เร็วกับข้อมูลที่เกือบเรียงแล้ว แต่ช้าถ้าข้อมูลสลับกันมาก" },
    merge: { name: "Merge Sort", complexity: "O(n log n)", desc: "เร็วมากเพราะใช้หลักการ 'Divide and Conquer' แบ่งข้อมูลแล้วเอามารวมกัน" },
    quick: { name: "Quick Sort", complexity: "O(n log n)", desc: "เร็วที่สุดในเคสทั่วไป โดยใช้ Pivot เป็นจุดศูนย์กลางในการแบ่งกลุ่ม" },
    heap: { name: "Heap Sort", complexity: "O(n log n)", desc: "เสถียรและประหยัดหน่วยความจำ โดยจัดโครงสร้างแบบ Binary Heap (Complete Binary Tree)" }
  };

  const generateArrays = () => {
    const newArray = Array.from({ length: 25 }, () => Math.floor(Math.random() * 85) + 10);
    setArray1([...newArray]);
    setArray2([...newArray]);
    setStats1({ compare: 0, swap: 0 });
    setStats2({ compare: 0, swap: 0 });
    setWinner(null);
  };

  useEffect(() => { generateArrays(); }, []);

  // --- Sorting Logic Factory ---
  const runSort = async (id, side) => {
    let arr = side === 1 ? [...array1] : [...array2];
    let setArr = side === 1 ? setArray1 : setArray2;
    let setStats = side === 1 ? setStats1 : setStats2;
    let comp = 0, swp = 0;

    const update = async (newArr) => {
      setArr([...newArr]);
      await sleep(40);
    };

    const record = (c, s) => {
      if (c) comp += c;
      if (s) swp += s;
      setStats({ compare: comp, swap: swp });
    };

    // 1. Bubble Sort
    if (id === "bubble") {
      for (let i = 0; i < arr.length; i++) {
        for (let j = 0; j < arr.length - i - 1; j++) {
          record(1, 0);
          if (arr[j] > arr[j + 1]) {
            [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
            record(0, 1);
            await update(arr);
          }
        }
      }
    } 
    // 2. Selection Sort
    else if (id === "selection") {
      for (let i = 0; i < arr.length; i++) {
        let min = i;
        for (let j = i + 1; j < arr.length; j++) {
          record(1, 0);
          if (arr[j] < arr[min]) min = j;
        }
        if (min !== i) {
          [arr[i], arr[min]] = [arr[min], arr[i]];
          record(0, 1);
          await update(arr);
        }
      }
    }
    // 3. Insertion Sort
    else if (id === "insertion") {
        for (let i = 1; i < arr.length; i++) {
          let key = arr[i]; let j = i - 1;
          while (j >= 0 && arr[j] > key) {
            record(1, 1);
            arr[j + 1] = arr[j];
            j = j - 1;
            await update(arr);
          }
          arr[j + 1] = key;
          await update(arr);
        }
    }
    // 4. Heap Sort ✨
    else if (id === "heap") {
      const heapify = async (n, i) => {
        let largest = i; let l = 2 * i + 1; let r = 2 * i + 2;
        record(1, 0);
        if (l < n && arr[l] > arr[largest]) largest = l;
        record(1, 0);
        if (r < n && arr[r] > arr[largest]) largest = r;
        if (largest !== i) {
          [arr[i], arr[largest]] = [arr[largest], arr[i]];
          record(0, 1);
          await update(arr);
          await heapify(n, largest);
        }
      };
      for (let i = Math.floor(arr.length / 2) - 1; i >= 0; i--) await heapify(arr.length, i);
      for (let i = arr.length - 1; i > 0; i--) {
        [arr[0], arr[i]] = [arr[i], arr[0]];
        record(0, 1);
        await update(arr);
        await heapify(i, 0);
      }
    }
    // 5. Quick Sort
    else if (id === "quick") {
      const qSort = async (l, h) => {
        if (l < h) {
          let pivot = arr[h]; let i = l - 1;
          for (let j = l; j < h; j++) {
            record(1, 0);
            if (arr[j] < pivot) {
              i++; [arr[i], arr[j]] = [arr[j], arr[i]];
              record(0, 1); await update(arr);
            }
          }
          [arr[i + 1], arr[h]] = [arr[h], arr[i + 1]];
          record(0, 1); await update(arr);
          let p = i + 1;
          await qSort(l, p - 1);
          await qSort(p + 1, h);
        }
      };
      await qSort(0, arr.length - 1);
    }
    // 6. Merge Sort
    else if (id === "merge") {
      const mSort = async (l, r) => {
        if (l >= r) return;
        let m = Math.floor((l + r) / 2);
        await mSort(l, m); await mSort(m + 1, r);
        let n1 = m - l + 1; let n2 = r - m;
        let L = arr.slice(l, m + 1); let R = arr.slice(m + 1, r + 1);
        let i = 0, j = 0, k = l;
        while (i < n1 && j < n2) {
          record(1, 0);
          if (L[i] <= R[j]) { arr[k] = L[i]; i++; }
          else { arr[k] = R[j]; j++; record(0, 1); }
          k++; await update(arr);
        }
        while (i < n1) { arr[k] = L[i]; i++; k++; await update(arr); }
        while (j < n2) { arr[k] = R[j]; j++; k++; await update(arr); }
      };
      await mSort(0, arr.length - 1);
    }

    return "done";
  };

  const startBattle = async () => {
    setIsSorting(true);
    setWinner(null);

    const p1 = runSort(algo1, 1);
    const p2 = runSort(algo2, 2);

    const first = await Promise.race([
      p1.then(() => 1),
      p2.then(() => 2)
    ]);

    setWinner(first);
    await Promise.all([p1, p2]);
    setIsSorting(false);
  };

  return (
    <MainLayout>
      <div className="battle-page-wrapper"> {/* สร้าง Wrapper ใหม่ที่ไม่มี Padding */}
        
        <div className="lesson-hero-v2" style={{ backgroundImage: `url(${bg2})` }}>
          <h2 className="lesson-hero-sub">ห้องแล็บอัลกอริทึม</h2>
          <h1 className="lesson-hero-title">Algorithm Lab</h1>
        </div>

        {/* --- ส่วนควบคุม --- */}
        <div className="battle-controls glass">
          <div className="select-row">
            <div className="select-box">
              <label>เลือก Algorithm A</label>
              <select value={algo1} onChange={(e) => setAlgo1(e.target.value)} disabled={isSorting}>
                {Object.keys(algos).map(k => <option key={k} value={k}>{algos[k].name}</option>)}
              </select>
            </div>
            <span className="vs">VS</span>
            <div className="select-box">
              <label>เลือก Algorithm B</label>
              <select value={algo2} onChange={(e) => setAlgo2(e.target.value)} disabled={isSorting}>
                {Object.keys(algos).map(k => <option key={k} value={k}>{algos[k].name}</option>)}
              </select>
            </div>
          </div>
          <div className="btn-group">
            <button className="btn-reset" onClick={generateArrays} disabled={isSorting}>สุ่มข้อมูลใหม่</button>
            <button className="btn-start" onClick={startBattle} disabled={isSorting}>
              {isSorting ? "กำลังประชัน..." : "เริ่มประชันความเร็ว! 🚀"}
            </button>
          </div>
        </div>

        {/* --- สนามประชัน --- */}
        <div className="battle-field">
          {[
            { id: 1, name: algos[algo1].name, array: array1, stats: stats1, comp: algos[algo1].complexity, color: '#3b82f6' },
            { id: 2, name: algos[algo2].name, array: array2, stats: stats2, comp: algos[algo2].complexity, color: '#10b981' }
          ].map(side => (
            <div key={side.id} className={`battle-card ${winner === side.id ? 'is-winner' : ''}`}>
              <div className="card-top">
                <h3>{side.name} <span className="comp-badge">{side.comp}</span></h3>
                {winner === side.id && <span className="winner-tag">WINNER! 🎉</span>}
              </div>
              <div className="card-stats">
                <div className="stat"><span>Comparison</span><strong>{side.stats.compare}</strong></div>
                <div className="stat"><span>Swap/Move</span><strong>{side.stats.swap}</strong></div>
              </div>
              <div className="visualizer">
                {side.array.map((val, i) => (
                  <div key={i} className="bar" style={{ height: `${val}%`, backgroundColor: side.color }}></div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* --- บทสรุปความรู้ (ฉบับกะทัดรัด) --- */}
        {winner && !isSorting && (
        <div className="verdict-card fade-in">
            <div className="verdict-icon">🏆</div>
            <div className="verdict-content">
            <h4>บทวิเคราะห์ประสิทธิภาพ</h4>
            <p>
                <strong>{winner === 1 ? algos[algo1].name : algos[algo2].name}</strong> เรียงข้อมูลเสร็จสิ้นก่อน 
                เนื่องจากมีประสิทธิภาพระดับ <span>{winner === 1 ? algos[algo1].complexity : algos[algo2].complexity}</span> 
                <br />
                <small>{winner === 1 ? algos[algo1].desc : algos[algo2].desc}</small>
            </p>
            </div>
        </div>
        )}

        <style>{`
          .battle-container { padding: 40px 5%; background: #f8fafc; min-height: 100vh; font-family: 'Inter', sans-serif; }
          .battle-header { text-align: center; margin-bottom: 30px; }
          .battle-header h1 { color: #1e3a8a; font-size: 2.2rem; font-weight: 800; }
          .battle-controls { background: white; padding: 30px; border-radius: 20px; border: 1px solid #e2e8f0; margin-bottom: 30px; box-shadow: 0 4px 12px rgba(0,0,0,0.05); }
          .select-row { display: flex; align-items: center; justify-content: center; gap: 30px; margin-bottom: 25px; }
          .select-box { display: flex; flex-direction: column; gap: 8px; text-align: left; }
          .select-box label { font-size: 0.85rem; color: #64748b; font-weight: bold; }
          select { padding: 10px 15px; border-radius: 10px; border: 2px solid #f1f5f9; font-size: 1rem; color: #1e3a8a; font-weight: 600; min-width: 200px; }
          .vs { font-weight: 900; color: #cbd5e1; font-size: 1.5rem; margin-top: 20px; }
          .btn-start { background: #1e3a8a; color: white; border: none; padding: 14px 40px; border-radius: 50px; font-weight: bold; cursor: pointer; transition: 0.3s; }
          .btn-reset { background: white; color: #64748b; border: 2px solid #e2e8f0; padding: 12px 30px; border-radius: 50px; margin-right: 15px; cursor: pointer; }
          .btn-start:hover { background: #2563eb; transform: translateY(-2px); }
          
          .battle-field { display: grid; grid-template-columns: 1fr 1fr; gap: 25px; }
          .battle-card { background: white; padding: 25px; border-radius: 20px; border: 2px solid #f1f5f9; transition: 0.4s; }
          .battle-card.is-winner { border-color: #fbbf24; background: #fffdf2; transform: scale(1.02); }
          .card-top { display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px; }
          .comp-badge { font-size: 0.8rem; background: #f1f5f9; padding: 4px 10px; border-radius: 6px; color: #64748b; }
          .winner-tag { background: #fbbf24; color: #92400e; padding: 4px 12px; border-radius: 50px; font-weight: bold; font-size: 0.75rem; }
          .card-stats { display: flex; gap: 25px; margin-bottom: 20px; padding: 15px; background: #f8fafc; border-radius: 15px; }
          .stat span { font-size: 0.75rem; color: #94a3b8; text-transform: uppercase; display: block; }
          .stat strong { font-size: 1.4rem; color: #1e3a8a; font-family: monospace; }
          
          .visualizer { height: 220px; display: flex; align-items: flex-end; justify-content: center; gap: 4px; border-bottom: 2px solid #f1f5f9; }
          .bar { width: 100%; border-radius: 4px 4px 0 0; transition: height 0.1s ease; }
          
          .verdict-box { margin-top: 30px; background: #1e3a8a; color: white; padding: 30px; border-radius: 20px; text-align: center; }
          .verdict-box h3 { color: #fbbf24; margin-bottom: 10px; }
          .fade-in { animation: fadeIn 0.5s ease-in; }
          @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        `}</style>
      </div>
    </MainLayout>
  );
}