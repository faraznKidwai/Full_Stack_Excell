import * as XLSX from 'xlsx';

/**
 * Reads an uploaded Excel/CSV file and returns the parsed workbook object.
 * @param {File} file - The file from an input element or drag-and-drop.
 * @returns {Promise<Object>} - SheetJS workbook object.
 */
export const readFile = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const data = new Uint8Array(event.target.result);
        const workbook = XLSX.read(data, { type: 'array' });
        if (workbook) {
          resolve(workbook);
        } else {
          reject(new Error('Failed to parse file.'));
        }
      } catch (error) {
        reject(error);
      }
    };
    reader.onerror = () => reject(new Error('Failed to read file.'));
    reader.readAsArrayBuffer(file);
  });
};

/**
 * Parses a SheetJS workbook into a structured object with sheet names and 2D arrays.
 * @param {Object} workbook - The SheetJS workbook object.
 * @returns {Object} - { sheetNames: string[], sheets: { [sheetName]: any[][] } }
 */
export const parseWorkbook = (workbook) => {
  const sheetNames = workbook.SheetNames;
  const sheets = {};

  sheetNames.forEach((name) => {
    const worksheet = workbook.Sheets[name];
    const data = XLSX.utils.sheet_to_json(worksheet, {
      header: 1,
      defval: '',
    });
    sheets[name] = data;
  });

  return { sheetNames, sheets };
};

/**
 * Converts a 2D array (with headers as first row) into an array of JSON objects.
 * @param {any[][]} sheetData - 2D array where first row is headers.
 * @returns {Object[]} - Array of objects with header keys.
 */
export const generateObjects = (sheetData) => {
  if (!sheetData || sheetData.length < 2) return [];

  const headers = sheetData[0];
  const rows = sheetData.slice(1);

  return rows.map((row) => {
    const obj = {};
    headers.forEach((header, index) => {
      obj[header || `Column ${index + 1}`] = row[index] ?? '';
    });
    return obj;
  });
};

/**
 * Formats file size from bytes into a human-readable string.
 * @param {number} bytes
 * @returns {string}
 */
export const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
};
