const express = require('express');
const cors = require('cors');
require('dotenv').config();

const restaurantRoutes = require('./routes/restaurants');
const reviewRoutes = require('./routes/reviews');
const { readJsonFile } = require('./utils/fileManager');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.get('/', (req, res) => {
  res.json({
    message: '🍜 Restaurant Review API',
    version: '1.0.0',
    endpoints: {
      restaurants: '/api/restaurants',
      reviews: '/api/reviews',
      stats: '/api/stats'
    }
  });
});

app.use('/api/restaurants', restaurantRoutes);
app.use('/api/reviews', reviewRoutes);

// ========================================
// TODO: GET /api/stats - ดึงสถิติทั้งหมด
// ========================================
// งานที่ต้องทำ:
// 1. อ่านข้อมูล restaurants.json และ reviews.json
// 2. คำนวณ:
//    - totalRestaurants: จำนวนร้านทั้งหมด
//    - totalReviews: จำนวนรีวิวทั้งหมด
//    - averageRating: คะแนนเฉลี่ยของร้านทั้งหมด (ปัดเศษ 1 ตำแหน่ง)
//    - topRatedRestaurants: ร้าน 5 อันดับแรกที่มี rating สูงสุด
// 3. ส่งข้อมูลกลับในรูปแบบ: { success: true, data: {...} }
//
// คำใบ้:
// - ใช้ Array.reduce() เพื่อรวมคะแนน
// - ใช้ Array.sort() และ Array.slice(0, 5) เพื่อหา top 5
// - ระวัง: ร้านที่ยังไม่มีรีวิว (averageRating = 0) อาจมีปัญหาในการเรียง

app.get('/api/stats', async (req, res) => {
  try {
    // TODO: เขียนโค้ดที่นี่
    // 1. อ่านข้อมูล restaurants.json และ reviews.json
    const restaurants = await readJsonFile('.data/restaurants.json');
    const reviews = await readJsonFile('.data/reviews.json');

    // 2. คำนวณ
    const totalRestaurants = Array.isArray(restaurants) ? restaurants.length : 0;
    const totalReviews = Array.isArray(reviews) ? reviews.length : 0;

    const averageRating = new Map();
    for (const r of reviews) {
        const id = r.restaurantId ?? r.restaurantID ?? r.restaurant_id;
        const rating = Number(r.rating) || 0;
        if (!averageRating.has(id)) {
            averageRating.set(id, { total: 0, count: 0 });
        
        const g = averageRating.get(id);
        g.sum += rating;
        g.count += 1;
        }

    const withAverages = restaurants.map(rest =>{
        const id = rest.id ??  rest.restaurantId ?? rest.restaurantID ?? rest.restaurant_id;
        const g = averageRating.get(id);
        const avg = reviewCount ? g.sum / reviewCountc : 0;
        return { ...rest, id, averageRating: avg, reviewCount};
    })
      
    const avgAll = 
        totalRestaurants === 0 ? 0 
        : withAverages.reduce((acc, r) => acc + r.averageRating, 0) / totalRestaurants;
    }

    const topRatedRestaurants = [...withAverages]
      .sort((a, b) => {
        if (b.averageRating !== a.averageRating) return b.averageRating - a.averageRating;
        if ((b.reviewCount || 0) !== (a.reviewCount || 0)) return (b.reviewCount || 0) - (a.reviewCount || 0);
        const an = (a.name || '').toString().toLowerCase();
        const bn = (b.name || '').toString().toLowerCase();
        return an.localeCompare(bn);
      })
      .slice(0, 5)
      .map(r => ({
        id: r.id,
        name: r.name,
        averageRating: Number(r.averageRating.toFixed(1)),
        reviewCount: r.reviewCount
    }));

    // 3. ส่งข้อมูลกลับ
    res.json({
        success: true,
        data: {
            totalRestaurants,
            totalReviews,
            averageRating: Number(avgAll.toFixed(1)),
            topRatedRestaurants
        }       
    });

  } catch (error) {
    console.error('Error fetching stats:', error);
    res.status(500).json({
      success: false,
      message: 'เกิดข้อผิดพลาดในการดึงสถิติ'
    });
  }
});

// 404 Handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'API endpoint not found'
  });
});

// Error Handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: 'Internal server error',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📝 Environment: ${process.env.NODE_ENV}`);
});