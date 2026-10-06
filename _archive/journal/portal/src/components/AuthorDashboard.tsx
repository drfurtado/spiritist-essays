import React, { useEffect, useState } from "react";
import { collection, query, where, onSnapshot } from "firebase/firestore";
import { db } from "../services/firebase";
import { useAuth } from "../contexts/AuthContext";
import { PlusCircle, FileText, Clock, ExternalLink } from "lucide-react";
import NewSubmission from "./NewSubmission";
import type { Submission } from "../types";

const AuthorDashboard: React.FC = () => {
  const { user } = useAuth();
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [showNew, setShowNew] = useState(false);

  useEffect(() => {
    if (!user) return;
    const q = query(collection(db, "submissions"), where("authorId", "==", user.uid));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setSubmissions(snapshot.docs.map(d => ({ id: d.id, ...d.data() } as Submission)));
    });
    return unsubscribe;
  }, [user]);

  if (showNew) {
    return <NewSubmission onComplete={() => setShowNew(false)} />;
  }

  return (
    <div className="author-dashboard">
      <div className="dashboard-header">
        <div>
           <h2>My Post drafts</h2>
           <p>Track your submitted work and review progress.</p>
        </div>
        <button onClick={() => setShowNew(true)} className="btn btn-primary">
          <PlusCircle size={20} /> Submit New Post draft
        </button>
      </div>

      <div className="submission-grid">
        {submissions.map(s => (
          <div key={s.id} className="submission-card glass-card">
            <div className="card-status">
              <span className={`status-badge status-${s.status}`}>{s.status.replace('_', ' ')}</span>
            </div>
            <h4>{s.title}</h4>
            <p className="abstract-preview">{s.abstract.substring(0, 150)}...</p>
            <div className="card-footer">
              <span className="date"><Clock size={14} /> {new Date(s.createdAt).toLocaleDateString()}</span>
              <a href={s.fileUrl} target="_blank" className="btn-link"><ExternalLink size={14} /> View File</a>
            </div>
          </div>
        ))}
        {submissions.length === 0 && (
          <div className="empty-state">
            <FileText size={48} className="text-muted" />
            <p>You haven't submitted any Post drafts yet.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AuthorDashboard;
