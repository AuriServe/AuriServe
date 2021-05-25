"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Settings = exports.Media = exports.Pages = exports.Login = exports.User = exports.Main = void 0;
require("./Pages.sass");
var MainPage_1 = require("./MainPage");
Object.defineProperty(exports, "Main", { enumerable: true, get: function () { return __importDefault(MainPage_1).default; } });
var UserPage_1 = require("./UserPage");
Object.defineProperty(exports, "User", { enumerable: true, get: function () { return __importDefault(UserPage_1).default; } });
var LoginPage_1 = require("./LoginPage");
Object.defineProperty(exports, "Login", { enumerable: true, get: function () { return __importDefault(LoginPage_1).default; } });
var PagesPage_1 = require("./PagesPage");
Object.defineProperty(exports, "Pages", { enumerable: true, get: function () { return __importDefault(PagesPage_1).default; } });
var MediaPage_1 = require("./MediaPage");
Object.defineProperty(exports, "Media", { enumerable: true, get: function () { return __importDefault(MediaPage_1).default; } });
var SettingsPage_1 = require("./SettingsPage");
Object.defineProperty(exports, "Settings", { enumerable: true, get: function () { return __importDefault(SettingsPage_1).default; } });
