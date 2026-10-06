import React, { useEffect, useState } from "react";
import { collection, query, where, onSnapshot, doc, addDoc, updateDoc, getDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { db, storage } from "../services/firebase";
import { useAuth } from "../contexts/AuthContext";
import { Download, Upload } from "lucide-react";
import type { Assignment, Submission } from "../types";

const ReviewerDashboard: React.FC = () => {
  const { user } = useAuth();
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [selectedAss, setSelectedAss] = useState<Assignment | null>(null);
  const [reviewFile, setReviewFile] = useState<File | null>(null);
  const [reviewText, setReviewText] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!user) return;
    const q = query(collection(db, "assignments"), where("reviewerId", "==", user.uid));
    const unsubscribe = onSnapshot(q, async (snapshot) => {
      const data = await Promise.all(snapshot.docs.map(async (d) => {
        const assignment = { id: d.id, ...d.data() } as Assignment;
        const subSnap = await getDoc(doc(db, "submissions", assignment.submissionId));
        return { ...assignment, submission: subSnap.exists() ? ({ id: subSnap.id, ...subSnap.data() } as Submission) : null };
      }));
      setAssignments(data);
    });
    return unsubscribe;
  }, [user]);

  const handleUploadReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAss || !reviewFile || !user) return;

    setLoading(true);
    try {
      // 1. Upload review file
      const fileRef = ref(storage, `reviews/${selectedAss.submissionId}/${user.uid}_${reviewFile.name}`);
      const uploadResult = await uploadBytes(fileRef, reviewFile);
      const fileUrl = await getDownloadURL(uploadResult.ref);

      // 2. Create review record
      await addDoc(collection(db, "reviews"), {
        submissionId: selectedAss.submissionId,
        reviewerId: user.uid,
        reviewText,
        fileUrl,
        fileName: reviewFile.name,
        createdAt: new Date().toISOString(),
      });

      // 3. Update assignment status
      await updateDoc(doc(db, "assignments", selectedAss.id), { status: "completed" });

      alert("Review submitted successfully.");
      setSelectedAss(null);
      setReviewFile(null);
      setReviewText("");
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="dashboard-grid">
      <div className="Post drafts-list glass-card">
        <div className="section-header">
          <h3>Assignments for Review</h3>
        </div>
        <div className="assignment-cards">
          {assignments.map(a => (
            <div key={a.id} className="assignment-item">
              <div className="item-info">
                <h4>{a.submission?.title || "Unknown Post"}</h4>
                <p>Assigned: {new Date(a.assignedAt).toLocaleDateString()}</p>
                <div className="badge-row">
                   <span className={`status-badge status-${a.status}`}>{a.status}</span>
                </div>
              </div>
              <div className="item-actions">
                <button onClick={() => setSelectedAss(a)} className="btn btn-primary btn-sm" disabled={a.status === "completed"}>
                  {a.status === "completed" ? "Completed" : "Review Post draft"}
                </button>
              </div>
            </div>
          ))}
          {assignments.length === 0 && <p className="empty-msg">No Post drafts assigned for review at this time.</p>}
        </div>
      </div>

      {selectedAss && (
        <div className="management-panel glass-card">
          <div className="panel-header">
            <h3>Review Post Submission</h3>
            <button onClick={() => setSelectedAss(null)} aria-label="Close">Close</button>
          </div>
          <div className="download-cta">
             <p>Step 1: Download the blinded Post draft for review.</p>
             <a href={selectedAss.submission?.fileUrl} target="_blank" className="btn btn-outline w-100">
               <Download size={18} /> Download Post draft
             </a>
          </div>
          
          <hr />
          
          <form onSubmit={handleUploadReview} className="review-form">
            <p>Step 2: Upload your review report and provide a summary.</p>
            <div className="form-group">
              <label htmlFor="review-text">Review Summary / Comments</label>
              <textarea 
                id="review-text"
                rows={4} 
                value={reviewText} 
                onChange={(e) => setReviewText(e.target.value)} 
                required 
                placeholder="Major findings, strengths, and weaknesses..."
              />
            </div>
            <div className="form-group">
               <label htmlFor="review-file">Review Report (PDF/Word)</label>
               <input 
                 id="review-file"
                 type="file" 
                 accept=".pdf,.doc,.docx" 
                 onChange={(e) => setReviewFile(e.target.files?.[0] || null)}
                 required
               />
            </div>
            <button type="submit" className="btn btn-primary w-100" disabled={loading}>
              <Upload size={18} /> {loading ? "Uploading..." : "Submit Review"}
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default ReviewerDashboard;
