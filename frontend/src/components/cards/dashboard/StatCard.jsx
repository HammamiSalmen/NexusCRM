import MainCard from "components/MainCard";

export default function StatCard({ title, value }) {
  return (
    <MainCard>
      <h6 className="text-muted">{title}</h6>
      <h3>{value}</h3>
    </MainCard>
  );
}
