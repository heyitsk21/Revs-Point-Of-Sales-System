import React, { useState, useEffect } from 'react';
import './Report.css';
import { useTextSize } from '../../components/TextSizeContext';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import * as d3 from 'd3';
import ManagerTopBar from '../../components/ManagerTopBar';
import "react-datepicker/dist/react-datepicker.css";
import DatePicker from "react-datepicker";

function ProdUsage() {
    const navigate = useNavigate();
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [ingredientData, setIngredientData] = useState([]);
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
        let headers = ['IngredientName,Total Amount Used']
        let usersCsv = ingredientData.reduce((acc, user) => {
          const { ingredientname,totalamountchanged} = user
          acc.push([ingredientname,totalamountchanged ].join(','))
          return acc
        }, [])
        downloadFile({
          data: [...headers, ...usersCsv].join('\n'),
          fileName: 'ProductUsage.csv',
          fileType: 'text/csv',
        })
      }

    useEffect(() => {

            fetchData(startDate, endDate);
        
    }, [startDate, endDate]);

    const fetchData = async (startDate, endDate) => {
        try {
            const response = await axios.post('https://team21revsbackend.onrender.com/api/manager/reports/generateproductusage', {
                startdate: startDate,
                enddate: endDate
            });
            console.log('Response from API:', response.data);

            setIngredientData(response.data);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    const calculateTotal = () => {
        return ingredientData.reduce((acc, ingredient) => acc + Math.abs(parseFloat(ingredient.totalamountchanged)), 0);
    };

    const renderChart = () => {
        const total = calculateTotal();
        const svgWidth = 1250;
        const svgHeight = 800;
        const margin = { top: 100, right: 10, bottom: 100, left: 100 };
        const width = svgWidth - margin.left - margin.right;
        const height = svgHeight - margin.top - margin.bottom;
    
        const svg = d3.select('.chart')
            .append('svg')
            .attr('width', svgWidth)
            .attr('height', svgHeight)
            .append('g')
            .attr('transform', `translate(${margin.left},${margin.top})`);
    
        const x = d3.scaleBand()
            .range([0, width])
            .domain(ingredientData.map(d => d.ingredientname))
            .padding(0.2);
    
        const y = d3.scaleLinear()
            .range([height, 0])
            .domain([0, d3.max(ingredientData, d => Math.abs(parseFloat(d.totalamountchanged)))]);
    
        svg.append('g')
            .attr('transform', `translate(0,${height})`)
            .call(d3.axisBottom(x))
            .selectAll('text')
            .attr('transform', 'rotate(-45)')
            .style('text-anchor', 'end')
            .attr('dx', '-0.8em')
            .attr('dy', '0.15em');
    
        svg.append('g')
            .call(d3.axisLeft(y));
    
        svg.selectAll('.bar')
            .data(ingredientData)
            .enter()
            .append('rect')
            .attr('class', 'bar')
            .attr('x', d => x(d.ingredientname))
            .attr('y', d => y(Math.abs(parseFloat(d.totalamountchanged))))
            .attr('width', x.bandwidth())
            .attr('height', d => height - y(Math.abs(parseFloat(d.totalamountchanged))));
    
        svg.selectAll('.label')
            .data(ingredientData)
            .enter()
            .append('text')
            .text(d => Math.abs(parseFloat(d.totalamountchanged)).toFixed(2))
            .attr('x', d => x(d.ingredientname) + x.bandwidth() / 2)
            .attr('y', d => y(Math.abs(parseFloat(d.totalamountchanged))) - 50)
            .attr('text-anchor', 'middle')
            .attr('class', 'label')
            .style('font-size', '12px')
            .each(function(d, i) {
                if (i % 3 !== 1) { 
                    d3.select(this).remove();
                }
            });
        };

    useEffect(() => {
        if (ingredientData.length > 0) {
            d3.select('.chart').selectAll('*').remove();
            renderChart();
        }
    }, [ingredientData]);

    return (
        <div className={`prod-usage ${textSize === 'large' ? 'large-text' : ''}`} >
            <ManagerTopBar/>
            <div className='report-body'>
                <button className="trends-button" onClick={() => navigate('/manager/trends')}>Return</button>
                <h1 className="trends-header">Produce Usage (negative)</h1>
                <div className="date-fields">
                    <label>Start Date:</label>
                    <DatePicker selected={startDate} onChange={(date) => setStartDate(date)} />
                    <label>End Date:</label>
                    <DatePicker selected={endDate} onChange={(date) => setEndDate(date)} />
                </div>
                <button onClick={() => fetchData(startDate, endDate)}>Generate Product Usage</button>
                <button type='button' onClick={exportToCsv}>
                Export to CSV
                </button>
                <div className="chart"></div>
            </div>
        </div>
    );
};

export default ProdUsage;
