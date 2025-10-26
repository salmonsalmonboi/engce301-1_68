const express = require('express');
const router = express.Router();
const { readJsonFile } = require('../utils/fileManager');

// ========================================
// GET /api/restaurants - ดึงรายการร้านทั้งหมด (พร้อม filtering)
// ========================================
router.get('/', async (req, res) => {
  try {
    let restaurants = await readJsonFile('restaurants.json');
    const { search, category, minRating, priceRange } = req.query;
    
    // TODO 1: กรองตามชื่อ (search)
    // เงื่อนไข: ถ้ามี search parameter ให้กรองร้านที่มีชื่อหรือคำอธิบายที่ตรงกับคำค้นหา
    // คำใบ้:
    // if (search) {
    //   const searchLower = search.toLowerCase();
    //   restaurants = restaurants.filter(r => 
    //     r.name.toLowerCase().includes(searchLower) ||
    //     r.description.toLowerCase().includes(searchLower)
    //   );
    // }
    
    // TODO 2: กรองตามหมวดหมู่ (category)
    // เงื่อนไข: ถ้ามี category parameter ให้กรองร้านที่มีหมวดหมู่ตรงกัน
    
    // TODO 3: กรองตาม rating ขั้นต่ำ (minRating)
    // เงื่อนไข: ถ้ามี minRating parameter ให้กรองร้านที่มี averageRating >= minRating
    // คำใบ้: ใช้ parseFloat() เพื่อแปลงเป็นตัวเลข
    
    // TODO 4: กรองตามช่วงราคา (priceRange)
    // เงื่อนไข: ถ้ามี priceRange parameter ให้กรองร้านที่มี priceRange ตรงกัน
    // คำใบ้: ใช้ parseInt() เพื่อแปลงเป็นตัวเลข
    
    res.json({
      success: true,
      data: restaurants,
      total: restaurants.length,
      filters: {
        search: search || null,
        category: category || null,
        minRating: minRating || null,
        priceRange: priceRange || null
      }
    });
  } catch (error) {
    console.error('Error fetching restaurants:', error);
    res.status(500).json({
      success: false,
      message: 'เกิดข้อผิดพลาดในการดึงข้อมูลร้าน'
    });
  }
});

// ========================================
// GET /api/restaurants/:id - ดึงข้อมูลร้านตาม ID พร้อมรีวิว
// ========================================
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    // TODO 5: อ่านข้อมูลร้านและรีวิว
    // ขั้นตอน:
    // 1. อ่าน restaurants.json และ reviews.json โดยใช้ readJsonFile
    // 2. หาร้านที่มี id ตรงกับ parameter โดยใช้ Array.find()
    //    const restaurant = restaurants.find(r => r.id === parseInt(id));
    // 3. ถ้าไม่เจอร้าน ให้ return status 404 พร้อมข้อความ 'ไม่พบร้านอาหารนี้'
    // 4. หารีวิวของร้านนี้ โดยใช้ Array.filter()
    //    const restaurantReviews = reviews.filter(r => r.restaurantId === parseInt(id));
    // 5. เรียงรีวิวจากใหม่สุดไปเก่าสุด โดยใช้ createdAt
    //    restaurantReviews.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    // 6. ส่งข้อมูลกลับในรูปแบบ:
    //    res.json({
    //      success: true,
    //      data: {
    //        ...restaurant,
    //        reviews: restaurantReviews
    //      }
    //    });
    
  } catch (error) {
    console.error('Error fetching restaurant:', error);
    res.status(500).json({
      success: false,
      message: 'เกิดข้อผิดพลาดในการดึงข้อมูลร้าน'
    });
  }
});

module.exports = router;