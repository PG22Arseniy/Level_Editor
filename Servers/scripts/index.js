// Copyright (C) 2022 Arseniy Skudaev, All Rights Reserved

import Prefab from "./Prefab.js" 
 
class App {
    constructor() {
        const myLevelForm = document.querySelector("#demo-form")  // form
        const myObjectForm = document.querySelector("#demo-form-object")  // form
        const levelBtn = document.querySelector("#loadLevelBtn")  // load level button
        const objectBtn = document.querySelector("#loadObjectBtn")  // load object button
        
        this.DragObjectsLogic();

        // load level:
        levelBtn.addEventListener("click", e => {
            e.preventDefault()
            let name = document.querySelector("#name").value
            let type = document.querySelector("#type").value
            this.loadLevel({
                "name": name,
                "type": type,
            });
        }) 

        objectBtn.addEventListener("click", e => {
            e.preventDefault()
            let name = document.querySelector("#nameObj").value
            let type = document.querySelector("#typeObj").value
            this.loadObject({
                "name": name,
                "type": type,
            });
        })

        // Init the library of Prefabs
        this.prefabNameList = [];
        this.prefabLibrary = [];
         
        //get level names,
        this.getLevelNames()

        //get object names
        this.getObjectNames()    
 
        // SAVE LEVEL
        myLevelForm.addEventListener("submit", e => {
            e.preventDefault();

            let id = "arseniy"
            let entities = {} 
            let name = document.querySelector("#name").value
            let type = document.querySelector("#type").value

            const formData = $('#demo-form').serializeArray(); // form data

            entities = this.GetDraggedEntities() // entities from the scene

           // level data to save
            let data = {
                "name": name,
                "type": type,
                "userid": id,
                "payload":     
                {
                    "name": name,
                    "type": type,
                    "cannon": { 
                        "x": document.querySelector("#xCannon").value,
                        "y": document.querySelector("#yCannon").value,
                    },
                    "projectiles": document.querySelector("#projectiles").value,
                    "obstacles": document.querySelector("#obstacles").value,
                    "maxShots": document.querySelector("#maxShots").value,
                    "background": document.querySelector("#background").value,
                    "star1": document.querySelector("#star1").value,
                    "star2": document.querySelector("#star2").value,
                    "star3": document.querySelector("#star3").value,   
                    "entities": entities  
                }
            }  

            this.saveData(data);

            $('#demo-form')[0].reset(); // reset form  ,   sorry for jquery :(  
        })


        //SAVE OBJECT
        myObjectForm.addEventListener("submit", e => {
            e.preventDefault();
            let id = "arseniy"
            let name = document.querySelector("#nameObj").value
            let type = document.querySelector("#typeObj").value

            const formData = $('#demo-form-object').serialize(); 
           
            // object data to send
            let data = { 
                "name": name,
                "type": type,
                "userid": id, 
                "payload": {
                    "name": name,
                    "type": type, 
                    "value": document.querySelector("#value").value,
                    "width": document.querySelector("#width").value,
                    "height": document.querySelector("#height").value,
                    "texture": document.querySelector("#texture").value,
                    "mass": document.querySelector("#mass").value,
                    "restitution": document.querySelector("#restitution").value,
                    "friction": document.querySelector("#friction").value,
                    "shape": document.querySelector("#shape").value,                   
                }  
            } 
            
  
            this.saveData(data);
            $('#demo-form-object')[0].reset(); // reset form
        })
    }


    // get collidables and targets from scene
    GetDraggedEntities(){

        let collidables = []
        let targets = [];


        const editor = document.querySelector("#edit-area")  // game scene

        var parentPos = editor.getBoundingClientRect() 
        var childPos 

        const entities = editor.children;
        for (let i = 0; i< entities.length; i++)
        {
            childPos = entities[i].getBoundingClientRect()
    
            if (!entities[i].classList.contains("target")){  // if entity is collidable
                
                collidables.push({ 
                    "id"  : entities[i].classList[1],  
                    "x" : childPos.left - parentPos.left,
                    "y"  : childPos.top - parentPos.top,
                }); 
            } 
            else {   // if entity is target
                targets.push({   
                    "x" : childPos.left - parentPos.left,
                    "y"  : childPos.top - parentPos.top,
                });  
            } 
        }         

        let entitiesData =  {
                         "collidables": collidables,
                         "targets": targets
                        }
        return entitiesData 
    }

    loadPrefabs() {

        return [];
    }


    DragObjectsLogic() { 
        // dragging stuff

        var dragPrefab;
        var dragData;

        document.addEventListener("drag", function(event) {
        
        }, false);
      
        document.addEventListener("dragstart", (event) => {
            dragPrefab = event.target;
            event.target.style.opacity = 0.5;
             // data of dragged object
            dragData = {
                dx: event.offsetX,
                dy: event.offsetY, 
                id: `#${event.target.id}`, // object id
                parent:event.target.parentElement.parentElement.id // parent of target
            };
            
        }, false); 
     
        document.addEventListener("dragend", (event) => {  
          event.target.style.opacity = "";
        }, false);
        
        document.addEventListener("dragover", (event) => {
          event.preventDefault();

        }, false);
        
        document.addEventListener("dragenter", (event)=> {
            
        }, false);
        document.addEventListener("dragleave", (event)=> {
          
        }, false) ; 

          document.addEventListener("drop", (event) => {
            event.preventDefault();
            
            if (event.target.id == "edit-area") {
              
                let x = event.offsetX 
                let y = event.offsetY 
           
                let newPrefab = document.createElement("div")
                newPrefab = dragPrefab.cloneNode(true)
   
                event.target.appendChild( newPrefab);
                newPrefab.style.position = "absolute"
                newPrefab.style.left = `${x-dragData.dx}`+"px" ;  
                newPrefab.style.top = `${y-dragData.dy}`+"px" ;    
                newPrefab.style.opacity = "1" ; 
                let obstacles =  document.querySelector("#edit-area").children.length  
               
                // relocating on the scene
                document.querySelector("#obstacles").value = obstacles;  
                 if (dragData.parent != "object-list")   {
                     dragPrefab.remove()  
                  }
                  
               
            }
          }, false); 
    }


    //get level names
    getLevelNames(){
        $.post("/api/get_level_list").then(data => {  
            var namesDataList = document.getElementById('names');
            console.log(data.error)  
            data = data.payload;
           
            data.forEach(function (file) {
                var option = document.createElement('option');
                option.value = file.name; 
                namesDataList.appendChild(option);
            });
        })
    }

    //get object names 
    getObjectNames() {
       var prefabNameList = new Array();  
        $.post("/api/get_object_list").then(data => { 
            var namesDataList = document.getElementById('namesObj');
            data = data.payload

            data.forEach(function (file) {
    

                let dataReq = JSON.parse(`{ "name":"${file.name}" , "type":"object" }`)


                $.post("/api/load", dataReq).then(objectData => { 
                   // console.log(objectData.payload)   
                   // objectData = objectData.payload   
                     
             
                   objectData = JSON.parse(objectData.payload)     
 
                    const prefabArea = document.querySelector("#object-list")
                    let newPrefab = document.createElement("div")
        
                    newPrefab.style.width = objectData.payload.width + "px"
                    newPrefab.style.height = objectData.payload.height + "px"
                    newPrefab.classList.add(objectData.payload.texture) 
                    newPrefab.classList.add(objectData.payload.name) 
                    newPrefab.id = objectData.payload.name + "Dragged" 
                   
                    newPrefab.setAttribute('draggable', true)
                    
                    const li = document.createElement("li")
                    li.appendChild (newPrefab)  
                    prefabArea.appendChild(li)

                   
                })

                var option = document.createElement('option');
                option.value = file.name;
             
                prefabNameList.push(file.name)    
                namesDataList.appendChild(option); 
            });
            this.populatePrefabLibrary(prefabNameList) 
         
        })

            
    }

    // get all objects in library
    populatePrefabLibrary(prefabNameList){
        for (let prefabName of prefabNameList) { 
            let request = {
                userid: "arseniy", 
                name: prefabName, 
                type: "object"
            }
            $.post(`/api/load`, request )
                .then( resp => JSON.parse( resp.payload ))   
                .then( data => (data.payload))  
                .then( prefabData => {   
                    let prefab = new Prefab(prefabData); 
                    prefab.populate(prefabData)      
                    this.prefabLibrary.push(prefab)
                }) 
        }    
        
    }

    
    // save level data
    saveData(req_data) { 
  
        $.ajax({
            type: "POST",
            url: "/api/save", 
            data: JSON.stringify(req_data),
            contentType: "application/json", 
    }) 
        location.reload(); 
    } 

    //load level  
    loadLevel(data) { 
        $.post("/api/load", data).then(data => { 
            data = data.payload   
            let levelData = JSON.parse(data)     
            document.querySelector("#xCannon").value = parseInt(levelData.payload.cannon.x)
            document.querySelector("#yCannon").value = parseInt(levelData.payload.cannon.y)
            document.querySelector("#projectiles").value = parseInt(levelData.payload.projectiles)
            document.querySelector("#obstacles").value = parseInt(levelData.payload.obstacles)
            document.querySelector("#maxShots").value = parseInt(levelData.payload.maxShots) 
            document.querySelector("#background").value = levelData.payload.background    
            document.querySelector("#star1").value = parseInt(levelData.payload.star1)
            document.querySelector("#star2").value = parseInt(levelData.payload.star2)  
            document.querySelector("#star3").value = parseInt(levelData.payload.star3)  

            const editArea = document.querySelector("#edit-area");
            if(editArea.classList.item(1))      
                editArea.classList.remove(editArea .classList.item(1));
            editArea.classList.add(levelData.payload.background)  

            while(editArea.firstChild){
                editArea.removeChild(editArea.firstChild);  
            } 
                  
            let collidables = levelData.payload.entities.collidables;
      
            const prefabArea = document.querySelector("#edit-area")
            collidables.forEach(function (collidable) {  
                let dataReq = JSON.parse(`{ "name":"${collidable.id}" , "type":"object" }`)

                $.post("/api/load", dataReq).then(objectData => {

                    objectData = JSON.parse(objectData.payload) 
           
                    let newPrefab = document.createElement("div")

                    newPrefab.style.width = objectData.payload.width + "px"
                    newPrefab.style.height = objectData.payload.height + "px"
                    newPrefab.style.position = "absolute" 
                    newPrefab.style.left = `${collidable.x}`+"px" ;  
                    newPrefab.style.top = `${collidable.y}`+"px"  

                    newPrefab.classList.add(objectData.payload.texture) 
                    newPrefab.classList.add(objectData.payload.name) 
                    newPrefab.id = objectData.payload.name + "Dragged"  
                   
                    newPrefab.setAttribute('draggable', true)
                                                  
                    prefabArea.appendChild(newPrefab)               
                }) 
            });

            let targets= levelData.payload.entities.targets;
            targets.forEach(function (target){ 
                let newPrefab = document.createElement("div")
                // newPrefab.style.background = "blue" 
                 newPrefab.style.width = "200px"
                 newPrefab.style.height = "200px"
                 newPrefab.style.position = "absolute" 
                 newPrefab.style.left = `${target.x}`+"px" ;  
                 newPrefab.style.top = `${target.y}`+"px"  
                  
                 newPrefab.classList.add("target") 
                
                 newPrefab.setAttribute('draggable', true)                    
            
                 prefabArea.appendChild(newPrefab) 
            }) 

        })
    } 

    //load object
    loadObject(data) { 
        
        $.post("/api/load", data).then(data => {
            data = data.payload  
            let objectData = JSON.parse(data)
            
            //  var elements = (document.querySelectorAll("#demo-form-object input"));   
            document.querySelector("#value").value = parseInt(objectData.payload.value) 
            document.querySelector("#width").value = parseInt(objectData.payload.width)
            document.querySelector("#height").value = parseInt(objectData.payload.height)
            document.querySelector("#texture").value = (objectData.payload.texture) 
            document.querySelector("#mass").value = parseInt(objectData.payload.mass)
            document.querySelector("#restitution").value = parseInt(objectData.payload.restitution)
            document.querySelector("#friction").value = parseInt(objectData.payload.friction)
            document.querySelector("#shape").value = (objectData.payload.shape)    
         

        })
    }

}
const app = new App();  