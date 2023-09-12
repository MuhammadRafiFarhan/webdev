// App.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './App.css';

function App() {
  const [students, setStudents] = useState([]);
  const [formData, setFormData] = useState({ name: '', age: '', grade: '' });

  useEffect(() => {
    axios.get('/api/siswa')
      .then((response) => setStudents(response.data))
      .catch((error) => console.error(error));
  }, []);

  const handleFormChange = (event) => {
    setFormData({ ...formData, [event.target.name]: event.target.value });
  };

  const handleFormSubmit = async (event) => {
    event.preventDefault();
    try {
      const { name, age, grade } = formData;
      const response = await axios.post('/api/siswa', { name, age, grade });
      toast.success('Data siswa masuk dengan sukses!', {
        position: 'top-right',
        autoClose: 2000,
      });
      setStudents([...students, response.data]);
      setFormData({ name: '', age: '', grade: '' });
    } catch (error) {
      toast.error('Gagal menambahkan data siswa.', {
        position: 'top-right',
        autoClose: 2000,
      });
      console.error(error);
    }
  };

  const deleteStudent = (id) => {
    axios.delete(`/api/siswa/${id}`)
      .then(() => {
        const updatedStudents = students.filter((student) => student._id !== id);
        setStudents(updatedStudents);
      })
      .catch((error) => console.error(error));
  };

  return (
    <div className="App">
      <header>
        <h1>Data Siswa</h1>
      </header>
      <main>
        <form onSubmit={handleFormSubmit}>
          <input type="text" name="name" placeholder="Nama" value={formData.name} onChange={handleFormChange} required />
          <input type="number" name="age" placeholder="Usia" value={formData.age} onChange={handleFormChange} required />
          <input type="text" name="grade" placeholder="Kelas" value={formData.grade} onChange={handleFormChange} required />
          <button type="submit">Tambah Siswa</button>
        </form>
        <ul>
          {students.map((student) => (
            <li key={student._id}>
              <span className="student-info">
                {student.name} ({student.age} tahun) - Kelas {student.grade}
              </span>
              <button className="delete-button" onClick={() => deleteStudent(student._id)}>Hapus</button>
            </li>
          ))}
        </ul>
      </main>
      <ToastContainer />
    </div>
  );
}

export default App;
