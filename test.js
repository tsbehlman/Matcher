"use strict";

const Matcher = require( './index' );

let suite = module.exports;

suite.singleStringPositiveMatch = function( test ) {
	var matcher = new Matcher( [ "abcde" ] );
	
	matcher.matchString( "abcde" );
	
	test.strictEqual( "abcde", matcher.getMatch(), "Unable to positively identify single string match" );
	test.done();
};

suite.singleStringNegativeMatchSameLength = function( test ) {
	var matcher = new Matcher( [ "abcde" ] );

	matcher.matchString( "abdef" );
	
	test.strictEqual( null, matcher.getMatch(), "Unable to negatively identify single string match of same length" );
	test.done();
};

suite.singleStringNegativeMatchBeforeAll = function( test ) {
	var matcher = new Matcher( [ "bcdef" ] );

	matcher.matchString( "abcde" );

	test.strictEqual( null, matcher.getMatch(), "Unable to negatively identify single string match when given string comes before match" );
	test.done();
};

suite.singleStringNegativeMatchAfterAll = function( test ) {
	var matcher = new Matcher( [ "abcde" ] );

	matcher.matchString( "bcdef" );

	test.strictEqual( null, matcher.getMatch(), "Unable to negatively identify single string match when given string comes after match" );
	test.done();
};

suite.singleStringNegativeMatchShorterLength = function( test ) {
	var matcher = new Matcher( [ "abcde" ] );

	matcher.matchString( "abcd" );
	
	test.strictEqual( null, matcher.getMatch(), "Unable to negatively identify single string match of shorter length" );
	test.done();
};

suite.singleStringNegativeMatchLongerLength = function( test ) {
	var matcher = new Matcher( [ "abcde" ] );

	matcher.matchString( "abcd" );
	
	test.strictEqual( null, matcher.getMatch(), "Unable to negatively identify single string match of longer length" );
	test.done();
};

suite.multipleStringPositiveMatch = function( test ) {
	var matcher = new Matcher( [ "abcde", "bcdef", "cdefg" ] );

	matcher.matchString( "bcdef" );

	test.strictEqual( "bcdef", matcher.getMatch(), "Unable to positively identify multiple string match" );
	test.done();
};

suite.multipleStringPositiveMatchFirstString = function( test ) {
	var matcher = new Matcher( [ "abcde", "bcdef", "cdefg" ] );

	matcher.matchString( "abcde" );

	test.strictEqual( "abcde", matcher.getMatch(), "Unable to positively identify multiple string match when the matching string is the first given" );
	test.done();
};

suite.multipleStringPositiveMatchLastString = function( test ) {
	var matcher = new Matcher( [ "abcde", "bcdef", "cdefg" ] );

	matcher.matchString( "cdefg" );

	test.strictEqual( "cdefg", matcher.getMatch(), "Unable to positively identify multiple string match when the matching string is the last given" );
	test.done();
};

suite.multipleStringPositiveMatchLongerPossibleStrings = function( test ) {
	var matcher = new Matcher( [ "abcde", "abcdef", "abcdefg" ] );

	matcher.matchString( "abcde" );

	test.strictEqual( "abcde", matcher.getMatch(), "Unable to positively identify multiple string match with possible longer matches" );
	test.done();
};

suite.multipleStringPositiveMatchShorterPossibleStrings = function( test ) {
	var matcher = new Matcher( [ "abcde", "abcdef", "abcdefg" ] );

	matcher.matchString( "abcdef" );

	test.strictEqual( "abcdef", matcher.getMatch(), "Unable to positively identify multiple string match with possible longer matches" );
	test.done();
};

suite.multipleStringNegativeMatch = function( test ) {
	var matcher = new Matcher( [ "abcde", "bcdef", "cdefg" ] );
	
	matcher.matchString( "defgh" );
	
	test.strictEqual( null, matcher.getMatch(), "Unable to negatively identify multiple string match" );
	test.done();
};

suite.multipleStringNegativeMatchCharacterInBetween = function( test ) {
	var matcher = new Matcher( [ "abcde", "cdefg" ] );

	matcher.matchString( "bcdef" );

	test.strictEqual( null, matcher.getMatch(), "Unable to negatively identify multiple string match when a desired character is in between possibilities" );
	test.done();
};

suite.multipleStringPositiveMatchAfterReset = function( test ) {
	var matcher = new Matcher( [ "abcde", "bcdef", "cdefg" ] );

	matcher.matchString( "bcdef" );
	
	matcher.reset();
	
	matcher.matchString( "cdefg" );

	test.strictEqual( "cdefg", matcher.getMatch(), "Unable to positively identify multiple string match after reset" );
	test.done();
};

suite.multipleStringNegativeMatchCharacterInBetween = function( test ) {
	var matcher = new Matcher( [ 'j', 'k', 'kaic', 'kcdpy' ], false, true );

	matcher.matchString( "kaic" );

	test.strictEqual( "kaic", matcher.getMatch(), "Unable to negatively identify multiple string match when a desired character is in between possibilities" );
	test.done();
};

suite.multipleStringNegativeMatchCharacterInBetween2 = function( test ) {
	var matcher = new Matcher( [ 'j', 'j', 'j', 'j', 'j', 'jc', 'jm', 'jp', 'juo', 'jws' ], false, true );

	matcher.matchString( "jc" );

	test.strictEqual( "jc", matcher.getMatch(), "Unable to negatively identify multiple string match when a desired character is in between possibilities" );
	test.done();
};

/* 
 * The following brute force tests can be used to help find the weird edge
 * cases that can be hit while screwing with the binary search code.
 * Need to redesign these to help pinpoint these edge cases and write real
 * tests for them.
 */

// setup for the brute force tests

function randCharCode() {
	return 97 + Math.random() * 26 |0;
}

const maxTestStringLength = 2;
const numTestStrings = 512;
const numTestRuns = 2048;

let testString = new Array( numTestStrings );
for( let i = 0; i < numTestStrings; i++ ) {
	testString[i] = new Buffer( maxTestStringLength );
	for( let j = 0; j < maxTestStringLength; j++ ) {
		testString[i][j] = randCharCode();
	}
}

let testString2 = new Array( numTestStrings );
let length;
for( let i = 0; i < numTestStrings; i++ ) {
	length = Math.random() * maxTestStringLength + 1 |0;

	testString2[i] = new Buffer( length );
	for( let j = 0; j < length; j++ ) {
		testString2[i][j] = randCharCode();
	}
}

testString.sort( Buffer.compare );
testString2.sort( Buffer.compare );

suite.bruteForcePositiveMatchSameLength = function( test ) {
	var lin = new Matcher( testString, true, false );
	var log = new Matcher( testString, true, true );

	for( var j = 0; j < numTestRuns; j++ ) {
		var stringIndex = Math.random() * numTestStrings |0;
		var string = testString[stringIndex];

		for( var i = 0; i < string.length; i++ ) {
			lin.matchCharCode( string[i] );
			log.matchCharCode( string[i] );

			if( lin.head !== log.head || lin.tail !== log.tail ) {
				console.log( '\n\n\nCHARACTER #' + i + ': ' + String.fromCharCode(string[i]) );
				logMatchers( lin, log );
				test.fail();
				return;
			}
		}

		var linMatch = lin.getMatch(),
			logMatch = log.getMatch();

		if( linMatch !== logMatch ) {
			console.log( '\n\n\nSTRING' + linMatch + ' !== ' + logMatch );
			logMatchers(lin, log);
			test.fail();
			return;
		}

		//test.strictEqual( linMatch, logMatch, "Unable to positively identify with brute force" );

		lin.reset();
		log.reset();
	}
	test.done();
};

suite.bruteForcePositiveMatch = function( test ) {
	var lin = new Matcher( testString2, true, false );
	var log = new Matcher( testString2, true, true );

	for( var j = 0; j < numTestRuns; j++ ) {
		var stringIndex = Math.random() * numTestStrings |0;
		var string = testString2[stringIndex];
		
		for( var i = 0; i < string.length; i++ ) {
			lin.matchCharCode( string[i] );
			log.matchCharCode( string[i] );
			
			if( lin.head !== log.head || lin.tail !== log.tail ) {
				console.log( '\n\n\nCHARACTER #' + i + ': ' + String.fromCharCode(string[i]) );
				logMatchers( lin, log );
				test.fail();
				return;
			}
		}

		var linMatch = lin.getMatch(),
			logMatch = log.getMatch();

		if( linMatch !== logMatch ) {
			console.log( '\n\n\nSTRING' + linMatch + ' !== ' + logMatch );
			logMatchers(lin, log);
			test.fail();
			return;
		}

		test.strictEqual( linMatch, logMatch, "Unable to positively identify with brute force" );

		lin.reset();
		log.reset();
	}
	test.done();
	console.log('done');
};

// helpers for the brute force tests

function logMatchers( lin, log ) {
	var testString = lin.matches;
	for( var i = 0; i < numTestStrings; i++ ) {
		testString[i] = testString[i].toString();
	}
	//lin.matches = testString.slice(lin.head,lin.tail);
	//log.matches = testString.slice(log.head,log.tail);
	delete lin.matches;
	delete log.matches;
	delete lin.useLog;
	delete log.useLog;
	delete lin.isBufferEncoded;
	delete log.isBufferEncoded;
	delete lin.charIndex;
	delete log.charIndex;
	console.log(testString.slice(Math.min(lin.head, log.head),Math.max( lin.tail, log.tail)));
	console.log(JSON.stringify(lin));
	console.log(JSON.stringify(log));
	console.log( '\n\n' );
}
