
const nav = document.getElementById('nav');
let productLocalStorage = JSON.parse(localStorage.getItem('productInfo')) || [];

nav.innerHTML = `
<div class="navbar bg-base-100 shadow-sm">
  <div class="flex-1">
    <a class="btn btn-ghost text-xl">daisyUI</a>
  </div>
  <div class="flex-none">
    <div class="dropdown dropdown-end">
      <div tabindex="0" role="button" class="btn btn-ghost btn-circle">
        <div class="indicator">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
          <span id="cartCount" class="badge badge-sm indicator-item">${productLocalStorage.length}</span>
        </div>
      </div>
      <div tabindex="0" class="card card-compact dropdown-content bg-base-100 z-10 mt-3 w-72 shadow">
        <div class="card-body gap-2">
          <div id="wrapperList" class="flex flex-col gap-2 max-h-64 overflow-auto"></div>
          <span id="subtotal" class="text-info">Subtotal: $0.00</span>
          <div class="card-actions">
            <button class="btn btn-primary btn-block">View cart</button>
          </div>
        </div>
      </div>
    </div>

    <div class="dropdown dropdown-end">
      <div tabindex="0" role="button" class="btn btn-ghost btn-circle avatar">
        <div class="w-10 rounded-full">
          <img alt="Tailwind CSS Navbar component"
            src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp" />
        </div>
      </div>
      <ul tabindex="0" class="menu menu-sm dropdown-content bg-base-100 rounded-box z-10 mt-3 w-52 p-2 shadow">
        <li><a class="justify-between">Profile <span class="badge">New</span></a></li>
        <li><a>Settings</a></li>
        <li><a>Logout</a></li>
      </ul>
    </div>
  </div>
</div>
`;


function limitWords(text, count) {
  const words = String(text).split(" ");
  return words.length > count ? words.slice(0, count).join(" ") + "..." : text;
}

function updateCartUI() {
  const list = nav.querySelector('#wrapperList');
  const subtotalEl = nav.querySelector('#subtotal');
  const countEl = nav.querySelector('#cartCount');

  const items = JSON.parse(localStorage.getItem('productInfo')) || [];

  list.innerHTML = '';
  let subtotal = 0;

  items.forEach(p => {
    subtotal += Number(p.price) || 0;

    const row = document.createElement('div');
    row.className = 'flex items-center gap-2';
    row.innerHTML = `
      <img class="w-10" src="${p.image}" alt="" />
      <div class="flex-1">
        <h2 class="font-bold">${limitWords(p.title, 3)}</h2>
        <p class="text-sm opacity-70">${limitWords(p.description, 5)}</p>
        <span class="font-medium">$${p.price}</span>
      </div>
    `;
    list.appendChild(row);
  });

  countEl.textContent = items.length;
  subtotalEl.textContent = 'Subtotal: $' + subtotal.toFixed(2);
}


function renderList(items) {
  const wrapper = document.getElementById('wrapper');
  wrapper.innerHTML = '';


  items.forEach(product => {
    const container = document.createElement('div');
    container.innerHTML = `
      <div class="card bg-base-100 w-96 h-96 shadow-sm">
        <figure class="h-48 overflow-hidden flex items-center justify-center">
          <img src="${product.image}" alt="${limitWords(product.title, 6)}" class="max-h-48" />
        </figure>
        <div class="card-body">
          <h2 class="card-title text-sm">${limitWords(product.title, 10)}</h2>
          <p class="text-sm">${limitWords(product.description, 20)}</p>
          <p class="flex justify-end text-primary font-semibold">$${product.price}</p>
          <div class="card-actions justify-end">
            <button class="btn btn-primary">Buy Now</button>
          </div>
        </div>
      </div>
    `;

    const submitBtn = container.querySelector('button');
    submitBtn.addEventListener('click', () => {
      const saved = JSON.parse(localStorage.getItem('productInfo')) || [];
      saved.push(product);
      localStorage.setItem('productInfo', JSON.stringify(saved));
      updateCartUI(); 
    });

    wrapper.appendChild(container);
  });
}


updateCartUI();

fetch('https://fakestoreapi.com/products?limit=10')
  .then(r => r.json())
  .then(data => renderList(data))
  .catch(console.error);
