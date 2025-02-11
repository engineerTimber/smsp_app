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
                Swal.fire({
                  toast: true,
                  position: 'top',
                  icon: 'success',
                  title: '刪除成功!',
                  showConfirmButton: false,
                  timer: 3000 // 3秒後自動消失
                });
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

    const handleReadme = () => {
      Swal.fire({
        icon: 'info', 
        title: '安裝此網站為 App の方法 (PWA)',
        html: `
          <div style="text-align: left; font-size: 16px;">
            <h3 style="color: #3085d6;">💻 Windows & Mac (Chrome、Edge)</h3>
            <ol>
              <li>開啟此網站</li>
              <li>點擊網址列右側的 <b>安裝圖示 📥</b> (或「安裝應用程式」)</li>
              <li>按下 <b>安裝</b>，即可加入桌面</li>
            </ol>

            <h3 style="color: #3085d6;">🤖 Android (Chrome)</h3>
            <ol>
              <li>開啟此網站</li>
              <li>點擊右上角 <b>⋮ 選單</b></li>
              <li>選擇 <b>「安裝應用程式」</b></li>
              <li>按下 <b>安裝</b>，即可加入主畫面</li>
            </ol>

            <h3 style="color: #3085d6;">🍎 iPhone / iPad (Safari)</h3>
            <ol>
              <li>開啟 Safari 並進入此網站</li>
              <li>點擊底部的 <b>分享按鈕 ⬆️</b></li>
              <li>選擇 <b>「加入主畫面」</b></li>
              <li>按下 <b>新增</b>，即可完成</li>
            </ol>
          </div>
        `,
        confirmButtonColor: '#3085d6',
        confirmButtonText: '了解！'
      });
    };

    return (
        <div className="setting-container">
          <h1 className="setting-title">設定</h1>
          <div className="setting-buttons">
            <button className="delete-account-btn" onClick={handleDeleteAccount}>刪除帳號</button>
            <button className="readme-btn" onClick={handleReadme}>Readme</button>
            <p>更多功能敬請期待......</p>
            <button className="back-btn" onClick={() => navigate("/home")}>返回目錄</button>
          </div>
        </div>
    );
}

export default Setting;