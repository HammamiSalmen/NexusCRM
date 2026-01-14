import Col from "react-bootstrap/Col";
import Nav from "react-bootstrap/Nav";
import Row from "react-bootstrap/Row";
import Stack from "react-bootstrap/Stack";

export default function Footer() {
  return (
    <footer className="pc-footer">
      <div className="footer-wrapper container-fluid">
        <Row className="justify-content-center justify-content-md-between">
          {/* Footer Text */}
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

          {/* Footer Links */}
          <Col xs="auto" className="my-1">
            <Stack
              direction="horizontal"
              gap={3}
              className="justify-content-center"
            >
              <Nav.Link className="p-0" as="a" href="/">
                Home
              </Nav.Link>
              <Nav.Link
                className="p-0"
                as="a"
                href="#"
                target="_top"
                rel="noopener noreferrer"
              >
                Documentation
              </Nav.Link>
              <Nav.Link
                className="p-0"
                as="a"
                href="#"
                target="_top"
                rel="noopener noreferrer"
              >
                Support
              </Nav.Link>
            </Stack>
          </Col>
        </Row>
      </div>
    </footer>
  );
}
