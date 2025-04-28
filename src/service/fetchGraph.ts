export async function fetchGraph(blueprintId?: string) {
  const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';
  const tenantId = import.meta.env.VITE_TENANT_ID || '1';
  const defaultBlueprintId = import.meta.env.VITE_DEFAULT_BLUEPRINT_ID || 'bp_01jk766tckfwx84xjcxazggzyc';
  

  const id = blueprintId || defaultBlueprintId;
  
  const response = await fetch(
    `${baseUrl}/api/v1/${tenantId}/actions/blueprints/${id}/graph`
  );
  
  if (!response.ok) {
    throw new Error(`Failed to fetch API: ${response.status} ${response.statusText}`);
  }
  
  return response.json();
}