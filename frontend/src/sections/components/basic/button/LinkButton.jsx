import Button from "react-bootstrap/Button";
import Stack from "react-bootstrap/Stack";
import MainCard from "components/MainCard";

export default function LinkButton() {
  return (
    <MainCard title="Link">
      <Stack direction="horizontal" gap={2} className="flex-wrap">
        <Button href="#">Primary link</Button>
        <Button disabled href="#">
          Disabled Primary link
        </Button>
        <Button className="btn-link-success" href="#">
          Light Success link
        </Button>
      </Stack>
    </MainCard>
  );
}
