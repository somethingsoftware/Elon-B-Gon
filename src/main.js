
function callback(timeouts, callbackInterval = 500, KeyWords) {
	/* Calback closure waiting for the page to stop lazy loading */
	return () => {
		if (timeouts)
			window.clearTimeout(timeouts);
		/* If (callbackInterval)ms passed the page has finished loading for now */
		timeouts = window.setTimeout(() => { NoMusk(KeyWords) }, callbackInterval);
	}
}

/* Check for Musk */
function NoMusk(KeyWords) {
	let jsonObj = JSON.parse(KeyWords);
	// build a trie of dom elements with references to the containing element
	let trie = dfsWordTrie();
	// for each replacement case search for the word in the trie and replace it with one of the replacement phrases
	for (let i = 0; i < jsonObj.length; i++) {
		let searchPhrases = jsonObj[i].search;
		let replacePhrases = jsonObj[i].replace;
		for (let j = 0; j < searchPhrases.length; j++) {
			let searchPhrase = searchPhrases[j].toLowerCase();
			let replacePhrase = replacePhrases[j];
			let firstSearchWord = searchPhrase.split(" ")[0];
			if (trie[firstSearchWord]) {
				// check if the rest of the search phrase is in the element and replace it
				let element = trie[firstSearchWord].ref;
				let innerText = element.innerText;
				let searchWords = searchPhrase.split(" ");
				for (let k = 0; k < searchWords.length; k++) {
					let searchWord = searchWords[k];
					if (!innerText.includes(searchPhrase)) {
						break;
					}
				}
				element.innerHTML = replacePhrase;
			}
		}
	}
}

function dfsWordTrie(element = document.body) {
	/* DFS through the DOM tree and build a trie of the words */
	let trie = {};
	let children = element.childNodes;
	for (let i = 0; i < children.length; i++) {
		let child = children[i];
		if (child.nodeType === Node.TEXT_NODE) {
			let words = child.nodeValue.split(" ");
			for (let j = 0; j < words.length; j++) {
				let word = words[j].toLowerCase();
				trie[word] = { "ref": child.parentElement, "index": j };
			}
		}
		else {
			let childTrie = dfsWordTrie(child);
			for (let word in childTrie) {
				trie[word] = childTrie[word];
			}
		}
	}
	return trie;
}

/* Read files from extention filesystem */
async function readExtentionFile(fileName) {
	let response = await fetch(chrome.runtime.getURL(fileName)).catch((err) => console.log(err));
	return await response.text();
}

async function ElonBgonMain() {
	/* DOM Mutation Observer config for lazy loading */
	const DOMconfig = { attributes: false, childList: true, subtree: true };
	const callbackInterval = 500;
	const KeyWords = await readExtentionFile("src/wordlist.json");;
	let timeouts;
	/* Call calback clojure with referenced timeouts varable every time the DOM updates */
	const observer = new MutationObserver(callback(timeouts, callbackInterval, KeyWords));
	observer.observe(document.body, DOMconfig);
}

ElonBgonMain();
