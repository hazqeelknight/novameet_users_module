import React from 'react';
import { Routes, Route } from 'react-router-dom';

// Lazy load all user module pages
const UsersOverview = React.lazy(() => import('./pages/UsersOverview'));
const ProfileSettings = React.lazy(() => import('./pages/ProfileSettings'));
const SecuritySettings = React.lazy(() => import('./pages/SecuritySettings'));
const InvitationsList = React.lazy(() => import('./pages/InvitationsList'));
const ActiveSessions = React.lazy(() => import('./pages/ActiveSessions'));
const AuditLogs = React.lazy(() => import('./pages/AuditLogs'));
const MFASettings = React.lazy(() => import('./pages/MFASettings'));
const RolesList = React.lazy(() => import('./pages/RolesList'));
const PermissionsList = React.lazy(() => import('./pages/PermissionsList'));
const PublicProfile = React.lazy(() => import('./pages/PublicProfile'));

// Authentication pages (public routes)
const VerifyEmail = React.lazy(() => import('./pages/VerifyEmail'));
const RequestPasswordReset = React.lazy(() => import('./pages/RequestPasswordReset'));
const ConfirmPasswordReset = React.lazy(() => import('./pages/ConfirmPasswordReset'));
const ChangePassword = React.lazy(() => import('./pages/ChangePassword'));
const RespondToInvitation = React.lazy(() => import('./pages/RespondToInvitation'));

const UsersRoutes: React.FC = () => {
  return (
    <Routes>
      {/* Main users module routes (protected) */}
      <Route index element={<UsersOverview />} />
      <Route path="profile" element={<ProfileSettings />} />
      <Route path="security" element={<SecuritySettings />} />
      <Route path="invitations" element={<InvitationsList />} />
      <Route path="sessions" element={<ActiveSessions />} />
      <Route path="audit-logs" element={<AuditLogs />} />
      <Route path="mfa" element={<MFASettings />} />
      <Route path="roles" element={<RolesList />} />
      <Route path="permissions" element={<PermissionsList />} />
      
      {/* Public profile route */}
      <Route path="public/:organizerSlug" element={<PublicProfile />} />
      
      {/* Authentication-related routes (these should be public) */}
      <Route path="verify-email" element={<VerifyEmail />} />
      <Route path="request-password-reset" element={<RequestPasswordReset />} />
      <Route path="confirm-password-reset" element={<ConfirmPasswordReset />} />
      <Route path="change-password" element={<ChangePassword />} />
      <Route path="invitation" element={<RespondToInvitation />} />
    </Routes>
  );
};

export default UsersRoutes;