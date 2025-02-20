import { ResultCardProps } from '../types/ResultCard';

export function ResultCard({cocktail, index}: ResultCardProps & { index: number }) {
  const { 
    name,
    ingredients, 
    glass_type, 
    garnish, 
    method, 
    strength, 
    flavor_profile 
  } = cocktail;

  return (
    <div className="result-card" style={{"--animation-order": index} as React.CSSProperties} >
      <div className="result-card-image">
      </div>
      <div className="result-card-content">
        <h3 className="result-card-title">{name}</h3>
        <ul className="result-card-details">
          <li>Glass: {glass_type}</li>
          <li>
            <ul>Ingredients: {ingredients.map(ingredient => 
                <li>{ingredient.name}: {
                  typeof ingredient.measurement_fl_oz == 'string' ? ingredient.measurement_fl_oz : ingredient.measurement_fl_oz + " fl oz"
                  }</li>
                )}
            </ul>
         </li>
          <li>Method: {method}</li>
          <li>Strength: {strength}</li>
          <li>Flavor Profile: {flavor_profile.map(profile => profile).join(', ')}</li>
          <li>Garnish with: {garnish} </li>

        </ul>
      </div>
    </div>
  );
}