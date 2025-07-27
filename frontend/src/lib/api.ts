export const API_BASE_URL = "http://localhost:8000/api/v1"; // Change if deployed

export const getAuthHeader = () => {
    const token = localStorage.getItem("token");
    return {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    };
  };