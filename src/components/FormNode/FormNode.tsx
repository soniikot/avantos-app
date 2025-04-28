import {NodeData} from '../../types/types'
import styles from './styles.module.css';
import {Handle, Position} from "@xyflow/react";

enum NodeTypes {
    target = "target",
    source = "source",
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