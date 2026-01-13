import Form from "react-bootstrap/Form";
import MainCard from "components/MainCard";

export default function DataList() {
  return (
    <MainCard title="Data List">
      <Form>
        <div className="mb-3">
          <Form.Label>Datalist example</Form.Label>
          <Form.Control
            className="form-control"
            list="datalistOptions"
            id="exampleDataList"
            placeholder="Type to search..."
          />
        </div>
      </Form>
    </MainCard>
  );
}
