'use client';

import React, { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { Phone, Mail, MapPin, ChevronDown, ChevronRight, ChevronLeft, Menu, X, Star, Upload, Check, FileText, Users, BarChart3, Calendar, CreditCard, Settings, Home, UtensilsCrossed, WashingMachine, ArrowRight, Clock, Shield, Truck, Award, Play, Pause, MessageCircle, Send, Download, Eye, Edit, Trash2, Filter, Search, Bell, TrendingUp, DollarSign, Target, PieChart, Plus, Minus, ExternalLink, Copy, AlertCircle, CheckCircle, XCircle, RefreshCw, Layers, Package, Grid, List, Move, MoreVertical, Image, HelpCircle, BookOpen, Globe, Zap, Heart, Building2, Wrench, Palette } from "lucide-react";

// ─── CONSTANTS ───
const COLORS = { navy: "#0B1F3A", blue: "#1E88E5", gray: "#F3F5F7", lime: "#A3E635", white: "#FFFFFF", dark: "#050E1A" };
const MODULES = [
  { id: "home", label: "Home Fitouts", icon: "home", tagline: "Move-in ready homes for builders", desc: "Complete furniture & appliance packages for 1BHK to 4BHK apartments. Basic, Premium & Luxury tiers.", color: "#1E88E5", img: "🏠" },
  { id: "restaurant", label: "Modular Restaurant", icon: "utensils", tagline: "Plug-and-play restaurant setups", desc: "Kitchen equipment, furniture, POS systems, branding kits. From cloud kitchens to fine dining.", color: "#F59E0B", img: "🍽️" },
  { id: "laundromat", label: "Laundromat", icon: "washing", tagline: "Turnkey laundry business kits", desc: "Commercial washers, dryers, POS, plumbing kits, signage. Complete business-in-a-box.", color: "#10B981", img: "🧺" },
];
const TIERS = ["Basic", "Premium", "Luxury"];
const BUDGETS = ["< ₹5L", "₹5–10L", "₹10–25L", "₹25–50L", "> ₹50L"];
const PIPELINE = ["New", "Qualified", "Site Visit", "Quote Sent", "Negotiation", "Closed-Won", "Closed-Lost", "On-Hold"];
const PIPELINE_COLORS = { New: "#6366F1", Qualified: "#1E88E5", "Site Visit": "#F59E0B", "Quote Sent": "#8B5CF6", Negotiation: "#EC4899", "Closed-Won": "#10B981", "Closed-Lost": "#EF4444", "On-Hold": "#6B7280" };

// ─── SAMPLE DATA ───
const SAMPLE_LEADS = [
  { id: 1, name: "Rajesh Patel", phone: "+91 98765 43210", email: "rajesh@buildcorp.in", company: "BuildCorp Developers", module_type: "home", project_city: "Ahmedabad", budget_range: "₹25–50L", unit_count: 48, area_sqft: 52000, status: "Qualified", score: 75, created_at: "2026-02-10", source: "website" },
  { id: 2, name: "Priya Sharma", phone: "+91 87654 32109", email: "priya@tastebud.co", company: "TasteBud Restaurants", module_type: "restaurant", project_city: "Mumbai", budget_range: "₹10–25L", unit_count: 1, area_sqft: 2400, status: "Quote Sent", score: 60, created_at: "2026-02-12", source: "referral" },
  { id: 3, name: "Amit Desai", phone: "+91 76543 21098", email: "amit@cleanwash.in", company: "CleanWash Co", module_type: "laundromat", project_city: "Pune", budget_range: "₹5–10L", unit_count: 1, area_sqft: 800, status: "New", score: 40, created_at: "2026-02-14", source: "website" },
  { id: 4, name: "Sneha Reddy", phone: "+91 65432 10987", email: "sneha@urbanliving.in", company: "Urban Living Pvt Ltd", module_type: "home", project_city: "Bangalore", budget_range: "> ₹50L", unit_count: 120, area_sqft: 150000, status: "Negotiation", score: 90, created_at: "2026-02-08", source: "cold outreach" },
  { id: 5, name: "Karan Mehta", phone: "+91 54321 09876", email: "karan@spiceroute.in", company: "Spice Route", module_type: "restaurant", project_city: "Delhi", budget_range: "₹5–10L", unit_count: 1, area_sqft: 1600, status: "Site Visit", score: 55, created_at: "2026-02-13", source: "website" },
];

const SAMPLE_QUOTATIONS = [
  { id: "QT-001", lead_name: "Rajesh Patel", module: "home", tier: "Premium", total: 3250000, status: "sent", version: 2, created: "2026-02-11" },
  { id: "QT-002", lead_name: "Priya Sharma", module: "restaurant", tier: "Basic", total: 1450000, status: "viewed", version: 1, created: "2026-02-13" },
  { id: "QT-003", lead_name: "Sneha Reddy", module: "home", tier: "Luxury", total: 8750000, status: "approved", version: 3, created: "2026-02-09" },
];

const TESTIMONIALS = [
  { name: "Vikram Joshi", role: "MD, Skyline Builders", quote: "HomeFit delivered 96 units in 45 days. Our buyers loved the move-in-ready experience. 30% faster sales closure.", rating: 5 },
  { name: "Anita Kulkarni", role: "Owner, Café Bloom", quote: "From empty shell to operational restaurant in 3 weeks. The modular kitchen setup was flawless.", rating: 5 },
  { name: "Rohit Agarwal", role: "Director, WashEasy Chain", quote: "We launched 4 laundromat locations using HomeFit's plug-and-play kits. Consistent quality every time.", rating: 5 },
];

const FAQS = [
  { q: "What areas do you currently serve?", a: "We currently operate across major cities in India including Mumbai, Pune, Bangalore, Hyderabad, Ahmedabad, Delhi NCR, and Chennai. We're rapidly expanding to Tier 2 cities." },
  { q: "What's included in a Home Fitout package?", a: "Each package includes furniture (beds, wardrobes, dining sets, sofa), appliances (AC, washing machine, refrigerator, TV, microwave), and optional soft furnishings. Exact items vary by tier (Basic/Premium/Luxury)." },
  { q: "How long does delivery and installation take?", a: "Standard delivery is 15-30 days from order confirmation. Bulk orders for builders (20+ units) follow a phased delivery schedule agreed during planning." },
  { q: "Do you offer customization?", a: "Yes! Our Package Builder lets you customize every item. Premium and Luxury tiers include design consultation and color/material choices." },
  { q: "What are the payment terms?", a: "We require 10-50% advance (configurable) via Razorpay. Balance is milestone-based: 40% on delivery, remaining on installation completion." },
  { q: "Do you handle warranty and after-sales?", a: "All products come with manufacturer warranty (1-5 years depending on item). We provide a consolidated warranty pack and single-point support." },
];

const PACKAGES_DATA = {
  home: {
    Basic: { price: "₹2.5L – ₹4L", items: ["Double Bed + Mattress", "3-Door Wardrobe", "Dining Table (4-seater)", "Sofa Set (3+1)", "Basic Kitchen Appliances", "LED TV 32\"", "Window AC (1)", "Curtains & Bedding"], color: "#6366F1" },
    Premium: { price: "₹4L – ₹8L", items: ["Queen Bed + Ortho Mattress", "Sliding Wardrobe", "6-Seater Dining", "L-Shape Sofa", "Full Kitchen Suite", "Smart TV 43\"", "Split AC (2)", "Washing Machine", "Refrigerator", "Modular Shoe Rack", "Soft Furnishings Pack"], color: "#1E88E5" },
    Luxury: { price: "₹8L – ₹15L+", items: ["King Bed + Premium Mattress", "Walk-in Wardrobe System", "8-Seater Italian Dining", "Sectional Sofa + Ottoman", "Premium Kitchen + Chimney + Hob", "Smart TV 55\" OLED", "Inverter AC (3)", "Front-Load Washer/Dryer", "French Door Refrigerator", "Study Desk + Chair", "Full Soft Furnishings", "Smart Home Starter Kit", "Design Consultation"], color: "#A3E635" },
  },
  restaurant: {
    Basic: { price: "₹5L – ₹10L", items: ["Commercial Gas Range (2 burner)", "Prep Tables (SS)", "Basic Refrigeration", "Exhaust System", "Dining Furniture (20 covers)", "POS Terminal", "Signage Kit"], color: "#6366F1" },
    Premium: { price: "₹10L – ₹25L", items: ["Commercial Range (4 burner)", "Tandoor/Oven", "Walk-in Cooler", "Exhaust + Fire Suppression", "Dining for 40 covers", "Bar Counter", "POS + KDS System", "Branded Crockery Set", "Interior Styling Pack"], color: "#F59E0B" },
    Luxury: { price: "₹25L – ₹50L+", items: ["Full Commercial Kitchen Line", "Pizza Oven / Grill Station", "Cold Room + Display Fridges", "Full HVAC + Exhaust", "Fine Dining 60 covers", "Full Bar Setup", "Smart POS + Inventory", "Custom Interior Design", "Branding & Menu Design", "Outdoor Seating Pack"], color: "#A3E635" },
  },
  laundromat: {
    Basic: { price: "₹3L – ₹6L", items: ["2 Commercial Washers", "2 Commercial Dryers", "Folding Station", "Basic Plumbing Kit", "POS System", "Signage"], color: "#6366F1" },
    Premium: { price: "₹6L – ₹12L", items: ["4 Commercial Washers", "4 Commercial Dryers", "Ironing Station", "Full Plumbing + Drainage", "Smart POS + Loyalty", "Seating Area", "Vending Machine", "Digital Signage"], color: "#10B981" },
    Luxury: { price: "₹12L – ₹25L+", items: ["8 Commercial Washers (incl. front load)", "6 Dryers + Steam Press", "Full Dry Clean Unit", "Complete Plumbing + Water Recycler", "App-Based Management", "Lounge Seating", "Café Corner", "Premium Branding Pack", "Staff Training Kit"], color: "#A3E635" },
  },
};

// ─── UTILITY COMPONENTS ───
const Badge = ({ children, color = COLORS.blue, variant = "filled" }) => (
  <span style={{ display: "inline-flex", alignItems: "center", padding: "2px 10px", borderRadius: 20, fontSize: 11, fontWeight: 600, letterSpacing: 0.5, background: variant === "filled" ? color + "18" : "transparent", color, border: variant === "outline" ? `1px solid ${color}` : "none", textTransform: "uppercase" }}>{children}</span>
);

const Button = ({ children, variant = "primary", size = "md", onClick, style = {}, disabled, icon }) => {
  const base = { display: "inline-flex", alignItems: "center", gap: 8, border: "none", cursor: disabled ? "not-allowed" : "pointer", fontWeight: 600, fontFamily: "'Poppins', sans-serif", borderRadius: 10, transition: "all 0.2s", opacity: disabled ? 0.5 : 1 };
  const sizes = { sm: { padding: "8px 16px", fontSize: 13 }, md: { padding: "12px 24px", fontSize: 14 }, lg: { padding: "16px 32px", fontSize: 16 } };
  const variants = {
    primary: { background: `linear-gradient(135deg, ${COLORS.blue}, #1565C0)`, color: "#fff", boxShadow: "0 4px 15px #1E88E540" },
    lime: { background: `linear-gradient(135deg, ${COLORS.lime}, #84CC16)`, color: COLORS.navy, boxShadow: "0 4px 15px #A3E63540" },
    outline: { background: "transparent", color: COLORS.blue, border: `2px solid ${COLORS.blue}` },
    ghost: { background: "transparent", color: COLORS.navy },
    navy: { background: COLORS.navy, color: "#fff" },
    danger: { background: "#EF4444", color: "#fff" },
  };
  return <button onClick={onClick} disabled={disabled} style={{ ...base, ...sizes[size], ...variants[variant], ...style }}>{icon}{children}</button>;
};

const Card = ({ children, style = {}, hover = false, onClick }) => (
  <div onClick={onClick} style={{ background: "#fff", borderRadius: 16, padding: 24, boxShadow: "0 1px 3px rgba(0,0,0,0.06), 0 4px 20px rgba(0,0,0,0.04)", transition: "all 0.3s", cursor: onClick ? "pointer" : "default", ...style }}>{children}</div>
);

const Input = ({ label, type = "text", value, onChange, placeholder, required, style = {} }) => (
  <div style={{ marginBottom: 16, ...style }}>
    {label && <label style={{ display: "block", marginBottom: 6, fontSize: 13, fontWeight: 600, color: COLORS.navy, fontFamily: "'Poppins', sans-serif" }}>{label}{required && <span style={{ color: "#EF4444" }}> *</span>}</label>}
    <input type={type} value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} required={required} style={{ width: "100%", padding: "12px 16px", borderRadius: 10, border: "1.5px solid #E2E8F0", fontSize: 14, fontFamily: "'Lato', sans-serif", outline: "none", transition: "border 0.2s", boxSizing: "border-box", background: "#FAFBFC" }} onFocus={e => e.target.style.borderColor = COLORS.blue} onBlur={e => e.target.style.borderColor = "#E2E8F0"} />
  </div>
);

const Select = ({ label, value, onChange, options, required }) => (
  <div style={{ marginBottom: 16 }}>
    {label && <label style={{ display: "block", marginBottom: 6, fontSize: 13, fontWeight: 600, color: COLORS.navy, fontFamily: "'Poppins', sans-serif" }}>{label}{required && <span style={{ color: "#EF4444" }}> *</span>}</label>}
    <select value={value} onChange={e => onChange(e.target.value)} required={required} style={{ width: "100%", padding: "12px 16px", borderRadius: 10, border: "1.5px solid #E2E8F0", fontSize: 14, fontFamily: "'Lato', sans-serif", outline: "none", background: "#FAFBFC", appearance: "none", cursor: "pointer" }}>
      <option value="">Select...</option>
      {options.map(o => <option key={typeof o === "string" ? o : o.value} value={typeof o === "string" ? o : o.value}>{typeof o === "string" ? o : o.label}</option>)}
    </select>
  </div>
);

const Stat = ({ label, value, change, icon, color = COLORS.blue }) => (
  <Card style={{ display: "flex", alignItems: "center", gap: 16 }}>
    <div style={{ width: 48, height: 48, borderRadius: 12, background: color + "15", display: "flex", alignItems: "center", justifyContent: "center", color, flexShrink: 0 }}>{icon}</div>
    <div><div style={{ fontSize: 24, fontWeight: 700, color: COLORS.navy, fontFamily: "'Poppins', sans-serif" }}>{value}</div><div style={{ fontSize: 12, color: "#64748B" }}>{label}</div>{change && <div style={{ fontSize: 11, color: change > 0 ? "#10B981" : "#EF4444", fontWeight: 600 }}>{change > 0 ? "↑" : "↓"} {Math.abs(change)}%</div>}</div>
  </Card>
);

const ProgressBar = ({ value, max = 100, color = COLORS.blue, height = 6 }) => (
  <div style={{ background: "#E2E8F0", borderRadius: height, height, overflow: "hidden" }}>
    <div style={{ width: `${(value / max) * 100}%`, height: "100%", background: `linear-gradient(90deg, ${color}, ${color}CC)`, borderRadius: height, transition: "width 0.5s ease" }} />
  </div>
);

const TabBar = ({ tabs, active, onChange }) => (
  <div style={{ display: "flex", gap: 4, background: "#F1F5F9", borderRadius: 12, padding: 4, marginBottom: 20, overflowX: "auto" }}>
    {tabs.map(t => (
      <button key={t} onClick={() => onChange(t)} style={{ padding: "10px 20px", borderRadius: 10, border: "none", background: active === t ? "#fff" : "transparent", color: active === t ? COLORS.navy : "#64748B", fontWeight: active === t ? 700 : 500, fontSize: 13, cursor: "pointer", fontFamily: "'Poppins', sans-serif", boxShadow: active === t ? "0 1px 3px rgba(0,0,0,0.1)" : "none", transition: "all 0.2s", whiteSpace: "nowrap" }}>{t}</button>
    ))}
  </div>
);

// ─── LOGO ───
const Logo = ({ size = 32 }) => (
  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
    <svg width={size} height={size} viewBox="0 0 40 40" fill="none">
      <rect width="40" height="40" rx="10" fill={COLORS.navy} />
      <path d="M10 22L20 14L30 22" stroke={COLORS.blue} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      <rect x="14" y="22" width="12" height="8" rx="1" stroke={COLORS.lime} strokeWidth="2" />
      <circle cx="20" cy="26" r="1.5" fill={COLORS.blue} />
      <line x1="20" y1="8" x2="20" y2="11" stroke={COLORS.lime} strokeWidth="2" strokeLinecap="round" />
      <line x1="13" y1="10" x2="15" y2="12.5" stroke={COLORS.blue} strokeWidth="1.5" strokeLinecap="round" />
      <line x1="27" y1="10" x2="25" y2="12.5" stroke={COLORS.blue} strokeWidth="1.5" strokeLinecap="round" />
    </svg>
    <div style={{ lineHeight: 1.1 }}>
      <span style={{ fontFamily: "'Poppins', sans-serif", fontWeight: 800, fontSize: size * 0.5, color: COLORS.navy, letterSpacing: -0.5 }}>HomeFit</span>
      <span style={{ fontFamily: "'Poppins', sans-serif", fontWeight: 400, fontSize: size * 0.5, color: COLORS.blue, letterSpacing: -0.5 }}> Solutions</span>
    </div>
  </div>
);

// ─── MODULE ICON ───
const ModuleIcon = ({ type, size = 40 }) => {
  const icons = { home: <Home size={size * 0.5} />, restaurant: <UtensilsCrossed size={size * 0.5} />, laundromat: <WashingMachine size={size * 0.5} /> };
  const colors = { home: "#1E88E5", restaurant: "#F59E0B", laundromat: "#10B981" };
  return <div style={{ width: size, height: size, borderRadius: size * 0.3, background: (colors[type] || COLORS.blue) + "18", display: "flex", alignItems: "center", justifyContent: "center", color: colors[type] || COLORS.blue }}>{icons[type] || <Package size={size * 0.5} />}</div>;
};

// ─────────────────────────────────────────────
// HEADER
// ─────────────────────────────────────────────
const Header = ({ page, setPage, isAdmin, setIsAdmin }) => {
  const [mobileMenu, setMobileMenu] = useState(false);
  const [modulesOpen, setModulesOpen] = useState(false);
  const navItems = [
    { label: "Modules", key: "modules", dropdown: true },
    { label: "Packages", key: "packages" },
    { label: "Gallery", key: "gallery" },
    { label: "Resources", key: "resources" },
    { label: "Contact", key: "contact" },
  ];
  return (
    <header style={{ position: "sticky", top: 0, zIndex: 1000, background: "rgba(255,255,255,0.95)", backdropFilter: "blur(20px)", borderBottom: "1px solid #E2E8F030", padding: "0 24px" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between", height: 64 }}>
        <div onClick={() => { setPage("home"); setIsAdmin(false); }} style={{ cursor: "pointer" }}><Logo size={28} /></div>
        <nav style={{ display: "flex", alignItems: "center", gap: 8 }} className="desktop-nav">
          {navItems.map(item => (
            <div key={item.key} style={{ position: "relative" }} onMouseEnter={() => item.dropdown && setModulesOpen(true)} onMouseLeave={() => item.dropdown && setModulesOpen(false)}>
              <button onClick={() => !item.dropdown && setPage(item.key)} style={{ padding: "8px 14px", background: "none", border: "none", color: page === item.key ? COLORS.blue : COLORS.navy, fontWeight: 600, fontSize: 14, cursor: "pointer", fontFamily: "'Poppins', sans-serif", display: "flex", alignItems: "center", gap: 4 }}>
                {item.label}{item.dropdown && <ChevronDown size={14} />}
              </button>
              {item.dropdown && modulesOpen && (
                <div style={{ position: "absolute", top: "100%", left: 0, background: "#fff", borderRadius: 12, boxShadow: "0 10px 40px rgba(0,0,0,0.12)", padding: 8, minWidth: 220, zIndex: 100 }}>
                  {MODULES.map(m => (
                    <button key={m.id} onClick={() => { setPage(`module-${m.id}`); setModulesOpen(false); }} style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 14px", background: "none", border: "none", width: "100%", cursor: "pointer", borderRadius: 8, fontSize: 14, color: COLORS.navy, fontFamily: "'Lato', sans-serif" }}>
                      <ModuleIcon type={m.id} size={32} /> {m.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}
          <button onClick={() => setIsAdmin(!isAdmin)} style={{ padding: "6px 12px", background: "none", border: `1px solid #E2E8F0`, borderRadius: 8, color: "#64748B", fontSize: 12, cursor: "pointer", fontFamily: "'Poppins', sans-serif" }}>{isAdmin ? "← Public Site" : "Admin"}</button>
          <Button variant="lime" size="sm" onClick={() => setPage("builder")}>Get Quotation</Button>
        </nav>
        <button onClick={() => setMobileMenu(!mobileMenu)} style={{ display: "none", background: "none", border: "none", cursor: "pointer", color: COLORS.navy }} className="mobile-menu-btn">{mobileMenu ? <X size={24} /> : <Menu size={24} />}</button>
      </div>
      {mobileMenu && (
        <div style={{ position: "fixed", inset: 0, top: 64, background: "#fff", zIndex: 999, padding: 24, display: "flex", flexDirection: "column", gap: 8 }}>
          {[...navItems, { label: "Get Quotation", key: "builder" }, { label: isAdmin ? "← Public Site" : "Admin Panel", key: "admin-toggle" }].map(item => (
            <button key={item.key} onClick={() => { if (item.key === "admin-toggle") { setIsAdmin(!isAdmin); } else { setPage(item.key === "modules" ? "home" : item.key); } setMobileMenu(false); }} style={{ padding: 16, background: "none", border: "none", borderBottom: "1px solid #F1F5F9", textAlign: "left", fontSize: 16, fontWeight: 600, color: COLORS.navy, cursor: "pointer", fontFamily: "'Poppins', sans-serif" }}>
              {item.label}
            </button>
          ))}
        </div>
      )}
      <style>{`
        @media(max-width:768px){.desktop-nav{display:none!important}.mobile-menu-btn{display:block!important}}
      `}</style>
    </header>
  );
};

// ─────────────────────────────────────────────
// HERO
// ─────────────────────────────────────────────
const Hero = ({ setPage }) => (
  <section style={{ position: "relative", overflow: "hidden", background: `linear-gradient(165deg, ${COLORS.navy} 0%, #0D2847 50%, #132F55 100%)`, padding: "80px 24px 100px", minHeight: 500 }}>
    <div style={{ position: "absolute", inset: 0, opacity: 0.07 }}>
      {[...Array(20)].map((_, i) => <div key={i} style={{ position: "absolute", width: 200 + i * 30, height: 200 + i * 30, borderRadius: "50%", border: "1px solid #fff", left: `${(i * 37) % 100}%`, top: `${(i * 53) % 100}%`, transform: "translate(-50%,-50%)" }} />)}
    </div>
    <div style={{ position: "absolute", top: -100, right: -100, width: 500, height: 500, borderRadius: "50%", background: COLORS.blue, opacity: 0.06, filter: "blur(80px)" }} />
    <div style={{ position: "absolute", bottom: -50, left: -50, width: 300, height: 300, borderRadius: "50%", background: COLORS.lime, opacity: 0.08, filter: "blur(60px)" }} />
    <div style={{ maxWidth: 1200, margin: "0 auto", position: "relative", zIndex: 1 }}>
      <Badge color={COLORS.lime}>Trusted by 50+ Builders Across India</Badge>
      <h1 style={{ fontFamily: "'Poppins', sans-serif", fontSize: "clamp(32px, 5vw, 56px)", fontWeight: 800, color: "#fff", lineHeight: 1.1, margin: "20px 0 16px", maxWidth: 700 }}>
        From Shell to{" "}
        <span style={{ background: `linear-gradient(135deg, ${COLORS.lime}, #84CC16)`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Sell‑Ready</span>
      </h1>
      <p style={{ fontSize: 18, color: "#94A3B8", maxWidth: 560, lineHeight: 1.7, margin: "0 0 32px" }}>
        One-stop turnkey fitouts for builders. Furniture, appliances, and complete setups — delivered and installed. Homes, restaurants, laundromats.
      </p>
      <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
        <Button variant="lime" size="lg" onClick={() => setPage("builder")} icon={<Zap size={18} />}>Build Your Package</Button>
        <Button variant="outline" size="lg" onClick={() => setPage("modules")} style={{ color: "#fff", borderColor: "#ffffff40" }} icon={<Play size={18} />}>Explore Modules</Button>
      </div>
      <div style={{ display: "flex", gap: 32, marginTop: 48, flexWrap: "wrap" }}>
        {[{ n: "500+", l: "Units Delivered" }, { n: "15", l: "Days Avg. Turnaround" }, { n: "₹25Cr+", l: "Project Value" }, { n: "98%", l: "On-Time Delivery" }].map(s => (
          <div key={s.l}><div style={{ fontSize: 28, fontWeight: 800, color: COLORS.lime, fontFamily: "'Poppins', sans-serif" }}>{s.n}</div><div style={{ fontSize: 13, color: "#94A3B8" }}>{s.l}</div></div>
        ))}
      </div>
    </div>
  </section>
);

// ─────────────────────────────────────────────
// USP SECTION
// ─────────────────────────────────────────────
const USPs = () => (
  <section style={{ padding: "80px 24px", background: COLORS.gray }}>
    <div style={{ maxWidth: 1200, margin: "0 auto" }}>
      <div style={{ textAlign: "center", marginBottom: 48 }}>
        <Badge color={COLORS.blue}>Why HomeFit</Badge>
        <h2 style={{ fontFamily: "'Poppins', sans-serif", fontSize: 32, fontWeight: 800, color: COLORS.navy, margin: "12px 0 8px" }}>Built for Builders</h2>
        <p style={{ color: "#64748B", maxWidth: 500, margin: "0 auto" }}>We handle everything from procurement to installation, so you can focus on selling.</p>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: 24 }}>
        {[
          { icon: <Truck size={24} />, title: "End-to-End Delivery", desc: "Procurement, logistics, installation — one vendor, one invoice, zero hassle." },
          { icon: <Clock size={24} />, title: "15-Day Turnaround", desc: "From order to move-in ready. Tight timelines? We've got you." },
          { icon: <Shield size={24} />, title: "Consolidated Warranty", desc: "One warranty pack covering all products. Single-point support for everything." },
          { icon: <Award size={24} />, title: "3 Tier Flexibility", desc: "Basic, Premium, Luxury — customize packages to match your buyer profile." },
          { icon: <Target size={24} />, title: "Bulk Pricing", desc: "Volume discounts for 20+ units. Better margins for your projects." },
          { icon: <Zap size={24} />, title: "Instant Quotations", desc: "Online package builder with instant PDF quotes. No back-and-forth." },
        ].map(u => (
          <Card key={u.title} style={{ textAlign: "center", padding: 32 }}>
            <div style={{ width: 56, height: 56, borderRadius: 14, background: COLORS.blue + "12", display: "inline-flex", alignItems: "center", justifyContent: "center", color: COLORS.blue, marginBottom: 16 }}>{u.icon}</div>
            <h3 style={{ fontFamily: "'Poppins', sans-serif", fontWeight: 700, color: COLORS.navy, margin: "0 0 8px", fontSize: 16 }}>{u.title}</h3>
            <p style={{ color: "#64748B", fontSize: 14, lineHeight: 1.6, margin: 0 }}>{u.desc}</p>
          </Card>
        ))}
      </div>
    </div>
  </section>
);

// ─────────────────────────────────────────────
// MODULES SECTION
// ─────────────────────────────────────────────
const ModulesSection = ({ setPage }) => (
  <section style={{ padding: "80px 24px", background: "#fff" }}>
    <div style={{ maxWidth: 1200, margin: "0 auto" }}>
      <div style={{ textAlign: "center", marginBottom: 48 }}>
        <Badge color={COLORS.lime} variant="outline">Our Modules</Badge>
        <h2 style={{ fontFamily: "'Poppins', sans-serif", fontSize: 32, fontWeight: 800, color: COLORS.navy, margin: "12px 0 8px" }}>Three Verticals, One Partner</h2>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 24 }}>
        {MODULES.map(m => (
          <Card key={m.id} onClick={() => setPage(`module-${m.id}`)} style={{ cursor: "pointer", position: "relative", overflow: "hidden", padding: 0, border: "1px solid #F1F5F9" }}>
            <div style={{ height: 180, background: `linear-gradient(135deg, ${m.color}15, ${m.color}08)`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 72 }}>{m.img}</div>
            <div style={{ padding: 28 }}>
              <h3 style={{ fontFamily: "'Poppins', sans-serif", fontWeight: 700, fontSize: 20, color: COLORS.navy, margin: "0 0 8px" }}>{m.label}</h3>
              <p style={{ color: "#64748B", fontSize: 14, lineHeight: 1.6, margin: "0 0 16px" }}>{m.desc}</p>
              <div style={{ display: "flex", alignItems: "center", gap: 6, color: m.color, fontWeight: 600, fontSize: 14, fontFamily: "'Poppins', sans-serif" }}>Explore Packages <ArrowRight size={16} /></div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  </section>
);

// ─────────────────────────────────────────────
// PACKAGES SECTION
// ─────────────────────────────────────────────
const PackagesSection = ({ setPage }) => {
  const [mod, setMod] = useState("home");
  const data = PACKAGES_DATA[mod];
  return (
    <section id="packages" style={{ padding: "80px 24px", background: COLORS.gray }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <Badge color={COLORS.blue}>Packages</Badge>
          <h2 style={{ fontFamily: "'Poppins', sans-serif", fontSize: 32, fontWeight: 800, color: COLORS.navy, margin: "12px 0" }}>Choose Your Tier</h2>
        </div>
        <TabBar tabs={MODULES.map(m => m.label)} active={MODULES.find(m => m.id === mod)?.label} onChange={l => setMod(MODULES.find(m => m.label === l)?.id || "home")} />
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 24 }}>
          {TIERS.map((tier, i) => (
            <Card key={tier} style={{ position: "relative", border: i === 1 ? `2px solid ${COLORS.blue}` : "1px solid #E2E8F0", overflow: "hidden" }}>
              {i === 1 && <div style={{ position: "absolute", top: 16, right: -30, background: COLORS.blue, color: "#fff", padding: "4px 40px", fontSize: 11, fontWeight: 700, transform: "rotate(45deg)", letterSpacing: 1 }}>POPULAR</div>}
              <div style={{ textAlign: "center", marginBottom: 20 }}>
                <div style={{ fontSize: 12, fontWeight: 700, color: data[tier].color, textTransform: "uppercase", letterSpacing: 2, marginBottom: 4 }}>{tier}</div>
                <div style={{ fontSize: 28, fontWeight: 800, color: COLORS.navy, fontFamily: "'Poppins', sans-serif" }}>{data[tier].price}</div>
                <div style={{ fontSize: 12, color: "#94A3B8" }}>per unit / setup</div>
              </div>
              <div style={{ borderTop: "1px solid #F1F5F9", paddingTop: 16, marginBottom: 20 }}>
                {data[tier].items.map(item => (
                  <div key={item} style={{ display: "flex", alignItems: "flex-start", gap: 8, padding: "6px 0", fontSize: 13, color: "#334155" }}>
                    <Check size={14} style={{ color: COLORS.lime, marginTop: 2, flexShrink: 0 }} /> {item}
                  </div>
                ))}
              </div>
              <Button variant={i === 1 ? "primary" : "outline"} size="md" onClick={() => setPage("builder")} style={{ width: "100%", justifyContent: "center" }}>Configure Package</Button>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

// ─────────────────────────────────────────────
// TESTIMONIALS SECTION
// ─────────────────────────────────────────────
const TestimonialsSection = () => (
  <section style={{ padding: "80px 24px", background: "#fff" }}>
    <div style={{ maxWidth: 1200, margin: "0 auto" }}>
      <div style={{ textAlign: "center", marginBottom: 48 }}>
        <Badge color={COLORS.lime} variant="outline">Testimonials</Badge>
        <h2 style={{ fontFamily: "'Poppins', sans-serif", fontSize: 32, fontWeight: 800, color: COLORS.navy, margin: "12px 0" }}>What Builders Say</h2>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 24 }}>
        {TESTIMONIALS.map((t, i) => (
          <Card key={i} style={{ position: "relative", paddingTop: 40 }}>
            <div style={{ position: "absolute", top: 20, left: 24, fontSize: 48, fontFamily: "Georgia", color: COLORS.blue + "30", lineHeight: 1 }}>"</div>
            <p style={{ color: "#334155", fontSize: 15, lineHeight: 1.7, margin: "0 0 20px", fontStyle: "italic" }}>{t.quote}</p>
            <div style={{ display: "flex", gap: 4, marginBottom: 12 }}>{[...Array(t.rating)].map((_, j) => <Star key={j} size={14} fill={COLORS.lime} color={COLORS.lime} />)}</div>
            <div><div style={{ fontWeight: 700, color: COLORS.navy, fontSize: 14 }}>{t.name}</div><div style={{ fontSize: 12, color: "#64748B" }}>{t.role}</div></div>
          </Card>
        ))}
      </div>
    </div>
  </section>
);

// ─────────────────────────────────────────────
// FAQ SECTION
// ─────────────────────────────────────────────
const FAQSection = () => {
  const [open, setOpen] = useState(null);
  return (
    <section style={{ padding: "80px 24px", background: "#fff" }}>
      <div style={{ maxWidth: 800, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 48 }}>
          <Badge color={COLORS.blue}>FAQs</Badge>
          <h2 style={{ fontFamily: "'Poppins', sans-serif", fontSize: 32, fontWeight: 800, color: COLORS.navy, margin: "12px 0" }}>Frequently Asked Questions</h2>
        </div>
        {FAQS.map((f, i) => (
          <div key={i} style={{ borderBottom: "1px solid #F1F5F9", padding: "20px 0" }}>
            <button onClick={() => setOpen(open === i ? null : i)} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", width: "100%", background: "none", border: "none", cursor: "pointer", textAlign: "left" }}>
              <span style={{ fontFamily: "'Poppins', sans-serif", fontWeight: 600, fontSize: 15, color: COLORS.navy }}>{f.q}</span>
              <ChevronDown size={18} style={{ transform: open === i ? "rotate(180deg)" : "none", transition: "0.2s", color: COLORS.blue, flexShrink: 0 }} />
            </button>
            {open === i && <p style={{ color: "#64748B", fontSize: 14, lineHeight: 1.7, margin: "12px 0 0", paddingLeft: 0 }}>{f.a}</p>}
          </div>
        ))}
      </div>
    </section>
  );
};

// ─────────────────────────────────────────────
// LEAD FORM
// ─────────────────────────────────────────────
const LeadForm = ({ setPage }) => {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({ name: "", phone: "", email: "", module: "", city: "", budget: "", units: "", area: "", notes: "", consent: false });
  const [submitted, setSubmitted] = useState(false);
  const upd = (k, v) => setForm(f => ({ ...f, [k]: v }));

  if (submitted) return (
    <section style={{ padding: "80px 24px", background: COLORS.gray }}>
      <div style={{ maxWidth: 500, margin: "0 auto", textAlign: "center" }}>
        <div style={{ width: 80, height: 80, borderRadius: "50%", background: "#10B98120", display: "inline-flex", alignItems: "center", justifyContent: "center", marginBottom: 20 }}><CheckCircle size={40} color="#10B981" /></div>
        <h2 style={{ fontFamily: "'Poppins', sans-serif", fontWeight: 800, color: COLORS.navy }}>Thank You!</h2>
        <p style={{ color: "#64748B", lineHeight: 1.7 }}>We've received your requirement. A HomeFit specialist will reach out within 2 hours. Check your WhatsApp and email for confirmation.</p>
        <Button variant="primary" onClick={() => setPage("home")} style={{ marginTop: 20 }}>Back to Home</Button>
      </div>
    </section>
  );

  return (
    <section id="lead-form" style={{ padding: "80px 24px", background: COLORS.gray }}>
      <div style={{ maxWidth: 560, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <Badge color={COLORS.lime} variant="outline">Get Started</Badge>
          <h2 style={{ fontFamily: "'Poppins', sans-serif", fontSize: 28, fontWeight: 800, color: COLORS.navy, margin: "12px 0 8px" }}>Get Your Free Quotation</h2>
          <p style={{ color: "#64748B", fontSize: 14 }}>Tell us about your project. We'll send a detailed quotation within 24 hours.</p>
        </div>
        <div style={{ display: "flex", justifyContent: "center", gap: 8, marginBottom: 32 }}>
          {[1, 2, 3].map(s => (
            <div key={s} style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <div style={{ width: 32, height: 32, borderRadius: "50%", background: step >= s ? COLORS.blue : "#E2E8F0", color: step >= s ? "#fff" : "#94A3B8", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 700 }}>{s}</div>
              {s < 3 && <div style={{ width: 40, height: 2, background: step > s ? COLORS.blue : "#E2E8F0" }} />}
            </div>
          ))}
        </div>
        <Card>
          {step === 1 && <>
            <Input label="Full Name" value={form.name} onChange={v => upd("name", v)} placeholder="Rajesh Patel" required />
            <Input label="Phone" type="tel" value={form.phone} onChange={v => upd("phone", v)} placeholder="+91 98765 43210" required />
            <Input label="Email" type="email" value={form.email} onChange={v => upd("email", v)} placeholder="rajesh@company.com" required />
            <Button variant="primary" onClick={() => setStep(2)} disabled={!form.name || !form.phone || !form.email} style={{ width: "100%", justifyContent: "center", marginTop: 8 }}>Next — Project Details</Button>
          </>}
          {step === 2 && <>
            <Select label="Module" value={form.module} onChange={v => upd("module", v)} options={MODULES.map(m => ({ value: m.id, label: m.label }))} required />
            <Input label="Project City" value={form.city} onChange={v => upd("city", v)} placeholder="Mumbai, Pune, etc." required />
            <Select label="Budget Range" value={form.budget} onChange={v => upd("budget", v)} options={BUDGETS} required />
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              <Input label="No. of Units" type="number" value={form.units} onChange={v => upd("units", v)} placeholder="48" />
              <Input label="Total Area (sq.ft)" type="number" value={form.area} onChange={v => upd("area", v)} placeholder="52000" />
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              <Button variant="ghost" onClick={() => setStep(1)}>← Back</Button>
              <Button variant="primary" onClick={() => setStep(3)} disabled={!form.module || !form.city || !form.budget} style={{ flex: 1, justifyContent: "center" }}>Next — Final Details</Button>
            </div>
          </>}
          {step === 3 && <>
            <div style={{ marginBottom: 16 }}>
              <label style={{ display: "block", marginBottom: 6, fontSize: 13, fontWeight: 600, color: COLORS.navy, fontFamily: "'Poppins', sans-serif" }}>Additional Notes</label>
              <textarea value={form.notes} onChange={e => upd("notes", e.target.value)} placeholder="Timeline, specific requirements, preferred brands..." style={{ width: "100%", padding: "12px 16px", borderRadius: 10, border: "1.5px solid #E2E8F0", fontSize: 14, fontFamily: "'Lato', sans-serif", minHeight: 80, resize: "vertical", outline: "none", boxSizing: "border-box", background: "#FAFBFC" }} />
            </div>
            <div style={{ padding: 20, border: "2px dashed #E2E8F0", borderRadius: 12, textAlign: "center", marginBottom: 16, cursor: "pointer", background: "#FAFBFC" }}>
              <Upload size={24} color="#94A3B8" style={{ marginBottom: 8 }} />
              <div style={{ fontSize: 13, color: "#64748B" }}>Upload Floor Plan (PDF/JPG/PNG, ≤15MB)</div>
            </div>
            <label style={{ display: "flex", alignItems: "flex-start", gap: 10, marginBottom: 20, cursor: "pointer" }}>
              <input type="checkbox" checked={form.consent} onChange={e => upd("consent", e.target.checked)} style={{ marginTop: 3 }} />
              <span style={{ fontSize: 12, color: "#64748B", lineHeight: 1.5 }}>I agree to receive communications from HomeFit Solutions via WhatsApp and email. I've read the Privacy Policy.</span>
            </label>
            <div style={{ display: "flex", gap: 8 }}>
              <Button variant="ghost" onClick={() => setStep(2)}>← Back</Button>
              <Button variant="lime" onClick={() => setSubmitted(true)} disabled={!form.consent} style={{ flex: 1, justifyContent: "center" }} icon={<Send size={16} />}>Submit Requirement</Button>
            </div>
          </>}
        </Card>
      </div>
    </section>
  );
};

// ─────────────────────────────────────────────
// GALLERY PAGE
// ─────────────────────────────────────────────
const GalleryPage = () => {
  const [filter, setFilter] = useState("All");
  const imgs = [
    { tag: "Home", caption: "2BHK Premium Package — Ahmedabad", emoji: "🛋️" },
    { tag: "Home", caption: "3BHK Luxury Setup — Mumbai", emoji: "🏡" },
    { tag: "Restaurant", caption: "Café Bloom — Full Kitchen Install", emoji: "👨‍🍳" },
    { tag: "Restaurant", caption: "Cloud Kitchen — Modular Setup", emoji: "🍳" },
    { tag: "Laundromat", caption: "WashEasy — 8 Unit Premium", emoji: "🧹" },
    { tag: "Laundromat", caption: "Quick Wash — Basic Setup", emoji: "👕" },
    { tag: "Home", caption: "1BHK Basic — Pune Project", emoji: "🪑" },
    { tag: "Restaurant", caption: "Fine Dining — Luxury Tier", emoji: "🥂" },
  ];
  const filtered = filter === "All" ? imgs : imgs.filter(i => i.tag === filter);
  return (
    <section style={{ padding: "80px 24px", minHeight: "80vh" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <h1 style={{ fontFamily: "'Poppins', sans-serif", fontSize: 36, fontWeight: 800, color: COLORS.navy, textAlign: "center", margin: "0 0 12px" }}>Project Gallery</h1>
        <p style={{ textAlign: "center", color: "#64748B", marginBottom: 32 }}>Real projects, real results. Browse our completed installations.</p>
        <TabBar tabs={["All", "Home", "Restaurant", "Laundromat"]} active={filter} onChange={setFilter} />
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: 20 }}>
          {filtered.map((img, i) => (
            <div key={i} style={{ borderRadius: 16, overflow: "hidden", background: `linear-gradient(135deg, ${MODULES.find(m => m.label.includes(img.tag))?.color || COLORS.blue}12, ${COLORS.gray})`, border: "1px solid #E2E8F0" }}>
              <div style={{ height: 200, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 64 }}>{img.emoji}</div>
              <div style={{ padding: 16 }}>
                <Badge color={MODULES.find(m => m.label.includes(img.tag))?.color}>{img.tag}</Badge>
                <div style={{ marginTop: 8, fontSize: 14, fontWeight: 600, color: COLORS.navy }}>{img.caption}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

// ─────────────────────────────────────────────
// RESOURCES PAGE
// ─────────────────────────────────────────────
const ResourcesPage = () => (
  <section style={{ padding: "80px 24px", minHeight: "80vh" }}>
    <div style={{ maxWidth: 900, margin: "0 auto" }}>
      <h1 style={{ fontFamily: "'Poppins', sans-serif", fontSize: 36, fontWeight: 800, color: COLORS.navy, textAlign: "center", margin: "0 0 32px" }}>Resources</h1>
      <div style={{ display: "grid", gap: 16 }}>
        {[
          { title: "HomeFit Buyer's Guide 2026", desc: "Complete guide for builders choosing furniture & appliance packages.", type: "PDF", icon: <BookOpen size={20} /> },
          { title: "ROI Calculator for Turnkey Fitouts", desc: "See how turnkey packages improve your project margins and sales velocity.", type: "Excel", icon: <BarChart3 size={20} /> },
          { title: "Modular Restaurant Planning Checklist", desc: "Step-by-step checklist for setting up a restaurant from scratch.", type: "PDF", icon: <FileText size={20} /> },
          { title: "Laundromat Business Plan Template", desc: "Financial projections and operational playbook for laundromat ventures.", type: "PDF", icon: <FileText size={20} /> },
          { title: "Sample Quotation — 2BHK Premium", desc: "See exactly what a HomeFit quotation looks like.", type: "PDF", icon: <Eye size={20} /> },
        ].map((r, i) => (
          <Card key={i} style={{ display: "flex", alignItems: "center", gap: 20, cursor: "pointer" }}>
            <div style={{ width: 48, height: 48, borderRadius: 12, background: COLORS.blue + "12", display: "flex", alignItems: "center", justifyContent: "center", color: COLORS.blue, flexShrink: 0 }}>{r.icon}</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 700, color: COLORS.navy, fontSize: 15, fontFamily: "'Poppins', sans-serif" }}>{r.title}</div>
              <div style={{ fontSize: 13, color: "#64748B", marginTop: 2 }}>{r.desc}</div>
            </div>
            <Badge>{r.type}</Badge>
            <Download size={18} color={COLORS.blue} style={{ cursor: "pointer" }} />
          </Card>
        ))}
      </div>
    </div>
  </section>
);

// ─────────────────────────────────────────────
// CONTACT PAGE
// ─────────────────────────────────────────────
const ContactPage = () => (
  <section style={{ padding: "80px 24px", minHeight: "80vh" }}>
    <div style={{ maxWidth: 900, margin: "0 auto" }}>
      <h1 style={{ fontFamily: "'Poppins', sans-serif", fontSize: 36, fontWeight: 800, color: COLORS.navy, textAlign: "center", margin: "0 0 32px" }}>Get In Touch</h1>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 32 }}>
        <div>
          <Card style={{ marginBottom: 16 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}><Phone size={20} color={COLORS.blue} /><div><div style={{ fontWeight: 600, color: COLORS.navy }}>Phone</div><div style={{ fontSize: 14, color: "#64748B" }}>+91 98765 43210</div></div></div>
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}><Mail size={20} color={COLORS.blue} /><div><div style={{ fontWeight: 600, color: COLORS.navy }}>Email</div><div style={{ fontSize: 14, color: "#64748B" }}>hello@homefitsolutions.in</div></div></div>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}><MapPin size={20} color={COLORS.blue} /><div><div style={{ fontWeight: 600, color: COLORS.navy }}>Office</div><div style={{ fontSize: 14, color: "#64748B" }}>WeWork, BKC, Mumbai 400051</div></div></div>
          </Card>
          <Button variant="lime" size="lg" style={{ width: "100%", justifyContent: "center" }} icon={<MessageCircle size={18} />}>Chat on WhatsApp</Button>
        </div>
        <Card>
          <Input label="Name" placeholder="Your name" value="" onChange={() => {}} required />
          <Input label="Email" type="email" placeholder="you@company.com" value="" onChange={() => {}} required />
          <Input label="Phone" type="tel" placeholder="+91..." value="" onChange={() => {}} />
          <div style={{ marginBottom: 16 }}>
            <label style={{ display: "block", marginBottom: 6, fontSize: 13, fontWeight: 600, color: COLORS.navy, fontFamily: "'Poppins', sans-serif" }}>Message</label>
            <textarea placeholder="How can we help?" style={{ width: "100%", padding: "12px 16px", borderRadius: 10, border: "1.5px solid #E2E8F0", fontSize: 14, fontFamily: "'Lato', sans-serif", minHeight: 100, resize: "vertical", outline: "none", boxSizing: "border-box", background: "#FAFBFC" }} />
          </div>
          <Button variant="primary" style={{ width: "100%", justifyContent: "center" }} icon={<Send size={16} />}>Send Message</Button>
        </Card>
      </div>
    </div>
  </section>
);

// ─────────────────────────────────────────────
// MODULE DETAIL PAGE
// ─────────────────────────────────────────────
const ModulePage = ({ id, setPage }) => {
  const mod = MODULES.find(m => m.id === id);
  const pkgs = PACKAGES_DATA[id];
  if (!mod) return null;
  return (
    <div>
      <section style={{ padding: "80px 24px 60px", background: `linear-gradient(135deg, ${COLORS.navy}, #132F55)`, position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: -100, right: -100, width: 400, height: 400, borderRadius: "50%", background: mod.color, opacity: 0.08, filter: "blur(80px)" }} />
        <div style={{ maxWidth: 800, margin: "0 auto", position: "relative", zIndex: 1 }}>
          <Badge color={mod.color}>{mod.label}</Badge>
          <h1 style={{ fontFamily: "'Poppins', sans-serif", fontSize: "clamp(28px, 5vw, 44px)", fontWeight: 800, color: "#fff", margin: "12px 0", lineHeight: 1.15 }}>{mod.tagline}</h1>
          <p style={{ color: "#94A3B8", fontSize: 16, lineHeight: 1.7, maxWidth: 600 }}>{mod.desc}</p>
          <Button variant="lime" size="lg" onClick={() => setPage("builder")} style={{ marginTop: 24 }} icon={<Zap size={18} />}>Build Your {mod.label} Package</Button>
        </div>
      </section>
      <section style={{ padding: "60px 24px" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <h2 style={{ fontFamily: "'Poppins', sans-serif", fontSize: 28, fontWeight: 800, color: COLORS.navy, textAlign: "center", margin: "0 0 32px" }}>Package Tiers</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 24 }}>
            {TIERS.map((tier, i) => (
              <Card key={tier} style={{ border: i === 1 ? `2px solid ${mod.color}` : "1px solid #E2E8F0" }}>
                <div style={{ textAlign: "center", marginBottom: 20 }}>
                  <div style={{ fontSize: 13, fontWeight: 700, color: pkgs[tier].color, textTransform: "uppercase", letterSpacing: 2 }}>{tier}</div>
                  <div style={{ fontSize: 24, fontWeight: 800, color: COLORS.navy, fontFamily: "'Poppins', sans-serif", margin: "4px 0" }}>{pkgs[tier].price}</div>
                </div>
                {pkgs[tier].items.map(item => (
                  <div key={item} style={{ display: "flex", gap: 8, padding: "5px 0", fontSize: 13, color: "#334155" }}><Check size={14} style={{ color: mod.color, marginTop: 2, flexShrink: 0 }} />{item}</div>
                ))}
                <Button variant={i === 1 ? "primary" : "outline"} size="md" onClick={() => setPage("builder")} style={{ width: "100%", justifyContent: "center", marginTop: 20 }}>Configure</Button>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

// ─────────────────────────────────────────────
// PACKAGE BUILDER
// ─────────────────────────────────────────────
const PackageBuilder = ({ setPage }) => {
  const [step, setStep] = useState(1);
  const [mod, setMod] = useState("");
  const [tier, setTier] = useState("");
  const [addons, setAddons] = useState([]);
  const [generated, setGenerated] = useState(false);

  const addonsList = [
    { id: "smart-home", name: "Smart Home Kit", price: 35000 },
    { id: "curtains", name: "Premium Curtains & Blinds", price: 18000 },
    { id: "painting", name: "Interior Painting", price: 45000 },
    { id: "deep-clean", name: "Deep Cleaning Service", price: 8000 },
    { id: "cctv", name: "CCTV & Security System", price: 25000 },
    { id: "pest", name: "Pest Control (1yr)", price: 5000 },
  ];

  const basePrice = mod && tier ? ({ Basic: 250000, Premium: 500000, Luxury: 850000 }[tier] || 0) : 0;
  const addonTotal = addons.reduce((s, id) => s + (addonsList.find(a => a.id === id)?.price || 0), 0);
  const subtotal = basePrice + addonTotal;
  const gst = subtotal * 0.18;
  const total = subtotal + gst;

  if (generated) return (
    <section style={{ padding: "80px 24px", minHeight: "80vh" }}>
      <div style={{ maxWidth: 700, margin: "0 auto" }}>
        <Card style={{ textAlign: "center", padding: 40 }}>
          <div style={{ width: 80, height: 80, borderRadius: "50%", background: "#10B98120", display: "inline-flex", alignItems: "center", justifyContent: "center", marginBottom: 20 }}><CheckCircle size={40} color="#10B981" /></div>
          <h2 style={{ fontFamily: "'Poppins', sans-serif", fontWeight: 800, color: COLORS.navy }}>Quotation Generated!</h2>
          <p style={{ color: "#64748B", margin: "8px 0 24px" }}>Your quotation QT-{String(Date.now()).slice(-4)} has been created. Share the link or download the PDF.</p>
          <div style={{ background: COLORS.gray, borderRadius: 12, padding: 24, marginBottom: 24, textAlign: "left" }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8, fontSize: 14, color: "#64748B" }}><span>Module</span><span style={{ fontWeight: 600, color: COLORS.navy }}>{MODULES.find(m => m.id === mod)?.label}</span></div>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8, fontSize: 14, color: "#64748B" }}><span>Tier</span><span style={{ fontWeight: 600, color: COLORS.navy }}>{tier}</span></div>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8, fontSize: 14, color: "#64748B" }}><span>Base Package</span><span style={{ fontWeight: 600, color: COLORS.navy }}>₹{basePrice.toLocaleString("en-IN")}</span></div>
            {addons.length > 0 && <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8, fontSize: 14, color: "#64748B" }}><span>Add-ons ({addons.length})</span><span style={{ fontWeight: 600, color: COLORS.navy }}>₹{addonTotal.toLocaleString("en-IN")}</span></div>}
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8, fontSize: 14, color: "#64748B" }}><span>GST (18%)</span><span style={{ fontWeight: 600, color: COLORS.navy }}>₹{gst.toLocaleString("en-IN")}</span></div>
            <div style={{ borderTop: "2px solid #E2E8F0", paddingTop: 12, marginTop: 12, display: "flex", justifyContent: "space-between", fontSize: 18 }}><span style={{ fontWeight: 700, color: COLORS.navy }}>Total</span><span style={{ fontWeight: 800, color: COLORS.blue }}>₹{total.toLocaleString("en-IN")}</span></div>
          </div>
          <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
            <Button variant="primary" icon={<Download size={16} />}>Download PDF</Button>
            <Button variant="outline" icon={<Copy size={16} />}>Copy Share Link</Button>
            <Button variant="lime" icon={<CreditCard size={16} />}>Pay Advance (₹{Math.round(total * 0.1).toLocaleString("en-IN")})</Button>
          </div>
        </Card>
      </div>
    </section>
  );

  return (
    <section style={{ padding: "80px 24px", minHeight: "80vh", background: COLORS.gray }}>
      <div style={{ maxWidth: 700, margin: "0 auto" }}>
        <h1 style={{ fontFamily: "'Poppins', sans-serif", fontSize: 32, fontWeight: 800, color: COLORS.navy, textAlign: "center", margin: "0 0 8px" }}>Package Builder</h1>
        <p style={{ textAlign: "center", color: "#64748B", marginBottom: 32 }}>Build your custom quotation in minutes.</p>
        <div style={{ display: "flex", justifyContent: "center", gap: 8, marginBottom: 32 }}>
          {["Module", "Tier", "Add-ons", "Summary"].map((s, i) => (
            <div key={s} style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <div style={{ width: 28, height: 28, borderRadius: "50%", background: step > i ? COLORS.blue : step === i + 1 ? COLORS.navy : "#E2E8F0", color: step >= i + 1 ? "#fff" : "#94A3B8", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 700 }}>{step > i ? "✓" : i + 1}</div>
              <span style={{ fontSize: 12, color: step === i + 1 ? COLORS.navy : "#94A3B8", fontWeight: step === i + 1 ? 600 : 400, display: i > 1 && window.innerWidth < 500 ? "none" : "inline" }}>{s}</span>
              {i < 3 && <div style={{ width: 24, height: 1.5, background: step > i + 1 ? COLORS.blue : "#E2E8F0" }} />}
            </div>
          ))}
        </div>
        <Card style={{ padding: 32 }}>
          {step === 1 && <>
            <h3 style={{ fontFamily: "'Poppins', sans-serif", fontWeight: 700, color: COLORS.navy, margin: "0 0 20px" }}>Choose Module</h3>
            <div style={{ display: "grid", gap: 12 }}>
              {MODULES.map(m => (
                <div key={m.id} onClick={() => setMod(m.id)} style={{ display: "flex", alignItems: "center", gap: 16, padding: 16, borderRadius: 12, border: mod === m.id ? `2px solid ${m.color}` : "2px solid #E2E8F0", cursor: "pointer", transition: "all 0.2s", background: mod === m.id ? m.color + "08" : "#fff" }}>
                  <ModuleIcon type={m.id} size={48} />
                  <div><div style={{ fontWeight: 700, color: COLORS.navy, fontSize: 15 }}>{m.label}</div><div style={{ fontSize: 13, color: "#64748B" }}>{m.tagline}</div></div>
                  {mod === m.id && <Check size={20} color={m.color} style={{ marginLeft: "auto" }} />}
                </div>
              ))}
            </div>
            <Button variant="primary" onClick={() => setStep(2)} disabled={!mod} style={{ width: "100%", justifyContent: "center", marginTop: 24 }}>Next — Choose Tier</Button>
          </>}
          {step === 2 && <>
            <h3 style={{ fontFamily: "'Poppins', sans-serif", fontWeight: 700, color: COLORS.navy, margin: "0 0 20px" }}>Select Package Tier</h3>
            {TIERS.map(t => {
              const pkg = PACKAGES_DATA[mod]?.[t];
              return (
                <div key={t} onClick={() => setTier(t)} style={{ padding: 20, borderRadius: 12, border: tier === t ? `2px solid ${COLORS.blue}` : "2px solid #E2E8F0", cursor: "pointer", marginBottom: 12, background: tier === t ? COLORS.blue + "05" : "#fff" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                    <div style={{ fontWeight: 700, color: COLORS.navy, fontSize: 16 }}>{t}</div>
                    <div style={{ fontWeight: 700, color: COLORS.blue }}>{pkg?.price}</div>
                  </div>
                  <div style={{ fontSize: 13, color: "#64748B" }}>{pkg?.items.slice(0, 3).join(" • ")}...</div>
                </div>
              );
            })}
            <div style={{ display: "flex", gap: 8, marginTop: 20 }}>
              <Button variant="ghost" onClick={() => setStep(1)}>← Back</Button>
              <Button variant="primary" onClick={() => setStep(3)} disabled={!tier} style={{ flex: 1, justifyContent: "center" }}>Next — Add-ons</Button>
            </div>
          </>}
          {step === 3 && <>
            <h3 style={{ fontFamily: "'Poppins', sans-serif", fontWeight: 700, color: COLORS.navy, margin: "0 0 20px" }}>Customize Add-ons</h3>
            {addonsList.map(a => (
              <label key={a.id} style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 16px", borderRadius: 10, border: addons.includes(a.id) ? `2px solid ${COLORS.lime}` : "1.5px solid #E2E8F0", marginBottom: 8, cursor: "pointer", background: addons.includes(a.id) ? COLORS.lime + "10" : "#fff" }}>
                <input type="checkbox" checked={addons.includes(a.id)} onChange={() => setAddons(p => p.includes(a.id) ? p.filter(x => x !== a.id) : [...p, a.id])} />
                <div style={{ flex: 1 }}><div style={{ fontWeight: 600, color: COLORS.navy, fontSize: 14 }}>{a.name}</div></div>
                <div style={{ fontWeight: 700, color: COLORS.blue, fontSize: 14 }}>+₹{a.price.toLocaleString("en-IN")}</div>
              </label>
            ))}
            <div style={{ display: "flex", gap: 8, marginTop: 20 }}>
              <Button variant="ghost" onClick={() => setStep(2)}>← Back</Button>
              <Button variant="primary" onClick={() => setStep(4)} style={{ flex: 1, justifyContent: "center" }}>Review Summary</Button>
            </div>
          </>}
          {step === 4 && <>
            <h3 style={{ fontFamily: "'Poppins', sans-serif", fontWeight: 700, color: COLORS.navy, margin: "0 0 20px" }}>Quotation Summary</h3>
            <div style={{ background: COLORS.gray, borderRadius: 12, padding: 20, marginBottom: 24 }}>
              <div style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", fontSize: 14, borderBottom: "1px solid #E2E8F0" }}><span style={{ color: "#64748B" }}>Module</span><span style={{ fontWeight: 600, color: COLORS.navy }}>{MODULES.find(m => m.id === mod)?.label}</span></div>
              <div style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", fontSize: 14, borderBottom: "1px solid #E2E8F0" }}><span style={{ color: "#64748B" }}>Tier</span><span style={{ fontWeight: 600, color: COLORS.navy }}>{tier}</span></div>
              <div style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", fontSize: 14, borderBottom: "1px solid #E2E8F0" }}><span style={{ color: "#64748B" }}>Base Price</span><span style={{ fontWeight: 600, color: COLORS.navy }}>₹{basePrice.toLocaleString("en-IN")}</span></div>
              {addons.map(id => { const a = addonsList.find(x => x.id === id); return a ? <div key={id} style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", fontSize: 14, borderBottom: "1px solid #E2E8F0" }}><span style={{ color: "#64748B" }}>+ {a.name}</span><span style={{ fontWeight: 600, color: COLORS.navy }}>₹{a.price.toLocaleString("en-IN")}</span></div> : null; })}
              <div style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", fontSize: 14, borderBottom: "1px solid #E2E8F0" }}><span style={{ color: "#64748B" }}>Subtotal</span><span style={{ fontWeight: 600 }}>₹{subtotal.toLocaleString("en-IN")}</span></div>
              <div style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", fontSize: 14, borderBottom: "1px solid #E2E8F0" }}><span style={{ color: "#64748B" }}>GST (18%)</span><span style={{ fontWeight: 600 }}>₹{gst.toLocaleString("en-IN")}</span></div>
              <div style={{ display: "flex", justifyContent: "space-between", padding: "12px 0 0", fontSize: 20 }}><span style={{ fontWeight: 800, color: COLORS.navy }}>Total</span><span style={{ fontWeight: 800, color: COLORS.blue }}>₹{total.toLocaleString("en-IN")}</span></div>
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              <Button variant="ghost" onClick={() => setStep(3)}>← Back</Button>
              <Button variant="lime" onClick={() => setGenerated(true)} style={{ flex: 1, justifyContent: "center" }} icon={<FileText size={16} />}>Generate Quotation</Button>
            </div>
          </>}
        </Card>
      </div>
    </section>
  );
};

// ─────────────────────────────────────────────
// FOOTER
// ─────────────────────────────────────────────
const Footer = ({ setPage }) => (
  <footer style={{ background: COLORS.navy, padding: "60px 24px 32px", color: "#94A3B8" }}>
    <div style={{ maxWidth: 1200, margin: "0 auto" }}>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 32, marginBottom: 40 }}>
        <div>
          <Logo size={24} />
          <p style={{ fontSize: 14, lineHeight: 1.7, marginTop: 12, color: "#64748B" }}>Furniture. Appliances. Setup. Done. One-stop turnkey fitouts for builders across India.</p>
        </div>
        <div>
          <div style={{ fontWeight: 700, color: "#fff", marginBottom: 16, fontFamily: "'Poppins', sans-serif", fontSize: 14 }}>Modules</div>
          {MODULES.map(m => <div key={m.id} onClick={() => setPage(`module-${m.id}`)} style={{ padding: "4px 0", fontSize: 14, cursor: "pointer" }}>{m.label}</div>)}
        </div>
        <div>
          <div style={{ fontWeight: 700, color: "#fff", marginBottom: 16, fontFamily: "'Poppins', sans-serif", fontSize: 14 }}>Company</div>
          {["Gallery", "Resources", "Contact", "Privacy Policy", "Terms of Service"].map(l => <div key={l} onClick={() => setPage(l.toLowerCase().replace(/ /g, "-"))} style={{ padding: "4px 0", fontSize: 14, cursor: "pointer" }}>{l}</div>)}
        </div>
        <div>
          <div style={{ fontWeight: 700, color: "#fff", marginBottom: 16, fontFamily: "'Poppins', sans-serif", fontSize: 14 }}>Contact</div>
          <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "4px 0", fontSize: 14 }}><Phone size={14} /> +91 98765 43210</div>
          <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "4px 0", fontSize: 14 }}><Mail size={14} /> hello@homefitsolutions.in</div>
          <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "4px 0", fontSize: 14 }}><MapPin size={14} /> Mumbai, India</div>
        </div>
      </div>
      <div style={{ borderTop: "1px solid #1E293B", paddingTop: 24, textAlign: "center", fontSize: 13 }}>© 2026 HomeFit Solutions. All rights reserved.</div>
    </div>
  </footer>
);

// ─────────────────────────────────────────────
// ADMIN — DASHBOARD
// ─────────────────────────────────────────────
const AdminDashboard = () => {
  const barData = [
    { label: "Home", value: 68, color: "#1E88E5" },
    { label: "Restaurant", value: 24, color: "#F59E0B" },
    { label: "Laundromat", value: 18, color: "#10B981" },
  ];
  const maxBar = Math.max(...barData.map(b => b.value));
  return (
    <div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 16, marginBottom: 24 }}>
        <Stat label="Total Leads" value="110" change={12} icon={<Users size={22} />} color={COLORS.blue} />
        <Stat label="Quotations Sent" value="67" change={8} icon={<FileText size={22} />} color="#8B5CF6" />
        <Stat label="Revenue (MTD)" value="₹42L" change={15} icon={<DollarSign size={22} />} color="#10B981" />
        <Stat label="Conversion Rate" value="28%" change={-2} icon={<TrendingUp size={22} />} color="#F59E0B" />
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(350px, 1fr))", gap: 24 }}>
        <Card>
          <h3 style={{ fontFamily: "'Poppins', sans-serif", fontWeight: 700, color: COLORS.navy, margin: "0 0 20px", fontSize: 16 }}>Leads by Module</h3>
          {barData.map(b => (
            <div key={b.label} style={{ marginBottom: 16 }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6, fontSize: 13 }}><span style={{ fontWeight: 600, color: COLORS.navy }}>{b.label}</span><span style={{ color: "#64748B" }}>{b.value}</span></div>
              <ProgressBar value={b.value} max={maxBar} color={b.color} height={8} />
            </div>
          ))}
        </Card>
        <Card>
          <h3 style={{ fontFamily: "'Poppins', sans-serif", fontWeight: 700, color: COLORS.navy, margin: "0 0 20px", fontSize: 16 }}>Conversion Funnel</h3>
          {[
            { stage: "Leads", count: 110, w: 100 },
            { stage: "Qualified", count: 72, w: 65 },
            { stage: "Site Visits", count: 48, w: 44 },
            { stage: "Quotes Sent", count: 67, w: 61 },
            { stage: "Won", count: 31, w: 28 },
          ].map(f => (
            <div key={f.stage} style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 10 }}>
              <div style={{ width: 80, fontSize: 12, fontWeight: 600, color: "#64748B", textAlign: "right", flexShrink: 0 }}>{f.stage}</div>
              <div style={{ flex: 1 }}>
                <div style={{ width: `${f.w}%`, height: 28, background: `linear-gradient(90deg, ${COLORS.blue}${Math.round(30 + f.w * 0.7).toString(16)}, ${COLORS.blue}${Math.round(50 + f.w * 0.5).toString(16)})`, borderRadius: 6, display: "flex", alignItems: "center", paddingLeft: 10, fontSize: 12, fontWeight: 700, color: "#fff", transition: "width 0.5s" }}>{f.count}</div>
              </div>
            </div>
          ))}
        </Card>
        <Card>
          <h3 style={{ fontFamily: "'Poppins', sans-serif", fontWeight: 700, color: COLORS.navy, margin: "0 0 20px", fontSize: 16 }}>Revenue by Tier</h3>
          {[{ tier: "Luxury", rev: "₹18.5L", pct: 44, color: COLORS.lime }, { tier: "Premium", rev: "₹15.2L", pct: 36, color: COLORS.blue }, { tier: "Basic", rev: "₹8.3L", pct: 20, color: "#6366F1" }].map(r => (
            <div key={r.tier} style={{ marginBottom: 16 }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6, fontSize: 13 }}><span style={{ fontWeight: 600, color: COLORS.navy }}>{r.tier}</span><span style={{ color: "#64748B" }}>{r.rev} ({r.pct}%)</span></div>
              <ProgressBar value={r.pct} color={r.color} height={8} />
            </div>
          ))}
        </Card>
        <Card>
          <h3 style={{ fontFamily: "'Poppins', sans-serif", fontWeight: 700, color: COLORS.navy, margin: "0 0 20px", fontSize: 16 }}>Upcoming Site Visits</h3>
          {[
            { name: "Rajesh Patel", date: "Feb 17", city: "Ahmedabad", mod: "home" },
            { name: "Karan Mehta", date: "Feb 18", city: "Delhi", mod: "restaurant" },
            { name: "Sneha Reddy", date: "Feb 19", city: "Bangalore", mod: "home" },
          ].map((v, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 0", borderBottom: i < 2 ? "1px solid #F1F5F9" : "none" }}>
              <ModuleIcon type={v.mod} size={36} />
              <div style={{ flex: 1 }}><div style={{ fontWeight: 600, color: COLORS.navy, fontSize: 14 }}>{v.name}</div><div style={{ fontSize: 12, color: "#64748B" }}>{v.city}</div></div>
              <Badge color={COLORS.blue}>{v.date}</Badge>
            </div>
          ))}
        </Card>
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────
// ADMIN — LEADS TABLE + KANBAN
// ─────────────────────────────────────────────
const AdminLeads = () => {
  const [view, setView] = useState("table");
  const [filter, setFilter] = useState("");
  const filtered = filter ? SAMPLE_LEADS.filter(l => l.module_type === filter) : SAMPLE_LEADS;

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20, flexWrap: "wrap", gap: 12 }}>
        <div style={{ display: "flex", gap: 8 }}>
          <Button variant={view === "table" ? "primary" : "ghost"} size="sm" onClick={() => setView("table")} icon={<List size={14} />}>Table</Button>
          <Button variant={view === "kanban" ? "primary" : "ghost"} size="sm" onClick={() => setView("kanban")} icon={<Grid size={14} />}>Kanban</Button>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <Select value={filter} onChange={setFilter} options={[{ value: "", label: "All Modules" }, ...MODULES.map(m => ({ value: m.id, label: m.label }))]} />
        </div>
      </div>
      {view === "table" ? (
        <Card style={{ overflow: "auto", padding: 0 }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 14 }}>
            <thead>
              <tr style={{ background: "#F8FAFC" }}>
                {["Name", "Module", "City", "Budget", "Score", "Status", "Created"].map(h => (
                  <th key={h} style={{ textAlign: "left", padding: "12px 16px", fontSize: 12, fontWeight: 700, color: "#64748B", borderBottom: "1px solid #E2E8F0", whiteSpace: "nowrap" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map(l => (
                <tr key={l.id} style={{ borderBottom: "1px solid #F1F5F9" }}>
                  <td style={{ padding: "12px 16px" }}><div style={{ fontWeight: 600, color: COLORS.navy }}>{l.name}</div><div style={{ fontSize: 12, color: "#64748B" }}>{l.company}</div></td>
                  <td style={{ padding: "12px 16px" }}><Badge color={MODULES.find(m => m.id === l.module_type)?.color}>{l.module_type}</Badge></td>
                  <td style={{ padding: "12px 16px", color: "#334155" }}>{l.project_city}</td>
                  <td style={{ padding: "12px 16px", color: "#334155" }}>{l.budget_range}</td>
                  <td style={{ padding: "12px 16px" }}><div style={{ display: "flex", alignItems: "center", gap: 8 }}><ProgressBar value={l.score} color={l.score >= 60 ? "#10B981" : "#F59E0B"} height={4} /><span style={{ fontSize: 12, fontWeight: 600 }}>{l.score}</span></div></td>
                  <td style={{ padding: "12px 16px" }}><Badge color={PIPELINE_COLORS[l.status]}>{l.status}</Badge></td>
                  <td style={{ padding: "12px 16px", color: "#64748B", whiteSpace: "nowrap" }}>{l.created_at}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      ) : (
        <div style={{ display: "flex", gap: 16, overflowX: "auto", paddingBottom: 20 }}>
          {["New", "Qualified", "Site Visit", "Quote Sent", "Negotiation", "Closed-Won"].map(stage => (
            <div key={stage} style={{ minWidth: 260, flex: "0 0 260px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
                <div style={{ width: 10, height: 10, borderRadius: "50%", background: PIPELINE_COLORS[stage] }} />
                <span style={{ fontWeight: 700, fontSize: 13, color: COLORS.navy }}>{stage}</span>
                <span style={{ fontSize: 11, color: "#94A3B8", marginLeft: "auto" }}>{filtered.filter(l => l.status === stage).length}</span>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {filtered.filter(l => l.status === stage).map(l => (
                  <Card key={l.id} style={{ padding: 16, cursor: "grab" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                      <div style={{ fontWeight: 700, color: COLORS.navy, fontSize: 14 }}>{l.name}</div>
                      <Badge color={MODULES.find(m => m.id === l.module_type)?.color}>{l.module_type}</Badge>
                    </div>
                    <div style={{ fontSize: 12, color: "#64748B", marginBottom: 4 }}>{l.company}</div>
                    <div style={{ fontSize: 12, color: "#64748B" }}>{l.project_city} • {l.budget_range}</div>
                    <div style={{ marginTop: 8 }}><ProgressBar value={l.score} color={l.score >= 60 ? "#10B981" : "#F59E0B"} height={4} /></div>
                  </Card>
                ))}
                {filtered.filter(l => l.status === stage).length === 0 && (
                  <div style={{ padding: 20, textAlign: "center", border: "2px dashed #E2E8F0", borderRadius: 12, color: "#94A3B8", fontSize: 12 }}>No leads</div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// ─────────────────────────────────────────────
// ADMIN — QUOTATIONS
// ─────────────────────────────────────────────
const AdminQuotations = () => (
  <Card style={{ overflow: "auto", padding: 0 }}>
    <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 14 }}>
      <thead>
        <tr style={{ background: "#F8FAFC" }}>
          {["ID", "Client", "Module", "Tier", "Total", "Version", "Status", "Date"].map(h => (
            <th key={h} style={{ textAlign: "left", padding: "12px 16px", fontSize: 12, fontWeight: 700, color: "#64748B", borderBottom: "1px solid #E2E8F0", whiteSpace: "nowrap" }}>{h}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {SAMPLE_QUOTATIONS.map(q => (
          <tr key={q.id} style={{ borderBottom: "1px solid #F1F5F9" }}>
            <td style={{ padding: "12px 16px", fontWeight: 600, color: COLORS.blue }}>{q.id}</td>
            <td style={{ padding: "12px 16px", fontWeight: 600, color: COLORS.navy }}>{q.lead_name}</td>
            <td style={{ padding: "12px 16px" }}><Badge color={MODULES.find(m => m.id === q.module)?.color}>{q.module}</Badge></td>
            <td style={{ padding: "12px 16px" }}>{q.tier}</td>
            <td style={{ padding: "12px 16px", fontWeight: 700, color: COLORS.navy }}>₹{q.total.toLocaleString("en-IN")}</td>
            <td style={{ padding: "12px 16px" }}>v{q.version}</td>
            <td style={{ padding: "12px 16px" }}><Badge color={q.status === "approved" ? "#10B981" : q.status === "viewed" ? "#F59E0B" : COLORS.blue}>{q.status}</Badge></td>
            <td style={{ padding: "12px 16px", color: "#64748B" }}>{q.created}</td>
          </tr>
        ))}
      </tbody>
    </table>
  </Card>
);

// ─────────────────────────────────────────────
// ADMIN — SETTINGS
// ─────────────────────────────────────────────
const AdminSettings = () => {
  const [tab, setTab] = useState("Integrations");
  return (
    <div>
      <TabBar tabs={["Integrations", "WhatsApp Templates", "Email Templates", "Branding", "SEO"]} active={tab} onChange={setTab} />
      {tab === "Integrations" && (
        <div style={{ display: "grid", gap: 16 }}>
          <Card>
            <h3 style={{ fontFamily: "'Poppins', sans-serif", fontWeight: 700, color: COLORS.navy, margin: "0 0 16px", fontSize: 16 }}>Razorpay</h3>
            <Input label="Key ID" value="rzp_live_xxxx" onChange={() => {}} placeholder="rzp_live_..." />
            <Input label="Key Secret" type="password" value="••••••••" onChange={() => {}} />
            <Input label="Advance %" type="number" value="10" onChange={() => {}} />
            <Button variant="primary" size="sm">Save</Button>
          </Card>
          <Card>
            <h3 style={{ fontFamily: "'Poppins', sans-serif", fontWeight: 700, color: COLORS.navy, margin: "0 0 16px", fontSize: 16 }}>WhatsApp Cloud API</h3>
            <Input label="API Base URL" value="https://graph.facebook.com/v18.0" onChange={() => {}} />
            <Input label="API Token" type="password" value="••••••••" onChange={() => {}} />
            <Button variant="primary" size="sm">Save</Button>
          </Card>
          <Card>
            <h3 style={{ fontFamily: "'Poppins', sans-serif", fontWeight: 700, color: COLORS.navy, margin: "0 0 16px", fontSize: 16 }}>SMTP (Email)</h3>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              <Input label="SMTP Host" value="smtp.gmail.com" onChange={() => {}} />
              <Input label="Port" value="587" onChange={() => {}} />
            </div>
            <Input label="Username" value="hello@homefitsolutions.in" onChange={() => {}} />
            <Input label="Password" type="password" value="••••••••" onChange={() => {}} />
            <Button variant="primary" size="sm">Save & Test</Button>
          </Card>
        </div>
      )}
      {tab === "WhatsApp Templates" && (
        <div style={{ display: "grid", gap: 16 }}>
          {[
            { name: "Acknowledgement", body: `Hi {{name}}, thanks for reaching out to HomeFit Solutions! We received your requirement for {{module}} at {{location}}. A specialist will call you within 2 hours. Share floor plans here or book a site visit: {{site_visit_link}}` },
            { name: "Quotation Sent", body: `Hi {{name}}, your {{module}} quotation is ready: {{quote_link}} (PDF). To block the slot, pay the advance via Razorpay: {{razorpay_link}}. Reply for any changes.` },
            { name: "Follow-Up (48h)", body: `Hi {{name}}, did you get a chance to review the quotation? We can optimize the package to fit your budget. Book a quick call: {{calendar_link}}` },
          ].map(t => (
            <Card key={t.name}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                <h3 style={{ fontFamily: "'Poppins', sans-serif", fontWeight: 700, color: COLORS.navy, margin: 0, fontSize: 15 }}>{t.name}</h3>
                <Button variant="ghost" size="sm" icon={<Edit size={14} />}>Edit</Button>
              </div>
              <div style={{ background: "#F8FAFC", padding: 16, borderRadius: 10, fontSize: 13, color: "#334155", lineHeight: 1.7, fontFamily: "'Lato', sans-serif", border: "1px solid #E2E8F0" }}>{t.body}</div>
            </Card>
          ))}
        </div>
      )}
      {tab === "Branding" && (
        <Card>
          <h3 style={{ fontFamily: "'Poppins', sans-serif", fontWeight: 700, color: COLORS.navy, margin: "0 0 20px", fontSize: 16 }}>Logo Generation Prompts</h3>
          <div style={{ marginBottom: 24 }}>
            <label style={{ display: "block", marginBottom: 8, fontSize: 13, fontWeight: 700, color: COLORS.navy }}>ICON PROMPT:</label>
            <div style={{ background: "#F8FAFC", padding: 16, borderRadius: 10, fontSize: 13, color: "#334155", lineHeight: 1.7, border: "1px solid #E2E8F0" }}>
              "Design a modern, minimal, flat icon logo for 'HomeFit Solutions'. Concept: three modular services (home, restaurant, laundromat) represented as simple line icons within a rounded hexagon/cube grid. Navy #0B1F3A, Electric Blue #1E88E5, optional Lime #A3E635. Transparent background, no gradients."
            </div>
          </div>
          <div>
            <label style={{ display: "block", marginBottom: 8, fontSize: 13, fontWeight: 700, color: COLORS.navy }}>WORDMARK PROMPT:</label>
            <div style={{ background: "#F8FAFC", padding: 16, borderRadius: 10, fontSize: 13, color: "#334155", lineHeight: 1.7, border: "1px solid #E2E8F0" }}>
              "Create a professional wordmark + icon for 'HomeFit Solutions'. Typeface: Poppins/Montserrat, bold 'HomeFit', regular 'Solutions'. Icon: minimal house + plug-and-play motif. Colors as above. Provide square and wide lockups, on white and transparent."
            </div>
          </div>
          <div style={{ marginTop: 24 }}>
            <h4 style={{ fontFamily: "'Poppins', sans-serif", fontWeight: 700, color: COLORS.navy, marginBottom: 12 }}>Brand Colors</h4>
            <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
              {[{ name: "Navy", hex: "#0B1F3A" }, { name: "Electric Blue", hex: "#1E88E5" }, { name: "Light Gray", hex: "#F3F5F7" }, { name: "Lime", hex: "#A3E635" }].map(c => (
                <div key={c.hex} style={{ display: "flex", alignItems: "center", gap: 8, padding: "8px 14px", borderRadius: 8, border: "1px solid #E2E8F0" }}>
                  <div style={{ width: 24, height: 24, borderRadius: 6, background: c.hex, border: "1px solid #E2E8F020" }} />
                  <div><div style={{ fontSize: 12, fontWeight: 600 }}>{c.name}</div><div style={{ fontSize: 11, color: "#94A3B8" }}>{c.hex}</div></div>
                </div>
              ))}
            </div>
          </div>
        </Card>
      )}
      {tab === "Email Templates" && (
        <Card>
          <h3 style={{ fontFamily: "'Poppins', sans-serif", fontWeight: 700, color: COLORS.navy, margin: "0 0 16px", fontSize: 16 }}>Email Templates (HTML)</h3>
          <p style={{ color: "#64748B", fontSize: 14, marginBottom: 16 }}>Configure transactional email templates with brand styling. Variables: {"{{name}}, {{module}}, {{quote_link}}, {{razorpay_link}}"}</p>
          {["New Lead Acknowledgment", "Quotation Email", "Payment Received", "Builder/PM Introduction"].map(t => (
            <div key={t} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 0", borderBottom: "1px solid #F1F5F9" }}>
              <span style={{ fontWeight: 600, color: COLORS.navy, fontSize: 14 }}>{t}</span>
              <Button variant="ghost" size="sm" icon={<Edit size={14} />}>Edit HTML</Button>
            </div>
          ))}
        </Card>
      )}
      {tab === "SEO" && (
        <Card>
          <h3 style={{ fontFamily: "'Poppins', sans-serif", fontWeight: 700, color: COLORS.navy, margin: "0 0 16px", fontSize: 16 }}>SEO & Meta</h3>
          <Input label="Site Title" value="HomeFit Solutions — Turnkey Fitouts for Builders" onChange={() => {}} />
          <Input label="Meta Description" value="One-stop turnkey fitouts for builders. Furniture, appliances, and complete setups for homes, restaurants, and laundromats." onChange={() => {}} />
          <Input label="Keywords" value="turnkey fitouts, builder packages, home furniture, modular restaurant, laundromat setup" onChange={() => {}} />
          <Button variant="primary" size="sm">Save SEO Settings</Button>
        </Card>
      )}
    </div>
  );
};

// ─────────────────────────────────────────────
// ADMIN — CMS
// ─────────────────────────────────────────────
const AdminCMS = () => {
  const [tab, setTab] = useState("Packages");
  return (
    <div>
      <TabBar tabs={["Packages", "Testimonials", "Gallery", "FAQs", "Resources"]} active={tab} onChange={setTab} />
      {tab === "Packages" && (
        <div style={{ display: "grid", gap: 16 }}>
          {MODULES.map(m => (
            <Card key={m.id}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}><ModuleIcon type={m.id} size={36} /><h3 style={{ fontFamily: "'Poppins', sans-serif", fontWeight: 700, color: COLORS.navy, margin: 0 }}>{m.label}</h3></div>
                <Button variant="ghost" size="sm" icon={<Edit size={14} />}>Edit</Button>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12 }}>
                {TIERS.map(t => (
                  <div key={t} style={{ padding: 12, background: "#F8FAFC", borderRadius: 10, fontSize: 13 }}>
                    <div style={{ fontWeight: 700, color: COLORS.navy, marginBottom: 4 }}>{t}</div>
                    <div style={{ color: COLORS.blue, fontWeight: 600 }}>{PACKAGES_DATA[m.id][t].price}</div>
                    <div style={{ color: "#94A3B8", fontSize: 12, marginTop: 4 }}>{PACKAGES_DATA[m.id][t].items.length} items</div>
                  </div>
                ))}
              </div>
            </Card>
          ))}
        </div>
      )}
      {tab === "Testimonials" && (
        <div>
          <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 16 }}><Button variant="primary" size="sm" icon={<Plus size={14} />}>Add Testimonial</Button></div>
          {TESTIMONIALS.map((t, i) => (
            <Card key={i} style={{ marginBottom: 12, display: "flex", alignItems: "flex-start", gap: 16 }}>
              <div style={{ width: 48, height: 48, borderRadius: "50%", background: COLORS.blue + "20", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, color: COLORS.blue, flexShrink: 0 }}>{t.name[0]}</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 700, color: COLORS.navy }}>{t.name}</div>
                <div style={{ fontSize: 12, color: "#64748B", marginBottom: 4 }}>{t.role}</div>
                <div style={{ fontSize: 14, color: "#334155", fontStyle: "italic" }}>"{t.quote}"</div>
              </div>
              <div style={{ display: "flex", gap: 4 }}>
                <Button variant="ghost" size="sm" icon={<Edit size={14} />} />
                <Button variant="ghost" size="sm" icon={<Trash2 size={14} />} style={{ color: "#EF4444" }} />
              </div>
            </Card>
          ))}
        </div>
      )}
      {tab === "FAQs" && (
        <div>
          <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 16 }}><Button variant="primary" size="sm" icon={<Plus size={14} />}>Add FAQ</Button></div>
          {FAQS.map((f, i) => (
            <Card key={i} style={{ marginBottom: 8 }}>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <div style={{ fontWeight: 700, color: COLORS.navy, fontSize: 14 }}>{f.q}</div>
                <div style={{ display: "flex", gap: 4 }}><Button variant="ghost" size="sm" icon={<Edit size={14} />} /><Button variant="ghost" size="sm" icon={<Trash2 size={14} />} style={{ color: "#EF4444" }} /></div>
              </div>
            </Card>
          ))}
        </div>
      )}
      {tab === "Gallery" && <div style={{ textAlign: "center", padding: 40, color: "#94A3B8" }}><Image size={32} /><p>Upload and manage project gallery images.</p><Button variant="primary" size="sm" icon={<Plus size={14} />}>Upload Images</Button></div>}
      {tab === "Resources" && <div style={{ textAlign: "center", padding: 40, color: "#94A3B8" }}><BookOpen size={32} /><p>Manage downloadable resources and lead magnets.</p><Button variant="primary" size="sm" icon={<Plus size={14} />}>Upload Resource</Button></div>}
    </div>
  );
};

// ─────────────────────────────────────────────
// ADMIN PANEL
// ─────────────────────────────────────────────
const AdminPanel = ({ setPage, setIsAdmin }) => {
  const [section, setSection] = useState("dashboard");
  const nav = [
    { key: "dashboard", label: "Dashboard", icon: <BarChart3 size={18} /> },
    { key: "leads", label: "Leads", icon: <Users size={18} /> },
    { key: "quotations", label: "Quotations", icon: <FileText size={18} /> },
    { key: "payments", label: "Payments", icon: <CreditCard size={18} /> },
    { key: "cms", label: "CMS", icon: <Layers size={18} /> },
    { key: "settings", label: "Settings", icon: <Settings size={18} /> },
  ];
  return (
    <div style={{ display: "flex", minHeight: "calc(100vh - 64px)" }}>
      <aside style={{ width: 220, background: COLORS.navy, padding: "24px 12px", flexShrink: 0, display: "flex", flexDirection: "column", gap: 4 }} className="admin-sidebar">
        <div style={{ padding: "0 8px 20px", borderBottom: "1px solid #1E293B", marginBottom: 8 }}>
          <div style={{ fontSize: 11, color: "#64748B", fontWeight: 600, textTransform: "uppercase", letterSpacing: 1, marginBottom: 4 }}>Admin Panel</div>
          <div style={{ fontSize: 14, color: "#fff", fontWeight: 600 }}>HomeFit Solutions</div>
        </div>
        {nav.map(n => (
          <button key={n.key} onClick={() => setSection(n.key)} style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 12px", borderRadius: 8, background: section === n.key ? COLORS.blue + "20" : "transparent", color: section === n.key ? COLORS.blue : "#94A3B8", border: "none", cursor: "pointer", fontSize: 14, fontWeight: section === n.key ? 600 : 400, fontFamily: "'Poppins', sans-serif", width: "100%", textAlign: "left" }}>
            {n.icon}{n.label}
          </button>
        ))}
        <div style={{ marginTop: "auto", padding: "12px 8px", borderTop: "1px solid #1E293B" }}>
          <button onClick={() => setIsAdmin(false)} style={{ display: "flex", alignItems: "center", gap: 8, background: "none", border: "none", color: "#64748B", cursor: "pointer", fontSize: 13, fontFamily: "'Poppins', sans-serif" }}><Globe size={16} /> View Public Site</button>
        </div>
      </aside>
      <main style={{ flex: 1, padding: 24, background: COLORS.gray, overflowY: "auto" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
            <h1 style={{ fontFamily: "'Poppins', sans-serif", fontSize: 24, fontWeight: 800, color: COLORS.navy, margin: 0 }}>{nav.find(n => n.key === section)?.label}</h1>
            <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
              <Button variant="ghost" size="sm" icon={<Bell size={16} />} style={{ position: "relative" }}>
                <div style={{ position: "absolute", top: 4, right: 4, width: 8, height: 8, borderRadius: "50%", background: "#EF4444" }} />
              </Button>
              <div style={{ width: 32, height: 32, borderRadius: "50%", background: COLORS.blue, color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 700 }}>A</div>
            </div>
          </div>
          {section === "dashboard" && <AdminDashboard />}
          {section === "leads" && <AdminLeads />}
          {section === "quotations" && <AdminQuotations />}
          {section === "payments" && (
            <Card>
              <div style={{ textAlign: "center", padding: 40, color: "#94A3B8" }}>
                <CreditCard size={40} />
                <h3 style={{ fontFamily: "'Poppins', sans-serif", color: COLORS.navy, margin: "12px 0 8px" }}>Payments & Orders</h3>
                <p>Track Razorpay payments, advance collections, and order milestones.</p>
                <p style={{ fontSize: 12 }}>Webhook endpoint: <code style={{ background: "#F1F5F9", padding: "2px 8px", borderRadius: 4 }}>/api/webhooks/razorpay</code></p>
              </div>
            </Card>
          )}
          {section === "cms" && <AdminCMS />}
          {section === "settings" && <AdminSettings />}
        </div>
      </main>
      <style>{`@media(max-width:768px){.admin-sidebar{display:none}}`}</style>
    </div>
  );
};

// ─────────────────────────────────────────────
// WHATSAPP FLOATING BUTTON
// ─────────────────────────────────────────────
const WhatsAppFloat = () => (
  <a href="https://wa.me/919876543210" target="_blank" rel="noopener noreferrer" style={{ position: "fixed", bottom: 24, right: 24, width: 56, height: 56, borderRadius: "50%", background: "#25D366", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 4px 20px rgba(37,211,102,0.4)", zIndex: 999, transition: "transform 0.2s", cursor: "pointer" }} onMouseEnter={e => e.currentTarget.style.transform = "scale(1.1)"} onMouseLeave={e => e.currentTarget.style.transform = "scale(1)"}>
    <MessageCircle size={28} color="#fff" fill="#fff" />
  </a>
);

// ─────────────────────────────────────────────
// MAIN APP
// ─────────────────────────────────────────────
function Home() {
  const [page, setPage] = useState("home");
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => { window.scrollTo(0, 0); }, [page, isAdmin]);

  return (
    <div style={{ fontFamily: "'Lato', 'Helvetica Neue', sans-serif", color: COLORS.navy, background: "#fff", minHeight: "100vh" }}>
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;600;700;800&family=Lato:wght@400;700&display=swap" rel="stylesheet" />
      <Header page={page} setPage={setPage} isAdmin={isAdmin} setIsAdmin={setIsAdmin} />
      {isAdmin ? (
        <AdminPanel setPage={setPage} setIsAdmin={setIsAdmin} />
      ) : (
        <>
          {page === "home" && <>
            <Hero setPage={setPage} />
            <USPs />
            <ModulesSection setPage={setPage} />
            <PackagesSection setPage={setPage} />
            <TestimonialsSection />
            <LeadForm setPage={setPage} />
            <FAQSection />
          </>}
          {page === "packages" && <PackagesSection setPage={setPage} />}
          {page === "gallery" && <GalleryPage />}
          {page === "resources" && <ResourcesPage />}
          {page === "contact" && <ContactPage />}
          {page === "builder" && <PackageBuilder setPage={setPage} />}
          {page.startsWith("module-") && <ModulePage id={page.replace("module-", "")} setPage={setPage} />}
          <Footer setPage={setPage} />
          <WhatsAppFloat />
        </>
      )}
    </div>
  );
}

export default Home;
