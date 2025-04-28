import { Graph } from "./components/Graph/Graph";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Graph />
    </QueryClientProvider>
  );
}