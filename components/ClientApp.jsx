"use client";
import { useState, useEffect, useRef } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, LineChart, Line, CartesianGrid, Legend, AreaChart, Area } from "recharts";
import { Home, Mouse, Trophy, Cpu, Users, Gamepad2, Building2, TrendingUp, GitCompare, Search, X, FlaskConical, Crosshair, Layers, Shield, ChevronDown } from "lucide-react";
import { AMAZON_TAG, amazonLink, BRAND_COLORS, MOUSE_DIMS, MOUSE_IMAGE_URLS, MOUSE_DESCRIPTIONS, BRAND_IMAGE_URLS, GAME_IMAGE_URLS, GAME_DESCRIPTIONS, TEAM_DESCRIPTIONS, TEAM_LOGOS, I, icon, mice, proPlayers, extendedPlayers, allPlayers, brandMarketShare, gameBreakdown, weightTrend, pollingTrend, wirelessTrend, priceTrend, countryName } from "@/data";
import { PLAYER_BIOS } from "@/data/bios";
import { GlowText, StatBox, SectionTitle, MouseCard, CustomTooltip, Flag } from "@/components/ui";

const TOP250 = new Set(["s1mple","ZywOo","NiKo","donk","m0NESY","TenZ","Scump","shroud","ImperialHal","Puppey","Faker","aspas","device","coldzera","Bugha","Shotzzy","Chovy","ropz","Proper","Beaulo","yay","Simp","electronic","Crimsix","N0tail","Twistzz","Demon1","Showmaker","EliGE","FalleN","Caps","MrSavage","rain","Profit","ScreaM","Karma","Shaiiko","olofmeister","Keria","f0rest","GeT_RiGhT","Yatoro","aceu","Clix","cNed","sh1ro","Clayster","Dendi","Zeus","TGLTN","broky","Alfajer","Jjonak","Cellium","b1t","Genburten","TaySon","gla1ve","Gumayusi","Paluh","karrigan","Derke","aBeZy","Mongraal","dupreeh","Collapse","Spoit","SP9RK1E","Oner","arT","crashies","Peterbot","KuroKy","huNter","Ras","Viper","Dashy","Fleta","Boaster","EpikWhale","jstn","Xyp9x","Magisk","Pengu","ana","Leave","f0rsakeN","Ax1Le","Jeemzz","Albralelie","Brollan","Deft","Formal","shox","Jinggg","Topson","Shrimzy","Hardecki","Kaydop","Canadian","Jimpphat","Less","Jankos","Ceb","HusKerrs","aqua","CTZN","blameF","stax","Rekkles","Carpe","Pred","Kickstart","stavn","Nisha","Queasy","Dropped","Super","njr","MaKo","NAF","Ruler","fer","nAts","Kenny","iNSaNiA","Squishy","Khanada","hwinn","YEKINDAR","SpiriTz","Nesk","Stewie2K","Zekken","CoreJJ","iceiceice","nyhrox","Vadeal","HisWattson","kscerato","SlasheR","something","Gustav","Kevster","Frozen","Arcitys","dafran","GarrettG","BrokenBlade","flameZ","Sacy","Envoy","Chapix","supr","tabseN","cr1t-","Mande","Elyoya","Fexx","Perfecto","Shao","Fairy Peak","Noahreyli","Doki","Hydra","nitr0","abed","Knight","Reps","Chronicle","Pio","woxic","Attach","Bucke","Alem4o","XANTARES","leaf","miCKe","Bin","xQc","Selly","Insight","iLLeY","jawgemo","Andilex","Brehze","cameram4n","Hans Sama","Kinstaar","Skyz","mxey","KRIMZ","saadhak","emongg","Stompy","Cyber","autimatic","Crylix","Ninja","Malibuca","cadiaN","sinatraa","Suygetsu","Upset","Larssen","TimTheTatman","ibiza","Muz","Yuzus","Jame","Lou","bogur","ZmjjKK","hampus","luke12","Tfue","soulz1","BuZz","HooXi","Hiko","9impulse","Japko","jabbi","Asuna","Aleksib","aLOW","BriD","Viol2t","Subroza","benjyfishy","Necros","Seagull","lyr1c","Boombl4","pollofn","Solotov","lionkk","mezii","Spinx","t3xture","kyxsan","n0thing","mL7","Kenzo","WARDELL","Veno","Primmie","Bestoloch","ShahZaM","YukaF","rapha","vengeurR","toxjq","k1llsen","cYpheR","RAISY","Cooller","clawz","DaHanG","Av3k","serious","Xron","maxter"]);
const GAME_COLORS = { CS2: "#ff8c00", Valorant: "#ff4655", "League of Legends": "#c89b3c", LoL: "#c89b3c", Fortnite: "#4c7bd9", "Dota 2": "#e74c3c", "R6 Siege": "#4a86c8", "Rocket League": "#1a9fff", "Call of Duty": "#5cb85c", "Overwatch 2": "#f99e1a", Apex: "#dc2626", "Marvel Rivals": "#ed1d24", PUBG: "#f2a900", Deadlock: "#8b5cf6", "Quake Champions": "#ce4a00" };

const shuffle = (arr) => { const a = [...arr]; for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };

/* ─── Animated Counter: counts up from 0 when scrolled into view ─── */
function AnimatedCounter({ value, duration = 1800, color, suffix = "", prefix = "", className = "", style = {} }) {
  const [display, setDisplay] = useState("0");
  const [hasAnimated, setHasAnimated] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    if (hasAnimated || !ref.current) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated) {
          setHasAnimated(true);
          observer.disconnect();
        }
      },
      { threshold: 0.3 }
    );
    observer.observe(ref.current);
    return () => observer.disconnect();
  }, [hasAnimated]);

  useEffect(() => {
    if (!hasAnimated) return;
    const raw = String(value).replace(/[^0-9.]/g, "");
    const target = parseFloat(raw) || 0;
    const isFloat = raw.includes(".");
    const steps = 60;
    const stepTime = duration / steps;
    let frame = 0;
    const easeOutQuart = (t) => 1 - Math.pow(1 - t, 4);
    const timer = setInterval(() => {
      frame++;
      const progress = easeOutQuart(Math.min(frame / steps, 1));
      const current = progress * target;
      setDisplay(isFloat ? current.toFixed(1) : Math.round(current).toLocaleString());
      if (frame >= steps) { clearInterval(timer); setDisplay(isFloat ? target.toFixed(1) : target.toLocaleString()); }
    }, stepTime);
    return () => clearInterval(timer);
  }, [hasAnimated, value, duration]);

  return (
    <span ref={ref} className={className} style={{ color, ...style }}>
      {prefix}{hasAnimated ? display : "0"}{suffix}
    </span>
  );
}

// Tab-to-route mapping
const TAB_ROUTES = {
  overview: "/",
  mice: "/mice",
  rankings: "/rankings",
  sensors: "/sensors",
  players: "/players",
  games: "/games",
  brands: "/brands",
  trends: "/trends",
  compare: "/compare",
  lab: "/lab",
  shapes: "/shapes",
  sensitivity: "/sensitivity",
  mouseDetail: "/mice",
  teams: "/teams",
  teamDetail: "/teams",
};

// ─── MAIN APP ────────────────────────────────────────────────────────────────

export default function EsportsMice({ initialTab = "overview", initialMouseSlug = null, initialPlayerSlug = null, initialGameSlug = null, initialTeam = null }) {
  const router = useRouter();
  const [selectedMouse, setSelectedMouse] = useState(() => {
    if (initialMouseSlug) {
      const found = mice.find(m => m.name.toLowerCase().replace(/\+/g, "-plus").replace(/[^a-z0-9]+/g, '-').replace(/-+$/, '') === initialMouseSlug);
      return found || mice[0];
    }
    return mice[0];
  });
  const [activeTab, setActiveTabRaw] = useState(initialTab);
  const [tabFade, setTabFade] = useState(true); // true = visible, false = fading out
  const [gameDetailSlug, setGameDetailSlug] = useState(initialGameSlug || null);  const setActiveTab = (tab) => {
    if (tab === activeTab) return;
    setTabFade(false); // fade out
    setTimeout(() => {
      setActiveTabRaw(tab);
      const route = TAB_ROUTES[tab];
      if (route && tab !== "mouseDetail") {
        router.push(route, { scroll: false });
      }
      // Small delay before fade in so new content renders first
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setTabFade(true); // fade in
        });
      });
    }, 180); // matches CSS transition duration
  };
  const skipScrollOnTabChange = useRef(false);
  const playerListScrollPos = useRef(0);
  useEffect(() => {
    if (skipScrollOnTabChange.current) { skipScrollOnTabChange.current = false; return; }
    // Don't scroll to top if we're restoring list position (browser back)
    try {
      if (initialTab === "players" && !initialPlayerSlug) {
        const saved = sessionStorage.getItem("playerListScroll");
        if (saved && parseInt(saved, 10) > 0) return;
      }
      if (initialTab === "mice" && !initialMouseSlug) {
        const saved = sessionStorage.getItem("mouseListScroll");
        if (saved && parseInt(saved, 10) > 0) return;
      }
    } catch {}
    window.scrollTo({ top: 0 });
  }, [activeTab]);

  // Update document title when switching tabs
  useEffect(() => {
    const TAB_TITLES = {
      overview: "EsportsMice — The Definitive Guide to Pro Esports Mice",
      mice: "All Esports Mice — Complete Database & Rankings | EsportsMice",
      rankings: "Mouse Rankings — Pro Esports Mouse Tier List | EsportsMice",
      sensors: "Sensor Database — Compare Gaming Mouse Sensors | EsportsMice",
      players: "Pro Player Settings — DPI, Sensitivity & Gear | EsportsMice",
      games: "Esports Games — Mouse Usage by Title | EsportsMice",
      brands: "Mouse Brands — Compare Razer, Logitech & More | EsportsMice",
      trends: "Industry Trends — Weight, Wireless & Polling Data | EsportsMice",
      compare: "Compare Mice — Side-by-Side Specifications | EsportsMice",
      lab: "Mouse Lab — Find Your Perfect Mouse | EsportsMice",
      shapes: "Shape Overlay — Compare Mouse Dimensions | EsportsMice",
      sensitivity: "Sensitivity Converter — Convert Between Games | EsportsMice",
      teams: "Pro Teams — Esports Team Gear & Settings | EsportsMice",
    };
    if (TAB_TITLES[activeTab]) document.title = TAB_TITLES[activeTab];
  }, [activeTab]);

  const [selectedPlayer, setSelectedPlayer] = useState(() => {
    if (initialPlayerSlug) {
      const found = proPlayers.find(p => p.name.toLowerCase().replace(/\+/g, "-plus").replace(/[^a-z0-9]+/g, '-').replace(/-+$/, '') === initialPlayerSlug);
      return found || null;
    }
    return null;
  });

  // Restore scroll position when returning to players/mice list via browser back
  useEffect(() => {
    try {
      if (initialTab === "players" && !initialPlayerSlug) {
        const saved = sessionStorage.getItem("playerListScroll");
        if (saved) {
          const pos = parseInt(saved, 10);
          if (pos > 0) {
            setTimeout(() => { window.scrollTo({ top: pos, behavior: "instant" }); }, 50);
            sessionStorage.removeItem("playerListScroll");
          }
        }
      }
      if (initialTab === "mice" && !initialMouseSlug) {
        const saved = sessionStorage.getItem("mouseListScroll");
        if (saved) {
          const pos = parseInt(saved, 10);
          if (pos > 0) {
            setTimeout(() => { window.scrollTo({ top: pos, behavior: "instant" }); }, 50);
            sessionStorage.removeItem("mouseListScroll");
          }
        }
      }
    } catch {}
  }, []);
  const [sortBy, setSortBy] = useState("proUsage");
  const [filterBrand, setFilterBrand] = useState("All");
  const [filterWeight, setFilterWeight] = useState("All");
  const [filterPrice, setFilterPrice] = useState("All");
  const [filterConn, setFilterConn] = useState("All");
  const [filterShape, setFilterShape] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [showComparison, setShowComparison] = useState(false);
  const [compareList, setCompareList] = useState([mice[0], mice[1]]);
  const [heroAnim, setHeroAnim] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [gameFilter, setGameFilter] = useState("All");
  const [playerSort, setPlayerSort] = useState({ key: null, dir: "asc" });
  const [roleFilter, setRoleFilter] = useState("All");
  const [mouseFilter, setMouseFilter] = useState("");
  const [teamFilter, setTeamFilter] = useState("");
  const [countryFilter, setCountryFilter] = useState("All");
  const [dpiRange, setDpiRange] = useState([0, 10000]);
  const [showFilters, setShowFilters] = useState(false);
  const [showSortDrop, setShowSortDrop] = useState(false);
  const [profileOnly, setProfileOnly] = useState(false);
  const [playerPage, setPlayerPage] = useState(0);
  const PLAYERS_PER_PAGE = 50;
  const [rankingSort, setRankingSort] = useState({ key: "proUsage", dir: "desc" });
  const [sensorSort, setSensorSort] = useState({ key: "totalUsage", dir: "desc" });
  const [brandScoreSort, setBrandScoreSort] = useState({ key: "proShare", dir: "desc" });
  const [sensorGameFilter, setSensorGameFilter] = useState("All");
  const [compareSensor1, setCompareSensor1] = useState(null);
  const [compareSensor2, setCompareSensor2] = useState(null);
  const [mobileMenu, setMobileMenu] = useState(false);
  const [globalSearch, setGlobalSearch] = useState("");
  const [globalSearchOpen, setGlobalSearchOpen] = useState(false);
  const globalSearchRef = useRef(null);
  const globalSearchInputRef = useRef(null);
  const [quizStep, setQuizStep] = useState(0);
  const [quizAnswers, setQuizAnswers] = useState({
    handLength: "", handWidth: "", grip: "", games: [], priorities: [],
    weightPref: "", connectivity: "", budget: "", shape: "",
  });
  const [quizDone, setQuizDone] = useState(false);
  const [sensFromGame, setSensFromGame] = useState("cs2");
  const [sensFromDpi, setSensFromDpi] = useState(800);
  const [sensFromSens, setSensFromSens] = useState(1.0);
  const [sensShowPros, setSensShowPros] = useState(false);
  const [teamSearch, setTeamSearch] = useState("");
  const [teamGameFilter, setTeamGameFilter] = useState("All");
  const [teamSortBy, setTeamSortBy] = useState("playerCount");
  const [showTeamSortDrop, setShowTeamSortDrop] = useState(false);
  const [showTeamFilters, setShowTeamFilters] = useState(false);
  const [selectedTeam, setSelectedTeam] = useState(initialTeam);
  const [expandedRosters, setExpandedRosters] = useState({});
  const [newsletterEmail, setNewsletterEmail] = useState("");
  const [newsletterStatus, setNewsletterStatus] = useState(null);
  const [newsletterPopup, setNewsletterPopup] = useState(false);
  const [shapeMouseA, setShapeMouseA] = useState(null);
  const [shapeMouseB, setShapeMouseB] = useState(null);
  const [shapeView, setShapeView] = useState("overlay"); // overlay | side
  const [shapeAngle, setShapeAngle] = useState("top"); // top | profile

  useEffect(() => { setTimeout(() => setHeroAnim(true), 100); }, []);

  // Navigation helpers for Next.js routing
  const mouseSlug = (mouse) => mouse.name.toLowerCase().replace(/\+/g, "-plus").replace(/[^a-z0-9]+/g, '-').replace(/-+$/, '');
  const playerSlug = (player) => player.name.toLowerCase().replace(/\+/g, "-plus").replace(/[^a-z0-9]+/g, '-').replace(/-+$/, '');

  const navigateToMouse = (mouse) => {
    try { sessionStorage.setItem("mouseListScroll", String(window.scrollY)); } catch {}
    // Save to recently viewed
    try {
      const recent = JSON.parse(sessionStorage.getItem("recentMice") || "[]");
      const updated = [mouse.name, ...recent.filter(n => n !== mouse.name)].slice(0, 6);
      sessionStorage.setItem("recentMice", JSON.stringify(updated));
    } catch {}
    setTabFade(false);
    setTimeout(() => {
      setSelectedMouse(mouse);
      setActiveTabRaw("mouseDetail");
      router.push(`/mice/${mouseSlug(mouse)}`, { scroll: false });
      requestAnimationFrame(() => { requestAnimationFrame(() => { setTabFade(true); }); });
    }, 180);
  };

  const navigateToPlayer = (player) => {
    playerListScrollPos.current = window.scrollY;
    try { sessionStorage.setItem("playerListScroll", String(window.scrollY)); } catch {}
    setTabFade(false);
    setTimeout(() => {
      setSelectedPlayer(player);
      setActiveTabRaw("players");
      router.push(`/players/${playerSlug(player)}`, { scroll: false });
      requestAnimationFrame(() => { requestAnimationFrame(() => { setTabFade(true); }); });
    }, 180);
  };

  useEffect(() => {
    const handleScroll = () => setShowScrollTop(window.scrollY > 600);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // ─── GLOBAL SEARCH: Cmd/Ctrl+K shortcut ───
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setGlobalSearchOpen(true);
        setTimeout(() => globalSearchInputRef.current?.focus(), 50);
      }
      if (e.key === "Escape") {
        setGlobalSearchOpen(false);
        setGlobalSearch("");
        setMobileMenu(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // ─── GLOBAL SEARCH: Click backdrop to close ───
  const handleSearchBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      setGlobalSearchOpen(false);
      setGlobalSearch("");
    }
  };

  // ─── GLOBAL SEARCH: Compute results ───
  const globalSearchResults = (() => {
    const q = globalSearch.toLowerCase().trim();
    if (!q || q.length < 2) return { mice: [], players: [], teams: [], games: [], brands: [] };

    const matchedMice = mice.filter(m =>
      m.name.toLowerCase().includes(q) || m.brand.toLowerCase().includes(q) || m.sensor.toLowerCase().includes(q)
    ).slice(0, 5);

    const matchedPlayers = allPlayers.filter(p =>
      p.name.toLowerCase().includes(q) || (p.team && p.team.toLowerCase().includes(q)) || (p.fullName && p.fullName.toLowerCase().includes(q))
    ).sort((a, b) => (b.hasProfile ? 1 : 0) - (a.hasProfile ? 1 : 0)).slice(0, 8);

    const teamSet = new Set();
    allPlayers.forEach(p => { if (p.team && p.team.toLowerCase().includes(q) && p.team !== "Content" && p.team !== "Free Agent" && p.team !== "Retired") teamSet.add(p.team); });
    const matchedTeams = [...teamSet].slice(0, 5).map(t => {
      const players = allPlayers.filter(p => p.team === t);
      const games = [...new Set(players.map(p => p.game))];
      return { name: t, playerCount: players.length, games };
    });

    const gameColors = GAME_COLORS;
    const gameNames = { CS2: "Counter-Strike 2", Valorant: "Valorant", LoL: "League of Legends", Fortnite: "Fortnite", "Overwatch 2": "Overwatch 2", Apex: "Apex Legends", "Dota 2": "Dota 2", "R6 Siege": "Rainbow Six Siege", "Rocket League": "Rocket League", "Call of Duty": "Call of Duty", "Marvel Rivals": "Marvel Rivals", PUBG: "PUBG", Deadlock: "Deadlock", "Quake Champions": "Quake Champions" };
    const matchedGames = Object.keys(gameColors).filter(g => {
      const gLower = g.toLowerCase();
      const fullName = (gameNames[g] || g).toLowerCase();
      return gLower.includes(q) || fullName.includes(q);
    }).slice(0, 4).map(g => ({ id: g, name: gameNames[g] || g, color: gameColors[g], playerCount: allPlayers.filter(p => p.game === g).length }));

    const matchedBrands = Object.keys(BRAND_COLORS).filter(b =>
      b.toLowerCase().includes(q)
    ).slice(0, 4).map(b => ({ name: b, color: BRAND_COLORS[b], mouseCount: mice.filter(m => m.brand === b).length }));

    return { mice: matchedMice, players: matchedPlayers, teams: matchedTeams, games: matchedGames, brands: matchedBrands };
  })();

  const globalSearchHasResults = globalSearch.length >= 2 && (globalSearchResults.mice.length + globalSearchResults.players.length + globalSearchResults.teams.length + globalSearchResults.games.length + globalSearchResults.brands.length) > 0;
  const globalSearchNoResults = globalSearch.length >= 2 && !globalSearchHasResults;

  const handleSearchResultClick = (type, item) => {
    // Navigate first
    if (type === "mouse") {
      navigateToMouse(item);
    } else if (type === "player") {
      const pp = proPlayers.find(pp => pp.name === item.name && pp.game === item.game);
      if (pp) {
        navigateToPlayer(pp);
      } else {
        setSelectedPlayer(null);
        setGameFilter(item.game || "All");
        setActiveTab("players");
        router.push("/players");
      }
    } else if (type === "team") {
      setSelectedPlayer(null);
      setGameFilter("All");
      setSearchQuery(item.name);
      setActiveTab("players");
    } else if (type === "game") {
      skipScrollOnTabChange.current = true;
      setActiveTab("games");
      setTimeout(() => {
        const el = document.getElementById(`game-${item.id.replace(/\s+/g, '-').toLowerCase()}`);
        if (el) {
          const y = el.getBoundingClientRect().top + window.scrollY - 60;
          window.scrollTo({ top: y, behavior: "smooth" });
        }
      }, 100);
    } else if (type === "brand") {
      skipScrollOnTabChange.current = true;
      setActiveTab("brands");
      setTimeout(() => {
        const el = document.getElementById(`brand-${item.name.replace(/\s+/g, '-').toLowerCase()}`);
        if (el) {
          const y = el.getBoundingClientRect().top + window.scrollY - 60;
          window.scrollTo({ top: y, behavior: "smooth" });
        }
      }, 100);
    }
    // Close overlay after navigation state is set
    setGlobalSearch("");
    setGlobalSearchOpen(false);
  };

  const sortedMice = [...mice]
    .filter(m => filterBrand === "All" || m.brand === filterBrand)
    .filter(m => {
      if (filterWeight === "All") return true;
      if (filterWeight === "Ultralight") return m.weight < 50;
      if (filterWeight === "Light") return m.weight >= 50 && m.weight < 65;
      if (filterWeight === "Medium") return m.weight >= 65 && m.weight < 85;
      if (filterWeight === "Heavy") return m.weight >= 85;
      return true;
    })
    .filter(m => {
      if (filterPrice === "All") return true;
      if (filterPrice === "Budget") return m.price < 60;
      if (filterPrice === "Mid") return m.price >= 60 && m.price < 120;
      if (filterPrice === "Premium") return m.price >= 120;
      return true;
    })
    .filter(m => filterConn === "All" || m.connectivity === filterConn)
    .filter(m => filterShape === "All" || m.shape === filterShape)
    .filter(m => m.name.toLowerCase().includes(searchQuery.toLowerCase()) || m.brand.toLowerCase().includes(searchQuery.toLowerCase()))
    .sort((a, b) => {
      if (sortBy === "proUsage") return b.proUsage - a.proUsage;
      if (sortBy === "weight") return a.weight - b.weight;
      if (sortBy === "price") return a.price - b.price;
      if (sortBy === "rating") return b.rating - a.rating;
      if (sortBy === "pollingRate") return b.pollingRate - a.pollingRate;
      if (sortBy === "name") return a.name.localeCompare(b.name);
      if (sortBy === "releaseYear") return (b.releaseYear || 0) - (a.releaseYear || 0);
      return 0;
    });

  const radarData = selectedMouse ? [
    { stat: "Lightness", value: Math.max(0, 100 - selectedMouse.weight), fullMark: 100 },
    { stat: "Sensor", value: Math.min(100, (selectedMouse.dpi / 44000) * 100), fullMark: 100 },
    { stat: "Poll Rate", value: (selectedMouse.pollingRate / 8000) * 100, fullMark: 100 },
    { stat: "Pro Usage", value: selectedMouse.proUsage * 4, fullMark: 100 },
    { stat: "Rating", value: selectedMouse.rating * 10, fullMark: 100 },
    { stat: "Value", value: Math.max(0, 100 - (selectedMouse.price / 2)), fullMark: 100 },
  ] : [];

  const PRO_FAME = {
    // Tier S — GOATs / household names (100)
    s1mple:100, Faker:100, TenZ:100, NiKo:100, ZywOo:100, device:100, Shotzzy:100, Bugha:100, ImperialHal:100, Dendi:100,
    // Tier A — superstars (90)
    donk:90, "m0NESY":90, aspas:90, Demon1:90, ropz:90, Twistzz:90, rain:90, electronic:90, Showmaker:90, Puppey:90,
    dupreeh:90, "gla1ve":90, Xyp9x:90, Stewie2K:90, Clix:90, MrSavage:90, Proper:90, Profit:90, KuroKy:90, yay:90,
    // Tier B — star players (80)
    "sh1ro":80, b1t:80, huNter:80, Magisk:80, NAF:80, EliGE:80, ScreaM:80, YEKINDAR:80, Alfajer:80, Derke:80,
    Boaster:80, crashies:80, Marved:80, cNed:80, Chovy:80, Caps:80, Simp:80, aBeZy:80, Cellium:80,
    broky:80, blameF:80, XANTARES:80, woxic:80, Brollan:80, Aleksib:80, Gumayusi:80, Zeus:80, Keria:80,
    CoreJJ:80, Deft:80, BrokenBlade:80, Kevster:80, Peterbot:80, Genburten:80,
    // Tier C — well-known (70)
    "f0rsakeN":70, something:70, leaf:70, jawgemo:70, Chronicle:70, Less:70, MaKo:70, stax:70, BuZz:70,
    Jimpphat:70, Spinx:70, REZ:70, flameZ:70, frozen:70, ax1Le:70, cadiaN:70, nafany:70, hobbit:70,
    saadhak:70, FNS:70, Sacy:70, pancada:70, tuyz:70, Leo:70, Rb:70, Zest:70,
    Oner:70, Viper:70, "Hans Sama":70, Nisha:70, "cr1t-":70, TORONTOTOKYO:70, Ras:70,
    arT:70, Beaulo:70, Shaiiko:70, Paluh:70, Jstn:70, Yatoro:70, Collapse:70,
  };
  const usedByPros = shuffle(allPlayers.filter(p => {
    if (!selectedMouse?.name || !p.mouse) return false;
    if (!TOP250.has(p.name)) return false;
    const mn = selectedMouse.name.toLowerCase();
    const pm = p.mouse.toLowerCase();
    return pm === mn || pm.includes(mn) || mn.includes(pm);
  }));

  const topBrands = Object.entries(
    mice.reduce((acc, m) => { acc[m.brand] = (acc[m.brand] || 0) + m.proUsage; return acc; }, {})
  ).sort((a, b) => b[1] - a[1]);

  const proUsageChart = (() => {
    const counts = {};
    allPlayers.forEach(p => { counts[p.mouse] = (counts[p.mouse] || 0) + 1; });
    return Object.entries(counts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 15)
      .map(([name, count]) => {
        const m = mice.find(mm => mm.name === name || name.includes(mm.name) || mm.name.includes(name) || mm.name.toLowerCase() === name.toLowerCase());
        let fill = m ? (BRAND_COLORS[m.brand] || "#888") : "#888";
        if (!m) {
          const n = name.toLowerCase();
          if (n.includes("zowie") || n.startsWith("ec") || n.startsWith("fk") || n.startsWith("za") || n.startsWith("s2") || n.startsWith("u2")) fill = BRAND_COLORS["Zowie"];
          else if (n.includes("razer") || n.includes("viper") || n.includes("deathadder") || n.includes("basilisk")) fill = BRAND_COLORS["Razer"];
          else if (n.includes("logitech") || n.includes("g pro")) fill = BRAND_COLORS["Logitech"];
          else if (n.includes("finalmouse") || n.includes("ultralight") || n.includes("starlight")) fill = BRAND_COLORS["Finalmouse"];
          else if (n.includes("vaxee") || n.includes("zygen") || n.includes("np-01") || n.includes("outset")) fill = BRAND_COLORS["Vaxee"];
          else if (n.includes("lamzu") || n.includes("maya") || n.includes("atlantis")) fill = BRAND_COLORS["Lamzu"];
          else if (n.includes("pulsar") || n.includes("xlite")) fill = BRAND_COLORS["Pulsar"];
          else if (n.includes("steelseries") || n.includes("aerox") || n.includes("rival")) fill = BRAND_COLORS["SteelSeries"];
          else if (n.includes("corsair") || n.includes("sabre")) fill = BRAND_COLORS["Corsair"];
        }
        return { name: name.replace(/(Logitech |Razer |Finalmouse |ZOWIE |Zowie )/, ""), usage: parseFloat((count / allPlayers.length * 100).toFixed(1)), fill };
      });
  })();

  const pieData = brandMarketShare.filter(b => b.name !== "Other").map(b => ({
    name: b.name, value: b.share, fill: BRAND_COLORS[b.name] || "#888"
  }));
  pieData.push({ name: "Other", value: (brandMarketShare.find(b => b.name === "Other") || { share: 3 }).share, fill: "#333" });

  const tabs = [
    { id: "overview", label: "Overview", icon: Home, color: "#00ff6a" },
    { id: "mice", label: "All Mice", icon: Mouse, color: "#c084fc" },
    { id: "rankings", label: "Rankings", icon: Trophy, color: "#d4af37" },
    { id: "sensors", label: "Sensors", icon: Cpu, color: "#10b981" },
    { id: "players", label: "Pro Players", icon: Users, color: "#00b4ff" },
    { id: "lab", label: "Lab", icon: FlaskConical, color: "#f59e0b" },
    { id: "sensitivity", label: "Sensitivity", icon: Crosshair, color: "#8b5cf6" },
    { id: "games", label: "Games", icon: Gamepad2, color: "#ff4655" },
    { id: "brands", label: "Brands", icon: Building2, color: "#e879f9" },
    { id: "teams", label: "Teams", icon: Shield, color: "#38bdf8" },
    { id: "trends", label: "Trends", icon: TrendingUp, color: "#f472b6" },
    { id: "compare", label: "Compare", icon: GitCompare, color: "#f97316" },
    { id: "shapes", label: "Shapes", icon: Layers, color: "#14b8a6" },
  ];

  const allBrands = ["All", ...new Set(mice.map(m => m.brand))];

  return (
    <div className="min-h-screen text-white" style={{ background: "#050505", fontFamily: "'Inter', system-ui, -apple-system, sans-serif" }}>
      <style>{`
        * { -webkit-font-smoothing: antialiased; -moz-osx-font-smoothing: grayscale; text-rendering: optimizeLegibility; }
        @media (max-width: 640px) {
          table { font-size: 11px !important; }
          table th, table td { padding: 6px 8px !important; white-space: nowrap; }
          .recharts-wrapper { font-size: 12px; }
          .recharts-polar-angle-axis-tick text { font-size: 11px !important; }
        }
        img[src*="/images/mice/"] {
          object-fit: contain;
          object-position: center;
        }
        * { -webkit-tap-highlight-color: transparent; }
        ::-webkit-scrollbar { width: 6px; height: 6px; }
        ::-webkit-scrollbar-thumb { background: #ffffff15; border-radius: 3px; }
        ::-webkit-scrollbar-track { background: transparent; }
      `}</style>

      {/* Skip to content for accessibility */}
      <a href="#main-content" className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[200] focus:px-4 focus:py-2 focus:rounded-lg focus:font-bold" style={{ background: "#00ff6a", color: "#000" }}>Skip to content</a>

      {/* ─── GLOBAL SEARCH OVERLAY ─── */}
      {globalSearchOpen && (
        <div role="dialog" aria-label="Search" aria-modal="true" onClick={handleSearchBackdropClick} className="fixed inset-0 z-[100] flex items-start justify-center pt-[10vh] sm:pt-[15vh] px-4" style={{ background: "rgba(0,0,0,0.75)", backdropFilter: "blur(8px)" }}>
          <div ref={globalSearchRef} role="search" className="w-full max-w-lg rounded-2xl overflow-hidden" style={{ background: "#0d0d0d", border: "1px solid #ffffff12", boxShadow: "0 25px 80px rgba(0,0,0,0.8), 0 0 40px rgba(0,255,106,0.05)" }}>
            {/* Search Input */}
            <div className="flex items-center gap-3 px-5 py-4 border-b" style={{ borderColor: "#ffffff0a" }}>
              <Search size={18} style={{ color: "#00ff6a", flexShrink: 0 }} />
              <input
                ref={globalSearchInputRef}
                type="text"
                aria-label="Search mice, players, teams, games, and brands"
                role="searchbox"
                value={globalSearch}
                onChange={e => setGlobalSearch(e.target.value)}
                placeholder="Search mice, players, teams, games, brands..."
                autoFocus
                className="flex-1 bg-transparent outline-none text-white text-sm placeholder-white/20"
                style={{ fontFamily: "'JetBrains Mono', monospace" }}
              />
              {globalSearch && (
                <button onClick={() => setGlobalSearch("")} className="p-1 rounded hover:bg-white/5 transition-all">
                  <X size={14} style={{ color: "#ffffff40" }} />
                </button>
              )}
              <kbd className="hidden sm:inline-flex items-center gap-1 px-2 py-1 rounded text-sm" style={{ background: "#ffffff08", color: "#ffffff30", border: "1px solid #ffffff0a", fontSize: 11 }}>ESC</kbd>
            </div>

            {/* Results */}
            <div className="max-h-[60vh] overflow-y-auto" style={{ scrollbarWidth: "thin" }}>
              {globalSearch.length < 2 && (
                <div className="px-5 py-8 text-center">
                  <div className="text-sm opacity-20 mb-3">Quick Search</div>
                  <div className="flex flex-wrap justify-center gap-2">
                    {["Razer Viper V3 Pro", "s1mple", "Valorant", "Logitech", "Zowie"].map(sug => (
                      <button key={sug} onClick={() => setGlobalSearch(sug)}
                        className="px-3 py-1.5 rounded-lg text-sm transition-all hover:bg-white/10"
                        style={{ background: "#ffffff06", color: "#ffffff50", border: "1px solid #ffffff08" }}>
                        {sug}
                      </button>
                    ))}
                  </div>
                  <div className="mt-4 text-sm opacity-15">
                    <span className="hidden sm:inline">Press <kbd className="px-1.5 py-0.5 rounded mx-1" style={{ background: "#ffffff08", border: "1px solid #ffffff0a" }}>⌘K</kbd> anytime to search</span>
                  </div>
                </div>
              )}

              {globalSearchNoResults && (
                <div className="px-5 py-10 text-center">
                  <div className="text-sm opacity-30 mb-1">No results found</div>
                  <div className="text-sm opacity-15">Try a different search term</div>
                </div>
              )}

              {globalSearchHasResults && (
                <div className="py-2">
                  {/* Mice Results */}
                  {globalSearchResults.mice.length > 0 && (
                    <div className="mb-1">
                      <div className="px-5 py-2 text-sm uppercase tracking-widest flex items-center gap-2" style={{ color: "#c084fc", opacity: 0.5, fontSize: 11 }}>
                        <Mouse size={11} /> Mice
                      </div>
                      {globalSearchResults.mice.map(m => {
                        const brandCol = BRAND_COLORS[m.brand] || "#888";
                        return (
                          <button key={m.id} onClick={() => handleSearchResultClick("mouse", m)}
                            className="w-full flex items-center gap-3 px-5 py-2.5 text-left hover:bg-white/5 transition-all group">
                            <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: `${brandCol}15`, border: `1px solid ${brandCol}20` }}>
                              <Mouse size={14} style={{ color: brandCol }} />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="text-sm font-bold truncate" style={{ color: brandCol }}>{m.name}</div>
                              <div className="text-sm opacity-30 truncate">{m.brand} · {m.weight}g · {m.sensor} · ${m.price}</div>
                            </div>
                            {m.proUsage > 0 && (
                              <div className="flex-shrink-0 px-2 py-0.5 rounded text-sm font-bold" style={{ background: "#00ff6a15", color: "#00ff6a", fontSize: 11 }}>
                                {m.proUsage}% pro
                              </div>
                            )}
                            <span className="text-sm opacity-0 group-hover:opacity-30 transition-opacity flex-shrink-0">↗</span>
                          </button>
                        );
                      })}
                    </div>
                  )}

                  {/* Players Results */}
                  {globalSearchResults.players.length > 0 && (
                    <div className="mb-1">
                      <div className="px-5 py-2 text-sm uppercase tracking-widest flex items-center gap-2" style={{ color: "#00b4ff", opacity: 0.5, fontSize: 11 }}>
                        <Users size={11} /> Players
                      </div>
                      {globalSearchResults.players.map((p, i) => {
                        const gameColors = GAME_COLORS;
                        const gCol = gameColors[p.game] || "#888";
                        return (
                          <button key={`${p.name}-${p.game}-${i}`} onClick={() => handleSearchResultClick("player", p)}
                            className="w-full flex items-center gap-3 px-5 py-2.5 text-left hover:bg-white/5 transition-all group">
                            <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 text-sm" style={{ background: `${gCol}15`, border: `1px solid ${gCol}20` }}>
                              {p.country ? <Flag country={p.country} size={14} /> : <Gamepad2 size={14} style={{ color: "#ffffff40" }} />}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="text-sm font-bold truncate">{p.name} {p.fullName ? <span className="font-normal opacity-30 text-sm">({p.fullName})</span> : null}</div>
                              <div className="text-sm opacity-30 truncate">{p.team} · <span style={{ color: gCol }}>{p.game}</span> · {p.mouse}</div>
                            </div>
                            {p.hasProfile && (
                              <div className="flex-shrink-0 px-2 py-0.5 rounded text-sm font-bold" style={{ background: "#00b4ff15", color: "#00b4ff", fontSize: 11 }}>
                                Profile
                              </div>
                            )}
                            <span className="text-sm opacity-0 group-hover:opacity-30 transition-opacity flex-shrink-0">↗</span>
                          </button>
                        );
                      })}
                    </div>
                  )}

                  {/* Teams Results */}
                  {globalSearchResults.teams.length > 0 && (
                    <div className="mb-1">
                      <div className="px-5 py-2 text-sm uppercase tracking-widest flex items-center gap-2" style={{ color: "#f59e0b", opacity: 0.5, fontSize: 11 }}>
                        <Building2 size={11} /> Teams
                      </div>
                      {globalSearchResults.teams.map((t, i) => (
                        <button key={`${t.name}-${i}`} onClick={() => handleSearchResultClick("team", t)}
                          className="w-full flex items-center gap-3 px-5 py-2.5 text-left hover:bg-white/5 transition-all group">
                          <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: "#f59e0b15", border: "1px solid #f59e0b20" }}>
                            <Building2 size={14} style={{ color: "#f59e0b" }} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="text-sm font-bold truncate">{t.name}</div>
                            <div className="text-sm opacity-30 truncate">{t.playerCount} players · {t.games.join(", ")}</div>
                          </div>
                          <span className="text-sm opacity-0 group-hover:opacity-30 transition-opacity flex-shrink-0">↗</span>
                        </button>
                      ))}
                    </div>
                  )}

                  {/* Games Results */}
                  {globalSearchResults.games.length > 0 && (
                    <div className="mb-1">
                      <div className="px-5 py-2 text-sm uppercase tracking-widest flex items-center gap-2" style={{ color: "#ff4655", opacity: 0.5, fontSize: 11 }}>
                        <Gamepad2 size={11} /> Games
                      </div>
                      {globalSearchResults.games.map((g, i) => (
                        <button key={`${g.id}-${i}`} onClick={() => handleSearchResultClick("game", g)}
                          className="w-full flex items-center gap-3 px-5 py-2.5 text-left hover:bg-white/5 transition-all group">
                          <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: `${g.color}15`, border: `1px solid ${g.color}20` }}>
                            <Gamepad2 size={14} style={{ color: g.color }} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="text-sm font-bold truncate" style={{ color: g.color }}>{g.name}</div>
                            <div className="text-sm opacity-30 truncate">{g.playerCount} pros tracked</div>
                          </div>
                          <span className="text-sm opacity-0 group-hover:opacity-30 transition-opacity flex-shrink-0">↗</span>
                        </button>
                      ))}
                    </div>
                  )}

                  {/* Brands Results */}
                  {globalSearchResults.brands.length > 0 && (
                    <div className="mb-1">
                      <div className="px-5 py-2 text-sm uppercase tracking-widest flex items-center gap-2" style={{ color: "#f59e0b", opacity: 0.5, fontSize: 11 }}>
                        <Building2 size={11} /> Brands
                      </div>
                      {globalSearchResults.brands.map((b, i) => (
                        <button key={`${b.name}-${i}`} onClick={() => handleSearchResultClick("brand", b)}
                          className="w-full flex items-center gap-3 px-5 py-2.5 text-left hover:bg-white/5 transition-all group">
                          <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: `${b.color}15`, border: `1px solid ${b.color}20` }}>
                            <span className="text-sm font-black" style={{ color: b.color }}>{b.name[0]}</span>
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="text-sm font-bold truncate" style={{ color: b.color }}>{b.name}</div>
                            <div className="text-sm opacity-30 truncate">{b.mouseCount} mice in database</div>
                          </div>
                          <span className="text-sm opacity-0 group-hover:opacity-30 transition-opacity flex-shrink-0">↗</span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Footer */}
            {globalSearchHasResults && (
              <div className="px-5 py-2.5 border-t flex items-center justify-between text-sm" style={{ borderColor: "#ffffff08", color: "#ffffff20" }}>
                <span>
                  {globalSearchResults.mice.length + globalSearchResults.players.length + globalSearchResults.teams.length + globalSearchResults.games.length + globalSearchResults.brands.length} results
                </span>
                <span className="hidden sm:inline">↑↓ navigate · ↵ select · esc close</span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ─── NEWSLETTER MODAL ─── */}
      {newsletterPopup && newsletterStatus !== "success" && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center px-4" style={{ background: "rgba(0,0,0,0.75)", backdropFilter: "blur(8px)" }} onClick={() => setNewsletterPopup(false)}>
          <div className="w-full max-w-md rounded-2xl p-8 text-center" style={{ background: "#0d0d0d", border: "1px solid #00ff6a15", boxShadow: "0 25px 80px rgba(0,0,0,0.8), 0 0 40px rgba(0,255,106,0.08)" }} onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-center gap-2 mb-3">
              <span style={{ color: "#00ff6a", fontSize: 22 }}>📬</span>
              <span className="text-sm font-black uppercase tracking-widest" style={{ color: "#00ff6a" }}>Newsletter</span>
            </div>
            <div className="text-xl font-black text-white mb-2">Stay ahead of the meta</div>
            <div className="text-sm opacity-30 mb-6">Pro gear changes, new mouse releases, and data-driven insights. No spam.</div>
            <form className="flex gap-2" onSubmit={async e => { e.preventDefault(); setNewsletterStatus("sending"); try { const res = await fetch("https://formspree.io/f/xvzbwrzv", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email: newsletterEmail }) }); setNewsletterStatus(res.ok ? "success" : "error"); setNewsletterPopup(false); } catch { setNewsletterStatus("error"); } }}>
              <input type="email" required placeholder="your@email.com" value={newsletterEmail} onChange={e => setNewsletterEmail(e.target.value)} autoFocus
                className="flex-1 px-4 py-3 rounded-lg text-sm outline-none" style={{ background: "#0a0a0a", border: "1px solid #ffffff15", color: "#fff", minWidth: 0 }} />
              <button type="submit" disabled={newsletterStatus === "sending"} className="px-6 py-3 rounded-lg text-sm font-black transition-all hover:scale-105 disabled:opacity-50 whitespace-nowrap" style={{ background: "#00ff6a", color: "#000" }}>
                {newsletterStatus === "sending" ? "..." : "Subscribe"}
              </button>
            </form>
            {newsletterStatus === "error" && <div className="text-sm mt-3" style={{ color: "#ef4444" }}>Something went wrong. Try again.</div>}
            <button onClick={() => setNewsletterPopup(false)} className="text-sm opacity-20 hover:opacity-50 mt-5 transition-all">Close</button>
          </div>
        </div>
      )}

      {/* ─── MOBILE NAV (above hero, only on mobile) ─── */}
      <nav aria-label="Mobile navigation" className="md:hidden sticky top-0 z-50 border-b" style={{ background: "#050505ee", borderColor: "#ffffff0a", backdropFilter: "blur(20px)" }}>
        <div className="px-4 py-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="inline-flex">{I.mouse(20)}</span>
              <span style={{ fontFamily: "Orbitron", fontSize: 11, letterSpacing: 3, color: "#00ff6a" }}>ESPORTSMICE</span>
              <span className="mx-2 opacity-20">|</span>
              {(() => { const t = tabs.find(t => t.id === activeTab) || tabs[0]; const Icon = t.icon; return (
                <span className="flex items-center gap-1.5 text-sm font-bold">
                  <Icon size={14} strokeWidth={2.5} style={{ color: t.color }} />
                  <span style={{ color: t.color }}>{t.label}</span>
                </span>
              ); })()}
            </div>
            <div className="flex items-center gap-2">
              <button onClick={() => { setGlobalSearchOpen(true); setTimeout(() => globalSearchInputRef.current?.focus(), 50); }}
                aria-label="Search (Ctrl+K)" className="p-2 rounded-lg transition-all hover:bg-white/10" style={{ background: "#ffffff08" }}>
                <Search size={16} style={{ color: "#00ff6a" }} />
              </button>
              <button onClick={() => setMobileMenu(!mobileMenu)} aria-label={mobileMenu ? "Close menu" : "Open menu"} aria-expanded={mobileMenu} className="p-2 rounded-lg" style={{ background: "#ffffff08" }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#ffffff80" strokeWidth="2" strokeLinecap="round">
                {mobileMenu ? <><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></> : <><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></>}
              </svg>
            </button>
            </div>
          </div>
          {mobileMenu && (
            <nav aria-label="Mobile navigation" className="grid grid-cols-3 gap-1.5 mt-2 pb-1">
              {tabs.map(t => {
                const isActive = activeTab === t.id;
                const Icon = t.icon;
                return (
                  <button key={t.id} onClick={() => {
                    setMobileMenu(false);
                    if (t.id === "players") setSelectedPlayer(null);
                    if (t.id === "lab") { setQuizStep(0); setQuizDone(false); }
                    const route = TAB_ROUTES[t.id] || "/";
                    router.push(route, { scroll: false });
                    setActiveTabRaw(t.id);
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }}
                    className="px-2 py-2.5 rounded-lg text-sm font-bold transition-all"
                    style={{
                      background: isActive ? `${t.color}15` : "#ffffff05",
                      border: isActive ? `1px solid ${t.color}30` : "1px solid transparent",
                    }}>
                    <span className="flex flex-col items-center gap-1">
                      <Icon size={16} strokeWidth={2.5} style={{ color: isActive ? t.color : "#ffffff30" }} />
                      <span style={{ color: isActive ? t.color : "#ffffffcc", fontSize: 11 }}>{t.label}</span>
                    </span>
                  </button>
                );
              })}
            </nav>
          )}
        </div>
      </nav>

      {/* ─── LOGO BAR (desktop, all tabs) ─── */}
      <div className="hidden md:block relative z-[70]" style={{ background: "#050505" }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-5 pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 cursor-pointer" onClick={() => { setActiveTab("overview"); window.scrollTo({ top: 0, behavior: "smooth" }); }}>
              <span className="inline-block">{I.mouse(32)}</span>
              <span style={{ fontFamily: "Orbitron", fontSize: 14, letterSpacing: 4, color: "#00ff6a" }}>ESPORTSMICE<span style={{ fontSize: 11, letterSpacing: 1, opacity: 0.9, color: "#fff", position: "relative", top: 2 }}>.com</span></span>
            </div>
            <div className="flex items-center gap-4 text-sm">
              <div className="flex items-center gap-4 opacity-45">
                <span>{allPlayers.length}+ Pros Tracked</span>
                <span>·</span>
                <span>{new Set(mice.map(m => m.brand)).size}+ Mouse Brands</span>
                <span>·</span>
                <span>{new Set(allPlayers.map(p=>p.game)).size} Major Games</span>
              </div>
              <span className="opacity-20">|</span>
              <button onClick={() => { setGlobalSearchOpen(true); setTimeout(() => globalSearchInputRef.current?.focus(), 50); }}
                aria-label="Search (Ctrl+K)" className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm transition-all duration-200 hover:bg-white/5 flex-shrink-0"
                style={{ background: "#ffffff06", border: "1px solid #ffffff0a" }}>
                <Search size={13} style={{ color: "#00ff6a" }} />
                <span style={{ color: "#ffffff30" }}>Search</span>
              </button>
              <div>
                {newsletterStatus === "success" ? (
                  <span style={{ fontSize: 11, color: "#00ff6a" }} className="font-bold opacity-100">✓ Subscribed</span>
                ) : (
                  <button onClick={() => setNewsletterPopup(true)}
                    className="px-3 py-1 rounded font-black uppercase tracking-wider transition-all hover:scale-105 opacity-100"
                    style={{ background: "#00ff6a", color: "#000", fontSize: 10, letterSpacing: 2 }}>
                    Subscribe
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ─── HERO (overview only) ─── */}
      {activeTab === "overview" && (
      <header className="relative overflow-hidden" style={{ minHeight: "auto" }}>
        <div className="absolute inset-0" style={{
          background: "radial-gradient(ellipse 80% 50% at 50% 0%, #00ff6a08 0%, transparent 70%), radial-gradient(ellipse 60% 40% at 20% 100%, #00b4ff06 0%, transparent 70%), radial-gradient(ellipse 60% 40% at 80% 80%, #ff3c3c04 0%, transparent 70%)"
        }} />
        <div className="absolute inset-0" style={{
          backgroundImage: `repeating-linear-gradient(0deg, transparent, transparent 49px, #ffffff03 50px), repeating-linear-gradient(90deg, transparent, transparent 49px, #ffffff03 50px)`,
        }} />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 pt-4 sm:pt-6 pb-6 sm:pb-8">

          <div className="text-center" style={{ transition: "all 1s ease", opacity: heroAnim ? 1 : 0, transform: heroAnim ? "translateY(0)" : "translateY(30px)" }}>
            <div className="mb-3 sm:mb-4">
              <span className="text-base uppercase tracking-widest opacity-60" style={{ color: "#ffffff", textShadow: "0 0 20px #ffffff30" }}>The Definitive Guide to</span>
            </div>
            <h1 className="text-3xl sm:text-5xl lg:text-6xl" style={{ fontFamily: "Orbitron", fontWeight: 900, lineHeight: 1.1, letterSpacing: -1 }}>
              <span style={{ color: "#fff" }}>PRO </span>
              <span style={{ color: "#00ff6a", textShadow: "0 0 40px #00ff6a30" }}>ESPORTS</span>
              <br />
              <span style={{ color: "#fff" }}>GAMING </span>
              <span style={{ color: "#00b4ff", textShadow: "0 0 40px #00b4ff30" }}>MICE</span>
            </h1>
            <p className="mt-3 sm:mt-4 max-w-2xl mx-auto text-sm sm:text-sm opacity-85 leading-relaxed px-2">
              Comprehensive data on every mouse used by professional players across CS2, Valorant, League of Legends, Dota 2, Fortnite, Call of Duty, Overwatch 2, Apex Legends, Rainbow Six Siege, and Rocket League. Rankings, specs, comparisons, and settings  -  all in one place.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:flex sm:justify-center gap-4 sm:gap-6 mt-6 sm:mt-8 justify-items-center">
            {[
              { val: allPlayers.length, label: "Pro Players", suffix: "", prefix: "" },
              { val: mice.length, label: "Mouse Models", suffix: "", prefix: "" },
              { val: new Set(allPlayers.map(p=>p.game)).size, label: "Major Games", suffix: "", prefix: "" },
              { val: Math.max(...mice.map(m => m.proUsage)), label: "Top Mouse Share", suffix: "%", prefix: "" },
            ].map((s, i) => (
              <div key={i} className="text-center" style={{ transition: `all 0.8s ease ${i * 0.15}s`, opacity: heroAnim ? 1 : 0 }}>
                <div className="text-lg sm:text-2xl font-black" style={{ fontFamily: "Orbitron" }}>
                  <AnimatedCounter value={s.val} suffix={s.suffix} prefix={s.prefix} color={i % 2 === 0 ? "#00ff6a" : "#00b4ff"} duration={1600 + i * 200} />
                </div>
                <div className="text-base text-white opacity-90 mt-1">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </header>
      )}

      {/* ─── NAV TABS ─── */}
      <nav aria-label="Main navigation" className="hidden md:block sticky top-0 z-50 border-b" style={{ background: "#050505ee", borderColor: "#ffffff0a", backdropFilter: "blur(20px)" }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-2">
          <div className="flex gap-1 items-center">
            <div className="flex gap-1 flex-1 flex-wrap">
            {tabs.filter(t => t.id !== "trends" && t.id !== "teams" && t.id !== "shapes" && t.id !== "compare").map(t => {
              const isActive = activeTab === t.id;
              const Icon = t.icon;
              return (
              <button key={t.id} onClick={() => { setActiveTab(t.id); if (t.id === "players") setSelectedPlayer(null); if (t.id === "lab") { setQuizStep(0); setQuizDone(false); window.scrollTo({ top: 0, behavior: "smooth" }); } }}
                role="tab" aria-selected={isActive} aria-controls="main-content"
                className="px-4 py-2 rounded-lg text-sm font-bold whitespace-nowrap transition-all duration-200"
                style={{
                  background: isActive ? `${t.color}15` : "transparent",
                  border: isActive ? `1px solid ${t.color}30` : "1px solid transparent",
                  boxShadow: isActive ? `0 0 12px ${t.color}15` : "none",
                }}>
                <span className="flex items-center gap-1.5">
                  <Icon size={14} strokeWidth={2.5} style={{ color: t.color }} />
                  <span style={{ color: isActive ? t.color : "#ffffffcc" }}>{t.label}</span>
                </span>
              </button>
              );
            })}
            {/* Other Dropdown */}
            {(() => {
              const dropdownTabs = tabs.filter(t => t.id === "trends" || t.id === "teams" || t.id === "shapes" || t.id === "compare");
              const isActiveInDropdown = dropdownTabs.some(t => t.id === activeTab);
              const activeDropdownTab = dropdownTabs.find(t => t.id === activeTab);
              return (
              <div className="relative group">
                <button className="px-4 py-2 rounded-lg text-sm font-bold whitespace-nowrap transition-all duration-200 flex items-center gap-1.5"
                  style={{
                    background: isActiveInDropdown ? `${activeDropdownTab.color}15` : "transparent",
                    border: isActiveInDropdown ? `1px solid ${activeDropdownTab.color}30` : "1px solid transparent",
                    boxShadow: isActiveInDropdown ? `0 0 12px ${activeDropdownTab.color}15` : "none",
                  }}>
                  <span style={{ color: isActiveInDropdown ? activeDropdownTab.color : "#ffffffcc" }}>Other</span>
                  <ChevronDown size={12} style={{ color: isActiveInDropdown ? activeDropdownTab.color : "#ffffff30" }} className="group-hover:rotate-180 transition-transform duration-200" />
                </button>
                <div className="absolute top-full left-0 mt-1 rounded-xl overflow-hidden opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50"
                  style={{ background: "#111", border: "1px solid #ffffff15", boxShadow: "0 8px 32px rgba(0,0,0,0.6)", minWidth: 180 }}>
                  {dropdownTabs.map(t => {
                    const isActive = activeTab === t.id;
                    const Icon = t.icon;
                    return (
                    <button key={t.id} onClick={() => { setActiveTab(t.id); window.scrollTo({ top: 0, behavior: "smooth" }); }}
                      className="w-full flex items-center gap-2.5 px-4 py-2.5 text-xs font-bold transition-all hover:bg-white/5"
                      style={{ background: isActive ? `${t.color}10` : "transparent" }}>
                      <Icon size={14} strokeWidth={2.5} style={{ color: t.color }} />
                      <span style={{ color: isActive ? t.color : "#ffffffa0" }}>{t.label}</span>
                    </button>
                    );
                  })}
                </div>
              </div>
              );
            })()}
            </div>
          </div>
        </div>
      </nav>


      {/* ─── CONTENT ─── */}
      <main id="main-content" role="main" className="max-w-7xl mx-auto px-3 sm:px-6 pb-20" style={{ transition: "opacity 180ms ease, transform 180ms ease", opacity: tabFade ? 1 : 0, transform: tabFade ? "translateY(0)" : "translateY(10px)" }}>

        {/* ── OVERVIEW TAB ── */}
        {activeTab === "overview" && (
          <div>
            <SectionTitle color="#00ff6a" sub={`Based on data from ${allPlayers.length} professional esports players across ${new Set(allPlayers.map(p=>p.game)).size} major titles`}>Mouse Usage by Professional Players</SectionTitle>
            <div className="rounded-2xl p-2 sm:p-6" style={{ background: "#0a0a0a", border: "1px solid #ffffff08" }}>
              <ResponsiveContainer width="100%" height={280}>
                <BarChart data={proUsageChart} margin={{ top: 10, right: 30, left: 0, bottom: 60 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#ffffff08" />
                  <XAxis dataKey="name" tick={{ fill: "#ffffff40", fontSize: 13 }} angle={-35} textAnchor="end" interval={0} />
                  <YAxis tick={{ fill: "#ffffff40", fontSize: 13 }} unit="%" />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="usage" radius={[6, 6, 0, 0]} name="Pro Usage" label={{ position: "top", fill: "#ffffff60", fontSize: 13, formatter: (v) => `${v}%` }}>
                    {proUsageChart.map((entry, i) => <Cell key={i} fill={entry.fill} fillOpacity={0.8} />)}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* ── QUICK INSIGHTS ── */}
            {(() => {
              const mouseCounts = {};
              allPlayers.forEach(p => { mouseCounts[p.mouse] = (mouseCounts[p.mouse] || 0) + 1; });
              const topMouseEntry = Object.entries(mouseCounts).sort((a,b) => b[1]-a[1])[0];
              const allEdpis = allPlayers.filter(p => p.edpi > 0 && p.edpi < 50000).map(p => p.edpi);
              const avgEdpi = allEdpis.length ? Math.round(allEdpis.reduce((a,b) => a+b, 0) / allEdpis.length) : 0;
              const lightest = [...mice].sort((a,b) => a.weight - b.weight)[0];
              const uniqueBrands = new Set(allPlayers.map(p => { const m = mice.find(mm => mm.name === p.mouse || p.mouse.includes(mm.name)); return m?.brand; }).filter(Boolean));
              const playerWeights = allPlayers.map(p => { const m = mice.find(mm => mm.name === p.mouse || p.mouse.includes(mm.name)); return m?.weight; }).filter(Boolean);
              const avgProWeight = playerWeights.length ? Math.round(playerWeights.reduce((a,b) => a+b, 0) / playerWeights.length) : 0;
              return (
              <div className="grid grid-cols-3 sm:grid-cols-5 gap-2 sm:gap-3 my-4 sm:my-6 text-center">
                {[
                  { label: "Most Used Mouse", value: topMouseEntry[0].replace(/(Logitech |Razer )/, ""), sub: `${Math.round(topMouseEntry[1]/allPlayers.length*100)}% of pros`, color: "#00ff6a", icon: "crown", numeric: false },
                  { label: "Avg Pro eDPI", value: avgEdpi, sub: allEdpis.length + " players tracked", color: "#ff4655", icon: "crosshair", numeric: true, numVal: avgEdpi, numSuffix: "" },
                  { label: "Brands in Pro Use", value: uniqueBrands.size, sub: "competing for pros", color: "#00b4ff", icon: "signal", numeric: true, numVal: uniqueBrands.size, numSuffix: "" },
                  { label: "Lightest Mouse", value: `${lightest.weight}g`, sub: lightest.name.replace(/(WLMouse |Finalmouse )/, ""), color: "#f472b6", icon: "wind", numeric: true, numVal: lightest.weight, numSuffix: "g" },
                  { label: "Avg Mouse Weight with Pros", value: `${avgProWeight}g`, sub: "across all pros", color: "#d4af37", icon: "gear", numeric: true, numVal: avgProWeight, numSuffix: "g" },
                ].map((card, i) => (
                  <div key={i} className="rounded-xl p-2 sm:p-4 text-center transition-all hover:scale-[1.02]" style={{ background: `${card.color}06`, border: `1px solid ${card.color}12` }}>
                    <div className="mb-1 flex items-center justify-center">{icon(card.icon, 22)}</div>
                    <div className="text-sm sm:text-lg font-black leading-tight" style={{ color: card.color }}>
                      {card.numeric
                        ? <AnimatedCounter value={card.numVal} suffix={card.numSuffix || ""} color={card.color} duration={1400 + i * 200} />
                        : card.value
                      }
                    </div>
                    <div className="text-sm opacity-50 mt-0.5">{card.label}</div>
                    <div style={{ fontSize: 11 }} className="opacity-25 mt-1">{card.sub}</div>
                    {i === 0 && <a href={amazonLink(topMouseEntry[0])} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 mt-1.5 px-2 py-0.5 rounded text-xs font-bold no-underline hover:scale-105 transition-all" style={{ background: "#f59e0b15", color: "#f59e0b", textDecoration: "none", fontSize: 10 }}>{I.cart(9)} Buy</a>}
                    {i === 3 && <a href={amazonLink(lightest.name)} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 mt-1.5 px-2 py-0.5 rounded text-xs font-bold no-underline hover:scale-105 transition-all" style={{ background: "#f59e0b15", color: "#f59e0b", textDecoration: "none", fontSize: 10 }}>{I.cart(9)} Buy</a>}
                  </div>
                ))}
              </div>
              );
            })()}

            <SectionTitle color="#d4af37" sub="Select any mouse to see detailed performance radar and specs">Featured Mouse Spotlight</SectionTitle>
              <div className="rounded-2xl p-3 sm:p-5 mb-6" style={{ background: "#0a0a0a", border: "1px solid #ffffff08" }}>
                {/* ── Mouse Picker: Top 20 mice by pro usage ── */}
                <div className="flex flex-wrap gap-1.5 mb-4">
                  {[...mice].sort((a, b) => b.proUsage - a.proUsage).slice(0, 20).map(m => (
                    <button key={m.id} onClick={() => setSelectedMouse(m)}
                      className="px-2.5 py-1.5 rounded-lg text-sm font-bold transition-all whitespace-nowrap hover:scale-[1.03] cursor-pointer"
                      style={{
                        background: selectedMouse?.id === m.id ? BRAND_COLORS[m.brand] : "#ffffff06",
                        color: selectedMouse?.id === m.id ? "#000" : "#ffffffaa",
                        border: selectedMouse?.id === m.id ? "none" : "1px solid #ffffff08",
                        fontSize: 12,
                      }}>
                      {m.name.replace(/(Logitech |Razer |Finalmouse |Lamzu |Pulsar |SteelSeries |Corsair |Endgame Gear |ASUS |Ninjutso |WLMouse |Sony |Zowie )/, "")}
                    </button>
                  ))}
                </div>

                {selectedMouse && (() => {
                  const brandCol = BRAND_COLORS[selectedMouse.brand];
                  const imgUrl = MOUSE_IMAGE_URLS[selectedMouse.name];
                  return (
                  <>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                    {/* Left: Mouse image */}
                    <div className="flex flex-col items-center justify-center rounded-xl p-4" style={{ background: `${brandCol}06`, border: `1px solid ${brandCol}12` }}>
                      {imgUrl ? (
                        <img loading="lazy" src={imgUrl} alt={`${selectedMouse.name} by ${selectedMouse.brand} - ${selectedMouse.weight}g wireless esports gaming mouse`} className="w-full max-h-32 sm:max-h-48 object-contain object-center mb-3 rounded-lg" style={{ filter: "drop-shadow(0 8px 24px rgba(0,0,0,0.5))" }}
                          onError={e => { e.target.style.display = "none"; e.target.nextSibling.style.display = "flex"; }} />
                      ) : null}
                      <div className={imgUrl ? "hidden" : "flex"} style={{ width: 180, height: 160, alignItems: "center", justifyContent: "center", background: `${brandCol}10`, borderRadius: 16 }}>
                        <span className="inline-block">{icon(selectedMouse.image, 80)}</span>
                      </div>
                      <div className="text-xl font-black mt-2 text-center cursor-pointer hover:underline" style={{ color: brandCol }} onClick={() => navigateToMouse(selectedMouse)}>{selectedMouse.name}</div>
                      <div className="text-sm opacity-85 text-center">{selectedMouse.brand} · {selectedMouse.shape} · {selectedMouse.connectivity}</div>
                    </div>

                    {/* Center: Radar chart */}
                    <div className="flex flex-col items-center justify-center md:col-span-2 lg:col-span-1">
                      <ResponsiveContainer width="100%" height={200}>
                        <RadarChart data={radarData}>
                          <PolarGrid stroke="#ffffff10" />
                          <PolarAngleAxis dataKey="stat" tick={{ fill: "#ffffff50", fontSize: 13 }} />
                          <PolarRadiusAxis tick={false} axisLine={false} domain={[0, 100]} />
                          <Radar name={selectedMouse.name} dataKey="value" stroke={brandCol} fill={brandCol} fillOpacity={0.2} strokeWidth={2.5} dot={{ r: 3, fill: brandCol, strokeWidth: 0 }} />
                        </RadarChart>
                      </ResponsiveContainer>
                      <div className="grid grid-cols-4 gap-1.5 sm:gap-2 w-full mt-2">
                        <StatBox label="Weight" value={selectedMouse.weight} unit="g" color={brandCol} />
                        <StatBox label="DPI" value={selectedMouse.dpi >= 1000 ? `${(selectedMouse.dpi / 1000).toFixed(0)}K` : selectedMouse.dpi} color={brandCol} />
                        <StatBox label="Poll Rate" value={selectedMouse.pollingRate >= 1000 ? `${selectedMouse.pollingRate / 1000}K` : selectedMouse.pollingRate} unit="Hz" color={brandCol} />
                        <StatBox label="Price" value={`$${selectedMouse.price}`} color={brandCol} />
                      </div>
                      <a href={amazonLink(selectedMouse.name)} target="_blank" rel="noopener noreferrer"
                        className="inline-flex items-center justify-center gap-2 w-full px-5 py-2.5 rounded-xl text-sm font-black transition-all mt-2"
                        style={{ background: brandCol, color: "#000" }}>
                        {I.cart(16, "#000")} Buy on Amazon
                      </a>
                    </div>

                    {/* Right: Pro users */}
                    <div>
                      <div className="text-sm uppercase tracking-widest opacity-30 mb-3">Notable Pro Users</div>
                      {usedByPros.length > 0 ? (
                        <div className="space-y-2">
                          {usedByPros.slice(0, 3).map((p, i) => {
                            const gameColors = GAME_COLORS;
                            const gc = gameColors[p.game] || "#888";
                            return (
                              <button key={i} onClick={() => { const pp = proPlayers.find(pp => pp.name === p.name); if (pp) { navigateToPlayer(pp); } else { setActiveTab("players"); } }}
                                className="w-full flex items-center gap-3 p-2.5 rounded-xl cursor-pointer transition-all hover:scale-[1.02] text-left"
                                style={{ background: `${gc}08`, border: `1px solid ${gc}15` }}>
                                <div className="w-10 h-10 rounded-lg flex items-center justify-center text-lg flex-shrink-0" style={{ background: `${gc}15` }}>
                                  <Flag country={p.country} size={16} />
                                </div>
                                <div className="flex-1 min-w-0">
                                  <div className="text-sm font-black">{p.name}</div>
                                  <div className="text-sm opacity-85">{p.team} · <span style={{ color: gc }}>{p.game}</span> · {p.role}</div>
                                </div>
                                <div className="text-right flex-shrink-0">
                                  <div className="text-sm font-bold">{p.dpi} DPI</div>
                                  <div className="text-sm opacity-30">{p.edpi ? `${p.edpi} eDPI` : ""}</div>
                                </div>
                              </button>
                            );
                          })}
                        </div>
                      ) : (
                        <div className="text-sm opacity-20 py-8 text-center">No tracked pros currently using this mouse</div>
                      )}
                    </div>
                  </div>

                  {/* ── Mouse Description ── */}
                  {MOUSE_DESCRIPTIONS[selectedMouse.name] && (() => {
                    const desc = MOUSE_DESCRIPTIONS[selectedMouse.name];
                    const brandCol = BRAND_COLORS[selectedMouse.brand];
                    const parts = [];
                    
                    if (desc.highlights && desc.highlights.length > 0) {
                      // Sort highlights by position in text
                      const sorted = [...desc.highlights]
                        .map(h => ({ h, idx: desc.text.indexOf(h) }))
                        .filter(x => x.idx !== -1)
                        .sort((a, b) => a.idx - b.idx);
                      
                      let cursor = 0;
                      sorted.forEach(({ h, idx }) => {
                        if (idx > cursor) parts.push({ text: desc.text.slice(cursor, idx), highlight: false });
                        parts.push({ text: h, highlight: true });
                        cursor = idx + h.length;
                      });
                      if (cursor < desc.text.length) parts.push({ text: desc.text.slice(cursor), highlight: false });
                    } else {
                      parts.push({ text: desc.text, highlight: false });
                    }

                    return (
                      <div className="rounded-xl p-5 mt-4" style={{ background: `${brandCol}05`, border: `1px solid ${brandCol}10` }}>
                        <div className="text-sm uppercase tracking-widest opacity-30 mb-2">About this mouse</div>
                        <p className="text-sm leading-relaxed opacity-60">
                          {parts.map((p, i) => p.highlight ? (
                            <span key={i} className="font-bold opacity-100" style={{ color: brandCol }}>{p.text}</span>
                          ) : (
                            <span key={i}>{p.text}</span>
                          ))}
                        </p>
                      </div>
                    );
                  })()}

                  {/* ── Deep Dive Stats Panel ── */}
                  {(() => {
                    const mousePlayers = allPlayers.filter(p => p.mouse && (p.mouse === selectedMouse.name || p.mouse.includes(selectedMouse.name.split(" ").slice(-2).join(" "))));
                    const totalTracked = allPlayers.length;
                    const marketShare = totalTracked > 0 ? ((mousePlayers.length / totalTracked) * 100).toFixed(1) : 0;
                    
                    const gameDistro = {};
                    mousePlayers.forEach(p => { gameDistro[p.game] = (gameDistro[p.game] || 0) + 1; });
                    const topGames = Object.entries(gameDistro).sort((a, b) => b[1] - a[1]);
                    const gcols = { CS2: "#ff8c00", Valorant: "#ff4655", LoL: "#c89b3c", Fortnite: "#4c7bd9", "Overwatch 2": "#f99e1a", Apex: "#dc2626", "Dota 2": "#e74c3c", "R6 Siege": "#4a86c8", "Rocket League": "#1a9fff", "Call of Duty": "#5cb85c", "Marvel Rivals": "#ed1d24", PUBG: "#f2a900", Deadlock: "#8b5cf6", "Quake Champions": "#ce4a00" };

                    const dpiCounts = {};
                    mousePlayers.forEach(p => { if (p.dpi) dpiCounts[p.dpi] = (dpiCounts[p.dpi] || 0) + 1; });
                    const topDpi = Object.entries(dpiCounts).sort((a, b) => b[1] - a[1]);

                    const edpis = mousePlayers.filter(p => p.edpi && p.edpi > 0).map(p => p.edpi);
                    const avgEdpi = edpis.length > 0 ? Math.round(edpis.reduce((a, b) => a + b, 0) / edpis.length) : null;
                    const minEdpi = edpis.length > 0 ? Math.min(...edpis) : null;
                    const maxEdpi = edpis.length > 0 ? Math.max(...edpis) : null;

                    const countryCounts = {};
                    mousePlayers.forEach(p => { if (p.country) countryCounts[p.country] = (countryCounts[p.country] || 0) + 1; });
                    const topCountries = Object.entries(countryCounts).sort((a, b) => b[1] - a[1]).slice(0, 5);

                    const teamCounts = {};
                    mousePlayers.forEach(p => { if (p.team && p.team !== "Content" && p.team !== "Inactive") teamCounts[p.team] = (teamCounts[p.team] || 0) + 1; });
                    const topTeams = Object.entries(teamCounts).sort((a, b) => b[1] - a[1]).slice(0, 3);

                    const allMouseCounts = {};
                    allPlayers.forEach(p => { if (p.mouse) allMouseCounts[p.mouse] = (allMouseCounts[p.mouse] || 0) + 1; });
                    const ranked = Object.entries(allMouseCounts).sort((a, b) => b[1] - a[1]);
                    const rank = ranked.findIndex(([name]) => name === selectedMouse.name || name.includes(selectedMouse.name.split(" ").slice(-2).join(" "))) + 1;

                    const competitors = mice.filter(m => m.id !== selectedMouse.id && m.shape === selectedMouse.shape && m.connectivity === selectedMouse.connectivity)
                      .sort((a, b) => b.proUsage - a.proUsage).slice(0, 3);

                    if (mousePlayers.length === 0) return <div className="mt-4 rounded-lg p-6 text-center text-sm opacity-20" style={{ background: "#ffffff04" }}>No tracked players found for this mouse in our database</div>;

                    return (
                      <div className="mt-5 rounded-xl overflow-hidden" style={{ border: `1px solid ${brandCol}12` }}>
                        <div className="px-4 py-3 flex items-center gap-2" style={{ background: `${brandCol}08`, borderBottom: `1px solid ${brandCol}10` }}>
                          <span>{I.chart(16)}</span>
                          <span className="text-sm font-black uppercase tracking-widest" style={{ color: brandCol }}>Deep Dive</span>
                          <span className="text-sm opacity-30">·</span>
                          <span className="text-sm opacity-85">{selectedMouse.name} across {totalTracked.toLocaleString()} tracked pros</span>
                        </div>

                        <div className="p-4" style={{ background: "#0a0a0a" }}>
                          {/* Key metrics row */}
                          <div className="grid grid-cols-3 sm:grid-cols-5 gap-1.5 sm:gap-2 mb-4">
                            {[
                              { label: "Pro Users", value: mousePlayers.length, icon: "user" },
                              { label: "Market Share", value: `${marketShare}%`, icon: "trending" },
                              { label: "Popularity Rank", value: rank > 0 ? `#${rank}` : " - ", icon: "trophy" },
                              { label: "Avg eDPI", value: avgEdpi || " - ", icon: "crosshair" },
                              { label: "Games Present", value: topGames.length, icon: "gamepad" },
                            ].map((stat, idx) => (
                              <div key={idx} className="rounded-lg p-2 sm:p-3 text-center" style={{ background: "#ffffff05" }}>
                                <div className="mb-0.5 flex items-center justify-center">{icon(stat.icon, 22)}</div>
                                <div className="text-sm sm:text-lg font-black" style={{ color: brandCol }}>{stat.value}</div>
                                <div style={{ fontSize: 14 }} className="opacity-30">{stat.label}</div>
                              </div>
                            ))}
                          </div>

                          {/* 3-column detail grid */}
                          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 sm:gap-3">
                            {/* Game Popularity */}
                            <div className="rounded-lg p-3" style={{ background: "#ffffff04" }}>
                              <div className="text-sm opacity-30 mb-2.5 font-bold uppercase tracking-wider"><span className="inline-flex mr-1 align-middle">{I.gamepad(12)}</span>Game Breakdown</div>
                              <div className="space-y-2">
                                {topGames.slice(0, 5).map(([game, count]) => (
                                  <div key={game}>
                                    <div className="flex justify-between text-sm mb-0.5">
                                      <span className="font-bold" style={{ color: gcols[game] || "#888" }}>{game}</span>
                                      <span className="opacity-50">{count} players · {((count / mousePlayers.length) * 100).toFixed(0)}%</span>
                                    </div>
                                    <div className="h-2 rounded-full overflow-hidden" style={{ background: "#ffffff08" }}>
                                      <div className="h-full rounded-full transition-all" style={{ width: `${(count / topGames[0][1]) * 100}%`, background: gcols[game] || "#888", opacity: 0.7 }} />
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>

                            {/* DPI + eDPI */}
                            <div className="rounded-lg p-3" style={{ background: "#ffffff04" }}>
                              <div className="text-sm opacity-30 mb-2.5 font-bold uppercase tracking-wider"><span className="inline-flex mr-1 align-middle">{I.gear(12)}</span>Settings Profile</div>
                              <div className="text-sm opacity-30 mb-1.5">Most Common DPI</div>
                              <div className="space-y-1.5 mb-3">
                                {topDpi.slice(0, 3).map(([dpi, count]) => (
                                  <div key={dpi} className="flex items-center gap-2">
                                    <span className="text-sm font-black w-12" style={{ color: brandCol }}>{dpi}</span>
                                    <div className="flex-1 h-2 rounded-full overflow-hidden" style={{ background: "#ffffff08" }}>
                                      <div className="h-full rounded-full" style={{ width: `${(count / topDpi[0][1]) * 100}%`, background: brandCol, opacity: 0.6 }} />
                                    </div>
                                    <span className="text-sm opacity-85 w-14 text-right">{((count / mousePlayers.length) * 100).toFixed(0)}%</span>
                                  </div>
                                ))}
                              </div>
                              {avgEdpi && (
                                <div>
                                  <div className="text-sm opacity-30 mb-1.5">eDPI Range</div>
                                  <div className="flex items-center gap-1 text-sm">
                                    <span className="opacity-50">{minEdpi}</span>
                                    <div className="flex-1 h-2 rounded-full relative overflow-hidden" style={{ background: "#ffffff08" }}>
                                      <div className="absolute h-full rounded-full" style={{ left: `${Math.max(0, ((avgEdpi - minEdpi) / (maxEdpi - minEdpi || 1)) * 100 - 5)}%`, width: "10%", background: brandCol, opacity: 0.8 }} />
                                    </div>
                                    <span className="opacity-50">{maxEdpi}</span>
                                  </div>
                                  <div className="text-center text-sm mt-1"><span className="font-black" style={{ color: brandCol }}>{avgEdpi}</span> <span className="opacity-30">avg</span></div>
                                </div>
                              )}
                            </div>

                            {/* Regions + Teams */}
                            <div className="rounded-lg p-3" style={{ background: "#ffffff04" }}>
                              <div className="text-sm opacity-30 mb-2.5 font-bold uppercase tracking-wider"><span className="inline-flex mr-1 align-middle">{I.globe(12)}</span>Demographics</div>
                              <div className="text-sm opacity-30 mb-1.5">Top Regions</div>
                              <div className="flex flex-wrap gap-1.5 mb-3">
                                {topCountries.map(([flag, count]) => (
                                  <span key={flag} className="inline-flex items-center gap-1 px-2 py-1 rounded-md text-sm" style={{ background: `${brandCol}10` }}>
                                    <Flag country={flag} size={16} />
                                    <span className="font-bold" style={{ color: brandCol }}>{count}</span>
                                  </span>
                                ))}
                              </div>
                              {topTeams.length > 0 && (
                                <div>
                                  <div className="text-sm opacity-30 mb-1.5">Top Teams Using This Mouse</div>
                                  <div className="space-y-1.5">
                                    {topTeams.map(([team, count]) => (
                                      <div key={team} className="flex justify-between items-center text-sm">
                                        <span className="opacity-60 truncate">{team}</span>
                                        <span className="font-black px-2 py-0.5 rounded" style={{ color: brandCol, background: `${brandCol}10` }}>{count}</span>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>

                          {/* Competitors row */}
                          {competitors.length > 0 && (
                            <div className="mt-3 rounded-lg p-3" style={{ background: "#ffffff04" }}>
                              <div className="text-sm opacity-30 mb-2 font-bold uppercase tracking-wider"><span className="inline-flex mr-1 align-middle">{I.refresh(12)}</span>Similar Mice ({selectedMouse.shape} · {selectedMouse.connectivity})</div>
                              <div className="flex flex-wrap gap-2">
                                {competitors.map(c => {
                                  const cc = BRAND_COLORS[c.brand] || "#888";
                                  return (
                                    <button key={c.id} onClick={() => { navigateToMouse(c); }}
                                      className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-all hover:scale-105"
                                      style={{ background: `${cc}08`, border: `1px solid ${cc}15` }}>
                                      {MOUSE_IMAGE_URLS[c.name] && <img loading="lazy" src={MOUSE_IMAGE_URLS[c.name]} alt={`${c.name} esports gaming mouse`} className="h-6 object-contain" />}
                                      <div>
                                        <div className="font-bold" style={{ color: cc }}>{c.name.replace(c.brand + " ", "")}</div>
                                        <div className="opacity-85">{c.weight}g · {c.sensor} · {"$"}{c.price}</div>
                                      </div>
                                    </button>
                                  );
                                })}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })()}
                  </>
                  );
                })()}
              </div>


            {/* Gear Check Callout */}
            {(() => {
              const hotMouse = gameBreakdown[1]?.topMice[0]?.name || "Razer Viper V3 Pro";
              const hotGame = gameBreakdown[1]?.game || "Valorant";
              const hotPct = gameBreakdown[1]?.topMice[0]?.pct || 30;
              const hm = mice.find(m => m.name === hotMouse);
              return (
                <div className="rounded-xl p-4 my-6 flex flex-col sm:flex-row items-center gap-4" style={{ background: "linear-gradient(135deg, #f59e0b08, #f59e0b03)", border: "1px solid #f59e0b15" }}>
                  <div className="flex items-center gap-2">
                    <span className="text-xl">🔥</span>
                    <div>
                      <div className="text-xs uppercase tracking-widest font-bold" style={{ color: "#f59e0b" }}>Trending Now</div>
                      <div className="text-sm font-bold" style={{ color: "#ffffffd0" }}>{hotMouse} — used by {hotPct}% of {hotGame} pros</div>
                      {hm && <div style={{ fontSize: 12, color: "#ffffff30" }}>{hm.weight}g · {hm.sensor} · {hm.connectivity}</div>}
                    </div>
                  </div>
                  <a href={amazonLink(hotMouse)} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-4 py-2 rounded-lg font-bold text-sm transition-all hover:scale-105 no-underline flex-shrink-0" style={{ background: "#f59e0b", color: "#000", textDecoration: "none" }}>
                    {I.cart(14, "#000")} Buy on Amazon{hm ? ` — $${hm.price}` : ""}
                  </a>
                </div>
              );
            })()}

            {/* Popular Comparisons */}
            <div className="mb-4">
              <div className="text-xs uppercase tracking-widest opacity-25 mb-3 font-bold">Popular Comparisons</div>
              <div className="flex flex-wrap gap-2">
                {[
                  { a: "Razer Viper V3 Pro", b: "Logitech G Pro X Superlight 2" },
                  { a: "Razer Viper V3 Pro", b: "Razer DeathAdder V4 Pro" },
                  { a: "Logitech G Pro X Superlight 2", b: "Razer DeathAdder V4 Pro" },
                  { a: "Razer Viper V3 Pro", b: "Razer Viper V2 Pro" },
                  { a: "Razer DeathAdder V4 Pro", b: "Razer DeathAdder V3 Pro" },
                ].map(c => {
                  const sa = c.a.toLowerCase().replace(/\+/g, "-plus").replace(/[^a-z0-9]+/g, "-").replace(/-+$/, "");
                  const sb = c.b.toLowerCase().replace(/\+/g, "-plus").replace(/[^a-z0-9]+/g, "-").replace(/-+$/, "");
                  return <a key={sa+sb} href={`/compare/${sa}-vs-${sb}`} className="text-xs px-3 py-1.5 rounded-full no-underline transition-all hover:scale-105" style={{ background: "#ffffff06", border: "1px solid #ffffff10", color: "#ffffff60", textDecoration: "none" }}>{c.a.replace(/(Logitech |Razer )/, "")} vs {c.b.replace(/(Logitech |Razer )/, "")}</a>;
                })}
              </div>
            </div>

            {/* Newsletter CTA */}
            <div className="rounded-2xl p-5 sm:p-8 mt-8 mb-2 text-center relative overflow-hidden" style={{ background: "linear-gradient(135deg, #00ff6a08, #00b4ff06)", border: "1px solid #00ff6a12" }}>
              <div className="relative z-10">
                <div className="flex items-center justify-center gap-2 mb-2">
                  {I.mouse(20)}
                  <span className="text-sm font-black uppercase tracking-widest" style={{ color: "#00ff6a" }}>Newsletter</span>
                </div>
                <div className="text-base sm:text-lg font-black text-white mb-1">Stay ahead of the meta</div>
                <div className="text-sm opacity-30 mb-4 max-w-md mx-auto">Pro gear changes, new mouse releases, and data-driven insights delivered to your inbox. No spam.</div>
                {newsletterStatus === "success" ? (
                  <div className="text-sm font-black" style={{ color: "#00ff6a" }}>✓ You're subscribed!</div>
                ) : (
                  <form className="flex gap-2 max-w-sm mx-auto" onSubmit={async e => { e.preventDefault(); setNewsletterStatus("sending"); try { const res = await fetch("https://formspree.io/f/xvzbwrzv", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email: newsletterEmail }) }); setNewsletterStatus(res.ok ? "success" : "error"); } catch { setNewsletterStatus("error"); } }}>
                    <input type="email" required placeholder="your@email.com" value={newsletterEmail} onChange={e => setNewsletterEmail(e.target.value)}
                      className="flex-1 px-4 py-2.5 rounded-lg text-sm outline-none" style={{ background: "#0a0a0a", border: "1px solid #ffffff15", color: "#fff" }} />
                    <button type="submit" disabled={newsletterStatus === "sending"} className="px-5 py-2.5 rounded-lg text-sm font-black transition-all hover:scale-105 disabled:opacity-50" style={{ background: "#00ff6a", color: "#000" }}>
                      {newsletterStatus === "sending" ? "..." : "Subscribe"}
                    </button>
                  </form>
                )}
                {newsletterStatus === "error" && <div className="text-sm mt-2" style={{ color: "#ef4444" }}>Something went wrong. Try again.</div>}
              </div>
            </div>

          </div>
        )}

        {/* ── MOUSE DETAIL PAGE ── */}
        {activeTab === "mouseDetail" && selectedMouse && (() => {
          const brandCol = BRAND_COLORS[selectedMouse.brand];
          const imgUrl = MOUSE_IMAGE_URLS[selectedMouse.name];
          return (
          <div>
            {/* Breadcrumbs */}
            <nav aria-label="Breadcrumb" className="mt-8 mb-4 flex items-center gap-1.5 text-sm">
              <a href="/" className="opacity-30 hover:opacity-60 transition-all no-underline" style={{ color: "#fff", textDecoration: "none" }}>Home</a>
              <span className="opacity-15">›</span>
              <a href="/mice" className="opacity-30 hover:opacity-60 transition-all no-underline" style={{ color: "#fff", textDecoration: "none" }}>Mice</a>
              <span className="opacity-15">›</span>
              <span style={{ color: brandCol }} className="font-bold opacity-70">{selectedMouse.name}</span>
            </nav>

            {/* Share buttons */}
            <div className="flex items-center gap-2 mb-4">
              <span className="text-xs opacity-30 uppercase tracking-wider font-bold">Share</span>
              <button onClick={() => { navigator.clipboard.writeText(`https://esportsmice.com/mice/${selectedMouse.name.toLowerCase().replace(/\+/g, "-plus").replace(/[^a-z0-9]+/g, "-").replace(/-+$/, "")}`); }} className="px-2.5 py-1 rounded-lg text-xs font-bold transition-all hover:scale-105" style={{ background: "#ffffff08", border: "1px solid #ffffff10", color: "#fff" }}>📋 Copy Link</button>
              <a href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(selectedMouse.name + " — " + selectedMouse.weight + "g, " + selectedMouse.proUsage + "% pro usage")}&url=${encodeURIComponent("https://esportsmice.com/mice/" + selectedMouse.name.toLowerCase().replace(/\+/g, "-plus").replace(/[^a-z0-9]+/g, "-").replace(/-+$/, ""))}`} target="_blank" rel="noopener noreferrer" className="px-2.5 py-1 rounded-lg text-xs font-bold transition-all hover:scale-105 no-underline" style={{ background: "#1da1f220", border: "1px solid #1da1f230", color: "#1da1f2", textDecoration: "none" }}>𝕏 Tweet</a>
              <a href={`https://reddit.com/submit?url=${encodeURIComponent("https://esportsmice.com/mice/" + selectedMouse.name.toLowerCase().replace(/\+/g, "-plus").replace(/[^a-z0-9]+/g, "-").replace(/-+$/, ""))}&title=${encodeURIComponent(selectedMouse.name + " — Pro Usage, Specs & Review")}`} target="_blank" rel="noopener noreferrer" className="px-2.5 py-1 rounded-lg text-xs font-bold transition-all hover:scale-105 no-underline" style={{ background: "#ff449920", border: "1px solid #ff449930", color: "#ff4499", textDecoration: "none" }}>Reddit</a>
              <a href={`/contact?subject=correction&mouse=${encodeURIComponent(selectedMouse.name)}`} className="px-2.5 py-1 rounded-lg text-xs font-bold transition-all hover:scale-105 no-underline ml-auto" style={{ background: "#ffffff06", border: "1px solid #ffffff10", color: "#ffffff50", textDecoration: "none" }}>⚠️ Suggest Correction</a>
            </div>

            {/* Hero Section */}
            <div className="rounded-2xl p-6 sm:p-8 mb-6" style={{ background: "#0a0a0a", border: `1px solid ${brandCol}15` }}>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Left: Mouse image */}
                <div className="flex flex-col items-center justify-center rounded-xl p-6" style={{ background: `${brandCol}06`, border: `1px solid ${brandCol}12` }}>
                  {imgUrl ? (
                    <img loading="lazy" src={imgUrl} alt={`${selectedMouse.name} by ${selectedMouse.brand} - professional esports gaming mouse review`} className="w-full max-h-48 sm:max-h-64 object-contain object-center mb-4 rounded-lg" style={{ filter: "drop-shadow(0 12px 32px rgba(0,0,0,0.6))" }}
                      onError={e => { e.target.style.display = "none"; e.target.nextSibling.style.display = "flex"; }} />
                  ) : null}
                  <div className={imgUrl ? "hidden" : "flex"} style={{ width: 200, height: 180, alignItems: "center", justifyContent: "center", background: `${brandCol}10`, borderRadius: 16 }}>
                    <span className="inline-block">{icon(selectedMouse.image, 100)}</span>
                  </div>
                  <div className="text-2xl font-black mt-3 text-center" style={{ color: brandCol }}>{selectedMouse.name}</div>
                  <div className="text-sm opacity-85 text-center mt-1">{selectedMouse.brand} · {selectedMouse.shape} · {selectedMouse.connectivity}</div>
                </div>

                {/* Center: Radar chart + specs */}
                <div className="flex flex-col items-center justify-center md:col-span-2 lg:col-span-1">
                  <ResponsiveContainer width="100%" height={220}>
                    <RadarChart data={radarData}>
                      <PolarGrid stroke="#ffffff10" />
                      <PolarAngleAxis dataKey="stat" tick={{ fill: "#ffffff50", fontSize: 13 }} />
                      <PolarRadiusAxis tick={false} axisLine={false} domain={[0, 100]} />
                      <Radar name={selectedMouse.name} dataKey="value" stroke={brandCol} fill={brandCol} fillOpacity={0.2} strokeWidth={2.5} dot={{ r: 3, fill: brandCol, strokeWidth: 0 }} />
                    </RadarChart>
                  </ResponsiveContainer>
                  <div className="grid grid-cols-4 gap-2 w-full mt-2">
                    <StatBox label="Weight" value={selectedMouse.weight} unit="g" color={brandCol} />
                    <StatBox label="DPI" value={selectedMouse.dpi >= 1000 ? `${(selectedMouse.dpi / 1000).toFixed(0)}K` : selectedMouse.dpi} color={brandCol} />
                    <StatBox label="Poll Rate" value={selectedMouse.pollingRate >= 1000 ? `${selectedMouse.pollingRate / 1000}K` : selectedMouse.pollingRate} unit="Hz" color={brandCol} />
                    <StatBox label="Price" value={`$${selectedMouse.price}`} color={brandCol} />
                  </div>
                  <a href={amazonLink(selectedMouse.name)} target="_blank" rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 w-full px-5 py-3 rounded-xl text-sm font-black transition-all mt-3"
                    style={{ background: brandCol, color: "#000" }}>
                    {I.cart(16, "#000")} Buy on Amazon
                  </a>
                </div>

                {/* Right: Pro users */}
                <div>
                  <div className="text-sm uppercase tracking-widest opacity-30 mb-3">Notable Pro Users</div>
                  {usedByPros.length > 0 ? (
                    <div className="space-y-2">
                      {usedByPros.slice(0, 5).map((p, i) => {
                        const gameColors = GAME_COLORS;
                        const gc = gameColors[p.game] || "#888";
                        return (
                          <button key={i} onClick={() => { const pp = proPlayers.find(pp => pp.name === p.name); if (pp) { navigateToPlayer(pp); } else { setActiveTab("players"); } }}
                            className="w-full flex items-center gap-3 p-2.5 rounded-xl cursor-pointer transition-all hover:scale-[1.02] text-left"
                            style={{ background: `${gc}08`, border: `1px solid ${gc}15` }}>
                            <div className="w-10 h-10 rounded-lg flex items-center justify-center text-lg flex-shrink-0" style={{ background: `${gc}15` }}>
                              <Flag country={p.country} size={16} />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="text-sm font-black">{p.name}</div>
                              <div className="text-sm opacity-85">{p.team} · <span style={{ color: gc }}>{p.game}</span> · {p.role}</div>
                            </div>
                            <div className="text-right flex-shrink-0">
                              <div className="text-sm font-bold">{p.dpi} DPI</div>
                              <div className="text-sm opacity-30">{p.edpi ? `${p.edpi} eDPI` : ""}</div>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="text-sm opacity-20 py-8 text-center">No tracked pros currently using this mouse</div>
                  )}
                </div>
              </div>
            </div>

            {/* ── Mouse Description ── */}
            {MOUSE_DESCRIPTIONS[selectedMouse.name] && (() => {
              const desc = MOUSE_DESCRIPTIONS[selectedMouse.name];
              const parts = [];
              if (desc.highlights && desc.highlights.length > 0) {
                const sorted = [...desc.highlights]
                  .map(h => ({ h, idx: desc.text.indexOf(h) }))
                  .filter(x => x.idx !== -1)
                  .sort((a, b) => a.idx - b.idx);
                let cursor = 0;
                sorted.forEach(({ h, idx }) => {
                  if (idx > cursor) parts.push({ text: desc.text.slice(cursor, idx), highlight: false });
                  parts.push({ text: h, highlight: true });
                  cursor = idx + h.length;
                });
                if (cursor < desc.text.length) parts.push({ text: desc.text.slice(cursor), highlight: false });
              } else {
                parts.push({ text: desc.text, highlight: false });
              }
              return (
                <div className="rounded-2xl p-6 mb-6" style={{ background: `${brandCol}05`, border: `1px solid ${brandCol}10` }}>
                  <div className="text-sm uppercase tracking-widest opacity-30 mb-3">About this mouse</div>
                  <p className="text-sm leading-relaxed opacity-60">
                    {parts.map((p, i) => p.highlight ? (
                      <span key={i} className="font-bold opacity-100" style={{ color: brandCol }}>{p.text}</span>
                    ) : (
                      <span key={i}>{p.text}</span>
                    ))}
                  </p>
                </div>
              );
            })()}

            {/* ── Full Spec Table ── */}
            <div className="rounded-2xl p-6 mb-6" style={{ background: "#0a0a0a", border: "1px solid #ffffff08" }}>
              <div className="text-sm uppercase tracking-widest opacity-30 mb-4">Full Specifications</div>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                {[
                  { label: "Brand", value: selectedMouse.brand },
                  { label: "Shape", value: selectedMouse.shape },
                  { label: "Connectivity", value: selectedMouse.connectivity },
                  { label: "Weight", value: `${selectedMouse.weight}g` },
                  { label: "Sensor", value: selectedMouse.sensor },
                  { label: "Max DPI", value: selectedMouse.dpi.toLocaleString() },
                  { label: "Polling Rate", value: `${selectedMouse.pollingRate >= 1000 ? `${selectedMouse.pollingRate / 1000}K` : selectedMouse.pollingRate}Hz` },
                  { label: "Price", value: `$${selectedMouse.price}` },
                  { label: "Pro Usage", value: `${selectedMouse.proUsage}%` },
                  { label: "Rating", value: `${selectedMouse.rating}/10` },
                ].map((spec, idx) => (
                  <div key={idx} className="rounded-lg p-3" style={{ background: "#ffffff04" }}>
                    <div className="text-sm opacity-30 mb-1">{spec.label}</div>
                    <div className="text-sm font-bold" style={{ color: brandCol }}>{spec.value}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* ── Deep Dive Stats Panel ── */}
            {(() => {
              const mousePlayers = allPlayers.filter(p => p.mouse && (p.mouse === selectedMouse.name || p.mouse.includes(selectedMouse.name.split(" ").slice(-2).join(" "))));
              const totalTracked = allPlayers.length;
              const marketShare = totalTracked > 0 ? ((mousePlayers.length / totalTracked) * 100).toFixed(1) : 0;
              const gameDistro = {};
              mousePlayers.forEach(p => { gameDistro[p.game] = (gameDistro[p.game] || 0) + 1; });
              const topGames = Object.entries(gameDistro).sort((a, b) => b[1] - a[1]);
              const gcols = { CS2: "#ff8c00", Valorant: "#ff4655", LoL: "#c89b3c", Fortnite: "#4c7bd9", "Overwatch 2": "#f99e1a", Apex: "#dc2626", "Dota 2": "#e74c3c", "R6 Siege": "#4a86c8", "Rocket League": "#1a9fff", "Call of Duty": "#5cb85c", "Marvel Rivals": "#ed1d24", PUBG: "#f2a900", Deadlock: "#8b5cf6", "Quake Champions": "#ce4a00" };
              const dpiCounts = {};
              mousePlayers.forEach(p => { if (p.dpi) dpiCounts[p.dpi] = (dpiCounts[p.dpi] || 0) + 1; });
              const topDpi = Object.entries(dpiCounts).sort((a, b) => b[1] - a[1]);
              const edpis = mousePlayers.filter(p => p.edpi && p.edpi > 0).map(p => p.edpi);
              const avgEdpi = edpis.length > 0 ? Math.round(edpis.reduce((a, b) => a + b, 0) / edpis.length) : null;
              const minEdpi = edpis.length > 0 ? Math.min(...edpis) : null;
              const maxEdpi = edpis.length > 0 ? Math.max(...edpis) : null;
              const countryCounts = {};
              mousePlayers.forEach(p => { if (p.country) countryCounts[p.country] = (countryCounts[p.country] || 0) + 1; });
              const topCountries = Object.entries(countryCounts).sort((a, b) => b[1] - a[1]).slice(0, 5);
              const teamCounts = {};
              mousePlayers.forEach(p => { if (p.team && p.team !== "Content" && p.team !== "Inactive") teamCounts[p.team] = (teamCounts[p.team] || 0) + 1; });
              const topTeams = Object.entries(teamCounts).sort((a, b) => b[1] - a[1]).slice(0, 3);
              const allMouseCounts = {};
              allPlayers.forEach(p => { if (p.mouse) allMouseCounts[p.mouse] = (allMouseCounts[p.mouse] || 0) + 1; });
              const ranked = Object.entries(allMouseCounts).sort((a, b) => b[1] - a[1]);
              const rank = ranked.findIndex(([name]) => name === selectedMouse.name || name.includes(selectedMouse.name.split(" ").slice(-2).join(" "))) + 1;
              const competitors = mice.filter(m => m.id !== selectedMouse.id && m.shape === selectedMouse.shape && m.connectivity === selectedMouse.connectivity)
                .sort((a, b) => b.proUsage - a.proUsage).slice(0, 4);

              if (mousePlayers.length === 0) return <div className="rounded-2xl p-6 text-center text-sm opacity-20 mb-6" style={{ background: "#ffffff04" }}>No tracked players found for this mouse in our database</div>;

              return (
                <div className="rounded-2xl overflow-hidden mb-6" style={{ border: `1px solid ${brandCol}12` }}>
                  <div className="px-5 py-4 flex items-center gap-2" style={{ background: `${brandCol}08`, borderBottom: `1px solid ${brandCol}10` }}>
                    <span>{I.chart(16)}</span>
                    <span className="text-sm font-black uppercase tracking-widest" style={{ color: brandCol }}>Deep Dive</span>
                    <span className="text-sm opacity-30">·</span>
                    <span className="text-sm opacity-85">{selectedMouse.name} across {totalTracked.toLocaleString()} tracked pros</span>
                  </div>

                  <div className="p-5" style={{ background: "#0a0a0a" }}>
                    <div className="grid grid-cols-3 sm:grid-cols-5 gap-2 mb-5">
                      {[
                        { label: "Pro Users", value: mousePlayers.length, icon: "user" },
                        { label: "Market Share", value: `${marketShare}%`, icon: "trending" },
                        { label: "Popularity Rank", value: rank > 0 ? `#${rank}` : " - ", icon: "trophy" },
                        { label: "Avg eDPI", value: avgEdpi || " - ", icon: "crosshair" },
                        { label: "Games Present", value: topGames.length, icon: "gamepad" },
                      ].map((stat, idx) => (
                        <div key={idx} className="rounded-lg p-3 text-center" style={{ background: "#ffffff05" }}>
                          <div className="mb-0.5 flex items-center justify-center">{icon(stat.icon, 22)}</div>
                          <div className="text-lg font-black" style={{ color: brandCol }}>{stat.value}</div>
                          <div style={{ fontSize: 14 }} className="opacity-30">{stat.label}</div>
                        </div>
                      ))}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                      <div className="rounded-lg p-3" style={{ background: "#ffffff04" }}>
                        <div className="text-sm opacity-30 mb-2.5 font-bold uppercase tracking-wider"><span className="inline-flex mr-1 align-middle">{I.gamepad(12)}</span>Game Breakdown</div>
                        <div className="space-y-2">
                          {topGames.slice(0, 5).map(([game, count]) => (
                            <div key={game}>
                              <div className="flex justify-between text-sm mb-0.5">
                                <span className="font-bold" style={{ color: gcols[game] || "#888" }}>{game}</span>
                                <span className="opacity-50">{count} players · {((count / mousePlayers.length) * 100).toFixed(0)}%</span>
                              </div>
                              <div className="h-2 rounded-full overflow-hidden" style={{ background: "#ffffff08" }}>
                                <div className="h-full rounded-full transition-all" style={{ width: `${(count / topGames[0][1]) * 100}%`, background: gcols[game] || "#888", opacity: 0.7 }} />
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="rounded-lg p-3" style={{ background: "#ffffff04" }}>
                        <div className="text-sm opacity-30 mb-2.5 font-bold uppercase tracking-wider"><span className="inline-flex mr-1 align-middle">{I.gear(12)}</span>Settings Profile</div>
                        <div className="text-sm opacity-30 mb-1.5">Most Common DPI</div>
                        <div className="space-y-1.5 mb-3">
                          {topDpi.slice(0, 3).map(([dpi, count]) => (
                            <div key={dpi} className="flex items-center gap-2">
                              <span className="text-sm font-black w-12" style={{ color: brandCol }}>{dpi}</span>
                              <div className="flex-1 h-2 rounded-full overflow-hidden" style={{ background: "#ffffff08" }}>
                                <div className="h-full rounded-full" style={{ width: `${(count / topDpi[0][1]) * 100}%`, background: brandCol, opacity: 0.6 }} />
                              </div>
                              <span className="text-sm opacity-85 w-14 text-right">{((count / mousePlayers.length) * 100).toFixed(0)}%</span>
                            </div>
                          ))}
                        </div>
                        {avgEdpi && (
                          <div>
                            <div className="text-sm opacity-30 mb-1.5">eDPI Range</div>
                            <div className="flex items-center gap-1 text-sm">
                              <span className="opacity-50">{minEdpi}</span>
                              <div className="flex-1 h-2 rounded-full relative overflow-hidden" style={{ background: "#ffffff08" }}>
                                <div className="absolute h-full rounded-full" style={{ left: `${Math.max(0, ((avgEdpi - minEdpi) / (maxEdpi - minEdpi || 1)) * 100 - 5)}%`, width: "10%", background: brandCol, opacity: 0.8 }} />
                              </div>
                              <span className="opacity-50">{maxEdpi}</span>
                            </div>
                            <div className="text-center text-sm mt-1"><span className="font-black" style={{ color: brandCol }}>{avgEdpi}</span> <span className="opacity-30">avg</span></div>
                          </div>
                        )}
                      </div>

                      <div className="rounded-lg p-3" style={{ background: "#ffffff04" }}>
                        <div className="text-sm opacity-30 mb-2.5 font-bold uppercase tracking-wider"><span className="inline-flex mr-1 align-middle">{I.globe(12)}</span>Demographics</div>
                        <div className="text-sm opacity-30 mb-1.5">Top Regions</div>
                        <div className="flex flex-wrap gap-1.5 mb-3">
                          {topCountries.map(([flag, count]) => (
                            <span key={flag} className="inline-flex items-center gap-1 px-2 py-1 rounded-md text-sm" style={{ background: `${brandCol}10` }}>
                              <Flag country={flag} size={16} />
                              <span className="font-bold" style={{ color: brandCol }}>{count}</span>
                            </span>
                          ))}
                        </div>
                        {topTeams.length > 0 && (
                          <div>
                            <div className="text-sm opacity-30 mb-1.5">Top Teams Using This Mouse</div>
                            <div className="space-y-1.5">
                              {topTeams.map(([team, count]) => (
                                <div key={team} className="flex justify-between items-center text-sm">
                                  <span className="opacity-60 truncate">{team}</span>
                                  <span className="font-black px-2 py-0.5 rounded" style={{ color: brandCol, background: `${brandCol}10` }}>{count}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Similar Mice */}
                    {competitors.length > 0 && (
                      <div className="mt-4 rounded-lg p-3" style={{ background: "#ffffff04" }}>
                        <div className="text-sm opacity-30 mb-2 font-bold uppercase tracking-wider"><span className="inline-flex mr-1 align-middle">{I.refresh(12)}</span>Similar Mice ({selectedMouse.shape} · {selectedMouse.connectivity})</div>
                        <div className="flex flex-wrap gap-2">
                          {competitors.map(c => {
                            const cc = BRAND_COLORS[c.brand] || "#888";
                            return (
                              <button key={c.id} onClick={() => { setSelectedMouse(c); window.scrollTo({ top: 0, behavior: "smooth" }); }}
                                className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-all hover:scale-105"
                                style={{ background: `${cc}08`, border: `1px solid ${cc}15` }}>
                                {MOUSE_IMAGE_URLS[c.name] && <img loading="lazy" src={MOUSE_IMAGE_URLS[c.name]} alt={`${c.name} esports gaming mouse`} className="h-6 object-contain" />}
                                <div>
                                  <div className="font-bold" style={{ color: cc }}>{c.name.replace(c.brand + " ", "")}</div>
                                  <div className="opacity-85">{c.weight}g · {c.sensor} · {"$"}{c.price}</div>
                                </div>
                              </button>
                            );
                          })}
                        </div>
                        {/* Comparison page links */}
                        <div className="flex flex-wrap gap-1.5 mt-3 pt-3" style={{ borderTop: "1px solid #ffffff08" }}>
                          <span className="text-xs opacity-20 mr-1 self-center">Compare:</span>
                          {competitors.slice(0, 4).map(c => {
                            const sA = selectedMouse.name.toLowerCase().replace(/\+/g, "-plus").replace(/[^a-z0-9]+/g, "-").replace(/-+$/, "");
                            const sB = c.name.toLowerCase().replace(/\+/g, "-plus").replace(/[^a-z0-9]+/g, "-").replace(/-+$/, "");
                            const slug = sA < sB ? `${sA}-vs-${sB}` : `${sB}-vs-${sA}`;
                            return <a key={c.id} href={`/compare/${slug}`} className="text-xs px-2 py-1 rounded-full no-underline transition-all hover:scale-105" style={{ background: "#ffffff06", border: "1px solid #ffffff08", color: "#ffffff50", textDecoration: "none" }}>{selectedMouse.name.replace(selectedMouse.brand + " ", "")} vs {c.name.replace(c.brand + " ", "")}</a>;
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })()}

            {/* ── All Pro Players Using This Mouse ── */}
            {usedByPros.length > 5 && (
              <div className="rounded-2xl p-6 mb-6" style={{ background: "#0a0a0a", border: "1px solid #ffffff08" }}>
                <div className="text-sm uppercase tracking-widest opacity-30 mb-4">All Pro Players Using {selectedMouse.name}</div>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                  {usedByPros.slice(5).map((p, i) => {
                    const gameColors = GAME_COLORS;
                    const gc = gameColors[p.game] || "#888";
                    return (
                      <button key={i} onClick={() => { const pp = proPlayers.find(pp => pp.name === p.name); if (pp) { navigateToPlayer(pp); } }}
                        className="flex items-center gap-2 p-2 rounded-lg text-left text-sm transition-all hover:scale-[1.01]"
                        style={{ background: `${gc}06`, border: `1px solid ${gc}10` }}>
                        <Flag country={p.country} size={16} />
                        <span className="font-bold">{p.name}</span>
                        <span className="opacity-30">·</span>
                        <span style={{ color: gc }}>{p.game}</span>
                        <span className="opacity-30 ml-auto">{p.dpi} DPI</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          {/* Recently Viewed */}
          {(() => {
            try {
              const recent = JSON.parse(sessionStorage.getItem("recentMice") || "[]").filter(n => n !== selectedMouse.name);
              if (recent.length === 0) return null;
              const recentMice = recent.map(n => mice.find(m => m.name === n)).filter(Boolean).slice(0, 4);
              if (recentMice.length === 0) return null;
              return (
                <div className="rounded-2xl p-6 mb-6" style={{ background: "#0a0a0a", border: "1px solid #ffffff08" }}>
                  <div className="text-sm uppercase tracking-widest opacity-30 mb-4">Recently Viewed</div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {recentMice.map((m, i) => {
                      const bc = BRAND_COLORS[m.brand] || "#888";
                      return (
                        <button key={i} onClick={() => navigateToMouse(m)} className="rounded-xl p-3 text-center transition-all hover:scale-[1.03]" style={{ background: `${bc}06`, border: `1px solid ${bc}12` }}>
                          {MOUSE_IMAGE_URLS[m.name] && <img loading="lazy" src={MOUSE_IMAGE_URLS[m.name]} alt={m.name} className="h-10 mx-auto object-contain mb-2" />}
                          <div className="text-xs font-bold truncate" style={{ color: bc }}>{m.name.replace(m.brand + " ", "")}</div>
                          <div style={{ fontSize: 10 }} className="opacity-30">{m.weight}g · ${m.price}</div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              );
            } catch { return null; }
          })()}

          {/* Sticky buy bar */}
          <div className="fixed bottom-0 left-0 right-0 z-[80] md:hidden" style={{ background: "#0a0a0aee", borderTop: "1px solid #ffffff10", backdropFilter: "blur(20px)" }}>
            <div className="max-w-7xl mx-auto px-4 py-2.5 flex items-center justify-between gap-3">
              <div className="flex-1 min-w-0">
                <div className="text-xs font-black truncate" style={{ color: brandCol }}>{selectedMouse.name}</div>
                <div style={{ fontSize: 11, color: "#ffffff40" }}>{selectedMouse.weight}g · {selectedMouse.sensor}</div>
              </div>
              <a href={amazonLink(selectedMouse.name)} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-4 py-2 rounded-lg font-black text-sm transition-all no-underline flex-shrink-0" style={{ background: "#f59e0b", color: "#000", textDecoration: "none" }}>
                {I.cart(14, "#000")} ${selectedMouse.price}
              </a>
            </div>

            {/* Suggest correction + best-of links */}
            <div className="flex flex-wrap items-center gap-3 mt-4 mb-2">
              <a href="/contact" className="text-xs opacity-30 hover:opacity-60 transition-all no-underline" style={{ color: "#fff", textDecoration: "none" }}>📝 Suggest a correction</a>
              <span className="opacity-10">·</span>
              <a href="/best/cs2" className="text-xs opacity-30 hover:opacity-60 transition-all no-underline" style={{ color: "#ff8c00", textDecoration: "none" }}>Best for CS2</a>
              <a href="/best/valorant" className="text-xs opacity-30 hover:opacity-60 transition-all no-underline" style={{ color: "#ff4655", textDecoration: "none" }}>Best for Valorant</a>
              <a href="/best/fortnite" className="text-xs opacity-30 hover:opacity-60 transition-all no-underline" style={{ color: "#4c7bd9", textDecoration: "none" }}>Best for Fortnite</a>
              <a href="/best/wireless" className="text-xs opacity-30 hover:opacity-60 transition-all no-underline" style={{ color: "#00ff6a", textDecoration: "none" }}>Best Wireless</a>
              <a href="/best/lightweight" className="text-xs opacity-30 hover:opacity-60 transition-all no-underline" style={{ color: "#a78bfa", textDecoration: "none" }}>Best Lightweight</a>
            </div>
          </div>
          </div>
          );
        })()}
        {/* ── GAMES TAB ── */}
        {activeTab === "games" && !gameDetailSlug && (
          <div>
            <SectionTitle color="#ff3c3c" sub="Click any game to see full mouse usage data, player settings, brand splits, and sensitivity analysis">Game Profiles</SectionTitle>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {gameBreakdown.map((g, i) => {
                const gameColors = GAME_COLORS;
                const col = gameColors[g.game] || "#888";
                const gSlug = g.game.toLowerCase().replace(/\+/g, "-plus").replace(/[^a-z0-9]+/g, "-").replace(/-+$/, "");
                return (
                  <div key={i}
                    className="block rounded-xl p-4 transition-all duration-200 cursor-pointer"
                    style={{ background: `${col}08`, border: `1px solid ${col}15` }}
                    onClick={() => { window.location.href = `/games/${gSlug}`; }}
                    onMouseEnter={(e) => { e.currentTarget.style.background = `${col}15`; e.currentTarget.style.borderColor = `${col}30`; e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = `0 8px 24px ${col}15`; }}
                    onMouseLeave={(e) => { e.currentTarget.style.background = `${col}08`; e.currentTarget.style.borderColor = `${col}15`; e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "none"; }}
                  >
                    <div className="flex items-center gap-3 mb-3">
                      {GAME_IMAGE_URLS[g.game] ? <img loading="lazy" src={GAME_IMAGE_URLS[g.game]} alt={g.game} className="h-7 w-7 object-contain" /> : <span className="inline-flex justify-center">{icon(g.icon, 28)}</span>}
                      <div className="flex-1 min-w-0">
                        <div className="text-base font-black" style={{ color: col }}>{g.game}</div>
                        <div style={{ fontSize: 12, color: "#ffffff40" }}>{g.players} pros tracked</div>
                      </div>
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" style={{ opacity: 0.3, flexShrink: 0 }}>
                        <path d="M6 3L11 8L6 13" stroke={col} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </div>
                    <div className="grid grid-cols-2 gap-2 mb-3">
                      <div className="rounded-lg px-2 py-1.5" style={{ background: `${col}10` }}>
                        <div style={{ fontSize: 11, color: "#ffffff30", fontWeight: 700 }}>Top Mouse</div>
                        <div style={{ fontSize: 12, color: "#ffffffc0", fontWeight: 800 }}>{g.topMice[0]?.name.replace(/(Logitech |Razer |Finalmouse |Lamzu |Pulsar |SteelSeries |Corsair |Zowie |ASUS |WLMouse |Endgame Gear )/, "")}</div>
                      </div>
                      <div className="rounded-lg px-2 py-1.5" style={{ background: `${col}10` }}>
                        <div style={{ fontSize: 11, color: "#ffffff30", fontWeight: 700 }}>Avg DPI</div>
                        <div style={{ fontSize: 12, color: "#ffffffc0", fontWeight: 800 }}>{g.avgDpi}</div>
                      </div>
                      <div className="rounded-lg px-2 py-1.5" style={{ background: `${col}10` }}>
                        <div style={{ fontSize: 11, color: "#ffffff30", fontWeight: 700 }}>Avg Weight</div>
                        <div style={{ fontSize: 12, color: "#ffffffc0", fontWeight: 800 }}>{g.avgWeight}g</div>
                      </div>
                      <div className="rounded-lg px-2 py-1.5" style={{ background: `${col}10` }}>
                        <div style={{ fontSize: 11, color: "#ffffff30", fontWeight: 700 }}>Wireless</div>
                        <div style={{ fontSize: 12, color: "#ffffffc0", fontWeight: 800 }}>{g.wirelessPct}%</div>
                      </div>
                    </div>
                    <div className="flex items-center justify-between gap-2 mt-1">
                      <span className="flex items-center gap-1 px-2 py-1 rounded text-xs font-bold no-underline" style={{ background: `${col}06`, color: `${col}50`, border: `1px solid ${col}10`, fontSize: 10, cursor: "default" }}>
                        📖 Guide Coming Soon
                      </span>
                      <a href={`/games/${gSlug}`} onClick={(e) => e.stopPropagation()} style={{ fontSize: 12, fontWeight: 700, color: col, opacity: 0.7, textDecoration: "none" }}>
                        View →
                      </a>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ── GAME DETAIL VIEW ── */}
        {activeTab === "games" && gameDetailSlug && (() => {
          const gameColorMap = GAME_COLORS;
          const slugToGame = {};
          Object.keys(gameColorMap).forEach(g => { slugToGame[g.toLowerCase().replace(/\+/g, "-plus").replace(/[^a-z0-9]+/g, "-").replace(/-+$/, "")] = g; });
          const gameName = slugToGame[gameDetailSlug];
          if (!gameName) return <div className="text-center py-20 opacity-40">Game not found</div>;
          const col = gameColorMap[gameName];
          const gb = gameBreakdown.find(g => g.game === gameName);
          const gamePlayers = allPlayers.filter(p => p.game === gameName);
          const featuredPlayers = proPlayers.filter(p => p.game === gameName);

          // Mouse usage stats
          const mouseCounts = {};
          gamePlayers.forEach(p => { mouseCounts[p.mouse] = (mouseCounts[p.mouse] || 0) + 1; });
          const mouseRanking = Object.entries(mouseCounts).sort((a, b) => b[1] - a[1]);
          const totalPlayers = gamePlayers.length;

          // Brand stats
          const brandCounts = {};
          gamePlayers.forEach(p => {
            const m = mice.find(mm => mm.name === p.mouse || p.mouse.includes(mm.name));
            if (m) brandCounts[m.brand] = (brandCounts[m.brand] || 0) + 1;
          });
          const brandRanking = Object.entries(brandCounts).sort((a, b) => b[1] - a[1]);
          const totalBranded = brandRanking.reduce((a, b) => a + b[1], 0);

          // DPI distribution
          const dpiGroups = { "400": 0, "800": 0, "1600": 0, "Other": 0 };
          gamePlayers.forEach(p => {
            if (p.dpi === 400) dpiGroups["400"]++;
            else if (p.dpi === 800) dpiGroups["800"]++;
            else if (p.dpi >= 1200 && p.dpi <= 1600) dpiGroups["1600"]++;
            else dpiGroups["Other"]++;
          });

          // eDPI stats
          const edpis = gamePlayers.filter(p => p.edpi > 0 && p.edpi < 50000).map(p => p.edpi);
          const avgEdpi = edpis.length ? Math.round(edpis.reduce((a, b) => a + b, 0) / edpis.length) : null;
          const medianEdpi = edpis.length ? edpis.sort((a, b) => a - b)[Math.floor(edpis.length / 2)] : null;
          const minEdpi = edpis.length ? Math.min(...edpis) : null;
          const maxEdpi = edpis.length ? Math.max(...edpis) : null;

          // Weight stats
          const weights = gamePlayers.map(p => { const m = mice.find(mm => mm.name === p.mouse || p.mouse.includes(mm.name)); return m?.weight; }).filter(Boolean);
          const avgWeight = weights.length ? Math.round(weights.reduce((a, b) => a + b, 0) / weights.length) : 0;
          const lightPct = weights.length ? Math.round(weights.filter(w => w < 60).length / weights.length * 100) : 0;
          const midPct = weights.length ? Math.round(weights.filter(w => w >= 60 && w < 75).length / weights.length * 100) : 0;
          const heavyPct = weights.length ? Math.round(weights.filter(w => w >= 75).length / weights.length * 100) : 0;

          // Shape preference
          const shapes = gamePlayers.map(p => { const m = mice.find(mm => mm.name === p.mouse || p.mouse.includes(mm.name)); return m?.shape; }).filter(Boolean);
          const symPct = shapes.length ? Math.round(shapes.filter(s => s === "Symmetrical").length / shapes.length * 100) : 50;
          const ergoPct = 100 - symPct;

          // Wireless stats
          const connTypes = gamePlayers.map(p => { const m = mice.find(mm => mm.name === p.mouse || p.mouse.includes(mm.name)); return m?.connectivity; }).filter(Boolean);
          const wirelessPct = connTypes.length ? Math.round(connTypes.filter(c => c === "Wireless").length / connTypes.length * 100) : 0;

          // Polling rate distribution
          const hzGroups = {};
          gamePlayers.forEach(p => {
            const hz = p.hz;
            const label = hz >= 4000 ? "4K+" : hz >= 2000 ? "2K" : hz >= 1000 ? "1K" : `${hz}`;
            hzGroups[label] = (hzGroups[label] || 0) + 1;
          });
          const hzRanking = Object.entries(hzGroups).sort((a, b) => b[1] - a[1]);

          // Team stats
          const teamCounts = {};
          gamePlayers.forEach(p => { if (p.team && p.team !== "—") teamCounts[p.team] = (teamCounts[p.team] || 0) + 1; });
          const topTeams = Object.entries(teamCounts).sort((a, b) => b[1] - a[1]).slice(0, 12);

          // Sensitivity categories
          const lowSens = edpis.length && avgEdpi ? gamePlayers.filter(p => p.edpi > 0 && p.edpi < avgEdpi * 0.7).sort((a, b) => a.edpi - b.edpi).slice(0, 8) : [];
          const highSens = edpis.length && avgEdpi ? gamePlayers.filter(p => p.edpi > avgEdpi * 1.3 && p.edpi < 50000).sort((a, b) => b.edpi - a.edpi).slice(0, 8) : [];

          // Mouse usage chart data
          const mouseChartData = mouseRanking.slice(0, 10).map(([name, count]) => ({
            name: name.replace(/(Logitech |Razer |Finalmouse |Lamzu |Pulsar |SteelSeries |Corsair |Zowie |ASUS |WLMouse |Endgame Gear |Vaxee |Ninjutso )/, ""),
            fullName: name,
            usage: Math.round(count / totalPlayers * 100),
            count,
          }));

          // Brand chart data
          const brandChartData = brandRanking.slice(0, 6).map(([name, count]) => ({
            name,
            usage: Math.round(count / totalBranded * 100),
            count,
            fill: BRAND_COLORS[name] || "#888",
          }));

          // Role breakdown (if roles exist)
          const roleCounts = {};
          gamePlayers.forEach(p => { if (p.role && p.role !== "—") { let r = p.role; if (gameName === "CS2") { if (r === "Sniper") r = "AWPer"; else if (r === "AWPer/IGL" || r === "Rifler/IGL") r = "IGL"; else if (r === "Entry" || r === "Lurker" || r === "Support") r = "Rifler"; } roleCounts[r] = (roleCounts[r] || 0) + 1; } });
          const roleRanking = Object.entries(roleCounts).sort((a, b) => b[1] - a[1]).slice(0, 6);

          return (
          <div>
            {/* Breadcrumbs */}
            <nav aria-label="Breadcrumb" className="mt-4 mb-4 flex items-center gap-1.5 text-sm">
              <a href="/" className="opacity-30 hover:opacity-60 transition-all no-underline" style={{ color: "#fff", textDecoration: "none" }}>Home</a>
              <span className="opacity-15">›</span>
              <a href="/games" className="opacity-30 hover:opacity-60 transition-all no-underline" style={{ color: "#fff", textDecoration: "none" }}>Games</a>
              <span className="opacity-15">›</span>
              <span style={{ color: col }} className="font-bold opacity-70">{gameName}</span>
            </nav>

            {/* ── HERO SECTION ── */}
            <div className="rounded-2xl p-6 sm:p-8 mb-6 relative overflow-hidden" style={{ background: `linear-gradient(135deg, ${col}12, ${col}04)`, border: `1px solid ${col}20` }}>
              <div className="absolute top-0 right-0 w-64 h-64 opacity-5" style={{ background: `radial-gradient(circle, ${col}, transparent)`, transform: "translate(30%, -30%)" }} />
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6 mb-6">
                {GAME_IMAGE_URLS[gameName] && <img loading="lazy" src={GAME_IMAGE_URLS[gameName]} alt={gameName} className="h-16 w-16 sm:h-20 sm:w-20 object-contain" />}
                <div className="flex-1">
                  <h1 className="text-2xl sm:text-4xl font-black tracking-tight mb-1" style={{ color: col }}>{gameName}</h1>
                  <div className="text-sm opacity-50">{totalPlayers} professional players tracked · Mouse & settings database</div>
                  <span className="inline-flex items-center gap-1.5 mt-2 px-3 py-1 rounded-lg text-xs font-bold" style={{ background: `${col}08`, border: `1px solid ${col}15`, color: `${col}60`, cursor: "default" }}>📖 Best Mouse Guide — Coming Soon</span>
                </div>
                {mouseRanking[0] && (() => { const topM = mice.find(mm => mm.name === mouseRanking[0][0] || mouseRanking[0][0].includes(mm.name)); return (
                  <a href={amazonLink(mouseRanking[0][0])} target="_blank" rel="noopener noreferrer" className="hidden sm:flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all hover:scale-105 no-underline flex-shrink-0" style={{ background: "#f59e0b12", border: "1px solid #f59e0b25", textDecoration: "none" }}>
                    {MOUSE_IMAGE_URLS[mouseRanking[0][0]] && <img loading="lazy" src={MOUSE_IMAGE_URLS[mouseRanking[0][0]]} alt="" className="h-8 object-contain" />}
                    <div>
                      <div className="text-xs font-bold" style={{ color: "#f59e0b" }}>#1 Mouse</div>
                      <div className="text-xs font-black" style={{ color: "#ffffffd0" }}>{mouseRanking[0][0].replace(/(Logitech |Razer )/, "")}</div>
                    </div>
                    <span className="text-sm font-black px-2 py-1 rounded-lg" style={{ background: "#f59e0b", color: "#000" }}>{topM ? `$${topM.price}` : "Buy"}</span>
                  </a>
                ); })()}
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2 sm:gap-3">
                {[
                  { label: "Players", value: totalPlayers, icon: "player" },
                  { label: "Avg DPI", value: gb?.avgDpi || Math.round(gamePlayers.reduce((a, p) => a + p.dpi, 0) / totalPlayers), icon: "crosshair" },
                  { label: "Avg eDPI", value: avgEdpi || "N/A", icon: "crosshair" },
                  { label: "Avg Weight", value: `${avgWeight}g`, icon: "wind" },
                  { label: "Wireless", value: `${wirelessPct}%`, icon: "signal" },
                  { label: "Avg Poll Rate", value: gb ? `${gb.avgPollRate >= 1000 ? `${(gb.avgPollRate/1000).toFixed(1)}K` : gb.avgPollRate}Hz` : "—", icon: "gear" },
                ].map((s, i) => (
                  <div key={i} className="rounded-xl px-3 py-2.5 text-center" style={{ background: `${col}10`, border: `1px solid ${col}10` }}>
                    <div className="text-lg sm:text-xl font-black" style={{ color: col }}>{s.value}</div>
                    <div style={{ fontSize: 11, color: "#ffffff40", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em" }}>{s.label}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* ── GAME DESCRIPTION ── */}
            {GAME_DESCRIPTIONS[gameName] && (
              <div className="rounded-2xl p-5 sm:p-6 mb-6" style={{ background: "#0a0a0a", border: "1px solid #ffffff08" }}>
                <div className="text-xs uppercase tracking-widest font-bold mb-3" style={{ color: col }}>Game Analysis</div>
                <p className="text-sm leading-relaxed" style={{ color: "#ffffffa0" }}>{GAME_DESCRIPTIONS[gameName]}</p>
              </div>
            )}

            {/* ── MOUSE USAGE RANKINGS ── */}
            <SectionTitle color={col} sub={`Which mice ${gameName} professionals trust to compete at the highest level`}>Mouse Usage Rankings</SectionTitle>
            {/* #1 Mouse highlight CTA */}
            {mouseRanking[0] && (() => {
              const topName = mouseRanking[0][0];
              const topPct = Math.round(mouseRanking[0][1] / totalPlayers * 100);
              const topM = mice.find(mm => mm.name === topName || topName.includes(mm.name));
              return (
                <div className="rounded-xl p-4 mb-4 flex flex-col sm:flex-row items-center gap-4" style={{ background: `${col}08`, border: `1px solid ${col}20` }}>
                  <div className="flex items-center gap-3 flex-1">
                    <span className="text-2xl">🏆</span>
                    <div>
                      <div className="text-xs uppercase tracking-widest font-bold" style={{ color: "#ffffff40" }}>#1 Mouse in {gameName}</div>
                      <div className="text-base font-black" style={{ color: col }}>{topName}</div>
                      <div className="text-xs opacity-40">{topPct}% of pros{topM ? ` · ${topM.weight}g · ${topM.sensor}` : ""}</div>
                    </div>
                  </div>
                  <a href={amazonLink(topName)} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-5 py-2.5 rounded-lg font-bold transition-all hover:scale-105 no-underline" style={{ background: "#f59e0b", color: "#000", textDecoration: "none", fontSize: 14 }}>
                    {I.cart(16, "#000")} Buy on Amazon{topM ? ` — $${topM.price}` : ""}
                  </a>
                </div>
              );
            })()}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              {/* Bar chart */}
              <div className="rounded-2xl p-4 sm:p-6" style={{ background: "#0a0a0a", border: "1px solid #ffffff08" }}>
                <ResponsiveContainer width="100%" height={320}>
                  <BarChart data={mouseChartData} margin={{ top: 10, right: 20, left: 0, bottom: 70 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#ffffff08" />
                    <XAxis dataKey="name" tick={{ fill: "#ffffff40", fontSize: 11 }} angle={-40} textAnchor="end" interval={0} />
                    <YAxis tick={{ fill: "#ffffff40", fontSize: 11 }} unit="%" />
                    <Tooltip content={<CustomTooltip />} />
                    <Bar dataKey="usage" radius={[6, 6, 0, 0]} name="Usage %" label={{ position: "top", fill: "#ffffff60", fontSize: 11, formatter: (v) => `${v}%` }}>
                      {mouseChartData.map((entry, i) => <Cell key={i} fill={i === 0 ? col : `${col}${i < 3 ? "80" : "40"}`} />)}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
              {/* Full ranking table */}
              <div className="rounded-2xl p-4 sm:p-6" style={{ background: "#0a0a0a", border: "1px solid #ffffff08" }}>
                <div className="text-xs uppercase tracking-widest font-bold mb-3" style={{ color: "#ffffff30" }}>Full Mouse Rankings</div>
                <div className="max-h-[320px] overflow-y-auto pr-1" style={{ scrollbarWidth: "thin", scrollbarColor: `${col}30 transparent` }}>
                  <div className="space-y-1.5">
                    {mouseRanking.slice(0, 20).map(([name, count], i) => {
                      const pct = Math.round(count / totalPlayers * 100);
                      const m = mice.find(mm => mm.name === name || name.includes(mm.name));
                      return (
                        <div key={i} className="flex items-center gap-2 px-2 py-1.5 rounded-lg transition-all hover:bg-white/5" style={{ background: i === 0 ? `${col}08` : "transparent" }}>
                          <span className="w-5 text-center font-black text-xs" style={{ color: i < 3 ? col : "#ffffff30" }}>{i + 1}</span>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-bold truncate" style={{ color: i === 0 ? col : "#ffffffc0" }}>{name}</span>
                              {m && <span className="text-xs px-1.5 rounded" style={{ background: `${BRAND_COLORS[m.brand] || "#888"}15`, color: BRAND_COLORS[m.brand] || "#888", fontSize: 10 }}>{m.weight}g</span>}
                            </div>
                          </div>
                          <div className="w-24 h-2 rounded-full overflow-hidden" style={{ background: "#ffffff06" }}>
                            <div className="h-full rounded-full" style={{ width: `${(pct / mouseRanking[0][1] * totalPlayers / 100) * 100}%`, background: i === 0 ? col : `${col}50` }} />
                          </div>
                          <span className="text-xs font-bold w-8 text-right" style={{ color: i < 3 ? col : "#ffffff40" }}>{pct}%</span>
                          <a href={amazonLink(name)} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 px-2 py-0.5 rounded text-xs font-bold transition-all hover:scale-105 no-underline" style={{ background: "#f59e0b15", color: "#f59e0b", border: "1px solid #f59e0b20", textDecoration: "none", fontSize: 10 }}>
                            {I.cart(10)} {m ? `$${m.price}` : "Buy"}
                          </a>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>

            {/* ── BRAND MARKET SHARE ── */}
            <SectionTitle color={col} sub={`Brand loyalty and market share among ${gameName} professionals`}>Brand Dominance</SectionTitle>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              {/* Brand bars */}
              <div className="rounded-2xl p-4 sm:p-6" style={{ background: "#0a0a0a", border: "1px solid #ffffff08" }}>
                <div className="space-y-3">
                  {brandRanking.slice(0, 8).map(([name, count], i) => {
                    const pct = Math.round(count / totalBranded * 100);
                    const bc = BRAND_COLORS[name] || "#888";
                    return (
                      <div key={i}>
                        <div className="flex justify-between text-xs mb-1">
                          <span className="font-black" style={{ color: bc }}>{name}</span>
                          <div className="flex items-center gap-2">
                            <span className="font-bold" style={{ color: `${bc}cc` }}>{pct}% ({count} players)</span>
                            {(() => { const topBrandMouse = mice.filter(m => m.brand === name).sort((a, b) => b.proUsage - a.proUsage)[0]; return topBrandMouse ? (
                              <a href={amazonLink(topBrandMouse.name)} target="_blank" rel="noopener noreferrer" onClick={e => e.stopPropagation()} className="flex items-center gap-0.5 px-1.5 py-0.5 rounded no-underline hover:scale-110 transition-all" style={{ background: "#f59e0b12", color: "#f59e0b", textDecoration: "none", fontSize: 9 }}>
                                {I.cart(8)} ${topBrandMouse.price}
                              </a>
                            ) : null; })()}
                          </div>
                        </div>
                        <div className="h-4 rounded-full overflow-hidden" style={{ background: "#ffffff06" }}>
                          <div className="h-full rounded-full transition-all duration-700" style={{ width: `${pct}%`, background: `${bc}40` }} />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
              {/* Brand pie chart */}
              <div className="rounded-2xl p-4 sm:p-6" style={{ background: "#0a0a0a", border: "1px solid #ffffff08" }}>
                <ResponsiveContainer width="100%" height={280}>
                  <PieChart>
                    <Pie data={brandChartData} dataKey="usage" nameKey="name" cx="50%" cy="50%" innerRadius={55} outerRadius={100} paddingAngle={2} label={({name, usage}) => `${name} ${usage}%`}>
                      {brandChartData.map((entry, i) => <Cell key={i} fill={entry.fill} fillOpacity={0.7} />)}
                    </Pie>
                    <Tooltip content={<CustomTooltip />} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
            {/* Top mouse per brand - shop row */}
            <div className="flex flex-wrap gap-2 mb-8">
              {brandRanking.slice(0, 5).map(([bName], bi) => {
                const topBM = mice.filter(m => m.brand === bName).sort((a, b) => b.proUsage - a.proUsage)[0];
                if (!topBM) return null;
                const bc = BRAND_COLORS[bName] || "#888";
                return (
                  <a key={bi} href={amazonLink(topBM.name)} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-3 py-2 rounded-lg transition-all hover:scale-105 no-underline" style={{ background: `${bc}08`, border: `1px solid ${bc}15`, textDecoration: "none" }}>
                    {MOUSE_IMAGE_URLS[topBM.name] && <img loading="lazy" src={MOUSE_IMAGE_URLS[topBM.name]} alt={topBM.name} className="h-5 object-contain" />}
                    <div>
                      <div className="text-xs font-black" style={{ color: bc }}>{topBM.name.replace(/(Logitech |Razer )/, "")}</div>
                      <div style={{ fontSize: 10, color: "#ffffff30" }}>Top {bName} mouse in {gameName}</div>
                    </div>
                    <span className="text-xs font-bold" style={{ color: "#f59e0b" }}>${topBM.price}</span>
                  </a>
                );
              })}
            </div>

            {/* ── SENSITIVITY DEEP DIVE ── */}
            {edpis.length > 0 && (
              <>
                <SectionTitle color={col} sub={`DPI, eDPI, and sensitivity preferences across ${gameName} pros`}>Sensitivity Deep Dive</SectionTitle>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-4">
                  {[
                    { label: "Average eDPI", value: avgEdpi, sub: "mean across all pros" },
                    { label: "Median eDPI", value: medianEdpi, sub: "50th percentile" },
                    { label: "Lowest eDPI", value: minEdpi, sub: "most precise player" },
                    { label: "Highest eDPI", value: maxEdpi, sub: "fastest player" },
                  ].map((s, i) => (
                    <div key={i} className="rounded-xl px-4 py-3 text-center" style={{ background: `${col}06`, border: `1px solid ${col}10` }}>
                      <div className="text-xl font-black" style={{ color: col }}>{s.value}</div>
                      <div className="text-xs font-bold opacity-70">{s.label}</div>
                      <div style={{ fontSize: 10, color: "#ffffff25" }}>{s.sub}</div>
                    </div>
                  ))}
                </div>

                {/* DPI Distribution */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                  <div className="rounded-2xl p-4 sm:p-6" style={{ background: "#0a0a0a", border: "1px solid #ffffff08" }}>
                    <div className="text-xs uppercase tracking-widest font-bold mb-4" style={{ color: "#ffffff30" }}>DPI Distribution</div>
                    <div className="space-y-3">
                      {Object.entries(dpiGroups).filter(([, c]) => c > 0).sort((a, b) => b[1] - a[1]).map(([dpi, count], i) => {
                        const pct = Math.round(count / totalPlayers * 100);
                        return (
                          <div key={i}>
                            <div className="flex justify-between text-xs mb-1">
                              <span className="font-bold" style={{ color: "#ffffffc0" }}>{dpi} DPI</span>
                              <span style={{ color: col }}>{pct}% ({count})</span>
                            </div>
                            <div className="h-3 rounded-full overflow-hidden" style={{ background: "#ffffff06" }}>
                              <div className="h-full rounded-full" style={{ width: `${pct}%`, background: col, opacity: 0.5 + i * 0.1 }} />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* eDPI scatter visualization */}
                  <div className="rounded-2xl p-4 sm:p-6" style={{ background: "#0a0a0a", border: "1px solid #ffffff08" }}>
                    <div className="text-xs uppercase tracking-widest font-bold mb-4" style={{ color: "#ffffff30" }}>eDPI Spectrum</div>
                    <div className="mb-3">
                      <div className="flex justify-between text-xs mb-1"><span style={{ color: "#3b82f6" }}>Low (precise)</span><span style={{ color: "#f59e0b" }}>High (fast)</span></div>
                      <div className="h-12 rounded-full relative overflow-hidden" style={{ background: "linear-gradient(to right, #3b82f608, #f59e0b08)" }}>
                        {edpis.slice(0, 40).map((e, i) => {
                          const maxE = gameName === "LoL" || gameName === "Dota 2" ? 25000 : Math.max(3000, maxEdpi * 1.1);
                          const pos = Math.min(95, Math.max(2, (e / maxE) * 100));
                          return (
                            <div key={i} className="absolute top-1/2 w-3 h-3 rounded-full" title={`${e} eDPI`}
                              style={{ left: `${pos}%`, transform: "translateX(-50%) translateY(-50%)", background: col, opacity: 0.6, boxShadow: `0 0 6px ${col}60` }} />
                          );
                        })}
                      </div>
                    </div>
                    <div className="grid grid-cols-3 gap-2 text-center mt-4">
                      <div className="rounded-lg px-2 py-2" style={{ background: "#3b82f608", border: "1px solid #3b82f610" }}>
                        <div className="text-sm font-black" style={{ color: "#3b82f6" }}>{edpis.filter(e => e < avgEdpi * 0.7).length}</div>
                        <div style={{ fontSize: 10, color: "#ffffff30" }}>Low sens</div>
                      </div>
                      <div className="rounded-lg px-2 py-2" style={{ background: `${col}08`, border: `1px solid ${col}10` }}>
                        <div className="text-sm font-black" style={{ color: col }}>{edpis.filter(e => e >= avgEdpi * 0.7 && e <= avgEdpi * 1.3).length}</div>
                        <div style={{ fontSize: 10, color: "#ffffff30" }}>Medium sens</div>
                      </div>
                      <div className="rounded-lg px-2 py-2" style={{ background: "#f59e0b08", border: "1px solid #f59e0b10" }}>
                        <div className="text-sm font-black" style={{ color: "#f59e0b" }}>{edpis.filter(e => e > avgEdpi * 1.3).length}</div>
                        <div style={{ fontSize: 10, color: "#ffffff30" }}>High sens</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Low/High sens pros */}
                {(lowSens.length > 0 || highSens.length > 0) && (
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                    {lowSens.length > 0 && (
                      <div className="rounded-2xl p-4 sm:p-6" style={{ background: "#0a0a0a", border: "1px solid #3b82f615" }}>
                        <div className="text-xs uppercase tracking-widest font-bold mb-3" style={{ color: "#3b82f6" }}>🎯 Low Sensitivity Pros</div>
                        <div className="text-xs opacity-30 mb-3">Below 70% of average eDPI — maximum precision players</div>
                        <div className="space-y-1.5">
                          {lowSens.map((p, i) => (
                            <div key={i} className="flex items-center gap-2 text-xs px-2 py-1.5 rounded-lg cursor-pointer hover:bg-white/5" onClick={() => navigateToPlayer(p)}>
                              <Flag country={p.country} size={16} />
                              <span className="font-bold truncate" style={{ color: "#3b82f6", maxWidth: 100 }}>{p.name}</span>
                              <span className="opacity-30 truncate flex-1">{p.team}</span>
                              <span className="font-black" style={{ color: "#3b82f6" }}>{p.edpi}</span>
                              <span className="opacity-20">eDPI</span>
                              <a href={amazonLink(p.mouse)} target="_blank" rel="noopener noreferrer" onClick={e => e.stopPropagation()} className="px-1.5 py-0.5 rounded no-underline hover:scale-110 transition-all flex-shrink-0" style={{ background: "#f59e0b10", color: "#f59e0b", textDecoration: "none", fontSize: 9 }}>{I.cart(8)}</a>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    {highSens.length > 0 && (
                      <div className="rounded-2xl p-4 sm:p-6" style={{ background: "#0a0a0a", border: "1px solid #f59e0b15" }}>
                        <div className="text-xs uppercase tracking-widest font-bold mb-3" style={{ color: "#f59e0b" }}>⚡ High Sensitivity Pros</div>
                        <div className="text-xs opacity-30 mb-3">Above 130% of average eDPI — fastest reaction players</div>
                        <div className="space-y-1.5">
                          {highSens.map((p, i) => (
                            <div key={i} className="flex items-center gap-2 text-xs px-2 py-1.5 rounded-lg cursor-pointer hover:bg-white/5" onClick={() => navigateToPlayer(p)}>
                              <Flag country={p.country} size={16} />
                              <span className="font-bold truncate" style={{ color: "#f59e0b", maxWidth: 100 }}>{p.name}</span>
                              <span className="opacity-30 truncate flex-1">{p.team}</span>
                              <span className="font-black" style={{ color: "#f59e0b" }}>{p.edpi}</span>
                              <span className="opacity-20">eDPI</span>
                              <a href={amazonLink(p.mouse)} target="_blank" rel="noopener noreferrer" onClick={e => e.stopPropagation()} className="px-1.5 py-0.5 rounded no-underline hover:scale-110 transition-all flex-shrink-0" style={{ background: "#f59e0b10", color: "#f59e0b", textDecoration: "none", fontSize: 9 }}>{I.cart(8)}</a>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </>
            )}

            {/* Sensitivity-matched recommendations */}
            {edpis.length > 5 && (() => {
              const lowPlayers = gamePlayers.filter(p => p.edpi > 0 && p.edpi < avgEdpi * 0.7);
              const midPlayers = gamePlayers.filter(p => p.edpi >= avgEdpi * 0.7 && p.edpi <= avgEdpi * 1.3);
              const hiPlayers = gamePlayers.filter(p => p.edpi > avgEdpi * 1.3 && p.edpi < 50000);
              const topMouseForGroup = (players) => {
                const mc = {};
                players.forEach(p => { mc[p.mouse] = (mc[p.mouse] || 0) + 1; });
                const top = Object.entries(mc).sort((a, b) => b[1] - a[1])[0];
                return top ? { name: top[0], count: top[1], mouse: mice.find(mm => mm.name === top[0] || top[0].includes(mm.name)) } : null;
              };
              const tiers = [
                { label: "🎯 Low Sensitivity", desc: "Precision aimers", players: lowPlayers, color: "#3b82f6" },
                { label: "⚖️ Medium Sensitivity", desc: "Balanced play", players: midPlayers, color: col },
                { label: "⚡ High Sensitivity", desc: "Fast reactions", players: hiPlayers, color: "#f59e0b" },
              ].map(t => ({ ...t, top: topMouseForGroup(t.players) })).filter(t => t.top);
              if (tiers.length < 2) return null;
              return (
                <div className="rounded-xl p-4 mb-8 flex flex-col sm:flex-row gap-3" style={{ background: `${col}04`, border: `1px solid ${col}10` }}>
                  <div className="text-xs uppercase tracking-widest font-bold self-center sm:w-32 flex-shrink-0" style={{ color: col }}>Best Mouse by<br/>Sensitivity</div>
                  <div className="flex-1 flex flex-wrap gap-3">
                    {tiers.map((t, ti) => t.top?.mouse && (
                      <a key={ti} href={amazonLink(t.top.name)} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-3 py-2 rounded-lg transition-all hover:scale-105 no-underline flex-1 min-w-[200px]" style={{ background: `${t.color}08`, border: `1px solid ${t.color}15`, textDecoration: "none" }}>
                        {MOUSE_IMAGE_URLS[t.top.name] && <img loading="lazy" src={MOUSE_IMAGE_URLS[t.top.name]} alt="" className="h-6 object-contain flex-shrink-0" />}
                        <div className="min-w-0">
                          <div className="text-xs font-bold" style={{ color: t.color }}>{t.label}</div>
                          <div className="text-xs font-black truncate" style={{ color: "#ffffffd0" }}>{t.top.name.replace(/(Logitech |Razer )/, "")}</div>
                          <div style={{ fontSize: 10, color: "#ffffff30" }}>{t.top.count} {t.desc} pros</div>
                        </div>
                        <span className="text-xs font-bold flex-shrink-0" style={{ color: "#f59e0b" }}>${t.top.mouse.price}</span>
                      </a>
                    ))}
                  </div>
                </div>
              );
            })()}

            {/* ── GEAR DEEP DIVE ── */}
            <SectionTitle color={col} sub={`Weight, shape, connectivity, and polling rate breakdown`}>Gear Deep Dive</SectionTitle>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
              {/* Weight breakdown */}
              <div className="rounded-2xl p-4" style={{ background: "#0a0a0a", border: "1px solid #ffffff08" }}>
                <div className="text-xs uppercase tracking-widest font-bold mb-3" style={{ color: "#ffffff30" }}>Weight</div>
                <div className="text-2xl font-black mb-2" style={{ color: col }}>{avgWeight}g</div>
                <div className="text-xs opacity-30 mb-3">average mouse weight</div>
                <div className="space-y-1.5">
                  {[
                    { label: "Ultralight (<60g)", pct: lightPct, color: "#00ff6a" },
                    { label: "Medium (60–75g)", pct: midPct, color: col },
                    { label: "Heavy (75g+)", pct: heavyPct, color: "#ff4444" },
                  ].map((w, i) => (
                    <div key={i}>
                      <div className="flex justify-between text-xs mb-0.5">
                        <span style={{ color: "#ffffff70" }}>{w.label}</span>
                        <span className="font-bold" style={{ color: w.color }}>{w.pct}%</span>
                      </div>
                      <div className="h-1.5 rounded-full overflow-hidden" style={{ background: "#ffffff06" }}>
                        <div className="h-full rounded-full" style={{ width: `${w.pct}%`, background: w.color, opacity: 0.5 }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Shape preference */}
              <div className="rounded-2xl p-4" style={{ background: "#0a0a0a", border: "1px solid #ffffff08" }}>
                <div className="text-xs uppercase tracking-widest font-bold mb-3" style={{ color: "#ffffff30" }}>Shape</div>
                <div className="flex gap-3 mb-3">
                  <div className="flex-1 text-center rounded-lg px-2 py-2" style={{ background: `${col}10` }}>
                    <div className="text-xl font-black" style={{ color: col }}>{symPct}%</div>
                    <div style={{ fontSize: 10, color: "#ffffff30" }}>Symmetrical</div>
                  </div>
                  <div className="flex-1 text-center rounded-lg px-2 py-2" style={{ background: "#ffffff06" }}>
                    <div className="text-xl font-black" style={{ color: "#ffffffa0" }}>{ergoPct}%</div>
                    <div style={{ fontSize: 10, color: "#ffffff30" }}>Ergonomic</div>
                  </div>
                </div>
                <div className="h-3 rounded-full overflow-hidden flex" style={{ background: "#ffffff06" }}>
                  <div className="h-full" style={{ width: `${symPct}%`, background: `${col}60` }} />
                  <div className="h-full" style={{ width: `${ergoPct}%`, background: "#ffffff15" }} />
                </div>
              </div>

              {/* Connectivity */}
              <div className="rounded-2xl p-4" style={{ background: "#0a0a0a", border: "1px solid #ffffff08" }}>
                <div className="text-xs uppercase tracking-widest font-bold mb-3" style={{ color: "#ffffff30" }}>Connectivity</div>
                <div className="flex gap-3 mb-3">
                  <div className="flex-1 text-center rounded-lg px-2 py-2" style={{ background: `${col}10` }}>
                    <div className="text-xl font-black" style={{ color: col }}>{wirelessPct}%</div>
                    <div style={{ fontSize: 10, color: "#ffffff30" }}>Wireless</div>
                  </div>
                  <div className="flex-1 text-center rounded-lg px-2 py-2" style={{ background: "#ffffff06" }}>
                    <div className="text-xl font-black" style={{ color: "#ffffffa0" }}>{100 - wirelessPct}%</div>
                    <div style={{ fontSize: 10, color: "#ffffff30" }}>Wired</div>
                  </div>
                </div>
                <div className="h-3 rounded-full overflow-hidden flex" style={{ background: "#ffffff06" }}>
                  <div className="h-full" style={{ width: `${wirelessPct}%`, background: `${col}60` }} />
                  <div className="h-full" style={{ width: `${100 - wirelessPct}%`, background: "#ffffff15" }} />
                </div>
              </div>

              {/* Polling rate */}
              <div className="rounded-2xl p-4" style={{ background: "#0a0a0a", border: "1px solid #ffffff08" }}>
                <div className="text-xs uppercase tracking-widest font-bold mb-3" style={{ color: "#ffffff30" }}>Polling Rate</div>
                <div className="text-2xl font-black mb-2" style={{ color: col }}>{gb ? `${gb.avgPollRate >= 1000 ? `${(gb.avgPollRate/1000).toFixed(1)}K` : gb.avgPollRate}Hz` : "—"}</div>
                <div className="text-xs opacity-30 mb-3">average polling rate</div>
                <div className="space-y-1.5">
                  {hzRanking.slice(0, 4).map(([label, count], i) => {
                    const pct = Math.round(count / totalPlayers * 100);
                    return (
                      <div key={i} className="flex justify-between text-xs">
                        <span style={{ color: "#ffffff70" }}>{label}Hz</span>
                        <span className="font-bold" style={{ color: i === 0 ? col : "#ffffff50" }}>{pct}%</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Shop by Gear Category */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-8">
              {(() => {
                const gameMiceData = gamePlayers.map(p => mice.find(mm => mm.name === p.mouse || p.mouse.includes(mm.name))).filter(Boolean);
                const lightestUsed = [...new Set(gameMiceData)].filter(m => m.weight < 60).sort((a, b) => a.weight - b.weight)[0];
                const topWireless = [...new Set(gameMiceData)].filter(m => m.connectivity === "Wireless").sort((a, b) => b.proUsage - a.proUsage)[0];
                const bestValue = [...new Set(gameMiceData)].filter(m => m.proUsage >= 1).sort((a, b) => a.price - b.price)[0];
                const topSym = [...new Set(gameMiceData)].filter(m => m.shape === "Symmetrical").sort((a, b) => b.proUsage - a.proUsage)[0];
                return [
                  lightestUsed && { label: "⚡ Lightest", mouse: lightestUsed, sub: `${lightestUsed.weight}g` },
                  topWireless && { label: "📡 Top Wireless", mouse: topWireless, sub: topWireless.connectivity },
                  bestValue && { label: "💰 Best Value", mouse: bestValue, sub: `$${bestValue.price}` },
                  topSym && { label: "◉ Top Symmetrical", mouse: topSym, sub: topSym.shape },
                ].filter(Boolean).map((item, i) => (
                  <a key={i} href={amazonLink(item.mouse.name)} target="_blank" rel="noopener noreferrer" className="rounded-xl p-3 text-center transition-all hover:scale-[1.03] no-underline block" style={{ background: `${col}06`, border: `1px solid ${col}10`, textDecoration: "none" }}>
                    <div className="text-xs font-bold mb-1" style={{ color: col }}>{item.label}</div>
                    <div className="text-xs font-black truncate" style={{ color: "#ffffffd0" }}>{item.mouse.name.replace(/(Logitech |Razer )/, "")}</div>
                    <div style={{ fontSize: 10, color: "#ffffff30" }}>{item.sub}</div>
                    <div className="inline-flex items-center gap-1 mt-1.5 px-2 py-0.5 rounded text-xs font-bold" style={{ background: "#f59e0b15", color: "#f59e0b", fontSize: 10 }}>
                      {I.cart(8)} ${item.mouse.price}
                    </div>
                  </a>
                ));
              })()}
            </div>

            {/* ── TOP FEATURED PROS ── */}
            {featuredPlayers.length > 0 && (
              <>
                <SectionTitle color={col} sub={`Star players and their complete mouse configurations`}>Featured Pro Players</SectionTitle>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mb-8">
                  {featuredPlayers.slice(0, 12).map((p, i) => {
                    const m = mice.find(mm => mm.name === p.mouse || p.mouse.includes(mm.name));
                    return (
                      <div key={i} className="rounded-xl p-4 cursor-pointer transition-all hover:scale-[1.02]"
                        style={{ background: `${col}06`, border: `1px solid ${col}10` }}
                        onClick={() => navigateToPlayer(p)}>
                        <div className="flex items-center gap-2 mb-3">
                          <Flag country={p.country} size={20} />
                          <div className="flex-1 min-w-0">
                            <div className="text-sm font-black truncate" style={{ color: col }}>{p.name}</div>
                            <div style={{ fontSize: 11, color: "#ffffff40" }}>{p.team}{p.role && p.role !== "—" ? ` · ${p.role}` : ""}</div>
                          </div>
                        </div>
                        <div className="space-y-1">
                          <div className="flex justify-between text-xs"><span className="opacity-50">Mouse</span><span className="font-bold truncate ml-2" style={{ color: "#ffffffc0", maxWidth: 160 }}>{p.mouse}</span></div>
                          <div className="flex justify-between text-xs"><span className="opacity-50">DPI</span><span className="font-bold" style={{ color: "#ffffffc0" }}>{p.dpi}</span></div>
                          {p.sens > 0 && <div className="flex justify-between text-xs"><span className="opacity-50">Sensitivity</span><span className="font-bold" style={{ color: "#ffffffc0" }}>{p.sens}</span></div>}
                          {p.edpi > 0 && <div className="flex justify-between text-xs"><span className="opacity-50">eDPI</span><span className="font-black" style={{ color: col }}>{p.edpi}</span></div>}
                          <div className="flex justify-between text-xs"><span className="opacity-50">Polling</span><span className="font-bold" style={{ color: "#ffffffc0" }}>{p.hz >= 1000 ? `${(p.hz/1000).toFixed(p.hz % 1000 === 0 ? 0 : 1)}KHz` : `${p.hz}Hz`}</span></div>
                          {m && <div className="flex justify-between text-xs"><span className="opacity-50">Weight</span><span className="font-bold" style={{ color: "#ffffffc0" }}>{m.weight}g</span></div>}
                        </div>
                        <a href={amazonLink(p.mouse)} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-1.5 mt-3 px-3 py-1.5 rounded-lg text-xs font-bold transition-all hover:scale-105 no-underline w-full" style={{ background: "#f59e0b15", color: "#f59e0b", border: "1px solid #f59e0b20", textDecoration: "none" }}>
                          {I.cart(12)} Buy {p.mouse.split(" ").slice(-2).join(" ")}{m ? ` — $${m.price}` : ""}
                        </a>
                      </div>
                    );
                  })}
                </div>
              </>
            )}

            {/* ── TOP TEAMS ── */}
            {topTeams.length > 0 && (
              <>
                <SectionTitle color={col} sub={`Organizations with the most tracked ${gameName} professionals`}>Top Teams</SectionTitle>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2 mb-8">
                  {topTeams.map(([team, count], i) => {
                    const teamPlayers = gamePlayers.filter(p => p.team === team);
                    const teamMice = {};
                    teamPlayers.forEach(p => { teamMice[p.mouse] = (teamMice[p.mouse] || 0) + 1; });
                    const topMouse = Object.entries(teamMice).sort((a, b) => b[1] - a[1])[0];
                    return (
                      <div key={i} className="rounded-xl px-3 py-3" style={{ background: `${col}06`, border: `1px solid ${col}10` }}>
                        <div className="text-xs font-black mb-1 truncate" style={{ color: col }}>{team}</div>
                        <div className="flex items-baseline gap-1">
                          <span className="text-lg font-black" style={{ color: "#ffffffd0" }}>{count}</span>
                          <span style={{ fontSize: 10, color: "#ffffff30" }}>players</span>
                        </div>
                        {topMouse && <div className="text-xs mt-1 truncate" style={{ color: "#ffffff30" }}>Top: {topMouse[0].replace(/(Logitech |Razer )/, "")}</div>}
                        {topMouse && <a href={amazonLink(topMouse[0])} target="_blank" rel="noopener noreferrer" onClick={e => e.stopPropagation()} className="inline-flex items-center gap-0.5 mt-1 px-1.5 py-0.5 rounded no-underline hover:scale-110 transition-all" style={{ background: "#f59e0b10", color: "#f59e0b", textDecoration: "none", fontSize: 9 }}>{I.cart(7)} Buy{(() => { const tm = mice.find(mm => mm.name === topMouse[0]); return tm ? ` $${tm.price}` : ""; })()}</a>}
                      </div>
                    );
                  })}
                </div>
              </>
            )}

            {/* ── ROLE BREAKDOWN ── */}
            {roleRanking.length > 1 && (
              <div className="rounded-2xl p-4 sm:p-6 mb-8" style={{ background: "#0a0a0a", border: "1px solid #ffffff08" }}>
                <div className="text-xs uppercase tracking-widest font-bold mb-4" style={{ color: col }}>Role Breakdown</div>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
                  {roleRanking.map(([role, count], i) => {
                    const rolePlayers = gamePlayers.filter(p => { let r = p.role; if (gameName === "CS2") { if (r === "Sniper") r = "AWPer"; else if (r === "AWPer/IGL" || r === "Rifler/IGL") r = "IGL"; else if (r === "Entry" || r === "Lurker" || r === "Support") r = "Rifler"; } return r === role; });
                    const roleEdpis = rolePlayers.filter(p => p.edpi > 0 && p.edpi < 50000).map(p => p.edpi);
                    const roleAvgEdpi = roleEdpis.length ? Math.round(roleEdpis.reduce((a, b) => a + b, 0) / roleEdpis.length) : null;
                    const roleAvgDpi = Math.round(rolePlayers.reduce((a, p) => a + p.dpi, 0) / rolePlayers.length);
                    const roleMiceCounts = {};
                    rolePlayers.forEach(p => { roleMiceCounts[p.mouse] = (roleMiceCounts[p.mouse] || 0) + 1; });
                    const roleTopMouse = Object.entries(roleMiceCounts).sort((a, b) => b[1] - a[1])[0];
                    return (
                      <div key={i} className="rounded-lg px-3 py-2 text-center" style={{ background: `${col}08` }}>
                        <div className="text-xs font-black mb-1" style={{ color: col }}>{role}</div>
                        <div className="text-sm font-bold" style={{ color: "#ffffffd0" }}>{count} pros</div>
                        <div style={{ fontSize: 10, color: "#ffffff30" }}>{roleAvgDpi} DPI avg</div>
                        {roleAvgEdpi && <div style={{ fontSize: 10, color: "#ffffff30" }}>{roleAvgEdpi} eDPI avg</div>}
                        {roleTopMouse && <div className="mt-1 truncate" style={{ fontSize: 9, color: "#ffffff25" }}>#1: {roleTopMouse[0].replace(/(Logitech |Razer )/, "")}</div>}
                        {roleTopMouse && <a href={amazonLink(roleTopMouse[0])} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-0.5 mt-1 px-1 py-0.5 rounded no-underline hover:scale-110 transition-all" style={{ background: "#f59e0b10", color: "#f59e0b", textDecoration: "none", fontSize: 8 }}>{I.cart(7)} Buy</a>}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* ── FULL PLAYER ROSTER ── */}
            <SectionTitle color={col} sub={`Complete settings database for every tracked ${gameName} professional`}>Full Player Roster</SectionTitle>
            <div className="rounded-2xl overflow-hidden mb-8" style={{ border: "1px solid #ffffff08" }}>
              <div className="overflow-x-auto">
                <table className="w-full text-xs" style={{ background: "#0a0a0a" }}>
                  <thead>
                    <tr style={{ background: `${col}10` }}>
                      <th className="text-left px-3 py-2 font-black" style={{ color: col }}>#</th>
                      <th className="text-left px-3 py-2 font-black" style={{ color: col }}>Player</th>
                      <th className="text-left px-3 py-2 font-black" style={{ color: col }}>Team</th>
                      <th className="text-left px-3 py-2 font-black" style={{ color: col }}>Mouse</th>
                      <th className="text-right px-3 py-2 font-black" style={{ color: col }}>DPI</th>
                      <th className="text-right px-3 py-2 font-black" style={{ color: col }}>Sens</th>
                      <th className="text-right px-3 py-2 font-black" style={{ color: col }}>eDPI</th>
                      <th className="text-right px-3 py-2 font-black" style={{ color: col }}>Hz</th>
                      <th className="text-center px-3 py-2 font-black" style={{ color: "#f59e0b" }}>Buy</th>
                    </tr>
                  </thead>
                  <tbody>
                    {gamePlayers.sort((a, b) => (a.edpi || 99999) - (b.edpi || 99999)).map((p, i) => (
                      <tr key={i} className="transition-all hover:bg-white/5 cursor-pointer" onClick={() => navigateToPlayer(p)}
                        style={{ borderBottom: "1px solid #ffffff05" }}>
                        <td className="px-3 py-1.5" style={{ color: "#ffffff20" }}>{i + 1}</td>
                        <td className="px-3 py-1.5">
                          <span className="flex items-center gap-1.5">
                            <Flag country={p.country} size={16} />
                            <span className="font-bold" style={{ color: "#ffffffd0" }}>{p.name}</span>
                            {p.role && p.role !== "—" && <span className="px-1 rounded" style={{ background: `${col}15`, color: `${col}aa`, fontSize: 9 }}>{p.role}</span>}
                          </span>
                        </td>
                        <td className="px-3 py-1.5" style={{ color: "#ffffff50" }}>{p.team}</td>
                        <td className="px-3 py-1.5 font-bold truncate" style={{ maxWidth: 180 }}><a href={amazonLink(p.mouse)} target="_blank" rel="noopener noreferrer" onClick={e => e.stopPropagation()} className="no-underline hover:underline" style={{ color: "#f59e0b", textDecoration: "none" }}>{p.mouse}</a></td>
                        <td className="px-3 py-1.5 text-right font-bold" style={{ color: "#ffffffa0" }}>{p.dpi}</td>
                        <td className="px-3 py-1.5 text-right" style={{ color: "#ffffff60" }}>{p.sens || "—"}</td>
                        <td className="px-3 py-1.5 text-right font-black" style={{ color: p.edpi > 0 ? col : "#ffffff30" }}>{p.edpi > 0 ? p.edpi : "—"}</td>
                        <td className="px-3 py-1.5 text-right" style={{ color: "#ffffff60" }}>{p.hz >= 1000 ? `${(p.hz/1000).toFixed(p.hz % 1000 === 0 ? 0 : 1)}K` : p.hz}</td>
                        <td className="px-3 py-1.5 text-center"><a href={amazonLink(p.mouse)} target="_blank" rel="noopener noreferrer" onClick={e => e.stopPropagation()} className="px-1.5 py-0.5 rounded no-underline hover:scale-110 transition-all inline-flex" style={{ background: "#f59e0b10", color: "#f59e0b", textDecoration: "none", fontSize: 9 }}>{I.cart(8)}</a></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* ── COMPLETE YOUR SETUP CTA ── */}
            <div className="rounded-2xl p-5 sm:p-8 mb-8 text-center relative overflow-hidden" style={{ background: `linear-gradient(135deg, ${col}08, #0a0a0a)`, border: `1px solid ${col}15` }}>
              <div className="relative z-10">
                <div className="text-xs uppercase tracking-widest font-bold mb-2" style={{ color: col }}>Complete Your {gameName} Pro Setup</div>
                <div className="text-sm opacity-40 mb-4 max-w-lg mx-auto">Get the same mouse that {gameName} pros trust. Click any mouse to buy on Amazon with our verified pricing.</div>
                <div className="flex flex-wrap justify-center gap-3">
                  {mouseRanking.slice(0, 5).map(([name, count], mi) => {
                    const m = mice.find(mm => mm.name === name || name.includes(mm.name));
                    const pct = Math.round(count / totalPlayers * 100);
                    return (
                      <a key={mi} href={amazonLink(name)} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-4 py-2.5 rounded-xl transition-all hover:scale-105 no-underline" style={{ background: mi === 0 ? `${col}15` : "#ffffff06", border: mi === 0 ? `1px solid ${col}30` : "1px solid #ffffff08", textDecoration: "none" }}>
                        {MOUSE_IMAGE_URLS[name] && <img loading="lazy" src={MOUSE_IMAGE_URLS[name]} alt={name} className="h-6 object-contain" />}
                        <div className="text-left">
                          <div className="text-xs font-black" style={{ color: mi === 0 ? col : "#ffffffd0" }}>{name.replace(/(Logitech |Razer )/, "")}</div>
                          <div style={{ fontSize: 10, color: "#ffffff30" }}>{pct}% of pros{m ? ` · ${m.weight}g` : ""}</div>
                        </div>
                        <span className="text-xs font-bold px-2 py-1 rounded" style={{ background: "#f59e0b20", color: "#f59e0b" }}>{m ? `$${m.price}` : "Buy"}</span>
                      </a>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* ── OTHER GAMES NAV ── */}
            <div className="rounded-2xl p-5 mb-4" style={{ background: "#0a0a0a", border: "1px solid #ffffff08" }}>
              <div className="text-xs uppercase tracking-widest font-bold mb-3" style={{ color: "#ffffff30" }}>Explore Other Games</div>
              <div className="flex flex-wrap gap-2">
                {gameBreakdown.filter(g => g.game !== gameName).map((g, i) => {
                  const gc = { CS2: "#ff8c00", Valorant: "#ff4655", LoL: "#c89b3c", Fortnite: "#4c7bd9", "Overwatch 2": "#f99e1a", Apex: "#dc2626", "Dota 2": "#e74c3c", "R6 Siege": "#4a86c8", "Rocket League": "#1a9fff", "Call of Duty": "#5cb85c", "Marvel Rivals": "#ed1d24", PUBG: "#f2a900", Deadlock: "#8b5cf6", "Quake Champions": "#ce4a00" }[g.game] || "#888";
                  return (
                    <button key={i} onClick={() => { window.location.href = `/games/${g.game.toLowerCase().replace(/\+/g, "-plus").replace(/[^a-z0-9]+/g, "-").replace(/-+$/, "")}`; }}
                      className="px-3 py-1.5 rounded-full text-xs font-bold transition-all hover:scale-105"
                      style={{ background: `${gc}10`, color: gc, border: `1px solid ${gc}20` }}>
                      {g.game} ({g.players})
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
          );
        })()}


        {/* ── RANKINGS TAB ── */}
        {activeTab === "rankings" && (
          <div>
            <SectionTitle color="#00ff6a" sub="Sort and filter to find the perfect esports mouse">Complete Mouse Rankings</SectionTitle>
            {/* ── UNIFIED FILTER BAR ── */}
            {(() => {
              const SORT_OPTIONS_R = [
                { value: "proUsage", label: "Pro Usage" },
                { value: "weight", label: "Weight ↑" },
                { value: "price", label: "Price ↑" },
                { value: "rating", label: "Rating" },
                { value: "pollingRate", label: "Poll Rate" },
              ];
              const sortLabelR = SORT_OPTIONS_R.find(o => o.value === sortBy)?.label || "Pro Usage";
              const brandListR = [...new Set(mice.map(m => m.brand))].sort();
              const activeFilterCountR = [filterBrand, filterWeight, filterPrice, filterConn, filterShape].filter(f => f !== "All").length;
              const activeFiltersR = [];
              if (filterBrand !== "All") activeFiltersR.push({ label: filterBrand, clear: () => setFilterBrand("All") });
              if (filterWeight !== "All") activeFiltersR.push({ label: filterWeight === "Ultralight" ? "<50g" : filterWeight === "Light" ? "50-64g" : filterWeight === "Medium" ? "65-84g" : "85g+", clear: () => setFilterWeight("All") });
              if (filterPrice !== "All") activeFiltersR.push({ label: filterPrice === "Budget" ? "Under $60" : filterPrice === "Mid" ? "$60-$119" : "$120+", clear: () => setFilterPrice("All") });
              if (filterConn !== "All") activeFiltersR.push({ label: filterConn, clear: () => setFilterConn("All") });
              if (filterShape !== "All") activeFiltersR.push({ label: filterShape, clear: () => setFilterShape("All") });
              const clearAllFiltersR = () => { setFilterBrand("All"); setFilterWeight("All"); setFilterPrice("All"); setFilterConn("All"); setFilterShape("All"); };
              const accentR = "#00ff6a";
              const chipStyleR = (active, brandColor) => ({
                padding: "5px 10px", borderRadius: 7, fontSize: 12, fontWeight: 700, cursor: "pointer",
                background: active ? (brandColor ? `${brandColor}18` : `${accentR}20`) : "#0a0a0a",
                border: `1px solid ${active ? (brandColor ? `${brandColor}50` : `${accentR}50`) : "#ffffff0a"}`,
                color: active ? (brandColor || accentR) : "#ffffff50",
                transition: "all 0.15s", whiteSpace: "nowrap",
              });

              return (
                <div className="mb-5" style={{ background: "#111", border: "1px solid #ffffff0a", borderRadius: 12, padding: 10, position: "relative" }}>
                  <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 1, borderRadius: "12px 12px 0 0", background: `linear-gradient(90deg, transparent, ${accentR}50, transparent)` }} />

                  <div className="flex gap-2.5 items-center" style={{ marginBottom: showFilters ? 10 : 0, transition: "margin 0.3s" }}>
                    <div className="flex-1 relative" style={{ minWidth: 0 }}>
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", opacity: 0.25 }}><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
                      <input type="text" placeholder={`Search ${mice.length} mice...`} value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
                        className="w-full outline-none" style={{ padding: "7px 12px 7px 34px", background: "#0a0a0a", border: "1px solid #ffffff0a", borderRadius: 10, color: "#fff", fontFamily: "inherit", fontSize: 14 }} />
                    </div>

                    <div className="relative">
                      <button className="flex items-center gap-1.5" onClick={() => setShowSortDrop(!showSortDrop)}
                        style={{ padding: "7px 12px", background: "#0a0a0a", border: `1px solid ${showSortDrop ? `${accentR}50` : "#ffffff0a"}`, borderRadius: 10, color: showSortDrop ? accentR : "#ffffffa0", fontFamily: "inherit", fontSize: 13, fontWeight: 600, cursor: "pointer", whiteSpace: "nowrap" }}>
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M3 6h18M6 12h12M9 18h6"/></svg>
                        <span style={{ color: "#ffffff50", fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: 0.5 }}>Sort</span>
                        <span style={{ color: accentR, fontWeight: 700 }}>{sortLabelR}</span>
                        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M6 9l6 6 6-6"/></svg>
                      </button>
                      {showSortDrop && (
                        <>
                        <div style={{ position: "fixed", inset: 0, zIndex: 99 }} onClick={() => setShowSortDrop(false)} />
                        <div className="absolute" style={{ top: "calc(100% + 6px)", right: 0, background: "#161616", border: "1px solid #ffffff15", borderRadius: 10, padding: 4, minWidth: 180, zIndex: 100, boxShadow: "0 12px 40px rgba(0,0,0,0.5)" }}>
                          {SORT_OPTIONS_R.map(o => (
                            <div key={o.value} className="flex items-center justify-between cursor-pointer"
                              style={{ padding: "8px 12px", borderRadius: 7, fontSize: 13, fontWeight: 600, color: sortBy === o.value ? accentR : "#ffffffa0", transition: "all 0.15s" }}
                              onMouseEnter={e => { if (sortBy !== o.value) e.currentTarget.style.background = `${accentR}20`; }}
                              onMouseLeave={e => { e.currentTarget.style.background = "transparent"; }}
                              onClick={() => { setSortBy(o.value); setRankingSort({ key: o.value, dir: ["weight", "price"].includes(o.value) ? "asc" : "desc" }); setShowSortDrop(false); }}>
                              {o.label}
                              {sortBy === o.value && <span style={{ fontSize: 12 }}>✓</span>}
                            </div>
                          ))}
                        </div>
                        </>
                      )}
                    </div>

                    <button className="flex items-center gap-1.5"
                      onClick={() => setShowFilters(!showFilters)}
                      style={{ padding: "7px 12px", background: (showFilters || activeFilterCountR > 0) ? `${accentR}20` : "#0a0a0a", border: `1px solid ${(showFilters || activeFilterCountR > 0) ? `${accentR}50` : "#ffffff0a"}`, borderRadius: 10, color: (showFilters || activeFilterCountR > 0) ? accentR : "#ffffffa0", fontFamily: "inherit", fontSize: 13, fontWeight: 700, cursor: "pointer", whiteSpace: "nowrap" }}>
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M22 3H2l8 9.46V19l4 2v-8.54L22 3z"/></svg>
                      Filters
                      {activeFilterCountR > 0 && <span style={{ width: 18, height: 18, borderRadius: "50%", background: accentR, color: "#000", fontSize: 11, fontWeight: 800, display: "flex", alignItems: "center", justifyContent: "center" }}>{activeFilterCountR}</span>}
                    </button>
                  </div>

                  <div style={{ maxHeight: showFilters ? 500 : 0, overflow: "hidden", opacity: showFilters ? 1 : 0, transition: "max-height 0.35s cubic-bezier(0.4,0,0.2,1), opacity 0.25s" }}>
                    <div className="grid gap-2.5" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))" }}>
                      <div style={{ gridColumn: "span 2" }}>
                        <div style={{ fontSize: 10, fontWeight: 800, textTransform: "uppercase", letterSpacing: 1, color: "#ffffff50", marginBottom: 5, paddingLeft: 2 }}>Brand</div>
                        <div className="flex flex-wrap gap-1">
                          <span style={chipStyleR(filterBrand === "All")} onClick={() => setFilterBrand("All")}>All</span>
                          {brandListR.map(b => <span key={b} style={chipStyleR(filterBrand === b, BRAND_COLORS[b])} onClick={() => setFilterBrand(filterBrand === b ? "All" : b)}>{b}</span>)}
                        </div>
                      </div>
                      <div>
                        <div style={{ fontSize: 10, fontWeight: 800, textTransform: "uppercase", letterSpacing: 1, color: "#ffffff50", marginBottom: 5, paddingLeft: 2 }}>Weight</div>
                        <div className="flex flex-wrap gap-1">
                          {[["All","All"],["Ultralight","<50g"],["Light","50-64g"],["Medium","65-84g"],["Heavy","85g+"]].map(([v,l]) => (
                            <span key={v} style={chipStyleR(filterWeight === v)} onClick={() => setFilterWeight(filterWeight === v && v !== "All" ? "All" : v)}>{l}</span>
                          ))}
                        </div>
                      </div>
                      <div>
                        <div style={{ fontSize: 10, fontWeight: 800, textTransform: "uppercase", letterSpacing: 1, color: "#ffffff50", marginBottom: 5, paddingLeft: 2 }}>Price</div>
                        <div className="flex flex-wrap gap-1">
                          {[["All","All"],["Budget","Under $60"],["Mid","$60–$119"],["Premium","$120+"]].map(([v,l]) => (
                            <span key={v} style={chipStyleR(filterPrice === v)} onClick={() => setFilterPrice(filterPrice === v && v !== "All" ? "All" : v)}>{l}</span>
                          ))}
                        </div>
                      </div>
                      <div>
                        <div style={{ fontSize: 10, fontWeight: 800, textTransform: "uppercase", letterSpacing: 1, color: "#ffffff50", marginBottom: 5, paddingLeft: 2 }}>Connection</div>
                        <div className="flex flex-wrap gap-1">
                          {[["All","All"],["Wireless","Wireless"],["Wired","Wired"]].map(([v,l]) => (
                            <span key={v} style={chipStyleR(filterConn === v)} onClick={() => setFilterConn(filterConn === v && v !== "All" ? "All" : v)}>{l}</span>
                          ))}
                        </div>
                      </div>
                      <div>
                        <div style={{ fontSize: 10, fontWeight: 800, textTransform: "uppercase", letterSpacing: 1, color: "#ffffff50", marginBottom: 5, paddingLeft: 2 }}>Shape</div>
                        <div className="flex flex-wrap gap-1">
                          {[["All","All"],["Symmetrical","Symmetrical"],["Ergonomic","Ergonomic"]].map(([v,l]) => (
                            <span key={v} style={chipStyleR(filterShape === v)} onClick={() => setFilterShape(filterShape === v && v !== "All" ? "All" : v)}>{l}</span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  {!showFilters && activeFiltersR.length > 0 && (
                    <div className="flex flex-wrap gap-1.5" style={{ marginTop: 12, paddingTop: 12, borderTop: "1px solid #ffffff0a" }}>
                      {activeFiltersR.map((f, i) => (
                        <span key={i} className="inline-flex items-center gap-1.5" style={{ padding: "4px 10px", borderRadius: 20, fontSize: 12, fontWeight: 700, background: `${accentR}20`, color: accentR, border: `1px solid ${accentR}50` }}>
                          {f.label} <span className="cursor-pointer opacity-50 hover:opacity-100" style={{ fontSize: 11 }} onClick={f.clear}>✕</span>
                        </span>
                      ))}
                      <span className="inline-flex items-center gap-1 cursor-pointer" onClick={clearAllFiltersR}
                        style={{ padding: "4px 10px", borderRadius: 20, fontSize: 12, fontWeight: 700, background: "#ff4c4c10", color: "#ff6b6b", border: "1px solid #ff4c4c25" }}>
                        ✕ Clear all
                      </span>
                    </div>
                  )}
                </div>
              );
            })()}

            <div className="overflow-x-auto rounded-2xl" style={{ border: "1px solid #ffffff08" }}>
              <table className="w-full text-sm">
                <thead>
                  <tr style={{ background: "#0a0a0a" }}>
                    {[
                      { key: null, label: "#" },
                      { key: "name", label: "Mouse" },
                      { key: "brand", label: "Brand" },
                      { key: "weight", label: "Weight" },
                      { key: "sensor", label: "Sensor" },
                      { key: "pollingRate", label: "Poll Rate" },
                      { key: "shape", label: "Shape" },
                      { key: "price", label: "Price" },
                      { key: "proUsage", label: "Pro %" },
                      { key: "rating", label: "Rating" },
                      { key: null, label: "Buy" },
                    ].map(h => (
                      <th key={h.label} className={`px-4 py-3 text-left text-sm uppercase tracking-wider font-bold ${h.key ? "cursor-pointer select-none hover:opacity-80" : ""}`}
                        style={{ color: rankingSort.key === h.key ? "#00ff6a" : "#ffffff30" }}
                        onClick={() => { if (h.key) setRankingSort(prev => prev.key === h.key ? { key: h.key, dir: prev.dir === "asc" ? "desc" : "asc" } : { key: h.key, dir: ["name","brand","sensor","shape"].includes(h.key) ? "asc" : "desc" }); }}>
                        {h.label}{rankingSort.key === h.key ? (rankingSort.dir === "asc" ? " ▲" : " ▼") : ""}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {(() => {
                    const filtered = mice
                      .filter(m => filterBrand === "All" || m.brand === filterBrand)
                      .filter(m => {
                        if (filterWeight === "All") return true;
                        if (filterWeight === "Ultralight") return m.weight < 50;
                        if (filterWeight === "Light") return m.weight >= 50 && m.weight < 65;
                        if (filterWeight === "Medium") return m.weight >= 65 && m.weight < 85;
                        if (filterWeight === "Heavy") return m.weight >= 85;
                        return true;
                      })
                      .filter(m => {
                        if (filterPrice === "All") return true;
                        if (filterPrice === "Budget") return m.price < 60;
                        if (filterPrice === "Mid") return m.price >= 60 && m.price < 120;
                        if (filterPrice === "Premium") return m.price >= 120;
                        return true;
                      })
                      .filter(m => filterConn === "All" || (filterConn === "Wireless" ? m.wireless : !m.wireless))
                      .filter(m => filterShape === "All" || m.shape === filterShape)
                      .filter(m => m.name.toLowerCase().includes(searchQuery.toLowerCase()) || m.brand.toLowerCase().includes(searchQuery.toLowerCase()));
                    const k = rankingSort.key || "proUsage";
                    const dir = rankingSort.dir || "desc";
                    const sorted = [...filtered].sort((a, b) => {
                      let av = a[k], bv = b[k];
                      if (typeof av === "string") return dir === "asc" ? av.localeCompare(bv) : bv.localeCompare(av);
                      if (av !== bv) return dir === "asc" ? av - bv : bv - av;
                      return a.id - b.id;
                    });
                    return sorted.map((m, i) => {
                      const col = BRAND_COLORS[m.brand] || "#888";
                      return (
                        <tr key={`rank-${m.id}`} className="cursor-pointer transition-colors hover:brightness-125" onClick={() => { navigateToMouse(m); }}
                          style={{ borderBottom: "1px solid #ffffff05", background: i % 2 === 0 ? "#050505" : "#080808" }}>
                          <td className="px-4 py-3 font-black opacity-20">{i + 1}</td>
                          <td className="px-4 py-3 font-bold" style={{ color: col }}>{MOUSE_IMAGE_URLS[m.name] && <img loading="lazy" src={MOUSE_IMAGE_URLS[m.name]} alt={`${m.name}`} className="inline h-5 mr-2 object-contain" />}{m.name}</td>
                          <td className="px-4 py-3 opacity-50">{m.brand}</td>
                          <td className="px-4 py-3 font-bold">{m.weight}g</td>
                          <td className="px-4 py-3 opacity-50 text-sm">{m.sensor}</td>
                          <td className="px-4 py-3">{m.pollingRate >= 1000 ? `${m.pollingRate / 1000}K` : m.pollingRate}Hz</td>
                          <td className="px-4 py-3 opacity-50">{m.shape}</td>
                          <td className="px-4 py-3 font-bold"><a href={amazonLink(m.name)} target="_blank" rel="noopener noreferrer" className="no-underline hover:underline" style={{ color: "#f59e0b", textDecoration: "none" }}>{"$"}{m.price}</a></td>
                          <td className="px-4 py-3 font-black" style={{ color: col }}>{m.proUsage}%</td>
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-2">
                              <div className="w-12 h-1.5 rounded-full overflow-hidden" style={{ background: "#ffffff08" }}>
                                <div className="h-full rounded-full" style={{ width: `${m.rating * 10}%`, background: col }} />
                              </div>
                              <span className="text-sm opacity-50">{m.rating}</span>
                            </div>
                          </td>
                          <td className="px-4 py-3" onClick={e => e.stopPropagation()}>
                            <a href={amazonLink(m.name)} target="_blank" rel="noopener noreferrer"
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-bold transition-all whitespace-nowrap"
                              style={{ background: `${col}15`, color: col, border: `1px solid ${col}25` }}
                              onMouseEnter={e => { e.currentTarget.style.background = col; e.currentTarget.style.color = "#000"; }}
                              onMouseLeave={e => { e.currentTarget.style.background = `${col}15`; e.currentTarget.style.color = col; }}>
                              {I.cart(12)} {"$"}{m.price}
                            </a>
                          </td>
                        </tr>
                      );
                    });
                  })()}
                </tbody>
              </table>
            </div>
            {/* Gear Check Callout */}
            {(() => {
              const topMouse = mice.sort((a, b) => b.proUsage - a.proUsage)[0];
              return (
                <div className="rounded-xl p-4 mt-6 flex flex-col sm:flex-row items-center gap-4" style={{ background: "linear-gradient(135deg, #00ff6a06, #00ff6a02)", border: "1px solid #00ff6a12" }}>
                  <span className="text-xl">🏆</span>
                  <div className="flex-1">
                    <div className="text-xs uppercase tracking-widest font-bold" style={{ color: "#00ff6a" }}>Pro Favorite</div>
                    <div className="text-sm font-bold" style={{ color: "#ffffffd0" }}>{topMouse.name} — {topMouse.proUsage}% pro usage · {topMouse.weight}g · {topMouse.sensor}</div>
                  </div>
                  <a href={amazonLink(topMouse.name)} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-4 py-2 rounded-lg font-bold text-sm transition-all hover:scale-105 no-underline flex-shrink-0" style={{ background: "#00ff6a", color: "#000", textDecoration: "none" }}>
                    {I.cart(14, "#000")} ${topMouse.price} on Amazon
                  </a>
                </div>
              );
            })()}
          </div>
        )}

        {/* ── ALL MICE TAB ── */}
        {activeTab === "mice" && (
          <div>
            <SectionTitle color="#c084fc" sub="Click any mouse for detailed breakdown">Mouse Showcase Gallery</SectionTitle>
            {/* ── UNIFIED FILTER BAR ── */}
            {(() => {
              const SORT_OPTIONS = [
                { value: "proUsage", label: "Pro Usage" },
                { value: "weight", label: "Weight ↑" },
                { value: "price", label: "Price ↑" },
                { value: "rating", label: "Rating" },
                { value: "pollingRate", label: "Poll Rate" },
                { value: "name", label: "Name A-Z" },
                { value: "releaseYear", label: "Newest" },
              ];
              const sortLabel = SORT_OPTIONS.find(o => o.value === sortBy)?.label || "Pro Usage";
              const brandList = [...new Set(mice.map(m => m.brand))].sort();
              const activeFilterCount = [filterBrand, filterWeight, filterPrice, filterConn, filterShape].filter(f => f !== "All").length;
              const activeFilters = [];
              if (filterBrand !== "All") activeFilters.push({ label: filterBrand, clear: () => setFilterBrand("All") });
              if (filterWeight !== "All") activeFilters.push({ label: filterWeight === "Ultralight" ? "<50g" : filterWeight === "Light" ? "50-64g" : filterWeight === "Medium" ? "65-84g" : "85g+", clear: () => setFilterWeight("All") });
              if (filterPrice !== "All") activeFilters.push({ label: filterPrice === "Budget" ? "Under $60" : filterPrice === "Mid" ? "$60-$119" : "$120+", clear: () => setFilterPrice("All") });
              if (filterConn !== "All") activeFilters.push({ label: filterConn, clear: () => setFilterConn("All") });
              if (filterShape !== "All") activeFilters.push({ label: filterShape, clear: () => setFilterShape("All") });
              const clearAllFilters = () => { setFilterBrand("All"); setFilterWeight("All"); setFilterPrice("All"); setFilterConn("All"); setFilterShape("All"); };
              const chipStyle = (active, brandColor) => ({
                padding: "5px 10px", borderRadius: 7, fontSize: 12, fontWeight: 700, cursor: "pointer",
                background: active ? (brandColor ? `${brandColor}18` : "#c084fc20") : "#0a0a0a",
                border: `1px solid ${active ? (brandColor ? `${brandColor}50` : "#c084fc50") : "#ffffff0a"}`,
                color: active ? (brandColor || "#c084fc") : "#ffffff50",
                transition: "all 0.15s", whiteSpace: "nowrap",
              });

              return (
                <div className="mb-5" style={{ background: "#111", border: "1px solid #ffffff0a", borderRadius: 12, padding: 10, position: "relative" }}>
                  {/* Accent top line */}
                  <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 1, borderRadius: "12px 12px 0 0", background: "linear-gradient(90deg, transparent, #c084fc50, transparent)" }} />

                  {/* Row 1: Search + Sort + Filter toggle */}
                  <div className="flex gap-2.5 items-center" style={{ marginBottom: showFilters ? 10 : 0, transition: "margin 0.3s" }}>
                    {/* Search */}
                    <div className="flex-1 relative" style={{ minWidth: 0 }}>
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", opacity: 0.25 }}><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
                      <input type="text" placeholder={`Search ${mice.length} mice...`} value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
                        className="w-full outline-none" style={{ padding: "7px 12px 7px 34px", background: "#0a0a0a", border: "1px solid #ffffff0a", borderRadius: 10, color: "#fff", fontFamily: "inherit", fontSize: 14 }} />
                    </div>

                    {/* Sort dropdown */}
                    <div className="relative">
                      <button className="flex items-center gap-1.5" onClick={() => setShowSortDrop(!showSortDrop)}
                        style={{ padding: "7px 12px", background: "#0a0a0a", border: `1px solid ${showSortDrop ? "#c084fc50" : "#ffffff0a"}`, borderRadius: 10, color: showSortDrop ? "#c084fc" : "#ffffffa0", fontFamily: "inherit", fontSize: 13, fontWeight: 600, cursor: "pointer", whiteSpace: "nowrap" }}>
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M3 6h18M6 12h12M9 18h6"/></svg>
                        <span style={{ color: "#ffffff50", fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: 0.5 }}>Sort</span>
                        <span style={{ color: "#c084fc", fontWeight: 700 }}>{sortLabel}</span>
                        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M6 9l6 6 6-6"/></svg>
                      </button>
                      {showSortDrop && (
                        <>
                        <div style={{ position: "fixed", inset: 0, zIndex: 99 }} onClick={() => setShowSortDrop(false)} />
                        <div className="absolute" style={{ top: "calc(100% + 6px)", right: 0, background: "#161616", border: "1px solid #ffffff15", borderRadius: 10, padding: 4, minWidth: 180, zIndex: 100, boxShadow: "0 12px 40px rgba(0,0,0,0.5)", animation: "fadeIn 0.15s ease" }}>
                          {SORT_OPTIONS.map(o => (
                            <div key={o.value} className="flex items-center justify-between cursor-pointer"
                              style={{ padding: "8px 12px", borderRadius: 7, fontSize: 13, fontWeight: 600, color: sortBy === o.value ? "#c084fc" : "#ffffffa0", transition: "all 0.15s" }}
                              onMouseEnter={e => { if (sortBy !== o.value) e.currentTarget.style.background = "#c084fc20"; }}
                              onMouseLeave={e => { e.currentTarget.style.background = "transparent"; }}
                              onClick={() => { setSortBy(o.value); setShowSortDrop(false); }}>
                              {o.label}
                              {sortBy === o.value && <span style={{ fontSize: 12 }}>✓</span>}
                            </div>
                          ))}
                        </div>
                        </>
                      )}
                    </div>

                    {/* Filter toggle */}
                    <button className="flex items-center gap-1.5"
                      onClick={() => setShowFilters(!showFilters)}
                      style={{ padding: "7px 12px", background: (showFilters || activeFilterCount > 0) ? "#c084fc20" : "#0a0a0a", border: `1px solid ${(showFilters || activeFilterCount > 0) ? "#c084fc50" : "#ffffff0a"}`, borderRadius: 10, color: (showFilters || activeFilterCount > 0) ? "#c084fc" : "#ffffffa0", fontFamily: "inherit", fontSize: 13, fontWeight: 700, cursor: "pointer", whiteSpace: "nowrap" }}>
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M22 3H2l8 9.46V19l4 2v-8.54L22 3z"/></svg>
                      Filters
                      {activeFilterCount > 0 && <span style={{ width: 18, height: 18, borderRadius: "50%", background: "#c084fc", color: "#000", fontSize: 11, fontWeight: 800, display: "flex", alignItems: "center", justifyContent: "center" }}>{activeFilterCount}</span>}
                    </button>
                  </div>

                  {/* Row 2: Collapsible filter chips */}
                  <div style={{ maxHeight: showFilters ? 500 : 0, overflow: "hidden", opacity: showFilters ? 1 : 0, transition: "max-height 0.35s cubic-bezier(0.4,0,0.2,1), opacity 0.25s" }}>
                    <div className="grid gap-2.5" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))" }}>
                      {/* Brand */}
                      <div style={{ gridColumn: "span 2" }}>
                        <div style={{ fontSize: 10, fontWeight: 800, textTransform: "uppercase", letterSpacing: 1, color: "#ffffff50", marginBottom: 5, paddingLeft: 2 }}>Brand</div>
                        <div className="flex flex-wrap gap-1">
                          <span style={chipStyle(filterBrand === "All")} onClick={() => setFilterBrand("All")}>All</span>
                          {brandList.map(b => <span key={b} style={chipStyle(filterBrand === b, BRAND_COLORS[b])} onClick={() => setFilterBrand(filterBrand === b ? "All" : b)}>{b}</span>)}
                        </div>
                      </div>
                      {/* Weight */}
                      <div>
                        <div style={{ fontSize: 10, fontWeight: 800, textTransform: "uppercase", letterSpacing: 1, color: "#ffffff50", marginBottom: 5, paddingLeft: 2 }}>Weight</div>
                        <div className="flex flex-wrap gap-1">
                          {[["All","All"],["Ultralight","<50g"],["Light","50-64g"],["Medium","65-84g"],["Heavy","85g+"]].map(([v,l]) => (
                            <span key={v} style={chipStyle(filterWeight === v)} onClick={() => setFilterWeight(filterWeight === v && v !== "All" ? "All" : v)}>{l}</span>
                          ))}
                        </div>
                      </div>
                      {/* Price */}
                      <div>
                        <div style={{ fontSize: 10, fontWeight: 800, textTransform: "uppercase", letterSpacing: 1, color: "#ffffff50", marginBottom: 5, paddingLeft: 2 }}>Price</div>
                        <div className="flex flex-wrap gap-1">
                          {[["All","All"],["Budget","Under $60"],["Mid","$60–$119"],["Premium","$120+"]].map(([v,l]) => (
                            <span key={v} style={chipStyle(filterPrice === v)} onClick={() => setFilterPrice(filterPrice === v && v !== "All" ? "All" : v)}>{l}</span>
                          ))}
                        </div>
                      </div>
                      {/* Connection */}
                      <div>
                        <div style={{ fontSize: 10, fontWeight: 800, textTransform: "uppercase", letterSpacing: 1, color: "#ffffff50", marginBottom: 5, paddingLeft: 2 }}>Connection</div>
                        <div className="flex flex-wrap gap-1">
                          {[["All","All"],["Wireless","Wireless"],["Wired","Wired"]].map(([v,l]) => (
                            <span key={v} style={chipStyle(filterConn === v)} onClick={() => setFilterConn(filterConn === v && v !== "All" ? "All" : v)}>{l}</span>
                          ))}
                        </div>
                      </div>
                      {/* Shape */}
                      <div>
                        <div style={{ fontSize: 10, fontWeight: 800, textTransform: "uppercase", letterSpacing: 1, color: "#ffffff50", marginBottom: 5, paddingLeft: 2 }}>Shape</div>
                        <div className="flex flex-wrap gap-1">
                          {[["All","All"],["Symmetrical","Symmetrical"],["Ergonomic","Ergonomic"]].map(([v,l]) => (
                            <span key={v} style={chipStyle(filterShape === v)} onClick={() => setFilterShape(filterShape === v && v !== "All" ? "All" : v)}>{l}</span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Active filter tags (when panel is closed) */}
                  {!showFilters && activeFilters.length > 0 && (
                    <div className="flex flex-wrap gap-1.5" style={{ marginTop: 12, paddingTop: 12, borderTop: "1px solid #ffffff0a" }}>
                      {activeFilters.map((f, i) => (
                        <span key={i} className="inline-flex items-center gap-1.5" style={{ padding: "4px 10px", borderRadius: 20, fontSize: 12, fontWeight: 700, background: "#c084fc20", color: "#c084fc", border: "1px solid #c084fc50" }}>
                          {f.label} <span className="cursor-pointer opacity-50 hover:opacity-100" style={{ fontSize: 11 }} onClick={f.clear}>✕</span>
                        </span>
                      ))}
                      <span className="inline-flex items-center gap-1 cursor-pointer" onClick={clearAllFilters}
                        style={{ padding: "4px 10px", borderRadius: 20, fontSize: 12, fontWeight: 700, background: "#ff4c4c10", color: "#ff6b6b", border: "1px solid #ff4c4c25" }}>
                        ✕ Clear all
                      </span>
                    </div>
                  )}
                </div>
              );
            })()}
            {/* Results count */}
            <div className="text-sm opacity-40 mb-3">{sortedMice.length} {sortedMice.length === 1 ? "mouse" : "mice"} found</div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3">
              {sortedMice.map(m => (
                <MouseCard key={m.id} mouse={m} onClick={(mouse) => { navigateToMouse(mouse); }} isSelected={selectedMouse?.id === m.id} />
              ))}
            </div>
            {sortedMice.length === 0 && (
              <div className="text-center py-16 opacity-40">
                <div className="text-2xl mb-2">No mice match your filters</div>
                <div className="text-sm">Try adjusting your filters or search query</div>
              </div>
            )}
          </div>
        )}

        {/* ── PRO PLAYER PROFILE VIEW ── */}
        {activeTab === "players" && selectedPlayer && (() => {
          const p = selectedPlayer;
          const gameColors = GAME_COLORS;
          const gc = gameColors[p.game] || "#888";
          const currentMouseData = mice.find(m => m.name === p.mouse);
          const brandCol = currentMouseData ? BRAND_COLORS[currentMouseData.brand] : "#888";
          return (
            <div>
              {/* Breadcrumbs */}
              <nav aria-label="Breadcrumb" className="mt-8 mb-4 flex items-center gap-1.5 text-sm">
                <a href="/" className="opacity-30 hover:opacity-60 transition-all no-underline" style={{ color: "#fff", textDecoration: "none" }}>Home</a>
                <span className="opacity-15">›</span>
                <a href="/players" onClick={(e) => { e.preventDefault(); const savedPos = playerListScrollPos.current; setSelectedPlayer(null); try { sessionStorage.removeItem("playerListScroll"); } catch {} router.push("/players", { scroll: false }); requestAnimationFrame(() => { requestAnimationFrame(() => { window.scrollTo({ top: savedPos, behavior: "instant" }); }); }); }} className="opacity-30 hover:opacity-60 transition-all no-underline cursor-pointer" style={{ color: "#fff", textDecoration: "none" }}>Players</a>
                <span className="opacity-15">›</span>
                <span style={{ color: gc }} className="font-bold opacity-70">{p.name}</span>
              </nav>
              {/* Share buttons */}
              <div className="flex items-center gap-2 mb-4">
                <span className="text-xs opacity-30 uppercase tracking-wider font-bold">Share</span>
                <button onClick={() => { navigator.clipboard.writeText(`https://esportsmice.com/players/${p.name.toLowerCase().replace(/\+/g, "-plus").replace(/[^a-z0-9]+/g, "-").replace(/-+$/, "")}`); }} className="px-2.5 py-1 rounded-lg text-xs font-bold transition-all hover:scale-105" style={{ background: "#ffffff08", border: "1px solid #ffffff10", color: "#fff" }}>📋 Copy Link</button>
                <a href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(p.name + " uses " + p.mouse + " — " + p.dpi + " DPI, " + p.edpi + " eDPI")}&url=${encodeURIComponent("https://esportsmice.com/players/" + p.name.toLowerCase().replace(/\+/g, "-plus").replace(/[^a-z0-9]+/g, "-").replace(/-+$/, ""))}`} target="_blank" rel="noopener noreferrer" className="px-2.5 py-1 rounded-lg text-xs font-bold transition-all hover:scale-105 no-underline" style={{ background: "#1da1f220", border: "1px solid #1da1f230", color: "#1da1f2", textDecoration: "none" }}>𝕏 Tweet</a>
                <a href={`https://reddit.com/submit?url=${encodeURIComponent("https://esportsmice.com/players/" + p.name.toLowerCase().replace(/\+/g, "-plus").replace(/[^a-z0-9]+/g, "-").replace(/-+$/, ""))}&title=${encodeURIComponent(p.name + " (" + p.game + ") — Mouse, Settings & Setup")}`} target="_blank" rel="noopener noreferrer" className="px-2.5 py-1 rounded-lg text-xs font-bold transition-all hover:scale-105 no-underline" style={{ background: "#ff449920", border: "1px solid #ff449930", color: "#ff4499", textDecoration: "none" }}>Reddit</a>
                <a href={`/contact?subject=correction&player=${encodeURIComponent(p.name)}`} className="px-2.5 py-1 rounded-lg text-xs font-bold transition-all hover:scale-105 no-underline ml-auto" style={{ background: "#ffffff06", border: "1px solid #ffffff10", color: "#ffffff50", textDecoration: "none" }}>⚠️ Suggest Correction</a>
              </div>
              {/* Header */}
              <div className="rounded-2xl p-4 sm:p-8 mb-4 sm:mb-6" style={{ background: `linear-gradient(135deg, ${gc}10, #0a0a0a)`, border: `1px solid ${gc}25` }}>
                <div className="flex flex-col gap-3 sm:gap-6 items-start">
                  <div className="flex items-center justify-center"><Flag country={p.country} size={56} /></div>
                  <div className="flex-1 w-full">
                    <div className="text-sm uppercase tracking-widest opacity-30 mb-1">{p.role} · {p.team}</div>
                    <h2 className="text-2xl sm:text-4xl font-black mb-1" style={{ fontFamily: "Orbitron", color: gc }}>{p.name}</h2>
                    <div className="text-sm sm:text-sm opacity-50 mb-2 sm:mb-3">{p.fullName} · Age {p.age}</div>
                    <p className="text-sm sm:text-sm opacity-50 leading-relaxed max-w-2xl">{(() => {
                      const playerBio = PLAYER_BIOS[p.name];
                      if (playerBio) return playerBio;
                      const mouseName = p.mouse;
                      const desc = `${p.fullName || p.name} is a professional ${p.game} ${p.role || "player"} for ${p.team}, currently using the `;
                      return <>{desc}<a href={amazonLink(mouseName)} target="_blank" rel="noopener noreferrer"
                        className="font-bold underline decoration-dotted underline-offset-2 transition-all hover:opacity-100"
                        style={{ color: brandCol, opacity: 0.85 }}
                        onClick={e => e.stopPropagation()}>{mouseName}</a>{` at ${p.dpi} DPI and ${p.edpi} eDPI${p.sens ? ` (${p.sens} in-game sensitivity)` : ""}.`}</>;
                    })()}</p>
                    <div className="flex flex-wrap gap-2 sm:gap-3 mt-3 sm:mt-4">
                      <span className="px-3 py-1 rounded-lg text-sm font-bold" style={{ background: `${gc}20`, color: gc }}>{p.game}</span>
                      <span className="px-3 py-1 rounded-lg text-sm font-bold" style={{ background: "#ffffff08", color: "#fff" }}>{p.team}</span>
                      <span className="px-3 py-1 rounded-lg text-sm font-bold" style={{ background: "#ffffff08", color: "#fff" }}>{p.role}</span>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3 min-w-48">
                    <StatBox label="DPI" value={p.dpi} color={gc} />
                    <StatBox label="Sens" value={p.sens ?? " - "} color={gc} />
                    <StatBox label="eDPI" value={p.edpi ?? " - "} color={gc} />
                    <StatBox label="Age" value={p.age} color={gc} />
                  </div>
                  {/* Get This Setup CTA */}
                  <a href={amazonLink(p.mouse)} target="_blank" rel="noopener noreferrer"
                    className="self-end mt-2 flex items-center gap-3 px-4 sm:px-5 py-3 sm:py-3.5 rounded-xl transition-all group/cta"
                    style={{ background: `linear-gradient(135deg, ${brandCol}12, ${brandCol}06)`, border: `1px solid ${brandCol}30` }}
                    onMouseEnter={e => { e.currentTarget.style.background = `linear-gradient(135deg, ${brandCol}25, ${brandCol}15)`; e.currentTarget.style.borderColor = `${brandCol}60`; }}
                    onMouseLeave={e => { e.currentTarget.style.background = `linear-gradient(135deg, ${brandCol}12, ${brandCol}06)`; e.currentTarget.style.borderColor = `${brandCol}30`; }}>
                    {MOUSE_IMAGE_URLS[p.mouse] ? <img loading="lazy" src={MOUSE_IMAGE_URLS[p.mouse]} alt={`${p.mouse} gaming mouse`} className="h-8 w-8 object-contain flex-shrink-0" style={{ filter: "drop-shadow(0 2px 6px rgba(0,0,0,0.4))" }} /> : <span>{I.mouse(20)}</span>}
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-bold" style={{ color: brandCol }}>Play like {p.name}</div>
                      <div className="text-sm opacity-85 truncate">Get the {p.mouse} on Amazon</div>
                    </div>
                    <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-black flex-shrink-0 transition-all"
                      style={{ background: brandCol, color: "#222" }}>
                      <svg width={12} height={12} viewBox="0 0 24 24" fill="none"><path d="M1 1h4l2.68 13.39a2 2 0 002 1.61h9.72a2 2 0 002-1.61L23 6H6" stroke="#222" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/><circle cx="9" cy="21" r="1.5" fill="#222"/><circle cx="20" cy="21" r="1.5" fill="#222"/></svg> {currentMouseData ? `$${currentMouseData.price}` : "Buy"}
                    </div>
                  </a>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                <div className="rounded-2xl p-6" style={{ background: "#0a0a0a", border: "1px solid #ffffff08" }}>
                  <div className="text-sm uppercase tracking-widest opacity-30 mb-4"><span className="inline-flex mr-1.5 align-middle">{I.trophy(14)}</span>Top Achievements</div>
                  <div className="space-y-2">
                    {p.achievements.map((a, i) => (
                      <div key={i} className="flex items-start gap-3 p-3 rounded-xl" style={{ background: i < 3 ? `${gc}08` : "#ffffff04", border: i < 3 ? `1px solid ${gc}15` : "1px solid #ffffff06" }}>
                        <span className="text-sm mt-0.5">{i === 0 ? I.medal("#fbbf24", 18) : i === 1 ? I.medal("#94a3b8", 18) : i === 2 ? I.medal("#cd7f32", 18) : "▸"}</span>
                        <span className="text-sm" style={{ color: i < 3 ? gc : "#ffffffa0" }}>{a}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Mouse History + Current Setup */}
                <div className="space-y-6">
                  {/* Current Mouse */}
                  <div className="rounded-2xl p-6" style={{ background: `${brandCol}08`, border: `1px solid ${brandCol}20` }}>
                    <div className="text-sm uppercase tracking-widest opacity-30 mb-4"><span className="inline-flex mr-1.5 align-middle">{I.mouse(14)}</span>Current Mouse</div>
                    <div className="flex items-center gap-4 mb-4">
                      {MOUSE_IMAGE_URLS[p.mouse] && <img loading="lazy" src={MOUSE_IMAGE_URLS[p.mouse]} alt={`${p.mouse} - mouse used by ${p.name} in ${p.game}`} className="h-14 w-14 object-contain object-center" style={{ filter: "drop-shadow(0 4px 8px rgba(0,0,0,0.4))" }} />}
                      <div>
                        <div className="text-xl font-black" style={{ color: brandCol }}>{p.mouse}</div>
                        <div className="text-sm opacity-85">{currentMouseData?.brand} · {currentMouseData?.weight}g · {currentMouseData?.shape} · {currentMouseData?.connectivity}</div>
                      </div>
                    </div>
                    {currentMouseData && (
                      <div className="grid grid-cols-4 gap-3 mb-4">
                        <div className="text-center p-2 rounded-lg" style={{ background: "#ffffff06" }}>
                          <div className="text-sm opacity-30">Weight</div>
                          <div className="text-sm font-bold" style={{ color: brandCol }}>{currentMouseData.weight}g</div>
                        </div>
                        <div className="text-center p-2 rounded-lg" style={{ background: "#ffffff06" }}>
                          <div className="text-sm opacity-30">Sensor</div>
                          <div className="text-sm font-bold" style={{ color: brandCol }}>{currentMouseData.sensor}</div>
                        </div>
                        <div className="text-center p-2 rounded-lg" style={{ background: "#ffffff06" }}>
                          <div className="text-sm opacity-30">Poll Rate</div>
                          <div className="text-sm font-bold" style={{ color: brandCol }}>{currentMouseData.pollingRate >= 1000 ? `${currentMouseData.pollingRate/1000}K` : currentMouseData.pollingRate}Hz</div>
                        </div>
                        <div className="text-center p-2 rounded-lg" style={{ background: "#ffffff06" }}>
                          <div className="text-sm opacity-30">Price</div>
                          <div className="text-sm font-bold" style={{ color: brandCol }}>{"$"}{currentMouseData.price}</div>
                        </div>
                      </div>
                    )}
                    <a href={amazonLink(p.mouse)} target="_blank" rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-black transition-all"
                      style={{ background: brandCol, color: "#000" }}>
                      {I.cart(16, "#000")} Buy {p.mouse.split(" ").slice(-3).join(" ")} on Amazon
                    </a>
                  </div>

                  {/* Mouse History Timeline */}
                  <div className="rounded-2xl p-6" style={{ background: "#0a0a0a", border: "1px solid #ffffff08" }}>
                    <div className="text-sm uppercase tracking-widest opacity-30 mb-4"><span className="inline-flex mr-1.5 align-middle">{I.refresh(14)}</span>Mouse History</div>
                    <div className="space-y-0">
                      {p.mouseHistory.map((mh, i) => {
                        const histMouse = mice.find(m => m.name === mh.mouse);
                        const hCol = histMouse ? BRAND_COLORS[histMouse.brand] : "#555";
                        return (
                          <div key={i} className="flex items-center gap-4 relative">
                            <div className="flex flex-col items-center">
                              <div className="w-3 h-3 rounded-full z-10" style={{ background: i === 0 ? hCol : "#333", border: i === 0 ? `2px solid ${hCol}` : "2px solid #555", boxShadow: i === 0 ? `0 0 12px ${hCol}40` : "none" }} />
                              {i < p.mouseHistory.length - 1 && <div className="w-0.5 h-10" style={{ background: "#ffffff10" }} />}
                            </div>
                            <div className="flex-1 py-2">
                              <div className="text-sm font-bold" style={{ color: i === 0 ? hCol : "#ffffff60" }}>{mh.mouse}</div>
                              <div className="text-sm opacity-30">{mh.period}</div>
                            </div>
                            {i === 0 ? (
                              <a href={amazonLink(mh.mouse)} target="_blank" rel="noopener noreferrer"
                                className="flex items-center gap-1.5 text-sm px-3 py-1 rounded-full font-bold transition-all"
                                style={{ background: `${hCol}20`, color: hCol, border: `1px solid ${hCol}30` }}
                                onMouseEnter={e => { e.currentTarget.style.background = hCol; e.currentTarget.style.color = "#000"; }}
                                onMouseLeave={e => { e.currentTarget.style.background = `${hCol}20`; e.currentTarget.style.color = hCol; }}>
                                <svg width={10} height={10} viewBox="0 0 24 24" fill="none"><path d="M1 1h4l2.68 13.39a2 2 0 002 1.61h9.72a2 2 0 002-1.61L23 6H6" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/><circle cx="9" cy="21" r="1.5" fill="currentColor"/><circle cx="20" cy="21" r="1.5" fill="currentColor"/></svg>
                                Buy Current{histMouse ? ` — $${histMouse.price}` : ""}
                              </a>
                            ) : histMouse ? (
                              <a href={amazonLink(mh.mouse)} target="_blank" rel="noopener noreferrer"
                                className="flex items-center gap-1 text-xs px-2 py-0.5 rounded font-bold transition-all hover:scale-105 no-underline"
                                style={{ background: "#f59e0b10", color: "#f59e0b80", textDecoration: "none", fontSize: 10 }}>
                                {I.cart(8)} ${histMouse.price}
                              </a>
                            ) : null}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>

              {/* Other players from same game */}
              <div className="mt-8">
                <div className="text-sm uppercase tracking-widest opacity-30 mb-4">Other {p.game} Players</div>
                <div className="flex flex-wrap gap-3">
                  {proPlayers.filter(op => op.game === p.game && op.name !== p.name).map((op, i) => (
                    <a key={i} href={`/players/${op.name.toLowerCase().replace(/\+/g, "-plus").replace(/[^a-z0-9]+/g, "-").replace(/-+$/, "")}`}
                      className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold transition-all hover:scale-[1.03] no-underline"
                      style={{ background: "#0a0a0a", border: "1px solid #ffffff10", color: "#fff", textDecoration: "none" }}>
                      <Flag country={op.country} size={16} />
                      <span>{op.name}</span>
                      <span className="opacity-30">({op.team})</span>
                    </a>
                  ))}
                </div>
              </div>

            {/* Suggest correction + related links */}
            <div className="flex flex-wrap items-center gap-3 mt-4 mb-2">
              <a href="/contact" className="text-xs opacity-30 hover:opacity-60 transition-all no-underline" style={{ color: "#fff", textDecoration: "none" }}>📝 Suggest a correction</a>
              <span className="opacity-10">·</span>
              <a href={`/best/${p.game.toLowerCase().replace(/\+/g, "-plus").replace(/[^a-z0-9]+/g, "-").replace(/-+$/, "")}`} className="text-xs opacity-30 hover:opacity-60 transition-all no-underline" style={{ color: gc, textDecoration: "none" }}>Best mice for {p.game}</a>
              <a href="/players" className="text-xs opacity-30 hover:opacity-60 transition-all no-underline" style={{ color: "#fff", textDecoration: "none" }}>All pro settings</a>
            </div>
            </div>
          );
        })()}

        {/* ── PRO PLAYERS LIST TAB ── */}
        {activeTab === "players" && !selectedPlayer && (() => {
          const gameColors = GAME_COLORS;
          const allGames = ["All", ...new Set(allPlayers.map(p => p.game))];
          const allRoles = ["All", ...new Set(allPlayers.map(p => p.role).filter(Boolean))];
          const allCountries = ["All", ...new Set(allPlayers.map(p => p.country).filter(Boolean)).values()].sort();
          const activeFilterCount = [gameFilter !== "All", roleFilter !== "All", countryFilter !== "All", mouseFilter, teamFilter, profileOnly, dpiRange[0] > 0 || dpiRange[1] < 10000].filter(Boolean).length;
          const filteredPlayers = allPlayers
            .filter(p => gameFilter === "All" || p.game === gameFilter)
            .filter(p => roleFilter === "All" || p.role === roleFilter)
            .filter(p => countryFilter === "All" || p.country === countryFilter)
            .filter(p => !mouseFilter || p.mouse.toLowerCase().includes(mouseFilter.toLowerCase()))
            .filter(p => !teamFilter || p.team.toLowerCase().includes(teamFilter.toLowerCase()))
            .filter(p => !profileOnly || p.hasProfile)
            .filter(p => {
              if (dpiRange[0] === 0 && dpiRange[1] >= 10000) return true;
              const d = p.dpi || 0;
              return d >= dpiRange[0] && d <= dpiRange[1];
            })
            .filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase()) || p.team.toLowerCase().includes(searchQuery.toLowerCase()) || p.mouse.toLowerCase().includes(searchQuery.toLowerCase()));
          const sortedPlayers = [...filteredPlayers].sort((a, b) => {
            if (!playerSort.key) return 0;
            const k = playerSort.key;
            let av = a[k], bv = b[k];
            if (av == null) av = k === "name" || k === "game" || k === "team" || k === "mouse" || k === "role" ? "" : -Infinity;
            if (bv == null) bv = k === "name" || k === "game" || k === "team" || k === "mouse" || k === "role" ? "" : -Infinity;
            if (typeof av === "string") { return playerSort.dir === "asc" ? av.localeCompare(bv) : bv.localeCompare(av); }
            return playerSort.dir === "asc" ? av - bv : bv - av;
          });
          const sortHeaders = [
            { key: null, label: "" },
            { key: "name", label: "Player" },
            { key: "game", label: "Game" },
            { key: "team", label: "Team" },
            { key: "mouse", label: "Mouse" },
            { key: "hz", label: "Hz" },
            { key: "dpi", label: "DPI" },
            { key: "sens", label: "Sens" },
            { key: "edpi", label: "eDPI" },
            { key: "role", label: "Role" },
          ];
          return (
          <div>
            <SectionTitle color="#00b4ff" sub={`${allPlayers.length} players across ${new Set(allPlayers.map(p=>p.game)).size} games  -  click starred players for full profiles`}>Pro Player Settings Database</SectionTitle>
            {/* Player quick stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-5">
              {(() => {
                const fp = gameFilter === "All" ? allPlayers : allPlayers.filter(p => p.game === gameFilter);
                const mc = {}; fp.forEach(p => { mc[p.mouse] = (mc[p.mouse] || 0) + 1; });
                const topM = Object.entries(mc).sort((a,b) => b[1]-a[1])[0];
                const edpis = fp.filter(p => p.edpi > 0 && p.edpi < 50000).map(p => p.edpi);
                const avgE = edpis.length ? Math.round(edpis.reduce((a,b) => a+b,0)/edpis.length) : 0;
                const countries = new Set(fp.map(p => p.country)).size;
                const teams = new Set(fp.filter(p => p.team !== "Content" && p.team !== "Free Agent" && p.team !== "Inactive" && p.team !== "Retired").map(p => p.team)).size;
                return [
                  { label: "Top Mouse", value: topM ? topM[0].replace(/(Logitech |Razer )/, "") : "-", color: "#00ff6a" },
                  { label: "Avg eDPI", value: avgE || "-", color: "#ff4655" },
                  { label: "Countries", value: countries, color: "#00b4ff" },
                  { label: "Active Teams", value: teams, color: "#d4af37" },
                ].map((s, i) => (
                  <div key={i} className="rounded-xl p-3 text-center" style={{ background: `${s.color}06`, border: `1px solid ${s.color}10` }}>
                    <div className="text-sm font-black" style={{ color: s.color }}>{s.value}</div>
                    <div style={{ fontSize: 12 }} className="opacity-30 mt-0.5">{s.label}</div>
                  </div>
                ));
              })()}
            </div>

            {/* ── MOST USED PRO MICE — BUY STRIP ── */}
            {(() => {
              const fp = gameFilter === "All" ? allPlayers : allPlayers.filter(p => p.game === gameFilter);
              const mc = {}; fp.forEach(p => { mc[p.mouse] = (mc[p.mouse] || 0) + 1; });
              const topMice = Object.entries(mc).sort((a,b) => b[1]-a[1]).slice(0, 5);
              return (
                <div className="rounded-xl p-4 mb-5" style={{ background: "#f59e0b06", border: "1px solid #f59e0b10" }}>
                  <div className="flex items-center gap-2 mb-3">
                    <span style={{ color: "#f59e0b" }}>{I.trophy(16)}</span>
                    <span className="text-xs uppercase tracking-widest font-bold" style={{ color: "#f59e0b" }}>Most Used by {gameFilter === "All" ? "All" : gameFilter} Pros</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {topMice.map(([mouse, count], i) => {
                      const m = mice.find(mm => mm.name === mouse);
                      const pct = Math.round(count / fp.length * 100);
                      return (
                        <a key={i} href={amazonLink(mouse)} target="_blank" rel="noopener noreferrer"
                          className="flex items-center gap-2 px-3 py-2 rounded-lg transition-all hover:scale-[1.03] no-underline"
                          style={{ background: i === 0 ? "#f59e0b12" : "#ffffff05", border: i === 0 ? "1px solid #f59e0b25" : "1px solid #ffffff08", textDecoration: "none" }}>
                          <span className="text-xs font-black" style={{ color: i === 0 ? "#f59e0b" : "#ffffff40" }}>#{i+1}</span>
                          <div>
                            <div className="text-xs font-bold text-white">{mouse.replace(/(Logitech |Razer |Finalmouse |SteelSeries |Corsair |Zowie |Pulsar |Lamzu |Endgame Gear |WLMouse |ASUS )/, "")}</div>
                            <div style={{ fontSize: 10, color: "#ffffff30" }}>{pct}% of pros{m ? ` · $${m.price}` : ""}</div>
                          </div>
                          <span style={{ color: "#f59e0b", opacity: 0.6 }}>{I.cart(12)}</span>
                        </a>
                      );
                    })}
                  </div>
                </div>
              );
            })()}

            {/* Game pill filters */}
            <div className="flex flex-wrap gap-2 mb-4">
              {allGames.map(g => {
                const gc2 = g === "All" ? "#00b4ff" : (gameColors[g] || "#888");
                const active = gameFilter === g;
                return (
                  <button key={g} onClick={() => { setGameFilter(g); setPlayerPage(0); }}
                    className="px-3 py-1.5 rounded-lg text-sm font-bold transition-all flex items-center gap-1.5"
                    style={{ background: active ? `${gc2}25` : "#0a0a0a", color: active ? gc2 : "#ffffffaa", border: active ? `1px solid ${gc2}50` : "1px solid #ffffff08" }}>
                    {g !== "All" && GAME_IMAGE_URLS[g] && <img loading="lazy" src={GAME_IMAGE_URLS[g]} alt={g} className="w-4 h-4 object-contain" />}
                    {g}{g !== "All" && <span className="ml-1 opacity-50">({allPlayers.filter(p => p.game === g).length})</span>}
                  </button>
                );
              })}
            </div>

            <div className="flex flex-wrap gap-3 mb-3">
              <input type="text" aria-label="Search players" placeholder="Search player, team, or mouse..." value={searchQuery} onChange={e => { setSearchQuery(e.target.value); setPlayerPage(0); }}
                className="px-4 py-2 rounded-lg text-sm outline-none flex-1 min-w-48" style={{ background: "#0a0a0a", border: "1px solid #ffffff15", color: "#fff" }} />
              <button onClick={() => setShowFilters(f => !f)}
                className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all"
                style={{ background: showFilters || activeFilterCount > 0 ? "#00b4ff15" : "#0a0a0a", border: showFilters || activeFilterCount > 0 ? "1px solid #00b4ff40" : "1px solid #ffffff15", color: showFilters || activeFilterCount > 0 ? "#00b4ff" : "#fff" }}>
                {I.gear(14)} Filters {activeFilterCount > 0 && <span className="px-1.5 py-0.5 rounded-full text-sm font-black" style={{ background: "#00b4ff", color: "#000", fontSize: 12 }}>{activeFilterCount}</span>}
              </button>
              <button onClick={() => { setProfileOnly(p => !p); setPlayerPage(0); }}
                className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all"
                style={{ background: profileOnly ? "#fbbf2415" : "#0a0a0a", border: profileOnly ? "1px solid #fbbf2440" : "1px solid #ffffff15", color: profileOnly ? "#fbbf24" : "#ffffff60" }}>
                {I.star(14)} Full Profiles Only
              </button>
              <div className="flex items-center gap-2 text-sm opacity-70 px-3">
                {I.star(16)} = Full profile available
              </div>
            </div>

            {/* Expanded filters panel */}
            {showFilters && (
              <div className="rounded-xl p-4 mb-4 grid grid-cols-2 md:grid-cols-4 gap-4" style={{ background: "#0a0a0a", border: "1px solid #ffffff10" }}>
                <div>
                  <div className="text-sm uppercase tracking-widest opacity-30 mb-2">Role</div>
                  <select aria-label="Filter by role" value={roleFilter} onChange={e => { setRoleFilter(e.target.value); setPlayerPage(0); }}
                    className="w-full px-3 py-2 rounded-lg text-sm cursor-pointer" style={{ background: "#111", border: "1px solid #ffffff15", color: "#fff" }}>
                    {allRoles.map(r => <option key={r} value={r}>{r}</option>)}
                  </select>
                </div>
                <div>
                  <div className="text-sm uppercase tracking-widest opacity-30 mb-2">Country</div>
                  <select aria-label="Filter by country" value={countryFilter} onChange={e => { setCountryFilter(e.target.value); setPlayerPage(0); }}
                    className="w-full px-3 py-2 rounded-lg text-sm cursor-pointer" style={{ background: "#111", border: "1px solid #ffffff15", color: "#fff" }}>
                    {allCountries.map(c => <option key={c} value={c}>{c === "All" ? "All" : countryName(c)}</option>)}
                  </select>
                </div>
                <div>
                  <div className="text-sm uppercase tracking-widest opacity-30 mb-2">Mouse</div>
                  <input type="text" aria-label="Filter by mouse name" placeholder="e.g. Logitech, Viper..." value={mouseFilter} onChange={e => { setMouseFilter(e.target.value); setPlayerPage(0); }}
                    className="w-full px-3 py-2 rounded-lg text-sm outline-none" style={{ background: "#111", border: "1px solid #ffffff15", color: "#fff" }} />
                </div>
                <div>
                  <div className="text-sm uppercase tracking-widest opacity-30 mb-2">Team</div>
                  <input type="text" aria-label="Filter by team name" placeholder="e.g. Navi, Fnatic..." value={teamFilter} onChange={e => { setTeamFilter(e.target.value); setPlayerPage(0); }}
                    className="w-full px-3 py-2 rounded-lg text-sm outline-none" style={{ background: "#111", border: "1px solid #ffffff15", color: "#fff" }} />
                </div>
                <div className="col-span-2">
                  <div className="text-sm uppercase tracking-widest opacity-30 mb-2">DPI Range: <span className="font-bold text-white">{dpiRange[0]} – {dpiRange[1] >= 10000 ? "Any" : dpiRange[1]}</span></div>
                  <div className="flex items-center gap-3">
                    <input type="range" aria-label="Minimum DPI" min={0} max={3200} step={100} value={dpiRange[0]} onChange={e => setDpiRange([Math.min(+e.target.value, dpiRange[1]), dpiRange[1]])}
                      className="flex-1 accent-blue-400" style={{ height: 4 }} />
                    <input type="range" aria-label="Maximum DPI" min={0} max={10000} step={100} value={dpiRange[1]} onChange={e => setDpiRange([dpiRange[0], Math.max(+e.target.value, dpiRange[0])])}
                      className="flex-1 accent-blue-400" style={{ height: 4 }} />
                  </div>
                  <div className="flex justify-between text-sm opacity-20 mt-1"><span>0</span><span>800</span><span>1600</span><span>3200+</span></div>
                </div>
                <div className="col-span-2 flex items-end">
                  <button onClick={() => { setGameFilter("All"); setRoleFilter("All"); setCountryFilter("All"); setMouseFilter(""); setTeamFilter(""); setDpiRange([0, 10000]); setProfileOnly(false); setSearchQuery(""); setPlayerPage(0); }}
                    className="px-4 py-2 rounded-lg text-sm font-bold transition-all"
                    style={{ background: "#ffffff08", border: "1px solid #ffffff15", color: "#ffffff60" }}>
                    ✕ Clear All Filters
                  </button>
                </div>
              </div>
            )}
            <div data-player-table className="overflow-x-auto rounded-2xl" style={{ border: "1px solid #ffffff08" }}>
              <table className="w-full text-sm">
                <thead className="sticky top-0 z-10">
                  <tr style={{ background: "#0a0a0a" }}>
                    {sortHeaders.map(h => (
                      <th key={h.label || "_star"} className={`px-3 py-3 text-left text-sm uppercase tracking-wider font-bold ${h.key ? "cursor-pointer select-none hover:opacity-80" : ""}`}
                        style={{ color: playerSort.key === h.key ? "#00b4ff" : "#ffffff60" }}
                        aria-sort={playerSort.key === h.key ? (playerSort.dir === "asc" ? "ascending" : "descending") : undefined}
                        onClick={() => { if (h.key) { setPlayerSort(prev => prev.key === h.key ? { key: h.key, dir: prev.dir === "asc" ? "desc" : "asc" } : { key: h.key, dir: "asc" }); setPlayerPage(0); } }}>
                        {h.label}{playerSort.key === h.key ? (playerSort.dir === "asc" ? " ▲" : " ▼") : ""}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {sortedPlayers.slice(playerPage * PLAYERS_PER_PAGE, (playerPage + 1) * PLAYERS_PER_PAGE).map((p, i) => {
                    const gc = gameColors[p.game] || "#888";
                    const profilePlayer = p.hasProfile ? proPlayers.find(pp => pp.name === p.name && pp.game === (p.game)) || proPlayers.find(pp => pp.name === p.name) : null;
                    const mouseMatch = mice.find(mm => mm.name === p.mouse || p.mouse.includes(mm.name));
                    const brandCol = mouseMatch ? (BRAND_COLORS[mouseMatch.brand] || "#888") : "#ffffff40";
                    const actualIndex = playerPage * PLAYERS_PER_PAGE + i;
                    return (
                      <tr key={`${p.name}-${p.game}-${actualIndex}`}
                        className={`transition-all duration-200 ${p.hasProfile ? "cursor-pointer" : ""}`}
                        onClick={() => { if (profilePlayer) { navigateToPlayer(profilePlayer); } }}
                        style={{ borderBottom: "1px solid #ffffff06", background: actualIndex % 2 === 0 ? "#050505" : "#080808", borderLeft: `3px solid ${gc}` }}
                        onMouseEnter={e => { e.currentTarget.style.background = `${gc}0c`; e.currentTarget.style.boxShadow = `inset 4px 0 12px ${gc}10`; }}
                        onMouseLeave={e => { e.currentTarget.style.background = actualIndex % 2 === 0 ? "#050505" : "#080808"; e.currentTarget.style.boxShadow = "none"; }}>
                        <td className="pl-3 pr-1 py-2.5 text-center">{p.hasProfile ? <span title="Full profile available" className="inline-flex" style={{ filter: `drop-shadow(0 0 4px ${gc}60)` }}>{I.star(14)}</span> : <span className="opacity-10">·</span>}</td>
                        <td className="px-2 py-2.5 whitespace-nowrap">
                          <div className="flex items-center gap-2">
                            <Flag country={p.country} size={18} className="flex-shrink-0" />
                            <div>
                              <div className="text-sm font-black text-white leading-tight">{p.name}</div>
                              {p.hasProfile && <div style={{ fontSize: 10, color: gc, opacity: 0.7 }}>{p.fullName || ""}</div>}
                            </div>
                          </div>
                        </td>
                        <td className="px-2 py-2.5 whitespace-nowrap">
                          <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-sm font-bold" style={{ background: `${gc}12`, color: gc, fontSize: 11 }}>{p.game}</span>
                        </td>
                        <td className="px-2 py-2.5 opacity-50 whitespace-nowrap text-sm">{p.team}</td>
                        <td className="px-2 py-2.5 whitespace-nowrap">
                          <div className="flex items-center gap-1.5">
                            {mouseMatch && MOUSE_IMAGE_URLS[mouseMatch.name] && <img loading="lazy" src={MOUSE_IMAGE_URLS[mouseMatch.name]} alt="" className="h-4 w-6 object-contain opacity-60 flex-shrink-0" />}
                            <span className="text-sm truncate" style={{ color: brandCol, maxWidth: 140 }}>{p.mouse}</span>
                          </div>
                        </td>
                        <td className="px-2 py-2.5 text-sm opacity-40">{p.hz ? `${p.hz >= 1000 ? `${p.hz/1000}K` : p.hz}` : " - "}</td>
                        <td className="px-2 py-2.5 text-sm">{p.dpi}</td>
                        <td className="px-2 py-2.5 text-sm opacity-60">{p.sens ?? " - "}</td>
                        <td className="px-2 py-2.5 font-bold text-sm" style={{ color: p.edpi ? (p.edpi < 400 ? "#ff4444" : p.edpi < 1000 ? "#ffaa00" : p.edpi < 5000 ? "#44ff44" : "#44ddff") : "#666" }}>{p.edpi ?? " - "}</td>
                        <td className="px-2 py-2.5 text-sm">
                          <span className="opacity-40">{p.role}</span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            {/* Pagination */}
            {(() => {
              const totalPages = Math.ceil(sortedPlayers.length / PLAYERS_PER_PAGE);
              const showing = Math.min((playerPage + 1) * PLAYERS_PER_PAGE, sortedPlayers.length);
              const from = sortedPlayers.length > 0 ? playerPage * PLAYERS_PER_PAGE + 1 : 0;
              if (totalPages <= 1) return (
                <div className="text-center text-sm opacity-20 mt-3">{filteredPlayers.length} of {allPlayers.length} players shown{activeFilterCount > 0 ? ` · ${activeFilterCount} filter${activeFilterCount > 1 ? "s" : ""} active` : ""}</div>
              );
              // Build page numbers to show
              const pages = [];
              for (let p = 0; p < totalPages; p++) {
                if (p === 0 || p === totalPages - 1 || Math.abs(p - playerPage) <= 2) pages.push(p);
                else if (pages[pages.length - 1] !== -1) pages.push(-1); // ellipsis
              }
              return (
                <div className="flex flex-col items-center gap-3 mt-4">
                  <div className="flex items-center gap-1.5">
                    <button onClick={() => { setPlayerPage(p => Math.max(0, p - 1)); document.querySelector("[data-player-table]")?.scrollIntoView({ behavior: "smooth", block: "start" }); }}
                      disabled={playerPage === 0}
                      className="px-3 py-1.5 rounded-lg text-xs font-bold transition-all disabled:opacity-20"
                      style={{ background: "#ffffff08", border: "1px solid #ffffff10", color: "#fff" }}>
                      ← Prev
                    </button>
                    {pages.map((p, idx) => p === -1 ? (
                      <span key={`e${idx}`} className="px-1 text-xs opacity-20">…</span>
                    ) : (
                      <button key={p} onClick={() => { setPlayerPage(p); document.querySelector("[data-player-table]")?.scrollIntoView({ behavior: "smooth", block: "start" }); }}
                        className="w-8 h-8 rounded-lg text-xs font-bold transition-all"
                        style={{ background: p === playerPage ? "#00b4ff20" : "#ffffff06", border: `1px solid ${p === playerPage ? "#00b4ff40" : "#ffffff08"}`, color: p === playerPage ? "#00b4ff" : "#ffffff60" }}>
                        {p + 1}
                      </button>
                    ))}
                    <button onClick={() => { setPlayerPage(p => Math.min(totalPages - 1, p + 1)); document.querySelector("[data-player-table]")?.scrollIntoView({ behavior: "smooth", block: "start" }); }}
                      disabled={playerPage >= totalPages - 1}
                      className="px-3 py-1.5 rounded-lg text-xs font-bold transition-all disabled:opacity-20"
                      style={{ background: "#ffffff08", border: "1px solid #ffffff10", color: "#fff" }}>
                      Next →
                    </button>
                  </div>
                  <div className="text-xs opacity-20">Showing {from}–{showing} of {sortedPlayers.length} players{activeFilterCount > 0 ? ` · ${activeFilterCount} filter${activeFilterCount > 1 ? "s" : ""} active` : ""}</div>
                </div>
              );
            })()}

            {/* ── PRO SETUP SPOTLIGHT ── */}
            {(() => {
              const top250Pros = shuffle(proPlayers.filter(p => TOP250.has(p.name) && (gameFilter === "All" || p.game === gameFilter))).slice(0, 3);
              if (!top250Pros.length) return null;
              return (
                <div className="mt-8 mb-4">
                  <div className="flex items-center gap-2 mb-3">
                    <span style={{ color: "#d4af37" }}>{I.star(16)}</span>
                    <span className="text-xs uppercase tracking-widest font-bold" style={{ color: "#d4af37" }}>Featured Pro Setups</span>
                    <span className="text-xs opacity-20 ml-1">refreshes on load</span>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    {top250Pros.map((p, i) => {
                      const gc = gameColors[p.game] || "#888";
                      const m = mice.find(mm => mm.name === p.mouse);
                      return (
                        <div key={i} className="rounded-xl p-4 relative overflow-hidden transition-all duration-300 hover:scale-[1.02]" style={{ background: `${gc}06`, border: `1px solid ${gc}12` }}
                          onMouseEnter={e => { e.currentTarget.style.boxShadow = `0 0 20px ${gc}15`; e.currentTarget.style.borderColor = `${gc}30`; }}
                          onMouseLeave={e => { e.currentTarget.style.boxShadow = "none"; e.currentTarget.style.borderColor = `${gc}12`; }}>
                          <div className="absolute top-0 right-0 w-24 h-24 opacity-5" style={{ background: `radial-gradient(circle, ${gc}, transparent)`, transform: "translate(30%, -30%)" }} />
                          <div className="flex items-center gap-3 mb-3">
                            <div className="w-10 h-10 rounded-xl flex items-center justify-center overflow-hidden" style={{ background: `${gc}15`, border: `1px solid ${gc}20` }}><Flag country={p.country} size={22} /></div>
                            <div className="flex-1 min-w-0">
                              <a href={`/players/${p.name.toLowerCase().replace(/\+/g, "-plus").replace(/[^a-z0-9]+/g, "-").replace(/-+$/, "")}`} className="text-sm font-black text-white no-underline hover:underline" style={{ textDecoration: "none" }}>{p.name}</a>
                              <div style={{ fontSize: 11, color: gc }}>{p.team} · {p.game}</div>
                            </div>
                            <div className="text-right flex-shrink-0">
                              <div className="text-sm font-black" style={{ color: gc }}>{p.edpi}</div>
                              <div style={{ fontSize: 10 }} className="opacity-30">eDPI</div>
                            </div>
                          </div>
                          <div className="flex items-center gap-2 mb-2 px-2 py-1.5 rounded-lg" style={{ background: "#ffffff04" }}>
                            {m && MOUSE_IMAGE_URLS[m.name] && <img loading="lazy" src={MOUSE_IMAGE_URLS[m.name]} alt="" className="h-5 w-8 object-contain opacity-70 flex-shrink-0" />}
                            <span className="text-xs font-bold truncate" style={{ color: m ? (BRAND_COLORS[m.brand] || "#fff") : "#fff" }}>{p.mouse}</span>
                            <span className="text-xs opacity-20 ml-auto flex-shrink-0">{p.dpi} DPI · {p.role}</span>
                          </div>
                          <a href={amazonLink(p.mouse)} target="_blank" rel="noopener noreferrer"
                            className="flex items-center justify-center gap-1.5 w-full px-3 py-2 rounded-lg text-xs font-bold transition-all hover:scale-[1.03] no-underline"
                            style={{ background: "#f59e0b12", color: "#f59e0b", border: "1px solid #f59e0b20", textDecoration: "none" }}>
                            {I.cart(11)} Get {p.name}'s Mouse{m ? ` — $${m.price}` : ""}
                          </a>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })()}

            <SectionTitle color="#ff4655" sub="Distribution of sensitivity settings across all tracked players">eDPI Distribution by Game</SectionTitle>
            <div className="rounded-xl p-4 mb-4" style={{ background: "#ff465508", border: "1px solid #ff465512" }}>
              <div className="text-sm opacity-50 leading-relaxed">
                <span className="font-bold" style={{ color: "#ff4655" }}>Sample Size Notice:</span> These distributions are based on our database of <span className="font-bold text-white">{allPlayers.filter(p => p.edpi).length}</span> players with confirmed eDPI data out of <span className="font-bold text-white">{allPlayers.length}</span> total tracked players. Games with fewer than 3 players with eDPI data are excluded. PUBG uses a unique sensitivity system and does not have standardized eDPI values. Larger samples produce more reliable distributions.
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* OVERALL eDPI chart first */}
              {(() => {
                const allWithEdpi = allPlayers.filter(p => p.edpi);
                const total = allWithEdpi.length;
                if (total < 3) return null;
                const ranges = [
                  { range: "< 300", count: allWithEdpi.filter(p => p.edpi < 300).length },
                  { range: "300-500", count: allWithEdpi.filter(p => p.edpi >= 300 && p.edpi < 500).length },
                  { range: "500-700", count: allWithEdpi.filter(p => p.edpi >= 500 && p.edpi < 700).length },
                  { range: "700-900", count: allWithEdpi.filter(p => p.edpi >= 700 && p.edpi < 900).length },
                  { range: "900-1200", count: allWithEdpi.filter(p => p.edpi >= 900 && p.edpi < 1200).length },
                  { range: "1200-2000", count: allWithEdpi.filter(p => p.edpi >= 1200 && p.edpi < 2000).length },
                  { range: "2000-3000", count: allWithEdpi.filter(p => p.edpi >= 2000 && p.edpi < 3000).length },
                  { range: "3000+", count: allWithEdpi.filter(p => p.edpi >= 3000).length },
                ];
                const avgEdpi = Math.round(allWithEdpi.reduce((a, p) => a + p.edpi, 0) / total);
                const medianEdpi = allWithEdpi.map(p => p.edpi).sort((a, b) => a - b)[Math.floor(total / 2)];
                const minEdpi = Math.min(...allWithEdpi.map(p => p.edpi));
                const maxEdpi = Math.max(...allWithEdpi.map(p => p.edpi));
                return (
                  <div className="rounded-2xl p-5 md:col-span-2" style={{ background: "#0a0a0a", border: "1px solid #ffffff15" }}>
                    <div className="flex items-center justify-between mb-1">
                      <div className="text-base sm:text-lg font-black text-center sm:text-left" style={{ color: "#f472b6" }}><span className="inline-flex mr-1.5 align-middle">{I.globe(20)}</span>All Games  -  Overall eDPI Distribution</div>
                      <div className="px-2.5 py-1 rounded text-sm font-bold" style={{ background: "#f472b615", color: "#f472b6" }}>n = {total}</div>
                    </div>
                    <div className="flex gap-5 mb-3 text-sm opacity-85">
                      <span>Mean: <span className="font-bold text-white">{avgEdpi}</span></span>
                      <span>Median: <span className="font-bold text-white">{medianEdpi}</span></span>
                      <span>Min: <span className="font-bold text-white">{minEdpi}</span></span>
                      <span>Max: <span className="font-bold text-white">{maxEdpi}</span></span>
                    </div>
                    <ResponsiveContainer width="100%" height={220}>
                      <BarChart data={ranges}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#ffffff06" />
                        <XAxis dataKey="range" tick={{ fill: "#ffffff40", fontSize: 13 }} />
                        <YAxis tick={{ fill: "#ffffff40", fontSize: 13 }} />
                        <Bar dataKey="count" radius={[4, 4, 0, 0]} fillOpacity={0.8} name="Players">
                          {ranges.map((r, ri) => <Cell key={ri} fill={r.count === Math.max(...ranges.map(x => x.count)) ? "#f472b6" : "#f472b640"} />)}
                        </Bar>
                        <Tooltip content={<CustomTooltip />} />
                      </BarChart>
                    </ResponsiveContainer>
                    <div className="flex flex-wrap gap-3 mt-2">
                      {ranges.map((r, ri) => (
                        <div key={ri} className="text-sm opacity-30">
                          {r.range}: <span className="font-bold" style={{ color: r.count === Math.max(...ranges.map(x => x.count)) ? "#f472b6" : "#ffffff60" }}>{Math.round((r.count / total) * 100)}%</span> <span className="opacity-50">({r.count})</span>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })()}
              {/* Per-game eDPI charts */}
              {(() => {
                const gcMap = { CS2: "#ff8c00", Valorant: "#ff4655", "R6 Siege": "#4a86c8", "Call of Duty": "#5cb85c", Fortnite: "#4c7bd9", "League of Legends": "#c89b3c", LoL: "#c89b3c", "Overwatch 2": "#f99e1a", Apex: "#dc2626", "Dota 2": "#e74c3c", "Rocket League": "#1a9fff", "Marvel Rivals": "#ed1d24", Deadlock: "#8b5cf6", PUBG: "#f2a900" };
                const gamesList = [...new Set(allPlayers.map(p => p.game))];
                return gamesList.map(game => {
                  const gamePlayers = allPlayers.filter(p => p.game === game && p.edpi);
                  if (gamePlayers.length < 3) return null;
                  const total = gamePlayers.length;
                  // adaptive ranges based on game genre
                  const isHighSens = ["Overwatch 2", "Marvel Rivals", "Fortnite"].includes(game);
                  const ranges = isHighSens ? [
                    { range: "< 1000", count: gamePlayers.filter(p => p.edpi < 1000).length },
                    { range: "1000-2000", count: gamePlayers.filter(p => p.edpi >= 1000 && p.edpi < 2000).length },
                    { range: "2000-3000", count: gamePlayers.filter(p => p.edpi >= 2000 && p.edpi < 3000).length },
                    { range: "3000-4000", count: gamePlayers.filter(p => p.edpi >= 3000 && p.edpi < 4000).length },
                    { range: "4000+", count: gamePlayers.filter(p => p.edpi >= 4000).length },
                  ] : [
                    { range: "< 400", count: gamePlayers.filter(p => p.edpi < 400).length },
                    { range: "400-600", count: gamePlayers.filter(p => p.edpi >= 400 && p.edpi < 600).length },
                    { range: "600-800", count: gamePlayers.filter(p => p.edpi >= 600 && p.edpi < 800).length },
                    { range: "800-1000", count: gamePlayers.filter(p => p.edpi >= 800 && p.edpi < 1000).length },
                    { range: "1000+", count: gamePlayers.filter(p => p.edpi >= 1000).length },
                  ];
                  const avgEdpi = Math.round(gamePlayers.reduce((a, p) => a + p.edpi, 0) / total);
                  const minEdpi = Math.min(...gamePlayers.map(p => p.edpi));
                  const maxEdpi = Math.max(...gamePlayers.map(p => p.edpi));
                  const gc = gcMap[game] || "#888";
                  return (
                    <div key={game} className="rounded-2xl p-5" style={{ background: "#0a0a0a", border: "1px solid #ffffff08" }}>
                      <div className="flex items-center justify-between mb-1">
                        <div className="text-base sm:text-lg font-black text-center sm:text-left flex items-center gap-2" style={{ color: gc }}>
                          {GAME_IMAGE_URLS[game] && <img loading="lazy" src={GAME_IMAGE_URLS[game]} alt={game} className="w-5 h-5 object-contain inline-block" />}
                          {game}
                        </div>
                        <div className="px-2 py-0.5 rounded text-sm font-bold" style={{ background: `${gc}15`, color: gc }}>n = {total}</div>
                      </div>
                      <div className="flex gap-4 mb-3 text-sm opacity-85">
                        <span>Avg: <span className="font-bold text-white">{avgEdpi}</span></span>
                        <span>Min: <span className="font-bold text-white">{minEdpi}</span></span>
                        <span>Max: <span className="font-bold text-white">{maxEdpi}</span></span>
                      </div>
                      <ResponsiveContainer width="100%" height={180}>
                        <BarChart data={ranges}>
                          <XAxis dataKey="range" tick={{ fill: "#ffffff40", fontSize: 13 }} />
                          <YAxis tick={{ fill: "#ffffff40", fontSize: 13 }} />
                          <Bar dataKey="count" fill={gc} radius={[4, 4, 0, 0]} fillOpacity={0.7} name="Players" />
                          <Tooltip content={<CustomTooltip />} />
                        </BarChart>
                      </ResponsiveContainer>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {ranges.map((r, ri) => (
                          <div key={ri} className="text-sm opacity-30">
                            {r.range}: <span className="font-bold" style={{ color: r.count === Math.max(...ranges.map(x => x.count)) ? gc : "#ffffff60" }}>{total > 0 ? Math.round((r.count / total) * 100) : 0}%</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                }).filter(Boolean);
              })()}
            </div>
          </div>
          );
        })()}

        {/* ── BRANDS TAB ── */}
        {activeTab === "brands" && (
          <div>
            <SectionTitle color="#e879f9" sub="From industry giants to boutique innovators  -  the companies shaping competitive gaming">Mouse Manufacturer Profiles</SectionTitle>
            <div className="space-y-5">
              {[
                { name: "Razer", icon: "viper", desc: "Razer is the undisputed king of esports peripherals in 2025-2026, commanding over 34% of the professional mouse market  -  a number that's even more impressive when you consider that Logitech held that throne unchallenged for nearly four years before Razer dethroned them. Founded in 2005 in San Francisco by Min-Liang Tan and Robert Krakoff, Razer grew from a niche gaming startup into a $2 billion global empire. The Razer DeathAdder, first released in 2006, became arguably the most popular gaming mouse shape ever made  -  its ergonomic right-hand design has been iterated on for nearly 20 years and cloned by dozens of competitors. Ask any mouse enthusiast to name the most influential mouse shapes of all time, and the DeathAdder will be in the top three alongside the IntelliMouse Explorer 3.0 and the original Logitech G Pro Wireless. The Viper line, launched in 2019, marked Razer's pivot toward symmetrical ultralight designs that would eventually conquer the FPS scene. But it was the Viper V3 Pro in 2024 that changed everything  -  at 54g with the Focus Pro 35K sensor, 8KHz polling, and Gen-3 optical switches, it became the single most-used mouse in professional esports almost overnight. The optical switch technology deserves special mention: when Razer introduced it with the original Viper in 2019, the industry was skeptical. Optical switches use an infrared light beam to register clicks instead of metal contact points, completely eliminating the debounce delay that plagued mechanical switches. Every major manufacturer has since scrambled to develop their own optical or hybrid solution, but Razer got there first and has had six years to refine the technology. The V3 Pro isn't just popular because of sponsorship deals  -  pros genuinely choose it because it combines the lowest click latency, best weight-to-rigidity ratio, and most refined shape in the ultralight symmetrical category.",
                  achievements: ["#1 most-used mouse in pro esports (Viper V3 Pro, 2024-Present)", "Invented optical mouse switches  -  eliminating debounce delay industry-wide", "DeathAdder line: most iconic ergonomic gaming mouse shape in history (2006-Present)"],
                  flagships: ["Viper V3 Pro", "DeathAdder V3 Pro", "Viper V3 HyperSpeed"] },
                { name: "Logitech", icon: "crosshair", desc: "Logitech is the Swiss-born giant that essentially invented the modern esports mouse category. Founded in 1981 in Lausanne, Switzerland, Logitech has been manufacturing mice longer than most gaming companies have existed. Their gaming division, Logitech G, has produced some of the most legendary peripherals in competitive history. The original G Pro Wireless, released in 2018, was a watershed moment  -  it was the first wireless mouse to be genuinely competitive with wired options, and it single-handedly convinced the professional scene that wireless was viable for tournament play. Before the GPW, the idea of using wireless in a $100K tournament final was laughable. After it, wireless became the default. The G Pro X Superlight, released in 2020 at just 63g, then became the most dominant mouse in esports history, used by an estimated 25% of all professional FPS players at its peak. For nearly four years (2020-2024), no other mouse came close. The HERO sensor, developed entirely in-house, represents one of the most impressive engineering feats in the peripheral industry  -  delivering zero smoothing, zero acceleration, and class-leading power efficiency. Logitech's Lightspeed wireless technology set the gold standard for low-latency wireless, and their newest Lightforce hybrid switches offered the best of both optical speed and mechanical feel. In 2025, they pushed boundaries again with the G Pro X2 Superstrike and its revolutionary HITS haptic inductive trigger system  -  replacing mechanical switches entirely with magnetic induction for tunable actuation, rapid trigger, and haptic feedback. It's the most technologically advanced mouse ever made, though whether pros will actually adopt it over the proven Superlight 2 remains an open question.",
                  achievements: ["Held #1 pro mouse position for 4 consecutive years (G Pro X Superlight, 2020-2024)", "Pioneered viable wireless esports mice  -  the G Pro Wireless converted the entire pro scene (2018)", "HITS technology in G Pro X2 Superstrike: first magnetic induction switches in a gaming mouse (2025)"],
                  flagships: ["G Pro X2 Superstrike", "G Pro X Superlight 2", "G Pro X Superlight"] },
                { name: "Zowie", icon: "rdot", desc: "Zowie occupies a sacred place in esports history as the brand that understood competitive players before anyone else did. Founded in 2008 in Taiwan and later acquired by BenQ, Zowie built its entire identity around one principle: plug-and-play simplicity with no software required. While other brands chased RGB lighting and app ecosystems, Zowie focused relentlessly on shape, ergonomics, and reliable performance. The EC series, inspired by the legendary Microsoft IntelliMouse Explorer 3.0, became the gold standard for ergonomic gaming mice throughout the 2010s. At the peak of CS:GO's competitive era (2014-2019), Zowie mice were used by an estimated 40-50% of all professional Counter-Strike players  -  a level of dominance that may never be matched. Players like s1mple, NiKo, coldzera, and device all built their legacies on Zowie shapes. The FK series pioneered the low-profile ambidextrous shape that would later inspire the Viper line. Zowie's refusal to require driver software earned them a cult following among purists. Though their market share has declined in the wireless era, their recent CW and DW wireless versions of classic shapes prove they can adapt while maintaining their identity.",
                  achievements: ["Dominated CS:GO pro scene with ~45% market share (2014-2019)  -  highest single-brand dominance ever", "EC2 shape: the most cloned ergonomic mouse design in gaming history", "Pioneered the 'no-software, plug-and-play' philosophy for esports peripherals"],
                  flagships: ["EC2-CW", "EC2-DW", "FK2-CW"] },
                { name: "Finalmouse", icon: "star", desc: "Finalmouse is the most polarizing and arguably the most influential boutique brand in gaming mouse history. Founded in 2014 in Irvine, California, Finalmouse didn't just enter the ultralight market  -  they created it. Full stop. Before Finalmouse, the idea of drilling holes in a mouse shell to save weight would have been considered insane. The original Ultralight Pro, released in 2018, shocked the industry at 67g with its honeycomb shell design, and within two years virtually every major manufacturer had copied it. Finalmouse then pushed further with the Air58 (58g) and the legendary Starlight-12, which used a magnesium alloy shell to hit 42g while maintaining structural rigidity. Their limited-drop business model, where mice sell out in minutes and resell for 3-5x retail, has created a secondary market unlike anything else in peripherals  -  a Starlight-12 in good condition still commands $300+ on the resale market years after release. The UltralightX in 2024 represented a more accessible direction with wider availability while still pushing boundaries with 8KHz polling and sub-45g weight. TenZ, arguably the most popular Valorant player in the world, has been a devoted Finalmouse user, lending the brand enormous visibility. Love them or hate them  -  and the mouse community is genuinely split  -  Finalmouse forced the entire industry to take weight seriously. Before them, 80-100g was 'normal.' Now, anything above 60g feels heavy. That's Finalmouse's legacy.",
                  achievements: ["Invented the ultralight honeycomb mouse category  -  copied by every major brand (2018)", "Starlight-12: first magnesium alloy gaming mouse, hit 42g and shattered weight records (2021)", "Created the most valuable secondary market in peripherals  -  Starlight mice resold for $300-$500+"],
                  flagships: ["UltralightX", "Starlight-12", "ULX Prophecy"] },
                { name: "Lamzu", icon: "🌙", desc: "Lamzu is the scrappy Hong Kong startup that proved you don't need decades of history to make a world-class mouse. Founded in 2022, they burst onto the scene with the Atlantis  -  a 55g wireless mouse that reviewers immediately praised for its build quality, sensor performance, and value proposition. In an era where Razer and Logitech charged $150+, Lamzu delivered comparable quality at $80-$100. The Atlantis Mini refined the formula with a smaller form factor that became a claw-grip favorite. But it was the Maya X in 2025 that truly elevated the brand  -  ScreaM, legendary for having the best aim in FPS history, chose it as his primary mouse, giving Lamzu credibility that money can't buy. In just three years, they've gone from unknown to a brand that established players genuinely fear.",
                  achievements: ["Disrupted the premium mouse market with flagship quality at $80-$100 (2022-Present)", "ScreaM  -  'the human aimbot'  -  chose Maya X as his primary mouse (2025)", "Fastest-growing mouse brand in esports, from zero to top-6 market share in under 3 years"],
                  flagships: ["Maya X", "Atlantis Mini", "Inca"] },
                { name: "Pulsar", icon: "💫", desc: "Pulsar is the South Korean engineering powerhouse that has been quietly building one of the most impressive mouse portfolios in the industry. Founded in 2020 in Seoul, Pulsar entered a crowded market but immediately differentiated itself with obsessive weight optimization, innovative materials, and a distinctly Korean approach to design  -  meticulous, detail-oriented, and focused on measurable performance over marketing hype. The X2 series became their flagship, delivering sub-55g weights with a comfortable egg-shaped design that works for multiple grip styles. What sets Pulsar apart is the breadth of their lineup: the X2, X2 Mini, X2H (hump-back), and X2F each target a specific hand size and grip style, showing a level of ergonomic consideration that most brands ignore entirely. They also produce some of the best glass mousepads in the industry, showing they understand the full aiming ecosystem. Their collaboration with ZywOo on a signature mouse cemented their credibility in the pro scene. They may not have the marketing budget of Razer or Logitech, but among the enthusiast community, Pulsar is spoken about with reverence usually reserved for much older brands.",
                  achievements: ["X2 series: consistently rated top-3 in value across all major peripheral review outlets", "Pioneered sub-48g wireless gaming mice with the X2 Mini without sacrificing build quality", "Built a devoted competitive aim-trainer community following  -  top choice among Kovaak's players"],
                  flagships: ["X2F", "X2H", "X2 Mini"] },
                { name: "SteelSeries", icon: "🦅", desc: "SteelSeries is one of the true OGs of esports peripherals, founded in 2001 in Copenhagen, Denmark  -  making them older than Razer in the competitive gaming space. The Sensei, released in 2011, was a landmark ambidextrous mouse that became a staple in CS 1.6 and early CS:GO. SteelSeries has always been known for their software ecosystem, and their consistent presence at major tournaments has made their logo one of the most recognized in competitive gaming. While they haven't recaptured their early-2010s dominance in the mouse space, they remain a trusted name with a loyal following, particularly in the Nordic esports scene.",
                  achievements: ["One of the first companies to design mice specifically for esports (2001)", "Sensei: defined the ambidextrous esports mouse shape for a generation (2011)", "Pioneered unified peripheral software management with SteelSeries Engine"],
                  flagships: ["Aerox 5 Wireless", "Prime Wireless", "Rival 5"] },
                { name: "Corsair", icon: "⚓", desc: "Corsair is a peripheral powerhouse historically known for keyboards, cases, and RAM, but their mouse division has been making serious strides. Founded in 1994 in Fremont, California, Corsair has engineering depth and manufacturing scale that few can match. The M75 Air impressed with 8KHz polling and competitive weight at an accessible price point, while their iCUE software offers one of the most comprehensive customization suites available. Their acquisition of Elgato and SCUF positions them as a full-ecosystem gaming company. Still building their esports mouse reputation compared to Razer and Logitech, but Corsair's R&D resources mean they're always a few iterations from producing something category-defining.",
                  achievements: ["M75 Air: brought 8KHz polling to a competitive price point for mainstream adoption", "iCUE ecosystem: one of the most comprehensive peripheral customization platforms", "Built a full gaming ecosystem through strategic acquisitions (Elgato, SCUF, Origin PC)"],
                  flagships: ["M75 Air", "Sabre RGB Pro", "M75 Wireless"] },
                { name: "Endgame Gear", icon: "🇩🇪", desc: "Endgame Gear is the German precision-engineering brand that approaches mouse design with the meticulousness you'd expect from the country that gave us Porsche and Leica. They made their name with the XM1  -  designed from the ground up based on pro CS:GO feedback, it delivered what was widely considered the best stock cable and click feel in the industry at launch. The OP1 8K pushed them into high-polling wireless territory. Their philosophy is pure no-nonsense: clean aesthetics, excellent component choices, and shapes refined through extensive pro testing. No gimmicks, no RGB  -  just the fundamentals that competitive players actually care about.",
                  achievements: ["XM1: widely considered to have the best stock mouse cable in the industry at launch", "OP1 8K: showcased German precision engineering in the 8KHz wireless era", "Known for the cleanest stock switch implementation and click feel among enthusiast brands"],
                  flagships: ["OP1 8K", "XM2w", "OP1we"] },
                { name: "ASUS", icon: "🦁", desc: "ASUS's Republic of Gamers (ROG) division brings something no other mouse manufacturer can  -  they design and fabricate their own chips. This vertical integration gives them unique optimization capabilities between sensor, MCU, and wireless radio that companies buying off-the-shelf components simply cannot replicate. The ROG Harpe Ace Extreme, at just 47g with a carbon fiber composite shell, represents one of the most technically ambitious mice ever made. The Gladius III and Keris lines serve as more accessible entry points. As they continue investing in peripherals, ASUS has the silicon expertise to potentially become a top-3 esports mouse brand.",
                  achievements: ["ROG Harpe Ace Extreme: 47g carbon fiber composite  -  lightest premium wireless mouse from a major brand", "Only mouse manufacturer that designs custom silicon for sensor and wireless integration", "ROG ecosystem integration: seamless cross-device syncing across the broadest peripheral lineup"],
                  flagships: ["ROG Harpe Ace Extreme", "ROG Gladius III", "ROG Keris"] },
                { name: "WLMouse", icon: "🐉", desc: "WLMouse achieved what no established manufacturer could  -  a production wireless gaming mouse weighing just 30 grams. The Beast X launched as a crowd-funded project and became an instant sensation, selling out repeatedly. To put 30g in perspective: it's lighter than most AA batteries, and roughly half the weight of the already-ultralight Superlight. While some players find it too light for precise control, the Beast X expanded everyone's understanding of what's physically possible in mouse engineering. The Beast X Mini pushed even further to 28-29g. WLMouse represents the absolute bleeding edge  -  and their success has forced every established brand to reconsider their weight targets.",
                  achievements: ["Beast X: world's lightest production wireless gaming mouse at 30g  -  a record that still stands", "Proved crowd-funded mouse brands can compete with established manufacturers", "Shifted the entire industry's weight targets downward  -  50g is now 'normal' partly because of WLMouse"],
                  flagships: ["Beast X", "Beast X Mini"] },
              ].map((brand, i) => {
                const col = BRAND_COLORS[brand.name] || "#888";
                const brandMice = mice.filter(m => m.brand === brand.name);
                const totalUsage = brandMice.reduce((acc, m) => acc + m.proUsage, 0);
                return (
                  <div key={i} id={`brand-${brand.name.replace(/\s+/g, '-').toLowerCase()}`} className="rounded-2xl p-4 sm:p-6 transition-all" style={{ background: `${col}06`, border: `1px solid ${col}12` }}>
                    <div className="flex items-center gap-3 sm:gap-4 mb-2 sm:mb-1">
                      {BRAND_IMAGE_URLS[brand.name] ? <img loading="lazy" src={BRAND_IMAGE_URLS[brand.name]} alt={brand.name} className="h-8 w-8 sm:h-10 sm:w-10 object-contain" /> : <span className="inline-flex justify-center">{icon(brand.icon, 32)}</span>}
                      <div className="flex-1 min-w-0">
                        <span className="text-xl sm:text-2xl font-black hover:underline cursor-pointer" style={{ color: col }} onClick={() => { window.location.href = `/brands/${brand.name.toLowerCase().replace(/\+/g, "-plus").replace(/[^a-z0-9]+/g, "-").replace(/-+$/, "")}`; }}>{brand.name}</span>
                        <div className="text-xs sm:text-sm opacity-30">{totalUsage}% total pro usage · {brandMice.length} model{brandMice.length !== 1 ? "s" : ""}</div>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-1.5 sm:gap-2 mb-4">
                      {brand.flagships.map((f, j) => {
                        const fl = f.toLowerCase();
                        const matchedMouse = mice.find(m => m.name.toLowerCase().endsWith(fl)) || mice.find(m => m.name.toLowerCase().includes(fl));
                        const mouseSlug = matchedMouse ? matchedMouse.name.toLowerCase().replace(/\+/g, "-plus").replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "") : null;
                        return (
                          <span key={j} className="px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-full text-xs sm:text-sm font-bold cursor-pointer transition-all hover:scale-105 hover:brightness-125"
                            style={{ background: `${col}15`, color: col }}
                            onClick={() => { if (matchedMouse && mouseSlug) { window.location.href = `/mice/${mouseSlug}`; } }}>
                            {f}
                          </span>
                        );
                      })}
                    </div>
                    <p className="text-xs sm:text-sm opacity-75 leading-relaxed mb-4 sm:mb-5">{brand.desc}</p>
                    <div className="rounded-xl p-3 sm:p-4" style={{ background: `${col}08`, border: `1px solid ${col}10` }}>
                      <div className="text-xs sm:text-sm uppercase tracking-widest opacity-30 mb-2 sm:mb-3">Key Achievements</div>
                      <div className="space-y-2">
                        {brand.achievements.map((a, j) => (
                          <div key={j} className="flex items-start gap-2">
                            <span className="text-xs sm:text-sm mt-0.5 flex-shrink-0">{j === 0 ? I.trophy(14) : j === 1 ? I.star(14) : I.crosshair(14)}</span>
                            <span className="text-xs sm:text-sm leading-relaxed" style={{ color: j === 0 ? col : "#ffffffa0" }}>{a}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Top 3 Mice — compact animated strip */}
                    {(() => {
                      let top3 = [...brandMice].sort((a, b) => b.proUsage - a.proUsage).slice(0, 3);
                      if (brand.name === "Pulsar" && !top3.find(m => m.name.includes("ZywOo"))) {
                        const zywoo = brandMice.find(m => m.name.includes("ZywOo"));
                        if (zywoo) { top3 = [top3[0], top3[1], zywoo]; }
                      }
                      if (top3.length === 0) return null;
                      return (
                        <div className="flex items-center gap-2 mt-4 flex-wrap">
                          <style>{`@keyframes brandPulse { 0%,100% { opacity:.35 } 50% { opacity:.7 } } @keyframes slideIn { from { opacity:0; transform:translateX(-8px) } to { opacity:1; transform:translateX(0) } }`}</style>
                          <span style={{ fontSize: 11, animation: "brandPulse 2s ease-in-out infinite" }} className="uppercase tracking-widest font-bold w-full sm:w-auto mb-1 sm:mb-0"><span style={{ color: col }}>▸</span> <span className="opacity-85">Shop top picks</span></span>
                          {top3.map((m, mi) => {
                            const imgUrl = MOUSE_IMAGE_URLS[m.name];
                            return (
                              <a key={mi} href={amazonLink(m.name)} target="_blank" rel="noopener noreferrer"
                                className="group inline-flex items-center gap-1.5 px-2 py-1 sm:px-2.5 sm:py-1.5 rounded-full transition-all duration-300 hover:scale-105 hover:brightness-125"
                                style={{ background: `${col}08`, border: `1px solid ${col}12`, animation: `slideIn 0.4s ease-out ${mi * 0.1}s both` }}>
                                {imgUrl ? <img loading="lazy" src={imgUrl} alt={`${m.name} gaming mouse`} className="h-5 w-6 sm:h-6 sm:w-8 object-contain transition-transform duration-300 group-hover:scale-125" style={{ filter: `drop-shadow(0 1px 4px ${col}40)` }} /> : <span className="opacity-30">{I.mouse(12)}</span>}
                                <span style={{ fontSize: 10, color: col }} className="font-bold whitespace-nowrap sm:text-[10px]">{m.name.replace(/(Logitech |Razer |Finalmouse |Lamzu |Pulsar |SteelSeries |Corsair |Endgame Gear |ASUS |Ninjutso |WLMouse |Zowie |Vaxee |HyperX |G-Wolves |Sony |LGG )/, "")}</span>
                                <span style={{ fontSize: 9 }} className="opacity-30 sm:text-[9px]">${m.price}</span>
                                <span style={{ fontSize: 10, color: col }} className="opacity-0 group-hover:opacity-70 transition-opacity duration-200">→</span>
                              </a>
                            );
                          })}
                        </div>
                      );
                    })()}
                    <button onClick={() => { window.location.href = `/brands/${brand.name.toLowerCase().replace(/\+/g, "-plus").replace(/[^a-z0-9]+/g, "-").replace(/-+$/, "")}`; }}
                      className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all hover:scale-105 cursor-pointer"
                      style={{ background: `${col}15`, color: col, border: `1px solid ${col}25` }}>
                      View full {brand.name} page →
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ── TRENDS TAB ── */}
        {activeTab === "trends" && (
          <div>
            <SectionTitle color="#f472b6" sub="How esports mice have evolved over the years">Industry Trends & Evolution</SectionTitle>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="rounded-2xl p-6" style={{ background: "#0a0a0a", border: "1px solid #ffffff08" }}>
                <div className="text-sm font-bold mb-4 opacity-60">Average Mouse Weight Over Time (grams)</div>
                <ResponsiveContainer width="100%" height={280}>
                  <AreaChart data={weightTrend}>
                    <defs>
                      <linearGradient id="wg1" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#f472b6" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#f472b6" stopOpacity={0} />
                      </linearGradient>
                      <linearGradient id="wg2" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#00ff6a" stopOpacity={0.2} />
                        <stop offset="95%" stopColor="#00ff6a" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#ffffff08" />
                    <XAxis dataKey="year" tick={{ fill: "#ffffff40", fontSize: 13 }} />
                    <YAxis tick={{ fill: "#ffffff40", fontSize: 13 }} unit="g" />
                    <Tooltip content={<CustomTooltip />} />
                    <Area type="monotone" dataKey="avgWeight" stroke="#f472b6" fill="url(#wg1)" strokeWidth={2} name="Avg Weight" />
                    <Area type="monotone" dataKey="lightest" stroke="#00ff6a" fill="url(#wg2)" strokeWidth={2} name="Lightest" strokeDasharray="5 5" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>

              <div className="rounded-2xl p-6" style={{ background: "#0a0a0a", border: "1px solid #ffffff08" }}>
                <div className="text-sm font-bold mb-4 opacity-60">Polling Rate Evolution (Hz)</div>
                <ResponsiveContainer width="100%" height={280}>
                  <LineChart data={pollingTrend}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#ffffff08" />
                    <XAxis dataKey="year" tick={{ fill: "#ffffff40", fontSize: 13 }} />
                    <YAxis tick={{ fill: "#ffffff40", fontSize: 13 }} />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend wrapperStyle={{ fontSize: 13, opacity: 0.5 }} />
                    <Line type="monotone" dataKey="max" stroke="#00ff6a" strokeWidth={2} dot={{ r: 3, fill: "#00ff6a" }} name="Max Available" />
                    <Line type="monotone" dataKey="avg" stroke="#00b4ff" strokeWidth={2} dot={{ r: 3, fill: "#00b4ff" }} name="Average" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            <SectionTitle color="#06b6d4" sub="Which grip styles dominate the professional scene">Pro Mouse Shape Breakdown</SectionTitle>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="rounded-2xl p-6" style={{ background: "#0a0a0a", border: "1px solid #ffffff08" }}>
                <div className="text-sm font-bold mb-4 opacity-60">Shape Distribution Among Pros</div>
                {(() => {
                  const shapeCounts = {};
                  allPlayers.forEach(p => {
                    const m = mice.find(mm => mm.name === p.mouse || p.mouse.includes(mm.name));
                    if (m) shapeCounts[m.shape] = (shapeCounts[m.shape] || 0) + 1;
                  });
                  const total = Object.values(shapeCounts).reduce((a, b) => a + b, 0);
                  const shapeData = Object.entries(shapeCounts).sort((a, b) => b[1] - a[1]).map(([name, count]) => ({
                    name, value: parseFloat((count / total * 100).toFixed(1)),
                    fill: name === "Symmetrical" ? "#06b6d4" : name === "Ergonomic" ? "#f472b6" : "#d4af37"
                  }));
                  return (
                    <ResponsiveContainer width="100%" height={280}>
                      <PieChart>
                        <Pie data={shapeData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} innerRadius={50} strokeWidth={0}
                          label={({ name, value }) => `${name}: ${value}%`}>
                          {shapeData.map((s, i) => <Cell key={i} fill={s.fill} fillOpacity={0.7} />)}
                        </Pie>
                        <Tooltip content={<CustomTooltip />} />
                      </PieChart>
                    </ResponsiveContainer>
                  );
                })()}
              </div>
              <div className="rounded-2xl p-6" style={{ background: "#0a0a0a", border: "1px solid #ffffff08" }}>
                <div className="text-sm font-bold mb-4 opacity-60">DPI Distribution Across All Pros</div>
                {(() => {
                  const dpiRanges = [
                    { range: "< 400", min: 0, max: 400, color: "#ff4444" },
                    { range: "400-600", min: 400, max: 600, color: "#ff8c00" },
                    { range: "600-800", min: 600, max: 800, color: "#d4af37" },
                    { range: "800-1000", min: 800, max: 1000, color: "#00ff6a" },
                    { range: "1000-1600", min: 1000, max: 1600, color: "#00b4ff" },
                    { range: "1600+", min: 1600, max: 999999, color: "#8b5cf6" },
                  ];
                  const data = dpiRanges.map(r => ({
                    range: r.range,
                    players: allPlayers.filter(p => p.dpi >= r.min && p.dpi < r.max).length,
                    fill: r.color,
                    pct: parseFloat((allPlayers.filter(p => p.dpi >= r.min && p.dpi < r.max).length / allPlayers.length * 100).toFixed(1))
                  }));
                  return (
                    <ResponsiveContainer width="100%" height={280}>
                      <BarChart data={data}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#ffffff08" />
                        <XAxis dataKey="range" tick={{ fill: "#ffffff40", fontSize: 13 }} />
                        <YAxis tick={{ fill: "#ffffff40", fontSize: 13 }} />
                        <Tooltip content={<CustomTooltip />} />
                        <Bar dataKey="players" radius={[6, 6, 0, 0]} name="Players">
                          {data.map((d, i) => <Cell key={i} fill={d.fill} fillOpacity={0.7} />)}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  );
                })()}
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 mt-6 sm:mt-8">
              <div className="rounded-2xl p-6" style={{ background: "#0a0a0a", border: "1px solid #ffffff08" }}>
                <div className="text-sm font-bold mb-4 opacity-60">Wireless vs Wired Adoption in Pro Esports (%)</div>
                <ResponsiveContainer width="100%" height={280}>
                  <AreaChart data={wirelessTrend}>
                    <defs>
                      <linearGradient id="wlg1" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#00ff6a" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#00ff6a" stopOpacity={0} />
                      </linearGradient>
                      <linearGradient id="wlg2" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#ff3c3c" stopOpacity={0.15} />
                        <stop offset="95%" stopColor="#ff3c3c" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#ffffff08" />
                    <XAxis dataKey="year" tick={{ fill: "#ffffff40", fontSize: 13 }} />
                    <YAxis tick={{ fill: "#ffffff40", fontSize: 13 }} unit="%" domain={[0, 100]} />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend wrapperStyle={{ fontSize: 13, opacity: 0.5 }} />
                    <Area type="monotone" dataKey="wireless" stroke="#00ff6a" fill="url(#wlg1)" strokeWidth={2} name="Wireless %" />
                    <Area type="monotone" dataKey="wired" stroke="#ff3c3c" fill="url(#wlg2)" strokeWidth={2} name="Wired %" strokeDasharray="5 5" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>

              <div className="rounded-2xl p-6" style={{ background: "#0a0a0a", border: "1px solid #ffffff08" }}>
                <div className="text-sm font-bold mb-4 opacity-60">Mouse Price Evolution (USD)</div>
                <ResponsiveContainer width="100%" height={280}>
                  <LineChart data={priceTrend}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#ffffff08" />
                    <XAxis dataKey="year" tick={{ fill: "#ffffff40", fontSize: 13 }} />
                    <YAxis tick={{ fill: "#ffffff40", fontSize: 13 }} unit="$" />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend wrapperStyle={{ fontSize: 13, opacity: 0.5 }} />
                    <Line type="monotone" dataKey="flagship" stroke="#d4af37" strokeWidth={2} dot={{ r: 3, fill: "#d4af37" }} name="Flagship" />
                    <Line type="monotone" dataKey="avg" stroke="#00b4ff" strokeWidth={2} dot={{ r: 3, fill: "#00b4ff" }} name="Average" />
                    <Line type="monotone" dataKey="budget" stroke="#10b981" strokeWidth={2} dot={{ r: 3, fill: "#10b981" }} name="Budget" strokeDasharray="5 5" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 mt-4 sm:mt-8 text-center">
              {[
                (() => {
                  const lightest = [...mice].sort((a, b) => a.weight - b.weight)[0];
                  const mostPopular = [...mice].sort((a, b) => b.proUsage - a.proUsage)[0];
                  const highestPolling = Math.max(...mice.map(m => m.pollingRate));
                  const cheapest = [...mice].sort((a, b) => a.price - b.price)[0];
                  return [
                    { label: "Lightest Mouse", value: lightest.name, sub: `${lightest.weight}g`, color: "#f472b6", mouse: lightest },
                    { label: "Most Popular", value: mostPopular.name, sub: `${mostPopular.proUsage}% pro share`, color: "#00ff6a", mouse: mostPopular },
                    { label: "Highest Polling", value: `${(highestPolling/1000).toFixed(0)},000 Hz`, sub: `${mice.filter(m => m.pollingRate === highestPolling).length} mice`, color: "#00b4ff", mouse: mice.find(m => m.pollingRate === highestPolling) },
                    { label: "Most Affordable", value: cheapest.name, sub: `$${cheapest.price}`, color: "#ffd700", mouse: cheapest },
                  ];
                })()
              ].map((s, i) => (
                <div key={i} className="rounded-2xl p-5 text-center" style={{ background: `${s.color}06`, border: `1px solid ${s.color}15` }}>
                  <div className="text-sm uppercase tracking-widest opacity-30 mb-2">{s.label}</div>
                  <div className="text-sm font-black" style={{ color: s.color }}>{s.value}</div>
                  <div className="text-sm opacity-85 mt-1">{s.sub}</div>
                  {s.mouse && <a href={amazonLink(s.mouse.name)} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 mt-2 px-2 py-0.5 rounded text-xs font-bold no-underline hover:scale-105 transition-all" style={{ background: "#f59e0b15", color: "#f59e0b", textDecoration: "none", fontSize: 10 }}>{I.cart(9)} ${s.mouse.price}</a>}
                </div>
              ))}
            </div>

            {/* ── Brand Dominance Race ── */}
            <SectionTitle color="#e879f9" sub="How the top brands stack up across every major metric">Brand Performance Scorecard</SectionTitle>
            <div className="rounded-2xl overflow-hidden" style={{ border: "1px solid #ffffff08" }}>
              {(() => {
                const topBrandNames = ["Razer", "Logitech", "Zowie", "Vaxee", "Finalmouse", "Pulsar", "Lamzu"];
                const brandStats = topBrandNames.map(brand => {
                  const brandMice = mice.filter(m => m.brand === brand);
                  const guessBrand = (mouse) => {
                    const n = mouse.toLowerCase();
                    if (n.includes("razer") || n.includes("viper") || n.includes("deathadder") || n.includes("basilisk")) return "Razer";
                    if (n.includes("logitech") || n.includes("g pro") || n.includes("g502") || n.includes("g303") || n.includes("g203") || n.includes("gpro") || n.includes("g703")) return "Logitech";
                    if (n.includes("zowie") || n.startsWith("ec") || n.startsWith("fk") || n.startsWith("za") || n.startsWith("s2") || n.startsWith("u2")) return "Zowie";
                    if (n.includes("vaxee") || n.includes("zygen") || n.includes("np-01") || n.includes("outset")) return "Vaxee";
                    if (n.includes("finalmouse") || n.includes("ultralight") || n.includes("starlight")) return "Finalmouse";
                    if (n.includes("pulsar") || n.includes("xlite") || n.includes("x2")) return "Pulsar";
                    if (n.includes("lamzu") || n.includes("atlantis") || n.includes("maya")) return "Lamzu";
                    return null;
                  };
                  const brandPlayers = allPlayers.filter(p => {
                    const m = mice.find(mm => mm.name === p.mouse || p.mouse.includes(mm.name));
                    const detected = m ? m.brand : guessBrand(p.mouse);
                    return detected === brand;
                  });
                  const avgWeight = brandMice.length ? Math.round(brandMice.reduce((a, m) => a + m.weight, 0) / brandMice.length) : 0;
                  const avgPrice = brandMice.length ? Math.round(brandMice.reduce((a, m) => a + m.price, 0) / brandMice.length) : 0;
                  const maxPoll = brandMice.length ? Math.max(...brandMice.map(m => m.pollingRate)) : 0;
                  const proShare = Math.round(brandPlayers.length / allPlayers.length * 100);
                  const avgRating = brandMice.length ? (brandMice.reduce((a, m) => a + m.rating, 0) / brandMice.length).toFixed(1) : 0;
                  const mouseCount = brandMice.length;
                  return { brand, avgWeight, avgPrice, maxPoll, proShare, avgRating, mouseCount };
                });
                const headers = [
                  { label: "Brand", key: "brand" },
                  { label: "Models", key: "mouseCount" },
                  { label: "Pro Share", key: "proShare" },
                  { label: "Avg Weight", key: "avgWeight" },
                  { label: "Avg Price", key: "avgPrice" },
                  { label: "Max Poll", key: "maxPoll" },
                  { label: "Avg Rating", key: "avgRating" },
                ];
                const sorted = [...brandStats].sort((a, b) => {
                  const key = brandScoreSort.key;
                  const dir = brandScoreSort.dir === "asc" ? 1 : -1;
                  if (key === "brand") return dir * a.brand.localeCompare(b.brand);
                  if (key === "avgRating") return dir * (parseFloat(a[key]) - parseFloat(b[key]));
                  return dir * (a[key] - b[key]);
                });
                return (
                  <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr style={{ background: "#0a0a0a" }}>
                        {headers.map(h => (
                          <th key={h.label} className="px-4 py-3 text-sm uppercase tracking-widest font-bold text-left cursor-pointer select-none hover:opacity-80"
                            style={{ color: brandScoreSort.key === h.key ? "#e879f9" : "#ffffff50" }}
                            onClick={() => setBrandScoreSort(prev => prev.key === h.key ? { key: h.key, dir: prev.dir === "asc" ? "desc" : "asc" } : { key: h.key, dir: h.key === "brand" ? "asc" : "desc" })}>
                            {h.label}{brandScoreSort.key === h.key ? (brandScoreSort.dir === "asc" ? " ▲" : " ▼") : ""}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {sorted.map((b, i) => (
                        <tr key={b.brand} style={{ background: i % 2 === 0 ? "#050505" : "#080808", borderBottom: "1px solid #ffffff05" }}>
                          <td className="px-4 py-3 font-black" style={{ color: BRAND_COLORS[b.brand] }}>{b.brand}</td>
                          <td className="px-4 py-3 opacity-60">{b.mouseCount}</td>
                          <td className="px-4 py-3 font-bold" style={{ color: b.proShare >= 30 ? "#00ff6a" : b.proShare >= 10 ? "#d4af37" : "#ffffff60" }}>{b.proShare}%</td>
                          <td className="px-4 py-3 opacity-60">{b.avgWeight}g</td>
                          <td className="px-4 py-3 opacity-60">${b.avgPrice}</td>
                          <td className="px-4 py-3 opacity-60">{b.maxPoll >= 1000 ? `${b.maxPoll/1000}K` : b.maxPoll}Hz</td>
                          <td className="px-4 py-3 font-bold" style={{ color: b.avgRating >= 9 ? "#00ff6a" : b.avgRating >= 8.5 ? "#d4af37" : "#ffffff60" }}>{b.avgRating}/10</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  </div>
                );
              })()}
            </div>

            {/* ── Technology Adoption ── */}
            <SectionTitle color="#8b5cf6" sub="How quickly pros adopt new peripheral technology">Technology Adoption Snapshot</SectionTitle>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6">
              <div className="rounded-2xl p-6" style={{ background: "#0a0a0a", border: "1px solid #ffffff08" }}>
                <div className="text-sm font-bold mb-4 opacity-60">Polling Rate Tiers (Mice in DB)</div>
                {(() => {
                  const tiers = [
                    { label: "1KHz (Standard)", min: 0, max: 1500, color: "#ff4444" },
                    { label: "4KHz (High)", min: 1500, max: 5000, color: "#d4af37" },
                    { label: "8KHz (Ultra)", min: 5000, max: 99999, color: "#00ff6a" },
                  ];
                  return (
                    <div className="space-y-3">
                      {tiers.map((t, i) => {
                        const count = mice.filter(m => m.pollingRate >= t.min && m.pollingRate < t.max).length;
                        const pct = Math.round(count / mice.length * 100);
                        return (
                          <div key={i}>
                            <div className="flex justify-between text-sm mb-1">
                              <span className="font-bold" style={{ color: t.color }}>{t.label}</span>
                              <span className="opacity-50">{count} mice ({pct}%)</span>
                            </div>
                            <div className="h-3 rounded-full overflow-hidden" style={{ background: "#ffffff06" }}>
                              <div className="h-full rounded-full transition-all" style={{ width: `${pct}%`, background: `${t.color}60` }} />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  );
                })()}
              </div>

              <div className="rounded-2xl p-6" style={{ background: "#0a0a0a", border: "1px solid #ffffff08" }}>
                <div className="text-sm font-bold mb-4 opacity-60">Top Sensors by Mouse Count</div>
                {(() => {
                  const sensorCounts = {};
                  mice.forEach(m => { sensorCounts[m.sensor] = (sensorCounts[m.sensor] || 0) + 1; });
                  const top5 = Object.entries(sensorCounts).sort((a, b) => b[1] - a[1]).slice(0, 5);
                  const colors = ["#00ff6a", "#00b4ff", "#f472b6", "#d4af37", "#8b5cf6"];
                  return (
                    <div className="space-y-3">
                      {top5.map(([sensor, count], i) => (
                        <div key={sensor}>
                          <div className="flex justify-between text-sm mb-1">
                            <span className="font-bold" style={{ color: colors[i] }}>{sensor}</span>
                            <span className="opacity-50">{count} mice</span>
                          </div>
                          <div className="h-3 rounded-full overflow-hidden" style={{ background: "#ffffff06" }}>
                            <div className="h-full rounded-full" style={{ width: `${(count / top5[0][1]) * 100}%`, background: `${colors[i]}60` }} />
                          </div>
                        </div>
                      ))}
                    </div>
                  );
                })()}
              </div>

              <div className="rounded-2xl p-6" style={{ background: "#0a0a0a", border: "1px solid #ffffff08" }}>
                <div className="text-sm font-bold mb-4 opacity-60">Weight Class Distribution</div>
                {(() => {
                  const classes = [
                    { label: "Ultralight (< 45g)", min: 0, max: 45, color: "#00ff6a" },
                    { label: "Featherweight (45-55g)", min: 45, max: 55, color: "#06b6d4" },
                    { label: "Lightweight (55-65g)", min: 55, max: 65, color: "#00b4ff" },
                    { label: "Midweight (65-80g)", min: 65, max: 80, color: "#d4af37" },
                    { label: "Standard (80g+)", min: 80, max: 999, color: "#f472b6" },
                  ];
                  return (
                    <div className="space-y-3">
                      {classes.map((c, i) => {
                        const count = mice.filter(m => m.weight >= c.min && m.weight < c.max).length;
                        const pct = Math.round(count / mice.length * 100);
                        return (
                          <div key={i}>
                            <div className="flex justify-between text-sm mb-1">
                              <span className="font-bold" style={{ color: c.color }}>{c.label}</span>
                              <span className="opacity-50">{count} ({pct}%)</span>
                            </div>
                            <div className="h-3 rounded-full overflow-hidden" style={{ background: "#ffffff06" }}>
                              <div className="h-full rounded-full" style={{ width: `${pct}%`, background: `${c.color}60` }} />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  );
                })()}
              </div>
            </div>

            {/* ── eDPI by Game ── */}
            <SectionTitle color="#ff3c3c" sub="How sensitivity preferences vary across competitive titles">Average eDPI by Game</SectionTitle>
            <div className="rounded-2xl p-6" style={{ background: "#0a0a0a", border: "1px solid #ffffff08" }}>
              <ResponsiveContainer width="100%" height={320}>
                <BarChart data={gameBreakdown.filter(g => g.avgEdpi && g.players >= 10).map(g => ({
                  game: g.game,
                  avgEdpi: g.avgEdpi,
                  fill: { CS2: "#ff8c00", Valorant: "#ff4655", Apex: "#dc2626", "R6 Siege": "#4a86c8", "Overwatch 2": "#f99e1a", "Marvel Rivals": "#ed1d24", Deadlock: "#8b5cf6", "Call of Duty": "#5cb85c", "Quake Champions": "#ce4a00" }[g.game] || "#888"
                }))} margin={{ top: 10, right: 30, left: 0, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#ffffff08" />
                  <XAxis dataKey="game" tick={{ fill: "#ffffff40", fontSize: 13 }} />
                  <YAxis tick={{ fill: "#ffffff40", fontSize: 13 }} />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="avgEdpi" name="Avg eDPI" radius={[6, 6, 0, 0]}>
                    {gameBreakdown.filter(g => g.avgEdpi && g.players >= 10).map((g, i) => (
                      <Cell key={i} fill={{ CS2: "#ff8c00", Valorant: "#ff4655", Apex: "#dc2626", "R6 Siege": "#4a86c8", "Overwatch 2": "#f99e1a", "Marvel Rivals": "#ed1d24", Deadlock: "#8b5cf6", "Call of Duty": "#5cb85c", "Quake Champions": "#ce4a00" }[g.game] || "#888"} fillOpacity={0.6} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
              <div className="text-sm text-center opacity-25 mt-2">Games with fewer than 10 tracked players or no eDPI data excluded</div>
            </div>
          </div>
        )}

        {/* ── SENSORS TAB ── */}
        {activeTab === "sensors" && (() => {
          const sensorData = mice.map(m => ({
            sensor: m.sensor,
            brand: m.brand,
            name: m.name,
            dpi: m.dpi,
            pollingRate: m.pollingRate,
            weight: m.weight,
            proUsage: m.proUsage,
            price: m.price,
          }));
          // Build sensor profiles
          const sensorMap = {};
          mice.forEach(m => {
            if (!sensorMap[m.sensor]) sensorMap[m.sensor] = { sensor: m.sensor, mice: [], totalUsage: 0, avgDpi: 0, avgPolling: 0, avgWeight: 0, avgPrice: 0, brands: new Set() };
            sensorMap[m.sensor].mice.push(m);
            sensorMap[m.sensor].totalUsage += m.proUsage;
            sensorMap[m.sensor].brands.add(m.brand);
          });
          const sensorProfiles = Object.values(sensorMap).map(s => {
            const sensorMouseNames = s.mice.map(m => m.name);
            const playerCount = allPlayers.filter(p => p.mouse && sensorMouseNames.some(mn => p.mouse === mn || p.mouse.includes(mn.split(" ").slice(-2).join(" ")))).length;
            return {
            ...s,
            mouseCount: s.mice.length,
            playerCount,
            avgDpi: Math.round(s.mice.reduce((a, m) => a + m.dpi, 0) / s.mice.length),
            avgPolling: Math.round(s.mice.reduce((a, m) => a + m.pollingRate, 0) / s.mice.length),
            avgWeight: Math.round(s.mice.reduce((a, m) => a + m.weight, 0) / s.mice.length * 10) / 10,
            avgPrice: Math.round(s.mice.reduce((a, m) => a + m.price, 0) / s.mice.length),
            brandList: [...s.brands].join(", "),
            topMouse: s.mice.sort((a, b) => b.proUsage - a.proUsage)[0]?.name || "",
          }});

          // Sensor usage by game
          const gameColors = GAME_COLORS;
          const allGamesForSensor = ["All", ...new Set(allPlayers.map(p => p.game))];
          const sensorByGame = {};
          allPlayers.forEach(p => {
            const m = mice.find(mm => mm.name === p.mouse);
            if (!m) return;
            const game = p.game;
            if (!sensorByGame[game]) sensorByGame[game] = {};
            sensorByGame[game][m.sensor] = (sensorByGame[game][m.sensor] || 0) + 1;
          });

          // Sort sensor profiles
          const sortedSensors = [...sensorProfiles].sort((a, b) => {
            if (!sensorSort.key) return 0;
            const k = sensorSort.key;
            let av = a[k], bv = b[k];
            if (typeof av === "string") return sensorSort.dir === "asc" ? av.localeCompare(bv) : bv.localeCompare(av);
            return sensorSort.dir === "asc" ? (av || 0) - (bv || 0) : (bv || 0) - (av || 0);
          });

          const sensorHeaders = [
            { key: "sensor", label: "Sensor" },
            { key: "mouseCount", label: "Mice" },
            { key: "totalUsage", label: "Pro Usage %" },
            { key: "brandList", label: "Brands" },
            { key: "topMouse", label: "Top Mouse" },
            { key: "avgDpi", label: "Avg DPI" },
            { key: "avgPolling", label: "Avg Poll" },
            { key: "avgWeight", label: "Avg Weight" },
            { key: "avgPrice", label: "Avg Price" },
          ];

          // Overall top sensor
          const topSensor = sensorProfiles.sort((a, b) => b.totalUsage - a.totalUsage)[0];

          return (
          <div>
            <SectionTitle color="#10b981" sub="Comprehensive breakdown of every sensor powering pro esports mice">Mouse Sensor Analytics</SectionTitle>

            {/* Top sensor highlight */}
            <div className="rounded-2xl p-4 mb-4" style={{ background: "#10b98108", border: "1px solid #10b98115" }}>
              <div className="flex items-center gap-4">
                <img loading="lazy" src="/images/mice/focus-pro-35k.png" alt="Focus Pro 35K" className="h-10 object-contain" style={{ filter: "drop-shadow(0 4px 12px rgba(16,185,129,0.3))" }} />
                <div>
                  <div className="text-base font-black uppercase tracking-widest" style={{ color: "#10b981", textShadow: "0 0 20px #10b98140" }}>Most Popular Sensor in Esports</div>
                  <div className="text-xl font-black" style={{ color: "#10b981" }}>{topSensor?.sensor}</div>
                  <div className="text-sm opacity-85">Powering the Viper V3 Pro, DeathAdder V3, and more — the sensor behind the most tournament wins in 2024-2025</div>
                </div>
              </div>
            </div>

            {/* Sensor overview cards */}
            <div className="grid grid-cols-2 gap-2 sm:gap-3 mb-4 sm:mb-6">
              {sensorProfiles.sort((a, b) => b.totalUsage - a.totalUsage).slice(0, 4).map((s, i) => {
                const colors = ["#10b981", "#00b4ff", "#f59e0b", "#ef4444"];
                const sensorImageMap = {
                  "PAW3395": "/images/sensors/paw3395.png",
                  "PAW3950": "/images/sensors/paw3950.png",
                  "PAW3370": "/images/sensors/paw3370.png",
                  "Focus Pro 35K": "/images/sensors/focus-pro-35k.png",
                  "HERO 2": "/images/sensors/hero-2.png",
                  "PAW3399": "/images/sensors/paw3399.png",
                  "OWL Eye": "/images/sensors/owl-eye.png",
                  "HERO 25K": "/images/sensors/hero-25k.png",
                };
                const sensorDescs = {
                  "Focus Pro 35K": "Razer's flagship optical sensor co-developed with PixArt, powering the Viper V3 Pro and DeathAdder V3 Pro. It tracks at 35,000 DPI with zero smoothing or acceleration, and supports native 8KHz polling — a first for any production sensor at launch. Its asymmetric cut-off distance lets pros tune lift-off independently from landing, a feature competitive players swear by. The Focus Pro 35K is the sensor that dethroned Logitech's HERO dominance and redefined what pros expect from tracking hardware.",
                  "HERO 2": "Logitech's second-generation in-house sensor, designed from the ground up at their Swiss R&D lab. HERO 2 powers the G Pro X Superlight 2 and Superstrike, delivering 44,000 DPI with sub-micron precision and roughly 10x the power efficiency of its predecessor. It introduced frame-rate-aware tracking that dynamically adjusts processing to match your monitor's refresh rate. Paired with Lightspeed wireless, it's the sensor behind more major tournament wins than any other in 2023-2024.",
                  "HERO 25K": "The original HERO sensor that launched Logitech's four-year reign over professional esports. Found in the legendary G Pro X Superlight, it delivered 25,600 DPI with zero smoothing, filtering, or acceleration — a marketing claim Logitech backed with an open invitation for independent lab testing. Its power efficiency was so extreme it enabled the Superlight's 70-hour battery life at just 63 grams. Though now succeeded by HERO 2, it still commands significant pro usage from players who refuse to abandon the original Superlight's feel.",
                  "PAW3395": "PixArt's workhorse sensor that democratized flagship-tier tracking for the entire industry. At 26,000 DPI with 650 IPS max tracking speed, it brought near-identical real-world performance to every mid-range and premium mouse outside the Razer/Logitech ecosystem. Zowie, Vaxee, Pulsar, Lamzu, and dozens of others built their wireless lineups around this chip. The PAW3395 proved that sensor technology had reached a plateau where the differences between \"good\" and \"best\" were imperceptible to human reflexes, shifting the competitive advantage back to shape and weight.",
                };
                const sensorImg = sensorImageMap[s.sensor];
                const sensorDesc = sensorDescs[s.sensor];
                return (
                  <div key={i} className="rounded-xl p-4" style={{ background: `${colors[i]}08`, border: `1px solid ${colors[i]}12` }}>
                    <div className="text-sm font-black mb-1 text-center" style={{ color: colors[i], textShadow: `0 0 12px ${colors[i]}40` }}>#{i + 1} Most Used</div>
                    <div className="text-sm font-black mb-2 text-center" style={{ color: colors[i] }}>{s.sensor}</div>
                    {sensorImg && <div className="flex justify-center mb-2"><img loading="lazy" src={sensorImg} alt={s.sensor} className="h-24 sm:h-32 object-contain" style={{ filter: `drop-shadow(0 4px 12px ${colors[i]}30)` }} /></div>}
                    <div className="text-xl sm:text-2xl font-black text-center">{s.totalUsage}%</div>
                    <div className="text-sm opacity-30 text-center mt-1">of pros use this sensor</div>
                    {sensorDesc && <p className="text-sm opacity-70 mt-3 leading-relaxed">{sensorDesc}</p>}
                    <div className="text-sm opacity-85 mt-3">{s.mouseCount} mice use this sensor:</div>
                    <div className="flex flex-wrap gap-1.5 mt-1.5">
                      {s.mice.map(m => (
                        <button key={m.id} onClick={() => { navigateToMouse(m); }}
                          className="px-2 py-1 rounded-md text-sm transition-all hover:scale-105 cursor-pointer"
                          style={{ background: `${colors[i]}15`, border: `1px solid ${colors[i]}20`, color: colors[i], fontSize: 12 }}>
                          {m.name.replace(m.brand + " ", "")}
                        </button>
                      ))}
                    </div>
                    <div className="text-sm font-bold mt-1.5" style={{ color: colors[i] }}>{s.playerCount} pro players</div>
                  </div>
                );
              })}
            </div>

            {/* ── Sensor Popularity Stats (from actual player data) ── */}
            {(() => {
              // Count sensor usage across ALL tracked players (not just mouse DB proUsage)
              const sensorCounts = {};
              let totalMatched = 0;
              allPlayers.forEach(p => {
                if (!p.mouse) return;
                const m = mice.find(mm => {
                  const mn = mm.name.toLowerCase();
                  const pm = p.mouse.toLowerCase();
                  return pm === mn || pm.includes(mn) || mn.includes(pm);
                });
                if (m) {
                  sensorCounts[m.sensor] = (sensorCounts[m.sensor] || 0) + 1;
                  totalMatched++;
                }
              });
              const sortedSensorStats = Object.entries(sensorCounts).sort((a, b) => b[1] - a[1]);
              const top10 = sortedSensorStats.slice(0, 10);
              const maxCount = top10[0]?.[1] || 1;

              // Sensor by game breakdown for top 5 sensors
              const topSensorNames = top10.slice(0, 5).map(s => s[0]);
              const sensorGameBreakdown = {};
              topSensorNames.forEach(sn => { sensorGameBreakdown[sn] = {}; });
              allPlayers.forEach(p => {
                if (!p.mouse) return;
                const m = mice.find(mm => {
                  const mn = mm.name.toLowerCase();
                  const pm = p.mouse.toLowerCase();
                  return pm === mn || pm.includes(mn) || mn.includes(pm);
                });
                if (m && topSensorNames.includes(m.sensor)) {
                  sensorGameBreakdown[m.sensor][p.game] = (sensorGameBreakdown[m.sensor][p.game] || 0) + 1;
                }
              });

              // Unique stats
              const uniqueSensors = Object.keys(sensorCounts).length;
              const topSensorPct = totalMatched > 0 ? Math.round(top10[0][1] / totalMatched * 100) : 0;
              const top3Pct = totalMatched > 0 ? Math.round(top10.slice(0, 3).reduce((a, s) => a + s[1], 0) / totalMatched * 100) : 0;

              const barColors = ["#10b981", "#00b4ff", "#f59e0b", "#ef4444", "#a78bfa", "#f472b6", "#06b6d4", "#84cc16", "#d4af37", "#8b5cf6"];
              const gameBarColors = { CS2: "#ff8c00", Valorant: "#ff4655", LoL: "#c89b3c", Fortnite: "#4c7bd9", "Dota 2": "#e74c3c", "R6 Siege": "#4a86c8", Apex: "#dc2626", PUBG: "#f2a900", "Overwatch 2": "#f99e1a", "Call of Duty": "#5cb85c", "Marvel Rivals": "#ed1d24", Deadlock: "#8b5cf6", "Quake Champions": "#ce4a00" };

              return (
                <div className="rounded-2xl p-5 mb-6" style={{ background: "#ffffff03", border: "1px solid #ffffff08" }}>
                  <div className="text-sm uppercase tracking-widest opacity-70 mb-4 font-bold text-center sm:text-left">Sensor Popularity Across {totalMatched.toLocaleString()} Matched Pro Players</div>

                  {/* Summary stat pills */}
                  <div className="flex flex-wrap gap-2 mb-5 justify-center sm:justify-start">
                    <div className="rounded-lg px-3 py-2" style={{ background: "#10b98110" }}>
                      <span className="text-sm opacity-85">Top sensor: </span>
                      <span className="text-sm font-black" style={{ color: "#10b981" }}>{top10[0]?.[0]} ({topSensorPct}%)</span>
                    </div>
                    <div className="rounded-lg px-3 py-2" style={{ background: "#00b4ff10" }}>
                      <span className="text-sm opacity-85">Top 3 concentration: </span>
                      <span className="text-sm font-black" style={{ color: "#00b4ff" }}>{top3Pct}%</span>
                    </div>
                    <div className="rounded-lg px-3 py-2" style={{ background: "#f59e0b10" }}>
                      <span className="text-sm opacity-85">Unique sensors tracked: </span>
                      <span className="text-sm font-black" style={{ color: "#f59e0b" }}>{uniqueSensors}</span>
                    </div>
                    <div className="rounded-lg px-3 py-2" style={{ background: "#a78bfa10" }}>
                      <span className="text-sm opacity-85">Players on proprietary sensors: </span>
                      <span className="text-sm font-black" style={{ color: "#a78bfa" }}>{sensorCounts["Custom"] || sensorCounts["Custom Sony"] || 0}</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-5">
                    {/* Left: Bar chart */}
                    <div>
                      <div className="text-sm opacity-30 mb-3 font-bold uppercase tracking-wider">Top 10 Sensors by Player Count</div>
                      <div className="space-y-2">
                        {top10.map(([sensor, count], i) => {
                          const pct = Math.round(count / totalMatched * 100);
                          const barW = Math.max(count / maxCount * 100, 4);
                          return (
                            <div key={sensor} className="flex items-center gap-2">
                              <div className="text-sm font-bold w-20 sm:w-32 truncate cursor-pointer hover:underline" style={{ color: barColors[i] }}
                                onClick={() => document.getElementById(`sensor-group-${sensor.replace(/\s+/g, "-").toLowerCase()}`)?.scrollIntoView({ behavior: "smooth", block: "start" })}>{sensor}</div>
                              <div className="flex-1 h-6 rounded-md overflow-hidden" style={{ background: "#ffffff06" }}>
                                <div className="h-full rounded-md flex items-center px-2 transition-all" style={{ width: `${barW}%`, background: `${barColors[i]}25`, borderRight: `2px solid ${barColors[i]}` }}>
                                  <span className="text-sm font-black" style={{ color: barColors[i] }}>{count}</span>
                                </div>
                              </div>
                              <div className="text-sm opacity-30 w-10 text-right">{pct}%</div>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* Right: Game breakdown for top 5 sensors */}
                    <div>
                      <div className="text-sm opacity-30 mb-3 font-bold uppercase tracking-wider">Top 5 Sensors — Game Distribution</div>
                      <div className="space-y-3">
                        {topSensorNames.map((sn, si) => {
                          const games = Object.entries(sensorGameBreakdown[sn]).sort((a, b) => b[1] - a[1]);
                          const total = games.reduce((a, g) => a + g[1], 0);
                          return (
                            <div key={sn}>
                              <div className="flex items-center gap-2 mb-1">
                                <span className="text-base font-black cursor-pointer hover:underline transition-all" style={{ color: barColors[si] }}
                                  onClick={() => document.getElementById(`sensor-group-${sn.replace(/\s+/g, "-").toLowerCase()}`)?.scrollIntoView({ behavior: "smooth", block: "start" })}>{sn}</span>
                                <span className="text-base opacity-20">({total} players)</span>
                              </div>
                              {/* Stacked bar */}
                              <div className="flex h-6 rounded-md overflow-hidden" style={{ background: "#ffffff06" }}>
                                {games.map(([game, cnt]) => {
                                  const w = Math.max(cnt / total * 100, 2);
                                  return (
                                    <div key={game} className="h-full flex items-center justify-center relative group" style={{ width: `${w}%`, background: `${gameBarColors[game] || "#666"}40` }}
                                      title={`${game}: ${cnt} players (${Math.round(cnt/total*100)}%)`}>
                                      {w > 8 && <span style={{ fontSize: 12 }} className="font-bold opacity-70">{game}</span>}
                                    </div>
                                  );
                                })}
                              </div>
                              {/* Legend */}
                              <div className="flex flex-wrap gap-x-3 gap-y-0.5 mt-1">
                                {games.slice(0, 5).map(([game, cnt]) => (
                                  <span key={game} style={{ fontSize: 12 }} className="opacity-85">
                                    <span style={{ color: gameBarColors[game] || "#666" }}>●</span> {game} {Math.round(cnt/total*100)}%
                                  </span>
                                ))}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })()}

            {/* Sensor table */}
            <div className="text-sm uppercase tracking-widest opacity-70 mb-3 mt-8">All Sensors  -  Click Headers to Sort</div>
            <div className="overflow-x-auto rounded-2xl mb-8" style={{ border: "1px solid #ffffff08" }}>
              <table className="w-full text-sm">
                <thead>
                  <tr style={{ background: "#0a0a0a" }}>
                    {sensorHeaders.map(h => (
                      <th key={h.label} className="px-4 py-3 text-left text-sm uppercase tracking-wider font-bold cursor-pointer select-none hover:opacity-80"
                        style={{ color: sensorSort.key === h.key ? "#10b981" : "#ffffff30" }}
                        onClick={() => setSensorSort(prev => prev.key === h.key ? { key: h.key, dir: prev.dir === "asc" ? "desc" : "asc" } : { key: h.key, dir: typeof sensorProfiles[0]?.[h.key] === "string" ? "asc" : "desc" })}>
                        {h.label}{sensorSort.key === h.key ? (sensorSort.dir === "asc" ? " ▲" : " ▼") : ""}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {sortedSensors.map((s, i) => (
                    <tr key={s.sensor} style={{ borderBottom: "1px solid #ffffff05", background: i % 2 === 0 ? "#050505" : "#080808" }}
                      onMouseEnter={e => e.currentTarget.style.background = "#10b98108"}
                      onMouseLeave={e => e.currentTarget.style.background = i % 2 === 0 ? "#050505" : "#080808"}>
                      <td className="px-4 py-3 font-black cursor-pointer hover:underline" style={{ color: "#10b981" }}
                        onClick={() => document.getElementById(`sensor-group-${s.sensor.replace(/\s+/g, "-").toLowerCase()}`)?.scrollIntoView({ behavior: "smooth", block: "start" })}>{s.sensor}</td>
                      <td className="px-4 py-3 font-bold">{s.mouseCount}</td>
                      <td className="px-4 py-3 font-black">{s.totalUsage}%</td>
                      <td className="px-4 py-3 text-sm opacity-50">{s.brandList}</td>
                      <td className="px-4 py-3 text-sm"><a href={amazonLink(s.topMouse)} target="_blank" rel="noopener noreferrer" className="no-underline hover:opacity-80" style={{ color: "#f59e0b", textDecoration: "none" }}>{s.topMouse.replace(/(Logitech |Razer )/, "")}</a></td>
                      <td className="px-4 py-3">{s.avgDpi >= 1000 ? `${(s.avgDpi/1000).toFixed(0)}K` : s.avgDpi}</td>
                      <td className="px-4 py-3">{s.avgPolling >= 1000 ? `${(s.avgPolling/1000).toFixed(1)}K` : s.avgPolling}Hz</td>
                      <td className="px-4 py-3">{s.avgWeight}g</td>
                      <td className="px-4 py-3">{"$"}{s.avgPrice}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Which mice use each sensor */}
            <SectionTitle color="#00b4ff" sub="Every mouse in our database grouped by sensor">Mice by Sensor</SectionTitle>
            <div className="space-y-4 mb-8">
              {sensorProfiles.sort((a, b) => b.totalUsage - a.totalUsage).map((s, si) => (
                <div key={s.sensor} id={`sensor-group-${s.sensor.replace(/\s+/g, "-").toLowerCase()}`} className="rounded-xl p-4" style={{ background: "#0a0a0a", border: "1px solid #ffffff08", scrollMarginTop: 70 }}>
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="text-sm font-black" style={{ color: "#10b981" }}>{s.sensor}</div>
                      <div className="text-sm opacity-70">{s.totalUsage}% pro usage</div>
                    </div>
                    <div className="text-sm opacity-70">{s.mouseCount} model{s.mouseCount !== 1 ? "s" : ""}</div>
                  </div>
                  {s.mice.length > 0 && (() => { const topM = s.mice.sort((a, b) => b.proUsage - a.proUsage)[0]; return (
                    <a href={amazonLink(topM.name)} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 mb-3 px-3 py-1 rounded-lg text-xs font-bold transition-all hover:scale-105 no-underline" style={{ background: "#f59e0b12", color: "#f59e0b", border: "1px solid #f59e0b18", textDecoration: "none" }}>
                      {I.cart(10)} Top pick: {topM.name.replace(/(Logitech |Razer )/, "")} — ${topM.price}
                    </a>
                  ); })()}
                  <div className="flex flex-wrap gap-2">
                    {s.mice.sort((a, b) => b.proUsage - a.proUsage).map((m, mi) => (
                      <button key={mi} onClick={() => { navigateToMouse(m); }}
                        className="px-3 py-1.5 rounded-lg text-sm font-bold cursor-pointer transition-all hover:scale-105"
                        style={{ background: `${BRAND_COLORS[m.brand]}12`, border: `1px solid ${BRAND_COLORS[m.brand]}20`, color: BRAND_COLORS[m.brand] }}>
                        {MOUSE_IMAGE_URLS[m.name] && <img loading="lazy" src={MOUSE_IMAGE_URLS[m.name]} alt={`${m.name}`} className="inline h-4 mr-1 object-contain" />} {m.name} <span className="opacity-85">({m.proUsage}%)</span>
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Sensor popularity by game */}
            <SectionTitle color="#f59e0b" sub="Which sensors dominate in each esports title">Sensor Popularity by Game</SectionTitle>
            <div className="flex flex-wrap gap-1.5 mb-4">
              {allGamesForSensor.map(g => (
                <button key={g} onClick={() => setSensorGameFilter(g)}
                  className="px-3 py-1 rounded-full text-sm font-bold transition-all flex items-center gap-1.5"
                  style={{
                    background: sensorGameFilter === g ? (gameColors[g] || "#10b981") : "#ffffff06",
                    color: sensorGameFilter === g ? "#000" : "#ffffffaa",
                    border: sensorGameFilter === g ? "none" : "1px solid #ffffff08",
                  }}>
                  {g !== "All" && GAME_IMAGE_URLS[g] && <img loading="lazy" src={GAME_IMAGE_URLS[g]} alt={g} className="w-4 h-4 object-contain" />}
                  {g}
                </button>
              ))}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {(sensorGameFilter === "All" ? Object.keys(sensorByGame) : [sensorGameFilter]).filter(g => sensorByGame[g]).map(game => {
                const gc = gameColors[game] || "#888";
                const entries = Object.entries(sensorByGame[game]).sort((a, b) => b[1] - a[1]);
                const total = entries.reduce((a, e) => a + e[1], 0);
                return (
                  <div key={game} className="rounded-xl p-4" style={{ background: `${gc}06`, border: `1px solid ${gc}12` }}>
                    <div className="text-sm font-black mb-3 flex items-center gap-2" style={{ color: gc }}>{GAME_IMAGE_URLS[game] && <img loading="lazy" src={GAME_IMAGE_URLS[game]} alt={game} className="w-5 h-5 object-contain" />}{game}</div>
                    <div className="space-y-2">
                      {entries.slice(0, 5).map(([sensor, count], ei) => (
                        <div key={sensor} className="flex items-center gap-2">
                          <div className="w-28 text-sm font-bold truncate" style={{ color: ei === 0 ? gc : "#ffffff60" }}>{sensor}</div>
                          <div className="flex-1 h-3 rounded-full overflow-hidden" style={{ background: "#ffffff06" }}>
                            <div className="h-full rounded-full transition-all duration-700" style={{ width: `${(count / entries[0][1]) * 100}%`, background: ei === 0 ? gc : `${gc}40` }} />
                          </div>
                          <div className="text-sm font-bold w-12 text-right" style={{ color: ei === 0 ? gc : "#ffffff40" }}>{Math.round((count / total) * 100)}%</div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Sensor specs comparison */}
            <SectionTitle color="#c084fc" sub="Technical specifications compared across all sensors">Sensor Spec Comparison</SectionTitle>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="rounded-xl p-5" style={{ background: "#0a0a0a", border: "1px solid #ffffff08" }}>
                <div className="text-sm uppercase tracking-widest opacity-30 mb-4">Max DPI by Sensor</div>
                <div className="space-y-2">
                  {sensorProfiles.sort((a, b) => b.avgDpi - a.avgDpi).map((s, i) => (
                    <div key={s.sensor} className="flex items-center gap-2">
                      <div className="w-28 text-sm font-bold truncate">{s.sensor}</div>
                      <div className="flex-1 h-4 rounded-full overflow-hidden" style={{ background: "#ffffff06" }}>
                        <div className="h-full rounded-full flex items-center justify-end pr-2 transition-all duration-700"
                          style={{ width: `${(s.avgDpi / 44000) * 100}%`, background: i === 0 ? "#c084fc30" : "#ffffff08" }}>
                          <span className="text-sm font-bold" style={{ color: i === 0 ? "#c084fc" : "#ffffff40", fontSize: 11 }}>{s.avgDpi >= 1000 ? `${(s.avgDpi/1000).toFixed(0)}K` : s.avgDpi}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="rounded-xl p-5" style={{ background: "#0a0a0a", border: "1px solid #ffffff08" }}>
                <div className="text-sm uppercase tracking-widest opacity-30 mb-4">Avg Polling Rate by Sensor</div>
                <div className="space-y-2">
                  {sensorProfiles.sort((a, b) => b.avgPolling - a.avgPolling).map((s, i) => (
                    <div key={s.sensor} className="flex items-center gap-2">
                      <div className="w-28 text-sm font-bold truncate">{s.sensor}</div>
                      <div className="flex-1 h-4 rounded-full overflow-hidden" style={{ background: "#ffffff06" }}>
                        <div className="h-full rounded-full flex items-center justify-end pr-2 transition-all duration-700"
                          style={{ width: `${(s.avgPolling / 8000) * 100}%`, background: i === 0 ? "#10b98130" : "#ffffff08" }}>
                          <span className="text-sm font-bold" style={{ color: i === 0 ? "#10b981" : "#ffffff40", fontSize: 11 }}>{s.avgPolling >= 1000 ? `${(s.avgPolling/1000).toFixed(1)}K` : s.avgPolling}Hz</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Sensor Comparison Tool */}
            <SectionTitle color="#f59e0b" sub="Select two sensors to compare specs, usage, and popularity head-to-head">Sensor vs Sensor Comparison</SectionTitle>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div>
                <div className="text-sm uppercase tracking-widest opacity-30 mb-2">Sensor A</div>
                <select aria-label="Select first sensor to compare" value={compareSensor1 || ""} onChange={e => setCompareSensor1(e.target.value || null)}
                  className="w-full px-4 py-3 rounded-xl text-sm cursor-pointer font-bold"
                  style={{ background: "#0a0a0a", border: `1px solid ${compareSensor1 ? "#f59e0b30" : "#ffffff15"}`, color: compareSensor1 ? "#f59e0b" : "#fff" }}>
                  <option value="">Select sensor...</option>
                  {sensorProfiles.sort((a, b) => b.totalUsage - a.totalUsage).map(s => (
                    <option key={s.sensor} value={s.sensor}>{s.sensor} ({s.totalUsage}% usage)</option>
                  ))}
                </select>
              </div>
              <div>
                <div className="text-sm uppercase tracking-widest opacity-30 mb-2">Sensor B</div>
                <select aria-label="Select second sensor to compare" value={compareSensor2 || ""} onChange={e => setCompareSensor2(e.target.value || null)}
                  className="w-full px-4 py-3 rounded-xl text-sm cursor-pointer font-bold"
                  style={{ background: "#0a0a0a", border: `1px solid ${compareSensor2 ? "#00b4ff30" : "#ffffff15"}`, color: compareSensor2 ? "#00b4ff" : "#fff" }}>
                  <option value="">Select sensor...</option>
                  {sensorProfiles.sort((a, b) => b.totalUsage - a.totalUsage).map(s => (
                    <option key={s.sensor} value={s.sensor}>{s.sensor} ({s.totalUsage}% usage)</option>
                  ))}
                </select>
              </div>
            </div>

            {compareSensor1 && compareSensor2 ? (() => {
              const s1 = sensorProfiles.find(s => s.sensor === compareSensor1);
              const s2 = sensorProfiles.find(s => s.sensor === compareSensor2);
              if (!s1 || !s2) return null;
              const c1 = "#f59e0b", c2 = "#00b4ff";
              const compareRows = [
                { label: "Pro Usage", v1: `${s1.totalUsage}%`, v2: `${s2.totalUsage}%`, n1: s1.totalUsage, n2: s2.totalUsage, higher: "more" },
                { label: "Mouse Models", v1: s1.mouseCount, v2: s2.mouseCount, n1: s1.mouseCount, n2: s2.mouseCount, higher: "more" },
                { label: "Avg DPI", v1: s1.avgDpi >= 1000 ? `${(s1.avgDpi/1000).toFixed(0)}K` : s1.avgDpi, v2: s2.avgDpi >= 1000 ? `${(s2.avgDpi/1000).toFixed(0)}K` : s2.avgDpi, n1: s1.avgDpi, n2: s2.avgDpi, higher: "more" },
                { label: "Avg Poll Rate", v1: `${s1.avgPolling >= 1000 ? `${(s1.avgPolling/1000).toFixed(1)}K` : s1.avgPolling}Hz`, v2: `${s2.avgPolling >= 1000 ? `${(s2.avgPolling/1000).toFixed(1)}K` : s2.avgPolling}Hz`, n1: s1.avgPolling, n2: s2.avgPolling, higher: "more" },
                { label: "Avg Weight", v1: `${s1.avgWeight}g`, v2: `${s2.avgWeight}g`, n1: s1.avgWeight, n2: s2.avgWeight, higher: "less" },
                { label: "Avg Price", v1: `$${s1.avgPrice}`, v2: `$${s2.avgPrice}`, n1: s1.avgPrice, n2: s2.avgPrice, higher: "less" },
                { label: "Brands", v1: s1.brandList, v2: s2.brandList, n1: 0, n2: 0, higher: "none" },
                { label: "Top Mouse", v1: s1.topMouse, v2: s2.topMouse, n1: 0, n2: 0, higher: "none" },
              ];
              const s1Wins = compareRows.filter(r => r.higher !== "none" && ((r.higher === "more" && r.n1 > r.n2) || (r.higher === "less" && r.n1 < r.n2))).length;
              const s2Wins = compareRows.filter(r => r.higher !== "none" && ((r.higher === "more" && r.n2 > r.n1) || (r.higher === "less" && r.n2 < r.n1))).length;
              return (
                <div className="rounded-2xl overflow-hidden" style={{ border: "1px solid #ffffff08" }}>
                  <div className="grid grid-cols-3" style={{ background: "#0a0a0a" }}>
                    <div className="p-4 text-center">
                      <div className="text-base sm:text-lg font-black text-center sm:text-left" style={{ color: c1 }}>{s1.sensor}</div>
                      <div className="text-sm opacity-30">{s1.brandList}</div>
                      <div className="text-2xl font-black mt-1" style={{ color: s1Wins > s2Wins ? c1 : "#ffffff20" }}>{s1Wins}</div>
                      <div className="text-sm opacity-20">wins</div>
                    </div>
                    <div className="p-4 flex flex-col items-center justify-center">
                      <div className="text-xl font-black opacity-20">VS</div>
                    </div>
                    <div className="p-4 text-center">
                      <div className="text-base sm:text-lg font-black text-center sm:text-left" style={{ color: c2 }}>{s2.sensor}</div>
                      <div className="text-sm opacity-30">{s2.brandList}</div>
                      <div className="text-2xl font-black mt-1" style={{ color: s2Wins > s1Wins ? c2 : "#ffffff20" }}>{s2Wins}</div>
                      <div className="text-sm opacity-20">wins</div>
                    </div>
                  </div>
                  {compareRows.map((row, ri) => {
                    const winner = row.higher === "none" ? "none" : row.higher === "more" ? (row.n1 > row.n2 ? "s1" : row.n2 > row.n1 ? "s2" : "tie") : (row.n1 < row.n2 ? "s1" : row.n2 < row.n1 ? "s2" : "tie");
                    return (
                      <div key={ri} className="grid grid-cols-3" style={{ background: ri % 2 === 0 ? "#050505" : "#080808", borderTop: "1px solid #ffffff05" }}>
                        <div className="p-3 text-center">
                          <span className="text-sm font-bold" style={{ color: winner === "s1" ? c1 : "#ffffff60" }}>{row.v1}</span>
                          {winner === "s1" && <span className="ml-1 text-sm" style={{ color: c1 }}><svg width="12" height="12" viewBox="0 0 24 24" fill="none"><path d="M20 6L9 17l-5-5" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/></svg></span>}
                        </div>
                        <div className="p-3 text-center">
                          <span className="text-sm uppercase tracking-wider opacity-30">{row.label}</span>
                          {row.higher !== "none" && row.n1 !== row.n2 && (
                            <div className="flex items-center gap-1 justify-center mt-1">
                              <div className="h-1.5 rounded-full" style={{ width: `${Math.min((row.n1 / Math.max(row.n1, row.n2)) * 40, 40)}px`, background: winner === "s1" ? c1 : `${c1}40` }} />
                              <div className="h-1.5 rounded-full" style={{ width: `${Math.min((row.n2 / Math.max(row.n1, row.n2)) * 40, 40)}px`, background: winner === "s2" ? c2 : `${c2}40` }} />
                            </div>
                          )}
                        </div>
                        <div className="p-3 text-center">
                          {winner === "s2" && <span className="mr-1 text-sm" style={{ color: c2 }}><svg width="12" height="12" viewBox="0 0 24 24" fill="none"><path d="M20 6L9 17l-5-5" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/></svg></span>}
                          <span className="text-sm font-bold" style={{ color: winner === "s2" ? c2 : "#ffffff60" }}>{row.v2}</span>
                        </div>
                      </div>
                    );
                  })}
                  <div className="grid grid-cols-2" style={{ background: "#0a0a0a", borderTop: "1px solid #ffffff08" }}>
                    <div className="p-4">
                      <div className="text-sm uppercase tracking-widest opacity-20 mb-2">Mice with {s1.sensor}</div>
                      <div className="flex flex-wrap gap-1.5">
                        {s1.mice.sort((a, b) => b.proUsage - a.proUsage).map((m, mi) => (
                          <button key={mi} onClick={() => { navigateToMouse(m); }}
                            className="px-2 py-1 rounded text-sm font-bold cursor-pointer transition-all hover:scale-105"
                            style={{ background: `${c1}12`, color: c1 }}>{MOUSE_IMAGE_URLS[m.name] && <img loading="lazy" src={MOUSE_IMAGE_URLS[m.name]} alt={`${m.name}`} className="inline h-4 mr-1 object-contain" />} {m.name.replace(/(Logitech |Razer |Finalmouse |Lamzu |Pulsar |SteelSeries |Corsair |Endgame Gear |ASUS |WLMouse |Zowie )/, "")}</button>
                        ))}
                      </div>
                    </div>
                    <div className="p-4">
                      <div className="text-sm uppercase tracking-widest opacity-20 mb-2">Mice with {s2.sensor}</div>
                      <div className="flex flex-wrap gap-1.5">
                        {s2.mice.sort((a, b) => b.proUsage - a.proUsage).map((m, mi) => (
                          <button key={mi} onClick={() => { navigateToMouse(m); }}
                            className="px-2 py-1 rounded text-sm font-bold cursor-pointer transition-all hover:scale-105"
                            style={{ background: `${c2}12`, color: c2 }}>{MOUSE_IMAGE_URLS[m.name] && <img loading="lazy" src={MOUSE_IMAGE_URLS[m.name]} alt={`${m.name}`} className="inline h-4 mr-1 object-contain" />} {m.name.replace(/(Logitech |Razer |Finalmouse |Lamzu |Pulsar |SteelSeries |Corsair |Endgame Gear |ASUS |WLMouse |Zowie )/, "")}</button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })() : (
              <div className="rounded-2xl p-8 text-center" style={{ background: "#0a0a0a", border: "1px solid #ffffff08" }}>
                <div className="text-2xl sm:text-3xl mb-2 opacity-20 text-center"><span className="inline-flex gap-2">{I.lab(28)}{I.bolt(28)}{I.lab(28)}</span></div>
                <div className="text-sm opacity-30">Select two sensors above to compare them head-to-head</div>
              </div>
            )}
          </div>
          );
        })()}

        {/* ── COMPARE TAB ── */}
        {activeTab === "compare" && (
          <div>
            <SectionTitle color="#8b5cf6" sub="Select two mice to compare specs side-by-side">Mouse Comparison Tool</SectionTitle>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              {[0, 1].map(idx => (
                <div key={idx}>
                  <select
                    value={compareList[idx]?.id || ""}
                    onChange={e => {
                      const m = mice.find(m => m.id === parseInt(e.target.value));
                      const newList = [...compareList];
                      newList[idx] = m;
                      setCompareList(newList);
                    }}
                    className="w-full px-4 py-3 rounded-xl text-sm font-bold mb-4"
                    style={{ background: "#0a0a0a", border: `1px solid ${BRAND_COLORS[compareList[idx]?.brand] || "#333"}40`, color: BRAND_COLORS[compareList[idx]?.brand] || "#fff" }}
                  >
                    {mice.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
                  </select>
                  {compareList[idx] && (
                    <div className="rounded-2xl p-5 text-center" style={{ background: `${BRAND_COLORS[compareList[idx].brand]}08`, border: `1px solid ${BRAND_COLORS[compareList[idx].brand]}20` }}>
                      {MOUSE_IMAGE_URLS[compareList[idx].name] && <img loading="lazy" src={MOUSE_IMAGE_URLS[compareList[idx].name]} alt={compareList[idx].name} className="h-16 w-full mx-auto mb-3 object-contain object-center" style={{ filter: "drop-shadow(0 4px 12px rgba(0,0,0,0.5))" }} />}
                      <div className="text-xl font-black" style={{ color: BRAND_COLORS[compareList[idx].brand] }}>{compareList[idx].name}</div>
                      <div className="text-sm opacity-30 mt-1">{compareList[idx].brand}</div>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {compareList[0] && compareList[1] && (() => {
              const specs = [
                { label: "Weight", key: "weight", unit: "g", lower: true },
                { label: "Price", key: "price", unit: "$", lower: true, prefix: "$" },
                { label: "Sensor", key: "sensor", unit: "" },
                { label: "Max DPI", key: "dpi", unit: "" },
                { label: "Polling Rate", key: "pollingRate", unit: " Hz" },
                { label: "Shape", key: "shape", unit: "" },
                { label: "Connectivity", key: "connectivity", unit: "" },
                { label: "Switches", key: "switches", unit: "" },
                { label: "Pro Usage", key: "proUsage", unit: "%", lower: false },
                { label: "Rating", key: "rating", unit: "/10", lower: false },
              ];
              const c0 = BRAND_COLORS[compareList[0].brand];
              const c1 = BRAND_COLORS[compareList[1].brand];
              let wins0 = 0, wins1 = 0;
              specs.forEach(spec => {
                const v0 = compareList[0][spec.key], v1 = compareList[1][spec.key];
                if (typeof v0 === "number") {
                  const w = spec.lower ? (v0 < v1 ? 0 : v0 > v1 ? 1 : -1) : (v0 > v1 ? 0 : v0 < v1 ? 1 : -1);
                  if (w === 0) wins0++; else if (w === 1) wins1++;
                }
              });
              const verdictColor = wins0 > wins1 ? c0 : wins1 > wins0 ? c1 : "#888";
              const verdictName = wins0 > wins1 ? compareList[0].name : wins1 > wins0 ? compareList[1].name : null;
              return (
              <div>
                {/* Verdict banner */}
                <div className="rounded-xl p-5 mb-6 text-center" style={{ background: `${verdictColor}08`, border: `1px solid ${verdictColor}20` }}>
                  <div className="text-sm uppercase tracking-widest opacity-85 mb-1">Spec Comparison Verdict</div>
                  <div className="text-base sm:text-lg font-black text-center" style={{ color: verdictColor }}>
                    {verdictName ? `${verdictName} wins ${Math.max(wins0, wins1)}-${Math.min(wins0, wins1)}` : `Tied ${wins0}-${wins1}`}
                  </div>
                  <div className="flex justify-center gap-4 mt-2">
                    <span className="text-sm" style={{ color: c0 }}>● {compareList[0].name.replace(/(Logitech |Razer )/, "")}: {wins0} wins</span>
                    <span className="text-sm" style={{ color: c1 }}>● {compareList[1].name.replace(/(Logitech |Razer )/, "")}: {wins1} wins</span>
                  </div>
                  {verdictName && (() => {
                    const winnerMouse = wins0 > wins1 ? compareList[0] : compareList[1];
                    const loserMouse = wins0 > wins1 ? compareList[1] : compareList[0];
                    const winnerCol = wins0 > wins1 ? c0 : c1;
                    const loserCol = wins0 > wins1 ? c1 : c0;
                    return (
                      <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mt-4">
                        <a href={amazonLink(winnerMouse.name)} target="_blank" rel="noopener noreferrer"
                          className="inline-flex items-center gap-3 px-6 py-3 rounded-xl text-sm font-black transition-all hover:scale-[1.03] no-underline"
                          style={{ background: winnerCol, color: "#111", boxShadow: `0 0 20px ${winnerCol}30`, textDecoration: "none" }}>
                          {MOUSE_IMAGE_URLS[winnerMouse.name] ? <img loading="lazy" src={MOUSE_IMAGE_URLS[winnerMouse.name]} alt={`${winnerMouse.name} gaming mouse`} className="h-6 object-contain" style={{ filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.3))" }} /> : null}
                          {I.cart(14, "#000")} 🏆 Get the Winner — {winnerMouse.name.split(" ").slice(-3).join(" ")} {"$"}{winnerMouse.price}
                        </a>
                        <a href={amazonLink(loserMouse.name)} target="_blank" rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all hover:scale-105 no-underline"
                          style={{ background: `${loserCol}15`, color: loserCol, border: `1px solid ${loserCol}25`, textDecoration: "none" }}>
                          {I.cart(12)} {loserMouse.name.split(" ").slice(-2).join(" ")} — {"$"}{loserMouse.price}
                        </a>
                      </div>
                    );
                  })()}
                </div>

                <div className="rounded-2xl overflow-hidden" style={{ border: "1px solid #ffffff08" }}>
                  {specs.map((spec, i) => {
                    const v0 = compareList[0][spec.key];
                    const v1 = compareList[1][spec.key];
                    const isNum = typeof v0 === "number";
                    const winner = !isNum ? null : spec.lower ? (v0 < v1 ? 0 : v0 > v1 ? 1 : null) : (v0 > v1 ? 0 : v0 < v1 ? 1 : null);
                    return (
                      <div key={i} className="grid grid-cols-3 items-center" style={{ background: i % 2 === 0 ? "#050505" : "#080808", borderBottom: "1px solid #ffffff05" }}>
                        <div className="px-4 py-3 text-right font-bold text-sm" style={{ color: winner === 0 ? c0 : "#ffffff80" }}>
                          {spec.prefix}{v0}{typeof v0 === "number" ? spec.unit : ""} {winner === 0 && <svg width="12" height="12" viewBox="0 0 24 24" fill="none" style={{display:"inline"}}><path d="M20 6L9 17l-5-5" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/></svg>}
                        </div>
                        <div className="px-4 py-3 text-center text-sm uppercase tracking-widest opacity-30">{spec.label}</div>
                        <div className="px-4 py-3 text-left font-bold text-sm" style={{ color: winner === 1 ? c1 : "#ffffff80" }}>
                          {winner === 1 && <><svg width="12" height="12" viewBox="0 0 24 24" fill="none" style={{display:"inline",verticalAlign:"middle"}}><path d="M20 6L9 17l-5-5" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/></svg>{" "}</>}{spec.prefix}{v1}{typeof v1 === "number" ? spec.unit : ""}
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="mt-8 rounded-2xl p-6" style={{ background: "#0a0a0a", border: "1px solid #ffffff08" }}>
                  <div className="text-sm font-bold mb-4 opacity-60 text-center">Performance Radar Overlay</div>
                  <ResponsiveContainer width="100%" height={300}>
                    <RadarChart data={[
                      { stat: "Lightness", a: Math.max(0, 100 - compareList[0].weight), b: Math.max(0, 100 - compareList[1].weight) },
                      { stat: "Sensor", a: (compareList[0].dpi / 44000) * 100, b: (compareList[1].dpi / 44000) * 100 },
                      { stat: "Poll Rate", a: (compareList[0].pollingRate / 8000) * 100, b: (compareList[1].pollingRate / 8000) * 100 },
                      { stat: "Pro Usage", a: compareList[0].proUsage * 4, b: compareList[1].proUsage * 4 },
                      { stat: "Rating", a: compareList[0].rating * 10, b: compareList[1].rating * 10 },
                      { stat: "Value", a: Math.max(0, 100 - (compareList[0].price / 2)), b: Math.max(0, 100 - (compareList[1].price / 2)) },
                    ]}>
                      <PolarGrid stroke="#ffffff10" />
                      <PolarAngleAxis dataKey="stat" tick={{ fill: "#ffffff40", fontSize: 13 }} />
                      <PolarRadiusAxis tick={false} axisLine={false} domain={[0, 100]} />
                      <Radar name={compareList[0].name} dataKey="a" stroke={BRAND_COLORS[compareList[0].brand]} fill={BRAND_COLORS[compareList[0].brand]} fillOpacity={0.15} strokeWidth={2} />
                      <Radar name={compareList[1].name} dataKey="b" stroke={BRAND_COLORS[compareList[1].brand]} fill={BRAND_COLORS[compareList[1].brand]} fillOpacity={0.15} strokeWidth={2} />
                      <Legend wrapperStyle={{ fontSize: 13 }} />
                    </RadarChart>
                  </ResponsiveContainer>
                </div>

                <div className="grid grid-cols-2 gap-4 mt-6">
                  {compareList.map((m, idx) => {
                    const isWinner = (idx === 0 && wins0 > wins1) || (idx === 1 && wins1 > wins0);
                    const col = BRAND_COLORS[m.brand];
                    return (
                      <div key={idx} className="relative">
                        {isWinner && <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-2.5 py-0.5 rounded-full text-sm font-black z-10" style={{ background: col, color: "#000", fontSize: 11, boxShadow: `0 0 12px ${col}40` }}>⭐ WINNER</div>}
                        <a href={amazonLink(m.name)} target="_blank" rel="noopener noreferrer"
                          className="flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-black transition-all text-center hover:scale-[1.02]"
                          style={isWinner
                            ? { background: col, color: "#000", boxShadow: `0 0 24px ${col}25` }
                            : { background: `${col}15`, color: col, border: `1px solid ${col}30` }
                          }>
                          <svg width={14} height={14} viewBox="0 0 24 24" fill="none"><path d="M1 1h4l2.68 13.39a2 2 0 002 1.61h9.72a2 2 0 002-1.61L23 6H6" stroke={isWinner ? "#000" : "currentColor"} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/><circle cx="9" cy="21" r="1.5" fill={isWinner ? "#000" : "currentColor"}/><circle cx="20" cy="21" r="1.5" fill={isWinner ? "#000" : "currentColor"}/></svg>
                          {isWinner ? "★ " : ""}Buy {m.name.split(" ").slice(-2).join(" ")}  -  {"$"}{m.price}
                        </a>
                      </div>
                    );
                  })}
                </div>
              </div>
            )})()}
          </div>
        )}

        {/* ── LAB TAB ── */}
        {activeTab === "lab" && (() => {

          const setAnswer = (key, val) => setQuizAnswers(prev => ({ ...prev, [key]: val }));
          const toggleArrayAnswer = (key, val) => setQuizAnswers(prev => {
            const arr = prev[key] || [];
            return { ...prev, [key]: arr.includes(val) ? arr.filter(v => v !== val) : [...arr, val] };
          });

          const canProceed = () => {
            if (quizStep === 0) return true;
            if (quizStep === 1) return String(quizAnswers.handLength).length > 0 && String(quizAnswers.handWidth).length > 0;
            if (quizStep === 2) return !!quizAnswers.grip;
            if (quizStep === 3) return quizAnswers.games.length > 0;
            if (quizStep === 4) return quizAnswers.priorities.length > 0;
            if (quizStep === 5) return !!quizAnswers.weightPref;
            if (quizStep === 6) return !!quizAnswers.shape;
            if (quizStep === 7) return !!quizAnswers.connectivity;
            if (quizStep === 8) return !!quizAnswers.budget;
            return true;
          };

          const nextStep = () => {
            if (quizStep === 8) { setQuizDone(true); return; }
            setQuizStep(prev => prev + 1);
          };

          // Scoring algorithm
          const getResults = () => {
            const a = quizAnswers;
            const hl = parseFloat(a.handLength) || 18;
            const hw = parseFloat(a.handWidth) || 9;

            return mice.map(m => {
              let score = 0;
              let reasons = [];

              // Hand size → weight mapping (smaller hands = lighter mice)
              const handArea = hl * hw;
              if (a.grip === "fingertip") {
                if (m.weight <= 50) { score += 15; reasons.push("Ultra-light for fingertip control"); }
                else if (m.weight <= 60) { score += 10; }
                else if (m.weight > 75) { score -= 10; }
              } else if (a.grip === "claw") {
                if (m.weight <= 55) { score += 12; reasons.push("Light enough for claw agility"); }
                else if (m.weight <= 65) { score += 8; }
                else if (m.weight > 80) { score -= 8; }
              } else if (a.grip === "palm") {
                if (m.weight >= 55 && m.weight <= 80) { score += 10; reasons.push("Comfortable weight for palm grip"); }
                else if (m.weight < 45) { score -= 5; }
              }

              // Hand size → shape recommendations
              if (handArea < 150) { // small hands
                if (m.weight <= 55) { score += 5; reasons.push("Sized well for smaller hands"); }
                if (m.name.toLowerCase().includes("mini")) { score += 8; reasons.push("Mini form factor fits smaller hands"); }
              } else if (handArea > 190) { // large hands
                if (m.shape === "Ergonomic") { score += 5; reasons.push("Ergonomic shape suits larger hands"); }
                if (m.name.toLowerCase().includes("mini")) { score -= 8; }
              }

              // Grip → shape
              if (a.grip === "palm" && m.shape === "Ergonomic") { score += 12; reasons.push("Ergonomic shape ideal for palm grip"); }
              if (a.grip === "palm" && m.shape === "Symmetrical") { score += 4; }
              if (a.grip === "claw" && m.shape === "Symmetrical") { score += 10; reasons.push("Symmetrical shape great for claw grip"); }
              if (a.grip === "claw" && m.shape === "Ergonomic") { score += 5; }
              if (a.grip === "fingertip" && m.shape === "Symmetrical") { score += 12; reasons.push("Symmetrical + light = fingertip heaven"); }
              if (a.grip === "fingertip" && m.shape === "Ergonomic") { score -= 2; }

              // Shape preference
              if (a.shape === "symmetrical" && m.shape === "Symmetrical") score += 10;
              if (a.shape === "ergonomic" && m.shape === "Ergonomic") score += 10;
              if (a.shape === "either") score += 5;

              // Game-specific preferences
              const fpsGames = ["CS2", "Valorant", "Apex", "R6 Siege", "Call of Duty", "Overwatch 2", "Fortnite"];
              const mobaGames = ["LoL", "Dota 2"];
              const userPlaysFPS = a.games.some(g => fpsGames.includes(g));
              const userPlaysMOBA = a.games.some(g => mobaGames.includes(g));

              if (userPlaysFPS) {
                if (m.pollingRate >= 4000) { score += 8; reasons.push(`${m.pollingRate >= 8000 ? "8K" : "4K"}Hz polling for competitive FPS`); }
                if (m.weight <= 60) score += 5;
                // Check what pros actually use in those games
                const proCount = allPlayers.filter(p => a.games.includes(p.game) && (p.mouse === m.name || p.mouse.includes(m.name) || m.name.includes(p.mouse))).length;
                if (proCount >= 10) { score += 15; reasons.push(`Used by ${proCount}+ pros in your game(s)`); }
                else if (proCount >= 5) { score += 10; reasons.push(`Used by ${proCount} pros in your game(s)`); }
                else if (proCount >= 2) { score += 5; }
              }
              if (userPlaysMOBA) {
                if (m.shape === "Ergonomic") { score += 5; reasons.push("Ergonomic comfort for long MOBA sessions"); }
                if (m.weight >= 55 && m.weight <= 80) score += 3;
              }

              // Priorities
              if (a.priorities.includes("weight")) {
                if (m.weight <= 45) { score += 12; reasons.push(`Featherweight at ${m.weight}g`); }
                else if (m.weight <= 55) score += 8;
                else if (m.weight <= 65) score += 4;
                else score -= 4;
              }
              if (a.priorities.includes("sensor")) {
                if (m.pollingRate >= 8000) { score += 10; reasons.push("Top-tier 8KHz sensor"); }
                else if (m.pollingRate >= 4000) score += 6;
                else score -= 2;
              }
              if (a.priorities.includes("pro")) {
                score += Math.min(15, m.proUsage * 2);
                if (m.proUsage >= 5) reasons.push(`${m.proUsage}% pro adoption rate`);
              }
              if (a.priorities.includes("price")) {
                if (m.price <= 80) { score += 10; reasons.push(`Great value at $${m.price}`); }
                else if (m.price <= 100) score += 6;
                else if (m.price <= 130) score += 2;
                else score -= 3;
              }
              if (a.priorities.includes("build")) {
                score += Math.round(m.rating * 1.5);
                if (m.rating >= 9.3) reasons.push(`Exceptional ${m.rating}/10 build quality`);
              }

              // Weight preference
              if (a.weightPref === "ultralight" && m.weight <= 45) score += 10;
              else if (a.weightPref === "ultralight" && m.weight > 65) score -= 10;
              if (a.weightPref === "light" && m.weight > 45 && m.weight <= 60) score += 8;
              if (a.weightPref === "medium" && m.weight > 60 && m.weight <= 80) score += 8;
              if (a.weightPref === "heavy" && m.weight > 80) score += 8;

              // Connectivity
              if (a.connectivity === "wireless" && m.connectivity === "Wireless") score += 10;
              if (a.connectivity === "wireless" && m.connectivity === "Wired") score -= 15;
              if (a.connectivity === "wired" && m.connectivity === "Wired") score += 5;
              if (a.connectivity === "either") score += 3;

              // Budget
              if (a.budget === "under80" && m.price <= 80) score += 10;
              else if (a.budget === "under80" && m.price > 120) score -= 15;
              if (a.budget === "80to120" && m.price >= 80 && m.price <= 120) score += 10;
              else if (a.budget === "80to120" && m.price > 160) score -= 10;
              if (a.budget === "120to160" && m.price >= 100 && m.price <= 160) score += 8;
              if (a.budget === "over160") score += 3; // no limit
              if (a.budget === "nolimit") score += 5;

              // Baseline from rating
              score += Math.round(m.rating * 2);

              // Deduplicate reasons
              reasons = [...new Set(reasons)].slice(0, 4);

              return { mouse: m, score, reasons };
            })
            .sort((a, b) => b.score - a.score)
            .slice(0, 8);
          };

          const maxScore = quizDone ? Math.max(...getResults().map(r => r.score)) : 0;

          const accent = "#f59e0b";
          const stepLabels = ["Welcome", "Hand Size", "Grip Style", "Games", "Priorities", "Weight", "Shape", "Connection", "Budget"];
          const totalSteps = 9;

          const OptionButton = ({ selected, onClick, children, color, large }) => (
            <button onClick={onClick}
              className={`rounded-xl text-left transition-all duration-200 ${large ? "p-4 sm:p-5" : "p-3 sm:p-4"}`}
              style={{
                background: selected ? `${color || accent}15` : "#0a0a0a",
                border: selected ? `2px solid ${color || accent}` : "1px solid #ffffff10",
                boxShadow: selected ? `0 0 20px ${color || accent}15` : "none",
              }}>
              {children}
            </button>
          );

          return (
          <div>
            <SectionTitle color={accent} sub={`Unique tools to help you get the most out of your mouse — powered by data from ${allPlayers.length}+ pro players`}>The Lab</SectionTitle>

            {!quizDone ? (
              <div className={quizStep === 0 ? "max-w-4xl mx-auto" : "max-w-2xl mx-auto"}>
                {/* Progress bar */}
                {quizStep > 0 && (
                  <div className="mb-6">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm opacity-30">Step {quizStep} of {totalSteps - 1}</span>
                      <span className="text-sm opacity-30">{stepLabels[quizStep]}</span>
                    </div>
                    <div className="h-1.5 rounded-full overflow-hidden" style={{ background: "#ffffff08" }}>
                      <div className="h-full rounded-full transition-all duration-500" style={{ width: `${(quizStep / (totalSteps - 1)) * 100}%`, background: `linear-gradient(to right, ${accent}, #a855f7)` }} />
                    </div>
                  </div>
                )}

                {/* Step 0: Intro */}
                {quizStep === 0 && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="rounded-2xl p-8 sm:p-10 text-center flex flex-col" style={{ background: "#0a0a0a", border: "1px solid #ffffff08" }}>
                      <FlaskConical size={48} style={{ color: accent, margin: "0 auto 20px" }} />
                      <div className="text-xl sm:text-2xl font-black mb-4" style={{ fontFamily: "Orbitron", color: accent }}>Find Your Perfect Mouse</div>
                      <p className="text-sm opacity-85 max-w-lg mx-auto leading-relaxed mb-2">
                        This quiz analyzes your hand measurements, grip style, gaming preferences, and priorities to recommend mice from our database of {mice.length} models — cross-referenced with data from {allPlayers.length}+ pro players.
                      </p>
                      <p className="text-sm opacity-25 mb-4">Takes about 2 minutes. Your answers aren't stored anywhere.</p>
                      <div className="flex-1" />
                      <button onClick={nextStep}
                        className="px-8 py-3 rounded-xl font-black text-sm transition-all hover:scale-105"
                        style={{ background: accent, color: "#000" }}>
                        Start Quiz →
                      </button>
                    </div>
                    <div className="rounded-2xl p-8 sm:p-10 text-center relative overflow-hidden flex flex-col" style={{ background: "#0a0a0a", border: "1px solid #8b5cf615" }}>
                      <div className="flex justify-center mb-5">{I.gear(48)}</div>
                      <div className="text-xl sm:text-2xl font-black mb-4" style={{ fontFamily: "Orbitron", color: "#8b5cf6" }}>Compare Mice</div>
                      <p className="text-sm opacity-85 max-w-lg mx-auto leading-relaxed mb-2">
                        Put any two mice head-to-head with detailed spec breakdowns, radar charts, pro usage stats, and side-by-side shape analysis.
                      </p>
                      <p className="text-sm opacity-25 mb-4">Pick two mice and see exactly how they differ.</p>
                      <div className="flex-1" />
                      <button onClick={() => { setActiveTab("compare"); window.scrollTo({ top: 0, behavior: "smooth" }); }}
                        className="px-8 py-3 rounded-xl font-black text-sm transition-all hover:scale-105"
                        style={{ background: "#8b5cf6", color: "#000" }}>
                        Compare Mice →
                      </button>
                    </div>
                    <div className="rounded-2xl p-8 sm:p-10 text-center flex flex-col" style={{ background: "#0a0a0a", border: "1px solid #06b6d415" }}>
                      <Layers size={48} style={{ color: "#06b6d4", margin: "0 auto 20px" }} />
                      <div className="text-xl sm:text-2xl font-black mb-2" style={{ fontFamily: "Orbitron", color: "#06b6d4" }}>Shape Overlay</div>
                      <div className="mb-4 flex flex-wrap gap-1.5 justify-center">
                        <span className="text-sm font-bold px-2 py-0.5 rounded-full" style={{ background: "#06b6d415", color: "#06b6d4", border: "1px solid #06b6d430", fontSize: 12 }}>BETA</span>
                        <span className="text-sm font-bold px-2 py-0.5 rounded-full" style={{ background: "#f59e0b15", color: "#f59e0b", border: "1px solid #f59e0b30", fontSize: 12 }}>🚧 UNDER CONSTRUCTION</span>
                      </div>
                      <p className="text-sm opacity-85 max-w-lg mx-auto leading-relaxed mb-2">
                        Overlay actual mouse images scaled to real dimensions — instantly see how any two mice compare in size from all {mice.filter(m => MOUSE_DIMS[m.name] && MOUSE_IMAGE_URLS[m.name]).length} mice.
                      </p>
                      <p className="text-sm opacity-25 mb-4">See exactly how two mice compare in shape.</p>
                      <div className="flex-1" />
                      <div className="px-8 py-3 rounded-xl font-black text-sm text-center"
                        style={{ background: "#06b6d420", color: "#06b6d450", border: "1px solid #06b6d420", cursor: "not-allowed" }}>
                        🚧 Under Construction
                      </div>
                      <div className="text-sm opacity-30 mt-2 text-center"><button onClick={() => setNewsletterPopup(true)} className="underline font-bold transition-all hover:opacity-100" style={{ color: "#00ff6a", opacity: 1, cursor: "pointer" }}>Subscribe to our newsletter</button> for updates</div>
                    </div>
                  </div>
                )}

                {/* Step 1: Hand Size */}
                {quizStep === 1 && (
                  <div className="rounded-2xl p-6 sm:p-8" style={{ background: "#0a0a0a", border: "1px solid #ffffff08" }}>
                    <div className="text-xl font-black mb-1" style={{ color: accent }}>What's your hand size?</div>
                    <p className="text-sm opacity-30 mb-6">Measure from the base of your palm to the tip of your middle finger (length), and across your knuckles (width).</p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
                      {/* Visual guide */}
                      <div className="rounded-xl p-5 flex flex-col items-center" style={{ background: "#ffffff04", border: "1px solid #ffffff08" }}>
                        <svg width="140" height="200" viewBox="0 0 140 200" fill="none">
                          <path d="M70 10 C55 10, 30 20, 25 50 L20 90 C18 100, 25 105, 32 100 L35 80 M70 10 C60 10, 45 15, 40 35 L38 70 M70 10 C65 10, 55 12, 50 30 L48 75 M70 10 C75 10, 85 12, 90 30 L92 75 M70 10 C85 10, 105 20, 108 45 L108 65 C108 72, 104 73, 102 68 L100 55 M25 95 C22 110, 25 140, 35 160 L40 175 C50 190, 90 190, 100 175 L105 160 C115 140, 118 110, 108 80" stroke={accent} strokeWidth="2" strokeLinecap="round" opacity="0.6" />
                          {/* Length arrow */}
                          <line x1="130" y1="15" x2="130" y2="185" stroke="#ffffff40" strokeWidth="1" strokeDasharray="3 3" />
                          <polygon points="130,15 127,22 133,22" fill="#ffffff40" />
                          <polygon points="130,185 127,178 133,178" fill="#ffffff40" />
                          <text x="125" y="100" fill="#ffffff60" fontSize="8" textAnchor="end" transform="rotate(-90, 125, 100)">LENGTH</text>
                          {/* Width arrow */}
                          <line x1="20" y1="195" x2="115" y2="195" stroke="#ffffff40" strokeWidth="1" strokeDasharray="3 3" />
                          <polygon points="20,195 27,192 27,198" fill="#ffffff40" />
                          <polygon points="115,195 108,192 108,198" fill="#ffffff40" />
                          <text x="67" y="192" fill="#ffffff60" fontSize="8" textAnchor="middle">WIDTH</text>
                        </svg>
                      </div>

                      {/* Inputs */}
                      <div className="flex flex-col gap-4 justify-center">
                        <div>
                          <label className="text-sm opacity-85 mb-1.5 block">Hand Length (cm)</label>
                          <input type="text" inputMode="decimal" placeholder="e.g. 18.5"
                            value={quizAnswers.handLength} onChange={e => setAnswer("handLength", e.target.value.replace(/[^0-9.]/g, ""))}
                            className="w-full px-4 py-3 rounded-xl text-sm bg-transparent outline-none"
                            style={{ border: `1px solid ${quizAnswers.handLength ? accent + "60" : "#ffffff15"}`, color: "#fff" }} />
                          <div className="text-sm opacity-20 mt-1">Average male: 18-20cm · Average female: 16-18cm</div>
                        </div>
                        <div>
                          <label className="text-sm opacity-85 mb-1.5 block">Hand Width (cm)</label>
                          <input type="text" inputMode="decimal" placeholder="e.g. 9.5"
                            value={quizAnswers.handWidth} onChange={e => setAnswer("handWidth", e.target.value.replace(/[^0-9.]/g, ""))}
                            className="w-full px-4 py-3 rounded-xl text-sm bg-transparent outline-none"
                            style={{ border: `1px solid ${quizAnswers.handWidth ? accent + "60" : "#ffffff15"}`, color: "#fff" }} />
                          <div className="text-sm opacity-20 mt-1">Average male: 9-10cm · Average female: 7.5-9cm</div>
                        </div>
                        {quizAnswers.handLength && quizAnswers.handWidth && (
                          <div className="rounded-lg px-3 py-2 text-sm" style={{ background: `${accent}10`, border: `1px solid ${accent}20` }}>
                            <span style={{ color: accent }}>
                              {parseFloat(quizAnswers.handLength) * parseFloat(quizAnswers.handWidth) < 150 ? "Small" :
                               parseFloat(quizAnswers.handLength) * parseFloat(quizAnswers.handWidth) < 175 ? "Medium" :
                               parseFloat(quizAnswers.handLength) * parseFloat(quizAnswers.handWidth) < 200 ? "Large" : "Extra Large"} hands
                            </span>
                            <span className="opacity-85"> · {quizAnswers.handLength} × {quizAnswers.handWidth} cm</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {/* Step 2: Grip Style */}
                {quizStep === 2 && (
                  <div className="rounded-2xl p-6 sm:p-8" style={{ background: "#0a0a0a", border: "1px solid #ffffff08" }}>
                    <div className="text-xl font-black mb-1" style={{ color: accent }}>How do you grip your mouse?</div>
                    <p className="text-sm opacity-30 mb-6">Pick the style that best describes how you naturally hold your mouse.</p>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      {[
                        { id: "palm", label: "Palm Grip", desc: "Entire hand rests flat on the mouse. Maximum contact area and comfort. Best for long sessions and arm aiming.", icon: "🖐️", tips: "Full hand contact · Relaxed · Arm aimer" },
                        { id: "claw", label: "Claw Grip", desc: "Palm touches rear of mouse, fingers arched at 90°. Great balance of speed and control for rapid clicking.", icon: "🤏", tips: "Arched fingers · Fast clicks · Hybrid aim" },
                        { id: "fingertip", label: "Fingertip Grip", desc: "Only fingertips touch the mouse. Maximum agility and micro-adjustments. Requires lighter mice.", icon: "☝️", tips: "Fingertips only · Most agile · Wrist aimer" },
                      ].map(g => (
                        <OptionButton key={g.id} selected={quizAnswers.grip === g.id} onClick={() => setAnswer("grip", g.id)} large>
                          <div className="text-center">
                            <div className="text-3xl mb-3">{g.icon}</div>
                            <div className="text-sm font-black mb-2" style={{ color: quizAnswers.grip === g.id ? accent : "#fff" }}>{g.label}</div>
                            <div className="text-sm opacity-85 leading-relaxed mb-3">{g.desc}</div>
                            <div className="text-sm px-2 py-1 rounded-lg inline-block" style={{ background: "#ffffff06", color: "#ffffff40", fontSize: 12 }}>{g.tips}</div>
                          </div>
                        </OptionButton>
                      ))}
                    </div>
                  </div>
                )}

                {/* Step 3: Games */}
                {quizStep === 3 && (
                  <div className="rounded-2xl p-6 sm:p-8" style={{ background: "#0a0a0a", border: "1px solid #ffffff08" }}>
                    <div className="text-xl font-black mb-1" style={{ color: accent }}>What games do you play?</div>
                    <p className="text-sm opacity-30 mb-6">Select all that apply. This helps us match mice that pros use in your games.</p>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                      {[
                        { id: "CS2", label: "Counter-Strike 2", color: "#ff8c00" },
                        { id: "Valorant", label: "Valorant", color: "#ff4655" },
                        { id: "Apex", label: "Apex Legends", color: "#dc2626" },
                        { id: "Fortnite", label: "Fortnite", color: "#4c7bd9" },
                        { id: "Overwatch 2", label: "Overwatch 2", color: "#f99e1a" },
                        { id: "Call of Duty", label: "Call of Duty", color: "#5cb85c" },
                        { id: "R6 Siege", label: "Rainbow Six Siege", color: "#4a86c8" },
                        { id: "LoL", label: "League of Legends", color: "#c89b3c" },
                        { id: "Dota 2", label: "Dota 2", color: "#e74c3c" },
                        { id: "Marvel Rivals", label: "Marvel Rivals", color: "#ed1d24" },
                        { id: "Deadlock", label: "Deadlock", color: "#8b5cf6" },
                        { id: "PUBG", label: "PUBG", color: "#f2a900" },
                      ].map(g => (
                        <OptionButton key={g.id} selected={quizAnswers.games.includes(g.id)} onClick={() => toggleArrayAnswer("games", g.id)} color={g.color}>
                          <div className="flex items-center gap-2">
                            {GAME_IMAGE_URLS[g.id] && <img loading="lazy" src={GAME_IMAGE_URLS[g.id]} alt={g.label} className="w-5 h-5 object-contain" />}
                            <div>
                              <div className="text-sm font-bold" style={{ color: quizAnswers.games.includes(g.id) ? g.color : "#ffffff80" }}>{g.label}</div>
                            </div>
                          </div>
                        </OptionButton>
                      ))}
                    </div>
                    {quizAnswers.games.length > 0 && (
                      <div className="mt-4 text-sm opacity-30">{quizAnswers.games.length} game{quizAnswers.games.length !== 1 ? "s" : ""} selected</div>
                    )}
                  </div>
                )}

                {/* Step 4: Priorities */}
                {quizStep === 4 && (
                  <div className="rounded-2xl p-6 sm:p-8" style={{ background: "#0a0a0a", border: "1px solid #ffffff08" }}>
                    <div className="text-xl font-black mb-1" style={{ color: accent }}>What matters most to you?</div>
                    <p className="text-sm opacity-30 mb-6">Select up to 3 priorities. This shapes how we rank your recommendations.</p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {[
                        { id: "weight", label: "Lightweight", desc: "Lighter = faster flicks and less fatigue", icon: "⚡" },
                        { id: "sensor", label: "Best Sensor & Polling", desc: "Cutting-edge tracking and 4K/8K polling", icon: "🎯" },
                        { id: "pro", label: "Pro Validated", desc: "Used and trusted by professional players", icon: "🏆" },
                        { id: "price", label: "Value for Money", desc: "Best performance per dollar spent", icon: "💰" },
                        { id: "build", label: "Build Quality", desc: "Premium materials, clicks, and feel", icon: "✨" },
                      ].map(p => (
                        <OptionButton key={p.id}
                          selected={quizAnswers.priorities.includes(p.id)}
                          onClick={() => { if (quizAnswers.priorities.includes(p.id) || quizAnswers.priorities.length < 3) toggleArrayAnswer("priorities", p.id); }}>
                          <div className="flex items-center gap-3">
                            <span className="text-xl">{p.icon}</span>
                            <div>
                              <div className="text-sm font-bold" style={{ color: quizAnswers.priorities.includes(p.id) ? accent : "#fff" }}>{p.label}</div>
                              <div className="text-sm opacity-85">{p.desc}</div>
                            </div>
                          </div>
                        </OptionButton>
                      ))}
                    </div>
                    <div className="mt-3 text-sm opacity-25">{quizAnswers.priorities.length}/3 selected</div>
                  </div>
                )}

                {/* Step 5: Weight */}
                {quizStep === 5 && (
                  <div className="rounded-2xl p-6 sm:p-8" style={{ background: "#0a0a0a", border: "1px solid #ffffff08" }}>
                    <div className="text-xl font-black mb-1" style={{ color: accent }}>Weight preference?</div>
                    <p className="text-sm opacity-30 mb-6">How heavy do you like your mouse to feel?</p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {[
                        { id: "ultralight", label: "Ultralight", range: "Under 50g", desc: "Like holding almost nothing. Maximum flick speed.", example: "Beast X, UltralightX, Pulsar X2F" },
                        { id: "light", label: "Light", range: "50-65g", desc: "The competitive sweet spot. Fast but controlled.", example: "Viper V3 Pro, Superlight 2, Maya X" },
                        { id: "medium", label: "Medium", range: "65-85g", desc: "Stable and comfortable. Some prefer the control.", example: "Zowie EC2, SteelSeries Aerox 5" },
                        { id: "heavy", label: "Heavy / Don't Care", range: "85g+", desc: "Maximum stability, or weight just isn't a factor.", example: "G502 X Plus, Basilisk V3 Pro" },
                      ].map(w => (
                        <OptionButton key={w.id} selected={quizAnswers.weightPref === w.id} onClick={() => setAnswer("weightPref", w.id)} large>
                          <div className="text-sm font-black mb-1" style={{ color: quizAnswers.weightPref === w.id ? accent : "#fff" }}>{w.label}</div>
                          <div className="text-sm font-bold mb-1" style={{ color: accent, opacity: 0.6 }}>{w.range}</div>
                          <div className="text-sm opacity-85 mb-2">{w.desc}</div>
                          <div className="text-sm opacity-20" style={{ fontSize: 12 }}>e.g. {w.example}</div>
                        </OptionButton>
                      ))}
                    </div>
                  </div>
                )}

                {/* Step 6: Shape */}
                {quizStep === 6 && (
                  <div className="rounded-2xl p-6 sm:p-8" style={{ background: "#0a0a0a", border: "1px solid #ffffff08" }}>
                    <div className="text-xl font-black mb-1" style={{ color: accent }}>Shape preference?</div>
                    <p className="text-sm opacity-30 mb-6">Ergonomic mice are contoured for your right hand. Symmetrical mice work for any hand.</p>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      {[
                        { id: "ergonomic", label: "Ergonomic", desc: "Right-hand contoured. Natural resting position. Great for palm grip and long sessions.", icon: "🤚" },
                        { id: "symmetrical", label: "Symmetrical", desc: "Ambidextrous shape. Preferred by most FPS pros. Works with all grip styles.", icon: "🔲" },
                        { id: "either", label: "No Preference", desc: "I'm open to both. Recommend whatever scores highest for me.", icon: "🤷" },
                      ].map(s => (
                        <OptionButton key={s.id} selected={quizAnswers.shape === s.id} onClick={() => setAnswer("shape", s.id)} large>
                          <div className="text-center">
                            <div className="text-2xl mb-2">{s.icon}</div>
                            <div className="text-sm font-black mb-2" style={{ color: quizAnswers.shape === s.id ? accent : "#fff" }}>{s.label}</div>
                            <div className="text-sm opacity-85 leading-relaxed">{s.desc}</div>
                          </div>
                        </OptionButton>
                      ))}
                    </div>
                  </div>
                )}

                {/* Step 7: Connectivity */}
                {quizStep === 7 && (
                  <div className="rounded-2xl p-6 sm:p-8" style={{ background: "#0a0a0a", border: "1px solid #ffffff08" }}>
                    <div className="text-xl font-black mb-1" style={{ color: accent }}>Wired or wireless?</div>
                    <p className="text-sm opacity-30 mb-6">Modern wireless mice have zero perceptible latency difference vs wired. 98% of pros use wireless.</p>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      {[
                        { id: "wireless", label: "Wireless Only", desc: "No cable drag. Freedom of movement. The pro standard.", icon: "📡" },
                        { id: "wired", label: "Wired OK", desc: "Don't mind a cable. Sometimes lighter and cheaper.", icon: "🔌" },
                        { id: "either", label: "No Preference", desc: "Either works. Just give me the best mouse.", icon: "🤷" },
                      ].map(c => (
                        <OptionButton key={c.id} selected={quizAnswers.connectivity === c.id} onClick={() => setAnswer("connectivity", c.id)} large>
                          <div className="text-center">
                            <div className="text-2xl mb-2">{c.icon}</div>
                            <div className="text-sm font-black mb-2" style={{ color: quizAnswers.connectivity === c.id ? accent : "#fff" }}>{c.label}</div>
                            <div className="text-sm opacity-85 leading-relaxed">{c.desc}</div>
                          </div>
                        </OptionButton>
                      ))}
                    </div>
                  </div>
                )}

                {/* Step 8: Budget */}
                {quizStep === 8 && (
                  <div className="rounded-2xl p-6 sm:p-8" style={{ background: "#0a0a0a", border: "1px solid #ffffff08" }}>
                    <div className="text-xl font-black mb-1" style={{ color: accent }}>What's your budget?</div>
                    <p className="text-sm opacity-30 mb-6">There are excellent mice at every price point.</p>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      {[
                        { id: "under80", label: "Under $80", desc: "Budget-friendly", color: "#10b981" },
                        { id: "80to120", label: "$80 – $120", desc: "Mid-range", color: "#00b4ff" },
                        { id: "120to160", label: "$120 – $160", desc: "Premium", color: "#a855f7" },
                        { id: "nolimit", label: "No Limit", desc: "Best regardless", color: "#f59e0b" },
                      ].map(b => (
                        <OptionButton key={b.id} selected={quizAnswers.budget === b.id} onClick={() => setAnswer("budget", b.id)} color={b.color} large>
                          <div className="text-center">
                            <div className="text-sm font-black mb-1" style={{ color: quizAnswers.budget === b.id ? b.color : "#fff" }}>{b.label}</div>
                            <div className="text-sm opacity-85">{b.desc}</div>
                          </div>
                        </OptionButton>
                      ))}
                    </div>
                  </div>
                )}

                {/* Navigation */}
                {quizStep > 0 && (
                  <div className="flex justify-between mt-6">
                    <button onClick={() => setQuizStep(prev => prev - 1)}
                      className="px-5 py-2.5 rounded-xl text-sm font-bold transition-all hover:bg-white/5"
                      style={{ background: "#ffffff08", border: "1px solid #ffffff10" }}>
                      ← Back
                    </button>
                    <button onClick={nextStep} disabled={!canProceed()}
                      className="px-6 py-2.5 rounded-xl text-sm font-black transition-all hover:scale-105 disabled:opacity-20 disabled:hover:scale-100"
                      style={{ background: canProceed() ? accent : "#ffffff10", color: canProceed() ? "#000" : "#fff" }}>
                      {quizStep === 8 ? "See My Results →" : "Next →"}
                    </button>
                  </div>
                )}
              </div>
            ) : (
              /* ─── RESULTS ─── */
              <div>
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-6">
                  <div>
                    <div className="text-xl font-black" style={{ color: accent }}>Your Top Mice</div>
                    <div className="text-sm opacity-30 mt-1">
                      Based on {quizAnswers.grip} grip · {quizAnswers.handLength}×{quizAnswers.handWidth}cm hands · {quizAnswers.games.join(", ")} · {quizAnswers.weightPref} weight · {quizAnswers.budget === "nolimit" ? "no budget limit" : quizAnswers.budget}
                    </div>
                  </div>
                  <div className="flex gap-2 flex-shrink-0">
                    <button onClick={() => { setQuizDone(false); setQuizStep(0); setQuizAnswers({ handLength: "", handWidth: "", grip: "", games: [], priorities: [], weightPref: "", connectivity: "", budget: "", shape: "" }); }}
                      className="px-4 py-2 rounded-lg text-sm font-bold transition-all hover:bg-white/5"
                      style={{ background: "#ffffff08", border: "1px solid #ffffff10" }}>
                      ↺ Retake Quiz
                    </button>
                    <button onClick={() => { setQuizDone(false); setQuizStep(0); window.scrollTo({ top: 0, behavior: "smooth" }); }}
                      className="px-4 py-2 rounded-lg text-sm font-bold transition-all hover:bg-white/5"
                      style={{ background: `${accent}10`, border: `1px solid ${accent}30`, color: accent }}>
                      ← Back to Lab
                    </button>
                  </div>
                </div>

                <div className="space-y-4">
                  {getResults().map((r, i) => {
                    const m = r.mouse;
                    const brandCol = BRAND_COLORS[m.brand] || "#888";
                    const matchPct = Math.min(99, Math.max(40, Math.round((r.score / maxScore) * 98)));
                    const isTop = i === 0;
                    return (
                      <div key={m.id}
                        className="rounded-2xl p-4 sm:p-6 cursor-pointer transition-all hover:scale-[1.01]"
                        onClick={() => { navigateToMouse(m); }}
                        style={{
                          background: isTop ? `${brandCol}10` : "#0a0a0a",
                          border: isTop ? `2px solid ${brandCol}40` : "1px solid #ffffff08",
                          boxShadow: isTop ? `0 0 30px ${brandCol}10` : "none",
                        }}>
                        <div className="flex items-start gap-4">
                          {/* Rank badge */}
                          <div className="flex flex-col items-center flex-shrink-0 pt-1">
                            <div className="w-10 h-10 rounded-xl flex items-center justify-center text-sm font-black"
                              style={{
                                background: i === 0 ? "#fbbf2420" : i === 1 ? "#94a3b820" : i === 2 ? "#cd7f3220" : "#ffffff08",
                                color: i === 0 ? "#fbbf24" : i === 1 ? "#94a3b8" : i === 2 ? "#cd7f32" : "#ffffff40",
                                border: i < 3 ? `1px solid ${i === 0 ? "#fbbf24" : i === 1 ? "#94a3b8" : "#cd7f32"}30` : "1px solid #ffffff08",
                              }}>
                              #{i + 1}
                            </div>
                          </div>

                          {/* Mouse image */}
                          <div className="flex-shrink-0 w-16 h-16 sm:w-20 sm:h-20 rounded-xl flex items-center justify-center" style={{ background: `${brandCol}08`, border: `1px solid ${brandCol}12` }}>
                            {MOUSE_IMAGE_URLS[m.name] ? (
                              <img loading="lazy" src={MOUSE_IMAGE_URLS[m.name]} alt={m.name} className="w-full h-full object-contain p-1.5"
                                style={{ filter: "drop-shadow(0 2px 8px rgba(0,0,0,0.4))" }}
                                onError={e => { e.target.style.display = "none"; e.target.nextElementSibling && (e.target.nextElementSibling.style.display = "flex"); }} />
                            ) : null}
                            
                          </div>

                          {/* Mouse info */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-3 mb-2">
                              <div>
                                <div className="text-base sm:text-lg font-black" style={{ color: brandCol }}>{m.name}</div>
                                <div className="text-sm opacity-85">{m.brand} · {m.weight}g · {m.shape} · {m.connectivity} · ${m.price}</div>
                              </div>
                              <div className="flex-shrink-0 text-right">
                                <div className="text-lg font-black" style={{ color: matchPct >= 90 ? "#00ff6a" : matchPct >= 75 ? "#f59e0b" : "#ffffff60" }}>{matchPct}%</div>
                                <div className="text-sm opacity-25">match</div>
                              </div>
                            </div>

                            {/* Match bar */}
                            <div className="h-2 rounded-full overflow-hidden mb-3" style={{ background: "#ffffff08" }}>
                              <div className="h-full rounded-full transition-all duration-1000"
                                style={{ width: `${matchPct}%`, background: `linear-gradient(to right, ${brandCol}80, ${brandCol})` }} />
                            </div>

                            {/* Reasons */}
                            {r.reasons.length > 0 && (
                              <div className="flex flex-wrap gap-1.5">
                                {r.reasons.map((reason, ri) => (
                                  <span key={ri} className="px-2 py-1 rounded-lg text-sm" style={{ background: `${brandCol}10`, color: brandCol, fontSize: 12 }}>
                                    {reason}
                                  </span>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Buy button */}
                        <a href={amazonLink(m.name)} target="_blank" rel="noopener noreferrer"
                          onClick={e => e.stopPropagation()}
                          className={`mt-4 flex items-center justify-center gap-2 py-${isTop ? "3" : "2"} rounded-xl text-sm font-${isTop ? "black" : "bold"} transition-all hover:scale-[1.02] no-underline`}
                          style={isTop
                            ? { background: brandCol, color: "#000", textDecoration: "none" }
                            : { background: `${brandCol}15`, color: brandCol, border: `1px solid ${brandCol}25`, textDecoration: "none" }
                          }>
                          {I.cart(isTop ? 16 : 12)}
                          {isTop ? `🏆 Best Match — Buy ${m.name.split(" ").slice(-2).join(" ")} — $${m.price}` :
                           i === 1 ? `Runner Up — ${m.name.split(" ").slice(-2).join(" ")} — $${m.price}` :
                           i === 2 ? `${m.price < 100 ? "💰 Budget Pick" : "Bronze Pick"} — ${m.name.split(" ").slice(-2).join(" ")} — $${m.price}` :
                           `Buy ${m.name.split(" ").slice(-2).join(" ")} — $${m.price}`}
                        </a>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Coming Soon Teasers */}
            <div className="mt-10">
              <SectionTitle color={accent} sub="New lab experiments dropping soon">Coming Soon</SectionTitle>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  { icon: I.crosshair(32), title: "Aim Style Analyzer", desc: "Answer questions about how you aim — tracking, flicking, micro-adjustments — and we'll profile your style and suggest optimal sensitivity ranges and mice." },
                  { icon: I.bolt(32), title: "Pro Config Simulator", desc: "Pick any pro player from our database and simulate their full setup — DPI, sensitivity, polling rate, and mouse — applied to your favorite game." },
                ].map((item, i) => (
                  <div key={i} className="rounded-2xl p-6 text-center relative overflow-hidden transition-all hover:scale-[1.02]"
                    style={{ background: "#0a0a0a", border: `1px solid ${accent}15` }}>
                    <div className="absolute top-3 right-3 px-2 py-0.5 rounded-full text-sm font-black" style={{ background: `${accent}20`, color: accent, fontSize: 11 }}>COMING SOON</div>
                    <div className="mb-3 flex justify-center opacity-60">{item.icon}</div>
                    <div className="text-sm font-black mb-2" style={{ color: `${accent}90` }}>{item.title}</div>
                    <div className="text-sm opacity-30 leading-relaxed">{item.desc}</div>
                    <div className="mt-4 h-1 rounded-full mx-auto" style={{ width: 40, background: `${accent}20` }} />
                  </div>
                ))}
              </div>
            </div>

          </div>
          );
        })()}

        {/* ── SHAPES TAB ── */}
        {activeTab === "shapes" && (
          <div>
            <SectionTitle color="#06b6d4" sub="Select two mice and overlay their actual images — scaled to real dimensions for true size comparison">Mouse Shape Overlay</SectionTitle>

            {(() => {
                const miceWithDims = mice.filter(m => MOUSE_DIMS[m.name] && MOUSE_IMAGE_URLS[m.name]);
                const mA = shapeMouseA || miceWithDims[0];
                const mB = shapeMouseB || miceWithDims[1];
                const dA = MOUSE_DIMS[mA?.name];
                const dB = MOUSE_DIMS[mB?.name];
                if (!dA || !dB) return null;

                const colA = BRAND_COLORS[mA.brand] || "#00ff6a";
                const colB_raw = BRAND_COLORS[mB.brand] || "#8b5cf6";
                const altColors = ["#8b5cf6", "#f59e0b", "#06b6d4", "#f472b6", "#00ff6a"];
                const colB = (mA.brand === mB.brand || colA === colB_raw) 
                  ? altColors.find(c => c !== colA) || "#8b5cf6"
                  : colB_raw;

                const diffL = Math.abs(dA[0] - dB[0]).toFixed(1);
                const diffW = Math.abs(dA[1] - dB[1]).toFixed(1);
                const diffH = Math.abs(dA[2] - dB[2]).toFixed(1);
                const diffWt = Math.abs(mA.weight - mB.weight).toFixed(0);

                const sortedMiceWithDims = [...miceWithDims].sort((a, b) => a.name.localeCompare(b.name));

                // Scale: pixels per mm. Images are scaled so their width matches real mm width.
                const pxPerMm = 4;
                const imgWA = dA[1] * pxPerMm;
                const imgHA = dA[0] * pxPerMm; // length = image height (top-down view)
                const imgWB = dB[1] * pxPerMm;
                const imgHB = dB[0] * pxPerMm;

                const containerW = Math.max(imgWA, imgWB) + 60;
                const containerH = Math.max(imgHA, imgHB) + 80;

                return (
                  <div>
                    {/* Mouse selectors */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                      {[
                        { mouse: mA, set: setShapeMouseA, col: colA, label: "Mouse A" },
                        { mouse: mB, set: setShapeMouseB, col: colB, label: "Mouse B" },
                      ].map(({ mouse, set, col, label }) => (
                        <div key={label} className="rounded-xl p-4" style={{ background: "#0a0a0a", border: `1px solid ${col}15` }}>
                          <div className="text-sm font-bold mb-2" style={{ color: col }}>{label}</div>
                          <select value={mouse?.id || ""} onChange={e => { const m = mice.find(x => x.id === parseInt(e.target.value)); if (m && MOUSE_DIMS[m.name] && MOUSE_IMAGE_URLS[m.name]) set(m); }}
                            className="w-full px-3 py-2.5 rounded-lg text-sm cursor-pointer" style={{ background: "#0f0f0f", border: `1px solid ${col}25`, color: "#fff" }}>
                            {sortedMiceWithDims.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
                          </select>
                          <div className="flex items-center gap-3 mt-3">
                            {MOUSE_IMAGE_URLS[mouse.name] && <img loading="lazy" src={MOUSE_IMAGE_URLS[mouse.name]} alt={`${mouse.name} shape outline`} className="h-10 object-contain" style={{ filter: `drop-shadow(0 2px 8px ${col}30)` }} />}
                            <div className="flex flex-wrap gap-2 text-sm opacity-50">
                              <span>{MOUSE_DIMS[mouse.name]?.[0]}mm L</span>
                              <span>×</span>
                              <span>{MOUSE_DIMS[mouse.name]?.[1]}mm W</span>
                              <span>×</span>
                              <span>{MOUSE_DIMS[mouse.name]?.[2]}mm H</span>
                              <span>·</span>
                              <span className="font-bold">{mouse.weight}g</span>
                              <span>·</span>
                              <span>{mouse.shape}</span>
                            </div>
                          </div>
                          <a href={amazonLink(mouse.name)} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 mt-2 px-3 py-1 rounded-lg text-xs font-bold transition-all hover:scale-105 no-underline" style={{ background: "#f59e0b15", color: "#f59e0b", border: "1px solid #f59e0b20", textDecoration: "none" }}>
                            {I.cart(10)} Buy on Amazon — ${mouse.price}
                          </a>
                        </div>
                      ))}
                    </div>

                    {/* View controls */}
                    <div className="flex flex-wrap gap-2 mb-6">
                      {[
                        { id: "overlay", label: "Overlay" },
                        { id: "side", label: "Side by Side" },
                      ].map(v => (
                        <button key={v.id} onClick={() => setShapeView(v.id)}
                          className="px-4 py-2 rounded-lg text-sm font-bold transition-all"
                          style={{ background: shapeView === v.id ? "#06b6d420" : "#ffffff05", border: `1px solid ${shapeView === v.id ? "#06b6d4" : "#ffffff10"}`, color: shapeView === v.id ? "#06b6d4" : "#ffffff40" }}>
                          {v.label}
                        </button>
                      ))}
                    </div>

                    {/* Image Overlay Visualization */}
                    <div className="rounded-2xl overflow-hidden relative" style={{ background: "#060606", border: "1px solid #ffffff08" }}>
                      {shapeView === "overlay" ? (
                        <div style={{ position: "relative", width: "100%", maxWidth: containerW, height: containerH, margin: "0 auto" }}>
                          {/* Grid background */}
                          <div style={{ position: "absolute", inset: 0, backgroundImage: "linear-gradient(#ffffff06 1px, transparent 1px), linear-gradient(90deg, #ffffff06 1px, transparent 1px)", backgroundSize: `${10 * pxPerMm}px ${10 * pxPerMm}px` }} />
                          {/* Center crosshair */}
                          <div style={{ position: "absolute", left: "50%", top: 0, bottom: 0, width: 1, background: "#ffffff08" }} />
                          <div style={{ position: "absolute", top: "50%", left: 0, right: 0, height: 1, background: "#ffffff08" }} />
                          {/* Mouse B (behind) */}
                          <img loading="lazy" src={MOUSE_IMAGE_URLS[mB.name]} alt={mB.name} width={Math.round(imgWB)} height={Math.round(imgHB)}
                            style={{
                              position: "absolute",
                              left: "50%", top: "50%",
                              width: imgWB, height: imgHB,
                              transform: "translate(-50%, -50%)",
                              objectFit: "contain",
                              opacity: 0.45,
                              filter: `drop-shadow(0 0 12px ${colB}40)`,
                            }} />
                          {/* Mouse A (front) */}
                          <img loading="lazy" src={MOUSE_IMAGE_URLS[mA.name]} alt={mA.name} width={Math.round(imgWA)} height={Math.round(imgHA)}
                            style={{
                              position: "absolute",
                              left: "50%", top: "50%",
                              width: imgWA, height: imgHA,
                              transform: "translate(-50%, -50%)",
                              objectFit: "contain",
                              opacity: 0.65,
                              filter: `drop-shadow(0 0 12px ${colA}40)`,
                            }} />
                          {/* Dimension labels */}
                          <div style={{ position: "absolute", top: 8, left: 8, fontSize: 12, fontFamily: "monospace", color: colA, opacity: 0.7 }}>
                            {dA[0]}mm × {dA[1]}mm
                          </div>
                          <div style={{ position: "absolute", top: 8, right: 8, fontSize: 12, fontFamily: "monospace", color: colB, opacity: 0.7 }}>
                            {dB[0]}mm × {dB[1]}mm
                          </div>
                          {/* Scale bar */}
                          <div style={{ position: "absolute", bottom: 10, left: 12, display: "flex", alignItems: "center", gap: 6 }}>
                            <div style={{ width: 10 * pxPerMm, height: 2, background: "#ffffff30", borderRadius: 1 }} />
                            <span style={{ fontSize: 11, fontFamily: "monospace", color: "#ffffff30" }}>10mm</span>
                          </div>
                        </div>
                      ) : (
                        <div className="grid grid-cols-2 gap-0">
                          {[
                            { m: mA, d: dA, col: colA },
                            { m: mB, d: dB, col: colB },
                          ].map(({ m, d, col }, idx) => (
                            <div key={idx} style={{ position: "relative", height: containerH, borderRight: idx === 0 ? "1px solid #ffffff08" : "none", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
                              <div style={{ position: "absolute", inset: 0, backgroundImage: "linear-gradient(#ffffff06 1px, transparent 1px), linear-gradient(90deg, #ffffff06 1px, transparent 1px)", backgroundSize: `${10 * pxPerMm}px ${10 * pxPerMm}px` }} />
                              <img loading="lazy" src={MOUSE_IMAGE_URLS[m.name]} alt={m.name}
                                style={{ maxWidth: "75%", maxHeight: containerH * 0.65, objectFit: "contain", position: "relative", zIndex: 1, filter: `drop-shadow(0 0 12px ${col}30)` }} />
                              <div style={{ position: "absolute", top: 10, left: 0, right: 0, textAlign: "center", zIndex: 2 }}>
                                <div style={{ fontSize: 13, fontFamily: "monospace", fontWeight: "bold", color: col }}>{m.name.replace(m.brand + " ", "")}</div>
                                <div style={{ fontSize: 11, fontFamily: "monospace", color: "#ffffff40", marginTop: 2 }}>{d[0]} × {d[1]} × {d[2]}mm · {m.weight}g</div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Difference Stats */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6">
                      {[
                        { label: "Length", valA: dA[0], valB: dB[0], unit: "mm", diff: diffL },
                        { label: "Width", valA: dA[1], valB: dB[1], unit: "mm", diff: diffW },
                        { label: "Height", valA: dA[2], valB: dB[2], unit: "mm", diff: diffH },
                        { label: "Weight", valA: mA.weight, valB: mB.weight, unit: "g", diff: diffWt },
                      ].map((s, i) => (
                        <div key={i} className="rounded-xl p-4 text-center" style={{ background: "#0a0a0a", border: "1px solid #ffffff08" }}>
                          <div className="text-sm uppercase tracking-widest opacity-20 mb-2">{s.label}</div>
                          <div className="flex items-center justify-center gap-3 mb-1">
                            <span className="text-sm font-black" style={{ color: colA }}>{s.valA}{s.unit}</span>
                            <span className="text-sm opacity-20">vs</span>
                            <span className="text-sm font-black" style={{ color: colB }}>{s.valB}{s.unit}</span>
                          </div>
                          <div className="text-sm font-bold" style={{ color: s.diff > 0 ? "#f59e0b" : "#10b981" }}>
                            {s.diff > 0 ? `Δ ${s.diff}${s.unit}` : "Identical"}
                          </div>
                          <div className="flex items-center gap-1 mt-2">
                            <div className="flex-1 h-1.5 rounded-full overflow-hidden" style={{ background: "#ffffff08" }}>
                              <div className="h-full rounded-full" style={{ width: `${(s.valA / Math.max(s.valA, s.valB)) * 100}%`, background: colA }} />
                            </div>
                            <div className="flex-1 h-1.5 rounded-full overflow-hidden" style={{ background: "#ffffff08" }}>
                              <div className="h-full rounded-full" style={{ width: `${(s.valB / Math.max(s.valA, s.valB)) * 100}%`, background: colB }} />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Legend */}
                    <div className="flex items-center justify-center gap-6 mt-5 text-sm">
                      <div className="flex items-center gap-2">
                        <div className="w-5 h-1.5 rounded-full" style={{ background: colA }} />
                        <span style={{ color: colA }} className="font-bold">{mA.name.replace(mA.brand + " ", "")}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-5 h-1.5 rounded-full" style={{ background: colB }} />
                        <span style={{ color: colB }} className="font-bold">{mB.name.replace(mB.brand + " ", "")}</span>
                      </div>
                    </div>

                    {/* Buy both */}
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mt-4">
                      <a href={amazonLink(mA.name)} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all hover:scale-105 no-underline" style={{ background: `${colA}15`, color: colA, border: `1px solid ${colA}25`, textDecoration: "none" }}>
                        {I.cart(12)} Buy {mA.name.replace(mA.brand + " ", "")} — ${mA.price}
                      </a>
                      <a href={amazonLink(mB.name)} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all hover:scale-105 no-underline" style={{ background: `${colB}15`, color: colB, border: `1px solid ${colB}25`, textDecoration: "none" }}>
                        {I.cart(12)} Buy {mB.name.replace(mB.brand + " ", "")} — ${mB.price}
                      </a>
                    </div>

                    {/* Quick size guide */}
                    <div className="rounded-xl p-4 mt-6" style={{ background: "#06b6d406", border: "1px solid #06b6d410" }}>
                      <div className="text-sm uppercase tracking-widest opacity-30 mb-3 font-bold">Quick Size Reference</div>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-sm">
                        <div><span className="opacity-30">Small:</span> <span className="opacity-60">&lt;118mm L, &lt;60mm W</span></div>
                        <div><span className="opacity-30">Medium:</span> <span className="opacity-60">118-125mm L, 60-65mm W</span></div>
                        <div><span className="opacity-30">Large:</span> <span className="opacity-60">&gt;125mm L, &gt;65mm W</span></div>
                        <div><span className="opacity-30">Low profile:</span> <span className="opacity-60">&lt;38mm H</span></div>
                      </div>
                    </div>
                  </div>
                );
            })()}
          </div>
        )}

        {/* ── SENSITIVITY CONVERTER PAGE ── */}
        {activeTab === "sensitivity" && (() => {
          const accentC = "#8b5cf6";
          const SENS_GAMES = [
            { id: "cs2", name: "Counter-Strike 2", img: GAME_IMAGE_URLS["CS2"], yaw: 0.022, defaultSens: 1.0, step: 0.01, note: "In-game Sensitivity" },
            { id: "val", name: "Valorant", img: GAME_IMAGE_URLS["Valorant"], yaw: 0.07, defaultSens: 0.35, step: 0.001, note: "Sensitivity" },
            { id: "ow2", name: "Overwatch 2", img: GAME_IMAGE_URLS["Overwatch 2"], yaw: 0.0066, defaultSens: 5, step: 0.1, note: "Sensitivity (1-100)" },
            { id: "apex", name: "Apex Legends", img: GAME_IMAGE_URLS["Apex"], yaw: 0.022, defaultSens: 1.5, step: 0.1, note: "Mouse Sensitivity" },
            { id: "fn", name: "Fortnite", img: GAME_IMAGE_URLS["Fortnite"], yaw: 0.005555, defaultSens: 8, step: 0.1, note: "X Axis Sensitivity (%)" },
            { id: "cod", name: "Call of Duty", img: GAME_IMAGE_URLS["Call of Duty"], yaw: 0.0066, defaultSens: 5, step: 0.1, note: "Mouse Sensitivity" },
            { id: "r6", name: "Rainbow Six Siege", img: GAME_IMAGE_URLS["R6 Siege"], yaw: 0.00572958, defaultSens: 10, step: 1, note: "Mouse Sensitivity" },
            { id: "tf2", name: "Team Fortress 2", img: GAME_IMAGE_URLS["Team Fortress 2"], yaw: 0.022, defaultSens: 2, step: 0.01, note: "Sensitivity" },
            { id: "tarkov", name: "Escape from Tarkov", img: GAME_IMAGE_URLS["Escape from Tarkov"], yaw: 0.022, defaultSens: 0.5, step: 0.01, note: "Mouse Sensitivity" },
            { id: "deadlock", name: "Deadlock", img: GAME_IMAGE_URLS["Deadlock"], yaw: 0.022, defaultSens: 1.5, step: 0.01, note: "Sensitivity (Source 2)" },
            { id: "finals", name: "The Finals", img: GAME_IMAGE_URLS["The Finals"], yaw: 0.022, defaultSens: 2, step: 0.01, note: "Mouse Sensitivity" },
            { id: "marvel", name: "Marvel Rivals", img: GAME_IMAGE_URLS["Marvel Rivals"], yaw: 0.0066, defaultSens: 5, step: 0.1, note: "Mouse Sensitivity" },
            { id: "pubg", name: "PUBG", img: GAME_IMAGE_URLS["PUBG"], yaw: 0.000440, defaultSens: 50, step: 1, note: "General Sensitivity" },
            { id: "bf", name: "Battlefield 2042", img: GAME_IMAGE_URLS["Battlefield 2042"], yaw: 0.01222, defaultSens: 25, step: 0.5, note: "Soldier Sensitivity (%)" },
            { id: "destiny2", name: "Destiny 2", img: GAME_IMAGE_URLS["Destiny 2"], yaw: 0.0066, defaultSens: 5, step: 0.5, note: "Mouse Look Sensitivity" },
            { id: "halo", name: "Halo Infinite", img: GAME_IMAGE_URLS["Halo Infinite"], yaw: 0.012195, defaultSens: 3, step: 0.1, note: "Mouse Sensitivity" },
            { id: "quake", name: "Quake Champions", img: GAME_IMAGE_URLS["Quake Champions"], yaw: 0.022, defaultSens: 3, step: 0.01, note: "Sensitivity" },
          ];

          const fromGame = SENS_GAMES.find(g => g.id === sensFromGame) || SENS_GAMES[0];
          const cm360 = (sensFromDpi > 0 && sensFromSens > 0) ? 914.4 / (sensFromDpi * fromGame.yaw * sensFromSens) : 0;
          const inches360 = cm360 / 2.54;
          const edpi = sensFromDpi * sensFromSens;

          let speedLabel = "", speedColor = "";
          if (cm360 > 80) { speedLabel = "Very Slow"; speedColor = "#3b82f6"; }
          else if (cm360 > 50) { speedLabel = "Slow"; speedColor = "#06b6d4"; }
          else if (cm360 > 30) { speedLabel = "Medium"; speedColor = "#10b981"; }
          else if (cm360 > 18) { speedLabel = "Fast"; speedColor = "#f59e0b"; }
          else if (cm360 > 10) { speedLabel = "Very Fast"; speedColor = "#ef4444"; }
          else { speedLabel = "Extreme"; speedColor = "#dc2626"; }

          const proMatches = cm360 > 0 ? allPlayers.filter(p => {
            if (!p.dpi || !p.edpi || p.edpi <= 0) return false;
            const pSens = p.edpi / p.dpi;
            const gameYaw = { CS2: 0.022, Valorant: 0.07, "Overwatch 2": 0.0066, Apex: 0.022, "Call of Duty": 0.0066, "R6 Siege": 0.00572958, Fortnite: 0.005555, PUBG: 0.000440, "Marvel Rivals": 0.0066, Deadlock: 0.022 };
            const yaw = gameYaw[p.game] || 0.022;
            const proCm360 = 914.4 / (p.dpi * yaw * pSens);
            return Math.abs(proCm360 - cm360) / cm360 < 0.1;
          }).slice(0, 12) : [];

          return (
          <div>
            <SectionTitle color={accentC} sub="Convert your sensitivity between any game — supporting 17 titles with cm/360 as the universal reference">Sensitivity Converter</SectionTitle>

            <div className="rounded-2xl overflow-hidden" style={{ border: `1px solid ${accentC}15` }}>
              {/* Input Section */}
              <div className="p-4 sm:p-6" style={{ background: `linear-gradient(135deg, ${accentC}08, #0a0a0a)` }}>
                <div className="text-sm uppercase tracking-widest opacity-30 mb-4">Your Current Settings</div>

                <div className="mb-4">
                  <div className="text-sm opacity-85 mb-2">Game</div>
                  <div className="flex flex-wrap gap-1.5">
                    {SENS_GAMES.map(g => (
                      <button key={g.id} onClick={() => { setSensFromGame(g.id); setSensFromSens(g.defaultSens); }}
                        className="px-2.5 py-1.5 rounded-lg text-sm font-bold transition-all cursor-pointer whitespace-nowrap"
                        style={{
                          background: sensFromGame === g.id ? accentC : "#ffffff06",
                          color: sensFromGame === g.id ? "#000" : "#ffffffaa",
                          border: sensFromGame === g.id ? "none" : "1px solid #ffffff08",
                          fontSize: 12,
                        }}>
                        {g.img ? <img loading="lazy" src={g.img} alt={`${g.name} game icon`} className="inline-block mr-1 rounded-sm" style={{ width: 14, height: 14, objectFit: "contain", verticalAlign: "middle", marginTop: -1 }} /> : null}{g.name}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-sm opacity-85 mb-2">DPI</div>
                    <input type="number" value={sensFromDpi} onChange={e => setSensFromDpi(Number(e.target.value))}
                      className="w-full rounded-xl px-4 py-3 text-lg font-black text-center"
                      style={{ background: "#ffffff08", border: `1px solid ${accentC}25`, color: accentC, outline: "none" }} />
                    <div className="flex flex-wrap gap-1 mt-2 justify-center">
                      {[400, 800, 1600, 3200].map(d => (
                        <button key={d} onClick={() => setSensFromDpi(d)}
                          className="px-2 py-0.5 rounded text-sm cursor-pointer transition-all"
                          style={{ background: sensFromDpi === d ? `${accentC}30` : "#ffffff06", color: sensFromDpi === d ? accentC : "#ffffff80", fontSize: 11 }}>
                          {d}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm opacity-85 mb-2">{fromGame.note}</div>
                    <input type="number" value={sensFromSens} onChange={e => setSensFromSens(Number(e.target.value))}
                      step={fromGame.step}
                      className="w-full rounded-xl px-4 py-3 text-lg font-black text-center"
                      style={{ background: "#ffffff08", border: `1px solid ${accentC}25`, color: "#fff", outline: "none" }} />
                    <div className="text-sm opacity-20 text-center mt-2" style={{ fontSize: 11 }}>eDPI: {edpi.toFixed(1)}</div>
                  </div>
                </div>
              </div>

              {/* Universal Metrics */}
              {cm360 > 0 && cm360 < 10000 && (
                <div className="px-4 sm:px-6 py-4" style={{ background: "#0a0a0a", borderTop: `1px solid ${accentC}10`, borderBottom: `1px solid ${accentC}10` }}>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
                    <div className="text-center">
                      <div className="text-sm opacity-60 mb-1">cm/360°</div>
                      <div className="text-xl sm:text-2xl font-black" style={{ color: accentC }}>{cm360.toFixed(1)}</div>
                      <div className="text-sm opacity-50">centimeters</div>
                    </div>
                    <div className="text-center">
                      <div className="text-sm opacity-60 mb-1">in/360°</div>
                      <div className="text-xl sm:text-2xl font-black" style={{ color: "#00b4ff" }}>{inches360.toFixed(1)}</div>
                      <div className="text-sm opacity-50">inches</div>
                    </div>
                    <div className="text-center">
                      <div className="text-sm opacity-60 mb-1">Speed</div>
                      <div className="text-xl sm:text-2xl font-black" style={{ color: speedColor }}>{speedLabel}</div>
                      <div className="text-sm opacity-50">{cm360 > 40 ? "arm aimer" : cm360 > 22 ? "hybrid" : "wrist aimer"}</div>
                    </div>
                    <div className="text-center">
                      <div className="text-sm opacity-60 mb-1">Mousepad</div>
                      <div className="text-xl sm:text-2xl font-black" style={{ color: "#f59e0b" }}>{cm360 > 50 ? "XL+" : cm360 > 30 ? "Large" : cm360 > 18 ? "Medium" : "Any"}</div>
                      <div className="text-sm opacity-50">recommended size</div>
                    </div>
                  </div>

                  {/* Swipe distance bar */}
                  <div className="mt-4">
                    <div className="text-sm opacity-55 mb-1.5 text-center">Swipe distance for a full 360° turn</div>
                    <div className="relative h-8 rounded-lg overflow-hidden" style={{ background: "#ffffff06" }}>
                      <div className="absolute left-0 top-0 h-full rounded-lg transition-all duration-500 flex items-center justify-end pr-2"
                        style={{ width: `${Math.min(Math.max(cm360 / 100 * 100, 5), 100)}%`, background: `linear-gradient(to right, ${accentC}40, ${accentC})` }}>
                        <span className="text-sm font-black" style={{ color: "#000" }}>{cm360.toFixed(1)}cm</span>
                      </div>
                      {[20, 40, 60, 80].map(mark => (
                        <div key={mark} className="absolute top-0 h-full flex items-end pb-0.5 justify-center" style={{ left: `${mark}%`, width: 1 }}>
                          <div className="w-px h-2 bg-white/10" />
                        </div>
                      ))}
                    </div>
                    <div className="flex justify-between text-sm opacity-40 mt-1 px-1" style={{ fontSize: 10 }}>
                      <span>0cm (instant)</span>
                      <span>50cm</span>
                      <span>100cm+</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Converted Sensitivities */}
              {cm360 > 0 && cm360 < 10000 && (
                <div className="p-4 sm:p-6" style={{ background: "#050505" }}>
                  <div className="text-sm uppercase tracking-widest opacity-60 mb-4">Equivalent Sensitivity in Every Game</div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                    {SENS_GAMES.filter(g => g.id !== sensFromGame).map(g => {
                      const targetSens = 914.4 / (sensFromDpi * g.yaw * cm360);
                      const targetEdpi = sensFromDpi * targetSens;
                      const isSameEngine = g.yaw === fromGame.yaw;
                      const formatted = targetSens < 0.01 ? targetSens.toFixed(4) : targetSens < 1 ? targetSens.toFixed(3) : targetSens < 10 ? targetSens.toFixed(2) : targetSens.toFixed(1);
                      return (
                        <div key={g.id} className="flex items-center gap-3 rounded-xl px-3 py-2.5 transition-all group/sens"
                          style={{ background: "#ffffff04", border: "1px solid #ffffff08" }}
                          onMouseEnter={e => { e.currentTarget.style.background = `${accentC}08`; e.currentTarget.style.borderColor = `${accentC}20`; }}
                          onMouseLeave={e => { e.currentTarget.style.background = "#ffffff04"; e.currentTarget.style.borderColor = "#ffffff08"; }}>
                          {g.img ? <img loading="lazy" src={g.img} alt={`${g.name} game icon`} className="flex-shrink-0 rounded-sm" style={{ width: 20, height: 20, objectFit: "contain" }} /> : <span className="flex-shrink-0 w-5 h-5 rounded-sm flex items-center justify-center text-sm" style={{ background: "#ffffff08" }}>{g.name.charAt(0)}</span>}
                          <div className="flex-1 min-w-0">
                            <div className="text-sm font-bold truncate" style={{ color: "#ffffffc0" }}>{g.name}</div>
                            <div className="text-sm opacity-25" style={{ fontSize: 11 }}>{g.note} · eDPI: {targetEdpi.toFixed(1)}</div>
                          </div>
                          <div className="text-right flex-shrink-0">
                            <div className="text-sm font-black" style={{ color: accentC }}>{formatted}</div>
                            {isSameEngine && <div className="text-sm font-bold" style={{ color: "#10b981", fontSize: 10 }}>Same engine</div>}
                          </div>
                          <button onClick={() => { navigator.clipboard?.writeText(formatted); }}
                            className="opacity-0 group-hover/sens:opacity-85 hover:!opacity-100 transition-all cursor-pointer flex-shrink-0"
                            title="Copy sensitivity">
                            <svg width={12} height={12} viewBox="0 0 24 24" fill="none"><rect x="9" y="9" width="13" height="13" rx="2" stroke="currentColor" strokeWidth="2"/><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" stroke="currentColor" strokeWidth="2"/></svg>
                          </button>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Pro Players with Similar Sensitivity */}
              {cm360 > 0 && cm360 < 10000 && (
                <div className="p-4 sm:p-6" style={{ background: "#0a0a0a", borderTop: `1px solid ${accentC}10` }}>
                  <button onClick={() => setSensShowPros(!sensShowPros)}
                    className="flex items-center gap-2 text-sm uppercase tracking-widest opacity-85 hover:opacity-60 transition-all cursor-pointer mb-3">
                    <span>{sensShowPros ? "▼" : "▶"} Pro Players with Similar Sensitivity ({proMatches.length} found)</span>
                  </button>
                  {sensShowPros && (
                    <div>
                      {proMatches.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          {proMatches.map((p, i) => {
                            const gc = { CS2: "#ff8c00", Valorant: "#ff4655", "Overwatch 2": "#f99e1a", Apex: "#dc2626", "Call of Duty": "#5cb85c", "R6 Siege": "#4a86c8", Fortnite: "#4c7bd9", "Marvel Rivals": "#ed1d24", Deadlock: "#8b5cf6", "Quake Champions": "#ce4a00" };
                            return (
                              <button key={i} onClick={() => { const pp = proPlayers.find(pp => pp.name === p.name); if (pp) { navigateToPlayer(pp); } }}
                                className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-left transition-all cursor-pointer"
                                style={{ background: "#ffffff04", border: "1px solid #ffffff08" }}
                                onMouseEnter={e => { e.currentTarget.style.background = "#ffffff08"; }}
                                onMouseLeave={e => { e.currentTarget.style.background = "#ffffff04"; }}>
                                <Flag country={p.country} size={20} />
                                <div className="flex-1 min-w-0">
                                  <div className="text-sm font-bold">{p.name}</div>
                                  <div className="text-sm opacity-30">{p.team} · <span style={{ color: gc[p.game] || "#888" }}>{p.game}</span></div>
                                </div>
                                <div className="text-right flex-shrink-0">
                                  <div className="text-sm font-bold" style={{ color: accentC }}>{p.dpi} DPI</div>
                                  <div className="text-sm opacity-30">{p.edpi} eDPI</div>
                                </div>
                                <a href={amazonLink(p.mouse)} target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()} className="flex items-center gap-1 px-2 py-1 rounded text-xs font-bold transition-all hover:scale-105 no-underline flex-shrink-0" style={{ background: "#f59e0b15", color: "#f59e0b", border: "1px solid #f59e0b20", textDecoration: "none", fontSize: 10 }}>
                                  {I.cart(10)} {(() => { const sm = mice.find(mm => mm.name === p.mouse); return sm ? `$${sm.price}` : "Buy"; })()}
                                </a>
                              </button>
                            );
                          })}
                        </div>
                      ) : (
                        <div className="text-sm opacity-20 text-center py-4">No pros with a similar sensitivity found in our database. Try adjusting your settings.</div>
                      )}
                      {/* Popular mice at this sensitivity */}
                      {proMatches.length > 0 && (() => {
                        const matchMice = {};
                        proMatches.forEach(p => { matchMice[p.mouse] = (matchMice[p.mouse] || 0) + 1; });
                        const topMatchMice = Object.entries(matchMice).sort((a, b) => b[1] - a[1]).slice(0, 3);
                        return topMatchMice.length > 0 && (
                          <div className="mt-4 rounded-xl p-4" style={{ background: `${accentC}06`, border: `1px solid ${accentC}15` }}>
                            <div className="text-xs uppercase tracking-widest font-bold mb-3" style={{ color: accentC }}>🎯 Popular Mice at Your Sensitivity</div>
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                              {topMatchMice.map(([mName, cnt], mi) => {
                                const md = mice.find(mm => mm.name === mName || mName.includes(mm.name));
                                return (
                                  <div key={mi} className="rounded-lg p-3 text-center" style={{ background: "#0a0a0a", border: "1px solid #ffffff08" }}>
                                    <div className="text-xs font-black truncate mb-1" style={{ color: "#ffffffd0" }}>{mName.replace(/(Logitech |Razer )/, "")}</div>
                                    <div style={{ fontSize: 10, color: "#ffffff30" }}>{cnt} pros at your eDPI{md ? ` · ${md.weight}g` : ""}</div>
                                    <a href={amazonLink(mName)} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 mt-2 px-3 py-1 rounded text-xs font-bold transition-all hover:scale-105 no-underline" style={{ background: "#f59e0b20", color: "#f59e0b", textDecoration: "none" }}>
                                      {I.cart(10)} {md ? `$${md.price}` : "Buy"}
                                    </a>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        );
                      })()}
                    </div>
                  )}
                </div>
              )}

              {/* Quick Reference */}
              {cm360 > 0 && cm360 < 10000 && (
                <div className="p-4 sm:p-6" style={{ background: "#050505", borderTop: `1px solid ${accentC}10` }}>
                  <div className="text-sm uppercase tracking-widest opacity-30 mb-3">Sensitivity Ranges by Game Type</div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="rounded-lg p-3" style={{ background: "#ffffff04" }}>
                      <div className="text-sm font-bold mb-2" style={{ color: "#3b82f6" }}>🎯 Tactical Shooters</div>
                      <div className="text-sm opacity-85 leading-relaxed">CS2, Valorant, R6 Siege — Pros typically use 25-55 cm/360. Precise aim over flick speed. Your {cm360.toFixed(0)}cm is {cm360 > 55 ? "slower than most" : cm360 > 25 ? "in the sweet spot" : "faster than most"} tactical pros.</div>
                    </div>
                    <div className="rounded-lg p-3" style={{ background: "#ffffff04" }}>
                      <div className="text-sm font-bold mb-2" style={{ color: "#ef4444" }}>💥 Fast-Paced Shooters</div>
                      <div className="text-sm opacity-85 leading-relaxed">Apex, OW2, CoD, Fortnite — Pros typically use 18-40 cm/360. More tracking and flicking. Your {cm360.toFixed(0)}cm is {cm360 > 40 ? "slower than most" : cm360 > 18 ? "in the sweet spot" : "faster than most"} arena pros.</div>
                    </div>
                    <div className="rounded-lg p-3" style={{ background: "#ffffff04" }}>
                      <div className="text-sm font-bold mb-2" style={{ color: "#10b981" }}>📏 The Universal Range</div>
                      <div className="text-sm opacity-85 leading-relaxed">Most FPS pros across all titles fall between 20-50 cm/360. If you're between 25-40cm, you're in the most popular zone. Experiment ±5cm from your current to find your sweet spot.</div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
          );
        })()}

        {/* ── TEAMS TAB ── */}
        {activeTab === "teams" && (() => {
          const teamColor = "#38bdf8";
          const teamMap = {};
          allPlayers.forEach(p => {
            if (!p.team || p.team === "Free Agent" || p.team === "Content Creator" || p.team === "Content" || p.team === "Retired" || p.team === "Streamer") return;
            if (!teamMap[p.team]) teamMap[p.team] = { players: [], games: new Set(), mice: {} };
            teamMap[p.team].players.push(p);
            teamMap[p.team].games.add(p.game);
            if (p.mouse) teamMap[p.team].mice[p.mouse] = (teamMap[p.team].mice[p.mouse] || 0) + 1;
          });
          const teamList = Object.entries(teamMap)
            .map(([name, data]) => ({
              name,
              playerCount: data.players.length,
              games: [...data.games].sort(),
              topMouse: Object.entries(data.mice).sort((a, b) => b[1] - a[1])[0]?.[0] || "—",
              countries: [...new Set(data.players.map(p => p.country).filter(Boolean))],
            }))
            .sort((a, b) => b.playerCount - a.playerCount);

          const allTeamGames = ["All", ...new Set(teamList.flatMap(t => t.games))].sort();

          const filteredTeams = teamList
            .filter(t => teamGameFilter === "All" || t.games.includes(teamGameFilter))
            .filter(t => t.name.toLowerCase().includes(teamSearch.toLowerCase()))
            .sort((a, b) => {
              if (teamSortBy === "playerCount") return b.playerCount - a.playerCount;
              if (teamSortBy === "name") return a.name.localeCompare(b.name);
              if (teamSortBy === "games") return b.games.length - a.games.length;
              return 0;
            });

          const gameColors = GAME_COLORS;

          return (
          <div>
            <SectionTitle color={teamColor} sub={`${teamList.length} organizations across ${allTeamGames.length - 1} games — click any team for details`}>Pro Teams</SectionTitle>

            {/* ── UNIFIED FILTER BAR ── */}
            {(() => {
              const TEAM_SORT_OPTIONS = [
                { value: "playerCount", label: "Most Players" },
                { value: "name", label: "Name A-Z" },
                { value: "games", label: "Most Games" },
              ];
              const teamSortLabel = TEAM_SORT_OPTIONS.find(o => o.value === teamSortBy)?.label || "Most Players";
              const activeTeamFilterCount = teamGameFilter !== "All" ? 1 : 0;
              const accentT = teamColor;
              const chipStyleT = (active, chipColor) => ({
                padding: "5px 10px", borderRadius: 7, fontSize: 12, fontWeight: 700, cursor: "pointer",
                background: active ? (chipColor ? `${chipColor}18` : `${accentT}20`) : "#0a0a0a",
                border: `1px solid ${active ? (chipColor ? `${chipColor}50` : `${accentT}50`) : "#ffffff0a"}`,
                color: active ? (chipColor || accentT) : "#ffffff50",
                transition: "all 0.15s", whiteSpace: "nowrap",
              });

              return (
                <div className="mb-5" style={{ background: "#111", border: "1px solid #ffffff0a", borderRadius: 12, padding: 10, position: "relative" }}>
                  <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 1, borderRadius: "12px 12px 0 0", background: `linear-gradient(90deg, transparent, ${accentT}50, transparent)` }} />

                  <div className="flex gap-2.5 items-center" style={{ marginBottom: showTeamFilters ? 10 : 0, transition: "margin 0.3s" }}>
                    <div className="flex-1 relative" style={{ minWidth: 0 }}>
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", opacity: 0.25 }}><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
                      <input type="text" placeholder={`Search ${teamList.length} teams...`} value={teamSearch} onChange={e => setTeamSearch(e.target.value)}
                        className="w-full outline-none" style={{ padding: "7px 12px 7px 34px", background: "#0a0a0a", border: "1px solid #ffffff0a", borderRadius: 10, color: "#fff", fontFamily: "inherit", fontSize: 14 }} />
                    </div>

                    <div className="relative">
                      <button className="flex items-center gap-1.5" onClick={() => setShowTeamSortDrop(!showTeamSortDrop)}
                        style={{ padding: "7px 12px", background: "#0a0a0a", border: `1px solid ${showTeamSortDrop ? `${accentT}50` : "#ffffff0a"}`, borderRadius: 10, color: showTeamSortDrop ? accentT : "#ffffffa0", fontFamily: "inherit", fontSize: 13, fontWeight: 600, cursor: "pointer", whiteSpace: "nowrap" }}>
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M3 6h18M6 12h12M9 18h6"/></svg>
                        <span style={{ color: "#ffffff50", fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: 0.5 }}>Sort</span>
                        <span style={{ color: accentT, fontWeight: 700 }}>{teamSortLabel}</span>
                        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M6 9l6 6 6-6"/></svg>
                      </button>
                      {showTeamSortDrop && (
                        <>
                        <div style={{ position: "fixed", inset: 0, zIndex: 99 }} onClick={() => setShowTeamSortDrop(false)} />
                        <div className="absolute" style={{ top: "calc(100% + 6px)", right: 0, background: "#161616", border: "1px solid #ffffff15", borderRadius: 10, padding: 4, minWidth: 180, zIndex: 100, boxShadow: "0 12px 40px rgba(0,0,0,0.5)" }}>
                          {TEAM_SORT_OPTIONS.map(o => (
                            <div key={o.value} className="flex items-center justify-between cursor-pointer"
                              style={{ padding: "8px 12px", borderRadius: 7, fontSize: 13, fontWeight: 600, color: teamSortBy === o.value ? accentT : "#ffffffa0", transition: "all 0.15s" }}
                              onMouseEnter={e => { if (teamSortBy !== o.value) e.currentTarget.style.background = `${accentT}20`; }}
                              onMouseLeave={e => { e.currentTarget.style.background = "transparent"; }}
                              onClick={() => { setTeamSortBy(o.value); setShowTeamSortDrop(false); }}>
                              {o.label}
                              {teamSortBy === o.value && <span style={{ fontSize: 12 }}>✓</span>}
                            </div>
                          ))}
                        </div>
                        </>
                      )}
                    </div>

                    <button className="flex items-center gap-1.5"
                      onClick={() => setShowTeamFilters(!showTeamFilters)}
                      style={{ padding: "7px 12px", background: (showTeamFilters || activeTeamFilterCount > 0) ? `${accentT}20` : "#0a0a0a", border: `1px solid ${(showTeamFilters || activeTeamFilterCount > 0) ? `${accentT}50` : "#ffffff0a"}`, borderRadius: 10, color: (showTeamFilters || activeTeamFilterCount > 0) ? accentT : "#ffffffa0", fontFamily: "inherit", fontSize: 13, fontWeight: 700, cursor: "pointer", whiteSpace: "nowrap" }}>
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M22 3H2l8 9.46V19l4 2v-8.54L22 3z"/></svg>
                      Filters
                      {activeTeamFilterCount > 0 && <span style={{ width: 18, height: 18, borderRadius: "50%", background: accentT, color: "#000", fontSize: 11, fontWeight: 800, display: "flex", alignItems: "center", justifyContent: "center" }}>{activeTeamFilterCount}</span>}
                    </button>
                  </div>

                  <div style={{ maxHeight: showTeamFilters ? 500 : 0, overflow: "hidden", opacity: showTeamFilters ? 1 : 0, transition: "max-height 0.35s cubic-bezier(0.4,0,0.2,1), opacity 0.25s" }}>
                    <div>
                      <div style={{ fontSize: 10, fontWeight: 800, textTransform: "uppercase", letterSpacing: 1, color: "#ffffff50", marginBottom: 5, paddingLeft: 2 }}>Game</div>
                      <div className="flex flex-wrap gap-1">
                        <span style={chipStyleT(teamGameFilter === "All")} onClick={() => setTeamGameFilter("All")}>All</span>
                        {allTeamGames.filter(g => g !== "All").map(g => (
                          <span key={g} style={chipStyleT(teamGameFilter === g, gameColors[g])} onClick={() => setTeamGameFilter(teamGameFilter === g ? "All" : g)}>{g}</span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {!showTeamFilters && teamGameFilter !== "All" && (
                    <div className="flex flex-wrap gap-1.5" style={{ marginTop: 12, paddingTop: 12, borderTop: "1px solid #ffffff0a" }}>
                      <span className="inline-flex items-center gap-1.5" style={{ padding: "4px 10px", borderRadius: 20, fontSize: 12, fontWeight: 700, background: `${gameColors[teamGameFilter] || accentT}20`, color: gameColors[teamGameFilter] || accentT, border: `1px solid ${gameColors[teamGameFilter] || accentT}50` }}>
                        {teamGameFilter} <span className="cursor-pointer opacity-50 hover:opacity-100" style={{ fontSize: 11 }} onClick={() => setTeamGameFilter("All")}>✕</span>
                      </span>
                    </div>
                  )}
                </div>
              );
            })()}

            <div className="text-sm opacity-40 mb-4">{filteredTeams.length} {filteredTeams.length === 1 ? "team" : "teams"} found</div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
              {filteredTeams.map(team => {
                const primaryGame = team.games[0];
                const gc = gameColors[primaryGame] || teamColor;
                return (
                  <div key={team.name}
                    onClick={() => { window.location.href = `/teams/${team.name.toLowerCase().replace(/\+/g, "-plus").replace(/[^a-z0-9]+/g, "-").replace(/-+$/, "")}`; }}
                    className="rounded-xl p-4 cursor-pointer transition-all duration-200 group hover:scale-[1.02] flex flex-col"
                    style={{ background: "linear-gradient(135deg, #0d0d0d, #1a1a1a)", border: `1px solid ${gc}15` }}
                    onMouseEnter={e => { e.currentTarget.style.border = `1px solid ${gc}50`; e.currentTarget.style.boxShadow = `0 0 20px ${gc}15`; }}
                    onMouseLeave={e => { e.currentTarget.style.border = `1px solid ${gc}15`; e.currentTarget.style.boxShadow = "none"; }}>
                    <div className="w-12 h-12 rounded-lg flex items-center justify-center mb-3 mx-auto overflow-hidden" style={{ background: `${gc}15`, border: `1px solid ${gc}25` }}>
                      {TEAM_LOGOS[team.name] ? <img loading="lazy" src={TEAM_LOGOS[team.name]} alt={team.name} className="w-10 h-10 object-contain" onError={e => { e.target.style.display = "none"; e.target.parentElement.querySelector('.team-fallback').style.display = "block"; }} /> : null}
                      <Shield size={24} className="team-fallback" style={{ color: gc, display: TEAM_LOGOS[team.name] ? "none" : "block" }} />
                    </div>
                    <div className="text-sm font-bold text-center mb-1 leading-tight" style={{ color: gc, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>{team.name}</div>
                    <div className="text-center mb-2">
                      <span className="text-lg font-black">{team.playerCount}</span>
                      <span className="text-xs opacity-40 ml-1">{team.playerCount === 1 ? "player" : "players"}</span>
                    </div>
                    <div className="flex flex-wrap gap-1 justify-center mb-2">
                      {team.games.slice(0, 3).map(g => (
                        <span key={g} className="px-1.5 py-0.5 rounded text-center" style={{ background: `${gameColors[g] || "#888"}15`, color: gameColors[g] || "#888", fontSize: 10, border: `1px solid ${gameColors[g] || "#888"}25` }}>{g}</span>
                      ))}
                      {team.games.length > 3 && <span className="px-1.5 py-0.5 rounded text-center opacity-40" style={{ fontSize: 10 }}>+{team.games.length - 3}</span>}
                    </div>
                    <div className="mt-auto pt-2" style={{ borderTop: "1px solid #ffffff06" }}>
                      <div className="text-center opacity-40" style={{ fontSize: 10 }}>TOP MOUSE</div>
                      <div className="text-center font-bold truncate" style={{ fontSize: 11, color: "#ffffffa0" }}>{team.topMouse}</div>
                    </div>
                  </div>
                );
              })}
            </div>
            {filteredTeams.length === 0 && (
              <div className="text-center py-16 opacity-40">
                <div className="text-2xl mb-2">No teams match your search</div>
                <div className="text-sm">Try adjusting your search or filter</div>
              </div>
            )}
          </div>
          );
        })()}

        {/* ── TEAM DETAIL PAGE ── */}
        {activeTab === "teamDetail" && selectedTeam && (() => {
          const tc = "#38bdf8";
          const teamPlayers = allPlayers.filter(p => p.team === selectedTeam);
          const seen = new Set();
          const uniquePlayers = teamPlayers.filter(p => {
            const key = p.name + "|" + p.game;
            if (seen.has(key)) return false;
            seen.add(key);
            return true;
          });

          const byGame = {};
          uniquePlayers.forEach(p => {
            if (!byGame[p.game]) byGame[p.game] = [];
            byGame[p.game].push(p);
          });
          const gameEntries = Object.entries(byGame).sort((a, b) => b[1].length - a[1].length);

          const mouseCounts = {};
          uniquePlayers.forEach(p => { if (p.mouse && p.mouse !== "Unknown") mouseCounts[p.mouse] = (mouseCounts[p.mouse] || 0) + 1; });
          const topMice = Object.entries(mouseCounts).sort((a, b) => b[1] - a[1]).slice(0, 8);

          const brandCounts = {};
          uniquePlayers.forEach(p => {
            if (p.mouse) {
              const brand = p.mouse.split(" ")[0];
              brandCounts[brand] = (brandCounts[brand] || 0) + 1;
            }
          });
          const topBrands = Object.entries(brandCounts).sort((a, b) => b[1] - a[1]).slice(0, 6);

          const edpis = uniquePlayers.map(p => p.edpi).filter(e => e && e > 0);
          const avgEdpi = edpis.length ? Math.round(edpis.reduce((a, b) => a + b, 0) / edpis.length) : null;
          const dpis = uniquePlayers.map(p => p.dpi).filter(d => d && d > 0);
          const avgDpi = dpis.length ? Math.round(dpis.reduce((a, b) => a + b, 0) / dpis.length) : null;

          const countries = [...new Set(uniquePlayers.map(p => p.country).filter(Boolean))];

          const gameColors = GAME_COLORS;

          return (
          <div>
            <nav aria-label="Breadcrumb" className="mb-4 flex items-center gap-1.5 text-sm">
              <a href="/" className="opacity-30 hover:opacity-60 transition-all no-underline" style={{ color: "#fff", textDecoration: "none" }}>Home</a>
              <span className="opacity-15">›</span>
              <a href="/teams" className="opacity-30 hover:opacity-60 transition-all no-underline" style={{ color: "#fff", textDecoration: "none" }}>Teams</a>
              <span className="opacity-15">›</span>
              <span style={{ color: tc }} className="font-bold opacity-70">{selectedTeam}</span>
            </nav>

            <div className="rounded-2xl p-6 sm:p-8 mb-6" style={{ background: "linear-gradient(135deg, #0d0d0d, #111)", border: `1px solid ${tc}20` }}>
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-4">
                <div className="w-16 h-16 rounded-xl flex items-center justify-center overflow-hidden" style={{ background: `${tc}15`, border: `1px solid ${tc}30` }}>
                  {TEAM_LOGOS[selectedTeam] ? <img loading="lazy" src={TEAM_LOGOS[selectedTeam]} alt={selectedTeam} className="w-14 h-14 object-contain" onError={e => { e.target.style.display = "none"; e.target.parentElement.querySelector('.team-fallback').style.display = "block"; }} /> : null}
                  <Shield size={36} className="team-fallback" style={{ color: tc, display: TEAM_LOGOS[selectedTeam] ? "none" : "block" }} />
                </div>
                <div>
                  <div className="text-2xl sm:text-3xl font-black" style={{ fontFamily: "Orbitron", color: tc }}>{selectedTeam}</div>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {gameEntries.map(([game]) => (
                      <span key={game} className="px-2.5 py-1 rounded-lg text-xs font-bold cursor-pointer transition-all hover:scale-105 hover:brightness-125"
                        style={{ background: `${gameColors[game] || "#888"}20`, color: gameColors[game] || "#888", border: `1px solid ${gameColors[game] || "#888"}30` }}
                        onClick={() => { setGameDetailSlug(game.toLowerCase().replace(/\+/g, "-plus").replace(/[^a-z0-9]+/g, "-").replace(/-+$/, "")); setActiveTab("games"); window.scrollTo({ top: 0, behavior: "smooth" }); }}>{game}</span>
                    ))}
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4">
                {[
                  { label: "Players Tracked", value: uniquePlayers.length, color: tc },
                  { label: "Games", value: gameEntries.length, color: "#00ff6a" },
                  { label: "Avg DPI", value: avgDpi || "—", color: "#f59e0b" },
                  { label: "Avg eDPI", value: avgEdpi || "—", color: "#8b5cf6" },
                ].map(s => (
                  <div key={s.label} className="rounded-xl p-3 text-center" style={{ background: "#0a0a0a", border: `1px solid ${s.color}15` }}>
                    <div className="text-lg sm:text-xl font-black" style={{ color: s.color }}>{s.value}</div>
                    <div className="text-xs opacity-40">{s.label}</div>
                  </div>
                ))}
              </div>
              {countries.length > 0 && (
                <div className="mt-4 flex items-center gap-2">
                  <span className="text-xs opacity-30">Nationalities:</span>
                  <div className="flex flex-wrap gap-1.5">{countries.map((c, i) => <Flag key={i} country={c} size={20} />)}</div>
                </div>
              )}
            </div>

            {/* Team Bio & Achievements */}
            {TEAM_DESCRIPTIONS[selectedTeam] && (
              <div className="mb-6 rounded-xl p-5 sm:p-6" style={{ background: "#0a0a0a", border: "1px solid #ffffff08" }}>
                {TEAM_DESCRIPTIONS[selectedTeam].bio && (
                  <div className="mb-4">
                    <div className="text-xs uppercase tracking-widest font-bold mb-3" style={{ color: tc }}>About</div>
                    <p className="text-sm leading-relaxed opacity-70">{TEAM_DESCRIPTIONS[selectedTeam].bio}</p>
                  </div>
                )}
                {TEAM_DESCRIPTIONS[selectedTeam].achievements && (
                  <div>
                    <div className="text-xs uppercase tracking-widest font-bold mb-3" style={{ color: "#f59e0b" }}>Top Achievements</div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                      {TEAM_DESCRIPTIONS[selectedTeam].achievements.map((a, i) => (
                        <div key={i} className="flex items-start gap-2 text-sm">
                          <span className="font-bold shrink-0" style={{ color: "#f59e0b" }}>#{i + 1}</span>
                          <span className="opacity-60">{a}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {topMice.length > 0 && (
              <div className="mb-6">
                <div className="text-xs uppercase tracking-widest font-bold mb-3" style={{ color: tc }}>Mouse Breakdown</div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {topMice.map(([mouse, count]) => {
                    const pct = Math.round((count / uniquePlayers.length) * 100);
                    return (
                      <div key={mouse} className="rounded-xl p-3 relative overflow-hidden cursor-pointer transition-all hover:scale-[1.02] hover:brightness-110"
                        style={{ background: "#0a0a0a", border: "1px solid #ffffff08" }}
                        onClick={() => { const mm = mice.find(mm => mm.name === mouse || mouse.includes(mm.name)); if (mm) { setSelectedMouse(mm); setActiveTab("mouseDetail"); window.scrollTo({ top: 0, behavior: "smooth" }); } }}>
                        <div className="absolute bottom-0 left-0 h-1 rounded-full" style={{ width: `${pct}%`, background: tc, opacity: 0.5 }} />
                        <div className="text-sm font-bold truncate hover:underline" style={{ color: "#ffffffd0" }}>{mouse}</div>
                        <div className="flex items-baseline gap-1.5 mt-1">
                          <span className="text-lg font-black" style={{ color: tc }}>{count}</span>
                          <span className="text-xs opacity-30">{count === 1 ? "player" : "players"} · {pct}%</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {topBrands.length > 0 && (
              <div className="mb-6">
                <div className="text-xs uppercase tracking-widest font-bold mb-3" style={{ color: tc }}>Brand Share</div>
                <div className="flex flex-wrap gap-2">
                  {topBrands.map(([brand, count]) => {
                    const pct = Math.round((count / uniquePlayers.length) * 100);
                    return (
                      <div key={brand} className="rounded-lg px-3 py-2 flex items-center gap-2 cursor-pointer transition-all hover:scale-105 hover:brightness-110"
                        style={{ background: "#0a0a0a", border: "1px solid #ffffff08" }}
                        onClick={() => { setActiveTab("brands"); window.scrollTo({ top: 0, behavior: "smooth" }); }}>
                        <span className="text-sm font-bold">{brand}</span>
                        <span className="text-xs px-1.5 py-0.5 rounded-full font-bold" style={{ background: `${tc}15`, color: tc }}>{pct}%</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {gameEntries.map(([game, players]) => {
              const gc = gameColors[game] || tc;
              const isOpen = expandedRosters[game] || false;
              return (
                <div key={game} className="mb-3">
                  <button onClick={() => setExpandedRosters(prev => ({ ...prev, [game]: !prev[game] }))}
                    className="w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all hover:brightness-110"
                    style={{ background: "#0a0a0a", border: `1px solid ${gc}20` }}>
                    <div className="flex items-center gap-2">
                      <span className="text-xs uppercase tracking-widest font-bold" style={{ color: gc }}>{game} Roster</span>
                      <span className="text-xs px-2 py-0.5 rounded-full font-bold" style={{ background: `${gc}15`, color: gc }}>{players.length}</span>
                    </div>
                    <span className="text-sm transition-transform" style={{ color: gc, transform: isOpen ? "rotate(180deg)" : "rotate(0deg)" }}>▼</span>
                  </button>
                  {isOpen && (
                  <div className="rounded-xl overflow-hidden mt-1" style={{ border: "1px solid #ffffff08" }}>
                    {(() => {
                      const hasRoles = players.some(p => p.role && p.role !== "—");
                      return (<>
                    <div className="hidden sm:grid px-4 py-2 text-xs uppercase tracking-widest opacity-30 items-center" style={{ background: "#0a0a0a", gridTemplateColumns: hasRoles ? "20% 10% 30% 12% 12% 12%" : "22% 38% 12% 12% 12%" }}>
                      <div>Player</div>
                      {hasRoles && <div>Role</div>}
                      <div>Mouse</div>
                      <div className="text-center">DPI</div>
                      <div className="text-center">eDPI</div>
                      <div className="text-center">Hz</div>
                    </div>
                    {players.map((p, i) => (
                      <div key={p.name + i} className="grid px-4 py-3 items-center transition-all hover:bg-white/[0.02]"
                        style={{ borderTop: i > 0 ? "1px solid #ffffff06" : "none", gridTemplateColumns: hasRoles ? "20% 10% 30% 12% 12% 12%" : "22% 38% 12% 12% 12%" }}>
                        <div className="flex items-center gap-2 min-w-0">
                          <Flag country={p.country} size={18} className="shrink-0" />
                          <span className="text-sm font-bold truncate cursor-pointer hover:underline" style={{ color: "#fff" }}
                            onClick={() => { const pp = proPlayers.find(pp => pp.name === p.name); if (pp) { setSelectedPlayer(pp); setActiveTab("players"); window.scrollTo({ top: 0, behavior: "smooth" }); } }}>{p.name}</span>
                        </div>
                        {hasRoles && <div>
                          {p.role && p.role !== "—" ? <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: `${gc}15`, color: gc }}>{p.role}</span> : null}
                        </div>}
                        <div className="text-sm truncate">
                          <span className="opacity-80 cursor-pointer hover:underline hover:opacity-100 transition-opacity"
                            onClick={() => { const mm = mice.find(mm => mm.name === p.mouse || p.mouse?.includes(mm.name)); if (mm) { setSelectedMouse(mm); setActiveTab("mouseDetail"); window.scrollTo({ top: 0, behavior: "smooth" }); } }}>{p.mouse || "Unknown"}</span>
                        </div>
                        <div className="text-center text-sm opacity-60">{p.dpi || "—"}</div>
                        <div className="text-center text-sm font-bold" style={{ color: gc }}>{p.edpi || "—"}</div>
                        <div className="text-center text-sm opacity-60">{p.hz ? p.hz.toLocaleString() : "—"}</div>
                      </div>
                    ))}
                    </>);
                    })()}
                  </div>
                  )}
                </div>
              );
            })}
          </div>
          );
        })()}

        {/* ── Mini Newsletter CTA ── */}
        {activeTab !== "overview" && (
        <div className="flex justify-end mt-10 mb-2">
        <div className="rounded-lg px-4 py-2.5 flex items-center gap-3 flex-wrap w-fit" style={{ background: "linear-gradient(135deg, #00ff6a06, #00b4ff04)", border: "1px solid #00ff6a10" }}>
          <span className="text-sm font-black text-white">Stay ahead of the meta</span>
          <span className="opacity-20 text-sm hidden sm:inline">·</span>
          <span style={{ fontSize: 12 }} className="opacity-30 hidden sm:inline">Pro gear changes & data insights</span>
          {newsletterStatus === "success" ? (
            <span style={{ fontSize: 12, color: "#00ff6a" }} className="font-bold">✓ Subscribed!</span>
          ) : (
            <form className="flex gap-1.5" onSubmit={async e => { e.preventDefault(); setNewsletterStatus("sending"); try { const res = await fetch("https://formspree.io/f/xvzbwrzv", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email: newsletterEmail }) }); setNewsletterStatus(res.ok ? "success" : "error"); } catch { setNewsletterStatus("error"); } }}>
              <input type="email" required placeholder="your@email.com" value={newsletterEmail} onChange={e => setNewsletterEmail(e.target.value)}
                className="w-36 px-2.5 py-1 rounded-md outline-none" style={{ background: "#0a0a0a", border: "1px solid #ffffff10", color: "#fff", fontSize: 12 }} />
              <button type="submit" disabled={newsletterStatus === "sending"} className="px-3 py-1 rounded-md font-black transition-all hover:scale-105 disabled:opacity-50" style={{ background: "#00ff6a", color: "#000", fontSize: 12 }}>
                {newsletterStatus === "sending" ? "..." : "Subscribe"}
              </button>
            </form>
          )}
        </div>
        </div>
        )}

      </main>

      {/* ─── SCROLL TO TOP ─── */}
      {showScrollTop && (
        <button aria-label="Scroll to top" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="fixed bottom-6 right-6 z-50 w-11 h-11 rounded-full flex items-center justify-center transition-all hover:scale-110"
          style={{ background: "#00ff6a", color: "#000", boxShadow: "0 4px 20px #00ff6a40" }}>
          ▲
        </button>
      )}

      {/* ─── FOOTER ─── */}
      <footer role="contentinfo" aria-label="Site footer" className="border-t py-12 px-6" style={{ borderColor: "#ffffff08", background: "#030303" }}>
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <span className="inline-block">{I.mouse(24)}</span>
                <span style={{ fontFamily: "Orbitron", fontSize: 15, letterSpacing: 4, color: "#00ff6a" }}>ESPORTSMICE</span>
              </div>
              <p className="text-sm opacity-30 leading-relaxed">{`The definitive resource for professional esports mice. Data from ${allPlayers.length}+ pro players across ${new Set(allPlayers.map(p=>p.game)).size} major competitive titles.`}</p>
              <p className="text-xs opacity-20 mt-2">Data last updated: February 2026</p>
            </div>
            <div>
              <div className="text-sm uppercase tracking-widest opacity-30 mb-3">Best Mice By Game</div>
              <div className="space-y-2 text-sm">
                {[
                  { label: "Best for CS2", href: "/best/cs2", color: "#ff8c00" },
                  { label: "Best for Valorant", href: "/best/valorant", color: "#ff4655" },
                  { label: "Best for Fortnite", href: "/best/fortnite", color: "#4c7bd9" },
                  { label: "Best for Apex", href: "/best/apex", color: "#dc2626" },
                  { label: "Best for LoL", href: "/best/lol", color: "#c89b3c" },
                  { label: "Best for R6 Siege", href: "/best/r6-siege", color: "#4a86c8" },
                  { label: "Best for OW2", href: "/best/overwatch-2", color: "#f99e1a" },
                  { label: "Best Wireless", href: "/best/wireless", color: "#00ff6a" },
                  { label: "Best Lightweight", href: "/best/lightweight", color: "#a78bfa" },
                  { label: "Best Budget", href: "/best/budget", color: "#f59e0b" },
                ].map(g => (
                  <a key={g.href} href={g.href} className="block hover:opacity-80 transition-all no-underline" style={{ color: g.color, textDecoration: "none" }}>{g.label}</a>
                ))}
              </div>
            </div>
            <div>
              <div className="text-sm uppercase tracking-widest opacity-30 mb-3">Games</div>
              <div className="space-y-2 text-sm">
                {[
                  { name: "Counter-Strike 2", slug: "cs2", color: "#ff8c00" },
                  { name: "Valorant", slug: "valorant", color: "#ff4655" },
                  { name: "League of Legends", slug: "lol", color: "#c89b3c" },
                  { name: "Fortnite", slug: "fortnite", color: "#4c7bd9" },
                  { name: "Apex Legends", slug: "apex", color: "#dc2626" },
                  { name: "Dota 2", slug: "dota-2", color: "#e74c3c" },
                  { name: "R6 Siege", slug: "r6-siege", color: "#4a86c8" },
                  { name: "Overwatch 2", slug: "overwatch-2", color: "#f99e1a" },
                  { name: "Rocket League", slug: "rocket-league", color: "#1a9fff" },
                ].map(g => (
                  <a key={g.slug} href={`/games/${g.slug}`} className="block hover:opacity-80 transition-all no-underline" style={{ color: g.color, textDecoration: "none" }}>{g.name}</a>
                ))}
              </div>
            </div>
            <div>
              <div className="text-sm uppercase tracking-widest opacity-30 mb-3">Top Brands</div>
              <div className="space-y-2 text-sm">
                {["Razer", "Logitech", "Zowie", "Finalmouse", "Lamzu", "Pulsar", "SteelSeries", "Endgame"].map(b => (
                  <a key={b} href={`/brands/${b.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`} className="block hover:opacity-80 transition-all no-underline" style={{ color: BRAND_COLORS[b] || "#888", textDecoration: "none" }}>{b}</a>
                ))}
              </div>
            </div>
            <div>
              <div className="text-sm uppercase tracking-widest opacity-30 mb-3">Resources</div>
              <div className="space-y-2 text-sm">
                {[
                  { label: "All Mice", href: "/mice" },
                  { label: "Mouse Rankings", href: "/rankings" },
                  { label: "Pro Player Settings", href: "/players" },
                  { label: "Compare Mice", href: "/compare" },
                  { label: "Sensitivity Converter", href: "/sensitivity" },
                  { label: "Sensor Database", href: "/sensors" },
                  { label: "Best Mice Guides", href: "/best" },
                  { label: "Blog", href: "/blog" },
                  { label: "Industry Trends", href: "/trends" },
                  { label: "Pro Teams", href: "/teams" },
                  { label: "Contact Us", href: "/contact" },
                  { label: "About Our Data", href: "/about" },
                ].map(r => (
                  <a key={r.label} href={r.href} className="block cursor-pointer hover:opacity-80 transition-all opacity-50 hover:opacity-70 no-underline" style={{ color: "#fff", textDecoration: "none" }}>{r.label}</a>
                ))}
              </div>
            </div>
          </div>
          {/* Popular Comparisons */}
          <div className="mb-6 pb-6 border-b" style={{ borderColor: "#ffffff08" }}>
            <div className="text-xs uppercase tracking-widest opacity-20 mb-3">Popular Comparisons</div>
            <div className="flex flex-wrap gap-2">
              {[
                { a: "Razer Viper V3 Pro", b: "Logitech G Pro X Superlight 2" },
                { a: "Razer Viper V3 Pro", b: "Razer DeathAdder V4 Pro" },
                { a: "Logitech G Pro X Superlight 2", b: "Logitech G Pro X Superlight" },
                { a: "Razer Viper V3 Pro", b: "Razer Viper V2 Pro" },
                { a: "Razer DeathAdder V4 Pro", b: "Razer DeathAdder V3 Pro" },
                { a: "Logitech G Pro X Superlight 2", b: "Razer DeathAdder V4 Pro" },
              ].map(c => {
                const sa = c.a.toLowerCase().replace(/\+/g, "-plus").replace(/[^a-z0-9]+/g, "-").replace(/-+$/, "");
                const sb = c.b.toLowerCase().replace(/\+/g, "-plus").replace(/[^a-z0-9]+/g, "-").replace(/-+$/, "");
                return <a key={sa+sb} href={`/compare/${sa}-vs-${sb}`} className="text-xs px-2.5 py-1 rounded-full no-underline transition-all hover:opacity-80" style={{ background: "#ffffff06", border: "1px solid #ffffff08", color: "#ffffff50", textDecoration: "none" }}>{c.a.replace(/(Logitech |Razer )/, "")} vs {c.b.replace(/(Logitech |Razer )/, "")}</a>;
              })}
            </div>
          </div>
          {/* Newsletter */}
          <div className="flex items-center gap-3 mb-8 pb-6 border-b" style={{ borderColor: "#ffffff08" }}>
            <span style={{ fontSize: 12, color: "#00ff6a", letterSpacing: 2 }} className="font-black uppercase flex-shrink-0">Newsletter</span>
            <span style={{ fontSize: 12 }} className="opacity-20 hidden sm:inline">·</span>
            <span style={{ fontSize: 12 }} className="opacity-25 flex-shrink-0 hidden sm:inline">Pro gear updates & data insights</span>
            {newsletterStatus === "success" ? (
              <span style={{ fontSize: 11, color: "#00ff6a" }} className="font-black">✓ Subscribed</span>
            ) : (
              <form className="flex gap-1.5" onSubmit={async e => { e.preventDefault(); setNewsletterStatus("sending"); try { const res = await fetch("https://formspree.io/f/xvzbwrzv", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email: newsletterEmail }) }); setNewsletterStatus(res.ok ? "success" : "error"); } catch { setNewsletterStatus("error"); } }}>
                <input type="email" required placeholder="your@email.com" value={newsletterEmail} onChange={e => setNewsletterEmail(e.target.value)}
                  className="w-36 sm:w-44 px-2.5 py-1.5 rounded-md outline-none" style={{ background: "#0a0a0a", border: "1px solid #ffffff10", color: "#fff", fontSize: 12 }} />
                <button type="submit" disabled={newsletterStatus === "sending"} className="px-3 py-1.5 rounded-md font-black transition-all hover:scale-105 disabled:opacity-50" style={{ background: "#00ff6a", color: "#000", fontSize: 12 }}>
                  {newsletterStatus === "sending" ? "..." : "Join"}
                </button>
              </form>
            )}
          </div>
          <div className="border-t pt-6 flex flex-wrap justify-between items-center text-sm opacity-20 gap-2" style={{ borderColor: "#ffffff08" }}>
            <span>© 2026 EsportsMice.com  -  All rights reserved</span>
            <span>Data last updated: February 2026 · {allPlayers.length} players · {mice.length} mice</span>
            <span>As an Amazon Associate, EsportsMice earns from qualifying purchases</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
