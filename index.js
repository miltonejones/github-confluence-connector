const request = require("request");
const core = require('@actions/core');
const github = require('@actions/github');
 
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


  console.log ('payload', github.context.payload)



  const endpoint = core.getInput('endpoint'); 
  const username = core.getInput('username'); 
  const password = core.getInput('password'); 
  const spacekey = core.getInput('spacekey'); 
  const { author, message: pageContent } = github.context.payload.head_commit;
  const pageTitle = `Created by ${author.name}`;

  createConfluencePage({
    pageTitle,
    pageContent,
    endpoint,
    username,
    password,
    spacekey,
  }).then(response => {
    console.log ('success', response);
    const time = (new Date()).toTimeString();
    core.setOutput("message", 'Page created on ' + time);
  });
 
} catch (error) {
  console.log ('payload', github.context.payload)
  core.setFailed(error.message);
}