import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

const CourseCard = ({ image, title, description, link }) => {
  return (
    <div className="card" style={{ width: '18rem',height:'32rem', margin: '10px' }}>
      <img className="card-img-top" src={image} alt={`${title} image`} />
      <div className="card-body">
        <h5 className="card-title">{title}</h5>
        <p className="card-text">{description}</p>
        <a href={link} className="btn btn-primary" >
          Explore Course
        </a>
      </div>
    </div>
  );
};

export default CourseCard;
