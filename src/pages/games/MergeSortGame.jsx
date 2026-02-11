import React, { useState } from 'react';
import "../../styles/merge-game.css"; 

const CHARACTERS = [
  {
    id: 'titan',
    name: 'อัศวินเกราะหนัก',
    role: 'Tank / Warrior',
    desc: 'พลังป้องกันสูง! ทนความผิดพลาดได้เยอะ (HP x5)',
    icon: '🛡️'
  },
  {
    id: 'weaver',
    name: 'นักเวทย์มนตรา',
    role: 'Mage / Support',
    desc: 'ร่ายเวทย์เรียงไพ่ให้อัตโนมัติ (Skill: Auto-Sort)',
    icon: '🔮'
  },
  {
    id: 'scanner',
    name: 'นายพรานตาเหยี่ยว',
    role: 'Ranger / Scout',
    desc: 'สายตาเฉียบคม! ชี้เป้าตัวที่ถูกต้องเสมอ (Skill: Highlight)',
    icon: '🏹'
  }
];

const INITIAL_LEFT = [3, 8, 12];
const INITIAL_RIGHT = [1, 6, 9];

const MergeSortGame = () => {
  const [selectedChar, setSelectedChar] = useState(null);
  const [gameState, setGameState] = useState('SELECT'); 
  
  const [leftArr, setLeftArr] = useState([]);
  const [rightArr, setRightArr] = useState([]);
  const [sortedArr, setSortedArr] = useState([]);
  const [hp, setHp] = useState(3);
  const [message, setMessage] = useState("ภารกิจ: เลือกกองทหารที่มีค่าพลัง 'น้อยกว่า' เพื่อจัดทัพ!");

  const startGame = (char) => {
    setSelectedChar(char);
    setLeftArr([...INITIAL_LEFT]);
    setRightArr([...INITIAL_RIGHT]);
    setSortedArr([]);
    setHp(char.id === 'titan' ? 5 : 3);
    setGameState('PLAY');
    setMessage("สงครามเริ่มแล้ว! เปรียบเทียบค่าพลังของหัวหน้ากองทัพทั้งสองฝั่ง");
  };

  const handleNumberClick = (value, sourceSide) => {
    const leftHead = leftArr.length > 0 ? leftArr[0] : Infinity;
    const rightHead = rightArr.length > 0 ? rightArr[0] : Infinity;
    const correctValue = Math.min(leftHead, rightHead);

    if (value === correctValue) {
      setSortedArr([...sortedArr, value]);
      if (sourceSide === 'left') {
        setLeftArr(leftArr.slice(1));
      } else {
        setRightArr(rightArr.slice(1));
      }
      setMessage("เยี่ยมมาก! จัดทัพได้ถูกต้อง");
      
      if (leftArr.length + rightArr.length === 1) {
         setGameState('WIN');
         setMessage("ชัยชนะ! กองทัพถูกจัดระเบียบสมบูรณ์แล้ว 🎉");
      }

    } else {
      setHp(prev => prev - 1);
      setMessage("พลาดแล้ว! ต้องเลือกกองที่มีพลังน้อยกว่า");
      if (hp <= 1) setGameState('LOSE');
    }
  };

  const useWeaverSkill = () => {
    if (leftArr.length === 0 && rightArr.length === 0) return;
    const leftHead = leftArr.length > 0 ? leftArr[0] : Infinity;
    const rightHead = rightArr.length > 0 ? rightArr[0] : Infinity;
    
    if (leftHead < rightHead) {
      handleNumberClick(leftHead, 'left');
    } else {
      handleNumberClick(rightHead, 'right');
    }
  };

  const renderBlock = (num, side, index) => {
    const isScanner = selectedChar?.id === 'scanner';
    const isHead = index === 0;
    const highlightClass = (isScanner && isHead) ? 'scanner-highlight' : '';

    return (
      <button 
        key={`${side}-${num}`}
        className={`number-block ${side} ${highlightClass}`}
        onClick={() => handleNumberClick(num, side)}
        disabled={!isHead}
      >
        {num}
        {isScanner && isHead && <div className="pointer-arrow">▼</div>}
      </button>
    );
  };

  return (
    <div className="merge-game-theme">
      {gameState === 'SELECT' ? (
        <div className="game-container">
          <h1>Kingdom Merge Defense</h1>
          <h2>เลือกฮีโร่ของคุณเพื่อบัญชาการ</h2>
          <div className="char-select">
            {CHARACTERS.map(char => (
              <div key={char.id} className="char-card" onClick={() => startGame(char)}>
                <div className="icon">{char.icon}</div>
                <h3>{char.name}</h3>
                <p>{char.role}</p>
                <small>{char.desc}</small>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="game-container play-mode">
          <div className="hud">
            <div className="char-info">
              <span>{selectedChar.icon} {selectedChar.name}</span>
              <span style={{marginLeft: '15px', color: '#ff4757'}}>❤️ x {hp}</span>
            </div>
            {selectedChar.id === 'weaver' && (
              <button className="skill-btn" onClick={useWeaverSkill}>
                ร่ายเวทย์ช่วยเรียง ✨
              </button>
            )}
          </div>

          <div className={`message-box`}>
            {message}
          </div>

          <div className="arena">
            <div className="group-container">
              <h3>กองทัพซ้าย (Left)</h3>
              <div className="array-visual">
                {leftArr.map((n, i) => renderBlock(n, 'left', i))}
              </div>
            </div>

            <div className="vs-badge">VS</div>

            <div className="group-container">
              <h3>กองทัพขวา (Right)</h3>
              <div className="array-visual">
                {rightArr.map((n, i) => renderBlock(n, 'right', i))}
              </div>
            </div>
          </div>

          <div className="sorted-container">
            <h3>ทัพหลวง (Sorted Result)</h3>
            <div className="array-visual sorted-visual">
              {sortedArr.map((n, i) => (
                <div key={i} className="number-block sorted">{n}</div>
              ))}
              {gameState === 'WIN' && <div style={{width:'100%', color: '#2ecc71', fontWeight: 'bold', fontSize: '1.5rem', marginTop: '10px'}}>VICTORY!</div>}
              {gameState === 'LOSE' && <div style={{width:'100%', color: '#ff4757', fontWeight: 'bold', fontSize: '1.5rem', marginTop: '10px'}}>DEFEAT!</div>}
            </div>
          </div>

          <button className="reset-btn" onClick={() => setGameState('SELECT')}>ถอยทัพ / เริ่มใหม่</button>
        </div>
      )}
    </div>
  );
};

export default MergeSortGame;