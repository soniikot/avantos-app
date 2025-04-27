export interface EdgeData {
  source: string;
  target: string;
}


export interface FormNodeData {



}

export interface Node {
  id: string;
  type: string;
  position: {
    x: number;
    y: number;
  };
  data: {
    name: string;
    input_mapping?: Record<string, string>;
    [key: string]: any; 
  };
}