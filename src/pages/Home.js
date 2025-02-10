import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";
import Swal from "sweetalert2";

function Home() {
  const [userNow, setUserNow] = useState("");
  const [statistics, setStatistics] = useState([]); // 存放統計項目

  const userId = localStorage.getItem("user_id");

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    setUserNow(localStorage.getItem("name"));
    if (userId) {  // 確保 userId 存在才載入統計項目
      fetchStatistics();
  }
  }, [userId, location.pathname]);

  const logout = () => {
    Swal.fire({
      title: '確定要登出嗎？',
      icon: 'warning',
      showCancelButton: true,  // 顯示「取消」按鈕
      confirmButtonText: '確定',
      cancelButtonText: '不要好了',
    }).then((result) => {
      if (result.isConfirmed) {
        localStorage.removeItem("name");
        localStorage.removeItem("user_id");
        navigate("/login");
      } else {
        return;
      }
    });
  }

  const fetchStatistics = async () => {
    try {
      const response = await axios.get(`${apiUrl}/api/statistics?user_id=${userId}`);
      setStatistics(response.data);
    } catch (error) {
      console.error("Error fetching statistics:", error);
      alert("無法載入統計項目");
    }
  };

  // 新增統計項目
  const handleAddStatistic = async () => {
    try {
      const { value: title } = await Swal.fire({
        title: '請輸入統計項目名稱：',
        input: 'text',
        showCancelButton: true,
        confirmButtonText: '提交',
        cancelButtonText: '取消',
      });
  
      // 如果使用者按下取消或沒有輸入值，則直接返回
      if (!title) return;
  
      // 發送請求到後端
      const response = await axios.post(`${apiUrl}/api/statistics`, {
        user_id: userId,
        title: title,
      });
  
      // 更新前端顯示
      setStatistics([...statistics, { id: response.data.statistic_id, title: title }]);
  
    } catch (error) {
      console.error("Error adding statistic:", error);
      Swal.fire({
        title: "新增失敗",
        text: error.response?.data?.message || "請稍後再試",
        icon: "error",
      });
    }
  };
  
  return (
    <div className="home">
      <h1>統計項目</h1>
      <h2>目前帳號: {userNow}</h2>
      
      <button onClick={handleAddStatistic} className="create-item-btn">
        新增統計項目
      </button>

      <ul className="statistics">
        {statistics.map((stat) => (
          <li key={stat.id}>
            <button onClick={() => navigate(`/home/${stat.title}/${stat.id}`)}>
              {stat.title}
            </button>
          </li>
        ))}
      </ul>

      <button onClick={logout} className="logout-btn">
        登出
      </button>

      <button className="settings-btn" onClick={() => navigate(`/home/${userId}/setting`)}>
        ⚙ 設定
      </button>
    </div>

  );
}

export default Home;