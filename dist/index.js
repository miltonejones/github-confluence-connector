/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ 450:
/***/ ((module) => {

module.exports = eval("require")("@actions/core");


/***/ }),

/***/ 177:
/***/ ((module) => {

module.exports = eval("require")("@actions/github");


/***/ }),

/***/ 57:
/***/ ((module) => {

module.exports = eval("require")("request");


/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __nccwpck_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		var threw = true;
/******/ 		try {
/******/ 			__webpack_modules__[moduleId](module, module.exports, __nccwpck_require__);
/******/ 			threw = false;
/******/ 		} finally {
/******/ 			if(threw) delete __webpack_module_cache__[moduleId];
/******/ 		}
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/compat */
/******/ 	
/******/ 	if (typeof __nccwpck_require__ !== 'undefined') __nccwpck_require__.ab = __dirname + "/";
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
(() => {
const request = __nccwpck_require__(57);
const core = __nccwpck_require__(450);
const github = __nccwpck_require__(177);
 
const createConfluencePage = ({ spacekey, pageTitle, pageContent, username, password, endpoint }) =>
 new Promise((resolve, reject) => { 
   const url = `https://${endpoint}/wiki/rest/api/content`; 
   const auth = "Basic " + new Buffer(username + ":" + password).toString("base64");
  
   // build Confluence request
   const body = {
    type: "page",
    title: pageTitle,
    space: {
      key: spacekey
    },
    body: {
      wiki: {
        value: pageContent,
        representation: "wiki"
      }
    }
  };

  // send request
  request({
       url,
       method: "POST",
       body: JSON.stringify(body),
       headers: {
         Authorization: auth,
         "Content-Type": "application/json",
       },
     },
     function (error, response, body) {
       if (error) {
         return reject(error);
       }
       resolve(body); 
     }
   );
 });



try { 

  const endpoint = core.getInput('endpoint'); 
  const username = core.getInput('username'); 
  const password = core.getInput('password'); 
  const spacekey = core.getInput('spacekey'); 
  const { payload } = github.context;
  const { author, message: pageContent } = payload.head_commit;
  const time = (new Date()).toTimeString();
  const pageTitle = `Created by ${author.name} on ${time}`;

  console.log ({ payload });

  createConfluencePage({
    pageTitle,
    pageContent,
    endpoint,
    username,
    password,
    spacekey,
  }).then(response => {
    console.log ('success', response);
    core.setOutput("message", 'Page created on ' + time);
  });
 
} catch (error) { 
  core.setFailed(error.message);
}
})();

module.exports = __webpack_exports__;
/******/ })()
;