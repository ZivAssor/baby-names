import React, {useState, useEffect} from 'react';
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
import { getFrequencyPerYear } from '../data/datafunc.js';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
);

const mockNames = ['David', 'Sarah', 'John', 'Mary', 'James', 'Patricia']; // Replace with your actual data fetching function

const BoyOrGirl = ({ boysDataList, girlsDataList }) => {
    const [name, setName] = useState('');
    const [boysData, setBoysData] = useState([]);
    const [girlsData, setGirlsData] = useState([]);
    const [inputValue, setInputValue] = useState('');
    const [names, setNames] = useState([]);

    useEffect(() => {
        setNames(mockNames.map(name => ({ label: name })));
    }, []);

    const handleNameChange = (selectedOption) => {
        setName(selectedOption.label);
        setInputValue('');

        const data = getFrequencyPerYear(selectedOption.label, boysDataList, girlsDataList);
        const years = Object.keys(data.years).sort();
        setBoysData(years.map(year => data.years[year].boys));
        setGirlsData(years.map(year => data.years[year].girls));
    };

    const chartData = {
        labels: Array.from({length: 2022 - 1948 + 1}, (_, i) => 1948 + i),
        datasets: [
            {
                label: 'Boys',
                data: boysData,
                borderColor: 'blue',
                backgroundColor: 'rgba(0,0,255,0.1)',
            },
            {
                label: 'Girls',
                data: girlsData,
                borderColor: 'pink',
                backgroundColor: 'rgba(255,105,180,0.1)',
            },
        ],
    };

    const chartOptions = {
        plugins: {
            legend: {
                position: 'top',
            },
            title: {
                display: true,
                text: `Number of Boys and Girls Named ${name} (1948-2022)`
            }
        },
        maintainAspectRatio: false,
        responsive: true
    };

    return (
        <div className='w-full md:col-span-2 relative lg:h-[70vh] h-[50vh] m-auto p-4 border rounded-lg bg-white'>
            <Input
                label="Choose a name..."
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
            />
            {inputValue && (
                <Card style={{ position: 'absolute', zIndex: 1 }} className="w-96 mt-2">
                    <List>
                        {names.filter(name => name.label.toLowerCase().includes(inputValue.toLowerCase())).map(name => (
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

export default BoyOrGirl;
