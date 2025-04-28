export async function fetchGraph() {
  const response = await fetch(
    "http://localhost:3000/api/v1/1/actions/blueprints/bp_01jk766tckfwx84xjcxazggzyc/graph"
  );
  if (!response.ok) {
    throw new Error("Failed to fetch API");
  }
  return response.json();
}