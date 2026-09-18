// DATA DEFINITIONS
const CATEGORIES = ["All", "Grains & Flours", "Spices & Seeds", "Oils", "Fresh Produce", "Meat & Seafood"];

const CATEGORY_META = [
    { title: "Grains & Flours", count: "12 Products", desc: "Authentic Garri, Yam flour, Plantain flour, and Semolina.", image: "https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&q=80&w=600" },
    { title: "Spices & Seeds", count: "18 Products", desc: "Suya pepper mix, Egusi, Ogbono, and Suya seasonings.", image: "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&q=80&w=600" },
    { title: "Oils", count: "8 Products", desc: "Unrefined red palm oil, groundnut oils, and coconut oil.", image: "https://images.unsplash.com/photo-1620706857370-e1b9770e8bb1?auto=format&fit=crop&q=80&w=600" },
    { title: "Fresh Produce", count: "15 Products", desc: "Fresh plantains, yam tubers, scotch bonnets, and bitter leaves.", image: "https://images.unsplash.com/photo-1604543519967-0eb2db2a60ce?auto=format&fit=crop&q=80&w=600" },
    { title: "Meat & Seafood", count: "10 Products", desc: "Dried smoked catfish, crayfish, stockfish, and smoked turkey.", image: "https://images.unsplash.com/photo-1511189970929-1836c2438cce?auto=format&fit=crop&q=80&w=600" }
];

const PRODUCTS = [
    { id: 1, name: "Premium Garri (Yellow)", price: 15.99, category: "Grains & Flours", rating: 4.8, reviews: 124, image: "https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&q=80&w=600" },
    { id: 2, name: "Authentic Red Palm Oil - 2L", price: 24.50, category: "Oils", rating: 4.9, reviews: 89, image: "https://images.unsplash.com/photo-1620706857370-e1b9770e8bb1?auto=format&fit=crop&q=80&w=600" },
    { id: 3, name: "Egusi Seeds (Ground Melon)", price: 12.00, category: "Spices & Seeds", rating: 4.7, reviews: 56, image: "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&q=80&w=600" },
    { id: 4, name: "Pounded Yam Flour (Iyan)", price: 18.99, category: "Grains & Flours", rating: 4.9, reviews: 210, image: "https://images.unsplash.com/photo-1574316071802-0d684efa7ea5?auto=format&fit=crop&q=80&w=600" },
    { id: 5, name: "Spicy Suya Mix", price: 8.50, category: "Spices & Seeds", rating: 5.0, reviews: 342, image: "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&q=80&w=600" },
    { id: 6, name: "Fresh Plantains (Bunch)", price: 9.99, category: "Fresh Produce", rating: 4.6, reviews: 45, image: "https://images.unsplash.com/photo-1604543519967-0eb2db2a60ce?auto=format&fit=crop&q=80&w=600" },
    { id: 7, name: "Dried Catfish", price: 22.00, category: "Meat & Seafood", rating: 4.5, reviews: 78, image: "https://images.unsplash.com/photo-1511189970929-1836c2438cce?auto=format&fit=crop&q=80&w=600" },
    { id: 8, name: "Washed Bitter Leaf", price: 6.99, category: "Fresh Produce", rating: 4.3, reviews: 23, image: "https://images.unsplash.com/photo-1550828553-61cefc487cc5?auto=format&fit=crop&q=80&w=600" }
];

// STATE
let activeView = "shop";
let cart = [];
let selectedCategory = "All";
let searchQuery = "";
let isMobileMenuOpen = false;

// INITIALIZATION
document.addEventListener('DOMContentLoaded', () => {
    renderCategories();
    renderCategoryGrid();
    renderProducts();
    lucide.createIcons();

    // Event Listeners
    document.getElementById('cart-btn').addEventListener('click', openCart);
    document.getElementById('mobile-menu-btn').addEventListener('click', toggleMobileMenu);

    document.getElementById('desktop-search').addEventListener('input', (e) => {
        searchQuery = e.target.value;
        document.getElementById('mobile-search').value = searchQuery;
        if (activeView !== 'shop') navigateTo('shop');
        renderProducts();
    });

    document.getElementById('mobile-search').addEventListener('input', (e) => {
        searchQuery = e.target.value;
        document.getElementById('desktop-search').value = searchQuery;
        if (activeView !== 'shop') navigateTo('shop');
        renderProducts();
    });
});

// NAVIGATION ROUTER
function navigateTo(pageName) {
    activeView = pageName;

    // Hide all page views
    document.querySelectorAll('.page-view').forEach(view => view.classList.add('hidden'));

    // Show target page view
    const target = document.getElementById(`view-${pageName}`);
    if (target) target.classList.remove('hidden');

    // Update desktop nav styles
    document.querySelectorAll('#desktop-nav .nav-link').forEach(btn => {
        const navType = btn.getAttribute('data-nav');
        if (navType === pageName) {
            btn.className = "nav-link text-sm font-bold text-orange-600 border-b-2 border-orange-600 pb-1 transition-all";
        } else {
            btn.className = "nav-link text-sm font-semibold text-neutral-500 hover:text-orange-600 pb-1 transition-all";
        }
    });

    // Close mobile menu if open
    if (isMobileMenuOpen) toggleMobileMenu();

    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// RENDER SHOP CATEGORY BUTTONS
function renderCategories() {
    const container = document.getElementById('category-container');
    if (!container) return;

    container.innerHTML = CATEGORIES.map(cat => {
        const isActive = cat === selectedCategory;
        const activeClass = "bg-orange-600 text-white shadow-md shadow-orange-600/20 font-bold";
        const inactiveClass = "bg-white text-neutral-600 border border-neutral-200 hover:border-orange-500 hover:text-orange-600 font-semibold";

        return `
            <button 
                onclick="filterByCategory('${cat}')" 
                class="px-5 py-2.5 rounded-full text-sm whitespace-nowrap transition-all ${isActive ? activeClass : inactiveClass}"
            >
                ${cat}
            </button>
        `;
    }).join('');
}

function filterByCategory(catName) {
    selectedCategory = catName;
    renderCategories();
    renderProducts();
}

// RENDER CATEGORIES PAGE GRID
function selectCategoryFromGrid(catName) {
    selectedCategory = catName;
    renderCategories();
    navigateTo('shop');
    renderProducts();
}

function renderCategoryGrid() {
    const grid = document.getElementById('category-cards-grid');
    if (!grid) return;

    grid.innerHTML = CATEGORY_META.map(cat => `
        <div onclick="selectCategoryFromGrid('${cat.title}')" class="group bg-white rounded-3xl border border-neutral-100 overflow-hidden shadow-sm hover:shadow-xl transition-all cursor-pointer flex flex-col">
            <div class="h-48 overflow-hidden relative">
                <img src="${cat.image}" alt="${cat.title}" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500">
                <span class="absolute top-4 right-4 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-xs font-bold text-neutral-900">${cat.count}</span>
            </div>
            <div class="p-6 flex flex-col flex-grow">
                <h3 class="text-xl font-bold text-neutral-900 mb-2">${cat.title}</h3>
                <p class="text-neutral-500 text-sm mb-6 flex-grow">${cat.desc}</p>
                <div class="flex items-center text-orange-600 font-bold text-sm group-hover:gap-2 transition-all">
                    <span>Browse Category</span>
                    <i data-lucide="chevron-right" class="h-4 w-4"></i>
                </div>
            </div>
        </div>
    `).join('');
}

// RENDER PRODUCT CARDS
function renderProducts() {
    const grid = document.getElementById('product-grid');
    const title = document.getElementById('section-title');
    const count = document.getElementById('result-count');
    if (!grid) return;

    // Filter products by category and search query
    const filtered = PRODUCTS.filter(product => {
        const matchesCategory = selectedCategory === "All" || product.category === selectedCategory;
        const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            product.category.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesCategory && matchesSearch;
    });

    if (title) title.innerText = searchQuery ? `Search Results for "${searchQuery}"` : (selectedCategory === "All" ? "Featured Products" : selectedCategory);
    if (count) count.innerText = `Showing ${filtered.length} ${filtered.length === 1 ? 'result' : 'results'}`;

    if (filtered.length === 0) {
        grid.innerHTML = `
            <div class="col-span-full text-center py-16 bg-white rounded-3xl border border-neutral-100">
                <i data-lucide="package-search" class="h-12 w-12 text-neutral-300 mx-auto mb-3"></i>
                <h3 class="text-lg font-bold text-neutral-800 mb-1">No products found</h3>
                <p class="text-neutral-500 text-sm">Try adjusting your search terms or selecting a different category.</p>
            </div>
        `;
    } else {
        grid.innerHTML = filtered.map(product => `
            <div class="group bg-white rounded-2xl border border-neutral-100 overflow-hidden shadow-sm hover:shadow-xl transition-all flex flex-col">
                <div class="h-56 bg-neutral-100 relative overflow-hidden">
                    <img src="${product.image}" alt="${product.name}" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500">
                    <span class="absolute top-3 left-3 bg-white/90 backdrop-blur px-2.5 py-1 rounded-full text-xs font-semibold text-neutral-700">
                        ${product.category}
                    </span>
                </div>
                <div class="p-5 flex flex-col flex-grow">
                    <div class="flex items-center gap-1 text-amber-500 text-xs font-bold mb-2">
                        <i data-lucide="star" class="h-3.5 w-3.5 fill-amber-500"></i>
                        <span>${product.rating}</span>
                        <span class="text-neutral-400 font-normal">(${product.reviews})</span>
                    </div>
                    <h3 class="font-bold text-neutral-900 text-base mb-3 group-hover:text-orange-600 transition-colors flex-grow">
                        ${product.name}
                    </h3>
                    <div class="flex items-center justify-between pt-2 border-t border-neutral-100">
                        <span class="text-xl font-black text-neutral-900">$${product.price.toFixed(2)}</span>
                        <button 
                            onclick="addToCart(${product.id})" 
                            class="bg-orange-600 hover:bg-orange-700 active:scale-95 text-white p-2.5 rounded-xl transition-all shadow-md hover:shadow-orange-600/30 flex items-center gap-1"
                        >
                            <i data-lucide="plus" class="h-5 w-5"></i>
                        </button>
                    </div>
                </div>
            </div>
        `).join('');
    }

    lucide.createIcons();
}

// CART MANAGEMENT
function openCart() {
    const container = document.getElementById('cart-container');
    const overlay = document.getElementById('cart-overlay');
    const panel = document.getElementById('cart-panel');

    container.classList.remove('pointer-events-none');
    overlay.classList.remove('opacity-0');
    panel.classList.remove('translate-x-full');
}

function closeCart() {
    const container = document.getElementById('cart-container');
    const overlay = document.getElementById('cart-overlay');
    const panel = document.getElementById('cart-panel');

    overlay.classList.add('opacity-0');
    panel.classList.add('translate-x-full');
    setTimeout(() => {
        container.classList.add('pointer-events-none');
    }, 300);
}

function addToCart(productId) {
    const item = cart.find(i => i.id === productId);
    if (item) {
        item.quantity += 1;
    } else {
        const product = PRODUCTS.find(p => p.id === productId);
        if (product) cart.push({ ...product, quantity: 1 });
    }

    updateCartUI();
    openCart();
}

function updateQuantity(productId, delta) {
    const item = cart.find(i => i.id === productId);
    if (!item) return;

    item.quantity += delta;
    if (item.quantity <= 0) {
        cart = cart.filter(i => i.id !== productId);
    }

    updateCartUI();
}

function removeFromCart(productId) {
    cart = cart.filter(i => i.id !== productId);
    updateCartUI();
}

function updateCartUI() {
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    // Update cart badges
    const badge = document.getElementById('cart-badge');
    const headerCount = document.getElementById('cart-header-count');

    if (badge) {
        badge.innerText = totalItems;
        badge.classList.toggle('hidden', totalItems === 0);
        badge.classList.toggle('flex', totalItems > 0);
    }
    if (headerCount) headerCount.innerText = totalItems;

    // Render cart items
    const itemsContainer = document.getElementById('cart-items');
    const footer = document.getElementById('cart-footer');
    const subtotalEl = document.getElementById('cart-subtotal');

    if (subtotalEl) subtotalEl.innerText = subtotal.toFixed(2);

    if (!itemsContainer) return;

    if (cart.length === 0) {
        footer.classList.add('hidden');
        itemsContainer.innerHTML = `
            <div class="text-center py-12">
                <i data-lucide="shopping-bag" class="h-12 w-12 text-neutral-300 mx-auto mb-3"></i>
                <p class="text-neutral-500 font-medium text-sm">Your cart is empty.</p>
                <button onclick="closeCart()" class="mt-4 text-sm font-bold text-orange-600 hover:underline">Start Shopping</button>
            </div>
        `;
    } else {
        footer.classList.remove('hidden');
        itemsContainer.innerHTML = cart.map(item => `
            <div class="flex gap-4 items-center border-b border-neutral-100 pb-4">
                <img src="${item.image}" alt="${item.name}" class="h-16 w-16 rounded-xl object-cover bg-neutral-100">
                <div class="flex-1 min-w-0">
                    <h4 class="font-bold text-neutral-900 text-sm truncate">${item.name}</h4>
                    <p class="text-orange-600 font-bold text-sm mt-0.5">$${(item.price * item.quantity).toFixed(2)}</p>
                    <div class="flex items-center gap-2 mt-2">
                        <button onclick="updateQuantity(${item.id}, -1)" class="h-6 w-6 rounded-md bg-neutral-100 hover:bg-neutral-200 text-neutral-700 flex items-center justify-center text-xs font-bold transition-colors">-</button>
                        <span class="text-xs font-bold text-neutral-800 px-1">${item.quantity}</span>
                        <button onclick="updateQuantity(${item.id}, 1)" class="h-6 w-6 rounded-md bg-neutral-100 hover:bg-neutral-200 text-neutral-700 flex items-center justify-center text-xs font-bold transition-colors">+</button>
                    </div>
                </div>
                <button onclick="removeFromCart(${item.id})" class="p-1 text-neutral-400 hover:text-red-500 transition-colors">
                    <i data-lucide="trash-2" class="h-4 w-4"></i>
                </button>
            </div>
        `).join('');
    }

    lucide.createIcons();
}

// MOBILE MENU TOGGLE
function toggleMobileMenu() {
    const menu = document.getElementById('mobile-menu');
    const icon = document.getElementById('mobile-menu-icon');

    isMobileMenuOpen = !isMobileMenuOpen;
    menu.classList.toggle('hidden', !isMobileMenuOpen);

    if (icon) {
        icon.setAttribute('data-lucide', isMobileMenuOpen ? 'x' : 'menu');
        lucide.createIcons();
    }
}

// CONTACT FORM HANDLER
function handleContactSubmit(event) {
    event.preventDefault();
    const successMsg = document.getElementById('contact-success');
    if (successMsg) {
        successMsg.classList.remove('hidden');
        event.target.reset();
        setTimeout(() => successMsg.classList.add('hidden'), 5000);
    }
} 