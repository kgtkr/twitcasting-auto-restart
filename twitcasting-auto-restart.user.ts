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
  // 一度押すと20秒間は押せない
  let allowClickLive = true;

  function isNotNull<A>(a: A | null): a is A {
    return a !== null;
  }

  function autoClick() {
    const selectors: {
      name: string;
      selector: string;
      text: string;
      isStartLive?: boolean;
    }[] = [
      // 時間になりましたの確認
      {
        name: "finish-confirm-dialog-ok",
        selector:
          "#fullscreen-block-id > div > div.tw-overlay.tw-stream-movie-layout__movie-control > div.tw-modal.tw-confirm-dialog.tw-contents-layer--front > div.tw-confirm-dialog__control > button",
        text: "閉じる",
      },

      // 通知しない
      {
        name: "notification-dialog-close",
        selector:
          "#broadcastNotificationDialog[style^='display: block;'] > div > div > div.modal-header > button.close",
        text: "×",
      },

      // 公開するか(削除)
      {
        name: "video-delete",
        selector:
          "#fullscreen-block-id > div > div.tw-overlay.tw-stream-movie-layout__movie-control > div.tw-modal.tw-broadcast-save-dialog > div > div.tw-broadcast-save-dialog__control-publish-inner.tw-broadcast-save-dialog__control-publish-inner--delete > button",
        text: "削除",
      },

      // 開始
      {
        name: "start-live",
        selector:
          "#broadcaster-tool-toolbox-container > div.broadcaster-tool-toolbox > div.broadcaster-tool-toolbox__main-controls > button.btn-success:enabled",
        text: "開始",
        isStartLive: true,
      },

      // コラボ承認
      {
        name: "allow-collabo",
        selector:
          "#fullscreen-block-id > div > div.tw-overlay.tw-stream-movie-layout__movie-control > div.tw-live-collabo-request > div > div.tw-live-collabo-request__action > button.btn.btn-success.tw-live-collabo-request__action-allow",
        text: "許可",
      },
    ];

    const els = selectors
      .map(({ selector, name, text, isStartLive }) => {
        const el = document.querySelector(selector);
        if (
          el !== null &&
          el instanceof HTMLButtonElement &&
          el.innerText === text
        ) {
          return {
            name,
            el,
            isStartLive,
          };
        } else {
          return null;
        }
      })
      .filter(isNotNull);

    const data = els.find((_x) => true);

    if (data !== undefined) {
      console.log("buttons", new Date(), els);
      console.log(
        "[Twitcasting Auto Restart]",
        "auto click:",
        data.name,
        data.el
      );
      if (data.isStartLive) {
        if (allowClickLive) {
          allowClickLive = false;
          setTimeout(() => {
            allowClickLive = true;
          }, 1000 * 20);
        } else {
          console.log("allowClickLive is false");
          return;
        }
      }
      data.el.click();
    }
  }

  const observer = new MutationObserver(() => {
    if (!enable) {
      return;
    }

    setTimeout(() => {
      autoClick();
    }, 1500);
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
