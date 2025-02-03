

import { useState, useEffect } from 'react';
import { ResultCard } from "./components/result-card";
import cocktailsData from './assets/scripts/output/veda_cocktails.json';
import { ResultCardProps } from './types/ResultCard.ts';

const App = () => {
  const [season, setSeason] = useState('');
  const [glassType, setGlassType] = useState('');
  const [results, setResults] = useState<Cocktail[]>([]);
  const [iframeHeight, setIframeHeight] = useState("0px");

  useEffect(() => {
    const updateHeight = () => {
      const searchBlock = document.getElementById("search-block")
      if (searchBlock) {
        const searchBlockHeight = searchBlock.offsetHeight
        const windowHeight = window.innerHeight
        const newHeight = windowHeight - searchBlockHeight
        setIframeHeight(`${newHeight}px`)
      }
    }

    updateHeight()
    window.addEventListener("resize", updateHeight)
    return () => window.removeEventListener("resize", updateHeight)
  }, [])


  const allSelected = season && glassType;

  // Filter cocktails based on selected dropdown values
  //
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

          {allSelected && (
              <div className="results-grid">
                <h2>Matching Cocktails:</h2>
                  {filteredCocktails.length > 0 ? (
                    <ul>
                      {filteredCocktails.map((cocktail: Cocktail, index) => (
                      <ResultCard 
                        key={index}
                        cocktail={cocktail}
                       />
                      ))}
                    </ul>
                   ):
                    ( <p>Select an option from each category.</p>

                  )}
              </div>
            )}
        </div>
      </div>
    </div>
  );
};

export default App;



    // <div className="container">
    //   <div className="dropdowns">
    //     <select className="selection" value={season} onChange={(e) => setSeason(e.target.value)}>
    //       <option value="">Select Season</option>
    //       {seasonOptions.map((season, index) => (
    //         <option key={index} value={season.toLowerCase()}>{season}</option>
    //       ))}
    //     </select>

    //     <select className="selection" value={baseSpirit} onChange={(e) => setBaseSpirit(e.target.value)}>
    //       <option value="">Select Base Spirit</option>
    //       {baseSpiritOptions.map((spirit, index) => (
    //         <option key={index} value={spirit.toLowerCase()}>{spirit}</option>
    //       ))}
    //     </select>

    //     <select className="selection" value={glassType} onChange={(e) => setGlassType(e.target.value)}>
    //       <option value="">Select Glass Type</option>
    //       {glassTyopeOptions.map((glassType, index) => (
    //         <option key={index} value={glassType.toLowerCase()}>{glassType}</option>
    //       ))}
    //     </select>
    //   </div>

    //   <hr></hr>

    //   {allSelected && (
    //     <div className="secondary-box">
    //       <h2>Matching Cocktails:</h2>
    //       {filteredCocktails.length > 0 ? (
    //         <ul>
    //           {filteredCocktails.map((cocktail, index) => (
    //             <li key={index}>{cocktail.name}</li>
    //           ))}
    //         </ul>
    //       ) : (
    //         <p>Select an option from each category.</p>
    //       )}
    //     </div>
    //   )}
    // </div>