import Head from 'next/head'
import Image from 'next/image'
import Header from '../components/Header'
import TopCards from '@/components/TopCards'
import NamebyYears from '@/components/NamebyYears'
import TopNames from '@/components/TopNames'
import FaBabyCarriage from 'react-icons/fa'
import BottomNames from '@/components/BottomNames'
import SlotMachine from '@/components/SlotMachine'
import BoyorGirlBarChart from '@/components/BoyorGirlBarChart'
import NameSharebyYear from '@/components/NameSharebyYear'

export default function Home() {
  return (
    <>
      <Head>
        <title>דשבורד השמות</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" type="image/x-icon"/>

      </Head>
      <main dir='rtl' className='bg-gray-100 min-b-screen'>
        <Header />
        <TopCards />
        <div className='p-4 grid md:grid-cols-3 grid-cols-1 gap-4'>
          <TopNames />
          <BoyorGirlBarChart />
          <SlotMachine />
        </div>
        <div className='p-4 grid md:grid-cols-3 grid-cols-1 gap-4'>
        <BottomNames />
        <NamebyYears />
        </div>
        <div className='p-4 grid md:grid-cols-3 grid-cols-1 gap-4'>
        <BottomNames />
        <NameSharebyYear />
        </div>
      </main>
    </>
  )
}
