chrome.storage.session.get("verse_text_array").then((result) => {
    if(result.verse_text_array){
      for(let i = 0; i < result.verse_text_array.length; i++){

      
        var div1 = document.getElementById('div1');
        var para = document.createElement("p");
        var node = document.createTextNode(result.verse_text_array[i]);
        para.appendChild(node);
        
        if(div1){
          div1.appendChild(para);
        }
  
  
      }
    }
    

    

  });
  document.getElementById('openNewTab').addEventListener('click', function() {
    chrome.runtime.sendMessage({ action: "openNewTab" });
  });

