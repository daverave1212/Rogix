'use strict'

var operator = ['(', '+' ,')']

function isOperator(char){
	return operator.includes(char)
}

function smartSplit(text){
	let words = []
	let state = 'reading-spaces'
	let start = 0
	for(let i = 0; i<text.length; i++){
		let char = text[i]
		switch(state){
			case 'reading-spaces':
				if(isSpace(char))
					continue
				if(isOperator(char)){
					words.push(char)
				} else {
					start = i
					if(char == '"'){
						state = 'reading-string'
					} else {
						state = 'reading-word'
					}
				}
				break
			case 'reading-string':
				if(char != '"') continue
				else {
					words.push(text.substring(start+1, i))
					state = 'reading-spaces'
				}
				break
			case 'reading-word':
				if(isSpace(char)){
					words.push(text.substring(start, i))
					state = 'reading-spaces'
				} else if(isOperator(char)){
					words.push(text.substring(start, i))
					words.push(char)
					state = 'reading-spaces'
				} else {
					continue
				}
		}
	}
	if(state == 'reading-word' && start != text.length - 1){
		words.push(text.substring(start, text.length))
	}
	return words
}

var sampleToken = {
	content : 'some',	// Or an array of tokens
	type : 'expression'	// or token
}

function findMatchingParenthesis(tokens, parPos){
	var level = 0;
	for(let i = parPos; i<tokens.length; i++){
		let token = tokens[i]
		if(token == '('){
			level++
		} else if(token == ')'){
			level--
			if(level == 0) return i
		}
	}
	return null
}

function expressize(tokens){
	let finalTokens = []
	for(let i = 0; i<tokens.length; i++){
		let token = tokens[i]
		if(token == '('){
			let parPos = findMatchingParenthesis(tokens, i)
			let expression = {
				content: expressize(tokens.slice(i+1, parPos)),
				type: 'expression'
			}
			finalTokens.push(expression)
			i = parPos
		} else {
			finalTokens.push({
				content: token,
				type: 'token'
			})
		}
	}
	return finalTokens
}

let code = 'word letter (BIG ASS (347054 + 743484) AWUM) chicken noodle'
let tokens = smartSplit(code)
tokens = expressize(tokens)

console.log(tokens)
