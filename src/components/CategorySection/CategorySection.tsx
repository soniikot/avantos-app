import styles from "./styles.module.scss";

export const CategorySection = ({ 
    title, 
    fieldPrefix, 
    expanded, 
    onToggle, 
    sources, 
    onSelect,
    sourceLabel
  }: {
    title: string;
    sourceLabel: string;
    fieldPrefix?: string;
    expanded: boolean;
    onToggle: () => void;
    sources: SourceData[];
    onSelect: (mapping: MappingData) => void;
  }) => {
    return (
      <div className={styles.categoryContainer}>
        <div 
          onClick={onToggle}
          className={styles.categoryHeader}
        >
          <svg 
            width="16" 
            height="16" 
            viewBox="0 0 24 24"
            className={`${styles.expandIcon} ${expanded ? styles.expanded : styles.collapsed}`}
          >
            <path fill="#666" d="M8.59,16.58L13.17,12L8.59,7.41L10,6L16,12L10,18L8.59,16.58Z" />
          </svg>
          <span>{title}</span>
        </div>
        
        {expanded && 
        sources.find(source => source.label === sourceLabel)?.fields
          ?.filter(field => !fieldPrefix || field.field.startsWith(fieldPrefix))
          .map(field => (
            <div 
              key={field.field}
              onClick={() => onSelect({
                sourceType: field.formId === "global" ? "global" : "form",
                sourceFormId: field.formId,
                sourceField: field.field
              })}
              className={styles.sourceItem}
            >
              {field.field}
            </div>
          ))
      }
      </div>
    );
  };