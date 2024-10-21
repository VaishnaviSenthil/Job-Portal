import React, { useEffect, useState } from "react";
import BusinessIcon from "@mui/icons-material/Business";
import Typography from "@mui/material/Typography";

const CompanyCardsSlider = ({ companyJobs }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Function to advance to the next card
  const nextCard = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % companyJobs.length);
  };

  useEffect(() => {
    const slideInterval = setInterval(nextCard, 2000); // Change the interval as needed

    return () => clearInterval(slideInterval);
  }, [companyJobs]);

  return (
    <div className="slider-container">
      <div className="card-container">
        {companyJobs.map((company, index) => (
          <div
            className={`slider-card ${currentIndex === index ? "active" : ""}`}
            key={index}
          >
            <div className="card-content">
              <Typography
                variant="h5"
                component="h5"
                sx={{
                  display: "flex",
                  alignItems: "center",
                  color: "#0277BD", // Primary color for company name
                  fontSize: "1.5rem",
                  fontWeight: "bold",
                  marginBottom: "10px",
                }}
              >
                <BusinessIcon sx={{ marginRight: 1 }} /> {company.companyName}
              </Typography>
              <p
                style={{
                  fontSize: "1.1rem",
                  color: "#333", // Dark gray for additional information
                  marginBottom: "5px",
                }}
              >
                Available jobs count: {company.jobCount}
              </p>
              <p
                style={{
                  fontSize: "1.1rem",
                  color: "#333", // Dark gray for additional information
                  marginBottom: "10px",
                }}
              >
                Offered Roles: {company.jobTitles.join(", ")}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CompanyCardsSlider;
