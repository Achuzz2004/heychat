import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/hooks/useAuth";
import { Link, useNavigate } from "react-router-dom";
import { ThemeProvider } from "@/providers/theme-provider";

const Login = () => {
  const { login } = useAuth();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => { document.title = "Login — Chatter"; }, []);

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(username, password);
      navigate("/chats");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ThemeProvider>
      <div className="min-h-screen flex items-center justify-center p-4">
        <form onSubmit={onSubmit} className="w-full max-w-sm space-y-4 bg-card p-6 rounded-xl shadow-soft">
          <h1 className="text-2xl font-semibold">Log in</h1>
          <Input placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} />
          <Input placeholder="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
          <Button type="submit" disabled={loading} className="w-full">{loading ? "Loading..." : "Continue"}</Button>
          <p className="text-sm text-muted-foreground">No account? <Link to="/register" className="underline">Register</Link></p>
        </form>
      </div>
    </ThemeProvider>
  );
};

export default Login;
