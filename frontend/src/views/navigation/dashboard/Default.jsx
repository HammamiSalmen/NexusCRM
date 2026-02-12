import { useEffect, useState } from "react";
import { Row, Col, Spinner } from "react-bootstrap";
import MainCard from "components/MainCard";
import ProgressBar from "react-bootstrap/ProgressBar";
import api from "../../../api/api";
import AnalyticEcommerce from "../../../components/cards/dashboard/AnalyticEcommerce";
import ClientGrowthChart from "../../../components/cards/dashboard/ClientGrowthChart";
import RecentInteractionsTable from "../../../components/cards/dashboard/RecentInteractionsTable";
import InteractionsByTypeChart from "../../../components/cards/dashboard/InteractionsByTypeChart";
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";

export default function DefaultPage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const { t } = useTranslation();

  useEffect(() => {
    api
      .get("api/dashboard/")
      .then((res) => {
        if (res.data) {
          setData(res.data);
        } else {
          toast.error(t("error_no_data"));
        }
      })
      .catch((err) => {
        console.error("Erreur Tableau de bord", err);
        toast.error(t("error_dashboard_load"));
      })
      .finally(() => setLoading(false));
  }, [t]);

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

  if (!data) return null;

  return (
    <>
      <Row className="mb-4 g-3">
        <Col md={3}>
          <AnalyticEcommerce
            title={t("total_clients")}
            count={data.total_clients}
            icon="bi bi-people"
            color="primary"
          />
        </Col>
        <Col md={3}>
          <AnalyticEcommerce
            title={t("total_interactions")}
            count={data.total_interactions}
            icon="bi bi-chat-dots"
            color="info"
          />
        </Col>
        <Col md={3}>
          <AnalyticEcommerce
            title={t("completed_tasks")}
            count={data.completed_tasks}
            icon="bi bi-check-circle"
            color="success"
          />
        </Col>
        <Col md={3}>
          <AnalyticEcommerce
            title={t("pending_tasks")}
            count={data.pending_tasks}
            icon="bi bi-clock-history"
            color="danger"
          />
        </Col>
      </Row>
      <Row className="mb-4 g-3">
        <Col md={4}>
          <InteractionsByTypeChart
            title={t("client_distribution_type")}
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
                title={t("interaction_volume_canal")}
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
          <MainCard title={t("active_clients_ranking")}>
            {data.top_clients.map((client, index) => (
              <div key={index} className="mb-4">
                <div className="d-flex justify-content-between mb-1">
                  <span className="fw-bold">{client.name}</span>
                  <span className="fw-bold text-muted small">
                    {client.count}{" "}
                    {client.count > 1 ? t("interactions") : t("interaction")}
                  </span>
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
