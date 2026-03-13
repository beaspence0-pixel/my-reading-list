export default function StarRating({ rating, size = 'sm' }) {
  const sz = size === 'lg' ? 'text-xl' : 'text-sm'
  return (
    <span className={sz}>
      {[1, 2, 3, 4, 5].map(i => (
        <span key={i} className={i <= rating ? 'star-filled' : 'star-empty'}>★</span>
      ))}
    </span>
  )
}
