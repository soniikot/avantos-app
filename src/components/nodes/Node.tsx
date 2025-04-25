import { NodeProps, Handle, Position } from '@xyflow/react';

export function Node({ data }: NodeProps) {
  return (
    <div className="form-node" style={{
      padding: '10px',
      borderRadius: '5px',
      border: '1px solid #6495ed',
      backgroundColor: '#f0f8ff',
      minWidth: '150px',
      textAlign: 'center'
    }}>
      <Handle type="target" position={Position.Top} />
      
      <div style={{ fontWeight: 'bold' }}>{data.label || 'Form'}</div>
      
      {data.formFields && (
        <div style={{ fontSize: '11px', marginTop: '5px', color: '#666' }}>
          {data.formFields.length} fields
        </div>
      )}
      
      <Handle type="source" position={Position.Bottom} />
    </div>
  );
}