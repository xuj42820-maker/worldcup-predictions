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

function extractDateFromFilename(filename) {
  const match = filename.match(/(\d{4}[-.]?\d{2}[-.]?\d{2})/);
  if (match) {
    return match[1].replace(/[.]/g, '-');
  }
  return filename.replace('.docx', '');
}

async function build() {
  console.log('开始构建...');

  let template = fs.readFileSync(TEMPLATE_FILE, 'utf-8');

  const files = fs.readdirSync(DOCS_DIR)
    .filter(f => f.endsWith('.docx'))
    .sort()
    .reverse();

  if (files.length === 0) {
    template = template.replace('{{PREDICTIONS}}', `
      <div class="empty-state">
        <p>暂无预测文档</p>
        <p>请将 Word 文档放入 docs 文件夹</p>
      </div>
    `);
    fs.writeFileSync(OUTPUT_FILE, template);
    return;
  }

  console.log(`找到 ${files.length} 个文档`);

  let predictionsHtml = '';

  for (const file of files) {
    const filePath = path.join(DOCS_DIR, file);
    const date = extractDateFromFilename(file);

    try {
      const content = await convertDocxToHtml(filePath);
      predictionsHtml += `
        <div class="prediction-card">
          <div class="card-header" onclick="toggleCard(this)">
            <span class="date">${date}</span>
            <span class="toggle-icon">▼</span>
          </div>
          <div class="card-content">
            ${content}
          </div>
        </div>
      `;
      console.log(`✓ 转换成功: ${file}`);
    } catch (error) {
      console.error(`✗ 转换失败: ${file}`, error.message);
    }
  }

  template = template.replace('{{PREDICTIONS}}', predictionsHtml);

  fs.writeFileSync(OUTPUT_FILE, template);
  console.log(`\n构建完成！输出文件: ${OUTPUT_FILE}`);
}

build().catch(console.error);
