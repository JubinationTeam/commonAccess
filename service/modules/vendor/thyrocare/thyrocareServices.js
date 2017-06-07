  'use strict'

//node dependencies
var request = require('request');

//user defined dependencies

// event names
const callbackOperation="callbackOperation"

// global event emitter
var global;

var callbackRouter;

var thyrocareUrl;

//request headers constant
const headers     = {
                    'User-Agent':'Super Agent/0.0.1',
                    'Content-Type':'application/json'
                }

// function to instantiate
function init(globalEmitter,globalCall,callback,thyrocareServiceUrl){
    globalEmitter.on(globalCall,setup)
    global=globalEmitter;
    callbackRouter=callback;
    thyrocareUrl=thyrocareServiceUrl;
}

function setup(model)
{
    model.once("thyrocareService",thyrocareServiceFactory);
}

function thyrocareServiceFactory(model){
    new accessVendor(model)
}

function accessVendor(model){
    
    var urlSent="";
    
    switch(model.req.body.operation){
                case "postOrder"        :   urlSent=thyrocareUrl.postOrder+"/thyrocareBook/"
                                            break;
            
                case "parserFirstReq"   :   urlSent='http://35.154.233.231/Parser/pdf/parser/thyrocare/blood/'
                                            break;
            
                case "parserSecondReq"  :   urlSent='http://35.154.233.231/Parser/report/json/'
                                            break;

                default                 :   model.info="Invalid Thyrocare Operation Name"
                                            model.emit(callbackRouter,model)
                                            break;
    }
    
    var options  = {            url     : urlSent,
                                method  : 'POST',
                                headers : headers,
                                body    : JSON.stringify(model.req.body.data)
                    }

    request(options, function (error, response, body){
            console.log(JSON.parse(body))
        
            if (body){
                    try{
                        model.info=JSON.parse(body)
                    }
                    catch(err){
                        model.info={error:err}
                    }
            }
            else if(response){
                    model.info={error:response,
                                place:"Common Access Vendor Thyrocare"}
            }
            else if(error){
                    model.info={error:error,
                                place:"Common Access Vendor Thyrocare"}
            }
            else{
                    model.info={error:"Error in Common Access [TP Vendor : Thyrocare]  : Common Access"};
            }
        global.emit(callbackRouter,model)
        })
    
}

//exports
module.exports.init=init;