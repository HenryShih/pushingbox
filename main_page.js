"use strict";
//macro
const row_num = 8;
const col_num = 10;
//defines variables
let map_node = document.getElementById("map");
map_node = document.getElementById("map");

let head_node = document.getElementById("head");
let control_bar_node = document.getElementById("control_bar");
let blocks = [];
    for(let i =1; i <= row_num ; i++){
        blocks[i] = [];
    }

let map;

//loading XML information externally
let xhttp = new XMLHttpRequest();
xhttp.onreadystatechange = function(){
    if(this.readyState === 4 && this.status === 200){
        let xml_doc = this.responseXML;
        map = xml_doc.getElementsByTagName("map");
        //console.log(map.length);
    }
}

xhttp.open("GET", "https://henryshih.github.io/pushingbox/map_information.xml", true);
xhttp.send();



let virtual_map = [];
    for(let i = 1; i <= row_num ; i++){
        virtual_map[i] = [];
    }

let current_level;
let cnt_steps;
let counter_node = document.createElement("div");
counter_node.appendChild(document.createTextNode(""));
counter_node.id = "counter";



//construct img class
class img{
    constructor(i, j, k){
        this.node = document.createElement("img");
        this.node.id = i;
        this.node.className = "picture" + " " + j;
        this.node.src = "resources/" + k;
        this.x;
        this.y;
    }
    move(i){
        if(i === "right"){
            this.y += 1;
            this.node.style.left = parseInt(this.node.style.left)+50+"px";
        }
        if(i === "left"){
            this.y -= 1;
            this.node.style.left = parseInt(this.node.style.left)-50+"px";
        }
        if(i === "up"){
            this.x -= 1;
            this.node.style.top = parseInt(this.node.style.top)-50+"px";
        }
        if(i === "down"){
            this.x += 1;
            this.node.style.top = parseInt(this.node.style.top)+50+"px";
        }
    }
}
//construct box and man
let man = new img("man", "","正面.png");
let box = [];
let target = [];


//construct button class
class button{
    constructor(i, j, k){
        this.node = document.createElement("button");
        this.node.innerText = i;
        this.node.id = j;
        this.node.className = k;
    }

}

//construct buttons
let btn_log_in = new button("LOG IN", "log_in");
let btn_rank = new button("RANK", "rank");
let btn_enter = new button("ENTER", "enter");
let btn_back = new button("BACK", "back");
let btn_log_out = new button("LOG OUT", "log_out");
let btn_level = [];
    for(let i = 1; i <= 30; i++){
        btn_level[i] = new button(i, "level_"+i, "level_btn");
    }
let btn_level_page = new button("SELECT LEVEL", "level");
let btn_reset = new button("RESET", "reset");
let btn_next = new button("NEXT", "next");
let btn_again = new button("AGAIN", "again");
let btn_home = new button("HOME", "home");
let btn_continue = new button("CONTINUE", "continue")


//construct win div
let win_node = document.createElement("div");
win_node.id = "win";
win_node.appendChild(btn_next.node);
win_node.appendChild(btn_again.node);
win_node.appendChild(btn_home.node);

//construct how to play div
let btn_how = document.getElementById("information");
let how_node = document.createElement("div");
how_node.id = "how";
how_node.appendChild(document.createElement("div"));
how_node.firstChild.id = "how_title";
how_node.firstChild.appendChild(document.createTextNode("HOW TO PLAY"));
how_node.appendChild(document.createElement("p"));
how_node.childNodes[1].id = "how_text";
how_node.childNodes[1].appendChild(document.createTextNode("The objective is to put all the boxes in the marked positions by pushing one at a time.\nGood luck!"));
how_node.appendChild(btn_continue.node);




//construct block prototype
class block{
    constructor(){
        this.node = document.createElement("div");
        this.type;
        this.x ;
        this.y ;
        this.node.className = "block";
    }
    setBlockType(i){
        switch(i){
            case "grass"    :
                this.type = "grass";
                this.node.className = "grass block";
                break;
            case "wall"     :
                this.type = "wall";
                this.node.className = "wall block";
                break;
            case "road"     :
                this.type = "road";
                this.node.className = "road block";
                break;
        }
    }
    setBlockBackground(){
        switch(this.type){
            case "grass"    :
                this.node.style.backgroundImage = "url('resources/grass.jpg')";
                this.node.style.backgroundSize = "100px";
                break;
            case "wall"     :
                this.node.style.backgroundImage = "url('resources/wall.jpg')";
                this.node.style.backgroundSize = "100px";
                break;
            case "road"     :
                this.node.style.backgroundImage = "url('resources/road.jpg')";
                this.node.style.backgroundSize = "50px";
                break;
        }
    }

}

function generate_main_page(){
    head_node.innerText = "\n~~PUSHING BOX~~";
    head_node.style.backgroundImage = "";
    map_node.innerHTML = "";
    control_bar_node.innerHTML = "";
    control_bar_node.style.backgroundImage = "";
    map_node.appendChild(btn_log_in.node);
    map_node.appendChild(btn_rank.node);
}

function generate_log_in_page(){
    head_node.innerText = "\nUSER NAME";
    map_node.innerHTML = "";
    control_bar_node.innerHTML = "";
    map_node.appendChild(btn_back.node);
    map_node.appendChild(btn_enter.node);
}

function generate_level_page(){
    head_node.innerText = "SELECT LEVEL"
    head_node.style.backgroundImage = "url('resources/control_bar.jpg')"
    map_node.innerHTML = "";
    control_bar_node.innerHTML = "";
    control_bar_node.style.backgroundImage = "url(\"resources/control_bar.jpg\")";
    for(let i = 1; i <= 30; i++){
        map_node.appendChild(btn_level[i].node);
    }
    control_bar_node.appendChild(btn_log_out.node);

}

function generate_map(level_num) {
    current_level = level_num;
    cnt_steps = 0;
    counter_node.firstChild.nodeValue = "STEPS : " + cnt_steps;
    head_node.innerText = "LEVEL" + " " + current_level;
    map_node.innerHTML = "";
    for (let i = 1; i <= row_num; i++) {
        for (let j = 1; j <= col_num; j++) {
            blocks[i][j] = new block();
            map_node.appendChild(blocks[i][j].node);
            blocks[i][j].setBlockType("grass");
            blocks[i][j].x = i;
            blocks[i][j].y = j;
        }
    }

    let periphery_wall = map[level_num].getElementsByTagName("periphery_wall");
    let periphery_wall_x = periphery_wall[0].getElementsByTagName("x");
    let periphery_wall_y = periphery_wall[0].getElementsByTagName("y");
    let internal_wall = map[level_num].getElementsByTagName("internal_wall");
    let internal_wall_x = internal_wall[0].getElementsByTagName("x");
    let internal_wall_y = internal_wall[0].getElementsByTagName("y");


    //setup walls
    for(let i = 0; i < periphery_wall_x.length-1; i++){
        if(periphery_wall_x[i].firstChild.nodeValue === periphery_wall_x[i+1].firstChild.nodeValue){
            if(parseInt(periphery_wall_y[i].firstChild.nodeValue) > parseInt(periphery_wall_y[i+1].firstChild.nodeValue)){
                //console.log(periphery_wall_y[i].firstChild.nodeValue + periphery_wall_y[i+1].firstChild.nodeValue);
                let j = parseInt(periphery_wall_y[i+1].firstChild.nodeValue);
                while(j != periphery_wall_y[i].firstChild.nodeValue){
                    //console.log(periphery_wall_x[i].firstChild.nodeValue, j);
                    blocks[periphery_wall_x[i].firstChild.nodeValue][j].setBlockType("wall");
                    j++;

                }
            }
            else{
                let j = parseInt(periphery_wall_y[i].firstChild.nodeValue);
                while(j != periphery_wall_y[i+1].firstChild.nodeValue){
                    //console.log(periphery_wall_x[i].firstChild.nodeValue, j);
                    blocks[periphery_wall_x[i].firstChild.nodeValue][j].setBlockType("wall");
                    j++;
                }
            }
        }

        else{
            if(parseInt(periphery_wall_x[i].firstChild.nodeValue) > parseInt(periphery_wall_x[i+1].firstChild.nodeValue)){
                let j = parseInt(periphery_wall_x[i+1].firstChild.nodeValue);
                while(j != periphery_wall_x[i].firstChild.nodeValue){
                    blocks[j][periphery_wall_y[i].firstChild.nodeValue].setBlockType("wall");
                    j++;

                }
            }
            else{
                let j = parseInt(periphery_wall_x[i].firstChild.nodeValue);
                while(j != periphery_wall_x[i+1].firstChild.nodeValue){
                    blocks[j][periphery_wall_y[i].firstChild.nodeValue].setBlockType("wall");
                    j++;

                }
            }
        }
       blocks[periphery_wall_x[i].firstChild.nodeValue][periphery_wall_y[i].firstChild.nodeValue].setBlockType("wall");
    }

    generate_road(parseInt(periphery_wall_x[0].firstChild.nodeValue)+1, parseInt(periphery_wall_y[0].firstChild.nodeValue)+1);



    for(let i = 0; i < internal_wall_x.length; i++){
        blocks[internal_wall_x[i].firstChild.nodeValue][internal_wall_y[i].firstChild.nodeValue].setBlockType("wall");
    }

    for (let i = 1; i <= row_num; i++) {
        for (let j = 1; j <= col_num; j++) {
            blocks[i][j].setBlockBackground();
            //initialize virtual_map
            virtual_map[i][j] = 0;
            if(blocks[i][j].type === "wall"){
                virtual_map[i][j] = 1;
            }
        }
    }

    //setup for wall's borders
    for(let i = 1; i <= row_num; i++ ){
        for(let j = 1; j <= col_num; j++){
            if(blocks[i][j].type === "wall"){
                blocks[i][j].node.style.border = "2px solid black";
                if(i !== 1){
                    if (blocks[i - 1][j].type === "wall") blocks[i][j].node.style.borderTop = "0";
                }
                if(i !== row_num){
                    if (blocks[i + 1][j].type === "wall") blocks[i][j].node.style.borderBottom = "0";
                }
                if(j !== 1){
                    if (blocks[i][j - 1].type === "wall") blocks[i][j].node.style.borderLeft = "0";
                }
                if(j !== col_num){
                    if (blocks[i][j + 1].type === "wall") blocks[i][j].node.style.borderRight = "0";
                }
            }
        }
    }
    //setup for border radius




    //append man
    man.node.src = "resources/正面.png";
    map_node.appendChild(man.node);
    man.x = parseInt(map[level_num].getElementsByTagName("man")[0].getElementsByTagName("x")[0].firstChild.nodeValue);
    man.y = parseInt(map[level_num].getElementsByTagName("man")[0].getElementsByTagName("y")[0].firstChild.nodeValue);
    man.node.style.left = 50 * man.y - 50 +"px";
    man.node.style.top = 50 * man.x - 50 +"px";

    //append boxes
    while(box.length !== 0){
        box.pop();
    }
    let box_x = map[level_num].getElementsByTagName("box")[0].getElementsByTagName("x");
    let box_y = map[level_num].getElementsByTagName("box")[0].getElementsByTagName("y");
    for(let i = 0 ; i < box_x.length; i++){
        box.push(new img( "", "box","box.JPG"));
        map_node.appendChild(box[i].node);
        box[i].x = parseInt(box_x[i].firstChild.nodeValue);
        box[i].y = parseInt(box_y[i].firstChild.nodeValue);
        virtual_map[box[i].x][box[i].y] = 2;
        box[i].node.style.left = 50 * box[i].y - 50 +"px";
        box[i].node.style.top = 50 * box[i].x - 50 +"px";
     }

    //append target
    while(target.length !== 0){
        target.pop();
    }
    let target_x = map[level_num].getElementsByTagName("target")[0].getElementsByTagName("x");
    let target_y = map[level_num].getElementsByTagName("target")[0].getElementsByTagName("y");
    for(let i = 0 ; i < target_x.length; i++){
        target.push(new img( "", "target","target.JPG"));
        map_node.appendChild(target[i].node);
        target[i].x = parseInt(target_x[i].firstChild.nodeValue);
        target[i].y = parseInt(target_y[i].firstChild.nodeValue);
        target[i].node.style.left = 50 * target[i].y - 50 +"px";
        target[i].node.style.top = 50 * target[i].x - 50 +"px";
    }
    window.addEventListener("keydown", run, false);
    if_win();
    //console.log(virtual_map);
}

function generate_road(i, j){
    if(blocks[i][j].type !== "grass" ){
        return;
    }
    else{
        blocks[i][j].setBlockType("road");
        generate_road(i+1, j+1);
        generate_road(i, j+1);
        generate_road(i+1, j);
        generate_road(i-1, j-1);
    }
}

function generate_control_bar(){
    control_bar_node.innerHTML = "";
    //append counter
    control_bar_node.appendChild(counter_node);
    control_bar_node.appendChild(btn_level_page.node);
    control_bar_node.appendChild(btn_reset.node);
}

function renew_virtual_map() {
    for (let i = 1; i <= row_num; i++) {
        for (let j = 1; j <= col_num; j++) {
            if (virtual_map[i][j] === 2) {
                virtual_map[i][j] = 0;
            }
        }
        for(let j = 0 ;j < box.length; j++){
            virtual_map[box[j].x][box[j].y] = 2;
        }
    }
}

function man_move_img(move){
    switch(move){
        case "up"   :
            $('#man').attr("src", "resources/back.png");
            break;
        case "down" :
            $('#man').attr("src", "resources/正面.png");
            break;
        case "right" :
            $('#man').attr("src", "resources/right2.png");
            setTimeout(function(){$('#man').attr("src", "resources/right1.png")}, 150);
            break;
        case "left" :
            $('#man').attr("src", "resources/left2.png");
            setTimeout(function(){$('#man').attr("src", "resources/left1.png")}, 150);
            break;
    }
}

function man_move(move){
    let next_x, next_y;
    switch(move){
        case "up"   :
            next_x = man.x - 1;
            next_y = man.y ;
            break;
        case "down" :
            next_x = man.x + 1;
            next_y = man.y;
            break;
        case "right" :
            next_x = man.x ;
            next_y = man.y + 1;
            break;
        case "left" :
            next_x = man.x ;
            next_y = man.y - 1;
            break;
    }
    man_move_img(move);
    if(virtual_map[next_x][next_y] === 0 || virtual_map[next_x][next_y] === 3){
        man.move(move);
        cnt_steps += 1;
    }
    else{
        if(virtual_map[next_x][next_y] === 1){
            return;
        }
        else{
            if(virtual_map[2*next_x-man.x][2*next_y-man.y] === 0 || virtual_map[2*next_x-man.x][2*next_y-man.y] === 3){
                man.move(move);
                for(let i = 0 ; i < box.length; i++){
                    if(box[i].x === next_x && box[i].y === next_y){
                        box[i].move(move);
                    }
                }
                cnt_steps += 1;
                renew_virtual_map();
            }
            else{
                return;
            }
        }
    }
    counter_node.firstChild.nodeValue = "STEPS : " + cnt_steps;
    if_win();
}

function run(e){
    switch (e.code){
        case "ArrowLeft"    :
            man_move("left");
            break;
        case "ArrowRight"   :
            man_move("right");
            break;
        case "ArrowUp"      :
            man_move("up");
            break;
        case "ArrowDown"    :
            man_move("down");
            break;
    }
}

function if_win(){
    let cnt = 0;
    for(let i = 0; i < target.length; i++){
        if(virtual_map[target[i].x][target[i].y] === 2){
            cnt += 1;
            target[i].node.src = "resources/correct.png";
        }
        else {
            target[i].node.src = "resources/target.JPG";
        }
    }
    if(cnt === target.length){
        win();
    }
}

function win(){
    window.removeEventListener("keydown", run, false);
    win_node.style.display = "none";
    map_node.appendChild(win_node);
    $('#win').delay(500).fadeIn("slow");
}

function generate_how(){
    how_node.style.display = "none";
    map_node.appendChild(how_node);
    $('#how').fadeIn("fast");
}

function close_how(){
    map_node.removeChild(how_node);
}

//event handler registration
    //btn_log_in
btn_log_in.node.addEventListener("click", generate_log_in_page, false);
    //btn_back
btn_back.node.addEventListener("click", generate_main_page, false);
    //btn_enter
btn_enter.node.addEventListener("click", generate_level_page, false);
    //btn_log_out
btn_log_out.node.addEventListener("click", generate_main_page, false);
    //btn_level_page
btn_level_page.node.addEventListener("click", generate_level_page, false);
    //level_btn
for(let i = 1; i <= 30; i++){
    btn_level[i].node.addEventListener("click", function(){generate_map(i); generate_control_bar();}, false);
}
    //btn_reset
btn_reset.node.addEventListener("click", function(){generate_map(current_level)})
    ///move!!!
window.addEventListener("keydown", run, false);
    //btn_home
btn_home.node.addEventListener("click", generate_level_page, false);
    //btn_again
btn_again.node.addEventListener("click", function(){generate_map(current_level)}, false);
    //btn_next
btn_next.node.addEventListener("click", function(){generate_map(current_level+1)}, false);
    //btn_how
btn_how.addEventListener("click", generate_how, false);
    //btn_back2
btn_continue.node.addEventListener("click", close_how, false);
//jQuery
$('button').hover(
    function(){
        $(this).addClass('active');
    },
    function(){
        $(this).removeClass('active');
    }
);





//start function
    //first generate the main page
generate_main_page();



