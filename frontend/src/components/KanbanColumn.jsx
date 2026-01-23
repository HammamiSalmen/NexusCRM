import { Droppable, Draggable } from "@hello-pangea/dnd";
import { Card, Button, Badge, Stack } from "react-bootstrap";

export default function KanbanColumn({
  title,
  status,
  tasks,
  onDelete,
  onEdit,
  isSuperUser,
}) {
  const getHeaderStyle = (statusKey) => {
    switch (statusKey) {
      case "TODO":
        return { bg: "bg-primary", color: "text-white" };
      case "IN_PROGRESS":
        return { bg: "bg-warning", color: "text-dark" };
      case "DONE":
        return { bg: "bg-success", color: "text-white" };
      default:
        return { bg: "bg-secondary", color: "text-white" };
    }
  };

  const style = getHeaderStyle(status);

  return (
    <div className="kanban-column">
      <div
        className={`${style.bg} ${style.color} p-2 rounded-top mb-0 d-flex justify-content-between align-items-center shadow-sm`}
      >
        <h6
          className="mb-0 fw-bold text-uppercase"
          style={{ letterSpacing: "1px" }}
        >
          {title}
        </h6>
        <Badge bg="light" text="dark" pill>
          {tasks.length}
        </Badge>
      </div>
      <Droppable droppableId={status}>
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            style={{
              minHeight: "600px",
              background: snapshot.isDraggingOver ? "#e2e6ea" : "#f4f6f8",
              padding: "12px",
              borderRadius: "0 0 8px 8px",
              transition: "background-color 0.2s ease",
            }}
          >
            {tasks.map((task, index) => (
              <Draggable
                draggableId={task.id.toString()}
                index={index}
                key={task.id}
              >
                {(provided, snapshot) => (
                  <Card
                    className={`mb-3 border-0 shadow-sm ${snapshot.isDragging ? "shadow-lg" : ""}`}
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    style={{
                      ...provided.draggableProps.style,
                      borderLeft:
                        task.priority === "HIGH" ? "4px solid #dc3545" : "none",
                    }}
                  >
                    <Card.Body className="p-3">
                      <Stack
                        direction="horizontal"
                        className="justify-content-between mb-2"
                      >
                        <Card.Title className="h6 mb-0 fw-bold">
                          {task.title}
                        </Card.Title>
                        {task.priority && (
                          <Badge
                            bg={task.priority === "HIGH" ? "danger" : "info"}
                            style={{ fontSize: "10px" }}
                          >
                            {task.priority}
                          </Badge>
                        )}
                      </Stack>
                      <Card.Text className="small text-muted mb-3">
                        {task.description}
                      </Card.Text>
                      {isSuperUser && (
                        <div className="d-flex justify-content-end gap-2 border-top pt-2">
                          <Button
                            size="sm"
                            variant="link"
                            className="p-0 text-primary"
                            onClick={() => onEdit(task)}
                          >
                            <i className="ph ph-pencil-simple" />
                          </Button>

                          <Button
                            size="sm"
                            variant="link"
                            className="text-danger p-0"
                            onClick={() => onDelete(task.id)}
                          >
                            <i className="ph ph-trash" />
                          </Button>
                        </div>
                      )}
                    </Card.Body>
                  </Card>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </div>
  );
}
