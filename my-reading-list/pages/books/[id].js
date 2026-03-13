import Head from 'next/head'
import Link from 'next/link'
import { supabase } from '../../lib/supabase'
import StarRating from '../../components/StarRating'

const COVER_GRADIENTS = [
  'from-orange-200 to-amber-100',
  'from-teal-200 to-emerald-100',
  'from-purple-200 to-pink-100',
  'from-blue-200 to-indigo-100',
  'from-rose-200 to-orange-100',
  'from-lime-200 to-teal-100',
]

function getCoverGradient(title) {
  const idx = title.charCodeAt(0) % COVER_GRADIENTS.length
  return COVER_GRADIENTS[idx]
}

export default function BookPage({ book }) {
  if (!book) return <div className="p-10 text-center">Book not found.</div>

  const gradient = getCoverGradient(book.title)

  return (
    <>
      <Head>
        <title>{book.title} — My Reading List</title>
      </Head>

      <div className="min-h-screen" style={{ background: 'var(--cream)' }}>
        <header className="border-b" style={{ borderColor: 'var(--border)' }}>
          <div className="max-w-3xl mx-auto px-6 py-5">
            <Link
              href="/"
              className="text-sm flex items-center gap-1 transition-colors"
              style={{ color: 'var(--muted)' }}
            >
              ← Back to all books
            </Link>
          </div>
        </header>

        <main className="max-w-3xl mx-auto px-6 py-12">
          <div className="flex flex-col sm:flex-row gap-10">
            {/* Cover */}
            <div className="flex-shrink-0">
              <div
                className={`bg-gradient-to-br ${gradient} rounded-xl overflow-hidden`}
                style={{ width: '160px', aspectRatio: '2/3' }}
              >
                {book.cover_url ? (
                  <img src={book.cover_url} alt={book.title} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center p-4 text-center">
                    <span className="font-display text-base font-semibold text-stone-700 leading-tight">
                      {book.title}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Details */}
            <div className="flex-1">
              <div className="mb-1">
                <span className="text-xs px-2 py-0.5 rounded-full bg-stone-200 text-stone-600 font-medium">
                  {book.genre || 'Other'}
                </span>
              </div>
              <h1 className="font-display text-3xl font-semibold mt-2 mb-1" style={{ color: 'var(--ink)' }}>
                {book.title}
              </h1>
              <p className="text-base mb-3" style={{ color: 'var(--muted)' }}>{book.author}</p>

              <div className="flex items-center gap-3 mb-6">
                <StarRating rating={book.rating} size="lg" />
                <span className="text-sm font-medium" style={{ color: 'var(--accent)' }}>
                  {book.rating}/5
                </span>
              </div>

              {book.date_read && (
                <p className="text-xs mb-6" style={{ color: 'var(--muted)' }}>
                  Read {new Date(book.date_read).toLocaleDateString('en-GB', { month: 'long', year: 'numeric' })}
                </p>
              )}

              {book.review && (
                <div className="border-t pt-6" style={{ borderColor: 'var(--border)' }}>
                  <h2 className="font-display text-lg font-semibold mb-3" style={{ color: 'var(--ink)' }}>
                    My review
                  </h2>
                  <p className="text-base leading-relaxed" style={{ color: '#44403C', fontFamily: 'Georgia, serif' }}>
                    {book.review}
                  </p>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </>
  )
}

export async function getServerSideProps({ params }) {
  const { data: book, error } = await supabase
    .from('books')
    .select('*')
    .eq('id', params.id)
    .single()

  if (error || !book) return { notFound: true }

  return { props: { book } }
}
