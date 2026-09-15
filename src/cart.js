/**
 * Sarawan Fast Food - Shopping Cart Manager
 * Uses localStorage for persistent demo cart across page reloads.
 * Configurable demo delivery fee of Rs. 100.
 */

export const DELIVERY_FEE = 100; // Editable demo delivery fee (in Rs.)
const CART_STORAGE_KEY = 'sarawan_cart_items';

export function getCart() {
  try {
    const raw = localStorage.getItem(CART_STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (err) {
    console.error('Error reading cart from localStorage', err);
    return [];
  }
}

export function saveCart(cart) {
  try {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
    window.dispatchEvent(new CustomEvent('cart-updated', { detail: { cart } }));
  } catch (err) {
    console.error('Error saving cart to localStorage', err);
  }
}

export function addToCart(dish, quantity = 1) {
  const cart = getCart();
  const existingIndex = cart.findIndex((item) => item.id === dish.id);

  if (existingIndex > -1) {
    cart[existingIndex].quantity += quantity;
  } else {
    cart.push({
      id: dish.id,
      name: dish.name,
      categoryLabel: dish.categoryLabel,
      price: dish.price,
      image: dish.image,
      quantity: quantity
    });
  }

  saveCart(cart);
  return cart;
}

export function updateQuantity(dishId, delta) {
  let cart = getCart();
  const itemIndex = cart.findIndex((item) => item.id === dishId);

  if (itemIndex > -1) {
    cart[itemIndex].quantity += delta;
    if (cart[itemIndex].quantity <= 0) {
      cart.splice(itemIndex, 1);
    }
    saveCart(cart);
  }
  return cart;
}

export function removeFromCart(dishId) {
  const cart = getCart().filter((item) => item.id !== dishId);
  saveCart(cart);
  return cart;
}

export function clearCart() {
  saveCart([]);
}

export function getCartTotals() {
  const cart = getCart();
  const count = cart.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const deliveryFee = count > 0 ? DELIVERY_FEE : 0;
  const total = subtotal + deliveryFee;

  return {
    items: cart,
    count,
    subtotal,
    deliveryFee,
    total
  };
}
