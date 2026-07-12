/**
 * Exact port of C# KillDiscord() and StartDiscord() from Program.cs
 */
const path = require("path");
const fs   = require("fs");
const {execSync, execFileSync} = require("child_process");

/**
 * Determine the Discord process name from the resources path.
 * Mirrors: resPath.Contains("DiscordPTB") ? "DiscordPTB" : ...
 */
function getProcName(resPath) {
    if (resPath.includes("DiscordPTB"))          return "DiscordPTB";
    if (resPath.includes("DiscordCanary"))        return "DiscordCanary";
    if (resPath.includes("DiscordDevelopment"))   return "DiscordDevelopment";
    return "Discord";
}

/**
 * Port of C# KillDiscord(resPath):
 *   foreach (var process in Process.GetProcessesByName(procName))
 *       process.Kill(); process.WaitForExit(3000);
 *   Thread.Sleep(1000);
 */
export function killDiscord(resPath, log) {
    const procName = getProcName(resPath);
    const exeName  = procName + ".exe";

    if (log) log(`Closing ${procName}...`);

    // Kill with /F (force, like Kill()) /T (tree, kills child processes too)
    try {
        execSync(`taskkill /IM "${exeName}" /F /T`, { stdio: "ignore" });
    } catch (e) {
        // Not running — same behaviour as GetProcessesByName returning empty
    }

    // WaitForExit(3000): poll tasklist until the process is gone (up to 3s)
    const deadline = Date.now() + 3000;
    while (Date.now() < deadline) {
        try {
            const out = execSync("tasklist /FI \"IMAGENAME eq " + exeName + "\" /NH", { encoding: "utf8" });
            if (!out.includes(exeName)) break;
        } catch (_) { break; }
        // Small busy-wait slice (Atomics.wait would need SharedArrayBuffer)
        const end = Date.now() + 100;
        while (Date.now() < end) {}
    }

    // Thread.Sleep(1000)
    const sleep = Date.now() + 1000;
    while (Date.now() < sleep) {}
}

/**
 * Port of C# StartDiscord(resPath):
 *   var exe = Path.Combine(Path.GetDirectoryName(resPath), "..", "Update.exe");
 *   if (File.Exists(exe)) Process.Start(exe, "--processStart Discord.exe");
 */
export function startDiscord(resPath) {
    const procName = getProcName(resPath);
    const exeName  = procName + ".exe";
    // resPath = app-X.X.XXXX\resources  →  go up 2 levels to get to the Discord channel dir
    const updateExe = path.join(resPath, "..", "..", "Update.exe");
    if (fs.existsSync(updateExe)) {
        try {
            const {exec} = require("child_process");
            exec(`"${updateExe}" --processStart ${exeName}`);
        } catch (_) {}
    }
}