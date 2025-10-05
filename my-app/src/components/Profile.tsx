import { useAuth0 } from '@auth0/auth0-react';

export const Profile = () => {
  const { user, isAuthenticated, isLoading } = useAuth0();

  if (isLoading) {
    return <div>Loading ...</div>;
  }

  if (!isAuthenticated || !user) {
    return null;
  }

  return (
    <div>
      <img src={user.picture} alt={user.name} />
      <h2 style={{ textAlign: "center" }}>{user.name}</h2>
    </div>
  );
};