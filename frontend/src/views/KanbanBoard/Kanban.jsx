import { useEffect, useState } from "react";
import { Row, Col, Button, Spinner, Modal, Form } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import api from "../../api/api";
import KanbanColumn from "../../components/KanbanColumn";
import { DragDropContext } from "@hello-pangea/dnd";
import Swal from "sweetalert2";
import toast from "react-hot-toast";

export default function Kanban() {
  const { t } = useTranslation();
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

  const STATUSES = [
    { key: "TODO", label: t("kanban.todo", "À faire") },
    { key: "IN_PROGRESS", label: t("kanban.in_progress", "En cours") },
    { key: "DONE", label: t("kanban.done", "Terminée") },
  ];

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
      title: t("kanban.delete_confirm_title", "Supprimer cette tâche ?"),
      text: t("kanban.delete_confirm_text", "Cette action est irréversible."),
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#6c757d",
      confirmButtonText: t("kanban.delete_confirm_yes", "Oui, supprimer"),
      cancelButtonText: t("kanban.cancel", "Annuler"),
    }).then((result) => {
      if (result.isConfirmed) {
        api
          .delete(`api/tasks/${taskId}/`)
          .then(() => {
            toast.success(
              t("kanban.toast_deleted", "Tâche supprimée avec succès"),
            );
            fetchTasks();
          })
          .catch(() => {
            toast.error(
              t(
                "kanban.toast_delete_error",
                "Une erreur est survenue lors de la suppression",
              ),
            );
          });
      }
    });
  };

  const handleSaveTask = async () => {
    if (!newTask.title.trim()) {
      toast.error(t("kanban.error_title_required", "Le titre est obligatoire"));
      return;
    }
    if (!newTask.due_date) {
      toast.error(
        t("kanban.error_due_date_required", "La date limite est obligatoire"),
      );
      return;
    }
    if (!newTask.assigned_to) {
      toast.error(
        t(
          "kanban.error_assign_required",
          "Veuillez assigner un responsable à la tâche",
        ),
      );
      return;
    }
    try {
      if (editingTask) {
        await api.patch(`api/tasks/${editingTask.id}/`, {
          ...newTask,
          assigned_to: Number(newTask.assigned_to),
        });
        toast.success(t("kanban.toast_updated"));
      } else {
        await api.post("api/tasks/", {
          ...newTask,
          assigned_to: Number(newTask.assigned_to),
        });
        toast.success(t("kanban.toast_created"));
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
      toast.error(t("kanban.toast_save_error"));
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
        toast.success(t("kanban.toast_status_updated"));
        fetchTasks();
      })
      .catch(() => {
        toast.error(t("kanban.toast_status_error"));
      });
  };

  if (loading)
    return (
      <Spinner
        animation="border"
        title={t("loading_in_progress", "Chargement...")}
      />
    );

  return (
    <>
      <Row className="mb-3">
        {isSuperUser && (
          <Col direction="horizontal" justifyContent="between" className="mb-4">
            <Button
              variant="primary"
              size="lg"
              onClick={() => setShowModal(true)}
            >
              <i className="ph ph-plus-circle me-1" />
              {t("kanban.new_task", "Nouvelle tâche")}
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
            {editingTask
              ? t("kanban.edit_task", "Modifier la tâche")
              : t("kanban.create_task", "Créer une nouvelle tâche")}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>{t("kanban.title", "Titre")}</Form.Label>
              <Form.Control
                type="text"
                value={newTask.title}
                onChange={(e) =>
                  setNewTask({ ...newTask, title: e.target.value })
                }
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>{t("kanban.due_date", "Date limite")}</Form.Label>
              <Form.Control
                type="datetime-local"
                value={newTask.due_date}
                onChange={(e) =>
                  setNewTask({ ...newTask, due_date: e.target.value })
                }
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>{t("kanban.assign_to", "Assigner à")}</Form.Label>
              <Form.Select
                value={newTask.assigned_to}
                onChange={(e) =>
                  setNewTask({
                    ...newTask,
                    assigned_to: e.target.value,
                  })
                }
              >
                <option value="">
                  {t("kanban.select_employee", "-- Sélectionner un employé --")}
                </option>
                {users.map((u) => (
                  <option key={u.id} value={u.id}>
                    {u.first_name} {u.last_name} ({u.username})
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>{t("kanban.description", "Description")}</Form.Label>
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
            {t("kanban.cancel", "Annuler")}
          </Button>
          <Button variant="primary" onClick={handleSaveTask}>
            {editingTask
              ? t("kanban.save_changes", "Enregistrer les modifications")
              : t("kanban.create", "Créer la tâche")}
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}
