import pandas as pd
import os
from dotenv import load_dotenv
dotenv_path = os.path.join(os.path.dirname(__file__),'.env')
load_dotenv(dotenv_path)

# Read the CSV file (assumed to be named 'cocktails.csv')
df = pd.read_csv('./data/VedaCocktailsSheet.csv')

# Group by cocktail, aggregating ingredients into a single string
aggregated = df.groupby('cocktail').agg({
    'ingredient': lambda x: ", ".join(x)
}).reset_index().rename(columns={'ingredient': 'ingredients'})

# Define a function to determine the base spirit (ingredient with maximum value)
def get_base_spirit(group):
    return group.loc[group['value'].idxmax(), 'ingredient']

# Apply the function for each cocktail group
base_spirits = df.groupby('cocktail').apply(get_base_spirit).reset_index().rename(columns={0: 'base_spirit'})

# Merge the aggregated ingredients with the base spirit info
final_df = pd.merge(aggregated, base_spirits, on='cocktail')

# Save the transformed CSV to a new file
final_df.to_csv('cocktails_transformed.csv', index=False)
print(final_df)
