---
description: Enhance UI with Course Details, Side Cart, and Header/Footer updates
---

1.  **Create Course Detail Page (`src/pages/CourseDetail.tsx`)**
    *   Show detailed info: Title, Description, Duration, Lesson Count, Price.
    *   "Add to Cart" button.

2.  **Create Side Cart Widget (`src/components/CartSidebar.tsx`)**
    *   Slide-over animation from right.
    *   List items, show total.
    *   "Checkout" button to go to full checkout page.

3.  **Update RootLayout (`src/layouts/RootLayout.tsx`)**
    *   Include `CartSidebar`.
    *   **Header**: Reorder icons (Theme, Install, Cart).
    *   **Mobile Footer**: Add "Mis Cursos" with login check logic.

4.  **Update App Router (`src/App.tsx`)**
    *   Add route `/curso-info/:id`.

5.  **Update Cursos Page (`src/pages/Cursos.tsx`)**
    *   Add "Ver Detalles" button links to `/curso-info/:id`.

6.  **Verify**
    *   Check header icon order.
    *   Check mobile footer logic.
    *   Check side cart toggle.
