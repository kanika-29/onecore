import React, { useState, useRef } from 'react';
import {
  X,
  UploadCloud,
  FileSpreadsheet,
  FolderArchive,
  Download,
  AlertCircle,
  CheckCircle2,
  Clock,
  Layers,
  Sparkles,
  Info,
} from 'lucide-react';

export default function CatalogImportModal({ isOpen, onClose, onSuccess, token }) {
  const [excelFile, setExcelFile] = useState(null);
  const [zipFile, setZipFile] = useState(null);
  const [mode, setMode] = useState('merge'); // 'merge' or 'replace'
  const [importing, setImporting] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const excelInputRef = useRef(null);
  const zipInputRef = useRef(null);

  if (!isOpen) return null;

  const handleDownloadTemplate = () => {
    window.location.href = '/api/products/download-template';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!excelFile) {
      setError('Please select an Excel catalog spreadsheet (.xlsx or .xls).');
      return;
    }

    setImporting(true);
    setError(null);
    setResult(null);

    const formData = new FormData();
    formData.append('catalog', excelFile);
    if (zipFile) {
      formData.append('images', zipFile);
    }
    formData.append('mode', mode);

    try {
      const res = await fetch('/api/products/import-catalog', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setResult(data.data);
        if (onSuccess) onSuccess(data);
      } else {
        setError(data.message || 'Failed to process and import catalog.');
      }
    } catch (err) {
      console.error('Import error:', err);
      setError('Network error while uploading catalog. Please check file sizes and connection.');
    } finally {
      setImporting(false);
    }
  };

  const handleReset = () => {
    setExcelFile(null);
    setZipFile(null);
    setResult(null);
    setError(null);
    if (excelInputRef.current) excelInputRef.current.value = '';
    if (zipInputRef.current) zipInputRef.current.value = '';
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-2xl overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-200">
        {/* Modal Header */}
        <div className="bg-[#1B365D] text-white px-6 py-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-white/10 text-white">
              <UploadCloud size={20} />
            </div>
            <div>
              <h3 className="text-base font-bold tracking-tight">Bulk Import Products & Packshots</h3>
              <p className="text-xs text-white/80">
                Upload Excel division sheets and an optional ZIP of photos for automatic arrangement
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            disabled={importing}
            className="p-1.5 text-white/70 hover:text-white hover:bg-white/10 rounded-lg transition-colors cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        <div className="p-6 max-h-[75vh] overflow-y-auto space-y-5">
          {/* Instructions & Template Download Notice */}
          <div className="bg-gradient-to-br from-blue-50/80 via-indigo-50/40 to-slate-50 border border-blue-200/80 rounded-xl p-4 space-y-3">
            <div className="flex items-start gap-3">
              <div className="p-1.5 rounded-lg bg-[#0D5C75]/10 text-[#0D5C75] shrink-0 mt-0.5">
                <Info size={16} />
              </div>
              <div className="text-xs text-slate-700 space-y-2">
                <div className="font-semibold text-slate-900">
                  Spreadsheet Schema & Multi-Specialty Rules:
                </div>
                <ul className="list-disc pl-4 space-y-1.5 text-slate-600">
                  <li>
                    <strong className="text-slate-900">Columns Match Client Excel & Product Form:</strong> The template includes all 11 columns matching the client master spreadsheet (<em>Composition, Classification, Description, Indication, Administration & Dosage, Mechanism of Action, Safety & Precautions</em>) plus <em>Pack Size</em> and <em>Image File Name</em>. Both the client's redrafted sheet and the downloaded template upload seamlessly!
                  </li>
                  <li>
                    <strong className="text-slate-900">Multi-Category Formulations:</strong> If the same product belongs to 2 or more specialties (e.g.{' '}
                    <em>Glypocal™-LP</em> in <span className="font-semibold text-[#0D5C75]">Femme</span> &amp;{' '}
                    <span className="font-semibold text-[#0D5C75]">Ortheon</span>, or <em>Frecox™-SP</em> in <span className="font-semibold text-[#0D5C75]">Ortheon</span> &amp;{' '}
                    <span className="font-semibold text-[#0D5C75]">Omnara</span>), enter that product into each respective sheet. The system links them automatically so the card displays on all selected division pages!
                  </li>
                  <li>
                    <strong className="text-slate-900">Packaging Photos (ZIP):</strong> Put all packshots into a folder and compress as a ZIP. Files matching brand names (e.g.{' '}
                    <code>folatis.png</code>, <code>frecox-sp.jpg</code>) or the <em>Image File Name</em> column match automatically.
                  </li>
                </ul>
              </div>
            </div>

            <div className="pt-2 border-t border-blue-200/60 flex items-center justify-between">
              <span className="text-[11px] text-slate-500 font-medium">
                Need the standard 9-division Excel format pre-filled with samples?
              </span>
              <button
                type="button"
                onClick={handleDownloadTemplate}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-blue-300 text-xs font-semibold text-[#0D5C75] hover:bg-blue-50 hover:border-blue-400 transition-all shadow-2xs cursor-pointer"
              >
                <Download size={13} />
                <span>Download Excel Template (.xlsx)</span>
              </button>
            </div>
          </div>

          {error && (
            <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-xl flex items-start gap-3 text-xs text-rose-700">
              <AlertCircle size={16} className="shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold">Import Error</p>
                <p className="mt-0.5">{error}</p>
              </div>
            </div>
          )}

          {result ? (
            /* Results Breakdown */
            <div className="space-y-4">
              <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 space-y-2">
                <div className="flex items-center gap-2 font-bold text-sm text-emerald-900">
                  <CheckCircle2 size={18} className="text-emerald-600" />
                  <span>Catalog Import Completed Successfully!</span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
                  <div className="bg-white p-2.5 rounded-lg border border-emerald-200 text-center">
                    <span className="text-lg font-black text-slate-900">{result.totalUniqueProducts}</span>
                    <p className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold">Unique Medicines</p>
                  </div>
                  <div className="bg-white p-2.5 rounded-lg border border-emerald-200 text-center">
                    <span className="text-lg font-black text-emerald-700">{result.totalDivisionListings}</span>
                    <p className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold">Division Cards</p>
                  </div>
                  <div className="bg-white p-2.5 rounded-lg border border-emerald-200 text-center">
                    <span className="text-lg font-black text-[#0D5C75]">{result.multiSpecialtyCount}</span>
                    <p className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold">Multi-Category</p>
                  </div>
                  <div className="bg-white p-2.5 rounded-lg border border-emerald-200 text-center">
                    <span className="text-lg font-black text-slate-900">{result.imageLinkedCount}</span>
                    <p className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold">Images Linked</p>
                  </div>
                </div>
              </div>

              {result.missingImages && result.missingImages.length > 0 && (
                <div className="bg-amber-50/60 border border-amber-200 rounded-xl p-3.5 text-xs text-amber-900">
                  <div className="font-semibold flex items-center justify-between mb-1.5">
                    <span>Missing Packshots ({result.missingImages.length} products without photos):</span>
                    <span className="text-[10px] bg-amber-100 px-2 py-0.5 rounded-full font-mono">
                      Fallback Monograph Active
                    </span>
                  </div>
                  <p className="text-[11px] text-amber-700 mb-2">
                    These products have no photo uploaded yet and are displaying the branded Pharmaceutical Monograph Card:
                  </p>
                  <div className="max-h-32 overflow-y-auto space-y-1 bg-white/70 rounded-lg p-2 border border-amber-200/60 text-[11px]">
                    {result.missingImages.map((m, idx) => (
                      <div key={idx} className="flex items-center justify-between py-0.5 border-b border-amber-100 last:border-0">
                        <span className="font-semibold text-slate-800">{m.brand_name}</span>
                        <span className="text-slate-500 text-[10px]">{m.sheets}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={handleReset}
                  className="px-4 py-2 text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition-colors cursor-pointer"
                >
                  Import Another File
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 text-xs font-semibold bg-[#1B365D] hover:bg-[#152a48] text-white rounded-lg transition-colors cursor-pointer"
                >
                  Done & View Catalog
                </button>
              </div>
            </div>
          ) : (
            /* Upload Form */
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* File 1: Excel Spreadsheet */}
              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1">
                  1. Excel Catalog Spreadsheet <span className="text-rose-500">*</span>
                </label>
                <div
                  onClick={() => excelInputRef.current?.click()}
                  className={`border-2 border-dashed rounded-xl p-4 text-center cursor-pointer transition-all ${
                    excelFile
                      ? 'border-emerald-400 bg-emerald-50/30'
                      : 'border-slate-300 hover:border-[#0D5C75] bg-slate-50/50 hover:bg-slate-50'
                  }`}
                >
                  <input
                    ref={excelInputRef}
                    type="file"
                    accept=".xlsx,.xls,.csv"
                    className="hidden"
                    onChange={(e) => setExcelFile(e.target.files?.[0] || null)}
                  />
                  <div className="flex flex-col items-center gap-1.5">
                    <FileSpreadsheet
                      size={28}
                      className={excelFile ? 'text-emerald-600' : 'text-slate-400'}
                    />
                    {excelFile ? (
                      <div>
                        <span className="text-xs font-semibold text-slate-900 block truncate max-w-sm">
                          {excelFile.name}
                        </span>
                        <span className="text-[11px] text-slate-500">
                          {(excelFile.size / 1024).toFixed(1)} KB — Ready to parse
                        </span>
                      </div>
                    ) : (
                      <div>
                        <span className="text-xs font-medium text-slate-700 block">
                          Click to select or drag and drop Excel catalog (.xlsx)
                        </span>
                        <span className="text-[11px] text-slate-400">
                          Supports 9 category sheets (Femme, Ortheon, Omnara, etc.)
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* File 2: Images ZIP Folder */}
              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1">
                  2. Packaging Photos ZIP Archive <span className="text-slate-400 font-normal">(Optional)</span>
                </label>
                <div
                  onClick={() => zipInputRef.current?.click()}
                  className={`border-2 border-dashed rounded-xl p-4 text-center cursor-pointer transition-all ${
                    zipFile
                      ? 'border-[#0D5C75] bg-sky-50/30'
                      : 'border-slate-300 hover:border-[#0D5C75] bg-slate-50/50 hover:bg-slate-50'
                  }`}
                >
                  <input
                    ref={zipInputRef}
                    type="file"
                    accept=".zip"
                    className="hidden"
                    onChange={(e) => setZipFile(e.target.files?.[0] || null)}
                  />
                  <div className="flex flex-col items-center gap-1.5">
                    <FolderArchive
                      size={28}
                      className={zipFile ? 'text-[#0D5C75]' : 'text-slate-400'}
                    />
                    {zipFile ? (
                      <div>
                        <span className="text-xs font-semibold text-slate-900 block truncate max-w-sm">
                          {zipFile.name}
                        </span>
                        <span className="text-[11px] text-slate-500">
                          {(zipFile.size / (1024 * 1024)).toFixed(1)} MB ZIP archive
                        </span>
                      </div>
                    ) : (
                      <div>
                        <span className="text-xs font-medium text-slate-700 block">
                          Click to select or drag and drop ZIP folder of photos (.zip)
                        </span>
                        <span className="text-[11px] text-slate-400">
                          Images will be matched automatically by filename
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Import Mode */}
              <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200">
                <span className="text-xs font-bold text-slate-800 block mb-2">Import Mode:</span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  <label
                    className={`flex items-start gap-2.5 p-2.5 rounded-lg border cursor-pointer transition-all ${
                      mode === 'merge'
                        ? 'bg-white border-[#0D5C75] shadow-2xs text-slate-900'
                        : 'bg-transparent border-slate-200 text-slate-600'
                    }`}
                  >
                    <input
                      type="radio"
                      name="importMode"
                      value="merge"
                      checked={mode === 'merge'}
                      onChange={() => setMode('merge')}
                      className="mt-0.5 text-[#0D5C75] focus:ring-[#0D5C75]"
                    />
                    <div>
                      <span className="font-semibold block">Update & Merge (Safe)</span>
                      <span className="text-[11px] text-slate-500">
                        Adds new products and updates existing ones without deleting.
                      </span>
                    </div>
                  </label>

                  <label
                    className={`flex items-start gap-2.5 p-2.5 rounded-lg border cursor-pointer transition-all ${
                      mode === 'replace'
                        ? 'bg-rose-50/50 border-rose-400 shadow-2xs text-slate-900'
                        : 'bg-transparent border-slate-200 text-slate-600'
                    }`}
                  >
                    <input
                      type="radio"
                      name="importMode"
                      value="replace"
                      checked={mode === 'replace'}
                      onChange={() => setMode('replace')}
                      className="mt-0.5 text-rose-600 focus:ring-rose-500"
                    />
                    <div>
                      <span className="font-semibold text-rose-800 block">Fresh Replace</span>
                      <span className="text-[11px] text-slate-500">
                        Wipes existing catalog and replaces it entirely with this upload.
                      </span>
                    </div>
                  </label>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={onClose}
                  disabled={importing}
                  className="px-4 py-2 text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={importing || !excelFile}
                  className="flex items-center gap-2 px-5 py-2 text-xs font-semibold bg-[#1B365D] hover:bg-[#152a48] text-white rounded-lg transition-all shadow-xs disabled:opacity-50 cursor-pointer"
                >
                  {importing ? (
                    <>
                      <Clock size={14} className="animate-spin" />
                      <span>Processing & Arranging Products...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles size={14} />
                      <span>Upload & Arrange Catalog</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
