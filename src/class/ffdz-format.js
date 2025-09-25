function joke (data) {
	return `*"${ data.joke }"*\n|| ${ data.answer } ||`;
}

function gouffre (data) {
	return `${ data.id } : || ${ data.label } ||`;
}

export default {
	joke,
	gouffre
};
