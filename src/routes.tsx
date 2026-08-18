import React, { Suspense } from "react";
import { Route, Routes } from "react-router-dom";

import Layout from "./layout";
import AuthGuard from "./components/auth/AuthGuard";
import Loader from "./components/loader";
import type { TRoute } from "./types/auth";

export const routes: TRoute[] = [
  {
    exact: true,
    layout: Layout,
    guard: AuthGuard,
    path: "/",
    role: ["owner", "admin"],
    element: React.lazy(() => import("./pages/home")),
  },
  {
    exact: true,
    layout: Layout,
    guard: AuthGuard,
    path: "/peminjam",
    role: ["owner", "admin"],
    element: React.lazy(() => import("./pages/peminjam")),
  },
  {
    exact: true,
    layout: Layout,
    guard: AuthGuard,
    path: "/pembiayaan",
    role: ["owner", "admin"],
    element: React.lazy(() => import("./pages/pembiayaan")),
  },
  {
    exact: true,
    layout: Layout,
    guard: AuthGuard,
    path: "/pencairan",
    role: ["owner", "admin"],
    element: React.lazy(() => import("./pages/pencairan")),
  },
  {
    exact: true,
    layout: Layout,
    guard: AuthGuard,
    path: "/persebaran",
    role: ["owner", "admin"],
    element: React.lazy(() => import("./pages/persebaran")),
  },
  {
    exact: true,
    layout: Layout,
    guard: AuthGuard,
    path: "/404",
    role: "all",
    element: React.lazy(() => import("./pages/not-found")),
  },
  {
    layout: Layout,
    guard: AuthGuard,
    path: "*",
    role: "all",
    element: React.lazy(() => import("./pages/not-found")),
  },
];

const renderRoutes = (routes: TRoute[] = []) => {
  return (
    <Suspense fallback={<Loader />}>
      <Routes>
        {routes.map((route, i) => {
          const Guard: any = route.guard || React.Fragment;
          const LayoutComponent = route.layout || React.Fragment;
          const Element = route.element;
          return (
            <Route
              key={i}
              path={route.path}
              element={
                <Guard role={route.role}>
                  <LayoutComponent>
                    {route.routes ? renderRoutes(route.routes) : <Element />}
                  </LayoutComponent>
                </Guard>
              }
            />
          );
        })}
      </Routes>
    </Suspense>
  );
};

export default renderRoutes;
