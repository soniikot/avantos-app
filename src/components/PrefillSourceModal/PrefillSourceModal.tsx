import React, { useState } from 'react';
import styles from "./styles.module.scss";
import {CategorySection} from '../CategorySection/CategorySection';
import { PrefillSourceModalProps, SourceData } from '@/types/types';

export const PrefillSourceModal: React.FC<PrefillSourceModalProps> = ({ 
  open, 
  onClose, 
  onSelect, 
  sources, 
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
  
/**
 * Filters sources and fields based on search term
 */
const getFilteredSources = (): SourceData[] => {
  if (!searchTerm.trim()) {
    return sources;
  }
  
  const searchLower = searchTerm.toLowerCase();
  
  return sources.reduce((result: SourceData[], source) => {

    const filteredFields = source.fields.filter(field => 
      field.field.toLowerCase().includes(searchLower) ||
      source.label.toLowerCase().includes(searchLower) ||
      (field.formName && field.formName.toLowerCase().includes(searchLower))
    );
    
    if (filteredFields.length > 0) {
      result.push({
        ...source,
        fields: filteredFields
      });
    }
    
    return result;
  }, []);
};
const filteredSources = getFilteredSources();

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <div className={styles.modalHeader}>
          <h2 className={styles.modalTitle}>
            Select data element to map
          </h2>
        </div>
        
        <div className={styles.modalBody}>
          <div className={styles.leftPanel}>
            <div className={styles.panelHeader}>
           
              
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
            
<div className={styles.sourcesList}>
<CategorySection
  title="Action Properties"
  fieldPrefix="action_"
  sourceLabel="Global Data"
  expanded={expandedItems["Action Properties"]}
  onToggle={() => toggleItem("Action Properties")}
  sources={filteredSources}
  onSelect={onSelect}
/>

<CategorySection
  title="Client Organization Properties"
  fieldPrefix="action_"
  sourceLabel="Global Data"
  expanded={expandedItems["Client Organization Properties"]}
  onToggle={() => toggleItem("Client Organization Properties")}
  sources={filteredSources}
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
        sources={filteredSources}
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
        </div>
      </div>
      </div>
  );
};