export const API_BASE_URL = "http://localhost:8000/api/v1"; // Change if deployed

export const getAuthHeader = () => {
    const token =
      localStorage.getItem("token") ||
      JSON.parse(localStorage.getItem("user") || "{}").token;
  
    if (!token) return {};
  
    return {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    };
  };
  