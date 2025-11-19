import { useEffect, useMemo, useState, useRef } from 'react'
import { ShoppingCart, Search, Menu, Flame, ChevronDown, Star, X } from 'lucide-react'

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'

// Simple in-memory cache to avoid refetching products when components remount
let PRODUCTS_CACHE = null

function Header({ onCartOpen, onSearchOpen }) {
  const [open, setOpen] = useState(false)
  return (
    <header className="relative z-20">
      <div className="mx-auto max-w-7xl px-6 py-5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-lg bg-gradient-to-br from-indigo-500 via-fuchsia-500 to-rose-500 p-[1px]">
            <div className="h-full w-full rounded-[10px] bg-slate-900 flex items-center justify-center">
              <Flame className="h-5 w-5 text-white" />
            </div>
          </div>
          <div className="text-white font-semibold text-xl tracking-tight">ZenSupply</div>
        </div>

        <nav className="hidden md:flex items-center gap-8 text-sm text-slate-300">
          <a href="#products" className="hover:text-white transition-colors">Products</a>
          <a href="#feedback" className="hover:text-white transition-colors">Feedback</a>
          <a href="#faq" className="hover:text-white transition-colors">FAQ</a>
        </nav>

        <div className="flex items-center gap-3">
          <button onClick={onSearchOpen} className="hidden md:flex items-center gap-2 bg-white/10 hover:bg-white/15 text-white text-sm px-3 h-10 rounded-lg backdrop-blur border border-white/10">
            <Search className="h-4 w-4" />
            Search
          </button>
          <button onClick={onCartOpen} className="relative inline-flex items-center gap-2 bg-gradient-to-br from-indigo-500 to-fuchsia-500 text-white text-sm px-3 h-10 rounded-lg shadow-lg shadow-fuchsia-500/20">
            <ShoppingCart className="h-4 w-4" />
            Cart
          </button>
          <button className="md:hidden text-white" onClick={() => setOpen(v => !v)}>
            <Menu className="h-6 w-6" />
          </button>
        </div>
      </div>
      {open && (
        <div className="md:hidden px-6 pb-4 space-y-2 text-slate-300">
          <a href="#products" className="block py-2">Products</a>
          <a href="#feedback" className="block py-2">Feedback</a>
          <a href="#faq" className="block py-2">FAQ</a>
        </div>
      )}
    </header>
  )
}

function Hero({ onBrowseProducts }) {
  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(1000px_500px_at_50%_-10%,rgba(99,102,241,0.25),transparent),radial-gradient(600px_300px_at_80%_20%,rgba(236,72,153,0.2),transparent)]" />
      <div className="mx-auto max-w-7xl px-6 pt-20 pb-16">
        <div className="max-w-2xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-1 text-xs text-slate-200 backdrop-blur">
            Donut SMP IRL Store
          </div>
          <h1 className="mt-6 text-4xl sm:text-6xl font-bold tracking-tight text-white">Gear up fast with ZenSupply</h1>
          <p className="mt-4 text-slate-300 text-lg">Skeleton spawners, Money and more. Fast Checkout, rapid delivery and 24/7 Support.</p>
          <div className="mt-8 flex items-center gap-3">
            <button onClick={onBrowseProducts} className="bg-white text-slate-900 font-semibold px-4 h-10 rounded-lg flex items-center hover:bg-slate-200 transition">Browse products</button>
            <a href="https://discord.gg/K5BU46kJMY" target="_blank" rel="noreferrer" className="inline-flex items-center justify-center px-4 h-10 rounded-lg border border-white/15 text-white/90 hover:text-white hover:bg-white/5 transition">
              Need help?
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}

function VariantSelector({ item, onConfirm }) {
  const [variantId, setVariantId] = useState(item?.variants?.[0]?.id || 'single')
  const [quantity, setQuantity] = useState(1)

  const chosen = useMemo(() => item?.variants?.find(v => v.id === variantId), [item, variantId])
  const price = useMemo(() => {
    if (!chosen) return (item.price || 0) * quantity
    if (chosen.bundle_price) return chosen.bundle_price
    return (chosen.unit_price ?? item.price) * quantity
  }, [chosen, item, quantity])

  const isMoney = item?.title === 'Money'

  return (
    <div className="space-y-4">
      {item?.variants ? (
        <div className="space-y-2">
          <label className="text-sm text-slate-300">Choose variant</label>
          <div className="relative">
            <select value={variantId} onChange={e => setVariantId(e.target.value)} className="w-full appearance-none bg-slate-800/80 border border-white/10 rounded-lg px-3 h-10 text-white pr-8">
              {item.variants.map(v => (
                <option key={v.id} value={v.id}>{v.label}</option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
          </div>
        </div>
      ) : null}

      {!chosen?.bundle_price && (
        <div className="space-y-2">
          <label className="text-sm text-slate-300">Quantity</label>
          <div className="flex items-center gap-2 flex-wrap pr-2">
            <input type="number" min={1} value={quantity} onChange={e => setQuantity(Math.max(1, Number(e.target.value)))} className="w-24 bg-slate-800/80 border border-white/10 rounded-lg px-3 h-10 text-white" />
            <span className="text-slate-400 text-sm">{isMoney ? 'million' : 'units'}</span>
            {isMoney && (
              <div className="flex items-center gap-2 pr-2">
                {[5,10,25,50,100].map((q) => (
                  <button key={q} type="button" onClick={() => setQuantity(q)} className={`h-10 px-3 rounded-lg border ${quantity===q ? 'border-fuchsia-500 text-white bg-fuchsia-500/10' : 'border-white/10 text-slate-300 hover:bg-white/5'}`}>
                    {q}M
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      <div className="flex items-center justify-between">
        <div className="text-white font-semibold text-lg">${price.toFixed(2)}</div>
        <button onClick={() => onConfirm({
          ...item,
          price: chosen?.bundle_price ? chosen.bundle_price : (chosen?.unit_price ?? item.price),
          quantity: chosen?.bundle_price ? 1 : quantity,
          variant_id: chosen?.id || 'single',
          variant_label: chosen?.label || 'Single'
        })} className="bg-gradient-to-br from-indigo-500 to-fuchsia-500 text-white px-4 h-10 rounded-lg">
          Add to cart
        </button>
      </div>
    </div>
  )
}

function ProductCard({ item, onAdd }) {
  const [open, setOpen] = useState(false)
  const onImgError = (e) => {
    const el = e.currentTarget
    const backup = el.getAttribute('data-backup')
    if (backup && el.src !== backup) {
      el.src = backup
    } else {
      el.src = 'https://placehold.co/800x450/0b1220/ffffff?text=Image+unavailable'
    }
  }
  return (
    <div className="group rounded-2xl border border-white/10 bg-white/5 backdrop-blur p-4 hover:bg-white/10 transition relative h-full flex flex-col">
      {item.badge && (
        <div className="absolute right-3 top-3 text-[10px] uppercase bg-gradient-to-r from-indigo-500 to-fuchsia-500 text-white px-2 py-1 rounded">
          {item.badge}
        </div>
      )}
      <div className="aspect-video rounded-xl bg-gradient-to-br from-slate-800 to-slate-900 border border-white/10 mb-3 flex items-center justify-center text-slate-400 text-sm overflow-hidden">
        {item.image ? (
          <img src={item.image} data-backup={item.backupImage || ''} alt={item.title} referrerPolicy="no-referrer" loading="lazy" decoding="async" fetchPriority="low" onError={onImgError} className="h-full w-full object-contain bg-slate-900/30" />
        ) : (
          <span>{item.category}</span>
        )}
      </div>
      <h3 className="text-white font-semibold">{item.title}</h3>
      <p className="text-slate-300 text-sm mt-2 line-clamp-2">{item.description}</p>
      <div className="mt-5 flex items-center justify-between">
        <span className="inline-flex items-center h-10 px-3 rounded-lg bg-white/5 border border-white/10 text-white font-semibold">${Number(item.price || 0).toFixed(2)}</span>
        <button onClick={() => setOpen(true)} className="text-sm bg-gradient-to-br from-indigo-500 to-fuchsia-500 text-white px-3 h-10 rounded-lg">Select</button>
      </div>

      {open && (
        <div className="fixed inset-0 z-40">
          <div className="absolute inset-0 bg-black/60" onClick={() => setOpen(false)} />
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md bg-slate-900 border border-white/10 rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="text-white font-semibold">{item.title}</div>
              <button className="text-slate-400 hover:text-white h-10" onClick={() => setOpen(false)}>Close</button>
            </div>
            <VariantSelector item={item} onConfirm={(payload) => { onAdd(payload); setOpen(false) }} />
          </div>
        </div>
      )}
    </div>
  )
}

function Products({ onAdd, query = '' }) {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const sanitizeTitle = (t) => (t || '').replace(/\(27x\)/gi, '').replace(/\s+/g, ' ').trim()
    const stripCountFromLabel = (l) => (l || '').replace(/\(\s*27x\s*\)/gi, '').trim()

    const load = async () => {
      try {
        // Use sessionStorage/in-memory cache to speed up subsequent mounts
        if (!PRODUCTS_CACHE) {
          try {
            const cached = sessionStorage.getItem('productsCache')
            if (cached) PRODUCTS_CACHE = JSON.parse(cached)
          } catch {}
        }
        if (PRODUCTS_CACHE) {
          setItems(PRODUCTS_CACHE)
          setLoading(false)
          return
        }

        const res = await fetch(`${BACKEND_URL}/products`, { cache: 'no-store' })
        const data = await res.json()
        const processed = (data.items || []).map((p) => {
          let augmented = { ...p }

          // Normalize titles to remove "(27x)" artifacts specifically
          augmented.title = sanitizeTitle(augmented.title)

          if (augmented.title === 'Skeleton Spawner') {
            // Standardize variants and add context label
            const unit = augmented.price
            augmented = {
              ...augmented,
              variants: [
                { id: 'single', label: 'Single', unit_price: unit },
                { id: 'shulker', label: 'Shulker (1728 Skellys)', bundle_price: 40.0 },
              ],
              description: 'Cheap Skeleton Spawners, non duped!',
              image: augmented.image || 'https://static.wikia.nocookie.net/minecraft_gamepedia/images/4/40/Spawner_JE3.png',
              backupImage: 'https://gamepedia.cursecdn.com/minecraft_gamepedia/4/40/Spawner_JE3.png'
            }
          }

          if (augmented.title === 'Money') {
            augmented = {
              ...augmented,
              description: 'In-game Money for just 0.03$ per Million.',
              image: 'https://1drv.ms/i/c/b4f827d58499af99/EcV3wbBeQ3dKvKV7sbVe6BEBQZyjTvw4bLhPltCad1ISsQ?e=NtBfAA',
              backupImage: 'https://static.wixstatic.com/media/79eca2_232cfc6d690e4e40a6360d8bdd39495f~mv2.gif'
            }
          }

          if (augmented.title === 'Elytra') {
            augmented = {
              ...augmented,
              description: 'Elytra for just 12$',
              image: 'https://1drv.ms/i/c/b4f827d58499af99/EQLobdR2pa5OisQKP6tDM44BkigUPNQGbNV5QSfsBaEuew?e=ecpmYF',
              backupImage: 'https://static.wikia.nocookie.net/minecraft_gamepedia/images/0/05/Elytra_%28item%29_JE2_BE2.png'
            }
          }

          // If any backend-provided variant labels have "(27x)", strip it as well
          if (Array.isArray(augmented.variants)) {
            augmented.variants = augmented.variants.map(v => ({
              ...v,
              label: stripCountFromLabel(v.label)
            }))
          }

          return augmented
        })

        setItems(processed)
        PRODUCTS_CACHE = processed
        try { sessionStorage.setItem('productsCache', JSON.stringify(processed)) } catch {}
      } catch (e) {
        setError('Failed to load products')
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  if (loading) {
    return (
      <section id="products" className="mx-auto max-w-7xl px-6 py-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="rounded-2xl border border-white/10 bg-white/5 p-4 animate-pulse">
            <div className="aspect-video rounded-xl bg-slate-800/70 mb-3" />
            <div className="h-4 bg-slate-800/70 rounded w-2/3" />
            <div className="h-3 bg-slate-800/70 rounded w-full mt-2" />
            <div className="h-3 bg-slate-800/70 rounded w-5/6 mt-1" />
            <div className="mt-5 flex items-center justify-between">
              <div className="h-10 w-20 bg-slate-800/70 rounded" />
              <div className="h-10 w-20 bg-slate-800/70 rounded" />
            </div>
          </div>
        ))}
      </section>
    )
  }
  if (error) return <div className="text-rose-400">{error}</div>

  const q = query.trim().toLowerCase()
  const filtered = q
    ? items.filter((it) =>
        (it.title || '').toLowerCase().includes(q) ||
        (it.description || '').toLowerCase().includes(q) ||
        (it.category || '').toLowerCase().includes(q)
      )
    : items

  return (
    <section id="products" className="mx-auto max-w-7xl px-6 py-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {filtered.length === 0 && (
        <div className="col-span-full text-slate-400">No products match “{query}”.</div>
      )}
      {filtered.map((item) => (
        <ProductCard key={item.id || item.title} item={item} onAdd={onAdd} />
      ))}
    </section>
  )
}

function ProductGalleryModal({ open, onClose, onAdd }) {
  return (
    <div className={`fixed inset-0 z-40 ${open ? '' : 'pointer-events-none'}`} aria-hidden={!open}>
      <div className={`absolute inset-0 bg-black/60 transition-opacity ${open ? 'opacity-100' : 'opacity-0'}`} onClick={onClose} />
      <div className={`absolute left-1/2 top-1/2 w-full max-w-6xl -translate-x-1/2 -translate-y-1/2 transition-transform ${open ? 'scale-100 opacity-100' : 'scale-95 opacity-0'}`}>
        <div className="bg-slate-950/95 backdrop-blur rounded-2xl border border-white/10 shadow-2xl">
          <div className="flex items-center justify-between p-4 border-b border-white/10">
            <h3 className="text-white font-semibold">All products</h3>
            <button onClick={onClose} className="h-10 w-10 inline-flex items-center justify-center text-slate-300 hover:text-white"><X className="h-5 w-5" /></button>
          </div>
          <div className="p-6 max-h-[70vh] overflow-y-auto">
            <Products onAdd={onAdd} />
          </div>
        </div>
      </div>
    </div>
  )
}

function SearchModal({ open, onClose, onAdd }) {
  const [query, setQuery] = useState('')
  const inputRef = useRef(null)

  useEffect(() => {
    if (open && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 50)
    }
    if (!open) setQuery('')
  }, [open])

  return (
    <div className={`fixed inset-0 z-40 ${open ? '' : 'pointer-events-none'}`} aria-hidden={!open}>
      <div className={`absolute inset-0 bg-black/60 transition-opacity ${open ? 'opacity-100' : 'opacity-0'}`} onClick={onClose} />
      <div className={`absolute left-1/2 top-1/2 w-full max-w-6xl -translate-x-1/2 -translate-y-1/2 transition-transform ${open ? 'scale-100 opacity-100' : 'scale-95 opacity-0'}`}>
        <div className="bg-slate-950/95 backdrop-blur rounded-2xl border border-white/10 shadow-2xl">
          <div className="p-4 border-b border-white/10 flex items-center gap-3">
            <div className="flex items-center gap-2 flex-1 bg-white/5 border border-white/10 rounded-lg px-3 h-11">
              <Search className="h-4 w-4 text-slate-300" />
              <input ref={inputRef} value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search products…" className="flex-1 bg-transparent text-white outline-none placeholder:text-slate-400" />
            </div>
            <button onClick={onClose} className="h-10 w-10 inline-flex items-center justify-center text-slate-300 hover:text-white"><X className="h-5 w-5" /></button>
          </div>
          <div className="max-h:[70vh] md:max-h-[70vh] overflow-y-auto">
            <Products onAdd={onAdd} query={query} />
          </div>
        </div>
      </div>
    </div>
  )
}

function FeedbackListModal({ open, onClose }) {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [preset, setPreset] = useState(() => {
    return localStorage.getItem('feedbackPreset') || 'mid'
  }) // 'small' | 'mid' | 'large'

  useEffect(() => {
    if (!open) return
    const load = async () => {
      setLoading(true)
      setError('')
      try {
        const res = await fetch(`${BACKEND_URL}/feedbacks?min_rating=4`)
        const data = await res.json()
        setItems(data.items || [])
      } catch (e) {
        setError('Failed to load feedbacks')
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [open])

  const modalMaxWidth = preset === 'large' ? 'max-w-7xl' : preset === 'mid' ? 'max-w-5xl' : 'max-w-3xl'
  const gridCols = preset === 'large' ? 'grid-cols-3' : preset === 'mid' ? 'grid-cols-2' : 'grid-cols-1'

  const changePreset = (p) => {
    setPreset(p)
    try { localStorage.setItem('feedbackPreset', p) } catch {}
  }

  return (
    <div className={`fixed inset-0 z-40 ${open ? '' : 'pointer-events-none'}`} aria-hidden={!open}>
      <div className={`absolute inset-0 bg-black/60 transition-opacity ${open ? 'opacity-100' : 'opacity-0'}`} onClick={onClose} />
      <div className={`absolute left-1/2 top-1/2 w-full ${modalMaxWidth} -translate-x-1/2 -translate-y-1/2 transition-transform ${open ? 'scale-100 opacity-100' : 'scale-95 opacity-0'}`}>
        <div className="bg-slate-950/95 backdrop-blur rounded-2xl border border-white/10 shadow-2xl">
          <div className="flex items-center justify-between p-4 border-b border-white/10">
            <h3 className="text-white font-semibold">Recent Feedback</h3>
            <div className="flex items-center gap-2">
              <div className="inline-flex rounded-lg border border-white/10 overflow-hidden">
                {['small','mid','large'].map((p) => (
                  <button
                    key={p}
                    onClick={() => changePreset(p)}
                    className={`px-3 h-10 text-sm ${preset===p ? 'bg-white/15 text-white' : 'text-slate-300 hover:bg-white/10'}`}
                  >
                    {p === 'small' ? 'Small' : p === 'mid' ? 'Mid' : 'Large'}
                  </button>
                ))}
              </div>
              <button onClick={onClose} className="h-10 w-10 inline-flex items-center justify-center text-slate-300 hover:text-white"><X className="h-5 w-5" /></button>
            </div>
          </div>
          <div className="p-6 max-h-[70vh] overflow-y-auto">
            {loading && <div className="text-slate-300">Loading…</div>}
            {error && <div className="text-rose-400">{error}</div>}
            {!loading && !error && (
              <ul className={`grid gap-4 ${gridCols}`}>
                {items.length === 0 && (
                  <li className="text-slate-400 text-sm">No feedback yet.</li>
                )}
                {items.map((f) => (
                  <li key={f.id} className={`rounded-xl border border-white/10 bg-white/5 p-4`}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1">
                        {[1,2,3,4,5].map((n) => (
                          <Star key={n} className={`h-4 w-4 ${f.rating >= n ? 'fill-yellow-400 text-yellow-400' : 'text-slate-500'}`} />
                        ))}
                      </div>
                      <span className="text-xs text-slate-400">{f.created_at ? new Date(f.created_at).toLocaleString() : ''}</span>
                    </div>
                    {f.comment && <p className={`mt-2 text-slate-200 text-sm`}>{f.comment}</p>}
                    <div className="mt-2 text-xs text-slate-400">{f.minecraft_username || 'Anonymous'}</div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

function Cart({ open, onClose, items, onCheckout }) {
  const total = items.reduce((sum, i) => sum + i.price * i.quantity, 0)
  return (
    <div className={`fixed inset-0 z-30 ${open ? '' : 'pointer-events-none'}`}>
      <div className={`absolute inset-0 bg-black/60 transition-opacity ${open ? 'opacity-100' : 'opacity-0'}`} onClick={onClose} />
      <div className={`absolute right-0 top-0 h-full w-full max-w-md bg-slate-900 border-l border-white/10 transition-transform ${open ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="h-full flex flex-col">
          <div className="p-6 flex items-center justify-between border-b border-white/10 shrink-0">
            <div className="text-white font-semibold">Your Cart</div>
            <button onClick={onClose} className="text-slate-300 hover:text-white h-10">Close</button>
          </div>
          <div className="p-6 space-y-4 overflow-y-auto flex-1">
            {items.length === 0 ? (
              <div className="text-slate-400 text-sm">No items yet. Add some goodies!</div>
            ) : (
              <ul className="space-y-3">
                {items.map((it, idx) => (
                  <li key={idx} className="rounded-xl border border-white/10 bg-white/5 p-3">
                    <div className="flex items-center gap-3">
                      <div className="h-14 w-14 rounded-lg bg-slate-800/60 border border-white/10 overflow-hidden flex items-center justify-center">
                        {it.image ? (
                          <img src={it.image} alt={it.title} className="h-full w-full object-contain" />
                        ) : (
                          <span className="text-xs text-slate-400">{it.category || 'Item'}</span>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <div className="text-white font-medium truncate">{it.title}</div>
                          {it.variant_label && (
                            <span className="text-[11px] px-2 py-0.5 rounded-full bg-white/10 text-slate-200 border border-white/10 whitespace-nowrap">{it.variant_label}</span>
                          )}
                        </div>
                        <div className="mt-1 text-xs text-slate-400">Qty: {it.quantity} • ${Number(it.price).toFixed(2)} each</div>
                      </div>
                      <div className="text-white font-semibold whitespace-nowrap">${(it.price * it.quantity).toFixed(2)}</div>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
          <div className="shrink-0">
            <CheckoutForm total={total} onCheckout={onCheckout} disabled={!items.length} />
          </div>
        </div>
      </div>
    </div>
  )
}

function CheckoutForm({ total, onCheckout, disabled }) {
  const [ign, setIgn] = useState('')
  const [discord, setDiscord] = useState('')
  const [email, setEmail] = useState('')

  return (
    <div className="p-6 border-t border-white/10 space-y-3 bg-slate-900">
      <div className="flex items-center justify-between text-white">
        <span>Total</span>
        <span className="font-bold">${total.toFixed(2)}</span>
      </div>
      <div className="grid grid-cols-1 gap-3">
        <input className="bg-slate-800/80 border border-white/10 rounded-lg px-3 h-10 text-white" placeholder="Minecraft Username (IGN)" value={ign} onChange={e => setIgn(e.target.value)} />
        <input className="bg-slate-800/80 border border-white/10 rounded-lg px-3 h-10 text-white" placeholder="Discord (optional)" value={discord} onChange={e => setDiscord(e.target.value)} />
        <input className="bg-slate-800/80 border border-white/10 rounded-lg px-3 h-10 text-white" placeholder="Email for receipt (optional)" value={email} onChange={e => setEmail(e.target.value)} />
      </div>
      <button onClick={() => onCheckout({ ign, discord, email })} disabled={disabled || !ign} className="w-full bg-gradient-to-br from-indigo-500 to-fuchsia-500 text-white font-semibold h-11 rounded-lg disabled:opacity-50">
        Checkout
      </button>
    </div>
  )
}

function FAQ() {
  const [open, setOpen] = useState(null)
  const faqs = [
    { q: 'How fast is delivery?', a: 'Orders are typically fulfilled by staff within minutes. You will be contacted in-game or via Discord if provided.' },
    { q: 'Which server is this for?', a: 'This store targets Donut SMP. We are not affiliated with Mojang or the server owners.' },
    { q: 'What payment methods are supported?', a: 'We accept a variety of different payment methods like Paypal, Card, Crypto and alot more! Head to Checkout in order to see for yourself!' },
  ]

  return (
    <section id="faq" className="mx-auto max-w-3xl px-6 py-12">
      <h2 className="text-white text-2xl font-semibold">FAQ</h2>
      <div className="mt-6 divide-y divide-white/10 rounded-xl border border-white/10 bg-white/5">
        {faqs.map((f, i) => (
          <div key={i} className="p-4">
            <button onClick={() => setOpen(open === i ? null : i)} className="w-full flex items-center justify-between text-left">
              <span className="text-white font-medium">{f.q}</span>
              <span className="text-slate-400">{open === i ? '−' : '+'}</span>
            </button>
            {open === i && (
              <p className="mt-2 text-slate-300 text-sm">{f.a}</p>
            )}
          </div>
        ))}
      </div>
    </section>
  )
}

function App() {
  const [cartOpen, setCartOpen] = useState(false)
  const [cart, setCart] = useState([])
  const [productsModalOpen, setProductsModalOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)

  const addToCart = (item) => {
    setCart((prev) => {
      const key = `${item.title}-${item.variant_id || 'single'}`
      const existing = prev.find((p) => `${p.title}-${p.variant_id || 'single'}` === key)
      if (existing) {
        return prev.map((p) => `${p.title}-${p.variant_id || 'single'}` === key ? { ...p, quantity: p.quantity + item.quantity } : p)
      }
      return [...prev, { ...item }]
    })
    setCartOpen(true)
  }

  const onCheckout = async ({ ign, discord, email }) => {
    const items = cart.map(c => ({
      product_id: c.id || c.title,
      name: `${c.title}${c.variant_label ? ' • ' + c.variant_label : ''}`,
      price: c.price,
      quantity: c.quantity,
      variant_id: c.variant_id,
      variant_label: c.variant_label,
    }))
    const payload = {
      minecraft_username: ign,
      discord,
      email,
      items,
    }
    try {
      const res = await fetch(`${BACKEND_URL}/orders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })
      const data = await res.json()
      if (data.status === 'received') {
        alert(`Order placed! ID: ${data.order_id}`)
      } else {
        alert('Order failed')
      }
    } catch (e) {
      alert('Checkout failed')
    }
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 relative">
      <div className="pointer-events-none absolute inset-0 [background:radial-gradient(600px_300px_at_20%_10%,rgba(99,102,241,0.2),transparent),radial-gradient(600px_300px_at_80%_10%,rgba(236,72,153,0.15),transparent)]" />
      <Header onCartOpen={() => setCartOpen(true)} onSearchOpen={() => setSearchOpen(true)} />
      <Hero onBrowseProducts={() => setProductsModalOpen(true)} />
      <Products onAdd={addToCart} />
      <FeedbackSection />
      <FAQ />
      <Footer />

      <Cart open={cartOpen} onClose={() => setCartOpen(false)} items={cart} onCheckout={onCheckout} />
      <ProductGalleryModal open={productsModalOpen} onClose={() => setProductsModalOpen(false)} onAdd={addToCart} />
      <SearchModal open={searchOpen} onClose={() => setSearchOpen(false)} onAdd={addToCart} />
    </div>
  )
}

export default App
