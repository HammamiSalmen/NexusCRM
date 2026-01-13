import Breadcrumb from "react-bootstrap/Breadcrumb";
import MainCard from "components/MainCard";

export default function BreadcrumbBasic() {
  return (
    <MainCard title="Breadcrumb">
      <Breadcrumb>
        <Breadcrumb.Item active>Home</Breadcrumb.Item>
      </Breadcrumb>
      <Breadcrumb className="breadcrumb-default-icon">
        <Breadcrumb.Item href="#">Home</Breadcrumb.Item>
        <Breadcrumb.Item active>Library</Breadcrumb.Item>
      </Breadcrumb>
      <Breadcrumb className="breadcrumb-default-icon">
        <Breadcrumb.Item href="#">Home</Breadcrumb.Item>
        <Breadcrumb.Item>Library</Breadcrumb.Item>
        <Breadcrumb.Item active>Data</Breadcrumb.Item>
      </Breadcrumb>
    </MainCard>
  );
}
