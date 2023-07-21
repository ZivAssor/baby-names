const XLSX = require('xlsx');

function getTopNames(gender, startYear, endYear) {
  // console.log("read the data")
  // console.log(gender,startYear,endYear);
  // Read the file
  const workbook = XLSX.readFile('./data/names.xlsx');

  // Get the worksheet
  const worksheet = workbook.Sheets[gender];

  // Convert the worksheet to JSON
  let data = XLSX.utils.sheet_to_json(worksheet);

  // Calculate the total count for each name over the range of years
  data.forEach(item => {
    let total = 0;
    for (let year = startYear; year <= endYear; year++) {
      total += Number(item[year.toString()]) || 0;
    }
    item.total = total;
  });

  // Sorting data based on the total count
  data.sort((a, b) => b.total - a.total);
  
  const topTenNames = data.slice(0, 10).map(item => item['Names']);
  
  return topTenNames;
}

function getBottomNames(gender, startYear, endYear) {
  // Read the file
  const workbook = XLSX.readFile('./data/names.xlsx');

  // Get the worksheet
  const worksheet = workbook.Sheets[gender];

  // Convert the worksheet to JSON
  let data = XLSX.utils.sheet_to_json(worksheet);

  // Calculate the total count for each name over the range of years
  data.forEach(item => {
    let total = 0;
    for (let year = startYear; year <= endYear; year++) {
      total += Number(item[year.toString()]) || 0;
    }
    item.total = total;
  });

  // Sorting data based on the total count
  data.sort((a, b) => a.total - b.total);
  
  // Get the bottom 10 names
  const bottomTenNames = data.slice(0, 10).map(item => item['Names']);
  
  return bottomTenNames;
}


// console.log(getTopNames('boys', 2010, 2010)); // For boys
// console.log(getTopNames('girls', 2010, 2020)); // For girls

function getAllNames() {
  const boysWorkbook = XLSX.readFile('./data/names.xlsx');
  const boysWorksheet = boysWorkbook.Sheets['boys'];
  const boysData = XLSX.utils.sheet_to_json(boysWorksheet);
  const boysNames = boysData.map(item => item['Names']);

  const girlsWorkbook = XLSX.readFile('./data/names.xlsx');
  const girlsWorksheet = girlsWorkbook.Sheets['girls'];
  const girlsData = XLSX.utils.sheet_to_json(girlsWorksheet);
  const girlsNames = girlsData.map(item => item['Names']);

  const allNames = [...new Set([...boysNames, ...girlsNames])]; // Combine and deduplicate names

  return {
    boys: boysNames,
    girls: girlsNames,
    all: allNames
  };
}

module.exports = {
  getTopNames,
  getBottomNames,
  getAllNames,
};