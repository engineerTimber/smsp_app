import React from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import Swal from "sweetalert2";

function Setting() {
    const apiUrl = process.env.REACT_APP_API_URL;
    const { user_id } = useParams();

    const navigate = useNavigate();

    const handleDeleteAccount = async () => {
        Swal.fire({
          title: '確定要刪除此帳號嗎？',
          Text: '此動作無法復原',
          icon: 'warning',
          showCancelButton: true,  // 顯示「取消」按鈕
          confirmButtonText: '確認',
          cancelButtonText: '我再想想',
        }).then((result) => {
          if (result.isConfirmed) {
            axios.delete(`${apiUrl}/api/users/${user_id}/delete`)
            .then(() => {
                alert("刪除成功");
                navigate("/login");
                localStorage.removeItem("name");
                localStorage.removeItem("user_id");
            })
            .catch((err) => alert("刪除失敗"));
          } else {
            return;
          }
        });
    };

    return (
        <div className="setting-container">
          <h1 className="setting-title">設定</h1>
          <div className="setting-buttons">
            <button className="delete-account-btn" onClick={handleDeleteAccount}>刪除帳號</button>
            <p>更多功能敬請期待......</p>
            <button className="back-btn" onClick={() => navigate("/home")}>返回目錄</button>
          </div>
        </div>
    );
}

export default Setting;