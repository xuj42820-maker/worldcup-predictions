const fs = require('fs');
const path = require('path');
const mammoth = require('mammoth');

const DOCS_DIR = path.join(__dirname, 'docs');
const OUTPUT_FILE = path.join(__dirname, 'index.html');
const TEMPLATE_FILE = path.join(__dirname, 'template.html');

async function convertDocxToHtml(filePath) {
  const result = await mammoth.convertToHtml({ path: filePath });
  return result.value;
}

function extractInfoFromFilename(filename) {
  const dateMatch = filename.match(/(\d{4}[-.]?\d{2}[-.]?\d{2})/);
  const date = dateMatch ? dateMatch[1].replace(/[.]/g, '-') : filename.replace('.docx', '');
  const title = filename.replace('.docx', '').replace(/^\d{4}[-.]?\d{2}[-.]?\d{2}[日]?_?/, '');
  return { date, title: title || '预测文档' };
}

async function build() {
  console.log('开始构建...');

  let template = fs.readFileSync(TEMPLATE_FILE, 'utf-8');

  const files = fs.readdirSync(DOCS_DIR)
    .filter(f => f.endsWith('.docx'))
    .sort()
    .reverse();

  if (files.length === 0) {
    template = template.replace('{{DOC_LIST}}', '<p style="padding: 1rem; color: #666;">暂无文档</p>');
    template = template.replace('{{DOCS_DATA}}', '{}');
    fs.writeFileSync(OUTPUT_FILE, template);
    return;
  }

  console.log(`找到 ${files.length} 个文档`);

  let docListHtml = '';
  const docsData = {};

  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    const filePath = path.join(DOCS_DIR, file);
    const { date, title } = extractInfoFromFilename(file);

    try {
      const content = await convertDocxToHtml(filePath);
      const docId = `doc-${i}`;

      docListHtml += `
        <a class="doc-item" onclick="showDoc('${docId}')" data-id="${docId}">
          <span class="date">${date}</span>
          <span class="title">${title}</span>
        </a>
      `;

      docsData[docId] = content;
      console.log(`✓ 转换成功: ${file}`);
    } catch (error) {
      console.error(`✗ 转换失败: ${file}`, error.message);
    }
  }

  template = template.replace('{{DOC_LIST}}', docListHtml);
  template = template.replace('{{DOCS_DATA}}', JSON.stringify(docsData));

  fs.writeFileSync(OUTPUT_FILE, template);
  console.log(`\n构建完成！输出文件: ${OUTPUT_FILE}`);
}

build().catch(console.error);
