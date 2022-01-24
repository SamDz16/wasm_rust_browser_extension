// ##################################################################################################################################################################### //
// WASM SECTION - LOAD WASM

let wasm;

const heap = new Array(32).fill(undefined);

heap.push(undefined, null, true, false);

function getObject(idx) { return heap[idx]; }

let heap_next = heap.length;

function dropObject(idx) {
    if (idx < 36) return;
    heap[idx] = heap_next;
    heap_next = idx;
}

function takeObject(idx) {
    const ret = getObject(idx);
    dropObject(idx);
    return ret;
}

let cachedTextDecoder = new TextDecoder('utf-8', { ignoreBOM: true, fatal: true });

cachedTextDecoder.decode();

let cachegetUint8Memory0 = null;
function getUint8Memory0() {
    if (cachegetUint8Memory0 === null || cachegetUint8Memory0.buffer !== wasm.memory.buffer) {
        cachegetUint8Memory0 = new Uint8Array(wasm.memory.buffer);
    }
    return cachegetUint8Memory0;
}

function getStringFromWasm0(ptr, len) {
    return cachedTextDecoder.decode(getUint8Memory0().subarray(ptr, ptr + len));
}

function addHeapObject(obj) {
    if (heap_next === heap.length) heap.push(heap.length + 1);
    const idx = heap_next;
    heap_next = heap[idx];

    heap[idx] = obj;
    return idx;
}

let WASM_VECTOR_LEN = 0;

let cachedTextEncoder = new TextEncoder('utf-8');

const encodeString = (typeof cachedTextEncoder.encodeInto === 'function'
    ? function (arg, view) {
    return cachedTextEncoder.encodeInto(arg, view);
}
    : function (arg, view) {
    const buf = cachedTextEncoder.encode(arg);
    view.set(buf);
    return {
        read: arg.length,
        written: buf.length
    };
});

function passStringToWasm0(arg, malloc, realloc) {

    if (realloc === undefined) {
        const buf = cachedTextEncoder.encode(arg);
        const ptr = malloc(buf.length);
        getUint8Memory0().subarray(ptr, ptr + buf.length).set(buf);
        WASM_VECTOR_LEN = buf.length;
        return ptr;
    }

    let len = arg.length;
    let ptr = malloc(len);

    const mem = getUint8Memory0();

    let offset = 0;

    for (; offset < len; offset++) {
        const code = arg.charCodeAt(offset);
        if (code > 0x7F) break;
        mem[ptr + offset] = code;
    }

    if (offset !== len) {
        if (offset !== 0) {
            arg = arg.slice(offset);
        }
        ptr = realloc(ptr, len, len = offset + arg.length * 3);
        const view = getUint8Memory0().subarray(ptr + offset, ptr + len);
        const ret = encodeString(arg, view);

        offset += ret.written;
    }

    WASM_VECTOR_LEN = offset;
    return ptr;
}

let cachegetInt32Memory0 = null;
function getInt32Memory0() {
    if (cachegetInt32Memory0 === null || cachegetInt32Memory0.buffer !== wasm.memory.buffer) {
        cachegetInt32Memory0 = new Int32Array(wasm.memory.buffer);
    }
    return cachegetInt32Memory0;
}

function debugString(val) {
    // primitive types
    const type = typeof val;
    if (type == 'number' || type == 'boolean' || val == null) {
        return  `${val}`;
    }
    if (type == 'string') {
        return `"${val}"`;
    }
    if (type == 'symbol') {
        const description = val.description;
        if (description == null) {
            return 'Symbol';
        } else {
            return `Symbol(${description})`;
        }
    }
    if (type == 'function') {
        const name = val.name;
        if (typeof name == 'string' && name.length > 0) {
            return `Function(${name})`;
        } else {
            return 'Function';
        }
    }
    // objects
    if (Array.isArray(val)) {
        const length = val.length;
        let debug = '[';
        if (length > 0) {
            debug += debugString(val[0]);
        }
        for(let i = 1; i < length; i++) {
            debug += ', ' + debugString(val[i]);
        }
        debug += ']';
        return debug;
    }
    // Test for built-in
    const builtInMatches = /\[object ([^\]]+)\]/.exec(toString.call(val));
    let className;
    if (builtInMatches.length > 1) {
        className = builtInMatches[1];
    } else {
        // Failed to match the standard '[object ClassName]'
        return toString.call(val);
    }
    if (className == 'Object') {
        // we're a user defined class or Object
        // JSON.stringify avoids problems with cycles, and is generally much
        // easier than looping through ownProperties of `val`.
        try {
            return 'Object(' + JSON.stringify(val) + ')';
        } catch (_) {
            return 'Object';
        }
    }
    // errors
    if (val instanceof Error) {
        return `${val.name}: ${val.message}\n${val.stack}`;
    }
    // TODO we could test for more things here, like `Set`s and `Map`s.
    return className;
}

function makeMutClosure(arg0, arg1, dtor, f) {
    const state = { a: arg0, b: arg1, cnt: 1, dtor };
    const real = (...args) => {
        // First up with a closure we increment the internal reference
        // count. This ensures that the Rust closure environment won't
        // be deallocated while we're invoking it.
        state.cnt++;
        const a = state.a;
        state.a = 0;
        try {
            return f(a, state.b, ...args);
        } finally {
            if (--state.cnt === 0) {
                wasm.__wbindgen_export_2.get(state.dtor)(a, state.b);

            } else {
                state.a = a;
            }
        }
    };
    real.original = state;

    return real;
}
function __wbg_adapter_20(arg0, arg1, arg2) {
    wasm._dyn_core__ops__function__FnMut__A____Output___R_as_wasm_bindgen__closure__WasmClosure___describe__invoke__h0aede5e4f49ef57a(arg0, arg1, addHeapObject(arg2));
}

/**
* @param {string} str
* @returns {string}
*/
function get_string(str) {
    try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        var ptr0 = passStringToWasm0(str, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        var len0 = WASM_VECTOR_LEN;
        wasm.get_string(retptr, ptr0, len0);
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        return getStringFromWasm0(r0, r1);
    } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
        wasm.__wbindgen_free(r0, r1);
    }
}

/**
* @param {number} num
* @returns {number}
*/
function get_num(num) {
    var ret = wasm.get_num(num);
    return ret;
}

/**
* @param {string} url_endpoint
* @param {string} query_body
* @returns {Promise<any>}
*/
function get_data(url_endpoint, query_body) {
    var ptr0 = passStringToWasm0(url_endpoint, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
    var len0 = WASM_VECTOR_LEN;
    var ptr1 = passStringToWasm0(query_body, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
    var len1 = WASM_VECTOR_LEN;
    var ret = wasm.get_data(ptr0, len0, ptr1, len1);
    return takeObject(ret);
}

function handleError(f, args) {
    try {
        return f.apply(this, args);
    } catch (e) {
        wasm.__wbindgen_exn_store(addHeapObject(e));
    }
}
function __wbg_adapter_42(arg0, arg1, arg2, arg3) {
    wasm.wasm_bindgen__convert__closures__invoke2_mut__h2a81007e7cb2b989(arg0, arg1, addHeapObject(arg2), addHeapObject(arg3));
}

async function load(module, imports) {
    if (typeof Response === 'function' && module instanceof Response) {
        if (typeof WebAssembly.instantiateStreaming === 'function') {
            try {
                return await WebAssembly.instantiateStreaming(module, imports);

            } catch (e) {
                if (module.headers.get('Content-Type') != 'application/wasm') {
                    console.warn("`WebAssembly.instantiateStreaming` failed because your server does not serve wasm with `application/wasm` MIME type. Falling back to `WebAssembly.instantiate` which is slower. Original error:\n", e);

                } else {
                    throw e;
                }
            }
        }

        const bytes = await module.arrayBuffer();
        return await WebAssembly.instantiate(bytes, imports);

    } else {
        const instance = await WebAssembly.instantiate(module, imports);

        if (instance instanceof WebAssembly.Instance) {
            return { instance, module };

        } else {
            return instance;
        }
    }
}

async function init(input) {
    // if (typeof input === 'undefined') {
    //     input = new URL('rust_project_bg.wasm', import.meta.url);
    // }
    const imports = {};
    imports.wbg = {};
    imports.wbg.__wbindgen_object_drop_ref = function(arg0) {
        takeObject(arg0);
    };
    imports.wbg.__wbindgen_json_parse = function(arg0, arg1) {
        var ret = JSON.parse(getStringFromWasm0(arg0, arg1));
        return addHeapObject(ret);
    };
    imports.wbg.__wbindgen_json_serialize = function(arg0, arg1) {
        const obj = getObject(arg1);
        var ret = JSON.stringify(obj === undefined ? null : obj);
        var ptr0 = passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        var len0 = WASM_VECTOR_LEN;
        getInt32Memory0()[arg0 / 4 + 1] = len0;
        getInt32Memory0()[arg0 / 4 + 0] = ptr0;
    };
    imports.wbg.__wbg_instanceof_Window_434ce1849eb4e0fc = function(arg0) {
        var ret = getObject(arg0) instanceof Window;
        return ret;
    };
    imports.wbg.__wbg_newwithstrandinit_c07f0662ece15bc6 = function() { return handleError(function (arg0, arg1, arg2) {
        var ret = new Request(getStringFromWasm0(arg0, arg1), getObject(arg2));
        return addHeapObject(ret);
    }, arguments) };
    imports.wbg.__wbg_fetch_427498e0ccea81f4 = function(arg0, arg1) {
        var ret = getObject(arg0).fetch(getObject(arg1));
        return addHeapObject(ret);
    };
    imports.wbg.__wbg_instanceof_Response_ea36d565358a42f7 = function(arg0) {
        var ret = getObject(arg0) instanceof Response;
        return ret;
    };
    imports.wbg.__wbg_json_4ab99130d1a5b3a9 = function() { return handleError(function (arg0) {
        var ret = getObject(arg0).json();
        return addHeapObject(ret);
    }, arguments) };
    imports.wbg.__wbindgen_string_new = function(arg0, arg1) {
        var ret = getStringFromWasm0(arg0, arg1);
        return addHeapObject(ret);
    };
    imports.wbg.__wbindgen_object_clone_ref = function(arg0) {
        var ret = getObject(arg0);
        return addHeapObject(ret);
    };
    imports.wbg.__wbindgen_cb_drop = function(arg0) {
        const obj = takeObject(arg0).original;
        if (obj.cnt-- == 1) {
            obj.a = 0;
            return true;
        }
        var ret = false;
        return ret;
    };
    imports.wbg.__wbg_newnoargs_f579424187aa1717 = function(arg0, arg1) {
        var ret = new Function(getStringFromWasm0(arg0, arg1));
        return addHeapObject(ret);
    };
    imports.wbg.__wbg_call_89558c3e96703ca1 = function() { return handleError(function (arg0, arg1) {
        var ret = getObject(arg0).call(getObject(arg1));
        return addHeapObject(ret);
    }, arguments) };
    imports.wbg.__wbg_new_d3138911a89329b0 = function() {
        var ret = new Object();
        return addHeapObject(ret);
    };
    imports.wbg.__wbg_call_94697a95cb7e239c = function() { return handleError(function (arg0, arg1, arg2) {
        var ret = getObject(arg0).call(getObject(arg1), getObject(arg2));
        return addHeapObject(ret);
    }, arguments) };
    imports.wbg.__wbg_new_4beacc9c71572250 = function(arg0, arg1) {
        try {
            var state0 = {a: arg0, b: arg1};
            var cb0 = (arg0, arg1) => {
                const a = state0.a;
                state0.a = 0;
                try {
                    return __wbg_adapter_42(a, state0.b, arg0, arg1);
                } finally {
                    state0.a = a;
                }
            };
            var ret = new Promise(cb0);
            return addHeapObject(ret);
        } finally {
            state0.a = state0.b = 0;
        }
    };
    imports.wbg.__wbg_resolve_4f8f547f26b30b27 = function(arg0) {
        var ret = Promise.resolve(getObject(arg0));
        return addHeapObject(ret);
    };
    imports.wbg.__wbg_then_a6860c82b90816ca = function(arg0, arg1) {
        var ret = getObject(arg0).then(getObject(arg1));
        return addHeapObject(ret);
    };
    imports.wbg.__wbg_then_58a04e42527f52c6 = function(arg0, arg1, arg2) {
        var ret = getObject(arg0).then(getObject(arg1), getObject(arg2));
        return addHeapObject(ret);
    };
    imports.wbg.__wbg_self_e23d74ae45fb17d1 = function() { return handleError(function () {
        var ret = self.self;
        return addHeapObject(ret);
    }, arguments) };
    imports.wbg.__wbg_window_b4be7f48b24ac56e = function() { return handleError(function () {
        var ret = window.window;
        return addHeapObject(ret);
    }, arguments) };
    imports.wbg.__wbg_globalThis_d61b1f48a57191ae = function() { return handleError(function () {
        var ret = globalThis.globalThis;
        return addHeapObject(ret);
    }, arguments) };
    imports.wbg.__wbg_global_e7669da72fd7f239 = function() { return handleError(function () {
        var ret = global.global;
        return addHeapObject(ret);
    }, arguments) };
    imports.wbg.__wbindgen_is_undefined = function(arg0) {
        var ret = getObject(arg0) === undefined;
        return ret;
    };
    imports.wbg.__wbg_set_c42875065132a932 = function() { return handleError(function (arg0, arg1, arg2) {
        var ret = Reflect.set(getObject(arg0), getObject(arg1), getObject(arg2));
        return ret;
    }, arguments) };
    imports.wbg.__wbindgen_debug_string = function(arg0, arg1) {
        var ret = debugString(getObject(arg1));
        var ptr0 = passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        var len0 = WASM_VECTOR_LEN;
        getInt32Memory0()[arg0 / 4 + 1] = len0;
        getInt32Memory0()[arg0 / 4 + 0] = ptr0;
    };
    imports.wbg.__wbindgen_throw = function(arg0, arg1) {
        throw new Error(getStringFromWasm0(arg0, arg1));
    };
    imports.wbg.__wbindgen_closure_wrapper561 = function(arg0, arg1, arg2) {
        var ret = makeMutClosure(arg0, arg1, 51, __wbg_adapter_20);
        return addHeapObject(ret);
    };

    if (typeof input === 'string' || (typeof Request === 'function' && input instanceof Request) || (typeof URL === 'function' && input instanceof URL)) {
        input = fetch(input);
    }



    const { instance, module } = await load(await input, imports);

    wasm = instance.exports;
    init.__wbindgen_wasm_module = module;

    return wasm;
}

// export default init;

(async () => {
    await init("http://localhost:3000/fetch.wasm")
	console.log("Wasm is loaded successully!");
})()

// #################################################################################### PART 1 ################################################################################# //
// Create a div element to contain label and input
const isFailingDiv = document.createElement('div');
// Creat the label element
const isFailingLabel = document.createElement('label');
isFailingLabel.setAttribute('for', 'algo');
isFailingLabel.append('Do you want to use isFailing ?');
isFailingLabel.style.marginLeft = '10px';
// Create the checkbox element
const isFailingInput = document.createElement('input');
isFailingInput.setAttribute('type', 'checkbox');
isFailingInput.setAttribute('id', 'algo');
isFailingInput.setAttribute('name', 'algo');
// Apprnd the two elements to the div element
isFailingDiv.append(isFailingInput, isFailingLabel);
// Grab the Execute Query Button from "https://dbpedia.org/sparql"
const executeQuery = document.querySelector('#run');
// And then append the div element right before the execute query button
executeQuery.insertAdjacentElement('beforeBegin', isFailingDiv);

// #################################################################################### PART 2 ################################################################################# //
let resultsInput = document.createElement('input');
let rootDiv = document.createElement('div');
const sparqlForm = document.querySelector('#sparql_form');

// Create a global variable to hold true or fale in order to know whether a user has thecked the checkbox or not
let luisAlgorithmsChecked = false;
// GET TRIGGERED WHENEVER THE USER CLICKS ON THE 'EXECUTE QUERY' BUTTON
const isFailingAlgorithm = async (e) => {
	e.preventDefault();

	let results = [];
	var isfailing = 0;

	// Grab the results
	let endpoint = 'https://dbpedia.org/sparql';
	// let leoQuery = 'SELECT * WHERE { ?athlete  rdfs:label  "Lionel Messi"@en ; dbo:number  ?number }'
	let query = document.querySelector('#query').value
	try {
		// CALLING THE ISFAILING ALGORITHM
		// isfailing = await isFailing(endpoint, query);

		// CALLING THE EXECUTEQPARQLALGORITHM
		const {results: results_query} = await get_data(endpoint, query);

		// FROM SPARQL RESULTS TO XML
		// const getXMLData = async (response) => {
		// 	const str = await response.text();
		// 	const data = await new window.DOMParser().parseFromString(str, 'text/xml');
		// 	const results = data.getElementsByTagName('uri');
		// 	isfailing = results.length === 0 ? 1 : 0
		// 	return results
		// }
		const {bindings} = results_query
    	// bindings.map(binding => console.log(binding.Concept.value))
		results = bindings

		// // Response is in XML format
		// results = await getXMLData(response)

		isfailing = results.length > 0 ? false : true
		
		// TEST VALE OF ISFAILING
		if (isfailing) {
			// There is no results
			document.querySelector('#options').innerHTML += `<h1 class="text-center text-danger">isFailing returns: <b>${1}</b></h1>`;
		} else {
			// There is at least one result
			document.querySelector('#options').innerHTML += `<h1 class="text-center text-success">isFailing returns: <b>${0}</b></h1>`;
			document.querySelector('#options').innerHTML += ` <p class="text-muted text-center"> <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="20px" viewBox="0 0 66 65" fill="#fff" fill-rule="evenodd" stroke="#000" stroke-linecap="round" stroke-linejoin="round"><use xlink:href="#A" x=".5" y=".5"/><symbol id="A" overflow="visible"><path d="M39.32 0v.345a7.34 7.34 0 0 1-7.338 7.338A7.34 7.34 0 0 1 24.644.345V0H0v64h64V0zm-8.778 57.15l-3.116-15.42h-.054L24 57.15h-4.294L14.84 34.493h4.24l2.902 15.42h.054l3.497-15.42H29.5l3.14 15.6h.054l3.312-15.6h4.163L34.765 57.15zm23.347 0l-1.445-5.043h-7.63l-1.112 5.043h-4.24l5.483-22.657h6.7L58.3 57.15zm-4.607-17.074h-1.784l-1.85 8.314h5.757z" stroke="none" fill="#654ff0" fill-rule="nonzero"/></symbol></svg>  Data Fetched using WebAssembly <b>&#9989;</b></p>`;


			// // Create a div element to contain label and input
			// const resultsDiv = document.createElement('div');
			// // Creat the label element
			// const resultsLabel = document.createElement('label');
			// resultsLabel.setAttribute('for', 'resultsLabel');
			// resultsLabel.append('Do you want to display results ?');
			// resultsLabel.style.marginLeft = '10px';
			// // Create the checkbox element
			// resultsInput.setAttribute('type', 'checkbox');
			// resultsInput.setAttribute('id', 'resultsLabel');
			// resultsInput.setAttribute('name', 'resultsLabel');
			// // Apprnd the two elements to the div element
			// resultsDiv.append(resultsInput, resultsLabel);

			// // And then append the div element right before the execute query button
			// document.querySelector('fieldset').append(resultsDiv);

			// // By default, the results are hidden
			// rootDiv.setAttribute('style', 'display: none');

			// rootDiv.id = 'rootResults';
			// rootDiv.innerHTML = `<h2>Results</h2> <hr>`;
			// rootDiv.classList.add('text-center');

			// const resultDiv = document.createElement('div');
			// rootDiv.append(resultDiv);

			// resultDiv.setAttribute('v-for', 'result in results');
			// resultDiv.innerHTML = `
			// 	<p><a :href=result.textContent>{{ result.textContent }}</a></p>
			// `;
			// document
			// 	.querySelector('#options')
			// 	.insertAdjacentElement('beforebegin', rootDiv);

			// // Create Vue component
			// new Vue({
			// 	el: '#rootResults',
			// 	data: () => {
			// 		return { results };
			// 	},
			// });
			console.log("RESULTS ARE: ", results);

		}
	} catch (err) {
        document.querySelector('#options').innerHTML += `<h1 class="text-center text-danger">isFailing returns: <b>${1}</b></h1>`;

        console.log('HERE IS THE ERRROR', err);
	}
};

// Add event listener to track whether the user would like to use the Luis algorithms or not
// and modify a global variable
isFailingInput.addEventListener('change', () => {

	if (isFailingInput.checked) {
		sparqlForm.addEventListener('submit', isFailingAlgorithm);
	} else {
		sparqlForm.removeEventListener('submit', isFailingAlgorithm, {
			passive: true,
		});
	}
});

resultsInput.addEventListener('change', () => {
	if (resultsInput.checked) {
		document
			.querySelector('#rootResults')
			.setAttribute('style', 'display: block');
	} else {
		document
			.querySelector('#rootResults')
			.setAttribute('style', 'display: none');
	}
});
