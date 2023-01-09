import './style.css';
export function create404() {
    const body = document.querySelector('body');
    (body as HTMLElement).innerHTML = `<div class="not-found">
        <h2>Page not found.</h2>
        <h1>404</h1>
        <p>We can't find the page you are looking for.</p>
        <a href="/">Home Page</a>
      </div>`;
}
