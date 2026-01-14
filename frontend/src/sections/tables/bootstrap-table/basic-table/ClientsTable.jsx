import Table from "react-bootstrap/Table";
import MainCard from "components/MainCard";

export default function ClientsTable() {
  return (
    <MainCard
      className="table-card"
      title="Liste des Clients"
      /*       subheader={
        <p className="mb-0">
          use class <code>table-hover</code> inside table element
        </p>
      } */
    >
      <Table responsive hover className="mb-0">
        <thead>
          <tr>
            <th></th>
            <th>Nom</th>
            <th>Type</th>
            <th>Date de création</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>1</td>
            <td>Mark</td>
            <td>Otto</td>
            <td>@mdo</td>
          </tr>
          <tr>
            <td>2</td>
            <td>Jacob</td>
            <td>Thornton</td>
            <td>@fat</td>
          </tr>
          <tr>
            <td>3</td>
            <td>Larry</td>
            <td>the Bird</td>
            <td>@twitter</td>
          </tr>
        </tbody>
      </Table>
    </MainCard>
  );
}
