import React, { useState } from 'react';
import { AlertCircle, Loader2 } from 'lucide-react';
import Layout from './components/Layout';
import Dashboard from './components/Dashboard';
import RepairTickets from './components/RepairTickets';
import CustomerManagement from './components/CustomerManagement';
import TechnicianWorkload from './components/TechnicianWorkload';
import Reports from './components/Reports';
import TicketModal from './components/TicketModal';
import CustomerModal from './components/CustomerModal';
import { useRepairSystem } from './hooks/useRepairSystem';
import { RepairTicket, Customer } from './types';

function App() {
  const [currentView, setCurrentView] = useState('dashboard');
  const [isTicketModalOpen, setIsTicketModalOpen] = useState(false);
  const [isCustomerModalOpen, setIsCustomerModalOpen] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState<RepairTicket | undefined>();
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | undefined>();
  const [modalMode, setModalMode] = useState<'create' | 'edit' | 'view'>('create');

  const {
    tickets,
    customers,
    technicians,
    loading,
    error,
    createTicket,
    updateTicket,
    deleteTicket,
    createCustomer,
    updateCustomer,
    deleteCustomer
  } = useRepairSystem();

  // Ticket Modal Handlers
  const handleCreateTicket = () => {
    setSelectedTicket(undefined);
    setModalMode('create');
    setIsTicketModalOpen(true);
  };

  const handleEditTicket = (ticket: RepairTicket) => {
    setSelectedTicket(ticket);
    setModalMode('edit');
    setIsTicketModalOpen(true);
  };

  const handleViewTicket = (ticket: RepairTicket) => {
    setSelectedTicket(ticket);
    setModalMode('view');
    setIsTicketModalOpen(true);
  };

  const handleSaveTicket = (ticketData: Partial<RepairTicket>) => {
    const saveTicket = async () => {
      try {
        if (modalMode === 'create') {
          await createTicket(ticketData);
        } else if (modalMode === 'edit' && selectedTicket) {
          await updateTicket(selectedTicket.id, ticketData);
        }
        setIsTicketModalOpen(false);
      } catch (error) {
        console.error('Error saving ticket:', error);
        // You could add a toast notification here
      }
    };
    
    saveTicket();
  };

  const handleDeleteTicket = async (ticketId: string) => {
    await deleteTicket(ticketId);
  };

  const handleSaveCustomer = async (customerData: Partial<Customer>) => {
    try {
      if (modalMode === 'create') {
        await createCustomer(customerData);
      } else if (modalMode === 'edit' && selectedCustomer) {
        await updateCustomer(selectedCustomer.id, customerData);
      }
      setIsCustomerModalOpen(false);
    } catch (error) {
      console.error('Error saving customer:', error);
      // You could add a toast notification here
    }
  };

  // Customer Modal Handlers
  const handleCreateCustomer = () => {
    setSelectedCustomer(undefined);
    setModalMode('create');
    setIsCustomerModalOpen(true);
  };

  const handleEditCustomer = (customer: Customer) => {
    setSelectedCustomer(customer);
    setModalMode('edit');
    setIsCustomerModalOpen(true);
  };

  const handleDeleteCustomer = async (customerId: string) => {
    await deleteCustomer(customerId);
  };

  const handleAssignTicket = async (ticketId: string, technicianId: string) => {
    try {
      const ticket = tickets.find(t => t.id === ticketId);
      const technician = technicians.find(t => t.id === technicianId);
      
      if (ticket && technician) {
        await updateTicket(ticketId, {
          technicianId: technicianId,
          technicianName: technician.name
        });
      }
    } catch (error) {
      console.error('Error assigning ticket:', error);
    }
  };

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600 mx-auto mb-4" />
          <h2 className="text-lg font-semibold text-gray-900 mb-2">Loading RepairPro</h2>
          <p className="text-gray-600">Connecting to database...</p>
        </div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6">
          <AlertCircle className="w-12 h-12 text-red-600 mx-auto mb-4" />
          <h2 className="text-lg font-semibold text-gray-900 mb-2">Connection Error</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <p className="text-sm text-gray-500">
            Please make sure you've connected to Supabase by clicking the "Connect to Supabase" button in the top right corner.
          </p>
        </div>
      </div>
    );
  }

  const renderCurrentView = () => {
    switch (currentView) {
      case 'dashboard':
        return <Dashboard tickets={tickets} onCreateTicket={handleCreateTicket} onCreateCustomer={handleCreateCustomer} />;
      case 'tickets':
        return (
          <RepairTickets
            tickets={tickets}
            onCreateTicket={handleCreateTicket}
            onEditTicket={handleEditTicket}
            onViewTicket={handleViewTicket}
            onDeleteTicket={handleDeleteTicket}
          />
        );
      case 'customers':
        return (
          <CustomerManagement
            customers={customers}
            onCreateCustomer={handleCreateCustomer}
            onEditCustomer={handleEditCustomer}
            onDeleteCustomer={handleDeleteCustomer}
          />
        );
      case 'workload':
        return (
          <TechnicianWorkload
            technicians={technicians}
            tickets={tickets}
            onAssignTicket={handleAssignTicket}
          />
        );
      case 'reports':
        return (
          <Reports
            tickets={tickets}
            customers={customers}
            technicians={technicians}
          />
        );
      case 'settings':
        return (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
            <h3 className="text-lg font-medium text-gray-900 mb-2">Settings</h3>
            <p className="text-gray-600">Settings panel coming soon...</p>
          </div>
        );
      default:
        return <Dashboard tickets={tickets} />;
    }
  };

  return (
    <>
      <Layout currentView={currentView} onViewChange={setCurrentView}>
        {renderCurrentView()}
      </Layout>

      {/* Modals */}
      <TicketModal
        isOpen={isTicketModalOpen}
        onClose={() => setIsTicketModalOpen(false)}
        onSave={handleSaveTicket}
        ticket={selectedTicket}
        customers={customers}
        technicians={technicians}
        mode={modalMode}
      />

      <CustomerModal
        isOpen={isCustomerModalOpen}
        onClose={() => setIsCustomerModalOpen(false)}
        onSave={handleSaveCustomer}
        customer={selectedCustomer}
        mode={modalMode}
      />
    </>
  );
}

export default App;