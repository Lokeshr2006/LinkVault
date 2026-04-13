import { useState } from 'react';
import { urlAPI } from '../services/api';
import toast from 'react-hot-toast';

export default function BulkUploadModal({ onClose, onCreated }) {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);
  const [dragOver, setDragOver] = useState(false);

  const parseCSV = (text) => {
    const lines = text.trim().split('\n');
    const headers = lines[0].split(',').map(h => h.trim().toLowerCase());
    const urlIndex = headers.indexOf('originalurl') !== -1 
      ? headers.indexOf('originalurl') 
      : headers.indexOf('url');
    const aliasIndex = headers.indexOf('customalias') !== -1
      ? headers.indexOf('customalias')
      : headers.indexOf('alias');

    if (urlIndex === -1) {
      throw new Error('CSV must have an "originalUrl" or "url" column');
    }

    return lines.slice(1)
      .filter(line => line.trim())
      .map(line => {
        const cols = line.split(',').map(c => c.trim());
        return {
          originalUrl: cols[urlIndex],
          customAlias: aliasIndex !== -1 ? cols[aliasIndex] || null : null
        };
      })
      .filter(item => item.originalUrl);
  };

  const handleFile = (selectedFile) => {
    if (!selectedFile) return;
    if (!selectedFile.name.endsWith('.csv')) {
      toast.error('Please upload a CSV file');
      return;
    }
    setFile(selectedFile);
    setResults(null);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    handleFile(e.dataTransfer.files[0]);
  };

  const handleSubmit = async () => {
    if (!file) return;
    setLoading(true);
    try {
      const text = await file.text();
      const urls = parseCSV(text);

      if (urls.length === 0) {
        toast.error('No valid URLs found in CSV');
        return;
      }

      if (urls.length > 100) {
        toast.error('Maximum 100 URLs allowed');
        return;
      }

      const res = await urlAPI.bulk({ urls });
      setResults(res.data);
      toast.success(`${res.data.success} URLs shortened!`);
      onCreated();
    } catch (err) {
      toast.error(err.response?.data?.error || err.message || 'Failed to process CSV');
    } finally {
      setLoading(false);
    }
  };

  const downloadResults = () => {
    if (!results) return;
    const csv = [
      'originalUrl,shortUrl,status,error',
      ...results.results.map(r => `${r.originalUrl},${r.shortUrl},success,`),
      ...results.errors.map(e => `${e.originalUrl},,failed,${e.error}`)
    ].join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'linkvault-bulk-results.csv';
    a.click();
  };

  const downloadTemplate = () => {
    const csv = 'originalUrl,customAlias\nhttps://google.com,google\nhttps://youtube.com,youtube\nhttps://github.com,github';
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'linkvault-template.csv';
    a.click();
  };

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-md z-50 flex items-center justify-center p-6">
      <div className="bg-white border-4 border-black rounded-2xl p-8 neo-shadow w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-3">
            <span className="material-symbols-outlined text-primary text-3xl">upload_file</span>
            <div>
              <h2 className="text-2xl font-black">Bulk URL Shortener</h2>
              <p className="text-sm text-on-surface-variant font-medium">Upload CSV to shorten multiple URLs</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-surface-container rounded-full">
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        {!results ? (
          <>
            {/* Template Download */}
            <div className="bg-secondary-container/30 border-2 border-black border-dashed rounded-xl p-4 mb-6 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-secondary">description</span>
                <div>
                  <p className="font-bold text-sm">Need a template?</p>
                  <p className="text-xs text-on-surface-variant">Download our CSV template to get started</p>
                </div>
              </div>
              <button
                onClick={downloadTemplate}
                className="bg-white border-2 border-black px-4 py-2 rounded-xl font-bold text-sm neo-shadow neo-hover neo-active transition-all flex items-center gap-2"
              >
                <span className="material-symbols-outlined text-sm">download</span>
                Template
              </button>
            </div>

            {/* CSV Format Info */}
            <div className="bg-surface-container-low rounded-xl p-4 mb-6 border-2 border-black/10">
              <p className="text-xs font-black uppercase tracking-wider mb-2">CSV Format</p>
              <code className="text-xs font-mono bg-white p-2 rounded border border-black/10 block">
                originalUrl,customAlias<br/>
                https://google.com,google<br/>
                https://youtube.com,youtube
              </code>
              <p className="text-xs text-on-surface-variant mt-2 font-medium">
                ✓ Max 100 URLs per upload &nbsp; ✓ customAlias is optional
              </p>
            </div>

            {/* Drop Zone */}
            <div
              onDrop={handleDrop}
              onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
              onDragLeave={() => setDragOver(false)}
              className={`border-4 border-dashed rounded-2xl p-12 text-center transition-all cursor-pointer
                ${dragOver ? 'border-primary bg-primary-container/20' : 'border-black/30 hover:border-black hover:bg-surface-container-low'}`}
              onClick={() => document.getElementById('csv-input').click()}
            >
              <span className="material-symbols-outlined text-5xl text-on-surface-variant mb-4 block">
                {file ? 'task_alt' : 'cloud_upload'}
              </span>
              {file ? (
                <div>
                  <p className="font-black text-lg text-primary">{file.name}</p>
                  <p className="text-sm text-on-surface-variant mt-1">Click to change file</p>
                </div>
              ) : (
                <div>
                  <p className="font-black text-lg">Drop CSV file here</p>
                  <p className="text-sm text-on-surface-variant mt-1">or click to browse</p>
                </div>
              )}
              <input
                id="csv-input"
                type="file"
                accept=".csv"
                className="hidden"
                onChange={e => handleFile(e.target.files[0])}
              />
            </div>

            {/* Submit Button */}
            <button
              onClick={handleSubmit}
              disabled={!file || loading}
              className={`w-full mt-6 py-4 border-4 border-black rounded-xl font-black text-lg flex items-center justify-center gap-3 transition-all
                ${file && !loading ? 'bg-primary-container neo-shadow neo-hover neo-active' : 'bg-surface-container opacity-50 cursor-not-allowed'}`}
            >
              {loading ? (
                <>
                  <div className="w-6 h-6 border-4 border-black border-t-transparent rounded-full animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <span className="material-symbols-outlined">rocket_launch</span>
                  Shorten All URLs
                </>
              )}
            </button>
          </>
        ) : (
          /* Results */
          <div className="space-y-6">
            {/* Summary */}
            <div className="grid grid-cols-3 gap-4">
              <div className="bento-card p-4 text-center">
                <p className="text-3xl font-black">{results.total}</p>
                <p className="text-xs font-bold text-on-surface-variant uppercase">Total</p>
              </div>
              <div className="bento-card p-4 text-center bg-secondary-container">
                <p className="text-3xl font-black text-secondary">{results.success}</p>
                <p className="text-xs font-bold text-on-surface-variant uppercase">Success</p>
              </div>
              <div className="bento-card p-4 text-center bg-error-container">
                <p className="text-3xl font-black text-error">{results.failed}</p>
                <p className="text-xs font-bold text-on-surface-variant uppercase">Failed</p>
              </div>
            </div>

            {/* Results Table */}
            <div className="border-4 border-black rounded-xl overflow-hidden">
              <div className="bg-surface-container p-4 border-b-4 border-black flex justify-between items-center">
                <h3 className="font-black">Results</h3>
                <button
                  onClick={downloadResults}
                  className="bg-white border-2 border-black px-4 py-2 rounded-xl font-bold text-sm neo-shadow neo-hover transition-all flex items-center gap-2"
                >
                  <span className="material-symbols-outlined text-sm">download</span>
                  Download CSV
                </button>
              </div>
              <div className="max-h-64 overflow-y-auto divide-y divide-black/10">
                {results.results.map((r, i) => (
                  <div key={i} className="flex items-center gap-4 p-3 hover:bg-surface-container-low">
                    <span className="material-symbols-outlined text-secondary text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-on-surface-variant truncate">{r.originalUrl}</p>
                      <p className="text-sm font-black text-primary truncate">{r.shortUrl}</p>
                    </div>
                    <button
                      onClick={() => { navigator.clipboard.writeText(r.shortUrl); toast.success('Copied!'); }}
                      className="p-1 hover:bg-white rounded border border-transparent hover:border-black transition-all flex-shrink-0"
                    >
                      <span className="material-symbols-outlined text-sm">content_copy</span>
                    </button>
                  </div>
                ))}
                {results.errors.map((e, i) => (
                  <div key={i} className="flex items-center gap-4 p-3 bg-error-container/20">
                    <span className="material-symbols-outlined text-error text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>cancel</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-on-surface-variant truncate">{e.originalUrl}</p>
                      <p className="text-sm font-bold text-error">{e.error}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Done Button */}
            <button
              onClick={onClose}
              className="w-full py-4 bg-primary-container border-4 border-black rounded-xl font-black text-lg neo-shadow neo-hover neo-active transition-all"
            >
              Done
            </button>
          </div>
        )}
      </div>
    </div>
  );
}