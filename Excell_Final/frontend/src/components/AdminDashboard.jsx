import React, { useState, useRef, useCallback, useEffect } from 'react';
import {
  Upload,
  FileSpreadsheet,
  CheckCircle2,
  Plus,
  Trash2,
  Save,
  RotateCcw,
  TableProperties,
  X,
  Info,
  AlertTriangle,
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
  const fileInputRef = useRef(null);

  // Get current sheet data
  const currentSheetName = sheetNames[activeSheet];
  const currentData = workbookData ? workbookData[currentSheetName] : null;

  // Show toast notification
  const showToast = useCallback((message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  }, []);

  // Load initial data from database on mount
  useEffect(() => {
    const fetchExistingData = async () => {
      setIsLoading(true);
      try {
        const response = await fetch('http://localhost:5000/api/rows');
        if (!response.ok) throw new Error('Failed to load data from server');
        const data = await response.json();
        
        if (data && data.length > 0) {
          const headers = ['Ticker', 'Company Name', 'Status', 'Sector', 'Industry'];
          const rows = data.map(item => [
            item.ticker || '',
            item.companyName || '',
            item.status !== undefined ? String(item.status) : 'true',
            item.sector || '',
            item.industry || ''
          ]);
          
          setWorkbookData({ 'Database Storage': [headers, ...rows] });
          setSheetNames(['Database Storage']);
          setActiveSheet(0);
          setFileInfo({
            name: 'Database Storage',
            size: 'SQL DB',
            sheets: 1,
            rows: data.length
          });
          showToast(`Loaded ${data.length} records from database`, 'success');
        }
      } catch (err) {
        console.error('Error fetching database rows:', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchExistingData();
  }, [showToast]);

  // Handle file processing
  const processFile = useCallback(async (file) => {
    try {
      const workbook = await readFile(file);
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
      showToast(`"${file.name}" loaded successfully with ${parsed.sheetNames.length} sheet(s)`);
    } catch (error) {
      showToast('Failed to parse file. Please check the format.', 'error');
      console.error(error);
    }
  }, [showToast]);

  // File input change
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) processFile(file);
  };

  // Drag and drop handlers
  const handleDragOver = (e) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) processFile(file);
  };

  // Cell edit handler
  const handleCellEdit = (rowIndex, colIndex, newValue) => {
    setWorkbookData((prev) => {
      const updated = { ...prev };
      const sheetCopy = updated[currentSheetName].map((row) => [...row]);
      sheetCopy[rowIndex][colIndex] = newValue;
      updated[currentSheetName] = sheetCopy;
      return updated;
    });
  };

  // Add a new row
  const handleAddRow = () => {
    setWorkbookData((prev) => {
      const updated = { ...prev };
      const sheet = updated[currentSheetName];
      const colCount = sheet[0]?.length || 1;
      const newRow = Array(colCount).fill('');
      updated[currentSheetName] = [...sheet, newRow];
      return updated;
    });
    showToast('New row added');
  };

  // Delete a row
  const handleDeleteRow = (rowIndex) => {
    if (rowIndex === 0) return; // Cannot delete headers
    setWorkbookData((prev) => {
      const updated = { ...prev };
      const sheetCopy = [...updated[currentSheetName]];
      sheetCopy.splice(rowIndex, 1);
      updated[currentSheetName] = sheetCopy;
      return updated;
    });
    showToast('Row deleted');
  };

  // Add a new column
  const handleAddColumn = () => {
    setWorkbookData((prev) => {
      const updated = { ...prev };
      const sheet = updated[currentSheetName].map((row, i) => [
        ...row,
        i === 0 ? 'New Column' : '',
      ]);
      updated[currentSheetName] = sheet;
      return updated;
    });
    showToast('New column added');
  };

  // Reset: clear all data
  const handleReset = () => {
    setWorkbookData(null);
    setSheetNames([]);
    setActiveSheet(0);
    setFileInfo(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
    showToast('Dashboard reset');
  };

  // Save (generate JSON and post to backend)
  const handleSave = async () => {
    if (!currentData || isSaving) return;
    setIsSaving(true);
    showToast('Saving to database...', 'info');
    
    try {
      const jsonData = generateObjects(currentData);
      
      const response = await fetch('http://localhost:5000/api/rows', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(jsonData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to save data to database.');
      }

      const resData = await response.json();
      showToast(resData.message || `Saved ${resData.count} records successfully!`, 'success');
      
      // Update fileInfo stats to match saved row count
      setFileInfo(prev => prev ? {
        ...prev,
        rows: resData.count
      } : null);
    } catch (error) {
      console.error('Save error:', error);
      showToast(error.message || 'Error saving data to database.', 'error');
    } finally {
      setIsSaving(false);
    }
    console.log(
  "Payload size (bytes):",
  new Blob([JSON.stringify(jsonData)]).size
);
  };

  // Switch sheet tab
  const handleSheetChange = (index) => {
    setActiveSheet(index);
  };

  // ========== RENDER ==========

  return (
    <div className="app-container">
      {/* Header */}
      <header className="app-header fade-in">
        <div className="app-header__badge">
          <TableProperties size={14} />
          Admin Dashboard
        </div>
        <h1 className="app-header__title">Excel Data Manager</h1>
        <p className="app-header__subtitle">
          Upload, edit, and manage your spreadsheet data with ease
        </p>
      </header>

      {/* Upload Section */}
      {!workbookData && (
        <div className="glass-card fade-in" style={{ animationDelay: '0.1s' }}>
          <div
            id="upload-zone"
            className={`upload-zone ${dragOver ? 'drag-over' : ''}`}
            onClick={() => fileInputRef.current?.click()}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <Upload className="upload-zone__icon" size={64} strokeWidth={1.5} />
            <p className="upload-zone__title">
              Drop your Excel file here, or{' '}
              <span className="upload-zone__highlight">click to browse</span>
            </p>
            <p className="upload-zone__subtitle">
              Supports .xlsx, .xls, .csv, .ods and more
            </p>
            <input
              ref={fileInputRef}
              type="file"
              accept=".xlsx,.xls,.csv,.ods,.xlsb,.xlsm,.txt"
              onChange={handleFileChange}
            />
          </div>
        </div>
      )}

      {/* File Info + Table Section */}
      {workbookData && currentData && (
        <div className="glass-card fade-in">
          {/* File Info Bar */}
          {fileInfo && (
            <div className="file-info">
              <div className="file-info__left">
                <div className="file-info__icon">
                  <FileSpreadsheet size={18} />
                </div>
                <div>
                  <div className="file-info__name">{fileInfo.name}</div>
                  <div className="file-info__meta">
                    {fileInfo.size} • {fileInfo.sheets} sheet(s) • {currentData.length - 1} rows
                  </div>
                </div>
              </div>
              <div className="status-badge status-badge--success">
                <CheckCircle2 size={12} />
                Loaded
              </div>
            </div>
          )}

          {/* Sheet Tabs */}
          {sheetNames.length > 1 && (
            <div className="sheet-tabs" id="sheet-tabs">
              {sheetNames.map((name, idx) => (
                <button
                  key={idx}
                  className={`sheet-tab ${idx === activeSheet ? 'active' : ''}`}
                  onClick={() => handleSheetChange(idx)}
                >
                  {name}
                </button>
              ))}
            </div>
          )}

          {/* Data Table */}
          <div className="table-container" id="table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th className="row-number">#</th>
                  {currentData[0]?.map((header, colIdx) => (
                    <th
                      key={colIdx}
                      contentEditable
                      suppressContentEditableWarning
                      onBlur={(e) =>
                        handleCellEdit(0, colIdx, e.currentTarget.textContent)
                      }
                    >
                      {header}
                    </th>
                  ))}
                  <th className="row-actions"></th>
                </tr>
              </thead>
              <tbody>
                {currentData.slice(1).map((row, rowIdx) => (
                  <tr key={rowIdx}>
                    <td className="row-number">{rowIdx + 1}</td>
                    {row.map((cell, colIdx) => (
                      <td
                        key={colIdx}
                        contentEditable
                        suppressContentEditableWarning
                        onBlur={(e) =>
                          handleCellEdit(rowIdx + 1, colIdx, e.currentTarget.textContent)
                        }
                      >
                        {cell}
                      </td>
                    ))}
                    <td className="row-actions">
                      <button
                        className="row-action-btn"
                        title="Delete row"
                        onClick={() => handleDeleteRow(rowIdx + 1)}
                      >
                        <X size={14} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Action Bar */}
          <div className="action-bar">
            <div className="action-bar__left">
              <button className="btn btn--sm" onClick={handleAddRow} id="btn-add-row">
                <Plus size={14} />
                Add Row
              </button>
              <button className="btn btn--sm" onClick={handleAddColumn} id="btn-add-col">
                <Plus size={14} />
                Add Column
              </button>
            </div>
            <div className="action-bar__right">
              <button className="btn btn--danger btn--sm" onClick={handleReset} id="btn-reset">
                <RotateCcw size={14} />
                Reset
              </button>
              <button 
                className="btn btn--primary" 
                onClick={handleSave} 
                id="btn-save"
                disabled={isSaving}
              >
                <Save size={16} className={isSaving ? "pulse" : ""} />
                {isSaving ? 'Saving...' : 'Save Data'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast Notification */}
      {toast && (
        <div className={`toast toast--${toast.type}`}>
          {toast.type === 'success' && <CheckCircle2 size={18} color="var(--success)" />}
          {toast.type === 'error' && <X size={18} color="var(--danger)" />}
          {toast.type === 'info' && <Info size={18} color="var(--accent-primary)" />}
          {toast.type === 'warning' && <AlertTriangle size={18} color="var(--warning)" />}
          {toast.message}
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
