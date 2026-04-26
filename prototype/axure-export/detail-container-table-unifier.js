(function () {
  var STYLE_ID = "mbl-container-table-unifier-style";
  var LINK_HREF = "detail-container-table-unifier.css";
  var HEADER_ALIASES = {
    "集装箱号": "集装箱号",
    "闆嗚绠卞彿": "集装箱号",
    "封柜类型": "封柜类型",
    "灏佹煖绫诲瀷": "封柜类型",
    "封条": "封条",
    "灏佹潯": "封条",
    "铅封号": "铅封号",
    "閾呭皝鍙": "铅封号",
    "閾呭皝鍙?": "铅封号",
    "件数": "件数",
    "浠舵暟": "件数",
    "货物重量": "货物重量",
    "璐х墿閲嶉噺": "货物重量",
    "体积": "体积",
    "浣撶Н": "体积",
    "操作": "操作",
    "鎿嶄綔": "操作"
  };
  var SEAL_TYPES = ["承运人封条", "海关封条", "托运人封条", "托运人封条-无封", "兽医封条"];
  var NO_SEAL_TYPE = "托运人封条-无封";
  var SHIPPER_SEAL_TYPE = "托运人封条";
  var NO_SEAL_PLACEHOLDER = "无封，无需填写";
  var SHIPPER_SEAL_ERROR = "请填写托运人封条，若业务确认为无封，请选择托运人封条-无封";

  function ensureStyle() {
    if (document.getElementById(STYLE_ID)) return;
    var link = document.createElement("link");
    link.id = STYLE_ID;
    link.rel = "stylesheet";
    link.href = LINK_HREF;
    document.head.appendChild(link);
  }

  function textOf(node) {
    return (node && node.textContent || "").replace(/\s+/g, " ").trim();
  }

  function escapeHtml(value) {
    return String(value == null ? "" : value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }

  function findContainerTables() {
    var labels = Array.prototype.slice.call(document.querySelectorAll(".ax_default.label"));
    return labels.reduce(function (targets, label) {
      var labelText = textOf(label);
      var isContainerLabel = labelText.indexOf("集装箱信息") !== -1 ||
        labelText.indexOf("闆嗚绠变俊鎭") !== -1;
      if (!isContainerLabel) return targets;
      if (!label.getClientRects().length) return targets;
      var table = label.nextElementSibling;
      while (table && !table.querySelector(".table_cell")) {
        table = table.nextElementSibling;
      }
      if (table && table.querySelector(".table_cell")) {
        targets.push({ label: label, table: table });
      }
      return targets;
    }, []);
  }

  function parseRows(table) {
    var cells = Array.prototype.slice.call(table.querySelectorAll(".table_cell"));
    var values = cells.map(textOf).filter(Boolean);
    var headerCount = 0;
    while (headerCount < values.length && HEADER_ALIASES[values[headerCount]]) {
      headerCount += 1;
    }
    if (!headerCount) return [];

    var headers = values.slice(0, headerCount).map(function (header) {
      return HEADER_ALIASES[header] || header;
    });
    var rows = [];
    for (var i = headerCount; i < values.length; i += headerCount) {
      var chunk = values.slice(i, i + headerCount);
      if (!chunk.length) continue;
      var row = {};
      headers.forEach(function (header, index) {
        row[header] = chunk[index] || "";
      });
      rows.push(row);
    }
    return rows;
  }

  function normalizeRows(rows) {
    return rows.map(function (row) {
      return {
        containerNo: row["集装箱号"] || "",
        sealType: row["封柜类型"] || SEAL_TYPES[0],
        sealNo: row["铅封号"] || row["封条"] || "",
        packages: row["件数"] || "",
        weight: row["货物重量"] || "",
        volume: row["体积"] || ""
      };
    }).filter(function (row) {
      return row.containerNo || row.sealNo || row.packages || row.weight || row.volume;
    });
  }

  function comboHtml(value, rowIndex) {
    var options = SEAL_TYPES.map(function (type) {
      return '<div class="mbl-seal-option' + (type === value ? " active" : "") + '" data-value="' + escapeHtml(type) + '">' + escapeHtml(type) + "</div>";
    }).join("");
    return '' +
      '<div class="mbl-seal-combo" data-row="' + rowIndex + '">' +
        '<button class="mbl-seal-control" type="button">' +
          '<span class="mbl-seal-value">' + escapeHtml(value || SEAL_TYPES[0]) + '</span>' +
          '<span class="mbl-seal-clear" aria-hidden="true">×</span>' +
        '</button>' +
        '<div class="mbl-seal-menu">' + options + '</div>' +
      '</div>';
  }

  function rowHtml(row, index, total) {
      var isNoSeal = row.sealType === NO_SEAL_TYPE;
      var sealCellClass = "mbl-seal-cell" + (isNoSeal ? " no-seal" : "");
      var sealCellText = isNoSeal ? NO_SEAL_PLACEHOLDER : escapeHtml(row.sealNo);
      return '<tr>' +
        '<td>' + escapeHtml(row.containerNo) + '</td>' +
        '<td>' + comboHtml(row.sealType, index) + '</td>' +
        '<td class="' + sealCellClass + '" data-seal-value="' + (isNoSeal ? "" : escapeHtml(row.sealNo)) + '"' + (isNoSeal ? ' aria-disabled="true"' : ' contenteditable="true"') + '>' + sealCellText + '</td>' +
        '<td>' + escapeHtml(row.packages) + '</td>' +
        '<td>' + escapeHtml(row.weight) + '</td>' +
        '<td>' + escapeHtml(row.volume) + '</td>' +
        '<td><span class="mbl-container-actions"><button class="mbl-container-action" type="button" data-action="add" aria-label="新增">⊕</button><button class="mbl-container-action" type="button" data-action="delete" aria-label="删除"' + (total <= 1 ? " disabled" : "") + '>⌫</button></span></td>' +
      '</tr>';
  }

  function tableHtml(rows) {
    var body = rows.map(function (row, index) {
      return rowHtml(row, index, rows.length);
    }).join("");
    return '' +
      '<div class="mbl-container-title"><span>箱号列表</span><span class="mbl-container-count" data-count>总箱量: ' + rows.length + '</span></div>' +
      '<table class="mbl-container-table">' +
        '<colgroup>' +
          '<col class="col-container"><col class="col-seal-type"><col class="col-seal"><col class="col-packages"><col class="col-weight"><col class="col-volume"><col class="col-actions">' +
        '</colgroup>' +
        '<thead><tr><th>集装箱号</th><th>封柜类型</th><th>封条</th><th>件数</th><th>货物重量</th><th>体积</th><th>操作</th></tr></thead>' +
        '<tbody>' + body + '</tbody>' +
      '</table>';
  }

  function placeOverlay(label, table, rows) {
    if (table.dataset.mblContainerUnified === "1") return;
    table.dataset.mblContainerUnified = "1";

    var labelRect = label.getBoundingClientRect();
    var tableRect = table.getBoundingClientRect();
    var scrollLeft = window.pageXOffset || document.documentElement.scrollLeft;
    var scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    var isPendingContainerTable = table.id === "u3243";
    var left = isPendingContainerTable ? 0 : Math.min(labelRect.left, tableRect.left) + scrollLeft;
    var top = isPendingContainerTable ? labelRect.top + scrollTop - 16 : Math.min(labelRect.top, tableRect.top) + scrollTop;
    var width = isPendingContainerTable ?
      Math.max(tableRect.right + scrollLeft + 84, document.documentElement.clientWidth || 0) :
      Math.max(tableRect.right, labelRect.right) - Math.min(labelRect.left, tableRect.left);

    label.style.visibility = "hidden";
    table.style.visibility = "hidden";

    var overlay = document.createElement("div");
    overlay.className = "mbl-container-unifier";
    overlay.style.left = Math.max(0, Math.round(left)) + "px";
    overlay.style.top = Math.max(0, Math.round(top)) + "px";
    overlay.style.width = Math.max(900, Math.round(width)) + "px";
    if (isPendingContainerTable) overlay.style.height = "216px";
    overlay.innerHTML = tableHtml(rows);
    document.body.appendChild(overlay);
  }

  function refreshTableState(table) {
    var rows = table.querySelectorAll("tbody tr");
    var count = table.closest(".mbl-container-unifier").querySelector("[data-count]");
    if (count) count.textContent = "总箱量: " + rows.length;
    Array.prototype.slice.call(table.querySelectorAll('[data-action="delete"]')).forEach(function (button) {
      button.disabled = rows.length <= 1;
    });
  }

  function getSealCell(combo) {
    var row = combo && combo.closest("tr");
    return row ? row.querySelector(".mbl-seal-cell") || row.children[2] : null;
  }

  function applySealRule(combo) {
    var valueNode = combo && combo.querySelector(".mbl-seal-value");
    var sealCell = getSealCell(combo);
    if (!valueNode || !sealCell) return;

    sealCell.classList.add("mbl-seal-cell");
    var value = textOf(valueNode);
    var isNoSeal = value === NO_SEAL_TYPE;
    sealCell.classList.toggle("no-seal", isNoSeal);
    sealCell.classList.remove("seal-error");

    if (isNoSeal) {
      sealCell.dataset.sealValue = "";
      sealCell.textContent = NO_SEAL_PLACEHOLDER;
      sealCell.removeAttribute("contenteditable");
      sealCell.setAttribute("aria-disabled", "true");
      sealCell.title = "已确认该箱没有托运人封条，提交船司时托运人封号传空值";
      return;
    }

    sealCell.setAttribute("contenteditable", "true");
    sealCell.removeAttribute("aria-disabled");
    sealCell.removeAttribute("title");
    if (textOf(sealCell) === NO_SEAL_PLACEHOLDER) {
      sealCell.textContent = sealCell.dataset.sealValue || "";
    }
    if (value === SHIPPER_SEAL_TYPE && !textOf(sealCell)) {
      sealCell.classList.add("seal-error");
      sealCell.title = SHIPPER_SEAL_ERROR;
    }
  }

  function syncSealValue(cell) {
    if (!cell || cell.classList.contains("no-seal")) return;
    cell.dataset.sealValue = textOf(cell);
    cell.classList.remove("seal-error");
    cell.removeAttribute("title");
    var combo = cell.closest("tr") && cell.closest("tr").querySelector(".mbl-seal-combo");
    if (combo && textOf(combo.querySelector(".mbl-seal-value")) === SHIPPER_SEAL_TYPE && !textOf(cell)) {
      cell.classList.add("seal-error");
      cell.title = SHIPPER_SEAL_ERROR;
    }
  }

  function bindComboEvents() {
    document.addEventListener("click", function (event) {
      var control = event.target.closest(".mbl-seal-control");
      var option = event.target.closest(".mbl-seal-option");
      var action = event.target.closest(".mbl-container-action");

      Array.prototype.slice.call(document.querySelectorAll(".mbl-seal-combo.open")).forEach(function (combo) {
        if (!combo.contains(event.target)) combo.classList.remove("open");
      });

      if (control) {
        control.closest(".mbl-seal-combo").classList.toggle("open");
      }

      if (option) {
        var combo = option.closest(".mbl-seal-combo");
        combo.querySelector(".mbl-seal-value").textContent = option.dataset.value;
        Array.prototype.slice.call(combo.querySelectorAll(".mbl-seal-option")).forEach(function (item) {
          item.classList.toggle("active", item === option);
        });
        combo.classList.remove("open");
        applySealRule(combo);
      }

      if (action && !action.disabled) {
        var grid = action.closest(".mbl-container-table");
        var tbody = grid.querySelector("tbody");
        if (action.dataset.action === "add") {
          var row = {
            containerNo: "",
            sealType: SEAL_TYPES[0],
            sealNo: "",
            packages: "",
            weight: "",
            volume: ""
          };
          tbody.insertAdjacentHTML("beforeend", rowHtml(row, tbody.querySelectorAll("tr").length, tbody.querySelectorAll("tr").length + 1));
        }
        if (action.dataset.action === "delete" && tbody.querySelectorAll("tr").length > 1) {
          action.closest("tr").remove();
        }
        refreshTableState(grid);
      }
    });

    document.addEventListener("input", function (event) {
      if (event.target.classList && event.target.classList.contains("mbl-seal-cell")) {
        syncSealValue(event.target);
      }
    });
  }

  function run() {
    ensureStyle();
    findContainerTables().forEach(function (target) {
      var rows = normalizeRows(parseRows(target.table));
      if (rows.length) placeOverlay(target.label, target.table, rows);
    });
  }

  bindComboEvents();
  Array.prototype.slice.call(document.querySelectorAll(".mbl-seal-combo")).forEach(applySealRule);
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", run);
  } else {
    run();
  }
  window.addEventListener("load", run);
})();
