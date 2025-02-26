import { useState } from "react";
import { ResultCard } from "./components/result-card";
import { NoneFound } from "./components/none-found";
import cocktailsData from "./assets/scripts/output/veda_cocktails_xlsx.json";



const App = () => {
  const [selectedSeasons, setSelectedSeasons] = useState<string[]>([]);
  const [selectedGlassTypes, setSelectedGlassTypes] = useState<string[]>([]);
  const [selectedFlavorProfiles, setSelectedFlavorProfiles] = useState<
    string[]
  >([]);
  const [selectedBaseSpirit, setSelectedBaseSpirit] = useState<string[]>([])

  const allSelected =
    selectedGlassTypes[0] && selectedSeasons[0] && selectedFlavorProfiles[0] && selectedBaseSpirit[0];

  const filteredCocktails = cocktailsData.filter((cocktail) => {
    const seasonMatch =
      selectedSeasons.length === 0 ||
      cocktail.seasonal_associations.some((sa) =>
        selectedSeasons.includes(sa)
      );

    const glassMatch =
      selectedGlassTypes.length === 0 ||
      selectedGlassTypes.includes(cocktail.glass_type);

    const flavorProfileMatch =
      selectedFlavorProfiles.length === 0 ||
      cocktail.flavor_profile.some((fp) => selectedFlavorProfiles.includes(fp));

    const baseSpiritMatch =
      selectedBaseSpirit.length === 0 ||
      selectedBaseSpirit.includes(cocktail.ingredients[0].name);

    return seasonMatch && glassMatch && flavorProfileMatch && baseSpiritMatch;
  });

  const capitalizeFirstLetter = function (string: string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  };

  const handleSeasonChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = Array.from(
      e.target.selectedOptions,
      (option) => option.value
    );
    setSelectedSeasons(value);
  };

  const handleGlassTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = Array.from(
      e.target.selectedOptions,
      (option) => option.value
    );
    setSelectedGlassTypes(value);
  };

  const handleBaseSpiritChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = Array.from(
      e.target.selectedOptions,
      (option) => option.value
    );
    setSelectedBaseSpirit(value);
  };

  const handleFlavorProfileChange = (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const value = Array.from(
      e.target.selectedOptions,
      (option) => option.value
    );
    setSelectedFlavorProfiles(value);
  };

  const seasonOptions = ["Summer", "Winter", "Spring", "Autumn"];

  const glassTypeOptions = Array.from(
    new Set(cocktailsData.map((cocktail) => cocktail.glass_type))
  ).sort();

  const flavorProfileOptions = Array.from(
    new Set(
      cocktailsData
        .map((cocktail) => cocktail.flavor_profile)
        .map((fps) => fps.map((fp) => fp.toLowerCase()))
        .reduce((acc, val) => acc.concat(val), [])
        .map((fp) => capitalizeFirstLetter(fp))
    )
  ).sort();

  const baseSpiritOptions = Array.from(
      new Set(
        cocktailsData
        .map(cocktail => cocktail.ingredients[0].name)
        .sort()
      )
  )

  return (
    <div className="search-interface">
      <div id="search-block" className="search-block">
        <div className="container">
          <div className="search-controls">

            <div className="selection-box-wrapper">
              <h2>Seasonal Associations</h2>
              <div className="select-wrapper">
                <select
                  className="select"
                  multiple
                  value={selectedSeasons}
                  onChange={handleSeasonChange}
                >
                  {seasonOptions.map((opt) => (
                    <option key={opt} value={opt}>
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
                  onChange={handleGlassTypeChange}
                >
                  {glassTypeOptions.map((opt) => (
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
                  onChange={handleFlavorProfileChange}
                >
                  {flavorProfileOptions.map((flavor) => (
                    <option key={flavor} value={flavor}>
                      {flavor}
                    </option>
                  ))}
                  )
                </select>
              </div>
            </div>

            <div className="selection-box-wrapper">
              <h2> Base Spirit </h2>
              <div className="select-wrapper">
                <select
                  className="select"
                  multiple
                  value={selectedBaseSpirit}
                  onChange={handleBaseSpiritChange}
                >
                  {baseSpiritOptions.map((spirit) => (
                    <option key={spirit} value={spirit}>
                      {spirit}
                    </option>
                  ))}
                  )
                </select>
              </div>
            </div>

          </div>
          <div className="results-grid">
            {allSelected && filteredCocktails.length > 0 ? (
              filteredCocktails.map((cocktail, index: number) => (
              <ResultCard 
                key={cocktail.name} 
                index = {index}
                cocktail={cocktail} 
              />
              ))
            ) : (
              <NoneFound />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
