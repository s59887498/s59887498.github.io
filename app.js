const PAGE = document.body.dataset.page || 'home';
const MD_FILE = document.body.dataset.mdFile || './EOMC_QA_AI_WorkFlow.md';

const state = {
  markdown: '',
  sections: [],
  tables: [],
  timingRows: [],
  moduleRows: [],
};

const dom = {
  title: document.querySelector('#docTitle'),
  sourceLabel: document.querySelector('#sourceLabel'),
  versionBadge: document.querySelector('#versionBadge'),
  reloadButton: document.querySelector('#reloadButton'),
  searchInput: document.querySelector('#searchInput'),
  sectionNav: document.querySelector('#sectionNav'),
  content: document.querySelector('#markdownContent'),
  timingCount: document.querySelector('#timingCount'),
  moduleCount: document.querySelector('#moduleCount'),
  riskCount: document.querySelector('#riskCount'),
  gateCount: document.querySelector('#gateCount'),
  bigQuestionCount: document.querySelector('#bigQuestionCount'),
  answerCount: document.querySelector('#answerCount'),
  foundationCount: document.querySelector('#foundationCount'),
  lifecycleCount: document.querySelector('#lifecycleCount'),
  handoffCount: document.querySelector('#handoffCount'),
  gateChecklistCount: document.querySelector('#gateChecklistCount'),
  stageCount: document.querySelector('#stageCount'),
  taskCount: document.querySelector('#taskCount'),
  totalEstimate: document.querySelector('#totalEstimate'),
  pyramidGrid: document.querySelector('#pyramidGrid'),
  lifecycleGrid: document.querySelector('#lifecycleGrid'),
  capabilityGrid: document.querySelector('#capabilityGrid'),
  qualityMetricGrid: document.querySelector('#qualityMetricGrid'),
  handoffChecklistGrid: document.querySelector('#handoffChecklistGrid'),
  mappingGrid: document.querySelector('#mappingGrid'),
  timingRail: document.querySelector('#timingRail'),
  moduleGrid: document.querySelector('#moduleGrid'),
  deliverableGrid: document.querySelector('#deliverableGrid'),
  testTypeGrid: document.querySelector('#testTypeGrid'),
  riskList: document.querySelector('#riskList'),
  releaseGateList: document.querySelector('#releaseGateList'),
  gateChecklistGrid: document.querySelector('#gateChecklistGrid'),
  roadmap: document.querySelector('#roadmapGrid'),
  stageGrid: document.querySelector('#stageGrid'),
  executionTaskBoard: document.querySelector('#executionTaskBoard'),
  triggerMatrixGrid: document.querySelector('#triggerMatrixGrid'),
  evidenceGrid: document.querySelector('#evidenceGrid'),
  modal: document.querySelector('#detailModal'),
  modalKicker: document.querySelector('#modalKicker'),
  modalTitle: document.querySelector('#modalTitle'),
  modalBody: document.querySelector('#modalBody'),
};

function escapeHtml(value) {
  return String(value ?? '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

function slugify(text) {
  return (
    String(text)
      .trim()
      .toLowerCase()
      .replace(/[`*_()[\]：:，,./\\]/g, '')
      .replace(/\s+/g, '-')
      .replace(/^-+|-+$/g, '') || `section-${Math.random().toString(16).slice(2)}`
  );
}

function inlineMarkdown(text) {
  let html = escapeHtml(text);
  html = html.replace(/`([^`]+)`/g, '<code>$1</code>');
  html = html.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
  html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noreferrer">$1</a>');
  return html;
}

function splitRow(line) {
  const trimmed = line.trim().replace(/^\|/, '').replace(/\|$/, '');
  return trimmed.split('|').map((cell) => cell.trim());
}

function isSeparator(line) {
  return /^\s*\|?\s*:?-{3,}:?\s*(\|\s*:?-{3,}:?\s*)+\|?\s*$/.test(line);
}

function parseTables(markdown) {
  const lines = markdown.split('\n');
  const tables = [];
  let currentHeading = '';

  for (let i = 0; i < lines.length; i += 1) {
    const heading = lines[i].match(/^(#{2,4})\s+(.+)$/);
    if (heading) currentHeading = heading[2].trim();

    if (lines[i].includes('|') && lines[i + 1] && isSeparator(lines[i + 1])) {
      const headers = splitRow(lines[i]);
      const rows = [];
      i += 2;
      while (i < lines.length && lines[i].includes('|') && lines[i].trim()) {
        const cells = splitRow(lines[i]);
        const row = {};
        headers.forEach((header, index) => {
          row[header] = cells[index] || '';
        });
        rows.push(row);
        i += 1;
      }
      i -= 1;
      tables.push({ heading: currentHeading, headers, rows });
    }
  }

  return tables;
}

function parseSections(markdown) {
  return markdown
    .split('\n')
    .map((line) => line.match(/^##\s+(.+)$/))
    .filter(Boolean)
    .map((match) => {
      const title = match[1].trim();
      return { title, id: slugify(title) };
    });
}

function renderMarkdown(markdown) {
  const lines = markdown.split('\n');
  const html = [];
  let inCode = false;
  let codeFence = '';
  let codeLang = '';
  let codeBuffer = [];
  let inList = false;
  let listType = '';

  const closeList = () => {
    if (!inList) return;
    html.push(`</${listType}>`);
    inList = false;
    listType = '';
  };

  const openList = (type) => {
    if (inList && listType === type) return;
    closeList();
    listType = type;
    inList = true;
    html.push(`<${type}>`);
  };

  for (let i = 0; i < lines.length; i += 1) {
    const line = lines[i];
    const fence = line.match(/^(`{3,}|~{3,})(\w+)?\s*$/);

    if (inCode) {
      if (line.startsWith(codeFence)) {
        const code = codeBuffer.join('\n');
        if (codeLang === 'mermaid') {
          html.push(
            `<div class="mermaid-box"><strong>流程圖原始碼</strong><pre><code>${escapeHtml(code)}</code></pre></div>`
          );
        } else {
          html.push(`<pre><code>${escapeHtml(code)}</code></pre>`);
        }
        inCode = false;
        codeFence = '';
        codeLang = '';
        codeBuffer = [];
      } else {
        codeBuffer.push(line);
      }
      continue;
    }

    if (fence) {
      closeList();
      inCode = true;
      codeFence = fence[1];
      codeLang = fence[2] || '';
      codeBuffer = [];
      continue;
    }

    if (!line.trim()) {
      closeList();
      continue;
    }

    if (/^---+\s*$/.test(line)) {
      closeList();
      html.push('<hr />');
      continue;
    }

    const heading = line.match(/^(#{1,4})\s+(.+)$/);
    if (heading) {
      closeList();
      const level = heading[1].length;
      const text = heading[2].trim();
      const id = level === 2 ? ` id="${slugify(text)}"` : '';
      html.push(`<h${level}${id}>${inlineMarkdown(text)}</h${level}>`);
      continue;
    }

    if (line.startsWith('>')) {
      closeList();
      html.push(`<blockquote>${inlineMarkdown(line.replace(/^>\s?/, ''))}</blockquote>`);
      continue;
    }

    if (line.includes('|') && lines[i + 1] && isSeparator(lines[i + 1])) {
      closeList();
      const headers = splitRow(line);
      const bodyRows = [];
      i += 2;
      while (i < lines.length && lines[i].includes('|') && lines[i].trim()) {
        bodyRows.push(splitRow(lines[i]));
        i += 1;
      }
      i -= 1;
      html.push('<div class="table-wrap"><table>');
      html.push(`<thead><tr>${headers.map((h) => `<th>${inlineMarkdown(h)}</th>`).join('')}</tr></thead>`);
      html.push('<tbody>');
      bodyRows.forEach((row) => {
        html.push(`<tr>${headers.map((_, index) => `<td>${inlineMarkdown(row[index] || '')}</td>`).join('')}</tr>`);
      });
      html.push('</tbody></table></div>');
      continue;
    }

    const ordered = line.match(/^\d+\.\s+(.+)$/);
    if (ordered) {
      openList('ol');
      html.push(`<li>${inlineMarkdown(ordered[1])}</li>`);
      continue;
    }

    const unordered = line.match(/^-\s+(.+)$/);
    if (unordered) {
      openList('ul');
      html.push(`<li>${inlineMarkdown(unordered[1])}</li>`);
      continue;
    }

    closeList();
    html.push(`<p>${inlineMarkdown(line)}</p>`);
  }

  closeList();
  return html.join('\n');
}

function findTable(predicate) {
  return state.tables.find((table) => predicate(table.headers, table.heading, table.rows)) || { rows: [], headers: [] };
}

function parseVersion(markdown) {
  return markdown.match(/版本[:：]\s*(v[\w.-]+)/)?.[1] || 'v0.5';
}

function chipsFrom(text) {
  return String(text || '')
    .split(/[、,，/]+/)
    .map((item) => item.trim())
    .filter(Boolean);
}

function unique(values) {
  return [...new Set(values.filter(Boolean))];
}

function detailRows(items) {
  return `
    <dl class="detail-list">
      ${items
        .filter((item) => item.value)
        .map(
          (item) => `
            <div>
              <dt>${escapeHtml(item.label)}</dt>
              <dd>${inlineMarkdown(item.value)}</dd>
            </div>
          `
        )
        .join('')}
    </dl>
  `;
}

function openModal(kicker, title, body) {
  if (!dom.modal) return;
  dom.modalKicker.textContent = kicker;
  dom.modalTitle.textContent = title;
  dom.modalBody.innerHTML = body;
  dom.modal.classList.add('open');
  dom.modal.setAttribute('aria-hidden', 'false');
  document.body.classList.add('modal-open');
}

function closeModal() {
  if (!dom.modal) return;
  dom.modal.classList.remove('open');
  dom.modal.setAttribute('aria-hidden', 'true');
  document.body.classList.remove('modal-open');
}

function renderNav(sections) {
  if (!dom.sectionNav) return;
  dom.sectionNav.innerHTML = sections
    .map(
      (section) =>
        `<a href="#${escapeHtml(section.id)}" data-target-id="${escapeHtml(section.id)}" data-title="${escapeHtml(section.title.toLowerCase())}">${escapeHtml(section.title)}</a>`
    )
    .join('');
}

function renderPyramid(rows) {
  if (!dom.pyramidGrid) return;
  if (!rows.length) {
    dom.pyramidGrid.innerHTML = '<div class="empty-state">沒有在 MD 找到品質維護金字塔表。</div>';
    return;
  }

  const bigQuestion = rows.find((row) => row['問題層級'] === 'Big Question') || rows[0];
  const answers = rows.filter((row) => /^Q\d/.test(row['問題層級']));
  const foundation = rows.find((row) => row['問題層級'] === 'Foundation');

  if (dom.bigQuestionCount) dom.bigQuestionCount.textContent = bigQuestion ? '1' : '--';
  if (dom.answerCount) dom.answerCount.textContent = answers.length || '--';
  if (dom.foundationCount) dom.foundationCount.textContent = foundation ? '1' : '--';

  dom.pyramidGrid.innerHTML = `
    <article class="big-question-card">
      <span class="badge">${inlineMarkdown(bigQuestion['問題層級'])}</span>
      <h3>${inlineMarkdown(bigQuestion['問題'])}</h3>
      <p>${inlineMarkdown(bigQuestion['答案'])}</p>
      <div class="artifact">${inlineMarkdown(bigQuestion['主管視角'])}</div>
    </article>
    <div class="answer-grid">
      ${answers
        .map(
          (row) => `
            <article class="answer-card">
              <div class="timing-top">
                <span class="badge">${inlineMarkdown(row['問題層級'])}</span>
                <span class="owner-pill">${inlineMarkdown(row['答案'])}</span>
              </div>
              <h3>${inlineMarkdown(row['問題'])}</h3>
              <p>${inlineMarkdown(row['主管視角'])}</p>
              <div class="artifact">${inlineMarkdown(row['落地產出'])}</div>
            </article>
          `
        )
        .join('')}
    </div>
    ${
      foundation
        ? `
          <article class="foundation-card">
            <span class="badge">${inlineMarkdown(foundation['問題層級'])}</span>
            <h3>${inlineMarkdown(foundation['答案'])}</h3>
            <p>${inlineMarkdown(foundation['問題'])}</p>
            <div class="artifact">${inlineMarkdown(foundation['落地產出'])}</div>
          </article>
        `
        : ''
    }
  `;
}

function renderLifecycle(rows) {
  if (!dom.lifecycleGrid) return;
  const timingRows = rows.filter((row) => /^T[1-8]$/.test(row.T));
  if (dom.lifecycleCount) dom.lifecycleCount.textContent = timingRows.length || '--';

  if (!timingRows.length) {
    dom.lifecycleGrid.innerHTML = '<div class="empty-state">沒有在 MD 找到 T1-T8 品質生命週期表。</div>';
    return;
  }

  dom.lifecycleGrid.innerHTML = timingRows
    .map(
      (row) => `
        <article class="lifecycle-card">
          <div class="timing-top">
            <span class="badge">${inlineMarkdown(row.T)}</span>
            <span class="owner-pill">${inlineMarkdown(row.Owner)}</span>
          </div>
          <h3>${inlineMarkdown(row['時機'])}</h3>
          <p>${inlineMarkdown(row['品質目的'])}</p>
          <dl class="compact-detail-list">
            <div>
              <dt>輸入</dt>
              <dd>${inlineMarkdown(row['輸入'])}</dd>
            </div>
            <div>
              <dt>輸出</dt>
              <dd>${inlineMarkdown(row['輸出'])}</dd>
            </div>
            <div>
              <dt>對應能力</dt>
              <dd>${inlineMarkdown(row['對應能力'])}</dd>
            </div>
          </dl>
          <div class="artifact">${inlineMarkdown(row['詳細規劃'])}</div>
        </article>
      `
    )
    .join('');
}

function renderCapabilities(rows) {
  if (!dom.capabilityGrid) return;
  if (!rows.length) {
    dom.capabilityGrid.innerHTML = '<div class="empty-state">沒有在 MD 找到 A/B/C/D 能力模型表。</div>';
    return;
  }

  const groups = unique(rows.map((row) => row['能力']));
  dom.capabilityGrid.innerHTML = groups
    .map((group) => {
      const items = rows.filter((row) => row['能力'] === group);
      return `
        <article class="capability-group">
          <div class="capability-title">
            <span class="badge">${inlineMarkdown(group.split('.')[0] || group)}</span>
            <h3>${inlineMarkdown(group.replace(/^[A-D]\.\s*/, ''))}</h3>
          </div>
          <div class="capability-items">
            ${items
              .map(
                (row) => `
                  <section class="capability-item">
                    <h4>${inlineMarkdown(row['子項'])}</h4>
                    <p>${inlineMarkdown(row['目的'])}</p>
                    <dl>
                      <div>
                        <dt>DoD</dt>
                        <dd>${inlineMarkdown(row['DoD'])}</dd>
                      </div>
                      <div>
                        <dt>證據</dt>
                        <dd>${inlineMarkdown(row['主要證據'])}</dd>
                      </div>
                    </dl>
                  </section>
                `
              )
              .join('')}
          </div>
        </article>
      `;
    })
    .join('');
}

function renderQualityMetrics(rows) {
  if (!dom.qualityMetricGrid) return;
  if (!rows.length) {
    dom.qualityMetricGrid.innerHTML = '<div class="empty-state">沒有在 MD 找到 Quality Metrics 表。</div>';
    return;
  }

  dom.qualityMetricGrid.innerHTML = rows
    .map(
      (row) => `
        <article class="metric-row-card">
          <div class="metric-row-main">
            <span class="badge">${inlineMarkdown(row['對應能力'])}</span>
            <h3>${inlineMarkdown(row['指標'])}</h3>
            <p>${inlineMarkdown(row['定義'])}</p>
          </div>
          <dl class="compact-detail-list">
            <div>
              <dt>用途</dt>
              <dd>${inlineMarkdown(row['用途'])}</dd>
            </div>
            <div>
              <dt>建議門檻</dt>
              <dd>${inlineMarkdown(row['建議門檻'])}</dd>
            </div>
            <div>
              <dt>證據</dt>
              <dd>${inlineMarkdown(row['證據'])}</dd>
            </div>
          </dl>
        </article>
      `
    )
    .join('');
}

function handoffStatusClass(status) {
  const value = String(status || '');
  if (/完成|Ready|綠/.test(value)) return 'green';
  if (/進行|Review|黃/.test(value)) return 'yellow';
  if (/阻塞|Blocked|紅/.test(value)) return 'red';
  return 'pending';
}

function renderHandoffChecklist(rows) {
  if (!dom.handoffChecklistGrid) return;
  if (dom.handoffCount) dom.handoffCount.textContent = rows.length || '--';

  if (!rows.length) {
    dom.handoffChecklistGrid.innerHTML = '<div class="empty-state">沒有在 MD 找到 Team Handoff Checklist 表。</div>';
    return;
  }

  dom.handoffChecklistGrid.innerHTML = `
    <div class="handoff-items" role="list">
      ${rows
        .map((row) => {
          const status = row.Status || '待確認';
          const statusClass = handoffStatusClass(status);
          return `
            <article class="handoff-row ${statusClass}" role="listitem">
              <div class="handoff-row-top">
                <span class="light-pill ${statusClass}">${inlineMarkdown(status)}</span>
                <span class="badge">${inlineMarkdown(row.Workstream)}</span>
                <h3>${inlineMarkdown(row.Deliverable)}</h3>
                <p>${inlineMarkdown(row.Owner)}</p>
              </div>
              <dl class="handoff-detail-grid">
                <div>
                  <dt>Source of Truth</dt>
                  <dd>${inlineMarkdown(row['Source of Truth'])}</dd>
                </div>
                <div>
                  <dt>DoD</dt>
                  <dd>${inlineMarkdown(row.DoD)}</dd>
                </div>
                <div>
                  <dt>RACI</dt>
                  <dd>${inlineMarkdown(row.RACI)}</dd>
                </div>
                <div>
                  <dt>Risk acceptance</dt>
                  <dd>${inlineMarkdown(row['Risk acceptance'])}</dd>
                </div>
                <div>
                  <dt>Evidence</dt>
                  <dd>${inlineMarkdown(row.Evidence)}</dd>
                </div>
              </dl>
            </article>
          `;
        })
        .join('')}
    </div>
  `;
}

function renderMapping(rows) {
  if (!dom.mappingGrid) return;
  if (!rows.length) {
    dom.mappingGrid.innerHTML = '<div class="empty-state">沒有在 MD 找到流程對應表。</div>';
    return;
  }

  dom.mappingGrid.innerHTML = rows
    .map(
      (row) => `
        <article class="mapping-row">
          <div class="mapping-main">
            <span class="badge">${inlineMarkdown(row['原流程元件'])}</span>
            <h3>${inlineMarkdown(row['主管說法'])}</h3>
            <p>${inlineMarkdown(row['用途'])}</p>
          </div>
          <div class="mapping-capability">${inlineMarkdown(row['對應能力'])}</div>
        </article>
      `
    )
    .join('');
}

function renderTiming(rows) {
  if (!dom.timingRail) return;
  state.timingRows = rows.filter((row) => /^T[1-7]$/.test(row.T));
  if (dom.timingCount) dom.timingCount.textContent = state.timingRows.length || '--';

  if (!state.timingRows.length) {
    dom.timingRail.innerHTML = '<div class="empty-state">沒有在 MD 找到 T1-T7 測試時機表。</div>';
    return;
  }

  dom.timingRail.innerHTML = state.timingRows
    .map((row, index) => {
      const modules = chipsFrom(row['建議 M 模塊']);
      return `
        <button class="timing-card action-card" type="button" data-timing-index="${index}">
          <div class="timing-top">
            <span class="badge">${escapeHtml(row.T)}</span>
            <span class="owner-pill">${escapeHtml(row['負責/協作'])}</span>
          </div>
          <h3>${inlineMarkdown(row['時機'])}</h3>
          <p>${inlineMarkdown(row['QA 卡片摘要'])}</p>
          <div class="chip-row">${modules.map((module) => `<span class="chip">${escapeHtml(module)}</span>`).join('')}</div>
        </button>
      `;
    })
    .join('');

  dom.timingRail.querySelectorAll('[data-timing-index]').forEach((button) => {
    button.addEventListener('click', () => {
      const row = state.timingRows[Number(button.dataset.timingIndex)];
      openModal(
        `${row.T} · ${row['負責/協作']}`,
        row['時機'],
        detailRows([
          { label: 'QA 摘要', value: row['QA 卡片摘要'] },
          { label: '建議 M 模塊', value: row['建議 M 模塊'] },
          { label: '工具 / Prompt', value: row['工具/Prompt'] },
          { label: '呈現方式', value: row['呈現方式'] },
          { label: '詳細 QA 規劃', value: row['詳細 QA 規劃'] },
          { label: 'EOMC 示範', value: row['EOMC 示範'] },
        ])
      );
    });
  });
}

function renderModules(rows) {
  if (!dom.moduleGrid) return;
  state.moduleRows = rows;
  if (dom.moduleCount) dom.moduleCount.textContent = rows.length || '--';

  if (!rows.length) {
    dom.moduleGrid.innerHTML = '<div class="empty-state">沒有在 MD 找到 M 測試模塊表。</div>';
    return;
  }

  dom.moduleGrid.innerHTML = rows
    .map(
      (row, index) => `
        <button class="module-card action-card" type="button" data-module-index="${index}">
          <div class="timing-top">
            <span class="badge">${escapeHtml(row.M)}</span>
            <span class="module-tag-group">
              <span class="cost-pill">${escapeHtml(row['成本'])}</span>
              ${
                row['狀態']
                  ? `<span class="status-pill ${row['狀態'] === '待建置' ? 'todo' : ''}">${escapeHtml(row['狀態'])}</span>`
                  : ''
              }
            </span>
          </div>
          <h3>${inlineMarkdown(row['模塊'])}</h3>
          <p class="card-kicker">${inlineMarkdown(row['定義'])}</p>
          <div class="artifact">${inlineMarkdown(row['產出/證據'])}</div>
        </button>
      `
    )
    .join('');

  dom.moduleGrid.querySelectorAll('[data-module-index]').forEach((button) => {
    button.addEventListener('click', () => {
      const row = state.moduleRows[Number(button.dataset.moduleIndex)];
      openModal(
        `${row.M} · ${row['成本']}`,
        row['模塊'],
        detailRows([
          { label: '定義', value: row['定義'] },
          { label: '狀態', value: row['狀態'] },
          { label: '適合時機', value: row['適合時機'] },
          { label: 'QA 重點', value: row['QA 重點'] },
          { label: '產出 / 證據', value: row['產出/證據'] },
          { label: '詳細規範', value: row['詳細規範'] },
        ])
      );
    });
  });
}

function renderDeliverables(rows) {
  if (!dom.deliverableGrid) return;
  if (!rows.length) {
    dom.deliverableGrid.innerHTML = '<div class="empty-state">沒有在 MD 找到 QA 產出規範表。</div>';
    return;
  }

  dom.deliverableGrid.innerHTML = rows
    .map(
      (row) => `
        <article class="deliverable-card">
          <div class="timing-top">
            <span class="badge">${inlineMarkdown(row['產出物'])}</span>
          </div>
          <h3>${inlineMarkdown(row['目的'])}</h3>
          <p>${inlineMarkdown(row['必備規範'])}</p>
          <div class="card-meta">
            <span><strong>來源：</strong>${inlineMarkdown(row['必要來源'])}</span>
            <span><strong>路徑：</strong>${inlineMarkdown(row['產出路徑'])}</span>
            <span><strong>工具：</strong>${inlineMarkdown(row['對應 Skill/Template'])}</span>
          </div>
        </article>
      `
    )
    .join('');
}

function renderTestTypes(rows) {
  if (!dom.testTypeGrid) return;
  if (!rows.length) {
    dom.testTypeGrid.innerHTML = '<div class="empty-state">沒有在 MD 找到測試類型定義表。</div>';
    return;
  }

  dom.testTypeGrid.innerHTML = rows
    .map(
      (row) => `
        <article class="test-type-card">
          <div class="timing-top">
            <span class="badge">${inlineMarkdown(row['測試類型'])}</span>
            <span class="owner-pill">${inlineMarkdown(row['來源規範'])}</span>
          </div>
          <h3>${inlineMarkdown(row['定義'])}</h3>
          <p>${inlineMarkdown(row['常見驗證'])}</p>
          <div class="artifact">${inlineMarkdown(row['產出重點'])}</div>
        </article>
      `
    )
    .join('');
}

function renderStack(container, rows, titleKey, bodyKey, metaKey) {
  if (!container) return;
  if (!rows.length) {
    container.innerHTML = '<div class="empty-state">MD 尚未提供此區塊資料。</div>';
    return;
  }

  container.innerHTML = rows
    .map(
      (row) => `
        <article class="stack-item">
          <h3>${inlineMarkdown(row[titleKey])}</h3>
          <p>${inlineMarkdown(row[bodyKey])}</p>
          ${metaKey ? `<p><strong>${inlineMarkdown(row[metaKey])}</strong></p>` : ''}
        </article>
      `
    )
    .join('');
}

function toneForGate(row) {
  const text = `${row['項目']} ${row['放行標準']} ${row['備註']}`;
  if (/L0|L1|No-go|不可放/.test(text)) return 'danger';
  if (/L2|WARN|Conditional|可有/.test(text)) return 'warning';
  return 'success';
}

function renderReleaseGates(rows) {
  if (!dom.releaseGateList) return;
  const categories = unique(rows.map((row) => row['分類']));
  const sortedCategories = [
    ...categories.filter((category) => category === 'Severity'),
    ...categories.filter((category) => category !== 'Severity'),
  ];
  if (dom.gateCount) dom.gateCount.textContent = categories.length || '--';

  if (!rows.length) {
    dom.releaseGateList.innerHTML = '<div class="empty-state">沒有在 MD 找到分類放行標準。</div>';
    return;
  }

  dom.releaseGateList.innerHTML = sortedCategories
    .map((category) => {
      const items = rows.filter((row) => row['分類'] === category);
      return `
        <section class="gate-group ${category === 'Severity' ? 'severity-group' : ''}">
          <h3>${escapeHtml(category)}</h3>
          ${category === 'Severity' ? '<p class="gate-group-note">Severity 是最上層放行語言；下方模組分類則用來判斷各領域是否達到可放行證據。</p>' : ''}
          <div class="stack-list">
            ${items
              .map(
                (row) => `
                  <article class="stack-item ${toneForGate(row)}">
                    <h4>${inlineMarkdown(row['項目'])}</h4>
                    <p>${inlineMarkdown(row['放行標準'])}</p>
                    <p>${inlineMarkdown(row['QA 檢查'])}</p>
                    <p><strong>${inlineMarkdown(row['備註'])}</strong></p>
                  </article>
                `
              )
              .join('')}
          </div>
        </section>
      `;
    })
    .join('');
}

function checklistStatusClass(status) {
  const value = String(status || '');
  if (value.includes('綠')) return 'green';
  if (value.includes('黃')) return 'yellow';
  if (value.includes('紅')) return 'red';
  return 'pending';
}

function renderGateChecklist(rows) {
  if (!dom.gateChecklistGrid) return;
  if (dom.gateChecklistCount) dom.gateChecklistCount.textContent = rows.length || '--';
  if (!rows.length) {
    dom.gateChecklistGrid.innerHTML = '<div class="empty-state">沒有在 MD 找到 QA Gate Checklist 表。</div>';
    return;
  }

  dom.gateChecklistGrid.innerHTML = `
    <div class="checklist-header" aria-hidden="true">
      <span>Status</span>
      <span>Gate / Check Item</span>
      <span>燈號條件</span>
      <span>必須證據</span>
    </div>
    <div class="checklist-items" role="list">
      ${rows
        .map((row) => {
          const status = row.Status || '待確認';
          const statusClass = checklistStatusClass(status);
          return `
            <article class="checklist-row ${statusClass}" role="listitem">
              <div class="checklist-cell status-cell">
                <span class="light-pill ${statusClass}">${inlineMarkdown(status)}</span>
              </div>
              <div class="checklist-cell checklist-name">
                <span class="badge">${inlineMarkdown(row.Gate)}</span>
                <h3>${inlineMarkdown(row['Check Item'])}</h3>
                <p>${inlineMarkdown(row.Owner)} · ${inlineMarkdown(row['對應 T/M'] || row['對應 T'])}</p>
              </div>
              <dl class="checklist-cell gate-rule-list">
                <div>
                  <dt><span class="signal-dot green" title="綠燈" aria-label="綠燈"></span><span class="sr-only">綠燈</span></dt>
                  <dd>${inlineMarkdown(row['綠燈條件'])}</dd>
                </div>
                <div>
                  <dt><span class="signal-dot yellow" title="黃燈" aria-label="黃燈"></span><span class="sr-only">黃燈</span></dt>
                  <dd>${inlineMarkdown(row['黃燈條件'])}</dd>
                </div>
                <div>
                  <dt><span class="signal-dot red" title="紅燈" aria-label="紅燈"></span><span class="sr-only">紅燈</span></dt>
                  <dd>${inlineMarkdown(row['紅燈條件'])}</dd>
                </div>
              </dl>
              <div class="checklist-cell checklist-evidence">
                <p>${inlineMarkdown(row['必須證據'])}</p>
              </div>
            </article>
          `;
        })
        .join('')}
    </div>
  `;
}

function renderRoadmap(rows) {
  if (!dom.roadmap) return;
  if (!rows.length) {
    dom.roadmap.innerHTML = '<div class="empty-state">沒有在 MD 找到 Roadmap 表。</div>';
    return;
  }

  dom.roadmap.innerHTML = rows
    .map(
      (row) => `
        <article class="roadmap-item">
          <span class="badge">${escapeHtml(row.Phase)}</span>
          <h3>${inlineMarkdown(row['目標'])}</h3>
          <p>${inlineMarkdown(row['產出'])}</p>
          <p><strong>${inlineMarkdown(row.Owner)}</strong></p>
        </article>
      `
    )
    .join('');
}

function estimateTotal(rows) {
  let min = 0;
  let max = 0;
  rows.forEach((row) => {
    const text = row['預估時間'] || row.Estimate || '';
    const range = text.match(/(\d+(?:\.\d+)?)\s*[-~]\s*(\d+(?:\.\d+)?)/);
    const single = text.match(/(\d+(?:\.\d+)?)/);
    if (range) {
      min += Number(range[1]);
      max += Number(range[2]);
    } else if (single) {
      min += Number(single[1]);
      max += Number(single[1]);
    }
  });
  if (!min && !max) return '--';
  return min === max ? `${min} 週` : `${min}-${max} 週`;
}

function renderStageGrid(rows) {
  if (!dom.stageGrid) return;
  if (dom.stageCount) dom.stageCount.textContent = rows.length || '--';
  if (dom.totalEstimate) dom.totalEstimate.textContent = estimateTotal(rows);

  if (!rows.length) {
    dom.stageGrid.innerHTML = '<div class="empty-state">沒有在 MD 找到 Stage Overview 表。</div>';
    return;
  }

  dom.stageGrid.innerHTML = rows
    .map(
      (row) => `
        <article class="stage-card">
          <div class="timing-top">
            <span class="badge">${inlineMarkdown(row.Stage)}</span>
            <span class="owner-pill">${inlineMarkdown(row['預估時間'])}</span>
          </div>
          <h3>${inlineMarkdown(row.Goal)}</h3>
          <p>${inlineMarkdown(row.Scope)}</p>
          <dl class="stage-detail-grid">
            <div>
              <dt>A 測試設計</dt>
              <dd>${inlineMarkdown(row['A 測試設計'])}</dd>
            </div>
            <div>
              <dt>B 自動化驗證</dt>
              <dd>${inlineMarkdown(row['B 自動化驗證'])}</dd>
            </div>
            <div>
              <dt>C 監控與放行</dt>
              <dd>${inlineMarkdown(row['C 監控與放行'])}</dd>
            </div>
            <div>
              <dt>T / Env</dt>
              <dd>${inlineMarkdown(row['T 範圍'])} · ${inlineMarkdown(row['環境'])}</dd>
            </div>
          </dl>
          <div class="artifact">${inlineMarkdown(row['完成條件'])}</div>
        </article>
      `
    )
    .join('');
}

function renderExecutionTasks(rows) {
  if (!dom.executionTaskBoard) return;
  if (dom.taskCount) dom.taskCount.textContent = rows.length || '--';

  if (!rows.length) {
    dom.executionTaskBoard.innerHTML = '<div class="empty-state">沒有在 MD 找到 Execution Tasks 表。</div>';
    return;
  }

  const stages = unique(rows.map((row) => row.Stage));
  dom.executionTaskBoard.innerHTML = stages
    .map((stage) => {
      const stageRows = rows.filter((row) => row.Stage === stage);
      return `
        <section class="task-stage-group">
          <div class="task-stage-heading">
            <span class="badge">${inlineMarkdown(stage)}</span>
            <h3>${stageRows.length} tasks</h3>
          </div>
          <div class="task-card-list">
            ${stageRows
              .map(
                (row) => `
                  <article class="task-card">
                    <div class="task-card-top">
                      <span class="badge">${inlineMarkdown(row.Workstream)}</span>
                      <span class="owner-pill">${inlineMarkdown(row.Owner)}</span>
                      <span class="owner-pill">${inlineMarkdown(row.Estimate)}</span>
                    </div>
                    <h4>${inlineMarkdown(row.Task)}</h4>
                    <dl class="task-detail-grid">
                      <div>
                        <dt>Trigger</dt>
                        <dd>${inlineMarkdown(row.Trigger)}</dd>
                      </div>
                      <div>
                        <dt>Environment</dt>
                        <dd>${inlineMarkdown(row.Environment)}</dd>
                      </div>
                      <div>
                        <dt>Inputs</dt>
                        <dd>${inlineMarkdown(row.Inputs)}</dd>
                      </div>
                      <div>
                        <dt>Output</dt>
                        <dd>${inlineMarkdown(row.Output)}</dd>
                      </div>
                      <div>
                        <dt>Evidence Retention</dt>
                        <dd>${inlineMarkdown(row['Evidence Retention'])}</dd>
                      </div>
                      <div>
                        <dt>Test Data</dt>
                        <dd>${inlineMarkdown(row['Test Data Prerequisite'])}</dd>
                      </div>
                      <div>
                        <dt>DoD</dt>
                        <dd>${inlineMarkdown(row.DoD)}</dd>
                      </div>
                      <div>
                        <dt>Status</dt>
                        <dd>${inlineMarkdown(row.Status)}</dd>
                      </div>
                    </dl>
                  </article>
                `
              )
              .join('')}
          </div>
        </section>
      `;
    })
    .join('');
}

function renderTriggerMatrix(rows) {
  if (!dom.triggerMatrixGrid) return;
  if (!rows.length) {
    dom.triggerMatrixGrid.innerHTML = '<div class="empty-state">沒有在 MD 找到 Trigger Matrix 表。</div>';
    return;
  }

  dom.triggerMatrixGrid.innerHTML = rows
    .map(
      (row) => `
        <article class="trigger-card">
          <div class="timing-top">
            <span class="badge">${inlineMarkdown(row.Stage)}</span>
            <span class="owner-pill">${inlineMarkdown(row.T)}</span>
          </div>
          <h3>${inlineMarkdown(row.When)}</h3>
          <p>${inlineMarkdown(row.Automation)}</p>
          <div class="artifact">${inlineMarkdown(row.Report)} · ${inlineMarkdown(row.History)}</div>
        </article>
      `
    )
    .join('');
}

function renderEvidence(rows) {
  if (!dom.evidenceGrid) return;
  if (!rows.length) {
    dom.evidenceGrid.innerHTML = '<div class="empty-state">沒有在 MD 找到 Evidence Retention 表。</div>';
    return;
  }

  dom.evidenceGrid.innerHTML = rows
    .map(
      (row) => `
        <article class="evidence-card">
          <span class="badge">${inlineMarkdown(row.Artifact)}</span>
          <h3>${inlineMarkdown(row['Saved Location'])}</h3>
          <p>${inlineMarkdown(row.Retention)}</p>
          <div class="artifact">${inlineMarkdown(row['Access Owner'])} · ${inlineMarkdown(row['Used By'])}</div>
        </article>
      `
    )
    .join('');
}

function renderExecutionPage() {
  const stages = findTable((headers) => headers.includes('Stage') && headers.includes('Goal') && headers.includes('預估時間')).rows;
  const tasks = findTable((headers) => headers.includes('Task') && headers.includes('Trigger') && headers.includes('Evidence Retention')).rows;
  const triggers = findTable((headers) => headers.includes('When') && headers.includes('Automation') && headers.includes('History')).rows;
  const evidence = findTable((headers) => headers.includes('Artifact') && headers.includes('Saved Location') && headers.includes('Retention')).rows;

  renderStageGrid(stages);
  renderExecutionTasks(tasks);
  renderTriggerMatrix(triggers);
  renderEvidence(evidence);
}

function renderDashboard() {
  const pyramid = findTable((headers) => headers.includes('問題層級') && headers.includes('主管視角')).rows;
  const lifecycle = findTable((headers) => headers.includes('T') && headers.includes('品質目的') && headers.includes('對應能力')).rows;
  const capabilities = findTable((headers) => headers.includes('能力') && headers.includes('子項') && headers.includes('DoD')).rows;
  const qualityMetrics = findTable((headers) => headers.includes('指標') && headers.includes('建議門檻') && headers.includes('證據')).rows;
  const handoffChecklist = findTable(
    (headers) => headers.includes('Workstream') && headers.includes('Deliverable') && headers.includes('Risk acceptance')
  ).rows;
  const mapping = findTable((headers) => headers.includes('原流程元件') && headers.includes('對應能力')).rows;
  const timing = findTable((headers) => headers.includes('T') && headers.includes('負責/協作')).rows;
  const modules = findTable((headers) => headers.includes('M') && headers.includes('成本')).rows;
  const testTypes = findTable((headers) => headers.includes('測試類型') && headers.includes('常見驗證')).rows;
  const gateChecklist = findTable((headers) => headers.includes('Gate') && headers.includes('Check Item') && headers.includes('必須證據')).rows;
  const roadmap = findTable((headers) => headers.includes('Phase') && headers.includes('Owner')).rows;

  renderPyramid(pyramid);
  renderLifecycle(lifecycle);
  renderCapabilities(capabilities);
  renderQualityMetrics(qualityMetrics);
  renderHandoffChecklist(handoffChecklist);
  renderMapping(mapping);
  renderTiming(timing);
  renderModules(modules);
  renderTestTypes(testTypes);
  renderGateChecklist(gateChecklist);
  renderRoadmap(roadmap);
}

function bindSearch() {
  if (!dom.searchInput || !dom.sectionNav) return;
  dom.searchInput.addEventListener('input', (event) => {
    const query = event.target.value.trim().toLowerCase();
    dom.sectionNav.querySelectorAll('a').forEach((link) => {
      const visible = !query || link.dataset.title.includes(query);
      link.style.display = visible ? '' : 'none';
    });
  });
}

function bindActiveNav() {
  if (!dom.sectionNav) return;
  const links = [...dom.sectionNav.querySelectorAll('a')];
  const targetIdFor = (link) => link.dataset.targetId || (link.getAttribute('href') || '').replace(/^#/, '');
  const targets = links.map((link) => document.getElementById(targetIdFor(link))).filter(Boolean);

  if (!targets.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        links.forEach((link) => link.classList.toggle('active', targetIdFor(link) === entry.target.id));
      });
    },
    { rootMargin: '-20% 0px -70% 0px' }
  );

  targets.forEach((target) => observer.observe(target));
}

function bindModal() {
  document.querySelectorAll('[data-close-modal]').forEach((node) => node.addEventListener('click', closeModal));
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') closeModal();
  });
}

function showLoadError(error) {
  if (dom.sourceLabel) dom.sourceLabel.textContent = '讀取失敗';
  const message = `
    <div class="error-state">
      <strong>無法讀取 ${escapeHtml(MD_FILE)}</strong><br />
      請用本機伺服器開啟，例如在 QA-AI-WorkFlow 資料夾執行
      <code>python -m http.server 8088</code>，再開啟 <code>http://localhost:8088</code>。
      <br />錯誤：${escapeHtml(error.message)}
    </div>
  `;
  if (dom.content) dom.content.innerHTML = message;
  [
    dom.pyramidGrid,
    dom.lifecycleGrid,
    dom.capabilityGrid,
    dom.qualityMetricGrid,
    dom.handoffChecklistGrid,
    dom.mappingGrid,
    dom.timingRail,
    dom.moduleGrid,
    dom.testTypeGrid,
    dom.gateChecklistGrid,
    dom.roadmap,
    dom.stageGrid,
    dom.executionTaskBoard,
    dom.triggerMatrixGrid,
    dom.evidenceGrid,
  ]
    .filter(Boolean)
    .forEach((container) => {
      container.innerHTML = message;
    });
}

async function loadMarkdown() {
  if (dom.sourceLabel) dom.sourceLabel.textContent = '讀取 Markdown...';
  if (dom.content) dom.content.innerHTML = '<div class="empty-state">正在讀取 Markdown 內容...</div>';

  try {
    const response = await fetch(`${MD_FILE}?v=${Date.now()}`, { cache: 'no-store' });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const markdown = await response.text();
    state.markdown = markdown;
    state.sections = parseSections(markdown);
    state.tables = parseTables(markdown);

    const title = markdown.match(/^#\s+(.+)$/m)?.[1]?.trim() || 'QA AI WorkFlow';
    const version = parseVersion(markdown);
    if (dom.title) dom.title.textContent = PAGE === 'document' ? 'Markdown 正文' : title;
    if (dom.versionBadge) dom.versionBadge.textContent = version;
    if (dom.sourceLabel) {
      dom.sourceLabel.textContent = `${MD_FILE} · ${new Date().toLocaleString('zh-TW', { hour12: false })}`;
    }

    if (PAGE === 'document' && dom.content) {
      dom.content.innerHTML = renderMarkdown(markdown);
      renderNav(state.sections);
      bindActiveNav();
    } else if (PAGE === 'execution') {
      renderExecutionPage();
    } else {
      renderDashboard();
    }
  } catch (error) {
    showLoadError(error);
  }
}

dom.reloadButton?.addEventListener('click', loadMarkdown);
bindSearch();
bindModal();
loadMarkdown();
