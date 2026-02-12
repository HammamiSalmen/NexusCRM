import Col from "react-bootstrap/Col";
import Nav from "react-bootstrap/Nav";
import Row from "react-bootstrap/Row";
import Stack from "react-bootstrap/Stack";

export default function Footer() {
  return (
    <footer className="pc-footer">
      <div className="footer-wrapper container-fluid">
        <Row className="justify-content-center justify-content-md-between">
          <Col xs="auto" className="my-1">
            <p className="m-0">
              <a
                href="#"
                target="_top"
                rel="noopener noreferrer"
                className="text-primary"
              >
                NexusCRM
              </a>
            </p>
          </Col>
        </Row>
      </div>
    </footer>
  );
}
