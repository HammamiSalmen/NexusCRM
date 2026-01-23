import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import TableClients from "@/sections/clients/TableClients";

export default function BasicTablePage() {
  return (
    <Row>
      <Col sm={12}>
        <TableClients />
      </Col>
    </Row>
  );
}
