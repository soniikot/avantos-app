export interface NodeData {
  name: string;
  input_mapping?: Record<string, unknown>;
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
  sourceType: SourceType;
  sourceFormId: string;
  sourceField: string;
}

export enum SourceType {
  FORM = "form",
  GLOBAL = "global"
}

export interface PrefillSourceModalProps {
  open: boolean;
  onClose: () => void;
  onSelect: (mapping: MappingData) => void;
  sources: SourceData[];
  fieldName: string;
}
