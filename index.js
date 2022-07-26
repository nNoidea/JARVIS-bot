"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
require("dotenv").config();
var Discord = require("discord.js"); // DON'T CHANGE THIS, IT WILL BREAK THE COMPILED JS FILE
var GatewayIntentBits = require('discord.js').GatewayIntentBits;
var needle = require('needle');
var fs = require("fs");
var discord_js_1 = require("discord.js");
var client = new Discord.Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
    ]
});
var whitelisted_servers = ["891008003908730961"]; // Real server id.
//const whitelisted_servers: string[] = ["972173800508624936"] // Test server id.
var blacklisted_categories = ["892069299097854033", "974406410752389200", "893500599889453066", "921207383697555537", "892075698884333619", "921197835704205382", "973632998777970748", "970440283634417705"];
var blacklisted_channels = ["972174000430125126"];
var blacklisted_users = [];
var bot_id = "923341724242313247";
var database_channel_id = "1000855719786066081";
var database_file = "database/database.txt";
var currentYear = new Date().getFullYear(); // Gets the current year.
var data_array;
// -- Main functions. --
client.login(process.env.TOKEN); // Log into discord.
client.on("ready", ALIVE); // First function to be executed
function ALIVE() {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            console.log("BOT IS ALIVE!");
            set_database();
            return [2 /*return*/];
        });
    });
}
client.on("messageCreate", message_handler); // When a message send by someone, sends the message to `message_handler`.
function message_handler(message) {
    if (whitelist_server(message) && blacklisted(message)) {
        bad_get_user_score(message);
        archive_pdf_attachments(message);
    }
}
// -- Other functions.
function archive_pdf_attachments(message) {
    var _a;
    return __awaiter(this, void 0, void 0, function () {
        var channel, amount_of_attachments, array, i, file_name, file_extension, user_id, channel_name, thread_name, thread, attachment_array, x, user_message, user_name;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    channel = message.channel;
                    if (!(channel instanceof discord_js_1.TextChannel)) {
                        return [2 /*return*/];
                    } // Makes sure no bad types get through.
                    amount_of_attachments = message.attachments.size // Gets the amount of files.
                    ;
                    array = [];
                    if (!(amount_of_attachments > 0)) return [3 /*break*/, 5];
                    // Filters out the pdf files and collects them in an array.
                    for (i = 0; i < amount_of_attachments; i++) {
                        file_name = (_a = message.attachments.at(i)) === null || _a === void 0 ? void 0 : _a.name // Gets the file name.
                        ;
                        file_extension = get_file_extension(file_name) // Gets the file extension.
                        ;
                        if (file_extension == "pdf") {
                            array.push(message.attachments.at(i)); // Saves attachment that are a pdf into an array.
                        }
                    }
                    user_id = message.author.id // Gets the id of the user.
                    ;
                    if (!(array.length > 0)) return [3 /*break*/, 5];
                    score_change(user_id, 1 * array.length);
                    channel_name = channel.name.toUpperCase() // This method returns the calling string value converted to uppercase.
                    ;
                    thread_name = "ARCHIVE-".concat(channel_name, "-").concat(currentYear);
                    return [4 /*yield*/, unarchive_thread(thread_name, channel)];
                case 1:
                    thread = _b.sent();
                    if (!(thread == false)) return [3 /*break*/, 3];
                    return [4 /*yield*/, create_thread(thread_name, channel)];
                case 2:
                    thread = _b.sent();
                    _b.label = 3;
                case 3:
                    attachment_array = [];
                    for (x = 0; x < array.length; x++) {
                        attachment_array.push(array[x].attachment);
                    }
                    user_message = message.content // The content of the message.
                    ;
                    user_name = message.author.username;
                    return [4 /*yield*/, thread.send(vanilla_message_create(":star_struck: <@".concat(user_id, "> :star_struck:\n ").concat(user_message), [], attachment_array))];
                case 4:
                    _b.sent();
                    console.log("FILE SEND BY: ".concat(user_name, ": ").concat(user_id, " - ").concat(user_message));
                    _b.label = 5;
                case 5: return [2 /*return*/];
            }
        });
    });
}
// Sends a vanilla (not embedded) message. You can also mention users with text interpolation (`SOMETHING <@${ user_id }> SOMETHING`). 
// Leave the `notification_user_id_array` empty ([]) if you don't want anyone to get pinged, or fill it with user_id's to ping them.
// Also allows for sending attachments, leave it empty if there aren't any
function vanilla_message_create(message_content, notification_user_id_array, attachment_array) {
    if (message_content === void 0) { message_content = ""; }
    if (notification_user_id_array === void 0) { notification_user_id_array = []; }
    if (attachment_array === void 0) { attachment_array = []; }
    var message = {
        content: message_content,
        allowedMentions: { users: notification_user_id_array },
        files: attachment_array
    };
    return message;
}
// for fast testing, need to change it into a slash command later
function bad_get_user_score(message) {
    if (message.content == "Jarvis score") {
        var database = data_array;
        var index = database.indexOf(message.author.id);
        var text = "";
        if (index != -1) {
            text = vanilla_message_create(database[index + 1]);
        }
        else {
            text = "0";
        }
        message.channel.send(text);
    }
}
// Only allows whitelisted servers.
function whitelist_server(message) {
    var server = message.guild;
    if (!(server instanceof discord_js_1.Guild)) {
        return;
    } // Filtering out bad types.
    // Checks if the category the message is typed is blacklisted or not.
    var server_id = server.id;
    if (whitelisted_servers === null || whitelisted_servers === void 0 ? void 0 : whitelisted_servers.find(function (element) { return element == server_id; })) {
        return true;
    }
    else {
        console.log("Blacklisted server | ".concat(server.name, ": ").concat(server_id));
        return false;
    }
}
// Ignores blacklisted categories.
function blacklisted(message) {
    var _a;
    var channel = message.channel;
    var user = message.author;
    // Just making sure no funky business happens, idk why TS does not requires the same for author.
    if (!(channel instanceof discord_js_1.TextChannel)) {
        return;
    }
    var category_id = channel.parentId;
    var channel_id = channel.id;
    var user_id = user.id;
    // Check for blacklisted stuff
    if (user_id == bot_id) { // So that the bot does not react to his own messages.
        return false;
    }
    else if (blacklisted_categories === null || blacklisted_categories === void 0 ? void 0 : blacklisted_categories.find(function (element) { return element == category_id; })) {
        console.log("Blacklisted category | ".concat((_a = channel.parent) === null || _a === void 0 ? void 0 : _a.name, ": ").concat(category_id));
        return false;
    }
    // Check for blacklisted channel
    else if (blacklisted_channels === null || blacklisted_channels === void 0 ? void 0 : blacklisted_channels.find(function (element) { return element == channel_id; })) {
        console.log("Blacklisted channel | ".concat(channel.name, ": ").concat(channel_id));
        return false;
    }
    // Check for blacklisted user
    else if (blacklisted_users === null || blacklisted_users === void 0 ? void 0 : blacklisted_users.find(function (element) { return element == user_id; })) {
        console.log("Blacklisted user | ".concat(user.username, ": ").concat(user_id));
        return false;
    }
    else {
        return true;
    }
}
//Unarchives the wanted thread and returns it
function unarchive_thread(name, channel) {
    return __awaiter(this, void 0, void 0, function () {
        var thread;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, channel.threads.fetchArchived()]; // Caches the archived threads, active ones are normally automatically cached. 'await' is needed, because the bot does not wait for that function and might continue executing following code without caching.
                case 1:
                    _a.sent(); // Caches the archived threads, active ones are normally automatically cached. 'await' is needed, because the bot does not wait for that function and might continue executing following code without caching.
                    thread = channel.threads.cache.find(function (x) { return x.name == name; });
                    thread === null || thread === void 0 ? void 0 : thread.setArchived(false); // Waits, because unarchiving is sometimes slower than the bot.
                    if (thread == undefined) {
                        return [2 /*return*/, false];
                    }
                    else {
                        return [2 /*return*/, thread];
                    }
                    return [2 /*return*/];
            }
        });
    });
}
// Creates a thread based on arguments.
function create_thread(name, channel) {
    var thread = channel.threads.create({
        name: name,
        autoArchiveDuration: 10080 // By default we want the threads to be at max duration for visibility.
    });
    return thread;
}
// Gets the file extension.
function get_file_extension(file_name) {
    var dot_index = file_name.lastIndexOf(".");
    var file_extension = file_name.substring(dot_index + 1); // +1 is there to not include the dot char itself.
    return file_extension;
}
// To be able to add further attributes to the database, each message will represent 1 sort of variable.
function score_change(user_id, score_amount) {
    return __awaiter(this, void 0, void 0, function () {
        var index, array_string, channel;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    index = data_array.indexOf(user_id);
                    if (index != -1) {
                        data_array[index + 1] = String(Number(data_array[index + 1]) + score_amount);
                    }
                    else {
                        data_array.push(user_id + "," + String(score_amount));
                    }
                    array_string = data_array.toString();
                    fs.writeFileSync(database_file, array_string);
                    return [4 /*yield*/, client.channels.cache.get(database_channel_id)];
                case 1:
                    channel = _a.sent();
                    return [4 /*yield*/, channel.send(vanilla_message_create("", [], [database_file]))];
                case 2:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
// Gets the message based on where the channel is and which message it is (ids).
function get_message(channel_id, message_id) {
    return client.channels.cache.get(channel_id).messages.fetch(message_id);
}
// Had to create a Promise, since createWriteStream() does not provide one.
function download_file(url, save_location) {
    return new Promise(function (resolve, reject) {
        needle.get(url).pipe(fs.createWriteStream(save_location)).on('done', function (err) {
            if (err)
                reject(err);
            resolve();
        });
    });
}
// Downloads the latest database version
function set_database() {
    var _a;
    return __awaiter(this, void 0, void 0, function () {
        var channel, last_message_id, last_message, url, file;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, client.channels.cache.get(database_channel_id)]; // Get channel.
                case 1:
                    channel = _b.sent() // Get channel.
                    ;
                    last_message_id = channel.lastMessageId // Get last message id.
                    ;
                    return [4 /*yield*/, get_message(database_channel_id, last_message_id)]; // Get last message.
                case 2:
                    last_message = _b.sent() // Get last message.
                    ;
                    url = (_a = last_message.attachments.at(0)) === null || _a === void 0 ? void 0 : _a.url // Get the url of the last message's file.
                    ;
                    return [4 /*yield*/, download_file(url, database_file)]; // Download the file.
                case 3:
                    _b.sent(); // Download the file.
                    file = fs.readFileSync(database_file, 'utf8').replaceAll("\r", "").split(",") // replaceAll removes the carriages returns from
                    ;
                    data_array = file;
                    console.log("DATABASE READY");
                    return [2 /*return*/];
            }
        });
    });
}
