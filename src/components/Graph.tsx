import { ReactFlow, Controls, Background, Handle, Position } from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { useQuery } from "@tanstack/react-query";
import { fetchGraph } from "../service/fetchGraph";
import { useEffect, useState, useMemo } from 'react';

interface EdgeData {
    source: string;
    target: string;
  }


interface FormNodeData {
    name: string;
}

const FormNode = ({ data }: { data: FormNodeData }) => {
    return (
      <div style={{
        padding: '10px',
        borderRadius: '5px',
        border: '1px solid #6495ed',
        backgroundColor: '#f0f8ff',
        minWidth: '150px',
        textAlign: 'center',
        position: 'relative'
      }}>
        <Handle
          type="target"
          position={Position.Top}
          id="b"
          style={{ background: '#555' }}
        />
        
        <div style={{ fontWeight: 'bold' }}>{data.name || 'Form'}</div>
        
        <Handle
          type="source"
          position={Position.Bottom}
          id="a"
          style={{ background: '#555' }}
        />
      </div>
    );
  };

export function Graph() {
  const nodeTypes = useMemo(() => ({ form: FormNode }), []);
  
  const [nodes, setNodes] = useState([]);
  const [edges,setEdges] = useState([]);

  const { data, isLoading, error } = useQuery({
    queryKey: ["graph-data"],
    queryFn: fetchGraph,
  });
  

  useEffect(() => {
    if (data) { 
        const processedEdges = data.edges.map((edge: EdgeData, index:number) => ({
            id: `e${index}`,
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
      >
        <Controls />
        <Background />
      </ReactFlow>
    </div>
  );
}