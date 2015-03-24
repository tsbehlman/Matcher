"use strict";

const Suite = require( 'benchmark' ).Suite;
const v8 = require( 'v8-natives' );

const Matcher = require( './index' );
//const ASMMatcher = require( './msweet' );

function randCharCode() {
	return 97 + Math.random() * 26 >>> 0;
}

const maxTestStringLength = 16;
const numTestStrings = 1024;

let testString = new Array( numTestStrings );
let length;
for( let i = 0; i < numTestStrings; i++ ) {
	length = Math.random() * maxTestStringLength + 1 >>> 0;
	
	testString[i] = new Buffer( length );
	for( let j = 0; j < length; j++ ) {
		testString[i][j] = randCharCode();
	}
}

testString.sort( Buffer.compare );

const suite = new Suite();

suite
/*.add( 'ASMMatcher#singleStringMatch', function() {
	var stringIndex = Math.random() * numTestStrings >>> 0;
	var matcher = new ASMMatcher( [ testString[ stringIndex ] ], true );

	matcher.matchBuffer( testString[ stringIndex ] );

	matcher.getMatchIndex();
} )
.add( 'ASMMatcher#multipleStringMatch', function() {
	var matcher = new ASMMatcher( testString, true );

	matcher.matchBuffer( testString[ Math.random() * numTestStrings >>> 0 ] );

	matcher.getMatchIndex();
} )*/

.add( 'Matcher#singleStringMatch', function() {
	var stringIndex = Math.random() * numTestStrings >>> 0;
	var matcher = new Matcher( [ testString[ stringIndex ] ], true );
	
	matcher.matchBuffer( testString[ stringIndex ] );
	
	matcher.getMatchIndex();
} )
.add( 'Matcher#multipleStringMatch', function() {
	var matcher = new Matcher( testString, true );
	
	matcher.matchBuffer( testString[ Math.random() * numTestStrings >>> 0 ] );
	
	matcher.getMatchIndex();
} )


/*.add( 'Matcher#', function() {
	
} )*/

.on( 'cycle', function( event ) {
	console.log( String( event.target ) );
} )

.run( { 'async': false } );

function printStatus( fn, that, args, name, str1, str2 ) {
	str1 = str1 === undefined ? "is" : str1;
	str2 = str2 === undefined ? "" : str2;
	switch( v8.getOptimizationStatus( fn ) ) {
		case 1:
			console.log( name + " " + str1 + " " + str2 + "optimized" );
			break;
		case 2:
			console.log( name + " " + str1 + " not " + str2 + "optimized" );
			//if( that !== null ) {
				v8.optimizeFunctionOnNextCall( fn );
				fn.apply( that, args );
				printStatus( fn, that, args, name, "can", "be " );
			//}
			break;
	}
}

var matcher = new Matcher( ["test"] );
printStatus( Matcher, matcher, [["test"]], "Matcher" );
printStatus( Matcher.prototype.matchCharCode, matcher, [116], "matchCharCode" );
printStatus( Matcher.prototype.matchBuffer, matcher, [new Buffer("est")], "matchBuffer" );
printStatus( Matcher.prototype.getMatchIndex, matcher, [], "getMatchIndex" );
