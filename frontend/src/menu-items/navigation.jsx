const navigation = {
  id: "main-menu",
  type: "group",
  children: [
    {
      id: "dashboard",
      title: "dashboard",
      type: "item",
      icon: "ph ph-house-line",
      url: "/",
    },
    {
      id: "to-do",
      title: "task_list",
      type: "item",
      icon: "ph ph-list-checks",
      url: "/informations/to-do/kanban",
    },
    {
      id: "clients-table",
      title: "client_list",
      type: "item",
      icon: "ph ph-address-book",
      url: "/tables/clients-table",
      children: [
        {
          id: "creer-client",
          title: "create_client",
          type: "item",
          url: "/tables/creer-client",
          hideInMenu: true,
        },
        {
          id: "details-client",
          title: "client_details",
          type: "item",
          url: "/tables/details-client",
          hideInMenu: true,
        },
      ],
    },
    {
      id: "employes-table",
      title: "employee_list",
      type: "item",
      icon: "ph ph-user-list",
      url: "/tables/employes-table",
      requiresAdmin: true,
      children: [
        {
          id: "creer-employe",
          title: "create_employee",
          type: "item",
          url: "/tables/creer-employe",
          hideInMenu: true,
        },
        {
          id: "details-employe",
          title: "employee_details",
          type: "item",
          url: "/tables/details-employe",
          hideInMenu: true,
        },
      ],
    },
  ],
};

export default navigation;
