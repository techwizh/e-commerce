# Techwiz Kicks — User Manual

Welcome to **Techwiz Kicks**, an online store for sports shoes, sneakers, and athletic shirts.

---

## Live Links

| Service | URL |
|---|---|
| **Online Store** | https://techwiz-kicks.onrender.com |
| **Admin Panel** | https://techwiz-kicks.onrender.com/admin |
| **GitHub Repository** | https://github.com/techwizh/e-commerce |

---

## Admin Login Credentials

Use these details to access the admin panel and manage products.

| Field | Value |
|---|---|
| **Username** | Not required (password-only login) |
| **Password** | `T3717@ict` |

> **Note:** The admin panel does not use a username. Enter only the password on the login screen.

### How to Sign In

1. Open https://techwiz-kicks.onrender.com/admin
2. Enter password: **T3717@ict**
3. Click **Sign In**

---

## Part 1: Shopping Guide (Customers)

### Browse Products

1. Visit the store homepage
2. Click **Shop Now** or use the navigation menu:
   - **Shop All** — all products
   - **Sports Shoes**
   - **Sneakers**
   - **Sports Shirts**
3. Use filters and sorting on the shop page (price, rating, featured)

### View a Product

1. Click any product card
2. Select **Color** and **Size** (required)
3. Adjust **Quantity** if needed
4. Click **Add to Cart**

### Shopping Cart

1. Click the bag icon in the header
2. Change quantities or remove items
3. View order summary (subtotal, shipping, total)
4. Click **Proceed to Checkout**

### Checkout

1. Fill in shipping details (name, email, address, city, postal code)
2. Enter demo payment details (no real payment is processed)
3. Click **Place Order**
4. You will see an order confirmation with an order ID

### Shipping & Pricing

- All prices are in **Kenyan Shillings (KES)**
- **Free shipping** on orders over **Ksh 10,000**
- Standard shipping: **Ksh 500**

---

## Part 2: Admin Guide (Store Manager)

### Admin Dashboard

After signing in, you can:

- View all products in a table
- **Add Product** — create new items
- **Edit** (pencil icon) — update existing products
- **Delete** (trash icon) — remove products
- **Sync Catalog** — import new products from the system catalog (use after adding products via code/images)

### Add a New Product

1. Click **Add Product**
2. Fill in the form:

| Field | Example |
|---|---|
| Name | Nike Air Max 90 |
| Category | Sneakers |
| Price (KES) | 15000 |
| Image URL | `/images/sneakers/nike-classic.jfif` |
| Description | Comfortable street sneaker... |
| Features | Lightweight, Cushioned sole, Durable outsole |
| Sizes | 7, 8, 9, 10, 11, 12 |
| Colors | Black:#000000, White:#ffffff |
| Badge (optional) | New, Best Seller, Hot |
| In stock | Checked = available |

3. Click **Add Product**

### Add Product Images

1. Save your image files to:
   ```
   frontend/public/images/sneakers/
   ```
2. Use this path format in the **Image URL** field:
   ```
   /images/sneakers/your-image-name.jfif
   ```
3. Push changes to GitHub and redeploy on Render (or ask your developer to deploy)
4. Click **Sync Catalog** in admin if products were added via code

### Edit a Product

1. Find the product in the table
2. Click the **pencil** icon
3. Update fields and click **Update**

### Delete a Product

1. Find the product in the table
2. Click the **trash** icon
3. Confirm deletion

### Sync Catalog

Use **Sync Catalog** when:

- New products were added to the system but do not appear on the live store yet
- After a deployment on Render

The button adds any missing products from the built-in catalog to the live store.

### Logout

Click **Logout** in the top-right corner when finished.

---

## Product Categories

| Category | Examples |
|---|---|
| Sports Shoes | Running, trail, court, training shoes |
| Sneakers | Street kicks, slides, casual shoes |
| Sports Shirts | Tees, jerseys, tanks, polos |

---

## Troubleshooting

| Problem | Solution |
|---|---|
| Store loads slowly | Render free tier sleeps after inactivity. Wait ~30 seconds on first visit. |
| Products not showing after update | Redeploy on Render, then click **Sync Catalog** in admin. |
| Invalid password on admin | Confirm password is exactly `T3717@ict` (case-sensitive). |
| Image not displaying | Check image path starts with `/images/` and file exists in `frontend/public/`. |
| Cart empty after checkout | Normal — cart clears after a successful order. |

---

## Support Contacts

| Item | Detail |
|---|---|
| Store name | Techwiz Kicks |
| Repository | https://github.com/techwizh/e-commerce |
| Hosting | Render (https://render.com) |

---

*Last updated: July 2026*
