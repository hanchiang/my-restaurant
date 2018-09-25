import axios from 'axios';

export default function heartStore(form) {
  if (!form) return;

  form.addEventListener('submit', function(e) {
    e.preventDefault();

    const heartButton = e.target.querySelector('button.heart__button');
    
    axios.post(e.target.action)
      .then(({ data: user }) => {

        const match = e.target.action.match(/stores\/(\w+)\//);
        if (match) {
          const storeId = match[1];
          if (user.hearts.indexOf(storeId) !== -1) {
            heartButton.className = 'heart__button heart__button--hearted heart__button--float';
          } else {
            heartButton.className = 'heart__button';
          }

          document.querySelector('span.heart-count').textContent = user.hearts.length;
        }
        
      })
      .catch(err => { console.log(err) })
  })
}