export default function StarRating({ rating, size = 'sm' }) {
  const sz = size === 'lg' ? 'text-xl' : 'text-sm'
  return (
    <span className={sz}>
      {[1, 2, 3, 4, 5].map(i => (
        <span key={i} className={
          i <= Math.floor(rating) ? 'star-filled' :
          i === Math.ceil(rating) && rating % 1 ? 'star-filled' :
          'star-empty'
        }>
          {i === Math.ceil(rating) && rating % 1 ? '½' : '★'}
        </span>
      ))}
    </span>
  )
}
