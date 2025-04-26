import React, { useState } from "react";
import { PrefillSourceModal } from "../PrefillSourceModal/PrefillSourceModal";
import styles from './styles.module.css';

// Helper: get form schema for a node
function getFormSchema(node: any, forms: any[]) {
  return forms.find(f => f.id === node.data.component_id);
}

// Helper: get all field names for a form
function getFieldNames(formSchema: any) {
  return Object.keys(formSchema.field_schema.properties);
}

// Helper: get direct and transitive dependencies
function getUpstreamForms(node: any, nodes: any[]) {
  const visited = new Set();
  const result: any[] = [];
  function dfs(n: any) {
    if (visited.has(n.id)) return;
    visited.add(n.id);
    for (const prereqId of n.data.prerequisites || []) {
      const prereqNode = nodes.find((x: any) => x.id === prereqId);
      if (prereqNode) {
        result.push(prereqNode);
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
  data,
  onClose,
  onSave
}: {
  node: any;
  nodes: any[];
  edges: any[];
  data: any;
  onClose: () => void;
  onSave: (nodeId: string, inputMapping: any) => void;
})=> {
  const [modalField, setModalField] = useState<string | null>(null);
  const [inputMapping, setInputMapping] = useState(
    node.data.input_mapping || {}
  );

  const formSchema = getFormSchema(node, data.forms);
  if (!formSchema) return <div>Form schema not found.</div>;
  const fieldNames = getFieldNames(formSchema);

  // Data sources
  const directDeps = (node.data.prerequisites || []).map((id: string) =>
    nodes.find(n => n.id === id)
  );
  const transitiveDeps = getUpstreamForms(node, nodes).filter(
    n => !directDeps.includes(n)
  );

  // Modal: all sources
  const sources = [
    ...directDeps.map(dep =>
      dep
        ? {
            label: `Direct: ${dep.data.name}`,
            fields: getFieldNames(getFormSchema(dep, data.forms)).map(f => ({
              field: f,
              formName: dep.data.name,
              formId: dep.id
            }))
          }
        : null
    ),
    ...transitiveDeps.map(dep =>
      dep
        ? {
            label: `Transitive: ${dep.data.name}`,
            fields: getFieldNames(getFormSchema(dep, data.forms)).map(f => ({
              field: f,
              formName: dep.data.name,
              formId: dep.id
            }))
          }
        : null
    ),
    {
      label: "Global Data",
      fields: globalFields.map(f => ({
        field: f.field,
        formName: "Global",
        formId: "global"
      }))
    }
  ].filter(Boolean);

  function handleRemoveMapping(field: string) {
    const newMapping = { ...inputMapping };
    delete newMapping[field];
    setInputMapping(newMapping);
    onSave(node.id, newMapping);
  }

  function handleSelectPrefillSource(field: string, mapping: any) {
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
              <div key={field} className={styles.mappedField}>
                <span>
                  <b>{field}</b>: {sourceFormName}.{mapping.sourceField}
                </span>
                <button
                  onClick={() => handleRemoveMapping(field)}
                  className={styles.removeButton}
                  aria-label="Remove mapping"
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
      <button onClick={onClose} className={styles.closeButton}>
        Close
      </button>
    </div>
  );
}