const API_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000/api";

async function request(path, options = {}) {
  const response = await fetch(`${API_URL}${path}`, {
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {})
    },
    ...options
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Request failed");
  }

  return data;
}

export function getAccounts() {
  return request("/accounts");
}

export function createAccount(account) {
  return request("/accounts", {
    method: "POST",
    body: JSON.stringify(account)
  });
}

export function getContent(filters = {}) {
  const params = new URLSearchParams(filters);
  return request(`/content?${params.toString()}`);
}

export function createContent(content) {
  return request("/content", {
    method: "POST",
    body: JSON.stringify(content)
  });
}

export function updateContent(id, content) {
  return request(`/content/${id}`, {
    method: "PATCH",
    body: JSON.stringify(content)
  });
}

export function deleteContent(id) {
  return request(`/content/${id}`, {
    method: "DELETE"
  });
}