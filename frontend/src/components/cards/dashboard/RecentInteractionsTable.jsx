import { Table } from "react-bootstrap";
import MainCard from "components/MainCard";
import { Link } from "react-router-dom";

const getAvatarInitial = (name) => name.charAt(0).toUpperCase();

export default function RecentInteractionsTable({ data }) {
  return (
    <MainCard title="Interactions les plus récentes" content={false}>
      <Table responsive hover className="align-middle mb-0">
        <thead className="bg-light">
          <tr>
            <th className="ps-4">Client</th>
            <th>Type</th>
            <th>Date</th>
            <th className="pe-4">Note</th>
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
                  {item.type}
                </span>
              </td>
              <td>{new Date(item.date).toLocaleDateString()}</td>
              <td className="pe-4 text-muted small">{item.comment}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </MainCard>
  );
}
