console.log('yowaddup');
$(document).ready(() => {

  $('#check-password').on('keyup', () => {
    const password1 = $('#password').val();
    const password2 = $('#check-password').val();

    console.log(password1);
    console.log(password2);
    console.log(password2.length);

    if (password2.length > 0) {

      if (password1 === password2) {
        $('#check-password').css({ backgroundColor: '#696' });
      } else {
        $('#check-password').css({ backgroundColor: '#F88' }); 
      }
    } else { $('#check-password').css({ backgroundColor: 'white' }); }

  });

  $('#check-password').on('click', () => {
    $('#check-password').trigger('keyup');
  });

  $('#password').on('keyup', () => {
    $('#check-password').trigger('keyup');
  });
});
// document.getElementsByClassName('share').forEach((button) => {
//   button.addEventListener('click', toggleField, false);
// });

// const toggleField = (button) => {
//   button.parentNode.getElementsByClassName('article-share')[0].classList.toggle('article-share-visible');
// };
