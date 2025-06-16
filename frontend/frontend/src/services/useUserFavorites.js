import { useEffect, useState } from 'react';
import { getUserFavorites } from './favoriteService';
import { getCurrentUser, isAuthenticated } from './authService';

const useUserFavorites = () => {
  const [user, setUser] = useState(null);
  const [isAuth, setIsAuth] = useState(false);
  const [favorites, setFavorites] = useState(null);

  useEffect(() => {
    const init = async () => {
      const auth = isAuthenticated();
      setIsAuth(auth);

      if (auth) {
        const currentUser = getCurrentUser();
        setUser(currentUser);

        try {
          const updated = await getUserFavorites(currentUser._id);
          const ids = updated.map(f =>
            typeof f.recipe === 'string' ? f.recipe : f.recipe?._id?.toString()
          ).filter(Boolean);

          setFavorites(ids);
        } catch (e) {
          console.error('Помилка при завантаженні favorites:', e);
          setFavorites([]); // fallback
        }
      } else {
        setFavorites([]); // неавторизованим – порожній список
      }
    };

    init();
  }, []);

  return { isAuth, user, favorites, setFavorites };
};

export default useUserFavorites;
