import React from 'react';
import { Clock, CheckCircle, AlertTriangle, DollarSign } from 'lucide-react';
import { RepairTicket, RepairStatus } from '../types';
import { formatCurrency } from '../utils/formatters';

interface DashboardProps {
  tickets: RepairTicket[];
  onCreateTicket: () => void;
  onCreateCustomer: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ tickets, onCreateTicket, onCreateCustomer }) => {
  const activeTickets = tickets.filter(t => 
    ![RepairStatus.COMPLETED, RepairStatus.PICKED_UP, RepairStatus.CANCELLED].includes(t.status)
  );
  
  const completedToday = tickets.filter(t => {
    if (!t.completedAt) return false;
    const today = new Date().toDateString();
    return new Date(t.completedAt).toDateString() === today;
  });

  const urgentTickets = tickets.filter(t => t.priority === 'urgent' && 
    ![RepairStatus.COMPLETED, RepairStatus.PICKED_UP, RepairStatus.CANCELLED].includes(t.status)
  );

  const totalRevenue = tickets
    .filter(t => t.actualCost && t.status === RepairStatus.PICKED_UP)
    .reduce((sum, t) => sum + (t.actualCost || 0), 0);

  const stats = [
    {
      label: 'Active Repairs',
      value: activeTickets.length,
      icon: Clock,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50'
    },
    {
      label: 'Completed Today',
      value: completedToday.length,
      icon: CheckCircle,
      color: 'text-green-600',
      bgColor: 'bg-green-50'
    },
    {
      label: 'Urgent Priority',
      value: urgentTickets.length,
      icon: AlertTriangle,
      color: 'text-red-600',
      bgColor: 'bg-red-50'
    },
    {
      label: 'Monthly Revenue',
      value: formatCurrency(totalRevenue),
      icon: DollarSign,
      color: 'text-emerald-600',
      bgColor: 'bg-emerald-50'
    }
  ];

  const recentTickets = tickets
    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
    .slice(0, 5);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Dashboard</h2>
        <p className="text-gray-600">Welcome to your repair management center</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div
            key={index}
            className="bg-white rounded-lg shadow-sm p-6 border border-gray-200 hover:shadow-md transition-shadow duration-200"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{stat.label}</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
              </div>
              <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                <stat.icon className={`w-6 h-6 ${stat.color}`} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Recent Tickets</h3>
          </div>
          <div className="p-0">
            {recentTickets.map((ticket, index) => (
              <div
                key={ticket.id}
                className={`p-6 ${index !== recentTickets.length - 1 ? 'border-b border-gray-100' : ''}`}
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">{ticket.id}</p>
                    <p className="text-sm text-gray-600">{ticket.customerName}</p>
                    <p className="text-sm text-gray-500">{ticket.deviceType} - {ticket.deviceModel}</p>
                  </div>
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                    ticket.status === RepairStatus.COMPLETED ? 'bg-green-100 text-green-800' :
                    ticket.status === RepairStatus.IN_PROGRESS ? 'bg-yellow-100 text-yellow-800' :
                    'bg-blue-100 text-blue-800'
                  }`}>
                    {ticket.status.replace('_', ' ')}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Quick Actions</h3>
          </div>
          <div className="p-6 space-y-4">
            <button 
              onClick={onCreateTicket}
              className="w-full bg-blue-600 text-white px-4 py-3 rounded-lg hover:bg-blue-700 transition-colors duration-200 font-medium"
            >
              Create New Ticket
            </button>
            <button 
              onClick={onCreateCustomer}
              className="w-full bg-emerald-600 text-white px-4 py-3 rounded-lg hover:bg-emerald-700 transition-colors duration-200 font-medium"
            >
              Add Customer
            </button>
            <button className="w-full bg-gray-600 text-white px-4 py-3 rounded-lg hover:bg-gray-700 transition-colors duration-200 font-medium">
              Generate Report
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;