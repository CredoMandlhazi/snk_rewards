import { ChevronLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

const TermsPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background pb-10">
      <div className="flex items-center gap-3 px-5 pt-6 pb-4 sticky top-0 bg-background/95 backdrop-blur-sm z-10">
        <button onClick={() => navigate(-1)} className="p-1"><ChevronLeft size={22} className="text-foreground" /></button>
        <h1 className="text-xl font-bold text-foreground">Terms & Conditions</h1>
      </div>

      <div className="px-5 space-y-6 text-sm text-muted-foreground leading-relaxed">
        <section>
          <h2 className="text-base font-semibold text-foreground mb-2">1. Introduction</h2>
          <p>Welcome to the SNK Showroom Loyalty Program. By creating an account and using this application, you agree to be bound by these Terms and Conditions. SNK Showroom reserves the right to amend these terms at any time.</p>
        </section>

        <section>
          <h2 className="text-base font-semibold text-foreground mb-2">2. Loyalty Program</h2>
          <p>The SNK Showroom Loyalty Program allows members to earn and redeem points on qualifying purchases made at any SNK Showroom store. Points are earned at the rate determined by your tier level. Points have no cash value and cannot be transferred between accounts.</p>
        </section>

        <section>
          <h2 className="text-base font-semibold text-foreground mb-2">3. Tier Membership</h2>
          <p>Members progress through tiers (Bronze, Silver, Gold, VIP) based on total points earned. Each tier provides increased benefits including higher discounts, early access to sales, and exclusive events. Tier status is reviewed annually.</p>
        </section>

        <section>
          <h2 className="text-base font-semibold text-foreground mb-2">4. Points & Rewards</h2>
          <p>Points are awarded when a valid barcode scan is completed at the point of sale. Points may take up to 24 hours to reflect in your account. SNK Showroom reserves the right to void points earned through fraudulent activity. Rewards can be redeemed once sufficient points have been accumulated.</p>
        </section>

        <section>
          <h2 className="text-base font-semibold text-foreground mb-2">5. Account Security</h2>
          <p>You are responsible for maintaining the confidentiality of your account credentials. Any activity under your account is your responsibility. Report any unauthorized access immediately via the app or by contacting support.</p>
        </section>

        <section>
          <h2 className="text-base font-semibold text-foreground mb-2">6. Privacy</h2>
          <p>SNK Showroom collects and processes personal data in accordance with the Protection of Personal Information Act (POPIA) of South Africa. Data collected includes your name, email, phone number, purchase history, and location data when using store finder features. This data is used solely for the operation of the loyalty program and to improve your shopping experience.</p>
        </section>

        <section>
          <h2 className="text-base font-semibold text-foreground mb-2">7. Account Deletion</h2>
          <p>You may request to delete your account at any time through the app settings. Upon deletion, all personal data, points balance, and purchase history will be permanently removed. This action cannot be undone.</p>
        </section>

        <section>
          <h2 className="text-base font-semibold text-foreground mb-2">8. Contact</h2>
          <p>For queries, email us at info@snkshowroom.co.za or visit any SNK Showroom location. Website: <a href="https://snkshowroom.co.za" className="text-primary underline" target="_blank" rel="noopener noreferrer">snkshowroom.co.za</a></p>
        </section>

        <p className="text-xs text-muted-foreground/60 pt-4">Last updated: February 2026</p>
      </div>
    </div>
  );
};

export default TermsPage;
