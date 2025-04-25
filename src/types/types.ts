

export interface FormField {
    name: string;
    title: string;
    type: string;
    avantos_type?: string;
    format?: string;
  }

  export interface FormSchema {
    type: string;
    properties: Record<string, {
      avantos_type?: string;
      title?: string;
      type: string;
      format?: string;
      items?: any;
      enum?: any[];
    }>;
    required?: string[];
  }
  
  export interface Form {
    id: string;
    name: string;
    description: string;
    is_reusable: boolean;
    field_schema: FormSchema;
    ui_schema: any;
    dynamic_field_config?: any;
  }
  
  export interface NodeData {
    id: string;
    component_key: string;
    component_type: string;
    component_id: string;
    name: string;
    prerequisites: string[];
    permitted_roles: string[];
    input_mapping: any;
    sla_duration: {
      number: number;
      unit: string;
    };
    approval_required: boolean;
    approval_roles: string[];
    label?: string;
    formFields?: FormField[];
  }
  
  export interface GraphNode {
    id: string;
    type: string;
    position: {
      x: number;
      y: number;
    };
    data: NodeData;
  }
  
  export interface GraphEdge {
    id?: string;
    source: string;
    target: string;
    animated?: boolean;
    style?: any;
    markerEnd?: any;
  }
  
  export interface GraphData {
    $schema: string;
    id: string;
    tenant_id: string;
    name: string;
    description: string;
    category: string;
    nodes: GraphNode[];
    edges: GraphEdge[];
    forms: Form[];
    branches: any[];
    triggers: any[];
  }
