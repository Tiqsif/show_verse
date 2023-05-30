//console.log("background");
var verse;
var surah;
var last_verse;
var last_surah;

var onScreenVerses = [];

// onscreenverses ve last verse-surah uyumunu yap. hatali sayfaya gidiyor.
chrome.runtime.onMessage.addListener(async (request, sender, sendResponse) => {//{action:"verseTransfer",message : [{surah:s1,verse:v1},{surah:s1,verse:v2},...]}
    if(request.action === "verseTransfer" && request.message.length>0){
        onScreenVerses = [];
        var onScreenTexts = [];
        for(let i = 0; i < request.message.length; i++){

            surah = my_find(request.message[i].surah);
            verse = parseInt(request.message[i].verse) ;
            if(!(surah&&verse)){
                continue;
            }
            await fetch(`https://api.acikkuran.com/surah/${surah}/verse/${verse}?author=50`).then(res => {
                if(!res.ok){
                    console.log("HTTP ERROR (Show Verse)");
                    verse = last_verse;
                    surah = last_surah;
                    return undefined;
                } else {
                    return res.json();
                }
                
             }).then(data => {
                var text;
                if(data){
                    text = data.data.translation.text;                
                    text = text.replace(/[\(\[].*?[\)\]]/g, '');
                    text = text.replace('  ',' ');
                    text = `(${surah}:${verse}) `+ text;
                    last_surah = surah;
                    last_verse = verse;
                    onScreenTexts.push(text);
                    onScreenVerses.push({"surah":surah,"verse":verse});
                }
                
                
            }).catch(error => {
                console.log(error);
            });
            
            
        }
        //console.log(onScreenTexts);
        chrome.storage.session.set({"verse_text_array": onScreenTexts}); // stores the array of verses here
    }else if(request.action === "openNewTab" && verse && surah){
        for(let i = 0; i < onScreenVerses.length; i++){
            var current_surah = onScreenVerses[i].surah;
            var current_verse = onScreenVerses[i].verse;
            chrome.tabs.create({ url: `https://acikkuran.com/${current_surah}/${current_verse}` }, function(tab) {
                
                chrome.tabs.update(tab.id, { active: true });
    });
        }
        
    }


    
    
    
    }
  );

  function my_find(str){
    console.log("in");
    var surah_names = [["Fatiha", "fatiha"], ["Bakara", "bakara"], ["Ali \u0130mran", "ali-imran"], ["Nisa", "nisa"], ["Maide", "maide"], ["Enam", "enam"],
                   ["Araf", "araf"], ["Enfal", "enfal"], ["Tevbe", "tevbe"], ["Yunus", "yunus"], ["Hud", "hud"], ["Yusuf", "yusuf"],
                   ["Rad", "rad"], ["\u0130brahim", "ibrahim"], ["Hicr", "hicr"], ["Nahl", "nahl"], ["\u0130sra", "isra"], ["Kehf", "kehf"],
                   ["Meryem", "meryem"], ["Taha", "taha"], ["Enbiya", "enbiya"], ["Hac", "hacc"], ["M\u00fcminun", "muminun"], ["Nur", "nur"],
                   ["Furkan", "furkan"], ["\u015euara", "suara"], ["Neml", "neml"], ["Kasas", "kasas"], ["Ankebut", "ankebut"], ["Rum", "rum"],
                   ["Lokman", "lokman"], ["Secde", "secde"], ["Ahzab", "ahzab"], ["Sebe", "sebe"], ["Fat\u0131r", "fatir"], ["Yasin", "yasin"],
                   ["Saffat", "saffat"], ["Sad", "sad"], ["Z\u00fcmer", "zumer"], ["M\u00fcmin", "mumin"], ["Fussilet", "fussilet"], ["\u015eura", "sura"],
                   ["Zuhruf", "zuhruf"], ["Duhan", "duhan"], ["Casiye", "casiye"], ["Ahkaf", "ahkaf"], ["Muhammed", "muhammed"], ["Fetih", "fetih"],
                   ["Hucurat", "hucurat"], ["Kaf", "kaf"], ["Zariyat", "zariyat"], ["Tur", "tur"], ["Necm", "necm"], ["Kamer", "kamer"],
                   ["Rahman", "rahman"], ["Vak\u0131a", "vakia"], ["Hadid", "hadid"], ["M\u00fccadele", "mucadele"], ["Ha\u015fr", "hasr"], ["M\u00fcmtehine", "mumtehine"],
                   ["Saff", "saff"], ["Cuma", "cuma"], ["M\u00fcnafikun", "munafikun"], ["Tegabun", "tegabun"], ["Talak", "talak"], ["Tahrim", "tahrim"],
                   ["M\u00fclk", "mulk"], ["Kalem", "kalem"], ["H\u00e2kka", "hakka"], ["Mearic", "mearic"], ["Nuh", "nuh"], ["Cin", "cinn"],
                   ["M\u00fczzemmil", "muzzemmil"], ["M\u00fcddessir", "muddessir"], ["K\u0131yame", "kiyame"], ["\u0130nsan", "insan-dehr"], ["M\u00fcrselat", "murselat"], ["Nebe", "nebe"],
                   ["Naziat", "naziat"], ["Abese", "abese"], ["Tekvir", "tekvir"], ["\u0130nfitar", "infitar"], ["Mutaffifin", "mutaffifin"], ["\u0130n\u015fikak", "insikak"],
                   ["B\u00fcruc", "buruc"], ["Tar\u0131k", "tarik"], ["Ala", "ala"], ["Ga\u015fiye", "gasiye"], ["Fecr", "fecr"], ["Beled", "beled"],
                   ["\u015eems", "sems"], ["Leyl", "leyl"], ["Duha", "duha"], ["\u0130n\u015firah", "insirah-serh"], ["Tin", "tin"], ["Alak", "alak"],
                   ["Kadir", "kadr-kadir"], ["Beyyine", "beyyine"], ["Zilzal", "zilzal"], ["Adiyat", "adiyat"], ["Karia", "karia"], ["Tekas\u00fcr", "tekasur"],
                   ["Asr", "asr"], ["H\u00fcmeze", "humeze"], ["Fil", "fil"], ["Kurey\u015f", "kureys"], ["Maun", "maun"], ["Kevser", "kevser"],
                   ["Kafirun", "kafirun"], ["Nasr", "nasr"], ["Tebbet", "tebbet-mesed"], ["\u0130hlas", "ihlas"], ["Felak", "felak"], ["Nas", "nas"]];
    if(!isNaN(str)){
        return str;
    }
    for(var i = 0; i<surah_names.length; i++){
        for(var j = 0; j < surah_names[i].length; j++){            
            if(surah_names[i][j].toLowerCase() === str.toLowerCase()){
                console.log("found",i+1);
                return i+1;
            }
        }
    }
    console.log("couldnt find");
    return null;

  }
  /*
  async function JSONData(text) {
    const response = await fetch(text);
    const jsonData = await response.json();
    return jsonData;
  }
  */