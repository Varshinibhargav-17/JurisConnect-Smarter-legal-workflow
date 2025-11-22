export const clients = [
  { id: '1', name: 'John Doe', email: 'john@example.com', phone: '123-456-7890', status: 'Active' },
  { id: '2', name: 'Jane Smith', email: 'jane@example.com', phone: '098-765-4321', status: 'Active' },
  { id: '3', name: 'Alice Johnson', email: 'alice@example.com', phone: '555-555-5555', status: 'Inactive' },
  { id: '4', name: 'Bob Brown', email: 'bob@example.com', phone: '111-222-3333', status: 'Active' },
  { id: '5', name: 'Charlie Davis', email: 'charlie@example.com', phone: '444-555-6666', status: 'Active' },
];

export const cases = [
  { id: '1', name: 'Case A', clientId: '1', clientName: 'John Doe', status: 'Open', description: 'Details for Case A', assignee: 'lawyer' },
  { id: '2', name: 'Case B', clientId: '2', clientName: 'Jane Smith', status: 'Closed', description: 'Details for Case B', assignee: 'lawyer' },
  { id: '3', name: 'Case C', clientId: '1', clientName: 'John Doe', status: 'Open', description: 'Details for Case C', assignee: 'unassigned' },
];

export const notes = [
    { id: '1', clientId: '1', text: 'Note for John Doe' },
];

export const appointments = [
  { id: '1', title: 'Meeting with John', clientName: 'John Doe', date: '2025-11-23', time: '10:00 AM', lawyer: 'Lawyer One' },
  { id: '2', title: 'Case Review', clientName: 'Jane Smith', date: '2025-11-24', time: '2:00 PM', lawyer: 'Lawyer One' },
  { id: '3', title: 'Initial Consultation', clientName: 'New Client', date: '2025-11-25', time: '11:00 AM', lawyer: 'Lawyer Two' },
];

export const documents = [
  { id: '1', name: 'doc1.pdf', clientName: 'John Doe', uploadedAt: '2025-11-22' },
];

export const recentActivity = [
    { activity: 'New client added: Jane Smith', date: '2025-11-22' },
    { activity: 'Case closed: Case B', date: '2025-11-21' },
];

export const users = [
    { id: '1', name: 'Admin User', role: 'admin' },
    { id: '2', name: 'Lawyer User', role: 'lawyer' },
    { id: '3', name: 'John Doe', role: 'user' },
];

export const caseStats = [
  { name: 'Jan', open: 4, closed: 2 },
  { name: 'Feb', open: 3, closed: 5 },
  { name: 'Mar', open: 6, closed: 3 },
  { name: 'Apr', open: 5, closed: 4 },
];
