import styles from "./styles.module.scss";
import type { SourceData, MappingData } from "@app-types/types";
import clsx from 'clsx';
import { MdChevronRight } from "react-icons/md";

export enum SourceType {
  FORM = "form",
  GLOBAL = "global"
}

export const CategorySection = ({ 
    title, 
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
         <MdChevronRight 
  className={clsx(
    styles.expandIcon,
    expanded ? styles.expanded : styles.collapsed
  )}
  size={16}
/>
          <span>{title}</span>
        </div>
        
        {expanded &&
        sources
          .find((source) => source.label === sourceLabel)
          ?.fields?.map((field) => (
            <div
              key={field.field}
              onClick={() =>
                onSelect({
                  sourceType: sourceLabel.includes("Form") 
                            ? SourceType.FORM 
                            : SourceType.GLOBAL,
                  sourceFormId: field.formId,
                  sourceField: field.field,
                })
              }
              className={styles.sourceItem}
            >
              {field.field}
            </div>
          ))}
      </div>
    );
  };