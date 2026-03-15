import { useState, useEffect } from 'react'
import Head from 'next/head'
import Link from 'next/link'
import { supabase } from '../lib/supabase'

const GENRES = ['Fiction', 'Literary Fiction', 'Romance', 'Romantasy', 'Thriller', 'Horror', 'Crime', 'Fantasy', 'Sci-Fi', 'Classics', 'Young Adult', 'Mystery', 'Other']

const EMPTY_FORM = {
  title: '', author: '', genre: 'Other',
  rating: 5, review: '', date_read: '',
}

export default function Admin() {
  const [password, setPassword] = useState('')
  const [authed, setAuthed] = useState(false)
  const [books, setBooks] = useState([])
  const [form, setForm] = useState(EMPTY_FORM)
  const [editId, setEditId] = useState(null)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')
  const [coverFile, setCoverFile] = useState(null)

  const ADMIN_PASSWORD = process.env.NEXT_PUBLIC_ADMIN_PASSWORD || 'readinglist2024'

  useEffect(() => {
    if (authed) fetchBooks()
  }, [authed])

  async function fetchBooks() {
    const { data } = await supabase.from('books').select('*').order('date_read', { ascending: false })
    setBooks(data || [])
  }

  async function handleSave() {
    if (!form.title || !form.author) return setMessage('Title and author are required.')
    setSaving(true)
    setMessage('')

    let cover_url = form.cover_url || null

    if (coverFile) {
      const ext = coverFile.name.split('.').pop()
      const filename = `${Date.now()}.${ext}`
      const { error: uploadErr } = await supabase.storage
        .from('covers')
        .upload(filename, coverFile, { upsert: true })

      if (!uploadErr) {
        const { data: urlData } = supabase.storage.from('covers').getPublicUrl(filename)
        cover_url = urlData.publicUrl
      }
    }

    const payload = { ...form, cover_url, rating: parseInt(form.rating) }

    let error
    if (editId) {
      ;({ error } = await supabase.from('books').update(payload).eq('id', editId))
    } else {
      ;({ error } = await supabase.from('books').insert([payload]))
    }

    if (error) {
      setMessage('Error saving: ' + error.message)
    } else {
      setMessage(editId ? 'Book updated!' : 'Book added!')
      setForm(EMPTY_FORM)
      setEditId(null)
      setCoverFile(null)
      fetchBooks()
    }
    setSaving(false)
  }

  async function handleDelete(id) {
    if (!confirm('Delete this book?')) return
    await supabase.from('books').delete().eq('id', id)
    fetchBooks()
  }

  function startEdit(book) {
    setForm({
      title: book.title,
      author: book.author,
      genre: book.genre || 'Other',
      rating: book.rating || 5,
      review: book.review || '',
      date_read: book.date_read || '',
      cover_url: book.cover_url || '',
    })
    setEditId(book.id)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  if (!authed) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: 'var(--cream)' }}>
        <div className="w-full max-w-sm p-8 rounded-2xl border bg-white" style={{ borderColor: 'var(--border)' }}>
          <h1 className="font-display text-2xl font-semibold mb-6" style={{ color: 'var(--ink)' }}>Admin</h1>
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && (password === ADMIN_PASSWORD ? setAuthed(true) : setMessage('Wrong password'))}
            className="w-full border rounded-lg px-4 py-2 text-sm outline-none mb-3"
            style={{ borderColor: 'var(--border)', background: '#FAF8F4' }}
          />
          {message && <p className="text-red-500 text-xs mb-3">{message}</p>}
          <button
            onClick={() => password === ADMIN_PASSWORD ? setAuthed(true) : setMessage('Wrong password')}
            className="w-full py-2 rounded-lg text-sm font-medium text-white transition-opacity"
            style={{ background: 'var(--accent)' }}
          >
            Enter
          </button>
        </div>
      </div>
    )
  }

  return (
    <>
      <Head><title>Admin — My Reading List</title></Head>
      <div className="min-h-screen" style={{ background: 'var(--cream)' }}>
        <header className="border-b" style={{ borderColor: 'var(--border)' }}>
          <div className="max-w-3xl mx-auto px-6 py-5 flex items-center justify-between">
            <h1 className="font-display text-2xl font-semibold" style={{ color: 'var(--ink)' }}>Admin</h1>
            <Link href="/" className="text-sm" style={{ color: 'var(--muted)' }}>← View site</Link>
          </div>
        </header>

        <main className="max-w-3xl mx-auto px-6 py-10">
          {/* Form */}
          <div className="bg-white rounded-2xl border p-6 mb-10" style={{ borderColor: 'var(--border)' }}>
            <h2 className="font-display text-lg font-semibold mb-5" style={{ color: 'var(--ink)' }}>
              {editId ? 'Edit book' : 'Add a book'}
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-xs mb-1" style={{ color: 'var(--muted)' }}>Title *</label>
                <input value={form.title} onChange={e => setForm({...form, title: e.target.value})}
                  className="w-full border rounded-lg px-3 py-2 text-sm outline-none" style={{ borderColor: 'var(--border)' }} />
              </div>
              <div>
                <label className="block text-xs mb-1" style={{ color: 'var(--muted)' }}>Author *</label>
                <input value={form.author} onChange={e => setForm({...form, author: e.target.value})}
                  className="w-full border rounded-lg px-3 py-2 text-sm outline-none" style={{ borderColor: 'var(--border)' }} />
              </div>
              <div>
                <label className="block text-xs mb-1" style={{ color: 'var(--muted)' }}>Genre</label>
                <select value={form.genre} onChange={e => setForm({...form, genre: e.target.value})}
                  className="w-full border rounded-lg px-3 py-2 text-sm outline-none" style={{ borderColor: 'var(--border)' }}>
                  {GENRES.map(g => <option key={g}>{g}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs mb-1" style={{ color: 'var(--muted)' }}>Rating (1–5)</label>
                <select value={form.rating} onChange={e => setForm({...form, rating: e.target.value})}
                  className="w-full border rounded-lg px-3 py-2 text-sm outline-none" style={{ borderColor: 'var(--border)' }}>
                 {[5,4.75,4.5,4.25,4,3.75,3.5,3.25,3,2.75,2.5,2.25,2,1.75,1.5,1.25,1].map(n => {
  const full = Math.floor(n)
  const decimal = n % 1
  const fraction = decimal === 0.25 ? '¼' : decimal === 0.5 ? '½' : decimal === 0.75 ? '¾' : ''
  return <option key={n} value={n}>{'★'.repeat(full)}{fraction} ({n})</option>
})}
                </select>
              </div>
              <div>
                <label className="block text-xs mb-1" style={{ color: 'var(--muted)' }}>Date read</label>
                <input type="date" value={form.date_read} onChange={e => setForm({...form, date_read: e.target.value})}
                  className="w-full border rounded-lg px-3 py-2 text-sm outline-none" style={{ borderColor: 'var(--border)' }} />
              </div>
              <div>
                <label className="block text-xs mb-1" style={{ color: 'var(--muted)' }}>Cover image (optional)</label>
                <input type="file" accept="image/*" onChange={e => setCoverFile(e.target.files[0])}
                  className="w-full text-sm" style={{ color: 'var(--muted)' }} />
              </div>
            </div>

            <div className="mb-4">
              <label className="block text-xs mb-1" style={{ color: 'var(--muted)' }}>Review</label>
              <textarea value={form.review} onChange={e => setForm({...form, review: e.target.value})}
                rows={4} className="w-full border rounded-lg px-3 py-2 text-sm outline-none resize-none"
                style={{ borderColor: 'var(--border)' }} placeholder="What did you think?" />
            </div>

            {message && (
              <p className="text-sm mb-3" style={{ color: message.includes('Error') ? '#DC2626' : '#15803D' }}>
                {message}
              </p>
            )}

            <div className="flex gap-3">
              <button onClick={handleSave} disabled={saving}
                className="px-5 py-2 rounded-lg text-sm font-medium text-white disabled:opacity-50"
                style={{ background: 'var(--accent)' }}>
                {saving ? 'Saving...' : editId ? 'Update book' : 'Add book'}
              </button>
              {editId && (
                <button onClick={() => { setForm(EMPTY_FORM); setEditId(null); setMessage('') }}
                  className="px-5 py-2 rounded-lg text-sm border" style={{ borderColor: 'var(--border)', color: 'var(--muted)' }}>
                  Cancel
                </button>
              )}
            </div>
          </div>

          {/* Book list */}
          <h2 className="font-display text-lg font-semibold mb-4" style={{ color: 'var(--ink)' }}>
            All books ({books.length})
          </h2>
          <div className="space-y-3">
            {books.map(book => (
              <div key={book.id} className="bg-white rounded-xl border px-4 py-3 flex items-center justify-between gap-4"
                style={{ borderColor: 'var(--border)' }}>
                <div className="min-w-0">
                  <p className="font-medium text-sm truncate" style={{ color: 'var(--ink)' }}>{book.title}</p>
                  <p className="text-xs" style={{ color: 'var(--muted)' }}>{book.author} · {'★'.repeat(book.rating)}</p>
                </div>
                <div className="flex gap-2 flex-shrink-0">
                  <button onClick={() => startEdit(book)}
                    className="text-xs px-3 py-1 rounded-lg border" style={{ borderColor: 'var(--border)', color: 'var(--muted)' }}>
                    Edit
                  </button>
                  <button onClick={() => handleDelete(book.id)}
                    className="text-xs px-3 py-1 rounded-lg border border-red-200 text-red-500">
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </main>
      </div>
    </>
  )
}
