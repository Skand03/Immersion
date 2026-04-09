import { useEffect, useState } from "react";
import { createDestination, updateDestination } from "../api/destinationApi";

const EMPTY_FORM = {
  name: "",
  description: "",
  meta: "",
};

function DestinationForm({
  apiConfig,
  selectedDestination,
  clearSelection,
  onSaved,
  showMessage,
}) {
  const [formData, setFormData] = useState(EMPTY_FORM);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isEditMode = Boolean(selectedDestination);
  const originalName = selectedDestination?.destinationName || "";
  const originalDescription = selectedDestination?.description || "";

  useEffect(() => {
    if (selectedDestination) {
      setFormData({
        name: originalName,
        description: originalDescription,
        meta: "",
      });
      setErrors({});
      return;
    }

    setFormData(EMPTY_FORM);
    setErrors({});
  }, [selectedDestination, originalDescription, originalName]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setErrors((prev) => ({
      ...prev,
      [name]: "",
      submit: "",
    }));
  };

  const validate = () => {
    const nextErrors = {};

    if (!isEditMode) {
      if (!formData.name.trim()) nextErrors.name = "Name is required.";
      if (!formData.description.trim())
        nextErrors.description = "Description is required.";
    }

    if (isEditMode) {
      const changedName = formData.name.trim() !== originalName.trim();
      const changedDescription =
        formData.description.trim() !== originalDescription.trim();

      if (!changedName && !changedDescription) {
        nextErrors.submit = "Update at least one field before submitting.";
      }
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleCancelEdit = () => {
    clearSelection();
    setFormData(EMPTY_FORM);
    setErrors({});
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!validate()) return;

    setIsSubmitting(true);
    try {
      if (isEditMode) {
        const payload = {};
        if (formData.name.trim() !== originalName.trim()) {
          payload.name = formData.name.trim();
        }
        if (formData.description.trim() !== originalDescription.trim()) {
          payload.description = formData.description.trim();
        }

        await updateDestination(apiConfig, selectedDestination.id, payload);
        showMessage("success", "Destination updated successfully.");
      } else {
        const payload = {
          name: formData.name.trim(),
          description: formData.description.trim(),
        };

        if (formData.meta.trim()) {
          payload.meta = formData.meta.trim();
        }

        await createDestination(apiConfig, payload);
        showMessage("success", "Destination created successfully.");
      }

      setFormData(EMPTY_FORM);
      setErrors({});
      onSaved();
    } catch (error) {
      showMessage(
        "danger",
        `Request failed${error?.statusCode ? ` (${error.statusCode})` : ""}: ${error?.detail || "Unknown error"}`,
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="card shadow-sm mb-4">
      <div className="card-body">
        <h2 className="h5 mb-3">
          {isEditMode ? "Edit Destination" : "Create Destination"}
        </h2>

        {errors.submit && (
          <div className="alert alert-warning py-2">{errors.submit}</div>
        )}

        <form onSubmit={handleSubmit} className="row g-3">
          <div className="col-12 col-md-6">
            <label htmlFor="destinationName" className="form-label">
              Name {isEditMode ? "(optional)" : "*"}
            </label>
            <input
              id="destinationName"
              className={`form-control ${errors.name ? "is-invalid" : ""}`}
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Ralegan Siddhi"
            />
            {errors.name && (
              <div className="invalid-feedback">{errors.name}</div>
            )}
          </div>

          <div className="col-12 col-md-6">
            <label htmlFor="destinationMeta" className="form-label">
              Meta / Tags (optional)
            </label>
            <input
              id="destinationMeta"
              className="form-control"
              name="meta"
              value={formData.meta}
              onChange={handleChange}
              placeholder="eco, village, sustainability"
              disabled={isEditMode}
            />
            {isEditMode && (
              <div className="form-text">Meta is only used in create API.</div>
            )}
          </div>

          <div className="col-12">
            <label htmlFor="destinationDescription" className="form-label">
              Description {isEditMode ? "(optional)" : "*"}
            </label>
            <textarea
              id="destinationDescription"
              className={`form-control ${errors.description ? "is-invalid" : ""}`}
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={4}
              placeholder="A model environmental conservation village."
            />
            {errors.description && (
              <div className="invalid-feedback">{errors.description}</div>
            )}
          </div>

          <div className="col-12 d-flex gap-2">
            <button
              type="submit"
              className="btn btn-success"
              disabled={isSubmitting}
            >
              {isSubmitting
                ? isEditMode
                  ? "Updating..."
                  : "Creating..."
                : isEditMode
                  ? "Update Destination"
                  : "Create Destination"}
            </button>

            {isEditMode && (
              <button
                type="button"
                className="btn btn-outline-secondary"
                onClick={handleCancelEdit}
                disabled={isSubmitting}
              >
                Cancel Edit
              </button>
            )}
          </div>
        </form>
      </div>
    </section>
  );
}

export default DestinationForm;
