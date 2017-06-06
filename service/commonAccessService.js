'use strict'

//node dependencies
var request = require('request');

//user defined dependencies

// event names
const callbackOperation="callbackOperation"

// global event emitter
var global;

var callbackRouter;

//request headers constant
const headers     = {
                    'User-Agent':'Super Agent/0.0.1',
                    'Content-Type':'application/json'
                }

// function to instantiate
function init(globalEmitter,globalCall,callback){
    globalEmitter.on(globalCall,setup)
    global=globalEmitter;
    callbackRouter=callback;
}

function setup(model)
{
    model.once("service",filterModuleAccessRequest);
}

function filterModuleAccessRequest(model){
    switch(model.req.body.mod)
            {
                case "guard"        :   global.emit("guard",model)
                                        model.emit("guardService",model)
                                        break;

                case "vendor"       :   global.emit("vendor",model)
                                        model.emit("vendorService",model)
                                        break;
                                
                case "aws"          :   global.emit("aws",model)
                                        model.emit("awsService",model)
                                        break;
            
                case "parser"       :   global.emit("parser",model)
                                        model.emit("parserService",model)
                                        console.log("IM IN PARSER")
                                        break;
            
                case "userAccount"  :   global.emit("userAccount",model)
                                        model.emit("userAccountService",model)
                                        break;
            
                default             :   model.info={error:"Invalid Module Name - "+model.req.body.mod+": Common Access"}
                                        global.emit(callbackRouter,model)
                                        break;
            }
    
}

//exports
module.exports.init=init;