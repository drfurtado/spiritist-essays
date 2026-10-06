import React, { useState } from "react";
import { collection, addDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { db, storage } from "../services/firebase";
import { useAuth } from "../contexts/AuthContext";
import { Upload, CheckCircle } from "lucide-react";

const NewSubmission: React.FC<{ onComplete: () => void }> = ({ onComplete }) => {
  const { user } = useAuth();
  const [title, setTitle] = useState("");
  const [abstract, setAbstract] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !file) return;

    setLoading(true);
    try {
      // 1. Upload File
      const fileRef = ref(storage, `Post drafts/${user.uid}/${Date.now()}_${file.name}`);
      const uploadResult = await uploadBytes(fileRef, file);
      const fileUrl = await getDownloadURL(uploadResult.ref);

      // 2. Create Submission Record
      await addDoc(collection(db, "submissions"), {
        authorId: user.uid,
        title,
        abstract,
        fileUrl,
        fileName: file.name,
        status: "submitted",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });

      setSuccess(true);
      setTimeout(onComplete, 2000);
    } catch (err) {
      console.error(err);
      alert("Error submitting. See console.");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="success-state">
        <CheckCircle size={64} color="var(--success)" />
        <h3>Post submission successful</h3>
        <p>Your Post draft has been sent to the editor-in-chief.</p>
      </div>
    );
  }

  return (
    <div className="portal-form glass-card p-4">
      <h3>New Post Submission</h3>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Post Title</label>
          <input 
            type="text" 
            value={title} 
            onChange={(e) => setTitle(e.target.value)} 
            required 
            placeholder="Enter the full title of your research"
          />
        </div>
        <div className="form-group">
          <label>Abstract</label>
          <textarea 
            rows={6} 
            value={abstract} 
            onChange={(e) => setAbstract(e.target.value)} 
            required 
            placeholder="Paste your abstract here (150-250 words)"
          />
        </div>
        <div className="form-group">
          <label>Post draft File (Blinded PDF or Word)</label>
          <div className="file-upload-zone">
            <input 
              type="file" 
              accept=".pdf,.doc,.docx" 
              onChange={(e) => setFile(e.target.files?.[0] || null)} 
              id="file-input"
              hidden
            />
            <label htmlFor="file-input" className="file-label">
              <Upload size={24} />
              {file ? file.name : "Click to select file"}
            </label>
          </div>
        </div>
        <div className="form-actions">
          <button type="button" onClick={onComplete} className="btn btn-outline" disabled={loading}>Cancel</button>
          <button type="submit" className="btn btn-primary" disabled={loading || !file}>
            {loading ? "Uploading..." : "Submit for Review"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default NewSubmission;
