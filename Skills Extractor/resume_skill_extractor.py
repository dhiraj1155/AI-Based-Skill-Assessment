import streamlit as st
import fitz  # PyMuPDF
import pandas as pd


# Function to load skills from a CSV file
def load_skills(file_path):
    df = pd.read_csv(file_path)
    return df['skill'].tolist()


# Function to load job positions and their skills from a CSV file with weighting
def load_job_positions(file_path):
    df = pd.read_csv(file_path)
    job_positions = {}
    for _, row in df.iterrows():
        skills = row['skills'].split(',')
        core_skills = row['core_skills'].split(',') if 'core_skills' in df.columns else []  # New column for core skills
        job_positions[row['position']] = {
            'skills': [skill.strip().lower() for skill in skills],  # Normalize skills
            'core_skills': [skill.strip().lower() for skill in core_skills]  # Normalize core skills
        }
    return job_positions


# Function to extract skills from the text
def extract_skills(text, skills):
    # Convert text to lower case for matching
    text = text.lower()
    found_skills = set()

    for skill in skills:
        if skill.lower() in text:
            found_skills.add(skill.lower())  # Normalize extracted skills

    return found_skills


# Function to read the PDF and extract text
def read_pdf(uploaded_file):
    text = ""
    # Open the uploaded file as a PDF document
    with fitz.open(stream=uploaded_file.read(), filetype="pdf") as pdf_document:
        for page in pdf_document:
            text += page.get_text()
    return text


# Function to match skills with job positions
def match_job_positions(found_skills, job_positions):
    matching_positions = {}

    for position, details in job_positions.items():
        required_skills = details['skills']
        core_skills = details.get('core_skills', [])

        # Calculate score based on matching skills
        matched_skills = [skill for skill in required_skills if skill in found_skills]
        matched_core_skills = [skill for skill in core_skills if skill in found_skills]

        # Assign higher score for core skills
        core_score = len(matched_core_skills) * 2
        secondary_score = len(matched_skills)

        # Calculate the total score with weighted core skills
        total_score = core_score + secondary_score

        # Debugging logs
        print(
            f"Position: {position}, Matched Core Skills: {matched_core_skills}, Core Score: {core_score}, Secondary Score: {secondary_score}")

        # Set a threshold that prioritizes core skills presence but allow secondary skills if no core skills
        if len(matched_core_skills) > 0 or secondary_score > 0:  # Relax the core skill requirement
            matching_positions[position] = {
                "score": total_score,
                "matched_skills": matched_skills + matched_core_skills
            }

    return matching_positions


def main():
    st.title("Resume Skill Extractor with Job Positions")

    # Load skills from the CSV file located at the specified path

    # skills_path = 'D:\\AI-BASED CARRER COUNSELLING PLATFORM\\ALGO\'s 2\\data\\skills.csv'
    # job_positions_path = 'D:\\AI-BASED CARRER COUNSELLING PLATFORM\\ALGO\'s 2\\data\\job_positions.csv'

    skills_path = './data/skills.csv'
    job_positions_path = './data/job_positions.csv'

    # Load skills and job positions
    try:
        skills = load_skills(skills_path)
        job_positions = load_job_positions(job_positions_path)
    except FileNotFoundError as e:
        st.error(f"Error loading files: {e}")
        return

    # File uploader widget
    uploaded_file = st.file_uploader("Upload a Resume (PDF)", type=["pdf"])

    if uploaded_file is not None:
        # Read the PDF file
        text = read_pdf(uploaded_file)

        # Extract skills from the text
        found_skills = extract_skills(text, skills)

        # Find matching job positions based on extracted skills
        matching_positions = match_job_positions(found_skills, job_positions)

        # Sort positions by score in descending order and limit the output
        sorted_positions = sorted(matching_positions.items(), key=lambda item: item[1]['score'], reverse=True)[:2]

        # Display the results
        if found_skills:
            st.subheader("Extracted Skills:")
            st.write(", ".join(found_skills))
            st.write(f"Total skills found: {len(found_skills)}")
        else:
            st.write("No skills found.")

        if sorted_positions:
            st.subheader("Best Matching Job Positions:")
            for position, details in sorted_positions:
                st.write(
                    f"- **{position}** (Score: {details['score']}), Matched Skills: {', '.join(details['matched_skills'])}")
        else:
            st.write(
                "No matching positions found. Try reviewing the skills listed in the resume or the job position dataset.")
            st.write("Ensure that the core skills or job position data in the CSV are comprehensive enough.")


if __name__ == "__main__":
    main()
