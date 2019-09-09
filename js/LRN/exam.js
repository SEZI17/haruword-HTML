// 1: 히라가나 연습검정 // 2: 히라가나 일반검정
// 3: 한글 연습검정     // 4: 한글 일반검정
var examMode;           
var questionList = [];      //문제 보관 변수
var wordList = [];          //단어 모음
var questionCount = 20;     //전체 문제 수
var nowQuestion = 0;        //현재 문제 번호
var timeDelay = 1200;       
var min = 0;
var sec = 0;
var timerID;                //일반검정일 경우 타이머의 ID
var lanMode = 0;            //0이면 문제가 일본어 1이면 한국어

var strClass = "<div id='checkDisplay'>v</div>"

$(function(){

    examMode = getMode();

    //언어 설정
    setLanMode();

    //문제 만들기
    makeQuestion();
    
    //드래그 방지
    $("body").addClass("no-drag");

    //일반검정일 경우
    if(2 == examMode || 4 == examMode)
    {
        //타이머 작동 및 SHOW
        timerID = startTimer();
        $(".timer").css("visibility", "visible");

        //왼쪽 오른쪽 화살표 보이도록 변경
        $("#leftBtn ").css("display","block");
        $("#rightBtn").css("display","block");

        //왼쪽 오른쪽 화살표 클릭시
        btnClick();
    }

    //셋팅된 문제 보이게
    showQuestion();

    //보기중 하나를 선택했을 경우
    selectExample();

    //채점하기 버튼 클릭 시
    clickFinishBtn();
});

function resultExam()
{
    let resultList = questionList.slice();
    let removeList = [];

    $.each(resultList, function(index, value)
    {
        if(-1 == value.click)
            removeList.push(index);
    });

    //리스트에서 안 푼문제는 삭제
    removeList.reverse();
    $.each(removeList, function(index, value)
    {
        resultList.splice(value, 1);
    });

    //문제리스트를 examResult.html로 넘긴다.
    localStorage.setItem("language", lanMode);    

    let tempMin = min;
    let tempSec = sec;
    if(min < 10)
        tempMin = "0" + tempMin;
    if(sec < 10)
        tempSec = "0" + tempSec;

    let timer = tempMin + ":" + tempSec;
    localStorage.setItem("timer", timer);

    localStorage.setItem("resultList", JSON.stringify(resultList));
    window.open("./examResult.html", "_self");
}

function clickFinishBtn()
{
    $(".finishExam").on("click", function()
    {
        let result = confirm("채점하시겠습니까?");
        if(true == result)
        {
            let listLen = questionList.length;
            for(let i = 0; i < listLen; i++)
            {
                if(-1 != questionList[i].click)
                {
                    resultExam();
                    return;
                }
            };

            alert("아직 한 문제도 풀지 않았습니다.");
        }
    });
}


function btnClick()
{
    $("#leftBtn").on("click", function(){
        if(0 < nowQuestion)
        {
            nowQuestion--;
            showQuestion();
        }
    });

    $("#rightBtn").click(function(){
        if(nowQuestion + 1 != questionCount)
        {
            nowQuestion++;
            showQuestion();
        }
    });
}

function setLanMode()
{
    if(3 == examMode || 4 == examMode)
        lanMode = 1;
}

function endTimer()
{
    clearInterval(timerID);
}

function startTimer()
{
    return setInterval(function()
    {
        if(60 == ++sec)
        {
            sec = 0;
            min++;
        }

        let tempMin = min;
        let tempSec = sec;
        if(min < 10)
            tempMin = "0" + tempMin;
        if(sec < 10)
            tempSec = "0" + tempSec;

        $("#min").text(tempMin);    
        $("#sec").text(tempSec);
        
    }, 1000)
}

function selectExample()
{
    $(".example > .exampleBox").on("click",function()
    {

        if(questionCount == nowQuestion)
        {
            endTimer();
            return;
        }

        //작업 중 클릭시 리턴
        if("block" == $("#ox").css("display"))
            return;

        //클릭 시 이미 체크되어 있는거 없애버림
        $("#checkDisplay").remove();

        let answer = questionList[nowQuestion].answer;
        let num = $(this).index();
        questionList[nowQuestion].click = num;

        $(this).append(strClass);

        //일반검정일 경우
        if(2 == examMode || 4 == examMode)
        {
            if(answer != num)
                questionList[nowQuestion].ox = false;
        }
        //연습 검정일 경우
        else if(1 == examMode || 3 == examMode)
        {
            $("#ox").css("display","block");
            if(answer == num)
            {
                $("#ox").removeClass("redText");
                $("#ox").addClass("greenText");
                $("#ox").html("O");
                $("#ox").fadeOut(timeDelay);
            }
            else
            {
                $(".example > .exampleBox").eq(answer).addClass("redBorder");
    
                $("#ox").removeClass("greenText");
                $("#ox").addClass("redText");
                $("#ox").html("X");
                $("#ox").fadeOut(timeDelay);
    
                questionList[nowQuestion].ox = false;
            }

            setTimeout(function()
            {    
                nowQuestion++;
                showQuestion();
    
            }, timeDelay);
        }

    });
}

function showQuestion()
{

    //일반검정일 경우 
    if(2 == examMode || 4 == examMode)
    {
        //첫 문제일시 이전 화살표 제거
        if(0 == nowQuestion)
            $("#leftBtn").css("display", "none");
        else
            $("#leftBtn").css("display", "block");

        //마지막 문제일시 다음 화살표 제거
        if(nowQuestion + 1 == questionCount)
            $("#rightBtn").css("display", "none");
        else
            $("#rightBtn").css("display", "block");
    }

    $("#persentText").html(questionList[nowQuestion].percentage);
    $("#allQuestion").html(questionCount);
    $("#nowQuestion").html(nowQuestion + 1);

    $("#hilagana").html(questionList[nowQuestion].example[lanMode]);
    $("#Furagana").html(questionList[nowQuestion].example2[lanMode]);

    if(questionList[nowQuestion].example[lanMode] == questionList[nowQuestion].example2[lanMode])
        $("#Furagana").css("visibility", "hidden");
    else
        $("#Furagana").css("visibility", "visible");

    $(".example > .exampleBox").eq(0).html(questionList[nowQuestion].select1[lanMode]);
    $(".example > .exampleBox").eq(1).html(questionList[nowQuestion].select2[lanMode]);
    $(".example > .exampleBox").eq(2).html(questionList[nowQuestion].select3[lanMode]);
    $(".example > .exampleBox").eq(3).html(questionList[nowQuestion].select4[lanMode]);

    if(-1 != questionList[nowQuestion].click)
        $(".example > .exampleBox").eq(questionList[nowQuestion].click).append(strClass);

    changePersentColor();
    changeFontSize();
}

function overlapCheck(tempList, RandVal)
{
    let listLen = questionList.length;
    for(let i = 0; i < listLen; i++)
    {
        if(wordList[tempList[RandVal]].hiragana == questionList[i].example[0])
        {
            for(let j = 0; j < 4; j++)
            {
                if(j != RandVal)
                {
                    if(true == overlapCheck2(tempList, j))
                        return j;
                }
            }

            return -1;
        }
    }

    return RandVal;
}

function overlapCheck2(tempList, RandVal)
{
    let listLength = questionList.length;
    for(let i = 0; i < listLength; i++)
    {
        if(wordList[tempList[RandVal]].hiragana == questionList[i].example[0])
            return false;
    }

    return true;
}

function makeQuestion()
{
    let koreanCollection = ["먹다", "마시다", "놀다", "타다", "가다", "하다", "만나다", "이야기하다", "사다", "팔다", "기다리다", "가리키다", "가르치다", "외우다", "비싸다", "싸다", "낮다", "맛있다", "맛없다", "크다", "작다", "어렵다", "쉽다", "새롭다", "오래되다", "길다", "짧다", "많다", "적다", "재미있다", "재미없다", "좋다", "나쁘다", "이르다", "빠르다", "가깝다", "멀다", "무겁다", "뜨겁다", "차갑다", "굵다", "가늘다", "밝다", "어둡다", "기쁘다", "슬프다", "깊다", "두껍다", "얇다", "약하다", "아프다", "바쁘다", "위험하다"];
    let hiraganaCollection = ["食べる", "飲む", "遊ぶ", "乗る", "行く", "する", "会う", "話す", "買う", "売る", "待つ", "指す", "教える", "覚える", "高い", "安い", "低い", "おいしい", "まずい", "大きい", "小さい", "難しい", "易しい", "新しい", "古い", "長い", "短い", "多い", "少ない", "おもしろい", "つまらない", "いい", "わるい", "早い", "速い", "近い", "遠い", "重い", "熱い", "冷たい" ,"太い", "細い", "明るい", "暗い", "うれしい", "かなしい", "深い", "厚い", "薄い", "弱い", "痛い", "忙しい", "危ない"];
    let furaganaCollection = ["たべる", "のむ", "あそぶ", "のる", "いく", "する", "あう", "はなす", "かう", "うる", "まつ", "さす", "おしえる", "おぼえる", "たかい", "やすい", "ひくい", "おいしい", "まずい", "おおきい", "ちいさい", "むずかしい", "やさしい", "あたらしい", "ふるい", "ながい", "みじかい", "おおい", "すくない", "おもしろい", "つまらない", "いい", "わるい", "はやい", "はやい", "ちかい", "とおい", "おもい", "あつい", "つめたい", "ふとい", "ほそい", "あかるい", "くらい", "うれしい", "かなしい", "ふかい", "あつい", "うすい", "よわい", "いたい", "いそがしい", "あぶない"];

    for(let i = 0; i < koreanCollection.length; i++)
    {
        let word = {};
        word.korean = koreanCollection[i];
        word.hiragana = hiraganaCollection[i];
        word.furagana = furaganaCollection[i];

        wordList.push(word);
    }

    for(let i = 0; i < questionCount; i++)
    {
        let len = koreanCollection.length;
        let tempList = [];

        //문제 만들때 보기 4개 중복 체크 
        for(let j = 0; j < 4; j++)
        {
            let RandVal = Math.floor(Math.random() * len);
            let check = false;

            for(let k = 0; k < tempList.length; k++)
            {
                if(tempList[k] == RandVal)
                {
                    check = true;
                    j--;
                    break;
                }
            }

            if(false == check)
                tempList.push(RandVal);
        }
        
        let RandVal = Math.floor(Math.random() * 4);

        //문제 중복체크
        RandVal = overlapCheck(tempList, RandVal)
        if(-1 == RandVal)
        {
            i--;
            continue;
        }

        let question = {};
        question.example = [wordList[tempList[RandVal]].hiragana, wordList[tempList[RandVal]].korean];
        question.example2 = [wordList[tempList[RandVal]].furagana, ""];
        question.select1 = [wordList[tempList[0]].korean, wordList[tempList[0]].hiragana];
        question.select2 = [wordList[tempList[1]].korean, wordList[tempList[1]].hiragana];
        question.select3 = [wordList[tempList[2]].korean, wordList[tempList[2]].hiragana];
        question.select4 = [wordList[tempList[3]].korean, wordList[tempList[3]].hiragana];
        question.answer = RandVal;
        question.click = -1;
        question.ox = true;

        question.percentage = Math.floor(Math.random() * 101);
        questionList.push(question);
    }
}

function getMode(){
    let mode = getQuerystring("mode");
    let language = getQuerystring("language");
    let tempMode = 0;   // 1: 히라가나 연습검정
                        // 2: 히라가나 일반검정
                        // 3: 한글 연습검정
                        // 4: 한글 일반검정

    if("hiragana" == language)
    {
        if("example" == mode)
            tempMode = 1;
        else if("normal" == mode)
            tempMode = 2;
    }
    else if("korean" == language)
    {
        if("example" == mode)
            tempMode = 3;
        else if("normal" == mode)
            tempMode = 4;
    }

    return tempMode;
}

function getQuerystring(paramName){ 

    let _tempUrl = window.location.search.substring(1); 
    let _tempArray = _tempUrl.split('&');

    for(let i = 0; _tempArray.length; i++) 
    {
        let _keyValuePair = _tempArray[i].split('='); 

        if(_keyValuePair[0] == paramName)
            return _keyValuePair[1];
    }
}

function changePersentColor(){

    $(".correctPercent").removeClass("greenText");
    $(".correctPercent").removeClass("redText");
    $(".exampleBox").removeClass("redBorder");

    let persent = $("#persentText").text();
    if(50 <= persent)
        $(".correctPercent").addClass("greenText");
    else
        $(".correctPercent").addClass("redText");
}

function changeFontSize(){
    let hilaganaLen = $(".questionBox #hilagana").text().length;
    
    $("#Furagana").removeClass("largeText-2");
    $("#Furagana").removeClass("largeText-1");
    $("#Furagana").removeClass("largeText0");
    $("#Furagana").removeClass("largeText1");

    $("#hilagana").removeClass("largeText");
    $("#hilagana").removeClass("largeText1");
    $("#hilagana").removeClass("largeText2");
    $("#hilagana").removeClass("largeText3");
    $("#hilagana").removeClass("largeText4");

    if(10 < hilaganaLen)
    {
        $("#Furagana").addClass("largeText-2");
        $("#hilagana").addClass("largeText");
    }
    else if(7 < hilaganaLen)
    {
        $("#Furagana").addClass("largeText-1");
        $("#hilagana").addClass("largeText1");
    }
    else if(5 < hilaganaLen)
    {
        $("#Furagana").addClass("largeText");
        $("#hilagana").addClass("largeText2");
    }
    else if(4 < hilaganaLen)
    {
        $("#Furagana").addClass("largeText1");
        $("#hilagana").addClass("largeText3");
    }
    else
    {
        $("#Furagana").addClass("largeText1");
        $("#hilagana").addClass("largeText4");
    }

    $(".example > .exampleBox").each(function(){
        let exampleLen = $(this).text().length;

        $(this).removeClass("largeText-3");
        $(this).removeClass("largeText-2");
        $(this).removeClass("largeText-1");
        $(this).removeClass("largeText");
        $(this).removeClass("largeText1");

        if(8 < exampleLen)
            $(this).addClass("largeText-3");
        else if(5 < exampleLen)
            $(this).addClass("largeText");
        else
            $(this).addClass("largeText1");
    });
}