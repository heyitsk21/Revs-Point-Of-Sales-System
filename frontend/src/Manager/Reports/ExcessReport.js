import React, { useEffect, useState } from 'react';
import './Report.css';
import { useTextSize } from '../../components/TextSizeContext';
import axios from 'axios'; // Import Axios for making API requests
import { useNavigate  } from 'react-router-dom';
import ManagerTopBar from '../../components/ManagerTopBar';
import "react-datepicker/dist/react-datepicker.css";
import DatePicker from "react-datepicker";

function ExcessReport () {
    const navigate = useNavigate();
    const [startDate, setStartDate] = useState('');
    const [reportData, setReportData] = useState([]);
    const [speakEnabled, setSpeakEnabled] = useState(false); // State to track whether speak feature is enabled
    const { textSize, toggleTextSize } = useTextSize();

    const downloadFile = ({ data, fileName, fileType }) => {
        const blob = new Blob([data], { type: fileType })
        const a = document.createElement('a')
        a.download = fileName
        a.href = window.URL.createObjectURL(blob)
        const clickEvt = new MouseEvent('click', {
          view: window,
          bubbles: true,
          cancelable: true,
        })
        a.dispatchEvent(clickEvt)
        a.remove()
      }

    const exportToCsv = e => {
        e.preventDefault()
        let headers = ['Item ID,Item Name']
        let usersCsv = reportData.reduce((acc, user) => {
          const { menuid,itemname } = user
          acc.push([menuid,itemname ].join(','))
          return acc
        }, [])
        downloadFile({
          data: [...headers, ...usersCsv].join('\n'),
          fileName: 'ExcessReport.csv',
          fileType: 'text/csv',
        })
      }

    const fetchData = async () => {
        try {
            const response = await axios.post('https://team21revsbackend.onrender.com/api/manager/reports/generateexcessreport', {
                startdate: startDate
            });
            const formattedData = response.data.map(item => ({ itemname: item.itemname, menuid: item.menuid }));
            setReportData(formattedData);
        } catch (error) {
            console.error('Error fetching excess report data:', error);
        }
    };

    const handleGenerateExcessReport = () => {
    
            fetchData();
        
    };

    const speakText = (text) => {
        const utterance = new SpeechSynthesisUtterance();
        utterance.text = text;
        window.speechSynthesis.speak(utterance);
    };

    const debounce = (func, wait) => {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                timeout = null;
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    };

    const handleMouseOver = debounce((event) => {
        let hoveredElementText = '';
        if (speakEnabled) {
            if (event.target.innerText) {
                hoveredElementText = event.target.innerText;
            } else if (event.target.value) {
                hoveredElementText = event.target.value;
            } else if (event.target.getAttribute('aria-label')) {
                hoveredElementText = event.target.getAttribute('aria-label');
            } else if (event.target.getAttribute('aria-labelledby')) {
                const id = event.target.getAttribute('aria-labelledby');
                const labelElement = document.getElementById(id);
                if (labelElement) {
                    hoveredElementText = labelElement.innerText;
                }
            }
            speakText(hoveredElementText);
        }
    }, 1000);

    const toggleSpeak = () => {
        if (speakEnabled) {
            window.speechSynthesis.cancel();
        }
        setSpeakEnabled(!speakEnabled);
    };

    return (
        <div className={`excess-report ${textSize === 'large' ? 'large-text' : ''}`} onMouseOver={handleMouseOver}>
            <ManagerTopBar/>
            <div className='report-body'>
                <button className="trends-button" onClick={() => navigate('/manager/trends')}>Return</button>
                <h2  className="trends-header" onMouseOver={handleMouseOver}>Excess Report</h2>
                <div className="date-fields">
                    <label onMouseOver={handleMouseOver}>Start Date:</label>
                    <DatePicker selected={startDate} onChange={(date) => setStartDate(date)} />
                </div>
                <div className="report-table">
                    <div className="report-row header">
                        <div className="report-cell">Ingredient ID</div>
                        <div className="report-cell">Ingredient Name</div>
                    </div>
                    {reportData.map((item, index) => (
                        <div key={index} className="report-row">
                            <div className="report-cell" onMouseOver={handleMouseOver}>{item.menuid}</div>
                            <div className="report-cell" onMouseOver={handleMouseOver}>{item.itemname}</div>
                        </div>
                    ))}
                </div>
                <button onClick={handleGenerateExcessReport} onMouseOver={handleMouseOver}>Generate Excess Report</button>
                <button type='button' onClick={exportToCsv}>
                Export to CSV
                </button>
            </div>
        </div>
    );
};

export default ExcessReport;
