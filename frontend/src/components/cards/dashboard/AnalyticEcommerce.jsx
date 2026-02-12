import React from "react";
import PropTypes from "prop-types";
import MainCard from "components/MainCard";

export default function AnalyticEcommerce({
  title,
  count,
  icon,
  color = "primary",
}) {
  const iconBgStyle = {
    width: "50px",
    height: "50px",
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: `var(--bs-${color}, #3b82f6)`,
    opacity: 0.15,
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
  };

  const iconStyle = {
    fontSize: "24px",
    color: `var(--bs-${color}, #3b82f6)`,
    position: "relative",
    zIndex: 1,
  };

  return (
    <MainCard content={false} className="card-hover-effect">
      <div className="p-4 position-relative">
        <div className="d-flex align-items-center justify-content-between">
          <div>
            <h6
              className="text-muted mb-2 text-uppercase fw-semibold"
              style={{ fontSize: "0.75rem", letterSpacing: "1px" }}
            >
              {title}
            </h6>
            <h3 className="mb-0 fw-bold">{count}</h3>
          </div>
          <div
            className="d-flex align-items-center justify-content-center"
            style={{
              position: "relative",
              width: "50px",
              height: "50px",
              borderRadius: "50%",
              overflow: "hidden", // Ensure bg stays within circle
            }}
          >
            <div style={iconBgStyle}></div>
            <i className={`${icon}`} style={iconStyle} />
          </div>
        </div>
      </div>
    </MainCard>
  );
}

AnalyticEcommerce.propTypes = {
  title: PropTypes.string,
  count: PropTypes.number,
  icon: PropTypes.string,
  color: PropTypes.string,
};
