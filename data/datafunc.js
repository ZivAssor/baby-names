const { boysNameFile, girlsNameFile } = require('./NamesFullFile');

function topNamesList(gender, startYear, endYear) {
  let data;
  if (gender == 'boys') {
    data = boysNameFile;
  } else if (gender == 'girls') {
    data = girlsNameFile;
  } else {
    return "error";
  }
  // Calculate total occurrences for each name between 2010 and 2022
  let nameTotals = data.map(nameData => {
    let total = 0;
    for (let year = startYear; year <= endYear; year++) {
      total += Number(nameData[year.toString()] || 0); // Ensure the data is a number
    }
    return { name: nameData.name, total: total };
  });

  // Sort the names by total occurrences in descending order
  nameTotals.sort((a, b) => b.total - a.total);

  // Return the top 10 names
  return nameTotals.slice(0,7);
}

function bottomNamesList(gender, startYear, endYear) {
  let data;
  if (gender == 'boys') {
    data = boysNameFile;
  } else if (gender == 'girls') {
    data = girlsNameFile;
  } else {
    return "error";
  }
  // Calculate total occurrences for each name between 2010 and 2022
  let nameTotals = data.map(nameData => {
    let total = 0;
    for (let year = startYear; year <= endYear; year++) {
      total += Number(nameData[year.toString()] || 0); // Ensure the data is a number
    }
    return { name: nameData.name, total: total };
  });

  // Sort the names by total occurrences in descending order
  nameTotals.sort((a, b) => a.total - b.total);

  // Return the top 10 names
  return nameTotals.slice(0, 7);
}

function calculateNameScales() {
  const boysData = boysNameFile.map(({ name, total }) => ({ name, total, gender: 'boys' }));
  const girlsData = girlsNameFile.map(({ name, total }) => ({ name, total, gender: 'girls' }));
  const allData = boysData.concat(girlsData);

  // Create an array to store the calculated scales
  const scales = [];

  // Iterate over the names in boysData
  boysData.forEach(({ name, total }) => {
    // Find the corresponding object in girlsData
    const girlsCountObj = girlsData.find(obj => obj.name === name);

    // Calculate the scale
    const boysTotal = total;
    const girlsTotal = girlsCountObj ? girlsCountObj.total : 0;
    const totalCount = boysTotal + girlsTotal;
    const scale = (-1) * (girlsTotal / totalCount) + (boysTotal / totalCount);

    // Set the background color based on the scale value
    const backgroundColor = scale < 0 ? 'rgba(255, 99, 132, 0.5)' : 'rgba(53, 162, 235, 0.5)';

    // Store the name, scale, and backgroundColor in the scales array
    scales.push({ name, scale, backgroundColor });
  });

  // Iterate over the names in girlsData
  girlsData.forEach(({ name, total }) => {
    // Find the corresponding object in boysData
    const boysCountObj = boysData.find(obj => obj.name === name);

    // Check if the name is not present in boysData
    if (!boysCountObj) {
      const scale = -1;
      const backgroundColor = 'rgba(255, 99, 132, 0.5)';
      scales.push({ name, scale, backgroundColor });
    }
  });

  return scales;
}

function countByGender() {
  // Create a mapping of names to counts
  let boysCounts = boysNameFile.reduce((acc, cur) => ({ ...acc, [cur.name]: cur.total }), {});
  let girlsCounts = girlsNameFile.reduce((acc, cur) => ({ ...acc, [cur.name]: cur.total }), {});

  let combinedCounts = {};

  // Iterate over boysCounts
  for (let key in boysCounts) {
    if (boysCounts.hasOwnProperty(key)) {
      combinedCounts[key] = { name: key, boys: boysCounts[key], girls: 0 };
    }
  }

  // Iterate over girlsCounts
  for (let key in girlsCounts) {
    if (girlsCounts.hasOwnProperty(key)) {
      // If key already exists in combinedCounts, update the girls property
      if (combinedCounts.hasOwnProperty(key)) {
        combinedCounts[key]['girls'] = girlsCounts[key];
      }
      // If key doesn't exist, create a new entry
      else {
        combinedCounts[key] = { name: key, girls: girlsCounts[key], boys: 0 };
      }
    }
  }
  // Convert the combinedCounts object to an array of its values
  let result = Object.values(combinedCounts);
  return result;
}

function getFrequencyPerYear(name) {
  const result = { name: name, years: {} };

  [boysNameFile, girlsNameFile].forEach((data, index) => {
    data.forEach(item => {
      if (item.name === name) {
        Object.keys(item).forEach(key => {
          if (key !== "name" && key !== "total") {
            if (!result.years[key]) {
              result.years[key] = { boys: 0, girls: 0 };
            }
            if (index === 0) {
              result.years[key].boys += item[key];
            } else {
              result.years[key].girls += item[key];
            }
          }
        });
      }
    });
  });

  return result;
}

function getNameSharebyYear(name) {
  const result = { name: name, years: {} };

  [boysNameFile, girlsNameFile].forEach((data, index) => {
    data.forEach(item => {
      if (item.name === name) {
        Object.keys(item).forEach(key => {
          if (key !== "name" && key !== "total") {
            if (!result.years[key]) {
              result.years[key] = { boys: 0, girls: 0, totalBoys: 0, totalGirls: 0 };
            }
            if (index === 0) {
              result.years[key].boys += item[key];
              result.years[key].totalBoys += getTotalCount(boysNameFile, key);
            } else {
              result.years[key].girls += item[key];
              result.years[key].totalGirls += getTotalCount(girlsNameFile, key);
            }

            // Calculate the share of boys for the year
            result.years[key].boysShare = result.years[key].boys*100 / result.years[key].totalBoys;

            // Calculate the share of girls for the year
            result.years[key].girlsShare = result.years[key].girls*100 / result.years[key].totalGirls;

            // Calculate the share of total (boys + girls) for the year
            const total = result.years[key].boys + result.years[key].girls;
            const totalBoysGirls = result.years[key].totalBoys + result.years[key].totalGirls;
            result.years[key].totalShare = total / totalBoysGirls;
          }
        });
      }
    });
  });

  return result;
}

function getTotalCount(data, key) {
  return data.reduce((total, entry) => {
    return total + (entry[key] || 0);
  }, 0);
}

module.exports = {
  topNamesList,
  bottomNamesList,
  calculateNameScales,
  countByGender,
  getFrequencyPerYear,
  getNameSharebyYear
};