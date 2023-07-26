// BoyorGirlBarChart.js
import React, { useState, useEffect } from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import { countByGender } from '../data/datafunc.js';
import { Input, List, ListItem, Card } from "@material-tailwind/react";
import Select from 'react-select';
import { boysFullList, girlsFullList } from '../data/fullLists.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const BoyorGirlBarChart = () => {
  const [names, setNames] = useState([]);
  const defaultName = "יהלי"; // Set your default name here
  const [selectedName, setSelectedName] = useState({ value: defaultName, label: defaultName });
  const [inputValue, setInputValue] = useState('');
  const [selectedYear, setSelectedYear] = useState(null);

  const nameOptions = boysFullList.concat(girlsFullList).map(name => ({ value: name, label: name }));

  useEffect(() => {
    const namesByGender = countByGender().map(({ name, boys, girls }) => ({ value: name, label: name, boys, girls }));
    setNames(namesByGender);

    // Find the default name in the names array and set it
    const defaultNameObj = namesByGender.find(name => name.label === defaultName);
    if (defaultNameObj) setSelectedName(defaultNameObj);
  }, []);

  const handleNamesChange = (selectedOption) => {
    setSelectedName(selectedOption);
    setInputValue('');
  };

  const data = selectedName ? {
    labels: [selectedName.label],
    datasets: [
      {
        label: 'בנים',
        data: [selectedName.boys],
        backgroundColor: 'rgba(53, 162, 235, 0.5)',
        borderWidth: 1,
      },
      {
        label: 'בנות',
        data: [selectedName.girls],
        backgroundColor: 'rgba(255, 99, 132, 0.5)',
        borderWidth: 1,
      },
    ],
  } : {};

  const options = {
    maintainAspectRatio: true,
    responsive: true,
    plugins: {
      legend: {
        display: true,
      },
    },
    scales: {
      x: {
        beginAtZero: true,
      }
    }
  };

  return (
    <div dir='rtl' className='w-full col-span-1 relative lg:h-[70vh] h-[50vh] m-auto p-4 border rounded-lg bg-white overflow-scroll'>
      <h1 className='text-center text-2xl font-bold mb-4'>
        בן או בת?
      </h1>
      <Input
        label="הקלידו שם..."
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
      />
      {inputValue && (
        <Card style={{ position: 'absolute', zIndex: 1 }} className="w-96 mt-2">
          <List>
            {names.filter(name => name.label.includes(inputValue)).map(name => (
              <ListItem key={name.label} onClick={() => handleNamesChange(name)}>
                {name.label}
              </ListItem>
            ))}
          </List>
        </Card>
      )}
      {selectedName && (
        <Bar data={data} options={options} />
      )}
      <div className='p-4 mt-4 border-t border-gray-200' dir='rtl'>
      
      <h2 className='font-bold text-xl mb-2'>{selectedName.label}</h2>
      <p className='text-gray-700 mb-1'>
        סה"כ בנים עם השם הזה: <strong>{selectedName.boys}</strong>
      </p>
      <p className='text-gray-700 mb-1'>
        סה"כ בנות עם השם הזה: <strong>{selectedName.girls}</strong>
      </p>
      <br />
      <p className='text-gray-700 mb-1'>הגרף מציג את כמות הבנים והבנות שנבחר להם השם <strong>{selectedName.label}</strong> בין השנים 1948-2021.</p>
      {/* <p className='text-gray-700 mb-1'>
        התרשים למעלה מציג את תדירות השם שנבחר בין הבנים (בכחול) והבנות (בורוד).
      </p>
      <p className='text-gray-700 mb-1'>
        ככל שהעמודה גבוהה יותר, השם פופולרי יותר בין אותו מין.
      </p>
      <p className='text-gray-700'>
        באפשרותך לחפש ולבחור שם שונה כדי לראות את התפלגות המינים שלו לאורך השנים.
      </p> */}
    </div>
    </div>
  );
};

export default BoyorGirlBarChart;
