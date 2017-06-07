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
    model.once("vendorService",factory);
}

function factory(model){
    new accessVendor(model)
}

function accessVendor(model){
    
    switch(model.req.body.vendor){
                case "thyrocare"    :   global.emit("thyrocare",model)
                                        model.emit("thyrocareService",model)
                                        break;

                default             :   model.info={error:"Invalid Third Party Vendor Name - "+model.req.body.mod+": Common Access"}
                                        model.emit(callbackRouter,model)
                                        break;
    }
    
}

//exports
module.exports.init=init;