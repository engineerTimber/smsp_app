import { useParams, useNavigate } from "react-router-dom";
import React, { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";

function StatisticDetail() {
    const apiUrl = process.env.REACT_APP_API_URL;
    const {title} = useParams();
    const [titleNow, setTitleNow] = useState("");
    const [isEditingTitle, setIsEditingTitle] = useState(false);
    const {stat_id} = useParams();
    const [note, setNote] = useState(""); // 備註欄位
    const [data, setData] = useState([]); // 用於顯示資料
    const [newData, setNewData] = useState(""); // 用戶輸入的新資料
    const [editingRecord, setEditingRecord] = useState(null);
    const [newValue, setNewValue] = useState("");   // 用戶編輯的新資料

    const navigate = useNavigate();

    useEffect(() => {
        setTitleNow(title);

        axios.get(`${apiUrl}/api/statistics/${stat_id}/data`)
            .then((res) => setData(res.data.data))
            .catch((err) => console.error("資料載入失敗", err));

        axios.get(`${apiUrl}/api/statistics/${stat_id}/note`)
            .then((res) => setNote(res.data.note))
            .catch((err) => console.error("備註載入失敗", err));
    }, [stat_id]);

    const handleTitleChange = (e) => {
        setTitleNow(e.target.value);
    };

    const handleSaveTitle = () => {
        axios.put(`${apiUrl}/api/statistics/${stat_id}/title`, { titleNow })
            .then(() => setIsEditingTitle(false))
            .catch((err) => Swal.fire({
                toast: true,
                position: 'top',
                icon: 'error',
                title: '標題更新失敗',
                showConfirmButton: false,
                timer: 3000 // 3秒後自動消失
              }));
    };

    const handleNoteChange = (e) => {
        setNote(e.target.value);
    };

    const handleSaveNote = () => {
    axios.put(`${apiUrl}/api/statistics/${stat_id}/note`, { note })
        .then(() => Swal.fire({
            toast: true,
            position: 'top',
            icon: 'success',
            title: '備註更新成功',
            showConfirmButton: false,
            timer: 3000 // 3秒後自動消失
          }))
        .catch((err) => Swal.fire({
            toast: true,
            position: 'top',
            icon: 'error',
            title: '備註更新失敗',
            showConfirmButton: false,
            timer: 3000 // 3秒後自動消失
          }));
    };

    const handleDeleteStatistic = () => {
        Swal.fire({
              title: '確定要刪除此統計項目嗎？它這麼可愛啊@@',
              text: "先前儲存在這個項目的資料將會遺失，此動作無法復原",
              icon: 'warning',
              showCancelButton: true,  // 顯示「取消」按鈕
              confirmButtonText: '刪 !',
              cancelButtonText: '我再想想',
            }).then((result) => {
              if (result.isConfirmed) {
                axios.delete(`${apiUrl}/api/statistics/${stat_id}/delete`)
                .then(() => {
                    Swal.fire({
                        toast: true,
                        position: 'top',
                        icon: 'success',
                        title: '刪除成功',
                        showConfirmButton: false,
                        timer: 3000 // 3秒後自動消失
                    });
                    navigate("/home");
                })
                .catch((err) => Swal.fire({
                    toast: true,
                    position: 'top',
                    icon: 'error',
                    title: '刪除失敗',
                    showConfirmButton: false,
                    timer: 3000 // 3秒後自動消失
                }));
              } else {
                return;
              }
            });
    };

    const fetchDataRecords = () => {
        axios.get(`${apiUrl}/api/statistics/${stat_id}/data`)
            .then((res) => setData(res.data.data))
            .catch((err) => console.error("資料載入失敗", err));
    }

    const handleSaveData = () => {
        if (!newData) return; // 如果新資料是空的則不儲存

        axios.post(`${apiUrl}/api/statistics/${stat_id}/data`, { value: newData })
            .then((res) => {
                setData([res.data.data, ...data]); // 把新資料加入最上層
                setNewData(""); // 清空輸入框
            })
            .catch((err) => Swal.fire({
                toast: true,
                position: 'top',
                icon: 'error',
                title: '資料新增失敗',
                showConfirmButton: false,
                timer: 3000
            }));
    }

    const handleDeleteData = (dataId) => {
        Swal.fire({
            title: '確定要刪除此筆資料嗎？',
            icon: 'warning',
            showCancelButton: true,  // 顯示「取消」按鈕
            confirmButtonText: '刪！',
            cancelButtonText: '不要好了',
        }).then((result) => {
            if (result.isConfirmed) {
                axios.delete(`${apiUrl}/api/statistics/data/${dataId}/delete`)
                .then(() => {
                    fetchDataRecords(); // 重新載入資料
                })
                .catch((err) => Swal.fire({
                    toast: true,
                    position: 'top',
                    icon: 'error',
                    title: '刪除失敗',
                    showConfirmButton: false,
                    timer: 3000
                })
            );
            } else {
                return;
            }
        });
    };

    const startEditingRecord = (record) => {
        setEditingRecord(record.id);
        setNewValue(record.value);
    };

    const handleSaveRecord = (recordId) => {
        axios.put(`${apiUrl}/api/data/${recordId}/edit`, { value: newValue })
            .then(() => {
                fetchDataRecords(); // 重新載入資料
                setEditingRecord(null);
            })
            .catch((err) => Swal.fire({
                toast: true,
                position: 'top',
                icon: 'error',
                title: '資料更新失敗',
                showConfirmButton: false,
                timer: 3000
            }));
    };

    const handleExportToExcel = () => {
        Swal.fire({
            title: '確定要將此統計項目的資料匯出為xlsx檔案嗎?',
            text: "此操作會自動將檔案下載至您的裝置",
            icon: 'warning',
            showCancelButton: true,  // 顯示「取消」按鈕
            confirmButtonText: '確定',
            cancelButtonText: '不要好了',
        }).then((result) => {
            if (result.isConfirmed) {
                axios.get(`${apiUrl}/api/statistics/${stat_id}/export-as-xlsx`, {
                    responseType: 'blob' // 重要！確保接收的是二進制檔案
                })
                .then((response) => {
                    // 創建一個 URL 來下載檔案
                    const url = window.URL.createObjectURL(new Blob([response.data]));
                    const link = document.createElement("a");
                    link.href = url;
                    link.setAttribute("download", `statistics_${title}.xlsx`);
                    document.body.appendChild(link);
                    link.click();
                    link.remove();
                    Swal.fire({
                        toast: true,
                        position: 'top',
                        icon: 'success',
                        title: '匯出成功！',
                        showConfirmButton: false,
                        timer: 3000
                    });
                })
                .catch((error) => {
                    console.error("匯出失敗", error);
                    Swal.fire({
                        toast: true,
                        position: 'top',
                        icon: 'error',
                        title: '匯出失敗，請稍後再試！',
                        showConfirmButton: false,
                        timer: 3000
                    });
                });
            } else {
                return;
            }
        });
    };

    return (
        <div className="statistic-detail">
            {isEditingTitle ? (
                <input
                    value={titleNow}
                    onChange={handleTitleChange}
                    onBlur={handleSaveTitle} // 失去焦點時自動儲存
                    onKeyDown={(e) => e.key === "Enter" && handleSaveTitle()} // 按 Enter 時儲存
                    autoFocus
                />
            ) : (
                <h1 onClick={() => setIsEditingTitle(true)}>{titleNow}</h1> // 點擊標題進入編輯模式
            )}
            
            <div className="note">
                <textarea
                    value={note}
                    onChange={handleNoteChange}
                    placeholder="為這個項目寫點備註吧:D"
                    id = "note"
                />
                <button className="save-note-btn" onClick={handleSaveNote}>儲存備註</button>
            </div>

            <button className="export-as-excel-btn" onClick={handleExportToExcel}>將資料匯出為Excel檔案</button>
            <button className="delete-stat-btn" onClick={handleDeleteStatistic}>刪除此統計項目</button>

            <h3>已儲存的資料</h3>
            <div className="data-input">
                <input 
                    className="new-data-input" 
                    type="text" 
                    placeholder="新增資料..."
                    value={newData}
                    onChange={(e) => setNewData(e.target.value)}
                />
                <button className="data-submit-btn" onClick={handleSaveData}>儲存</button>
            </div>

            <table id="data-table" border="1">
                <thead>
                    <tr>
                        <th>資料</th>
                        <th>加入時間</th>
                        <th>操作</th>
                    </tr>
                </thead>
                <tbody>
                    {data.map((record) => (
                        <tr key={record.id}>
                            <td>
                                {editingRecord === record.id ? (
                                    <input
                                        value={newValue}
                                        onChange={(e) => setNewValue(e.target.value)}
                                    />
                                ) : (
                                    record.value
                                )}
                            </td>
                            <td>{record.created_at}</td>
                            <td>
                                {editingRecord === record.id ? (
                                    <button onClick={() => handleSaveRecord(record.id)}>儲存</button>
                                ) : (
                                    <button onClick={() => startEditingRecord(record)}>編輯</button>
                                )}
                                <button onClick={() => handleDeleteData(record.id)}>刪除</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <button className="back-btn" onClick={() => navigate("/home")}>返回目錄</button>
        </div>
    );
}

export default StatisticDetail;
