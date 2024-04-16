import React, { useState, useEffect } from 'react';
import './ProdUsage.css';
import { useTextSize } from '../../components/TextSizeContext';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import * as d3 from 'd3';

function ProdUsage() {
    const navigate = useNavigate();
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [ingredientData, setIngredientData] = useState([]);
    const [speakEnabled, setSpeakEnabled] = useState(false);
    const { textSize, toggleTextSize } = useTextSize();

    useEffect(() => {
        if (isValidDate(startDate) && isValidDate(endDate)) {
            fetchData(startDate, endDate);
        }
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

    const isValidDate = (date) => {
        return date.match(/\d{4}-\d{2}-\d{2}/);
    };

    const calculateTotal = () => {
        return ingredientData.reduce((acc, ingredient) => acc + Math.abs(parseFloat(ingredient.totalamountchanged)), 0);
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
        <div className={`prod-usage ${textSize === 'large' ? 'large-text' : ''}`} onMouseOver={handleMouseOver}>
            <div className="toggle-button-container">
                <button className={`speak-button ${speakEnabled ? 'speak-on' : 'speak-off'}`} onClick={toggleSpeak}>{speakEnabled ? 'Speak On' : 'Speak Off'}</button>
                <button className="toggle-button" onClick={toggleTextSize}>Toggle Text Size</button>
            </div>
            <button className="trends-button" onClick={() => navigate('/manager/trends')}>Return</button>
            <h1 onMouseOver={handleMouseOver}>Produce Usage (negative)</h1>
            <div className="date-fields">
                <label onMouseOver={handleMouseOver}>Start Date:</label>
                <input
                    type="text"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    placeholder="YYYY-MM-DD"
                />
                <label onMouseOver={handleMouseOver}>End Date:</label>
                <input
                    type="text"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    placeholder="YYYY-MM-DD"
                />
            </div>
            <button onClick={() => fetchData(startDate, endDate)} onMouseOver={handleMouseOver}>Generate Product Usage</button>
            <div className="chart"></div>
        </div>
    );
};

export default ProdUsage;
