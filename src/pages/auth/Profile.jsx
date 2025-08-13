import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { api } from "@/services/api";
import { useNavigate } from "react-router-dom";
import { ThemeProvider } from "@/providers/theme-provider";

const Profile = () => {
  const [username, setUsername] = useState("");
  const [about, setAbout] = useState("");
  const [avatar, setAvatar] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => { document.title = "Profile — Chatter"; }, []);

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const form = new FormData();
      form.append("username", username);
      form.append("about", about);
      if (avatar) form.append("avatar", avatar);
      await api("/api/auth/profile/", "POST", form);
      navigate("/chats");
    } finally { setLoading(false); }
  };

  return (
    <ThemeProvider>
      <div className="min-h-screen flex items-center justify-center p-4">
        <form onSubmit={onSubmit} className="w-full max-w-md space-y-4 bg-card p-6 rounded-xl shadow-soft">
          <h1 className="text-2xl font-semibold">Set up your profile</h1>
          <Input placeholder="Display name" value={username} onChange={(e) => setUsername(e.target.value)} />
          <Textarea placeholder="About" value={about} onChange={(e) => setAbout(e.target.value)} />
          <Input type="file" accept="image/*" onChange={(e) => setAvatar(e.target.files?.[0] || null)} />
          <Button type="submit" disabled={loading} className="w-full">Save</Button>
        </form>
      </div>
    </ThemeProvider>
  );
};

export default Profile;
