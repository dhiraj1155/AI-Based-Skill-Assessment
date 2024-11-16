import pandas as pd

# Load the dataset
input_file_path = r"/Users/apple/Desktop/ALGO's 2/data/data_skills_pos.xlsx"  # Path to your Excel file
output_file_path = r"/Users/apple/Desktop/ALGO's 2/data/job_positions.csv"  # Path for the output CSV file

# Read the dataset from the Excel file
try:
    df = pd.read_excel(input_file_path)
except FileNotFoundError as e:
    print(f"Error: {e}")
    exit(1)
except ImportError as e:
    print("Error: Missing required library. Please install openpyxl.")
    exit(1)

# Check the first few rows to understand its structure
print(df.head())

# Function to reformat skills
def format_skills(skills):
    # Split by pipe and strip any leading/trailing whitespace
    return ','.join([skill.strip() for skill in skills.split('|')])

# Apply the formatting function to the skills column
df['skills'] = df['skills'].apply(format_skills)

# Rename the columns to the desired format
df.columns = ['position', 'keywords']

# Save the reformatted dataset to a new CSV file
df.to_csv(output_file_path, index=False)

print("Reformatted dataset saved successfully!")
