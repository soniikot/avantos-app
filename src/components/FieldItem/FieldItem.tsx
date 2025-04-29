import styles from "./styles.module.scss";
import { MappingData , Node} from "@/GlobalTypes/types";
import { SourceType } from "@/GlobalTypes/types";

export const FieldItem = ({ 
    field, 
    mapping, 
    nodes, 
    onRemove, 
    onAdd 
  }: { 
    field: string, 
    mapping?: MappingData, 
    nodes: Node[], 
    onRemove: (field: string) => void,
    onAdd: () => void
  }) => {
    if (mapping) {
      let sourceFormName = mapping.sourceFormId;
      if (mapping.sourceType === SourceType.FORM) {
        const sourceNode = nodes.find(node => node.id === mapping.sourceFormId);
        sourceFormName = sourceNode?.data.name ?? mapping.sourceFormId;
      } else if (mapping.sourceType === SourceType.GLOBAL) {
        sourceFormName = "Global";
      }
      

      return (
        <div className={styles.mappedField}>
          <span>
            <b>{field}</b>: {sourceFormName}.{mapping.sourceField}
          </span>
          <button 
            className={styles.removeButton}
            onClick={() => onRemove(field)}
          >
            ×
          </button>
        </div>
      );
    }
    return (
      <div
        className={styles.unmappedField}
        onClick={onAdd}
      >
        <span className={styles.fieldIcon}>🗄️</span>
        {field}
      </div>
    );
  };