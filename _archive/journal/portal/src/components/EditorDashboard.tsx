import React, { useEffect, useState } from "react";
import { collection, query, onSnapshot, doc, updateDoc, addDoc, where, getDocs } from "firebase/firestore";
import { db } from "../services/firebase";
import { FileText, Users, Send, X, MessageSquare } from "lucide-react";

interface Submission {
  id: string;
  title: string;
  authorId: string;
  status: string;
  createdAt: string;
  fileUrl: string;
}

const EditorDashboard: React.FC = () => {
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [selectedSub, setSelectedSub] = useState<Submission | null>(null);
  const [reviewerEmail, setReviewerEmail] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const q = query(collection(db, "submissions"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setSubmissions(snapshot.docs.map(d => ({ id: d.id, ...d.data() } as Submission)));
    });
    return unsubscribe;
  }, []);

  const handleUpdateStatus = async (id: string, newStatus: string) => {
    await updateDoc(doc(db, "submissions", id), { 
      status: newStatus,
      updatedAt: new Date().toISOString() 
    });
  };

  const assignReviewer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSub || !reviewerEmail) return;

    setLoading(true);
    try {
      // Find user with this email
      const uq = query(collection(db, "users"), where("email", "==", reviewerEmail));
      const uSnap = await getDocs(uq);
      
      if (uSnap.empty) {
        alert("User not found. They must register first.");
        return;
      }

      const reviewerUid = uSnap.docs[0].id;
      
      // Update role to reviewer if they are currently an author
      if (uSnap.docs[0].data().role === "author") {
        await updateDoc(doc(db, "users", reviewerUid), { role: "reviewer" });
      }

      // Create assignment
      await addDoc(collection(db, "assignments"), {
        submissionId: selectedSub.id,
        reviewerId: reviewerUid,
        reviewerEmail: reviewerEmail,
        status: "pending",
        assignedAt: new Date().toISOString(),
      });

      await handleUpdateStatus(selectedSub.id, "under_review");
      
      alert("Reviewer assigned successfully.");
      setReviewerEmail("");
      setSelectedSub(null);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="dashboard-grid">
      <div className="submission-list glass-card">
        <div className="section-header">
          <h3>Recent Post Submissions</h3>
        </div>
        <table className="data-table">
          <thead>
            <tr>
              <th>Title</th>
              <th>Status</th>
              <th>Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {submissions.map(s => (
              <tr key={s.id}>
                <td className="title-cell">{s.title}</td>
                <td><span className={`status-badge status-${s.status}`}>{s.status}</span></td>
                <td>{new Date(s.createdAt).toLocaleDateString()}</td>
                <td>
                  <div className="action-btns">
                    <button onClick={() => setSelectedSub(s)} className="btn-icon" title="Manage Authors"><Users size={18} /></button>
                    <a href={s.fileUrl} target="_blank" className="btn-icon" title="Download Post draft"><FileText size={18} /></a>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {selectedSub && (
        <div className="management-panel glass-card">
          <div className="panel-header">
            <h3>Manage Post Submission</h3>
            <button onClick={() => setSelectedSub(null)} aria-label="Close" title="Close Panel"><X size={20}/></button>
          </div>
          <div className="sub-info">
            <p className="sub-title">{selectedSub.title}</p>
            <div className="status-ops">
              <button onClick={() => handleUpdateStatus(selectedSub.id, "info_requested")} className="btn btn-outline btn-sm">
                <MessageSquare size={16} /> Request Info
              </button>
              <button onClick={() => handleUpdateStatus(selectedSub.id, "declined")} className="btn btn-outline btn-sm text-error">
                <X size={16} /> Decline
              </button>
            </div>
          </div>
          
          <hr />
          
          <div className="assign-section">
            <h4>Invite/Assign Reviewer</h4>
            <form onSubmit={assignReviewer}>
              <div className="form-group">
                <input 
                  type="email" 
                  value={reviewerEmail} 
                  onChange={(e) => setReviewerEmail(e.target.value)}
                  placeholder="Reviewer's email address"
                  required
                />
              </div>
              <button type="submit" className="btn btn-primary w-100" disabled={loading}>
                <Send size={16} /> {loading ? "Assigning..." : "Assign Reviewer"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default EditorDashboard;
