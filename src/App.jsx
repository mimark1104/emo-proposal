import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';

const EMOSONGS = [
  "2D4LEUzvLRCQOLMxnajH72?si=02abcd704aca4143", 
  "7oGCVuPEyp6m6DhXkU5Pfs?si=005e72f2d39a49c3", 
  "6lFUdRItQEsEuD7dSINL47?si=b48fbddd85364d002TfSHkHiFOi1H2oOWeUo7d", 
  "1AnesEZjtNHT7Nr2Y4BuNR?si=9f33160366594255", 
  "3V1O9EhNjAoEdtb8eKAf8s?si=7a27ec822536426d"  
];

export default function App() {
  const [step, setStep] = useState(1);
  const [noBtnPos, setNoBtnPos] = useState({ x: 0, y: 0 });
  const [sadParticles, setSadParticles] = useState([]);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [albumArt, setAlbumArt] = useState("");

  // Automatically fetches the true Spotify thumbnail
  useEffect(() => {
    if (step <= 5) {
      const trackId = EMOSONGS[step - 1];
      setAlbumArt(""); 
      
      fetch(`https://open.spotify.com/oembed?url=https://open.spotify.com/track/${trackId}`)
        .then((res) => res.json())
        .then((data) => {
          if (data.thumbnail_url) setAlbumArt(data.thumbnail_url);
        })
        .catch((err) => console.error("Error fetching Spotify thumbnail:", err));
    }
  }, [step]);

  const nextStep = () => {
    setStep((prev) => prev + 1);
    setNoBtnPos({ x: 0, y: 0 });
    setIsTransitioning(false);
  };

  const handleYesClick = () => {
    if (isTransitioning) return;
    setIsTransitioning(true);

    confetti({
      particleCount: 120,
      spread: 70,
      origin: { y: 0.7 }
    });

    setTimeout(nextStep, 800);
  };

  const handleNoClick = () => {
    if (isTransitioning) return;
    setIsTransitioning(true);

    const particles = Array.from({ length: 15 }).map((_, i) => ({
      id: i,
      left: Math.random() * 90 + 5,
      delay: Math.random() * 0.4,
      emoji: ['😭', '💔', '😢', '🥺'][Math.floor(Math.random() * 4)]
    }));

    setSadParticles(particles);

    setTimeout(() => {
      setSadParticles([]);
      nextStep();
    }, 1200);
  };

  // Advanced directional repulsion engine
  const runAway = (e) => {
    let clientX = 0;
    let clientY = 0;

    // Detect if mobile touch or desktop mouse action
    if (e.touches && e.touches.length > 0) {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else {
      clientX = e.clientX;
      clientY = e.clientY;
    }

    const rect = e.currentTarget.getBoundingClientRect();
    const btnCenterX = rect.left + rect.width / 2;
    const btnCenterY = rect.top + rect.height / 2;

    // Calculate interactive approach angle vector
    let dirX = btnCenterX - clientX;
    let dirY = btnCenterY - clientY;

    // Fallback if cursor lands exactly on center node
    if (dirX === 0 && dirY === 0) {
      dirX = Math.random() - 0.5;
      dirY = Math.random() - 0.5;
    }

    const length = Math.sqrt(dirX * dirX + dirY * dirY);
    
    // Push distance vector out significantly (140px to 180px jump zone)
    const pushDistance = Math.random() * 40 + 140; 
    
    const targetX = noBtnPos.x + (dirX / length) * pushDistance;
    const targetY = noBtnPos.y + (dirY / length) * pushDistance;

    // Bound check offsets so it flings far away but doesn't exit card boundaries completely
    const maxBoundX = 160;
    const maxBoundY = 120;

    setNoBtnPos({
      x: Math.max(-maxBoundX, Math.min(maxBoundX, targetX)),
      y: Math.max(-maxBoundY, Math.min(maxBoundY, targetY))
    });
  };

  const noButtonStyle = {
    transform: `translate(${noBtnPos.x}px, ${noBtnPos.y}px)`,
    transition: 'transform 0.12s cubic-bezier(0.34, 1.56, 0.64, 1)', // Snappy elastic reflex effect
    position: 'relative',
    zIndex: 99
  };

  return (    
    

    <div className="min-h-screen flex flex-col items-center justify-center p-4 select-none relative overflow-hidden">
      
      {/* NEON HEADER */}
      <h1 className="neon-text font-black text-4xl mb-10 uppercase tracking-widest text-center text-white">
        Hi Baby Doll
      </h1>

      {/* SAD EFFECTS LAYER */}
      {sadParticles.length > 0 && (
        <div className="absolute inset-0 pointer-events-none z-50">
          {sadParticles.map((p) => (
            <div
              key={p.id}
              className="absolute text-4xl"
              style={{
                left: `${p.left}%`,
                animation: `fall 1.2s linear forwards`,
                animationDelay: `${p.delay}s`,
              }}
            >
              {p.emoji}
            </div>
          ))}
        </div>
      )}

      {/* Main Card Panel */}
      <div className="w-full max-w-md bg-zinc-900 border border-zinc-800 rounded-2xl p-6 shadow-2xl text-center flex flex-col justify-between min-h-[620px] relative">
        
        <div className="text-xs text-zinc-500 font-mono tracking-widest uppercase mb-4">
          {step <= 7 ? `Track Level: 0${step} / 07` : "🖤 Forever"}
        </div>

        {/* STAGES 1 TO 5 */}
        {step <= 5 && (
          <div className="flex-1 flex flex-col justify-between items-center">
            <h2 className="text-xl font-bold text-pink-500 tracking-tight mb-4">
              do you know this song?
            </h2>
            
            {/* Spotify Player */}
            <div className="w-full rounded-xl overflow-hidden bg-black aspect-[3/1] shadow-md mb-4">
              <iframe
                src={`https://open.spotify.com/embed/track/${EMOSONGS[step - 1]}?utm_source=generator&theme=0`}
                width="100%"
                height="100%"
                frameBorder="0"
                allowFullScreen=""
                allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                loading="lazy"
                title={`emo-track-${step}`}
              ></iframe>
            </div>

            {/* AUTOMATED ALBUM THUMBNAIL CONTAINER */}
            <div className="w-full flex-1 flex items-center justify-center max-h-[180px] my-2 overflow-hidden rounded-xl bg-zinc-950/40 p-2 border border-zinc-800/50">
              {albumArt ? (
                <img 
                  src={albumArt} 
                  alt="Track Cover Artwork" 
                  className="max-h-full aspect-square object-cover rounded-lg shadow-xl border border-zinc-800 animate-fade-in"
                />
              ) : (
                <div className="flex flex-col items-center gap-2">
                  <div className="w-8 h-8 border-2 border-zinc-700 border-t-pink-500 rounded-full animate-spin"></div>
                  <span className="text-[10px] font-mono text-zinc-600">Spinning record...</span>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="w-full grid grid-cols-2 gap-4 mt-4">
              <button 
                onClick={handleYesClick} 
                disabled={isTransitioning || !albumArt}
                className="bg-zinc-800 hover:bg-zinc-700 text-white font-medium py-3 rounded-xl transition active:scale-95 disabled:opacity-40"
              >
                Yes
              </button>
              <button 
                onClick={handleNoClick} 
                disabled={isTransitioning || !albumArt}
                className="bg-zinc-800 hover:bg-zinc-700 text-white font-medium py-3 rounded-xl transition active:scale-95 disabled:opacity-40"
              >
                No
              </button>
            </div>
          </div>
        )}

        {/* STAGE 6: Do you love mimark? */}
        {step === 6 && (
          <div className="flex-1 flex flex-col justify-center items-center relative">
            <h2 className="text-2xl font-bold mb-4 text-white tracking-tight">
              Do you love mimark?
            </h2>

            <div className="w-full aspect-square max-w-[260px] bg-zinc-800 rounded-xl mb-6 overflow-hidden flex items-center justify-center border border-dashed border-zinc-600 relative">
              <img 
                src="/us-1.jpg" 
                alt="Us" 
                className="w-full h-full object-cover absolute"
                onError={(e) => { e.currentTarget.style.display = 'none'; }}
              />
              <span className="text-zinc-500 text-xs p-4">Add your photo to: public/us-1.jpg</span>
            </div>

            <div className="w-full grid grid-cols-2 gap-4 mt-auto">
              <button onClick={nextStep} className="bg-pink-600 hover:bg-pink-500 text-white font-bold py-3 rounded-xl shadow-lg active:scale-95 transition-transform">
                Yes
              </button>
              <button
                onMouseEnter={runAway}
                onTouchStart={runAway}
                onClick={runAway}
                style={noButtonStyle}
                className="bg-zinc-800 text-zinc-400 font-medium py-3 rounded-xl w-full pointer-events-auto select-none touch-none"
              >
                No
              </button>
            </div>
          </div>
        )}

        {/* STAGE 7: The Grand Finale Proposal */}
        {step === 7 && (
          <div className="flex-1 flex flex-col justify-center items-center relative">
            <h2 className="text-xl font-extrabold mb-4 text-pink-400 leading-snug tracking-tight">
              Can I be your forever man and marry me someday? be my lalabs for a lifetime 🖤
            </h2>

            <div className="w-full aspect-square max-w-[260px] bg-zinc-800 rounded-xl mb-6 overflow-hidden flex items-center justify-center border border-dashed border-zinc-600 relative">
              <img 
                src="/us-2.jpg" 
                alt="Proposal Scene" 
                className="w-full h-full object-cover absolute"
                onError={(e) => { e.currentTarget.style.display = 'none'; }}
              />
              <span className="text-zinc-500 text-xs p-4">Add your photo to: public/us-2.jpg</span>
            </div>

            <div className="w-full grid grid-cols-2 gap-4 mt-auto">
              <button onClick={nextStep} className="bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-400 hover:to-pink-500 text-white font-black py-3 rounded-xl shadow-xl animate-bounce">
                YES!
              </button>
              <button
                onMouseEnter={runAway}
                onTouchStart={runAway}
                onClick={runAway}
                style={noButtonStyle}
                className="bg-zinc-800 text-zinc-500 font-medium py-3 rounded-xl w-full touch-none select-none"
              >
                No
              </button>
            </div>
          </div>
        )}

        {/* CELEBRATION SCREEN */}
        {step === 8 && (
          <div className="flex-1 flex flex-col justify-center items-center">
            <div className="text-6xl mb-4 animate-pulse">🎉</div>
            <h2 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-rose-400 mb-2">
              She Said Yes!
            </h2>
            <p className="text-zinc-300 text-sm max-w-xs mt-2 italic">
              "I promise to love you, listen to emo anthems with you, and be your forever man through every verse and chorus."
            </p>
            <div className="text-xs text-zinc-600 mt-8 font-mono">
              Forever starts now. 🖤
            </div>
          </div>
        )}

      </div>

      {/* Global CSS Animation Handlers */}
      <style>{`

        @keyframes fall {
          0% { transform: translateY(-50px) rotate(0deg); opacity: 1; }
          100% { transform: translateY(110vh) rotate(360deg); opacity: 0.3; }
        }
        .animate-fade-in {
          animation: fadeIn 0.4s ease-out forwards;
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }
          .neon-text {
          text-shadow: 0 0 5px #fff, 0 0 10px #ff007f, 0 0 20px #ff007f, 0 0 40px #ff007f;
          animation: flicker 2s infinite alternate;
        }
          @keyframes flicker {
          0%, 19%, 21%, 23%, 25%, 54%, 56%, 100% { opacity: 1; }
          20%, 24%, 55% { opacity: 0.3; }
        }
          @keyframes fall {
          0% { transform: translateY(-50px) rotate(0deg); opacity: 1; }
          100% { transform: translateY(110vh) rotate(360deg); opacity: 0.3; }
        }
          
      `}
      </style>
    </div>
  );
}