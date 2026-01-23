import MainCard from "components/MainCard";
import { Button, Form } from "react-bootstrap";

export default function TaskCard({
  task,
  onStatusChange,
  onDelete,
  isSuperUser,
}) {
  return (
    <MainCard className="mb-2">
      <h6>{task.title}</h6>
      <p className="text-muted">{task.description}</p>

      <Form.Select
        size="sm"
        value={task.status}
        onChange={(e) => onStatusChange(task.id, e.target.value)}
        className="mb-2"
      >
        <option value="TODO">À faire</option>
        <option value="IN_PROGRESS">En cours</option>
        <option value="DONE">Terminée</option>
      </Form.Select>

      {isSuperUser && (
        <Button variant="danger" size="sm" onClick={() => onDelete(task.id)}>
          Supprimer
        </Button>
      )}
    </MainCard>
  );
}
