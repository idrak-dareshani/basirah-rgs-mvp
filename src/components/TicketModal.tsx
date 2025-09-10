import React, { useState, useEffect } from 'react';
import { X, Save, User, Smartphone, FileText, DollarSign, Star, Upload, Image as ImageIcon, Trash2 } from 'lucide-react';
import { RepairTicket, RepairStatus, Priority, Grade, Customer, Technician } from '../types';

interface TicketModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (ticket: Partial<RepairTicket> & { filesToUpload?: File[] }) => void;
  ticket?: RepairTicket;
  customers: Customer[];
  technicians: Technician[];
  mode: 'create' | 'edit' | 'view';
}

const TicketModal: React.FC<TicketModalProps> = ({
  isOpen,
  onClose,
  onSave,
  ticket,
  customers,
  technicians,
  mode
}) => {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [formData, setFormData] = useState<Partial<RepairTicket>>({
    customerId: '',
    customerName: '',
    deviceType: '',
    deviceModel: '',
    serialNumber: '',
    issueDescription: '',
    estimatedCost: 0,
    actualCost: 0,
    status: RepairStatus.RECEIVED,
    priority: Priority.MEDIUM,
    grade: undefined,
    gradeNotes: '',
    technicianId: '',
    technicianName: '',
    images: []
  });

  useEffect(() => {
    if (ticket) {
      setFormData(ticket);
    } else {
      setFormData({
        customerId: '',
        customerName: '',
        deviceType: '',
        deviceModel: '',
        serialNumber: '',
        issueDescription: '',
        estimatedCost: 0,
        actualCost: 0,
        status: RepairStatus.RECEIVED,
        priority: Priority.MEDIUM,
        grade: undefined,
        gradeNotes: '',
        technicianId: '',
        technicianName: '',
        images: []
      });
    }
    // Reset file selections when ticket changes
    setSelectedFiles([]);
    setImagePreviews([]);
  }, [ticket]);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    if (files.length === 0) return;

    // Create preview URLs for selected files
    const newPreviews = files.map(file => URL.createObjectURL(file));
    
    setSelectedFiles(prev => [...prev, ...files]);
    setImagePreviews(prev => [...prev, ...newPreviews]);
  };

  const removeSelectedImage = (index: number) => {
    // Revoke the object URL to prevent memory leaks
    URL.revokeObjectURL(imagePreviews[index]);
    
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
    setImagePreviews(prev => prev.filter((_, i) => i !== index));
  };

  const removeExistingImage = (index: number) => {
    const updatedImages = (formData.images || []).filter((_, i) => i !== index);
    setFormData(prev => ({ ...prev, images: updatedImages }));
  };

  // Cleanup object URLs when component unmounts
  useEffect(() => {
    return () => {
      imagePreviews.forEach(url => URL.revokeObjectURL(url));
    };
  }, []);
  const handleCustomerChange = (customerId: string) => {
    const customer = customers.find(c => c.id === customerId);
    setFormData(prev => ({
      ...prev,
      customerId,
      customerName: customer?.name || ''
    }));
  };

  const handleTechnicianChange = (technicianId: string) => {
    const technician = technicians.find(t => t.id === technicianId);
    setFormData(prev => ({
      ...prev,
      technicianId,
      technicianName: technician?.name || ''
    }));
  };

  const handleSave = () => {
    if (mode !== 'view') {
      onSave({ ...formData, filesToUpload: selectedFiles });
    }
    onClose();
  };

  if (!isOpen) return null;

  const isReadOnly = mode === 'view';
  const title = mode === 'create' ? 'Create New Ticket' : 
                mode === 'edit' ? 'Edit Ticket' : 'View Ticket';

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-screen overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">{title}</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors duration-200"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Customer Section */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2 text-lg font-medium text-gray-900">
              <User className="w-5 h-5" />
              <span>Customer Information</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Customer</label>
                <select
                  value={formData.customerId}
                  onChange={(e) => handleCustomerChange(e.target.value)}
                  disabled={isReadOnly}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-50"
                >
                  <option value="">Select Customer</option>
                  {customers.map(customer => (
                    <option key={customer.id} value={customer.id}>
                      {customer.name} - {customer.phone}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Device Section */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2 text-lg font-medium text-gray-900">
              <Smartphone className="w-5 h-5" />
              <span>Device Information</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Device Type</label>
                <input
                  type="text"
                  value={formData.deviceType}
                  onChange={(e) => setFormData(prev => ({ ...prev, deviceType: e.target.value }))}
                  disabled={isReadOnly}
                  placeholder="iPhone, MacBook, etc."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-50"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Model</label>
                <input
                  type="text"
                  value={formData.deviceModel}
                  onChange={(e) => setFormData(prev => ({ ...prev, deviceModel: e.target.value }))}
                  disabled={isReadOnly}
                  placeholder="iPhone 14 Pro, MacBook Pro 16"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-50"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Serial Number</label>
                <input
                  type="text"
                  value={formData.serialNumber}
                  onChange={(e) => setFormData(prev => ({ ...prev, serialNumber: e.target.value }))}
                  disabled={isReadOnly}
                  placeholder="Optional"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-50"
                />
              </div>
            </div>
          </div>

          {/* Issue Section */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2 text-lg font-medium text-gray-900">
              <FileText className="w-5 h-5" />
              <span>Repair Details</span>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Issue Description</label>
              <textarea
                value={formData.issueDescription}
                onChange={(e) => setFormData(prev => ({ ...prev, issueDescription: e.target.value }))}
                disabled={isReadOnly}
                placeholder="Describe the problem in detail..."
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-50"
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value as RepairStatus }))}
                  disabled={isReadOnly}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-50"
                >
                  {Object.values(RepairStatus).map(status => (
                    <option key={status} value={status}>
                      {status.replace('_', ' ').toUpperCase()}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
                <select
                  value={formData.priority}
                  onChange={(e) => setFormData(prev => ({ ...prev, priority: e.target.value as Priority }))}
                  disabled={isReadOnly}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-50"
                >
                  {Object.values(Priority).map(priority => (
                    <option key={priority} value={priority}>
                      {priority.toUpperCase()}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Technician</label>
                <select
                  value={formData.technicianId}
                  onChange={(e) => handleTechnicianChange(e.target.value)}
                  disabled={isReadOnly}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-50"
                >
                  <option value="">Unassigned</option>
                  {technicians.map(tech => (
                    <option key={tech.id} value={tech.id}>
                      {tech.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Pricing Section */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2 text-lg font-medium text-gray-900">
              <DollarSign className="w-5 h-5" />
              <span>Pricing</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Estimated Cost</label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.estimatedCost}
                  onChange={(e) => setFormData(prev => ({ ...prev, estimatedCost: parseFloat(e.target.value) }))}
                  disabled={isReadOnly}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-50"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Actual Cost</label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.actualCost || ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, actualCost: parseFloat(e.target.value) }))}
                  disabled={isReadOnly}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-50"
                />
              </div>
            </div>
          </div>

          {/* Grading Section */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2 text-lg font-medium text-gray-900">
              <Star className="w-5 h-5" />
              <span>Device Grading</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Condition Grade</label>
                <select
                  value={formData.grade || ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, grade: e.target.value as Grade }))}
                  disabled={isReadOnly}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-50"
                >
                  <option value="">Not Graded</option>
                  {Object.values(Grade).map(grade => (
                    <option key={grade} value={grade}>
                      {grade.toUpperCase()}
                    </option>
                  ))}
                </select>
              </div>
              <div className="md:col-span-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">Grade Notes</label>
                <textarea
                  value={formData.gradeNotes}
                  onChange={(e) => setFormData(prev => ({ ...prev, gradeNotes: e.target.value }))}
                  disabled={isReadOnly}
                  placeholder="Condition details, cosmetic issues, etc."
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-50"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        {!isReadOnly && (
          <div className="flex justify-end space-x-3 p-6 border-t border-gray-200 bg-gray-50">
            <button
              onClick={onClose}
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 flex items-center space-x-2"
            >
              <Save className="w-4 h-4" />
              <span>{mode === 'create' ? 'Create Ticket' : 'Save Changes'}</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default TicketModal;