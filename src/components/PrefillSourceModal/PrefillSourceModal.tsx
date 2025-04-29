
import React, { useState, useMemo } from 'react';
import styles from "./styles.module.scss";
import { CategorySection } from '../CategorySection/CategorySection';
import { FieldData, PrefillSourceModalProps, SourceData } from '@/types/types';
import { FaSearch } from 'react-icons/fa';

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
  
  /**
   * Filters sources and fields based on search term
   */
  const filteredSources = useMemo(() => {
    if (!searchTerm.trim()) {
      return sources;
    }
    
    const searchLower = searchTerm.toLowerCase();
    
  const fieldMatchesSearch = (field:FieldData)=> {
    return field.field.toLowerCase().includes(searchLower);
  };
  
  const sourceMatchesSearch = (source: SourceData) => {
    return source.label.toLowerCase().includes(searchLower);
  };
  
  return sources.reduce((result: SourceData[], source) => {
    if (sourceMatchesSearch(source)) {
      result.push(source);
      return result;
    }
    const filteredFields = source.fields.filter(fieldMatchesSearch);
    
    if (filteredFields.length > 0) {
      result.push({
        ...source,
        fields: filteredFields
      });
    }
    
    return result;
  }, []);
}, [sources, searchTerm]);

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <div className={styles.modalHeader}>
          <h2 className={styles.modalTitle}>
            Select data source for "{fieldName}"
          </h2>
        </div>
        
        <div className={styles.modalBody}>
       
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
                <FaSearch size={13}  />
                </div>
              </div>
        
            
            <div className={styles.sourcesList}>
              {filteredSources.map(source => (
                <CategorySection
                  key={source.label}
                  title={source.label}
                  sourceLabel={source.label}
                  expanded={expandedItems[source.label] ?? !!searchTerm}
                  onToggle={() => toggleItem(source.label)}
                  sources={filteredSources}
                  onSelect={onSelect}
                />
              ))}
              
              {filteredSources.length === 0 && searchTerm && (
                <div className={styles.noResults}>
                  No matches found for "{searchTerm}"
                </div>
              )}
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