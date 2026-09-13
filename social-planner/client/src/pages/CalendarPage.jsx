import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getAccounts, getContent } from "../api";
import StatusBadge from "../components/StatusBadge";

export default function CalendarPage() {
  const [accounts, setAccounts] = useState([]);
  const [content, setContent] = useState([]);
  const [currentMonth, setCurrentMonth] = useState(() => {
    const now = new Date();
    return {
      year: now.getFullYear(),
      month: now.getMonth()
    };
  });

  const [filterAccount, setFilterAccount] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    Promise.all([getAccounts(), getContent()])
      .then(([accountsData, contentData]) => {
        setAccounts(accountsData);
        setContent(contentData);
      })
      .catch(console.error);
  }, []);

    const filteredContent = content.filter((item) => {
    if (filterAccount !== "all" && item.accountId !== filterAccount) {
      return false;
    }
    if (filterStatus !== "all" && item.status !== filterStatus) {
      return false;
    }
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      const titleMatch = (item.title || "").toLowerCase().includes(query);
      const notesMatch = (item.notes || "").toLowerCase().includes(query);
      if (!titleMatch && !notesMatch) {
        return false;
      }
    }
    return true;
  });

  const daysInMonth = new Date(currentMonth.year, currentMonth.month + 1, 0).getDate();
  const firstDayOfMonth = new Date(currentMonth.year, currentMonth.month, 1).getDay();

  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  function normalizeDate(dateStr) {
    if (!dateStr) return "";
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return dateStr;
    const year = d.getFullYear();
    const month = d.getMonth() + 1;
    const day = d.getDate();
    return `${year}-${month}-${day}`;
  }

  const getContentForDate = (day) => {
    const targetDate = normalizeDate(`${currentMonth.year}-${currentMonth.month + 1}-${day}`);

    return filteredContent.filter((c) => {
      const contentDate = normalizeDate(c.scheduledDate);
      return contentDate === targetDate;
    });
  };

  const getAccountColor = (accountId) => {
    const account = accounts.find((a) => a._id === accountId);
    return account ? account.color : "#9ca3af";
  };

  const getAccountName = (accountId) => {
    const account = accounts.find((a) => a._id === accountId);
    return account ? account.name : "Unknown";
  };

  function goToPreviousMonth() {
    setCurrentMonth((prev) => {
      if (prev.month === 0) {
        return { year: prev.year - 1, month: 11 };
      }
      return { ...prev, month: prev.month - 1 };
    });
  }

  function goToNextMonth() {
    setCurrentMonth((prev) => {
      if (prev.month === 11) {
        return { year: prev.year + 1, month: 0 };
      }
      return { ...prev, month: prev.month + 1 };
    });
  }

  return (
    <div>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: "24px"
        }}
      >
        <h1 style={{ fontSize: "24px", fontWeight: 700 }}>
          Calendar
        </h1>
        <Link
          to="/content/new"
          style={{
            background: "#4f46e5",
            color: "#ffffff",
            padding: "10px 18px",
            borderRadius: "6px",
            textDecoration: "none",
            fontWeight: 500
          }}
        >
          Add Content
        </Link>
      </div>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: "16px"
        }}
      >
        <button
          onClick={goToPreviousMonth}
          style={{
            background: "#ffffff",
            border: "1px solid #d1d5db",
            padding: "8px 14px",
            borderRadius: "6px",
            cursor: "pointer"
          }}
        >
          Previous
        </button>
        <h2 style={{ fontSize: "18px", fontWeight: 600 }}>
          {monthNames[currentMonth.month]} {currentMonth.year}
        </h2>
        <button
          onClick={goToNextMonth}
          style={{
            background: "#ffffff",
            border: "1px solid #d1d5db",
            padding: "8px 14px",
            borderRadius: "6px",
            cursor: "pointer"
          }}
        >
          Next
        </button>
      </div>

      <div
        style={{
          display: "flex",
          gap: "12px",
          alignItems: "center",
          marginBottom: "16px",
          flexWrap: "wrap"
        }}
      >
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search title or notes..."
          style={{
            padding: "8px 12px",
            border: "1px solid #d1d5db",
            borderRadius: "6px",
            fontSize: "14px",
            width: "220px"
          }}
        />

        <select
          value={filterAccount}
          onChange={(e) => setFilterAccount(e.target.value)}
          style={{
            padding: "8px 12px",
            border: "1px solid #d1d5db",
            borderRadius: "6px",
            fontSize: "14px"
          }}
        >
          <option value="all">All Accounts</option>
          {accounts.map((account) => (
            <option key={account._id} value={account._id}>
              {account.name}
            </option>
          ))}
        </select>

        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          style={{
            padding: "8px 12px",
            border: "1px solid #d1d5db",
            borderRadius: "6px",
            fontSize: "14px"
          }}
        >
          <option value="all">All Statuses</option>
          <option value="Idea">Idea</option>
          <option value="Draft">Draft</option>
          <option value="Ready">Ready</option>
          <option value="Scheduled">Scheduled</option>
          <option value="Published">Published</option>
          <option value="Needs Changes">Needs Changes</option>
          <option value="Cancelled">Cancelled</option>
        </select>
      </div>

      <div
        style={{
          background: "#ffffff",
          border: "1px solid #e5e7eb",
          borderRadius: "12px",
          overflow: "hidden"
        }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(7, 1fr)",
            borderBottom: "1px solid #e5e7eb",
            background: "#f9fafb"
          }}
        >
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
            <div
              key={day}
              style={{
                padding: "12px",
                textAlign: "center",
                fontSize: "12px",
                fontWeight: 700,
                color: "#6b7280",
                textTransform: "uppercase",
                letterSpacing: "0.025em"
              }}
            >
              {day}
            </div>
          ))}
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(7, 1fr)"
          }}
        >
          {Array.from({ length: firstDayOfMonth }).map((_, index) => (
            <div
              key={`empty-${index}`}
              style={{
                minHeight: "120px",
                borderRight: "1px solid #e5e7eb",
                borderBottom: "1px solid #e5e7eb",
                background: "#fafafa"
              }}
            />
          ))}

          {Array.from({ length: daysInMonth }).map((_, index) => {
            const day = index + 1;
            const dayContent = getContentForDate(day);

            return (
              <div
                key={day}
                style={{
                  minHeight: "120px",
                  borderRight: "1px solid #e5e7eb",
                  borderBottom: "1px solid #e5e7eb",
                  padding: "8px",
                  background: "#ffffff"
                }}
              >
                <div
                  style={{
                    fontSize: "12px",
                    fontWeight: 600,
                    marginBottom: "6px",
                    color: "#374151"
                  }}
                >
                  {day}
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                  {dayContent.slice(0, 3).map((item) => (
                    <Link
                      key={item._id}
                      to={`/content/${item._id}/edit`}
                      style={{
                        display: "block",
                        padding: "6px 8px",
                        borderRadius: "4px",
                        background: "#f3f4f6",
                        fontSize: "11px",
                        textDecoration: "none",
                        color: "#111827",
                        borderLeft: `3px solid ${getAccountColor(item.accountId)}`
                      }}
                    >
                      <div style={{ fontWeight: 500, marginBottom: "2px" }}>
                        {item.title}
                      </div>
                      <div style={{ fontSize: "10px", color: "#6b7280" }}>
                        {getAccountName(item.accountId)} • {item.contentType}
                      </div>
                    </Link>
                  ))}
                  {dayContent.length > 3 && (
                    <div
                      style={{
                        fontSize: "10px",
                        color: "#6b7280",
                        paddingLeft: "4px"
                      }}
                    >
                      +{dayContent.length - 3} more
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}