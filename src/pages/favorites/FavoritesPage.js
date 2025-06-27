import React from "react";
import RetrieveDisplayRealPropertyDoc from "../../components/acris/userFavorites/RetrieveDisplayRealPropertyDoc";

/**
 * Favorites page - displays all saved real property documents for the current user
 */
function FavoritesPage() {
  return (
    <div className="FavoritesPage">
      <RetrieveDisplayRealPropertyDoc />
    </div>
  );
}

export default FavoritesPage;
