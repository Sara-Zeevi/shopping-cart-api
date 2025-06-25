-- Disable referential integrity checks temporarily to allow table creation in any order
-- This is useful if you run into issues with foreign key constraints during initial setup
-- EXEC sp_MSforeachtable "ALTER TABLE ? NOCHECK CONSTRAINT all";

---
-- Table: users
---
CREATE TABLE users (
    id INT PRIMARY KEY IDENTITY(1,1),
    username NVARCHAR(255) UNIQUE NOT NULL,
    password NVARCHAR(255) NOT NULL,
    email NVARCHAR(255) UNIQUE,
    createdAt DATETIME2 DEFAULT GETDATE(),
    updatedAt DATETIME2 DEFAULT GETDATE()
);

---
-- Table: categories
---
CREATE TABLE categories (
    id INT PRIMARY KEY IDENTITY(1,1),
    name NVARCHAR(255) UNIQUE NOT NULL,
    description NVARCHAR(MAX), -- Assuming nullable means potentially long text
    createdAt DATETIME2 DEFAULT GETDATE(),
    updatedAt DATETIME2 DEFAULT GETDATE()
);

---
-- Table: products
---
CREATE TABLE products (
    id INT PRIMARY KEY IDENTITY(1,1),
    name NVARCHAR(255) NOT NULL,
    description NVARCHAR(MAX),
    price DECIMAL(10, 2) NOT NULL,
    stock INT DEFAULT 0,
    createdAt DATETIME2 DEFAULT GETDATE(),
    updatedAt DATETIME2 DEFAULT GETDATE(),
    imageUrl NVARCHAR(MAX),
    categoryId INT,
    CONSTRAINT FK_Product_Category FOREIGN KEY (categoryId) REFERENCES categories(id) ON DELETE SET NULL
);

---
-- Table: carts
---
CREATE TABLE carts (
    id INT PRIMARY KEY IDENTITY(1,1),
    userId INT UNIQUE, -- OneToOne relationship with User, so userId should be unique
    totalPrice DECIMAL(10, 2) DEFAULT 0,
    createdAt DATETIME2 DEFAULT GETDATE(),
    updatedAt DATETIME2 DEFAULT GETDATE(),
    CONSTRAINT FK_Cart_User FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE -- Assuming user deletion should delete their cart
);

---
-- Table: cart_items
---
CREATE TABLE cart_items (
    id INT PRIMARY KEY IDENTITY(1,1),
    productId INT NOT NULL,
    cartId INT NOT NULL,
    quantity INT DEFAULT 1 NOT NULL,
    createdAt DATETIME2 DEFAULT GETDATE(),
    updatedAt DATETIME2 DEFAULT GETDATE(),
    CONSTRAINT FK_CartItem_Product FOREIGN KEY (productId) REFERENCES products(id),
    CONSTRAINT FK_CartItem_Cart FOREIGN KEY (cartId) REFERENCES carts(id) ON DELETE CASCADE
);

---
-- Table: orders
---
CREATE TABLE orders (
    id INT PRIMARY KEY IDENTITY(1,1),
    userId INT,
    orderDate DATETIME2 DEFAULT GETDATE(),
    totalAmount DECIMAL(10, 2) NOT NULL,
    status NVARCHAR(50) DEFAULT 'pending',
    updatedAt DATETIME2 DEFAULT GETDATE(),
    CONSTRAINT FK_Order_User FOREIGN KEY (userId) REFERENCES users(id) ON DELETE SET NULL -- Assuming user deletion should set order's userId to NULL
);

---
-- Table: order_items
---
CREATE TABLE order_items (
    id INT PRIMARY KEY IDENTITY(1,1),
    orderId INT,
    productId INT,
    quantity INT NOT NULL,
    priceAtOrder DECIMAL(10, 2) NOT NULL,
    CONSTRAINT FK_OrderItem_Order FOREIGN KEY (orderId) REFERENCES orders(id) ON DELETE CASCADE,
    CONSTRAINT FK_OrderItem_Product FOREIGN KEY (productId) REFERENCES products(id) ON DELETE SET NULL
);

-- Re-enable referential integrity checks
-- EXEC sp_MSforeachtable "ALTER TABLE ? CHECK CONSTRAINT all";