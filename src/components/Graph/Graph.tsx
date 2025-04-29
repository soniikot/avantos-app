import { ReactFlow, Controls, Background, NodeMouseHandler } from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { useQuery } from "@tanstack/react-query";
import { fetchGraph } from "../../service/fetchGraph";
import { useEffect, useState, useMemo } from 'react';
import { FormPrefillPanel } from '../FormPrefillPanel/FormPrefillPanel';
import { Node } from '../../GlobalTypes/types';
import { FormNode } from '../FormNode/FormNode';
import styles from "./styles.module.css"

export interface EdgeData {
  source: string;
  target: string;
}

export function Graph() {
  const nodeTypes = useMemo(() => ({ form: FormNode  }), []);

  const [nodes, setNodes] = useState<Node[]>([]);
  const [edges,setEdges] = useState([]);
  const [selectedNode, setSelectedNode] = useState<any>(null);

  const { data, isLoading, error } = useQuery({
    queryKey: ["graph-data"],
    queryFn: fetchGraph,
  });
  
    const onNodeClick: NodeMouseHandler = (_event, node) => {
        setSelectedNode(node);
      };

  useEffect(() => {
    if (data) { 
        const processedEdges = data.edges.map((edge: EdgeData, index:number) => ({
            id: `${index}`,
            source: edge.source,
            target: edge.target,
            sourceHandle: "source",
            targetHandle: "target",
            type: 'smoothstep', 
            markerEnd: {
              type: 'arrowclosed',
              width: 30,
              height: 30,
            },
        }));

      setNodes(data.nodes)
     setEdges(processedEdges);
    }
  },
   [data]);
  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;
  
  return (
    <div className={styles.graphContainer}>

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
  <FormPrefillPanel
    node={selectedNode}
    nodes={nodes}
    edges={edges}
    forms={data.forms} 
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