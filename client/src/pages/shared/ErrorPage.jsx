import React from "react";
import { useNavigate } from "react-router-dom";

export const ErrorPage = ({ role }) => {
  const navigate = useNavigate();

  return (
    <>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          backgroundColor: "#f5f5f5",
        }}
      >
        <div style={{ textAlign: "center", padding: "20px" }}>
          <h1 style={{ textAlign: "center", padding: "20px", color: "black" }}>
            404 - Page Not Found!
          </h1>
          <button className="btn btn-accent" onClick={() => navigate("/")}>
            Back To Home
          </button>
        </div>
      </div>
    </>
  );
};
