import React from 'react';

const DataInfo = () => {
    return (
        <div className="bg-white shadow-md p-6 rounded-md">
            <h1 className="text-2xl font-bold mb-4">כמה מילים על הדאטה</h1>
            <p className="text-base mb-2">
                האתר מציג נתונים אודות שמות פרטיים של תושבי ישראל, נשים וגברים, לאורך השנים בין 1948 ל-2021.
            </p>
            <p className="text-base mb-2">
            המידע שמוצג באתר מבוסס על קובץ השמות שפרסמה הלשכה המרכזת לסטטיסטיקה ביוני 2022, וניתן להוריד אותו מ<a href="https://www.cbs.gov.il/he/Pages/search/TableMaps.aspx?CbsSubject=שמות" target="_blank" rel="noopener noreferrer" className="text-blue-600 underline hover:text-blue-800">כאן</a>. בשלב זה, מוצגים שמות של יהודים ויהודיות בלבד.
            </p>
            <p className="text-base">
                בגרף השמות לאורך השנים, עבור שנים בהן השם מופיע פחות מ-5 פעמים, יופיע 0. ניתן לראות את כמות השמות הכללית שניתנה עבור אותו שם לפי מגדר לאורך כל התקופה, בגרף ״בן או בת?״. 
            </p>
        </div>
    );
}

export default DataInfo;
