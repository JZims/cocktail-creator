interface Ingredient {
    name: string;
    measurement_fl_oz: number;
  }
  
  interface SeasonalAssociation {
    season: string;
  }
  
  interface FlavorProfile {
    flavor: string;
  }
  
  interface Cocktail {
    name: string;
    ingredients: Ingredient[];
    seasonal_associations: SeasonalAssociation[];
    glass_type: string;
    method: string;
    strength: string;
    garnish: string;
    flavor_profile: FlavorProfile[];
  }
  
  export interface ResultCardProps {
    cocktail: Cocktail;
  }