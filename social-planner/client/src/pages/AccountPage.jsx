import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { getAccounts, getContent, createAccount } from "../api";
import StatusBadge from "../components/StatusBadge";
import ListView from "../components/ListView";

const formInputStyle = {
  width: "100%",
  padding: "11px 12px",
  border: "1px solid #d1d5db",
  borderRadius: "8px",
  color: "#111827",
  fontSize: "14px",
  fontFamily: "inherit"
};

export default function AccountPage() {
  const { accountId } = useParams();
  const navigate = useNavigate();
  const [account, setAccount] = useState(null);
  const [content, setContent] = useState([]);
  const [loading, setLoading] = useState(true);
  const [accountForm, setAccountForm] = useState({
    name: "",
    platform: "instagram",
    username: "",
    profileUrl: "",
    color: "#6366f1",
    notes: "",
  });

  const [savingAccount, setSavingAccount] = useState(false);
  const [accountError, setAccountError] = useState("");
  const [view, setView] = useState("list");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterType, setFilterType] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const isCreateAccountPage = accountId === "new";

  useEffect(() => {
    if (isCreateAccountPage) {
      setLoading(false);
      return;
    }

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
  }, [accountId, isCreateAccountPage]);

  function handleAccountChange(event) {
    const { name, value } = event.target;

    setAccountForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  }

  async function handleAccountSubmit(event) {
    event.preventDefault();
    setAccountError("");

    if (!accountForm.name.trim()) {
      setAccountError("Account name is required.");
      return;
    }

    if (!accountForm.platform) {
      setAccountError("Please select a platform.");
      return;
    }

    setSavingAccount(true);

    try {
      await createAccount({
        ...accountForm,
        name: accountForm.name.trim(),
      });

      navigate("/");
    } catch (error) {
      setAccountError(error.message || "Failed to create account.");
    } finally {
      setSavingAccount(false);
    }
  }

  if (isCreateAccountPage) {
    return (
      <div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            marginBottom: "24px",
          }}
        >
          <div>
            <p
              style={{
                color: "#6366f1",
                fontSize: "12px",
                fontWeight: 700,
                textTransform: "uppercase",
                letterSpacing: "0.08em",
                marginBottom: "6px",
              }}
            >
              Accounts
            </p>

            <h1 style={{ fontSize: "28px", fontWeight: 800 }}>Add Account</h1>

            <p style={{ color: "#6b7280", marginTop: "8px" }}>
              Add an Instagram, YouTube, or Quora account.
            </p>
          </div>

          <Link
            to="/"
            style={{
              color: "#374151",
              border: "1px solid #d1d5db",
              borderRadius: "8px",
              padding: "10px 16px",
              textDecoration: "none",
              fontWeight: 600,
            }}
          >
            Cancel
          </Link>
        </div>

        <form
          onSubmit={handleAccountSubmit}
          style={{
            background: "#ffffff",
            border: "1px solid #e5e7eb",
            borderRadius: "12px",
            maxWidth: "720px",
            padding: "28px",
          }}
        >
          {accountError && (
            <div
              style={{
                background: "#fef2f2",
                border: "1px solid #fecaca",
                borderRadius: "8px",
                color: "#b91c1c",
                padding: "12px",
                marginBottom: "20px",
              }}
            >
              {accountError}
            </div>
          )}

          <div style={{ marginBottom: "20px" }}>
            <label
              htmlFor="account-name"
              style={{
                display: "block",
                fontWeight: 600,
                marginBottom: "8px",
              }}
            >
              Account name
            </label>

            <input
              id="account-name"
              name="name"
              value={accountForm.name}
              onChange={handleAccountChange}
              placeholder="For example: Loki Instagram"
              style={formInputStyle}
            />
          </div>

          <div style={{ marginBottom: "20px" }}>
            <label
              htmlFor="account-platform"
              style={{
                display: "block",
                fontWeight: 600,
                marginBottom: "8px",
              }}
            >
              Type of account
            </label>

            <select
              id="account-platform"
              name="platform"
              value={accountForm.platform}
              onChange={handleAccountChange}
              style={formInputStyle}
            >
              <option value="instagram">Instagram</option>
              <option value="youtube">YouTube</option>
              <option value="quora">Quora</option>
            </select>
          </div>

          <div style={{ marginBottom: "20px" }}>
            <label
              htmlFor="account-username"
              style={{
                display: "block",
                fontWeight: 600,
                marginBottom: "8px",
              }}
            >
              Username or channel name
            </label>

            <input
              id="account-username"
              name="username"
              value={accountForm.username}
              onChange={handleAccountChange}
              placeholder="@username or channel name"
              style={formInputStyle}
            />
          </div>

          <div style={{ marginBottom: "20px" }}>
            <label
              htmlFor="account-profile-url"
              style={{
                display: "block",
                fontWeight: 600,
                marginBottom: "8px",
              }}
            >
              Profile URL
            </label>

            <input
              id="account-profile-url"
              name="profileUrl"
              type="url"
              value={accountForm.profileUrl}
              onChange={handleAccountChange}
              placeholder="https://..."
              style={formInputStyle}
            />
          </div>

          <div style={{ marginBottom: "20px" }}>
            <label
              htmlFor="account-color"
              style={{
                display: "block",
                fontWeight: 600,
                marginBottom: "8px",
              }}
            >
              Account color
            </label>

            <input
              id="account-color"
              name="color"
              type="color"
              value={accountForm.color}
              onChange={handleAccountChange}
              style={{
                width: "80px",
                height: "42px",
                padding: "4px",
                cursor: "pointer",
              }}
            />
          </div>

          <div style={{ marginBottom: "24px" }}>
            <label
              htmlFor="account-notes"
              style={{
                display: "block",
                fontWeight: 600,
                marginBottom: "8px",
              }}
            >
              Notes
            </label>

            <textarea
              id="account-notes"
              name="notes"
              value={accountForm.notes}
              onChange={handleAccountChange}
              rows="4"
              placeholder="Optional notes about this account"
              style={{
                ...formInputStyle,
                resize: "vertical",
              }}
            />
          </div>

          <div
            style={{
              borderTop: "1px solid #e5e7eb",
              paddingTop: "20px",
              display: "flex",
              gap: "12px",
            }}
          >
            <button
              type="submit"
              disabled={savingAccount}
              style={{
                background: savingAccount ? "#a5b4fc" : "#4f46e5",
                color: "#ffffff",
                border: "none",
                borderRadius: "8px",
                padding: "10px 16px",
                fontWeight: 600,
                cursor: savingAccount ? "not-allowed" : "pointer",
              }}
            >
              {savingAccount ? "Creating..." : "Create Account"}
            </button>

            <Link
              to="/"
              style={{
                color: "#374151",
                border: "1px solid #d1d5db",
                borderRadius: "8px",
                padding: "10px 16px",
                textDecoration: "none",
                fontWeight: 600,
              }}
            >
              Cancel
            </Link>
          </div>
        </form>
      </div>
    );
  }

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
    .sort((a, b) =>
      (a.scheduledDate || "").localeCompare(b.scheduledDate || ""),
    );

  const published = filteredContent
    .filter((c) => c.status === "Published")
    .sort((a, b) =>
      (b.scheduledDate || "").localeCompare(a.scheduledDate || ""),
    );

  const contentTypes = [...new Set(content.map((c) => c.contentType))];

  // ... rest of the component remains the same ...
  return (
    <div>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: "24px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <span
            style={{
              width: "12px",
              height: "12px",
              borderRadius: "50%",
              backgroundColor: account.color,
            }}
          />
          <h1 style={{ fontSize: "24px", fontWeight: 700 }}>{account.name}</h1>
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
            fontWeight: 500,
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
          marginBottom: "32px",
        }}
      >
        <StatCard label="Total" value={content.length} />
        <StatCard
          label="Drafts"
          value={content.filter((c) => c.status === "Draft").length}
        />
        <StatCard
          label="Scheduled"
          value={content.filter((c) => c.status === "Scheduled").length}
        />
        <StatCard
          label="Published"
          value={content.filter((c) => c.status === "Published").length}
        />
      </div>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: "16px",
          flexWrap: "wrap",
          gap: "12px",
        }}
      >
        <div
          style={{
            display: "flex",
            gap: "12px",
            alignItems: "center",
            flexWrap: "wrap",
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
              width: "220px",
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
              cursor: "pointer",
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
              cursor: "pointer",
            }}
          >
            Cards
          </button>
        </div>

        <div
          style={{
            display: "flex",
            gap: "12px",
            alignItems: "center",
            flexWrap: "wrap",
          }}
        >
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            style={{
              padding: "8px 12px",
              border: "1px solid #d1d5db",
              borderRadius: "6px",
              fontSize: "14px",
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
              fontSize: "14px",
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
        padding: "16px",
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
        marginTop: "24px",
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
        marginBottom: "24px",
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
            gap: "16px",
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
