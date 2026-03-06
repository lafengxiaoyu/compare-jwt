import React from 'react';
import { useTranslation } from '../i18n';

const UserGuide: React.FC = () => {
  const { t, language } = useTranslation();

  const isEnglish = language === 'en';

  return (
    <div style={{ color: '#c9d1d9' }}>
      <div style={{ marginBottom: '30px' }}>
        <h2 style={{ marginTop: 0, color: '#58a6ff' }}>
          {isEnglish ? '📚 User Guide' : '📚 使用手册'}
        </h2>
        <p style={{ color: '#8b949e' }}>
          {isEnglish
            ? 'This tool provides two main features: JWT file comparison and multi-environment comparison.'
            : '本工具提供两种主要功能：JWT文件对比和多环境对比。'}
        </p>
      </div>

      <div style={{ display: 'grid', gap: '24px' }}>
        {/* JWT File Comparison */}
        <div style={{
          padding: '20px',
          background: '#161b22',
          border: '1px solid #30363d',
          borderRadius: '8px'
        }}>
          <h3 style={{ color: '#58a6ff', marginBottom: '12px' }}>
            {isEnglish ? '🔐 JWT File Comparison' : '🔐 JWT 文件对比'}
          </h3>
          <div style={{ fontSize: '14px', lineHeight: '1.6' }}>
            <p><strong>{isEnglish ? 'Features:' : '功能说明：'}</strong></p>
            <ul style={{ paddingLeft: '20px', marginBottom: '12px' }}>
              <li>{isEnglish ? 'Compare differences between two JWT/JWE tokens' : '对比两个 JWT/JWE token 的差异'}</li>
              <li>{isEnglish ? 'Supports standard JWT (3 parts), unsigned JWT (2 parts), and JWE encrypted tokens (5 parts)' : '支持标准 JWT（3部分）、无签名 JWT（2部分）和 JWE 加密 token（5部分）'}</li>
              <li>{isEnglish ? 'Display detailed header and payload comparison' : '显示详细的 header 和 payload 对比'}</li>
              <li>{isEnglish ? 'Claims table shows changes in each field' : 'claims 表格显示每个字段的变化'}</li>
              <li>{isEnglish ? 'Supports synchronized scrolling for JSON content comparison' : '支持同步滚动对比 JSON 内容'}</li>
            </ul>
            <p><strong>{isEnglish ? 'Steps:' : '使用步骤：'}</strong></p>
            <ol style={{ paddingLeft: '20px' }}>
              <li>{isEnglish ? 'Paste the first JWT token in the left input box' : '在左侧输入框粘贴第一个 JWT token'}</li>
              <li>{isEnglish ? 'Paste the second JWT token in the right input box' : '在右侧输入框粘贴第二个 JWT token'}</li>
              <li>{isEnglish ? 'Click the "Compare JWT/JWE" button' : '点击"对比 JWT/JWE"按钮'}</li>
              <li>{isEnglish ? 'View the comparison results, including header, payload, and claims changes' : '查看对比结果，包括 header、payload 和 claims 变化'}</li>
            </ol>
          </div>
        </div>

        {/* Multi-Environment Comparison */}
        <div style={{
          padding: '20px',
          background: '#161b22',
          border: '1px solid #30363d',
          borderRadius: '8px'
        }}>
          <h3 style={{ color: '#58a6ff', marginBottom: '12px' }}>
            {isEnglish ? '🌍 Multi-Environment Comparison' : '🌍 多环境对比'}
          </h3>
          <div style={{ fontSize: '14px', lineHeight: '1.6' }}>
            <p><strong>{isEnglish ? 'Features:' : '功能说明：'}</strong></p>
            <ul style={{ paddingLeft: '20px', marginBottom: '12px' }}>
              <li>{isEnglish ? 'Compare JWT changes across multiple environments (e.g., prd, acc, tst)' : '对比多个环境（如 prd、acc、tst）之间的 JWT 变化'}</li>
              <li>{isEnglish ? 'Supports global detection, automatically processing all changed files' : '支持全局检测，自动处理所有变化的文件'}</li>
              <li>{isEnglish ? 'Can also manually specify environment directories for precise comparison' : '也可以手动指定环境目录进行精确对比'}</li>
              <li>{isEnglish ? 'Each environment displayed separately for easy cross-environment comparison' : '每个环境单独显示，便于跨环境对比'}</li>
              <li>{isEnglish ? 'Supports generating reports in multiple formats' : '支持生成多种格式的报告'}</li>
            </ul>
            <p><strong>{isEnglish ? 'Steps:' : '使用步骤：'}</strong></p>
            <ol style={{ paddingLeft: '20px' }}>
              <li>{isEnglish ? 'Enter the repository path (absolute path to local git repository)' : '填写仓库路径（本地 git 仓库的绝对路径）'}</li>
              <li>{isEnglish ? 'Enter the first commit hash (start version)' : '填写第一个提交的 hash（起始版本）'}</li>
              <li>{isEnglish ? 'Enter the second commit hash (target version)' : '填写第二个提交的 hash（目标版本）'}</li>
              <li>({isEnglish ? 'Optional' : '可选'}) {isEnglish ? 'Enter environment directories, e.g., prd, acc, tst, or leave empty for global detection' : '填写环境目录，如 prd, acc, tst，或留空进行全局检测'}</li>
              <li>{isEnglish ? 'Click the "Multi-Environment Comparison" button' : '点击"多环境对比"按钮'}</li>
              <li>{isEnglish ? 'View comparison results for each environment and click download buttons to generate reports' : '查看每个环境的对比结果，点击下载按钮生成报告'}</li>
            </ol>
            <p style={{ marginTop: '12px', color: '#8b949e' }}>
              <strong>{isEnglish ? '💡 Tip:' : '💡 提示：'}</strong>
              {isEnglish
                ? 'If you do not fill in environment directories, the system will automatically detect all changed files, suitable for files not in standard environment directories'
                : '如果不填写环境目录，系统会自动检测所有变化的文件，适合不在标准环境目录中的文件'}
            </p>
          </div>
        </div>

        {/* Report Generation */}
        <div style={{
          padding: '20px',
          background: '#161b22',
          border: '1px solid #30363d',
          borderRadius: '8px'
        }}>
          <h3 style={{ color: '#58a6ff', marginBottom: '12px' }}>
            {isEnglish ? '📄 Report Generation' : '📄 报告生成'}
          </h3>
          <div style={{ fontSize: '14px', lineHeight: '1.6' }}>
            <p><strong>{isEnglish ? 'Supported Report Formats:' : '支持的报告格式：'}</strong></p>
            <ul style={{ paddingLeft: '20px', marginBottom: '12px' }}>
              <li><strong>Markdown:</strong> {isEnglish ? 'Easy to read and edit, suitable for document sharing and Git commits' : '易于阅读和编辑，适合文档分享和 Git 提交'}</li>
              <li><strong>HTML:</strong> {isEnglish ? 'Beautiful rendering with syntax highlighting, suitable for viewing in browsers' : '美观的渲染效果，支持语法高亮，适合在浏览器中查看'}</li>
              <li><strong>JSON:</strong> {isEnglish ? 'Machine-readable structured data, suitable for program processing and automation integration' : '机器可读的结构化数据，适合程序处理和自动化集成'}</li>
            </ul>
            <p><strong>{isEnglish ? 'Generation Methods:' : '生成方式：'}</strong></p>
            <ul style={{ paddingLeft: '20px' }}>
              <li>{isEnglish ? 'After completing comparison in the web page, click the corresponding download button' : '在网页中对比完成后，点击对应的下载按钮'}</li>
              <li>{isEnglish ? 'Use command line tool:' : '使用命令行工具：'} <code style={{ background: '#0d1117', padding: '2px 6px', borderRadius: '3px' }}>./scripts/generate-report.sh</code></li>
              <li>{isEnglish ? 'Use curl command to call API' : '使用 curl 命令调用 API'}</li>
            </ul>
          </div>
        </div>

        {/* Command Line Usage */}
        <div style={{
          padding: '20px',
          background: '#161b22',
          border: '1px solid #30363d',
          borderRadius: '8px'
        }}>
          <h3 style={{ color: '#58a6ff', marginBottom: '12px' }}>
            {isEnglish ? '💻 Command Line Usage' : '💻 命令行使用'}
          </h3>
          <div style={{ fontSize: '14px', lineHeight: '1.6' }}>
            <p><strong>{isEnglish ? 'Start Server:' : '启动服务器：'}</strong></p>
            <pre style={{
              background: '#0d1117',
              padding: '12px',
              borderRadius: '6px',
              overflowX: 'auto',
              fontSize: '13px',
              marginBottom: '12px'
            }}>
              <code>npm start</code>
            </pre>
            <p><strong>{isEnglish ? 'Report Generation Script:' : '生成报告脚本：'}</strong></p>
            <pre style={{
              background: '#0d1117',
              padding: '12px',
              borderRadius: '6px',
              overflowX: 'auto',
              fontSize: '13px',
              marginBottom: '12px'
            }}>
              <code>{isEnglish ? `# Generate Markdown report
./scripts/generate-report.sh /path/to/repo commit1 commit2

# Generate HTML report (specify file)
./scripts/generate-report.sh /path/to/repo commit1 commit2 test-data/test.jose html

# Generate JSON report
./scripts/generate-report.sh /path/to/repo commit1 commit2 '' json` : `# 生成 Markdown 报告
./scripts/generate-report.sh /path/to/repo commit1 commit2

# 生成 HTML 报告（指定文件）
./scripts/generate-report.sh /path/to/repo commit1 commit2 test-data/test.jose html

# 生成 JSON 报告
./scripts/generate-report.sh /path/to/repo commit1 commit2 '' json`}</code>
            </pre>
            <p><strong>{isEnglish ? 'Use curl directly:' : '直接使用 curl：'}</strong></p>
            <pre style={{
              background: '#0d1117',
              padding: '12px',
              borderRadius: '6px',
              overflowX: 'auto',
              fontSize: '13px'
            }}>
              <code>{`curl -X POST http://localhost:3001/api/git/generate-report \\
  -H "Content-Type: application/json" \\
  -d '{
    "repoPath": "/path/to/repo",
    "commit1": "commit1-hash",
    "commit2": "commit2-hash",
    "format": "markdown"
  }' | python3 -c "import sys, json; data = json.load(sys.stdin); open(data['filename'], 'w').write(data['report'])"`}</code>
            </pre>
          </div>
        </div>

        {/* Tips */}
        <div style={{
          padding: '20px',
          background: '#161b22',
          border: '1px solid #30363d',
          borderRadius: '8px'
        }}>
          <h3 style={{ color: '#58a6ff', marginBottom: '12px' }}>
            {isEnglish ? '💡 FAQ & Tips' : '💡 常见问题和技巧'}
          </h3>
          <div style={{ fontSize: '14px', lineHeight: '1.6' }}>
            <ul style={{ paddingLeft: '20px' }}>
              <li><strong>{isEnglish ? 'Why are some files not detected?' : '为什么有些文件没有被检测到？'}</strong>
                <p style={{ marginLeft: '20px', color: '#8b949e', marginBottom: '8px' }}>
                  {isEnglish
                    ? `Check if the file extension is in the supported list: .json, .txt, .jwt, .jose, .token, .env, .config`
                    : `检查文件扩展名是否在支持列表中：.json, .txt, .jwt, .jose, .token, .env, .config`}
                </p>
              </li>
              <li><strong>{isEnglish ? 'How to get commit hash?' : '如何获取 commit hash？'}</strong>
                <p style={{ marginLeft: '20px', color: '#8b949e', marginBottom: '8px' }}>
                  {isEnglish
                    ? `Use ${<code style={{ background: '#0d1117', padding: '2px 6px', borderRadius: '3px' }}>git log --oneline</code>} to view commit history, use the full 40-character hash or the first 7-8 characters`
                    : `使用 ${<code style={{ background: '#0d1117', padding: '2px 6px', borderRadius: '3px' }}>git log --oneline</code>} 查看提交历史，使用完整的 40 位 hash 或前 7-8 位`}
                </p>
              </li>
              <li><strong>{isEnglish ? 'What if comparing large files is slow?' : '对比大文件时很慢怎么办？'}</strong>
                <p style={{ marginLeft: '20px', color: '#8b949e', marginBottom: '8px' }}>
                  {isEnglish
                    ? 'Try specifying a specific file path instead of comparing all files'
                    : '尝试指定具体的文件路径，而不是对比所有文件'}
                </p>
              </li>
              <li><strong>{isEnglish ? 'Server won\'t start?' : '服务器无法启动？'}</strong>
                <p style={{ marginLeft: '20px', color: '#8b949e', marginBottom: '8px' }}>
                  {isEnglish
                    ? `Check if port 3001 is occupied, use ${<code style={{ background: '#0d1117', padding: '2px 6px', borderRadius: '3px' }}>pkill -f "node server/index.js"</code>} to kill old processes`
                    : `检查端口 3001 是否被占用，使用 ${<code style={{ background: '#0d1117', padding: '2px 6px', borderRadius: '3px' }}>pkill -f "node server/index.js"</code>} 杀死旧进程`}
                </p>
              </li>
              <li><strong>{isEnglish ? 'Does it support strictly encrypted environments like banks?' : '支持银行等严格加密环境吗？'}</strong>
                <p style={{ marginLeft: '20px', color: '#8b949e', marginBottom: '8px' }}>
                  {isEnglish
                    ? 'Fully supported! All operations are performed locally, and no data is uploaded to external servers'
                    : '完全支持！所有操作都在本地进行，不会上传任何数据到外部服务器'}
                </p>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserGuide;
