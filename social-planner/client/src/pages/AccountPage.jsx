import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { getAccounts, getContent } from "../api";
import StatusBadge from "../components/StatusBadge";
import ListView from "../components/ListView";

export default function AccountPage() {
  const { accountId } = useParams();
  const [account, setAccount] = useState(null);
  const [content, setContent] = useState([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState("list");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterType, setFilterType] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    Promise.all([getAccounts(), getContent({ accountId })])
      .then(([accountsData, contentData]) => {
        const foundAccount = accountsData.find((a) => a._id === accountId);
        setAccount(foundAccount || null);
        setContent(contentData);
        setLoading(false);
      })
      .catch((error) => {
        console.error(error);
        setLoading(false);
      });
  }, [accountId]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!account) {
    return (
      <div>
        <h1 style={{ fontSize: "24px", fontWeight: 700, marginBottom: "24px" }}>
          Account not found
        </h1>
        <Link to="/" style={{ color: "#4f46e5", textDecoration: "none" }}>
          Go back to Dashboard
        </Link>
      </div>
    );
  }

  const filteredContent = content.filter((item) => {
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

  const upcoming = filteredContent
    .filter((c) => c.status !== "Published" && c.status !== "Cancelled")
    .sort((a, b) => (a.scheduledDate || "").localeCompare(b.scheduledDate || ""));

  const published = filteredContent
    .filter((c) => c.status === "Published")
    .sort((a, b) => (b.scheduledDate || "").localeCompare(a.scheduledDate || ""));

  const contentTypes = [...new Set(content.map((c) => c.contentType))];

  // ... rest of the component remains the same ...
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
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <span
            style={{
              width: "12px",
              height: "12px",
              borderRadius: "50%",
              backgroundColor: account.color
            }}
          />
          <h1 style={{ fontSize: "24px", fontWeight: 700 }}>
            {account.name}
          </h1>
        </div>
        <Link
          to="/content/new"
          state={{ preselectedAccountId: accountId }}
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
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
          gap: "20px",
          marginBottom: "32px"
        }}
      >
        <StatCard label="Total" value={content.length} />
        <StatCard label="Drafts" value={content.filter((c) => c.status === "Draft").length} />
        <StatCard label="Scheduled" value={content.filter((c) => c.status === "Scheduled").length} />
        <StatCard label="Published" value={content.filter((c) => c.status === "Published").length} />
      </div>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: "16px",
          flexWrap: "wrap",
          gap: "12px"
        }}
      >
        <div style={{ display: "flex", gap: "12px", alignItems: "center", flexWrap : "wrap" }}>
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
          
          <button
            onClick={() => setView("list")}
            style={{
              background: view === "list" ? "#4f46e5" : "#ffffff",
              color: view === "list" ? "#ffffff" : "#374151",
              border: "1px solid #d1d5db",
              padding: "8px 14px",
              borderRadius: "6px",
              fontWeight: 500,
              cursor: "pointer"
            }}
          >
            List
          </button>
          <button
            onClick={() => setView("cards")}
            style={{
              background: view === "cards" ? "#4f46e5" : "#ffffff",
              color: view === "cards" ? "#ffffff" : "#374151",
              border: "1px solid #d1d5db",
              padding: "8px 14px",
              borderRadius: "6px",
              fontWeight: 500,
              cursor: "pointer"
            }}
          >
            Cards
          </button>
        </div>

        <div style={{ display: "flex", gap: "12px", alignItems: "center", flexWrap: "wrap" }}>
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
      </div>

      {view === "list" ? (
        <ListView content={filteredContent} accounts={[account]} />
      ) : (
        <>
          <SectionTitle title="Upcoming Content" />
          {upcoming.length === 0 ? (
            <p style={{ color: "#6b7280", marginBottom: "24px" }}>
              No upcoming content for this account.
            </p>
          ) : (
            <ContentList content={upcoming} />
          )}

          <SectionTitle title="Published" />
          {published.length === 0 ? (
            <p style={{ color: "#6b7280", marginBottom: "24px" }}>
              No published content yet.
            </p>
          ) : (
            <ContentList content={published} />
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
        fontWeight: 600,
        marginBottom: "12px",
        marginTop: "24px"
      }}
    >
      {title}
    </h2>
  );
}

function ContentList({ content }) {
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
          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: 500, marginBottom: "4px" }}>
              {item.title}
            </div>
            <div style={{ fontSize: "12px", color: "#6b7280" }}>
              {item.contentType}
              {item.scheduledDate && ` • ${item.scheduledDate}`}
              {item.scheduledTime && ` at ${item.scheduledTime}`}
            </div>
          </div>
          <StatusBadge status={item.status} />
        </div>
      ))}
    </div>
  );
}