const informations = {
  id: "informations",
  title: "Informations",
  type: "group",
  children: [
    {
      id: "to-do",
      title: "To Do List",
      type: "collapse",
      icon: "ph ph-map-trifold",
      children: [
        {
          id: "kanban",
          title: "Kanban Board",
          type: "item",
          url: "/informations/to-do/kanban",
        },
      ],
    },
    {
      id: "statistiques",
      title: "Statistiques",
      type: "collapse",
      icon: "ph ph-chart-donut",
      children: [
        {
          id: "graphs",
          title: "Graphs",
          type: "item",
          url: "/informations/statistiques/graphs",
        },
      ],
    },
  ],
};

export default informations;
