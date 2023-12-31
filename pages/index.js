import Head from 'next/head'
import Image from 'next/image'
import Header from '../components/Header'
import TopCards from '@/components/TopCards'
import TopNames from '@/components/TopNames'
import BottomNames from '@/components/BottomNames'
import SlotMachine from '@/components/SlotMachine'
import BoyorGirlBarChart from '@/components/BoyorGirlBarChart'
import NameSharebyYear from '@/components/NameSharebyYear'
import Footer from '@/components/Footer'
import DataInfo from '@/components/DataInfo'
import FooterMa from '@/components/FooterMa'

export default function Home() {
  return (
    <>
      <Head>
        <title>דשבורד השמות של ישראל</title>
        <meta name="description" content="מחפשים שם לבייבי שבדרך? זה בדיוק המקום בשבילכם. תוכל למצוא את השם הנפוץ ביותר בשנה מסויימת, לגלות כמה פעמים הופיע השם שבחרתם בכל שנה, האם יש יותר בנים או בנות מאותו השם ועוד." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" type="image/x-icon"/>

      </Head>
      <main dir='rtl' className='bg-gray-100 min-b-screen'>
        <Header />
        <TopCards />
          <div className='p-4 grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-4'>
            <TopNames />
            <BoyorGirlBarChart />
            <SlotMachine />
          </div>
        {/* <div className='p-4 grid md:grid-cols-3 grid-cols-1 gap-4'> */}
        {/* <BottomNames /> */}
        {/* <NamebyYears /> */}
        {/* </div> */}
        <div className='p-4 grid md:grid-cols-3 grid-cols-1 gap-4'>
        <BottomNames />
        <NameSharebyYear />
        </div>
        <div className='p-4 grid md:grid-cols-3 grid-cols-1 gap-4'>
          <DataInfo />
        </div>
      </main>
      <FooterMa />
    </>
  )
}
