import pandas as pd
import os
import re
from dotenv import load_dotenv
dotenv_path = os.path.join(os.path.dirname(__file__),'.env')
load_dotenv(dotenv_path)


def parse_ingredient(ingredient_row):
    """
    Parse ingredients and normalize measurements while handling numeric prefixes
    """
    if pd.notna(ingredient_row["measure"]) and type(ingredient_row["measure"]) == str:
            measure = ingredient_row["measure"]
            if any(char.isdigit() for char in measure):
                measure = re.split(r'(\d+)', measure)
                trimmed_list = [s.strip() for s in measure if s.strip()]
                str_value_measurement = str(trimmed_list[0] + " " + trimmed_list[1].title())
                return {"name": ingredient_row["ingredients"], "measurement_fl_oz": str_value_measurement}
            return {"name": ingredient_row["ingredients"], "measurement_fl_oz": ingredient_row["measure"]}

    elif type(ingredient_row["measure"]) == int or float:
        return {"name": ingredient_row["ingredients"], "measurement_fl_oz": ingredient_row["measure"]}
        
            
        

def initialize_ingredient(ingredient_row):
    container = []
    container.append(parse_ingredient(ingredient_row))
    return container


def standardize_flavor_profiles(flavor_input):
    """
    Standardizes flavor profile strings or lists into consistent format.
    Args:
        flavor_input: Either a string or list of flavor profiles
    Returns:
        list: Standardized list of flavor profiles
    """
    flavors = []
    if not flavor_input:
        return flavors
        
    # Convert input to list if it's a string
    raw_flavors = []
    if isinstance(flavor_input, str):
        raw_flavors = [f.strip() for f in flavor_input.replace('&', ',').split(',')]
    elif isinstance(flavor_input, list):
        raw_flavors = flavor_input
    
    # Comprehensive flavor mapping
    flavor_mapping = {
        # Sweet variations
        'Dry Sweet': ['Dry', 'Sweet'],
        'Dry sweet': ['Dry', 'Sweet'],
        'Dry-Sweet': ['Dry', 'Sweet'],
        'Dry Sour': ['Dry', 'Sour'],
        'Dry-Sour': ['Dry', 'Sour'],
        'Sweet and Sour': ['Sweet', 'Sour'],
        'Sweet Sour': ['Sweet', 'Sour'],
        'Sweet and sour': ['Sweet', 'Sour'],
        'Sweet & sour': ['Sweet', 'Sour'],
        'Sweet & Sour': ['Sweet', 'Sour'],
        'Bitter Sweet': ['Bitter', 'Sweet'],
        # Spelling standardization
        'Smoky': 'Smokey',
        'Effervecent': 'Effervescent',
        'Spice': 'Spicy',
        
        # Compound flavors
        'Sweet Tropical': ['Sweet', 'Tropical'],
        'Dry Herbal': ['Dry', 'Herbal'],
        'Sweet Fruity': ['Sweet', 'Fruity'],
        'Sweet Spicy': ['Sweet', 'Spicy'],
    }
    
    # Process each flavor
    for flavor in raw_flavors:
        if isinstance(flavor, str):
            flavor = flavor.strip()
            if flavor:
                # Apply standardization mapping
                standardized = flavor_mapping.get(flavor, flavor)
                
                # Handle array results from mapping
                if isinstance(standardized, list):
                    flavors.extend(standardized)
                else:
                    flavors.append(standardized)
    
    # Remove duplicates while preserving order
    return list(dict.fromkeys(flavors))

def parse_list(cell):
    """
    Splits a comma-separated string into a list of trimmed strings.
    Used for seasonal_associations and flavor_profile.
    """
    if pd.notna(cell):
        return [x.strip() for x in cell.split(',') if x.strip()]
    
def excel_clean():
    excel_path = os.getenv('UNCLEAN_XLSX_INPUT')
    output_path = os.getenv('CLEANED_XLSX_OUTPUT')
    df = pd.read_excel(excel_path)
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
                "ingredients": initialize_ingredient(row),
                "method": row["method"].title() if pd.notna(row["method"]) else "",
                "glass_type": row["glass_type"] if pd.notna(row["glass_type"]) else "Any",
                "ice_type": row["ice_type"].title() if pd.notna(row["ice_type"]) and row["ice_type"] != "-" else "Any",
                "garnish": row["garnish"].title() if pd.notna(row["garnish"]) else "Any",
                "seasonal_associations": parse_list(row["seasonal_associations"]),
                "strength": row["strength"].title() if pd.notna(row["strength"]) else "",
                "flavor_profile": standardize_flavor_profiles(row["flavor_profile"])
            }
        elif current_cocktail is not None:
            # Append any additional valid data to existing cocktail
            if pd.notna(row["ingredients"]) and current_cocktail["ingredients"]:
                current_ingredients = current_cocktail["ingredients"]
                new_ingredient = parse_ingredient(row)
                if isinstance(new_ingredient, dict):
                    current_ingredients.append(new_ingredient)

            if pd.notna(row["seasonal_associations"]):
                cocktail_sa = current_cocktail["seasonal_associations"]
                cocktail_sa.append(row["seasonal_associations"])

            if pd.notna(row["flavor_profile"]):
                current_cocktail["flavor_profile"].extend(
                    standardize_flavor_profiles(row["flavor_profile"])
                )
                # Re-standardize the complete list to remove duplicates
                current_cocktail["flavor_profile"] = standardize_flavor_profiles(
                    current_cocktail["flavor_profile"]
                )

    if current_cocktail is not None:

        cocktails.append(current_cocktail)

    pd.DataFrame(cocktails).to_json(output_path, orient='records', indent=4)

excel_clean()