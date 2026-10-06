import React from "react";
import { useAuth } from "../contexts/AuthContext";
import { signOut } from "firebase/auth";
import { auth } from "../services/firebase";
import AuthorDashboard from "../components/AuthorDashboard";
import EditorDashboard from "../components/EditorDashboard";
import ReviewerDashboard from "../components/ReviewerDashboard";
import { LogOut, User as UserIcon } from "lucide-react";
import "../styles/dashboard.css";

const Dashboard: React.FC = () => {
  const { userProfile, isAdmin, isReviewer } = useAuth();

  const handleSignOut = () => signOut(auth);

  return (
    <div className="dashboard-layout">
      <nav className="side-nav">
        <div className="nav-brand">
          <h1>Spiritist Inquiry</h1>
          <span>Portal</span>
        </div>
        
        <div className="nav-user">
          <div className="avatar">
            <UserIcon size={24} />
          </div>
          <div className="user-info">
            <p className="user-name">{userProfile?.name || "User"}</p>
            <p className="user-role">{userProfile?.role || "Author"}</p>
          </div>
        </div>

        <div className="nav-links">
          {/* We can add static links here if needed */}
        </div>

        <button onClick={handleSignOut} className="logout-btn">
          <LogOut size={18} /> Sign Out
        </button>
      </nav>

      <main className="main-content">
        <header className="content-header">
           <div className="breadcrumb">Dashboard / {userProfile?.role} View</div>
           <div className="system-status">System Operational</div>
        </header>

        <section className="dashboard-content">
          {isAdmin ? (
            <EditorDashboard />
          ) : isReviewer ? (
            <ReviewerDashboard />
          ) : (
            <AuthorDashboard />
          )}
        </section>
      </main>
    </div>
  );
};

export default Dashboard;
