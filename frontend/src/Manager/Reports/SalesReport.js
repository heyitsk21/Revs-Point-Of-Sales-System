import React, { useState, useEffect } from 'react';
import './Report.css';
import { useTextSize } from '../../components/TextSizeContext';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import ManagerTopBar from '../../components/ManagerTopBar';
import DatePicker from "react-datepicker";
import SortedTable from '../../components/SortedTable';
import "react-datepicker/dist/react-datepicker.css";

/**
 * Component for displaying the sales report.
 * @returns {JSX.Element} - The JSX element representing the SalesReport component.
 */
function SalesReport () {
    const navigate = useNavigate();
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [reportData, setReportData] = useState([]);
    const { textSize, toggleTextSize } = useTextSize();


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

    /**
     * Function to fetch data from the backend.
     * @param {Date} startDate - The start date.
     * @param {Date} endDate - The end date.
     */
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

    return (
        <div className={`sales-report ${textSize === 'large' ? '' : ''}`} >
            <ManagerTopBar/>
            <div className='report-body'>

                <button className="trends-button" onClick={() => navigate('/manager/trends')}>Return</button>
                <h2  className="trends-header">Sales Report</h2>
                <div className="date-fields">
                    <label >Start Date:</label>
                    <DatePicker selected={startDate} onChange={(date) => setStartDate(date)} />
                    <label >End Date:</label>
                    <DatePicker selected={endDate} onChange={(date) => setEndDate(date)} />
                </div>
                <div className='generate-trend-buttons'>
                  <button onClick={() => fetchData(startDate, endDate)}>Generate Sales Report</button>
                  <button type='button' onClick={exportToCsv}> Export to CSV</button>
                </div>
                <div className="report-list">
                    {reportData.length > 0 ? (
                         <SortedTable columns={columns} data={reportData} />
                    ) : (
                        <p>No data to display</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default SalesReport;
