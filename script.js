// --- MOCK DATA ---
const CATEGORIES = ["All", "Grains & Flours", "Spices & Seeds", "Oils", "Fresh Produce", "Meat & Seafood"];

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

// --- STATE ---
let cart = [];
let selectedCategory = "All";
let searchQuery = "";
let isMobileMenuOpen = false;

// --- INITIALIZE UI ---
document.addEventListener('DOMContentLoaded', () => {
    renderCategories();
    renderProducts();
    lucide.createIcons();
    
    // Event Listeners
    document.getElementById('cart-btn').addEventListener('click', openCart);
    document.getElementById('mobile-menu-btn').addEventListener('click', toggleMobileMenu);
    
    document.getElementById('desktop-search').addEventListener('input', (e) => {
        searchQuery = e.target.value;
        document.getElementById('mobile-search').value = searchQuery; // sync
        renderProducts();
    });

    document.getElementById('mobile-search').addEventListener('input', (e) => {
        searchQuery = e.target.value;
        document.getElementById('desktop-search').value = searchQuery; // sync
        renderProducts();
    });
});

// --- RENDER FUNCTIONS ---
function renderCategories() {
    const container = document.getElementById('category-container');
    container.innerHTML = CATEGORIES.map(category => `
        <button 
            onclick="setCategory('${category}')" 
            class="whitespace-nowrap px-6 py-2.5 rounded-full text-sm font-semibold transition-all ${
                selectedCategory === category 
                ? 'bg-neutral-900 text-white shadow-md' 
                : 'bg-white text-neutral-600 hover:bg-orange-50 hover:text-orange-600 border border-neutral-200'
            }"
        >
            ${category}
        </button>
    `).join('');
}

function setCategory(category) {
    selectedCategory = category;
    renderCategories(); // update active state
    renderProducts();
}

function renderProducts() {
    const grid = document.getElementById('product-grid');
    
    // Filter logic
    const filteredProducts = PRODUCTS.filter(product => {
        const matchesCategory = selectedCategory === "All" || product.category === selectedCategory;
        const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesCategory && matchesSearch;
    });

    // Update section title and count
    document.getElementById('section-title').textContent = selectedCategory === "All" ? "Featured Products" : selectedCategory;
    document.getElementById('result-count').textContent = `Showing ${filteredProducts.length} results`;

    if (filteredProducts.length === 0) {
        // Empty state HTML setup to span fully
        grid.className = "col-span-full"; 
        grid.innerHTML = `
            <div class="text-center py-20 bg-white rounded-2xl border border-neutral-100 w-full">
                <p class="text-neutral-500 text-lg">No products found matching your search.</p>
                <button onclick="clearFilters()" class="mt-4 text-orange-600 font-semibold hover:underline">
                    Clear filters
                </button>
            </div>
        `;
    } else {
        // Restore grid classes
        grid.className = "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 xl:gap-8";
        grid.innerHTML = filteredProducts.map(product => `
            <div class="group flex flex-col bg-white rounded-2xl border border-neutral-100 overflow-hidden hover:shadow-xl transition-all duration-300">
                <div class="relative aspect-square overflow-hidden bg-neutral-100">
                    <img src="${product.image}" alt="${product.name}" class="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500">
                    <div class="absolute top-3 left-3 bg-white/90 backdrop-blur px-2 py-1 rounded-md text-xs font-bold text-neutral-900 shadow-sm">
                        ${product.category}
                    </div>
                </div>
                <div class="p-5 flex flex-col flex-grow">
                    <div class="flex items-center gap-1 mb-2">
                        <i data-lucide="star" class="h-4 w-4 fill-orange-400 text-orange-400"></i>
                        <span class="text-sm font-bold text-neutral-700">${product.rating}</span>
                        <span class="text-xs text-neutral-400">(${product.reviews})</span>
                    </div>
                    <h3 class="text-lg font-bold text-neutral-900 mb-1 leading-tight line-clamp-2">${product.name}</h3>
                    <p class="text-2xl font-black text-orange-600 mt-auto pt-4">$${product.price.toFixed(2)}</p>
                    <button onclick="addToCart(${product.id})" class="mt-4 w-full bg-neutral-900 hover:bg-orange-600 text-white font-semibold py-3 rounded-xl transition-colors flex items-center justify-center gap-2 group-hover:shadow-md">
                        <i data-lucide="shopping-cart" class="h-5 w-5"></i> Add to Cart
                    </button>
                </div>
            </div>
        `).join('');
    }
    
    // Re-initialize icons for newly rendered content
    lucide.createIcons();
}

function clearFilters() {
    searchQuery = "";
    document.getElementById('desktop-search').value = "";
    document.getElementById('mobile-search').value = "";
    setCategory("All");
}

// --- CART LOGIC ---
function addToCart(productId) {
    const product = PRODUCTS.find(p => p.id === productId);
    const existingItem = cart.find(item => item.id === productId);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({ ...product, quantity: 1 });
    }
    
    updateCartUI();
    openCart();
}

function updateQuantity(id, delta) {
    const itemIndex = cart.findIndex(item => item.id === id);
    if (itemIndex > -1) {
        const newQuantity = cart[itemIndex].quantity + delta;
        if (newQuantity > 0) {
            cart[itemIndex].quantity = newQuantity;
        }
    }
    updateCartUI();
}

function removeFromCart(id) {
    cart = cart.filter(item => item.id !== id);
    updateCartUI();
}

function updateCartUI() {
    const cartItemsContainer = document.getElementById('cart-items');
    const cartFooter = document.getElementById('cart-footer');
    const cartBadge = document.getElementById('cart-badge');
    
    const itemCount = cart.reduce((total, item) => total + item.quantity, 0);
    const subtotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
    
    // Update Header Counts
    document.getElementById('cart-header-count').textContent = itemCount;
    
    // Update Navbar Badge
    if (itemCount > 0) {
        cartBadge.textContent = itemCount;
        cartBadge.classList.remove('hidden');
        cartBadge.classList.add('flex');
    } else {
        cartBadge.classList.add('hidden');
        cartBadge.classList.remove('flex');
    }

    // Render Cart Content
    if (cart.length === 0) {
        cartItemsContainer.innerHTML = `
            <div class="flex flex-col items-center justify-center h-full text-center space-y-4 py-12">
                <div class="h-24 w-24 bg-orange-50 rounded-full flex items-center justify-center mb-2">
                    <i data-lucide="shopping-cart" class="h-10 w-10 text-orange-300"></i>
                </div>
                <p class="text-lg font-medium text-neutral-900">Your cart is empty</p>
                <p class="text-sm text-neutral-500">Looks like you haven't added any authentic flavors yet.</p>
                <button onclick="closeCart()" class="mt-4 px-6 py-2 bg-neutral-900 text-white font-semibold rounded-full hover:bg-orange-600 transition-colors">
                    Start Shopping
                </button>
            </div>
        `;
        cartFooter.classList.add('hidden');
    } else {
        cartItemsContainer.innerHTML = cart.map(item => `
            <div class="flex gap-4 bg-white">
                <div class="h-24 w-24 flex-shrink-0 overflow-hidden rounded-xl border border-neutral-200 bg-neutral-50">
                    <img src="${item.image}" alt="${item.name}" class="h-full w-full object-cover object-center">
                </div>
                <div class="flex flex-1 flex-col">
                    <div>
                        <div class="flex justify-between text-base font-bold text-neutral-900">
                            <h3>${item.name}</h3>
                            <p class="ml-4 text-orange-600">$${(item.price * item.quantity).toFixed(2)}</p>
                        </div>
                        <p class="mt-1 text-sm text-neutral-500">${item.category}</p>
                    </div>
                    <div class="flex flex-1 items-end justify-between text-sm">
                        <div class="flex items-center border border-neutral-200 rounded-lg">
                            <button onclick="updateQuantity(${item.id}, -1)" class="p-1.5 text-neutral-500 hover:text-orange-600 hover:bg-neutral-50 rounded-l-lg">
                                <i data-lucide="minus" class="h-4 w-4"></i>
                            </button>
                            <span class="px-3 font-semibold text-neutral-900 w-8 text-center">${item.quantity}</span>
                            <button onclick="updateQuantity(${item.id}, 1)" class="p-1.5 text-neutral-500 hover:text-orange-600 hover:bg-neutral-50 rounded-r-lg">
                                <i data-lucide="plus" class="h-4 w-4"></i>
                            </button>
                        </div>
                        <button type="button" onclick="removeFromCart(${item.id})" class="font-medium text-neutral-400 hover:text-red-600 flex items-center gap-1 transition-colors">
                            <i data-lucide="trash-2" class="h-4 w-4"></i> <span class="hidden sm:inline">Remove</span>
                        </button>
                    </div>
                </div>
            </div>
        `).join('');
        
        document.getElementById('cart-subtotal').textContent = subtotal.toFixed(2);
        cartFooter.classList.remove('hidden');
    }
    
    lucide.createIcons();
}

// --- UI TOGGLES ---
function openCart() {
    const container = document.getElementById('cart-container');
    const panel = document.getElementById('cart-panel');
    const overlay = document.getElementById('cart-overlay');
    
    // Re-render to ensure latest state is shown
    updateCartUI(); 
    
    container.classList.remove('pointer-events-none');
    overlay.classList.remove('opacity-0');
    panel.classList.remove('translate-x-full');
}

function closeCart() {
    const container = document.getElementById('cart-container');
    const panel = document.getElementById('cart-panel');
    const overlay = document.getElementById('cart-overlay');
    
    overlay.classList.add('opacity-0');
    panel.classList.add('translate-x-full');
    
    // Wait for transition to finish before removing pointer events
    setTimeout(() => {
        container.classList.add('pointer-events-none');
    }, 300);
}

function toggleMobileMenu() {
    const menu = document.getElementById('mobile-menu');
    const icon = document.getElementById('mobile-menu-icon');
    
    isMobileMenuOpen = !isMobileMenuOpen;
    
    if (isMobileMenuOpen) {
        menu.classList.remove('hidden');
        // update icon to 'x'
        icon.setAttribute('data-lucide', 'x');
    } else {
        menu.classList.add('hidden');
        // update icon to 'menu'
        icon.setAttribute('data-lucide', 'menu');
    }
    lucide.createIcons();
}