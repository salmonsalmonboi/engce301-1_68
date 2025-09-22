// src/App.jsx - อัพเดทเพื่อใช้ Welcome component
import { useState } from 'react'
import Welcome from './components/Welcome'
import './App.css'
import StudentCard from './components/StudentCard'

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>🎉 React Components Demo</h1>
        
        {/* ใช้ Component พร้อม Props */}
        <Welcome 
          name="สมชาย ใจดี" 
          age={20} 
          university="มหาวิทยาลัยเทคโนโลยี"
        />
        
        <Welcome 
          name="สมหญิง รักเรียน" 
          age={19} 
          university="มหาวิทยาลัยเทคโนโลยี"
        />

        {/* ใช้ Component พร้อม Props */}
        <StudentCard
          student={{
            id: '6201234567',
            name: 'สมชาย ใจดี',
            major: 'วิทยาการคอมพิวเตอร์',
            year: 2,
            gpa: 3.6,
            photo: 'https://picsum.photos/id/237/200/300',
            hobbies: ['อ่านหนังสือ', 'เล่นกีฬา', 'เขียนโปรแกรม']
          }}
        />
        
        <StudentCard
          student={{
            id: '6207654321',
            name: 'สมหญิง รักเรียน',
            major: 'วิศวกรรมซอฟต์แวร์',
            year: 3,
            gpa: 2.8,
            photo: '',
            hobbies: ['วาดรูป', 'ฟังเพลง']
          }}
        />
      </header>
    </div>
  )
}

export default App