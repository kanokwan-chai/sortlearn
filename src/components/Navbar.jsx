import React from "react";
import { Link } from "react-router-dom";
import "../styles/navbar.css";

export default function Navbar({ user, onLogout }) {
  // รายการเมนูย่อย
  const algoMenu = [
    { label: "Selection Sort", key: "selection" },
    { label: "Insertion Sort", key: "insertion" },
    { label: "Bubble Sort", key: "bubble" },
    { label: "Heap Sort", key: "heap" },
    { label: "Quick Sort", key: "quick" },
    { label: "Merge Sort", key: "merge" },
  ];
 
  return (
    <nav className="nav">
      {/* 1. LOGO */}
      <div className="nav-left">
        <Link to="/home" style={{ textDecoration: 'none' }}>
          <span className="nav-logo">SortLearn Online</span>
        </Link>
      </div>

      {/* 2. MENU (ตรงกลาง) */}
      <ul className="nav-menu">
        <li><Link to="/home">หน้าหลัก</Link></li>

        {/* --- แบบทดสอบก่อนเรียน --- */}
        <li className="nav-item-dropdown">
          {/* ✅ คลิกได้: ไปหน้า /pretest (หน้ารวม) */}
          <Link to="/pretest" className="dropdown-trigger">
            แบบทดสอบก่อนเรียน <small>▼</small>
          </Link>
          {/* แช่แล้วเด้ง: เมนูย่อย */}
          <ul className="dropdown-list">
            {algoMenu.map((item) => (
              <li key={item.key}>
                <Link to={`/pretest/${item.key}`}>{item.label}</Link>
              </li>
            ))}
          </ul>
        </li>

        {/* --- เนื้อหาการเรียนรู้ --- */}
        <li className="nav-item-dropdown">
          {/* คลิกได้: ไปหน้า /lessons */}
          <Link to="/lessons" className="dropdown-trigger">
            เนื้อหาการเรียนรู้ <small>▼</small>
          </Link>
          <ul className="dropdown-list">
            {algoMenu.map((item) => (
              <li key={item.key}>
                <Link to={`/${item.key}-sort`}>{item.label}</Link>
              </li>
            ))}
          </ul>
        </li>

        {/* --- วิดีโอ --- */}
        <li className="nav-item-dropdown">
          {/* คลิกได้: ไปหน้า /videos (คุณต้องสร้างหน้านี้เพิ่ม ถ้าอยากให้มีหน้ารวมวิดีโอ) */}
          <Link to="/videos" className="dropdown-trigger"> {/* ตอนนี้ให้ไป lessons ก่อน */}
            วิดีโอการเรียนรู้ <small>▼</small>
          </Link>
          <ul className="dropdown-list">
            {algoMenu.map((item) => (
              <li key={item.key}>
                <Link to={`/video/${item.key}-sort`}>{item.label}</Link>
              </li>
            ))}
          </ul>
        </li>

        {/* --- เกม --- */}
        <li className="nav-item-dropdown">
          {/* คลิกได้: ไปหน้า /games */}
          <Link to="/games" className="dropdown-trigger">
            เกม <small>▼</small>
          </Link>
          <ul className="dropdown-list">
            {algoMenu.map((item) => (
              <li key={item.key}>
                <Link to={`/games/${item.key}-sort`}>{item.label}</Link>
              </li>
            ))}
          </ul>
        </li>

        {/* --- แบบทดสอบหลังเรียน --- */}
        <li className="nav-item-dropdown">
          {/* คลิกได้: ไปหน้า /posttest */}
          <Link to="/posttest" className="dropdown-trigger">
            แบบทดสอบหลังเรียน <small>▼</small>
          </Link>
          <ul className="dropdown-list">
            {algoMenu.map((item) => (
              <li key={item.key}>
                <Link to={`/posttest/${item.key}`}>{item.label}</Link>
              </li>
            ))}
          </ul>
        </li>
      </ul>

      {/* 3. USER (ขวาสุด) */}
      <div className="nav-right">
        <span className="nav-user">ผู้ใช้ : {user?.firstname || "-"}</span>
        <button className="logout-btn" onClick={onLogout}>logout</button>
      </div>
    </nav>
  );
}