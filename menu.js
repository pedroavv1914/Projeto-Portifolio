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