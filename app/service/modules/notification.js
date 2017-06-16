  'use strict'

//node dependencies
var request = require('request');

//user defined dependencies

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
    model.once("notificationService",notificationFactory);
}

//function to create new 'notificationFactory' function for each model
function notificationFactory(model){
    new filterNotificationOperation(model)
}

//function to filter Notification Operation type
function filterNotificationOperation(model){
    
    switch(model.req.body.operation){
        case "createSet"    :   model.url=url+'/createSet'
                                makeNotificationRequest(model)
                                break;
            
        default             :   model.info="Invalid Notification Operation Name"
                                global.emit(callbackRouter,model)
                                break;
                            }
    
}

//function to make a request to the 'Notification' api
function makeNotificationRequest(model){
    
    var options  = {            url     : model.url,
                                method  : 'POST',
                                headers : headers,
                                body    : JSON.stringify(model.req.body.data)
                    }

    request(options, function (error, response, body){
            if (body){
                    try{
                        model.info=JSON.parse(body)
                    }
                    catch(err){
                        model.info={error:err,
                                place:"Common Access Module Notification"}
                    }
            }
            else if(response){
                    model.info={error:response,
                                place:"Common Access Module Notification"}
            }
            else if(error){
                    model.info={error:error,
                                place:"Common Access Module Notification"}
            }
            else{
                    model.info={error:"Error in Common Access [Module : Notification]  : Common Access"};
            }
        
            global.emit(callbackRouter,model)
        
        
        })
}

//exports
module.exports.init=init;