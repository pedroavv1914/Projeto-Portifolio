let btnMenu = document.getElementById('btn-menu')
let menu = document.getElementById('menu-mobile')
let overlay = document.getElementById('overlay-menu')

btnMenu.addEventListener('click', ()=>{
    menu.classList.add('abrir-menu')
})

menu.addEventListener('click', ()=>{
    menu.classList.remove('abrir-menu')
})

overlay.addEventListener('click', ()=>{
    menu.classList.remove('abrir-menu')
})

let btn = document.getElementById("btnTopo");
let scrollTimeout;

window.addEventListener("scroll", () => {
  btn.style.display = "block";

  clearTimeout(scrollTimeout);
  scrollTimeout = setTimeout(() => {
    btn.style.display = "none";
  }, 1000);
});

function voltarAoTopo() {
  window.scrollTo({
    top: 0,
    behavior: "smooth"
  });
}

function revealOnScroll() {
  document.querySelectorAll('.reveal').forEach(function(el) {
    const rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight * 0.88 && rect.bottom > 0) {
      el.classList.add('active');
    } else {
      el.classList.remove('active');
    }
  });
}
window.addEventListener('scroll', revealOnScroll);
window.addEventListener('load', revealOnScroll);

// ====== FILTRO DA SEÇÃO DE HABILIDADES ======
function setupHabilidadesFiltro() {
  const filtroContainer = document.querySelector('.habilidades-filtros');
  if (!filtroContainer) return; // seção pode não estar na página

  const botoes = Array.from(filtroContainer.querySelectorAll('.filtro-btn'));
  const cards = Array.from(document.querySelectorAll('.habilidade-card'));

  function aplicarFiltro(valor) {
    cards.forEach(card => {
      const categoria = card.getAttribute('data-category');
      const mostrar = valor === 'all' || categoria === valor;
      card.classList.toggle('is-hidden', !mostrar);
    });
  }

  botoes.forEach(btn => {
    btn.addEventListener('click', () => {
      const ativo = filtroContainer.querySelector('.filtro-btn.active');
      if (ativo && ativo !== btn) ativo.classList.remove('active');
      btn.classList.add('active');
      const filtro = btn.getAttribute('data-filter') || 'all';
      aplicarFiltro(filtro);
    });
  });

  // Estado inicial: "Todas"
  aplicarFiltro('all');
}

window.addEventListener('load', setupHabilidadesFiltro);

// ====== EXPANSÃO/CONTRAÇÃO DOS CARDS DE HABILIDADES ======
function setupHabilidadesExpand() {
  const cards = Array.from(document.querySelectorAll('.habilidade-card'));
  if (!cards.length) return;

  // Inicializa atributos de acessibilidade
  cards.forEach(card => {
    card.setAttribute('role', 'button');
    card.setAttribute('tabindex', '0');
    card.setAttribute('aria-expanded', 'false');
  });

  function toggleCard(card) {
    const isCurrentlyExpanded = card.classList.contains('expanded');

    // Se o card não está expandido, iremos expandi-lo e fechar os demais
    if (!isCurrentlyExpanded) {
      // Fecha quaisquer outros cards abertos
      const allCards = document.querySelectorAll('.habilidade-card.expanded');
      allCards.forEach(c => {
        if (c !== card) {
          c.classList.remove('expanded');
          c.setAttribute('aria-expanded', 'false');
        }
      });

      // Expande o card atual
      card.classList.add('expanded');
      card.setAttribute('aria-expanded', 'true');

      // Efeito de digitação ao expandir (uma vez)
      const p = card.querySelector('p');
      if (p && !p.dataset.typed) {
        typeDescription(p);
      }
    } else {
      // Se já está expandido, recolhe (permitindo zero abertos)
      card.classList.remove('expanded');
      card.setAttribute('aria-expanded', 'false');
    }
  }

  function onCardActivate(e) {
    // Evita ativar quando clicar em botões de filtro por engano
    const card = e.currentTarget;
    toggleCard(card);
  }

  function onCardKey(e) {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      toggleCard(e.currentTarget);
    }
  }

  cards.forEach(card => {
    card.addEventListener('click', onCardActivate);
    card.addEventListener('keydown', onCardKey);
  });
}

window.addEventListener('load', setupHabilidadesExpand);

// ====== PROFICIÊNCIA: CONFIGURAR BARRA DE NÍVEL ======
function setupProficienciaRing() {
  const cards = document.querySelectorAll('.habilidade-card');
  cards.forEach(card => {
    const dots = card.querySelectorAll('.proficiencia-dot.active');
    const count = dots.length; // 0..3
    // Ajusta barra de nível: 0..3
    const nivel = Math.min(3, Math.max(0, count));
    const barra = card.querySelector('.habilidade-proficiencia');
    if (barra) barra.style.setProperty('--level', String(nivel));
  });
}

window.addEventListener('load', setupProficienciaRing);

// ====== Helper: efeito de digitação no parágrafo ======
function typeDescription(el) {
  const full = el.textContent.trim();
  el.dataset.typed = 'true';
  el.dataset.fullText = full;
  el.textContent = '';
  let i = 0;
  const speed = 12; // ms por caractere
  const step = () => {
    // se o card for recolhido, continuamos preenchendo para não quebrar layout
    if (i <= full.length) {
      el.textContent = full.slice(0, i);
      i += 2; // acelera um pouco
      setTimeout(step, speed);
    } else {
      el.textContent = full;
    }
  };
  step();
}