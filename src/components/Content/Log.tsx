/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from 'react';
import { Download, RefreshCw, Database, Calendar, Filter } from 'lucide-react';
import * as XLSX from 'xlsx';

interface LogEntry {
  id: number;
  topic: string;
  payload: string;
  timestamp: string;
}

interface GroupedLog {
  timestamp: string;
  suhu?: string;
  kelembaban?: string;
  kelembaban_tanah?: string;
  kapasitas_air?: string;
}

export default function Log() {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [groupedLogs, setGroupedLogs] = useState<GroupedLog[]>([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [autoRefresh, setAutoRefresh] = useState(false);
  const [exportProgress, setExportProgress] = useState(0);
  const [isExporting, setIsExporting] = useState(false);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [quickFilter, setQuickFilter] = useState<string>('');
  const pageSize = 50;

  const fetchLogs = async (page: number, showLoading = true) => {
    if (showLoading) setLoading(true);
    try {
      let url = `/api/logs?page=${page}&size=${pageSize}`;
      
      // Add filter parameters based on active filter
      if (quickFilter) {
        url += `&filter=${quickFilter}`;
      } else if (startDate || endDate) {
        if (startDate) url += `&start=${startDate}`;
        if (endDate) url += `&end=${endDate}`;
      }
      
      const response = await fetch(url);
      const data = await response.json();
      setLogs(data.data || []);
      setTotalPages(data.total_pages || 1);
      setCurrentPage(page);
    } catch (error) {
      console.error('Error fetching logs:', error);
    } finally {
      if (showLoading) setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs(1);
  }, [quickFilter, startDate, endDate]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (autoRefresh) {
      interval = setInterval(() => {
        fetchLogs(currentPage, false);
      }, 5000); // Changed to 5 seconds
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [autoRefresh, currentPage, quickFilter, startDate, endDate]);

  useEffect(() => {
    // Group logs by timestamp
    const grouped: { [key: string]: GroupedLog } = {};

    logs.forEach((log) => {
      const timestamp = new Date(log.timestamp).toLocaleString('id-ID', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      });

      if (!grouped[timestamp]) {
        grouped[timestamp] = { timestamp };
      }

      grouped[timestamp][log.topic as keyof GroupedLog] = log.payload;
    });

    const groupedArray = Object.values(grouped).sort(
      (a, b) =>
        new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );

    setGroupedLogs(groupedArray);
  }, [logs]);

  const applyFilter = () => {
    setShowFilterModal(false);
  };

  const clearFilter = () => {
    setStartDate('');
    setEndDate('');
    setQuickFilter('');
    setShowFilterModal(false);
  };

  const applyQuickFilter = (filterType: string) => {
    setQuickFilter(filterType);
    setStartDate('');
    setEndDate('');
  };

  const exportToExcel = async () => {
    setLoading(true);
    setIsExporting(true);
    setExportProgress(0);
    try {
      // Fetch all data with pagination and current filter
      let allLogs: LogEntry[] = [];
      let totalPagesForExport = 1;
      
      // Build URL with filter parameters
      let baseUrl = `/api/logs?size=100`;
      if (quickFilter) {
        baseUrl += `&filter=${quickFilter}`;
      } else if (startDate || endDate) {
        if (startDate) baseUrl += `&start=${startDate}`;
        if (endDate) baseUrl += `&end=${endDate}`;
      }
      
      // First fetch to get total pages
      setExportProgress(5);
      const firstResponse = await fetch(`${baseUrl}&page=1`);
      const firstData = await firstResponse.json();
      
      allLogs = [...(firstData.data || [])];
      totalPagesForExport = firstData.total_pages || 1;
      
      setExportProgress(10);
      
      // Fetch remaining pages in batches
      const maxPages = Math.min(totalPagesForExport, 100);
      const batchSize = 10;
      
      for (let i = 2; i <= maxPages; i += batchSize) {
        const batchPromises = [];
        const endPage = Math.min(i + batchSize - 1, maxPages);
        
        for (let page = i; page <= endPage; page++) {
          batchPromises.push(
            fetch(`${baseUrl}&page=${page}`)
              .then(res => res.json())
              .then(data => data.data || [])
              .catch(() => [])
          );
        }
        
        const batchResults = await Promise.all(batchPromises);
        batchResults.forEach(pageData => {
          allLogs = [...allLogs, ...pageData];
        });
        
        // Update progress (10% to 70%)
        const progress = 10 + ((i / maxPages) * 60);
        setExportProgress(Math.min(progress, 70));
      }

      setExportProgress(75);

      // Group all logs
      const grouped: { [key: string]: GroupedLog } = {};

      allLogs.forEach((log: LogEntry) => {
        const timestamp = new Date(log.timestamp).toLocaleString('id-ID', {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
        });

        if (!grouped[timestamp]) {
          grouped[timestamp] = { timestamp };
        }

        grouped[timestamp][log.topic as keyof GroupedLog] = log.payload;
      });

      setExportProgress(85);

      const groupedArray = Object.values(grouped).sort(
        (a, b) =>
          new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
      );

      // Prepare data for Excel (no additional filtering needed, backend already filtered)
      const excelData = groupedArray.map((log) => ({
        Timestamp: log.timestamp,
        'Suhu (°C)': log.suhu || '-',
        'Kelembaban (%)': log.kelembaban || '-',
        'Kelembaban Tanah (%)': log.kelembaban_tanah || '-',
        'Kapasitas Air (%)': log.kapasitas_air || '-',
      }));

      setExportProgress(90);

      // Create workbook and worksheet
      const ws = XLSX.utils.json_to_sheet(excelData);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'Sensor Logs');

      // Set column widths
      ws['!cols'] = [
        { wch: 20 }, // Timestamp
        { wch: 12 }, // Suhu
        { wch: 15 }, // Kelembaban
        { wch: 20 }, // Kelembaban Tanah
        { wch: 18 }, // Kapasitas Air
      ];

      setExportProgress(95);

      // Generate filename with current date
      const filename = `sensor-logs-${new Date().toISOString().split('T')[0]}.xlsx`;

      // Save file
      XLSX.writeFile(wb, filename);

      setExportProgress(100);
    } catch (error) {
      console.error('Error exporting to Excel:', error);
      alert('Gagal export data. Silakan coba lagi.');
    } finally {
      setLoading(false);
      setIsExporting(false);
      setExportProgress(0);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-cyan-600 flex items-center justify-center">
            <Database className="w-4 h-4 text-white" />
          </div>
          <h2 className="text-xl font-semibold text-zinc-100">Sensor Data Logs</h2>
        </div>
        <div className="flex gap-3 flex-wrap">
          <button
            onClick={() => setAutoRefresh(!autoRefresh)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl
                     transition-all duration-200 shadow-lg
                     border text-sm font-medium
                     ${autoRefresh
                       ? 'bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white border-emerald-500/30 shadow-emerald-500/50'
                       : 'bg-gradient-to-r from-slate-600 to-slate-700 hover:from-slate-700 hover:to-slate-800 text-white border-slate-500/30 shadow-slate-500/50'
                     }`}
          >
            <RefreshCw className={`w-4 h-4 ${autoRefresh ? 'animate-spin' : ''}`} />
            <span>{autoRefresh ? 'Auto Refresh ON (5s)' : 'Auto Refresh OFF'}</span>
          </button>
          <button
            onClick={() => setShowFilterModal(true)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl 
                     transition-all duration-200 shadow-lg 
                     border text-sm font-medium
                     ${startDate || endDate
                       ? 'bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white border-purple-500/30 shadow-purple-500/50'
                       : 'bg-gradient-to-r from-slate-600 to-slate-700 hover:from-slate-700 hover:to-slate-800 text-white border-slate-500/30 shadow-slate-500/50'
                     }`}
          >
            <Filter className="w-4 h-4" />
            <span>{startDate || endDate || quickFilter ? 'Filter Active' : 'Filter Date'}</span>
          </button>
          <button
            onClick={() => fetchLogs(currentPage)}
            disabled={loading || autoRefresh}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 
                     hover:from-blue-700 hover:to-blue-800 text-white rounded-xl 
                     transition-all duration-200 shadow-lg hover:shadow-blue-500/50 
                     disabled:opacity-50 disabled:cursor-not-allowed border border-blue-500/30"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            <span className="text-sm font-medium">Refresh</span>
          </button>
          <button
            onClick={exportToExcel}
            disabled={loading || isExporting}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-emerald-600 to-emerald-700
                     hover:from-emerald-700 hover:to-emerald-800 text-white rounded-xl
                     transition-all duration-200 shadow-lg hover:shadow-emerald-500/50
                     disabled:opacity-50 disabled:cursor-not-allowed border border-emerald-500/30"
          >
            <Download className="w-4 h-4" />
            <span className="text-sm font-medium">
              {isExporting ? `Exporting ${exportProgress}%` : 'Export Excel'}
            </span>
          </button>
        </div>
      </div>

      <div className="backdrop-blur-sm bg-gradient-to-br from-slate-800/50 to-slate-700/50
                    border border-slate-600/30 rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gradient-to-r from-slate-700/50 to-slate-600/50 border-b border-slate-500/30">
                <th className="px-6 py-4 text-left text-xs font-semibold text-zinc-300 uppercase tracking-wider">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    Timestamp
                  </div>
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-zinc-300 uppercase tracking-wider">
                  Suhu (°C)
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-zinc-300 uppercase tracking-wider">
                  Kelembaban (%)
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-zinc-300 uppercase tracking-wider">
                  Kelembaban Tanah (%)
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-zinc-300 uppercase tracking-wider">
                  Kapasitas Air (%)
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-600/30">
              {groupedLogs.length === 0 && loading ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center">
                    <div className="flex items-center justify-center gap-3">
                      <RefreshCw className="w-5 h-5 animate-spin text-blue-400" />
                      <span className="text-zinc-400">Loading data...</span>
                    </div>
                  </td>
                </tr>
              ) : groupedLogs.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-zinc-400">
                    No data available
                  </td>
                </tr>
              ) : (
                groupedLogs.map((log, index) => (
                  <tr
                    key={index}
                    className="hover:bg-slate-700/30 transition-colors duration-150"
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-zinc-300 font-medium">
                      {log.timestamp}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-zinc-400">
                      {log.suhu || '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-zinc-400">
                      {log.kelembaban || '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-zinc-400">
                      {log.kelembaban_tanah || '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-zinc-400">
                      {log.kapasitas_air || '-'}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div className="text-sm text-zinc-400">
          Page {currentPage} of {totalPages}
          {(startDate || endDate || quickFilter) && (
            <span className="ml-2 text-purple-400">
              • Filter: {quickFilter || 'Custom Date'}
            </span>
          )}
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => fetchLogs(currentPage - 1)}
            disabled={currentPage === 1 || loading}
            className="px-4 py-2 bg-slate-700/50 hover:bg-slate-600/50 text-zinc-300
                     rounded-lg transition-all duration-200 disabled:opacity-50
                     disabled:cursor-not-allowed border border-slate-600/30 text-sm font-medium"
          >
            Previous
          </button>
          <button
            onClick={() => fetchLogs(currentPage + 1)}
            disabled={currentPage === totalPages || loading}
            className="px-4 py-2 bg-slate-700/50 hover:bg-slate-600/50 text-zinc-300
                     rounded-lg transition-all duration-200 disabled:opacity-50
                     disabled:cursor-not-allowed border border-slate-600/30 text-sm font-medium"
          >
            Next
          </button>
        </div>
      </div>

      {/* Filter Modal */}
      {showFilterModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl border border-slate-600/50 p-6 max-w-md w-full shadow-2xl">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-500 to-purple-600 flex items-center justify-center">
                  <Filter className="w-4 h-4 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-zinc-100">Filter by Date</h3>
              </div>
            </div>

            {/* Quick Filters */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-zinc-300 mb-3">
                Quick Filters
              </label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  onClick={() => applyQuickFilter('1day')}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200
                    ${quickFilter === '1day'
                      ? 'bg-gradient-to-r from-purple-600 to-purple-700 text-white border border-purple-500/30 shadow-lg'
                      : 'bg-slate-700/50 text-zinc-300 border border-slate-600/30 hover:bg-slate-600/50'
                    }`}
                >
                  Last 24h
                </button>
                <button
                  onClick={() => applyQuickFilter('1week')}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200
                    ${quickFilter === '1week'
                      ? 'bg-gradient-to-r from-purple-600 to-purple-700 text-white border border-purple-500/30 shadow-lg'
                      : 'bg-slate-700/50 text-zinc-300 border border-slate-600/30 hover:bg-slate-600/50'
                    }`}
                >
                  Last 7 Days
                </button>
                <button
                  onClick={() => applyQuickFilter('1month')}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200
                    ${quickFilter === '1month'
                      ? 'bg-gradient-to-r from-purple-600 to-purple-700 text-white border border-purple-500/30 shadow-lg'
                      : 'bg-slate-700/50 text-zinc-300 border border-slate-600/30 hover:bg-slate-600/50'
                    }`}
                >
                  Last 30 Days
                </button>
              </div>
            </div>

            <div className="relative mb-4">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-600/50"></div>
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="bg-slate-800 px-2 text-zinc-400">OR</span>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-zinc-300 mb-2">
                  Start Date
                </label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  max={endDate || undefined}
                  className="w-full px-4 py-2.5 bg-slate-700/50 border border-slate-600/50 rounded-xl 
                           text-zinc-100 focus:outline-none focus:ring-2 focus:ring-purple-500/50 
                           focus:border-purple-500/50 transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-zinc-300 mb-2">
                  End Date
                </label>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  min={startDate || undefined}
                  className="w-full px-4 py-2.5 bg-slate-700/50 border border-slate-600/50 rounded-xl 
                           text-zinc-100 focus:outline-none focus:ring-2 focus:ring-purple-500/50 
                           focus:border-purple-500/50 transition-all"
                />
              </div>

              <div className="pt-2 text-xs text-zinc-400">
                <p>• Leave both empty to show all data</p>
                <p>• Set only start date to show data from that date onwards</p>
                <p>• Set only end date to show data up to that date</p>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={clearFilter}
                className="flex-1 px-4 py-2.5 bg-slate-700/50 hover:bg-slate-600/50 text-zinc-300 
                         rounded-xl transition-all duration-200 border border-slate-600/30 text-sm font-medium"
              >
                Clear Filter
              </button>
              <button
                onClick={applyFilter}
                className="flex-1 px-4 py-2.5 bg-gradient-to-r from-purple-600 to-purple-700 
                         hover:from-purple-700 hover:to-purple-800 text-white rounded-xl 
                         transition-all duration-200 shadow-lg hover:shadow-purple-500/50 
                         border border-purple-500/30 text-sm font-medium"
              >
                Apply Filter
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
