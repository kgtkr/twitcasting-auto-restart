// ==UserScript==
// @name         Twitcasting Auto Restart
// @namespace    twitcasting_auto_restart
// @version      0.1.0
// @description  ツイキャスで自動再開と自動コラボ申請承認
// @author       kgtkr
// @match        https://twitcasting.tv/*/broadcaster
// ==/UserScript==

(() => {
  "use strict";

  let enable = false;

  function autoClick() {
    [
      // 時間になりましたの確認
      "#fullscreen-block-id > div > div.tw-overlay.tw-stream-movie-layout__movie-control > div.tw-modal.tw-confirm-dialog.tw-contents-layer--front > div.tw-confirm-dialog__control > button",

      // 公開するか(削除)
      "#fullscreen-block-id > div > div.tw-overlay.tw-stream-movie-layout__movie-control > div.tw-modal.tw-broadcast-save-dialog > div > div.tw-broadcast-save-dialog__control-publish-inner.tw-broadcast-save-dialog__control-publish-inner--delete > button",

      // 開始
      "#broadcaster-tool-toolbox-container > div.broadcaster-tool-toolbox > div.broadcaster-tool-toolbox__main-controls > button.btn-success",

      // 通知してツイート
      "#broadcastNotificationDialog:not([style^='display: none;']) > div > div > div.modal-footer > button.btn-ok.btn.btn-primary",

      // 通知を送信しましたの確認
      "#fullscreen-block-id > div > div.tw-overlay.tw-stream-movie-layout__movie-control > div.tw-modal.tw-confirm-dialog.tw-contents-layer--front > div.tw-confirm-dialog__control > button",

      // コラボ承認
      "#fullscreen-block-id > div > div.tw-overlay.tw-stream-movie-layout__movie-control > div.tw-live-collabo-request > div > div.tw-live-collabo-request__action > button.btn.btn-success.tw-live-collabo-request__action-allow",
    ]
      .map((selector) => document.querySelector(selector))
      .forEach((el) => {
        if (el !== null && el instanceof HTMLButtonElement) {
          console.log("[Twitcasting Auto Restart]", "auto click:", el);
          el.click();
        }
      });
  }

  const observer = new MutationObserver(() => {
    if (!enable) {
      return;
    }

    setTimeout(() => {
      autoClick();
    }, 500);
  });

  observer.observe(document, {
    childList: true,
    attributes: true,
    subtree: true,
    attributeFilter: ["class", "id"],
  });

  const toolbox = document.querySelector(".broadcaster-tool-toolbox");
  if (toolbox !== null) {
    const button = document.createElement("button");
    button.innerText = "自動化: 無効";
    button.style.background = "red";
    button.onclick = () => {
      enable = !enable;
      button.innerText = enable ? "自動化: 有効" : "自動化: 無効";
    };
    toolbox.insertAdjacentElement("beforeend", button);
  }
})();
