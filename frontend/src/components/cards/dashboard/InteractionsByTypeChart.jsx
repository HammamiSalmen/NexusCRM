import Chart from "react-apexcharts";
import MainCard from "components/MainCard";

export default function InteractionsByTypeChart({ data, title, isPie }) {
  const series = isPie
    ? data.map((item) => item.count)
    : [{ name: "Total", data: data.map((item) => item.count) }];

  const options = {
    chart: {
      toolbar: { show: false },
    },
    labels: data.map((item) => item.typeInteraction || item.typeClient),
    legend: {
      show: true,
      position: "bottom",
      offsetY: -10,
      horizontalAlign: "center",
      fontSize: "13px",
      markers: {
        width: 10,
        height: 10,
        radius: 12,
      },
      itemMargin: {
        horizontal: 10,
        vertical: 4,
      },
    },
    dataLabels: {
      enabled: true,
      formatter: function (val) {
        return `${Math.round(val)}%`;
      },
      style: {
        fontSize: "14px",
        fontWeight: "600",
        colors: ["#fff"],
      },
      dropShadow: {
        enabled: false,
      },
    },
    plotOptions: {
      pie: {
        offsetY: -5,
      },
    },
    grid: {
      padding: {
        top: 0,
        bottom: 0,
      },
    },
    colors: ["#5E35B1", "#03A9F4", "#00E396", "#FFB22B"],
  };

  return (
    <MainCard title={title} content={false} className="h-100">
      {isPie ? (
        <div
          style={{
            height: "615px",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "column",
          }}
        >
          <Chart options={options} series={series} type="pie" height={360} />
        </div>
      ) : (
        <div style={{ height: "280px", padding: "16px" }}>
          <Chart options={options} series={series} type="bar" height={240} />
        </div>
      )}
    </MainCard>
  );
}
