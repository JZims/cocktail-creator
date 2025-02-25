import pandas as pd
import json
import os
from dotenv import load_dotenv
dotenv_path = os.path.join(os.path.dirname(__file__),'.env')
load_dotenv(dotenv_path)
excel_path = os.getenv('UNCLEAN_XLSX_INPUT')
output_path = os.getenv('CLEANED_XLSX_OUTPUT')

# Read the Excel file (update the file name/path as needed)
df = pd.read_excel(excel_path)
# print(df.head(20))


def parse_ingredient(ingredient_str):
   pass

def parse_ingredients(ingredient_row):
    """
    Splits the entire ingredients string by commas,
    then uses parse_ingredient to create a dictionary where the key is the ingredient name
    and the value is its measurement.
    """
    if pd.notna(ingredient_row["ingredients"]):
        print( ingredient_row["ingredients"].title(), ingredient_row["measure"] )
    

    pass

def parse_list(cell):
    """
    Splits a comma-separated string into a list of trimmed strings.
    Used for seasonal_associations and flavor_profile.
    """
    if pd.notna(cell):
        return [x.strip() for x in cell.split(',') if x.strip()]


cocktails = []
current_cocktail = None

for _, row in df.iterrows():
    # Check if we have a valid name to start a new cocktail
    if pd.notna(row["name"]):
        # If we have a previous cocktail, append it to our list
        if current_cocktail is not None:
            cocktails.append(current_cocktail)
        
        # Start a new cocktail
        current_cocktail = {
            "name": row["name"].title(),
            "ingredients": parse_ingredients(row) if pd.notna(row["ingredients"]) else [],
            "method": row["method"].title() if pd.notna(row["method"]) else "",
            "glass_type": row["glass_type"] if pd.notna(row["glass_type"]) else "Any",
            "ice_type": row["ice_type"].title() if pd.notna(row["ice_type"]) and row["ice_type"] != "-" else "Any",
            "garnish": row["garnish"].title() if pd.notna(row["garnish"]) else "Any",
            "seasonal_associations": parse_list(row["seasonal_associations"]),
            "strength": row["strength"].title() if pd.notna(row["strength"]) else "",
            "flavor_profile": parse_list(row["flavor_profile"])
        }
    elif current_cocktail is not None:
        # Append any additional valid data to existing cocktail
        if pd.notna(row["ingredients"]):
            current_ingredients = current_cocktail.get("ingredients", [])
            new_ingredients = parse_ingredients(row["ingredients"])
            if isinstance(new_ingredients, list):
                current_cocktail["ingredients"] = current_ingredients + new_ingredients
            elif isinstance(new_ingredients, dict):
                current_cocktail["ingredients"].update(new_ingredients)

        if pd.notna(row["seasonal_associations"]):
            cocktail_sa = current_cocktail["seasonal_associations"]
            cocktail_sa.append(row["seasonal_associations"])

        if pd.notna(row["flavor_profile"]):
            cocktail_fp = current_cocktail["flavor_profile"]
            cocktail_fp.append(row["flavor_profile"])


# Don't forget to append the last cocktail
if current_cocktail is not None:

    cocktails.append(current_cocktail)

# Write the resulting cocktail data to a JSON file with indentation for readability
with open(output_path, "w") as f:
    json.dump(cocktails, f, indent=4)