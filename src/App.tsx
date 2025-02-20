

import { useState } from 'react';
import { ResultCard} from "./components/result-card";
import { NoneFound } from './components/none-found';
import cocktailsData from './assets/scripts/output/veda_cocktails.json';

interface Cocktail {
  name: string;
  ingredients: { name: string; measurement_fl_oz: number | string}[];
  seasonal_associations: { season: string }[];
  glass_type: string;
  method: string;
  strength: string;
  garnish: string;
  flavor_profile: string[];
}

const App = () => {
  const [selectedSeasons, setSelectedSeasons] = useState<string[]>([]);
  const [selectedGlassTypes, setSelectedGlassTypes] = useState<string[]>([]);
  const [selectedFlavorProfiles, setSelectedFlavorProfiles] = useState<string[]>([]);

  const allSelected = selectedGlassTypes[0] && selectedSeasons[0] && selectedFlavorProfiles[0];
  
  const filteredCocktails = cocktailsData.cocktails.filter(cocktail => {
    const seasonMatch = selectedSeasons.length === 0 || 
      cocktail.seasonal_associations.some(sa => 
        selectedSeasons.includes(sa.season)
      );
  
    const glassMatch = selectedGlassTypes.length === 0 || 
      selectedGlassTypes.includes(cocktail.glass_type);

    const flavorProfileMatch = selectedFlavorProfiles.length === 0 ||
      cocktail.flavor_profile.some(fp =>
        selectedFlavorProfiles.includes(fp)
      );
  
    return seasonMatch && glassMatch && flavorProfileMatch;
  });

  const capitalizeFirstLetter = function (string:string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  const handleSeasonChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = Array.from(e.target.selectedOptions, option => option.value);
    setSelectedSeasons(value);
  };
  
  const handleGlassTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = Array.from(e.target.selectedOptions, option => option.value);
    setSelectedGlassTypes(value);
  };

  const handleFlavorProfileChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = Array.from(e.target.selectedOptions, option => option.value);
    setSelectedFlavorProfiles(value);
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

  const flavorProfileOptions = Array.from(new Set(
    cocktailsData.cocktails.map(cocktail => cocktail.flavor_profile)
    .map(fps => fps.map(fp => fp.toLowerCase()))
    .reduce(
      (acc, val) => acc.concat(val), []
    )
    .map(fp => capitalizeFirstLetter(fp))
  )).sort();

  return (
    <div className="search-interface">
      <div id="search-block" className="search-block">
        <div className="container">
          <div className="search-controls">
            <div className = "selection-box-wrapper">
              <h2>Seasonal Associations</h2>
            <div className="select-wrapper">
              <select 
                className="select" 
                multiple 
                value={selectedSeasons} 
                onChange={handleSeasonChange}>
                
                {seasonOptions.map((opt) => (
                  <option key={opt} value={opt} >
                    {opt}
                  </option>
                ))}
              </select>
              
            </div>
            </div>
          
            <div className="selection-box-wrapper">
            <h2>Glass Type</h2>
            <div className="select-wrapper">
              <select 
                className="select" 
                multiple 
                value={selectedGlassTypes} 
                onChange={handleGlassTypeChange} >
                
                { glassTypeOptions.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                  ))}
                </select>
                
              </div>
            </div>

            <div className="selection-box-wrapper">
            <h2> Flavor Profile </h2>
            <div className="select-wrapper">
              <select 
                className="select" 
                multiple 
                value={selectedFlavorProfiles} 
                onChange={handleFlavorProfileChange} >
                
                { flavorProfileOptions.map((flavor) => (
                      <option key={flavor} value={flavor}>
                        {flavor}
                      </option>
                    ))
                  })
                </select>

              
                
              </div>
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