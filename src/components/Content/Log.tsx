/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from 'react';
import { Download, RefreshCw, Database, Calendar } from 'lucide-react';
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
  const pageSize = 50;

  const fetchLogs = async (page: number, showLoading = true) => {
    if (showLoading) setLoading(true);
    try {
      const response = await fetch(
        `http://93.115.101.176:9703/?page=${page}&size=${pageSize}`
      );
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
  }, []);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (autoRefresh) {
      interval = setInterval(() => {
        fetchLogs(currentPage, false);
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [autoRefresh, currentPage]);

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

  const exportToExcel = async () => {
    setLoading(true);
    try {
      // Fetch all data
      const response = await fetch(
        `http://93.115.101.176:9703/?page=1&size=10000`
      );
      const data = await response.json();
      const allLogs = data.data || [];

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

      const groupedArray = Object.values(grouped).sort(
        (a, b) =>
          new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
      );

      // Prepare data for Excel
      const excelData = groupedArray.map((log) => ({
        Timestamp: log.timestamp,
        'Suhu (°C)': log.suhu || '-',
        'Kelembaban (%)': log.kelembaban || '-',
        'Kelembaban Tanah (%)': log.kelembaban_tanah || '-',
        'Kapasitas Air (%)': log.kapasitas_air || '-',
      }));

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

      // Generate filename with current date
      const filename = `sensor-logs-${new Date().toISOString().split('T')[0]}.xlsx`;

      // Save file
      XLSX.writeFile(wb, filename);
    } catch (error) {
      console.error('Error exporting to Excel:', error);
    } finally {
      setLoading(false);
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
            <span>{autoRefresh ? 'Auto Refresh ON' : 'Auto Refresh OFF'}</span>
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
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-emerald-600 to-emerald-700 
                     hover:from-emerald-700 hover:to-emerald-800 text-white rounded-xl 
                     transition-all duration-200 shadow-lg hover:shadow-emerald-500/50 
                     disabled:opacity-50 disabled:cursor-not-allowed border border-emerald-500/30"
          >
            <Download className="w-4 h-4" />
            <span className="text-sm font-medium">Export Excel</span>
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
    </div>
  );
}
