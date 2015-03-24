"use strict";

function Matcher( matches, isBufferEncoded ) {
	if( !isBufferEncoded ) {
		let i;
		for( i = 0; i < matches.length; i++ ) {
			matches[i] = new Buffer( matches[i] );
		}
	}
	
	this.matches = matches;
	
	this.reset();
	
	this.isBufferEncoded = isBufferEncoded;
}

Matcher.prototype.reset = function() {
	this.charIndex = 0;
	this.head = 0;
	this.tail = this.matches.length;
};

Matcher.prototype.matchCharCode = function( charCode ) {	
	if( this.tail === this.head ) {
		return;
	}
	
	let min = this.head,
		max = this.tail,
		pivot,
		currentChar;
	
	while( max > min ) {
		pivot = min + ( max - min >>> 1 );
		
		if( this.charIndex >= this.matches[ pivot ].length ) {
			min = pivot + 1;
			continue;
		}
		
		currentChar = this.matches[ pivot ][ this.charIndex ];
		
		if( currentChar < charCode ) {
			min = pivot + 1;
		}
		else if( currentChar > charCode ) {
			max = pivot;
		}
		else {
			min = this.leftIndexOf( charCode, min, pivot );
			max = this.rightIndexOf( charCode, pivot, max );
			break;
		}
	}
	
	this.head = min;
	this.tail = max;
	
	this.charIndex++;
};

Matcher.prototype.leftIndexOf = function( charCode, min, max ) {
	let pivot,
		currentChar;
	
	while( max > min ) {
		pivot = min + ( max - min >>> 1 );
		
		if( this.charIndex >= this.matches[ pivot ].length ) {
			min = pivot + 1;
			continue;
		}
		
		currentChar = this.matches[ pivot ][ this.charIndex ];
		
		if( currentChar < charCode ) {
			min = pivot + 1;
		}
		else {
			max = pivot;
		}
	}
	
	return min;
};

Matcher.prototype.rightIndexOf = function( charCode, min, max ) {
	let pivot,
		currentChar;
	
	while( max > min ) {
		pivot = min + ( max - min >>> 1 );
		
		if( this.charIndex >= this.matches[ pivot ].length ) {
			min = pivot + 1;
			continue;
		}
		
		currentChar = this.matches[ pivot ][ this.charIndex ];
		
		if( currentChar > charCode ) {
			max = pivot;
		}
		else {
			min = pivot + 1;
		}
	}
	
	return max;
};

Matcher.prototype.matchChar = function( character ) {
	this.matchCharCode( character.charCodeAt( 0 ) );
};

Matcher.prototype.matchString = function( string ) {
	for( let i = 0; i < string.length && this.tail > this.head; i++ ) {
		this.matchCharCode( string.charCodeAt( i ) );
	}
};

Matcher.prototype.matchBuffer = function( buffer ) {
	for( let i = 0; this.tail > this.head && i < buffer.length; i++ ) {
		this.matchCharCode( buffer[ i ] );
	}
};

Matcher.prototype.getMatch = function() {
	const matchIndex = this.getMatchIndex();
	
	return matchIndex < 0 ?
		null :
		this.isBufferEncoded ?
			this.matches[ matchIndex ] :
			this.matches[ matchIndex ].toString();
};

Matcher.prototype.getMatchIndex = function() {
	let stringIndex;
	
	for( stringIndex = this.head; stringIndex < this.tail; stringIndex++ ) {
		if( this.matches[ stringIndex ].length !== this.charIndex ) {
			this.tail = stringIndex;
			break;
		}
	}
	
	return this.tail - this.head === 1 ? this.head : -1;
};

module.exports = Matcher;
