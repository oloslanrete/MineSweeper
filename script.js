//지뢰찾기 게임판을 2차원 배열로 저장
var boardArr;
//게임이 진행중인지 정지된 상태인지
var game_paused = true;

function start_game(){
    var i;
    var j;
    //지뢰찾기 게임판 크기 
    //초급 난이도 기준. TODO 난이도에 따라 조정되는 기능 추가
    var size = 9;
    var mine_count = 10;

    //크기만큼 배열 할당
    boardArr = new Array(size);
    for(i=0; i<size; i++)
    {
        boardArr[i] = new Array(size);
    }

    //현재 테이블의 row 수 세기
    var table = document.getElementById("game_table");
    var tbody = document.getElementById("game_table_body");
    var cell_count = tbody.childElementCount;
    
    //debug
    //alert(cell_count);

    //게임 보드 초기화 작업
    var temparr = new Array(size*size);
    for(i=0; i<size*size; i++)
    {
        temparr[i] = i;
    }
    var tempindex;
    for(i=0; i<mine_count; i++)
    {
        tempindex = Math.floor(Math.random() * temparr.length);
        boardArr[Math.floor(temparr[tempindex]/size)][temparr[tempindex]%size] = "@";
    }
    //debug
    for(i=0; i<size; i++)
    {
        console.log(boardArr[i]);
    }
    

    //table cells 초기화 작업. 첫 화면의 테이블은 cell index가 없으므로 새로 그린다.
    var newTbody=document.createElement("tbody");
    var tempTr;
    var tempTh;
    newTbody.setAttribute("id","game_table_body");
    for(i=0; i<size; i++)
    {
        tempTr=document.createElement("tr");
        for(j=0; j<size; j++)
        {
            tempTh=document.createElement("th");
            tempTh.setAttribute("id","cell"+i+","+j);
            tempTh.setAttribute("class","cell");
            
            tempTr.appendChild(tempTh);
        }
        newTbody.appendChild(tempTr);
    }
    table.replaceChild(newTbody, tbody);
    game_paused=false;

    cells = document.getElementsByClassName("cell");
    console.log(cells)
    for(let cell of cells)
    {
        cell.addEventListener("click", function(e){
            if(!game_paused)
            {
                CheckCell(cell.id);
            }
        })
        
    }
    return;
}
function CheckCell(id)
{
    alert(id);
}
