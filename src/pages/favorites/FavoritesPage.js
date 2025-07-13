import React, { useContext } from "react";
import RetrieveDisplayRealPropertyDoc from "../../components/acris/userFavorites/RetrieveDisplayRealPropertyDoc";
import { Helmet } from "react-helmet";
import UserContext from "../../auth/UserContext";

/**
 * Favorites page - displays all saved real property documents for the current user
 */
function FavoritesPage() {
  const { currentUser } = useContext(UserContext);
  return (
    <div className="FavoritesPage container">
      <Helmet>
        <title>
          {`SNACRIS - ${currentUser.firstName || currentUser.username}'s favorites`}
        </title>
      </Helmet>
      <RetrieveDisplayRealPropertyDoc />
    </div>
  );
}

export default FavoritesPage;
