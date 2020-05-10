// ==UserScript==
// @name         Twitcasting Auto Restart
// @namespace    twitcasting_auto_restart
// @version      0.1.0
// @description  ツイキャスで自動再開と自動コラボ申請承認
// @author       kgtkr
// @match        https://twitcasting.tv/*/broadcaster
// ==/UserScript==
(function () {
    "use strict";
    var enable = false;
    function isNotNull(a) {
        return a !== null;
    }
    function autoClick() {
        var selectors = [
            // 時間になりましたの確認
            {
                name: "finish-confirm-dialog-ok",
                selector: "#fullscreen-block-id > div > div.tw-overlay.tw-stream-movie-layout__movie-control > div.tw-modal.tw-confirm-dialog.tw-contents-layer--front > div.tw-confirm-dialog__control > button",
            },
            // 通知しない
            {
                name: "notification-dialog-close",
                selector: "#broadcastNotificationDialog:not([style^='display: none;']) > div > div > div.modal-header > button.close",
            },
            // 公開するか(削除)
            {
                name: "video-delete",
                selector: "#fullscreen-block-id > div > div.tw-overlay.tw-stream-movie-layout__movie-control > div.tw-modal.tw-broadcast-save-dialog > div > div.tw-broadcast-save-dialog__control-publish-inner.tw-broadcast-save-dialog__control-publish-inner--delete > button",
            },
            // 開始
            {
                name: "start-live",
                selector: "#broadcaster-tool-toolbox-container > div.broadcaster-tool-toolbox > div.broadcaster-tool-toolbox__main-controls > button.btn-success:enabled",
            },
            // コラボ承認
            {
                name: "allow-collabo",
                selector: "#fullscreen-block-id > div > div.tw-overlay.tw-stream-movie-layout__movie-control > div.tw-live-collabo-request > div > div.tw-live-collabo-request__action > button.btn.btn-success.tw-live-collabo-request__action-allow",
            },
        ];
        var els = selectors
            .map(function (_a) {
            var selector = _a.selector, name = _a.name;
            var el = document.querySelector(selector);
            if (el !== null && el instanceof HTMLButtonElement) {
                return {
                    name: name,
                    el: el,
                };
            }
            else {
                return null;
            }
        })
            .filter(isNotNull);
        console.log("buttons", new Date(), els);
        var el = els.map(function (_a) {
            var el = _a.el;
            return el;
        }).find(function (_x) { return true; });
        if (el !== undefined) {
            console.log("[Twitcasting Auto Restart]", "auto click:", el);
            el.click();
        }
    }
    var observer = new MutationObserver(function () {
        if (!enable) {
            return;
        }
        setTimeout(function () {
            autoClick();
        }, 500);
    });
    observer.observe(document, {
        childList: true,
        attributes: true,
        subtree: true,
        attributeFilter: ["class", "id"],
    });
    var toolbox = document.querySelector(".broadcaster-tool-toolbox");
    if (toolbox !== null) {
        var button_1 = document.createElement("button");
        button_1.innerText = "自動化: 無効";
        button_1.style.background = "red";
        button_1.onclick = function () {
            enable = !enable;
            button_1.innerText = enable ? "自動化: 有効" : "自動化: 無効";
        };
        toolbox.insertAdjacentElement("beforeend", button_1);
    }
})();
