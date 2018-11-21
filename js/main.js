var ServerIP = "localhost";
var ServerPort = "3000";
var ServerLocation =  "http://"+ServerIP+":"+ServerPort;

function genRequest( POSITION, APIURL, DataType ,MethodType, Sentdata){
    $.ajax({
        type: MethodType,
        url: APIURL,
        cache: false,
        data: Sentdata,
        processData: false,
        contentType: DataType,
        success: function(res) { 
            console.log(res);
            if (res.Data != undefined){
                if(POSITION == 1){
                    var AreaText = document.getElementsByClassName("FileAreaText");
                    AreaText[0].innerHTML ="File Hash:"+ res.Data.hash;
                    GenDisplayblock(POSITION, res.Data);
                }
                else if(POSITION == 3){
                    var AreaText = document.getElementsByClassName("FileAreaText");
                    AreaText[1].innerHTML = "File Hash:"+ res.Data[0].hash ;
                    GenDisplayblock(POSITION, res.Data);
                }
                else{
                     GenDisplayblock(POSITION, res.Data);
                }
            }
			document.getElementById('snackbar').innerHTML = res.Message;
			ShowToast();
		},
        error: function(err) {
            console.log(err.responseJSON);
            document.getElementById('snackbar').innerHTML = err.responseJSON.Message;
			ShowToast();
        },
      });
}

function connect(){
    document.getElementById('snackbar').innerHTML ="Trying To Connect Server...";
    ShowToast();
	genRequest(0, ServerLocation,'Text','post',{});
	document.getElementById("ServerIP").value = ServerIP;
	document.getElementById("ServerPort").value = ServerPort;
}

function UserSearchByID(){
    var UserInput = document.getElementById('SearchByID');
    var Server = ServerLocation + '/search';
    var searchID = UserInput.value;
    var searchData = JSON.stringify({"searchID":searchID});
    genRequest(2,Server,'application/json','POST',searchData);
}

function StampUserFile(){
    var Server = ServerLocation + '/stamp';
    var formData = new FormData();
    formData.append('sampleFile', $('#userFile')[0].files[0]);
    genRequest(1, Server,false,'POST',formData);
}

function CheckFile(){
    var Server = ServerLocation + '/getStamps';
    var formData = new FormData();
    formData.append('sampleFile', $('#sampleFile')[0].files[0]);
    genRequest(3, Server,false,'POST',formData);
}

function VerifyUserMerkleRoot(){
    var merkleRoot = document.getElementById('MerkleRoot');
    var FileHash = document.getElementById('FileHash');
    var proof = document.getElementById('userArray');
    var Root = merkleRoot.value;
    var File = FileHash.value;
    var ProofArray = proof.value.split(',');
    ProofFileHash(File, ProofArray,Root);
}

function ProofFileHash(Filehash, proof, root){
    var Server = ServerLocation + '/proofRoot';
    var searchData = JSON.stringify({"Filehash":Filehash, "proof": proof});
    if (root != ""){
        var searchData = JSON.stringify({"Filehash":Filehash, "proof": proof, "MerkleRoot": root});
    }
    genRequest( 4 ,Server,'application/json','POST',searchData);
}

function init(){
    document.getElementById("ServerIP").value = ServerIP;
    document.getElementById("ServerPort").value = ServerPort;
    console.log(ServerLocation);
    connect();
}

function changeServerIP(){
    ServerIP =  document.getElementById("ServerIP").value;
    ServerPort = document.getElementById("ServerPort").value;
    ServerLocation =  "http://"+ServerIP+":"+ServerPort;
    console.log(ServerLocation);
    connect();
}

function SwitchToSearch(){
    var x = document.getElementsByClassName("page");
    for (var i = 0; i < x.length; i++ ){
        x[i].style.display="none";
    }
	document.getElementById("SearchByIDFunction").style.display="block";
}

function SwitchToStamp(){
    var x = document.getElementsByClassName("page");
    for (var i = 0; i < x.length; i++ ){
        x[i].style.display="none";
    }
	document.getElementById("StampFileFunction").style.display="block";
}

function SwitchToVerify(){
    var x = document.getElementsByClassName("page");
    for (var i = 0; i < x.length; i++ ){
        x[i].style.display="none";
    }
	document.getElementById("CheckStampFunction").style.display="block";
}

function SwitchToMerkleRoot(){
    var x = document.getElementsByClassName("page");
    for (var i = 0; i < x.length; i++ ){
        x[i].style.display="none";
    }
	document.getElementById("CheckMerkleRoot").style.display="block";
}

function FileOnChange(position){
    var AreaText = document.getElementsByClassName("FileAreaText");
    AreaText[position].innerHTML ="1 File Selected";
}

// Get the modal
var modal = document.getElementById('myModal');

// Get the button that opens the modal
var btn = document.getElementById("myBtn");

// Get the <span> element that closes the modal
var span = document.getElementsByClassName("close")[0];

// When the user clicks on the button, open the modal
btn.onclick = function() {
    modal.style.display = "block";
}

// When the user clicks on <span> (x), close the modal
span.onclick = function() {
    modal.style.display = "none";
}

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
    if (event.target == modal) {
        modal.style.display = "none";
    }
} 

function ShowToast() {
    // Get the snackbar DIV
    var x = document.getElementById("snackbar");

    // Add the "show" class to DIV
    x.className = "show";

    // After 3 seconds, remove the show class from DIV
    setTimeout(function(){ x.className = x.className.replace("show", ""); }, 3000);
} 

function GenDisplayblock(POSITION, data){
    var MessageArea = "ShowResult"+POSITION;
    var ResponseArea = "#response"+POSITION;
    if(POSITION !=0 && POSITION !=4){
        if(data[0] != null ){
            for(var i = 0; i < data.length;i++){
                var uuid = String(guid());
                var uuid2 = String(guid());
                var uuid2Str= "#"+uuid2;
                document.getElementById(MessageArea).style.display="Block";
                $(ResponseArea).prepend ("<div class='ResultBlock' onclick='DisplayDetail(\""+uuid+"\");' type='button' >Result: #" + data[i].id + "<img style='float:right' src='https://johnathan.i234.me/src/img/down-black.png'/></div><div id='"+uuid2+"'></div>");
                $(uuid2Str).append ("<div class='MoreDetail' id='"+uuid+"'style='display:none'></div>");
                DisplayResult(uuid, data[i]);
            }
        }
        else{
            var uuid = String(guid());
            var uuid2 = String(guid());
            var uuid2Str= "#"+uuid2;
            document.getElementById(MessageArea).style.display="Block";
            $(ResponseArea).prepend ("<div class='ResultBlock' onclick='DisplayDetail(\""+uuid+"\");' type='button' >Result: #" + data.id + "<img style='float:right' src='https://johnathan.i234.me/src/img/down-black.png'/></div><div id='"+uuid2+"'></div>");
            $(uuid2Str).append ("<div class='MoreDetail' id='"+uuid+"'style='display:none'>");
            DisplayResult(uuid, data);
        }
        
    }
    else if(POSITION ==4){
        var uuid = String(guid());
        var uuid2 = String(guid());
        var uuid2Str= "#"+uuid2;
        document.getElementById(MessageArea).style.display="Block";
        if(typeof data.match !== 'undefined'){
            $(ResponseArea).prepend ("<div class='ResultBlock' onclick='DisplayDetail(\""+uuid+"\");' type='button' >Result: "+data.match.toString().toUpperCase()+" #"+data.hash+"<img style='float:right' src='https://johnathan.i234.me/src/img/down-black.png'/></div><div id='"+uuid2+"'></div>");
        }
        else{
             $(ResponseArea).prepend ("<div class='ResultBlock' onclick='DisplayDetail(\""+uuid+"\");' type='button' >Result: #"+data.hash+"<img style='float:right' src='https://johnathan.i234.me/src/img/down-black.png'/></div><div id='"+uuid2+"'></div>");
        }
       $(uuid2Str).append ("<div class='MoreDetail' id='"+uuid+"'style='display:none'>");
        DisplayJSON(uuid, data);
    }
}

function DisplayResult(uuid, data){
        var DivLocation = "#"+String(uuid);
        $(DivLocation).append("ID: " + data.id +"<br/>");
        $(DivLocation).append("File Hash: " + data.hash +"<br/>");
        $(DivLocation).append("Stamp Time: " + data.time +"<br/>");
        if (typeof data.receipts !== 'undefined'){
            if (typeof data.receipts.btc !== 'undefined'){
                if (typeof data.receipts.btc !== 'number'){
                    $(DivLocation).append('BTC : <a target="_blank" href="https://www.blocktrail.com/BTC/tx/'+data.receipts.btc.anchors[0].sourceId+'">' + data.receipts.btc.anchors[0].sourceId +" <br/>");
                    $(DivLocation).append('&nbsp;&nbsp;MerkleRoot : '+data.receipts.btc.merkleRoot+"<br/>");
                    $(DivLocation).append('&nbsp;&nbsp;&nbsp;&nbsp;Proof :<br/> '+JSON.stringify(data.receipts.btc.proof)+'<br/>');
                }
            }
            if (typeof data.receipts.eth !== 'undefined'){
                if (typeof data.receipts.eth !== 'number'){
                    $(DivLocation).append('ETH : <a target="_blank" href="https://etherscan.io/tx/'+data.receipts.eth.anchors[0].sourceId+'">' + data.receipts.eth.anchors[0].sourceId +" </a><br/>"); 
                    $(DivLocation).append('&nbsp;&nbsp;MerkleRoot : '+data.receipts.eth.merkleRoot+"<br/>");
                    $(DivLocation).append('&nbsp;&nbsp;&nbsp;&nbsp;Proof :<br/> '+JSON.stringify(data.receipts.eth.proof)+'<br/>');
                }
            }
            if (typeof data.receipts.etc !== 'undefined'){
                if (typeof data.receipts.etc !== 'number'){
                    $(DivLocation).append('ETC : <a target="_blank" href="https://gastracker.io/tx/'+data.receipts.etc.anchors[0].sourceId+'">' + data.receipts.etc.anchors[0].sourceId +" <br/>"); 
                    $(DivLocation).append('&nbsp;&nbsp;MerkleRoot : '+data.receipts.etc.merkleRoot+"<br/>");
                    $(DivLocation).append('&nbsp;&nbsp;&nbsp;&nbsp;Proof :<br/> '+JSON.stringify(data.receipts.etc.proof)+'<br/>');
                }
            }
            if (typeof data.receipts.ltc !== 'undefined'){
                if (typeof data.receipts.ltc !== 'number'){
                    $(DivLocation).append('LTC : <a target="_blank" href="https://live.blockcypher.com/ltc/tx/'+data.receipts.ltc.anchors[0].sourceId+'">' + data.receipts.ltc.anchors[0].sourceId +" <br/>");
                    $(DivLocation).append('&nbsp;&nbsp;MerkleRoot : '+data.receipts.ltc.merkleRoot+"<br/>");
                    $(DivLocation).append('&nbsp;&nbsp;&nbsp;&nbsp;Proof :<br/> '+JSON.stringify(data.receipts.ltc.proof)+'<br/>');
                }
            }
        }
        
}

function DisplayJSON(uuid, data){
    var DivLocation = "#"+String(uuid);
    $(DivLocation).append("File Hash: " + data.hash +"<br/>");
    $(DivLocation).append("Merkle Root Result: " + data.result +"<br/>");
    if(typeof data.match !== 'undefined'){
        $(DivLocation).append("Result: <span style='color:#ff0000'>" + data.match.toString().toUpperCase() +"</span><br/>");
    }
    $(DivLocation).append("Step: <br/>");
    for (var i = 0 ; i < data.step.length; i++){
        var DATAUP = data.step[i].toUpperCase();
        $(DivLocation).append("Step "+i+" : "+DATAUP+"<br/>");
    }
}

function DisplayDetail(Block){
    var MoreBlock = "#"+String(Block);
    if(document.getElementById(Block).style.display=="none"){
        $(MoreBlock).css("display", "Block");
    }
    else if(document.getElementById(Block).style.display=="block"){
        $(MoreBlock).css("display", "none");
    }
}

//Random Number Block ID
function guid() {
    function s4() {
      return Math.floor((1 + Math.random()) * 0x10000)
        .toString(16)
        .substring(1);
    }
    return String("Block"+s4());
  }