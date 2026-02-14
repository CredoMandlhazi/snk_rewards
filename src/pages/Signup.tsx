import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Mail, Lock, Eye, EyeOff, User, Phone } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable/index";
import { toast } from "sonner";
import logo from "@/assets/logo.png";

const Signup = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: "",
    surname: "",
    email: "",
    phone: "",
    password: "",
  });

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.surname || !form.email || !form.phone || !form.password) {
      toast.error("Please fill in all fields");
      return;
    }
    if (form.password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    setLoading(true);
    const { error } = await supabase.auth.signUp({
      email: form.email,
      password: form.password,
      options: {
        emailRedirectTo: window.location.origin,
        data: {
          name: form.name,
          surname: form.surname,
          phone: form.phone,
        },
      },
    });

    setLoading(false);
    if (error) {
      toast.error(error.message);
    } else {
      toast.success("Check your email for a verification link!");
      navigate("/verify", { state: { email: form.email } });
    }
  };

  const handleOAuthSignup = async (provider: "google" | "apple") => {
    const { error } = await lovable.auth.signInWithOAuth(provider, {
      redirect_uri: window.location.origin,
    });
    if (error) toast.error(error.message);
  };

  const update = (field: string) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm({ ...form, [field]: e.target.value });

  const inputClass = "w-full bg-card border border-border rounded-xl pl-12 pr-4 py-3.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all";

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center px-6">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="w-full max-w-sm">
        <div className="flex justify-center mb-8">
          <img src={logo} alt="SNK Showroom" className="h-14 brightness-0 invert" />
        </div>
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-foreground">Create Account</h1>
          <p className="text-sm text-muted-foreground mt-1">Join the SNK loyalty program</p>
        </div>

        <form onSubmit={handleSignup} className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div className="relative">
              <User size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input type="text" placeholder="Name" value={form.name} onChange={update("name")} className={inputClass} />
            </div>
            <div className="relative">
              <User size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input type="text" placeholder="Surname" value={form.surname} onChange={update("surname")} className={inputClass} />
            </div>
          </div>
          <div className="relative">
            <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input type="email" placeholder="Email address" value={form.email} onChange={update("email")} className={inputClass} />
          </div>
          <div className="relative">
            <Phone size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input type="tel" placeholder="Phone number" value={form.phone} onChange={update("phone")} className={inputClass} />
          </div>
          <div className="relative">
            <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password (min 6 characters)"
              value={form.password}
              onChange={update("password")}
              className="w-full bg-card border border-border rounded-xl pl-12 pr-12 py-3.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
            />
            <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground">
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          <button type="submit" disabled={loading} className="w-full loyalty-gradient text-primary-foreground font-semibold py-3.5 rounded-xl transition-all hover:opacity-90 active:scale-[0.98] disabled:opacity-50">
            {loading ? "Creating Account..." : "Create Account"}
          </button>
        </form>

        <div className="flex items-center gap-3 my-5">
          <div className="flex-1 h-px bg-border" />
          <span className="text-xs text-muted-foreground">or continue with</span>
          <div className="flex-1 h-px bg-border" />
        </div>

        <div className="flex gap-3">
          <button onClick={() => handleOAuthSignup("google")} className="flex-1 flex items-center justify-center gap-2 bg-card border border-border rounded-xl py-3 hover:bg-secondary transition-colors">
            <svg className="w-5 h-5" viewBox="0 0 24 24"><path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"/><path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
            <span className="text-sm font-medium text-foreground">Google</span>
          </button>
          <button onClick={() => handleOAuthSignup("apple")} className="flex-1 flex items-center justify-center gap-2 bg-card border border-border rounded-xl py-3 hover:bg-secondary transition-colors">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/></svg>
            <span className="text-sm font-medium text-foreground">Apple</span>
          </button>
        </div>

        <p className="text-center mt-6 text-sm text-muted-foreground">
          Already have an account?{" "}
          <button onClick={() => navigate("/")} className="text-primary font-semibold">Sign In</button>
        </p>
      </motion.div>
    </div>
  );
};

export default Signup;
