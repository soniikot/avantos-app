import React, { useState } from "react";
import { PrefillSourceModal } from "../PrefillSourceModal/PrefillSourceModal";
import { Node } from "../../types/types";
import { Edge } from '@xyflow/react';
import styles from './styles.module.css';


interface FormSchema {
  id: string;
  field_schema: {

    properties: Record<string, any>;
  };
}

interface FieldData {
  field: string;
  formName: string;
  formId: string;
}

interface SourceData {
  label: string;
  fields: FieldData[];
}

interface MappingData {
  sourceType: "global" | "form";
  sourceFormId: string;
  sourceField: string;
}

// Helper: get form schema for a node
function getFormSchema(node: Node, forms: FormSchema[]){
  return forms.find(f => f.id === node.data.component_id);
}

// Helper: get all field names for a form
function getFieldNames(formSchema: FormSchema): string[] {
  return Object.keys(formSchema.field_schema.properties);
}


// Helper: get direct and transitive dependencies
function getUpstreamForms(node: Node, nodes: Node[]): Node[] {
  const visited = new Set<string>();
  const result: Node[] = [];
  
  function dfs(n: Node): void {
    if (visited.has(n.id)) return;
    visited.add(n.id);
    

    const prerequisites = n.data.prerequisites || [];
    
    for (const prereqId of prerequisites) {
      const prereqNode = nodes.find(x => x.id === prereqId);
      if (prereqNode) {
        // Add to result if not already added
        if (!result.some(existingNode => existingNode.id === prereqNode.id)) {
          result.push(prereqNode);
        }
        dfs(prereqNode);
      }
    }
  }
  
  dfs(node);
  return result;
}

// Mock global data
const globalFields = [
  { field: "organization_name", label: "organization_name" },
  { field: "action_type", label: "action_type" }
];

export const PrefillMappingPanel = ({
  node,
  nodes,
  forms,
  onClose,
  onSave
}: {
  node: Node;
  nodes: Node[];
  edges: Edge[];
  forms: FormSchema[];
  onClose: () => void;
  onSave: (nodeId: string, inputMapping: Record<string, MappingData>) => void;
}) => {
  const [modalField, setModalField] = useState<string | null>(null);
  const [inputMapping, setInputMapping] = useState<Record<string, MappingData>>(
    node.data.input_mapping || {}
  );

  const formSchema = getFormSchema(node, forms);
  const fieldNames = formSchema ? getFieldNames(formSchema) : [];

  // Get all upstream forms in one collection
const allDependencyForms = getUpstreamForms(node, nodes);

// Define sources for the modal with simplified categories
const sources: SourceData[] = [

  ...allDependencyForms.map(dep => {
    const depSchema = getFormSchema(dep, forms);
    if (!depSchema) return null;
    
    return {
      label: `Form: ${dep.data.name}`,  
      fields: getFieldNames(depSchema).map(f => ({
        field: f,
        formName: dep.data.name,
        formId: dep.id
      }))
    };
  }),
  
  {
    label: "Global Data",
    fields: globalFields.map(f => ({
      field: f.field,
      formName: "Global",
      formId: "global"
    }))
  }
].filter(Boolean) as SourceData[];

  function handleRemoveMapping(field: string): void {
    const newMapping = { ...inputMapping };
    delete newMapping[field];
    setInputMapping(newMapping);
    onSave(node.id, newMapping);
  }

  function handleSelectPrefillSource(field: string, mapping: MappingData): void {
    const newMapping = { ...inputMapping, [field]: mapping };
    setInputMapping(newMapping);
    setModalField(null);
    onSave(node.id, newMapping);
  }

  return (
    <div className={styles.panel}>
      <h3 className={styles.title}>Prefill</h3>
      <div className={styles.description}>
        Prefill fields for this form
      </div>
      <div>
        {fieldNames.map(field => {
          const mapping = inputMapping[field];
          if (mapping) {
            let sourceFormName = mapping.sourceFormId;
            if (mapping.sourceType === "form") {
              const sourceNode = nodes.find(
                n => n.id === mapping.sourceFormId
              );
              sourceFormName = sourceNode?.data.name || mapping.sourceFormId;
            } else if (mapping.sourceType === "global") {
              sourceFormName = "Global";
            }
            return (
              <div
                key={field}
                className={styles.mappedField}
              >
                <span>
                  <b>{field}</b>: {sourceFormName}.{mapping.sourceField}
                </span>
                <button 
                  className={styles.removeButton}
                  onClick={() => handleRemoveMapping(field)}
                >
                  ×
                </button>
              </div>
            );
          } else {
            return (
              <div
                key={field}
                className={styles.unmappedField}
                onClick={() => setModalField(field)}
              >
                <span className={styles.fieldIcon}>🗄️</span>
                {field}
              </div>
            );
          }
        })}
      </div>
      {modalField && (
        <PrefillSourceModal
          open={!!modalField}
          onClose={() => setModalField(null)}
          onSelect={(mapping) => handleSelectPrefillSource(modalField, mapping)}
          sources={sources}
          fieldName={modalField}
        />
      )}
      <button 
        onClick={onClose} 
        className={styles.closeButton}
      >
        Close
      </button>
    </div>
  );
};