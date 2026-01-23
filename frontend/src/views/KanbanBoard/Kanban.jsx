import { useEffect, useState } from "react";
import { Row, Col, Button, Spinner, Modal, Form } from "react-bootstrap";
import api from "../../api/api";
import KanbanColumn from "../../components/KanbanColumn";
import { DragDropContext } from "@hello-pangea/dnd";
import Swal from "sweetalert2";
import toast from "react-hot-toast";

const STATUSES = [
  { key: "TODO", label: "À faire" },
  { key: "IN_PROGRESS", label: "En cours" },
  { key: "DONE", label: "Terminée" },
];

export default function Kanban() {
  const [tasks, setTasks] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [newTask, setNewTask] = useState({
    title: "",
    description: "",
    due_date: "",
    assigned_to: "",
    status: "TODO",
  });

  const user = JSON.parse(localStorage.getItem("user"));
  const isSuperUser = user?.is_superuser;

  useEffect(() => {
    if (isSuperUser) {
      api
        .get("api/users/")
        .then((res) => setUsers(res.data))
        .catch((err) => console.error(err));
    }
  }, [isSuperUser]);

  const fetchTasks = () => {
    api
      .get("api/tasks/")
      .then((res) => setTasks(res.data))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const deleteTask = (taskId) => {
    Swal.fire({
      title: "Supprimer cette tâche ?",
      text: "Cette action est irréversible",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#6c757d",
      confirmButtonText: "Oui, supprimer",
      cancelButtonText: "Annuler",
    }).then((result) => {
      if (result.isConfirmed) {
        api
          .delete(`api/tasks/${taskId}/`)
          .then(() => {
            toast.success("Tâche supprimée");
            fetchTasks();
          })
          .catch(() => {
            toast.error("Erreur lors de la suppression");
          });
      }
    });
  };

  const handleSaveTask = async () => {
    if (!newTask.title.trim()) {
      toast.error("Le titre est obligatoire");
      return;
    }
    if (!newTask.due_date) {
      toast.error("La date limite est obligatoire");
      return;
    }
    if (!newTask.assigned_to) {
      toast.error("Veuillez assigner la tâche");
      return;
    }
    try {
      if (editingTask) {
        await api.patch(`api/tasks/${editingTask.id}/`, {
          ...newTask,
          assigned_to: Number(newTask.assigned_to),
        });
        toast.success("Tâche modifiée avec succès");
      } else {
        await api.post("api/tasks/", {
          ...newTask,
          assigned_to: Number(newTask.assigned_to),
        });
        toast.success("Tâche créée avec succès");
      }
      fetchTasks();
      setShowModal(false);
      setEditingTask(null);
      setNewTask({
        title: "",
        description: "",
        due_date: "",
        assigned_to: "",
        status: "TODO",
      });
    } catch {
      toast.error("Erreur lors de l’enregistrement");
    }
  };

  const handleEditTask = (task) => {
    setEditingTask(task);
    setNewTask({
      title: task.title,
      description: task.description || "",
      due_date: task.due_date,
      assigned_to: task.assigned_to?.id || task.assigned_to,
      status: task.status,
    });
    setShowModal(true);
  };

  const onDragEnd = (result) => {
    const { destination, source, draggableId } = result;
    if (!destination) return;
    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }
    api
      .patch(`api/tasks/${draggableId}/`, {
        status: destination.droppableId,
      })
      .then(() => {
        toast.success("Statut mis à jour");
        fetchTasks();
      })
      .catch(() => {
        toast.error("Impossible de modifier le statut");
      });
  };

  if (loading) return <Spinner animation="border" />;

  return (
    <>
      <Row className="mb-3">
        {isSuperUser && (
          <Col className="text-end">
            <Button variant="primary" onClick={() => setShowModal(true)}>
              + Nouvelle tâche
            </Button>
          </Col>
        )}
      </Row>
      <DragDropContext onDragEnd={onDragEnd}>
        <Row>
          {STATUSES.map((status) => (
            <Col md={4} key={status.key}>
              <KanbanColumn
                title={status.label}
                status={status.key}
                tasks={tasks.filter((t) => t.status === status.key)}
                onDelete={deleteTask}
                onEdit={handleEditTask}
                isSuperUser={isSuperUser}
              />
            </Col>
          ))}
        </Row>
      </DragDropContext>
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>
            {editingTask ? "Modifier la tâche" : "Nouvelle tâche"}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Titre</Form.Label>
              <Form.Control
                type="text"
                value={newTask.title}
                onChange={(e) =>
                  setNewTask({ ...newTask, title: e.target.value })
                }
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Date limite</Form.Label>
              <Form.Control
                type="datetime-local"
                value={newTask.due_date}
                onChange={(e) =>
                  setNewTask({ ...newTask, due_date: e.target.value })
                }
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Assigner à</Form.Label>
              <Form.Select
                value={newTask.assigned_to}
                onChange={(e) =>
                  setNewTask({
                    ...newTask,
                    assigned_to: e.target.value,
                  })
                }
              >
                <option value="">-- Sélectionner un employé --</option>
                {users.map((u) => (
                  <option key={u.id} value={u.id}>
                    {u.first_name} {u.last_name} ({u.username})
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={newTask.description}
                onChange={(e) =>
                  setNewTask({ ...newTask, description: e.target.value })
                }
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Annuler
          </Button>
          <Button variant="primary" onClick={handleSaveTask}>
            {editingTask ? "Enregistrer" : "Créer"}
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}
