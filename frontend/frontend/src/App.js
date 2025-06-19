import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ProfilePage from './pages/ProfilePage';
import PrivateRoute from './routes/PrivateRoute';
import RecipePage from './pages/RecipePage';
import FavoritePage from './pages/FavoritePage';
import RecommendedPage from './pages/RecommendedPage';
import IngredientMatchPage from './pages/IngredientMatchPage';
import ModeratorRecipesPage from './pages/ModeratorRecipesPage';
import AdminUsersPage from './pages/AdminUsersPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/home" replace />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/recipe/:id" element={<RecipePage />} />
        <Route path="/favorites" element={<FavoritePage />} />
        <Route path="/recommended" element={<RecommendedPage />} />
        <Route path="/by-ingredients" element={<IngredientMatchPage />} />
        <Route path="/moderator" element={<ModeratorRecipesPage />} />
        <Route path="/admin" element={<AdminUsersPage />} />

        <Route
          path="/profile"
          element={
            <PrivateRoute>
              <ProfilePage />
            </PrivateRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
