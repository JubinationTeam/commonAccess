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
    model.once("awsService",awsFactory);
}

function awsFactory(model){
    new awsRequestFunction(model)
}

function awsRequestFunction(model){
    
    var urlSent="";
    
    switch(model.req.body.operation){
            
                case "awsQuery"         :   urlSent=commonUrl;
                                            break;

                default                 :   model.info="Invalid AWS query Oeration Name"
                                            model.emit(callbackRouter,model)
                                            break;
    }
    
    var options  = {            url     : url,
                                method  : 'POST',
                                headers : headers,
                                body    : JSON.stringify(model.req.body.data)
                    }

    request(options, function (error, response, body){
            if (body){
                    model.info=JSON.parse(body);
                    global.emit(callbackRouter,model)
            }
            else if(response){
                    model.info={error:response,
                                place:"Common Access Module AWS"}
                    global.emit(callbackRouter,model)
            }
            else if(error){
                    model.info={error:error,
                                place:"Common Access Module AWS"}
                    global.emit(callbackRouter,model)
            }
            else{
                    model.info={error:"Error in Common Access [Module : AWS]  : Common Access"};
                    global.emit(callbackRouter,model)
            }
        })
    
}

//exports
module.exports.init=init;