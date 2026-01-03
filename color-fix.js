/* JavaScript Color Override - Fixes dynamically generated pink colors */

// Color palette
const COLORS = {
    primary: '#1e3a5f',
    primaryRgb: [0.118, 0.227, 0.373], // Normalized RGB for Three.js
    primaryHex: 0x1e3a5f,
    secondary: '#2c5f8d',
    accent: '#3a7ca5',
    accentRgb: [0.227, 0.486, 0.647]
};

// Override SparklesCore color if it exists
if (typeof SparklesCore !== 'undefined') {
    const originalSparklesCore = SparklesCore;
    window.SparklesCore = function(canvasId, options) {
        if (options && options.particleColor && (
            options.particleColor === '#e60a64' || 
            options.particleColor === '#c00f66' ||
            options.particleColor.includes('192, 15, 102')
        )) {
            options.particleColor = COLORS.primary;
        }
        return new originalSparklesCore(canvasId, options);
    };
}

// Override Earth/Globe colors if it exists
if (typeof Earth !== 'undefined') {
    const originalEarth = Earth;
    window.Earth = function(canvasId, options) {
        if (options) {
            // Replace pink RGB values with primary color
            if (options.baseColor && (
                JSON.stringify(options.baseColor) === JSON.stringify([1, 0, 0.3]) ||
                JSON.stringify(options.baseColor) === JSON.stringify([1, 0, 0.4])
            )) {
                options.baseColor = COLORS.primaryRgb;
            }
            
            if (options.glowColor && (
                JSON.stringify(options.glowColor) === JSON.stringify([1, 0.3, 0.4]) ||
                JSON.stringify(options.glowColor).includes('1, 0')
            )) {
                options.glowColor = COLORS.accentRgb;
            }
        }
        return new originalEarth(canvasId, options);
    };
}

// Override any THREE.js PointLight colors
if (typeof THREE !== 'undefined') {
    const originalPointLight = THREE.PointLight;
    THREE.PointLight = function(color, intensity, distance, decay) {
        // Replace pink light colors
        if (color === 0xff0066 || color === 0xe60a64 || color === 0xc00f66) {
            color = COLORS.primaryHex;
        }
        return new originalPointLight(color, intensity, distance, decay);
    };
    // Copy prototype
    THREE.PointLight.prototype = originalPointLight.prototype;
}

// Wait for DOM to load, then fix any existing elements
document.addEventListener('DOMContentLoaded', function() {
    // Fix any canvas elements that might have pink colors
    setTimeout(function() {
        // Re-initialize sparkles with correct color if sparkles canvas exists
        const sparklesCanvas = document.getElementById('sparkles-canvas');
        if (sparklesCanvas && typeof SparklesCore !== 'undefined') {
            new SparklesCore('sparkles-canvas', {
                minSize: 0.6,
                maxSize: 1.4,
                particleDensity: 500,
                particleColor: COLORS.primary
            });
        }
        
        // Re-initialize globe with correct colors if globe canvas exists
        const globeCanvas = document.getElementById('globe-canvas');
        if (globeCanvas && typeof Earth !== 'undefined') {
            new Earth('globe-canvas', {
                scale: 1.1,
                baseColor: COLORS.primaryRgb,
                markerColor: [0, 0, 0],
                glowColor: COLORS.accentRgb
            });
        }
    }, 100);
});

console.log('Color override loaded - All pink colors replaced with approved palette');
