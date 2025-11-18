import { useEffect, useState } from 'react'
import { ShoppingCart, Search, Menu, Flame } from 'lucide-react'

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

function ProductCard({ item, onAdd }) {
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
        <div className="text-white font-bold">${item.price.toFixed(2)}</div>
        <button onClick={() => onAdd(item)} className="text-sm bg-gradient-to-br from-indigo-500 to-fuchsia-500 text-white px-3 py-1.5 rounded-lg">Add</button>
      </div>
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
        setItems(data.items || [])
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
        <div className="p-6 space-y-4 overflow-y-auto h-[calc(100%-160px)]">
          {items.length === 0 ? (
            <div className="text-slate-400 text-sm">No items yet. Add some goodies!</div>
          ) : (
            items.map((it, idx) => (
              <div key={idx} className="flex items-center justify-between text-slate-200">
                <div>
                  <div className="font-medium">{it.title}</div>
                  <div className="text-xs text-slate-400">x{it.quantity}</div>
                </div>
                <div className="font-semibold">${(it.price * it.quantity).toFixed(2)}</div>
              </div>
            ))
          )}
        </div>
        <div className="p-6 border-t border-white/10 space-y-3">
          <div className="flex items-center justify-between text-white">
            <span>Total</span>
            <span className="font-bold">${total.toFixed(2)}</span>
          </div>
          <button onClick={onCheckout} disabled={!items.length} className="w-full bg-gradient-to-br from-indigo-500 to-fuchsia-500 text-white font-semibold py-2.5 rounded-lg disabled:opacity-50">
            Checkout
          </button>
        </div>
      </div>
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
      const existing = prev.find((p) => p.title === item.title)
      if (existing) {
        return prev.map((p) => p.title === item.title ? { ...p, quantity: p.quantity + 1 } : p)
      }
      return [...prev, { ...item, quantity: 1 }]
    })
    setCartOpen(true)
  }

  const checkout = async () => {
    const items = cart.map(c => ({
      product_id: c.id || c.title,
      name: c.title,
      price: c.price,
      quantity: c.quantity,
    }))
    const payload = {
      minecraft_username: 'YourIGN',
      items,
    }
    try {
      const res = await fetch(`${BACKEND_URL}/orders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })
      const data = await res.json()
      alert(data.status === 'received' ? `Order placed! ID: ${data.order_id}` : 'Order failed')
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

      <Cart open={cartOpen} onClose={() => setCartOpen(false)} items={cart} onCheckout={checkout} />
    </div>
  )
}

export default App
