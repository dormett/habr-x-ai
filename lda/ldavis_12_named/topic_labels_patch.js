document.addEventListener("DOMContentLoaded", function () {
  var topicNames = {"1":"AI и когнитивные процессы","2":"Машинное обучение (ML)","3":"Генеративный AI","4":"AI в индустрии","5":"Обмен опытом","6":"AI в разработке","7":"Языковые модели (LLM)","8":"Чат-боты и пользовательские сервисы","9":"AI-агенты и автоматизация задач","10":"Компьютерное зрение (CV)","11":"Внедрение AI","12":"Философия AI"};

  function topicLabel(n) {
    return "Тема " + n + ": " + (topicNames[String(n)] || ("Topic " + n));
  }

  function replaceTopicText(text) {
    if (!text) return text;

    var newText = text;

    newText = newText.replace(/\bTopic\s*(\d+)\b/g, function(_, n) {
      return topicLabel(n);
    });

    newText = newText.replace(/\bSelected Topic:\s*(\d+)\b/g, function(_, n) {
      return "Выбранная тема: " + topicLabel(n);
    });

    return newText;
  }

  function patchTextNodes(root) {
    var walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, null, false);
    var node;
    var nodesToPatch = [];

    while ((node = walker.nextNode())) {
      if (node.nodeValue && /Topic\s*\d+|Selected Topic:\s*\d+/.test(node.nodeValue)) {
        nodesToPatch.push(node);
      }
    }

    nodesToPatch.forEach(function(textNode) {
      textNode.nodeValue = replaceTopicText(textNode.nodeValue);
    });
  }

  function patchTitleLikeBlocks() {
    var selectors = [
      "text",
      "tspan",
      "div",
      "span",
      "p",
      "h1",
      "h2",
      "h3",
      "h4",
      "h5",
      "h6",
      "button",
      "li"
    ];

    selectors.forEach(function(sel) {
      document.querySelectorAll(sel).forEach(function(el) {
        if (!el || !el.textContent) return;
        if (/Topic\s*\d+|Selected Topic:\s*\d+/.test(el.textContent)) {
          el.textContent = replaceTopicText(el.textContent);
        }
      });
    });
  }

  function patchCircleTooltips() {
    document.querySelectorAll("svg .topic, svg circle").forEach(function(el) {
      var aria = el.getAttribute("aria-label");
      var titleEl = el.querySelector("title");

      if (aria && /Topic\s*\d+/.test(aria)) {
        el.setAttribute("aria-label", replaceTopicText(aria));
      }

      if (titleEl && titleEl.textContent && /Topic\s*\d+/.test(titleEl.textContent)) {
        titleEl.textContent = replaceTopicText(titleEl.textContent);
      }
    });
  }

  function patchPage() {
    patchTextNodes(document.body);
    patchTitleLikeBlocks();
    patchCircleTooltips();
  }

  patchPage();

  var observer = new MutationObserver(function() {
    patchPage();
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true,
    characterData: true
  });
});
