import React, { useState } from 'react';
import { Users, Clock, CheckCircle, AlertTriangle, User, Ticket, Phone, Mail } from 'lucide-react';
import { Technician, RepairTicket, RepairStatus } from '../types';
import { formatDate, getStatusColor, getPriorityColor, formatCurrency } from '../utils/formatters';

interface TechnicianWorkloadProps {
  technicians: Technician[];
  tickets: RepairTicket[];
  onAssignTicket?: (ticketId: string, technicianId: string) => void;
}

const TechnicianWorkload: React.FC<TechnicianWorkloadProps> = ({
  technicians,
  tickets,
  onAssignTicket
}) => {
  const [selectedTechnician, setSelectedTechnician] = useState<string | null>(null);

  // Get tickets assigned to each technician
  const getTechnicianTickets = (technicianId: string) => {
    return tickets.filter(ticket => 
      ticket.technicianId === technicianId && 
      ![RepairStatus.COMPLETED, RepairStatus.PICKED_UP, RepairStatus.CANCELLED].includes(ticket.status)
    );
  };

  // Get unassigned tickets
  const unassignedTickets = tickets.filter(ticket => 
    !ticket.technicianId && 
    ![RepairStatus.COMPLETED, RepairStatus.PICKED_UP, RepairStatus.CANCELLED].includes(ticket.status)
  );

  // Calculate workload metrics for a technician
  const getWorkloadMetrics = (technicianId: string) => {
    const techTickets = getTechnicianTickets(technicianId);
    const urgentTickets = techTickets.filter(t => t.priority === 'urgent');
    const inProgressTickets = techTickets.filter(t => t.status === RepairStatus.IN_PROGRESS);
    const totalValue = techTickets.reduce((sum, t) => sum + (t.estimatedCost || 0), 0);

    return {
      total: techTickets.length,
      urgent: urgentTickets.length,
      inProgress: inProgressTickets.length,
      totalValue
    };
  };

  // Get workload status color
  const getWorkloadColor = (ticketCount: number) => {
    if (ticketCount === 0) return 'text-gray-500 bg-gray-50';
    if (ticketCount <= 2) return 'text-green-700 bg-green-50';
    if (ticketCount <= 4) return 'text-yellow-700 bg-yellow-50';
    return 'text-red-700 bg-red-50';
  };

  const handleAssignTicket = (ticketId: string, technicianId: string) => {
    if (onAssignTicket) {
      onAssignTicket(ticketId, technicianId);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Technician Workload</h2>
        <p className="text-gray-600">Monitor and manage technician assignments and capacity</p>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Technicians</p>
              <p className="text-2xl font-bold text-gray-900">{technicians.length}</p>
            </div>
            <Users className="w-8 h-8 text-blue-600" />
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Active Tickets</p>
              <p className="text-2xl font-bold text-gray-900">
                {tickets.filter(t => ![RepairStatus.COMPLETED, RepairStatus.PICKED_UP, RepairStatus.CANCELLED].includes(t.status)).length}
              </p>
            </div>
            <Ticket className="w-8 h-8 text-green-600" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Unassigned</p>
              <p className="text-2xl font-bold text-gray-900">{unassignedTickets.length}</p>
            </div>
            <AlertTriangle className="w-8 h-8 text-orange-600" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Avg Load</p>
              <p className="text-2xl font-bold text-gray-900">
                {technicians.length > 0 ? Math.round(tickets.filter(t => t.technicianId && ![RepairStatus.COMPLETED, RepairStatus.PICKED_UP, RepairStatus.CANCELLED].includes(t.status)).length / technicians.length) : 0}
              </p>
            </div>
            <Clock className="w-8 h-8 text-purple-600" />
          </div>
        </div>
      </div>

      {/* Technician Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {technicians.map((technician) => {
          const metrics = getWorkloadMetrics(technician.id);
          const techTickets = getTechnicianTickets(technician.id);
          
          return (
            <div
              key={technician.id}
              className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-200"
            >
              <div className="p-6">
                {/* Technician Header */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                      <User className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{technician.name}</h3>
                      <p className="text-sm text-gray-600">{technician.email}</p>
                    </div>
                  </div>
                  <span className={`px-3 py-1 text-sm font-medium rounded-full ${getWorkloadColor(metrics.total)}`}>
                    {metrics.total} tickets
                  </span>
                </div>

                {/* Specialties */}
                <div className="mb-4">
                  <p className="text-sm font-medium text-gray-700 mb-2">Specialties</p>
                  <div className="flex flex-wrap gap-1">
                    {technician.specialties.map((specialty, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded-md"
                      >
                        {specialty}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Workload Metrics */}
                <div className="grid grid-cols-3 gap-4 mb-4 p-3 bg-gray-50 rounded-lg">
                  <div className="text-center">
                    <p className="text-lg font-bold text-gray-900">{metrics.total}</p>
                    <p className="text-xs text-gray-600">Total</p>
                  </div>
                  <div className="text-center">
                    <p className="text-lg font-bold text-red-600">{metrics.urgent}</p>
                    <p className="text-xs text-gray-600">Urgent</p>
                  </div>
                  <div className="text-center">
                    <p className="text-lg font-bold text-blue-600">{metrics.inProgress}</p>
                    <p className="text-xs text-gray-600">In Progress</p>
                  </div>
                </div>

                {/* Total Value */}
                <div className="mb-4">
                  <p className="text-sm text-gray-600">
                    Total Value: <span className="font-semibold text-gray-900">{formatCurrency(metrics.totalValue)}</span>
                  </p>
                </div>

                {/* Recent Tickets */}
                <div className="space-y-2">
                  <p className="text-sm font-medium text-gray-700">Current Tickets</p>
                  {techTickets.length === 0 ? (
                    <p className="text-sm text-gray-500 italic">No active tickets</p>
                  ) : (
                    <div className="space-y-2 max-h-32 overflow-y-auto">
                      {techTickets.slice(0, 3).map((ticket) => (
                        <div
                          key={ticket.id}
                          className="flex items-center justify-between p-2 bg-gray-50 rounded-md"
                        >
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900 truncate">{ticket.id}</p>
                            <p className="text-xs text-gray-600 truncate">{ticket.deviceType}</p>
                          </div>
                          <div className="flex items-center space-x-2">
                            <span className={`px-2 py-1 text-xs font-medium rounded-full ${getPriorityColor(ticket.priority)}`}>
                              {ticket.priority}
                            </span>
                            <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(ticket.status)}`}>
                              {ticket.status.replace('_', ' ')}
                            </span>
                          </div>
                        </div>
                      ))}
                      {techTickets.length > 3 && (
                        <p className="text-xs text-gray-500 text-center">
                          +{techTickets.length - 3} more tickets
                        </p>
                      )}
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="mt-4 pt-4 border-t border-gray-100">
                  <button
                    onClick={() => setSelectedTechnician(selectedTechnician === technician.id ? null : technician.id)}
                    className="w-full bg-blue-50 text-blue-700 px-4 py-2 rounded-lg hover:bg-blue-100 transition-colors duration-200 text-sm font-medium"
                  >
                    {selectedTechnician === technician.id ? 'Hide Details' : 'View Details'}
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Unassigned Tickets */}
      {unassignedTickets.length > 0 && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center space-x-2">
              <AlertTriangle className="w-5 h-5 text-orange-600" />
              <h3 className="text-lg font-semibold text-gray-900">Unassigned Tickets ({unassignedTickets.length})</h3>
            </div>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {unassignedTickets.map((ticket) => (
                <div
                  key={ticket.id}
                  className="border border-gray-200 rounded-lg p-4 hover:shadow-sm transition-shadow duration-200"
                >
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <p className="font-medium text-gray-900">{ticket.id}</p>
                      <p className="text-sm text-gray-600">{ticket.customerName}</p>
                    </div>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getPriorityColor(ticket.priority)}`}>
                      {ticket.priority}
                    </span>
                  </div>
                  <p className="text-sm text-gray-700 mb-2">{ticket.deviceType} - {ticket.deviceModel}</p>
                  <p className="text-sm text-gray-600 mb-3 line-clamp-2">{ticket.issueDescription}</p>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-gray-900">{formatCurrency(ticket.estimatedCost)}</span>
                    <select
                      onChange={(e) => e.target.value && handleAssignTicket(ticket.id, e.target.value)}
                      className="text-xs border border-gray-300 rounded px-2 py-1"
                      defaultValue=""
                    >
                      <option value="">Assign to...</option>
                      {technicians.map((tech) => (
                        <option key={tech.id} value={tech.id}>
                          {tech.name} ({getWorkloadMetrics(tech.id).total})
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Empty State */}
      {technicians.length === 0 && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
          <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No technicians found</h3>
          <p className="text-gray-600">Add technicians to start managing workloads</p>
        </div>
      )}
    </div>
  );
};

export default TechnicianWorkload;