"use strict";

const Suite = require( 'benchmark' ).Suite;

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
