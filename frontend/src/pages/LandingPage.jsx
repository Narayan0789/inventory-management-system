import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  ShoppingCart,
  Search,
  Box,
  Layers,
  AlertTriangle,
  Receipt,
  Truck,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  TrendingUp,
  Package,
  Printer,
  Mail,
  Zap,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  Clock,
  Sparkles,
  BarChart3,
  Users,
  User,
  ScanBarcode,
  PackagePlus,
  Store,
  Building2,
  BadgePercent,
  Check
} from 'lucide-react';

const LandingPage = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('items');
  const [openFaq, setOpenFaq] = useState(null);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const slides = [
    {
      id: 1,
      image: '/images/warehouse.jpg',
      alt: 'Modern Automated Warehouse Logistics and Barcode Inventory',
      badgeCategory: 'Automated Logistics & Storage',
      title: 'Automated Fulfillment & Real-World Inventory Precision',
      subtitle: 'Barcode-driven item tracking, instant counter deductions, and multi-tier warehouse logistics.',
      tag: 'POS Terminal Ready',
      tagColor: 'bg-emerald-600',
      topLeft: {
        badge: 'Live Cloud Sync',
        sub: '129 Net Available Units • MongoDB Atlas',
        dotColor: 'bg-emerald-400 animate-pulse',
      },
      topRight: {
        icon: 'alert',
        badge: 'Low Stock Guard Active',
        sub: 'Automated Reorder Thresholds',
        textColor: 'text-amber-400',
        borderColor: 'border-amber-500/40'
      }
    },
    {
      id: 2,
      image: '/images/barcode-scanner.jpg',
      alt: 'Smart Handheld Barcode Scanner Terminal in Supermarket Aisle',
      badgeCategory: 'Smart Barcode Audit',
      title: 'Rapid Barcode Auditing & Shelf Stock Precision',
      subtitle: 'Handheld laser scanning eliminates manual tally errors across retail supermarket shelves in real time.',
      tag: 'Instant SKU & Barcode Sync',
      tagColor: 'bg-emerald-600',
      topLeft: {
        badge: 'Zero-Latency Scanner',
        sub: 'Instant SKU & EAN-13 Barcode Match',
        dotColor: 'bg-emerald-400 animate-pulse',
      },
      topRight: {
        icon: 'check',
        badge: '99.98% Shelf Accuracy',
        sub: 'Zero Discrepancy Auditing',
        textColor: 'text-emerald-400',
        borderColor: 'border-emerald-500/40'
      }
    },
    {
      id: 3,
      image: '/images/pos-terminal.jpg',
      alt: 'Modern Touchscreen Retail POS Billing Terminal and Barcode Scanner',
      badgeCategory: 'High-Speed POS Counter',
      title: 'Frictionless Point-of-Sale Billing Terminal',
      subtitle: 'Multi-counter itemized customer checkout with instant tax invoice printing and zero overselling.',
      tag: 'Express Cashier Counter',
      tagColor: 'bg-emerald-600',
      topLeft: {
        badge: 'Atomic Stock Guard',
        sub: 'Live Counter Deductions • Zero Lag',
        dotColor: 'bg-emerald-400 animate-pulse',
      },
      topRight: {
        icon: 'printer',
        badge: 'Instant Tax Invoices',
        sub: 'Automated Sequential Bill Numbering',
        textColor: 'text-emerald-400',
        borderColor: 'border-emerald-500/40'
      }
    },
    {
      id: 4,
      image: '/images/shipping-dispatch.jpg',
      alt: 'Modern Logistics Distribution Center Shipping Dock and Freight Pallets',
      badgeCategory: 'Distribution & Dispatch',
      title: 'Seamless Freight Logistics & Outbound Dispatch',
      subtitle: 'Automated shipment workflows coordinating pallet cargo, delivery fleets, and vendor supply lines.',
      tag: 'Dock Logistics Verified',
      tagColor: 'bg-emerald-600',
      topLeft: {
        badge: 'Active Logistics Bay',
        sub: 'Dock 14 Outbound Fleet Routing',
        dotColor: 'bg-emerald-400 animate-pulse',
      },
      topRight: {
        icon: 'truck',
        badge: 'Pallet Restock Flow',
        sub: 'Bulk Freight Dispatch Verified',
        textColor: 'text-amber-300',
        borderColor: 'border-amber-500/40'
      }
    },
    {
      id: 5,
      image: '/images/stock-intake.jpg',
      alt: 'Inventory Supervisor verifying received shipment freight packages',
      badgeCategory: 'Procurement & Intake',
      title: 'Verified Supplier Shipments & Batch Stock Intake',
      subtitle: 'Match vendor freight manifests directly against purchase orders before releasing stock to active shelves.',
      tag: 'Quality Inspected',
      tagColor: 'bg-emerald-600',
      topLeft: {
        badge: 'Inbound PO Verification',
        sub: 'Supplier Delivery Audit Completed',
        dotColor: 'bg-emerald-400 animate-pulse',
      },
      topRight: {
        icon: 'package',
        badge: 'Vendor Cost Ledger',
        sub: 'Real-Time Unit Purchase Accounting',
        textColor: 'text-emerald-400',
        borderColor: 'border-emerald-500/40'
      }
    },
    {
      id: 6,
      image: '/images/executive-analytics.jpg',
      alt: 'Executive Retail Owner Reviewing Inventory Valuation on Laptop',
      badgeCategory: 'Executive Owner Console',
      title: 'Executive Financial Visibility & Margin Intelligence',
      subtitle: 'Unrestricted gross margin insights, inventory turnover metrics, and staff authorization control.',
      tag: 'Admin Enterprise Portal',
      tagColor: 'bg-emerald-600',
      topLeft: {
        badge: '₹10,41,550 Live Valuation',
        sub: '10 Products • 129 Stock Units',
        dotColor: 'bg-emerald-400 animate-pulse',
      },
      topRight: {
        icon: 'shield',
        badge: 'RBAC Security Active',
        sub: 'Admin vs Cashier Governance',
        textColor: 'text-emerald-400',
        borderColor: 'border-emerald-500/40'
      }
    }
  ];

  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [isPaused, slides.length]);

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const renderIcon = (iconName) => {
    switch (iconName) {
      case 'alert':
        return <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />;
      case 'check':
        return <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />;
      case 'printer':
        return <Printer className="w-3.5 h-3.5 text-purple-300" />;
      case 'truck':
        return <Truck className="w-3.5 h-3.5 text-amber-300" />;
      case 'package':
        return <Package className="w-3.5 h-3.5 text-emerald-300" />;
      case 'shield':
        return <ShieldCheck className="w-3.5 h-3.5 text-indigo-300" />;
      default:
        return <Sparkles className="w-3.5 h-3.5 text-white" />;
    }
  };

  const toggleFaq = (index) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  const faqData = [
    {
      q: 'What is StockPilot Inventory?',
      a: 'StockPilot is a full-stack inventory management and Point-of-Sale (POS) platform designed to help retail stores, supermarkets, and wholesale businesses manage catalog items, barcode stock movements, sales transactions, and supplier purchase orders from a unified cloud dashboard.'
    },
    {
      q: 'How do low-stock threshold alerts work?',
      a: 'You can configure a custom minimum stock threshold (minStockLimit) for every single product in your catalog. When item quantities fall to or below this threshold, the platform triggers instant visual warning pills and prioritizes reordering.'
    },
    {
      q: 'Does StockPilot support separate Admin and Staff roles?',
      a: 'Yes! It features strict Role-Based Access Control (RBAC). Store Administrators have complete owner governance over product catalogs, financial margins, and staff accounts. Store Staff have dedicated high-speed access to the POS billing counter and stock-in purchase entries.'
    },
    {
      q: 'Can I generate and print customer tax invoices?',
      a: 'Yes. The POS billing module instantly calculates itemized sub-totals, generates unique invoice reference numbers, date stamps, and renders print-ready customer receipts while atomically deducting stock.'
    },
    {
      q: 'How do I get started with StockPilot?',
      a: 'Click "Get Started Free" to create your account, or click "Sign In" to access your dashboard. You can also explore immediate live functionality using the built-in demo credentials.'
    }
  ];

  return (
    <div className="min-h-screen w-full overflow-x-clip bg-stone-50/70 text-slate-800 flex flex-col font-sans selection:bg-emerald-600 selection:text-white">
      {/* ================= 1. SINGLE UNIFIED CLEAN NAVBAR ================= */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200/90 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          {/* Brand Logo & Title */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 border border-emerald-200/80 flex items-center justify-center group-hover:scale-105 transition shadow-2xs">
              <ShoppingCart className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-1.5 leading-none">
                <span className="text-[10px] uppercase font-black text-slate-400 tracking-wider">StockPilot</span>
              </div>
              <span className="text-base font-black text-slate-900 tracking-tight leading-tight block">
                Inventory
              </span>
            </div>
          </Link>

          {/* Navigation Links */}
          <nav className="hidden lg:flex items-center gap-6 text-xs font-semibold text-slate-700">
            <a href="#features" className="hover:text-emerald-600 transition">
              Features
            </a>
            <a href="#dashboard-preview" className="hover:text-emerald-600 transition">
              Live Terminal
            </a>
            <a href="#roles" className="hover:text-emerald-600 transition">
              Role Access (RBAC)
            </a>
            <a href="#how-it-works" className="hover:text-emerald-600 transition">
              How It Works
            </a>
            <a href="#faq" className="hover:text-emerald-600 transition">
              FAQ
            </a>
          </nav>

          {/* Right Action CTAs */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="text-slate-400 hover:text-slate-600 transition p-1"
              title="Search Features"
            >
              <Search className="w-4 h-4" />
            </button>

            {/* Staff Sign In Link */}
            <Link
              to="/login?mode=login"
              className="text-xs font-bold text-slate-700 hover:text-emerald-600 transition px-2 py-1"
            >
              Sign In
            </Link>

            {/* Unified Get Started Free Button */}
            <Link
              to="/login?mode=register"
              className="px-3.5 py-1.5 rounded-lg text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 shadow-sm shadow-emerald-600/25 transition"
            >
              Get Started Free
            </Link>
          </div>
        </div>
      </header>

      {/* Spacer so page content starts cleanly below the fixed 64px (h-16) navbar */}
      <div className="h-16 w-full shrink-0" aria-hidden="true" />

      {/* ================= 2. HERO SECTION WITH SHOWCASE ================= */}
      <section className="pt-10 pb-16 bg-[#fafaf9] border-b border-stone-200/60 relative overflow-hidden w-full">
        {/* Top Text & CTAs in focused readable width */}
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          {/* Hero Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50 border border-emerald-200/80 shadow-xs text-xs font-bold text-emerald-800 mb-5">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>ENTERPRISE INVENTORY & POINT-OF-SALE PLATFORM</span>
          </div>

          {/* Headline */}
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-slate-950 tracking-tight leading-tight">
            Take Control of Your Inventory.{' '}
            <span className="text-emerald-700">
              Simplify Every Sale.
            </span>
          </h1>

          <p className="mt-4 text-xs sm:text-sm lg:text-base text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Real-time barcode stock tracking, threshold-based reorder alerts, and high-speed counter POS billing — built for modern retail shops, supermarkets, and warehouse operations.
          </p>

          {/* Action CTAs */}
          <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
            <Link
              to="/login?mode=register"
              className="px-6 py-3 rounded-xl text-xs sm:text-sm font-bold text-white bg-emerald-600 hover:bg-emerald-700 shadow-sm shadow-emerald-600/30 flex items-center gap-2 transition hover:-translate-y-0.5"
            >
              <span>Get Started Free</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <button
              onClick={() => {
                document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="px-6 py-3 rounded-xl text-xs sm:text-sm font-bold text-slate-700 bg-white hover:bg-slate-100 border border-slate-300 shadow-2xs transition hover:-translate-y-0.5"
            >
              Explore Solutions
            </button>
          </div>
        </div>

        {/* ================= HERO SHOWCASE: TRUE FULL-SCREEN 100% BORDERLESS 6-PHOTO CAROUSEL ================= */}
        <div
          className="mt-8 sm:mt-10 w-full relative overflow-hidden group bg-slate-950"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          {/* Full Screen Viewport Container: 100% Width & 90vh+ Screen Height */}
          <div className="relative w-full h-[70vh] sm:h-[80vh] md:h-[85vh] lg:h-[90vh] xl:h-[92vh] min-h-[600px] overflow-hidden">
            {/* Sliding Track (Smooth Right-to-Left Transition) */}
            <div
              className="w-full flex h-full transition-transform duration-600 ease-out will-change-transform"
              style={{ transform: `translateX(-${currentSlide * 100}%)` }}
            >
              {slides.map((slide) => (
                <div
                  key={slide.id}
                  className="w-full min-w-full max-w-full shrink-0 h-full relative overflow-hidden"
                >
                  {/* Full Bleed Commercial Photography */}
                  <img
                    src={slide.image}
                    alt={slide.alt}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000 ease-out select-none"
                  />

                  {/* Subtle natural photography overlay for crisp real-world warehouse photos */}
                  <div className="absolute inset-0 bg-slate-950/30"></div>
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-950/20 to-transparent"></div>

                  {/* Top Left Floating Glassmorphism Status Badge */}
                  <div className="absolute top-5 left-5 sm:top-8 sm:left-10 md:top-10 md:left-14 bg-slate-950/85 backdrop-blur-md border border-slate-700/80 rounded-2xl p-3.5 sm:p-4 text-left shadow-2xl max-w-[340px]">
                    <div className="flex items-center gap-2">
                      <span className={`w-2.5 h-2.5 rounded-full ${slide.topLeft.dotColor}`}></span>
                      <span className="text-xs sm:text-sm md:text-base font-bold text-white tracking-wide">
                        {slide.topLeft.badge}
                      </span>
                    </div>
                    <p className="text-[11px] sm:text-xs text-slate-300 font-medium mt-1 leading-snug">
                      {slide.topLeft.sub}
                    </p>
                  </div>

                  {/* Top Right Floating Glassmorphism Operational Badge */}
                  <div
                    className={`absolute top-5 right-5 sm:top-8 sm:right-10 md:top-10 md:right-14 bg-slate-950/85 backdrop-blur-md border ${slide.topRight.borderColor} rounded-2xl p-3.5 sm:p-4 text-left shadow-2xl max-w-[340px]`}
                  >
                    <div
                      className={`flex items-center gap-2 ${slide.topRight.textColor} text-xs sm:text-sm md:text-base font-bold tracking-wide`}
                    >
                      {renderIcon(slide.topRight.icon)}
                      <span>{slide.topRight.badge}</span>
                    </div>
                    <p className="text-[11px] sm:text-xs text-slate-300 font-medium mt-1 leading-snug">
                      {slide.topRight.sub}
                    </p>
                  </div>

                  {/* Bottom Showcase: Stylish Modern Typography & Badges */}
                  <div className="absolute bottom-16 left-6 right-6 sm:bottom-20 sm:left-12 sm:right-12 md:bottom-22 md:left-16 md:right-16 flex flex-col sm:flex-row items-start sm:items-end justify-between gap-6 text-white max-w-7xl">
                    <div className="max-w-4xl">
                      {/* Stylish Category Pill */}
                      <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider bg-slate-900/85 backdrop-blur-md border border-slate-700/80 text-emerald-300 shadow-xl mb-3 sm:mb-4">
                        <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                        <span>{slide.badgeCategory}</span>
                      </div>

                      {/* Large Stylish Title with Soft Glow & Drop Shadow */}
                      <h3 className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-white tracking-tight leading-tight sm:leading-none drop-shadow-[0_4px_30px_rgba(0,0,0,0.95)]">
                        {slide.title}
                      </h3>

                      {/* Refined Subtitle */}
                      <p className="text-xs sm:text-base md:text-lg text-slate-200/90 font-medium mt-3 leading-relaxed drop-shadow-md max-w-3xl">
                        {slide.subtitle}
                      </p>
                    </div>

                    {/* Functional Pill Tag */}
                    <div className="flex items-center gap-2 shrink-0">
                      <span
                        className={`px-5 py-2.5 rounded-xl ${slide.tagColor} text-white font-black text-xs sm:text-sm md:text-base uppercase tracking-wider shadow-2xl border border-white/20 backdrop-blur-xs flex items-center gap-2`}
                      >
                        <span>{slide.tag}</span>
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Left Slide Navigation Button */}
            <button
              type="button"
              onClick={prevSlide}
              aria-label="Previous Slide"
              className="absolute left-4 sm:left-8 top-1/2 -translate-y-1/2 z-30 w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-slate-950/70 hover:bg-slate-950 text-white backdrop-blur-md border border-white/20 flex items-center justify-center transition shadow-2xl hover:scale-110 active:scale-95 group cursor-pointer"
            >
              <ChevronLeft className="w-6 h-6 sm:w-8 sm:h-8 text-white group-hover:-translate-x-0.5 transition-transform" />
            </button>

            {/* Right Slide Navigation Button */}
            <button
              type="button"
              onClick={nextSlide}
              aria-label="Next Slide"
              className="absolute right-4 sm:right-8 top-1/2 -translate-y-1/2 z-30 w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-slate-950/70 hover:bg-slate-950 text-white backdrop-blur-md border border-white/20 flex items-center justify-center transition shadow-2xl hover:scale-110 active:scale-95 group cursor-pointer"
            >
              <ChevronRight className="w-6 h-6 sm:w-8 sm:h-8 text-white group-hover:translate-x-0.5 transition-transform" />
            </button>

            {/* Bottom Floating Glass Capsule: Counter & Indicator Pills */}
            <div className="absolute bottom-5 sm:bottom-7 left-1/2 -translate-x-1/2 z-30 flex items-center gap-2.5 bg-slate-950/80 backdrop-blur-md border border-white/20 px-4 py-2 rounded-full shadow-2xl">
              <span className="text-xs sm:text-sm font-mono font-bold text-emerald-300 tracking-wider mr-1.5">
                0{currentSlide + 1} / 0{slides.length}
              </span>
              {slides.map((_, dotIdx) => (
                <button
                  key={dotIdx}
                  type="button"
                  onClick={() => setCurrentSlide(dotIdx)}
                  aria-label={`Go to slide ${dotIdx + 1}`}
                  className={`h-2.5 rounded-full transition-all duration-400 cursor-pointer ${
                    currentSlide === dotIdx
                      ? 'w-8 sm:w-12 bg-emerald-500 shadow-sm'
                      : 'w-2.5 bg-white/40 hover:bg-white/70'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Social Proof / Industry Trust Bar */}
        <div className="max-w-6xl mx-auto px-4 mt-12 pt-8 border-t border-slate-200/80 flex flex-wrap items-center justify-center gap-6 sm:gap-12 text-xs font-semibold text-slate-500">
          <span className="text-[11px] uppercase tracking-wider font-bold text-slate-400">Trusted Architecture For:</span>
          <div className="flex items-center gap-1.5 text-slate-700">
            <Store className="w-4 h-4 text-emerald-600" />
            <span>Retail Supermarkets</span>
          </div>
          <div className="flex items-center gap-1.5 text-slate-700">
            <Building2 className="w-4 h-4 text-emerald-600" />
            <span>Wholesale Distributors</span>
          </div>
          <div className="flex items-center gap-1.5 text-slate-700">
            <Package className="w-4 h-4 text-emerald-600" />
            <span>Electronics Showrooms</span>
          </div>
          <div className="flex items-center gap-1.5 text-slate-700">
            <Receipt className="w-4 h-4 text-emerald-600" />
            <span>Multi-Counter POS Outlets</span>
          </div>
        </div>

        {/* ================= 3. FLOATING HORIZONTAL TABS ================= */}
        <div id="features" className="max-w-4xl mx-auto px-4 mt-12 scroll-mt-20">
          <div className="bg-white rounded-xl shadow-md border border-slate-200/80 p-1 flex items-center justify-between overflow-x-auto no-scrollbar">
            <button
              onClick={() => {
                setActiveTab('items');
                document.getElementById('items-sec')?.scrollIntoView({ behavior: 'smooth' });
              }}
              className={`px-4 py-2.5 text-xs font-bold whitespace-nowrap transition rounded-lg ${
                activeTab === 'items'
                  ? 'bg-emerald-50 text-emerald-800 border-b-2 border-emerald-600'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              Item management
            </button>
            <button
              onClick={() => {
                setActiveTab('customer');
                document.getElementById('customer-sec')?.scrollIntoView({ behavior: 'smooth' });
              }}
              className={`px-4 py-2.5 text-xs font-bold whitespace-nowrap transition rounded-lg ${
                activeTab === 'customer'
                  ? 'bg-emerald-50 text-emerald-800 border-b-2 border-emerald-600'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              Customer lifecycle (POS)
            </button>
            <button
              onClick={() => {
                setActiveTab('vendor');
                document.getElementById('vendor-sec')?.scrollIntoView({ behavior: 'smooth' });
              }}
              className={`px-4 py-2.5 text-xs font-bold whitespace-nowrap transition rounded-lg ${
                activeTab === 'vendor'
                  ? 'bg-emerald-50 text-emerald-800 border-b-2 border-emerald-600'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              Vendor relations (Stock-In)
            </button>
            <button
              onClick={() => {
                setActiveTab('roles');
                document.getElementById('roles')?.scrollIntoView({ behavior: 'smooth' });
              }}
              className={`px-4 py-2.5 text-xs font-bold whitespace-nowrap transition rounded-lg ${
                activeTab === 'roles'
                  ? 'bg-emerald-50 text-emerald-800 border-b-2 border-emerald-600'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              Role Access (RBAC)
            </button>
            <button
              onClick={() => {
                setActiveTab('how');
                document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' });
              }}
              className={`px-4 py-2.5 text-xs font-bold whitespace-nowrap transition rounded-lg ${
                activeTab === 'how'
                  ? 'bg-emerald-50 text-emerald-800 border-b-2 border-emerald-600'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              How It Works
            </button>
          </div>
        </div>
      </section>

      {/* ================= 4. DASHBOARD PREVIEW SECTION ================= */}
      <section id="dashboard-preview" className="py-16 bg-white border-b border-slate-200 scroll-mt-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <span className="text-[11px] font-bold text-emerald-600 uppercase tracking-widest">Live Terminal Snapshot</span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 mt-1">
              Everything You Need, in One Dashboard
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 mt-2">
              Monitor stock levels, review counter sales activity and keep track of your inventory from a single unified workspace.
            </p>
          </div>

          {/* Live Mockup Container */}
          <div className="bg-slate-900 rounded-2xl p-4 sm:p-6 shadow-xl border border-slate-800 text-slate-100">
            {/* Top Bar Mockup */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-6">
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-full bg-red-500 inline-block"></span>
                  <span className="w-3 h-3 rounded-full bg-amber-500 inline-block"></span>
                  <span className="w-3 h-3 rounded-full bg-emerald-500 inline-block"></span>
                </div>
                <span className="text-xs text-slate-400 font-mono">StockPilot Inventory Portal • Live Cloud Synchronized</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/30 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                  Live System
                </span>
              </div>
            </div>

            {/* Metric KPI Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
              <div className="bg-slate-800/80 p-3.5 rounded-xl border border-slate-700/60">
                <p className="text-[11px] text-slate-400 font-medium">Total Products</p>
                <p className="text-xl font-black text-white mt-0.5">10 Items</p>
                <p className="text-[10px] text-emerald-400 mt-1 flex items-center gap-1">
                  <TrendingUp className="w-3 h-3" /> Multi-Category Tracking
                </p>
              </div>

              <div className="bg-slate-800/80 p-3.5 rounded-xl border border-slate-700/60">
                <p className="text-[11px] text-slate-400 font-medium">Total Stock Valuation</p>
                <p className="text-xl font-black text-emerald-400 mt-0.5">₹10,41,550</p>
                <p className="text-[10px] text-slate-400 mt-1">129 Net Available Units</p>
              </div>

              <div className="bg-slate-800/80 p-3.5 rounded-xl border border-slate-700/60">
                <p className="text-[11px] text-slate-400 font-medium">Today's Sales</p>
                <p className="text-xl font-black text-emerald-400 mt-0.5">₹70,797</p>
                <p className="text-[10px] text-emerald-400 mt-1">1 Counter Order Billed</p>
              </div>

              <div className="bg-slate-800/80 p-3.5 rounded-xl border border-slate-700/60">
                <p className="text-[11px] text-slate-400 font-medium">Low Stock Alerts</p>
                <p className="text-xl font-black text-red-400 mt-0.5">4 Items</p>
                <p className="text-[10px] text-red-400 mt-1 flex items-center gap-1">
                  <AlertTriangle className="w-3 h-3" /> 1 Out of Stock
                </p>
              </div>
            </div>

            {/* Mini Table Mockup */}
            <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700/40">
              <div className="flex items-center justify-between mb-3 text-xs">
                <span className="font-bold text-white">Live Inventory Movements</span>
                <span className="text-[11px] text-slate-400">Atomic Stock Deduction Active</span>
              </div>
              <div className="space-y-2 text-xs">
                <div className="flex items-center justify-between p-2 rounded-lg bg-slate-800/90 border border-slate-700/50">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                    <span className="font-semibold text-slate-200">Samsung Galaxy S24 5G</span>
                    <span className="text-[10px] text-slate-400 font-mono">SAM-S24</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-slate-300 font-mono">12 in stock</span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-300">In Stock</span>
                  </div>
                </div>

                <div className="flex items-center justify-between p-2 rounded-lg bg-slate-800/90 border border-slate-700/50">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-amber-400"></span>
                    <span className="font-semibold text-slate-200">Apple iPhone 15</span>
                    <span className="text-[10px] text-slate-400 font-mono">APL-IP15</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-slate-300 font-mono">2 in stock</span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/20 text-amber-300">Low Stock</span>
                  </div>
                </div>

                <div className="flex items-center justify-between p-2 rounded-lg bg-slate-800/90 border border-slate-700/50">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-red-400"></span>
                    <span className="font-semibold text-slate-200">SanDisk 128GB Ultra MicroSD</span>
                    <span className="text-[10px] text-slate-400 font-mono">SND-SD128</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-slate-300 font-mono">0 in stock</span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-red-500/20 text-red-300">Out of Stock</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= 5. FEATURE SECTION A: ITEM MANAGEMENT (WITH HOVER IMAGE) ================= */}
      <section id="items-sec" className="py-16 bg-slate-50 border-b border-slate-200 scroll-mt-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mb-12">
            <span className="text-xs font-bold text-emerald-600 uppercase tracking-wider">Catalog & Storage</span>
            <h2 className="text-2xl sm:text-4xl font-black text-slate-900 mt-1">
              Manage Your Products with Confidence
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 mt-2 leading-relaxed">
              Organize your product catalog, configure categories, set reorder limits, and track stock quantities from one centralized dashboard.
            </p>
          </div>

          <div className="grid lg:grid-cols-12 gap-8 items-center">
            {/* Left 3 Feature Cards */}
            <div className="lg:col-span-7 space-y-4">
              <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-xs hover:shadow-md transition hover:-translate-y-0.5">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                    <Package className="w-6 h-6" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-base font-bold text-slate-900 mb-1">Product & Category Management</h3>
                    <p className="text-xs text-slate-600 leading-relaxed mb-3">
                      Add, edit, and organize products with custom SKUs, categories, brand tags, cost pricing, retail prices, and opening counts.
                    </p>
                    <Link to="/products" className="text-xs font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-1">
                      <span>Manage Products Catalog</span> &rarr;
                    </Link>
                  </div>
                </div>
              </div>

              <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-xs hover:shadow-md transition hover:-translate-y-0.5">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
                    <AlertTriangle className="w-6 h-6" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-base font-bold text-slate-900 mb-1">Automated Low-Stock Thresholds</h3>
                    <p className="text-xs text-slate-600 leading-relaxed mb-3">
                      Configure safety buffer stock levels for every item. The system flags shortages before your inventory runs dry.
                    </p>
                    <Link to="/alerts" className="text-xs font-bold text-amber-700 hover:text-amber-800 flex items-center gap-1">
                      <span>View Active Threshold Alerts</span> &rarr;
                    </Link>
                  </div>
                </div>
              </div>

              <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-xs hover:shadow-md transition hover:-translate-y-0.5">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                    <ScanBarcode className="w-6 h-6" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-base font-bold text-slate-900 mb-1">Instant SKU & Barcode Search</h3>
                    <p className="text-xs text-slate-600 leading-relaxed mb-3">
                      Zero-lag product search across SKU barcodes and item names designed specifically for fast retail counter lookups.
                    </p>
                    <Link to="/products" className="text-xs font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-1">
                      <span>Explore Search & Tracking</span> &rarr;
                    </Link>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Interactive Visual Image with Hover Zoom */}
            <div className="lg:col-span-5">
              <div className="relative rounded-2xl overflow-hidden border border-slate-200/90 shadow-xl group bg-white p-2">
                <div className="h-80 sm:h-96 rounded-xl overflow-hidden relative">
                  <img
                    src="/images/barcode-scanner.jpg"
                    alt="Handheld Laser Barcode Scanner in Supermarket Aisle"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent"></div>
                  <div className="absolute bottom-5 left-5 right-5 text-white">
                    <span className="px-2.5 py-0.5 text-[10px] font-bold uppercase rounded bg-emerald-600 text-white inline-block mb-1">
                      Barcode Scanning
                    </span>
                    <h4 className="text-base font-black text-white">Instant SKU & Shelf Audit</h4>
                    <p className="text-[11px] text-slate-200 mt-0.5">
                      Fast barcode auditing eliminates shelf discrepancies and synchronizes with catalog in real-time.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= 6. FEATURE SECTION B: POS COUNTER BILLING (WITH HOVER IMAGE) ================= */}
      <section id="customer-sec" className="py-16 bg-white border-b border-slate-200 scroll-mt-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mb-12">
            <span className="text-xs font-bold text-emerald-600 uppercase tracking-wider">Point of Sale</span>
            <h2 className="text-2xl sm:text-4xl font-black text-slate-900 mt-1">
              Sell Faster with Integrated POS Billing
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 mt-2 leading-relaxed">
              Create customer orders, generate itemized tax receipts, and automatically deduct stock as sales are completed.
            </p>
          </div>

          <div className="grid lg:grid-cols-12 gap-8 items-center">
            {/* Left Interactive Visual Image with Hover Zoom */}
            <div className="lg:col-span-5 order-2 lg:order-1">
              <div className="relative rounded-2xl overflow-hidden border border-slate-200/90 shadow-xl group bg-white p-2">
                <div className="h-80 sm:h-96 rounded-xl overflow-hidden relative">
                  <img
                    src="/images/pos-terminal.jpg"
                    alt="Modern Touchscreen Retail POS Billing Terminal"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent"></div>
                  <div className="absolute bottom-5 left-5 right-5 text-white">
                    <span className="px-2.5 py-0.5 text-[10px] font-bold uppercase rounded bg-emerald-600 text-white inline-block mb-1">
                      Cashier Terminal
                    </span>
                    <h4 className="text-base font-black text-white">High-Speed POS Checkout Counter</h4>
                    <p className="text-[11px] text-slate-200 mt-0.5">
                      Itemized cart billing, UPI/cash payment modes, and printable customer receipts.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right 3 Feature Cards */}
            <div className="lg:col-span-7 space-y-4 order-1 lg:order-2">
              <div className="bg-slate-50 border border-slate-200/90 rounded-2xl p-6 shadow-xs hover:shadow-md transition hover:-translate-y-0.5">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                    <ShoppingCart className="w-6 h-6" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-base font-bold text-slate-900 mb-1">Quick POS Cart & Checkout</h3>
                    <p className="text-xs text-slate-600 leading-relaxed mb-3">
                      Search items instantly, adjust quantities with one click, calculate totals with tax, and checkout in seconds.
                    </p>
                    <Link to="/sales" className="text-xs font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-1">
                      <span>Launch POS Billing Terminal</span> &rarr;
                    </Link>
                  </div>
                </div>
              </div>

              <div className="bg-slate-50 border border-slate-200/90 rounded-2xl p-6 shadow-xs hover:shadow-md transition hover:-translate-y-0.5">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                    <Printer className="w-6 h-6" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-base font-bold text-slate-900 mb-1">Printable Tax Invoices</h3>
                    <p className="text-xs text-slate-600 leading-relaxed mb-3">
                      Generate official tax receipts complete with sequential invoice reference IDs, customer details, and print modals.
                    </p>
                    <Link to="/transactions" className="text-xs font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-1">
                      <span>View Invoice Archive</span> &rarr;
                    </Link>
                  </div>
                </div>
              </div>

              <div className="bg-slate-50 border border-slate-200/90 rounded-2xl p-6 shadow-xs hover:shadow-md transition hover:-translate-y-0.5">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-base font-bold text-slate-900 mb-1">Atomic Stock Deductions</h3>
                    <p className="text-xs text-slate-600 leading-relaxed mb-3">
                      Automatic database decrement ensures zero overselling, preventing stock conflicts between simultaneous counters.
                    </p>
                    <Link to="/transactions" className="text-xs font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-1">
                      <span>Explore Audit Trail</span> &rarr;
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= 7. FEATURE SECTION C: VENDOR RELATIONS & STOCK-IN (WITH HOVER IMAGE) ================= */}
      <section id="vendor-sec" className="py-16 bg-slate-50 border-b border-slate-200 scroll-mt-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mb-12">
            <span className="text-xs font-bold text-emerald-600 uppercase tracking-wider">Procurement & Intake</span>
            <h2 className="text-2xl sm:text-4xl font-black text-slate-900 mt-1">
              Keep Your Suppliers and Purchases Organized
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 mt-2 leading-relaxed">
              Record incoming stock, maintain supplier vendor profiles, and track purchase intake costs to maintain 100% accurate financial books.
            </p>
          </div>

          <div className="grid lg:grid-cols-12 gap-8 items-center">
            {/* Left 3 Feature Cards */}
            <div className="lg:col-span-7 space-y-4">
              <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-xs hover:shadow-md transition hover:-translate-y-0.5">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                    <Truck className="w-6 h-6" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-base font-bold text-slate-900 mb-1">Supplier Directory Management</h3>
                    <p className="text-xs text-slate-600 leading-relaxed mb-3">
                      Maintain wholesale supplier vendor profiles, phone numbers, contact addresses, and historical order volumes.
                    </p>
                    <Link to="/stock-in" className="text-xs font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-1">
                      <span>Manage Supplier Log</span> &rarr;
                    </Link>
                  </div>
                </div>
              </div>

              <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-xs hover:shadow-md transition hover:-translate-y-0.5">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                    <PackagePlus className="w-6 h-6" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-base font-bold text-slate-900 mb-1">Batch Stock-In Intake Entries</h3>
                    <p className="text-xs text-slate-600 leading-relaxed mb-3">
                      Record received shipment quantities, unit purchase costs, supplier invoice references, and automatically boost on-hand counts.
                    </p>
                    <Link to="/stock-in" className="text-xs font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-1">
                      <span>Record New Stock-In</span> &rarr;
                    </Link>
                  </div>
                </div>
              </div>

              <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-xs hover:shadow-md transition hover:-translate-y-0.5">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                    <Clock className="w-6 h-6" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-base font-bold text-slate-900 mb-1">Audit Trail & Procurement History</h3>
                    <p className="text-xs text-slate-600 leading-relaxed mb-3">
                      Review exactly when stock was received, which warehouse staff approved the entry, and calculate purchase expense summaries.
                    </p>
                    <Link to="/transactions" className="text-xs font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-1">
                      <span>View Procurement Ledger</span> &rarr;
                    </Link>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Interactive Visual Image with Hover Zoom */}
            <div className="lg:col-span-5">
              <div className="relative rounded-2xl overflow-hidden border border-slate-200/90 shadow-xl group bg-white p-2">
                <div className="h-80 sm:h-96 rounded-xl overflow-hidden relative">
                  <img
                    src="/images/stock-intake.jpg"
                    alt="Warehouse Supervisor scanning inventory boxes with handheld scanner"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent"></div>
                  <div className="absolute bottom-5 left-5 right-5 text-white">
                    <span className="px-2.5 py-0.5 text-[10px] font-bold uppercase rounded bg-emerald-600 text-white inline-block mb-1">
                      Inbound Quality Check
                    </span>
                    <h4 className="text-base font-black text-white">Verified Shipment Intake</h4>
                    <p className="text-[11px] text-slate-200 mt-0.5">
                      Ensure every delivered box is verified against purchase order invoices before entering inventory.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= 8. HOW IT WORKS (01, 02, 03 WORKFLOW) ================= */}
      <section id="how-it-works" className="py-16 bg-white border-b border-slate-200 scroll-mt-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-xl mx-auto mb-12">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Workflow</span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 mt-1">
              How StockPilot Works
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 mt-2">
              Intuitive 3-step operational workflow engineered for frictionless retail and warehouse speed.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Step 1 */}
            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200/80 text-center hover:shadow-md transition hover:-translate-y-1">
              <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200/70 font-black text-base flex items-center justify-center mx-auto mb-4 shadow-2xs">
                01
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-2">Add Your Products</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Create product records, assign categories, set cost and retail pricing, and configure minimum reorder thresholds.
              </p>
            </div>

            {/* Step 2 */}
            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200/80 text-center hover:shadow-md transition hover:-translate-y-1">
              <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200/70 font-black text-base flex items-center justify-center mx-auto mb-4 shadow-2xs">
                02
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-2">Process Sales & Purchases</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Use the high-speed POS billing terminal for customer checkout and record incoming supplier deliveries via stock-in intake.
              </p>
            </div>

            {/* Step 3 */}
            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200/80 text-center hover:shadow-md transition hover:-translate-y-1">
              <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200/70 font-black text-base flex items-center justify-center mx-auto mb-4 shadow-2xs">
                03
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-2">Monitor Your Inventory</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Track live quantity changes, trigger instant low-stock notifications, and inspect gross valuation analytics anytime.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ================= 9. ROLE-BASED ACCESS CONTROL (WITH EXECUTIVE LAPTOP IMAGE) ================= */}
      <section id="roles" className="py-16 bg-slate-900 text-slate-200 scroll-mt-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-[11px] font-bold text-emerald-400 uppercase tracking-widest">
              Access Governance
            </span>
            <h2 className="text-2xl sm:text-4xl font-black text-white mt-2">
              Independent Workspaces for Store Hierarchy
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-2">
              Strict separation of permissions guarantees cashiers only bill and intake stock, while store owners maintain unrestricted financial control.
            </p>
          </div>

          <div className="grid lg:grid-cols-12 gap-8 items-center mb-10">
            {/* Executive Laptop Review Image */}
            <div className="lg:col-span-5">
              <div className="relative rounded-2xl overflow-hidden border border-slate-700/80 shadow-2xl group bg-slate-800 p-2">
                <div className="h-80 sm:h-96 rounded-xl overflow-hidden relative">
                  <img
                    src="/images/executive-analytics.jpg"
                    alt="Executive Retail Owner Dashboard Review on Laptop"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/30 to-transparent"></div>
                  <div className="absolute bottom-5 left-5 right-5 text-white">
                    <span className="px-2.5 py-0.5 text-[10px] font-bold uppercase rounded bg-emerald-600 text-white inline-block mb-1">
                      Executive Analytics
                    </span>
                    <h4 className="text-base font-black text-white">Owner Financial Visibility</h4>
                    <p className="text-[11px] text-slate-300 mt-0.5">
                      Net inventory valuation, gross profit margin breakdown, and staff management console.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Role Cards: Admin vs Staff */}
            <div className="lg:col-span-7 grid sm:grid-cols-2 gap-5">
              {/* Admin Card */}
              <div className="bg-slate-800/95 border border-emerald-500/40 rounded-2xl p-6 shadow-xl flex flex-col justify-between hover:border-emerald-400 transition">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2.5">
                      <div className="w-9 h-9 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                        <ShieldCheck className="w-5 h-5 text-emerald-400" />
                      </div>
                      <div>
                        <h3 className="font-black text-white text-sm">Store Administrator</h3>
                        <p className="text-[11px] text-emerald-400 font-semibold">Executive Owner Access</p>
                      </div>
                    </div>
                  </div>

                  <ul className="space-y-2.5 my-4 text-xs text-slate-300">
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      <span>Net Inventory Valuation KPI</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      <span>Product catalog CRUD controls</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      <span>Configure reorder safety limits</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      <span>Staff account management</span>
                    </li>
                  </ul>
                </div>

                <button
                  onClick={() => navigate('/login?mode=login')}
                  className="w-full mt-4 py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs rounded-xl shadow-md transition flex items-center justify-center gap-2"
                >
                  <span>Sign In to Dashboard</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>

              {/* Staff Card */}
              <div className="bg-slate-800/95 border border-slate-700/80 rounded-2xl p-6 shadow-xl flex flex-col justify-between hover:border-slate-600 transition">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2.5">
                      <div className="w-9 h-9 rounded-xl bg-slate-700/60 text-slate-200 flex items-center justify-center">
                        <User className="w-5 h-5 text-slate-300" />
                      </div>
                      <div>
                        <h3 className="font-black text-white text-sm">Store Staff Member</h3>
                        <p className="text-[11px] text-slate-400 font-semibold">Cashier & Counter Mode</p>
                      </div>
                    </div>
                  </div>

                  <ul className="space-y-2.5 my-4 text-xs text-slate-300">
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span>High-speed barcode POS terminal</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span>Atomic stock deduction guard</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span>Printable customer tax invoices</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span>Stock-in supplier intake logs</span>
                    </li>
                  </ul>
                </div>

                <button
                  onClick={() => navigate('/login?mode=login')}
                  className="w-full mt-4 py-2.5 px-4 bg-slate-800 hover:bg-slate-700 text-slate-100 border border-slate-700 font-bold text-xs rounded-xl shadow-xs transition flex items-center justify-center gap-2"
                >
                  <span>Enter Staff Workspace</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= 10. SMART FEATURES & SECURITY ================= */}
      <section id="smart" className="py-16 bg-white border-b border-slate-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-xl mx-auto mb-12">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Reliability & Trust</span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 mt-1">Built for Secure, Reliable Operations</h2>
            <p className="text-xs text-slate-500 mt-1">
              Protect business data and maintain accurate inventory records with controlled access and instant alerts.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 hover:shadow-md transition hover:-translate-y-0.5">
              <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-3">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <h4 className="text-xs font-bold text-slate-900 mb-1">Secure Authentication</h4>
              <p className="text-[11px] text-slate-600 leading-relaxed">
                Password encryption via bcrypt, signed JSON Web Tokens (JWT), and seamless 1-click Google Sign-In.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 hover:shadow-md transition hover:-translate-y-0.5">
              <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-3">
                <Users className="w-4 h-4" />
              </div>
              <h4 className="text-xs font-bold text-slate-900 mb-1">Role-Based Access</h4>
              <p className="text-[11px] text-slate-600 leading-relaxed">
                Distinct Admin and Staff route authorization guards prevent unauthorized modifications.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 hover:shadow-md transition hover:-translate-y-0.5">
              <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-3">
                <AlertTriangle className="w-4 h-4" />
              </div>
              <h4 className="text-xs font-bold text-slate-900 mb-1">Stock Notifications</h4>
              <p className="text-[11px] text-slate-600 leading-relaxed">
                Instant threshold calculation identifies low-stock items in real-time to avoid inventory outages.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 hover:shadow-md transition hover:-translate-y-0.5">
              <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-3">
                <Clock className="w-4 h-4" />
              </div>
              <h4 className="text-xs font-bold text-slate-900 mb-1">Transaction History</h4>
              <p className="text-[11px] text-slate-600 leading-relaxed">
                Full immutable audit logging of each customer counter sale and supplier purchase receipt.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ================= 11. FAQ SECTION ================= */}
      <section id="faq" className="py-16 bg-slate-50 border-b border-slate-200 scroll-mt-20">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Common Questions</span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 mt-1">Frequently Asked Questions</h2>
            <p className="text-xs text-slate-500 mt-1">
              Everything you need to know about StockPilot Inventory platform and workflows.
            </p>
          </div>

          <div className="space-y-3">
            {faqData.map((item, index) => (
              <div
                key={index}
                className="border border-slate-200 rounded-xl overflow-hidden bg-white shadow-2xs transition"
              >
                <button
                  type="button"
                  onClick={() => toggleFaq(index)}
                  className="w-full py-4 px-5 text-left flex items-center justify-between font-bold text-xs sm:text-sm text-slate-900 hover:text-emerald-700 transition"
                >
                  <span>{item.q}</span>
                  <ChevronDown
                    className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${
                      openFaq === index ? 'rotate-180 text-emerald-600' : ''
                    }`}
                  />
                </button>
                {openFaq === index && (
                  <div className="px-5 pb-4 pt-1 text-xs text-slate-600 leading-relaxed border-t border-slate-100 bg-slate-50/50">
                    {item.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= 12. FINAL CALL TO ACTION ================= */}
      <section className="py-16 bg-slate-900 text-white relative overflow-hidden">
        <div className="max-w-4xl mx-auto px-4 text-center relative z-10">
          <h2 className="text-2xl sm:text-4xl lg:text-5xl font-black tracking-tight">
            Ready to Simplify Your Inventory?
          </h2>
          <p className="mt-3 text-xs sm:text-sm lg:text-base text-slate-300 max-w-xl mx-auto leading-relaxed">
            Start organizing your products, tracking stock levels, and managing sales counter transactions from one unified place.
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Link
              to="/login?mode=register"
              className="px-6 py-3 rounded-xl text-xs sm:text-sm font-bold text-white bg-emerald-600 hover:bg-emerald-700 shadow-md shadow-emerald-600/30 transition flex items-center gap-2 hover:-translate-y-0.5"
            >
              <span>Create Your Account</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              to="/login?mode=login"
              className="px-6 py-3 rounded-xl text-xs sm:text-sm font-bold text-slate-200 bg-slate-800 hover:bg-slate-700 border border-slate-700 transition hover:-translate-y-0.5"
            >
              Sign In
            </Link>
          </div>
        </div>
      </section>

      {/* ================= 13. COMPREHENSIVE 4-COLUMN FOOTER ================= */}
      <footer className="py-12 bg-slate-950 text-slate-400 text-xs border-t border-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
            {/* Col 1: Brand Info */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <span className="font-bold text-white text-sm">StockPilot Inventory</span>
              </div>
              <p className="text-slate-400 text-[11px] leading-relaxed">
                Simplifying inventory management, POS counter sales, and supplier purchase intake operations for modern retail businesses.
              </p>
            </div>

            {/* Col 2: Product */}
            <div className="space-y-2.5">
              <p className="text-white font-bold text-xs uppercase tracking-wider">Product</p>
              <ul className="space-y-2 text-[11px]">
                <li>
                  <a href="#features" className="hover:text-white transition">Product Management</a>
                </li>
                <li>
                  <a href="#customer-sec" className="hover:text-white transition">Point of Sale (POS)</a>
                </li>
                <li>
                  <a href="#vendor-sec" className="hover:text-white transition">Supplier Stock-In</a>
                </li>
                <li>
                  <a href="#dashboard-preview" className="hover:text-white transition">Inventory Analytics</a>
                </li>
              </ul>
            </div>

            {/* Col 3: Account */}
            <div className="space-y-2.5">
              <p className="text-white font-bold text-xs uppercase tracking-wider">Account</p>
              <ul className="space-y-2 text-[11px]">
                <li>
                  <Link to="/login?mode=login" className="hover:text-white transition">Sign In</Link>
                </li>
                <li>
                  <Link to="/login?mode=register" className="hover:text-white transition">Create Account</Link>
                </li>
                <li>
                  <a href="#roles" className="hover:text-white transition">RBAC Permissions</a>
                </li>
              </ul>
            </div>

            {/* Col 4: Enterprise Reliability */}
            <div className="space-y-2.5">
              <p className="text-white font-bold text-xs uppercase tracking-wider">Enterprise Reliability</p>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                Cloud-synchronized multi-terminal stock management, role-guarded permissions, and atomic transaction deductions for modern retail businesses.
              </p>
              <div className="pt-1 flex items-center gap-2 text-[10px] text-emerald-400 font-mono">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                <span>Cloud High-Availability Active</span>
              </div>
            </div>
          </div>

          <div className="pt-6 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-slate-500">
            <p>&copy; 2026 StockPilot Inventory Inc. All rights reserved.</p>
            <p>Enterprise Point-of-Sale & Inventory Management Platform.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
