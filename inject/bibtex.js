currentContents = "";
elements = 0;
abortar = false;

$(document).ready(function(){
    $("#gs_hdr_tsb").after("<button type='button' id='getbibtex' name='btnGB' aria-label='Get BibTex' class='gs_btnG gs_in_ib gs_btn_act gs_btn_eml'>Get BibTex</button>");

    $(document).on('click', '#getbibtex', function(){
        htmlParse();
    });

    $(document).on('click', '#btn_close_erro', function(){
        $("#modal-erro-bibtex").remove();
    });


})

function createModalErro(){
    if($("#modal-erro-bibtex").length == 0)
    $("body").append('<div id="modal-erro-bibtex">' +
        '<span class="gs_ico" id="btn_close_erro" style="float:right; top: 2px; background-position: -66px 0px; "></span>'+
        '<span id="t-bibtex"><span class="gs_ico" id="erro_ico" style="position: relative; top: 2px; margin-left:14px; background-position: -22px 0px;"></span>' +
        '<span>Occurred error in geting datas</span></span>' +
        '<span id="m-bibtex">Possibly the Google Scholar rejected your requisition. ' +
        'Try to click in <i>Import into Bibtex</i> of any result and answer the captcha box for release  the requisitions.</span>'+
        '<a href="https://github.com/LuisAraujo/PluginChromeBibTex" id="l-bibtex">Look more</a>' +
        '</div>');
};

function setElements(sinal){
    if(sinal == "+"){
        elements++;
    }else if(sinal == "-"){
        elements--;
        if(elements == 0){
            //getNextPage();
            createFile();
        }

    }
}

function htmlParse(){
    gr =  $("#gs_ccl_results").html();
    grs = $(gr).find(".gs_ri");
	
   for(i=0; i< grs.length; i++){
        gs_fl = $(grs[i]).find(".gs_fl");
		a = gs_fl.find("a");
		
		for(j=0; j < a.length; j++){
            if(($(a[j]).html() == "Importe para o BibTeX") || ($(a[j]).html() == "Import into BibTeX")){
                setElements("+");
				getData( $(a[j]).attr("href") );
		   }
        }
                
    };

};

function getNextPage(){

    gs_n = $("#gs_n").html();
    tr =  $(gs_n).find("tr");
    td =  $(tr).find("td");
    first = false;

    first = parseInt($(td[1]).find("a").text());

    if(isNaN(first)){
        first =  parseInt($(td[1]).find("b").text());
    }

    last =  parseInt($(td[td.length-2]).find("a").text());

    console.log(last);

    for(i=1; i < (td.length-2); i++){

        if( $(td[i]).find('.gs_ico_nav_current').length != 0){
            if(i == 1){
                localStorage.clear();
           }
        }


        localStorage.setItem('bibtext'+i,currentContents);

        if($(td[i+1]).find("a").attr("href") != undefined){
            window.location = "https://scholar.google.com.br"+$(td[i+1]).find("a").attr("href");
            localStorage.setItem('qtdbibtext', parseInt(localStorage.getItem('qtdbibtext'))+1);
        }else{
            localStorage.setItem('bibtext'+i,currentContents);
            createFile();
            break;
        }


    }
}
function getData(link){

    var dados;
    $.ajax({
        type: "POST",
        url: link,
        dataType: "html",
        data: dados,
        contentType: "charset=UTF-8",
        success:sucessGetData,
        error: errorGetData
    });
}
function errorGetData(param){
    if(param.statusText == "error"){
        abortar = true;
        setElements("-");
    }
}
function sucessGetData(param){

     if(param != null){
        currentContents+=(param);
        setElements("-");
     }
}


function createFile(){

    if(abortar){
        createModalErro();
        return;
    }

    qtd = parseInt(localStorage.getItem('qtdbibtext'));
    console.log("Quantidade: " + qtd);

    text = "";
    for(i=1; i< qtd; i++){
        if(localStorage.getItem('bibtext'+i) == null)
          continue;

        text += localStorage.getItem('bibtext'+i);

    }

    console.log(text);
    var blob = new Blob([currentContents], {type: "text/plain;charset=utf-8"});
    saveAs(blob, "ChromeBibTex_pag.txt");
}

