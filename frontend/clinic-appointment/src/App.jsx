import { BrowserRouter, Routes, Route } from "react-router-dom";
import {
  Login,
  RequestForm,
  AppointmentList,
  PrivateRoute,
} from "./components";

export const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<RequestForm />} />
        <Route path="/login" element={<Login />} />
        <Route
          path="/appointments"
          element={
            <PrivateRoute>
              <AppointmentList />
            </PrivateRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
};
