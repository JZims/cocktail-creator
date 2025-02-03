import {ResultCardProps} from '../types/ResultCard.ts'

  export function ResultCard({cocktail}: ResultCardProps["cocktail"]) {
    const { ingredients, seasonal_associations, glass_type, garnish, method, strength, flavor_profile }= cocktail

    console.log(ingredients)

    return (
      <div className="result-card">
        <div className="result-card-image">
          
        </div>
        <div className="result-card-content">
          <h3 className="result-card-title">{c}</h3>
          <p className="result-card-description">{description}</p>
        </div>
      </div>
    )
  }
  