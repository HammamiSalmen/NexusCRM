const tableComponents = {
  id: "tables",
  title: "Tables",
  type: "group",
  children: [
    {
      id: "clients-table",
      title: "Clients",
      type: "item",
      icon: "ph ph-address-book",
      url: "/tables/clients-table",
      children: [
        {
          id: "creer-client",
          title: "Créer un Client",
          type: "item",
          url: "/tables/creer-client",
          hideInMenu: true,
        },
        {
          id: "details-client",
          title: "Détails du Client",
          type: "item",
          url: "/tables/details-client",
          hideInMenu: true,
        },
      ],
    },
    {
      id: "employes-table",
      title: "Employés",
      type: "item",
      icon: "ph ph-user-list",
      url: "/tables/employes-table",
      children: [
        {
          id: "creer-employe",
          title: "Créer un Employé",
          type: "item",
          url: "/tables/creer-employe",
          hideInMenu: true,
        },
        {
          id: "details-employe",
          title: "Détails de l'Employé",
          type: "item",
          url: "/tables/details-employe",
          hideInMenu: true,
        },
      ],
    },
  ],
};

export default tableComponents;
