import { useEffect, useState } from "react";
import { Row, Col, Spinner, Alert } from "react-bootstrap";
import MainCard from "components/MainCard";
import ProgressBar from "react-bootstrap/ProgressBar";
import api from "../../../api/api";
import AnalyticEcommerce from "../../../components/cards/dashboard/AnalyticEcommerce";
import ClientGrowthChart from "../../../components/cards/dashboard/ClientGrowthChart";
import RecentInteractionsTable from "../../../components/cards/dashboard/RecentInteractionsTable";
import InteractionsByTypeChart from "../../../components/cards/dashboard/InteractionsByTypeChart";

export default function DefaultPage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    api
      .get("api/dashboard/")
      .then((res) => {
        setData(res.data);
      })
      .catch((err) => {
        console.error("Dashboard error", err);
        setError("Impossible de charger les données du tableau de bord.");
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div
        className="d-flex justify-content-center align-items-center"
        style={{ height: "300px" }}
      >
        <Spinner animation="border" variant="primary" />
      </div>
    );
  }

  if (error) {
    return <Alert variant="danger">{error}</Alert>;
  }

  if (!data) {
    return <Alert variant="warning">Aucune donnée reçue.</Alert>;
  }

  return (
    <>
      <Row className="mb-4 g-3">
        <Col md={3}>
          <AnalyticEcommerce
            title="Total Clients"
            count={data.total_clients}
            icon="bi bi-people"
            color="primary"
          />
        </Col>
        <Col md={3}>
          <AnalyticEcommerce
            title="Total Interactions"
            count={data.total_interactions}
            icon="bi bi-chat-dots"
            color="info"
          />
        </Col>
        <Col md={3}>
          <AnalyticEcommerce
            title="Tâches Accomplies"
            count={data.completed_tasks}
            icon="bi bi-check-circle"
            color="success"
          />
        </Col>
        <Col md={3}>
          <AnalyticEcommerce
            title="Tâches en Attente"
            count={data.pending_tasks}
            icon="bi bi-clock-history"
            color="danger"
          />
        </Col>
      </Row>
      <Row className="mb-4 g-3">
        <Col md={4}>
          <InteractionsByTypeChart
            title="Nombre de clients par type"
            data={data.clients_by_type || []}
            isPie={true}
          />
        </Col>
        <Col md={8}>
          <Row className="g-3 h-100">
            <Col md={12} style={{ height: "50%" }}>
              <ClientGrowthChart data={data.client_growth || []} />
            </Col>
            <Col md={12} style={{ height: "48%" }}>
              <InteractionsByTypeChart
                title="Interactions par type"
                data={data.interactions_by_type || []}
                isPie={false}
              />
            </Col>
          </Row>
        </Col>
      </Row>
      <Row className="g-3">
        <Col md={8}>
          <RecentInteractionsTable data={data.recent_interactions || []} />
        </Col>
        <Col md={4}>
          <MainCard title="Clients les plus actifs">
            {data.top_clients.map((client, index) => (
              <div key={index} className="mb-4">
                <div className="d-flex justify-content-between mb-1">
                  <span className="fw-bold">{client.name}</span>
                  <span className="fw-bold">{client.count} interactions</span>
                </div>
                <ProgressBar
                  now={(client.count / (data.top_clients[0]?.count || 1)) * 100}
                  variant={index % 2 === 0 ? "success" : "primary"}
                  style={{ height: "8px" }}
                />
              </div>
            ))}
          </MainCard>
        </Col>
      </Row>
    </>
  );
}
