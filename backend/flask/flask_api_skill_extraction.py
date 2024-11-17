from flask import Flask, request, jsonify
from werkzeug.utils import secure_filename
import os
from skill_extraction  import load_skills, read_pdf, extract_skills_from_text

app = Flask(__name__)

# Paths
SKILLS_CSV_PATH = './data/skills.csv'  # Update the path to your CSV file
UPLOAD_FOLDER = './uploads'  # Temporary folder for uploaded files
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

# Load skills from CSV at startup
skills = load_skills(SKILLS_CSV_PATH)

@app.route('/extract-skills', methods=['POST'])
def extract_skills_from_resume():
    if 'resume' not in request.files:
        return jsonify({"error": "No file part in the request"}), 400

    file = request.files['resume']

    if file.filename == '':
        return jsonify({"error": "No file selected for uploading"}), 400

    if file:
        try:
            # Save the uploaded file
            filename = secure_filename(file.filename)
            file_path = os.path.join(app.config['UPLOAD_FOLDER'], filename)
            os.makedirs(app.config['UPLOAD_FOLDER'], exist_ok=True)  # Ensure the upload folder exists
            file.save(file_path)

            # Read the PDF and extract skills
            text = read_pdf(file_path)
            extracted_skills = extract_skills_from_text(text, skills)

            # Remove the temporary file
            os.remove(file_path)

            # Return the extracted skills as a response
            return jsonify({"extracted_skills": extracted_skills}), 200

        except Exception as e:
            return jsonify({"error": str(e)}), 500

    return jsonify({"error": "Unknown error occurred"}), 500


if __name__ == '__main__':
    app.run(debug=True, port=5000)
