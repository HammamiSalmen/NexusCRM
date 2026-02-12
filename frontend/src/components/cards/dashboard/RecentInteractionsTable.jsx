import { Table } from "react-bootstrap";
import MainCard from "components/MainCard";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

const getAvatarInitial = (name) => name.charAt(0).toUpperCase();

export default function RecentInteractionsTable({ data }) {
  const { t, i18n } = useTranslation();
  return (
    <MainCard title={t("recent_interactions")} content={false}>
      <Table responsive hover className="align-middle mb-0">
        <thead className="bg-light">
          <tr>
            <th className="ps-4">{t("client")}</th>
            <th>{t("type")}</th>
            <th>{t("date")}</th>
            <th className="pe-4">{t("comment")}</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item, index) => (
            <tr key={index}>
              <td className="ps-4">
                <div className="d-flex align-items-center">
                  <div
                    className="rounded-circle bg-light-primary text-primary d-flex align-items-center justify-content-center me-3 fw-bold"
                    style={{ width: "35px", height: "35px" }}
                  >
                    {getAvatarInitial(item.client)}
                  </div>
                  <h6 className="mb-0">{item.client}</h6>
                </div>
              </td>
              <td>
                <span
                  className={`badge ${item.type === "email" ? "bg-light-info text-info" : "bg-light-success text-success"} border-0`}
                >
                  {item.type === "email" ? "E-mail" : item.type}
                </span>
              </td>
              <td>
                {new Date(item.date).toLocaleDateString(
                  i18n.language === "fr" ? "fr-FR" : "en-US",
                )}
              </td>
              <td className="pe-4 text-muted small">{item.comment}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </MainCard>
  );
}
