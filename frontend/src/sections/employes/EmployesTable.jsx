import { useState, useEffect } from "react";
import { Table, Button, Stack, Image } from "react-bootstrap";
import MainCard from "components/MainCard";
import api from "api/api";
import toast from "react-hot-toast";
import avatar1 from "assets/images/user/avatar-1.png";
import avatar2 from "assets/images/user/avatar-2.png";
import avatar3 from "assets/images/user/avatar-3.png";
import avatar4 from "assets/images/user/avatar-4.png";
import avatar5 from "assets/images/user/avatar-5.png";

const avatars = [avatar1, avatar2, avatar3, avatar4, avatar5];

export default function ClientsTable() {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchClients = async () => {
      try {
        const response = await api.get("/api/clients/");
        setClients(response.data);
      } catch (error) {
        console.error("Erreur lors du chargement des clients", error);
        toast.error("Impossible de charger la liste des clients");
      } finally {
        setLoading(false);
      }
    };

    fetchClients();
  }, []);

  return (
    <MainCard
      className="table-card"
      title={
        <Stack direction="horizontal" className="justify-content-between">
          <h5 className="mb-0">Liste des clients</h5>
          <Button
            variant="primary"
            size="sm"
            onClick={() => toast("Bientôt : Formulaire d'ajout")}
          >
            <i className="ph ph-plus-circle me-1" /> Créer nouveau client
          </Button>
        </Stack>
      }
    >
      <Table responsive hover className="mb-0">
        <thead>
          <tr>
            <th style={{ width: "50px" }}></th>
            <th>Client</th>
            <th>Type Client</th>
            <th>Date de création</th>
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr>
              <td colSpan="4" className="text-center">
                Chargement...
              </td>
            </tr>
          ) : clients.length > 0 ? (
            clients.map((client, index) => (
              <tr key={client.id}>
                <td>
                  {/* Utilisation cyclique des avatars locaux */}
                  <Image
                    src={avatars[index % avatars.length]}
                    roundedCircle
                    width="35"
                    height="35"
                    alt="user"
                  />
                </td>
                <td>
                  <span className="h6 mb-0 ms-2">{client.nom}</span>
                </td>
                <td>{client.type_client || "N/A"}</td>
                <td>
                  {new Date(client.created_at).toLocaleDateString("fr-FR", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                  })}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="4" className="text-center">
                Aucun client trouvé.
              </td>
            </tr>
          )}
        </tbody>
      </Table>
    </MainCard>
  );
}
