import pandas as pd
import json
import os
from dotenv import load_dotenv
dotenv_path = os.path.join(os.path.dirname(__file__),'.env')
load_dotenv(dotenv_path)

def normalize_glass_type(glass_type: str) -> str:
    """Normalize glass type names to standard values."""
    
    # Convert to lowercase for comparison
    glass_type = str(glass_type).lower().strip()
    
    # Mapping of variations to standard names
    glass_mapping = {
        # Old Fashioned variations
        'old-fashioned': 'Old Fashioned',
        'old fashioned': 'Old Fashioned',
        'double old-fashioned': 'Double Old Fashioned',
        'double old fashioned': 'Double Old Fashioned',
        'rocks glass': 'Old Fashioned',
        
        # Nick & Nora variations
        'nick & nora': 'Nick & Nora',
        'nick and nora': 'Nick & Nora',
        'nick n nora': 'Nick & Nora',
        
        # Coupe/Cocktail
        'coupe': 'Coupe',
        'cocktail': 'Coupe',
        'martini': 'Coupe',
        
        # Highball variations
        'highball': 'Highball',
        'collins': 'Collins',
        'hurricane': 'Hurricane'
    }
    
    # Return mapped value or original if no mapping exists
    return glass_mapping.get(glass_type, glass_type.title())

def normalize_measurement(measurement: str) -> str:
    """Normalize measurements, especially handling dashes."""
    if not isinstance(measurement, str):
        return measurement
        
    measurement = str(measurement).strip().lower()
    
    # Handle dash variations
    dash_variations = ['dash', 'dashes', 'dash.', 'dashes.', 'dsh', 'dshs']
    
    for variation in dash_variations:
        if variation in measurement:
            # Extract the number
            try:
                number = ''.join(filter(str.isdigit, measurement))
                if number:
                    number = int(number)
                    return f"{number} {'Dash' if number == 1 else 'Dashes'}"
            except ValueError:
                pass
    
    return measurement

def excel_to_cocktails_json(csv_path, json_output_path):
    # Read Excel file with different handling for empty cells
    df = pd.read_csv(csv_path, keep_default_na=False)
    
    # Initialize cocktails list
    cocktails = []
    current_cocktail = None
    current_ingredients = []
    
    # Iterate through each row in DataFrame
    for index, row in df.iterrows():
        # If we have a cocktail name, this is the start of a new cocktail
        if row['Cocktail Name']:
            # Save the previous cocktail if it exists
            if current_cocktail is not None:
                current_cocktail['ingredients'] = current_ingredients
                cocktails.append(current_cocktail)
            
            # Initialize new cocktail
            current_ingredients = []
            seasons = [s.strip() for s in str(row['Season']).split(',') if s.strip()]
            flavors = [f.strip() for f in str(row['Flavor Profile']).split(',') if f.strip()]
            
            current_cocktail = {
                "name": row['Cocktail Name'],
                "ingredients": [],
                "seasonal_associations": [{"season": season} for season in seasons],
                "glass_type": normalize_glass_type(row['Glass']),
                "method": row['Method'],
                "strength": row['Strength'],
                "garnish": row['Garnish'],
                "flavor_profile": flavors
            }
        
        # Add ingredient if both name and quantity exist
        if row['Ingredients'] and row['Quantity (oz)']:
            current_ingredients.append({
                "name": row['Ingredients'].strip(),
                "measurement_fl_oz": normalize_measurement(row['Quantity (oz)'].strip())
            })
    
    # Don't forget to add the last cocktail
    if current_cocktail is not None:
        current_cocktail['ingredients'] = current_ingredients
        cocktails.append(current_cocktail)
    
    # Create final dictionary and write to JSON
    output = {"cocktails": cocktails}
    with open(json_output_path, 'w', encoding='utf-8') as f:
        json.dump(output, f, indent=4)

# Usage example
csv_path = os.getenv('CSV_PATH')
json_output_path = os.getenv('OUTPUT_PATH')

if not csv_path or not json_output_path:
    raise ValueError("Missing required environment variables. Please check your .env file.")

excel_to_cocktails_json(csv_path, json_output_path)

