import React, { useState, useMemo } from 'react';
import { BarChart3, TrendingUp, DollarSign, Clock, Users, Ticket, Calendar, Download, Filter, PieChart } from 'lucide-react';
import { RepairTicket, RepairStatus, Priority, Customer, Technician } from '../types';
import { formatCurrency, formatDate, getStatusColor, getPriorityColor } from '../utils/formatters';

interface ReportsProps {
  tickets: RepairTicket[];
  customers: Customer[];
  technicians: Technician[];
}

const Reports: React.FC<ReportsProps> = ({ tickets, customers, technicians }) => {
  const [dateRange, setDateRange] = useState('30'); // days
  const [selectedReport, setSelectedReport] = useState('overview');

  // Filter tickets by date range
  const filteredTickets = useMemo(() => {
    const daysAgo = parseInt(dateRange);
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - daysAgo);
    
    return tickets.filter(ticket => 
      new Date(ticket.createdAt) >= cutoffDate
    );
  }, [tickets, dateRange]);

  // Calculate key metrics
  const metrics = useMemo(() => {
    const completedTickets = filteredTickets.filter(t => t.status === RepairStatus.COMPLETED || t.status === RepairStatus.PICKED_UP);
    const activeTickets = filteredTickets.filter(t => 
      ![RepairStatus.COMPLETED, RepairStatus.PICKED_UP, RepairStatus.CANCELLED].includes(t.status)
    );
    
    const totalRevenue = completedTickets.reduce((sum, t) => sum + (t.actualCost || t.estimatedCost), 0);
    const avgTicketValue = completedTickets.length > 0 ? totalRevenue / completedTickets.length : 0;
    
    const completionTimes = completedTickets
      .filter(t => t.completedAt)
      .map(t => {
        const created = new Date(t.createdAt);
        const completed = new Date(t.completedAt!);
        return (completed.getTime() - created.getTime()) / (1000 * 60 * 60 * 24); // days
      });
    
    const avgCompletionTime = completionTimes.length > 0 
      ? completionTimes.reduce((sum, time) => sum + time, 0) / completionTimes.length 
      : 0;

    return {
      totalTickets: filteredTickets.length,
      completedTickets: completedTickets.length,
      activeTickets: activeTickets.length,
      totalRevenue,
      avgTicketValue,
      avgCompletionTime,
      completionRate: filteredTickets.length > 0 ? (completedTickets.length / filteredTickets.length) * 100 : 0
    };
  }, [filteredTickets]);

  // Status distribution
  const statusDistribution = useMemo(() => {
    const distribution: Record<string, number> = {};
    filteredTickets.forEach(ticket => {
      distribution[ticket.status] = (distribution[ticket.status] || 0) + 1;
    });
    return Object.entries(distribution).map(([status, count]) => ({
      status,
      count,
      percentage: (count / filteredTickets.length) * 100
    }));
  }, [filteredTickets]);

  // Priority distribution
  const priorityDistribution = useMemo(() => {
    const distribution: Record<string, number> = {};
    filteredTickets.forEach(ticket => {
      distribution[ticket.priority] = (distribution[ticket.priority] || 0) + 1;
    });
    return Object.entries(distribution).map(([priority, count]) => ({
      priority,
      count,
      percentage: (count / filteredTickets.length) * 100
    }));
  }, [filteredTickets]);

  // Device type analysis
  const deviceTypeAnalysis = useMemo(() => {
    const analysis: Record<string, { count: number; revenue: number }> = {};
    filteredTickets.forEach(ticket => {
      if (!analysis[ticket.deviceType]) {
        analysis[ticket.deviceType] = { count: 0, revenue: 0 };
      }
      analysis[ticket.deviceType].count++;
      analysis[ticket.deviceType].revenue += ticket.actualCost || ticket.estimatedCost;
    });
    
    return Object.entries(analysis)
      .map(([deviceType, data]) => ({
        deviceType,
        count: data.count,
        revenue: data.revenue,
        avgValue: data.count > 0 ? data.revenue / data.count : 0
      }))
      .sort((a, b) => b.count - a.count);
  }, [filteredTickets]);

  // Technician performance
  const technicianPerformance = useMemo(() => {
    const performance = technicians.map(tech => {
      const techTickets = filteredTickets.filter(t => t.technicianId === tech.id);
      const completedTickets = techTickets.filter(t => 
        t.status === RepairStatus.COMPLETED || t.status === RepairStatus.PICKED_UP
      );
      
      const revenue = completedTickets.reduce((sum, t) => sum + (t.actualCost || t.estimatedCost), 0);
      
      return {
        name: tech.name,
        totalTickets: techTickets.length,
        completedTickets: completedTickets.length,
        revenue,
        completionRate: techTickets.length > 0 ? (completedTickets.length / techTickets.length) * 100 : 0
      };
    });
    
    return performance.sort((a, b) => b.revenue - a.revenue);
  }, [filteredTickets, technicians]);

  // Revenue trend (simplified - by week)
  const revenueTrend = useMemo(() => {
    const weeks: Record<string, number> = {};
    
    filteredTickets
      .filter(t => t.status === RepairStatus.COMPLETED || t.status === RepairStatus.PICKED_UP)
      .forEach(ticket => {
        const date = new Date(ticket.completedAt || ticket.updatedAt);
        const weekStart = new Date(date);
        weekStart.setDate(date.getDate() - date.getDay());
        const weekKey = weekStart.toISOString().split('T')[0];
        
        weeks[weekKey] = (weeks[weekKey] || 0) + (ticket.actualCost || ticket.estimatedCost);
      });
    
    return Object.entries(weeks)
      .map(([week, revenue]) => ({ week, revenue }))
      .sort((a, b) => a.week.localeCompare(b.week));
  }, [filteredTickets]);

  const exportReport = () => {
    const reportData = {
      dateRange: `${dateRange} days`,
      generatedAt: new Date().toISOString(),
      metrics,
      statusDistribution,
      priorityDistribution,
      deviceTypeAnalysis,
      technicianPerformance,
      revenueTrend
    };
    
    const blob = new Blob([JSON.stringify(reportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `repair-report-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const renderOverviewReport = () => (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Revenue</p>
              <p className="text-2xl font-bold text-green-600">{formatCurrency(metrics.totalRevenue)}</p>
            </div>
            <DollarSign className="w-8 h-8 text-green-600" />
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Completed Tickets</p>
              <p className="text-2xl font-bold text-blue-600">{metrics.completedTickets}</p>
            </div>
            <Ticket className="w-8 h-8 text-blue-600" />
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Avg Ticket Value</p>
              <p className="text-2xl font-bold text-purple-600">{formatCurrency(metrics.avgTicketValue)}</p>
            </div>
            <TrendingUp className="w-8 h-8 text-purple-600" />
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Completion Rate</p>
              <p className="text-2xl font-bold text-emerald-600">{metrics.completionRate.toFixed(1)}%</p>
            </div>
            <Clock className="w-8 h-8 text-emerald-600" />
          </div>
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Status Distribution */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Status Distribution</h3>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {statusDistribution.map(({ status, count, percentage }) => (
                <div key={status} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <span className={`px-3 py-1 text-sm font-medium rounded-full ${getStatusColor(status)}`}>
                      {status.replace('_', ' ')}
                    </span>
                    <span className="text-sm text-gray-600">{count} tickets</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-20 bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full" 
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                    <span className="text-sm font-medium text-gray-900">{percentage.toFixed(1)}%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Priority Distribution */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Priority Distribution</h3>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {priorityDistribution.map(({ priority, count, percentage }) => (
                <div key={priority} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <span className={`px-3 py-1 text-sm font-medium rounded-full ${getPriorityColor(priority)}`}>
                      {priority.toUpperCase()}
                    </span>
                    <span className="text-sm text-gray-600">{count} tickets</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-20 bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-orange-600 h-2 rounded-full" 
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                    <span className="text-sm font-medium text-gray-900">{percentage.toFixed(1)}%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Device Analysis */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Device Type Analysis</h3>
        </div>
        <div className="p-6">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Device Type</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Count</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Revenue</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Avg Value</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {deviceTypeAnalysis.map(({ deviceType, count, revenue, avgValue }) => (
                  <tr key={deviceType}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{deviceType}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{count}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatCurrency(revenue)}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatCurrency(avgValue)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );

  const renderTechnicianReport = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Technician Performance</h3>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {technicianPerformance.map((tech) => (
              <div key={tech.name} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <Users className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">{tech.name}</h4>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Total Tickets</span>
                    <span className="text-sm font-medium text-gray-900">{tech.totalTickets}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Completed</span>
                    <span className="text-sm font-medium text-gray-900">{tech.completedTickets}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Revenue</span>
                    <span className="text-sm font-medium text-gray-900">{formatCurrency(tech.revenue)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Completion Rate</span>
                    <span className="text-sm font-medium text-gray-900">{tech.completionRate.toFixed(1)}%</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const renderRevenueReport = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Revenue Trend</h3>
        </div>
        <div className="p-6">
          {revenueTrend.length > 0 ? (
            <div className="space-y-4">
              {revenueTrend.map(({ week, revenue }) => (
                <div key={week} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="text-sm font-medium text-gray-900">Week of {formatDate(week)}</span>
                  <span className="text-sm font-bold text-green-600">{formatCurrency(revenue)}</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-center py-8">No revenue data available for the selected period</p>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Reports & Analytics</h2>
          <p className="text-gray-600">Comprehensive insights into your repair business</p>
        </div>
        <button
          onClick={exportReport}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200 flex items-center space-x-2"
        >
          <Download className="w-4 h-4" />
          <span>Export Report</span>
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center space-x-2">
            <Calendar className="w-4 h-4 text-gray-400" />
            <label className="text-sm font-medium text-gray-700">Date Range:</label>
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-1 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="7">Last 7 days</option>
              <option value="30">Last 30 days</option>
              <option value="90">Last 90 days</option>
              <option value="365">Last year</option>
            </select>
          </div>
          
          <div className="flex items-center space-x-2">
            <Filter className="w-4 h-4 text-gray-400" />
            <label className="text-sm font-medium text-gray-700">Report Type:</label>
            <select
              value={selectedReport}
              onChange={(e) => setSelectedReport(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-1 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="overview">Overview</option>
              <option value="technician">Technician Performance</option>
              <option value="revenue">Revenue Analysis</option>
            </select>
          </div>
          
          <div className="text-sm text-gray-600">
            Showing data for {filteredTickets.length} tickets
          </div>
        </div>
      </div>

      {/* Report Content */}
      {selectedReport === 'overview' && renderOverviewReport()}
      {selectedReport === 'technician' && renderTechnicianReport()}
      {selectedReport === 'revenue' && renderRevenueReport()}
    </div>
  );
};

export default Reports;