import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import EmployesTable from "sections/tables/bootstrap-table/basic-table/EmployesTable";

export default function BasicTablePage() {
  return (
    <Row>
      <Col sm={12}>
        <EmployesTable />
      </Col>
    </Row>
  );
}
