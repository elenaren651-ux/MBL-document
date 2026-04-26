(function () {
  if (window.__mblFieldProvenanceLoaded) return;
  window.__mblFieldProvenanceLoaded = true;

  var activeTab = "fields";
  var activeFieldId = "consignee";
  var modalState = null;
  var toastTimer = null;
  var eventSeq = 100;

  var sourceTypeText = {
    attachment: "附件取值",
    email_body: "邮件正文",
    customer_link: "客户链接",
    manual_edit: "人工修改保存",
    selection: "人工确认候选",
    system: "系统"
  };

  var statusText = {
    conflict: "冲突",
    pending: "待确认",
    missing: "缺失",
    confirmed: "已确认"
  };

  var fields = [
    {
      id: "shipper",
      name: "Shipper / 托运人",
      risk: "高风险",
      status: "confirmed",
      targetId: "u7605",
      labelId: "u7604",
      currentValue: "TOPEVER LOGISTICS (SHANGHAI) LTD.\n11F (1101-1102), ABOVE THE BUND PLAZA, NO.948 DONG DA MING ROAD, SHANGHAI PRC",
      selectedCandidateId: "shipper_attach",
      showOverlay: true,
      candidates: [
        {
          id: "shipper_attach",
          sourceType: "attachment",
          sourceLabel: "附件 SI补料.pdf 第1页",
          value: "TOPEVER LOGISTICS (SHANGHAI) LTD.\n11F (1101-1102), ABOVE THE BUND PLAZA, NO.948 DONG DA MING ROAD, SHANGHAI PRC",
          evidence: "PDF 第1页 shipper 区块",
          confidence: "96%"
        },
        {
          id: "shipper_email",
          sourceType: "email_body",
          sourceLabel: "邮件正文",
          value: "TOPEVER LOGISTICS (SHANGHAI) LTD.\n11F (1101-1102), ABOVE THE BUND PLAZA, NO.948 DONG DA MING ROAD, SHANGHAI PRC",
          evidence: "邮件正文第3段",
          confidence: "91%"
        }
      ]
    },
    {
      id: "consignee",
      name: "Consignee / 收货人",
      risk: "高风险",
      status: "conflict",
      targetId: "u7685",
      labelId: "u7683",
      currentValue: "PIMA HOLDING COMPANY LIMITED\nLOT K6, N1 STREET, NAM THUAN INDUSTRIAL PARK, TAY NINH PROVINCE, VIETNAM",
      selectedCandidateId: "",
      showOverlay: true,
      candidates: [
        {
          id: "consignee_attach",
          sourceType: "attachment",
          sourceLabel: "附件 SI补料.pdf 第1页",
          value: "PIMA HOLDING COMPANY LIMITED\nLOT K6, N1 STREET, NAM THUAN INDUSTRIAL PARK, TAY NINH PROVINCE, VIETNAM\nTAX CODE: 1102006820",
          evidence: "PDF 第1页 consignee 区块",
          confidence: "94%"
        },
        {
          id: "consignee_email",
          sourceType: "email_body",
          sourceLabel: "邮件正文",
          value: "PIMA HOLDING CO., LTD.\nLOT K6, N1 STREET, NAM THUAN IP, TAY NINH, VIETNAM",
          evidence: "邮件正文客户补料段落",
          confidence: "88%"
        }
      ]
    },
    {
      id: "notify",
      name: "Notify Party / 通知方",
      risk: "高风险",
      status: "pending",
      targetId: "u7707",
      labelId: "u7729",
      currentValue: "同收货人",
      selectedCandidateId: "notify_attach",
      showOverlay: true,
      candidates: [
        {
          id: "notify_attach",
          sourceType: "attachment",
          sourceLabel: "附件 SI补料.pdf 第1页",
          value: "SAME AS CONSIGNEE",
          evidence: "PDF 第1页 notify 区块",
          confidence: "89%"
        },
        {
          id: "notify_email",
          sourceType: "email_body",
          sourceLabel: "邮件正文",
          value: "PIMA HOLDING COMPANY LIMITED",
          evidence: "邮件正文 notify party 行",
          confidence: "72%"
        }
      ]
    },
    {
      id: "pol",
      name: "Port of Loading / 装货港",
      risk: "高风险",
      status: "confirmed",
      targetId: "u7735",
      labelId: "u7612",
      currentValue: "SHANGHAI",
      selectedCandidateId: "pol_attach",
      candidates: [
        {
          id: "pol_attach",
          sourceType: "attachment",
          sourceLabel: "附件 SI补料.pdf 第1页",
          value: "SHANGHAI",
          evidence: "PDF 第1页 port of loading",
          confidence: "97%"
        },
        {
          id: "pol_email",
          sourceType: "email_body",
          sourceLabel: "邮件正文",
          value: "SHANGHAI",
          evidence: "邮件正文 POL",
          confidence: "93%"
        }
      ]
    },
    {
      id: "pod",
      name: "Port of Discharge / 卸货港",
      risk: "高风险",
      status: "conflict",
      targetId: "u7736",
      labelId: "u7614",
      currentValue: "",
      selectedCandidateId: "",
      candidates: [
        {
          id: "pod_attach",
          sourceType: "attachment",
          sourceLabel: "附件 SI补料.pdf 第1页",
          value: "HO CHI MINH",
          evidence: "PDF 第1页 POD",
          confidence: "92%"
        },
        {
          id: "pod_email",
          sourceType: "email_body",
          sourceLabel: "邮件正文",
          value: "HAIPHONG",
          evidence: "邮件正文目的港行",
          confidence: "85%"
        }
      ]
    },
    {
      id: "hscode",
      name: "HS Code",
      risk: "中风险",
      status: "confirmed",
      targetId: "u7639",
      labelId: "u7638",
      currentValue: "381220",
      selectedCandidateId: "hscode_attach",
      candidates: [
        {
          id: "hscode_attach",
          sourceType: "attachment",
          sourceLabel: "附件 装箱单.pdf",
          value: "381220",
          evidence: "装箱单第1页 HS CODE",
          confidence: "93%"
        }
      ]
    },
    {
      id: "goods",
      name: "Goods Description / 货描",
      risk: "高风险",
      status: "pending",
      targetId: "u7640",
      labelId: "u7640",
      currentValue: "PLASTIC ADDITIVE",
      selectedCandidateId: "goods_attach",
      candidates: [
        {
          id: "goods_attach",
          sourceType: "attachment",
          sourceLabel: "附件 SI补料.pdf 第1页",
          value: "PLASTIC ADDITIVE",
          evidence: "PDF 第1页 goods description",
          confidence: "86%"
        },
        {
          id: "goods_email",
          sourceType: "email_body",
          sourceLabel: "邮件正文",
          value: "PLASTIC ADDITIVES",
          evidence: "邮件正文 cargo 行",
          confidence: "78%"
        }
      ]
    },
    {
      id: "container_weight",
      name: "Container / Weight / CBM",
      risk: "高风险",
      status: "conflict",
      targetId: "u7643",
      labelId: "u7642",
      currentValue: "TIIU5280260 / 27216 KGS / 34 CBM",
      selectedCandidateId: "",
      candidates: [
        {
          id: "container_attach",
          sourceType: "attachment",
          sourceLabel: "附件 装箱单.pdf",
          value: "TIIU5280260 / CN4524758 / 1080 PKGS / 27216 KGS / 34 CBM",
          evidence: "装箱单第1页 container table",
          confidence: "95%"
        },
        {
          id: "container_email",
          sourceType: "email_body",
          sourceLabel: "邮件正文",
          value: "TIIU5280260 / CN4524758 / 1080 PKGS / 27016 KGS / 34 CBM",
          evidence: "邮件正文 container 行",
          confidence: "84%"
        }
      ]
    }
  ];

  var events = [
    {
      seq: 9,
      fieldId: "consignee",
      fieldName: "Consignee / 收货人",
      type: "发现取值冲突",
      sourceType: "system",
      source: "系统",
      actor: "系统",
      oldValue: "",
      newValue: "附件与邮件正文不一致",
      note: "等待人工确认",
      at: "2026-04-23 18:42"
    },
    {
      seq: 8,
      fieldId: "container_weight",
      fieldName: "Container / Weight / CBM",
      type: "发现取值冲突",
      sourceType: "system",
      source: "系统",
      actor: "系统",
      oldValue: "",
      newValue: "附件重量 27216 KGS，邮件正文 27016 KGS",
      note: "高风险字段",
      at: "2026-04-23 18:42"
    },
    {
      seq: 7,
      fieldId: "pol",
      fieldName: "Port of Loading / 装货港",
      type: "自动确认",
      sourceType: "attachment",
      source: "附件 + 邮件正文",
      actor: "系统",
      oldValue: "",
      newValue: "SHANGHAI",
      note: "标准化后一致",
      at: "2026-04-23 18:41"
    },
    {
      seq: 6,
      fieldId: "hscode",
      fieldName: "HS Code",
      type: "自动确认",
      sourceType: "attachment",
      source: "附件 装箱单.pdf",
      actor: "系统",
      oldValue: "",
      newValue: "381220",
      note: "单来源高置信",
      at: "2026-04-23 18:41"
    }
  ];

  function escapeHtml(value) {
    return String(value == null ? "" : value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }

  function findField(id) {
    for (var i = 0; i < fields.length; i += 1) {
      if (fields[i].id === id) return fields[i];
    }
    return null;
  }

  function findCandidate(field, candidateId) {
    for (var i = 0; i < field.candidates.length; i += 1) {
      if (field.candidates[i].id === candidateId) return field.candidates[i];
    }
    return null;
  }

  function sourceText(type) {
    return sourceTypeText[type] || type || "来源";
  }

  function statusLabel(status) {
    return statusText[status] || status;
  }

  function shorten(value, size) {
    var text = String(value || "").replace(/\s+/g, " ").trim();
    if (text.length <= size) return text;
    return text.slice(0, size - 1) + "...";
  }

  function stats() {
    var counts = { conflict: 0, pending: 0, missing: 0, confirmed: 0 };
    fields.forEach(function (field) {
      counts[field.status] = (counts[field.status] || 0) + 1;
    });
    return counts;
  }

  function addEvent(field, type, sourceType, source, oldValue, newValue, note) {
    var now = new Date();
    var pad = function (n) { return n < 10 ? "0" + n : String(n); };
    events.unshift({
      seq: eventSeq += 1,
      fieldId: field.id,
      fieldName: field.name,
      type: type,
      sourceType: sourceType,
      source: source,
      actor: sourceType === "system" ? "系统" : "操作员",
      oldValue: oldValue || "",
      newValue: newValue || "",
      note: note || "",
      at: now.getFullYear() + "-" + pad(now.getMonth() + 1) + "-" + pad(now.getDate()) + " " + pad(now.getHours()) + ":" + pad(now.getMinutes())
    });
  }

  function sortedFields() {
    var order = { conflict: 0, missing: 1, pending: 2, confirmed: 3 };
    return fields.slice().sort(function (a, b) {
      if (order[a.status] !== order[b.status]) return order[a.status] - order[b.status];
      return a.name.localeCompare(b.name);
    });
  }

  function fieldCardHtml(field) {
    var sourceChips = field.candidates.slice(0, 4).map(function (candidate) {
      return '<span class="mbl-source-chip">' + escapeHtml(sourceText(candidate.sourceType)) + '</span>';
    }).join("");
    return '' +
      '<button class="mbl-field-card ' + escapeHtml(field.status) + '" type="button" data-field-id="' + escapeHtml(field.id) + '">' +
        '<div class="mbl-audit-row">' +
          '<div class="mbl-field-name">' + escapeHtml(field.name) + '</div>' +
          '<span class="mbl-audit-pill ' + escapeHtml(field.status) + '">' + escapeHtml(statusLabel(field.status)) + '</span>' +
        '</div>' +
        '<div class="mbl-field-risk">' + escapeHtml(field.risk) + ' · ' + field.candidates.length + ' 个来源</div>' +
        '<div class="mbl-field-value">' + escapeHtml(shorten(field.currentValue || "尚未确定最终值", 92)) + '</div>' +
        '<div class="mbl-source-line">' + sourceChips + '</div>' +
      '</button>';
  }

  function fieldsTabHtml() {
    return '' +
      '<div class="mbl-audit-section-title">字段候选值</div>' +
      sortedFields().map(fieldCardHtml).join("");
  }

  function historyTabHtml() {
    if (!events.length) return '<div class="mbl-audit-empty">暂无字段变更记录</div>';
    return '' +
      '<div class="mbl-audit-section-title">字段级变更记录</div>' +
      '<div class="mbl-event-list">' +
        events.map(function (event) {
          return '' +
            '<div class="mbl-event-item">' +
              '<div class="mbl-event-title">' + escapeHtml(event.fieldName) + ' · ' + escapeHtml(event.type) + '</div>' +
              '<div class="mbl-event-meta">' + escapeHtml(event.at) + ' · ' + escapeHtml(event.actor) + ' · ' + escapeHtml(sourceText(event.sourceType)) + ' · ' + escapeHtml(event.source) + '</div>' +
              '<div class="mbl-event-diff">从 "' + escapeHtml(shorten(event.oldValue || "空", 32)) + '" 改为 "' + escapeHtml(shorten(event.newValue || "空", 48)) + '"</div>' +
              (event.note ? '<div class="mbl-event-meta">备注：' + escapeHtml(event.note) + '</div>' : '') +
            '</div>';
        }).join("") +
      '</div>';
  }

  function rulesTabHtml() {
    var snapshot = fields.map(function (field) {
      return '<div class="mbl-rule-item"><strong>' + escapeHtml(field.name) + '</strong><br>' +
        escapeHtml(statusLabel(field.status)) + ' · 当前值：' + escapeHtml(shorten(field.currentValue || "空", 84)) + '</div>';
    }).join("");
    return '' +
      '<div class="mbl-audit-section-title">来源规则</div>' +
      '<div class="mbl-rule-list">' +
        '<div class="mbl-rule-item">同一字段多来源标准化后一致时，可自动确认并保留全部来源。</div>' +
        '<div class="mbl-rule-item">附件、邮件正文、客户链接任一来源与当前值不一致时，字段进入冲突确认。</div>' +
        '<div class="mbl-rule-item">已确认字段收到客户链接新值时，不直接覆盖，先生成新的候选值和变更事件。</div>' +
        '<div class="mbl-rule-item">提交船司前只允许缺失和冲突均清零，并冻结一份提交版本快照。</div>' +
      '</div>' +
      '<div class="mbl-audit-section-title">提交快照预览</div>' +
      '<div class="mbl-rule-list">' + snapshot + '</div>';
  }

  function tabBodyHtml() {
    if (activeTab === "history") return historyTabHtml();
    if (activeTab === "rules") return rulesTabHtml();
    return fieldsTabHtml();
  }

  function shellHtml() {
    var count = stats();
    return '' +
      '<aside class="mbl-audit-shell" aria-label="字段可信审单">' +
        '<div class="mbl-audit-header">' +
          '<div class="mbl-audit-title-row">' +
            '<div class="mbl-audit-title">字段可信审单</div>' +
            '<span class="mbl-audit-pill conflict">' + count.conflict + ' 个冲突</span>' +
          '</div>' +
          '<div class="mbl-audit-subtitle">MBL提交前字段来源、候选值和人工确认</div>' +
        '</div>' +
        '<div class="mbl-audit-stats">' +
          '<div class="mbl-audit-stat"><strong>' + count.conflict + '</strong><span>冲突</span></div>' +
          '<div class="mbl-audit-stat"><strong>' + count.pending + '</strong><span>待确认</span></div>' +
          '<div class="mbl-audit-stat"><strong>' + count.missing + '</strong><span>缺失</span></div>' +
          '<div class="mbl-audit-stat"><strong>' + count.confirmed + '</strong><span>已确认</span></div>' +
        '</div>' +
        '<div class="mbl-audit-tabs">' +
          '<button class="mbl-audit-tab ' + (activeTab === "fields" ? "active" : "") + '" type="button" data-tab="fields">字段</button>' +
          '<button class="mbl-audit-tab ' + (activeTab === "history" ? "active" : "") + '" type="button" data-tab="history">记录</button>' +
          '<button class="mbl-audit-tab ' + (activeTab === "rules" ? "active" : "") + '" type="button" data-tab="rules">规则</button>' +
        '</div>' +
        '<div class="mbl-audit-body">' + tabBodyHtml() + '</div>' +
        '<div class="mbl-audit-footer">' +
          '<button class="mbl-audit-btn" type="button" data-simulate-link>客户链接回填</button>' +
          '<button class="mbl-audit-btn primary" type="button" data-submit-check>提交前校验</button>' +
        '</div>' +
      '</aside>';
  }

  function candidateHtml(field, candidate) {
    var selected = field.selectedCandidateId === candidate.id;
    return '' +
      '<div class="mbl-candidate ' + (selected ? "selected" : "") + '">' +
        '<div class="mbl-audit-row">' +
          '<div class="mbl-candidate-source">' + escapeHtml(sourceText(candidate.sourceType)) + ' · ' + escapeHtml(candidate.sourceLabel) + '</div>' +
          '<span class="mbl-source-chip">' + escapeHtml(candidate.confidence || "-") + '</span>' +
        '</div>' +
        '<div class="mbl-candidate-value">' + escapeHtml(candidate.value) + '</div>' +
        '<div class="mbl-candidate-meta">证据位置：' + escapeHtml(candidate.evidence || "未记录") + '</div>' +
        '<div class="mbl-drawer-actions">' +
          '<button class="mbl-audit-btn primary" type="button" data-use-candidate="' + escapeHtml(candidate.id) + '" data-candidate-field="' + escapeHtml(field.id) + '">采用此值</button>' +
          '<button class="mbl-audit-btn" type="button" data-show-evidence="' + escapeHtml(candidate.evidence || "未记录") + '">查看证据</button>' +
        '</div>' +
      '</div>';
  }

  function drawerHtml() {
    var field = findField(activeFieldId);
    if (!field) return "";
    var fieldEvents = events.filter(function (event) { return event.fieldId === field.id; }).slice(0, 4);
    return '' +
      '<aside class="mbl-audit-drawer" aria-label="字段来源详情">' +
        '<div class="mbl-drawer-head">' +
          '<div class="mbl-audit-row">' +
            '<div>' +
              '<h2 class="mbl-drawer-title">' + escapeHtml(field.name) + '</h2>' +
              '<div class="mbl-audit-subtitle">' + escapeHtml(field.risk) + ' · ' + escapeHtml(statusLabel(field.status)) + '</div>' +
            '</div>' +
            '<button class="mbl-drawer-close" type="button" data-close-drawer>x</button>' +
          '</div>' +
        '</div>' +
        '<div class="mbl-drawer-body">' +
          '<div class="mbl-current-box">' +
            '<div class="mbl-current-label">当前最终值</div>' +
            '<div class="mbl-current-value">' + escapeHtml(field.currentValue || "尚未确定") + '</div>' +
          '</div>' +
          '<div class="mbl-audit-section-title">候选来源</div>' +
          '<div class="mbl-candidate-list">' + field.candidates.map(function (candidate) { return candidateHtml(field, candidate); }).join("") + '</div>' +
          '<div class="mbl-manual-box">' +
            '<label for="mbl-manual-value">人工修改保存</label>' +
            '<textarea id="mbl-manual-value">' + escapeHtml(field.currentValue || "") + '</textarea>' +
            '<select id="mbl-manual-reason">' +
              '<option value="根据附件修正">根据附件修正</option>' +
              '<option value="根据邮件正文修正">根据邮件正文修正</option>' +
              '<option value="根据客户链接修正">根据客户链接修正</option>' +
              '<option value="根据电话/微信确认">根据电话/微信确认</option>' +
              '<option value="根据船司退回要求修正">根据船司退回要求修正</option>' +
              '<option value="其他">其他</option>' +
            '</select>' +
            '<div class="mbl-drawer-actions">' +
              '<button class="mbl-audit-btn danger" type="button" data-save-manual="' + escapeHtml(field.id) + '">保存人工修改</button>' +
              '<button class="mbl-audit-btn" type="button" data-confirm-current="' + escapeHtml(field.id) + '">确认当前值</button>' +
            '</div>' +
          '</div>' +
          '<div class="mbl-audit-section-title">本字段最近记录</div>' +
          '<div class="mbl-event-list">' +
            (fieldEvents.length ? fieldEvents.map(function (event) {
              return '<div class="mbl-event-item"><div class="mbl-event-title">' + escapeHtml(event.type) + '</div><div class="mbl-event-meta">' + escapeHtml(event.at) + ' · ' + escapeHtml(event.actor) + ' · ' + escapeHtml(event.source) + '</div><div class="mbl-event-diff">' + escapeHtml(shorten(event.newValue, 96)) + '</div></div>';
            }).join("") : '<div class="mbl-audit-empty">暂无单字段记录</div>') +
          '</div>' +
        '</div>' +
      '</aside>';
  }

  function modalHtml() {
    if (!modalState) return "";
    return '' +
      '<div class="mbl-audit-modal">' +
        '<div class="mbl-modal-card">' +
          '<div class="mbl-modal-head">' + escapeHtml(modalState.title) + '</div>' +
          '<div class="mbl-modal-body">' + modalState.body + '</div>' +
          '<div class="mbl-modal-foot">' +
            (modalState.primaryField ? '<button class="mbl-audit-btn primary" type="button" data-field-id="' + escapeHtml(modalState.primaryField) + '" data-close-modal>去处理</button>' : '') +
            '<button class="mbl-audit-btn" type="button" data-close-modal>关闭</button>' +
          '</div>' +
        '</div>' +
      '</div>';
  }

  function ensureRoot() {
    var root = document.getElementById("mbl-field-provenance-root");
    if (!root) {
      root = document.createElement("div");
      root.id = "mbl-field-provenance-root";
      document.body.appendChild(root);
    }
    return root;
  }

  function render() {
    var root = ensureRoot();
    root.innerHTML = shellHtml() + drawerHtml() + modalHtml();
    renderMarkers();
  }

  function renderMarkers() {
    removeMarkers();
    fields.forEach(function (field) {
      var target = document.getElementById(field.targetId) || document.getElementById(field.labelId);
      if (!target || !target.getClientRects().length) return;
      var rect = target.getBoundingClientRect();
      if ((rect.width === 0 && rect.height === 0) || rect.bottom < -20) return;

      var scrollLeft = window.pageXOffset || document.documentElement.scrollLeft || 0;
      var scrollTop = window.pageYOffset || document.documentElement.scrollTop || 0;

      var badge = document.createElement("button");
      badge.type = "button";
      badge.className = "mbl-field-badge " + field.status;
      badge.dataset.fieldId = field.id;
      badge.style.left = Math.max(0, Math.round(rect.right + scrollLeft - 14)) + "px";
      badge.style.top = Math.max(0, Math.round(rect.top + scrollTop - 12)) + "px";
      badge.textContent = statusLabel(field.status) + " " + field.candidates.length + "源";
      document.body.appendChild(badge);

      if (field.showOverlay && field.currentValue && rect.top + scrollTop >= 0) {
        var overlay = document.createElement("div");
        overlay.className = "mbl-field-value-overlay";
        overlay.dataset.fieldOverlay = field.id;
        overlay.style.left = Math.round(rect.left + scrollLeft + 8) + "px";
        overlay.style.top = Math.round(rect.top + scrollTop + 8) + "px";
        overlay.textContent = shorten(field.currentValue, 130);
        document.body.appendChild(overlay);
      }

      if (field.id === activeFieldId) {
        target.classList.add("mbl-audit-focus");
      } else {
        target.classList.remove("mbl-audit-focus");
      }
    });
  }

  function removeMarkers() {
    Array.prototype.slice.call(document.querySelectorAll(".mbl-field-badge,.mbl-field-value-overlay")).forEach(function (node) {
      node.parentNode.removeChild(node);
    });
    fields.forEach(function (field) {
      var target = document.getElementById(field.targetId);
      if (target) target.classList.remove("mbl-audit-focus");
    });
  }

  function applyValueToPage(field) {
    var target = document.getElementById(field.targetId);
    if (!target) return;
    var select = target.tagName === "SELECT" ? target : target.querySelector("select");
    if (select) {
      var exists = false;
      Array.prototype.slice.call(select.options).forEach(function (option) {
        if (option.value === field.currentValue) exists = true;
      });
      if (!exists) {
        var option = document.createElement("option");
        option.value = field.currentValue;
        option.textContent = field.currentValue;
        select.appendChild(option);
      }
      select.value = field.currentValue;
      return;
    }
    if (!field.showOverlay) {
      var textNode = target.querySelector(".text");
      if (textNode && textNode.style.visibility !== "hidden") {
        textNode.textContent = field.currentValue;
      }
    }
  }

  function openField(fieldId, shouldScroll) {
    var field = findField(fieldId);
    if (!field) return;
    activeFieldId = fieldId;
    activeTab = "fields";
    modalState = null;
    if (shouldScroll) {
      var target = document.getElementById(field.targetId) || document.getElementById(field.labelId);
      if (target && target.scrollIntoView) {
        target.scrollIntoView({ block: "center", inline: "nearest", behavior: "smooth" });
      }
    }
    render();
  }

  function adoptCandidate(fieldId, candidateId) {
    var field = findField(fieldId);
    if (!field) return;
    var candidate = findCandidate(field, candidateId);
    if (!candidate) return;
    var oldValue = field.currentValue;
    field.currentValue = candidate.value;
    field.status = "confirmed";
    field.selectedCandidateId = candidate.id;
    addEvent(field, "人工确认候选", candidate.sourceType, candidate.sourceLabel, oldValue, field.currentValue, "采用候选值");
    applyValueToPage(field);
    activeFieldId = field.id;
    activeTab = "history";
    render();
    showToast(field.name + " 已确认，来源：" + sourceText(candidate.sourceType));
  }

  function saveManual(fieldId) {
    var field = findField(fieldId);
    if (!field) return;
    var textarea = document.getElementById("mbl-manual-value");
    var reason = document.getElementById("mbl-manual-reason");
    var newValue = textarea ? textarea.value.trim() : "";
    if (!newValue) {
      showToast("人工修改值不能为空");
      return;
    }
    var oldValue = field.currentValue;
    field.currentValue = newValue;
    field.status = "confirmed";
    var candidateId = "manual_" + Date.now();
    field.selectedCandidateId = candidateId;
    field.candidates.push({
      id: candidateId,
      sourceType: "manual_edit",
      sourceLabel: "人工修改保存",
      value: newValue,
      evidence: "详情页人工保存",
      confidence: "人工确认"
    });
    addEvent(field, "人工修改保存", "manual_edit", "详情页", oldValue, newValue, reason ? reason.value : "人工修改");
    applyValueToPage(field);
    activeTab = "history";
    render();
    showToast(field.name + " 已保存人工修改");
  }

  function confirmCurrent(fieldId) {
    var field = findField(fieldId);
    if (!field) return;
    var oldStatus = field.status;
    field.status = "confirmed";
    addEvent(field, "确认当前值", "selection", "详情页", field.currentValue, field.currentValue, "状态从" + statusLabel(oldStatus) + "变为已确认");
    applyValueToPage(field);
    activeTab = "history";
    render();
    showToast(field.name + " 已确认当前值");
  }

  function simulateCustomerLink() {
    var field = findField("notify");
    if (!field) return;
    var exists = field.candidates.some(function (candidate) { return candidate.id === "notify_link_1"; });
    if (!exists) {
      field.candidates.push({
        id: "notify_link_1",
        sourceType: "customer_link",
        sourceLabel: "客户链接 2026-04-23 19:08",
        value: "PIMA HOLDING COMPANY LIMITED\nTEL:+84 6275 2626\nEMAIL:tuan.truong@pima.com.vn",
        evidence: "客户补料链接提交记录",
        confidence: "客户填写"
      });
      field.status = "conflict";
      addEvent(field, "客户链接新增候选值", "customer_link", "客户链接", field.currentValue, "PIMA HOLDING COMPANY LIMITED / TEL / EMAIL", "客户回填值与当前值不一致");
      showToast("客户链接已回填 Notify Party，新值已进入冲突确认");
    } else {
      showToast("客户链接回填记录已存在");
    }
    openField("notify", false);
  }

  function submitCheck() {
    var unresolved = fields.filter(function (field) {
      return field.status === "conflict" || field.status === "missing";
    });
    if (unresolved.length) {
      modalState = {
        title: "提交前校验未通过",
        primaryField: unresolved[0].id,
        body: "还有 " + unresolved.length + " 个字段不能提交船司：" +
          '<ul>' + unresolved.map(function (field) {
            return '<li>' + escapeHtml(field.name) + '：' + escapeHtml(statusLabel(field.status)) + '</li>';
          }).join("") + '</ul>'
      };
      render();
      return;
    }

    var snapshot = fields.map(function (field) {
      return field.name + "=" + (field.currentValue || "空");
    }).join("; ");
    events.unshift({
      seq: eventSeq += 1,
      fieldId: "submission",
      fieldName: "提交版本快照",
      type: "提交前校验通过",
      sourceType: "system",
      source: "详情页",
      actor: "系统",
      oldValue: "",
      newValue: snapshot,
      note: "可提交船司",
      at: "2026-04-23 " + new Date().toTimeString().slice(0, 5)
    });
    modalState = {
      title: "提交前校验通过",
      body: "缺失字段和冲突字段均已处理，可冻结提交版本快照。"
    };
    activeTab = "history";
    render();
  }

  function showEvidence(text) {
    showToast("证据位置：" + text);
  }

  function showToast(message) {
    var old = document.querySelector(".mbl-toast");
    if (old) old.parentNode.removeChild(old);
    var toast = document.createElement("div");
    toast.className = "mbl-toast";
    toast.textContent = message;
    document.body.appendChild(toast);
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () {
      if (toast.parentNode) toast.parentNode.removeChild(toast);
    }, 2600);
  }

  function bindEvents() {
    document.addEventListener("click", function (event) {
      var tab = event.target.closest("[data-tab]");
      var fieldButton = event.target.closest("[data-field-id]");
      var closeDrawer = event.target.closest("[data-close-drawer]");
      var useCandidate = event.target.closest("[data-use-candidate]");
      var saveManualButton = event.target.closest("[data-save-manual]");
      var confirmButton = event.target.closest("[data-confirm-current]");
      var simulateLink = event.target.closest("[data-simulate-link]");
      var submitButton = event.target.closest("[data-submit-check]");
      var closeModal = event.target.closest("[data-close-modal]");
      var evidence = event.target.closest("[data-show-evidence]");

      if (tab) {
        activeTab = tab.dataset.tab;
        render();
        return;
      }

      if (useCandidate) {
        adoptCandidate(useCandidate.dataset.candidateField, useCandidate.dataset.useCandidate);
        return;
      }

      if (saveManualButton) {
        saveManual(saveManualButton.dataset.saveManual);
        return;
      }

      if (confirmButton) {
        confirmCurrent(confirmButton.dataset.confirmCurrent);
        return;
      }

      if (simulateLink) {
        simulateCustomerLink();
        return;
      }

      if (submitButton) {
        submitCheck();
        return;
      }

      if (evidence) {
        showEvidence(evidence.dataset.showEvidence);
        return;
      }

      if (closeModal) {
        var targetField = closeModal.dataset.fieldId;
        modalState = null;
        if (targetField) {
          openField(targetField, true);
        } else {
          render();
        }
        return;
      }

      if (closeDrawer) {
        activeFieldId = "";
        render();
        return;
      }

      if (fieldButton) {
        openField(fieldButton.dataset.fieldId, fieldButton.classList.contains("mbl-field-card"));
      }
    });

    window.addEventListener("resize", renderMarkers);
    window.addEventListener("scroll", renderMarkers, true);
  }

  function init() {
    bindEvents();
    fields.forEach(applyValueToPage);
    render();
    setTimeout(renderMarkers, 350);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
