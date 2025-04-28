
export interface EdgeData {
  source: string;
  target: string;
}


export interface NodeData {
  name: string;
  input_mapping?: Record<string, any>;
  prerequisites?: string[];
  component_id?: string;
}

export interface Node {
  id:string;
  type:string;
  position: {
    x:number;
    y:number;
  };
  data:NodeData;
}