import React, { useState } from 'react';
import styles from "./styles.module.scss";
import {CategorySection} from '../CategorySection/CategorySection';
// Define types for the component props
interface FieldData {
  field: string;
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

interface PrefillSourceModalProps {
  open: boolean;
  onClose: () => void;
  onSelect: (mapping: MappingData) => void;
  sources: SourceData[];
  fieldName: string;
}

export const PrefillSourceModal: React.FC<PrefillSourceModalProps> = ({ 
  open, 
  onClose, 
  onSelect, 
  sources, 
  fieldName 
}) => {
  if (!open) return null;
  
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [expandedItems, setExpandedItems] = useState<Record<string, boolean>>({});
  
  const toggleItem = (itemLabel: string): void => {
    setExpandedItems(prev => ({
      ...prev,
      [itemLabel]: !prev[itemLabel]
    }));
  };
  
  // Filter sources and fields based on search term
  const getFilteredSources = (): SourceData[] => {
    if (!searchTerm.trim()) {
      return sources;
    }
    
    const searchLower = searchTerm.toLowerCase();
    
    return sources
      .map(source => {
        const filteredFields = source.fields.filter(field => 
          field.field.toLowerCase().includes(searchLower) ||
          source.label.toLowerCase().includes(searchLower)
        );
        
        if (filteredFields.length > 0) {
          return {
            ...source,
            fields: filteredFields
          };
        }
        
        return null;
      })
      .filter(Boolean) as SourceData[];
  };
const filteredSources = getFilteredSources();

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        {/* Header */}
        <div className={styles.modalHeader}>
          <h2 className={styles.modalTitle}>
            Select data element to map
          </h2>
          <div>
                <p>{fieldName}</p>
    
            </div>
        </div>
        
        <div className={styles.modalBody}>
          {/* Left panel with data sources */}
          <div className={styles.leftPanel}>
            <div className={styles.panelHeader}>
           
              
              {/* Search box */}
              <div className={styles.searchContainer}>
                <input
                  type="text"
                  placeholder="Search"
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                  className={styles.searchInput}
                />
                <div className={styles.searchIcon}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="#999">
                    <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
                  </svg>
                </div>
              </div>
            </div>
            
            {/* Data sources list */}
<div className={styles.sourcesList}>
<CategorySection
  title="Action Properties"
  fieldPrefix="action_"
  sourceLabel="Global Data"
  expanded={expandedItems["Action Properties"]}
  onToggle={() => toggleItem("Action Properties")}
  sources={sources}
  onSelect={onSelect}
/>

<CategorySection
  title="Client Organization Properties"
  fieldPrefix="action_"
  sourceLabel="Global Data"
  expanded={expandedItems["Client Organization Properties"]}
  onToggle={() => toggleItem("Client Organization Properties")}
  sources={sources}
  onSelect={onSelect}
/>
{filteredSources
    .filter(source => source.label !== "Global Data")
    .map(source => (
      <CategorySection
        key={source.label}
        title={source.label.replace("Form: ", "")}
        sourceLabel={source.label}
        expanded={expandedItems[source.label] || false}
        onToggle={() => toggleItem(source.label)}
        sources={sources}
        onSelect={onSelect}
      />
    ))
  }

            </div>
          </div>

        </div>
        
        <div className={styles.modalFooter}>
          <button
            onClick={onClose}
            className={styles.cancelButton}
          >
            CANCEL
          </button>
          <button
            className={styles.selectButton}
            disabled
          >
            SELECT
          </button>
        </div>
      </div>
      </div>
  );
};