import { useState, useEffect } from "react";
import ReactApexChart from "react-apexcharts";
import MainCard from "components/MainCard";
import { useTranslation } from "react-i18next";

export default function ClientGrowthChart({ data }) {
  const [series, setSeries] = useState([]);
  const [options, setOptions] = useState({});
  const { t } = useTranslation();

  useEffect(() => {
    const categories = data ? data.map((d) => d.date) : [];
    const counts = data ? data.map((d) => d.count) : [];
    setSeries([{ name: t("new_clients"), data: counts }]);
    setOptions({
      chart: { type: "area", height: 350, toolbar: { show: false } },
      dataLabels: { enabled: false },
      stroke: { curve: "smooth", width: 2 },
      xaxis: { categories: categories },
      colors: ["#00e396"],
      fill: {
        type: "gradient",
        gradient: {
          shadeIntensity: 1,
          opacityFrom: 0.7,
          opacityTo: 0.2,
          stops: [0, 90, 100],
        },
      },
      grid: { borderColor: "#f1f1f1" },
    });
  }, [data, t]);

  return (
    <MainCard
      title={t("client_growth_evolution")}
      content={false}
      className="h-100"
    >
      <div style={{ height: "280px" }}>
        <ReactApexChart
          options={options}
          series={series}
          type="area"
          height={240}
        />
      </div>
    </MainCard>
  );
}
