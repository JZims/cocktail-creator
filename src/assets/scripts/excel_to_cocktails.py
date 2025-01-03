
import pandas as pd
import json

def excel_to_cocktails_json(csv_path, json_output_path):
    # Read Excel file
    df = pd.read_csv(csv_path)

    print("DataFrame head:")
    print(df.head())
    
    # Initialize cocktails list
    cocktails = []
    
    # Iterate through each row in DataFrame
    for index, row in df.iterrows():

        print(f"\nProcessing row {index}:")
        

        # Parse ingredients from potential comma-separated strings
        ingredients_list = []
        if 'ingredients' in row and pd.notna(row['ingredients']):
            raw_ingredients = row['ingredients'].split(',')
            for ingredient in raw_ingredients:
                if ':' in ingredient:
                    name, measurement = ingredient.split(':')
                    ingredients_list.append({
                        "name": name.strip(),
                        "measurement_fl_oz": float(measurement.strip())
                    })
        
        # Parse seasonal associations
        seasonal_list = []
        if 'seasonal_associations' in row and pd.notna(row['seasonal_associations']):
            seasons = row['seasonal_associations'].split(',')
            for season in seasons:
                seasonal_list.append({"season": season.strip()})
        
        flavor_profile = []
        if 'flavor_profile' in row and pd.notna(row['flavor_profile']):
            flavors = row['flavor_profile'].split(',')
            for flavor in flavors:
                flavor_profile.append({"flavor": flavor.strip()})

        # Future add for flavor profile score
        # flavor_profile = {}
        # if all(x in row for x in ['sweet', 'sour', 'bitter', 'salty']):
        #     flavor_profile = {
        #         "sweet": int(row['sweet']) if pd.notna(row['sweet']) else 0,
        #         "sour": int(row['sour']) if pd.notna(row['sour']) else 0,
        #         "bitter": int(row['bitter']) if pd.notna(row['bitter']) else 0,
        #         "salty": int(row['salty']) if pd.notna(row['salty']) else 0
        #     }
        
        # Create cocktail dictionary
        cocktail = {
            "name": row.get('name', ''),
            "ingredients": ingredients_list,
            "seasonal_associations": seasonal_list,
            "base_spirit": row.get('base_spirit', ''),
            "glass_type": row.get('glass_type', ''),
            "method": row.get('method', ''),
            "strength": row.get('strength', ''),
            "garnish": row.get('garnish', ''),
            "flavor_profile": flavor_profile
        }
        print(f"Created cocktail entry: {cocktail}")
        cocktails.append(cocktail)
    
    # Create final dictionary
    output = {"cocktails": cocktails}
    
    # Write to JSON file
    with open(json_output_path, 'w', encoding='utf-8') as f:
        json.dump(output, f, indent=4)

# Usage example
csv_path = 'data/veda_cocktails_cleaned.csv'
json_output_path = 'output/cocktails.json'
excel_to_cocktails_json(csv_path, json_output_path)