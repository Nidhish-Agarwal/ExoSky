import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

const Background = ({ 
  className = "",
  intensity = 1.0,
  animationSpeed = 1.0,
  showPlanets = true,
  showGalaxy = true,
  children 
}) => {
  const mountRef = useRef(null);
  const sceneRef = useRef(null);
  const animationRef = useRef(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    if (!mountRef.current) return;

    // Scene setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 3000);
    const renderer = new THREE.WebGLRenderer({ 
      antialias: true, 
      alpha: true,
      powerPreference: "high-performance"
    });
    
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x000000, 0);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    mountRef.current.appendChild(renderer.domElement);

    // Enhanced Starfield with movement
    const createMovingStarField = () => {
      const starGeometry = new THREE.BufferGeometry();
      const starCount = 25000;
      const positions = new Float32Array(starCount * 3);
      const colors = new Float32Array(starCount * 3);
      const sizes = new Float32Array(starCount);
      const velocities = new Float32Array(starCount * 3);

      for (let i = 0; i < starCount; i++) {
        const i3 = i * 3;
        
        // Position stars in a large sphere
        const radius = Math.random() * 2000 + 800;
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.acos(Math.random() * 2 - 1);
        
        positions[i3] = radius * Math.sin(phi) * Math.cos(theta);
        positions[i3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
        positions[i3 + 2] = radius * Math.cos(phi);

        // Bright star colors (blue-white spectrum)
        const starType = Math.random();
        if (starType < 0.1) { // Blue giants
          colors[i3] = 0.6 + Math.random() * 0.4;     // R
          colors[i3 + 1] = 0.8 + Math.random() * 0.2; // G  
          colors[i3 + 2] = 1.0; // B
        } else if (starType < 0.3) { // White stars
          colors[i3] = 0.9 + Math.random() * 0.1;     // R
          colors[i3 + 1] = 0.9 + Math.random() * 0.1; // G
          colors[i3 + 2] = 1.0; // B
        } else { // Blue-white majority
          colors[i3] = 0.7 + Math.random() * 0.3;     // R
          colors[i3 + 1] = 0.8 + Math.random() * 0.2; // G
          colors[i3 + 2] = 0.9 + Math.random() * 0.1; // B
        }

        sizes[i] = Math.random() * 3 + 1;

        // Slow drift velocities
        velocities[i3] = (Math.random() - 0.5) * 0.1;
        velocities[i3 + 1] = (Math.random() - 0.5) * 0.1;
        velocities[i3 + 2] = (Math.random() - 0.5) * 0.1;
      }

      starGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
      starGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
      starGeometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));
      starGeometry.setAttribute('velocity', new THREE.BufferAttribute(velocities, 3));

      const starMaterial = new THREE.ShaderMaterial({
        uniforms: {
          time: { value: 0 },
          pixelRatio: { value: renderer.getPixelRatio() }
        },
        vertexShader: `
          attribute float size;
          attribute vec3 velocity;
          varying vec3 vColor;
          uniform float time;
          uniform float pixelRatio;
          
          void main() {
            vColor = color;
            
            // Apply drift movement
            vec3 pos = position + velocity * time * 0.5;
            vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
            
            // Enhanced twinkling
            float twinkle = sin(time * 2.0 + position.x * 0.01) * 
                           cos(time * 1.5 + position.y * 0.01) * 0.4 + 0.8;
            
            // Distance-based sizing
            float distance = length(mvPosition.xyz);
            gl_PointSize = size * twinkle * (400.0 / distance) * pixelRatio;
            gl_Position = projectionMatrix * mvPosition;
          }
        `,
        fragmentShader: `
          varying vec3 vColor;
          
          void main() {
            float r = distance(gl_PointCoord, vec2(0.5, 0.5));
            if (r > 0.5) discard;
            
            // Soft circular glow
            float alpha = 1.0 - smoothstep(0.0, 0.5, r);
            alpha = pow(alpha, 1.5);
            
            // Bright center with glow
            float intensity = 1.0 - r * 2.0;
            vec3 finalColor = vColor * (1.0 + intensity * 0.8);
            
            gl_FragColor = vec4(finalColor, alpha * 0.9);
          }
        `,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
        transparent: true,
        vertexColors: true
      });

      return new THREE.Points(starGeometry, starMaterial);
    };

    // Cosmic Nebula
    const createCosmicNebula = () => {
      const nebulaGeometry = new THREE.SphereGeometry(1200, 64, 32);
      const nebulaMaterial = new THREE.ShaderMaterial({
        uniforms: {
          time: { value: 0 },
          color1: { value: new THREE.Color(0x0a0a2a) },
          color2: { value: new THREE.Color(0x1a1a4a) },
          color3: { value: new THREE.Color(0x2a2a6a) },
          color4: { value: new THREE.Color(0x000015) }
        },
        vertexShader: `
          varying vec2 vUv;
          varying vec3 vPosition;
          varying vec3 vNormal;
          
          void main() {
            vUv = uv;
            vPosition = position;
            vNormal = normal;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          }
        `,
        fragmentShader: `
          uniform float time;
          uniform vec3 color1;
          uniform vec3 color2;
          uniform vec3 color3;
          uniform vec3 color4;
          varying vec2 vUv;
          varying vec3 vPosition;
          varying vec3 vNormal;
          
          // Enhanced noise functions
          vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
          vec4 mod289(vec4 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
          vec4 permute(vec4 x) { return mod289(((x*34.0)+1.0)*x); }
          vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }
          
          float snoise(vec3 v) {
            const vec2 C = vec2(1.0/6.0, 1.0/3.0);
            const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);
            vec3 i = floor(v + dot(v, C.yyy));
            vec3 x0 = v - i + dot(i, C.xxx);
            vec3 g = step(x0.yzx, x0.xyz);
            vec3 l = 1.0 - g;
            vec3 i1 = min(g.xyz, l.zxy);
            vec3 i2 = max(g.xyz, l.zxy);
            vec3 x1 = x0 - i1 + C.xxx;
            vec3 x2 = x0 - i2 + C.yyy;
            vec3 x3 = x0 - D.yyy;
            i = mod289(i);
            vec4 p = permute(permute(permute(i.z + vec4(0.0, i1.z, i2.z, 1.0)) + i.y + vec4(0.0, i1.y, i2.y, 1.0)) + i.x + vec4(0.0, i1.x, i2.x, 1.0));
            float n_ = 0.142857142857;
            vec3 ns = n_ * D.wyz - D.xzx;
            vec4 j = p - 49.0 * floor(p * ns.z * ns.z);
            vec4 x_ = floor(j * ns.z);
            vec4 y_ = floor(j - 7.0 * x_);
            vec4 x = x_ *ns.x + ns.yyyy;
            vec4 y = y_ *ns.x + ns.yyyy;
            vec4 h = 1.0 - abs(x) - abs(y);
            vec4 b0 = vec4(x.xy, y.xy);
            vec4 b1 = vec4(x.zw, y.zw);
            vec4 s0 = floor(b0)*2.0 + 1.0;
            vec4 s1 = floor(b1)*2.0 + 1.0;
            vec4 sh = -step(h, vec4(0.0));
            vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy;
            vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww;
            vec3 p0 = vec3(a0.xy, h.x);
            vec3 p1 = vec3(a0.zw, h.y);
            vec3 p2 = vec3(a1.xy, h.z);
            vec3 p3 = vec3(a1.zw, h.w);
            vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2, p2), dot(p3,p3)));
            p0 *= norm.x;
            p1 *= norm.y;
            p2 *= norm.z;
            p3 *= norm.w;
            vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
            m = m * m;
            return 42.0 * dot(m*m, vec4(dot(p0,x0), dot(p1,x1), dot(p2,x2), dot(p3,x3)));
          }
          
          void main() {
            vec3 pos = vPosition * 0.001 + time * 0.05;
            
            // Multi-octave noise
            float n1 = snoise(pos * 2.0) * 0.5;
            float n2 = snoise(pos * 4.0) * 0.25;
            float n3 = snoise(pos * 8.0) * 0.125;
            float n4 = snoise(pos * 16.0) * 0.0625;
            
            float noise = n1 + n2 + n3 + n4;
            noise = (noise + 1.0) * 0.5;
            
            // Color mixing
            vec3 color = mix(color1, color2, smoothstep(0.0, 0.4, noise));
            color = mix(color, color3, smoothstep(0.4, 0.7, noise));
            color = mix(color, color4, smoothstep(0.7, 1.0, noise));
            
            // Rim lighting effect
            float rim = 1.0 - abs(dot(vNormal, vec3(0.0, 0.0, 1.0)));
            rim = pow(rim, 2.0);
            
            float alpha = noise * 0.3 + rim * 0.2;
            gl_FragColor = vec4(color, alpha);
          }
        `,
        transparent: true,
        side: THREE.BackSide,
        blending: THREE.AdditiveBlending,
        depthWrite: false
      });

      return new THREE.Mesh(nebulaGeometry, nebulaMaterial);
    };

    // Beautiful Exoplanets with bigger sizes
    const createExoplanets = () => {
      const planets = [];
      const planetTypes = [
        { 
          size: 25, 
          color: 0x4A90E2, 
          atmosColor: 0x6BA6FF, 
          rings: false, 
          name: 'Earth-like',
          texture: 'earth'
        },
        { 
          size: 35, 
          color: 0xFF6B35, 
          atmosColor: 0xFF8A5B, 
          rings: true, 
          name: 'Gas Giant',
          texture: 'jupiter'
        },
        { 
          size: 18, 
          color: 0xFF4757, 
          atmosColor: 0xFF6B7A, 
          rings: false, 
          name: 'Mars-like',
          texture: 'mars'
        },
        { 
          size: 42, 
          color: 0x9C88FF, 
          atmosColor: 0xB8A9FF, 
          rings: true, 
          name: 'Super Jupiter',
          texture: 'gas'
        },
        { 
          size: 15, 
          color: 0xFFD93D, 
          atmosColor: 0xFFE066, 
          rings: false, 
          name: 'Venus-like',
          texture: 'venus'
        },
        { 
          size: 28, 
          color: 0x6C5CE7, 
          atmosColor: 0x8B7EE8, 
          rings: false, 
          name: 'Ice Giant',
          texture: 'ice'
        }
      ];

      for (let i = 0; i < 10; i++) {
        const planetType = planetTypes[Math.floor(Math.random() * planetTypes.length)];
        const group = new THREE.Group();

        // Planet surface with enhanced materials
        const planetGeometry = new THREE.SphereGeometry(planetType.size, 64, 32);
        const planetMaterial = new THREE.MeshLambertMaterial({
          color: planetType.color,
          transparent: true,
          opacity: 0.9
        });
        const planet = new THREE.Mesh(planetGeometry, planetMaterial);

        // Atmospheric glow - larger and more beautiful
        const glowGeometry = new THREE.SphereGeometry(planetType.size * 1.4, 32, 16);
        const glowMaterial = new THREE.ShaderMaterial({
          uniforms: {
            color: { value: new THREE.Color(planetType.atmosColor) },
            time: { value: 0 }
          },
          vertexShader: `
            varying vec3 vNormal;
            varying vec3 vPosition;
            uniform float time;
            
            void main() {
              vNormal = normalize(normalMatrix * normal);
              vPosition = position;
              
              // Slight animation
              vec3 pos = position + sin(time + position.x * 0.01) * normal * 0.1;
              gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
            }
          `,
          fragmentShader: `
            uniform vec3 color;
            uniform float time;
            varying vec3 vNormal;
            varying vec3 vPosition;
            
            void main() {
              float rim = 1.0 - abs(dot(vNormal, vec3(0.0, 0.0, 1.0)));
              rim = pow(rim, 1.5);
              
              // Pulsing effect
              float pulse = sin(time * 2.0) * 0.1 + 0.9;
              float alpha = rim * rim * 0.7 * pulse;
              
              gl_FragColor = vec4(color, alpha);
            }
          `,
          transparent: true,
          blending: THREE.AdditiveBlending,
          side: THREE.BackSide,
          depthWrite: false
        });
        const glow = new THREE.Mesh(glowGeometry, glowMaterial);

        group.add(planet);
        group.add(glow);

        // Enhanced rings for gas giants
        if (planetType.rings) {
          const ringGeometry = new THREE.RingGeometry(planetType.size * 1.6, planetType.size * 2.4, 64);
          const ringMaterial = new THREE.ShaderMaterial({
            uniforms: {
              time: { value: 0 },
              innerRadius: { value: planetType.size * 1.6 },
              outerRadius: { value: planetType.size * 2.4 }
            },
            vertexShader: `
              varying vec2 vUv;
              varying vec3 vPosition;
              uniform float time;
              
              void main() {
                vUv = uv;
                vPosition = position;
                
                // Subtle ring animation
                vec3 pos = position;
                float angle = atan(pos.y, pos.x);
                float radius = length(pos.xy);
                pos.z += sin(angle * 8.0 + time) * 0.5;
                
                gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
              }
            `,
            fragmentShader: `
              uniform float time;
              uniform float innerRadius;
              uniform float outerRadius;
              varying vec2 vUv;
              varying vec3 vPosition;
              
              void main() {
                float radius = length(vPosition.xy);
                float normalizedRadius = (radius - innerRadius) / (outerRadius - innerRadius);
                
                // Ring particle effect
                float rings = sin(normalizedRadius * 50.0 + time) * 0.3 + 0.7;
                float fade = 1.0 - abs(normalizedRadius - 0.5) * 2.0;
                
                float alpha = rings * fade * 0.6;
                vec3 color = vec3(0.8, 0.8, 1.0);
                
                gl_FragColor = vec4(color, alpha);
              }
            `,
            transparent: true,
            side: THREE.DoubleSide,
            blending: THREE.AdditiveBlending,
            depthWrite: false
          });
          const rings = new THREE.Mesh(ringGeometry, ringMaterial);
          rings.rotation.x = Math.PI / 2 + (Math.random() - 0.5) * 0.5;
          group.add(rings);
        }

        // Position planets in beautiful orbits
        const orbitLevel = Math.floor(i / 2);
        const angle = (i % 2) * Math.PI + (i * 0.8);
        const radius = 300 + orbitLevel * 150;
        const height = (Math.random() - 0.5) * 200;
        
        group.position.set(
          Math.cos(angle) * radius,
          height,
          Math.sin(angle) * radius
        );

        group.userData = {
          orbitRadius: radius,
          orbitSpeed: (0.3 + Math.random() * 0.4) * 0.001,
          rotationSpeed: (0.5 + Math.random() * 1.0) * 0.008,
          angle: angle,
          height: height,
          planetType: planetType
        };

        planets.push(group);
        scene.add(group);
      }
      return planets;
    };

    // Cosmic dust particles
    const createCosmicDust = () => {
      const dustGeometry = new THREE.BufferGeometry();
      const dustCount = 5000;
      const positions = new Float32Array(dustCount * 3);
      const colors = new Float32Array(dustCount * 3);
      const sizes = new Float32Array(dustCount);

      for (let i = 0; i < dustCount; i++) {
        const i3 = i * 3;
        
        // Distribute in space
        positions[i3] = (Math.random() - 0.5) * 2000;
        positions[i3 + 1] = (Math.random() - 0.5) * 2000;
        positions[i3 + 2] = (Math.random() - 0.5) * 2000;

        // Subtle blue-white colors
        colors[i3] = 0.5 + Math.random() * 0.5;     // R
        colors[i3 + 1] = 0.7 + Math.random() * 0.3; // G
        colors[i3 + 2] = 0.9 + Math.random() * 0.1; // B

        sizes[i] = Math.random() * 2 + 0.5;
      }

      dustGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
      dustGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
      dustGeometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));

      const dustMaterial = new THREE.PointsMaterial({
        size: 2,
        transparent: true,
        opacity: 0.4,
        vertexColors: true,
        blending: THREE.AdditiveBlending,
        depthWrite: false
      });

      return new THREE.Points(dustGeometry, dustMaterial);
    };

    // Create all elements
    const starField = createMovingStarField();
    const nebula = showGalaxy ? createCosmicNebula() : null;
    const planets = showPlanets ? createExoplanets() : [];
    const cosmicDust = createCosmicDust();

    scene.add(starField);
    if (nebula) scene.add(nebula);
    scene.add(cosmicDust);

    // Enhanced lighting
    const ambientLight = new THREE.AmbientLight(0x202040, 0.3);
    const directionalLight = new THREE.DirectionalLight(0x4A90E2, 0.6);
    directionalLight.position.set(200, 200, 100);
    
    const pointLight = new THREE.PointLight(0x6BA6FF, 0.8, 1000);
    pointLight.position.set(-200, 100, 200);
    
    scene.add(ambientLight);
    scene.add(directionalLight);
    scene.add(pointLight);

    camera.position.set(0, 100, 400);
    camera.lookAt(0, 0, 0);

    // Animation loop
    let time = 0;
    const animate = () => {
      time += 0.008 * animationSpeed;

      // Update shader uniforms
      if (starField.material.uniforms) {
        starField.material.uniforms.time.value = time;
      }
      if (nebula && nebula.material.uniforms) {
        nebula.material.uniforms.time.value = time * 0.3;
      }

      // Rotate star field
      starField.rotation.y += 0.0003 * animationSpeed;
      starField.rotation.x += 0.0001 * animationSpeed;
      
      // Animate cosmic dust
      cosmicDust.rotation.x += 0.0008 * animationSpeed;
      cosmicDust.rotation.y += 0.0012 * animationSpeed;

      // Animate planets with beautiful orbital motion
      planets.forEach((planet, index) => {
        const data = planet.userData;
        data.angle += data.orbitSpeed * animationSpeed;
        
        // Orbital motion with slight vertical oscillation
        const verticalOffset = Math.sin(time * 0.5 + index) * 20;
        planet.position.x = Math.cos(data.angle) * data.orbitRadius;
        planet.position.z = Math.sin(data.angle) * data.orbitRadius;
        planet.position.y = data.height + verticalOffset;
        
        // Planet rotation
        planet.rotation.y += data.rotationSpeed * animationSpeed;
        planet.rotation.x += data.rotationSpeed * 0.1 * animationSpeed;
        
        // Update glow effect
        const glow = planet.children[1];
        if (glow && glow.material.uniforms) {
          glow.material.uniforms.time.value = time;
        }
        
        // Update ring animation
        const rings = planet.children[2];
        if (rings && rings.material.uniforms) {
          rings.material.uniforms.time.value = time;
        }
      });

      // Smooth camera movement
      camera.position.x = Math.sin(time * 0.05) * 50;
      camera.position.y = 100 + Math.cos(time * 0.03) * 30;
      camera.position.z = 400 + Math.sin(time * 0.02) * 100;
      camera.lookAt(0, 0, 0);

      renderer.render(scene, camera);
      animationRef.current = requestAnimationFrame(animate);
    };

    animate();
    setIsLoaded(true);

    // Resize handler
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
      
      // Update star material pixel ratio
      if (starField.material.uniforms) {
        starField.material.uniforms.pixelRatio.value = renderer.getPixelRatio();
      }
    };

    window.addEventListener('resize', handleResize);

    // Store references
    sceneRef.current = { scene, camera, renderer, planets, starField, nebula, cosmicDust };

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      if (mountRef.current && renderer.domElement) {
        mountRef.current.removeChild(renderer.domElement);
      }
      
      // Dispose of resources
      scene.traverse((object) => {
        if (object.geometry) object.geometry.dispose();
        if (object.material) {
          if (Array.isArray(object.material)) {
            object.material.forEach(material => material.dispose());
          } else {
            object.material.dispose();
          }
        }
      });
      
      renderer.dispose();
    };
  }, [intensity, animationSpeed, showPlanets, showGalaxy]);

  return (
    <div className={`fixed inset-0 ${className}`}>
      {/* 3D Canvas */}
      <div 
        ref={mountRef} 
        className="absolute inset-0"
        style={{ 
          background: 'linear-gradient(180deg, #000000 0%, #0a0a2a 25%, #1a1a4a 50%, #0a0a2a 75%, #000000 100%)',
          opacity: isLoaded ? 1 : 0,
          transition: 'opacity 2s ease-in-out'
        }}
      />
      
      {/* Loading overlay */}
      {!isLoaded && (
        <div className="absolute inset-0 bg-black flex items-center justify-center">
          <div className="text-blue-400 text-xl font-mono animate-pulse">
            Rendering Universe...
          </div>
        </div>
      )}

      {/* Content overlay */}
      {children && (
        <div className="relative z-10 pointer-events-none">
          <div className="pointer-events-auto">
            {children}
          </div>
        </div>
      )}

      {/* Elegant gradient overlays */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-black/20 pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-br from-blue-900/10 via-transparent to-indigo-900/10 pointer-events-none" />
      
      {/* Subtle corner accents */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-radial from-blue-500/5 via-blue-500/2 to-transparent pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-radial from-indigo-500/5 via-indigo-500/2 to-transparent pointer-events-none" />
    </div>
  );
};

export default Background;