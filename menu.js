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

// ====== FILTROS DA SEÇÃO DE PROJETOS ======
function setupProjetosFiltros() {
  const filtrosContainer = document.querySelector('.projetos-filtros');
  const grid = document.querySelector('.projetos-cards-grid');
  if (!filtrosContainer || !grid) return;

  const cards = Array.from(grid.querySelectorAll('.projeto-card'));
  if (!cards.length) return;

  // Coleta todas as tags únicas a partir dos <li> dentro de .projeto-tags
  const tagSet = new Set();
  const cardTagsMap = new Map(); // card -> [tags]

  cards.forEach(card => {
    const tags = Array.from(card.querySelectorAll('.projeto-tags li'))
      .map(li => li.textContent.trim())
      .filter(Boolean);
    cardTagsMap.set(card, tags);
    tags.forEach(t => tagSet.add(t));
  });

  // Cria botões de filtro (mantendo o "Todas" existente)
  // Remove botões antigos (exceto o primeiro "Todas") para evitar duplicação
  const existing = Array.from(filtrosContainer.querySelectorAll('.projeto-filter-btn'));
  existing.slice(1).forEach(btn => btn.remove());

  const tagsOrdenadas = Array.from(tagSet).sort((a, b) => a.localeCompare(b));
  tagsOrdenadas.forEach(tag => {
    const btn = document.createElement('button');
    btn.className = 'projeto-filter-btn';
    btn.type = 'button';
    btn.setAttribute('role', 'tab');
    btn.setAttribute('aria-selected', 'false');
    btn.dataset.filter = tag;
    btn.textContent = tag;
    filtrosContainer.appendChild(btn);
  });

  function aplicarFiltro(valor) {
    cards.forEach(card => {
      const tags = cardTagsMap.get(card) || [];
      const mostrar = valor === 'all' || tags.includes(valor);
      if (mostrar) {
        // Mostrar com microanimação
        const wasHidden = card.classList.contains('is-hidden');
        card.classList.remove('is-hidden');
        if (wasHidden) {
          card.classList.remove('enter');
          // força reflow para reiniciar animação
          // eslint-disable-next-line no-unused-expressions
          card.offsetHeight;
          card.classList.add('enter');
          setTimeout(() => card.classList.remove('enter'), 320);
        }
      } else {
        card.classList.add('is-hidden');
      }
    });
  }

  function onFiltroClick(e) {
    const btn = e.currentTarget;
    const ativo = filtrosContainer.querySelector('.projeto-filter-btn.active');
    if (ativo && ativo !== btn) {
      ativo.classList.remove('active');
      ativo.setAttribute('aria-selected', 'false');
    }
    btn.classList.add('active');
    btn.setAttribute('aria-selected', 'true');
    const filtro = btn.dataset.filter || 'all';
    aplicarFiltro(filtro);
  }

  filtrosContainer.querySelectorAll('.projeto-filter-btn').forEach(btn => {
    btn.addEventListener('click', onFiltroClick);
  });

  // Estado inicial: "Todas"
  aplicarFiltro('all');
}

window.addEventListener('load', setupProjetosFiltros);

// ====== Aprimoramento dos cards de projetos (badge Sem demo, rel seguro) ======
function setupProjetosBadgesELinks() {
  const cards = document.querySelectorAll('.projetos-cards-grid .projeto-card');
  if (!cards.length) return;

  cards.forEach(card => {
    const links = Array.from(card.querySelectorAll('.projeto-links a'));
    // Garantir rel seguro
    links.forEach(a => {
      if (a.target === '_blank') {
        const rel = (a.getAttribute('rel') || '').split(/\s+/);
        if (!rel.includes('noopener')) rel.push('noopener');
        if (!rel.includes('noreferrer')) rel.push('noreferrer');
        a.setAttribute('rel', rel.join(' ').trim());
      }
    });

    // Detectar se há link de demo real (não GitHub/GitLab)
    const hasDemo = links.some(a => {
      const href = (a.getAttribute('href') || '').toLowerCase();
      const isExternal = href.startsWith('http');
      const isRepo = href.includes('github.com') || href.includes('gitlab.com');
      const isDemoCandidate = isExternal && !isRepo;
      return isDemoCandidate && a.classList.contains('btn-projeto');
    });

    if (!hasDemo) {
      // Inserir badge "Sem demo"
      const content = card.querySelector('.projeto-content');
      if (content && !content.querySelector('.projeto-badge')) {
        const badge = document.createElement('span');
        badge.className = 'projeto-badge';
        badge.textContent = 'Sem demo';
        content.appendChild(badge);
      }
    }
  });
}

window.addEventListener('load', setupProjetosBadgesELinks);

// ====== Glow reativo na borda dos cards (segue cursor) ======
function setupProjetosReactiveGlow() {
  const cards = document.querySelectorAll('.projetos-cards-grid .projeto-card');
  if (!cards.length) return;

  cards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      card.style.setProperty('--mx', `${x}px`);
      card.style.setProperty('--my', `${y}px`);

      // 3D tilt baseado na posição do cursor
      const cx = rect.width / 2;
      const cy = rect.height / 2;
      const dx = (x - cx) / cx; // -1 .. 1
      const dy = (y - cy) / cy; // -1 .. 1
      const maxTilt = 10; // graus (reação mais rápida/visível)
      const ry = dx * maxTilt; // rotateY inclina conforme eixo X
      const rx = -dy * maxTilt; // rotateX inclina conforme eixo Y
      card.style.setProperty('--ry', `${ry.toFixed(2)}deg`);
      card.style.setProperty('--rx', `${rx.toFixed(2)}deg`);
    });
    card.addEventListener('mouseleave', () => {
      card.style.removeProperty('--mx');
      card.style.removeProperty('--my');
      card.style.removeProperty('--rx');
      card.style.removeProperty('--ry');
    });
  });
}

window.addEventListener('load', setupProjetosReactiveGlow);

// ====== Estrutura Holo/Flip para os cards de projetos ======
function setupProjetosHoloFlip() {
  const cards = Array.from(document.querySelectorAll('.projetos-cards-grid .projeto-card'));
  if (!cards.length) return;

  cards.forEach(card => {
    // Evita duplicar se já inicializado
    if (card.dataset.holoInit === 'true') return;

    // Coleta elementos existentes
    const thumb = card.querySelector('.projeto-thumb');
    const content = card.querySelector('.projeto-content');
    const links = card.querySelector('.projeto-links');

    // Cria faces
    const front = document.createElement('div');
    front.className = 'projeto-front';

    const back = document.createElement('div');
    back.className = 'projeto-back';
    back.setAttribute('aria-hidden', 'true');

    // Monta conteúdo do verso a partir do front
    const title = (content && content.querySelector('h3')?.textContent?.trim()) || 'Projeto';
    const desc = (content && content.querySelector('p')?.textContent?.trim()) || '';
    const tags = content ? Array.from(content.querySelectorAll('.projeto-tags li')).map(li => li.textContent.trim()) : [];

    back.innerHTML = `
      <div class="projeto-back-inner">
        <h3>${title}</h3>
        <p>${desc}</p>
        <h4>Tecnologias utilizadas</h4>
        <ul class="projeto-back-techs">
          ${tags.map(t => `<li><span>${t}</span></li>`).join('')}
        </ul>
      </div>
    `;

    // Botão de alternância (frente/verso)
    const toggle = document.createElement('button');
    toggle.className = 'projeto-toggle';
    toggle.type = 'button';
    toggle.setAttribute('aria-label', 'Ver detalhes do projeto');
    toggle.innerHTML = '<span class="projeto-toggle-icon" aria-hidden="true">⟲</span>';

    toggle.addEventListener('click', (e) => {
      e.stopPropagation();
      const flipped = card.classList.toggle('is-flipped');
      toggle.setAttribute('aria-pressed', flipped ? 'true' : 'false');
    });

    // Monta estrutura final
    const inner = document.createElement('div');
    inner.className = 'projeto-inner';

    // Limpa o card e distribui elementos nas faces
    // Move thumb e links para a frente; título na frente; conteúdo informativo no verso
    if (thumb) {
      front.appendChild(thumb);
    } else {
      const ph = document.createElement('div');
      ph.className = 'projeto-thumb thumb-placeholder';
      front.appendChild(ph);
    }

    // Título sobreposto na frente
    const titleOverlay = document.createElement('div');
    titleOverlay.className = 'projeto-title-overlay';
    titleOverlay.textContent = title;
    front.appendChild(titleOverlay);

    if (links) front.appendChild(links);
    inner.appendChild(front);
    inner.appendChild(back);

    // Remove quaisquer nós remanescentes (ex. content antigo)
    Array.from(card.childNodes).forEach(n => {
      if (n !== inner && n !== toggle) card.removeChild(n);
    });

    card.appendChild(inner);
    card.appendChild(toggle);
    card.dataset.holoInit = 'true';

    // Acessibilidade e interações por teclado
    if (!card.hasAttribute('tabindex')) card.setAttribute('tabindex', '0');
    card.setAttribute('role', 'group');
    card.setAttribute('aria-label', 'Card de projeto; pressione Enter para ver detalhes');

    const flipCard = (force) => {
      const willFlip = typeof force === 'boolean' ? force : !card.classList.contains('is-flipped');
      card.classList.toggle('is-flipped', willFlip);
      toggle.setAttribute('aria-pressed', willFlip ? 'true' : 'false');
    };

    card.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        flipCard();
      } else if (e.key === 'Escape') {
        flipCard(false);
      }
    });

    // Evita flip ao clicar em links/botões internos
    card.addEventListener('click', (e) => {
      const target = e.target;
      if (target.closest && target.closest('a, button')) {
        return; // deixa o click passar sem flip
      }
    }, true);
});
}

window.addEventListener('load', setupProjetosHoloFlip);