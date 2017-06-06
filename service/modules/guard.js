'use strict'

//node dependencies
var request = require('request');

//user defined dependencies

// event names
const callbackOperation="callbackOperation"

// global event emitter
var global;

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

function setup(model)
{
    model.once("guardService",accessGuard);
}


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
                                model.emit(callbackRouter,model)
                                break;
    }
    
    
   
}


function callGuard(model){
    console.log(model.url+":::::::::::::::::::::::::::::::")
     var options     = {
                            url     : model.url,
                            method  : 'POST',
                            headers : headers,
                            body    : JSON.stringify(model.req.body.data)
                    }
    //console.log(model.req.body.operation)
    //console.log(JSON.stringify(model.req.body.data))
    
    request(options, function (error, response, body){
        
             if (body){
                    model.info=JSON.parse(body);
                    global.emit(callbackRouter,model)
            }
            else if(response){
                     console.log(urlSent+"response")
                    model.info={error:response,
                                place:"Common Access Gaurd"}
                    global.emit(callbackRouter,model)
            }
            else if(error){
                     console.log(urlSent)
                    model.info={error:error,
                                place:"Common Access Gaurd"}
                    global.emit(callbackRouter,model)
            }
            else{
                    model.info={error:"Error in Common Access [The Guard] : Common Access"};
                    global.emit(callbackRouter,model)
            }
        }) 
}


//exports
module.exports.init=init;