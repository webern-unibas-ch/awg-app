(function (angular) {

/*
                    jQuery-plugin template for SALSAH
                        converts the linear standoff
                     of SALSAH richtext values to HTML

                     by Lukas Rosenthaler & Tobias Schweizer
*/
/*
		      modified as ANGULAR Plugin (2015) by Stefan Münnich
*/

    /**
     * This function converts a linear character stream with offset properties to a HTML-representation
     * @param assigned_props The object representing the text's properties
     * @param txt The text (sequence of characters)
     * @return {String} A string which can be converted to HTML
    */
    return convert_lin2html = function (assigned_props, txt) {
    		var html = '';
    		var proparr;
    		var stack;
    		var pos;
    		var tmp;
    		var tmpstack;
    		var propname;
    		var idx;
    		var i, j;
    		var lbstack;

            var tagPrecedence = {
                p: 0,
                h1: 0,
                h2: 0,
                h3: 0,
                h4: 0,
                h5: 0,
                h6: 0,
                ol: 0,
                ul: 0,
                li: 1,
                a: 2,
                strong: 3,
                u: 3,
                s: 3,
                em: 3,
                span: 3,
                sup: 3,
                sub: 3
            };

            var localdata = {};
            localdata.settings = { // any initializations come here
                utf8str: '',
                textattr: {},
                css: {
                    width: '100%',
                    minHeight: '30px'
                },
                matching: { // match tagnames to offset labels
                    strong: 'bold',
                    u: 'underline',
                    s: 'strikethrough',
                    em: 'italic',
                    'a': '_link',
                    h1: 'h1',
                    h2: 'h2',
                    h3: 'h3',
                    h4: 'h4',
                    h5: 'h5',
                    h6: 'h6',
                    ol: 'ol',
                    ul: 'ul',
                    li: 'li',
                    span: 'style',
                    p: 'p',
                    sup: 'sup',
                    sub: 'sub'
                }
            };

    		// invert matching so that we can check for the offset names
    		var matching_inv = {};
    		for (var prop in localdata.settings.matching) {
    			matching_inv[localdata.settings.matching[prop]] = prop;
    		}

    		//
    		// sort keys (propnames) according to tag precedence
    		//
    		var propnames = Object.keys(assigned_props);

    		propnames.sort(function(a, b) {
    			return (tagPrecedence[matching_inv[a]] - tagPrecedence[matching_inv[b]]);
    		});

    		//
    		// register props (their starting and ending point) for each position in the text
    		//
    		proparr = [];
    		for (propname in propnames) {
    			// process propname by propname in the defined order (tag precedence)
    			propname = propnames[propname]; // propname is numeric (array index), get the prop's name (string)
    			for(idx in assigned_props[propname]) {
    				// process the array of assigned objects for this propname
    				pos = assigned_props[propname][idx].start;

    				if (proparr[pos] === undefined) {
    					proparr[pos] = [];
    				}
    				proparr[pos].push({
    					propname: propname,
    					proptype: 'start'
    				});

    				if (proparr[pos][proparr[pos].length - 1].propname == '_link') {
    					proparr[pos][proparr[pos].length - 1].href = assigned_props[propname][idx].href; // add href to link property
    					if (assigned_props[propname][idx].resid !== undefined) {
    						proparr[pos][proparr[pos].length - 1].resid = assigned_props[propname][idx].resid; // add resid to link property
    					}
    				} else if (proparr[pos][proparr[pos].length - 1].propname == 'style') {
    					proparr[pos][proparr[pos].length - 1].css = assigned_props[propname][idx].css; // add style
    				}

    				pos = assigned_props[propname][idx].end;

    				if (proparr[pos] === undefined) {
    					proparr[pos] = [];
    				}
    				proparr[pos].push({
    					propname: propname,
    					proptype: 'end'
    				});
    			} //END for idx
    		} //END for propname

    		//
    		// go through the single chars of the text and create html tags according to proparr
    		//
    		stack = [];
    		for (i = 0; i <= txt.length; i++) {
    			if (proparr[i] !== undefined) {
    				// there is an entry in proparr for the current pos
    				tmpstack = [];
    				lbstack = [];
    				for (j = proparr[i].length - 1; j >= 0; j--) {
    					// go through the array from back to front (it is a stack!!)
    					// tags which have been opened later (lower precedence -> order in proparr[position]) have to be closed first
    					// because no overlap is allowed
    					if (proparr[i][j].proptype == 'end' && proparr[i][j].propname != 'linebreak') {
    						while ((tmp = stack.pop()) !== undefined) {
    							// close tag
    							html += '</' + matching_inv[tmp] + '>';
    							if (tmp == proparr[i][j].propname) {
    								// tag ends here
    								break; // leave while loop;
    							} else {
    								// tag had only to be closed temporarily
    								tmpstack.push(tmp);
    							}
    						}
    						while ((tmp = tmpstack.pop()) !== undefined) {
    							stack.push(tmp);
    							// reopen previously closed tags
    							html += '<' + matching_inv[tmp] + '>';
    						}
    					} //END if
    				} //END for j
    				for (j in proparr[i]) {
    					// open tags here (according to tag precedence sorting)
    					// add them to the stack -> the higher the index in the stack, the lower the precedence
    					// or the tag has been added at another position (later)
    					if (proparr[i][j].proptype == 'start') {
    						if (proparr[i][j].propname == 'linebreak') { // only due to backwards compatibility
    							html += '<br/>';
    						} else if (proparr[i][j].propname == '_link') {
    							stack.push(proparr[i][j].propname);
    							// create an anchor tag with href
    							var href = proparr[i][j].href;
    							if (href === undefined && proparr[i][j].resid !== undefined) {
    								// backwards compatibility
    								// before, no href was set
    								href = 'http://www.salsah.org/api/resources/' + proparr[i][j].resid;
    							}
    							html += '<' + matching_inv[proparr[i][j].propname] + ' href="' + href;
    							if (proparr[i][j].resid !== undefined) {
    								html += '" class="salsah-link">';
    							} else {
    								html += '">';
    							}
    						} else if (proparr[i][j].propname == 'style') {
    							stack.push(proparr[i][j].propname);
    							html += '<' + matching_inv[proparr[i][j].propname] + ' style="' + proparr[i][j].css + '">';

    						}
    						else {
    							stack.push(proparr[i][j].propname);
    							html += '<' + matching_inv[proparr[i][j].propname] + '>';
    						} //END if elseif else
    					} //END if
    				} // END for j

    			} //END if
    			if (i < txt.length) {
    				html += txt.charAt(i);
    			}
    		} //END for i

    		// replace '\n' with <br>
    		html = html.replace(/\n/g, '<br/>');
    		// remove \r since they are represented by block elements
    		html = html.replace(/\r/g, '');

    		return html;
    	} //END convert_lin2html (func)

}(window.angular));
