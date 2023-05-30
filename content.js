//console.log("content");

window.addEventListener('mouseup',textSelected);



function textSelected(){
    var textArr = [];
    let text = window.getSelection().toString().trim();
    text = text.replace(/[{()}]/g, '');
    
    var splitText = text.split(' ')
    for(let word = 0; word < splitText.length;word++){
        if (splitText[word].includes(':') && splitText[word].length >= 3){
            if(splitText[word].indexOf(':') != 0 && splitText[word].indexOf(':') != splitText[word].length - 1){
                var wordArr = splitText[word].split(':');
                
                var surah = wordArr[0]; //string
                var verse = wordArr[1]; //string
                if(surah && verse){//surah string olunca buraya girmedi
                    
                    textArr.push({surah:surah,verse:verse});
                }
                
    
            }        
        }
    }
    //console.log("txtAr:",textArr);
    if(textArr.length>0){
        //console.log(surah,',',verse);
        var msg = {
            action:"verseTransfer",
            message : textArr
        };
        console.log(msg);
        chrome.runtime.sendMessage(msg); //msg = {action:"verseTransfer",message : [{surah:s1,verse:v1},{surah:s1,verse:v2},...]}
        
    }
}

