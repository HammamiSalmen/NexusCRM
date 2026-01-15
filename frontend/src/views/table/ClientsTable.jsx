import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import ClientsTable from "@/sections/clients/ClientsTable";

export default function BasicTablePage() {
  return (
    <Row>
      <Col sm={12}>
        <ClientsTable />
      </Col>
    </Row>
  );
}
