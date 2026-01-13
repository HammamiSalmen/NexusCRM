import Form from "react-bootstrap/Form";
import MainCard from "components/MainCard";

export default function Picker() {
  return (
    <MainCard title="Picker">
      <Form>
        <div className="mb-0">
          <Form.Label>Color picker</Form.Label>
          {""}
          <Form.Control type="color" defaultValue="#563d7c" />
        </div>
      </Form>
    </MainCard>
  );
}
