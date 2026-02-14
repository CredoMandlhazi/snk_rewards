import { useState, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { Mail, ArrowLeft } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import logo from "@/assets/logo.png";

const VerifyOTP = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const email = (location.state as any)?.email || "";
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const handleChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    const newOtp = [...otp];
    for (let i = 0; i < pasted.length; i++) {
      newOtp[i] = pasted[i];
    }
    setOtp(newOtp);
    inputRefs.current[Math.min(pasted.length, 5)]?.focus();
  };

  const handleVerify = async () => {
    const token = otp.join("");
    if (token.length !== 6) {
      toast.error("Please enter the 6-digit code");
      return;
    }

    setLoading(true);
    const { error } = await supabase.auth.verifyOtp({
      email,
      token,
      type: "email",
    });
    setLoading(false);

    if (error) {
      toast.error(error.message);
    } else {
      toast.success("Email verified successfully!");
      navigate("/home");
    }
  };

  const handleResend = async () => {
    if (!email) {
      toast.error("No email address found. Please sign up again.");
      navigate("/signup");
      return;
    }
    setResending(true);
    const { error } = await supabase.auth.resend({
      type: "signup",
      email,
    });
    setResending(false);
    if (error) {
      toast.error(error.message);
    } else {
      toast.success("Verification email resent!");
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center px-6">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="w-full max-w-sm">
        <div className="flex justify-center mb-8">
          <img src={logo} alt="SNK Showroom" className="h-14 brightness-0 invert" />
        </div>

        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
            <Mail className="text-primary" size={28} />
          </div>
          <h1 className="text-2xl font-bold text-foreground">Verify Email</h1>
          <p className="text-sm text-muted-foreground mt-2">
            We sent a verification code to
          </p>
          <p className="text-sm text-foreground font-medium">{email || "your email"}</p>
        </div>

        <div className="flex justify-center gap-2.5 mb-8" onPaste={handlePaste}>
          {otp.map((digit, i) => (
            <input
              key={i}
              ref={(el) => { inputRefs.current[i] = el; }}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={digit}
              onChange={(e) => handleChange(i, e.target.value)}
              onKeyDown={(e) => handleKeyDown(i, e)}
              className="w-12 h-14 text-center text-xl font-bold bg-card border border-border rounded-xl text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
            />
          ))}
        </div>

        <button
          onClick={handleVerify}
          disabled={loading || otp.join("").length !== 6}
          className="w-full loyalty-gradient text-primary-foreground font-semibold py-3.5 rounded-xl transition-all hover:opacity-90 active:scale-[0.98] disabled:opacity-50"
        >
          {loading ? "Verifying..." : "Verify Email"}
        </button>

        <div className="text-center mt-6">
          <p className="text-sm text-muted-foreground">
            Didn't receive the code?{" "}
            <button
              onClick={handleResend}
              disabled={resending}
              className="text-primary font-semibold disabled:opacity-50"
            >
              {resending ? "Sending..." : "Resend"}
            </button>
          </p>
        </div>

        <button
          onClick={() => navigate("/")}
          className="flex items-center justify-center gap-2 mx-auto mt-6 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft size={16} /> Back to Sign In
        </button>
      </motion.div>
    </div>
  );
};

export default VerifyOTP;
