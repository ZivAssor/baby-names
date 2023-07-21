import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Radio } from "@material-tailwind/react";
import {boysFullList, girlsFullList} from '../data/fullLists.js'

const variants = {
  hidden: { opacity: 0, y: -50 },
  visible: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: 50 },
};

function SlotMachine() {
  const [namesData, setNamesData] = useState({
    allNames: [...boysFullList, ...girlsFullList],
    boysNames: boysFullList,
    girlsNames: girlsFullList,
  });
  const [names, setNames] = useState(namesData.allNames);
  const [isLoading, setIsLoading] = useState(false);
  const [slots, setSlots] = useState([
    {name: '', key: Math.random()},
    {name: '', key: Math.random()},
    {name: '', key: Math.random()}
  ]);
  const [isRunning, setIsRunning] = useState(false);
  const intervals = useRef([]);

  const handleNameListChange = (nameList) => {
    setNames(namesData[nameList]);
  };

  function run() {
    setIsRunning(true);
    setSlots(prevSlots => prevSlots.map(slot => ({name: '', key: Math.random()}))); // Clear slots before running
    for (let i = 0; i < slots.length; i++) {
      intervals.current[i] = setInterval(() => {
        setSlots(prevSlots => {
          const newSlots = [...prevSlots];
          const randomIndex = Math.floor(Math.random() * names.length);
          newSlots[i] = {name: names[randomIndex], key: Math.random()};
          return newSlots;
        });
      }, 100);
    }
    setTimeout(() => {
      intervals.current.forEach(clearInterval);
      setIsRunning(false);
    }, 1000); // Reduce delay to 1 second
  }

  return (
    <div className="flex flex-col items-center justify-center">
      <div>
        <p>מרגישים ברי מזל? 🍀</p>
        <p>נסו את רולטת השמות</p>
      </div>
      <div className="flex mb-4">
        {slots.map((slot, index) => (
          <div key={index} className="p-4 bg-white border-2 border-gray-200 rounded relative overflow-hidden h-20 w-32 flex items-center justify-center">
            <AnimatePresence>
              {slot.name && (
                <motion.div
                  key={slot.key}
                  variants={variants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  className="absolute flex items-center justify-center h-full w-full"
                >
                  {slot.name}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>
      <div className="flex mb-4 space-x-4">
        <Radio 
          id="allNames" 
          name="type" 
          color='indigo'
          label="הכל" 
          defaultChecked={names === namesData?.allNames} 
          onChange={() => handleNameListChange("allNames")} 
        />
        <Radio 
          id="boysNames" 
          name="type" 
          label="בנים" 
          defaultChecked={names === namesData?.boysNames} 
          onChange={() => handleNameListChange("boysNames")} 
        />
        <Radio 
          id="girlsNames" 
          name="type" 
          color='pink'
          label="בנות" 
          defaultChecked={names === namesData?.girlsNames} 
          onChange={() => handleNameListChange("girlsNames")} 
        />
      </div>
      <button onClick={run} disabled={isRunning || isLoading} className={`mt-4 px-4 py-2 rounded ${isRunning || isLoading ? 'bg-gray-500 cursor-not-allowed' : 'bg-blue-500 text-white'}`}>
        {isLoading ? 'טוען נתונים...' : 'הפעלה'}
      </button>
    </div>
  );
}

export default SlotMachine;
