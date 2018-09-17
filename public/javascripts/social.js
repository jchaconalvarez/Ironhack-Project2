// social.js


$(document).ready(() => {
  // console.log('loaded');

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

    axios.put(`/articles/${idArticle}/like`)
      .then((response) => {
        if (response.data.liked) {
          $(this).find('[data-fa-i2svg]').attr('data-prefix', 'fas');
          if (!response.data.unliked) {
            setTimeout(() => {
              $(this).closest('ul').children('li.dislike').find('[data-fa-i2svg]')
                .attr('data-prefix', 'far');
              $(this).closest('ul').find('span#dislikes').text(response.data.unlikes);
            }, 500);
          }
        } else {
          $(this).find('[data-fa-i2svg]').attr('data-prefix', 'far');
        }
        $(this).find('span#likes').text(response.data.likes);
      })
      .catch((error) => { console.log(error); });
  });


  $('li.dislike').on('click', function () {
    const idArticle = $(this).attr('value');

    axios.put(`/articles/${idArticle}/dislike`)
      .then((response) => {
        if (response.data.disliked) {
          $(this).find('[data-fa-i2svg]').attr('data-prefix', 'fas');
          if (!response.data.liked) {
            setTimeout(() => {
              $(this).closest('ul').children('li.like').find('[data-fa-i2svg]')
                .attr('data-prefix', 'far');
              $(this).closest('ul').find('span#likes').text(response.data.likes);
            }, 500);
          }
        } else {
          $(this).find('[data-fa-i2svg]').attr('data-prefix', 'far');
        }
        $(this).find('span#dislikes').text(response.data.unlikes);
      })
      .catch((error) => { console.log(error); });
  });

  $('li.trash').on('click', function () {
    const idArticle = $(this).attr('value');
    axios.delete(`/articles/${idArticle}/delete`)
      .then((response) => {
        $(this).closest('div.article-card').slideUp();// .hide('slow');
      })
      .catch((error) => {
        console.log(error);
      });
  });

  // TODO: terminar share
  $('li.share').on('click', function () {
    const idArticle = $(this).attr('value');

    console.log($(this).closest('div.article-social').find('ul.container-sendmail:li.sendmail').attr());
    // if ($(this).closest(article-social).find('ul.container-sendmail').('li.sendmail').attr('visible')) {
    //   $('li.sendmail').hide('slow');
    // }else{
    //   $('li.sendmail').show('slow');
    // };
  });


  $('li.sendmail').on('click', function () {
    const idArticle = $(this).attr('value');
    console.log(idArticle);
    axios.put('/articles/share', { email:'xavifserra@gmail.com', host: window.location.hostname, link:idArticle })
      .then((response) => {
        console.log(response);
        $('#container-messages').load(' #container-messages');
      })
      .catch((error) => {
        console.log(error);
      });
  });
});

// _____
