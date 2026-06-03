const loadFragment = async (elementId, fragmentPath) => {
  const container = document.getElementById(elementId);
  if (!container) return;

  try {
    const response = await fetch(fragmentPath);
    if (!response.ok) {
      throw new Error(`Failed to load ${fragmentPath}: ${response.status} ${response.statusText}`);
    }

    container.innerHTML = await response.text();
  } catch (error) {
    console.error(error);
  }
};

const getComponentBasePath = () => {
  const pathParts = window.location.pathname.split('/').filter(Boolean);
  const depth = Math.max(pathParts.length - 1, 0);
  return `${'../'.repeat(depth)}components/`;
};

const setActiveNavLinks = () => {
  const currentPath = window.location.pathname;
  const navLinks = document.querySelectorAll('#site-nav a.nav-link, #site-nav a.dropdown-item');

  navLinks.forEach(link => {
    const href = link.getAttribute('href');
    if (!href || href === '#') {
      link.classList.remove('active');
      link.removeAttribute('aria-current');
      return;
    }

    const normalizedCurrent = currentPath === '/index.html' ? '/' : currentPath;
    const normalizedHref = href === '/index.html' ? '/' : href;
    const isActive = normalizedCurrent === normalizedHref || (normalizedHref !== '/' && normalizedCurrent.endsWith(normalizedHref));

    if (isActive) {
      link.classList.add('active');
      link.setAttribute('aria-current', 'page');

      if (link.classList.contains('dropdown-item')) {
        const dropdownToggle = link.closest('.dropdown')?.querySelector('.dropdown-toggle');
        if (dropdownToggle) {
          dropdownToggle.classList.add('active');
        }
      }
    } else {
      link.classList.remove('active');
      link.removeAttribute('aria-current');
    }
  });
};

const initSharedComponents = async () => {
  const basePath = getComponentBasePath();
  await loadFragment('site-nav', `${basePath}nav.html`);
  setActiveNavLinks();
  loadFragment('site-footer', `${basePath}footer.html`);
};

document.addEventListener('DOMContentLoaded', initSharedComponents);
