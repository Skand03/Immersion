import { useEffect, useState } from "react";
import { deleteDestination, getDestinations } from "../api/destinationApi";

function DestinationList({ apiConfig, refreshTick, onEdit, showMessage }) {
  const [destinations, setDestinations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchInput, setSearchInput] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [metadata, setMetadata] = useState({ total: 0, page: 1, perPage: 10 });

  const totalPages = Math.ceil((metadata.total || 0) / perPage) || 1;
  const orderedDestinations = [...destinations].sort(
    (a, b) => Number(a.id) - Number(b.id),
  );

  const matchesSearch = (item, term) => {
    const lowerTerm = term.toLowerCase();
    const name = (item.destinationName || "").toLowerCase();
    const description = (item.description || "").toLowerCase();
    return name.includes(lowerTerm) || description.includes(lowerTerm);
  };

  const fetchAllDestinations = async () => {
    const firstResponse = await getDestinations(apiConfig, {
      page: 1,
      perPage: 20,
    });

    const firstData = firstResponse?.data || {};
    const firstList = firstData.destinations || [];
    const firstMeta = firstData.metadata || { total: firstList.length };
    const totalRecords = Number(firstMeta.total || firstList.length);
    const totalPagesCount = Math.max(1, Math.ceil(totalRecords / 20));

    let combinedList = [...firstList];

    for (let currentPage = 2; currentPage <= totalPagesCount; currentPage += 1) {
      const pageResponse = await getDestinations(apiConfig, {
        page: currentPage,
        perPage: 20,
      });

      const pageData = pageResponse?.data || {};
      combinedList = [...combinedList, ...(pageData.destinations || [])];
    }

    return combinedList;
  };

  const fetchDestinations = async () => {
    setLoading(true);
    try {
      if (searchTerm) {
        const fetchedAll = await fetchAllDestinations();
        const filtered = fetchedAll.filter((item) => matchesSearch(item, searchTerm));

        setMetadata({
          total: filtered.length,
          page,
          perPage,
        });

        const startIndex = (page - 1) * perPage;
        setDestinations(filtered.slice(startIndex, startIndex + perPage));
      } else {
        const response = await getDestinations(apiConfig, {
          page,
          perPage,
        });

        const data = response?.data || {};
        const list = data.destinations || [];
        const meta = data.metadata || {
          total: list.length,
          page,
          perPage,
        };

        setDestinations(list);
        setMetadata(meta);
      }
    } catch (error) {
      setDestinations([]);
      setMetadata({ total: 0, page, perPage });
      showMessage(
        "danger",
        `Unable to load destinations${error?.statusCode ? ` (${error.statusCode})` : ""}: ${error?.detail || "Unknown error"}`,
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDestinations();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [apiConfig.baseUrl, apiConfig.token, page, perPage, searchTerm, refreshTick]);

  const handleSearchSubmit = (event) => {
    event.preventDefault();
    setPage(1);
    setSearchTerm(searchInput.trim());
  };

  const handleClearSearch = () => {
    setSearchInput("");
    setSearchTerm("");
    setPage(1);
  };

  const handleDelete = async (destination) => {
    const ok = window.confirm(
      `Delete destination #${destination.id} (${destination.destinationName})?`,
    );
    if (!ok) return;

    try {
      await deleteDestination(apiConfig, destination.id);
      showMessage("success", "Destination deleted successfully.");

      if (destinations.length === 1 && page > 1) {
        setPage((prev) => prev - 1);
      } else {
        fetchDestinations();
      }
    } catch (error) {
      showMessage(
        "danger",
        `Delete failed${error?.statusCode ? ` (${error.statusCode})` : ""}: ${error?.detail || "Unknown error"}`,
      );
    }
  };

  const currentList = searchTerm ? destinations : orderedDestinations;

  return (
    <section className="card shadow-sm">
      <div className="card-body">
        <div className="d-flex flex-wrap justify-content-between align-items-center gap-2 mb-3">
          <h2 className="h5 mb-0">Destination List</h2>
          <span className="badge text-bg-light border">Total: {metadata.total || 0}</span>
        </div>

        <form className="row g-2 mb-3" onSubmit={handleSearchSubmit}>
          <div className="col-12 col-md-6">
            <input
              className="form-control"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Search by name or description"
            />
          </div>
          <div className="col-6 col-md-2">
            <button type="submit" className="btn btn-primary w-100" disabled={loading}>
              Search
            </button>
          </div>
          <div className="col-6 col-md-2">
            <button
              type="button"
              className="btn btn-outline-secondary w-100"
              onClick={handleClearSearch}
              disabled={loading}
            >
              Clear
            </button>
          </div>
          <div className="col-12 col-md-2">
            <select
              className="form-select"
              value={perPage}
              onChange={(e) => {
                setPage(1);
                setPerPage(Number(e.target.value));
              }}
              disabled={loading}
            >
              <option value={5}>5 / page</option>
              <option value={10}>10 / page</option>
              <option value={20}>20 / page</option>
            </select>
          </div>
        </form>

        {loading ? (
          <div className="text-center py-4">
            <div className="spinner-border text-primary" role="status" />
          </div>
        ) : currentList.length === 0 ? (
          <div className="alert alert-light border mb-0">
            {searchTerm ? (
              <>
                <p className="mb-2">No result found for "{searchTerm}".</p>
                <button className="btn btn-sm btn-outline-secondary" onClick={handleClearSearch}>
                  Clear search
                </button>
              </>
            ) : (
              "No destinations found."
            )}
          </div>
        ) : (
          <div className="table-responsive">
            <table className="table table-striped table-hover align-middle mb-3">
              <thead>
                <tr>
                  <th>Sr. No.</th>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Description</th>
                  <th>Created By</th>
                  <th className="text-end">Actions</th>
                </tr>
              </thead>
              <tbody>
                {currentList.map((destination, index) => (
                  <tr key={destination.id}>
                    <td>{(page - 1) * perPage + index + 1}</td>
                    <td>{destination.id}</td>
                    <td>{destination.destinationName}</td>
                    <td>{destination.description || "-"}</td>
                    <td>{destination.createdBy || "-"}</td>
                    <td className="text-end">
                      <div className="d-inline-flex gap-2">
                        <button
                          className="btn btn-sm btn-outline-primary"
                          onClick={() => onEdit(destination)}
                        >
                          Edit
                        </button>
                        <button
                          className="btn btn-sm btn-outline-danger"
                          onClick={() => handleDelete(destination)}
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <div className="d-flex flex-wrap justify-content-between align-items-center gap-2">
          <small className="text-muted">Page {metadata.page || page} of {totalPages}</small>
          <div className="btn-group">
            <button
              className="btn btn-outline-secondary"
              onClick={() => setPage((prev) => Math.max(1, prev - 1))}
              disabled={loading || page <= 1}
            >
              Previous
            </button>
            <button
              className="btn btn-outline-secondary"
              onClick={() => setPage((prev) => Math.min(totalPages, prev + 1))}
              disabled={loading || page >= totalPages}
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

export default DestinationList;
