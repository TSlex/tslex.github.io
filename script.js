var xhrA = new XMLHttpRequest();
var statAPI = {};
var UID = {
    _current: 0,
    getNew: function(){
        this._current++;
        return this._current;
    }
};
HTMLElement.prototype.pseudoStyle = function(element,prop,value){
    var _this = this;
    var _sheetId = "pseudoStyles";
    var _head = document.head || document.getElementsByTagName('head')[0];
    var _sheet = document.getElementById(_sheetId) || document.createElement('style');
    _sheet.id = _sheetId;
    var className = "pseudoStyle" + UID.getNew();

    _this.className +=  " "+className;

    _sheet.innerHTML += " ."+className+":"+element+"{"+prop+":"+value+"}";
    _head.appendChild(_sheet);
    return this;
};
$("#newPlayer").toggleClass("grayPlaceHolder");
document.getElementById('newPlayer').attributes[3].value = 'Enter a valid username or id';

document.getElementById('showStat').onclick = function () {
    //получение данных
    var player = document.getElementById('newPlayer').value || "TSlex";
    xhrA.open('GET', 'https://osu.ppy.sh/api/get_user?k=8672a323c4433b766d72d529e7502db3dfa58742&m=0&u=' + player, false);
    xhrA.send();
    if(xhrA.responseText === "[]"){
        document.getElementById('newPlayer').attributes[3].value = 'Invalid username or id!';
        if(document.getElementById('newPlayer').attributes[2].value === "grayPlaceHolder") {
            $("#newPlayer").toggleClass("redPlaceHolder").toggleClass("grayPlaceHolder");
        }
        document.getElementById('newPlayer').value = '';
        return;
    }
    statAPI.osuStandart = JSON.parse(xhrA.responseText);
    xhrA.open('GET', 'https://osu.ppy.sh/api/get_user?k=8672a323c4433b766d72d529e7502db3dfa58742&m=3&u=' + player, false);
    xhrA.send();
    statAPI.osuMania = JSON.parse(xhrA.responseText);
    xhrA.open('GET', 'https://osu.ppy.sh/api/get_user?k=8672a323c4433b766d72d529e7502db3dfa58742&m=2&u=' + player, false);
    xhrA.send();
    statAPI.osuCTB = JSON.parse(xhrA.responseText);
    xhrA.open('GET', 'https://osu.ppy.sh/api/get_user?k=8672a323c4433b766d72d529e7502db3dfa58742&m=1&u=' + player, false);
    xhrA.send();
    if(document.getElementById('newPlayer').attributes[2].value === "redPlaceHolder"){
        document.getElementById('newPlayer').attributes[3].value = 'Enter a valid username or id';
        $("#newPlayer").toggleClass("redPlaceHolder").toggleClass("grayPlaceHolder");
    }
    statAPI.osuTaiko = JSON.parse(xhrA.responseText);
    //конец получения
    //проверка
    checkStat();
    //конец проверки
    //обновление статистики
    setMain();
    updateStat('osuStandart');
    //конец обновления
    //появление статистики
    var osLine = document.getElementsByClassName("os-line");
    for (var i = 0; i< osLine.length; i++){
        osLine[i].style.display = "block";
    }
    document.getElementsByClassName("os-photo-cont")[0].style.display = "inline-block";
    document.getElementsByClassName("os-mainStat-cont")[0].style.display = "inline-block";
    document.getElementsByClassName("os-otherStat-cont")[0].style.display = "block";
    document.getElementsByClassName("os-main")[0].style.margin = "50px auto";
    //конец появления
};

function setMain() {
    document.getElementsByClassName("os-photo-cont")[0].style.background = 'url("https://a.ppy.sh/' + statAPI.osuStandart[0]['user_id'] + '"), linear-gradient(#333, #333)';
    document.getElementsByClassName("os-photo-cont")[0].style.backgroundSize = "cover";
    document.getElementsByClassName("os-photo-cont")[0].style.backgroundOrigin = "content-box";
    document.getElementById('country').src = "https://osu.ppy.sh/images/flags/"+ statAPI.osuStandart[0].country +".png";
    document.getElementById('photo').pseudoStyle("after", "background-image", 'url("https://osu.ppy.sh/images/flags/'+ statAPI.osuStandart[0].country +'.png")');
    document.getElementById('name').innerHTML = "[" + statAPI.osuStandart[0].username + "]";
}

function updateStat(a) {
    document.getElementById('lvl').innerHTML = ((Math.floor(statAPI[a][0].level) || "???")).toString();
    document.getElementById('PP').innerHTML = (Number(Number(statAPI[a][0]['pp_raw']).toFixed(1)) || "???") + "pp";
    document.getElementById('wRank').innerHTML = "(#" + statAPI[a][0]['pp_rank'] + ")";
    document.getElementById('lRank').innerHTML = "#" + statAPI[a][0]['pp_country_rank'];
    document.getElementById('acc').innerHTML = "Accuracy: " + (Number(Number(statAPI[a][0]['accuracy']).toFixed(2)) || "???") + "%";
    document.getElementById('totalScore').innerHTML = "Total Score: " + statAPI[a][0]['total_score'];
    document.getElementById('playCount').innerHTML = "Play Count: " + statAPI[a][0]['playcount'];
    document.getElementById('totalHits').innerHTML = "Total Hits: " + ((Number(statAPI[a][0]['count300']) + Number(statAPI[a][0]['count100']) + Number(statAPI[a][0]['count50'])) || "???");
    document.getElementById('rankedScore').innerHTML = "Ranked Score: " + statAPI[a][0]['ranked_score'];
    document.getElementById('playACount').innerHTML = statAPI[a][0]['count_rank_a'];
    document.getElementById('playSCount').innerHTML = statAPI[a][0]['count_rank_s'];
    // document.getElementById('playSHCount').innerHTML = statAPI[a][0]['count_rank_sh'];
    document.getElementById('playXCount').innerHTML = statAPI[a][0]['count_rank_ss'];
    document.getElementById('playXHCount').innerHTML = statAPI[a][0]['count_rank_ssh'];
}
function checkStat() {
    for (var x in statAPI){
        if(!statAPI[x][0]['pp_raw']){
            statAPI[x][0]['pp_country_rank'] = null;
        }
        if(statAPI[x][0]['pp_rank'] === '0'){
            statAPI[x][0]['pp_rank'] = null;
        }
        for (var y in statAPI[x][0]){
            statAPI[x][0][y] = statAPI[x][0][y] || "???";
        }
    }
}


