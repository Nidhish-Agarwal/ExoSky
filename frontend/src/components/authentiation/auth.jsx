import React, { useState, useEffect, useRef } from 'react';
import { useGoogleLogin } from '@react-oauth/google';
import * as THREE from 'three';
import { useNavigate } from 'react-router-dom';
import { 
  Shield,
  Activity,
  ArrowRight,
  Sparkles
} from 'lucide-react';

const ExoSkyAuth = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [currentFactIndex, setCurrentFactIndex] = useState(0);
  const [currentFunFactIndex, setCurrentFunFactIndex] = useState(0);
  const mountRef = useRef(null);
  const sceneRef = useRef(null);
  const navigate = useNavigate();

  const mainFacts = [
    {
      text: "Did you know that Kepler-452b, discovered in 2015, is so similar to Earth that scientists call it \"Earth's cousin\"? It orbits in the habitable zone of a sun-like star, 1,400 light-years away."
    },
    {
      text: "TOI-715 b is a recently discovered super-Earth that's 1.5 times larger than our planet and orbits within its star's habitable zone in just 19 days - where liquid water could potentially exist!"
    },
    {
      text: "WASP-96b has water vapor in its atmosphere! This gas giant, located 1,150 light-years away, was one of the first exoplanets analyzed by the James Webb Space Telescope in 2022."
    },
    {
      text: "K2-18 b, a sub-Neptune 120 light-years away, shows signs of water vapor and possibly clouds in its atmosphere. It receives similar amounts of radiation from its star as Earth does from the Sun."
    },
    {
      text: "51 Eridani b is a young Jupiter-like planet that's still glowing from the heat of its formation. At only 20 million years old, it's practically a baby in cosmic terms!"
    }
  ];

  const funFacts = [
    {
      text: "Our database contains over 5,500 confirmed exoplanets, including some that rain liquid diamonds, have glass winds at 4,350 mph, and orbit two suns like Tatooine!"
    },
    {
      text: "HD 189733b is a deep blue planet where it rains molten glass sideways at 5,400 mph winds! The blue color comes from silicate particles in its atmosphere."
    },
    {
      text: "PSR J1719-1438 b is literally a diamond planet! This carbon-rich world is made mostly of crystallized carbon and orbits a pulsar every 2.2 hours."
    },
    {
      text: "TrES-2b is darker than coal, reflecting less than 1% of light that hits it. This 'dark planet' is actually hotter than lava at 1,800°F despite being so black!"
    },
    {
      text: "Gliese 436 b has burning ice! This Neptune-sized planet has water ice that stays solid at 800°F due to the extreme gravitational pressure from its mass."
    }
  ];

  const getRandomIndices = () => {
    const mainIndex = Math.floor(Math.random() * mainFacts.length);
    let funIndex = Math.floor(Math.random() * funFacts.length);
    
    if (funIndex === mainIndex && funFacts.length > 1) {
      funIndex = (funIndex + 1) % funFacts.length;
    }
    
    return { mainIndex, funIndex };
  };

  useEffect(() => {
    const { mainIndex, funIndex } = getRandomIndices();
    setCurrentFactIndex(mainIndex);
    setCurrentFunFactIndex(funIndex);
  }, []);

  useEffect(() => {
    if (!mountRef.current) return;
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x000000, 0);
    mountRef.current.appendChild(renderer.domElement);

    const particleGeometry = new THREE.BufferGeometry();
    const particleCount = 800;
    const posArray = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount * 3; i++) {
      posArray[i] = (Math.random() - 0.5) * 100;
    }

    particleGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));

    const particleMaterial = new THREE.PointsMaterial({
      size: 0.8,
      color: 0x4A90E2,
      transparent: true,
      opacity: 0.6,
      blending: THREE.AdditiveBlending
    });

    const particleMesh = new THREE.Points(particleGeometry, particleMaterial);
    scene.add(particleMesh);

    const orbGeometry = new THREE.SphereGeometry(0.5, 8, 6);
    const orbMaterial = new THREE.MeshBasicMaterial({
      color: 0x1E3A8A,
      transparent: true,
      opacity: 0.3
    });

    for (let i = 0; i < 5; i++) {
      const orb = new THREE.Mesh(orbGeometry, orbMaterial);
      orb.position.set(
        (Math.random() - 0.5) * 50,
        (Math.random() - 0.5) * 50,
        (Math.random() - 0.5) * 50
      );
      scene.add(orb);
    }

    camera.position.z = 30;
    sceneRef.current = { scene, camera, renderer, particleMesh };

    const animate = () => {
      requestAnimationFrame(animate);
      
      if (particleMesh) {
        particleMesh.rotation.x += 0.0005;
        particleMesh.rotation.y += 0.001;
      }
      
      renderer.render(scene, camera);
    };
    animate();

    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (mountRef.current && renderer.domElement) {
        mountRef.current.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, []);

  const handleGoogleLogin = async (credentialResponse) => {
    setLoading(true);
    setError('');
    
    try {
      const response = await fetch('http://localhost:5000/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          access_token: credentialResponse.access_token,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Authentication failed');
      }

      const { accessToken, user } = data;
      // /Storing the accessToken in the localStorage
      localStorage.setItem("accessToken", accessToken);
      console.log('Login successful:', user);
      
      

      // Redirect user based on onboarding status
      console.log("User from backend:", user);
console.log("Onboarding completed?", user.onboardingCompleted);
      if (user.onboardingCompleted) {
  navigate("/explore");
} else {
  navigate("/onboarding");
}

      // Show new random facts after successful login
      const { mainIndex, funIndex } = getRandomIndices();
      setCurrentFactIndex(mainIndex);
      setCurrentFunFactIndex(funIndex);
      
    } catch (err) {
      setError(err.message || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  const googleLogin = useGoogleLogin({
    onSuccess: handleGoogleLogin,
    onError: () => {
      setError('Google authentication failed');
    },
  });

  return (
    <div className="fixed inset-0 bg-black overflow-hidden">
      <div 
        ref={mountRef} 
        className="absolute inset-0 z-0"
        style={{ background: 'linear-gradient(180deg, #000000 0%, #0A0A23 50%, #000000 100%)' }}
      />
      <div className="relative z-10 min-h-screen flex">
        {/* Left Panel - Hidden on mobile */}
        <div className="hidden lg:flex flex-1 flex-col justify-center px-16 lg:px-24">
          <div className="max-w-lg">
            <div className="mb-12">
              <div className="flex items-center mb-6">
                <div className="w-2 h-2 bg-blue-400 rounded-full mr-3 animate-pulse" />
                <span className="text-blue-400 text-sm font-mono tracking-wider uppercase">
                  Welcome Explorer
                </span>
              </div>
              
              <h1 className="text-6xl font-light text-white mb-6 leading-tight">
                Discover the
                <span className="block font-semibold bg-gradient-to-r from-blue-400 to-indigo-300 bg-clip-text text-transparent">
                  Unknown Universe
                </span>
              </h1>
              
              <p className="text-gray-400 text-lg leading-relaxed mb-8">
                {mainFacts[currentFactIndex].text}
              </p>

              <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-2xl p-6">
                <div className="flex items-center mb-4">
                  <Sparkles className="w-5 h-5 text-blue-400 mr-3" />
                  <span className="text-white font-medium">Fun Fact</span>
                </div>
                <p className="text-gray-300 text-sm leading-relaxed">
                  {funFacts[currentFunFactIndex].text}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Panel - Login Card (Responsive) */}
        <div className="flex-1 lg:flex-1 flex items-center justify-center px-4 sm:px-8">
          <div className="w-full max-w-md">
            <div className="bg-gray-900/40 backdrop-blur-xl border border-gray-800/50 rounded-3xl p-6 sm:p-8">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-semibold text-white mb-2">ExoSky</h2>
                <p className="text-gray-400 text-sm">
                  Join thousands of space explorers
                </p>
              </div>
              <div className="flex items-center justify-center mb-8">
                <div className="flex items-center px-4 py-2 bg-green-500/10 rounded-full border border-green-500/20">
                  <div className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse" />
                  <span className="text-green-400 text-sm font-mono">System Online</span>
                </div>
              </div>
              {error && (
                <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-2xl">
                  <p className="text-red-400 text-sm text-center">{error}</p>
                </div>
              )}
              <button
                onClick={() => googleLogin()}
                disabled={loading}
                className="group relative w-full bg-white hover:bg-gray-100 text-black font-medium py-4 px-6 rounded-2xl transition-all duration-300 hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden"
              >
                {loading && (
                  <div className="absolute inset-0 bg-gray-200 flex items-center justify-center">
                    <Activity className="w-5 h-5 text-black animate-spin" />
                  </div>
                )}

                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center mr-4">
                      {loading ? (
                        <Activity className="w-5 h-5 text-black animate-spin" />
                      ) : (
                        <Shield className="w-5 h-5 text-black" />
                      )}
                    </div>
                    <div className="text-left">
                      <div className="font-semibold">
                        {loading ? 'Authenticating...' : 'Continue with Google'}
                      </div>
                      <div className="text-gray-600 text-xs">
                        Secure authentication
                      </div>
                    </div>
                  </div>
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
                </div>
              </button>
              <div className="mt-8 grid grid-cols-3 gap-4">
                {[
                  { label: 'Exoplanets', value: '5,500+' },
                  { label: 'Stars', value: '9,000+' },
                  { label: 'Discoveries', value: 'Daily' }
                ].map((stat, index) => (
                  <div key={index} className="text-center p-3 bg-gray-800/30 rounded-xl border border-gray-700/50">
                    <div className="text-white font-semibold text-lg">{stat.value}</div>
                    <div className="text-gray-400 text-xs font-mono">{stat.label}</div>
                  </div>
                ))}
              </div>
              <div className="mt-8 text-center">
                <p className="text-gray-500 text-xs">
                  By continuing, you agree to explore the cosmos responsibly
                </p>
              </div>
            </div>
            <div className="mt-6 text-center">
              <p className="text-gray-600 text-sm">
                Ready to explore 5,500+ confirmed exoplanets?
              </p>
            </div>
          </div>
        </div>
      </div>
      <div className="absolute top-8 left-8 w-16 h-16 border border-blue-500/20 rounded-full" />
      <div className="absolute bottom-8 right-8 w-12 h-12 border border-indigo-400/20 rounded-full" />
    </div>
  );
};

export default ExoSkyAuth;