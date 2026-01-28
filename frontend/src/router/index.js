import { createRouter, createWebHashHistory } from "vue-router";
import { auth } from "../store/auth";

import Login from "../views/Login.vue";
import AdminLayout from "../views/admin/AdminLayout.vue";

const routes = [
  { path: "/login", component: Login },

  {
    path: "/admin",
    component: AdminLayout,
    beforeEnter: () => auth.user?.role === "ADMIN",
    children: [
      { path: "", redirect: "/admin/docentes" },
      { path: "docentes", component: () => import("../views/admin/Docentes.vue") },
      { path: "alunos", component: () => import("../views/admin/Alunos.vue") },
      { path: "palavras-chave", component: () => import("../views/admin/PalavrasChave.vue") },
      { path: "propostas", component: () => import("../views/admin/Propostas.vue") }
      
     

    ]
  },

  { path: "/", component: () => import("../views/PublicHome.vue") },
{ path: "/docentes/:id", component: () => import("../views/PublicDocente.vue") },


  {
    path: "/propostas",
    component: () => import("../views/Propostas.vue"),
    beforeEnter: () => auth.user?.role === "DOCENTE"
  }
];

export default createRouter({
  history: createWebHashHistory(),
  routes
});
