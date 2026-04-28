const API_BASE_URL = "http://localhost:5000/api";

async function request(path) {
  const response = await fetch(`${API_BASE_URL}${path}`);

  if (!response.ok) {
    throw new Error(`Request failed: ${response.status}`);
  }

  return response.json();
}

export function fetchProducts(queryString = "") {
  return request(`/products${queryString}`);
}

export function fetchProduct(productId) {
  return request(`/products/${productId}`);
}
