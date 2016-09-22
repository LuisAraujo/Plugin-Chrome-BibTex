currentContents = "";
elements = 0;


$(document).ready(function() {
	//alert('Bem-vindo ao Publig Chrome BibText');
    //htmlParse();
});

$(document).on( "keydown", function( event ) {
     if(event.which == 66)
         htmlParse();
});

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

            if($(a[j]).html() == "Importe para o BibTeX"){
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

    //setTimeout(function(){sucessGetData("aaa  ")}, 100);
    //return;

    var dados;
    $.ajax({
        type: "POST",
        url: link,
        dataType: "html",
        data: dados,
        contentType: "charset=UTF-8",
        success:sucessGetData,
        error: function(){}
    });
}

function sucessGetData(param){
     if(param != null){
        currentContents+=(param);
        setElements("-");
     }
}


function createFile(){
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

