import React from "react";
import { useNavigate } from "react-router-dom";

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="not-found-root">
      <style>{`
        .not-found-root {
          width: 100%;
          height: 100vh;
          /* ใช้ Gradient สีฟ้าพาสเทล และชมพูอ่อน นุ่มๆ ตามภาพตัวอย่าง */
          background: linear-gradient(135deg, #d4fcff 0%, #c3e8ff 50%, #f7d9e3 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          font-family: 'Kanit', sans-serif;
          color: #5d7aa8; /* สีน้ำเงินเทาพาสเทล อ่านง่ายบนพื้นหลังสว่าง */
          text-align: center;
          overflow: hidden;
          position: relative;
        }

        /* วงกลมแสงพาสเทลฟุ้งๆ */
        .bg-circle {
          position: absolute;
          border-radius: 50%;
          filter: blur(100px);
          opacity: 0.5;
          z-index: 0;
        }
        .c1 { top: -5%; left: -5%; width: 45vw; height: 45vw; background: #ffffff; }
        .c2 { bottom: -10%; right: -10%; width: 55vw; height: 55vw; background: #ffd6e7; }

        /* การ์ดกระจกสีขาว (White Glassmorphism) */
        .glass-card-404 {
          background: rgba(255, 255, 255, 0.45); /* เน้นสีขาวโปร่งแสง */
          backdrop-filter: blur(25px);
          -webkit-backdrop-filter: blur(25px);
          border: 3px solid rgba(255, 255, 255, 0.7);
          border-radius: 50px;
          padding: 60px 40px;
          box-shadow: 0 25px 60px rgba(166, 193, 238, 0.4);
          width: 90%;
          max-width: 600px;
          position: relative;
          z-index: 1;
          animation: popIn 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        }

        /* ตัวเลข 404 แบบไล่สีพาสเทล */
        .error-code-huge {
          font-size: 10rem;
          line-height: 1;
          margin: 0;
          font-weight: 900;
          background: linear-gradient(to bottom right, #89cff0, #ffb7c5);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          filter: drop-shadow(0 10px 15px rgba(166, 193, 238, 0.3));
        }

        .error-title {
          font-size: 2.2rem;
          margin: 20px 0 10px;
          font-weight: bold;
          color: #4a6fa5;
        }

        .error-desc {
          font-size: 1.2rem;
          opacity: 0.9;
          margin-bottom: 40px;
          color: #6b8cb8;
        }

        /* ปุ่มสีฟ้าพาสเทล */
        .btn-home-gradient {
          padding: 16px 50px;
          border-radius: 50px;
          border: none;
          background: linear-gradient(45deg, #89cff0, #a6c1ee);
          color: white;
          font-size: 1.3rem;
          font-weight: bold;
          cursor: pointer;
          transition: all 0.3s ease;
          box-shadow: 0 10px 25px rgba(166, 193, 238, 0.5);
        }

        .btn-home-gradient:hover {
          transform: translateY(-5px) scale(1.05);
          box-shadow: 0 15px 35px rgba(166, 193, 238, 0.7);
        }

        @keyframes popIn {
          from { opacity: 0; transform: scale(0.85); }
          to { opacity: 1; transform: scale(1); }
        }
      `}</style>

      {/* วงกลมแสงพื้นหลัง */}
      <div className="bg-circle c1"></div>
      <div className="bg-circle c2"></div>

      <div className="glass-card-404">
        <h1 className="error-code-huge">404</h1>
        <h2 className="error-title">Oops! Page Not Found</h2>
        <p className="error-desc">
          ขออภัย ไม่พบหน้าที่คุณต้องการ <br/>
          หน้าที่คุณพยายามเข้าถึงอาจกำลังพัฒนาหรือไม่มีอยู่จริง
        </p>
        <button className="btn-home-gradient" onClick={() => navigate("/home")}>
          กลับสู่หน้าหลัก (Home)
        </button>
      </div>
    </div>
  );
}