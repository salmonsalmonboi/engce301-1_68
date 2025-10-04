// src/data/portfolioData.js

// ===== Category List =====
export const categories = ["All", "AI", "Web", "Mobile"];

// ===== Import Images =====
import Coffee_Bean_Dataset from '../assets/Coffee_Bean_Dataset.jpeg';
import WeatherApp from '../assets/Weather_App.jpeg';
import TodoList from '../assets/To_do_list.png';
import NLP from '../assets/Sentiment Analysis Project.jpeg';

// ===== Projects Data =====
const portfolioData = [
  {
    id: 1,
    title: "Coffee Bean Datasets for Classification",
    category: "AI",
    description:
      "Datasets: Coffee Bean Datasset for Classification",
    image: Coffee_Bean_Dataset,
    view: "https://universe.roboflow.com/chetsada-rngwe/coffee-bean-webcam/dataset/50",
  },
  {
    id: 2,
    title: "Weather App",
    category: "Web",
    description:
      "เว็บแอปแสดงสภาพอากาศแบบเรียลไทม์ พร้อมระบบพยากรณ์อากาศล่วงหน้า 5 วัน",
    image: WeatherApp,
    view: "https://weatherapp-supakorn.netlify.app/",
  },
  {
    id: 3,
    title: "To-Do-List",
    category: "Web",
    description:
      "เว็บไซต์ ช่วยจัดการรายการสิ่งที่ต้องทำ (To-Do) UI เรียบง่าย",
    image: TodoList,
    view: "https://to-do-list-supakorn.netlify.app/",
  },
  {
    id: 4,
    title: "Sentiment Analysis Project",
    category: "AI",
    description:
      "Sentiment Analysis Project โดยใช้ข้อมูลจาก Comment เพื่อวิเคราะห์ความรู้สึกของข้อความภาษาไทย",
    image: NLP,
    view: "https://github.com/salmonsalmonboi/basicThaiSentimentAnalysis",
  },
];

export default portfolioData;


// ===== Contact Information =====
export const contactInfo = {
  email: "supasupa.korn556@gmail.com",
  phone: "093-276-7755",
  address: "Chiang Mai, Thailand",
};

// ===== Social Media Links =====
export const socialLinks = [
  { name: "GitHub", url: "https://github.com/salmonsalmonboi"},
];