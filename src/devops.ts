


/*
Lewis Wood
*/
"use strict";


interface _ActionKey {
  key: string;
  alt: boolean;
  ctrl: boolean;
  shift: boolean;
}

interface _Actions_Role { 
  "Toggle": boolean; 
  "key":_ActionKey;
  statusMessage?: Function;
 
} 

interface _Actions   { 
  mode: _Actions_Role;
        log:_Actions_Role;
       clear: _Actions_Role;
        share: _Actions_Role;
        keys: _Actions_Role;
        notes: _Actions_Role;
      }

type _Actions_Key  = keyof _Actions   ;  

type _DevElement  =  HTMLElement | null; 

interface _DevControls {
    root?: HTMLDivElement; // #devOpsRoot
  style?: HTMLStyleElement;     // style
  "container" ?: HTMLDivElement; 
  logContainer?: HTMLDivElement;  // #devOpsLogSection
  header?: HTMLHeadingElement;  // #devOpsHeading
  log?: HTMLParagraphElement;  // #devOpsLog
  clearButton?: HTMLButtonElement;
  notesContainer?: HTMLDivElement | null
  notesList?: HTMLUListElement;
  notesHeader?: HTMLHeadingElement;  
  hotKeysButton?: HTMLButtonElement;
}

class DevOps {
static mode: number = 1;
static modes =[ "disabled", "visible", "invisible"] // determines mode values and order 
static notes = true; // Wether or not to add a developers Notes and section
private static controls: _DevControls  = {
notesContainer: null,
}; // Controls
static actions: _Actions     =  { mode :    { "Toggle": true, "key": DevOps.newKey("D")}, 
log: { "Toggle": true, "key": DevOps.newKey("L")}, 
clear: { "Toggle": true, "key": DevOps.newKey("C")  }, 
share: { "Toggle": true, "key": DevOps.newKey("S")}, 
keys: { "Toggle": true, "key": DevOps.newKey("K")}, 
notes: { "Toggle": true, "key": DevOps.newKey("N")} }
private static activeActions: _Actions_Key[] = [];

constructor() {
throw new Error("Static class you cannot create an instance");
}; // constructor
static {
  DevOps.initialize(); 
};
private static initialize() {
  const dc = DevOps.controls;
  dc.root = <HTMLDivElement>document.querySelector("#devOpsRoot");
  if ( ! (dc.root)) DevOps.createRoot()  
  else {
    const dr = dc.root;
    dc.style = <HTMLStyleElement>dr.querySelector("style");;
    if (!(dc.style)) {DevOps.createStyle(); };
    
    dc.container = <HTMLDivElement>dr.querySelector("#devOpsContainer");
    if (!(dc.container)) {DevOps.createContainer();}
    else {
      DevOps.initLog(dr);
    DevOps.initNotes(dr);
  }; // devOps Containter
}; //devOpsRoot 
    let b: HTMLButtonElement =  <HTMLButtonElement>document.body.querySelector("#devOpsHotKeysButton");
if (!(b)) { 
b = document.createElement("button");
b.setAttribute("style", "position: absolute;left: 10000px ;width: 1px;");
b.setAttribute("id","devOpsHotKeysButton");
b.innerText = "GoTo DevOps Console";
dc.hotKeysButton = b;
const body = document.body;
body.insertBefore( b, body.children[0]);
}
dc.hotKeysButton = b;
if (b) b.onclick = (e) => { DevOps.hotKeyButtonAction(e);};

  DevOps.log("DevOps Loaded successfully.");
  
}; // Initialize()}
private  static initLog(  root: HTMLDivElement ) {
try {
  const dc = DevOps.controls  ;
  dc.logContainer = <HTMLDivElement>root.querySelector("#devOpsLogSection");
  if (!(dc.logContainer)) {DevOps.createLogSection(); }
  else {
  if (!(dc.header)) dc.header = <HTMLHeadingElement>root.querySelector("#devOpsHeading");
  if (!(dc.header)) {DevOps.createLogHeader(); } 
if (!(dc.log )) dc.log = <HTMLParagraphElement>root.querySelector("#devOpsLog");
  if (!(dc.log)) { DevOps.createLog();};
  if (! (dc.clearButton)) dc.clearButton = <HTMLButtonElement>root.querySelector("#devOpsClear")!;
  if (!(dc.clearButton)) { DevOps.createClearLog();};
}; // if containter

  if (dc.clearButton)      dc.clearButton.onclick = () => {DevOps.clearLog();};
    window.addEventListener( "keyup",(e)  => { DevOps.keyHandler(e);});
  DevOps.setActiveActions();
  DevOps.toggleMode(DevOps.mode, true);
} catch(e:any) {
console.log('DevOps.initLog error: '+ e.message);
}; //  catch
}; // initLog 

 private static initNotes(  root: HTMLElement ) {
try {
if (DevOps.notes) {
const dc = DevOps.controls;
if (!(dc.notesContainer)) dc.notesContainer = <HTMLDivElement>root.querySelector("#devOpsNotesContainer");
if (!(dc.notesContainer)) DevOps.createNoteContainer();
else {
dc.notesHeader = <HTMLHeadingElement>dc.notesContainer.querySelector("#devOpsNotesHeader");
if (dc.notesHeader) dc.notesHeader.setAttribute("tabindex", "0");  // allows focus from button

dc.notesList = <HTMLUListElement>root.querySelector("#devOpsNotesList");

}; // if notes containe
} else {
  DevOps.actions.notes.Toggle = false;
};// if notes enabled
} catch(e:any) {
console.log('DevOps.initNotes error: '+ e.message);
}; //  catch
}; // initNotes 

private static setHotKeysButtonCaption() {
try {
let caption = "Go to Dev Console";
if (DevOps.controls.hotKeysButton) {
  if (DevOps.modes[ DevOps.mode] === "disabled") caption = "Enable Dev Console"
  else if (DevOps.activeActions.length <= 0) caption = "Enable Dev Hot Keys";
if (DevOps.controls.hotKeysButton?.innerText != caption) DevOps.controls.hotKeysButton.innerText = caption;
};
} catch(e:any) {
  DevOps.log("setHotKeyButtonCapation error: "+ e.message);
};
} // setHotKeyButtonCaption

static  hotKeyButtonAction(  e : any) {
try {
    const dc = DevOps.controls;
if (DevOps.modes[DevOps.mode]  === "disabled"){
  DevOps.toggleMode();
} else {
  DevOps.setActiveActions();
  if (DevOps.activeActions.length > 0) DevOps.log("Hot Keys Enabled");
}


  if (dc.header) { 
    dc.header.focus();
  }
} catch(e:any) {
DevOps.log('DevOps.hotKeyButtonAction error: '+ e.message);
}; //  catch
}; // hotKeyButtonAction

static disableNotes() {
  DevOps.notes = false;
  DevOps.actions.notes.Toggle = false;
  if (DevOps.controls.notesContainer) {
    const nc = DevOps.controls.notesContainer;
    nc.parentNode?.removeChild(nc);
  }
  DevOps.log( "Notes deleted. Console full width.");
}

static logError(message:any) { DevOps.log(message);}; // DevOps.logError
  static log(message:any) {
    console.log("HelpLog: ", message);
  try {
    
    const hl = DevOps.controls.log;
  if (hl) {
      const cur = hl.innerHTML;
      hl.innerHTML = message + "<br/>" +cur;
  } // if 
  } // try
  catch(e:any) {
       console.log("HelpLog Error: ", e.message);    
       alert(e.message);
      }; 
  }; // log(message)
  static keyHandler(e: KeyboardEvent) {
    const matchKey = (e: KeyboardEvent, k: _ActionKey):boolean  => {
      return ((e.key === k.key) && (e.altKey === k.alt) && (e.ctrlKey === k.ctrl) && (e.shiftKey === k.shift)) ;
    }
DevOps.activeActions.forEach( (k) => {
const a = DevOps.actions[k];
if (matchKey(e,a.key)){
switch(k) {
  case "clear":
    DevOps.clearLog();
    break;
    case "mode":
      DevOps.toggleMode();
      break;
      case "share":
        DevOps.shareLog();
        break;
case "keys":
DevOps.disableKeys();
  break;
  case "notes":
  DevOps.disableNotes();
  break;
}

}
})
  }; keyHandler

  static disableKeys() {
    DevOps.activeActions = [];
    DevOps.log("Dev HotKeys disabled. Click enable button at very top to re-enable.");
    DevOps.setHotKeysButtonCaption();
  }

  static toggleMode(setMode?: number , silent = false) {
    try {
      DevOps.mode = (!(setMode  )? DevOps.mode + 1 :  setMode);
    if ((DevOps.mode > (DevOps.modes.length - 1) ) || (DevOps.mode < 0)) DevOps.mode = 0;
      const mode = ((DevOps.modes.length > 0) ? DevOps.modes[DevOps.mode]: 'empty')  
      const act = DevOps.actions.mode;
      if (!(act.statusMessage))  act.statusMessage = DevOps.log;
      const c = DevOps.controls.container;
    switch (mode) {
    case "empty":
      if (! silent )DevOps.log("Empty DevOps.modes: adding mode visible");
      DevOps.modes.push("visible");
      case "visible": 
      if (! silent )  act.statusMessage(`Enable Log: Visible`);

      if (c) {
      c.classList.remove("devOpsNotVisible");
      c.setAttribute("aria-hidden", "false");
      }
      break;
      case "invisible" :
        if (! silent ) act.statusMessage(`Log not visible or accessible without screen reader`);
        if (c) {
        c.classList.add("devOpsNotVisible");
      c.setAttribute("aria-hidden", "false");
        }
      break;
      case "disabled" :
        act.statusMessage(`Log disabled for everyone. Press alt plush shift + D to bring it back.`);
        setTimeout(() => {
          if (c) {
        c.classList.add("devOpsNotVisible");
      c.setAttribute("aria-hidden", "true");
          }
    },350);
      break;
      default :
      DevOps.log(`Invalid mode, ignoring value:${mode}  #${DevOps.mode}}`);
    }; // switch
    DevOps.setHotKeysButtonCaption();
      } catch(e:any) {
    DevOps.log("DevOps.toggleMode error: " + e.message);
      }; // catch
  }; // toggleMode
  static setAction(actionName: _Actions_Key   = "mode", key?: _ActionKey, statusMessage?: Function, toggle = true) {
    try {
      
    const act = DevOps.actions[actionName];
    
    act.Toggle = toggle;
    if (key) act.key = key;
    if (statusMessage) act.statusMessage = statusMessage;
    DevOps.setActiveActions();
    
    } catch(e:any) {
    DevOps.log('DevOps.setAction error: '+ e.message);
    }; //  catch
     }; // setAction


     static setActiveActions() {
      DevOps.activeActions = [];
      if (DevOps.actions.mode.Toggle) { DevOps.activeActions.push("mode");};
      if (DevOps.actions.clear.Toggle) { DevOps.activeActions.push("clear");};
      if (DevOps.actions.log.Toggle) { DevOps.activeActions.push("log");};
      if (DevOps.actions.share.Toggle) { DevOps.activeActions.push("share");};
      if (DevOps.actions.keys.Toggle) { DevOps.activeActions.push("keys");};
      if (DevOps.actions.notes.Toggle) { DevOps.activeActions.push("notes");};
      DevOps.setHotKeysButtonCaption();
     } 

     static clearLog()  {
      try {
        const hl = DevOps.controls.log;
      if (hl)   {
        hl.innerHTML ="Log Cleared" ;
      };  // if hl
    }   catch(e:any) {
        console.log("DevOps.clearLog error: " + e.message);
          }; // catch
     }; // clearLog
     static       shareLog()  {
      try {
       const hl = DevOps.controls.log;
      if (hl) {
        const act = DevOps.actions.share;
        if (act.statusMessage === null) act.statusMessage = DevOps.log;  
        
        const txt = hl.innerHTML.split("<br>");
        navigator.clipboard.writeText(txt.join("\n"));
        const sm = act.statusMessage;
        console.log("statusmessage: ", sm)
        if (sm){sm("Log shared to clipboard.");DevOps.log("copied to clipboard. should be there twice" + sm)}      
        else {DevOps.log("no sm. copied to clipboard.")};
      }
      } catch(e:any) {
      DevOps.log("DevOps.share error: " + e.message);
      }; // catch
       };  // share
       

    static newKey(key: string, alt = true, ctrl = false, shift = true) {
const k: _ActionKey= { key, alt, shift, ctrl};
return k;
    }

private static createRoot() {
  const dc = DevOps.controls;
  const dr = document.createElement("div");
  dc.root = dr;
  document.body.appendChild(dr);
  dr.setAttribute("id","devOpsRoot")
  dr.setAttribute("style","width: 100%;display : block;")
DevOps.createStyle();
DevOps.createContainer();
} 

private static createStyle() {
  const dc = DevOps.controls;
  dc.style = document.createElement("style");
  dc.root?.appendChild(dc.style);
  dc.style.innerText = `
  .devOpsNotVisible {
    transform: scale(0,0);
  z-index: 0;
  position: absolute;
  top: -10;
  left: -10;
}
.devOpsContainer {
    display : flex;
    flex-direction: row;
    border-width: 3px;
    border-style: outset;
    flex-direction: row;
margin: 5px;
padding: 5px;
background-color: #000080; 
color: yellow;

}
#devOpsLogSection {
    flex-direction: column;
    justify-self: left;;
}
.devOpsNoteContainer {
    display: flex;
    justify-self: right;
width : 600px;
font-size:larger;
border: solid;
}
  `
}

private static createContainer() {
  const dc = DevOps.controls;
  const c = document.createElement("div");
  dc.container = c;
  c.setAttribute("id", "devOpsContainer");
  c.setAttribute("class", "devOpsContainer");
  c.setAttribute("aria-hidden", "false");
  dc.root?.appendChild(c);;
  DevOps.createLogSection();
}

private static createLogSection() {
  const dc = DevOps.controls;
  const l = document.createElement("div");
  l.setAttribute("id","devOpsLogSection");
  dc.logContainer = l;
  dc.container?.appendChild(l);
  DevOps.createLogHeader();
  DevOps.createLog();
  DevOps.createClearLog();
}
private static createLogHeader() {
  const dc = DevOps.controls;
  const h = document.createElement("h5");
  dc.logContainer?.appendChild(h);
  dc.header = h;
  h.innerText = "DevOps Console";
  h.setAttribute("id", "devOpsHeading");
  h.setAttribute("tabindex", "0");
}
private static createLog() {
  const dc = DevOps.controls;
  const l = document.createElement("p");
  l.setAttribute("aria-live", "assertive");
  l.innerText = "";
  l.setAttribute("id", "devOpsLog");
  dc.logContainer?.appendChild(l);
  dc.log = l;

}
private static createClearLog() {
  const dc = DevOps.controls;
  const b = document.createElement("button");
  dc.logContainer?.appendChild(b);
  dc.clearButton = b;
  b.setAttribute("type","button")
  b.innerText = "Clear Console";
  b.setAttribute("id", "devOpsClear");
}


private static  createNoteContainer() {
  const dc = DevOps.controls;
  const n = document.createElement("div");
  dc.container?.appendChild(n);
  dc.notesContainer = n;
 n.setAttribute("id", "devOpsNotesContainer");
 n.setAttribute("class","devOpsNoteContainer");
 const h = document.createElement("h5");

 n.appendChild(h);
 h.innerText = "Developer Notebook";
 h.setAttribute("id","devOpsNotesHeader")
 h.setAttribute("tabindex", "0");
 dc.notesHeader = h;
 const l = document.createElement("ul");

 n.appendChild(l);
 l.setAttribute("id","devOpsNotesList")
 dc.notesList = l;
DevOps.addNote("Alt + shift + D  -  Toggle Developer Console ");
DevOps.addNote("Alt + shift + C -  Clear Developer Console");
DevOps.addNote("Alt + shift + S  -  Share Developer Console");
DevOps.addNote("Alt + shift + K  -  Disable all dev hot keys. Top button will allow you to re-enable.");
DevOps.addNote("Alt + shift + N  -  Delete ths notes section. Makes console full width.");
}

static addNote( note: string) {
  const n = DevOps.controls.notesList ;
  if (n) {
    const l = document.createElement("li");
    l.innerText = note;
    n.appendChild(l);
  }  else DevOps.log( "NoteList does not exist. Note not added.");
}

}; //  class devOps

/*
   Below is the HTML that devOps will automatically create.  You can place the  the devOpsRoot div anywhere in your HTML page.  DevOps will find it and add any mising elements. If not found it will be appended to the bottom of the web page. 

    <div id="devOpsRoot" style="width: 100%;display : block;">
        <style>
    .devOpsNotVisible {
        transform: scale(0,0);
      z-index: 0;
      position: absolute;
      top: -10;
      left: -10;
    }
    .devOpsContainer {
        display : flex;
        flex-direction: row;
        border-width: 3px;
        border-style: outset;
        flex-direction: row;
    margin: 5px;
    padding: 5px;
    background-color: #000080; 
    color: yellow;
    
    }
    #devOpsLogSection {
        flex-direction: column;
        justify-self: left;;
    }
    .devOpsNoteContainer {
        display: flex;
        justify-self: right;
    width : 600px;
    font-size:larger;
    border: solid;
    }
        </style>
        <div id="devOpsContainer" class="devOpsContainer" aria-hidden="false" >
        <div id="devOpsLogSection">
        <h5 id="devOpsHeading">DevOps Console</h5>
        <p id="devOpsLog" aria-live="assertive">Ready to Log</p>
        <button id="devOpsClear"type="button">Clear Log</button>
    </div >
    
    <div id="devOpsNotesContainer" class="devOpsNoteContainer">
        <h5 id="devOpsNotesHeader">Developer Notebook</h5>
        <ul id="devOpsNotesList">
            <li>Alt + shift + D  -  Toggle Developer Console </li>
            <li>Alt + shift + C -  Clear Developer Console</li>
            <li>Alt + shift + S  -  Share Developer Console</li>
            </ul >
    </div >
    </div >
    
    </div >
*/
