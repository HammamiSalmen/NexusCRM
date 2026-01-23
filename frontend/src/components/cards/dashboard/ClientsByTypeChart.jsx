import Chart from "react-apexcharts";
import MainCard from "components/MainCard";

export default function ClientsByTypeChart({ data }) {
  const series = [
    {
      name: "Clients",
      data: data.map((item) => item.count),
    },
  ];

  const options = {
    chart: { type: "bar" },
    xaxis: {
      categories: data.map((item) => item.typeClient),
    },
  };

  return (
    <MainCard title="Clients par type">
      <Chart options={options} series={series} type="bar" height={300} />
    </MainCard>
  );
}
