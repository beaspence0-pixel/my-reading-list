import { useState } from 'react'
import Head from 'next/head'
import Link from 'next/link'
import { supabase } from '../lib/supabase'
import BookCard from '../components/BookCard'

const GENRES = ['All', 'Fiction', 'Literary Fiction', 'Romance', 'Thriller', 'Horror', 'Crime', 'Fantasy', 'Sci-Fi', 'Classics', 'Young Adult', 'Mystery', 'Other']

export default function Home({ books }) {
  const [activeGenre, setActiveGenre] = useState('All')
  const [search, setSearch] = useState('')

  const filtered = books.filter(b => {
    const matchGenre = activeGenre === 'All' || b.genre === activeGenre
    const matchSearch =
      b.title.toLowerCase().includes(search.toLowerCase()) ||
      b.author.toLowerCase().includes(search.toLowerCase())
    return matchGenre && matchSearch
  })

  const avgRating = books.length
    ? (books.reduce((s, b) => s + (b.rating || 0), 0) / books.length).toFixed(1)
    : '—'

  const genres = [...new Set(books.map(b => b.genre).filter(Boolean))]

  return (
    <>
      <Head>
        <title>My Reading List</title>
        <meta name="description" content="Books I've read and what I thought of them." />
      </Head>

      <div className="min-h-screen" style={{ background: 'var(--cream)' }}>

        {/* Header */}
        <header className="border-b" style={{ borderColor: 'var(--border)' }}>
          <div className="max-w-5xl mx-auto px-6 py-6 flex items-end justify-between">
            <div>
              <h1 className="font-display text-4xl font-semibold" style={{ color: 'var(--ink)' }}>
                My reading list
              </h1>
              <p className="text-sm mt-1" style={{ color: 'var(--muted)' }}>
                I've always had a love for reading — and I wanted somewhere to put my thoughts on everything I've read so I can look back on them properly. I've already read over 200 books and I only started this site in March 2026 , so detailed reviews will take a while to catch up — but I'm getting there!
              </p>
            </div>
            <Link
              href="/admin"
              className="text-xs px-3 py-1.5 rounded border transition-colors"
              style={{ borderColor: 'var(--border)', color: 'var(--muted)' }}
            >
              Admin
            </Link>
          </div>
        </header>

        <main className="max-w-5xl mx-auto px-6 py-10">

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 mb-10">
            {[
              { label: 'Books read', value: books.length },
              { label: 'Avg rating', value: avgRating },
              { label: 'Genres', value: genres.length },
            ].map(s => (
              <div key={s.label} className="rounded-xl p-5 border" style={{ background: '#F5F2EC', borderColor: 'var(--border)' }}>
                <div className="text-xs mb-1" style={{ color: 'var(--muted)' }}>{s.label}</div>
                <div className="font-display text-3xl font-semibold" style={{ color: 'var(--ink)' }}>{s.value}</div>
              </div>
            ))}
          </div>

          {/* Filters + Search */}
          <div className="flex flex-col sm:flex-row gap-4 mb-8">
            <div className="flex gap-2 flex-wrap">
              {GENRES.map(g => (
                <button
                  key={g}
                  onClick={() => setActiveGenre(g)}
                  className="text-xs px-3 py-1.5 rounded-full border transition-all"
                  style={{
                    borderColor: activeGenre === g ? 'var(--accent)' : 'var(--border)',
                    background: activeGenre === g ? 'var(--accent)' : 'transparent',
                    color: activeGenre === g ? '#fff' : 'var(--muted)',
                  }}
                >
                  {g}
                </button>
              ))}
            </div>
            <input
              type="text"
              placeholder="Search title or author..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="sm:ml-auto text-sm px-4 py-1.5 rounded-full border outline-none"
              style={{ borderColor: 'var(--border)', background: '#F5F2EC', color: 'var(--ink)', minWidth: '200px' }}
            />
          </div>

          {/* Grid */}
          {filtered.length === 0 ? (
            <div className="text-center py-20" style={{ color: 'var(--muted)' }}>
              <p className="font-display text-xl">No books found</p>
              <p className="text-sm mt-2">Try a different filter or search term</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
              {filtered.map((book, i) => (
                <BookCard key={book.id} book={book} index={i} />
              ))}
            </div>
          )}
        </main>
      </div>
    </>
  )
}

export async function getServerSideProps() {
  const { data: books, error } = await supabase
    .from('books')
    .select('*')
    .order('date_read', { ascending: false })

  if (error) console.error(error)

  return {
    props: { books: books || [] },
  }
}
