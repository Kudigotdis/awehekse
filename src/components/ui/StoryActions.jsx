import heartInactive from '../../assets/icons/heart_inactive_icon.png'
import heartActive from '../../assets/icons/heart_active_icon.png'
import shareOn from '../../assets/icons/Share_On.png'
import { useFavorites } from '../../context/FavoritesContext'
import { shareViaWhatsApp } from '../../core/utils/share'

export default function StoryActions({ favKey, title = '', text = '' }) {
  const { isFavorite, toggleFavorite } = useFavorites()
  const active = isFavorite(favKey)

  return (
    <div className="mt-4 flex items-center gap-3">
      <button
        type="button"
        onClick={() => toggleFavorite(favKey)}
        aria-label={active ? 'Remove from favorites' : 'Add to favorites'}
        className="h-9 w-9 rounded-full p-1.5 transition-transform active:scale-90"
      >
        <img src={active ? heartActive : heartInactive} alt="Favorite" className="h-full w-full object-contain" />
      </button>
      <button
        type="button"
        onClick={() => shareViaWhatsApp(title, text)}
        aria-label="Share via WhatsApp"
        className="h-9 w-9 rounded-full p-1.5 transition-transform active:scale-90"
      >
        <img src={shareOn} alt="Share" className="h-full w-full object-contain" />
      </button>
    </div>
  )
}
