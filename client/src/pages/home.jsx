import heroImg from '../assets/hero.png'
import crafterImg from '../assets/crafter.png'
import commercial1Img from '../assets/commercial-1.png'
import commercial2Img from '../assets/commercial-2.png'
import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'

const NAV_LINKS = [
  { label: 'Home', path: '/' },
  { label: 'Our Works', path: '/portfolio' },
  { label: 'Contact', path: '/contact' },
]

const WHY_ITEMS = [
  { num: '01', title: 'Preserving Value', desc: 'Professional leather repair is a craft that restores value, durability, and character to worn items.' },
  { num: '02', title: 'Expert Solutions', desc: 'We provide restoration for furniture, automotive interiors, handbags, and apparel, extending the life of leather while preserving its original feel.' },
  { num: '03', title: 'Precision Craft', desc: 'Using industry-proven techniques and precise color matching to bring damaged leather back to life.' },
  { num: '04', title: 'Sustainable Quality', desc: 'Instead of replacing expensive items, we offer a practical, cost-effective, and eco-friendly alternative.' },
]

const SERVICES = [
  { label: 'Hotels & Lobbies', desc: 'Maintain your luxury aesthetic with expert leather furniture restoration' },
  { label: 'Restaurants & Bars', desc: 'Keep your booths and seating looking brand new without replacement costs' },
  { label: 'Corporate Offices', desc: 'On-site repairs for executive chairs and conference room furniture' },
]

const CATEGORIES = ['Furniture', 'Automotive', 'Handbags', 'Footwear']

const HOURS = [
  { day: 'Mon – Fri', time: '9:00 AM – 6:00 PM' },
  { day: 'Saturday', time: '10:00 AM – 4:00 PM' },
  { day: 'Sunday', time: 'Closed' },
]

function useReveal() {
  const ref = useRef(null)
  const [visible, setVisible] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const io = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); io.disconnect() } },
      { threshold: 0.15 }
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])
  return [ref, visible]
}

function Reveal({ children, delay = 0, className = '', style: outerStyle = {} }) {
  const [ref, visible] = useReveal()
  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(32px)',
        transition: `opacity 0.7s ease ${delay}ms, transform 0.7s ease ${delay}ms`,
        ...outerStyle,
      }}
    >
      {children}
    </div>
  )
}

export default function Home() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <div style={{ background: '#121212', color: '#fff', fontFamily: 'Georgia, serif', overflowX: 'hidden' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;500;600&family=DM+Sans:wght@300;400;500&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        :root {
          --gold: #E17100; --gold-light: #FFB900; --gold-pale: #FEF3C6;
          --bg: #121212; --bg2: #1A1A1A; --border: #262626;
          --text-dim: #A1A1A1; --text-mid: #D4D4D4;
          --serif: 'Cormorant Garamond', Georgia, serif;
          --sans: 'DM Sans', sans-serif;
        }
        html { scroll-behavior: smooth; }
        .nav-link { font-family: var(--sans); font-size: 13px; font-weight: 500; text-transform: uppercase; letter-spacing: 1.8px; color: var(--text-mid); text-decoration: none; transition: color 0.2s; cursor: pointer; }
        .nav-link:hover, .nav-link.active { color: var(--gold-light); }
        .btn-primary { display: inline-flex; align-items: center; justify-content: center; padding: 15px 40px; background: var(--gold); color: #fff; font-family: var(--sans); font-size: 15px; border-radius: 5px; border: none; cursor: pointer; box-shadow: 0 10px 30px -6px rgba(123,51,6,0.45); transition: background 0.2s, transform 0.15s; text-decoration: none; }
        .btn-primary:hover { background: #c96500; transform: translateY(-1px); }
        .btn-outline { display: inline-flex; align-items: center; justify-content: center; padding: 15px 40px; background: transparent; color: var(--gold-light); font-family: var(--sans); font-size: 15px; border-radius: 5px; border: 1.2px solid var(--gold); cursor: pointer; transition: background 0.2s; text-decoration: none; }
        .btn-outline:hover { background: rgba(225,113,0,0.08); }
        .tag-chip { padding: 10px 20px; background: #171717; border: 1.2px solid var(--border); border-radius: 5px; color: var(--gold-light); font-family: var(--sans); font-size: 13px; font-weight: 500; white-space: nowrap; }
        .service-card { background: rgba(23,23,23,0.6); border: 1.2px solid var(--border); border-radius: 6px; padding: 40px 32px; transition: border-color 0.25s, transform 0.25s; }
        .service-card:hover { border-color: rgba(225,113,0,0.4); transform: translateY(-4px); }
        .why-item { display: grid; grid-template-columns: 180px 1fr; gap: 0 32px; align-items: start; }
        @keyframes fadeUp { from { opacity:0; transform:translateY(28px); } to { opacity:1; transform:translateY(0); } }
        @media (max-width: 900px) {
          .why-item { grid-template-columns: 80px 1fr; }
          .craft-grid { flex-direction: column !important; }
          .footer-grid { grid-template-columns: 1fr !important; gap: 40px !important; }
          .services-row { flex-direction: column !important; }
          .commercial-grid { grid-template-columns: 1fr !important; }
        }
        @media (max-width: 600px) {
          .why-item { grid-template-columns: 1fr; }
          .num-col { display: none; }
          .cats { flex-wrap: wrap; }
        }
      `}</style>

      {/* NAVBAR */}
      <header style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
        background: scrolled ? 'rgba(18,18,18,0.97)' : 'rgba(18,18,18,0.92)',
        borderBottom: '1.2px solid rgba(38,38,38,0.5)',
        backdropFilter: 'blur(12px)', transition: 'background 0.3s',
        padding: '0 clamp(24px, 7vw, 128px)', height: 72,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        <Link to="/" style={{ fontFamily: 'var(--serif)', fontSize: 22, color: 'var(--gold-pale)', fontWeight: 400, textDecoration: 'none' }}>
                Prime Leather Repair
                </Link>
                <nav style={{ display: 'flex', gap: 40 }}>
                {NAV_LINKS.map((l) => (
                    <Link key={l.label} to={l.path} className={`nav-link${l.path === '/' ? ' active' : ''}`}>
                    {l.label}
                    </Link>
                ))}
                </nav>
      </header>

      {/* HERO */}
      <section style={{ position: 'relative', height: 'min(940px, 95vh)', overflow: 'hidden' }}>
        <img src={heroImg} alt="leather craft" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(18,18,18,0.82) 0%, rgba(18,18,18,0.55) 50%, rgba(18,18,18,0.92) 100%)' }} />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(90deg, rgba(18,18,18,0.72) 0%, transparent 55%)' }} />
        <div style={{ position: 'absolute', inset: 0, opacity: 0.55, background: 'radial-gradient(ellipse 110% 60% at 50% 50%, transparent 0%, #121212 100%)' }} />

        <div style={{ position: 'relative', zIndex: 1, height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '80px clamp(24px, 7vw, 128px) 60px', textAlign: 'center' }}>
          <div style={{ opacity: 0, animation: 'fadeUp 0.8s 0.2s forwards', fontFamily: 'var(--sans)', fontSize: 13, fontWeight: 300, color: 'rgba(255,185,0,0.9)', textTransform: 'uppercase', letterSpacing: '5.5px', marginBottom: 28 }}>
            Chicago's Premier Leather Artisans
          </div>
          <h1 style={{ opacity: 0, animation: 'fadeUp 0.8s 0.4s forwards', fontFamily: 'var(--serif)', fontSize: 'clamp(52px, 7.5vw, 96px)', fontWeight: 500, lineHeight: 1.08, color: '#fff', marginBottom: 16 }}>
            The Master Art of<br />Leather Restoration
          </h1>
          <div style={{ opacity: 0, animation: 'fadeUp 0.8s 0.6s forwards', fontFamily: 'var(--sans)', fontSize: 18, fontWeight: 300, color: '#E5E5E5', marginBottom: 52 }}>
            in Chicago
          </div>
          <div style={{ opacity: 0, animation: 'fadeUp 0.8s 0.8s forwards', display: 'flex', gap: 20, flexWrap: 'wrap', justifyContent: 'center' }}>
            <a href="#contact" className="btn-primary">Get a Quote</a>
            <a href="#contact" className="btn-outline">Contact Us</a>
          </div>
        </div>
      </section>

      {/* WHY CHOOSE US */}
      <section style={{ background: 'linear-gradient(180deg,#121212 0%,#1a1a1a 100%)', padding: 'clamp(80px,10vw,128px) clamp(24px,7vw,128px)' }}>
        <Reveal style={{ textAlign: 'center', marginBottom: 72 }}>
          <p style={{ fontFamily: 'var(--sans)', fontSize: 13, color: 'var(--gold)', textTransform: 'uppercase', letterSpacing: '4.2px', marginBottom: 18 }}>Excellence in Every Detail</p>
          <h2 style={{ fontFamily: 'var(--serif)', fontSize: 'clamp(36px,5vw,60px)', fontWeight: 500, color: '#fff' }}>Why Choose Us</h2>
          <div style={{ width: 80, height: 2, margin: '20px auto 0', background: 'linear-gradient(90deg,transparent,#E17100,transparent)' }} />
        </Reveal>
        <div style={{ maxWidth: 1060, margin: '0 auto' }}>
          {WHY_ITEMS.map((item, i) => (
            <Reveal key={item.num} delay={i * 80}>
              <div className="why-item" style={{ padding: '48px 0', borderBottom: i < WHY_ITEMS.length - 1 ? '1px solid rgba(38,38,38,0.8)' : 'none' }}>
                <div className="num-col" style={{ display: 'flex', justifyContent: 'flex-end', paddingRight: 24 }}>
                  <span style={{ fontFamily: 'var(--serif)', fontSize: 100, fontWeight: 400, color: 'rgba(225,113,0,0.18)', lineHeight: 1 }}>{item.num}</span>
                </div>
                <div style={{ borderLeft: '1.2px solid var(--border)', paddingLeft: 48 }}>
                  <h3 style={{ fontFamily: 'var(--serif)', fontSize: 28, fontWeight: 500, color: '#fff', marginBottom: 14 }}>{item.title}</h3>
                  <p style={{ fontFamily: 'var(--sans)', fontSize: 16, color: 'var(--text-dim)', lineHeight: 1.7, maxWidth: 580 }}>{item.desc}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* CRAFT OF RESTORATION */}
      <section style={{ background: 'var(--bg2)', padding: 'clamp(80px,10vw,120px) clamp(24px,7vw,128px)' }}>
        <div className="craft-grid" style={{ display: 'flex', gap: 80, alignItems: 'center', maxWidth: 1200, margin: '0 auto' }}>
          <Reveal style={{ flex: '0 0 auto', width: 'min(520px, 100%)' }}>
            <div style={{ borderRadius: 6, overflow: 'hidden', border: '1.2px solid var(--border)', aspectRatio: '4/3' }}>
              <img src={crafterImg} alt="leather restoration" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', transition: 'transform 0.5s ease' }}
                onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.03)'}
                onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'} />
            </div>
          </Reveal>
          <Reveal delay={100} style={{ flex: 1 }}>
            <p style={{ fontFamily: 'var(--sans)', fontSize: 13, color: 'var(--gold)', textTransform: 'uppercase', letterSpacing: '4.2px', marginBottom: 20 }}>Our Expertise</p>
            <h2 style={{ fontFamily: 'var(--serif)', fontSize: 'clamp(32px,4vw,48px)', fontWeight: 500, color: '#fff', lineHeight: 1.15, marginBottom: 24 }}>The Craft of Restoration</h2>
            <div style={{ width: 64, height: 2, background: 'var(--gold)', marginBottom: 28 }} />
            <p style={{ fontFamily: 'var(--sans)', fontSize: 16, color: 'var(--text-mid)', lineHeight: 1.75, marginBottom: 20 }}>We specialize in restoring furniture, automotive interiors, handbags, and footwear. Each piece receives meticulous attention to preserve its original character while breathing new life into worn leather.</p>
            <p style={{ fontFamily: 'var(--sans)', fontSize: 16, color: 'var(--text-dim)', lineHeight: 1.75, marginBottom: 36 }}>Our craftsmen use time-honored techniques combined with modern materials to ensure every restoration maintains the integrity and beauty of the original piece.</p>
            <div className="cats" style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
              {CATEGORIES.map(c => <span key={c} className="tag-chip">{c}</span>)}
            </div>
          </Reveal>
        </div>
      </section>

      {/* COMMERCIAL SERVICES */}
      <section style={{ background: 'linear-gradient(180deg,#1a1a1a 0%,#121212 100%)', padding: 'clamp(80px,10vw,128px) clamp(24px,7vw,128px)' }}>
        <Reveal style={{ textAlign: 'center', marginBottom: 64, width: '100%' }}>
          <p style={{ fontFamily: 'var(--sans)', fontSize: 13, color: 'var(--gold)', textTransform: 'uppercase', letterSpacing: '4.2px', marginBottom: 18 }}>For Businesses</p>
          <h2 style={{ fontFamily: 'var(--serif)', fontSize: 'clamp(36px,5vw,60px)', fontWeight: 500, color: '#fff', marginBottom: 20 }}>Commercial Services</h2>
          <div style={{ width: 80, height: 2, margin: '0 auto 24px', background: 'linear-gradient(90deg,transparent,#E17100,transparent)' }} />
          <p style={{ fontFamily: 'var(--sans)', fontSize: 17, color: 'var(--text-mid)', maxWidth: 740, margin: '0 auto', lineHeight: 1.7 }}>
            We serve Chicago's businesses — restaurants, hotels, and offices. We repair booths, exam tables, and corporate seating on-site with zero downtime.
          </p>
        </Reveal>

        <div className="services-row" style={{ display: 'flex', gap: 24, maxWidth: 1100, margin: '0 auto 64px' }}>
          {SERVICES.map((s, i) => (
            <Reveal key={s.label} delay={i * 100} style={{ flex: '1 1 280px' }}>
              <div className="service-card">
                <div style={{ width: 56, height: 56, borderRadius: '50%', background: 'rgba(123,51,6,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 24 }}>
                  <svg width="24" height="24" fill="none" stroke="var(--gold)" strokeWidth="1.8" viewBox="0 0 24 24"><rect x="3" y="3" width="18" height="18" rx="2" /><path d="M3 9h18" /></svg>
                </div>
                <h3 style={{ fontFamily: 'var(--serif)', fontSize: 20, fontWeight: 500, color: '#fff', marginBottom: 12 }}>{s.label}</h3>
                <p style={{ fontFamily: 'var(--sans)', fontSize: 14, color: 'var(--text-dim)', lineHeight: 1.7 }}>{s.desc}</p>
              </div>
            </Reveal>
          ))}
        </div>

        <div className="commercial-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, maxWidth: 960, margin: '0 auto' }}>
          {[commercial1Img, commercial2Img].map((img, i) => (
            <Reveal key={i} delay={i * 120}>
              <div style={{ borderRadius: 6, overflow: 'hidden', border: '1.2px solid var(--border)', aspectRatio: '3/2' }}>
                <img src={img} alt="commercial leather service" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', transition: 'transform 0.4s' }}
                  onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.04)'}
                  onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'} />
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* FOOTER */}
      <footer id="contact" style={{ background: '#0A0A0A', borderTop: '1.2px solid var(--border)', padding: 'clamp(60px,8vw,80px) clamp(24px,7vw,128px) 40px' }}>
        <div className="footer-grid" style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr 1fr', gap: 48, marginBottom: 48 }}>
          <div>
            <h3 style={{ fontFamily: 'var(--serif)', fontSize: 26, color: 'var(--gold-pale)', fontWeight: 400, marginBottom: 14 }}>Prime Leather Repair</h3>
            <p style={{ fontFamily: 'var(--sans)', fontSize: 14, color: 'var(--text-dim)', lineHeight: 1.7, maxWidth: 300, marginBottom: 20 }}>Chicago's premier leather restoration specialists. Preserving craftsmanship and extending the life of your finest pieces.</p>
            <div style={{ width: 48, height: 2, background: 'var(--gold)' }} />
          </div>
          <div>
            <h4 style={{ fontFamily: 'var(--sans)', fontSize: 12, fontWeight: 600, color: 'var(--gold-light)', textTransform: 'uppercase', letterSpacing: '2.8px', marginBottom: 24 }}>Contact</h4>
            {[{ icon: '📞', text: '+1 (312) 555-0199' }, { icon: '✉️', text: 'info@primeleatherrepair.com' }, { icon: '📍', text: '123 Craft Street, Chicago, IL 60614' }].map(c => (
              <div key={c.text} style={{ display: 'flex', gap: 12, marginBottom: 16, alignItems: 'flex-start' }}>
                <span style={{ fontSize: 14 }}>{c.icon}</span>
                <span style={{ fontFamily: 'var(--sans)', fontSize: 14, color: 'var(--text-mid)', lineHeight: 1.5 }}>{c.text}</span>
              </div>
            ))}
          </div>
          <div>
            <h4 style={{ fontFamily: 'var(--sans)', fontSize: 12, fontWeight: 600, color: 'var(--gold-light)', textTransform: 'uppercase', letterSpacing: '2.8px', marginBottom: 24 }}>Hours</h4>
            {HOURS.map(h => (
              <div key={h.day} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
                <span style={{ fontFamily: 'var(--sans)', fontSize: 14, color: 'var(--text-dim)' }}>{h.day}</span>
                <span style={{ fontFamily: 'var(--sans)', fontSize: 14, color: h.time === 'Closed' ? '#737373' : '#FEE685' }}>{h.time}</span>
              </div>
            ))}
          </div>
        </div>
        <div style={{ borderTop: '1.2px solid var(--border)', paddingTop: 28, textAlign: 'center' }}>
          <p style={{ fontFamily: 'var(--sans)', fontSize: 13, color: '#737373' }}>© 2026 Prime Leather Repair. All rights reserved.</p>
        </div>
      </footer>

      {/* FAB */}
      <a href="#contact" style={{ position: 'fixed', bottom: 32, right: 32, zIndex: 50, width: 52, height: 52, borderRadius: '50%', background: 'var(--gold)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 8px 30px rgba(0,0,0,0.4)', transition: 'transform 0.2s', textDecoration: 'none' }}
        onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.1)'}
        onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
        aria-label="Get a quote">
        <svg width="20" height="20" fill="none" stroke="#fff" strokeWidth="2" viewBox="0 0 24 24"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /></svg>
      </a>
    </div>
  )
}