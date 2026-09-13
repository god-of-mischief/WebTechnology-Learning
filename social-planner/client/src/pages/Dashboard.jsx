import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getAccounts, getContent } from "../api";
import StatusBadge from "../components/StatusBadge";

export default function Dashboard() {
  
  const [accounts, setAccounts] = useState([]);
  const [content, setContent] = useState([]);
  const [loading, setLoading] = useState(true);

  const [filterAccount, setFilterAccount] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
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

  const upcomingContent = filteredContent
    .filter((item) => item.status !== "Published" && item.status !== "Cancelled")
    .sort((a, b) => {
      const dateA = a.scheduledDate || "";
      const dateB = b.scheduledDate || "";
      return dateA.localeCompare(dateB);
    })
    .slice(0, 8);

  const publishedContent = filteredContent
    .filter((item) => item.status === "Published")
    .sort((a, b) => {
      const dateA = a.scheduledDate || "";
      const dateB = b.scheduledDate || "";
      return dateB.localeCompare(dateA);
    })
    .slice(0, 5);

  const stats = {
    total: content.length,
    drafts: content.filter((c) => c.status === "Draft").length,
    scheduled: content.filter((c) => c.status === "Scheduled").length,
    published: content.filter((c) => c.status === "Published").length
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1 style={{ fontSize: "24px", fontWeight: 700, marginBottom: "24px" }}>
        Dashboard
      </h1>

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
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
          gap: "20px",
          marginBottom: "36px"
        }}
      >
        <StatCard label="Total Content" value={stats.total} />
        <StatCard label="Drafts" value={stats.drafts} />
        <StatCard label="Scheduled" value={stats.scheduled} />
        <StatCard label="Published" value={stats.published} />
      </div>

      {accounts.length === 0 ? (
        <EmptyState />
      ) : (
        <>
          <SectionTitle title="Upcoming Content" />
          {upcomingContent.length === 0 ? (
            <p style={{ color: "#6b7280", marginBottom: "24px" }}>
              No upcoming content. Create your first post.
            </p>
          ) : (
            <ContentList content={upcomingContent} accounts={accounts} />
          )}

          <SectionTitle title="Recently Published" />
          {publishedContent.length === 0 ? (
            <p style={{ color: "#6b7280", marginBottom: "24px" }}>
              No published content yet.
            </p>
          ) : (
            <ContentList content={publishedContent} accounts={accounts} />
          )}
        </>
      )}
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

function SectionTitle({ title }) {
  return (
    <h2
      style={{
        fontSize: "18px",
        fontWeight: 700,
        marginBottom: "14px",
        marginTop: "24px",
        letterSpacing: "-0.01em"
      }}
    >
      {title}
    </h2>
  );
}

function ContentList({ content, accounts }) {
  const getAccountName = (accountId) => {
    const account = accounts.find((a) => a._id === accountId);
    return account ? account.name : "Unknown";
  };

  const getAccountColor = (accountId) => {
    const account = accounts.find((a) => a._id === accountId);
    return account ? account.color : "#9ca3af";
  };

  return (
    <div
      style={{
        background: "#ffffff",
        border: "1px solid #e5e7eb",
        borderRadius: "8px",
        marginBottom: "24px"
      }}
    >
      {content.map((item) => (
        <div
          key={item._id}
          style={{
            padding: "14px 16px",
            borderBottom: "1px solid #e5e7eb",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "16px"
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "12px", flex: 1 }}>
            <span
              style={{
                width: "8px",
                height: "8px",
                borderRadius: "50%",
                backgroundColor: getAccountColor(item.accountId)
              }}
            />
            <div>
              <div style={{ fontWeight: 500, marginBottom: "4px" }}>
                {item.title}
              </div>
              <div style={{ fontSize: "12px", color: "#6b7280" }}>
                {getAccountName(item.accountId)} • {item.contentType}
                {item.scheduledDate && ` • ${item.scheduledDate}`}
              </div>
            </div>
          </div>
          <StatusBadge status={item.status} />
        </div>
      ))}
    </div>
  );
}

function EmptyState() {
  return (
    <div
      style={{
        background: "#ffffff",
        border: "1px solid #e5e7eb",
        borderRadius: "8px",
        padding: "32px",
        textAlign: "center"
      }}
    >
      <h3 style={{ fontSize: "18px", fontWeight: 600, marginBottom: "8px" }}>
        No accounts yet
      </h3>
      <p style={{ color: "#6b7280", marginBottom: "16px" }}>
        Create your first Instagram, YouTube, or Quora account to start planning content.
      </p>
      <Link
        to="/content/new"
        style={{
          display: "inline-block",
          background: "#4f46e5",
          color: "#ffffff",
          padding: "10px 18px",
          borderRadius: "6px",
          textDecoration: "none",
          fontWeight: 500
        }}
      >
        Create Account
      </Link>
    </div>
  );
}