// Copyright (C) 2022 Arseniy Skudaev, All Rights Reserved
'use strict';

import { fileURLToPath } from 'url'
import Path, { dirname } from 'path'
import FileSystem from 'fs-extra'   

const __filename = fileURLToPath( import.meta.url );
const __dirname = Path.resolve(); 

import Express from 'express'
import HTTP from 'http'  

const PORT = 3400; 
 

class Server {

    constructor() { 

        this.api = Express();
        this.api.use( Express.json() )
                .use( Express.urlencoded({ extended: false }))
                .use( Express.static( Path.join( __dirname, '.')));

        // get level names 
        this.api.post('/api/get_level_list' , (req,res) => {
            var payload = [];
            FileSystem.readdir("./levels", (err, files) => {  
                files.forEach(file => {
                  payload.push({"name":file.slice(0,-5), "filename":file})     
                });
                let data = { 
                    "payload" : payload,
                    "error": 0
                }
                res.send(data);     
              });   
        
               
        });  

           // get object names 
        this.api.post('/api/get_object_list' , (req,res) => {
            var payload = []
            FileSystem.readdir("./objects", (err, files) => { 
                files.forEach(file => { 
                    payload.push({"name":file.slice(0,-5), "filename":file})      
                }); 
                let data = { 
                    "payload" : payload,
                    "error": 0
                }
                res.send(data);    
              });   
       
              
        });   



        // save level / object
        this.api.post('/api/save' , (req,res) => {                
            var filename = req.body["name"]; 
            var data = JSON.stringify(req.body)   
            FileSystem.writeFile("./"+req.body["type"]+"s/"+filename+".json", data, function(err){      
                if(err){  
                    return err     
                }  
               
            });    
            let bytes = FileSystem.statSync("./"+req.body["type"]+"s/"+filename+".json").size 

            res.send({
                "name": req.body["name"]+".json", 
                "bytes": bytes, 
                "error": 0 
            })   
        });     
       

        // load level / object 
        this.api.post('/api/load' , (req,res) => {   

            let filename = req.body["name"]   
            var data = FileSystem.readFileSync("./"+req.body["type"]+"s/"+filename+".json")    
            let bytes = FileSystem.statSync("./"+req.body["type"]+"s/"+filename+".json").size

           res.send({
                "name": filename,   
                "bytes": bytes,
                "payload": JSON.stringify(JSON.parse(data)), 
                "error": 0  
            });          
        });    
 
        this.run();
    }

    run() { 

        this.api.set('port', PORT );
        this.listener = HTTP.createServer( this.api );
        this.listener.listen( PORT );
        this.listener.on('listening', event => {

            let addr = this.listener.address();
            let bind = typeof addr == `string` ? `pipe ${addr}`: `port ${addr.port}`;

            console.log(`Listening on ${bind}`)
        });
    }
}

const server = new Server();
