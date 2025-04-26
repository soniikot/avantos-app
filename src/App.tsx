import { Graph } from "./components/Graph/Graph";
import "reactflow/dist/style.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Graph />
    </QueryClientProvider>
  );
}