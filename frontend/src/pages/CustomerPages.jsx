import React, { useState, useEffect } from 'react';
import { Link, Outlet, useNavigate } from 'react-router-dom';
import axios from 'axios';

export function CustomerLayout() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <div className="dashboard-layout">
      <aside className="sidebar customer-sidebar">
        <h2>My Portal</h2>
        <nav className="sidebar-nav">
          <Link to="/customer">Overview</Link>
          <Link to="/customer/orders">My Orders</Link>
          <Link to="/customer/quotations">My Quotations</Link>
          <Link to="/customer/messages">Messages</Link>
          <button onClick={handleLogout} className="btn-secondary text-danger" style={{ marginTop: 'auto', background: 'transparent', border: 'none', cursor: 'pointer', textAlign: 'left', padding: '10px 15px' }}>Logout</button>
        </nav>
      </aside>
      <main className="dashboard-content">
        <Outlet />
      </main>
    </div>
  );
}

export function CustomerDashboard() {
  const [orders, setOrders] = useState([]);
  const [quotations, setQuotations] = useState([]);
  const token = localStorage.getItem('token');

  useEffect(() => {
    axios.get('http://localhost:5500/api/customer/orders', { headers: { Authorization: `Bearer ${token}` } })
      .then(res => setOrders(res.data))
      .catch(err => console.error(err));

    axios.get('http://localhost:5500/api/customer/quotations', { headers: { Authorization: `Bearer ${token}` } })
      .then(res => setQuotations(res.data))
      .catch(err => console.error(err));
  }, []);

  const activeOrdersCount = orders.filter(o => o.status !== 'Completed').length;
  const pendingQuotesCount = quotations.filter(q => q.status === 'Pending').length;

  return (
    <div>
      <h1>Customer Overview</h1>
      <div className="stats-grid">
        <div className="stat-card">
          <h3>Active Orders</h3>
          <p className="stat-value">{activeOrdersCount}</p>
        </div>
        <div className="stat-card">
          <h3>Pending Quotes</h3>
          <p className="stat-value">{pendingQuotesCount}</p>
        </div>
      </div>
    </div>
  );
}

export function CustomerOrders() {
  const [orders, setOrders] = useState([]);
  const token = localStorage.getItem('token');

  useEffect(() => {
    axios.get('http://localhost:5500/api/customer/orders', { headers: { Authorization: `Bearer ${token}` } })
      .then(res => setOrders(res.data))
      .catch(err => console.error(err));
  }, []);

  const getProgress = (status) => {
    switch (status) {
      case 'Pending': return 10;
      case 'In Progress': return 50;
      case 'Testing': return 80;
      case 'Completed': return 100;
      default: return 0;
    }
  };

  return (
    <div>
      <h1>My Orders</h1>
      {orders.length === 0 && <p>You have no active orders.</p>}
      
      {orders.map(order => (
        <div className="card" key={order.id} style={{marginBottom: '1rem'}}>
          <h3>Order #ORD-{order.id}: {order.model_name}</h3>
          <p>Status: <strong>{order.status}</strong></p>
          <p>Expected Completion: {new Date(order.expected_completion).toLocaleDateString()}</p>
          <div className="progress-bar" style={{background: '#eee', height: '10px', borderRadius: '5px', overflow: 'hidden', marginTop: '10px'}}>
            <div className="progress-fill" style={{ width: `${getProgress(order.status)}%`, background: '#27ae60', height: '100%' }}></div>
          </div>
          <p style={{ marginTop: '0.5rem', fontSize: '0.9rem' }}>{getProgress(order.status)}% Completed</p>
        </div>
      ))}
    </div>
  );
}

export function CustomerQuotations() {
  const [quotations, setQuotations] = useState([]);
  const token = localStorage.getItem('token');

  useEffect(() => {
    axios.get('http://localhost:5500/api/customer/quotations', { headers: { Authorization: `Bearer ${token}` } })
      .then(res => setQuotations(res.data))
      .catch(err => console.error(err));
  }, []);

  return (
    <div>
      <h1>My Quotations</h1>
      {quotations.length === 0 && <p>You have no quotation requests.</p>}

      <div className="card-grid">
        {quotations.map(q => (
          <div className="card" key={q.id}>
            <h3>Quote #QTE-{q.id}</h3>
            <p><strong>Model:</strong> {q.model_name}</p>
            <p><strong>Estimated Price:</strong> ${q.total_price}</p>
            <p><strong>Status:</strong> <span className={`badge ${q.status === 'Pending' ? 'warning' : 'success'}`}>{q.status}</span></p>
            <p style={{fontSize: '0.8rem', color: '#666'}}>Requested on: {new Date(q.created_at).toLocaleDateString()}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export function CustomerMessages() {
  return <div><h1>Messages</h1><p>Communicate with the sales and support team.</p></div>;
}
