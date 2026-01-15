/* import React from "react";
import { Row, Col, Placeholder } from "react-bootstrap";
import MainCard from "components/MainCard";

const SkeletonDetails = () => {
  return (
    <Row className="justify-content-center">
      <Col md={8} lg={6}>
        <MainCard>
          <div className="d-flex align-items-start mb-4">
            <Placeholder as="div" animation="glow" className="me-3">
              <Placeholder
                className="rounded-circle"
                style={{ width: "80px", height: "80px" }}
              />
            </Placeholder>

            <div className="mt-2 w-100">
              <Placeholder as="h4" animation="glow">
                <Placeholder xs={6} />
              </Placeholder>
              <Placeholder as="p" animation="glow">
                <Placeholder xs={4} />
              </Placeholder>
            </div>
          </div>
          {[1, 2, 3].map((i) => (
            <Placeholder
              as="div"
              animation="glow"
              key={i}
              className="mb-3 d-flex align-items-center"
            >
              <Placeholder xs={1} className="me-3" style={{ height: "20px" }} />
              <Placeholder xs={8} />
            </Placeholder>
          ))}
        </MainCard>
      </Col>
    </Row>
  );
};

export default SkeletonDetails;
 */
