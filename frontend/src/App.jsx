import { useState, useEffect } from "react";
import axios from "axios";

function App() {
  const [logs, setLogs] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [severity, setSeverity] = useState("");
  const [status, setStatus] = useState("");
  const [sort, setSort] = useState("timestamp");
  const [order, setOrder] = useState("desc");
  const [uploading, setUploading] = useState(false);
const [uploadMsg, setUploadMsg] = useState("");

const handleFileUpload = async (e) => {
  const file = e.target.files[0];
  if (!file) return;
  setUploading(true);
  setUploadMsg("");
  try {
    const text = await file.text();
    const json = JSON.parse(text);
    const res = await axios.post("http://localhost:5000/api/logs/upload", json);
    setUploadMsg(`✅ ${res.data.message}`);
    fetchLogs();
  } catch (err) {
    setUploadMsg("❌ Upload failed!");
  }
  setUploading(false);
};

  const fetchLogs = async () => {
    setLoading(true);
    try {
      const res = await axios.get("http://localhost:5000/api/logs", {
        params: { page, limit, search, severity, status, sort, order },
      });
      setLogs(res.data.logs);
      setTotal(res.data.total);
    } catch (err) {
      console.error("Error fetching logs:", err.message);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchLogs();
  }, [page, search, severity, status, sort, order]);

  const handleSort = (field) => {
    if (sort === field) {
      setOrder(order === "asc" ? "desc" : "asc");
    } else {
      setSort(field);
      setOrder("asc");
    }
    setPage(1);
  };

  const totalPages = Math.ceil(total / limit) || 1;

  return (
    <div style={{ padding: "20px", fontFamily: "Arial", background: "#241a2e", minHeight: "100vh", color: "white" }}>
      <h1 style={{ textAlign: "center" }}>🔍 Audit Log Dashboard</h1>
      {/* Upload Section */}
<div style={{ marginBottom: "15px" }}>
  <input type="file" accept=".json" onChange={handleFileUpload} />
  {uploading && <span> Uploading...</span>}
  {uploadMsg && <span style={{ marginLeft: "10px" }}>{uploadMsg}</span>}
</div>

      {/* Filters */}
      <div style={{ display: "flex", gap: "10px", marginBottom: "15px", flexWrap: "wrap" }}>
        <input
          type="text"
          placeholder="Search actor, action, resource..."
          value={search}
          onChange={(e) => { setSearch(e.target.value); setPage(1); }}
          style={{ padding: "8px", minWidth: "250px", borderRadius: "5px", border: "none" }}
        />
        <select
          value={severity}
          onChange={(e) => { setSeverity(e.target.value); setPage(1); }}
          style={{ padding: "8px", borderRadius: "5px", border: "none" }}
        >
          <option value="">All Severity</option>
          <option value="LOW">LOW</option>
          <option value="MEDIUM">MEDIUM</option>
          <option value="HIGH">HIGH</option>
          <option value="CRITICAL">CRITICAL</option>
        </select>
        <select
          value={status}
          onChange={(e) => { setStatus(e.target.value); setPage(1); }}
          style={{ padding: "8px", borderRadius: "5px", border: "none" }}
        >
          <option value="">All Status</option>
          <option value="Resolved">Resolved</option>
          <option value="Unresolved">Unresolved</option>
        </select>
      </div>

      {loading ? <p>Loading...</p> : (
        <>
          <table border="1" cellPadding="8" style={{ borderCollapse: "collapse", width: "100%" }}>
            <thead style={{ background: "#16213e" }}>
              <tr>
                {[["actor","Actor"],["role","Role"],["action","Action"],["resource","Resource"],["severity","Severity"],["status","Status"],["region","Region"],["timestamp","Timestamp"]].map(([field, label]) => (
                  <th key={field} onClick={() => handleSort(field)} style={{ cursor: "pointer", padding: "10px" }}>
                    {label} {sort === field ? (order === "asc" ? "▲" : "▼") : "↕"}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {logs.map((log) => (
                <tr key={log._id} style={{ textAlign: "center" }}>
                  <td>{log.actor}</td>
                  <td>{log.role}</td>
                  <td>{log.action}</td>
                  <td>{log.resource}</td>
                  <td>{log.severity}</td>
                  <td>{log.status}</td>
                  <td>{log.region}</td>
                  <td>{new Date(log.timestamp).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <div style={{ marginTop: "15px", textAlign: "center" }}>
            <button disabled={page === 1} onClick={() => setPage(page - 1)}>Previous</button>
            <span style={{ margin: "0 15px" }}>Page {page} of {totalPages}</span>
            <button disabled={page >= totalPages} onClick={() => setPage(page + 1)}>Next</button>
          </div>
        </>
      )}
    </div>
  );
}

export default App;