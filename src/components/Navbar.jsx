import React, { useState } from "react";
import { Link } from "react-router-dom";
import "../styles/navbar.css";

export default function Navbar({ user, onLogout }) {
  const [isOpen, setIsOpen] = useState(false);

  const algoMenu = [
    { label: "Selection Sort", key: "selection" },
    { label: "Insertion Sort", key: "insertion" },
    { label: "Bubble Sort", key: "bubble" },
    { label: "Heap Sort", key: "heap" },
    { label: "Quick Sort", key: "quick" },
    { label: "Merge Sort", key: "merge" },
  ];

  const toggleMenu = () => setIsOpen(!isOpen);

  return (
    <nav className="nav">
      {/* 1. LOGO */}
      <div className="nav-left">
        <Link to="/home" style={{ textDecoration: 'none' }}>
          <span className="nav-logo">SortLearn Online</span>
        </Link>
      </div>

      {/* 2. HAMBURGER BUTTON (Mobile) */}
      <div className={`hamburger ${isOpen ? "active" : ""}`} onClick={toggleMenu}>
        <span className="bar"></span>
        <span className="bar"></span>
        <span className="bar"></span>
      </div>

      {/* 3. MENU LIST */}
      <ul className={`nav-menu ${isOpen ? "open" : ""}`}>
        <li><Link to="/home" onClick={toggleMenu}>หน้าหลัก</Link></li>

        <li className="nav-item-dropdown">
          <Link to="/pretest" className="dropdown-trigger">แบบทดสอบก่อนเรียน <small>▼</small></Link>
          <ul className="dropdown-list">
            {algoMenu.map((item) => (
              <li key={item.key}><Link to={`/pretest/${item.key}`} onClick={toggleMenu}>{item.label}</Link></li>
            ))}
          </ul>
        </li>

        <li className="nav-item-dropdown">
          <Link to="/lessons" className="dropdown-trigger">เนื้อหาการเรียนรู้ <small>▼</small></Link>
          <ul className="dropdown-list">
            {algoMenu.map((item) => (
              <li key={item.key}><Link to={`/${item.key}-sort`} onClick={toggleMenu}>{item.label}</Link></li>
            ))}
          </ul>
        </li>

        <li>
          <Link to="/comparison" onClick={toggleMenu} className="nav-lab-btn">
            ห้องแล็บอัลกอริทึม
          </Link>
        </li>

        <li className="nav-item-dropdown">
          <Link to="/videos" className="dropdown-trigger">วิดีโอการเรียนรู้ <small>▼</small></Link>
          <ul className="dropdown-list">
            {algoMenu.map((item) => (
              <li key={item.key}><Link to={`/video/${item.key}-sort`} onClick={toggleMenu}>{item.label}</Link></li>
            ))}
          </ul>
        </li>

        <li className="nav-item-dropdown">
          <Link to="/games" className="dropdown-trigger">เกม <small>▼</small></Link>
          <ul className="dropdown-list">
            {algoMenu.map((item) => (
              <li key={item.key}><Link to={`/games/${item.key}-sort`} onClick={toggleMenu}>{item.label}</Link></li>
            ))}
          </ul>
        </li>

        <li className="nav-item-dropdown">
          <Link to="/posttest" className="dropdown-trigger">แบบทดสอบหลังเรียน <small>▼</small></Link>
          <ul className="dropdown-list">
            {algoMenu.map((item) => (
              <li key={item.key}><Link to={`/posttest/${item.key}`} onClick={toggleMenu}>{item.label}</Link></li>
            ))}
          </ul>
        </li>

        {/* ส่วนข้อมูลผู้ใช้สำหรับมือถือ */}
        {user && (
          <li className="nav-user-mobile">
            <div className="mobile-info">
              <p style={{fontWeight: 'bold', color: '#0ea5e9'}}>👤 {user?.firstname}</p>
              {user?.email === "kanokwanmail2547@gmail.com" && (
                <Link to="/admin" onClick={toggleMenu} className="admin-shortcut-btn" style={{display:'block', textAlign:'center', margin:'10px 0'}}>
                  📊 Admin Dashboard
                </Link>
              )}
              <button onClick={onLogout} className="logout-btn-mob">logout</button>
            </div>
          </li>
        )}
      </ul>

      {/* 4. USER RIGHT (Desktop Only) */}
      <div className="nav-right desktop-only">
        {user?.email === "kanokwanmail2547@gmail.com" && (
          <Link to="/admin" className="admin-shortcut-btn">Admin</Link>
        )}
        <span className="nav-user">ผู้ใช้ : {user?.firstname}</span>
        <button className="logout-btn" onClick={onLogout}>logout</button>
      </div>
    </nav>
  );
}