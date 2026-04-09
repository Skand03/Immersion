import axios from "axios";

const normalizeApiError = (error) => {
  const statusCode = error?.response?.status;
  const detail =
    error?.response?.data?.detail ||
    error?.response?.data?.message ||
    error?.response?.data ||
    error?.message ||
    "Something went wrong. Please try again.";

  return {
    statusCode,
    detail: String(detail),
  };
};

const buildRequestConfig = (apiConfig) => ({
  baseURL:
    import.meta.env.DEV && /^https?:\/\//i.test(apiConfig?.baseUrl || "")
      ? "/api-proxy"
      : apiConfig?.baseUrl,
  headers: {
    Authorization: `Bearer ${apiConfig?.token || ""}`,
    "Content-Type": "application/json",
  },
});

const validateApiConfig = (apiConfig) => {
  if (!apiConfig?.baseUrl || !apiConfig?.token) {
    throw {
      statusCode: 400,
      detail: "API domain and bearer token are required.",
    };
  }
};

export const createDestination = async (apiConfig, payload) => {
  try {
    validateApiConfig(apiConfig);
    const response = await axios.post(
      "/admin/create-destination",
      payload,
      buildRequestConfig(apiConfig),
    );
    return response.data;
  } catch (error) {
    throw normalizeApiError(error);
  }
};

export const updateDestination = async (apiConfig, destinationId, payload) => {
  try {
    validateApiConfig(apiConfig);
    const response = await axios.put(
      `/admin/update-destination/${destinationId}`,
      payload,
      buildRequestConfig(apiConfig),
    );
    return response.data;
  } catch (error) {
    throw normalizeApiError(error);
  }
};

export const deleteDestination = async (apiConfig, destinationId) => {
  try {
    validateApiConfig(apiConfig);
    await axios.delete(
      `/admin/delete-destination/${destinationId}`,
      buildRequestConfig(apiConfig),
    );
  } catch (error) {
    throw normalizeApiError(error);
  }
};

export const getDestinations = async (apiConfig, params = {}) => {
  try {
    validateApiConfig(apiConfig);
    const requestConfig = buildRequestConfig(apiConfig);
    const response = await axios.get("/admin/destinations", {
      ...requestConfig,
      params,
    });
    return response.data;
  } catch (error) {
    throw normalizeApiError(error);
  }
};
