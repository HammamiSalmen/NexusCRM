import { RouterProvider } from "react-router-dom";
import router from "routes";
import { Toaster } from "react-hot-toast";

function App() {
  return (
    <>
      <Toaster
        position="top-right"
        reverseOrder={false}
        toastOptions={{
          style: {
            borderRadius: "8px",
            background: "#333",
            color: "#fff",
            zIndex: 99999,
          },
        }}
      />
      <RouterProvider router={router} />
    </>
  );
}

export default App;
