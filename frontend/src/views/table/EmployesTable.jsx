import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import EmployesTable from "@/sections/employes/EmployesTable";

export default function BasicTablePage() {
  return (
    <Row>
      <Col sm={12}>
        <EmployesTable />
      </Col>
    </Row>
  );
}
