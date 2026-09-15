/**
 * Sarawan Fast Food - Checkout & Demo Order Processor
 * Handles validation, fake order ID generation (e.g. SAR-2026-1042),
 * and presentation simulation modal.
 */

import { getCartTotals, clearCart } from './cart.js';

export function generateOrderId() {
  const currentYear = new Date().getFullYear();
  const randomSuffix = Math.floor(1000 + Math.random() * 9000);
  return `SAR-${currentYear}-${randomSuffix}`;
}

export function validateCheckoutForm(formData) {
  const errors = {};

  if (!formData.name || formData.name.trim().length < 3) {
    errors.name = 'Please enter your full name (minimum 3 letters)';
  }

  const phoneRegex = /^[\d\s+\-()]{10,16}$/;
  if (!formData.phone || !phoneRegex.test(formData.phone.trim())) {
    errors.phone = 'Please enter a valid Pakistani contact number (e.g. 0300-1234567)';
  }

  if (!formData.address || formData.address.trim().length < 8) {
    errors.address = 'Please provide a complete delivery address in Aziz Nagar / Karachi';
  }

  const totals = getCartTotals();
  if (totals.count === 0) {
    errors.cart = 'Your cart is empty. Please add delicious dishes before checking out.';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
}

export function processDemoOrder(customerData) {
  const totals = getCartTotals();
  const orderId = generateOrderId();
  
  const orderRecord = {
    orderId,
    timestamp: new Date().toISOString(),
    customer: {
      name: customerData.name.trim(),
      phone: customerData.phone.trim(),
      address: customerData.address.trim(),
      notes: customerData.notes ? customerData.notes.trim() : 'None'
    },
    paymentMethod: 'Cash on Delivery (COD)',
    items: [...totals.items],
    subtotal: totals.subtotal,
    deliveryFee: totals.deliveryFee,
    total: totals.total,
    estimatedDelivery: '30 – 45 Minutes',
    status: 'Confirmed (Demo Simulation)'
  };

  // Clear cart after simulating order
  clearCart();

  return orderRecord;
}
