function formatJoke(data) {
	return `"*${data.joke}*"\n> ||${data.answer}||`;
}

export default {
	joke: formatJoke
}
