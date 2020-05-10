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

  function isNotNull<A>(a: A | null): a is A {
    return a !== null;
  }

  function autoClick() {
    const selectors: { name: string; selector: string }[] = [
      // 時間になりましたの確認
      {
        name: "finish-confirm-dialog-ok",
        selector:
          "#fullscreen-block-id > div > div.tw-overlay.tw-stream-movie-layout__movie-control > div.tw-modal.tw-confirm-dialog.tw-contents-layer--front > div.tw-confirm-dialog__control > button",
      },

      // 通知しない
      {
        name: "notification-dialog-close",
        selector:
          "#broadcastNotificationDialog[style^='display: block;'] > div > div > div.modal-header > button.close",
      },

      // 公開するか(削除)
      {
        name: "video-delete",
        selector:
          "#fullscreen-block-id > div > div.tw-overlay.tw-stream-movie-layout__movie-control > div.tw-modal.tw-broadcast-save-dialog > div > div.tw-broadcast-save-dialog__control-publish-inner.tw-broadcast-save-dialog__control-publish-inner--delete > button",
      },

      // 開始
      {
        name: "start-live",
        selector:
          "#broadcaster-tool-toolbox-container > div.broadcaster-tool-toolbox > div.broadcaster-tool-toolbox__main-controls > button.btn-success:enabled",
      },

      // コラボ承認
      {
        name: "allow-collabo",
        selector:
          "#fullscreen-block-id > div > div.tw-overlay.tw-stream-movie-layout__movie-control > div.tw-live-collabo-request > div > div.tw-live-collabo-request__action > button.btn.btn-success.tw-live-collabo-request__action-allow",
      },
    ];

    const els = selectors
      .map(({ selector, name }) => {
        const el = document.querySelector(selector);
        if (el !== null && el instanceof HTMLButtonElement) {
          return {
            name,
            el,
          };
        } else {
          return null;
        }
      })
      .filter(isNotNull);

    const el = els.map(({ el }) => el).find((_x) => true);

    if (el !== undefined) {
      console.log("buttons", new Date(), els);
      console.log("[Twitcasting Auto Restart]", "auto click:", el);
      el.click();
    }
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
