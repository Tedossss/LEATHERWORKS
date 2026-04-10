import { useEffect, useMemo, useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import api from '../services/api'

const CATEGORIES = [
  { value: 'furniture', label: 'Furniture' },
  { value: 'automotive', label: 'Automotive' },
  { value: 'footwear', label: 'Footwear' },
  { value: 'accessories', label: 'Accessories' },
  { value: 'apparel', label: 'Apparel' },
]

async function fetchPortfolio() {
  const res = await api.get('/api/portfolio')
  return res.data
}

async function createPortfolio(formData) {
  const res = await api.post('/api/portfolio', formData)
  return res.data
}

async function deletePortfolio(id) {
  const res = await api.delete(`/api/portfolio/${id}`)
  return res.data
}

async function fetchContact() {
  const res = await api.get('/api/contact')
  return res.data
}

async function saveContact(payload) {
  const res = await api.put('/api/contact', payload)
  return res.data
}

function Field({ label, children }) {
  return (
    <label style={{ display: 'grid', gap: 8 }}>
      <div style={{ fontSize: 13, letterSpacing: 1.2, textTransform: 'uppercase', color: '#d0d0d0' }}>
        {label}
      </div>
      {children}
    </label>
  )
}

export default function Admin() {
  const qc = useQueryClient()
  const [toast, setToast] = useState(null)

  const styles = useMemo(() => {
    const gold = '#c8902a'
    const bg = '#0a0a0a'
    const panel = 'rgba(18,18,18,0.85)'
    const border = 'rgba(255,255,255,0.08)'
    const input = {
      width: '100%',
      padding: '12px 12px',
      borderRadius: 8,
      border: `1px solid ${border}`,
      background: 'rgba(12,12,12,0.9)',
      color: '#fff',
      outline: 'none',
    }
    return {
      gold,
      bg,
      panel,
      border,
      input,
      button: {
        padding: '12px 14px',
        borderRadius: 10,
        border: `1px solid rgba(200,144,42,0.35)`,
        background: 'rgba(200,144,42,0.12)',
        color: '#fff',
        cursor: 'pointer',
      },
      buttonDanger: {
        padding: '10px 12px',
        borderRadius: 10,
        border: '1px solid rgba(255,90,90,0.35)',
        background: 'rgba(255,90,90,0.12)',
        color: '#fff',
        cursor: 'pointer',
      },
    }
  }, [])

  // Portfolio
  const portfolioQuery = useQuery({
    queryKey: ['portfolio'],
    queryFn: fetchPortfolio,
  })

  const createMutation = useMutation({
    mutationFn: createPortfolio,
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: ['portfolio'] })
      setToast({ type: 'success', text: 'Portfolio item added.' })
    },
    onError: (e) => setToast({ type: 'error', text: e?.message || 'Failed to add item.' }),
  })

  const deleteMutation = useMutation({
    mutationFn: deletePortfolio,
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: ['portfolio'] })
      setToast({ type: 'success', text: 'Deleted.' })
    },
    onError: (e) => setToast({ type: 'error', text: e?.message || 'Failed to delete.' }),
  })

  const [newItem, setNewItem] = useState({
    title: '',
    description: '',
    category: 'furniture',
    before: null,
    after: null,
  })

  async function onSubmitNewItem(e) {
    e.preventDefault()
    const fd = new FormData()
    fd.append('title', newItem.title)
    fd.append('description', newItem.description)
    fd.append('category', newItem.category)
    if (newItem.before) fd.append('before', newItem.before)
    if (newItem.after) fd.append('after', newItem.after)
    await createMutation.mutateAsync(fd)
    setNewItem({ title: '', description: '', category: 'furniture', before: null, after: null })
    e.target?.reset?.()
  }

  // Contact
  const contactQuery = useQuery({
    queryKey: ['contact'],
    queryFn: fetchContact,
  })

  const [contactForm, setContactForm] = useState({
    phone: '',
    email: '',
    address: '',
    mon_fri: '',
    saturday: '',
    sunday: '',
  })

  useEffect(() => {
    const c = contactQuery.data
    if (!c) return
    setContactForm({
      phone: c.phone || '',
      email: c.email || '',
      address: c.address || '',
      mon_fri: c.hours?.mon_fri || '',
      saturday: c.hours?.saturday || '',
      sunday: c.hours?.sunday || '',
    })
  }, [contactQuery.data])

  const saveMutation = useMutation({
    mutationFn: saveContact,
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: ['contact'] })
      setToast({ type: 'success', text: 'Contact details saved.' })
    },
    onError: (e) => setToast({ type: 'error', text: e?.message || 'Failed to save contact.' }),
  })

  async function onSaveContact() {
    await saveMutation.mutateAsync({
      phone: contactForm.phone,
      email: contactForm.email,
      address: contactForm.address,
      hours: {
        mon_fri: contactForm.mon_fri,
        saturday: contactForm.saturday,
        sunday: contactForm.sunday,
      },
    })
  }

  useEffect(() => {
    if (!toast) return
    const t = setTimeout(() => setToast(null), 3200)
    return () => clearTimeout(t)
  }, [toast])

  return (
    <div style={{ minHeight: '100vh', background: styles.bg, color: '#fff', padding: '40px 20px' }}>
      <div style={{ maxWidth: 1100, margin: '0 auto', display: 'grid', gap: 26 }}>
        <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: 16 }}>
          <div>
            <div style={{ color: styles.gold, letterSpacing: 3.2, textTransform: 'uppercase', fontSize: 12 }}>
              Prime Leather Repair
            </div>
            <h1 style={{ margin: '10px 0 0', fontSize: 34, fontWeight: 600 }}>Admin</h1>
          </div>
          {toast && (
            <div
              style={{
                padding: '10px 12px',
                borderRadius: 10,
                border: `1px solid ${toast.type === 'success' ? 'rgba(80,200,120,0.35)' : 'rgba(255,90,90,0.35)'}`,
                background: toast.type === 'success' ? 'rgba(80,200,120,0.10)' : 'rgba(255,90,90,0.10)',
                color: '#fff',
                maxWidth: 520,
              }}
            >
              {toast.text}
            </div>
          )}
        </div>

        {/* A) Portfolio Manager */}
        <section
          style={{
            background: styles.panel,
            border: `1px solid ${styles.border}`,
            borderRadius: 14,
            padding: 22,
          }}
        >
          <h2 style={{ margin: 0, fontSize: 20 }}>Portfolio Manager</h2>
          <div style={{ height: 1, background: styles.border, margin: '16px 0 18px' }} />

          <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 14, marginBottom: 18 }}>
            {portfolioQuery.isLoading && <div style={{ color: '#cfcfcf' }}>Loading portfolio…</div>}
            {portfolioQuery.error && (
              <div style={{ color: '#ffb3b3' }}>Error: {portfolioQuery.error.message}</div>
            )}
            {!portfolioQuery.isLoading && !portfolioQuery.error && portfolioQuery.data?.length === 0 && (
              <div style={{ color: '#cfcfcf' }}>No portfolio items yet.</div>
            )}
            {(portfolioQuery.data || []).map((item) => (
              <div
                key={item.id}
                style={{
                  border: `1px solid ${styles.border}`,
                  borderRadius: 14,
                  padding: 16,
                  background: 'rgba(10,10,10,0.55)',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12 }}>
                  <div style={{ display: 'grid', gap: 6 }}>
                    <div style={{ fontSize: 18, fontWeight: 600 }}>{item.title}</div>
                    <div style={{ color: styles.gold, fontSize: 13, textTransform: 'uppercase', letterSpacing: 1.6 }}>
                      {item.category || 'uncategorized'}
                    </div>
                  </div>
                  <button
                    type="button"
                    style={styles.buttonDanger}
                    onClick={() => deleteMutation.mutate(item.id)}
                    disabled={deleteMutation.isPending}
                  >
                    {deleteMutation.isPending ? 'Deleting…' : 'Delete'}
                  </button>
                </div>

                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr',
                    gap: 12,
                    marginTop: 14,
                  }}
                >
                  <div style={{ borderRadius: 12, overflow: 'hidden', border: `1px solid ${styles.border}` }}>
                    <img
                      src={item.before_url}
                      alt="Before"
                      style={{ width: '100%', height: 240, objectFit: 'cover', display: 'block' }}
                      loading="lazy"
                    />
                  </div>
                  <div style={{ borderRadius: 12, overflow: 'hidden', border: `1px solid ${styles.border}` }}>
                    <img
                      src={item.after_url}
                      alt="After"
                      style={{ width: '100%', height: 240, objectFit: 'cover', display: 'block' }}
                      loading="lazy"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>

          <form
            onSubmit={onSubmitNewItem}
            style={{
              border: `1px solid ${styles.border}`,
              borderRadius: 14,
              padding: 16,
              display: 'grid',
              gap: 14,
              background: 'rgba(10,10,10,0.40)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: 10 }}>
              <div style={{ fontSize: 16, fontWeight: 600 }}>Add New Work</div>
              <div style={{ color: '#bdbdbd', fontSize: 12 }}>Uploads to Supabase bucket: portfolio</div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <Field label="Title">
                <input
                  value={newItem.title}
                  onChange={(e) => setNewItem((s) => ({ ...s, title: e.target.value }))}
                  style={styles.input}
                  placeholder="e.g. Vintage chair restoration"
                  required
                />
              </Field>

              <Field label="Category">
                <select
                  value={newItem.category}
                  onChange={(e) => setNewItem((s) => ({ ...s, category: e.target.value }))}
                  style={styles.input}
                >
                  {CATEGORIES.map((c) => (
                    <option key={c.value} value={c.value}>
                      {c.label}
                    </option>
                  ))}
                </select>
              </Field>
            </div>

            <Field label="Description">
              <textarea
                value={newItem.description}
                onChange={(e) => setNewItem((s) => ({ ...s, description: e.target.value }))}
                style={{ ...styles.input, minHeight: 90, resize: 'vertical' }}
                placeholder="Optional details about the restoration work…"
              />
            </Field>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <Field label="Before Photo">
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setNewItem((s) => ({ ...s, before: e.target.files?.[0] || null }))}
                  style={styles.input}
                  required
                />
              </Field>

              <Field label="After Photo">
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setNewItem((s) => ({ ...s, after: e.target.files?.[0] || null }))}
                  style={styles.input}
                  required
                />
              </Field>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <button type="submit" style={styles.button} disabled={createMutation.isPending}>
                {createMutation.isPending ? 'Uploading…' : 'Add to Portfolio'}
              </button>
            </div>
          </form>
        </section>

        {/* B) Contacts Editor */}
        <section
          style={{
            background: styles.panel,
            border: `1px solid ${styles.border}`,
            borderRadius: 14,
            padding: 22,
          }}
        >
          <h2 style={{ margin: 0, fontSize: 20 }}>Contacts Editor</h2>
          <div style={{ height: 1, background: styles.border, margin: '16px 0 18px' }} />

          {contactQuery.isLoading && <div style={{ color: '#cfcfcf' }}>Loading contact…</div>}
          {contactQuery.error && <div style={{ color: '#ffb3b3' }}>Error: {contactQuery.error.message}</div>}

          {!contactQuery.isLoading && !contactQuery.error && (
            <div style={{ display: 'grid', gap: 14 }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <Field label="Phone">
                  <input
                    value={contactForm.phone}
                    onChange={(e) => setContactForm((s) => ({ ...s, phone: e.target.value }))}
                    style={styles.input}
                    placeholder="+1 (312) 555-0199"
                  />
                </Field>
                <Field label="Email">
                  <input
                    value={contactForm.email}
                    onChange={(e) => setContactForm((s) => ({ ...s, email: e.target.value }))}
                    style={styles.input}
                    placeholder="info@primeleatherrepair.com"
                  />
                </Field>
              </div>

              <Field label="Address">
                <input
                  value={contactForm.address}
                  onChange={(e) => setContactForm((s) => ({ ...s, address: e.target.value }))}
                  style={styles.input}
                  placeholder="123 Craft Street, Chicago, IL 60614"
                />
              </Field>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12 }}>
                <Field label="Mon-Fri Hours">
                  <input
                    value={contactForm.mon_fri}
                    onChange={(e) => setContactForm((s) => ({ ...s, mon_fri: e.target.value }))}
                    style={styles.input}
                    placeholder="9:00 AM - 6:00 PM"
                  />
                </Field>
                <Field label="Saturday Hours">
                  <input
                    value={contactForm.saturday}
                    onChange={(e) => setContactForm((s) => ({ ...s, saturday: e.target.value }))}
                    style={styles.input}
                    placeholder="10:00 AM - 4:00 PM"
                  />
                </Field>
                <Field label="Sunday Hours">
                  <input
                    value={contactForm.sunday}
                    onChange={(e) => setContactForm((s) => ({ ...s, sunday: e.target.value }))}
                    style={styles.input}
                    placeholder="Closed"
                  />
                </Field>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <button type="button" style={styles.button} onClick={onSaveContact} disabled={saveMutation.isPending}>
                  {saveMutation.isPending ? 'Saving…' : 'Save'}
                </button>
              </div>
            </div>
          )}
        </section>
      </div>
    </div>
  )
}
