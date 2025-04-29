import React, { useState } from "react";
import { PrefillSourceModal } from "@components/PrefillSourceModal/PrefillSourceModal";
import type { Node } from "@app-types/types";
import { Edge } from '@xyflow/react';
import styles from './styles.module.scss';



interface FormSchema {
  id: string;
  field_schema: {
    properties: Record<string, unknown>;
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

/*
* Find the form schema for a given node
*/
function FindNodeWithFormSchema(node: Node, forms: FormSchema[]){
  return forms.find(f => f.id === node.data.component_id);
}

/*
* Get all upstream nodes for a given node
*/
function getUpstreamNodes(node: Node, nodes: Node[]): Node[] {
  const visited = new Set<string>();
  const result: Node[] = [];
  
  function traverseGraph(currentNode: Node): void {
    if (visited.has(currentNode.id)) return;
    visited.add(currentNode.id);
    
    const upstreamNodes = currentNode.data.prerequisites ?? [];
    if (upstreamNodes.length === 0) return;
    
    upstreamNodes.forEach(upstreamNodeId => {
      const upstreamNode = nodes.find(node => node.id === upstreamNodeId);
      
      if (upstreamNode) {
        const isDuplicate = result.some(existingNode => existingNode.id === upstreamNode.id);
        
        if (!isDuplicate) {
          result.push(upstreamNode);
        }
        
        traverseGraph(upstreamNode);
      }
    });
    }
  
  traverseGraph(node);
  return result;
}

// Mock global data
const globalFields = [
  { field: "organization_name", label: "organization_name" },
  { field: "action_type", label: "action_type" }
];

export const FormPrefillPanel = ({
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
    node.data.input_mapping ?? {}
  );

  const formSchema = FindNodeWithFormSchema(node, forms);
  const fieldNames = formSchema ? Object.keys(formSchema.field_schema.properties) : [];
const upstreamNodes = getUpstreamNodes(node, nodes);

const sources = [

  ...upstreamNodes.map(node => {
    const nodeSchema = FindNodeWithFormSchema(node, forms);
    if (!nodeSchema) return null;
    
    return {
      label: `Form: ${node.data.name}`,  
      fields: Object.keys(nodeSchema.field_schema.properties).map(field => ({
        field: field
      }))
    };
  }),
  
  {
    label: "Global Data",
    fields: globalFields.map(f => ({
      field: f.field,
    }))
  }
]

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