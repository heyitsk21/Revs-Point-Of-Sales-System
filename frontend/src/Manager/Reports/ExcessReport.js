import React, { useEffect, useState } from 'react';
import './Report.css';
import { useTextSize } from '../../components/TextSizeContext';
import axios from 'axios'; 
import { useNavigate  } from 'react-router-dom';
import ManagerTopBar from '../../components/ManagerTopBar';
import "react-datepicker/dist/react-datepicker.css";
import DatePicker from "react-datepicker";
import SortedTable from '../../components/SortedTable';

/**
 * Component for generating excess report.
 * @returns {JSX.Element} - The JSX element representing the ExcessReport component.
 */
export default function ExcessReport () {
    const navigate = useNavigate();
    const [startDate, setStartDate] = useState('');
    const [reportData, setReportData] = useState([]);
    const { textSize, toggleTextSize } = useTextSize();

    /**
     * Column configuration for the table.
     */
    const columns = React.useMemo(
        () => [
          {
            Header: 'Itemname',
            accessor: 'itemname' 
          },
          {
            Header: 'Menu ID',
            accessor: 'menuid' 
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

    /**
     * Function to fetch excess report data from the backend.
     */
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

    /**
     * Event handler for generating excess report.
     */
    const handleGenerateExcessReport = () => {
            fetchData();
    };

    return (
        <div className={`excess-report ${textSize === 'large' ? 'large-text' : ''}`}>
            <ManagerTopBar/>
            <div className='report-body'>
                <button className="trends-button" onClick={() => navigate('/manager/trends')}>Return</button>
                <h2  className="trends-header">Excess Report</h2>
                <div className="date-fields">
                    <label>Start Date:</label>
                    <DatePicker selected={startDate} onChange={(date) => setStartDate(date)} />
                </div>
                <div className='generate-trend-buttons'>
                  <button onClick={handleGenerateExcessReport}>Generate Excess Report</button>
                  <button type='button' onClick={exportToCsv}>Export to CSV</button>
                </div>
                <div className="report-table">
                    <SortedTable  columns={columns} data={reportData} />
                </div>
            </div>
        </div>
    );
};