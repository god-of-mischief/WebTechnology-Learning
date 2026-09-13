const statusColors = {
  "Idea": "#9ca3af",
  "Draft": "#3b82f6",
  "Ready": "#8b5cf6",
  "Scheduled": "#f59e0b",
  "Published": "#10b981",
  "Needs Changes": "#ef4444",
  "Cancelled": "#4b5563"
};

export default function StatusBadge({ status }) {
  const color = statusColors[status] || "#9ca3af";

  return (
    <span
      style={{
        display: "inline-block",
        padding: "4px 10px",
        borderRadius: "9999px",
        fontSize: "12px",
        fontWeight: 500,
        backgroundColor: color,
        color: "#ffffff"
      }}
    >
      {status}
    </span>
  );
}