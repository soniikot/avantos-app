import styles from './styles.module.scss';
import {Handle, Position} from "@xyflow/react";

enum NodeTypes {
    target = "target",
    source = "source",
}

export interface NodeData {
  name: string;
  input_mapping?: Record<string, any>;
  prerequisites?: string[];
  component_id?: string;
  [key: string]: unknown;
}

export const FormNode = ({ data }: { data: NodeData }) => {
    return (
      <div className={styles.formNode}>
        <Handle
          type="target"
          position={Position.Top}
          id={NodeTypes.target}
          className={styles.nodeHandle}
        />

        <div className={styles.formNodeTitle}>{data.name}</div>
        
        <Handle
          type="source"
          position={Position.Bottom}
          id={NodeTypes.source}
          className={styles.nodeHandle}
        />
      </div>
    );
  };