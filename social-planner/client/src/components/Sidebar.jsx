import { NavLink } from "react-router-dom";
import { useEffect, useState } from "react";
import { getAccounts } from "../api";

export default function Sidebar() {
  const [accounts, setAccounts] = useState([]);

  useEffect(() => {
    getAccounts()
      .then(setAccounts)
      .catch(console.error);
  }, []);

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <div className="sidebar-title">Social Planner</div>
        <div className="sidebar-subtitle">Text-only content calendar</div>
      </div>

      <nav className="nav-section">
        <div className="nav-label">Main</div>
        <ul className="nav-list">
          <li className="nav-item">
            <NavLink
              to="/"
              className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}
            >
              Dashboard
            </NavLink>
          </li>
          <li className="nav-item">
            <NavLink
              to="/all-content"
              className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}
            >
              All Content
            </NavLink>
          </li>
          <li className="nav-item">
            <NavLink
              to="/calendar"
              className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}
            >
              Calendar
            </NavLink>
          </li>
        </ul>
      </nav>

      <nav className="nav-section">
        <div className="nav-label">Accounts</div>
        <ul className="nav-list">
          {accounts.map((account) => (
            <li key={account._id} className="nav-item">
              <NavLink
                to={`/accounts/${account._id}`}
                className={({ isActive }) =>
                  isActive ? "nav-link active" : "nav-link"
                }
              >
                <span className="account-link">
                  <span
                    className="account-color"
                    style={{ backgroundColor: account.color }}
                  />
                  <span className="account-name">
                    {account.name}
                  </span>
                </span>
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
}