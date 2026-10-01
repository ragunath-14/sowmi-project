import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useStore } from '../../context/StoreContext';

const AuditLog = () => {
  const { backendUrl, token, isAdmin, setToken } = useStore();
  const navigate = useNavigate();
  const [logs, setLogs] = useState([]);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!token || !isAdmin) {
      navigate('/home');
      return;
    }
    // A 401 here (expired/invalid token) is handled globally by
    // sessionManager.js, which clears the session and redirects to /login.
    const fetchLogs = async () => {
      try {
        const response = await axios.get(`${backendUrl}/admin/audit-log`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setLogs(response.data.logs || []);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load audit log');
      } finally {
        setIsLoading(false);
      }
    };
    fetchLogs();
  }, [token, isAdmin, backendUrl, navigate]);

  const handleLogout = () => {
    setToken('');
    navigate('/login');
  }

  return (
    <div className="container-fluid" style={{ marginTop: 40, marginBottom: 40 }}>
      <div className="container">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h3 className="fw-bold mb-0">Audit Log</h3>
          <div className="d-flex gap-2">
            <Link to="/home" className="btn btn-outline-secondary btn-sm">Back Home</Link>
            <button type="button" className="btn btn-outline-danger btn-sm" onClick={handleLogout}>Logout</button>
          </div>
        </div>

        {isLoading && <p className="text-muted">Loading…</p>}
        {error && <p className="text-danger">{error}</p>}

        {!isLoading && !error && (
          <div className="card shadow-sm">
            <div className="table-responsive">
              <table className="table table-hover mb-0 align-middle">
                <thead className="table-light">
                  <tr>
                    <th>Time</th>
                    <th>User</th>
                    <th>Action</th>
                    <th>Details</th>
                  </tr>
                </thead>
                <tbody>
                  {logs.length === 0 && (
                    <tr>
                      <td colSpan={4} className="text-center text-muted py-4">No activity recorded yet.</td>
                    </tr>
                  )}
                  {logs.map((row) => (
                    <tr key={row.id}>
                      <td>{new Date(row.created_at).toLocaleString()}</td>
                      <td>{row.user_email || <span className="text-muted">anonymous</span>}</td>
                      <td><span className="badge bg-secondary">{row.action}</span></td>
                      <td>{row.details || '—'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AuditLog;
