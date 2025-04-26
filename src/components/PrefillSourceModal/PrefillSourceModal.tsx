import React, { useState } from 'react';
import styles from "./styles.module.css";
export const PrefillSourceModal = ({ open, onClose, onSelect, sources, fieldName }) =>{
    if (!open) return null;
    
    const [searchTerm, setSearchTerm] = useState("");
    const [expandedItems, setExpandedItems] = useState({
      // Default to having "Form B" expanded as in the screenshot
      "Direct: Form B": true
    });
    
    // Toggle expansion state of an item
    const toggleItem = (itemLabel) => {
      setExpandedItems(prev => ({
        ...prev,
        [itemLabel]: !prev[itemLabel]
      }));
    };
    
    // Filter sources and fields based on search term
    const getFilteredSources = () => {
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
        .filter(Boolean);
    };
    
    const filteredSources = getFilteredSources();
  
    return (
      <div style={{
        position: "fixed",
        left: 0,
        top: 0,
        width: "100vw",
        height: "100vh",
        background: "rgba(0,0,0,0.5)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1000
      }}>
        <div style={{
          width: '700px',
          maxHeight: '80vh',
          backgroundColor: 'white',
          borderRadius: '8px',
          boxShadow: '0 2px 10px rgba(0, 0, 0, 0.2)',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden'
        }}>
          {/* Header */}
          <div style={{ 
            padding: '15px 20px',
            borderBottom: '1px solid #eaeaea'
          }}>
            <h2 style={{ 
              margin: 0, 
              fontSize: '18px',
              fontWeight: 500
            }}>
              Select data element to map
            </h2>
          </div>
          
          <div style={{ 
            display: 'flex',
            height: '500px'
          }}>
            {/* Left panel with data sources */}
            <div style={{
              width: '360px',
              borderRight: '1px solid #eaeaea',
              display: 'flex',
              flexDirection: 'column'
            }}>
              <div style={{ padding: '15px 20px' }}>
                <h3 style={{ 
                  margin: '0 0 15px',
                  fontSize: '16px',
                  fontWeight: 500 
                }}>
                  Available data
                </h3>
                
                {/* Search box */}
                <div style={{ 
                  position: 'relative',
                  marginBottom: '15px'
                }}>
                  <input
                    type="text"
                    placeholder="Search"
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '8px 10px 8px 35px',
                      border: '1px solid #ddd',
                      borderRadius: '4px',
                      fontSize: '14px'
                    }}
                  />
                  <div style={{ 
                    position: 'absolute',
                    left: '10px',
                    top: '50%',
                    transform: 'translateY(-50%)'
                  }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="#999">
                      <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
                    </svg>
                  </div>
                </div>
              </div>
              
              {/* Data sources list */}
              <div style={{ 
                overflowY: 'auto',
                flexGrow: 1,
                padding: '0 20px 15px'
              }}>
                {/* Global Properties */}
                <div style={{ marginBottom: '8px' }}>
                  <div 
                    onClick={() => toggleItem("Action Properties")}
                    style={{ 
                      display: 'flex',
                      alignItems: 'center',
                      padding: '8px 0',
                      cursor: 'pointer'
                    }}
                  >
                    <svg 
                      width="16" 
                      height="16" 
                      viewBox="0 0 24 24"
                      style={{
                        transform: expandedItems["Action Properties"] ? 'rotate(90deg)' : 'rotate(0)',
                        transition: 'transform 0.2s ease',
                        marginRight: '6px'
                      }}
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
                          style={{ 
                            padding: '6px 0 6px 22px', 
                            cursor: 'pointer'
                          }}
                        >
                          {field.field}
                        </div>
                      ))
                  }
                </div>
                
                <div style={{ marginBottom: '8px' }}>
                  <div 
                    onClick={() => toggleItem("Client Organisation Properties")}
                    style={{ 
                      display: 'flex',
                      alignItems: 'center',
                      padding: '8px 0',
                      cursor: 'pointer'
                    }}
                  >
                    <svg 
                      width="16" 
                      height="16" 
                      viewBox="0 0 24 24"
                      style={{
                        transform: expandedItems["Client Organisation Properties"] ? 'rotate(90deg)' : 'rotate(0)',
                        transition: 'transform 0.2s ease',
                        marginRight: '6px'
                      }}
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
                          style={{ 
                            padding: '6px 0 6px 22px', 
                            cursor: 'pointer'
                          }}
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
                      <div key={source.label} style={{ marginBottom: '8px' }}>
                        <div 
                          onClick={() => toggleItem(source.label)}
                          style={{ 
                            display: 'flex',
                            alignItems: 'center',
                            padding: '8px 0',
                            cursor: 'pointer',
                            backgroundColor: expandedItems[source.label] ? '#f0f7ff' : 'transparent',
                            borderRadius: '4px'
                          }}
                        >
                          <svg 
                            width="16" 
                            height="16" 
                            viewBox="0 0 24 24"
                            style={{
                              transform: expandedItems[source.label] ? 'rotate(90deg)' : 'rotate(0)',
                              transition: 'transform 0.2s ease',
                              marginRight: '6px'
                            }}
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
                            style={{ 
                              padding: '6px 0 6px 22px', 
                              cursor: 'pointer'
                            }}
                          >
                            {field.field}
                          </div>
                        ))}
                      </div>
                    );
                  })}
              </div>
            </div>
            
            {/* Right panel (empty as in your screenshot) */}
            <div style={{ flex: 1 }}>
              {/* This area is empty in your design */}
            </div>
          </div>
          
          {/* Footer */}
          <div style={{ 
            padding: '15px 20px',
            borderTop: '1px solid #eaeaea',
            display: 'flex',
            justifyContent: 'flex-end',
            gap: '10px'
          }}>
            <button
              onClick={onClose}
              style={{
                padding: '8px 16px',
                backgroundColor: 'transparent',
                border: '1px solid #ddd',
                borderRadius: '4px',
                fontSize: '14px',
                cursor: 'pointer'
              }}
            >
              CANCEL
            </button>
            <button
              style={{
                padding: '8px 16px',
                backgroundColor: '#f5f5f5',
                border: 'none',
                borderRadius: '4px',
                color: '#999',
                fontSize: '14px',
                cursor: 'default'
              }}
              disabled
            >
              SELECT
            </button>
          </div>
        </div>
      </div>
    );
  }