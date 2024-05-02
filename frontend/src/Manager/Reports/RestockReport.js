import React, { useEffect, useState } from 'react';
import './Report.css';
import { useTextSize } from '../../components/TextSizeContext';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import ManagerTopBar from '../../components/ManagerTopBar';

import SortedTable from '../../components/SortedTable';

/**
 * Component for displaying the restock report.
 * @returns {JSX.Element} - The JSX element representing the RestockReport component.
 */
function RestockReport () {
    const navigate = useNavigate();
    const [reportData, setReportData] = useState([]);
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

    /**
     * Function to fetch data from the backend.
     */
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

    return (
        <div className={`restock-report ${textSize === 'large' ? 'large-text' : ''}`} >
            <ManagerTopBar/>
            <div className='report-body'>
                <button className="trends-button" onClick={() => navigate('/manager/trends')}>Return</button>
                <h2  className="trends-header">Restock Report</h2>
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
