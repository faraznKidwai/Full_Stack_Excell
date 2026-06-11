import React, { useState, useRef, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '.././App.css';
import {
  Upload,
  FileSpreadsheet,
  Plus,
  RotateCcw,
  TableProperties,
  X,
  Search,
  Save,
  Tag,
  LogOut,
  User,
  Database
} from 'lucide-react';
import { readFile, parseWorkbook, formatFileSize, generateObjects } from '../utils/excelParser';

const AdminDashboard = () => {
  const [workbookData, setWorkbookData] = useState(null);
  const [sheetNames, setSheetNames] = useState([]);
  const [activeSheet, setActiveSheet] = useState(0);
  const [fileInfo, setFileInfo] = useState(null);
  const [dragOver, setDragOver] = useState(false);
  const [toast, setToast] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  
  // Selection states (triggered on single-click)
  const [selectedRowIndex, setSelectedRowIndex] = useState(null);
  const [selectedColIndex, setSelectedColIndex] = useState(null);
  
  // Inline editing control state (triggered on double-click)
  const [editingCell, setEditingCell] = useState({ rowIndex: null, colIndex: null });

  const [searchTerm, setSearchTerm] = useState('');
  const fileInputRef = useRef(null);
  const navigate = useNavigate();

  const currentSheetName = sheetNames[activeSheet];
  const currentData = workbookData ? workbookData[currentSheetName] : null;

  // 1. DYNAMICALLY DETECT STATUS COLUMN POSITION FROM EXCEL OR DATABASE
  const getStatusColumnIndex = () => {
    if (!currentData || !currentData[0]) return 2; // Fallback default
    return currentData[0].findIndex(header => 
      String(header).toLowerCase().trim() === 'status'
    );
  };
  const statusColIdx = getStatusColumnIndex();

  const showToast = useCallback((message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  }, []);

  // Fetch initial data safely on mount
  useEffect(() => {
    const fetchExistingData = async () => {
      setIsLoading(true);
      try {
        // Changed from local host path to a proper clean relative routing system
        const response = await fetch('/api/rows', {
          method: 'GET',
          credentials: 'include',
        });

        if (!response.ok) throw new Error('Failed to load data from server');

        const data = await response.json();
        const headers = ['Ticker', 'Company Name', 'Status', 'Sector', 'Industry'];

        if (data && data.length > 0) {
          const rows = data.map(item => [
            item.ticker || '',
            item.companyName || '',
            item.status !== undefined ? String(item.status) : 'true',
            item.sector || '',
            item.industry || ''
          ]);

          setWorkbookData({ 'Database Storage': [headers, ...rows] });
          setFileInfo({
            name: 'Database Storage',
            size: 'SQL DB',
            sheets: 1,
            rows: data.length
          });
          showToast(`Loaded ${data.length} records`, 'success');
        } else {
          setWorkbookData({ 'Database Storage': [headers, ['', '', 'true', '', '']] });
          setFileInfo({
            name: 'Database Storage Workspace',
            size: '0 KB',
            sheets: 1,
            rows: 0
          });
        }

        setSheetNames(['Database Storage']);
        setActiveSheet(0);

      } catch (err) {
        console.error(err);
        showToast('Failed to load initial data', 'error');
      } finally {
        setIsLoading(false);
      }
    };

    fetchExistingData();
  }, []); 

  const processFile = useCallback((file) => {
    try {
      readFile(file).then((workbook) => {
        const parsed = parseWorkbook(workbook);
        setWorkbookData(parsed.sheets);
        setSheetNames(parsed.sheetNames);
        setActiveSheet(0);
        setFileInfo({
          name: file.name,
          size: formatFileSize(file.size),
          sheets: parsed.sheetNames.length,
          rows: parsed.sheets[parsed.sheetNames[0]]?.length - 1 || 0,
        });
        showToast(`"${file.name}" loaded successfully`);
      });
    } catch (error) {
      showToast('Failed to parse file.', 'error');
    }
  }, [showToast]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) processFile(file);
  };

  const handleCellEdit = (rowIndex, colIndex, newValue) => {
    setWorkbookData((prev) => {
      const updated = { ...prev };
      const sheetCopy = updated[currentSheetName].map((row) => [...row]);
      sheetCopy[rowIndex][colIndex] = newValue;
      updated[currentSheetName] = sheetCopy;
      return updated;
    });
    setEditingCell({ rowIndex: null, colIndex: null }); // close edit engine state
  };

  // 2. TOGGLE ACTION LOGIC WITH BULLETPROOF STATUS COMPARISONS
  const toggleStatus = (rowIndex, colIndex, currentVal) => {
    const cleanString = typeof currentVal === 'string' ? currentVal.toLowerCase().trim() : String(currentVal).toLowerCase().trim();
    
    // Check for positive indicators while actively omitting explicit negative prefixes
    const isCurrentlyHalal = (cleanString === 'true' || cleanString === '1' || cleanString === 'halal') && 
                             !cleanString.includes('non') && 
                             !cleanString.includes('not');
    
    const newVal = isCurrentlyHalal ? 'false' : 'true';
    handleCellEdit(rowIndex, colIndex, newVal);
  };

  const handleAddRow = () => {
    if (selectedRowIndex === null) return;
    setWorkbookData((prev) => {
      const updated = { ...prev };
      const sheet = [...updated[currentSheetName]];
      const colCount = sheet[0]?.length || 5;
      const newRow = Array(colCount).fill('');
      sheet.splice(selectedRowIndex + 1, 0, newRow);
      updated[currentSheetName] = sheet;
      return updated;
    });
    showToast('Row inserted below selection');
  };

  const handleAddColumn = () => {
    if (selectedColIndex === null) return;
    setWorkbookData((prev) => {
      const updated = { ...prev };
      const sheet = updated[currentSheetName].map((row, i) => {
        const rowCopy = [...row];
        rowCopy.splice(selectedColIndex + 1, 0, i === 0 ? 'New Column' : '');
        return rowCopy;
      });
      updated[currentSheetName] = sheet;
      return updated;
    });
    showToast('Column inserted next to selection');
  };

  const handleDeleteRow = (rowIndex) => {
    if (rowIndex === 0) return;
    setWorkbookData((prev) => {
      const updated = { ...prev };
      const sheetCopy = [...updated[currentSheetName]];
      sheetCopy.splice(rowIndex, 1);
      updated[currentSheetName] = sheetCopy;
      return updated;
    });
    setSelectedRowIndex(null);
    showToast('Row deleted');
  };

  const handleReset = () => {
    setWorkbookData(null);
    setSheetNames([]);
    setActiveSheet(0);
    setFileInfo(null);
    setSelectedRowIndex(null);
    setSelectedColIndex(null);
    setEditingCell({ rowIndex: null, colIndex: null });
    setSearchTerm('');
    if (fileInputRef.current) fileInputRef.current.value = '';
    showToast('Dashboard reset');
  };

  const handleSave = async () => {
    if (!currentData || isSaving) return;
    setIsSaving(true);
    try {
      const jsonData = generateObjects(currentData);
      // Cleaned relative routing targets local proxy setups or direct production routing maps
      const response = await fetch('/api/rows', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(jsonData),
      });

      const resData = await response.json();
      if (!response.ok) {
        throw new Error(resData.error || 'Failed to save data.');
      }
      showToast(resData.message || 'Saved successfully!', 'success');
    } catch (error) {
      showToast(error.message || 'Error saving data.', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  const handleLogout = async () => {
    try {
      // Adjusted from local absolute domain to clean backend proxy relative mapping
      await fetch('/api/admin/logout', {
        method: "POST",
        credentials: "include",
      });

      showToast("Logged out successfully", "success");
      setTimeout(() => {
        navigate("/admin-login");
      }, 500);
    } catch (err) {
      showToast("Logout failed", "error");
    }
  };

  const getFilteredRows = () => {
    if (!currentData) return [];
    const rows = currentData.slice(1);
    if (!searchTerm.trim()) return rows.map((r, idx) => ({ originalIndex: idx + 1, data: r }));

    return rows
      .map((r, idx) => ({ originalIndex: idx + 1, data: r }))
      .filter(rowObj => 
        rowObj.data.some(cell => 
          String(cell).toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
  };

  const filteredRowObjects = getFilteredRows();

  return (
    <div className="dashboard-layout">
      
      {/* 1. LEFT ADMIN INFO PANEL / SIDEBAR */}
      <aside className="sidebar-panel">
        <div className="sidebar-header">
          <Database className="sidebar-logo-icon" size={22} />
          <h2 className="sidebar-brand-title">Screener Manager</h2>
        </div>

        {/* User Info Card Profile */}
        <div className="admin-profile-card">
          <div className="avatar-placeholder">
            <User size={24} className="avatar-icon" />
          </div>
          <div className="profile-details">
            <div className="profile-name">Saif Ahmad</div>
            <div className="profile-role">Chief Researcher</div>
          </div>
        </div>

        {/* Navigation Framework Links */}
        <nav className="sidebar-nav">
          <div className="nav-item active sidebar-logout-clickable" onClick={handleLogout} style={{ cursor: 'pointer' }}>
            <LogOut size={16} />
            <span>Logout</span>
          </div>
        </nav>
      </aside>
      
      {/* 2. MAIN WORKSPACE CONTENT */}
      <main className="main-content-area">
        <header className="workspace-header">
          <h1 className="main-app-title">Zam Zam Screener Data Manager</h1>
          <p className="main-app-subtitle">Perform structural table data reads, column expansions, and database modifications using an excel upload or database table</p>
        </header>

        {/* Upload Zone */}
        {!workbookData && (
          <div className="glass-card fade-in">
            <div
              className="upload-zone"
              onClick={() => fileInputRef.current?.click()}
              onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
              onDragLeave={(e) => { e.preventDefault(); setDragOver(false); }}
              onDrop={(e) => { e.preventDefault(); setDragOver(false); const f = e.dataTransfer.files[0]; if (f) processFile(f); }}
            >
              <Upload className="upload-zone__icon" size={44} />
              <p className="upload-zone__title">Drop your spreadsheet data file here, or <span className="upload-zone__highlight">browse</span></p>
              <input ref={fileInputRef} type="file" accept=".xlsx,.xls,.csv" onChange={handleFileChange} />
            </div>
          </div>
        )}

        {/* Main Table Interface Grid */}
        {workbookData && currentData && (
          <div className="glass-card fade-in table-card-margin">
            {fileInfo && (
              <div className="file-info-bar">
                <FileSpreadsheet size={16} className="file-icon-accent" />
                <span className="file-info-text">
                  No. of Records: <strong>{fileInfo.name}</strong> — {currentData.length - 1} 
                </span>
              </div>
            )}

            <div className="table-container-scroller">
              <table className="data-table">
                <thead>
                  <tr className="main-header-row">
                    <th className="row-number-header">ID</th>
                    {currentData[0]?.map((header, colIdx) => (
                      <th 
                        key={colIdx}
                        className={selectedColIndex === colIdx ? 'column-selected' : ''}
                        onClick={() => {
                          setSelectedColIndex(colIdx);
                          setSelectedRowIndex(null); // highlight whole column
                        }}
                      >
                        <div className="header-cell-content">
                          {colIdx === 0 && <Tag size={12} className="tag-icon-decor" />}
                          {header}
                        </div>
                      </th>
                    ))}
                    <th className="row-actions-header">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredRowObjects.map((rowObj) => {
                    const actualRowIdx = rowObj.originalIndex;
                    const row = rowObj.data;
                    const isRowSelected = selectedRowIndex === actualRowIdx;

                    return (
                      <tr key={actualRowIdx} className={isRowSelected ? 'row-selected' : ''}>
                        {/* Clear ID visibility cell */}
                        <td className="row-number-cell">{actualRowIdx}</td>
                        
                        {row.map((cell, colIdx) => {
                          const isCellEditing = editingCell.rowIndex === actualRowIdx && editingCell.colIndex === colIdx;
                          const isCellSelected = isRowSelected && selectedColIndex === colIdx;
                          
                          // 3. TARGET STATUS CELL VISUALIZATION (DYNAMICAL MATCHING)
                          if (colIdx === statusColIdx && statusColIdx !== -1) {
                            const cleanCell = cell === true || cell === false ? cell : String(cell).toLowerCase().trim();
                            
                            // Highly explicit validation against negative substring matches
                            const isHalal = cleanCell === true || 
                                            cleanCell === 'true' || 
                                            cleanCell === '1' || 
                                            (typeof cleanCell === 'string' && cleanCell.includes('halal') && !cleanCell.includes('non') && !cleanCell.includes('not'));

                            return (
                              <td 
                                key={colIdx}
                                className={isCellSelected ? 'cell-focused' : ''}
                                onClick={() => {
                                  setSelectedRowIndex(actualRowIdx);
                                  setSelectedColIndex(colIdx);
                                }}
                              >
                                <div className="badge-cell-container">
                                  <span 
                                    className={`status-pill ${isHalal ? 'pill--halal' : 'pill--nonhalal'}`}
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      toggleStatus(actualRowIdx, colIdx, cell);
                                    }}
                                  >
                                    {isHalal ? 'Halal' : 'Non-Halal'}
                                  </span>
                                </div>
                              </td>
                            );
                          }

                          // TEXT DATA COLUMNS: Single click selects, Double click opens input editor
                          return (
                            <td 
                              key={colIdx}
                              className={`${isCellSelected ? 'cell-focused' : ''} ${isCellEditing ? 'cell-editing-active' : ''}`}
                              onClick={() => {
                                setSelectedRowIndex(actualRowIdx);
                                setSelectedColIndex(colIdx);
                              }}
                              onDoubleClick={() => {
                                setEditingCell({ rowIndex: actualRowIdx, colIndex: colIdx });
                              }}
                            >
                              {isCellEditing ? (
                                <input
                                  type="text"
                                  defaultValue={cell}
                                  autoFocus
                                  className="table-cell-inline-input"
                                  onBlur={(e) => handleCellEdit(actualRowIdx, colIdx, e.target.value)}
                                  onKeyDown={(e) => {
                                    if (e.key === 'Enter') handleCellEdit(actualRowIdx, colIdx, e.target.value);
                                    if (e.key === 'Escape') setEditingCell({ rowIndex: null, colIndex: null });
                                  }}
                                />
                              ) : (
                                cell
                              )}
                            </td>
                          );
                        })}

                        <td className="row-actions-cell">
                          <button className="row-delete-action-btn" onClick={() => handleDeleteRow(actualRowIdx)}>
                            <X size={14} />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* STICKY BOTTOM ACTION BAR */}
        {workbookData && currentData && (
          <div className="sticky-action-bar-wrapper">
            <div className="sticky-action-bar">
              <div className="action-bar__search">
                <Search size={16} className="search-bar-icon" />
                <input 
                  type="text" 
                  placeholder="Filter active table view..." 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="search-bar-input"
                />
                {searchTerm && (
                  <button className="search-clear-btn" onClick={() => setSearchTerm('')}>
                    <X size={14} />
                  </button>
                )}
              </div>

              <div className="action-bar__controls">
                <button 
                  className="btn-action-ui btn-action-ui--secondary" 
                  onClick={handleAddRow}
                  disabled={selectedRowIndex === null}
                  title={selectedRowIndex === null ? "Click any row cell to select target insertion point" : "Insert blank row directly below selection"}
                >
                  <Plus size={14} /> Add Row
                </button>
                
                <button 
                  className="btn-action-ui btn-action-ui--secondary" 
                  onClick={handleAddColumn}
                  disabled={selectedColIndex === null}
                  title={selectedColIndex === null ? "Click header cell to select target insertion index" : "Insert column next to selection"}
                >
                  <Plus size={14} /> Add Column
                </button>

                <button className="btn-action-ui btn-action-ui--neutral" onClick={handleReset}>
                  <RotateCcw size={14} /> Reset View
                </button>
                
                <button className="btn-action-ui btn-action-ui--primary" onClick={handleSave} disabled={isSaving}>
                  <Save size={16} /> {isSaving ? 'Saving Changes...' : 'Save Production Database'}
                </button>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Toast systems */}
      {toast && (
        <div className={`toast toast--${toast.type}`}>
          {toast.message}
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;