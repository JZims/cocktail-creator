import { ResultCardProps } from '../types/ResultCard';

export function ResultCard({ cocktail }: ResultCardProps) {
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
    <div className="result-card">
      <div className="result-card-image">
      </div>
      <div className="result-card-content">
        <h3 className="result-card-title">{name}</h3>
        <div className="result-card-details">
          <p>Glass: {glass_type}</p>
          <p>Ingredients: {ingredients.map(ingredient => ingredient.name).join(', ')}</p>
          <p>Method: {method}</p>
          <p>Strength: {strength}</p>
          <p>Flavor Profile: {flavor_profile.map(profile => profile.flavor).join(', ')}</p>
          <p>Garnish with: {garnish}</p>

        </div>
      </div>
    </div>
  );
}