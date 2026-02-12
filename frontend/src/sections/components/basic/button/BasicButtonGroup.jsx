import Button from "react-bootstrap/Button";
import ButtonGroup from "react-bootstrap/ButtonGroup";
import MainCard from "components/MainCard";

export default function BasicButtonGroup() {
  return (
    <MainCard title="Basic Button Group">
      <ButtonGroup>
        <Button>Left</Button>
        <Button>Middle</Button>
        <Button>Right</Button>
      </ButtonGroup>
    </MainCard>
  );
}
