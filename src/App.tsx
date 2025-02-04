

import { useState, useEffect } from 'react';
import { ResultCard } from "./components/result-card";
import cocktailsData from './assets/scripts/output/veda_cocktails.json';

interface Cocktail {
  name: string;
  ingredients: { name: string; measurement_fl_oz: number }[];
  seasonal_associations: { season: string }[];
  glass_type: string;
  method: string;
  strength: string;
  garnish: string;
  flavor_profile: any[];
}

const App = () => {
  const [season, setSeason] = useState('');
  const [glassType, setGlassType] = useState('');
  // const [results, setResults] = useState<Cocktail[]>([]);
  


  const allSelected = season && glassType;
  const filteredCocktails = cocktailsData.cocktails.filter(cocktail => {
    return (
      (!season || cocktail.seasonal_associations[0].season.toLowerCase() === season.toLowerCase()) &&
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

  const glassTyopeOptions = [
    "Highball",
    "Martini",
    "Wine",
    "Shot"
  ]

  return (
    <div className="search-interface">
      <div id="search-block" className="search-block">
        <div className="container">
          <div className="search-controls">
            <div className="select-wrapper">
              <select className="select" value={season} onChange={(e) => setSeason(e.target.value)}>
                <option value="">Select Season</option>
                {seasonOptions.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
              <div className="select-arrow" />
            </div>

            <div className="select-wrapper">
              <select className="select" value={glassType} onChange={(e) => setGlassType(e.target.value)}>
                <option value="">Select Glass Type</option>
                { glassTyopeOptions.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                  ))}
                </select>
                <div className="select-arrow" />
              </div>
            </div>
            <div className="results-grid">
                {allSelected && filteredCocktails.length > 0 ? (
                  filteredCocktails.map((cocktail: Cocktail, index: number) => (
                    <ResultCard 
                      key={index}
                      cocktail={cocktail}
                    />
                  ))
                ) : (
                  <p>Select an option from each category to start crafting!</p>
                )}
              </div>
        </div>
      </div>
    </div>
  );
};

export default App;