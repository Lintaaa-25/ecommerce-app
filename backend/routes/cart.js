// backend/routes/cart.js
const express = require('express');
const router = express.Router();
const authenticateToken = require('../middleware/auth');
const Cart = require('../models/Cart');
const Item = require('../models/Item');

// Apply auth middleware to all /cart routes
router.use(authenticateToken);

/**
 * GET /cart
 * Get all cart items for the logged-in user
 */
router.get('/', async (req, res) => {
  try {
    const cartItems = await Cart.findAll({
      where: { UserId: req.user.id },
      include: Item
    });
    res.json(cartItems);
  } catch (err) {
    console.error("❌ Error fetching cart:", err);
    res.status(500).json({ message: 'Server error' });
  }
});

/**
 * POST /cart/add
 * Add an item to the cart (or increment quantity)
 * Body: { itemId, quantity }
 */
router.post('/add', async (req, res) => {
  try {
    const { itemId, quantity = 1 } = req.body;
    const item = await Item.findByPk(itemId);
    if (!item) return res.status(404).json({ message: 'Item not found' });

    let cartItem = await Cart.findOne({
      where: { UserId: req.user.id, ItemId: itemId }
    });

    if (cartItem) {
      cartItem.quantity += Number(quantity);
      await cartItem.save();
    } else {
      cartItem = await Cart.create({
        UserId: req.user.id,
        ItemId: itemId,
        quantity: Number(quantity)
      });
    }

    res.json(cartItem);
  } catch (err) {
    console.error("❌ Error adding to cart:", err);
    res.status(500).json({ message: 'Server error' });
  }
});

/**
 * DELETE /cart/remove/:id
 * Remove a single cart item by cart ID
 */
router.delete('/remove/:id', async (req, res) => {
  try {
    const cartId = req.params.id;
    const deleted = await Cart.destroy({
      where: { id: cartId, UserId: req.user.id }
    });

    if (!deleted) return res.status(404).json({ message: 'Cart item not found' });

    res.json({ success: true, message: 'Item removed from cart' });
  } catch (err) {
    console.error("❌ Error removing cart item:", err);
    res.status(500).json({ message: 'Server error' });
  }
});

/**
 * DELETE /cart/clear
 * Remove all items from the logged-in user's cart
 */
router.delete('/clear', async (req, res) => {
  try {
    await Cart.destroy({ where: { UserId: req.user.id } });
    res.json({ success: true, message: 'Cart cleared successfully' });
  } catch (err) {
    console.error("❌ Error clearing cart:", err);
    res.status(500).json({ message: 'Server error' });
  }
});

/**
 * PUT /cart/update/:id
 * Update quantity for a cart item
 * Body: { quantity }
 */
router.put('/update/:id', async (req, res) => {
  try {
    const cartId = req.params.id;
    const { quantity } = req.body;

    if (!quantity || quantity < 1) {
      return res.status(400).json({ message: 'Quantity must be at least 1' });
    }

    const cartItem = await Cart.findOne({
      where: { id: cartId, UserId: req.user.id }
    });

    if (!cartItem) return res.status(404).json({ message: 'Cart item not found' });

    cartItem.quantity = quantity;
    await cartItem.save();

    res.json(cartItem);
  } catch (err) {
    console.error("❌ Error updating cart:", err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
