'use strict'

//node dependencies
var request = require('request');

// event names
const callbackOperation="callbackOperation"

// global event emitter
var global;

//variables
var callbackRouter;
var url;

//request headers constant
const headers     = {
                    'User-Agent':'Super Agent/0.0.1',
                    'Content-Type':'application/json'
                }

// function to instantiate
function init(globalEmitter,globalCall,callback,commonUrl){
    globalEmitter.on(globalCall,setup)
    global=globalEmitter;
    callbackRouter=callback;
    url=commonUrl;
}

//function to setup model's event listener
function setup(model)
{
    model.once("guardService",accessGuard);
}

//function to filter the request operation
function accessGuard(model){
    switch(model.req.body.operation){
            
        case "create"       :   model.url=url+'/user/create/'
                                callGuard(model);
                                break;
        case "read"         :   model.url=url+'/user/read/'
                                callGuard(model);
                                break;
        case "update"       :   model.url=url+'/user/update/'
                                callGuard(model);
                                break;
        case "delete"       :   model.url=url+'/user/delete/'
                                callGuard(model);
                                break;
        default             :   model.info="Valid operations are create, read, update and delete"
                                global.emit(callbackRouter,model)
                                break;
    }
   
}

//function to make a request to the Guard Api
function callGuard(model){
    
     var options     = {
                            url     : model.url,
                            method  : 'POST',
                            headers : headers,
                            body    : JSON.stringify(model.req.body.data)
                    }
     
    request(options, function (error, response, body){
        
             if (body){
                 try{
                    model.info=JSON.parse(body);
                 }
                 catch(err){
                     model.info={error:err,
                                place:"Common Access Module Guard"}
                 }
            }
            else if(response){
                    model.info={error:response,
                                place:"Common Access Gaurd"}
            }
            else if(error){
                    model.info={error:error,
                                place:"Common Access Gaurd"}
            }
            else{
                    model.info={error:"Error in Common Access [The Guard] : Common Access"};
            }
            console.log(model.info+"CA Guard body")
        
            global.emit(callbackRouter,model)
        }) 
}


//exports
module.exports.init=init;