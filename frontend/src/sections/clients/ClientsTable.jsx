/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect } from "react";
import { Table, Button, Stack, Image } from "react-bootstrap";
import { useNavigate, Link } from "react-router-dom";
import api from "api/api";
import toast from "react-hot-toast";
import MainCard from "components/MainCard";
import avatar1 from "assets/images/user/avatar-1.png";
import avatar2 from "assets/images/user/avatar-2.png";
import avatar3 from "assets/images/user/avatar-3.png";
import avatar4 from "assets/images/user/avatar-4.png";
import avatar5 from "assets/images/user/avatar-5.png";

const avatars = [avatar1, avatar2, avatar3, avatar4, avatar5];

export default function ClientsTable() {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const getRandomAvatar = () =>
    avatars[Math.floor(Math.random() * avatars.length)];

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

  return (
    <>
      <Button
        variant="primary"
        size="lg"
        className="mb-4"
        onClick={() => navigate("/tables/creer-client")}
      >
        <i className="ph ph-plus-circle me-1" /> Créer nouveau client
      </Button>
      <MainCard title={<h4 className="mb-0">Liste des clients</h4>}>
        <Table responsive hover className="mb-0">
          <thead>
            <tr>
              <th></th>
              <th>Nom Client</th>
              <th>Type Client</th>
              <th>Date de création</th>
            </tr>
          </thead>
          <tbody>
            {!loading &&
              clients.map((client) => (
                <tr
                  key={client.id}
                  onClick={() =>
                    navigate(`/tables/details-client/${client.id}`)
                  }
                  className="table-clickable-row"
                  style={{ cursor: "pointer" }}
                >
                  <td>
                    <Image
                      src={client.avatar || defaultAvatar}
                      roundedCircle
                      width="35"
                      height="35"
                    />
                  </td>
                  <td>
                    <span className="h6">{client.nomClient}</span>
                  </td>
                  <td>{client.typeClient}</td>
                  <td>
                    {new Date(client.dateCreationClient).toLocaleDateString()}
                  </td>
                </tr>
              ))}
          </tbody>
        </Table>
      </MainCard>
    </>
  );
}
