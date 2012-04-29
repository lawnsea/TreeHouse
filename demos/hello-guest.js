var div = document.createElement('div');
var span = document.createElement('span');
span.innerHTML = 'Hello, TreeHouse!';
div.style.color = 'red';
div.appendChild(span);
document.getElementById('root').appendChild(div);
