import { useState, useEffect } from "react";
import { supabase } from "./supabaseClient";

function AuditTrail() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  async function fetchAuditLogs() {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("recovery_audit")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      if (data) setLogs(data);
    } catch (error) {
      console.error("Error fetching audit logs:", error.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchAuditLogs();
  }, []);

  const formatDate = (dateString) => {
    if (!dateString) return "-";
    const date = new Date(dateString);
    return date.toLocaleString("en-IN", {
      day: "numeric",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: true,
    });
  };

  return (
    <div style={{ maxWidth: "1040px", margin: "0 auto" }}>
      {/* Header */}
      <div style={{ textAlign: "center", marginBottom: "28px" }}>
        <h1
          style={{
            fontSize: "24px",
            fontWeight: "800",
            color: "#0f172a",
            margin: "0 0 6px 0",
            letterSpacing: "-0.02em",
          }}
        >
          Recovery Audit Trail
        </h1>
        <p style={{ color: "#64748b", margin: "0 0 16px 0", fontSize: "14px" }}>
          Complete, immutable ledger of all agent interventions and merchant resolutions
        </p>
        <button
          onClick={fetchAuditLogs}
          disabled={loading}
          className="rf-action-secondary"
          style={{ cursor: "pointer" }}
        >
          {loading ? "Syncing..." : "↻ Refresh Ledger"}
        </button>
      </div>

      {/* Ledger Table */}
      <div className="rf-table-panel">
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            textAlign: "left",
            fontSize: "13px",
          }}
        >
          <thead>
            <tr
              style={{
                background: "#f9fafb",
                borderBottom: "1px solid #e5e7eb",
                color: "#6b7280",
                fontSize: "11px",
                textTransform: "uppercase",
                letterSpacing: "0.05em",
              }}
            >
              <th style={{ padding: "14px 20px", fontWeight: "600", width: "20%" }}>
                Timestamp
              </th>
              <th style={{ padding: "14px 20px", fontWeight: "600", width: "22%" }}>
                Event Type
              </th>
              <th style={{ padding: "14px 20px", fontWeight: "600" }}>
                Payload / Action Details
              </th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="3" className="rf-center-state">
                  Loading ledger records...
                </td>
              </tr>
            ) : logs.length === 0 ? (
              <tr>
                <td colSpan="3" className="rf-center-state">
                  No audit records logged yet.
                </td>
              </tr>
            ) : (
              logs.map((log) => {
                const isRecovered =
                  log.action === "MARKED_RECOVERED" || log.action === "RECOVERED";

                return (
                  <tr
                    key={log.id}
                    style={{
                      borderBottom: "1px solid #f3f4f6",
                      verticalAlign: "top",
                    }}
                  >
                    <td
                      style={{
                        padding: "16px 20px",
                        color: "#64748b",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {formatDate(log.created_at)}
                    </td>
                    <td style={{ padding: "16px 20px" }}>
                      <span
                        className={`rf-badge ${
                          isRecovered ? "badge-success" : "rf-chip-btn selected"
                        }`}
                        style={{
                          display: "inline-block",
                          fontSize: "11px",
                          letterSpacing: "0.03em",
                        }}
                      >
                        {isRecovered ? "RECOVERED" : "OUTREACH GENERATED"}
                      </span>
                    </td>
                    <td
                      style={{
                        padding: "16px 20px",
                        color: "#1f2937",
                        lineHeight: "1.55",
                        whiteSpace: "pre-line",
                      }}
                    >
                      {log.ai_message || log.action}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default AuditTrail;