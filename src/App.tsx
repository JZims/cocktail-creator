import { useState } from "react";
import { ResultCard } from "./components/result-card";
import { NoneFound } from "./components/none-found";
import cocktailsData from "./assets/scripts/output/veda_cocktails_xlsx.json";
import Select, { MultiValue } from "react-select";

type OptionType = {
  label: string;
  value: string;
};


const App = () => {
  const [selectedSeasons, setSelectedSeasons] = useState<MultiValue<OptionType>>([]);
  const [selectedGlassTypes, setSelectedGlassTypes] = useState<MultiValue<OptionType>>([]);
  const [selectedFlavorProfiles, setSelectedFlavorProfiles] = useState<MultiValue<OptionType>>([]);
  const [selectedBaseSpirit, setSelectedBaseSpirit] = useState<MultiValue<OptionType>>([]);

  const allSelected =
    selectedGlassTypes[0] || selectedSeasons[0] || selectedFlavorProfiles[0] || selectedBaseSpirit[0];

  const filteredCocktails = cocktailsData.filter((cocktail) => {
    const seasonMatch =
      selectedSeasons.length === 0 ||
      cocktail.seasonal_associations.some((sa) =>
        selectedSeasons.some(option => option.value === sa)
      );
    
      const glassMatch =
        selectedGlassTypes.length === 0 ||
        selectedGlassTypes.some(option => option.value === cocktail.glass_type);
    
      const flavorProfileMatch =
        selectedFlavorProfiles.length === 0 ||
        cocktail.flavor_profile.some((fp) => 
          selectedFlavorProfiles.some(option => option.value === fp)
        );
    
      const baseSpiritMatch =
        selectedBaseSpirit.length === 0 ||
        selectedBaseSpirit.some(option => option.value === cocktail.ingredients[0].name);
    
      return seasonMatch && glassMatch && flavorProfileMatch && baseSpiritMatch;
    });

  const capitalizeFirstLetter = function (string: string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  };

  const seasonOptions = [
    { label: "Summer", value: "Summer" },
    { label: "Winter", value: "Winter" },
    { label: "Spring", value: "Spring" },
    { label: "Autumn", value: "Autumn" }
  ];

  const glassTypeOptions = Array.from(
    new Set(cocktailsData.map((cocktail) => cocktail.glass_type))
  ).sort().map(type => ({
    label: type, 
    value: type,
  }));

  const flavorProfileOptions = Array.from(
    new Set(
      cocktailsData
        .map((cocktail) => cocktail.flavor_profile)
        .map((fps) => fps.map((fp) => fp.toLowerCase()))
        .reduce((acc, val) => acc.concat(val), [])
        .map((fp) => capitalizeFirstLetter(fp))
    )
  ).sort().map(type => ({
    label: type, 
    value: type,
  }));

  const baseSpiritOptions = Array.from(
      new Set(
        cocktailsData
        .map(cocktail => capitalizeFirstLetter(cocktail.ingredients[0].name))
        .sort()
        )
  ).map(type => ({
    label: type, 
    value: type,
  }))

  return (
    <div className="search-interface">
      <div id="search-block" className="search-block">
        <div className="container">
          <div className="search-controls">
            <div className="selection-box-wrapper">
              <h2>Seasonal Associations</h2>
              <div className="select-wrapper">
              <Select
                  closeMenuOnSelect={false}
                  className="select"
                  options={seasonOptions}
                  isMulti
                  value={selectedSeasons}
                  onChange={(newValue) => setSelectedSeasons(newValue)}
                />
              </div>
            </div>

            <div className="selection-box-wrapper">
              <h2>Glass Type</h2>
              <div className="select-wrapper">
              <Select
                  closeMenuOnSelect={false}
                  className="select"
                  options={glassTypeOptions}
                  isMulti
                  value={selectedGlassTypes}
                  onChange={(newValue) => setSelectedGlassTypes(newValue)}
                />
              </div>
            </div>

            <div className="selection-box-wrapper">
              <h2> Flavor Profile </h2>
              <div className="select-wrapper">
              <Select
                closeMenuOnSelect={false}
                className="select"
                options={flavorProfileOptions}
                isMulti
                value={selectedFlavorProfiles}
                onChange={(newValue) => setSelectedFlavorProfiles(newValue)}
              />
              </div>
            </div>

            <div className="selection-box-wrapper">
              <h2> Base Spirit </h2>
              <div className="select-wrapper">
              <Select
                  closeMenuOnSelect={false}
                  className="select"
                  options={baseSpiritOptions}
                  isMulti
                  value={selectedBaseSpirit}
                  onChange={(newValue) => setSelectedBaseSpirit(newValue)}
                />
              </div>
            </div>

          </div>
          <div className="reset-field">
            <button
              onClick={() => {
                setSelectedSeasons([]);
                setSelectedGlassTypes([]);
                setSelectedFlavorProfiles([]);
                setSelectedBaseSpirit([]);
              }}
            >
              Reset
            </button>
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
