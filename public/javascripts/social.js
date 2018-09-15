// social.js


$(document).ready(() => {
  console.log('loaded');

  $('.article-image').on('error', function () {
    console.log('Error loading image!');
    $(this).attr({
      src: '/images/600px-No_image_available.png',
      alt: 'Sorry, image not available.',
      // style: 'border: 1px solid #000000;',
    });
  });

  // Icon favorite

  $('li.favorite').on('click', function () {
    const idArticle = $(this).attr('value');
    // const icon = $(this).find('[data-fa-i2svg]').attr('data-prefix');

    axios.put(`/articles/${idArticle}/addfav`)
      .then((response) => {
        if (response.data) {
          $(this).find('[data-fa-i2svg]').attr('data-prefix', 'fas');
        } else {
          $(this).find('[data-fa-i2svg]').attr('data-prefix', 'far');
        }
      });
  });


  // Icon like
  $('li.like').on('click', function () {
    const idArticle = $(this).attr('value');

    axios.put(`/articles/${idArticle}/like`, { idArticle })
      .then((response) => {
        if (response.data.liked) {
          $(this).find('[data-fa-i2svg]').attr('data-prefix', 'fas');
        } else {
          $(this).find('[data-fa-i2svg]').attr('data-prefix', 'far');
        }
        $(this).find('span#likes').text(response.data.likes);
      })
      .catch((error) => {
        console.log(error);
      });
  });

  $('li.dislike').on('click', function () {
    const idArticle = $(this).attr('value');

    axios.put(`/articles/${idArticle}/dislike`, { idArticle })
      .then((response) => {
        if (response.data.unliked) {
          $(this).find('[data-fa-i2svg]').attr('data-prefix', 'fas');
          if (response.data.liked) {
            setTimeout(() => {
              $(this).closest('ul').children('li.like').find('[data-fa-i2svg]')
                .attr('data-prefix', 'far');
              $(this).closest('ul').find('span#likes').text(response.data.likes);
            }, 1000);
          }
        } else {
          $(this).find('[data-fa-i2svg]').attr('data-prefix', 'far');
        }
        $(this).find('span#dislikes').text(response.data.unlikes);
      })
      .catch((error) => { console.log(error); });
  });

  // TODO: terminar share
  $('li.share').on('click', function () {
    const idArticle = $(this).attr('value');
    console.log(idArticle);
    axios.post('/articles/share', { idArticle })
      .then((response) => {
        console.log(response);
      })
      .catch((error) => {
        console.log(error);
      });
  });

  $('li.trash').on('click', function () {
    const idArticle = $(this).attr('value');
    axios.delete(`/articles/${idArticle}/delete`)
      .then((response) => {
        $(this).closest('div.article-card').hide('slow');
      })
      .catch((error) => {
        console.log(error);
      });
  });
});

// _____
