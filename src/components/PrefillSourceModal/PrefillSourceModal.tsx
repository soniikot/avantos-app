import React, { useState } from 'react';
import styles from "./styles.module.css";

// Define types for the component props
interface FieldData {
  field: string;
  formName: string;
  formId: string;
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
  
  // Toggle expansion state of an item
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
        // Filter fields in this source
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
        </div>
        
        <div className={styles.modalBody}>
          {/* Left panel with data sources */}
          <div className={styles.leftPanel}>
            <div className={styles.panelHeader}>
              <h3 className={styles.panelTitle}>
                Available data
              </h3>
              
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
              {/* Global Properties */}
              <div className={styles.categoryContainer}>
                <div 
                  onClick={() => toggleItem("Action Properties")}
                  className={styles.categoryHeader}
                >
                  <svg 
                    width="16" 
                    height="16" 
                    viewBox="0 0 24 24"
                    className={`${styles.expandIcon} ${expandedItems["Action Properties"] ? styles.expanded : styles.collapsed}`}
                  >
                    <path fill="#666" d="M8.59,16.58L13.17,12L8.59,7.41L10,6L16,12L10,18L8.59,16.58Z" />
                  </svg>
                  <span>Action Properties</span>
                </div>
                
                {expandedItems["Action Properties"] && 
                  sources.find(s => s.label === "Global Data")?.fields
                    .filter(f => f.formName === "Global" && f.field.startsWith("action_"))
                    .map(field => (
                      <div 
                        key={field.field}
                        onClick={() => onSelect({
                          sourceType: "global",
                          sourceFormId: "global",
                          sourceField: field.field
                        })}
                        className={styles.fieldItem}
                      >
                        {field.field}
                      </div>
                    ))
                }
              </div>
              
              <div className={styles.categoryContainer}>
                <div 
                  onClick={() => toggleItem("Client Organisation Properties")}
                  className={styles.categoryHeader}
                >
                  <svg 
                    width="16" 
                    height="16" 
                    viewBox="0 0 24 24"
                    className={`${styles.expandIcon} ${expandedItems["Client Organisation Properties"] ? styles.expanded : styles.collapsed}`}
                  >
                    <path fill="#666" d="M8.59,16.58L13.17,12L8.59,7.41L10,6L16,12L10,18L8.59,16.58Z" />
                  </svg>
                  <span>Client Organisation Properties</span>
                </div>
                
                {expandedItems["Client Organisation Properties"] && 
                  sources.find(s => s.label === "Global Data")?.fields
                    .filter(f => f.formName === "Global" && f.field.startsWith("organization_"))
                    .map(field => (
                      <div 
                        key={field.field}
                        onClick={() => onSelect({
                          sourceType: "global",
                          sourceFormId: "global",
                          sourceField: field.field
                        })}
                        className={styles.fieldItem}
                      >
                        {field.field}
                      </div>
                    ))
                }
              </div>
              
              {/* Forms */}
              {filteredSources
                .filter(source => source.label !== "Global Data")
                .map(source => {
                  // Extract form name from label (e.g., "Direct: Form A" -> "Form A")
                  const formName = source.label.split(": ")[1];
                  return (
                    <div key={source.label} className={styles.categoryContainer}>
                      <div 
                        onClick={() => toggleItem(source.label)}
                        className={`${styles.formHeader} ${expandedItems[source.label] ? styles.expandedForm : ''}`}
                      >
                        <svg 
                          width="16" 
                          height="16" 
                          viewBox="0 0 24 24"
                          className={`${styles.expandIcon} ${expandedItems[source.label] ? styles.expanded : styles.collapsed}`}
                        >
                          <path fill="#666" d="M8.59,16.58L13.17,12L8.59,7.41L10,6L16,12L10,18L8.59,16.58Z" />
                        </svg>
                        <span>{formName}</span>
                      </div>
                      
                      {expandedItems[source.label] && source.fields.map(field => (
                        <div 
                          key={field.formId + field.field}
                          onClick={() => onSelect({
                            sourceType: field.formId === "global" ? "global" : "form",
                            sourceFormId: field.formId,
                            sourceField: field.field
                          })}
                          className={styles.fieldItem}
                        >
                          {field.field}
                        </div>
                      ))}
                    </div>
                  );
                })}
            </div>
          </div>
          
         
          <div className={styles.rightPanel}>
            {/* You could show selected field info here */}
            {fieldName && (
              <div className={styles.selectedField}>
                <h3 className={styles.rightPanelTitle}>Selected Field</h3>
                <p>{fieldName}</p>
              </div>
            )}
          </div>
        </div>
        
        {/* Footer */}
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