/**
 * Save_close_panel.jsx.
 * Script for Adobe InDesign
 * Script for save only, close only, save and close InDesign documents
 * Author: Samuel Ghirardelli
 * License: MIT
 */

// ==========================================
// VERSION
// ==========================================
var version = "1.0";
// Release notes
/**
 * v1.0 - First release 
 */

// ==========================================
//@targetengine 'SaveClosePanel'
if (typeof Array.prototype.map !== "function") {
    Array.prototype.map = function(callback) {
        var result = [];
        for (var i = 0; i < this.length; i++) {
            result.push(callback(this[i], i, this));
        }
        return result;
    };
}
// ==========================================

// ==========================================
// LANGUAGES DICT
// ==========================================
var lin = {
    no_doc_selected: {
        it: "Nessun documento selezionato.",
        en: "No document selected."
    },
    select_files_to_close: {
        it: "Seleziona i file da chiudere",
        en: "Select the files to close"
    },
    cancel: {
        it: "Annulla",
        en: "Cancel"
    },
    save: {
        it: "Salva",
        en: "Save"
    },
    save_if_selected: {
        it: "Se selezionata salva i file.",
        en: "If selected, saves the files."
    },
    save_and_close: {
        it: "Salva & Chiudi",
        en: "Save & Close"
    },
    close_all_no_save: {
        it: "Chiudi tutto (non salva)",
        en: "Close all (don’t save)"
    },
    save_all_no_close: {
        it: "Salva tutto (non chiude)",
        en: "Save all (don’t close)"
    },
    save_close: {
        it: "Salva e chiudi",
        en: "Save and close"
    },
    select_files: {
        it: "Seleziona file da chiudere",
        en: "Select files to close"
    },
    close: {
        it: "Chiudi",
        en: "Close"
    },
    version: {
        it: "Versione",
        en: "Version"
    },
    no_file_open: {
        it: "Nessun file aperto",
        en: "No file open"
    },
    language_choice: {
        it: "Scegli la lingua:",
        en: "Choose the language"
    },
    select_language: {
        it: "Seleziona la lingua",
        en: "Select the language"
    },
    action: {
        it: "Azioni:",
        en: "Actions:"
    },
    run: {
        it: "Esegui",
        en: "Run"
    },
    panel_name: {
        it: "Pannello Salva & Chiudi",
        en: "Save & Close panel"
    }
};

// ==========================================
// PATHS
// ==========================================
var scriptFolder = File($.fileName).parent;
var configFile = File(scriptFolder + "/sc_lang_config.txt");

// ==========================================
// FUNCTIONS
// ==========================================
/** Close all docs */
function close_all(){
    var docs = app.documents;
    for (var i = docs.length-1; i >= 0; i--) {
        docs[i].close(SaveOptions.NO);
    }
}
//--------------------------
/** Save all docs */
function save_all(){
    var docs = app.documents;
    for (var i = docs.length-1; i >= 0; i--) {
        docs[i].save();
    }   
}
//--------------------------
/** Save and close docs */
function save_close(){
    var docs = app.documents;
    for (var i = docs.length-1; i >= 0; i--) {
        docs[i].close(SaveOptions.YES);
    }
}
//--------------------------
/** Selection doc/docs for save, close, save and close */
function selection(){
    var openDocs = app.documents.everyItem().getElements()
    var selectedDocs = [];
    var dialog = new Window("dialog", t("select_files_to_close"));
    var listBox = dialog.add("listbox", [0, 0, 500, 500], undefined, {multiselect: true});
    listBox.maximumSize.width = 600;
    listBox.maximumSize.height = 600;
    for (var i = 0; i < openDocs.length; i++) {
        listBox.add("item", openDocs[i].name);
    }
    var buttonGroup = dialog.add("group");
    buttonGroup.orientation = "row";
    buttonGroup.alignment = "center";
    var cancelButton = buttonGroup.add("button", undefined, undefined, {name: "cancel"}); 
    cancelButton.text = t("cancel"); 

var salva = buttonGroup.add("checkbox", undefined, undefined, {name: "salva"}); 
    salva.text = t("save"); 
    salva.preferredSize.width = 52; 
    salva.value = true; 
    salva.helpTip = t("save_if_selected");

    var okButton = buttonGroup.add("button", undefined, t("close"));
    okButton.onClick = function() {
        for (var i = 0; i < listBox.items.length; i++) {
            if (listBox.items[i].selected == true) {
                selectedDocs.push(app.documents.itemByName(listBox.items[i].text));
            }
        }
        if (selectedDocs.length == 0) {
            alert(t("no_doc_selected"));
        }
        dialog.close();
    }
    dialog.show();
    closeSelected();
    function closeSelected(){
        pb.maxvalue = selectedDocs.length;
        for (var i = 0; i < selectedDocs.length; i++){
            if(salva.value){
                pb.value = i + 1; 
                selectedDocs[i].close(SaveOptions.YES)
            }else{
                pb.value = i + 1; 
                selectedDocs[i].close(SaveOptions.NO)
            }
        };
        $.sleep(500);
    }
}
//--------------------------
/**
 * Get saved language from txt config file
 *
 * @returns {string} 
 */
function getSavedLanguage() {
    if (configFile.exists) {
        configFile.open("r");
        var lang = configFile.read();
        configFile.close();
        return lang;
    }
    return null;
}
//--------------------------
/**
 * Description placeholder
 *
 * @param {string} lang
 */
function saveLanguage(lang) {
    configFile.open("w");
    configFile.write(lang);
    configFile.close();
}
//--------------------------
/**
 * Ask interface language
 *
 * @param {list} - ISO language list
 * @returns {string} - Default language
 */
function askLanguage(langList) {
    var dlg = new Window("dialog", t("select_language"));
    dlg.orientation = "column";
    dlg.alignChildren = "fill";

    dlg.add("statictext", undefined, t("language_choice"));

    // crea dropdown leggibile
    var dropdown = dlg.add("dropdownlist", undefined, langList.map(function(l){ return l.name; }));
    dropdown.selection = 0; 

    var group = dlg.add("group");
    group.alignment = "right";
    var okBtn = group.add("button", undefined, "OK");

    if (dlg.show() == 1) {
        return langList[dropdown.selection.index].code;
    }
    return "en";
}
//--------------------------
/**
 * Description placeholder
 *
 * @returns {string} 
 */
function resetLanguage(availableLangs) {
    if (configFile.exists) {
        configFile.remove();
    }
    var newLang = askLanguage(availableLangs);
    saveLanguage(newLang);
    return newLang;
}
//--------------------------
function getAvailableLanguages(dict) {
    var langs = {};
    for (var key in dict) {
        if (dict.hasOwnProperty(key)) {
            var entry = dict[key];
            for (var subKey in entry) {
                if (entry.hasOwnProperty(subKey)) {
                    langs[subKey] = true;
                }
            }
        }
    }
    var result = [];
    for (var l in langs) {
        if (langs.hasOwnProperty(l)) {
            result.push(l);
        }
    }
    return result.sort();
}
//--------------------------
/**
 * Key translation
 *
 * @param {key} key - Key from dictionary
 * @returns {value} - value of key
 */
function t(key) {
    if (lin[key] && lin[key][currentLang]) {
        return lin[key][currentLang];
    }
    return key;
}
//--------------------------
// --- Genera lista lingue leggibili ---
function getLanguageList(dict) {
    var langs = {};
    for (var key in dict) {
        if (dict.hasOwnProperty(key)) {
            var entry = dict[key];
            for (var subKey in entry) {
                if (entry.hasOwnProperty(subKey)) {
                    langs[subKey] = entry[subKey];
                }
            }
        }
    }
    var result = [];
    for (var code in langs) {
        if (langs.hasOwnProperty(code)) {
            var displayName = "";
            switch(code.toLowerCase()){
                case "it": displayName = "Italiano"; break;
                case "en": displayName = "English"; break;
                case "fr": displayName = "Français"; break;
                case "de": displayName = "Deutsch"; break;
                default: displayName = code.toUpperCase(); break;
            }
            result.push({code: code, name: displayName});
        }
    }
    return result.sort(function(a,b){ return a.name.localeCompare(b.name); });
}
//--------------------------
// Controlla se è premuto Shift → reset forzato
if (ScriptUI.environment.keyboardState.shiftKey) {
    var availableLangs = getLanguageList(lin);
    currentLang = resetLanguage(availableLangs);
}
// ==========================================
// PANEL DESIGN
// ==========================================
/*
Code for Import https://scriptui.joonas.me — (Triple click to select): 
{"activeId":11,"items":{"item-0":{"id":0,"type":"Dialog","parentId":false,"style":{"enabled":true,"varName":"win_save_close","windowType":"Dialog","creationProps":{"su1PanelCoordinates":false,"maximizeButton":false,"minimizeButton":false,"independent":false,"closeButton":true,"borderless":false,"resizeable":false},"text":"-----","preferredSize":[0,0],"margins":16,"orientation":"column","spacing":10,"alignChildren":["center","top"]}},"item-4":{"id":4,"type":"Panel","parentId":0,"style":{"enabled":true,"varName":"p_r_button","creationProps":{"borderStyle":"etched","su1PanelCoordinates":false},"text":"Azione:","preferredSize":[0,0],"margins":15,"orientation":"column","spacing":15,"alignChildren":["left","center"],"alignment":null}},"item-5":{"id":5,"type":"RadioButton","parentId":4,"style":{"enabled":true,"varName":"r_close","text":"Chiudi tutto (non salva)","preferredSize":[0,0],"alignment":null,"helpTip":null}},"item-6":{"id":6,"type":"RadioButton","parentId":4,"style":{"enabled":true,"varName":"r_save","text":"Salva tutto (non chiude)","preferredSize":[0,0],"alignment":null,"helpTip":null}},"item-7":{"id":7,"type":"RadioButton","parentId":4,"style":{"enabled":true,"varName":"r_save_close","text":"Salva e chiudi","preferredSize":[0,0],"alignment":null,"helpTip":null}},"item-8":{"id":8,"type":"RadioButton","parentId":4,"style":{"enabled":true,"varName":"r_selection","text":"Seleziona file","preferredSize":[0,0],"alignment":null,"helpTip":null}},"item-10":{"id":10,"type":"Progressbar","parentId":0,"style":{"enabled":true,"varName":"pb","preferredSize":[177,7],"alignment":null,"helpTip":null}},"item-11":{"id":11,"type":"Divider","parentId":0,"style":{"enabled":true,"varName":"div_0"}},"item-12":{"id":12,"type":"Group","parentId":0,"style":{"enabled":true,"varName":"g_buttons","preferredSize":[0,0],"margins":0,"orientation":"row","spacing":10,"alignChildren":["left","center"],"alignment":null}},"item-13":{"id":13,"type":"Button","parentId":12,"style":{"enabled":true,"varName":"cancel","text":"Annulla","justify":"center","preferredSize":[0,0],"alignment":null,"helpTip":null}},"item-14":{"id":14,"type":"Button","parentId":12,"style":{"enabled":true,"varName":"ok","text":"-----","justify":"center","preferredSize":[0,0],"alignment":null,"helpTip":null}}},"order":[0,4,5,6,7,8,10,11,12,13,14],"settings":{"importJSON":true,"indentSize":false,"cepExport":false,"includeCSSJS":true,"showDialog":true,"functionWrapper":false,"afterEffectsDockable":false,"itemReferenceList":"None"}}
*/ 

// ==========================================
// MAIN
// ==========================================
var availableLangs = getLanguageList(lin);
var currentLang = getSavedLanguage();
if (!currentLang) {
    currentLang = askLanguage(availableLangs);
    saveLanguage(currentLang);
}

// ==========================================
// PANEL
// ==========================================

// WIN_SAVE_CLOSE
// ==============
var win_save_close = new Window("palette"); 
    win_save_close.text = t("panel_name"); 
    win_save_close.text += " - " + version + " - " + currentLang.toUpperCase();
    win_save_close.orientation = "column"; 
    win_save_close.alignChildren = ["center","top"]; 
    win_save_close.spacing = 10; 
    win_save_close.margins = 16; 

// P_R_BUTTON
// ==========
var p_r_button = win_save_close.add("panel", undefined, undefined, {name: "p_r_button"}); 
    p_r_button.text = t("action"); 
    p_r_button.orientation = "column"; 
    p_r_button.alignChildren = ["left","center"]; 
    p_r_button.spacing = 15; 
    p_r_button.margins = 15; 

var r_close = p_r_button.add("radiobutton", undefined, undefined, {name: "r_close"}); 
    r_close.text = t("close_all_no_save"); 

var r_save = p_r_button.add("radiobutton", undefined, undefined, {name: "r_save"}); 
    r_save.text = t("save_all_no_close"); 

var r_save_close = p_r_button.add("radiobutton", undefined, undefined, {name: "r_save_close"}); 
    r_save_close.text = t("save_close"); 

var r_selection = p_r_button.add("radiobutton", undefined, undefined, {name: "r_selection"}); 
    r_selection.text = t("select_files"); 
    r_selection.onClick = function(){
        selection();
        $.sleep(500);
        r_selection.value = false;
        if (app.documents.length == 0){
            win_save_close.close();
        }
    }

// WIN_SAVE_CLOSE
// ==============
var pb = win_save_close.add("progressbar", undefined, undefined, {name: "pb"}); 
    pb.maxvalue = 100; 
    pb.value = 0; 
    pb.preferredSize.width = 177; 
    pb.preferredSize.height = 7; 

var div_0 = win_save_close.add("panel", undefined, undefined, {name: "div_0"}); 
    div_0.alignment = "fill"; 

// G_BUTTONS
// =========
var g_buttons = win_save_close.add("group", undefined, {name: "g_buttons"}); 
    g_buttons.orientation = "row"; 
    g_buttons.alignChildren = ["left","center"]; 
    g_buttons.spacing = 10; 
    g_buttons.margins = 0; 

var cancel = g_buttons.add("button", undefined, undefined, {name: "cancel"}); 
    cancel.text = t("cancel"); 
    cancel.onClick = function(){
        win_save_close.close();
    }

var ok = g_buttons.add("button", undefined, undefined, {name: "ok"}); 
    ok.text = t("run"); 
    ok.onClick = function(){
        switch(true){
            case r_close.value:
                close_all();
                win_save_close.close();
                break;
            case r_save.value:
                save_all();
                win_save_close.close();
                break;
            case r_save_close.value:
                save_close();
                win_save_close.close();
                break;
            case r_selection.value:
                selection();
                win_save_close.close();
                break;
        }
    }

if (app.documents.length > 0){
    win_save_close.show();
}else{
    alert(t("no_file_open"));
}
