
  
interface Cocktail {
  name: string;
  ingredients: { 
    name: string | null; 
    measurement_fl_oz: number | string | null;
  }[];
  method: string;
  glass_type: string;
  ice_type: string;
  garnish: string;
  seasonal_associations: string[];
  strength: string;
  flavor_profile: string[];
}
  export interface ResultCardProps {
    cocktail: Cocktail;
  }