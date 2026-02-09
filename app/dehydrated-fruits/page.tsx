'use client'

import { useEffect, useState } from "react"

export default function DehydratedFruitsPage() {
  const [visibleSections, setVisibleSections] = useState<Set<string>>(new Set())
  const [carouselIndex, setCarouselIndex] = useState(0)
  const [bgColor, setBgColor] = useState('#F5F5F5')

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisibleSections((prev) => new Set(prev).add(entry.target.id))
          }
        })
      },
      { threshold: 0.1 }
    )

    const sections = document.querySelectorAll('.fade-in-section')
    sections.forEach((section) => observer.observe(section))

    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    const interval = setInterval(() => {
      setCarouselIndex((prev) => (prev + 1) % 3)
    }, 3000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div style={{ fontFamily: 'serif', color: '#333' }}>
      <style jsx>{`
        :root {
          --trust-white: #F5F5F5;
          --trust-grey: #E5E5E5;
          --luxury-gold: #D4AF37;
          --health-green: #0A5E2F;
          --vibrant-red: #B22222;
          --cta-green: #28A745;
          --cta-orange: #FF6F61;
        }

        .hero {
          background: linear-gradient(135deg, var(--trust-white) 0%, var(--trust-grey) 100%);
          padding: 100px 20px;
          text-align: center;
          position: relative;
          overflow: hidden;
        }

        .hero::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: url('/dehydrated-fruits-assortment-kiwi-strawberry-mango.jpg') center/cover no-repeat;
          opacity: 0.1;
          animation: parallax 10s ease-in-out infinite alternate;
        }

        @keyframes parallax {
          0% { transform: scale(1); }
          100% { transform: scale(1.05); }
        }

        .hero h1 {
          font-size: 3rem;
          color: var(--health-green);
          margin-bottom: 20px;
          position: relative;
          z-index: 1;
        }

        .hero p {
          font-size: 1.5rem;
          color: var(--vibrant-red);
          margin-bottom: 40px;
          position: relative;
          z-index: 1;
        }

        .cta-button {
          background: var(--cta-green);
          color: white;
          padding: 15px 30px;
          border: none;
          border-radius: 5px;
          font-size: 1.2rem;
          cursor: pointer;
          transition: all 0.3s;
          position: relative;
          z-index: 1;
        }

        .cta-button:hover {
          background: var(--luxury-gold);
          transform: scale(1.05);
          box-shadow: 0 0 20px var(--luxury-gold);
        }

        .cta-button:active {
          transform: scale(1.1);
          box-shadow: 0 0 30px var(--luxury-gold);
        }

        .section {
          padding: 80px 20px;
          text-align: center;
        }

        .luxury-section {
          background: var(--trust-grey);
        }

        .mastery-section {
          background: var(--trust-white);
        }

        .certification-section {
          background: var(--trust-grey);
        }

        .purity-section {
          background: var(--trust-white);
        }

        .lifestyle-section {
          background: linear-gradient(135deg, var(--health-green) 0%, var(--luxury-gold) 100%);
          color: white;
        }

        .fade-in-section {
          opacity: 0;
          transform: translateY(20px);
          transition: opacity 0.6s, transform 0.6s;
        }

        .fade-in-section.visible {
          opacity: 1;
          transform: translateY(0);
        }

        .trust-icons {
          display: flex;
          justify-content: center;
          margin: 20px 0;
        }

        .trust-icon {
          width: 100px;
          height: 100px;
          background: var(--luxury-gold);
          border-radius: 50%;
          display: inline-block;
          margin: 0 10px;
          animation: fadeIn 1s ease-in-out forwards;
          opacity: 0;
        }

        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        .product-card {
          display: inline-block;
          margin: 20px;
          padding: 20px;
          background: white;
          border-radius: 10px;
          box-shadow: 0 4px 8px rgba(0,0,0,0.1);
          transition: transform 0.3s, box-shadow 0.3s;
        }

        .product-card:hover {
          transform: scale(1.05);
          box-shadow: 0 8px 16px rgba(0,0,0,0.2);
        }

        .floating-cta {
          position: fixed;
          bottom: 20px;
          right: 20px;
          background: var(--cta-orange);
          color: white;
          padding: 15px 20px;
          border-radius: 50px;
          cursor: pointer;
          animation: bounce 2s infinite;
        }

        @keyframes bounce {
          0%, 20%, 50%, 80%, 100% { transform: translateY(0); }
          40% { transform: translateY(-10px); }
          60% { transform: translateY(-5px); }
        }

        .trust-carousel {
          padding: 60px 20px;
          text-align: center;
          background: var(--trust-white);
        }

        .badge-container {
          display: flex;
          justify-content: center;
          align-items: center;
          height: 100px;
        }

        .badge {
          font-size: 1.5rem;
          color: var(--health-green);
          background: var(--luxury-gold);
          padding: 10px 20px;
          border-radius: 20px;
          margin: 0 10px;
          opacity: 0;
          transition: opacity 0.5s;
        }

        .badge.active {
          opacity: 1;
        }

        .color-palette {
          padding: 60px 20px;
          text-align: center;
        }

        .color-swatches {
          display: flex;
          justify-content: center;
        }

        .swatch {
          width: 100px;
          height: 100px;
          margin: 10px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-weight: bold;
          cursor: pointer;
          transition: transform 0.3s;
        }

        .swatch:hover {
          transform: scale(1.1);
        }

        .swatch.purity { background: #F5F5F5; color: #333; }
        .swatch.luxury { background: #D4AF37; }
        .swatch.health { background: #0A5E2F; }

        @media (max-width: 768px) {
          .hero h1 { font-size: 2rem; }
          .hero p { font-size: 1.2rem; }
          .section { padding: 40px 20px; }
          .badge-container { flex-direction: column; height: auto; }
          .color-swatches { flex-direction: column; align-items: center; }
        }
      `}</style>

      <section className="hero">
        <h1>Why <span style={{color: '#FFD700'}}>S</span><span style={{color: '#FF6347'}}>U</span><span style={{color: '#32CD32'}}>N</span><span style={{color: '#1E90FF'}}>Y</span><span style={{color: '#9370DB'}}>A</span>? Why Excellence?</h1>
        <p>We don't just sell dehydrated fruits — we deliver purity, prestige, and refined lifestyle in every carefully crafted batch.</p>
        <a href="https://wa.me/977986733380" target="_blank" rel="noopener noreferrer" className="cta-button text-primary-foreground px-6 py-3 rounded-md font-semibold">Nurture Now</a>
      </section>

      <section className="trust-carousel">
        <h2>Verified Excellence ✓</h2>
        <div className="badge-container">
          <div className={`badge ${carouselIndex === 0 ? 'active' : ''}`}>Lab Tested</div>
          <div className={`badge ${carouselIndex === 1 ? 'active' : ''}`}>Certified</div>
          <div className={`badge ${carouselIndex === 2 ? 'active' : ''}`}>Export Grade</div>
        </div>
      </section>

      <section className="color-palette" style={{ backgroundColor: bgColor, transition: 'background-color 0.5s' }}>
        <h2>Our Commitment to Purity, Luxury, and Health</h2>
        <div className="color-swatches">
          <div className="swatch purity" onMouseEnter={() => setBgColor('#F5F5F5')} onMouseLeave={() => setBgColor('#F5F5F5')}>Purity</div>
          <div className="swatch luxury" onMouseEnter={() => setBgColor('#D4AF37')} onMouseLeave={() => setBgColor('#F5F5F5')}>Luxury</div>
          <div className="swatch health" onMouseEnter={() => setBgColor('#0A5E2F')} onMouseLeave={() => setBgColor('#F5F5F5')}>Health</div>
        </div>
      </section>

      <section id="luxury" className={`section luxury-section fade-in-section ${visibleSections.has('luxury') ? 'visible' : ''}`}>
        <h2>Luxury Positioning</h2>
        <p>Exclusivity, rarity, and prestige define our dehydrated fruits. Small-batch production ensures every piece is a treasure.</p>
        <div className="trust-icon"></div>
        <p>Purity you can taste. Excellence you can trust. Luxury you deserve.</p>
      </section>

      <section id="mastery" className={`section mastery-section fade-in-section ${visibleSections.has('mastery') ? 'visible' : ''}`}>
        <h2>Slow Dehydration Mastery</h2>
        <p>Our craftsmanship preserves natural flavor and nutrition. Hand-selected premium fruits, dehydrated slowly for perfection.</p>
        <p>A bite that inspires loyalty.</p>
      </section>

      <section id="certification" className={`section certification-section fade-in-section ${visibleSections.has('certification') ? 'visible' : ''}`}>
        <h2>Export-Grade Certification</h2>
        <p>International trust, global markets approval. Verified Excellence ✓</p>
        <p>Trusted by global markets.</p>
      </section>

      <section id="purity" className={`section purity-section fade-in-section ${visibleSections.has('purity') ? 'visible' : ''}`}>
        <h2>Verified Purity</h2>
        <p>Lab-tested, certified, zero additives, 100% natural. Lab-Tested. Every batch certified for quality, purity, and safety.</p>
        <div className="trust-icons">
          <div className="trust-icon" style={{animationDelay: '0s'}}></div>
          <div className="trust-icon" style={{animationDelay: '0.5s'}}></div>
          <div className="trust-icon" style={{animationDelay: '1s'}}></div>
        </div>
        <p>Zero additives, zero preservatives. Health & hygiene you can rely on.</p>
      </section>

      <section id="lifestyle" className={`section lifestyle-section fade-in-section ${visibleSections.has('lifestyle') ? 'visible' : ''}`}>
        <h2>Refined Lifestyle</h2>
        <p>Perfect for luxury gifting, wellness, and lifestyle refinement.</p>
        <div className="product-card">
          <h3>Premium Mango</h3>
          <p>Hand-selected, slow-dehydrated.</p>
        </div>
        <div className="product-card">
          <h3>Exotic Kiwi</h3>
          <p>Natural flavor preserved.</p>
        </div>
        <p>Refined lifestyle, perfect for gifting.</p>
      </section>
<a href="https://wa.me/977986733380" target="_blank" rel="noopener noreferrer" className="floating-cta hover:scale-[1.02] hover:shadow-[0_0_10px_rgba(0,0,0,0.15)] transition-all duration-500">Nurture Now</a>

    </div>
  )
}