'use strict';

(function () {
  var FEATURE_PREFIX = 'popup__feature--';
  var mapFiltersBlock = document.querySelector('.map__filters-container');
  var currentCard;
  var mapCardTemplate;
  try {
    mapCardTemplate = window.data.template.content.querySelector('.map__card');
  } catch (error) { //  fix for IE
    mapCardTemplate = window.data.template.querySelector('.map__card');
    window.library.hideBlock(window.data.template);
  }
  window.card = {
    render: function (item) {
      renderCard(item);
    },

    clear: function () {
      clearCard();
    }
  };

  function renderCard(item) {
    clearCard();
    mapFiltersBlock.insertAdjacentElement('beforeBegin', createCard(item));
  }

  function clearCard() {
    currentCard = document.querySelector('.map__card.popup');
    if (currentCard) {
      currentCard.remove();
    }
    window.pin.deactivate();
    document.removeEventListener('keydown', onDocumentEscPress);
  }

  function createCard(item) {
    var card = mapCardTemplate.cloneNode(true);
    var cardClose = card.querySelector('.popup__close');
    var featuresList = card.querySelector('.popup__features');
    var photosList = card.querySelector('.popup__photos');
    card.querySelector('.popup__title').textContent = item.offer.title;
    card.querySelector('.popup__text--address').textContent = item.offer.address;
    card.querySelector('.popup__text--price').textContent = item.offer.price + ' ₽/ночь';
    card.querySelector('.popup__type').textContent = getOfferTypeText(item.offer.type);
    card.querySelector('.popup__text--capacity').textContent = getCapacityText(item.offer.rooms, item.offer.guests);
    card.querySelector('.popup__text--time').textContent = 'Заезд после ' + item.offer.checkin + ', выезд до ' + item.offer.checkout + '.';
    createFeatures(featuresList, item.offer.features);
    card.querySelector('.popup__description').textContent = item.offer.description;
    createPhotos(photosList, item.offer.photos);
    card.querySelector('.popup__avatar').src = item.author.avatar;
    cardClose.addEventListener('click', function () {
      cardClose.parentNode.remove();
      window.pin.deactivate();
      document.removeEventListener('keydown', onDocumentEscPress);
    });
    document.addEventListener('keydown', onDocumentEscPress);
    return card;
  }

  function onDocumentEscPress(evt) {
    if (evt.keyCode === window.data.ESC_KEYCODE) {
      clearCard();
    }
  }

  function createFeatures(listBlock, featuresArray) {
    [].forEach.call(listBlock.children, function (item) {
      if (!window.library.checkClassInArray(item.classList, featuresArray, FEATURE_PREFIX)) {
        item.remove();
      }
    });
  }

  function createPhotos(photosBlock, photosArray) {
    var fragment = document.createDocumentFragment();
    var popupPhoto = photosBlock.querySelector('.popup__photo');

    photosArray.forEach(function (item) {
      var photo = popupPhoto.cloneNode(true);
      photo.src = item;
      fragment.appendChild(photo);
    });

    photosBlock.innerHTML = '';
    photosBlock.appendChild(fragment);
  }

  function getCapacityText(rooms, guests) {
    var result = '';
    switch (rooms) {
      default:
        result = rooms + ' комнаты ';
        break;
      case 0:
        result = 'Комнаты ';
        break;
      case 1:
        result = rooms + ' комната ';
        break;
      case 5:
        result = rooms + ' комнат ';
        break;
    }

    switch (guests) {
      default:
        result += 'для ' + guests + ' гостей.';
        break;
      case 1:
        result += 'для ' + guests + ' гостя.';
        break;
      case 0:
        result += 'не для гостей.';
    }
    return result;
  }

  function getOfferTypeText(type) {
    return window.data.offerTypes[type].text;
  }

})();
