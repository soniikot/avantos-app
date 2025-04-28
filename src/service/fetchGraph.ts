export async function fetchGraph() {
  const baseUrl = import.meta.env.VITE_API_BASE_URL
  const tenantId = import.meta.env.VITE_TENANT_ID || '1';
  const response = await fetch(
    `${baseUrl}/api/v1/1/actions/blueprints/${tenantId}/graph`
  );
  if (!response.ok) {
    throw new Error("Failed to fetch from API");
  }
  return response.json();
}