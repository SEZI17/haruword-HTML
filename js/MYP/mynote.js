// 아행부터 행별로 표시
function Mynotelistoutput() {
    for(let i=0; i<form_a.length; i++) {
    var form = form_a[i]; 
    var kanji = kanji_a[i];
    var yomigana = yomigana_a[i];
    var korean = korean_a[i];
    var checkbox = "<input id='wordChk"+ i +"' class='wordChkbox' type='checkbox' name='delete' value='apply' /><label for='wordChk"+ i +"' />";
    var WDLlist = document.getElementById('MYP_MYN_notelist');
    var add = WDLlist.insertRow( WDLlist.rows.length );
    var MYN_formcell = add.insertCell(0);
    var MYN_kanjicell = add.insertCell(1);
    var MYN_yomiganacell = add.insertCell(2);
    var MYN_koreancell = add.insertCell(3);
    var MYN_timecell = add.insertCell(4);
    var MYN_deletecell = add.insertCell(5);
    MYN_formcell.innerHTML = form;
    MYN_kanjicell.innerHTML = kanji;
    MYN_yomiganacell.innerHTML = yomigana;
    MYN_koreancell.innerHTML = korean;
    MYN_deletecell.innerHTML = checkbox;
    MYN_timecell.innerHTML = new Date().toDateString();
    MYN_timecell.className = "table_time";
    add.className = "notelist_tr";  
    }
}
function membernameOutput() {
    var memberlist = document.getElementById('member_name');
    var memberlist_m = document.getElementById('member_name_mobile');
    var name = membername[1];
    memberlist.innerHTML = name;
    memberlist_m.innerHTML = name;
}

// 단어장 리스트 전체선택
function checkallWord() {
    if( $("#all_check").is(':checked') ){
        $("input[name=delete]").prop("checked", true);
    } else {
        $("input[name=delete]").prop("checked", false);
    }
}

// 단어장 리스트 선택삭제
function deleteWord(){
    if($('#MYP_MYN_notelist input:checked').length == 0){           
        alert("삭제할 단어가 선택되지 않았습니다.");
    } else {
        var cfdelete = confirm("해당 단어를 삭제하시겠습니까?")
        if (cfdelete) {
        $('#MYP_MYN_notelist input:checked').each(function(index){  
            var checkedWord = $(this).parent().parent();                
            checkedWord.remove();      
            });            
            return false;   
        } else { return false; } 
    } 
}


$(document).ready(function(){
    membernameOutput();
    Mynotelistoutput();
});