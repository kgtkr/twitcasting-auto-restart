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
        var el = [
            // 時間になりましたの確認
            "#fullscreen-block-id > div > div.tw-overlay.tw-stream-movie-layout__movie-control > div.tw-modal.tw-confirm-dialog.tw-contents-layer--front > div.tw-confirm-dialog__control > button",
            // 通知を送信しましたの確認
            "#fullscreen-block-id > div > div.tw-overlay.tw-stream-movie-layout__movie-control > div.tw-modal.tw-confirm-dialog.tw-contents-layer--front > div.tw-confirm-dialog__control > button",
            // 通知してツイート
            "#broadcastNotificationDialog:not([style^='display: none;']) > div > div > div.modal-footer > button.btn-ok.btn.btn-primary",
            // 公開するか(削除)
            "#fullscreen-block-id > div > div.tw-overlay.tw-stream-movie-layout__movie-control > div.tw-modal.tw-broadcast-save-dialog > div > div.tw-broadcast-save-dialog__control-publish-inner.tw-broadcast-save-dialog__control-publish-inner--delete > button",
            // 開始
            "#broadcaster-tool-toolbox-container > div.broadcaster-tool-toolbox > div.broadcaster-tool-toolbox__main-controls > button.btn-success:enabled",
            // コラボ承認
            "#fullscreen-block-id > div > div.tw-overlay.tw-stream-movie-layout__movie-control > div.tw-live-collabo-request > div > div.tw-live-collabo-request__action > button.btn.btn-success.tw-live-collabo-request__action-allow",
        ]
            .map(function (selector) { return document.querySelector(selector); })
            .map(function (el) { return (el instanceof HTMLButtonElement ? el : null); })
            .filter(isNotNull)
            .find(function (_x) { return true; });
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
