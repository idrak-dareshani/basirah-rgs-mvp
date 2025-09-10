import React, { useState } from 'react';
import { Search, Plus, Filter, Eye, Edit, Ticket } from 'lucide-react';
import { RepairTicket, RepairStatus, Priority } from '../types';
import { formatCurrency, formatDate, getStatusColor, getPriorityColor, getGradeColor } from '../utils/formatters';

interface RepairTicketsProps {
  tickets: RepairTicket[];
  onCreateTicket: () => void;
  onEditTicket: (ticket: RepairTicket) => void;
  onViewTicket: (ticket: RepairTicket) => void;
}

const RepairTickets: React.FC<RepairTicketsProps> = ({ 
  tickets, 
  onCreateTicket, 
  onEditTicket, 
  onViewTicket 
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');

  const filteredTickets = tickets.filter(ticket => {
    const matchesSearch = 
      ticket.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ticket.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ticket.deviceType.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ticket.deviceModel.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === 'all' || ticket.status === statusFilter;
    const matchesPriority = priorityFilter === 'all' || ticket.priority === priorityFilter;

    return matchesSearch && matchesStatus && matchesPriority;
  });

  const statusOptions = Object.values(RepairStatus);
  const priorityOptions = Object.values(Priority);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Repair Tickets</h2>
          <p className="text-gray-600">Manage and track all repair requests</p>
        </div>
        <button
          onClick={onCreateTicket}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200 flex items-center space-x-2"
        >
          <Plus className="w-4 h-4" />
          <span>New Ticket</span>
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="relative">
            <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search tickets..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          
          <div className="relative">
            <Filter className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none bg-white"
            >
              <option value="all">All Status</option>
              {statusOptions.map(status => (
                <option key={status} value={status}>
                  {status.replace('_', ' ').toUpperCase()}
                </option>
              ))}
            </select>
          </div>

          <div>
            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none bg-white"
            >
              <option value="all">All Priority</option>
              {priorityOptions.map(priority => (
                <option key={priority} value={priority}>
                  {priority.toUpperCase()}
                </option>
              ))}
            </select>
          </div>

          <div className="text-sm text-gray-600 flex items-center">
            Showing {filteredTickets.length} of {tickets.length} tickets
          </div>
        </div>
      </div>

      {/* Tickets Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredTickets.map((ticket) => (
          <div
            key={ticket.id}
            className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-200"
          >
            <div className="p-6">
              {/* Header */}
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="font-semibold text-gray-900">{ticket.id}</h3>
                  <p className="text-sm text-gray-600">{ticket.customerName}</p>
                </div>
                <div className="flex space-x-1">
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${getPriorityColor(ticket.priority)}`}>
                    {ticket.priority.toUpperCase()}
                  </span>
                </div>
              </div>

              {/* Device Info */}
              <div className="mb-4">
                <p className="font-medium text-gray-900">{ticket.deviceType}</p>
                <p className="text-sm text-gray-600">{ticket.deviceModel}</p>
                {ticket.serialNumber && (
                  <p className="text-xs text-gray-500">SN: {ticket.serialNumber}</p>
                )}
              </div>

              {/* Issue */}
              <div className="mb-4">
                <p className="text-sm text-gray-700 line-clamp-2">{ticket.issueDescription}</p>
              </div>

              {/* Status and Grade */}
              <div className="flex justify-between items-center mb-4">
                <span className={`px-3 py-1 text-sm font-medium rounded-full ${getStatusColor(ticket.status)}`}>
                  {ticket.status.replace('_', ' ')}
                </span>
                {ticket.grade && (
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${getGradeColor(ticket.grade)}`}>
                    Grade: {ticket.grade.toUpperCase()}
                  </span>
                )}
              </div>

              {/* Cost and Date */}
              <div className="flex justify-between items-center text-sm text-gray-600 mb-4">
                <span>Est: {formatCurrency(ticket.estimatedCost)}</span>
                <span>{formatDate(ticket.createdAt)}</span>
              </div>

              {/* Technician */}
              {ticket.technicianName && (
                <div className="text-sm text-gray-600 mb-4">
                  <span className="font-medium">Tech:</span> {ticket.technicianName}
                </div>
              )}

              {/* Actions */}
              <div className="flex space-x-2">
                <button
                  onClick={() => onViewTicket(ticket)}
                  className="flex-1 bg-gray-100 text-gray-700 px-3 py-2 rounded-lg hover:bg-gray-200 transition-colors duration-200 flex items-center justify-center space-x-1"
                >
                  <Eye className="w-4 h-4" />
                  <span>View</span>
                </button>
                <button
                  onClick={() => onEditTicket(ticket)}
                  className="flex-1 bg-blue-100 text-blue-700 px-3 py-2 rounded-lg hover:bg-blue-200 transition-colors duration-200 flex items-center justify-center space-x-1"
                >
                  <Edit className="w-4 h-4" />
                  <span>Edit</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredTickets.length === 0 && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
          <Ticket className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No tickets found</h3>
          <p className="text-gray-600 mb-6">
            {searchTerm || statusFilter !== 'all' || priorityFilter !== 'all'
              ? 'Try adjusting your search or filter criteria'
              : 'Get started by creating your first repair ticket'
            }
          </p>
          <button
            onClick={onCreateTicket}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors duration-200"
          >
            Create First Ticket
          </button>
        </div>
      )}
    </div>
  );
};

export default RepairTickets;