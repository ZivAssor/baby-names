import React from 'react'
import { START_YEAR, END_YEAR } from '../data/constants.js';

const TopCards = () => {
  return (
    <div  className='grid lg:grid-cols-5 gap-4 p-4'>
        <div className='lg:col-span-2 col-span-1 bg-white flex justify-between w-full border p-4 rounded-lg'>
            <div className='flex flex-col w-full pb-4'>
                <p className='text-blue-200 text-2xl font-bold'>6,691</p>
                <p className='text-gray-600'>שמות של בנים</p>
            </div>
        </div>
        <div className='lg:col-span-2 col-span-1 bg-white flex justify-between w-full border p-4 rounded-lg'>
            <div className='flex flex-col w-full pb-4'>
                <p className='text-red-200 text-2xl font-bold'>8,072</p>
                <p className='text-gray-600'>שמות של בנות</p>
            </div>
        </div>
        <div className='bg-white flex justify-between w-full border p-4 rounded-lg'>
        <div className='flex flex-col w-full pb-4'>
                <p className='text-black text-2xl font-bold'>{START_YEAR}-{END_YEAR}</p>
                <p className='text-gray-600'>תקופת זמן</p>
            </div>
        </div>
    </div>
  )
}

export default TopCards
