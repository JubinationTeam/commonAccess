'use strict'

//node dependencies
var request = require('request');

// event names
const callbackOperation="callbackOperation"

// global event emitter
var global;

//variables
var callbackRouter;
var commonUrl;

//request headers constant
const headers     = {
                    'User-Agent':'Super Agent/0.0.1',
                    'Content-Type':'application/json'
                }

// function to instantiate
function init(globalEmitter,globalCall,callback,url){
    globalEmitter.on(globalCall,setup)
    global=globalEmitter;
    callbackRouter=callback;
    commonUrl=url
}

//function to setup model's event listener
function setup(model)
{
    model.once("userAccountService",userAccountFactory);
}
 
//function to create new 'userAccountCall' function for each model
function userAccountFactory(model){
    new userAccountCall(model)
}

//function to make a call to the User Account Api
function userAccountCall(model){
    
    console.log("IM IN USER ACC SERVICE COMMON ACCESS")
    
    var options     = {
                            url     : commonUrl,
                            method  : 'POST',
                            headers : headers,
                            body    : JSON.stringify(model.req.body.data)
                    }
    //console.log(model.req.body.operation)
    //console.log(JSON.stringify(model.req.body.data))
    
    request(options, function (error, response, body){
        
             if (body){
                     try{
                        model.info=JSON.parse(body)
                        console.log(JSON.stringify(JSON.parse(body))+"+++++++++")
                    }
                    catch(err){
                        model.info={error:err}
                    }
            }
            else if(response){
                    model.info={error:response,
                                place:"Common Access User Account : Response"}
                    global.emit(callbackRouter,model)
            }
            else if(error){
                    model.info={error:error,
                                place:"Common Access User Account : Error"}
                    global.emit(callbackRouter,model)
            }      
            else{
                    model.info={error:"Error in Common Access [User Account] : Common Access"};
                    global.emit(callbackRouter,model)
            }
        
        if(model.info){
            console.log(model.info)
        }
        
        }) 
}

//exports
module.exports.init=init;