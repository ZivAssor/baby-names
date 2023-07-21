import React, { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import { Input, List, ListItem, Card, Button } from "@material-tailwind/react";
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
import { getFrequencyPerYear, countByGender, getNameSharebyYear } from '../data/datafunc.js';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
);

const NameSharebyYear = () => {
    const [name, setName] = useState('');
    const [boysData, setBoysData] = useState([]);
    const [girlsData, setGirlsData] = useState([]);
    const [inputValue, setInputValue] = useState('');
    const [names, setNames] = useState([]);
    const [chartData, setChartData] = useState({});
    const [displayMode, setDisplayMode] = useState('share'); // 'share' or 'number'
    const [lastSelectedName, setLastSelectedName] = useState('');

    useEffect(() => {
        setNames(countByGender().map(({ name, boys, girls }) => ({ label: name, boys, girls })));
    }, []);

    useEffect(() => {
        handleNameChange({ label: 'יהלי' });
    }, []);

    useEffect(() => {
        if (name !== lastSelectedName) {
            // Reload data only if a new name is selected
            handleNameChange({ label: name });
            setLastSelectedName(name);
        } else {
            // Update the chart data with the correct values for the display mode
            const data = getNameSharebyYear(name);
            if (data && data.years) {
                const boysData = Object.values(data.years).map(year => (displayMode === 'share' ? year.boysShare : year.boys));
                const girlsData = Object.values(data.years).map(year => (displayMode === 'share' ? year.girlsShare : year.girls));
                setBoysData(boysData);
                setGirlsData(girlsData);
            }
        }
    }, [name, lastSelectedName, displayMode]);

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

        const data = getNameSharebyYear(selectedOption.label);

        if (!data || !data.years) {
            console.log('Data returned from getFrequencyPerYear is not structured as expected. Selected option was:', selectedOption);
            return;
        }

        const boysData = Object.values(data.years).map(year => (displayMode === 'share' ? year.boysShare : year.boys));
        const girlsData = Object.values(data.years).map(year => (displayMode === 'share' ? year.girlsShare : year.girls));

        setBoysData(boysData);
        setGirlsData(girlsData);
    };

    const handleDisplayModeToggle = () => {
        // Toggle the display mode
        setDisplayMode(prevMode => (prevMode === 'share' ? 'number' : 'share'));
    };

    const chartOptions = {
        plugins: {
            legend: {
                position: 'top',
            },
            title: {
                display: true,
                text: `השם ${name}, בין השנים 1948-2021`
            }
        },
        maintainAspectRatio: false,
        responsive: true,
        scales: {
            y: {
                ticks: {
                    // Convert the values to percentage and add a "%" sign if in share mode
                    callback: value => (displayMode === 'share' ? value.toFixed(2) + '%' : value),
                }
            }
        }
    };

    return (
        <div className='w-full md:col-span-2 relative lg:h-[70vh] h-[50vh] m-auto p-4 border rounded-lg bg-white'>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-2 items-center mb-2"> {/* Added 'grid-cols-1' and 'md:grid-cols-4' and 'gap-2' classes */}
                <div className="md:col-span-3"> {/* Added 'md:col-span-3' class */}
                    <Input
                        label="הקלידו שם..."
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                    />
                </div>
                <div className="md:col-span-1"> {/* Added 'md:col-span-1' class */}
                    <Button color="blue" onClick={handleDisplayModeToggle}>
                        {displayMode === 'share' ? 'החלף למספר שמות' : 'החלף לאחוז'}
                    </Button>
                </div>
            </div>
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
            {(boysData.length > 0 && girlsData.length > 0) && <Line data={chartData} options={chartOptions} />}
        </div>
    )
};
export default NameSharebyYear;
