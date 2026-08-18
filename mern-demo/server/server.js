const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config({ path: __dirname + '/.env' });

const app = express();
app.use(express.json());
app.use(cors());

// Import Model Student
const Student = require('./models/Students');

// Kết nối MongoDB Atlas
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Kết nối MongoDB Atlas thành công!'))
  .catch(err => console.error('Lỗi kết nối MongoDB:', err.message));

// Trang chủ kiểm tra server
app.get('/', (req, res) => {
  res.send('Server Node.js đang hoạt động!');
});

app.get('/api/students', async (req, res) => {
  try {
    // Lấy toàn bộ danh sách sinh viên từ MongoDB
    const students = await Student.find();
    
    // Trả về dữ liệu dạng JSON 
    res.status(200).json(students);
  } catch (error) {
    // Trả về thông báo lỗi nếu xảy ra sự cố truy vấn
    res.status(500).json({ 
      message: 'Lỗi khi lấy danh sách sinh viên', 
      error: error.message 
    });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server đang chạy tại http://localhost:${PORT}`);
});

//  API POST /api/students (Thêm sinh viên)
app.post('/api/students', async (req, res) => {
  try {
    // Lấy thông tin từ req.body gửi lên từ client
    const { studentId, name, email } = req.body;

    // Ràng buộc kiểm tra dữ liệu đầu vào
    if (!studentId || !name || !email) {
      return res.status(400).json({ 
        message: 'Vui lòng cung cấp đầy đủ studentId, name và email!' 
      });
    }

    // Sử dụng Student.create() để lưu sinh viên mới vào MongoDB Atlas
    const newStudent = await Student.create({
      studentId,
      name,
      email
    });

    // Trả về dữ liệu sinh viên vừa tạo với mã trạng thái 
    res.status(201).json({
      message: 'Thêm sinh viên thành công!',
      data: newStudent
    });

  } catch (error) {
    // Xử lý lỗi (ví dụ: trùng studentId hoặc lỗi kết nối)
    res.status(500).json({ 
      message: 'Lỗi khi thêm sinh viên', 
      error: error.message 
    });
  }
});


//API PUT /api/students/:id (Cập nhật sinh viên)
app.put('/api/students/:id', async (req, res) => {
  try {
    const { id } = req.params; // Lấy _id từ URL
    const updateData = req.body; // Lấy dữ liệu cập nhật từ req.body

    // Cập nhật sinh viên trong MongoDB
    // { new: true } để trả về dữ liệu sau khi đã cập nhật
    // { runValidators: true } để kiểm tra ràng buộc Schema
    const updatedStudent = await Student.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    );

    // Kiểm tra nếu không tìm thấy sinh viên
    if (!updatedStudent) {
      return res.status(404).json({ message: 'Không tìm thấy sinh viên với ID này!' });
    }

    res.status(200).json({
      message: 'Cập nhật sinh viên thành công!',
      data: updatedStudent
    });

  } catch (error) {
    res.status(500).json({ 
      message: 'Lỗi khi cập nhật sinh viên', 
      error: error.message 
    });
  }
});


// API DELETE /api/students/:id (Xóa sinh viên)
app.delete('/api/students/:id', async (req, res) => {
  try {
    const { id } = req.params; // Lấy _id từ URL

    // Thực hiện xóa sinh viên theo ID trong MongoDB
    const deletedStudent = await Student.findByIdAndDelete(id);

    // Kiểm tra nếu không tìm thấy sinh viên
    if (!deletedStudent) {
      return res.status(404).json({ message: 'Không tìm thấy sinh viên với ID này!' });
    }

    res.status(200).json({
      message: 'Xóa sinh viên thành công!',
      data: deletedStudent
    });

  } catch (error) {
    res.status(500).json({ 
      message: 'Lỗi khi xóa sinh viên', 
      error: error.message 
    });
  }
});