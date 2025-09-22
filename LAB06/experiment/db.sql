-- Create a new database
CREATE DATABASE ce_665432060887DB;

USE ce_665432060887DB;

-- 2. สร้างตาราง Students
CREATE TABLE Students (
    id INT IDENTITY(1,1) PRIMARY KEY,
    firstName NVARCHAR(50) NOT NULL,
    lastName NVARCHAR(50) NOT NULL,
    email NVARCHAR(100) UNIQUE,
    age INT,
    major NVARCHAR(100),
    createdAt DATETIME2 DEFAULT GETDATE()
);

-- 3. INSERT - เพิ่มข้อมูล

INSERT INTO Students (firstName, lastName, email, age, major)
VALUES ('Somchai', 'Jaidee', 'somchai2@email.com', 20, 'Computer Science');

INSERT INTO Students (firstName, lastName, email, age, major)
VALUES ('Somying', 'Lovestudy', 'somying2@email.com', 19, 'Software Engineering');

-- 4. SELECT - ดึงข้อมูล
SELECT * FROM Students;                    -- ทั้งหมด
SELECT * FROM Students WHERE age > 19;     -- ตามเงื่อนไข
SELECT firstName, lastName FROM Students;  -- เฉพาะ column

-- 5. UPDATE - แก้ไขข้อมูล
UPDATE Students 
SET age = 21, major = 'Data Science'
WHERE id = 1;

-- 6. DELETE - ลบข้อมูล
DELETE FROM Students WHERE id = 4;

-- 7. การ Query ขั้นสูง
SELECT major, COUNT(*) as studentCount 
FROM Students 
GROUP BY major;

SELECT * FROM Students 
ORDER BY age DESC;