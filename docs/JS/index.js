const github = document.querySelector('#github');
const minescordgithub = document.querySelector('#minescord-github');
const minescordwiki = document.querySelector('#minescord-wiki');

github.addEventListener("click", function() {
    window.open('https://github.com/Henry8K', '_blank');
});

minescordgithub.addEventListener("click", function() {
    window.location.href = 'https://github.com/Henry8K/Minescord/';
});

minescordwiki.addEventListener("click", function() {
    window.location.href = 'https://henry8k.gitbook.io/minescord-wiki/';
});