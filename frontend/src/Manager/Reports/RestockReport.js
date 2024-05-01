import React, { useEffect, useState } from 'react';
import './Report.css';
import { useTextSize } from '../../components/TextSizeContext';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import ManagerTopBar from '../../components/ManagerTopBar';

import SortedTable from '../../components/SortedTable';

function RestockReport () {
    const navigate = useNavigate();
    const [reportData, setReportData] = useState([]);
    const [speakEnabled, setSpeakEnabled] = useState(false);
    const { textSize, toggleTextSize } = useTextSize();

    const columns = React.useMemo(
        () => [
          {
            Header: 'Ingredient Name',
            accessor: 'ingredientname' 
          },
          {
            Header: 'Count',
            accessor: 'count' 
          },
          {
            Header: 'Minimum Amount',
            accessor: 'minamount' 
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
        let headers = ['IngredientName,Count,MinAmount']
        let usersCsv = reportData.reduce((acc, user) => {
          const { ingredientname,count,minamount } = user
          acc.push([ingredientname,count,minamount].join(','))
          return acc
        }, [])
        downloadFile({
          data: [...headers, ...usersCsv].join('\n'),
          fileName: 'RestockReport.csv',
          fileType: 'text/csv',
        })
      }


    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const response = await axios.get('https://team21revsbackend.onrender.com/api/manager/reports/generaterestockreport');
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
        <div className={`restock-report ${textSize === 'large' ? 'large-text' : ''}`} onMouseOver={handleMouseOver}>
            <ManagerTopBar/>
            <div className='report-body'>
                <button className="trends-button" onClick={() => navigate('/manager/trends')}>Return</button>
                <h2  className="trends-header" onMouseOver={handleMouseOver}>Restock Report</h2>
                <button type='button' onClick={exportToCsv}>
                Export to CSV
                </button>
                <div className="report-list">
                <SortedTable columns={columns} data={reportData} />
                </div>
            </div>
        </div>
    );
};

export default RestockReport;
