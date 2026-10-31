import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createAccount } from "../api";

export default function ContentEditorPage() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    platform: "instagram",
    username: "",
    profileUrl: "",
    color: "#6366f1",
    notes: ""
  });

  const [saving, setSaving] = useState(false);

  function handleChange(event) {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();

    if (!formData.name.trim()) {
      alert("Account name is required");
      return;
    }

    setSaving(true);

    try {
      await createAccount(formData);
      navigate("/");
    } catch (error) {
      alert(error.message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div>
      <h1 style={{ marginBottom: "24px" }}>
        Create Account
      </h1>

      <form
        onSubmit={handleSubmit}
        style={{
          background: "#ffffff",
          border: "1px solid #e5e7eb",
          borderRadius: "12px",
          padding: "28px",
          maxWidth: "720px"
        }}
      >
        <div className="form-group">
          <label htmlFor="name">Account name</label>
          <input
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="For example: Loki Instagram"
          />
        </div>

        <div className="form-group">
          <label htmlFor="platform">Platform</label>
          <select
            id="platform"
            name="platform"
            value={formData.platform}
            onChange={handleChange}
          >
            <option value="instagram">Instagram</option>
            <option value="youtube">YouTube</option>
            <option value="quora">Quora</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="username">Username or channel name</label>
          <input
            id="username"
            name="username"
            value={formData.username}
            onChange={handleChange}
            placeholder="@username or channel name"
          />
        </div>

        <div className="form-group">
          <label htmlFor="profileUrl">Profile URL</label>
          <input
            id="profileUrl"
            name="profileUrl"
            type="url"
            value={formData.profileUrl}
            onChange={handleChange}
            placeholder="https://..."
          />
        </div>

        <div className="form-group">
          <label htmlFor="color">Account color</label>
          <input
            id="color"
            name="color"
            type="color"
            value={formData.color}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label htmlFor="notes">Notes</label>
          <textarea
            id="notes"
            name="notes"
            value={formData.notes}
            onChange={handleChange}
            rows="4"
            placeholder="Optional account notes"
          />
        </div>

        <div className="form-actions">
          <button
            className="primary-button"
            type="submit"
            disabled={saving}
          >
            {saving ? "Creating..." : "Create Account"}
          </button>

          <button
            className="secondary-button"
            type="button"
            onClick={() => navigate("/")}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}