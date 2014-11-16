
function assert(condition, message){
	if(!condition){
		throw new Error(message) || "Assertion failed";
	}
}

function assertNot(condition, message){
	if(condition){
		throw new Error(message) || "Assertion failed";
	}
}
