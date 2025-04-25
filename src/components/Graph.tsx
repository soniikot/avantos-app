import ReactFlow, {
    useNodesState, 
    useEdgesState, 
    Connection, 
    addEdge,
    Node,
    Background,
    Controls
  } from "reactflow";
  import { useQuery } from "@tanstack/react-query";
  import { fetchGraph } from "../service/fetchGraph";
  import { useState, useEffect, useCallback } from "react";
  
  export function Graph() {
    const [selectedNode, setSelectedNode] = useState<Node | null>(null);
    
    const { data, isLoading, error } = useQuery({
      queryKey: ["graphData"],
      queryFn: fetchGraph,
    });
  
    const [nodes, setNodes, onNodesChange] = useNodesState([]);
    const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  
    useEffect(() => {
      if (data) {
        setNodes(data.nodes);
        setEdges(data.edges);
      }
    }, [data, setNodes, setEdges]);
  
    const onConnect = useCallback(
      (connection: Connection) => setEdges((eds) => addEdge(connection, eds)),
      [setEdges]
    );
    
    // Define onNodeClick handler
    const onNodeClick = useCallback((event: React.MouseEvent, node: Node) => {
      console.log("Node clicked:", node);
      setSelectedNode(node);
    }, []);
  
    if (isLoading) return <div>Loading...</div>;
    if (error) return <div>Error fetching graph data: {(error as Error).message}</div>;
  
    return (
      <div style={{ display: "flex", height: "100vh" }}>
        <div style={{ flex: 1 }}>
          <ReactFlow 
            nodes={nodes} 
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            onNodeClick={onNodeClick}
            fitView
          >
            <Controls />
            <Background />
          </ReactFlow>
        </div>
        
        {/* We'll add the PrefillMappingPanel here later */}
      </div>
    );
  }