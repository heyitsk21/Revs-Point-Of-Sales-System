import React, { useEffect, useState } from 'react';
import './Report.css';
import { useTextSize } from '../../components/TextSizeContext';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import ManagerTopBar from '../../components/ManagerTopBar';

import DatePicker from "react-datepicker";
import SortedTable from '../../components/SortedTable';
import "react-datepicker/dist/react-datepicker.css";

function OrderTrend () {
    const navigate = useNavigate();
    const [menuData, setMenuData] = useState([]);
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [speakEnabled, setSpeakEnabled] = useState(false);
    const { textSize, toggleTextSize } = useTextSize();

    const columns = React.useMemo(
        () => [
          {
            Header: 'Menu Item 1',
            accessor: 'menuid1' 
          },
          {
            Header: 'Menu Item 2',
            accessor: 'menuid2' 
          },
          {
            Header: 'Pair Count',
            accessor: 'count' 
          },          
        ],
        []
      )

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
        let headers = ['MenuItem1,MenuItem2,Amount']
        let usersCsv = menuData.reduce((acc, user) => {
          const { menuid1,menuid2,count } = user
          acc.push([menuid1,menuid2,count ].join(','))
          return acc
        }, [])
        downloadFile({
          data: [...headers, ...usersCsv].join('\n'),
          fileName: 'OrderTrendReport.csv',
          fileType: 'text/csv',
        })
      }

    useEffect(() => {
        if (startDate && endDate) {
            fetchData(startDate, endDate);
        }
    }, [startDate, endDate]);

    const fetchData = async (startDate, endDate) => {
        try {
            const response = await axios.post('https://team21revsbackend.onrender.com/api/manager/reports/generateordertrend', {
                startdate: startDate,
                enddate: endDate
            });
            console.log('Response from API:', response.data);
            setMenuData(response.data);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
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
        <div className={`order-trend ${textSize === 'large' ? 'large-text' : ''}`}>
            <ManagerTopBar/>
            <div className='report-body'>
                <button className="trends-button" onClick={() => navigate('/manager/trends')}>Return</button>
                <h2  className="trends-header" onMouseOver={handleMouseOver}>Order Trend Report</h2>
                <div className="date-fields">
                    <label>Start Date:</label>
                    <DatePicker selected={startDate} onChange={(date) => setStartDate(date)} />
                    <label>End Date:</label>
                    <DatePicker selected={endDate} onChange={(date) => setEndDate(date)} />
                </div>
                <button onClick={() => fetchData(startDate, endDate)} onMouseOver={handleMouseOver}>Generate Trend Report</button>
                <button type='button' onClick={exportToCsv}>
                Export to CSV
                </button>
                <div className="report-list" onMouseOver={handleMouseOver}>
                <SortedTable columns={columns} data={menuData} />
                </div>
            </div>
        </div>
    );
};

export default OrderTrend;
