import { useEffect, useState } from 'react'
import './App.css'

function App() {
  const [students, setStudents] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // State quản lý Form nhập sinh viên
  const [formData, setFormData] = useState({
    studentId: '',
    name: '',
    email: ''
  })

  // URL Backend API
  const API_URL = 'https://supreme-space-system-p7g47rrqvgggf75xx-5000.app.github.dev/api/students'

  // Hàm tải danh sách sinh viên
  const fetchStudents = () => {
    fetch(API_URL)
      .then((res) => {
        if (!res.ok) throw new Error('Không thể kết nối đến Backend API')
        return res.json()
      })
      .then((data) => {
        setStudents(data)
        setLoading(false)
      })
      .catch((err) => {
        setError(err.message)
        setLoading(false)
      })
  }

  useEffect(() => {
    fetchStudents()
  }, [])

  // Xử lý thay đổi dữ liệu trong các ô input
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }


  // Gửi dữ liệu POST /api/students
 const handleSubmit = (e) => {
  e.preventDefault();

  fetch(API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(formData)
  })
    .then(async (res) => {
      const data = await res.json();
      if (!res.ok) {
        // Ném ra thông báo lỗi chi tiết từ Backend
        throw new Error(data.message || data.error || 'Thêm sinh viên thất bại!');
      }
      return data;
    })
    .then((data) => {
      alert('Thêm sinh viên thành công!');
      fetchStudents();
      setFormData({ studentId: '', name: '', email: '' });
    })
    .catch((err) => {
      alert(`Lỗi từ Server: ${err.message}`);
    });
};
  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif', maxWidth: '800px', margin: '0 auto' }}>
      <h2>Quản Lý Sinh Viên (Cloud Lab)</h2>

      {/* FORM NHẬP THÔNG TIN SINH VIÊN */}
      <form onSubmit={handleSubmit} style={{ marginBottom: '30px', padding: '15px', border: '1px solid #ccc', borderRadius: '5px' }}>
        <h3>Thêm Sinh Viên Mới</h3>
        <div style={{ marginBottom: '10px' }}>
          <label style={{ display: 'block', marginBottom: '5px' }}>Mã Sinh Viên (MSSV):</label>
          <input
            type="text"
            name="studentId"
            value={formData.studentId}
            onChange={handleChange}
            placeholder="Nhập MSSV..."
            required
            style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}
          />
        </div>

        <div style={{ marginBottom: '10px' }}>
          <label style={{ display: 'block', marginBottom: '5px' }}>Họ và Tên:</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Nhập Họ và tên..."
            required
            style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}
          />
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px' }}>Email:</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Nhập Email..."
            required
            style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}
          />
        </div>

        <button type="submit" style={{ padding: '8px 15px', backgroundColor: '#28a745', color: '#fff', border: 'none', borderRadius: '3px', cursor: 'pointer' }}>
          Thêm Sinh Viên
        </button>
      </form>

      {/* DANH SÁCH SINH VIÊN */}
      <h3>Danh Sách Sinh Viên</h3>
      {loading && <p>Đang tải dữ liệu...</p>}
      {error && <p style={{ color: 'red' }}>Lỗi: {error}</p>}

      {!loading && !error && (
        <table border="1" cellPadding="10" cellSpacing="0" style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ backgroundColor: '#f2f2f2' }}>
              <th>STT</th>
              <th>Mã SV</th>
              <th>Họ và Tên</th>
              <th>Email</th>
            </tr>
          </thead>
          <tbody>
            {students.length > 0 ? (
              students.map((student, index) => (
                <tr key={student._id || index}>
                  <td>{index + 1}</td>
                  <td>{student.studentId}</td>
                  <td>{student.name}</td>
                  <td>{student.email}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" style={{ textAlign: 'center' }}>
                  Chưa có sinh viên nào trong danh sách.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      )}
    </div>
  )
}

export default App