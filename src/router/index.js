import { createRouter, createWebHistory } from "vue-router";
import PrivateView from "@/views/PrivateView.vue";
import { useAuthStore } from "@/stores/auth";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "private",
      component: PrivateView,
      meta: { requiresAuth: true },
      children: [
        // {
        //   path: "",
        //   redirect: { name: "ship-report" },
        // },
        {
          path: "ship-report",
          name: "ShipReport",
          component: () => import("@/views/shipReport/ShipReport.vue"),
        },
        {
          path: "ship-report-view/:id",
          name: "ShipReportView",
          component: () => import("@/views/shipReport/ViewShipReport.vue"),
        },
        {
          path: "ship-report-edit/:id",
          name: "EditShipReport",
          component: () => import("@/views/shipReport/EditShipReport.vue"),
        },
        {
          path: "ship-report/create-report",
          name: "CreateShipReport",
          component: () => import("@/views/shipReport/CreateShipReport.vue"),
        },
        {
          path: "persons",
          name: "Persons",
          component: () => import("@/views/persons/Persons.vue"),
        },
        {
          path: "person-view/:id",
          name: "PersonView",
          component: () => import("@/views/persons/PersonView.vue"),
        },
      ],
    },
    {
      path: "/auth/",
      name: "auth",
      redirect: "/auth/login/",
      children: [
        {
          path: "login",
          name: "login",
          component: () => import("../views/auth/Login.vue"),
        },
        {
          path: "denied",
          name: "access-denied",
          component: () => import("../views/auth/AccessDenied.vue"),
        },
        {
          path: "error",
          name: "error",
          component: () => import("../views/auth/Error.vue"),
        },

        {
          path: "/:pathMatch(.*)*", // Catch-all route
          name: "NotFound",
          component: () => import("@/views/NotFound.vue"),
        },
      ],
    },
  ],
});

router.beforeEach(async (to) => {
  const auth = useAuthStore();
  // If navigating to auth pages while already authenticated, bounce to home (or redirect target)
  const isAuthRoute = to.path.startsWith("/auth");
  if (isAuthRoute) {
    try {
      if (!auth.user) {
        await auth.fetchUser();
      }
    } catch (_) {
      // ignore
    }
    if (auth.isAuthenticated) return { path: "/" };
  }
  if (to.meta?.requiresAuth) {
    try {
      if (!auth.user) {
        await auth.fetchUser();
      }
    } catch (_) {
      // not logged in
    }
    if (!auth.isAuthenticated && !isAuthRoute)
      return { name: "login", query: { redirect: to.fullPath } };
  }
  return true;
});

export default router;
