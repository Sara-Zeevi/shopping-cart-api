-- Disable identity inserts temporarily for explicit ID assignment (if needed for specific testing)
-- SET IDENTITY_INSERT users ON;
-- SET IDENTITY_INSERT categories ON;
-- SET IDENTITY_INSERT products ON;
-- SET IDENTITY_INSERT carts ON;
-- SET IDENTITY_INSERT orders ON;
-- SET IDENTITY_INSERT cart_items ON;

---
-- Insert Sample Categories
---
INSERT INTO categories (name, description) VALUES
('Electronics', 'Gadgets and electronic devices.'),
('Books', 'Various books and literature.'),
('Home Goods', 'Items for the home and kitchen.'),
('Apparel', 'Clothing and accessories.');

---
-- Insert Sample Users
---
INSERT INTO users (username, password, email) VALUES
('johndoe', 'password123', 'john.doe@example.com'),
('janesmith', 'password123', 'jane.smith@example.com'),
('saratest', 'password123', 'sara.test@example.com');

---
-- Insert Sample Products
---
-- Assuming 'Electronics' category has id=1, 'Books' has id=2 etc. (based on insertion order above)
-- You might need to adjust categoryId if your actual IDs are different.
INSERT INTO products (name, description, price, stock, imageUrl, categoryId) VALUES
('Smartphone X', 'Latest model smartphone with advanced features.', 799.99, 50, 'https://example.com/smartphone_x.jpg', (SELECT id FROM categories WHERE name = 'Electronics')),
('Laptop Pro', 'High-performance laptop for professionals.', 1200.00, 30, 'https://example.com/laptop_pro.jpg', (SELECT id FROM categories WHERE name = 'Electronics')),
('The Great Adventure', 'An epic fantasy novel.', 25.50, 100, 'https://example.com/book_adventure.jpg', (SELECT id FROM categories WHERE name = 'Books')),
('Coffee Maker Deluxe', 'Programmable coffee maker with grinder.', 89.99, 40, 'https://example.com/coffee_maker.jpg', (SELECT id FROM categories WHERE name = 'Home Goods')),
('T-Shirt Basic', 'Comfortable cotton t-shirt.', 15.00, 200, 'https://example.com/tshirt_basic.jpg', (SELECT id FROM categories WHERE name = 'Apparel'));

---
-- Insert Sample Carts
---
-- Assuming users have id=1, 2, 3 etc. (based on insertion order above)
INSERT INTO carts (userId, totalPrice) VALUES
((SELECT id FROM users WHERE username = 'johndoe'), 0.00), -- John's cart
((SELECT id FROM users WHERE username = 'janesmith'), 0.00); -- Jane's cart

---
-- Insert Sample Cart Items
---
-- Assuming product IDs and cart IDs from previous insertions
INSERT INTO cart_items (cartId, productId, quantity) VALUES
((SELECT id FROM carts WHERE userId = (SELECT id FROM users WHERE username = 'johndoe')), (SELECT id FROM products WHERE name = 'Smartphone X'), 1),
((SELECT id FROM carts WHERE userId = (SELECT id FROM users WHERE username = 'johndoe')), (SELECT id FROM products WHERE name = 'The Great Adventure'), 2),
((SELECT id FROM carts WHERE userId = (SELECT id FROM users WHERE username = 'janesmith')), (SELECT id FROM products WHERE name = 'Coffee Maker Deluxe'), 1);

-- Update cart total prices after adding items (this would typically be handled by your application logic)
UPDATE carts
SET totalPrice = (
    SELECT SUM(ci.quantity * p.price)
    FROM cart_items ci
    JOIN products p ON ci.productId = p.id
    WHERE ci.cartId = carts.id
)
WHERE id IN (SELECT id FROM carts WHERE userId IN ((SELECT id FROM users WHERE username = 'johndoe'), (SELECT id FROM users WHERE username = 'janesmith')));


---
-- Insert Sample Orders
---
INSERT INTO orders (userId, totalAmount, status) VALUES
((SELECT id FROM users WHERE username = 'johndoe'), 840.99, 'completed'), -- Order for John
((SELECT id FROM users WHERE username = 'janesmith'), 89.99, 'pending'); -- Order for Jane

---
-- Insert Sample Order Items (for the orders created above)
---
-- Assuming order IDs, product IDs from previous insertions
INSERT INTO order_items (orderId, productId, quantity, priceAtOrder) VALUES
((SELECT id FROM orders WHERE userId = (SELECT id FROM users WHERE username = 'johndoe') AND totalAmount = 840.99), (SELECT id FROM products WHERE name = 'Smartphone X'), 1, 799.99),
((SELECT id FROM orders WHERE userId = (SELECT id FROM users WHERE username = 'johndoe') AND totalAmount = 840.99), (SELECT id FROM products WHERE name = 'T-Shirt Basic'), 2, 15.00),
((SELECT id FROM orders WHERE userId = (SELECT id FROM users WHERE username = 'janesmith') AND totalAmount = 89.99), (SELECT id FROM products WHERE name = 'Coffee Maker Deluxe'), 1, 89.99);


-- Re-enable identity inserts if they were disabled
-- SET IDENTITY_INSERT users OFF;
-- SET IDENTITY_INSERT categories OFF;
-- SET IDENTITY_INSERT products OFF;
-- SET IDENTITY_INSERT carts OFF;
-- SET IDENTITY_INSERT orders OFF;
-- SET IDENTITY_INSERT cart_items OFF;