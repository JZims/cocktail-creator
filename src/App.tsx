

import { useState } from 'react';
import cocktailsData from './assets/cocktails-ex.json';

const App = () => {
  const [season, setSeason] = useState('');
  const [baseSpirit, setBaseSpirit] = useState('');
  const [glassType, setGlassType] = useState('');

  const allSelected = season && baseSpirit && glassType;

  const filteredCocktails = cocktailsData.cocktails.filter(cocktail => {
    return (
      (!season || cocktail.seasonal_association.toLowerCase() === season.toLowerCase()) &&
      (!baseSpirit || cocktail.base_spirit.toLowerCase() === baseSpirit.toLowerCase()) &&
      (!glassType || cocktail.glass_type.toLowerCase() === glassType.toLowerCase())
    );
  });

  return (
    <div className="container">
      <div className="dropdowns">
        <select className="selection" value={season} onChange={(e) => setSeason(e.target.value)}>
          <option value="">Select Season</option>
          <option value="summer">Summer</option>
          <option value="winter">Winter</option>
          <option value="spring">Spring</option>
          <option value="fall">Fall</option>
        </select>

        <select className="selection" value={baseSpirit} onChange={(e) => setBaseSpirit(e.target.value)}>
          <option value="">Select Base Spirit</option>
          <option value="vodka">Vodka</option>
          <option value="gin">Gin</option>
          <option value="rum">Rum</option>
          <option value="whiskey">Whiskey</option>
        </select>

        <select className="selection" value={glassType} onChange={(e) => setGlassType(e.target.value)}>
          <option value="">Select Glass Type</option>
          <option value="highball">Highball</option>
          <option value="martini">Martini</option>
          <option value="wine">Wine</option>
          <option value="shot">Shot</option>
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