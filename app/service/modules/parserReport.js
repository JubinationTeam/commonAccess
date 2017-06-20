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
    model.once("parserReportService",parserReportFactory);
}

//function to create new 'parserReportRequest' function for each model
function parserReportFactory(model){
    new parserReportRequest(model)
}

//function to make the Parser report api request
function parserReportRequest(model){
    var options  = {            url     : url+"/report/json/"+model.req.body.data.mobile+"_"+model.req.body.data.thyrocareLeadId,
                                method  : 'POST',
                                headers : headers
                    }

    request(options, function (error, response, body){
        
            if (body&&response.statusCode==200){
                    try{
                        model.info=JSON.parse(body)
                    }
                    catch(err){
                        model.info={error:err,
                                place:"Common Access Module PARSER REPORT REQUEST"}
                    }
            }
            else if(response){
                    model.info={error:response,
                                place:"Common Access Module PARSER REPORT REQUEST"}
            }
            else if(error){
                    model.info={error:error,
                                place:"Common Access Module PARSER REPORT REQUEST"}
            }
            else{
                    model.info={error:"Error in Common Access [Module : PARSER  REPORT REQUEST]  : Common Access"};
            }
        global.emit(callbackRouter,model)
        })
    
}

//exports
module.exports.init=init;