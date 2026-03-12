import { Toaster } from "@/components/ui/sonner";
import {
  RouterProvider,
  createRootRoute,
  createRoute,
  createRouter,
} from "@tanstack/react-router";
import FormsPage from "./pages/FormsPage";
import LandingPage from "./pages/LandingPage";
import LoginPage from "./pages/LoginPage";
import ResponsesPage from "./pages/ResponsesPage";
import SurveyPage from "./pages/SurveyPage";

const rootRoute = createRootRoute();

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: LandingPage,
});

const loginRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/login",
  component: LoginPage,
});

const formsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/forms",
  component: FormsPage,
});

const surveyRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/survey/$formId",
  component: SurveyPage,
});

const responsesRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/forms/$formId/responses",
  component: ResponsesPage,
});

const routeTree = rootRoute.addChildren([
  indexRoute,
  loginRoute,
  formsRoute,
  surveyRoute,
  responsesRoute,
]);

const router = createRouter({ routeTree });

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

export default function App() {
  return (
    <>
      <RouterProvider router={router} />
      <Toaster position="top-right" />
    </>
  );
}
