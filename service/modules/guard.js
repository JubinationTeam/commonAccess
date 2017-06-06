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
    model.once("guardService",factory);
}
 
function factory(model){
    new accessGuard(model)
}

function accessGuard(model){
    
    var urlSent="";
    
        
    switch(model.req.body.operation){
            
        case "create"       :   urlSent=url+'/user/create/'
                                break;
        case "read"         :   urlSent=url+'/user/read/'
                                break;
        case "update"       :   urlSent=url+'/user/update/'
                                break;
        case "delete"       :   urlSent=url+'/user/delete/'
                                break;
            
        default             :   model.info="Valid operations are create, read, update and delete"
                                model.emit(callbackRouter,model)
                                break;
    }
    
    console.log(urlSent)
    
    var options     = {
                            url     : urlSent,
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
                    model.info={error:response,
                                place:"Common Access Gaurd"}
                    global.emit(callbackRouter,model)
            }
            else if(error){
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