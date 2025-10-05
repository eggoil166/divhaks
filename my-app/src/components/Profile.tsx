import { useAuth0 } from '@auth0/auth0-react';

export const Profile = () => {
  const { user, isAuthenticated, isLoading } = useAuth0();

  if (isLoading) {
    return <div className="text-sm">Loading ...</div>;
  }

  if (!isAuthenticated || !user) {
    return null;
  }

  return (
    <div className="flex items-center space-x-2">
      <img 
        src={user.picture} 
        alt={user.name}
        className="w-10 h-10 rounded-full object-cover border-2 border-[var(--secondary)]"
      />
      <h2 className="text-sm font-semibold hidden sm:block">{user.name}</h2>
    </div>
  );
};