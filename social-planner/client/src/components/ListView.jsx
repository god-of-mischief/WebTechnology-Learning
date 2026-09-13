import { Link } from "react-router-dom";
import StatusBadge from "./StatusBadge";

export default function ListView({ content, accounts }) {
  const getAccountName = (accountId) => {
    const account = accounts.find((a) => a._id === accountId);
    return account ? account.name : "Unknown";
  };

  const getAccountColor = (accountId) => {
    const account = accounts.find((a) => a._id === accountId);
    return account ? account.color : "#9ca3af";
  };

  if (content.length === 0) {
    return (
      <div
        style={{
          background: "#ffffff",
          border: "1px solid #e5e7eb",
          borderRadius: "8px",
          padding: "32px",
          textAlign: "center",
          color: "#6b7280"
        }}
      >
        No content found.
      </div>
    );
  }

  return (
    <div
      style={{
        background: "#ffffff",
        border: "1px solid #e5e7eb",
        borderRadius: "8px",
        overflow: "hidden"
      }}
    >
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "40px 1fr 140px 120px 120px 100px 80px",
          borderBottom: "1px solid #e5e7eb",
          background: "#f9fafb",
          fontSize: "12px",
          fontWeight: 600,
          color: "#6b7280"
        }}
      >
        <div style={{ padding: "12px 16px" }}></div>
        <div style={{ padding: "12px 16px" }}>Title</div>
        <div style={{ padding: "12px 16px" }}>Type</div>
        <div style={{ padding: "12px 16px" }}>Date</div>
        <div style={{ padding: "12px 16px" }}>Time</div>
        <div style={{ padding: "12px 16px" }}>Status</div>
        <div style={{ padding: "12px 16px" }}></div>
      </div>

      {content.map((item) => (
        <div
          key={item._id}
          style={{
            display: "grid",
            gridTemplateColumns: "40px 1fr 140px 120px 120px 100px 80px",
            borderBottom: "1px solid #e5e7eb",
            alignItems: "center",
            fontSize: "14px"
          }}
        >
          <div style={{ padding: "12px 16px" }}>
            <span
              style={{
                display: "inline-block",
                width: "8px",
                height: "8px",
                borderRadius: "50%",
                backgroundColor: getAccountColor(item.accountId)
              }}
            />
          </div>
          <div style={{ padding: "12px 16px", fontWeight: 500 }}>
            {item.title}
          </div>
          <div style={{ padding: "12px 16px", color: "#6b7280" }}>
            {item.contentType}
          </div>
          <div style={{ padding: "12px 16px", color: "#6b7280" }}>
            {item.scheduledDate || "-"}
          </div>
          <div style={{ padding: "12px 16px", color: "#6b7280" }}>
            {item.scheduledTime || "-"}
          </div>
          <div style={{ padding: "12px 16px" }}>
            <StatusBadge status={item.status} />
          </div>
          <div style={{ padding: "12px 16px", textAlign: "right" }}>
            <Link
              to={`/content/${item._id}/edit`}
              style={{
                color: "#4f46e5",
                textDecoration: "none",
                fontSize: "13px",
                fontWeight: 500
              }}
            >
              Edit
            </Link>
          </div>
        </div>
      ))}
    </div>
  );
}