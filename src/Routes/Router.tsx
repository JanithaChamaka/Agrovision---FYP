import { Route, Routes } from "react-router-dom";
import { NavigationConfig } from "./Navigation-config";
import { useAuthStore } from "../store/useAuthStore";
import ProtectedRoute from "../components/ProtectedRoute";

const Router = () => {
  const { authUser } = useAuthStore();

  return (
    <Routes>
      {NavigationConfig.map(({ path, element, isProtected }, index) => (
        <Route
          key={index}
          path={path}
          element={
            isProtected ? (
              authUser ? (
                element
              ) : (
                <ProtectedRoute element={element} />
              )
            ) : (
              element
            )
          }
        />
      ))}
    </Routes>
  );
};

export default Router;
