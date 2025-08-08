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