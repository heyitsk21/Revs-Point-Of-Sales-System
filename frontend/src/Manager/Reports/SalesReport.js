import React, { useState, useEffect } from 'react';
import './Report.css';
import { useTextSize } from '../../components/TextSizeContext';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import ManagerTopBar from '../../components/ManagerTopBar';
import DatePicker from "react-datepicker";
import SortedTable from '../../components/SortedTable';
import "react-datepicker/dist/react-datepicker.css";



function SalesReport () {
    const navigate = useNavigate();
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [reportData, setReportData] = useState([]);
    const [speakEnabled, setSpeakEnabled] = useState(false);
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
        let headers = ['Itemname,MenuId,Ordercount,Totalsales']
        let usersCsv = reportData.reduce((acc, user) => {
          const { itemname,menuid,ordercount,totalsales } = user
          acc.push([itemname,menuid,ordercount,totalsales].join(','))
          return acc
        }, [])
        downloadFile({
          data: [...headers, ...usersCsv].join('\n'),
          fileName: 'SalesReport.csv',
          fileType: 'text/csv',
        })
      }

    const columns = React.useMemo(
        () => [
          {
            Header: 'Menu ID',
            accessor: 'menuid' 
          },
          {
            Header: 'Item Name',
            accessor: 'itemname' 
          },
          {
            Header: 'Total Sales',
            accessor: 'totalsales' 
          },
          {
            Header: 'Amount Sold',
            accessor: 'ordercount' 
          },
          
          
        ],
        []
      )

    useEffect(() => {
            fetchData(startDate, endDate);
        
    }, [startDate, endDate]);

    const fetchData = async (startDate, endDate) => {
        try {
            const response = await axios.post('https://team21revsbackend.onrender.com/api/manager/reports/generatesalesreport', {
                startdate: startDate,
                enddate: endDate
            });
            console.log('Response from API:', response.data);

            setReportData(response.data);
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
        <div className={`sales-report ${textSize === 'large' ? '' : ''}`} onMouseOver={handleMouseOver}>
            <ManagerTopBar/>
            <div className='report-body'>

                <button className="trends-button" onClick={() => navigate('/manager/trends')}>Return</button>
                <h2  className="trends-header" onMouseOver={handleMouseOver}>Sales Report</h2>
                <div className="date-fields">
                    <label onMouseOver={handleMouseOver}>Start Date:</label>
                    <DatePicker selected={startDate} onChange={(date) => setStartDate(date)} />
                    <label onMouseOver={handleMouseOver}>End Date:</label>
                    <DatePicker selected={endDate} onChange={(date) => setEndDate(date)} />
                </div>
                <button onClick={() => fetchData(startDate, endDate)} onMouseOver={handleMouseOver}>Generate Sales Report</button>
                <button type='button' onClick={exportToCsv}>
                Export to CSV
                </button>
                <div className="report-list">
                    {reportData.length > 0 ? (
                         <SortedTable columns={columns} data={reportData} />
                    ) : (
                        <p onMouseOver={handleMouseOver}>No data to display</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default SalesReport;
