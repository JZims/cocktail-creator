

import { useState } from 'react';
import { ResultCard} from "./components/result-card";
import { NoneFound } from './components/none-found';
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
  // const [season, setSeason] = useState('');
  // const [glassType, setGlassType] = useState('');
  const [selectedSeasons, setSelectedSeasons] = useState<string[]>([]);
  const [selectedGlassTypes, setSelectedGlassTypes] = useState<string[]>([]);

  const allSelected = selectedGlassTypes[0] && selectedSeasons[0];
  
  const filteredCocktails = cocktailsData.cocktails.filter(cocktail => {
    const seasonMatch = selectedSeasons.length === 0 || 
      cocktail.seasonal_associations.some(sa => 
        selectedSeasons.includes(sa.season)
      );
  
    const glassMatch = selectedGlassTypes.length === 0 || 
      selectedGlassTypes.includes(cocktail.glass_type);
  
    return seasonMatch && glassMatch;
  });

  const handleSeasonChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = Array.from(e.target.selectedOptions, option => option.value);
    setSelectedSeasons(value);
  };
  
  const handleGlassTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = Array.from(e.target.selectedOptions, option => option.value);
    setSelectedGlassTypes(value);
  };
  
  
  const seasonOptions = [
    "Summer",
    "Winter",
    "Spring",
    "Autumn"
  ]

  const glassTypeOptions = Array.from(new Set(
    cocktailsData.cocktails.map(cocktail => cocktail.glass_type)
  )).sort();

  return (
    <div className="search-interface">
      <div id="search-block" className="search-block">
        <div className="container">
          <div className="search-controls">
          <h2>Seasonal Association</h2>
            <div className="select-wrapper">
              <select 
                className="select" 
                multiple 
                value={selectedSeasons} 
                onChange={handleSeasonChange}>
                <option value="">Select Season</option>
                {seasonOptions.map((opt) => (
                  <option key={opt} value={opt} >
                    {opt}
                  </option>
                ))}
              </select>
              <div className="select-arrow" />
            </div>
            <h2>Glass Type</h2>
            <div className="select-wrapper">
              <select 
              className="select" 
              multiple 
              value={selectedGlassTypes} 
              onChange={handleGlassTypeChange} >
                <option value="">Select Glass Type</option>
                { glassTypeOptions.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                  ))}
                </select>
                <div className="select-arrow" />
              </div>
            </div>
            <div className="results-grid">
                { allSelected && filteredCocktails.length > 0 ? (
                  filteredCocktails.map((cocktail: Cocktail, index: number) => (
                    <ResultCard 
                      index={index}
                      key={index}
                      cocktail={cocktail}
                    />
                  ))
                ) : (
                 <NoneFound/>
                )}
              </div>
        </div>
      </div>
    </div>
  );
};

export default App;