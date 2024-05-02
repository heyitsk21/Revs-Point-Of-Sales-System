import React, { useEffect, useState } from 'react';
import './Report.css';
import { useTextSize } from '../../components/TextSizeContext';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import ManagerTopBar from '../../components/ManagerTopBar';

import DatePicker from "react-datepicker";
import SortedTable from '../../components/SortedTable';
import "react-datepicker/dist/react-datepicker.css";

/**
 * Component for displaying order trend report.
 * @returns {JSX.Element} - The JSX element representing the OrderTrend component.
 */
function OrderTrend () {
    const navigate = useNavigate();
    const [menuData, setMenuData] = useState([]);
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const { textSize, toggleTextSize } = useTextSize();

    /**
     * Column configuration for the table.
     */
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

    /**
     * Function to download a file.
     * @param {object} data - Data to be downloaded.
     * @param {string} fileName - Name of the file.
     * @param {string} fileType - Type of the file.
     */
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

    /**
     * Function to export data to CSV format.
     * @param {object} e - Event object.
     */
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

    /**
     * Function to fetch data from the backend.
     * @param {Date} startDate - Start date.
     * @param {Date} endDate - End date.
     */
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

    return (
        <div className={`order-trend ${textSize === 'large' ? 'large-text' : ''}`}>
            <ManagerTopBar/>
            <div className='report-body'>
                <button className="trends-button" onClick={() => navigate('/manager/trends')}>Return</button>
                <h2  className="trends-header">Order Trend Report</h2>
                <div className="date-fields">
                    <label>Start Date:</label>
                    <DatePicker selected={startDate} onChange={(date) => setStartDate(date)} />
                    <label>End Date:</label>
                    <DatePicker selected={endDate} onChange={(date) => setEndDate(date)} />
                </div>
                <button onClick={() => fetchData(startDate, endDate)}>Generate Trend Report</button>
                <button type='button' onClick={exportToCsv}>
                Export to CSV
                </button>
                <div className="report-list">
                <SortedTable columns={columns} data={menuData} />
                </div>
            </div>
        </div>
    );
};

export default OrderTrend;
