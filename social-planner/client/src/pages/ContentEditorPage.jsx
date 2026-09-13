import { useEffect, useState } from "react";
import { useNavigate, useParams, useLocation, Link } from "react-router-dom";
import { getAccounts, createAccount, createContent, getContent, updateContent } from "../api";
import StatusBadge from "../components/StatusBadge";

export default function ContentEditorPage() {
  const { contentId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const preselectedAccountId = location.state?.preselectedAccountId;

  const [accounts, setAccounts] = useState([]);
  const [existingContent, setExistingContent] = useState(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState({
    accountId: preselectedAccountId || "",
    title: "",
    contentType: "Reel",
    caption: "",
    songName: "",
    hashtags: "",
    youtubeTitle: "",
    youtubeDescription: "",
    youtubeTags: "",
    quoraQuestion: "",
    quoraAnswer: "",
    scheduledDate: "",
    scheduledTime: "",
    status: "Draft",
    sourceType: "Original idea",
    sourceUrl: "",
    notes: "",
    publishedUrl: ""
  });

  useEffect(() => {
    getAccounts().then(setAccounts).catch(console.error);

    if (contentId) {
      setLoading(true);
      getContent({})
        .then((allContent) => {
          const found = allContent.find((c) => c._id === contentId);
          if (found) {
            setExistingContent(found);
            setFormData({
              accountId: found.accountId,
              title: found.title || "",
              contentType: found.contentType || "Reel",
              caption: found.caption || "",
              songName: found.songName || "",
              hashtags: found.hashtags || "",
              youtubeTitle: found.youtubeTitle || "",
              youtubeDescription: found.youtubeDescription || "",
              youtubeTags: found.youtubeTags || "",
              quoraQuestion: found.quoraQuestion || "",
              quoraAnswer: found.quoraAnswer || "",
              scheduledDate: found.scheduledDate || "",
              scheduledTime: found.scheduledTime || "",
              status: found.status || "Draft",
              sourceType: found.sourceType || "Original idea",
              sourceUrl: found.sourceUrl || "",
              notes: found.notes || "",
              publishedUrl: found.publishedUrl || ""
            });
          }
          setLoading(false);
        })
        .catch(() => setLoading(false));
    }
  }, [contentId]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.accountId || !formData.title || !formData.contentType) {
      alert("Account, title, and content type are required");
      return;
    }

    setSaving(true);

    try {
      if (contentId && existingContent) {
        await updateContent(contentId, formData);
      } else {
        await createContent(formData);
      }
      navigate("/");
    } catch (error) {
      alert(error.message);
    } finally {
      setSaving(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const selectedAccount = accounts.find((a) => a._id === formData.accountId);
  const platform = selectedAccount?.platform || "instagram";

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
          {contentId ? "Edit Content" : "Create Content"}
        </h1>
        <Link to="/" style={{ color: "#4f46e5", textDecoration: "none" }}>
          Back to Dashboard
        </Link>
      </div>

      <form
        onSubmit={handleSubmit}
        style={{
          background: "#ffffff",
          border: "1px solid #e5e7eb",
          borderRadius: "12px",
          padding: "28px"
        }}
      >
        <SectionTitle title="Basic Information" />

        <div style={{ marginBottom: "16px" }}>
          <label style={{ display: "block", marginBottom: "6px", fontWeight: 500 }}>
            Account
          </label>
          <select
            name="accountId"
            value={formData.accountId}
            onChange={handleChange}
            style={{
              width: "100%",
              padding: "10px 12px",
              border: "1px solid #d1d5db",
              borderRadius: "6px",
              fontSize: "14px"
            }}
          >
            <option value="">Select an account</option>
            {accounts.map((account) => (
              <option key={account._id} value={account._id}>
                {account.name} ({account.platform})
              </option>
            ))}
          </select>
        </div>

        <div style={{ marginBottom: "16px" }}>
          <label style={{ display: "block", marginBottom: "6px", fontWeight: 500 }}>
            Title
          </label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            style={{
              width: "100%",
              padding: "10px 12px",
              border: "1px solid #d1d5db",
              borderRadius: "6px",
              fontSize: "14px"
            }}
            placeholder="e.g., Three JavaScript mistakes"
          />
        </div>

        <div style={{ marginBottom: "16px" }}>
          <label style={{ display: "block", marginBottom: "6px", fontWeight: 500 }}>
            Content Type
          </label>
          <select
            name="contentType"
            value={formData.contentType}
            onChange={handleChange}
            style={{
              width: "100%",
              padding: "10px 12px",
              border: "1px solid #d1d5db",
              borderRadius: "6px",
              fontSize: "14px"
            }}
          >
            {platform === "instagram" && (
              <>
                <option>Reel</option>
                <option>Carousel</option>
                <option>Single Image</option>
                <option>Story</option>
              </>
            )}
            {platform === "youtube" && (
              <>
                <option>Video</option>
                <option>Short</option>
                <option>Community Post</option>
              </>
            )}
            {platform === "quora" && (
              <>
                <option>Answer</option>
                <option>Post</option>
              </>
            )}
          </select>
        </div>

        {platform === "instagram" && (
          <>
            <SectionTitle title="Instagram Details" />

            <div style={{ marginBottom: "16px" }}>
              <label style={{ display: "block", marginBottom: "6px", fontWeight: 500 }}>
                Caption
              </label>
              <textarea
                name="caption"
                value={formData.caption}
                onChange={handleChange}
                rows={4}
                style={{
                  width: "100%",
                  padding: "10px 12px",
                  border: "1px solid #d1d5db",
                  borderRadius: "6px",
                  fontSize: "14px",
                  resize: "vertical"
                }}
                placeholder="Write your caption here"
              />
              <div style={{ fontSize: "12px", color: "#6b7280", marginTop: "6px" }}>
                {formData.caption.length} characters
              </div>
            </div>

            <div style={{ marginBottom: "16px" }}>
              <label style={{ display: "block", marginBottom: "6px", fontWeight: 500 }}>
                Song Name
              </label>
              <input
                type="text"
                name="songName"
                value={formData.songName}
                onChange={handleChange}
                style={{
                  width: "100%",
                  padding: "10px 12px",
                  border: "1px solid #d1d5db",
                  borderRadius: "6px",
                  fontSize: "14px"
                }}
                placeholder="e.g., Calm background audio"
              />
            </div>

            <div style={{ marginBottom: "16px" }}>
              <label style={{ display: "block", marginBottom: "6px", fontWeight: 500 }}>
                Hashtags
              </label>
              <input
                type="text"
                name="hashtags"
                value={formData.hashtags}
                onChange={handleChange}
                style={{
                  width: "100%",
                  padding: "10px 12px",
                  border: "1px solid #d1d5db",
                  borderRadius: "6px",
                  fontSize: "14px"
                }}
                placeholder="#javascript #programming"
              />
            </div>
          </>
        )}

        {platform === "youtube" && (
          <>
            <SectionTitle title="YouTube Details" />

            <div style={{ marginBottom: "16px" }}>
              <label style={{ display: "block", marginBottom: "6px", fontWeight: 500 }}>
                Video Title
              </label>
              <input
                type="text"
                name="youtubeTitle"
                value={formData.youtubeTitle}
                onChange={handleChange}
                style={{
                  width: "100%",
                  padding: "10px 12px",
                  border: "1px solid #d1d5db",
                  borderRadius: "6px",
                  fontSize: "14px"
                }}
                placeholder="e.g., Learn JavaScript from Zero"
              />
            </div>

            <div style={{ marginBottom: "16px" }}>
              <label style={{ display: "block", marginBottom: "6px", fontWeight: 500 }}>
                Description
              </label>
              <textarea
                name="youtubeDescription"
                value={formData.youtubeDescription}
                onChange={handleChange}
                rows={4}
                style={{
                  width: "100%",
                  padding: "10px 12px",
                  border: "1px solid #d1d5db",
                  borderRadius: "6px",
                  fontSize: "14px",
                  resize: "vertical"
                }}
                placeholder="Video description"
              />
              <div style={{ fontSize: "12px", color: "#6b7280", marginTop: "6px" }}>
                {formData.youtubeDescription.length} characters
              </div>
            </div>

            <div style={{ marginBottom: "16px" }}>
              <label style={{ display: "block", marginBottom: "6px", fontWeight: 500 }}>
                Tags
              </label>
              <input
                type="text"
                name="youtubeTags"
                value={formData.youtubeTags}
                onChange={handleChange}
                style={{
                  width: "100%",
                  padding: "10px 12px",
                  border: "1px solid #d1d5db",
                  borderRadius: "6px",
                  fontSize: "14px"
                }}
                placeholder="javascript, programming, beginners"
              />
            </div>
          </>
        )}

        {platform === "quora" && (
          <>
            <SectionTitle title="Quora Details" />

            <div style={{ marginBottom: "16px" }}>
              <label style={{ display: "block", marginBottom: "6px", fontWeight: 500 }}>
                Question
              </label>
              <input
                type="text"
                name="quoraQuestion"
                value={formData.quoraQuestion}
                onChange={handleChange}
                style={{
                  width: "100%",
                  padding: "10px 12px",
                  border: "1px solid #d1d5db",
                  borderRadius: "6px",
                  fontSize: "14px"
                }}
                placeholder="e.g., How can I learn JavaScript efficiently?"
              />
            </div>

            <div style={{ marginBottom: "16px" }}>
              <label style={{ display: "block", marginBottom: "6px", fontWeight: 500 }}>
                Answer
              </label>
              <textarea
                name="quoraAnswer"
                value={formData.quoraAnswer}
                onChange={handleChange}
                rows={6}
                style={{
                  width: "100%",
                  padding: "10px 12px",
                  border: "1px solid #d1d5db",
                  borderRadius: "6px",
                  fontSize: "14px",
                  resize: "vertical"
                }}
                placeholder="Write your answer here"
              />
              <div style={{ fontSize: "12px", color: "#6b7280", marginTop: "6px" }}>
                {formData.quoraAnswer.length} characters
              </div>
            </div>
          </>
        )}

        <SectionTitle title="Scheduling & Status" />

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "16px",
            marginBottom: "16px"
          }}
        >
          <div>
            <label style={{ display: "block", marginBottom: "6px", fontWeight: 500 }}>
              Scheduled Date
            </label>
            <input
              type="date"
              name="scheduledDate"
              value={formData.scheduledDate}
              onChange={handleChange}
              style={{
                width: "100%",
                padding: "10px 12px",
                border: "1px solid #d1d5db",
                borderRadius: "6px",
                fontSize: "14px"
              }}
            />
          </div>

          <div>
            <label style={{ display: "block", marginBottom: "6px", fontWeight: 500 }}>
              Scheduled Time
            </label>
            <input
              type="time"
              name="scheduledTime"
              value={formData.scheduledTime}
              onChange={handleChange}
              style={{
                width: "100%",
                padding: "10px 12px",
                border: "1px solid #d1d5db",
                borderRadius: "6px",
                fontSize: "14px"
              }}
            />
          </div>
        </div>

        <div style={{ marginBottom: "16px" }}>
          <label style={{ display: "block", marginBottom: "6px", fontWeight: 500 }}>
            Status
          </label>
          <select
            name="status"
            value={formData.status}
            onChange={handleChange}
            style={{
              width: "100%",
              padding: "10px 12px",
              border: "1px solid #d1d5db",
              borderRadius: "6px",
              fontSize: "14px"
            }}
          >
            <option>Idea</option>
            <option>Draft</option>
            <option>Ready</option>
            <option>Scheduled</option>
            <option>Published</option>
            <option>Needs Changes</option>
            <option>Cancelled</option>
          </select>
        </div>

        <SectionTitle title="Source & Notes" />

        <div style={{ marginBottom: "16px" }}>
          <label style={{ display: "block", marginBottom: "6px", fontWeight: 500 }}>
            Source Type
          </label>
          <select
            name="sourceType"
            value={formData.sourceType}
            onChange={handleChange}
            style={{
              width: "100%",
              padding: "10px 12px",
              border: "1px solid #d1d5db",
              borderRadius: "6px",
              fontSize: "14px"
            }}
          >
            <option>Original idea</option>
            <option>YouTube</option>
            <option>Instagram</option>
            <option>Quora</option>
            <option>Book</option>
            <option>Article</option>
            <option>Comment</option>
            <option>Question</option>
            <option>Trend</option>
            <option>Other</option>
          </select>
        </div>

        <div style={{ marginBottom: "16px" }}>
          <label style={{ display: "block", marginBottom: "6px", fontWeight: 500 }}>
            Source URL
          </label>
          <input
            type="url"
            name="sourceUrl"
            value={formData.sourceUrl}
            onChange={handleChange}
            style={{
              width: "100%",
              padding: "10px 12px",
              border: "1px solid #d1d5db",
              borderRadius: "6px",
              fontSize: "14px"
            }}
            placeholder="https://..."
          />
        </div>

        <div style={{ marginBottom: "16px" }}>
          <label style={{ display: "block", marginBottom: "6px", fontWeight: 500 }}>
            Notes
          </label>
          <textarea
            name="notes"
            value={formData.notes}
            onChange={handleChange}
            rows={3}
            style={{
              width: "100%",
              padding: "10px 12px",
              border: "1px solid #d1d5db",
              borderRadius: "6px",
              fontSize: "14px",
              resize: "vertical"
            }}
            placeholder="Optional notes"
          />
        </div>

        <div style={{ marginBottom: "20px" }}>
          <label style={{ display: "block", marginBottom: "6px", fontWeight: 500 }}>
            Published URL
          </label>
          <input
            type="url"
            name="publishedUrl"
            value={formData.publishedUrl}
            onChange={handleChange}
            style={{
              width: "100%",
              padding: "10px 12px",
              border: "1px solid #d1d5db",
              borderRadius: "6px",
              fontSize: "14px"
            }}
            placeholder="https://instagram.com/p/..."
          />
        </div>

        <div
          style={{
            display: "flex",
            gap: "12px",
            borderTop: "1px solid #e5e7eb",
            paddingTop: "20px"
          }}
        >
          <button
            type="submit"
            disabled={saving}
            style={{
              background: saving ? "#93c5fd" : "#4f46e5",
              color: "#ffffff",
              border: "none",
              padding: "10px 18px",
              borderRadius: "6px",
              fontWeight: 500,
              cursor: saving ? "not-allowed" : "pointer"
            }}
          >
            {saving ? "Saving..." : contentId ? "Save Changes" : "Create Content"}
          </button>
          <button
            type="button"
            onClick={() => navigate("/")}
            style={{
              background: "#ffffff",
              color: "#374151",
              border: "1px solid #d1d5db",
              padding: "10px 18px",
              borderRadius: "6px",
              fontWeight: 500,
              cursor: "pointer"
            }}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}

function SectionTitle({ title }) {
  return (
    <h3
      style={{
        fontSize: "16px",
        fontWeight: 700,
        marginBottom: "14px",
        marginTop: "28px",
        color: "#111827",
        letterSpacing: "-0.01em"
      }}
    >
      {title}
    </h3>
  );
}