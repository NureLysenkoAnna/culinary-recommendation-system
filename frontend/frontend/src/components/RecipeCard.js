import { useNavigate } from 'react-router-dom';

const RecipeCard = ({
  recipe,
  isAuth,
  isFavorite = false,
  onToggleFavorite,
  onIconClick,
  iconType = 'heart',
  favorites = [],
  extraInfo = null,
  onClick = null,
}) => {
  const navigate = useNavigate();

  const handleCardClick = () => {
    if (onClick) {
      onClick();
    } else {
      navigate(`/recipe/${recipe._id}`);
    }
  };

  const handleIconClick = (e) => {
    e.stopPropagation();
    if (onToggleFavorite) {
      onToggleFavorite(recipe._id);
    }
    if (onIconClick) {
    onIconClick(recipe._id);
    }
  };

  const isActive = favorites.includes?.(recipe._id);

  return (
    <div className="recipe-card" onClick={handleCardClick}>
      <img src={recipe.image} alt={recipe.title} className="recipe-img" />

      {isAuth && (
        <span
          className={`${iconType === 'heart' ? 'heart-icon' : 'remove-icon'} ${isActive ? 'active' : ''}`}
          onClick={handleIconClick}
          title={iconType === 'heart' ? 'Улюблене' : 'Видалити з улюблених'}
        >
          {iconType === 'heart' ? '♥' : '✖'}
        </span>
      )}

      <h3>{recipe.title}</h3>
      <p>Кухня: {recipe.cuisine}</p>
      <p>Час: {recipe.cookingTime} хв</p>
      <p>Складність: {recipe.complexity}</p>

      {extraInfo && <div className="extra-info">{extraInfo}</div>}
    </div>
  );
};

export default RecipeCard;