import './App.css';
import React, { useRef, useEffect } from 'react'; 

export function App() {
  const menuItemsRef = useRef(null); // Create a ref for the menuItems div

  const toggleMenu = () => {
    if (menuItemsRef.current) { // Check if the ref has a current value (element is rendered)
      menuItemsRef.current.classList.toggle('hidden');
    }
  };

  return (
    <div className="App">
      <header>
        <h1 id="title">Study Buddy</h1>
      </header>
      <div id="hamburger-menu" onClick={toggleMenu}>
        <div className="hamburger-line"></div>
        <div className="hamburger-line"></div>
        <div className="hamburger-line"></div>
      </div>
      <div id="menu-items" ref={menuItemsRef} className="hidden"> 
        <a href="#login"><span className="icon book-open"></span>Log In/Sign Up</a>
        <a href="#library"><span className="icon file-text"></span>Library</a>
        <a href="#studystats"><span className="icon brain"></span>Study Stats</a>
        <a href="#achievements"><span className="icon award"></span>Achievements</a>
      </div>
    </div>
    
  );
}


export function FileInputBox(){
  const fileInputRef = useRef(null);
 
  async function handleClick(){
    const file = fileInputRef.current.files[0];
    
    if (!file) {
      alert('Please select a PDF file first');
      return;
    }

    const formData = new FormData();
    formData.append('pdf', file);

    try {
      const response = await fetch('http://localhost:5000/api/upload-pdf', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();
      if (data.success) {
        console.log('PDF content:', data.data.text);
        // Here you would send this text to ChatGPT API to generate the quiz
      } else {
        console.error('Error:', data.error);
      }
    } catch (error) {
      console.error('Error uploading file:', error);
    }
  }

  const fileCountRef = useRef(null)
  const generateQuizBtnRef = useRef(null)
  function handleChange(event){
    const files = event.target.files; // Access files through event.target
        if (files.length > 0) {
            console.log("Enabling button"); // Debug log
            fileCountRef.current.textContent = `${files.length} file(s) selected`;
            fileCountRef.current.classList.remove('hidden');
            generateQuizBtnRef.current.disabled = false;
        } else {
            console.log("Disabling button"); // Debug log
            fileCountRef.current.classList.add('hidden');
            generateQuizBtnRef.current.disabled = true;
        }
  }

  return (
  <div id="main-box">
    <h2>Upload Notes</h2>
    <div className="file-upload">
        <label htmlFor="file-input" className="file-label">Select Files</label>
        <input type="file" id="file-input" ref ={fileInputRef} onChange={handleChange}></input>
    </div>
    <div id="file-count" className="hidden" ref={fileCountRef}></div>
    <button id="generate-quiz"  ref={generateQuizBtnRef} onClick={handleClick}>Auto Generate Quiz</button>
  </div>
  );
}

export function StudyTip(){

  const studyTips = [
    "Break your study sessions into 25-minute focused intervals.",
    "Teach the material to someone else to reinforce your understanding.",
    "Use mnemonic devices to remember complex information.",
    "Create mind maps to visualize connections between concepts.",
    "Take regular breaks to improve concentration and retention."
  ];
  const studyTipRef = useRef(null);
  const tipTextRef = useRef(null);

  useEffect(() => {
    showRandomTip(); // Show a random tip when the component mounts
  });

  function showRandomTip() {
    const randomTip = studyTips[Math.floor(Math.random() * studyTips.length)];
    if(studyTipRef.current && tipTextRef.current){
      tipTextRef.current.textContent = randomTip;
      studyTipRef.current.classList.remove('hidden');
    }
    
  } 

  function hideTip() {
    if (studyTipRef.current) {
      studyTipRef.current.classList.add('hidden');
    }
  }

  return (
    <div id="study-tip" ref = {studyTipRef} className="hidden">
        <div>
            <strong>Study Tip:</strong>
            <p id="tip-text" ref = {tipTextRef} onLoad={showRandomTip}></p>
        </div>
        <button id="close-tip" onClick={hideTip}>×</button>
    </div>
    
  )
}
