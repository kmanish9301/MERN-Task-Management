import './App.css';
import { BrowserRouter } from "react-router-dom";
import AppRoutes from "./Routes/AppRoutes";
import ToastNotification from "./common/commonComponents/ToastNotification";

function App() {
  return (
    <>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
      <ToastNotification />
    </>
  );
}

export default App;
