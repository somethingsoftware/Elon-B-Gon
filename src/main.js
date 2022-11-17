function callback(timeouts, callbackInterval = 500, KeyWords) {
	/* Calback clojure waiting for the page to stop lazy loading */
	return () => {
		if (timeouts)
			window.clearTimeout(timeouts);
		/* If (callbackInterval)ms passed the page has finished loading for now */
		timeouts = window.setTimeout(() => { NoMusk(KeyWords) }, 500);
	}
}

/* Check for Musk */
function NoMusk(KeyWords) {
	console.log("NoMusk!");
	let DOM = document;
	const check = DOM.body.innerText;
	/* Search for Elon refs in the DOM */
	const Musky = !KeyWords.every((word) => {
		if (check.match(new RegExp(word, "gi")))
			return false;
		return true;
	});
	if (Musky) {
		/* We have some musky business */
	}
}

/* Read files from extention filesystem */
async function readExtentionFile(fileName) {
	return (await (await fetch(chrome.runtime.getURL(fileName))).text()).split("\n").filter((word) => word.length > 0);
}

async function ElonBgon_main() {
	/* DOM Mutation Observer config for lazy loading */
	const DOMconfig = { attributes: false, childList: true, subtree: true };
	const callbackInterval = 500;
	const KeyWords = await readExtentionFile("src/wordlist.txt");;
	let timeouts;
	/* Call calback clojure with referenced timeouts varable every time the DOM updates */
	const observer = new MutationObserver(callback(timeouts, callbackInterval, KeyWords));
	observer.observe(document.body, DOMconfig);
}

ElonBgon_main();
