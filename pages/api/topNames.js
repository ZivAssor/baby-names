import { getTopNames, getBottomNames, getAllNames } from '../../data/topNamesRange.js';

export default async function handler(req, res) {
  const { startYear, endYear, fetchBottom } = req.query;

  let topBoysNames, topGirlsNames;

  if (fetchBottom === 'true') {
    topBoysNames = getBottomNames('boys', parseInt(startYear), parseInt(endYear));
    topGirlsNames = getBottomNames('girls', parseInt(startYear), parseInt(endYear));
  } else {
    topBoysNames = getTopNames('boys', parseInt(startYear), parseInt(endYear));
    topGirlsNames = getTopNames('girls', parseInt(startYear), parseInt(endYear));
  }

  const allNames = getAllNames().all;
  const boysFullList = getAllNames().boys;
  const girlsFullList = getAllNames().girls;

  res.status(200).json({ topBoysNames, topGirlsNames, allNames, boysFullList, girlsFullList});
}
