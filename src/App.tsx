import React, { useState } from 'react';
import Layout from './components/Layout';
import Dashboard from './components/Dashboard';
import RepairTickets from './components/RepairTickets';
import CustomerManagement from './components/CustomerManagement';
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
    createTicket,
    updateTicket,
    createCustomer,
    updateCustomer
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
    if (modalMode === 'create') {
      createTicket(ticketData);
    } else if (modalMode === 'edit' && selectedTicket) {
      updateTicket(selectedTicket.id, ticketData);
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

  const handleSaveCustomer = (customerData: Partial<Customer>) => {
    if (modalMode === 'create') {
      createCustomer(customerData);
    } else if (modalMode === 'edit' && selectedCustomer) {
      updateCustomer(selectedCustomer.id, customerData);
    }
  };

  const renderCurrentView = () => {
    switch (currentView) {
      case 'dashboard':
        return <Dashboard tickets={tickets} />;
      case 'tickets':
        return (
          <RepairTickets
            tickets={tickets}
            onCreateTicket={handleCreateTicket}
            onEditTicket={handleEditTicket}
            onViewTicket={handleViewTicket}
          />
        );
      case 'customers':
        return (
          <CustomerManagement
            customers={customers}
            onCreateCustomer={handleCreateCustomer}
            onEditCustomer={handleEditCustomer}
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