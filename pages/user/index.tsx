import { AuthForm, useAuth } from 'features/authentication';
import React from 'react';

export default function UserDashboard() {
  const authState = useAuth();

  return authState.data?.isAuthenticated ? (
    <div>
      <h1 className="display">User Dashboard</h1>
    </div>
  ) : (
    <AuthForm />
  );
}
