import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

function Login() {
  const [isRegister, setIsRegister] = useState(false); // 控制登入/註冊模式
  const [formData, setFormData] = useState({
    name: "",
    password: "",
    mode: "",
  });

  const navigate = useNavigate();

  // 處理輸入變更
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // 處理表單提交
  const handleSubmit = async (e) => {
    if (isRegister) {
      formData.mode = "register";
    } else {
      formData.mode = "login";
    }
    e.preventDefault();
    try {
      const response = await axios.post(`${apiUrl}/api/auth`, 
        formData,
        {
          headers: {
          'Content-Type': 'application/json',
          },
        }
        );
      console.log(response.data); // 這裡可以處理後端回應的資料
      if (!isRegister) {
        localStorage.setItem('name', formData.name);
        localStorage.setItem('user_id', response.data.user_id);
        navigate('/home');
        Swal.fire({
          toast: true,
          position: 'top',
          icon: 'success',
          title: '登入成功!',
          showConfirmButton: false,
          timer: 3000 // 3秒後自動消失
        });
      } else {
        Swal.fire({
          toast: true,
          position: 'top',
          icon: 'success',
          title: '註冊成功!',
          text: '請重新登入',
          showConfirmButton: false,
          timer: 3000 // 3秒後自動消失
        });
      }
    } catch (error) {
      console.error('Error:', error);
      let err_msg = error.response.data.message;
      if (!isRegister) {
        Swal.fire({
          icon: 'error', 
          title: '登入失敗',
          text: err_msg,
          confirmButtonColor: '#3085d6',
          confirmButtonText: '確定'
        });
      } else {
        Swal.fire({
          icon: 'error', 
          title: '註冊失敗',
          text: err_msg,
          confirmButtonColor: '#3085d6',
          confirmButtonText: '確定'
        });
      }
    }
  };


  return (
    <div className="login-container">
      <div className="login-box">
        <h2>{isRegister ? "註冊" : "登入"}</h2>
        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <input
              type="text"
              name="name"
              placeholder="使用者名稱"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>
          <div className="input-group">
            <input
              type="password"
              name="password"
              placeholder="密碼"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>
          <button type="submit" className="primary-btn">
            {isRegister ? "註冊" : "登入"}
          </button>
        </form>
        <button onClick={() => setIsRegister(!isRegister)} className="secondary-btn">
          {isRegister ? "返回登入" : "前往註冊"}
        </button>
      </div>
    </div>

  );
}

export default Login;
