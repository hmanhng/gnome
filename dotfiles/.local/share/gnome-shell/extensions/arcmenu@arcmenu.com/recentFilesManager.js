const { Gtk, Gio, GLib } = imports.gi;
const Main = imports.ui.main;

const LogEnabled = false;
const RecentManager = new Gtk.RecentManager();

var isCanceled = false;
var currentQueries = [];

function filterRecentFiles(callback){
    isCanceled = false;
    RecentManager.get_items().sort((a, b) => b.get_modified() - a.get_modified())
    .forEach(item => {
        queryFileExists(item)
        .then(validFile =>{
            debugLog("Valid file - " + validFile.get_display_name());
            if(!isCanceled)
                callback(validFile);
        })
        .catch(err =>{
            debugLog(err);
        });
    });
}

function queryFileExists(item) {
    return new Promise((resolve, reject) => {
        let file = Gio.File.new_for_uri(item.get_uri());
        let cancellable = new Gio.Cancellable();

        if(file === null)
            reject("Recent file is null. Rejected.");

        //Create and store queryInfo to cancel any active queries when needed
        let queryInfo = { 
            timeOutID: null, 
            cancellable, 
            reject,
            item
        };

        currentQueries.push(queryInfo);

        file.query_info_async('standard::type', 0, 0, cancellable, (source, res) => {
            try {
                let fileInfo = source.query_info_finish(res);
                removeQueryInfoFromList(queryInfo);
                if (fileInfo) 
                    resolve(item);
            }
            catch (err) {
                if (err.matches(Gio.IOErrorEnum, Gio.IOErrorEnum.CANCELLED))
                    debugLog("Cancel Called: " + item.get_display_name());

                removeQueryInfoFromList(queryInfo);
                reject(err);
            }
        });
    });
}

function removeQueryInfoFromList(queryInfo){
    let queryIndex = currentQueries.indexOf(queryInfo);
    if(queryIndex !== -1)
        currentQueries.splice(queryIndex, 1);
}

function cancelCurrentQueries(){
    if(currentQueries.length === 0)
        return;
    isCanceled = true;
    debugLog("Canceling " + currentQueries.length + " queries...")
    for(let queryInfo of currentQueries){
        debugLog("Cancel query - " + queryInfo.item.get_display_name());
        queryInfo.cancellable.cancel();
        queryInfo.cancellable = null;
        queryInfo.reject("Query Canceled");
    }
    currentQueries = null;
    currentQueries = [];
    debugLog("Cancel Finished");
}

function getRecentManager(){
    return RecentManager;
}

function debugLog(message){
    if (!LogEnabled)
        return;
    else log(message);
}
