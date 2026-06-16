"use strict";
/**
 * @type {HTMLFormElement}
 */
const form = document.getElementById("uv-form");
/**
 * @type {HTMLInputElement}
 */
const address = document.getElementById("uv-address");
/**
 * @type {HTMLInputElement}
 */
const searchEngine = document.getElementById("uv-search-engine");
/**
 * @type {HTMLParagraphElement}
 */
const error = document.getElementById("uv-error");
/**
 * @type {HTMLPreElement}
 */
const errorCode = document.getElementById("uv-error-code");
const connection = new BareMux.BareMuxConnection("/baremux/worker.js");

function cloak(uvUrl) {
  const win = window.open('about:blank', '_blank');

  if (!win) return;

  win.document.title = 'Google Classroom';

  const fav = win.document.createElement('link');
  fav.rel = 'icon';
  fav.href = 'https://sites.google.com/educacion.navarra.es/macara-clase/inicio';
  win.document.head.appendChild(fav);

  const f = win.document.createElement('iframe');
  f.style.cssText =
    'position:fixed;inset:0;border:0;width:100vw;height:100vh';

  f.src = uvUrl;

  win.document.body.style.margin = '0';
  win.document.body.appendChild(f);
}

form.addEventListener("submit", async (event) => {
	event.preventDefault();

	try {
		await registerSW();
	} catch (err) {
		error.textContent = "Failed to register service worker.";
		errorCode.textContent = err.toString();
		throw err;
	}

	const url = search(address.value, searchEngine.value);

	let frame = document.getElementById("uv-frame");
	frame.style.display = "block";
	let wispUrl =
		(location.protocol === "https:" ? "wss" : "ws") +
		"://" +
		location.host +
		"/wisp/";
	if ((await connection.getTransport()) !== "/epoxy/index.mjs") {
		await connection.setTransport("/epoxy/index.mjs", [
			{ wisp: wispUrl },
		]);
	}
	const uvUrl = __uv$config.prefix + __uv$config.encodeUrl(url);
	cloak(uvUrl);

});
