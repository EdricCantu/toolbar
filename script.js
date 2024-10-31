var helperOption = undefined;
var toolbar = document.getElementById("toolbar");
var helperToolbar = document.getElementById("helperToolbar");
var spreadHelper = document.getElementById("spreadHelper");
let json;
function removeSelect(){
  toolbar.children[toolbar.select].removeAttribute("active");
  helperToolbar.children[toolbar.select].removeAttribute("active");
  var clone = toolbar.children[toolbar.select].cloneNode(true);
  clone.removeAttribute("title");
  helperToolbar.children[toolbar.select].replaceWith(clone);
  delete toolbar.select;
}

function reset(){
  if("select" in toolbar) removeSelect();
  for(const helper of [...helperToolbar.children]){
    if(helper.getAttribute("active") !== null){
      helper.removeAttribute("active");
      break;
    }
  }
  spreadHelper.innerHTML = "";
  helperOption = undefined;
}



function toolBarClick(e){
  if("select" in toolbar)
    if(!(([...toolbar.children].includes(e.target)) || (helperToolbar.contains(e.target)) || spreadHelper.contains(e.target))){
      removeSelect();
      helperOption = undefined;
      spreadHelper.innerHTML = "";
    };
  if(toolbar.contains(e.target)){
    helperOption = undefined;
    spreadHelper.innerHTML = "";
    var ch = e.target.parentElement.children;
    var index = [...ch].indexOf(e.target);
    var oldSel = (toolbar?.select === index);
    if("select" in toolbar) removeSelect();
    if(oldSel) return;
    toolbar.children[index].setAttribute("active", "");
    var helperNode = helperToolbar.children[index];
    helperNode.setAttribute("active", "");
    toolbar.select = index;
    helperNode.innerHTML = '';
    for(const next of json[index+2].slice(2)){//WWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWW
      switch(next.__proto__.constructor.name){
        case "Object":
          console.log(next);
          break;
        case "Array":
          var option = document.createElement('DIV');
          option.innerHTML = next[0];
          if((typeof next?.[1] === "string") && (next?.[1]?.length > 0)) option.title = next[1];
          option.classList.add("option");
          helperNode.appendChild(option);
          break;//tf I seriously have to break; 
        case "Number":
          funArr[next]();
          break;
        case "Function":
          next();
          break;
        case "String":
          console.log(next);  //just some random infos.
          break;
      }
    }
  }
  if(helperToolbar.contains(e.target)){
    if(helperOption){
      if(helperOption === e.target){//unselect helper option
        helperOption = undefined;
        e.target.removeAttribute("active");
        spreadHelper.innerHTML = "";
      }else{//select a new helper
        helperOption.removeAttribute("active");
        e.target.setAttribute("active", "");
        helperOption = e.target;
        spreadHelper.innerHTML = "";
        newSpread(e.target);
      }
    }else{// if helper option wasnt selected yet
      helperOption = e.target;
      e.target.setAttribute("active", "");
      newSpread(e.target);
    }
  }
  if(spreadHelper.contains(e.target)){
    if(e.target.getAttribute("active") !== null){// unset active
      e.target.removeAttribute("active");
      while(e.target.parentElement !== spreadHelper.lastChild) spreadHelper.removeChild(spreadHelper.lastChild);
    }else{
      const helpers = [...e.target.parentElement.children];
      for(const helper in helpers/*length is counted...*/){
        if(helpers[helper].getAttribute("active") !== null){
          helpers[helper].removeAttribute("active");
          break;
        }
      }
      while(e.target.parentElement !== spreadHelper.lastChild) spreadHelper.removeChild(spreadHelper.lastChild);
      e.target.setAttribute("active", "");
      newSpread(e.target);
    }
  }
};
function getList(target){
  var firstIndex = toolbar.select;
  var secondIndex = [...helperToolbar.children[toolbar.select].children];
  for(const helperOpt in secondIndex){
    if(secondIndex[helperOpt].getAttribute("active") !== null){
      secondIndex = parseInt(helperOpt);
      break;
    }
  }
  if(helperToolbar.contains(target)){
    return json[firstIndex+2][secondIndex+2].slice(2);
  }else{
    var helpingIndex = ([...spreadHelper.children].indexOf(target.parentElement)) +1;
    var helperList = [];
    function whl(){
      var helps = [...spreadHelper.children[helpingIndex].children];
      for(const helper in helps){
        if(helps[helper].getAttribute("active") !== null){
          helperList.push(parseInt(helper));
          break;
        }
      }
    }
    if(helpingIndex === 0) whl();
    while(helpingIndex-- > 0) whl();
    helperList = [firstIndex, secondIndex, ...helperList.reverse()];
    console.log('helper:', helperList);
    var find = json;
    for(const index of helperList){
      find = find[index+2];
    }
    console.log('find:', find);
    var ret = [];
    for(var found of find.slice(2)){
      switch(found.__proto__.constructor.name){
        case "Object":
          console.log(found);
          break;
        case "Array":
          ret.push(found);
          break;//tf I seriously have to break; 
        case "Number":
          funArr[found]();
          break;
        case "Function":
          found();
          break;
        case "String":
          console.log(found);  //just some random infos.
          break;
      }
    }
    return ret;
  }
}
function newSpread(target){
  if(helperToolbar.contains(target)) spreadHelper.innerHTML = "";
  var helper = document.createElement("DIV");
  for(const item of getList(target)){
    var secondHelper = document.createElement("DIV");
    secondHelper.innerHTML = item[0];
    helper.appendChild(secondHelper);
  }
  spreadHelper.appendChild(helper);
  var rect = target.getBoundingClientRect();
  helper.style.top = rect.y + "px";
  helper.style.left = (rect.x + rect.width +1) + "px";
}

















json = eval(await(await fetch("toolbar.js")).text());

for (let button of json.slice(2)) {
  var element = document.createElement("DIV");
  element.innerHTML = button[0];
  
  helperToolbar.appendChild(element.cloneNode(true));
  
  if(typeof button?.[1] === "string" && button?.[1]?.length > 0) element.title = button[1];
  toolbar.appendChild(element);
}
document.addEventListener("click", toolBarClick);