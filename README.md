# Matcher

Given a sorted array of candidate strings, matcher can identify which of thse strings, if any, is matched by a query in logarithmic time.  This query may be given character by character or as a full string.

This is useful for performance critical JavaScript applications which seek to avoid the deoptimizations that come with querying an object property by string.

Matcher requires some support for ES6, which is available by default in io.js or as an option when compiling Node from source.

### Example

~~~JavaScript
const Matcher = require( 'Matcher' );

const tagNames = [ "pre", "script", "style" ];

let tagMatcher = new Matcher( tagNames, false );

tagMatcher.matchString( "pre" );
// Also available: matchBuffer, matchCharCode, and matchChar

let matchIndex = tagMatcher.getMatchIndex();
// Also available: getMatch (returns the string or buffer matched)
~~~