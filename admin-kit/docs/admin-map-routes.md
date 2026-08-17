## storefront-kit — Admin panel map (Next 16, `/home/ghiankylledomingo/Projects/storefront-kit`)

### Auth plumbing
| File | Purpose | Notes |
|---|---|---|
| `src/middleware.ts` (no `src/proxy.ts` exists) | Edge guard: any `/admin/*` except `/admin/login` requires valid `mb_session` JWT (jose HS256, `JWT_SECRET` env, fallback `dev-secret-change-me`); else redirect to `/admin/login`. `matcher: ["/admin/:path*"]` — does NOT cover `/api/admin/*`. | Only checks token validity, not role. |
| `src/lib/auth.ts` | `createSession(Session)` (30d httpOnly cookie `mb_session`), `getSession()`, `clearSession()`, `verifyOwnerPassword()` (bcrypt vs setting `owner_password_hash`), `setOwnerPassword()`, `requireOwner()` (throws `UNAUTHORIZED` unless role=owner). `Session = {role:"owner"|"staff", staffId?, name?}` | |
| `src/lib/settings.ts` | `getSettings()` (all rows → record), `getSetting(key,fallback)`, `setSetting(key,value)` upsert on `db.setting` | |
| `src/lib/db.ts` | Prisma singleton `db` | |
| `src/app/admin/(panel)/layout.tsx` | Server layout: `getSession()`; non-owner → `redirect("/admin/login")`. Wraps in `AdminShell` with `bizName(getSettings())`. | Second, role-aware gate (staff sessions bounce here). |

### Pages / server actions / client components — `src/app/admin/`
| Path | Purpose | Key exports / actions | Lib helpers |
|---|---|---|---|
| `login/page.tsx` | Client login form (owner password or staff name+PIN); POSTs `/api/admin/login` | default `LoginPage` | — |
| `(panel)/page.tsx` | Dashboard: counts, orders, hours, site-health issues, analytics charts (`?range=`) | default `Dashboard`, `dynamic="force-dynamic"` | `db.product/blogPost/coupon/vipMember/order/businessHour/gallery/jobApplication`, `getSettings`, `analytics.summary`, `computeOpen` |
| `(panel)/blog/page.tsx` | List posts | `BlogPage` | `db.blogPost.findMany` |
| `(panel)/blog/new/page.tsx`, `[id]/page.tsx` | New/edit form wrappers | — | `db.blogPost.findUnique` |
| `(panel)/blog/actions.ts` | `"use server"` CRUD | `createPost(fd)`, `updatePost(id,fd)`, `deletePost(id)`; `guard=requireOwner`; revalidates `/admin/blog,/blog,/news,/,/blog/[slug]`; redirect after create/update | `requireOwner`, `db.blogPost` |
| `(panel)/blog/PostForm.tsx`, `DeleteButton.tsx` | Client: form w/ ImagePicker, MarkdownEditor, AiBar; delete w/ confirm | — | `slugify`, actions above |
| `(panel)/products/page.tsx`, `new/`, `[id]/` | Product list / new / edit | `ProductsPage` etc. | `db.product` |
| `(panel)/products/actions.ts` | `createProduct`, `updateProduct`, `deleteProduct`; revalidates `/admin/products,/shop` | `requireOwner`, `db.product` |
| `(panel)/products/ProductForm.tsx`, `DeleteButton.tsx` | Client form / delete | — | actions |
| `(panel)/content/page.tsx` | Form over `CONTENT_FIELDS` (site copy) | `ContentPage` | `getSettings`, `content.CONTENT_FIELDS/DEFAULTS` |
| `(panel)/content/actions.ts` | `saveContent(fd)` → `setSetting` per field; revalidate `/` layout | `requireOwner`, `setSetting` |
| `(panel)/content/SaveBar.tsx` | Client `useFormStatus` submit bar | — | — |
| `(panel)/edit/page.tsx` | Visual editor host (`?page=`) | `EditPage` | `getSettings`, `parseLayout` (homeLayout) |
| `(panel)/edit/actions.ts` | `saveVisualEdits({fields, layout})` → `setSetting` each + `home_layout` JSON via `sanitizeLayout` | `requireOwner`, `setSetting`, `content`, `homeLayout` |
| `(panel)/edit/VisualEditor.tsx` (531 lines) | Client iframe editor using `editProtocol` postMessage, ImagePicker | — | `editProtocol`, `editAttrs`, `homeLayout`, action |
| `(panel)/settings/page.tsx` | Business settings form + PasswordCard + ResetButton | `SettingsPage` | `getSettings` |
| `(panel)/settings/actions.ts` | `saveSettings(fd)` for keys `business_name, business_blurb, age_gate, phone, address, maps_url, instagram, facebook, ga_measurement_id, google_review_link` | `requireOwner`, `setSetting` |
| `(panel)/settings/PasswordCard.tsx` | Client; POSTs `/api/admin/password` | — | — |
| `(panel)/theme/page.tsx` | Accent / fonts / brand editors | `ThemePage` | `getSettings` |
| `(panel)/theme/actions.ts` | `saveAccent(hex)`, `saveFonts(display,body)`, `saveBrand({logo_ref,favicon_ref})` → settings `accent_color, font_display, font_body, logo_ref, favicon_ref` | `requireOwner`, `setSetting`, `fonts` |
| `(panel)/theme/ThemeEditor.tsx`, `FontPicker.tsx`, `BrandForm.tsx` | Client editors (ColorWheel, HomeMock preview, ImagePicker) | — | `fonts`, actions |
| `(panel)/coupons/page.tsx` + `CouponsClient.tsx` | List/edit coupons; client fetches `/api/admin/coupons` | — | `db.coupon` |
| `(panel)/reviews/page.tsx` + `ReviewsClient.tsx` | Reviews CRUD via `/api/admin/reviews` | — | `db.review` |
| `(panel)/galleries/page.tsx` + `GalleriesClient.tsx` | Ensures fixed gallery keys exist (upsert), lists images; client → `/api/admin/galleries` | — | `db.gallery`, `db.galleryImage` |
| `(panel)/jobs/page.tsx` + `JobsClient.tsx` | Job applications; client → `/api/admin/jobs` | — | `db.jobApplication` |
| `(panel)/staff/page.tsx` + `StaffClient.tsx` | Hours, staff members, tasks; client → `/api/admin/hours`, `/api/admin/staff` | — | `db.businessHour/staffMember/staffTask` |
| `(panel)/orders/page.tsx` + `OrderStatusButton.tsx` | Orders list (`?tab=`); client PATCH `/api/admin/orders/[id]` | — | `db.order` |
| `(panel)/emails/page.tsx` | VIP + newsletter lists, export link | — | `db.vipMember`, `db.newsletterSub` |

### API routes — `src/app/api/admin/`
All except login/logout: `try { await requireOwner() } catch → 401`. Not covered by middleware.
| Route | Method | Purpose | Lib |
|---|---|---|---|
| `login/route.ts` | POST | `{mode:"staff",name,pin}` → bcrypt vs `staffMember.pinHash` → staff session; else `{password}` → `verifyOwnerPassword` → owner session. In-memory IP rate limit 5/15min (`ponytail:` note) | `verifyOwnerPassword`, `createSession`, `db.staffMember` |
| `logout/route.ts` | POST | `clearSession()` | auth |
| `password/route.ts` | POST | `setOwnerPassword` | auth |
| `reset/route.ts` | POST | `{scope}` → reset keys from `RESET_SCOPES` to `DEFAULT_SETTINGS`; revalidate layout | `setSetting`, `defaults` |
| `coupons/route.ts` | POST | create/update/delete by body shape; revalidate `/admin/coupons` | `db.coupon` |
| `reviews/route.ts` | POST | create/update/delete; revalidate `/admin/reviews`, `/` | `db.review` |
| `galleries/route.ts` | POST | add/delete/reorder (`$transaction`) gallery images | `db.galleryImage` |
| `hours/route.ts` | POST | upsert `businessHour` per day in `$transaction` | `db.businessHour` |
| `staff/route.ts` | POST | staff create (bcrypt PIN)/toggle active/delete; task create/update/delete | `db.staffMember`, `db.staffTask` |
| `jobs/route.ts` | POST | delete or archive job application | `db.jobApplication` |
| `orders/[id]/route.ts` | PATCH | update order status | `db.order` |
| `emails/export/route.ts` | GET | CSV export of VIP + newsletter | `db.vipMember`, `db.newsletterSub` |
| `images/route.ts` | GET | list stored images (for ImagePicker) | `db.image` |
| `upload/route.ts` | POST | `storeImage` (multipart) | `storeImage` |
| `font/route.ts` | POST | store uploaded font file in `db.image` (uuid hash) | `db.image` |
| `ai/blog/route.ts` | POST | Gemini blog draft w/ fallback models, store context | `getSettings`, `brand`, `gemini`, `slugify` |
| `ai/image/route.ts` | POST | Gemini image gen → `storeImage` | `gemini`, `storeImage` |

### Notes
- Two auth layers: middleware (token exists/valid, any role) + `(panel)/layout.tsx` (owner only). Staff sessions can log in but have no panel routes today; `requireOwner` is the only server-side check in actions/APIs.
- All settings live in one `Setting` key/value table (`db.setting`); `owner_password_hash` is stored there too.
- Every panel page sets `export const dynamic = "force-dynamic"`.
- Mutations split: form-heavy pages use server actions (`actions.ts`), list/edit clients use `fetch` to `/api/admin/*` then `router.refresh()`.
- No files were modified.