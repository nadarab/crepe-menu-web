import { Navigate, useParams } from 'react-router-dom';
import { isValidAdminSecret } from '../../config/admin';

/**
 * Protected Admin Route Component
 * Only allows access if the URL contains a valid admin secret
 * 
 * Usage: /admin/{secret} - where {secret} must match VITE_ADMIN_SECRET
 */
interface ProtectedAdminRouteProps {
  children: React.ReactNode;
}

const ProtectedAdminRoute = ({ children }: ProtectedAdminRouteProps) => {
  const { secret } = useParams<{ secret: string }>();

  // Check if the secret in the URL is valid
  if (!secret || !isValidAdminSecret(secret)) {
    // Redirect to home if secret is invalid or missing
    return <Navigate to="/" replace />;
  }

  // Secret is valid, render the admin content
  return <>{children}</>;
};

export default ProtectedAdminRoute;

