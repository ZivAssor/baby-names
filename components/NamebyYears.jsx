import React, { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import { Input, List, ListItem, Card } from "@material-tailwind/react";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
} from 'chart.js';
import { getFrequencyPerYear, countByGender } from '../data/datafunc.js';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
);

const NamebyYears = () => {
    const [name, setName] = useState('');
    const [boysData, setBoysData] = useState([]);
    const [girlsData, setGirlsData] = useState([]);
    const [inputValue, setInputValue] = useState('');
    const [names, setNames] = useState([]);
    const [chartData, setChartData] = useState({});

    useEffect(() => {
        setNames(countByGender().map(({ name, boys, girls }) => ({ label: name, boys, girls })));
    }, []);

    useEffect(() => {
        handleNameChange({ label: 'יהלי' });
    }, []);

    useEffect(() => {
        setChartData({
            labels: Array.from({ length: 2021 - 1948 + 1 }, (_, i) => 1948 + i),
            datasets: [
                {
                    label: 'בנים',
                    data: boysData,
                    borderColor: 'rgba(53, 162, 235, 0.5)',
                    backgroundColor: 'rgba(53, 162, 235, 0.5)',
                },
                {
                    label: 'בנות',
                    data: girlsData,
                    borderColor: 'rgba(255, 99, 132, 0.5)',
                    backgroundColor: 'rgba(255, 99, 132, 0.5)',
                },
            ],
        });
    }, [boysData, girlsData]);

    const handleNameChange = (selectedOption) => {
        setName(selectedOption.label);
        setInputValue('');
    
        const data = getFrequencyPerYear(selectedOption.label);
    
        if (!data || !data.years) {
            console.log('Data returned from getFrequencyPerYear is not structured as expected. Selected option was:', selectedOption);
            return;
        }
    
        const boysData = Object.values(data.years).map(year => year.boys);
        const girlsData = Object.values(data.years).map(year => year.girls);
    
        setBoysData(boysData);
        setGirlsData(girlsData);
    };
    

    const chartOptions = {
        plugins: {
            legend: {
                position: 'top',
            },
            title: {
                display: true,
                text: `מספר הבנות והבנים עם השם ${name}, בין השנים 1948-2021`
            }
        },
        maintainAspectRatio: false,
        responsive: true
    };

    return (
        <div className='w-full md:col-span-2 relative lg:h-[70vh] h-[50vh] m-auto p-4 border rounded-lg bg-white'>
            <Input
                label="הקלידו שם..."
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
            />
            {inputValue && (
                <Card style={{ position: 'absolute', zIndex: 1 }} className="w-96 mt-2">
                    <List>
                        {names.filter(name => name.label.includes(inputValue)).map(name => (
                            <ListItem key={name.label} onClick={() => handleNameChange(name)}>
                                {name.label}
                            </ListItem>
                        ))}
                    </List>
                </Card>
            )}
            {(boysData.length > 0 && girlsData.length > 0) && <Line data={chartData} options={chartOptions}/>}
        </div>
    )
};

export default NamebyYears;
