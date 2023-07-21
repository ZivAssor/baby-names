import React, { useState, useEffect } from 'react';
import { FaMale, FaFemale } from 'react-icons/fa';
import { Button, Dialog, DialogHeader, DialogBody, DialogFooter, Input } from "@material-tailwind/react";
import Select from 'react-select'; // Import the react-select library
import { topNamesList } from '../data/datafunc.js';

const TopNames = () => {
  const [data, setData] = useState({ topBoysNames: [], topGirlsNames: [] });
  const [startYear, setStartYear] = useState(2010);
  const [endYear, setEndYear] = useState(2021);
  const [tempStartYear, setTempStartYear] = useState(startYear);
  const [tempEndYear, setTempEndYear] = useState(endYear);
  const [modalOpen, setModalOpen] = useState(false);
  const yearOptions = Array.from({ length: 74 }, (_, i) => ({ value: i + 1948, label: i + 1948 }));

  useEffect(() => {
    setData({
      topBoysNames: topNamesList("boys", startYear, endYear).map(item => item.name),
      topGirlsNames: topNamesList("girls", startYear, endYear).map(item => item.name)
    });
  }, [startYear, endYear]);

  const handleStartYearChange = selectedOption => {
    setTempStartYear(selectedOption.value);
  };

  const handleEndYearChange = selectedOption => {
    setTempEndYear(selectedOption.value);
  };

  const handleOKClick = () => {
    setStartYear(tempStartYear);
    setEndYear(tempEndYear);
    setModalOpen(false);
  };

  const renderData = (data, IconComponent, iconClass, bgClass) =>
    data.map((name, id) => (
      <li key={id} className='bg-gray-50 rounded-lg my-3 p-2 flex items-center'>
        <div className={`${bgClass} rounded-lg p-3`}>
          <IconComponent className={iconClass} />
        </div>
        <div className='pl-4'>
          <p className='text-gray-400 text-sm p-3'>{name}</p>
        </div>
      </li>
    ));

  return (
    <div dir='rtl' className='w-full col-span-1 relative lg:h-[70vh] h-[50vh] m-auto p-4 border rounded-lg bg-white overflow-scroll'>
      <h1 className='text-center text-2xl font-bold mb-4'>
        <div>
          <span>השמות הנפוצים ביותר </span>
          <span
            className="cursor-pointer hover:underline"
            onClick={() => setModalOpen(true)}
          >
            {startYear}-{endYear}
          </span>
        </div>
      </h1>
      <div className='grid grid-cols-2 gap-4'>
        <div>
          <h2 className='text-lg font-semibold text-blue-600 mb-2'>בנים</h2>
          <ul>{renderData(data.topBoysNames, FaMale, 'text-blue-800', 'bg-blue-100')}</ul>
        </div>
        <div>
          <h2 className='text-lg font-semibold text-pink-600 mb-2'>בנות</h2>
          <ul>{renderData(data.topGirlsNames, FaFemale, 'text-pink-800', 'bg-pink-100')}</ul>
        </div>
      </div>

      <Dialog dir='rtl' open={modalOpen} handler={() => setModalOpen(false)}>
        <div className="flex items-center justify-between">
          <DialogHeader>בחירת תקופת זמן</DialogHeader>
        </div>
        <DialogBody>
          <div className="grid gap-4">
            <Select
              options={yearOptions}
              onChange={handleStartYearChange}
              placeholder='תאריך התחלה'
              value={{ value: tempStartYear, label: tempStartYear }} // Set the initial value of the start year
              filterOption={(option, inputValue) => option.label.toString().startsWith(inputValue)}
              maxMenuHeight={120}
              isRtl={true}
            />
            <Select
              options={yearOptions}
              onChange={handleEndYearChange}
              placeholder='תאריך סיום'
              value={{ value: tempEndYear, label: tempEndYear }} // Set the initial value of the end year
              filterOption={(option, inputValue) => option.label.toString().startsWith(inputValue)}
              maxMenuHeight={120}
              isRtl={true}
            />
          </div>
        </DialogBody>
        <DialogFooter>
          <Button
            color="red"
            onClick={() => setModalOpen(false)}
            ripple={true}
            buttonType="link"
            size="lg"
            className="ml-4"
          >
            ביטול
          </Button>
          <Button
            color="blue"
            onClick={handleOKClick}
            ripple={true}
            size="lg"
          >
            אישור
          </Button>
        </DialogFooter>
      </Dialog>
    </div>
  );
};

export default TopNames;
