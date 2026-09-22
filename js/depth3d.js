/**
 * CANTENEX — 3D Food Depth & Layered Parallax Engine
 * Smooth mouse-reactive 3D tilt, dynamic lighting highlights, and layered physics
 */

export function init3DDepth() {
  const container = document.getElementById('hero-3d-stage');
  const foodCard = document.getElementById('hero-food-plate');
  const lightGlow = document.getElementById('hero-light-glow');
  const badges = document.querySelectorAll('.hero-depth-layer');

  if (!container || !foodCard) return;

  let mouseX = 0;
  let mouseY = 0;
  let currentX = 0;
  let currentY = 0;
  let targetRotateX = 0;
  let targetRotateY = 0;
  let currentRotateX = 0;
  let currentRotateY = 0;
  let isHovered = false;

  const handleMouseMove = (e) => {
    const rect = container.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    // Normalized coordinates (-1 to 1)
    const normX = (x / rect.width) * 2 - 1;
    const normY = (y / rect.height) * 2 - 1;
    
    // Max tilt angles: 12deg
    targetRotateY = normX * 12;
    targetRotateX = -normY * 12;
    
    mouseX = normX;
    mouseY = normY;
  };

  container.addEventListener('mouseenter', () => {
    isHovered = true;
  });

  container.addEventListener('mousemove', handleMouseMove);

  container.addEventListener('mouseleave', () => {
    isHovered = false;
    targetRotateX = 0;
    targetRotateY = 0;
    mouseX = 0;
    mouseY = 0;
  });

  // Render loop with smooth damping
  function animate() {
    // Lerp factor
    const ease = 0.08;
    currentRotateX += (targetRotateX - currentRotateX) * ease;
    currentRotateY += (targetRotateY - currentRotateY) * ease;
    currentX += (mouseX - currentX) * ease;
    currentY += (mouseY - currentY) * ease;

    // Apply 3D transform to food plate
    foodCard.style.transform = `perspective(1200px) rotateX(${currentRotateX}deg) rotateY(${currentRotateY}deg) translateZ(20px) scale(${isHovered ? 1.03 : 1})`;
    
    // Move dynamic light glare
    if (lightGlow) {
      const glowX = 50 + currentX * 30;
      const glowY = 50 + currentY * 30;
      lightGlow.style.background = `radial-gradient(circle at ${glowX}% ${glowY}%, rgba(255, 170, 100, 0.28) 0%, rgba(224, 83, 50, 0.08) 45%, transparent 70%)`;
    }

    // Move layered badges with distinct Z-depths
    badges.forEach((badge) => {
      const depth = parseFloat(badge.getAttribute('data-depth') || '0.5');
      const offsetX = currentX * 30 * depth;
      const offsetY = currentY * 25 * depth;
      const zDepth = depth * 40;
      badge.style.transform = `translate3d(${offsetX}px, ${offsetY}px, ${zDepth}px)`;
    });

    requestAnimationFrame(animate);
  }

  requestAnimationFrame(animate);

  // Intersection observer for subtle scroll parallax on editorial items
  const editorialItems = document.querySelectorAll('.editorial-card-parallax');
  if (editorialItems.length > 0 && 'IntersectionObserver' in window) {
    window.addEventListener('scroll', () => {
      const scrolled = window.scrollY;
      editorialItems.forEach((el) => {
        const speed = parseFloat(el.getAttribute('data-speed') || '0.05');
        const rect = el.getBoundingClientRect();
        if (rect.top < window.innerHeight && rect.bottom > 0) {
          const yPos = (rect.top - window.innerHeight / 2) * speed;
          el.style.transform = `translateY(${yPos}px)`;
        }
      });
    }, { passive: true });
  }
}
