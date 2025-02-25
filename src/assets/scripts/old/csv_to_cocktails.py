import pandas as pd
import json
import os
from dotenv import load_dotenv

# Load environment variables
dotenv_path = os.path.join(os.path.dirname(__file__), '.env')
load_dotenv(dotenv_path)

def standardize_flavor_profiles(flavor_raw):
    """Standardizes flavor profile strings into consistent format."""
    flavors = []
    if flavor_raw:
        # Split on multiple possible delimiters
        raw_flavors = [f.strip() for f in flavor_raw.replace('&', ',').split(',')]
        
        # Comprehensive flavor mapping based on CSV analysis
        flavor_mapping = {
            # Sweet variations
            'Dry Sweet': 'Dry-Sweet',
            'Sweet and Sour': 'Sweet & Sour',
            'Sweet Sour': 'Sweet & Sour',
            'Sweet and sour': 'Sweet & Sour',
            'Sweet & sour': 'Sweet & Sour',
            'Sweet & Sour': ['Sweet', 'Sour'],  # Split into array
            
            # Dry variations
            'Dry sweet': 'Dry-Sweet',
            'Dry Sour': 'Dry-Sour',
            
            # Spelling standardization
            'Smoky': 'Smokey',
            'Effervecent': 'Effervescent',
            'Bitter': 'Bittersweet',
            
            # Compound flavors
            'Sweet Tropical': ['Sweet', 'Tropical'],
            'Dry Herbal': ['Dry', 'Herbal'],
            'Sweet Fruity': ['Sweet', 'Fruity'],
            'Sweet Spicy': ['Sweet', 'Spicy'],
            
        }
        
        # Process each flavor
        for flavor in raw_flavors:
            flavor = flavor.strip()
            
            if flavor.lower():
                # Apply standardization mapping
                standardized = flavor_mapping.get(flavor, flavor)
                
                # Handle array results from mapping
                if isinstance(standardized, list):
                    flavors.extend(standardized)
                else:
                    flavors.append(standardized)
    
    # Remove duplicates while preserving order
    return list(dict.fromkeys(flavors))

def transform_csv_to_json_objects(csv_path_or_buffer):
    """
    Reads the CSV data and returns a list of cocktail dictionaries.
    """
    headers = [
        "name", 
        "ingredients",
        "method",
        "glass_type",
        "ice",
        "garnish",
        "seasonal_associations",
        "strength",
        "flavor_profile"
    ]
    # Read the CSV with header
    df = pd.read_csv(csv_path_or_buffer, header=0, names=headers, keep_default_na=False)
    cocktails = []
    current_cocktail = None

    

    for _, row in df.iterrows():
        row_values = row.tolist()
        print(row_values)
        # Start new cocktail if ID exists
        if not pd.isna(row_values[0]):
            if current_cocktail is not None:
                cocktails.append(current_cocktail)

            # Create new cocktail object
            cocktail_name = row_values[1] if not pd.isna(row_values[1]) else ""
            method = row_values[4] if not pd.isna(row_values[4]) else ""
            glass_type = row_values[5] if not pd.isna(row_values[5]) else ""
            garnish = row_values[7] if not pd.isna(row_values[7]) else ""
            strength = row_values[9] if not pd.isna(row_values[9]) else ""
            flavor_raw = row_values[10] if not pd.isna(row_values[10]) else ""
            
            
            current_cocktail = {
                "name": cocktail_name,
                "ingredients": [],
                "method": method,
                "seasonal_associations": [],
                "glass_type": glass_type,
                "strength": strength,
                "garnish": garnish,
                "flavor_profile": standardize_flavor_profiles(flavor_raw)
            }
    
        # Add ingredients and seasons for current cocktail
        if current_cocktail is not None:
            # Process ingredient information
            ingredient_name = row_values[2] if not pd.isna(row_values[2]) else ""
            measurement_raw = row_values[3] if not pd.isna(row_values[3]) else ""

            if ingredient_name:
                measurement_str = str(measurement_raw)
                # Handle special measurement cases
                if any(word in measurement_str.lower() for word in ['dash', 'splash', 'top', 'float']):
                    measurement_val = measurement_str
                else:
                    # Try to convert to float
                    try:
                        measurement_val = float(measurement_str)
                    except ValueError:
                        measurement_val = measurement_str

                current_cocktail["ingredients"].append({
                    "name": ingredient_name,
                    "measurement_fl_oz": measurement_val
                })
            # Process flavor profile
            flavor_raw = row_values[10] if not pd.isna(row_values[10]) else ""
            flavor_profile = standardize_flavor_profiles(flavor_raw)
            current_cocktail["flavor_profile"] = flavor_profile

            # Process seasonal associations
            season = row_values[8] if not pd.isna(row_values[8]) else ""
            if season:
                current_cocktail["seasonal_associations"].append({"season": season})

    # Add the last cocktail
    if current_cocktail is not None:
        cocktails.append(current_cocktail)

    return cocktails

def write_cocktails_to_json(csv_path, json_path):
    """
    Writes the processed cocktail data to a JSON file.
    """
    cocktails = transform_csv_to_json_objects(csv_path)
    with open(json_path, 'w', encoding='utf-8') as f:
        json.dump(cocktails, f, indent=2)

if __name__ == "__main__":
    input_csv = "/Users/jzimms/Development/Veda/Cocktail Creator/cocktail-creator-frontend/src/assets/scripts/data/VedaCocktailsSheet.csv"    
    output_json = "/Users/jzimms/Development/Veda/Cocktail Creator/cocktail-creator-frontend/src/assets/scripts/output/veda_cocktails_test.json"
    
    write_cocktails_to_json(input_csv, output_json)
    print(f"JSON file saved to {output_json}")
