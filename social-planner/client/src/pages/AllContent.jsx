import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getAccounts, getContent } from "../api";
import StatusBadge from "../components/StatusBadge";
import ListView from "../components/ListView";

export default function AllContent() {
  const [accounts, setAccounts] = useState([]);
  const [content, setContent] = useState([]);
  const [loading, setLoading] = useState(true);

  const [filterAccount, setFilterAccount] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterType, setFilterType] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    Promise.all([getAccounts(), getContent()])
      .then(([accountsData, contentData]) => {
        setAccounts(accountsData);
        setContent(contentData);
        setLoading(false);
      })
      .catch((error) => {
        console.error(error);
        setLoading(false);
      });
  }, []);

  const filteredContent = content.filter((item) => {
    if (filterAccount !== "all" && item.accountId !== filterAccount) {
      return false;
    }
    if (filterStatus !== "all" && item.status !== filterStatus) {
      return false;
    }
    if (filterType !== "all" && item.contentType !== filterType) {
      return false;
    }
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      const titleMatch = (item.title || "").toLowerCase().includes(query);
      const notesMatch = (item.notes || "").toLowerCase().includes(query);
      const captionMatch = (item.caption || "").toLowerCase().includes(query);
      if (!titleMatch && !notesMatch && !captionMatch) {
        return false;
      }
    }
    return true;
  });

  const contentTypes = [...new Set(content.map((c) => c.contentType))];

  if (loading) {
    return <div>Loading...</div>;
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
          All Content
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
          gap: "12px",
          alignItems: "center",
          marginBottom: "24px",
          flexWrap: "wrap"
        }}
      >
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search title, notes, caption..."
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

        <select
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
          style={{
            padding: "8px 12px",
            border: "1px solid #d1d5db",
            borderRadius: "6px",
            fontSize: "14px"
          }}
        >
          <option value="all">All Types</option>
          {contentTypes.map((type) => (
            <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
          gap: "20px",
          marginBottom: "32px"
        }}
      >
        <StatCard label="Total" value={content.length} />
        <StatCard label="Filtered" value={filteredContent.length} />
        <StatCard label="Drafts" value={content.filter((c) => c.status === "Draft").length} />
        <StatCard label="Scheduled" value={content.filter((c) => c.status === "Scheduled").length} />
        <StatCard label="Published" value={content.filter((c) => c.status === "Published").length} />
      </div>

      <ListView content={filteredContent} accounts={accounts} />
    </div>
  );
}

function StatCard({ label, value }) {
  return (
    <div
      style={{
        background: "#ffffff",
        border: "1px solid #e5e7eb",
        borderRadius: "8px",
        padding: "16px"
      }}
    >
      <div style={{ fontSize: "12px", color: "#6b7280", marginBottom: "8px" }}>
        {label}
      </div>
      <div style={{ fontSize: "28px", fontWeight: 700 }}>{value}</div>
    </div>
  );
}