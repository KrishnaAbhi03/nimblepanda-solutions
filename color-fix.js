/* JavaScript Color Override - Auto-injects CSS and fixes all pink colors */

(function() {
    'use strict';
    
    // Color palette
    const COLORS = {
        primary: '#1e3a5f',
        primaryRgba: 'rgba(30, 58, 95',
        primaryRgb: [0.118, 0.227, 0.373], // Normalized RGB for Three.js
        primaryHex: 0x1e3a5f,
        secondary: '#2c5f8d',
        accent: '#3a7ca5',
        accentRgb: [0.227, 0.486, 0.647]
    };
    
    // Auto-inject CSS overrides
    const styleEl = document.createElement('style');
    styleEl.id = 'color-fix-styles';
    styleEl.textContent = `
        /* Auto-injected color fixes */
        :root {
            --pink-primary: ${COLORS.primary} !important;
        }
        
        .form-title-us { color: ${COLORS.primary} !important; }
        .gradient-blur-1, .gradient-blur-2 { 
            background: radial-gradient(circle at center, ${COLORS.primary}, transparent 70%) !important; 
        }
        .form-input:focus, .form-textarea:focus {
            border-color: ${COLORS.primary} !important;
            box-shadow: 0 0 0 3px ${COLORS.primaryRgba}, 0.2) !important;
        }
        .submit-button {
            background: linear-gradient(to bottom, ${COLORS.primary}, ${COLORS.secondary}) !important;
        }
        .submit-button:hover {
            background: linear-gradient(to bottom, ${COLORS.secondary}, ${COLORS.accent}) !important;
        }
        .globe-card {
            border-color: ${COLORS.primaryRgba}, 0.3) !important;
            background: linear-gradient(to bottom, ${COLORS.primary}, ${COLORS.primaryRgba}, 0.05)) !important;
        }
        .testimonial-card { border-color: ${COLORS.primaryRgba}, 0.1) !important; }
        .testimonial-card:hover {
            border-color: ${COLORS.primaryRgba}, 0.3) !important;
            box-shadow: 0 10px 25px ${COLORS.primaryRgba}, 0.1) !important;
        }
        .faq-title {
            background: linear-gradient(to bottom right, transparent, ${COLORS.primary}, transparent) !important;
            -webkit-background-clip: text !important;
            background-clip: text !important;
        }
        .faq-icon, .faq-item.active .faq-question, .faq-trigger:hover .faq-question {
            color: ${COLORS.primary} !important;
        }
        .step-indicator {
            background: linear-gradient(135deg, ${COLORS.primary} 0%, ${COLORS.secondary} 100%) !important;
        }
    `;
    document.head.appendChild(styleEl);
    
    console.log('✓ Color-fix CSS injected');
    
    // Override SparklesCore initialization
    const originalSparklesCore = window.SparklesCore;
    if (typeof originalSparklesCore === 'function') {
        window.SparklesCore = function(canvasId, options) {
            if (options && options.particleColor) {
                if (options.particleColor.includes('e60a64') || 
                    options.particleColor.includes('c00f66') ||
                    options.particleColor.includes('192, 15, 102')) {
                    options.particleColor = COLORS.primary;
                }
            }
            return new originalSparklesCore(canvasId, options);
        };
        console.log('✓ SparklesCore override installed');
    }
    
    // Override Earth/Globe initialization
    const originalEarth = window.Earth;
    if (typeof originalEarth === 'function') {
        window.Earth = function(canvasId, options) {
            if (options) {
                if (options.baseColor && (
                    JSON.stringify(options.baseColor) === '[1,0,0.3]' ||
                    JSON.stringify(options.baseColor) === '[1,0,0.4]'
                )) {
                    options.baseColor = COLORS.primaryRgb;
                }
                if (options.glowColor) {
                    options.glowColor = COLORS.accentRgb;
                }
            }
            return new originalEarth(canvasId, options);
        };
        console.log('✓ Earth/Globe override installed');
    }
    
    // Override THREE.js PointLight
    if (typeof THREE !== 'undefined' && THREE.PointLight) {
        const OriginalPointLight = THREE.PointLight;
        THREE.PointLight = function(color, intensity, distance, decay) {
            if (color === 0xff0066 || color === 0xe60a64 || color === 0xc00f66) {
                color = COLORS.primaryHex;
            }
            return new OriginalPointLight(color, intensity, distance, decay);
        };
        THREE.PointLight.prototype = OriginalPointLight.prototype;
        console.log('✓ THREE.PointLight override installed');
    }
    
    // Fix any existing pink colors in the DOM
    function fixExistingColors() {
        // Re-initialize sparkles if it exists
        const sparklesCanvas = document.getElementById('sparkles-canvas');
        if (sparklesCanvas && typeof SparklesCore !== 'undefined') {
            new SparklesCore('sparkles-canvas', {
                minSize: 0.6,
                maxSize: 1.4,
                particleDensity: 500,
                particleColor: COLORS.primary
            });
            console.log('✓ Sparkles re-initialized with correct colors');
        }
        
        // Re-initialize globe if it exists
        const globeCanvas = document.getElementById('globe-canvas');
        if (globeCanvas && typeof Earth !== 'undefined') {
            new Earth('globe-canvas', {
                scale: 1.1,
                baseColor: COLORS.primaryRgb,
                markerColor: [0, 0, 0],
                glowColor: COLORS.accentRgb
            });
            console.log('✓ Globe re-initialized with correct colors');
        }
    }
    
    // Run fixes when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', fixExistingColors);
    } else {
        fixExistingColors();
    }
    
    // Also run after a short delay to catch any late initializations
    setTimeout(fixExistingColors, 500);
    
    console.log('%c✓ Color override complete - All pink colors replaced', 'color: #1e3a5f; font-weight: bold;');
})();
