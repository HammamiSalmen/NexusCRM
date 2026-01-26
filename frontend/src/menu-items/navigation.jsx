const navigation = {
  id: "main-menu",
  type: "group",
  children: [
    {
      id: "dashboard",
      title: "Tableau de bord",
      type: "item",
      icon: "ph ph-house-line",
      url: "/",
    },
    {
      id: "to-do",
      title: "Liste des tâches",
      type: "item",
      icon: "ph ph-list-checks",
      url: "/informations/to-do/kanban",
    },
    {
      id: "clients-table",
      title: "Liste des clients",
      type: "item",
      icon: "ph ph-address-book",
      url: "/tables/clients-table",
      children: [
        {
          id: "creer-client",
          title: "Créer un client",
          type: "item",
          url: "/tables/creer-client",
          hideInMenu: true,
        },
        {
          id: "details-client",
          title: "Détails du client",
          type: "item",
          url: "/tables/details-client",
          hideInMenu: true,
        },
      ],
    },
    {
      id: "employes-table",
      title: "Liste des employés",
      type: "item",
      icon: "ph ph-user-list",
      url: "/tables/employes-table",
      requiresAdmin: true,
      children: [
        {
          id: "creer-employe",
          title: "Créer un employé",
          type: "item",
          url: "/tables/creer-employe",
          hideInMenu: true,
        },
        {
          id: "details-employe",
          title: "Détails de l'employé",
          type: "item",
          url: "/tables/details-employe",
          hideInMenu: true,
        },
      ],
    },
  ],
};

export default navigation;
