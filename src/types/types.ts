
export interface EdgeData {
  source: string;
  target: string;
}


export interface NodeData {
  name: string;
  input_mapping?: Record<string, any>;
  prerequisites?: string[];
  component_id?: string;
  [key: string]: unknown;
}

export interface Node {
  id:string;
  type:string;
  position: {
    x:number;
    y:number;
  };
  data: NodeData; 
}


export interface FormSchema {
  id: string;
  field_schema: {
    properties: Record<string, unknown>;
  };
}

export interface FieldData {
  field: string;
  formName: string;
  formId: string;
}

export interface SourceData {
  label: string;
  fields: FieldData[];
}

export interface MappingData {
  sourceType: "global" | "form";
  sourceFormId: string;
  sourceField: string;
}


export interface PrefillSourceModalProps {
  open: boolean;
  onClose: () => void;
  onSelect: (mapping: MappingData) => void;
  sources: SourceData[];
  fieldName: string;
}
