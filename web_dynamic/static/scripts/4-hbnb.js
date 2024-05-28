$(document).ready(() => {
  // Initialisation du tableau pour stocker les commodités sélectionnées
  const amenities = [];

  // Gestionnaire d'événement pour les cases à cocher
  $('input:checkbox').click(function () {
    const amenityId = $(this).attr('data-id');
    if ($(this).is(":checked")) {
      // Ajouter l'ID de la commodité sélectionnée au tableau
      amenities.push(amenityId);
    } else {
      // Supprimer l'ID de la commodité du tableau
      const index = amenities.indexOf(amenityId);
      if (index > -1) {
        amenities.splice(index, 1);
      }
    }
    // Mettre à jour le texte des commodités sélectionnées
    const amenityNames = $('input:checkbox:checked').map(function () {
      return $(this).attr('data-name');
    }).get();
    $('.amenities h4').text(amenityNames.join(', '));
  });

  // Vérification du statut de l'API
  $.get("http://localhost:5001/api/v1/status/", data => {
    if (data.status === "OK") {
      $('DIV#api_status').addClass("available");
    } else {
      $('DIV#api_status').removeClass("available");
    }
  });

  // Fonction pour récupérer les places
  const fetchPlaces = (filters = {}) => {
    $.ajax({
      type: 'POST',
      url: 'http://localhost:5001/api/v1/places_search',
      data: JSON.stringify(filters),
      dataType: 'json',
      contentType: 'application/json',
      success: data => {
        // Vider la section des places avant de les ajouter
        $('SECTION.places').empty();
        // Ajouter les places récupérées à la section
        $('SECTION.places').append(data.map(place => {
          return `<article>
                    <div class="title_box">
                      <h2>${place.name}</h2>
                      <div class="price_by_night">$${place.price_by_night}</div>
                    </div>
                    <div class="information">
                      <div class="max_guest">${place.max_guest} Guests</div>
                      <div class="number_rooms">${place.number_rooms} Bedrooms</div>
                      <div class="number_bathrooms">${place.number_bathrooms} Bathrooms</div>
                    </div>
                    <div class="description">
                      ${place.description}
                    </div>
                  </article>`;
        }));
      }
    });
  };

  // Récupérer les places à l'initialisation
  fetchPlaces();

  // Gestionnaire d'événement pour le bouton
  $('button').click(() => {
    const filters = { amenities };
    fetchPlaces(filters);
  });
});
