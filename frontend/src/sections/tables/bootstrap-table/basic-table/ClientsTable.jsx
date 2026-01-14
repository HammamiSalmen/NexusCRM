/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect } from "react";
import { Table, Button, Stack, Image, Modal, Form } from "react-bootstrap";
import { useForm } from "react-hook-form";
import api from "api/api";
import toast from "react-hot-toast";
import MainCard from "components/MainCard";
import Swal from "sweetalert2";

import avatar1 from "assets/images/user/avatar-1.png";
import avatar2 from "assets/images/user/avatar-2.png";
import avatar3 from "assets/images/user/avatar-3.png";
import avatar4 from "assets/images/user/avatar-4.png";
import avatar5 from "assets/images/user/avatar-5.png";

const avatars = [avatar1, avatar2, avatar3, avatar4, avatar5];

export default function ClientsTable() {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingClient, setEditingClient] = useState(null);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm();

  const getRandomAvatar = () => {
    return avatars[Math.floor(Math.random() * avatars.length)];
  };

  const fetchClients = async () => {
    try {
      const response = await api.get("/api/clients/");
      const clientsWithAvatars = response.data.map((client) => ({
        ...client,
        avatar: getRandomAvatar(),
      }));
      setClients(clientsWithAvatars);
    } catch (error) {
      toast.error("Erreur lors du chargement des clients");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClients();
  }, []);

  const handleDelete = async (id) => {
    Swal.fire({
      title: "Êtes-vous sûr ?",
      text: "Vous ne pourrez pas revenir en arrière !",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Oui, supprimer !",
      cancelButtonText: "Annuler",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await api.delete(`/api/clients/${id}/`);
          Swal.fire("Supprimé !", "Le client a été supprimé.", "success");
          fetchClients();
        } catch (error) {
          Swal.fire("Erreur", "Impossible de supprimer ce client.", "error");
        }
      }
    });
  };

  const handleOpenModal = (client = null) => {
    setEditingClient(client);
    if (client) {
      setValue("nomClient", client.nomClient);
      setValue("typeClient", client.typeClient);
    } else {
      reset({ nomClient: "", typeClient: "PARTICULIER" });
    }
    setShowModal(true);
  };

  const onSubmit = async (data) => {
    try {
      if (editingClient) {
        await api.put(`/api/clients/${editingClient.id}/`, data);
        toast.success("Client mis à jour !");
      } else {
        await api.post("/api/clients/", data);
        toast.success("Client créé !");
      }
      setShowModal(false);
      fetchClients();
    } catch (error) {
      toast.error("Une erreur est survenue.");
    }
  };

  return (
    <>
      <Button variant="primary" size="lg" onClick={() => handleOpenModal()}>
        <i className="ph ph-plus-circle me-1" /> Créer nouveau client
      </Button>
      <br />
      <br />
      <MainCard
        title={
          <Stack direction="horizontal" className="justify-content-between">
            <h5 className="mb-0">Liste des clients</h5>
          </Stack>
        }
      >
        <Table responsive hover className="mb-0">
          <thead>
            <tr>
              <th></th>
              <th>Nom Client</th>
              <th>Type</th>
              <th>Date de création</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {!loading &&
              clients.map((client) => (
                <tr key={client.id}>
                  <td>
                    <Image
                      src={client.avatar}
                      roundedCircle
                      width="30"
                      height="30"
                    />
                  </td>
                  <td>{client.nomClient}</td>
                  <td>{client.typeClient}</td>
                  <td>
                    {new Date(client.dateCreationClient).toLocaleDateString()}
                  </td>
                  <td>
                    <Button
                      variant="link"
                      size="sm"
                      onClick={() => handleOpenModal(client)}
                    >
                      <i
                        className="ti ti-edit text-primary"
                        style={{ fontSize: "1.2rem" }}
                      />
                    </Button>
                    <Button
                      variant="link"
                      size="sm"
                      onClick={() => handleDelete(client.id)}
                    >
                      <i
                        className="ti ti-trash text-danger"
                        style={{ fontSize: "1.2rem" }}
                      />
                    </Button>
                  </td>
                </tr>
              ))}
          </tbody>
        </Table>
      </MainCard>
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>
            {editingClient ? "Modifier Client" : "Nouveau Client"}
          </Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleSubmit(onSubmit)}>
          <Modal.Body>
            <Form.Group className="mb-3">
              <Form.Label>Nom du Client</Form.Label>
              <Form.Control
                {...register("nomClient", { required: true })}
                isInvalid={!!errors.nomClient}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Type de Client</Form.Label>
              <Form.Select {...register("typeClient")}>
                <option value="PARTICULIER">Particulier</option>
                <option value="ENTREPRISE">Entreprise</option>
              </Form.Select>
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowModal(false)}>
              Annuler
            </Button>
            <Button variant="primary" type="submit">
              Enregistrer
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </>
  );
}
