export default function StarRating({ rating, size = 'sm' }) {
  const sz = size === 'lg' ? 'text-xl' : 'text-sm'
  return (
    <span className={sz}>
      {[1, 2, 3, 4, 5].map(i => {
        const decimal = rating % 1
        if (i <= Math.floor(rating)) return <span key={i} className="star-filled">★</span>
        if (i === Math.ceil(rating)) {
          if (decimal === 0.25) return <span key={i} className="star-filled">¼</span>
          if (decimal === 0.5)  return <span key={i} className="star-filled">½</span>
          if (decimal === 0.75) return <span key={i} className="star-filled">¾</span>
        }
        return <span key={i} className="star-empty">★</span>
      })}
    </span>
  )
}
