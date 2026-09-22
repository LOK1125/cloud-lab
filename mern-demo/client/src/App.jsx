import { useEffect, useState } from 'react'
import './App.css'

function App() {
  const [students, setStudents] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // State quản lý trạng thái chỉnh sửa
  const [editingStudent, setEditingStudent] = useState(null)

  // State quản lý Form nhập sinh viên
  const [formData, setFormData] = useState({
    studentId: '',
    name: '',
    email: ''
  })

  // URL Backend API
  const API_URL = 'http://localhost:5000/api/students'

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

  // Chuyển dữ liệu sinh viên lên Form khi bấm nút "Sửa"
  const handleEditClick = (student) => {
    setEditingStudent(student)
    setFormData({
      studentId: student.studentId || '',
      name: student.name || '',
      email: student.email || ''
    })
  }

  // Hủy bỏ chế độ chỉnh sửa
  const handleCancelEdit = () => {
    setEditingStudent(null)
    setFormData({ studentId: '', name: '', email: '' })
  }

  // Gửi dữ liệu POST /api/students (Thêm mới)
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

  // Xử lý Cập nhật sinh viên (PUT /api/students/:id)
  const handleUpdate = () => {
    if (!formData.studentId.trim()) {
      alert('Vui lòng nhập Mã Sinh Viên (MSSV) để cập nhật!');
      return;
    }
    if (!formData.name.trim()) {
      alert('Vui lòng nhập Họ và Tên để cập nhật!');
      return;
    }
    if (!formData.email.trim()) {
      alert('Vui lòng nhập Email để cập nhật!');
      return;
    }

    const targetId = editingStudent._id || editingStudent.studentId;

    fetch(`${API_URL}/${targetId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(formData)
    })
      .then(async (res) => {
        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.message || data.error || 'Cập nhật thất bại!');
        }
        return data;
      })
      .then(() => {
        alert('Cập nhật sinh viên thành công!');
        fetchStudents();
        handleCancelEdit();
      })
      .catch((err) => {
        alert(`Lỗi từ Server: ${err.message}`);
      });
  };

  // -------------------------------------------------------------
  // Xử lý Xóa sinh viên (DELETE /api/students/:id)
  // -------------------------------------------------------------
  const handleDelete = (student) => {
    const confirmDelete = window.confirm(
      `Bạn có chắc chắn muốn xóa sinh viên ${student.name} (MSSV: ${student.studentId}) không?`
    );

    if (confirmDelete) {
      const targetId = student._id || student.studentId;

      fetch(`${API_URL}/${targetId}`, {
        method: 'DELETE',
      })
        .then(async (res) => {
          if (!res.ok) {
            const data = await res.json();
            throw new Error(data.message || data.error || 'Xóa thất bại!');
          }
          return res.json();
        })
        .then(() => {
          alert('Xóa sinh viên thành công!');
          fetchStudents();
        })
        .catch((err) => {
          alert(`Lỗi từ Server: ${err.message}`);
        });
    }
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif', maxWidth: '800px', margin: '0 auto' }}>
      <h2>Quản Lý Sinh Viên (Cloud Lab)</h2>

      {/* FORM NHẬP THÔNG TIN SINH VIÊN */}
      <form onSubmit={handleSubmit} style={{ marginBottom: '30px', padding: '15px', border: '1px solid #ccc', borderRadius: '5px' }}>
        <h3>{editingStudent ? 'Cập Nhật Thông Tin Sinh Viên' : 'Thêm Sinh Viên Mới'}</h3>
        <div style={{ marginBottom: '10px' }}>
          <label style={{ display: 'block', marginBottom: '5px' }}>Mã Sinh Viên (MSSV):</label>
          <input
            type="text"
            name="studentId"
            value={formData.studentId}
            onChange={handleChange}
            placeholder="Nhập MSSV..."
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
            style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}
          />
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          {!editingStudent ? (
            <button type="submit" style={{ padding: '8px 15px', backgroundColor: '#28a745', color: '#fff', border: 'none', borderRadius: '3px', cursor: 'pointer' }}>
              Thêm Sinh Viên
            </button>
          ) : (
            <>
              <button 
                type="button" 
                onClick={handleUpdate}
                style={{ padding: '8px 15px', backgroundColor: '#007bff', color: '#fff', border: 'none', borderRadius: '3px', cursor: 'pointer' }}
              >
                Hoàn Tất Cập Nhật
              </button>
              <button 
                type="button" 
                onClick={handleCancelEdit}
                style={{ padding: '8px 15px', backgroundColor: '#6c757d', color: '#fff', border: 'none', borderRadius: '3px', cursor: 'pointer' }}
              >
                Hủy
              </button>
            </>
          )}
        </div>
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
              <th>Thao Tác</th>
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
                  <td style={{ textAlign: 'center' }}>
                    <div style={{ display: 'flex', gap: '5px', justifyContent: 'center' }}>
                      {/* Nút Sửa (Cập nhật) */}
                      <button 
                        onClick={() => handleEditClick(student)}
                        style={{ padding: '4px 10px', backgroundColor: '#ffc107', color: '#000', border: 'none', borderRadius: '3px', cursor: 'pointer' }}
                      >
                        Sửa
                      </button>
                      {/* Nút Xóa sinh viên */}
                      <button 
                        onClick={() => handleDelete(student)}
                        style={{ padding: '4px 10px', backgroundColor: '#dc3545', color: '#fff', border: 'none', borderRadius: '3px', cursor: 'pointer' }}
                      >
                        Xóa
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" style={{ textAlign: 'center' }}>
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