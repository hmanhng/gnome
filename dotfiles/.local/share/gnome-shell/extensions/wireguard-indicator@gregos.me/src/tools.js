const ExtensionUtils = imports.misc.extensionUtils;
const Me = ExtensionUtils.getCurrentExtension();
const GLib = imports.gi.GLib;
const EXTENSIONDIR = Me.dir.get_path();
const TOOLS = EXTENSIONDIR + '/src/tools.sh';
const PKEXEC = GLib.find_program_in_path('pkexec');


function myLog(msg) {
    log(`[wg-tools] ${msg}`);
}

function exec_tools(command) {
    let [res, out, err, status] = GLib.spawn_command_line_sync(command);
    // [PKEXEC, , TOOLS,'--user',GLib.get_user_name(),'--interface','wg0','install']
    // myLog("   res    " + res);
    // myLog("   out    " + out);
    // myLog("   status    " + status);
    // myLog("   err    " + err);
    return [res, out, err, status];
}

function test() {
    let status = exec_tools(TOOLS + ' --interface wg0 test')[3];
    if (status===0) {
        return true;
    } else {
        return false;
    }
}

function install (done) {
    spawn_process_check_exit_code(
        [PKEXEC, TOOLS, '--user', GLib.get_user_name(), '--interface', 'wg0', 'install'],
        done
    );
}


function spawn_process_check_exit_code(argv, callback)
{
    let [ok, pid] = GLib.spawn_async(
        EXTENSIONDIR,
        argv,
        null,
        GLib.SpawnFlags.DO_NOT_REAP_CHILD,
        null,
    );
    if (!ok)
    {
        if (callback != null && callback != undefined)
            callback(false);
        return;
    }
    GLib.child_watch_add(200, pid, function(callback, argv, process, exitStatus) {
        GLib.spawn_close_pid(process);
        let exitCode = 0;
        try {
            GLib.spawn_check_exit_status(exitStatus);
        } catch (e) {
            exitCode = e.code;
        }

        if (callback != null && callback != undefined)
            callback(exitCode == 0, exitCode);
    }.bind(null, callback, argv));
}