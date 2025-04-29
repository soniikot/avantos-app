import React, { useState } from "react";
import { PrefillSourceModal } from "@components/PrefillSourceModal/PrefillSourceModal";
import { Edge } from '@xyflow/react';
import styles from './styles.module.scss';
import type { FormSchema, MappingData, SourceData, Node } from "@app-types/types";
import { FieldItem } from "@components/FieldItem/FieldItem";
import {GLOBAL_DATA} from "../../constants/mockGlobalData";
/*
* Find the form schema for a given node
*/
function FindNodeWithFormSchema(node: Node, forms: FormSchema[]){
  return forms.find(f => f.id === node.data.component_id);
}

/**
 * Get field names from a form schema with safe handling of empty or invalid schemas
 */
function getFieldNames(schema: FormSchema | undefined): string[] {
  if (!schema) return [];
  
  try {
    const properties = schema?.field_schema?.properties ?? {};
    return Object.keys(properties);
  } catch (error) {
    console.error("Error extracting field names:", error);
    return [];
  }
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
  const fieldNames = getFieldNames(formSchema);
const upstreamNodes = getUpstreamNodes(node, nodes);

const sources: SourceData[] = [
  ...upstreamNodes.map(node => {
    const nodeSchema = FindNodeWithFormSchema(node, forms);
    const nodeFields = getFieldNames(nodeSchema);
    
    return {
      label: `Form: ${node.data.name}`,  
      fields: nodeFields.map(field => ({
        field: field,
        formName: node.data.name,
        formId: node.id
      }))
    };
  }),

  ...GLOBAL_DATA.map(category => ({
    label: category.title,  
    fields: category.fields.map(fieldObj => ({
      field: fieldObj.field,
      formName: "Global",
      formId: "global",
      category: category.title
    }))
  }))
];

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
      <div className={styles.description}>
        Prefill fields for form {node.data.name}
      </div>
      
      <div className={styles.fieldsList}>
        {fieldNames.map(field => (
          <FieldItem 
            key={field}
            field={field}
            mapping={inputMapping[field]} 
            nodes={nodes}
            onRemove={handleRemoveMapping}
            onAdd={() => setModalField(field)}
          />
        ))}
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