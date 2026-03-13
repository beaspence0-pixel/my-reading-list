import Link from 'next/link'
import StarRating from './StarRating'

const GENRE_COLORS = {
  Product:    'bg-orange-100 text-orange-800',
  Design:     'bg-teal-100 text-teal-800',
  History:    'bg-amber-100 text-amber-800',
  Fiction:    'bg-purple-100 text-purple-800',
  Business:   'bg-blue-100 text-blue-800',
  Science:    'bg-green-100 text-green-800',
  Other:      'bg-stone-100 text-stone-700',
}

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

export default function BookCard({ book, index = 0 }) {
  const genreColor = GENRE_COLORS[book.genre] || GENRE_COLORS.Other
  const gradient = getCoverGradient(book.title)

  return (
    <Link href={`/books/${book.id}`}>
      <div
        className="group cursor-pointer fade-up"
        style={{ animationDelay: `${index * 60}ms`, animationFillMode: 'both', opacity: 0 }}
      >
        {/* Cover */}
        <div className={`relative bg-gradient-to-br ${gradient} rounded-lg mb-3 overflow-hidden`}
             style={{ aspectRatio: '2/3' }}>
          {book.cover_url ? (
            <img
              src={book.cover_url}
              alt={book.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="absolute inset-0 flex flex-col items-center justify-center p-4 text-center">
              <span className="font-display text-lg font-semibold text-stone-700 leading-tight">
                {book.title}
              </span>
              <span className="text-xs text-stone-500 mt-2">{book.author}</span>
            </div>
          )}
          {/* Hover overlay */}
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all duration-200" />
        </div>

        {/* Info */}
        <div>
          <h3 className="font-display text-base font-semibold text-stone-900 leading-snug line-clamp-2 mb-1">
            {book.title}
          </h3>
          <p className="text-sm text-stone-500 mb-2">{book.author}</p>
          <div className="flex items-center gap-2">
            <StarRating rating={book.rating} />
            <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${genreColor}`}>
              {book.genre || 'Other'}
            </span>
          </div>
        </div>
      </div>
    </Link>
  )
}
