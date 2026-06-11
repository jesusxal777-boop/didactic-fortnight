let files = DB.load("files") || {};

function saveFile(name,content){

files[name]=content;

DB.save("files",files);

}
