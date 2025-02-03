

import { useState } from 'react';
import cocktailsData from './assets/scripts/output/cocktails.json';

const App = () => {
  const [season, setSeason] = useState('');
  const [baseSpirit, setBaseSpirit] = useState('');
  const [glassType, setGlassType] = useState('');

  const allSelected = season && baseSpirit && glassType;

  // Filter cocktails based on selected dropdown values
  //
  const filteredCocktails = cocktailsData.cocktails.filter(cocktail => {
    return (
      (!season || cocktail.seasonal_associations[0].season.toLowerCase() === season.toLowerCase()) &&
      (!baseSpirit || cocktail.base_spirit.toLowerCase() === baseSpirit.toLowerCase()) &&
      (!glassType || cocktail.glass_type.toLowerCase() === glassType.toLowerCase())
    );
  });
1
  const seasonOptions = [
    "Summer",
    "Winter",
    "Spring",
    "Fall"
  ]

  const baseSpiritOptions = [
    "Vodka",
    "Gin",
    "Rum",
    "Whiskey"
  ]

  const glassTyopeOptions = [
    "Highball",
    "Martini",
    "Wine",
    "Shot"
  ]

  return (
    <div className="container">
      <div className="dropdowns">
        <select className="selection" value={season} onChange={(e) => setSeason(e.target.value)}>
          <option value="">Select Season</option>
          {seasonOptions.map((season, index) => (
            <option key={index} value={season.toLowerCase()}>{season}</option>
          ))}
        </select>

        <select className="selection" value={baseSpirit} onChange={(e) => setBaseSpirit(e.target.value)}>
          <option value="">Select Base Spirit</option>
          {baseSpiritOptions.map((spirit, index) => (
            <option key={index} value={spirit.toLowerCase()}>{spirit}</option>
          ))}
        </select>

        <select className="selection" value={glassType} onChange={(e) => setGlassType(e.target.value)}>
          <option value="">Select Glass Type</option>
          {glassTyopeOptions.map((glassType, index) => (
            <option key={index} value={glassType.toLowerCase()}>{glassType}</option>
          ))}
        </select>
      </div>

      <hr></hr>

      {allSelected && (
        <div className="secondary-box">
          <h2>Matching Cocktails:</h2>
          {filteredCocktails.length > 0 ? (
            <ul>
              {filteredCocktails.map((cocktail, index) => (
                <li key={index}>{cocktail.name}</li>
              ))}
            </ul>
          ) : (
            <p>No matching cocktails found.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default App;