import { ReactFlow, Controls, Background } from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { useQuery } from "@tanstack/react-query";
import { fetchGraph } from "../../service/fetchGraph";
import { useEffect, useState, useMemo } from 'react';
import { PrefillMappingPanel } from '../PrefillMappingPanel/PrefillMappingPanel';
import { EdgeData, Node } from '../../types/types';
import { FormNode } from '../FormNode/FormNode';


export function Graph() {
  const nodeTypes = useMemo(() => ({ form: FormNode }), []);
  
  const [nodes, setNodes] = useState<Node[]>([]);
  const [edges,setEdges] = useState([]);
  const [selectedNode, setSelectedNode] = useState<any>(null);

  const { data, isLoading, error } = useQuery({
    queryKey: ["graph-data"],
    queryFn: fetchGraph,
  });
  
    const onNodeClick = (event, node:Node ) => {
        setSelectedNode(node);
      };

  useEffect(() => {
    if (data) { 
        const processedEdges = data.edges.map((edge: EdgeData, index:number) => ({
            id: `${index}`,
            source: edge.source,
            target: edge.target,
            sourceHandle: "a",
            targetHandle: "b",
            type: 'smoothstep', 
            markerEnd: {
              type: 'arrowclosed',
              width: 30,
              height: 30,
            },
        }));

      setNodes(data.nodes);
     setEdges(processedEdges);
    }
  }, [data]);
  
  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;
  
  return (
    <div style={{ width: '600px', height: '600px', border: '2px solid blue' }}>

      <ReactFlow 
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        fitView
        onNodeClick={onNodeClick}
      >
   
        <Controls />
        <Background />
      </ReactFlow>
      {selectedNode && (
  <PrefillMappingPanel
    node={selectedNode}
    nodes={nodes}
    edges={edges}
    data={data} 
    onClose={() => setSelectedNode(null)}
    onSave={(nodeId, inputMapping) => {
      setNodes(currentNodes =>
        currentNodes.map(node =>
          node.id === nodeId
            ? { ...node, data: { ...node.data, input_mapping: inputMapping } }
            : node
        )
      );
      
    }}
  />
)}
    </div>
  );
}