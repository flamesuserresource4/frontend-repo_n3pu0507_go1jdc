import { useEffect, useMemo, useState } from 'react'
import { ShoppingCart, Search, Menu, Flame, ChevronDown } from 'lucide-react'

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'

function Header({ onCartOpen }) {
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
          <a href="#how" className="hover:text-white transition-colors">How it works</a>
          <a href="#faq" className="hover:text-white transition-colors">FAQ</a>
        </nav>

        <div className="flex items-center gap-3">
          <button className="hidden md:flex items-center gap-2 bg-white/10 hover:bg-white/15 text-white text-sm px-3 py-2 rounded-lg backdrop-blur border border-white/10">
            <Search className="h-4 w-4" />
            Search
          </button>
          <button onClick={onCartOpen} className="relative inline-flex items-center gap-2 bg-gradient-to-br from-indigo-500 to-fuchsia-500 text-white text-sm px-3 py-2 rounded-lg shadow-lg shadow-fuchsia-500/20">
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
          <a href="#how" className="block py-2">How it works</a>
          <a href="#faq" className="block py-2">FAQ</a>
        </div>
      )}
    </header>
  )
}

function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(1000px_500px_at_50%_-10%,rgba(99,102,241,0.25),transparent),radial-gradient(600px_300px_at_80%_20%,rgba(236,72,153,0.2),transparent)]" />
      <div className="mx-auto max-w-7xl px-6 pt-20 pb-16">
        <div className="max-w-2xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-1 text-xs text-slate-200 backdrop-blur">
            Donut SMP IRL Store
          </div>
          <h1 className="mt-6 text-4xl sm:text-6xl font-bold tracking-tight text-white">Gear up fast with ZenSupply</h1>
          <p className="mt-4 text-slate-300 text-lg">Skeleton spawners, cash boosts and more. Smooth checkout, instant delivery by staff.</p>
          <div className="mt-8 flex items-center gap-3">
            <a href="#products" className="bg-white text-slate-900 font-semibold px-4 py-2 rounded-lg">Browse products</a>
            <a href="#faq" className="text-white/80 hover:text-white">Need help?</a>
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
    if (!chosen) return item.price
    // If bundle price provided use it; else fall back to unit pricing
    if (chosen.bundle_price) return chosen.bundle_price
    return chosen.unit_price ? chosen.unit_price * quantity : item.price * quantity
  }, [chosen, item, quantity])

  return (
    <div className="space-y-4">
      {item?.variants ? (
        <div className="space-y-2">
          <label className="text-sm text-slate-300">Choose variant</label>
          <div className="relative">
            <select value={variantId} onChange={e => setVariantId(e.target.value)} className="w-full appearance-none bg-slate-800/80 border border-white/10 rounded-lg px-3 py-2 text-white pr-8">
              {item.variants.map(v => (
                <option key={v.id} value={v.id}>{v.label}</option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
          </div>
        </div>
      ) : null}

      {/* Quantity only for non-bundle or when unit based */}
      {!chosen?.bundle_price && (
        <div className="space-y-2">
          <label className="text-sm text-slate-300">Quantity</label>
          <div className="flex items-center gap-2">
            <input type="number" min={1} value={quantity} onChange={e => setQuantity(Math.max(1, Number(e.target.value)))} className="w-24 bg-slate-800/80 border border-white/10 rounded-lg px-3 py-2 text-white" />
            <span className="text-slate-400 text-sm">units</span>
          </div>
        </div>
      )}

      <div className="flex items-center justify-between">
        <div className="text-white font-semibold text-lg">${price.toFixed(2)}</div>
        <button onClick={() => onConfirm({
          ...item,
          price: chosen?.bundle_price ? chosen.bundle_price : (chosen?.unit_price || item.price),
          quantity: chosen?.bundle_price ? 1 : quantity,
          variant_id: chosen?.id || 'single',
          variant_label: chosen?.label || 'Single'
        })} className="bg-gradient-to-br from-indigo-500 to-fuchsia-500 text-white px-4 py-2 rounded-lg">
          Add to cart
        </button>
      </div>
    </div>
  )
}

function ProductCard({ item, onAdd }) {
  const [open, setOpen] = useState(false)
  return (
    <div className="group rounded-2xl border border-white/10 bg-white/5 backdrop-blur p-4 hover:bg-white/10 transition relative">
      {item.badge && (
        <div className="absolute right-3 top-3 text-[10px] uppercase bg-gradient-to-r from-indigo-500 to-fuchsia-500 text-white px-2 py-1 rounded">
          {item.badge}
        </div>
      )}
      <div className="aspect-video rounded-xl bg-gradient-to-br from-slate-800 to-slate-900 border border-white/10 mb-3 flex items-center justify-center text-slate-400 text-sm">
        {item.image ? (
          <img src={item.image} alt={item.title} className="h-full w-full object-cover rounded-xl" />
        ) : (
          <span>{item.category}</span>
        )}
      </div>
      <h3 className="text-white font-semibold">{item.title}</h3>
      <p className="text-slate-300 text-sm mt-1 line-clamp-2">{item.description}</p>
      <div className="mt-3 flex items-center justify-between">
        <div className="text-white font-bold">${Number(item.price || 0).toFixed(2)}</div>
        <button onClick={() => setOpen(true)} className="text-sm bg-gradient-to-br from-indigo-500 to-fuchsia-500 text-white px-3 py-1.5 rounded-lg">Select</button>
      </div>

      {open && (
        <div className="fixed inset-0 z-40"> 
          <div className="absolute inset-0 bg-black/60" onClick={() => setOpen(false)} />
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md bg-slate-900 border border-white/10 rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="text-white font-semibold">{item.title}</div>
              <button className="text-slate-400 hover:text-white" onClick={() => setOpen(false)}>Close</button>
            </div>
            <VariantSelector item={item} onConfirm={(payload) => { onAdd(payload); setOpen(false) }} />
          </div>
        </div>
      )}
    </div>
  )
}

function Products({ onAdd }) {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch(`${BACKEND_URL}/products`)
        const data = await res.json()
        setItems((data.items || []).map((p) => {
          // Ensure only the three products and provide default variants for Skeleton Spawner
          if (p.title === 'Skeleton Spawner') {
            return {
              ...p,
              variants: p.variants || [
                { id: 'single', label: 'Single', unit_price: p.price },
                { id: 'shulker', label: 'Shulker (27x)', bundle_price: (p.price * 27 * 0.9) },
              ]
            }
          }
          return p
        }))
      } catch (e) {
        setError('Failed to load products')
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  if (loading) return <div className="text-slate-300">Loading products…</div>
  if (error) return <div className="text-rose-400">{error}</div>

  return (
    <section id="products" className="mx-auto max-w-7xl px-6 py-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {items.map((item) => (
        <ProductCard key={item.id || item.title} item={item} onAdd={onAdd} />
      ))}
    </section>
  )
}

function Cart({ open, onClose, items, onCheckout }) {
  const total = items.reduce((sum, i) => sum + i.price * i.quantity, 0)
  return (
    <div className={`fixed inset-0 z-30 ${open ? '' : 'pointer-events-none'}`}>
      <div className={`absolute inset-0 bg-black/60 transition-opacity ${open ? 'opacity-100' : 'opacity-0'}`} onClick={onClose} />
      <div className={`absolute right-0 top-0 h-full w-full max-w-md bg-slate-900 border-l border-white/10 transition-transform ${open ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="p-6 flex items-center justify-between border-b border-white/10">
          <div className="text-white font-semibold">Your Cart</div>
          <button onClick={onClose} className="text-slate-300 hover:text-white">Close</button>
        </div>
        <div className="p-6 space-y-4 overflow-y-auto h-[calc(100%-220px)]">
          {items.length === 0 ? (
            <div className="text-slate-400 text-sm">No items yet. Add some goodies!</div>
          ) : (
            items.map((it, idx) => (
              <div key={idx} className="flex items-center justify-between text-slate-200">
                <div>
                  <div className="font-medium">{it.title}{it.variant_label ? ` • ${it.variant_label}` : ''}</div>
                  <div className="text-xs text-slate-400">x{it.quantity}</div>
                </div>
                <div className="font-semibold">${(it.price * it.quantity).toFixed(2)}</div>
              </div>
            ))
          )}
        </div>
        <CheckoutForm total={total} onCheckout={onCheckout} disabled={!items.length} />
      </div>
    </div>
  )
}

function CheckoutForm({ total, onCheckout, disabled }) {
  const [ign, setIgn] = useState('')
  const [discord, setDiscord] = useState('')
  const [email, setEmail] = useState('')

  return (
    <div className="p-6 border-t border-white/10 space-y-3">
      <div className="flex items-center justify-between text-white">
        <span>Total</span>
        <span className="font-bold">${total.toFixed(2)}</span>
      </div>
      <div className="grid grid-cols-1 gap-3">
        <input className="bg-slate-800/80 border border-white/10 rounded-lg px-3 py-2 text-white" placeholder="Minecraft Username (IGN)" value={ign} onChange={e => setIgn(e.target.value)} />
        <input className="bg-slate-800/80 border border-white/10 rounded-lg px-3 py-2 text-white" placeholder="Discord (optional)" value={discord} onChange={e => setDiscord(e.target.value)} />
        <input className="bg-slate-800/80 border border-white/10 rounded-lg px-3 py-2 text-white" placeholder="Email for receipt (optional)" value={email} onChange={e => setEmail(e.target.value)} />
      </div>
      <button onClick={() => onCheckout({ ign, discord, email })} disabled={disabled || !ign} className="w-full bg-gradient-to-br from-indigo-500 to-fuchsia-500 text-white font-semibold py-2.5 rounded-lg disabled:opacity-50">
        Checkout
      </button>
    </div>
  )
}

function Footer() {
  return (
    <footer className="mx-auto max-w-7xl px-6 py-12 text-slate-400">
      <div className="border-t border-white/10 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="text-sm">© {new Date().getFullYear()} ZenSupply • Not affiliated with Mojang</div>
        <div className="flex gap-6 text-sm">
          <a href="#faq" className="hover:text-white">FAQ</a>
          <a href="#" className="hover:text-white">Terms</a>
          <a href="#" className="hover:text-white">Privacy</a>
        </div>
      </div>
    </footer>
  )
}

function App() {
  const [cartOpen, setCartOpen] = useState(false)
  const [cart, setCart] = useState([])

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
      <Header onCartOpen={() => setCartOpen(true)} />
      <Hero />
      <Products onAdd={addToCart} />
      <Footer />

      <Cart open={cartOpen} onClose={() => setCartOpen(false)} items={cart} onCheckout={onCheckout} />
    </div>
  )
}

export default App
