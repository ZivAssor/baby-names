import React, { useState, useEffect } from 'react';
import { FaMale, FaFemale } from 'react-icons/fa';
import Modal from 'react-modal';
import Select from 'react-select';
import { bottomNamesList } from '../data/datafunc';

const customStyles = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
    width: '400px',
    height: '300px',
    border: '1px solid #ccc',
    background: '#fff',
    overflow: 'auto',
    WebkitOverflowScrolling: 'touch',
    borderRadius: '4px',
    outline: 'none',
    padding: '20px',
  },
};

const BottomNames = () => {
  const [data, setData] = useState({ bottomBoysNames: [], bottomGirlsNames: [] });
  const [startYear, setStartYear] = useState(2010);
  const [endYear, setEndYear] = useState(2021);
  const [tempStartYear, setTempStartYear] = useState(startYear); 
  const [tempEndYear, setTempEndYear] = useState(endYear);
  const [modalOpen, setModalOpen] = useState(false);
  const yearOptions = Array.from({ length: 74 }, (_, i) => ({ value: i + 1948, label: i + 1948 }));

  useEffect(() => {
    Modal.setAppElement('#__next');
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      const boys = await bottomNamesList('boys', startYear, endYear);
      const girls = await bottomNamesList('girls', startYear, endYear);
      setData({ bottomBoysNames: boys.map(n => n.name), bottomGirlsNames: girls.map(n => n.name) });
    };
    fetchData();
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

  const renderTitle = () => {
    return (
      <div>
        <span>השמות הנדירים ביותר </span>
        <span
          className="cursor-pointer hover:underline"
          onClick={() => setModalOpen(true)}
        >
          {startYear}-{endYear}
        </span>
      </div>
      
    );
  };

  return (
    <div dir='rtl' className='w-full col-span-1 relative m-auto sm:auto p-4 border rounded-lg bg-white'>
      <h1 className='text-center text-2xl font-bold'>{renderTitle()}</h1>
      <p className='text-center text-gray-600 mb-4'>אפשר ללחוץ על השנים כדי לשנות אותן</p>
      <div className='grid grid-cols-2 gap-4'>
        <div>
          <h2 className='text-lg font-semibold text-blue-600 mb-2'>בנים</h2>
          <ul>{renderData(data.bottomBoysNames, FaMale, 'text-blue-800', 'bg-blue-100')}</ul>
        </div>
        <div>
          <h2 className='text-lg font-semibold text-pink-600 mb-2'>בנות</h2>
          <ul>{renderData(data.bottomGirlsNames, FaFemale, 'text-pink-800', 'bg-pink-100')}</ul>
        </div>
      </div>

      <Modal isOpen={modalOpen} onRequestClose={() => setModalOpen(false)} style={customStyles}>
        <h2 dir='rtl'>בחירת תקופת זמן</h2>
        <Select
          options={yearOptions}
          onChange={handleStartYearChange}
          placeholder='תאריך התחלה'
          filterOption={(option, inputValue) => option.label.toString().startsWith(inputValue)}
          maxMenuHeight={120}
          isRtl={true}
        />
        <Select
          options={yearOptions}
          onChange={handleEndYearChange}
          placeholder='תאריך סיום'
          filterOption={(option, inputValue) => option.label.toString().startsWith(inputValue)}
          maxMenuHeight={120}
          isRtl={true}
        />
        <button dir='rtl' onClick={handleOKClick} className='mt-4 px-4 py-2 rounded bg-blue-500 text-white'>אישור</button>
      </Modal>
    </div>
  );
};

export default BottomNames;
