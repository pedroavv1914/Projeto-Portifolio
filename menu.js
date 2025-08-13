    // ==============================
    // Contato: Validação em tempo real e CTAs
    // ==============================
    (function setupContatoForm() {
        const form = document.getElementById('contato-form');
        if (!form) return; // safe guard

        const nome = document.getElementById('nome');
        const email = document.getElementById('email');
        const telefone = document.getElementById('telefone');
        const mensagem = document.getElementById('mensagem');
        const statusBox = form.querySelector('.form-status');
        const submitBtn = document.getElementById('btn-submit-contato');
        const waCta = document.getElementById('cta-whatsapp');
        const agendarCta = document.getElementById('cta-agendar');

        const errNome = document.getElementById('erro-nome');
        const errEmail = document.getElementById('erro-email');
        const errTelefone = document.getElementById('erro-telefone');
        const errMensagem = document.getElementById('erro-mensagem');

        const setStatus = (msg, type = 'neutral') => {
            if (!statusBox) return;
            statusBox.textContent = msg || '';
            statusBox.classList.remove('ok', 'error', 'loading');
            if (type) statusBox.classList.add(type);
        };

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i;

        function setInvalid(field, errEl, message) {
            if (!field) return false;
            field.classList.add('is-invalid');
            field.classList.remove('is-valid');
            field.setAttribute('aria-invalid', 'true');
            if (errEl) errEl.textContent = message || '';
            return false;
        }

        function setValid(field, errEl) {
            if (!field) return true;
            field.classList.remove('is-invalid');
            field.classList.add('is-valid');
            field.removeAttribute('aria-invalid');
            if (errEl) errEl.textContent = '';
            return true;
        }

        function validateNome() {
            const value = (nome?.value || '').trim();
            if (value.length < 2) return setInvalid(nome, errNome, 'Informe seu nome.');
            return setValid(nome, errNome);
        }

        function validateEmail() {
            const value = (email?.value || '').trim();
            if (!emailRegex.test(value)) return setInvalid(email, errEmail, 'E-mail inválido.');
            return setValid(email, errEmail);
        }

        function validateTelefone() {
            // opcional: apenas limpa erro e remove inválido
            const value = (telefone?.value || '').trim();
            if (!value) return setValid(telefone, errTelefone);
            // valida mínimo de dígitos quando preenchido
            const digits = value.replace(/\D/g, '');
            if (digits.length < 10) return setInvalid(telefone, errTelefone, 'Informe DDD + número.');
            return setValid(telefone, errTelefone);
        }

        function validateMensagem() {
            const value = (mensagem?.value || '').trim();
            if (value.length < 6) return setInvalid(mensagem, errMensagem, 'Descreva sua mensagem.');
            return setValid(mensagem, errMensagem);
        }

        function validateAll() {
            const v1 = validateNome();
            const v2 = validateEmail();
            const v3 = validateTelefone();
            const v4 = validateMensagem();
            return v1 && v2 && v3 && v4;
        }

        // Atualiza links de WhatsApp conforme preenchimento
        function buildWaHref(number, text) {
            const base = 'https://wa.me/';
            const digits = (number || '').replace(/\D/g, '');
            const finalText = encodeURIComponent(text || 'Olá Pedro! Vim pelo portfólio.');
            const target = digits || '5511974244619';
            return `${base}${target}?text=${finalText}`;
        }

        function updateCtas() {
            const nomeV = (nome?.value || '').trim();
            const telV = (telefone?.value || '').trim();
            const msgV = (mensagem?.value || '').trim();
            const emailV = (email?.value || '').trim();
            const texto = `Olá Pedro! Sou ${nomeV || 'um potencial cliente'}. Meu e-mail: ${emailV || '—'}. ${msgV || ''}`;
            const href = buildWaHref(telV, texto);
            if (waCta) waCta.href = href;
            if (agendarCta) agendarCta.href = buildWaHref(telV, 'Olá Pedro! Podemos agendar uma call?');
        }

        [nome, email, telefone, mensagem].forEach((el) => {
            if (!el) return;
            el.addEventListener('input', () => {
                // Máscara BR para telefone (apenas exibição)
                if (el === telefone) {
                    const digits = (telefone.value || '').replace(/\D/g, '').slice(0, 11);
                    let formatted = digits;
                    if (digits.length > 0) {
                        if (digits.length <= 10) {
                            // (99) 9999-9999
                            formatted = digits
                              .replace(/(\d{2})(\d)/, '($1) $2')
                              .replace(/(\d{4})(\d)/, '$1-$2')
                              .replace(/(-\d{4})\d+?$/, '$1');
                        } else {
                            // (99) 99999-9999
                            formatted = digits
                              .replace(/(\d{2})(\d)/, '($1) $2')
                              .replace(/(\d{5})(\d)/, '$1-$2')
                              .replace(/(-\d{4})\d+?$/, '$1');
                        }
                        telefone.value = formatted;
                    }
                }
                switch (el) {
                    case nome: validateNome(); break;
                    case email: validateEmail(); break;
                    case telefone: validateTelefone(); break;
                    case mensagem: validateMensagem(); break;
                }
                updateCtas();
            });
            el.addEventListener('blur', () => {
                switch (el) {
                    case nome: validateNome(); break;
                    case email: validateEmail(); break;
                    case telefone: validateTelefone(); break;
                    case mensagem: validateMensagem(); break;
                }
            });
        });

        form.addEventListener('submit', (e) => {
            if (!validateAll()) {
                e.preventDefault();
                setStatus('Por favor, corrija os campos destacados.', 'error');
                const firstInvalid = form.querySelector('.is-invalid');
                if (firstInvalid) firstInvalid.focus();
                return;
            }
            // Feedback de envio (navegará para formsubmit)
            if (submitBtn) {
                submitBtn.disabled = true;
                submitBtn.value = 'ENVIANDO...';
            }
            setStatus('Enviando...', 'loading');
        });

        // Inicializa CTAs
        updateCtas();
    })();

// ==============================
// Footer: ano atual automático
// ==============================
(function setupFooterYear() {
  function setYear() {
    const span = document.getElementById('ano-atual');
    if (span) span.textContent = new Date().getFullYear();
  }
  window.addEventListener('load', setYear);
})();

// ====== MENU MOBILE (com null checks) ======
const btnMenu = document.getElementById('btn-menu');
const menu = document.getElementById('menu-mobile');
const overlay = document.getElementById('overlay-menu');

if (btnMenu && menu && overlay) {
  btnMenu.addEventListener('click', () => {
    menu.classList.add('abrir-menu');
  });

  menu.addEventListener('click', () => {
    menu.classList.remove('abrir-menu');
  });

  overlay.addEventListener('click', () => {
    menu.classList.remove('abrir-menu');
  });
}

// ====== BOTÃO VOLTAR AO TOPO (resiliente) ======
const btn = document.getElementById('btnTopo');
let scrollTimeout;

if (btn) {
  window.addEventListener('scroll', () => {
    btn.style.display = 'block';

    clearTimeout(scrollTimeout);
    scrollTimeout = setTimeout(() => {
      btn.style.display = 'none';
    }, 1000);
  });
}

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

  const botoes = Array.from(filtroContainer.querySelectorAll('.filtro-btn[data-filter]'));
  const paineis = Array.from(document.querySelectorAll('.habilidades-paineis .painel-categoria'));
  const painelsWrap = document.querySelector('.habilidades-paineis');
  const toggleBtn = document.getElementById('spec-toggle-details');

  function aplicarFiltro(valor) {
    paineis.forEach(painel => {
      const categoria = painel.getAttribute('data-category');
      const mostrar = valor === 'all' || categoria === valor;
      painel.classList.toggle('is-hidden', !mostrar);
      painel.setAttribute('aria-hidden', (!mostrar).toString());
    });
  }

  botoes.forEach(btn => {
    btn.addEventListener('click', () => {
      const ativo = filtroContainer.querySelector('.filtro-btn.active');
      if (ativo && ativo !== btn) ativo.classList.remove('active');
      btn.classList.add('active');
      const filtro = btn.getAttribute('data-filter') || 'all';
      aplicarFiltro(filtro);
      // ARIA tab state
      filtroContainer.querySelectorAll('.filtro-btn[role="tab"]').forEach(tab => {
        tab.setAttribute('aria-selected', tab === btn ? 'true' : 'false');
      });
    });
  });

  // Estado inicial: "Todas"
  aplicarFiltro('all');

  // Toggle de detalhes (mostrar/ocultar chips)
  if (toggleBtn && painelsWrap) {
    // estado inicial
    const startPressed = toggleBtn.getAttribute('aria-pressed') === 'true';
    painelsWrap.classList.toggle('details-off', !startPressed);
    toggleBtn.textContent = startPressed ? 'Ocultar detalhes' : 'Mostrar detalhes';

    toggleBtn.addEventListener('click', () => {
      const pressed = toggleBtn.getAttribute('aria-pressed') === 'true';
      const next = !pressed;
      toggleBtn.setAttribute('aria-pressed', String(next));
      painelsWrap.classList.toggle('details-off', !next);
      toggleBtn.textContent = next ? 'Ocultar detalhes' : 'Mostrar detalhes';
    });
  }
}

function setupHabilidadesPaineisAccordion() {
  const paineis = document.querySelectorAll('.habilidades-paineis .painel-categoria');
  if (!paineis.length) return;

  paineis.forEach(painel => {
    const header = painel.querySelector('.painel-header');
    const body = painel.querySelector('.painel-body');
    if (!header || !body) return;

    header.setAttribute('aria-controls', body.id || '');
    header.setAttribute('type', 'button');
    header.addEventListener('click', () => {
      const expanded = header.getAttribute('aria-expanded') === 'true';
      header.setAttribute('aria-expanded', String(!expanded));
      painel.classList.toggle('collapsed', expanded);
    });
    header.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        header.click();
      }
    });
  });
}

window.addEventListener('load', setupHabilidadesFiltro);
window.addEventListener('load', setupHabilidadesPaineisAccordion);

// ====== LISTA PRO + BADGES (Option C) INTERAÇÕES ======
function setupHabilidadesOptionCInteractions() {
  const container = document.querySelector('.habilidades-paineis');
  if (!container) return;

  const allRows = Array.from(container.querySelectorAll('.skill-row'));
  if (!allRows.length) return;

  // Make rows focusable and set initial aria state
  allRows.forEach(row => {
    if (!row.hasAttribute('tabindex')) row.setAttribute('tabindex', '0');
    row.setAttribute('role', 'button');
    row.setAttribute('aria-expanded', 'false');

    // Click toggles reveal
    row.addEventListener('click', (e) => {
      // Avoid toggling when clicking a chip link in future; currently chips are plain lis
      toggleRowReveal(row);
    });

    // Keyboard support
    row.addEventListener('keydown', (e) => {
      const key = e.key;
      if (key === 'Enter' || key === ' ') {
        e.preventDefault();
        toggleRowReveal(row);
      } else if (key === 'ArrowDown' || key === 'ArrowUp') {
        e.preventDefault();
        const visibleRows = Array.from(container.querySelectorAll('.skill-row'))
          .filter(r => r.offsetParent !== null); // visible in layout
        const idx = visibleRows.indexOf(row);
        const delta = key === 'ArrowDown' ? 1 : -1;
        const next = visibleRows[idx + delta];
        if (next) next.focus();
      }
    });
  });

  function toggleRowReveal(row) {
    const isOpen = row.classList.toggle('reveal');
    row.setAttribute('aria-expanded', String(isOpen));
    // Integrate with chips compression: expand all chips on open, recompress on close
    const chips = row.querySelector('.skill-chips');
    if (chips) {
      if (isOpen) {
        expandChips(chips);
      } else {
        compressChips(chips);
      }
    }
  }
}

window.addEventListener('load', setupHabilidadesOptionCInteractions);

// ====== Chips compression (+N toggle) ======
function setupSkillChipsCompression(limit = 3) {
  const lists = document.querySelectorAll('.skill-chips');
  lists.forEach(ul => compressChips(ul, limit));

  // Delegate clicks on toggle chips
  document.addEventListener('click', (e) => {
    const toggle = e.target.closest('li.chip-toggle');
    if (!toggle) return;
    const ul = toggle.parentElement;
    if (!ul || !ul.classList.contains('skill-chips')) return;
    const expanded = toggle.getAttribute('aria-expanded') === 'true';
    if (expanded) {
      compressChips(ul, parseInt(toggle.getAttribute('data-limit') || '3', 10));
    } else {
      expandChips(ul);
    }
  });

  // Keyboard accessibility
  document.addEventListener('keydown', (e) => {
    if (e.key !== 'Enter' && e.key !== ' ') return;
    const toggle = e.target.closest('li.chip-toggle');
    if (!toggle) return;
    e.preventDefault();
    toggle.click();
  });
}

function compressChips(ul, limit = 3) {
  const items = Array.from(ul.querySelectorAll('li:not(.chip-toggle)'));
  const toggle = ul.querySelector('li.chip-toggle');
  const extra = items.slice(limit);
  items.forEach((li, idx) => li.classList.toggle('chip-hidden', idx >= limit));
  const count = Math.max(extra.length, 0);
  if (count > 0) {
    if (!toggle) {
      const t = document.createElement('li');
      t.className = 'chip-toggle';
      t.setAttribute('role', 'button');
      t.setAttribute('tabindex', '0');
      ul.appendChild(t);
    }
    const tgl = ul.querySelector('li.chip-toggle');
    tgl.textContent = `+${count}`;
    tgl.setAttribute('aria-expanded', 'false');
    tgl.setAttribute('aria-label', `Mostrar mais ${count} itens`);
    tgl.setAttribute('data-limit', String(limit));
  } else if (toggle) {
    toggle.remove();
  }
}

function expandChips(ul) {
  const items = Array.from(ul.querySelectorAll('li:not(.chip-toggle)'));
  const toggle = ul.querySelector('li.chip-toggle');
  items.forEach(li => li.classList.remove('chip-hidden'));
  if (toggle) {
    toggle.textContent = '−';
    toggle.setAttribute('aria-expanded', 'true');
    toggle.setAttribute('aria-label', 'Mostrar menos');
  }
}

window.addEventListener('load', () => setupSkillChipsCompression(3));

// ====== Glassy Tiles helpers ======
function setupSkillTilesLevel() {
  const tiles = document.querySelectorAll('.habilidades-paineis .skill-row');
  tiles.forEach(tile => {
    const badge = tile.querySelector('.level-badge');
    if (!badge) return;
    const txt = (badge.textContent || '').trim().toLowerCase();
    if (txt.includes('forte') || txt.includes('strong')) {
      tile.setAttribute('data-level', 'strong');
    } else if (txt.includes('bom') || txt.includes('good')) {
      tile.setAttribute('data-level', 'good');
    } else {
      tile.removeAttribute('data-level');
    }
  });
}

function setupSkillTilesTilt() {
  // Distortion/tilt effect disabled by request; keep function as no-op.
  return;
}

window.addEventListener('load', setupSkillTilesLevel);
window.addEventListener('load', setupSkillTilesTilt);

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

// ... (rest of the code remains the same)

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

// ... (rest of the code remains the same)

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

// ... (rest of the code remains the same)

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

// ... (rest of the code remains the same)

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

// ... (rest of the code remains the same)

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
      // Tilt 3D desativado: não definir --rx/--ry
    });
    card.addEventListener('mouseleave', () => {
      card.style.removeProperty('--mx');
      card.style.removeProperty('--my');
      // Não há --rx/--ry para limpar
    });
  });
}

window.addEventListener('load', setupProjetosReactiveGlow);

// ====== Estrutura Holo/Flip para os cards de projetos ======
function setupProjetosHoloFlip() {
  const cards = Array.from(document.querySelectorAll('.projetos-cards-grid .projeto-card'));
  if (!cards.length) return;

  cards.forEach((card, idx) => {
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

    const backId = `projeto-back-${idx}`;
    const titleId = `projeto-back-title-${idx}`;
    back.setAttribute('id', backId);
    back.setAttribute('role', 'region');
    back.setAttribute('aria-labelledby', titleId);

    back.innerHTML = `
      <div class="projeto-back-inner" tabindex="-1">
        <h3 id="${titleId}">${title}</h3>
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
    toggle.setAttribute('aria-controls', backId);
    toggle.setAttribute('aria-expanded', 'false');
    toggle.innerHTML = '<span class="projeto-toggle-icon" aria-hidden="true">⟲</span>';

    toggle.addEventListener('click', (e) => {
      e.stopPropagation();
      const flipped = card.classList.toggle('is-flipped');
      toggle.setAttribute('aria-pressed', flipped ? 'true' : 'false');
      toggle.setAttribute('aria-expanded', flipped ? 'true' : 'false');
      back.setAttribute('aria-hidden', flipped ? 'false' : 'true');
      if (flipped) {
        const backInner = back.querySelector('.projeto-back-inner');
        backInner && backInner.focus();
      }
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
      toggle.setAttribute('aria-expanded', willFlip ? 'true' : 'false');
      back.setAttribute('aria-hidden', willFlip ? 'false' : 'true');
      if (willFlip) {
        const backInner = back.querySelector('.projeto-back-inner');
        backInner && backInner.focus();
      } else {
        toggle.focus();
      }
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

// ==============================
// NAVBAR: Hide on scroll + Active link highlight
// ==============================
(function setupNavbarMagic() {
  const header = document.querySelector('header.nav-magic');
  if (!header) return;

  let lastY = window.scrollY;
  let ticking = false;

  const desktopLinks = Array.from(document.querySelectorAll('header.nav-magic .menu-desktop a[href^="#"]'));
  const mobileLinks = Array.from(document.querySelectorAll('#menu-mobile a[href^="#"]'));
  const allLinks = [...desktopLinks, ...mobileLinks];
  const progressEl = header.querySelector('.nav-progress');
  const desktopMenu = header.querySelector('.menu-desktop');

  // Map id -> link elements
  const linkMap = new Map();
  allLinks.forEach(a => {
    const id = a.getAttribute('href').replace('#', '').trim();
    if (!id) return;
    if (!linkMap.has(id)) linkMap.set(id, []);
    linkMap.get(id).push(a);
  });

  const sections = Array.from(document.querySelectorAll('section[id], main section[id]'));

  function updateActiveLink() {
    let currentId = '';
    const y = window.scrollY + 120; // offset for sticky header
    for (const sec of sections) {
      const rect = sec.getBoundingClientRect();
      const top = rect.top + window.scrollY;
      if (top <= y) currentId = sec.id;
    }
    // Clear
    allLinks.forEach(a => a.classList.remove('is-active'));
    if (currentId && linkMap.has(currentId)) {
      linkMap.get(currentId).forEach(a => a.classList.add('is-active'));
    }
    // Move floating indicator to active (desktop)
    if (desktopMenu) {
      const activeDesktop = desktopLinks.find(a => a.classList.contains('is-active')) || desktopLinks[0];
      if (activeDesktop) positionIndicatorToLink(activeDesktop);
    }
  }

  function positionIndicatorToLink(link) {
    if (!desktopMenu || !link) return;
    const menuRect = desktopMenu.getBoundingClientRect();
    const linkRect = link.getBoundingClientRect();
    const x = Math.max(0, linkRect.left - menuRect.left);
    const w = linkRect.width;
    desktopMenu.style.setProperty('--nav-indicator-x', `${x - 6}px`);
    desktopMenu.style.setProperty('--nav-indicator-w', `${w + 12}px`);
  }

  function onScroll() {
    if (!ticking) {
      window.requestAnimationFrame(() => {
        const y = window.scrollY;
        // toggle scrolled look
        if (y > 8) header.classList.add('scrolled'); else header.classList.remove('scrolled');
        // always keep navbar visible
        header.classList.remove('nav-hidden');
        // progress bar width
        if (progressEl) {
          const doc = document.documentElement;
          const max = (doc.scrollHeight - window.innerHeight) || 1;
          const pct = Math.min(100, Math.max(0, (y / max) * 100));
          progressEl.style.width = `${pct}%`;
        }
        lastY = y;
        updateActiveLink();
        ticking = false;
      });
      ticking = true;
    }
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('load', () => { updateActiveLink(); onScroll(); });

  // Close mobile drawer when clicking a link
  const menuEl = document.getElementById('menu-mobile');
  const overlayEl = document.getElementById('overlay-menu');
  if (menuEl) {
    mobileLinks.forEach(a => a.addEventListener('click', () => {
      menuEl.classList.remove('abrir-menu');
      if (overlayEl) overlayEl.click?.();
    }));
  }

  // Magnetic hover for desktop links
  desktopLinks.forEach(a => {
    a.addEventListener('mousemove', (e) => {
      const r = a.getBoundingClientRect();
      const cx = r.left + r.width / 2;
      const cy = r.top + r.height / 2;
      const dx = (e.clientX - cx) / (r.width / 2);
      const dy = (e.clientY - cy) / (r.height / 2);
      const max = 4; // px
      a.style.setProperty('--tx', `${dx * max}px`);
      a.style.setProperty('--ty', `${dy * max}px`);
    });
    a.addEventListener('mouseleave', () => {
      a.style.setProperty('--tx', '0px');
      a.style.setProperty('--ty', '0px');
    });
    // Move indicator on hover for responsiveness
    a.addEventListener('mouseenter', () => positionIndicatorToLink(a));
  });

  // Position indicator initially
  if (desktopLinks.length) {
    positionIndicatorToLink(desktopLinks[0]);
  }

  // ==============================
  // Mega menu (Projetos)
  // ==============================
  const megaTrigger = header.querySelector('.menu-desktop a.has-mega[data-mega="projetos"]');
  const megaEl = document.getElementById('nav-mega-projetos');
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function openMega() {
    if (!megaEl) return;
    megaEl.classList.add('open');
    megaEl.setAttribute('aria-hidden', 'false');
  }
  function closeMega() {
    if (!megaEl) return;
    megaEl.classList.remove('open');
    megaEl.setAttribute('aria-hidden', 'true');
  }
  if (megaTrigger && megaEl) {
    let overMega = false;
    megaTrigger.addEventListener('mouseenter', openMega);
    megaTrigger.addEventListener('focus', openMega);
    header.addEventListener('mouseleave', () => { if (!overMega) closeMega(); });
    megaEl.addEventListener('mouseenter', () => { overMega = true; });
    megaEl.addEventListener('mouseleave', () => { overMega = false; closeMega(); });
    // Click toggles on desktop as well
    megaTrigger.addEventListener('click', (e) => {
      e.preventDefault();
      if (megaEl.classList.contains('open')) closeMega(); else openMega();
    });
    // Close on scroll
    window.addEventListener('scroll', () => { closeMega(); }, { passive: true });
  }

  // ==============================
  // Header 3D tilt
  // ==============================
  const interfaceEl = header.querySelector('.interface');
  if (interfaceEl && !prefersReduced) {
    const maxDeg = 2.2;
    interfaceEl.addEventListener('mousemove', (e) => {
      const r = interfaceEl.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width; // 0..1
      const y = (e.clientY - r.top) / r.height; // 0..1
      const ry = (x - 0.5) * maxDeg * 2; // -max..max
      const rx = (0.5 - y) * maxDeg * 2;
      header.style.setProperty('--rx', rx.toFixed(2) + 'deg');
      header.style.setProperty('--ry', ry.toFixed(2) + 'deg');
    });
    interfaceEl.addEventListener('mouseleave', () => {
      header.style.removeProperty('--rx');
      header.style.removeProperty('--ry');
    });
  }

  // ==============================
  // Command Palette (Ctrl+K)
  // ==============================
  const cmdk = document.getElementById('cmdk');
  const cmdkInput = document.getElementById('cmdk-input');
  const cmdkList = document.getElementById('cmdk-list');
  let cmdkOpen = false;
  let cmdkIndex = -1;

  function openCmdk() {
    if (!cmdk || !cmdkInput) return;
    cmdk.classList.add('open');
    cmdk.setAttribute('aria-hidden', 'false');
    cmdkOpen = true;
    cmdkIndex = -1;
    cmdkInput.value = '';
    filterCmdk('');
    setTimeout(() => cmdkInput.focus(), 0);
  }
  function closeCmdk() {
    if (!cmdk) return;
    cmdk.classList.remove('open');
    cmdk.setAttribute('aria-hidden', 'true');
    cmdkOpen = false;
  }
  function filterCmdk(q) {
    if (!cmdkList) return;
    const items = Array.from(cmdkList.querySelectorAll('li'));
    const term = q.trim().toLowerCase();
    items.forEach(li => {
      const text = li.textContent.toLowerCase();
      li.style.display = term ? (text.includes(term) ? '' : 'none') : '';
    });
  }
  function moveCmdk(delta) {
    if (!cmdkList) return;
    const items = Array.from(cmdkList.querySelectorAll('li')).filter(li => li.style.display !== 'none');
    if (!items.length) return;
    cmdkIndex = (cmdkIndex + delta + items.length) % items.length;
    items.forEach(li => li.classList.remove('active'));
    items[cmdkIndex].classList.add('active');
    items[cmdkIndex].scrollIntoView({ block: 'nearest' });
  }
  function activateCmdk() {
    if (!cmdkList) return;
    const active = cmdkList.querySelector('li.active') || cmdkList.querySelector('li:not([style*="display: none"])');
    if (active) {
      const href = active.getAttribute('data-href');
      if (href && href.startsWith('#')) {
        closeCmdk();
        const el = document.querySelector(href);
        if (el) el.scrollIntoView({ behavior: prefersReduced ? 'auto' : 'smooth' });
      }
    }
  }
  // Global hotkey (only if palette exists)
  if (cmdk) {
    window.addEventListener('keydown', (e) => {
      const mod = e.ctrlKey || e.metaKey;
      if (mod && (e.key === 'k' || e.key === 'K')) {
        e.preventDefault();
        cmdkOpen ? closeCmdk() : openCmdk();
      }
      if (!cmdkOpen) return;
      if (e.key === 'Escape') { e.preventDefault(); closeCmdk(); }
      if (e.key === 'ArrowDown') { e.preventDefault(); moveCmdk(1); }
      if (e.key === 'ArrowUp') { e.preventDefault(); moveCmdk(-1); }
      if (e.key === 'Enter') { e.preventDefault(); activateCmdk(); }
    });
  }
  if (cmdkInput) {
    cmdkInput.addEventListener('input', () => filterCmdk(cmdkInput.value));
  }
  if (cmdk) {
    const backdrop = cmdk.querySelector('.cmdk-backdrop');
    backdrop?.addEventListener('click', closeCmdk);
    cmdkList?.addEventListener('click', (e) => {
      const li = e.target.closest('li');
      if (!li) return;
      const href = li.getAttribute('data-href');
      if (href) {
        closeCmdk();
        const el = document.querySelector(href);
        if (el) el.scrollIntoView({ behavior: prefersReduced ? 'auto' : 'smooth' });
      }
    });
  }
})();