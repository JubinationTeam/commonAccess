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
    model.once("parserService",parserFactory);
}

//function to create new 'parserRequestFunction' function for each model
function parserFactory(model){
    new parserRequestFunction(model)
}

function parserRequestFunction(model){
    
    switch(model.req.body.mod){
            
        case "parser" :   firstThyrocareParserRequest(model);
                          break;

        default       :   model.info="Invalid Parser Vendor Name"
                          global.emit(callbackRouter,model)
                          break;
    }
    
}

//function to make the first Parser api request
function firstThyrocareParserRequest(model){
    
     var body={
                                reportUrl:model.req.body.data.pdfUrl,
                                reportXml:model.req.body.data.xmlUrl 
                            }
     
    var options  = {            url     : url+"/pdf/parser/thyrocare/blood/"+model.req.body.data.mobile+"_"+model.req.body.data.thyrocareLeadId,
                                method  : 'POST',
                                headers : headers,
                                body    : JSON.stringify(body)
                    }

    request(options, function (error, response, body){
            if (body){
                            try{
                                body=JSON.parse(body);
                            }
                            catch(err){
                                console.log(err)
                            }
                
                    if(body.body=="Success"){
                        model.info=body;
                        secondThyrocareParserRequest(model)
    //                    global.emit(callbackRouter,model)
                    }
                    else{
                        model.info=body;
                    }
            }
            else if(response){
                    model.info={error:response,
                                place:"Common Access Module PARSER"}
            }
            else if(error){
                    model.info={error:error,
                                place:"Common Access Module PARSER"}
            }
            else{
                    model.info={error:"Error in Common Access [Module : PARSER]  : Common Access"};
            }
        
        global.emit(callbackRouter,model)
        })
}

//function to make the second Parser api request
function secondThyrocareParserRequest(model){
    var options  = {            url     : url+"/report/json/"+model.req.body.data.mobile+"_"+model.req.body.data.thyrocareLeadId,
                                method  : 'POST',
                                headers : headers
                    }

    request(options, function (error, response, body){
        
            if (body&&response.statusCode==200){
                    try{
                        model.info=JSON.parse(body)
                        console.log(JSON.stringify(model.info)+"BBOOOOOODDDDDDYYYYYYY")
                    }
                    catch(err){
                        model.info={error:err}
                    }
            }
            else if(response){
                    model.info={error:response,
                                place:"Common Access Module PARSER"}
            }
            else if(error){
                    model.info={error:error,
                                place:"Common Access Module PARSER"}
            }
            else{
                    model.info={error:"Error in Common Access [Module : PARSER]  : Common Access"};
            }
        global.emit(callbackRouter,model)
        })
    
}

//exports
module.exports.init=init;