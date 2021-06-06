let request = indexedDB.open("camera", 1);
let db;
request.onsuccess = function(e) {
    db = request.result;
    // console.log(db);
    // let note = {
    //     nId: "vfsdfdf",
    //     txt: "hello i am utsav"
    // }
    
    // let tx = db.transaction("gallery", "readwrite");
    // let store = tx.objectStore("gallery");
    // store.add(note);
   
}

// request.onerror = fuction(e){
//     console.log("error");
// }

request.onupgradeneeded = function(e) {
    db = request.result;
    db.createObjectStore("gallery", { keyPath: "nId"})
}

function addData(type,data) {
    let tx = db.transaction("gallery","readwrite");
    let store = tx.objectStore("gallery");

    store.add({nId : Date.now(),type:type,data:data});
}

function getData(){
    let tx = db.transaction("gallery", "readonly");
    let store = tx.objectStore("gallery");
    let req = store.openCursor();
    let gallery = document.querySelector(".gallery");
    gallery.innerHTML="";
    req.onsuccess = function(e){
        let cursor = e.target.result;
        if(cursor){
            if(cursor.value.type == "image"){
                
                let image = document.createElement("div");
                image.classList.add("image");
                image.innerHTML = `<img src ='${cursor.value.data}'></img>
                <div class="button">
                    <button class="delete${cursor.value.nId}">delete</button>
                    <button class="download${cursor.value.nId}">download</button>
                    </div>`

                gallery.append(image);
                let url=cursor.value.data;
                let filename=cursor.value.nId + ".png";
                let nId = cursor.value.nId;
                document.querySelector(`.download${cursor.value.nId}`).addEventListener("click",function(e){
                    download(url,filename);
                })
                document.querySelector(`.delete${cursor.value.nId}`).addEventListener("click",function(e){
                    deleteFromGallery(nId);
                })
            }else{
                let videoUrl = URL.createObjectURL(cursor.value.data);
                let video = document.createElement("div");
                video.classList.add("video");
                video.innerHTML = `<video autoplay src ='${videoUrl}' loop></video>
                <div class="button">
                    <button class="delete${cursor.value.nId}">delete</button>
                    <button class="download${cursor.value.nId}">download</button>
                    </div>
                `
                gallery.append(video);
                let url=cursor.value.data;
                let filename=cursor.value.nId + ".png";
                let nId = cursor.value.nId;
                document.querySelector(`.download${cursor.value.nId}`).addEventListener("click",function(e){
                    download(url,filename);
                })
                document.querySelector(`.delete${cursor.value.nId}`).addEventListener("click",function(e){
                    deleteFromGallery(nId);
                })
            }
            console.log(cursor);
            cursor.continue();
        }else{
            console.log("all data fecthed");
        }
        
    }
}

function download(url,name){
    let a = document.createElement("a");
    a.href = url;
    a.download = name;
    a.click();
}

function deleteFromGallery(nId){
    let tx = db.transaction("gallery", "readwrite");
    let store = tx.objectStore("gallery");
    store.delete(Number(nId));
    getData();
}