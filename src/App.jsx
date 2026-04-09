import { useState } from "react";
import DestinationForm from "./components/DestinationForm";
import DestinationList from "./components/DestinationList";
import "./App.css";

function App() {
  const [selectedDestination, setSelectedDestination] = useState(null);
  const [refreshTick, setRefreshTick] = useState(0);
  const [message, setMessage] = useState(null);

  const apiConfig = {
    baseUrl: import.meta.env.VITE_API_BASE_URL || "",
    token: import.meta.env.VITE_API_TOKEN || "",
  };

  const showMessage = (type, text) => {
    setMessage({ type, text });
  };

  const clearSelection = () => {
    setSelectedDestination(null);
  };

  const triggerRefresh = () => {
    setRefreshTick((prev) => prev + 1);
  };

  const handleEdit = (destination) => {
    setSelectedDestination(destination);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <main className="container py-4 py-md-5 app-shell">
      <div className="row justify-content-center">
        <div className="col-12 col-lg-10 col-xl-9">
          <header className="mb-4">
            <h1 className="h3 mb-2">GAIA Destination Management</h1>
            <p className="text-muted mb-0">
              Create, update, search, and delete rural immersion destinations.
            </p>
            {!apiConfig.baseUrl || !apiConfig.token ? (
              <p className="text-danger small mt-2 mb-0">
                Add VITE_API_BASE_URL and VITE_API_TOKEN in the .env file.
              </p>
            ) : null}
          </header>

          {message && (
            <div
              className={`alert alert-${message.type} alert-dismissible fade show`}
              role="alert"
            >
              {message.text}
              <button
                type="button"
                className="btn-close"
                aria-label="Close"
                onClick={() => setMessage(null)}
              />
            </div>
          )}

          <DestinationForm
            apiConfig={apiConfig}
            selectedDestination={selectedDestination}
            clearSelection={clearSelection}
            onSaved={() => {
              clearSelection();
              triggerRefresh();
            }}
            showMessage={showMessage}
          />

          <DestinationList
            apiConfig={apiConfig}
            refreshTick={refreshTick}
            onEdit={handleEdit}
            showMessage={showMessage}
          />
        </div>
      </div>
    </main>
  );
}

export default App;
