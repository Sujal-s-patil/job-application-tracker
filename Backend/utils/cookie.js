import config from "../config/env.js"

const cookieoptions = {
    httpOnly: true,
    sameSite: config.NODE_ENV === "production" ? "none" : "lax",
    secure: config.NODE_ENV === "production",
    path: "/"
}

function setAuthCookie(res, token) {
    res.cookie("token", token, {
        ...cookieoptions,
        maxAge: 24 * 60 * 60 * 1000,
    });
}

function clearAuthCookie(res) {
    res.clearCookie("token", cookieoptions);
}

export {
    setCookie, clearCookie
};