import { useAuth } from "../context/AuthContext";


const Home = () => {
      const { user } = useAuth();
  return (
    <div>
            <h1>Welcome to the App!</h1>
            {user ? (
                <div>
                    <p>You are logged in as {user.email}.</p>
                    <p>Your roles: {user.roles.join(', ')}</p>
                </div>
            ) : (
                <p>You are not logged in.</p>
            )}
        </div>
  )
}

export default Home