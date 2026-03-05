import express from 'express';
import cors from 'cors';
import { simpleGit } from 'simple-git';
import { jwtDecode } from 'jwt-decode';

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

// Decode JWT/JWE and return JSON
const decodeJWT = (token) => {
  try {
    const parts = token.trim().split('.');
    
    if (parts.length === 3) {
      // Standard JWT (JWS)
      const decoded = jwtDecode(token);
      return JSON.stringify(decoded, null, 2);
    } else if (parts.length === 2) {
      // JWT without signature (header.payload only)
      const payload = JSON.parse(Buffer.from(parts[1], 'base64').toString());
      const header = JSON.parse(Buffer.from(parts[0], 'base64').toString());
      return JSON.stringify({
        header: header,
        payload: payload,
        note: 'This JWT has no signature part (2 parts only)'
      }, null, 2);
    } else if (parts.length === 5) {
      // JWE (JSON Web Encryption)
      const header = JSON.parse(Buffer.from(parts[0], 'base64').toString());
      return JSON.stringify({
        type: 'JWE (Encrypted)',
        header: header,
        note: 'This is an encrypted JWE. Only the header can be decoded without the decryption key.',
        structure: {
          header: parts[0].substring(0, 50) + '...',
          encryptedKey: parts[1].substring(0, 30) + '...',
          iv: parts[2].substring(0, 30) + '...',
          ciphertext: parts[3].substring(0, 30) + '...',
          authTag: parts[4].substring(0, 30) + '...'
        }
      }, null, 2);
    } else {
      return null;
    }
  } catch (err) {
    return null;
  }
};

// Check if content is JWT or JWE
const isJWT = (content) => {
  try {
    if (!content || typeof content !== 'string') return false;
    const trimmed = content.trim();
    const parts = trimmed.split('.');
    
    // Accept JWT (2 or 3 parts) or JWE (5 parts)
    if (parts.length !== 2 && parts.length !== 3 && parts.length !== 5) return false;
    
    // Quick check: each part should be base64-like
    const base64Regex = /^[A-Za-z0-9_-]+$/;
    if (!parts.every(p => base64Regex.test(p))) return false;
    
    // Try to decode at least the header
    const header = JSON.parse(Buffer.from(parts[0], 'base64').toString());
    return header && typeof header === 'object';
  } catch {
    return false;
  }
};

// File extensions that might contain JWT
const jwtFileExtensions = ['.json', '.txt', '.jwt', '.token', '.env', '.config', '.secret', ''];
const shouldCheckFile = (filePath) => {
  const ext = '.' + filePath.split('.').pop().toLowerCase();
  return jwtFileExtensions.some(e => filePath.endsWith(e) || e === '');
};

// Get diff between two commits
app.post('/api/git/compare', async (req, res) => {
  try {
    const { repoPath, commit1, commit2 } = req.body;

    if (!repoPath || !commit1 || !commit2) {
      return res.status(400).json({ error: '缺少必要参数' });
    }

    const git = simpleGit(repoPath);

    // Get diff between two commits
    const diffSummary = await git.diffSummary([commit1, commit2]);
    
    // Get detailed diff for each file
    const diffResult = await git.diff([commit1, commit2]);
    
    // Parse diff output to extract file changes
    const fileChanges = {};
    let currentFile = null;
    let currentContent = [];
    const lines = diffResult.split('\n');

    for (const line of lines) {
      if (line.startsWith('diff --git ')) {
        if (currentFile && currentContent.length > 0) {
          fileChanges[currentFile] = currentContent.join('\n');
        }
        const match = line.match(/diff --git a\/(.+) b\/(.+)/);
        if (match) {
          currentFile = match[2];
          currentContent = [];
        }
      } else if (currentFile) {
        currentContent.push(line);
      }
    }
    
    if (currentFile && currentContent.length > 0) {
      fileChanges[currentFile] = currentContent.join('\n');
    }

    // Filter JWT files and decode them
    const jwtFiles = [];
    const totalFiles = diffSummary.files.length;
    let processedFiles = 0;

    console.log(`Processing ${totalFiles} changed files...`);

    for (const file of diffSummary.files) {
      processedFiles++;
      
      // Skip binary files and unsupported extensions
      if (!shouldCheckFile(file.file)) {
        continue;
      }

      try {
        // Get file content from both commits
        const content1 = await git.show([`${commit1}:${file.file}`]).catch(() => '');
        const content2 = await git.show([`${commit2}:${file.file}`]).catch(() => '');

        // Quick check before deep validation
        if (!content1 && !content2) continue;

        // Check if either version contains JWT
        const isJWT1 = isJWT(content1);
        const isJWT2 = isJWT(content2);

        if (isJWT1 || isJWT2) {
          console.log(`Found JWT in: ${file.file}`);
          
          const json1 = isJWT1 ? decodeJWT(content1) : content1;
          const json2 = isJWT2 ? decodeJWT(content2) : content2;

          // Create diff between decoded JWTs
          const changes = createDiff(json1 || '', json2 || '');

          jwtFiles.push({
            path: file.file,
            changes: changes
          });
        }
      } catch (err) {
        // Skip files that can't be read
        console.error(`Error processing file ${file.file}:`, err.message);
      }
    }

    console.log(`Found ${jwtFiles.length} JWT files`);
    res.json({ 
      files: jwtFiles,
      totalFiles: totalFiles,
      processedFiles: processedFiles
    });
  } catch (err) {
    console.error('Error:', err);
    res.status(500).json({ error: err.message || '对比失败' });
  }
});

// Create diff object
const createDiff = (content1, content2) => {
  const lines1 = content1.split('\n');
  const lines2 = content2.split('\n');
  
  const changes = [];
  let i = 0, j = 0;

  while (i < lines1.length || j < lines2.length) {
    if (i >= lines1.length) {
      // Only additions left
      const addedLines = [];
      while (j < lines2.length) {
        addedLines.push(lines2[j]);
        j++;
      }
      if (addedLines.length > 0) {
        changes.push({ value: addedLines.join('\n') + '\n', added: true });
      }
    } else if (j >= lines2.length) {
      // Only deletions left
      const removedLines = [];
      while (i < lines1.length) {
        removedLines.push(lines1[i]);
        i++;
      }
      if (removedLines.length > 0) {
        changes.push({ value: removedLines.join('\n') + '\n', removed: true });
      }
    } else if (lines1[i] === lines2[j]) {
      // Same line
      const sameLines = [];
      while (i < lines1.length && j < lines2.length && lines1[i] === lines2[j]) {
        sameLines.push(lines1[i]);
        i++;
        j++;
      }
      if (sameLines.length > 0) {
        changes.push({ value: sameLines.join('\n') + '\n' });
      }
    } else {
      // Find how many lines to remove and add
      const removedLines = [];
      const addedLines = [];
      
      // Take from left
      while (i < lines1.length && !lines2.slice(j).includes(lines1[i])) {
        removedLines.push(lines1[i]);
        i++;
      }
      
      // Take from right
      while (j < lines2.length && !lines1.slice(i).includes(lines2[j])) {
        addedLines.push(lines2[j]);
        j++;
      }

      if (removedLines.length > 0) {
        changes.push({ value: removedLines.join('\n') + '\n', removed: true });
      }
      if (addedLines.length > 0) {
        changes.push({ value: addedLines.join('\n') + '\n', added: true });
      }
    }
  }

  return changes;
};

// Compare JWT changes across multiple environments between two commits
app.post('/api/git/compare-multiple-envs', async (req, res) => {
  try {
    const { repoPath, commit1, commit2, envDirs = [] } = req.body;

    if (!repoPath || !commit1 || !commit2) {
      return res.status(400).json({ error: '缺少必要参数: repoPath, commit1, commit2' });
    }

    const git = simpleGit(repoPath);
    const results = [];

    // Get list of files changed between commits
    const diffSummary = await git.diffSummary([commit1, commit2]);
    
    console.log(`Comparing commits ${commit1} -> ${commit2}`);
    console.log(`Total changed files: ${diffSummary.files.length}`);

    // For each environment directory
    for (const envDir of envDirs) {
      console.log(`\nProcessing environment: ${envDir}`);
      
      // Filter files belonging to this environment directory
      const envFiles = diffSummary.files.filter(f => f.file.startsWith(envDir));
      
      if (envFiles.length === 0) {
        console.log(`  No changes in ${envDir}`);
        continue;
      }

      console.log(`  Found ${envFiles.length} changed files in ${envDir}`);

      const jwtFiles = [];

      for (const file of envFiles) {
        // Skip binary files and unsupported extensions
        if (!shouldCheckFile(file.file)) {
          continue;
        }

        try {
          const content1 = await git.show([`${commit1}:${file.file}`]).catch(() => '');
          const content2 = await git.show([`${commit2}:${file.file}`]).catch(() => '');

          if (!content1 && !content2) continue;

          const isJWT1 = isJWT(content1);
          const isJWT2 = isJWT(content2);

          if (isJWT1 || isJWT2) {
            console.log(`    Found JWT: ${file.file}`);
            
            const json1 = isJWT1 ? decodeJWT(content1) : content1;
            const json2 = isJWT2 ? decodeJWT(content2) : content2;

            const changes = createDiff(json1 || '', json2 || '');

            jwtFiles.push({
              path: file.file.replace(envDir, ''), // Show relative path
              fullPath: file.file,
              changes: changes
            });
          }
        } catch (err) {
          console.error(`    Error processing ${file.file}:`, err.message);
        }
      }

      if (jwtFiles.length > 0) {
        results.push({
          environment: envDir,
          jwtCount: jwtFiles.length,
          jwtFiles: jwtFiles
        });
      }
    }

    // If no envDirs provided, try to auto-detect common environment directories
    if (envDirs.length === 0) {
      console.log('\nNo environment directories specified, auto-detecting...');
      
      const envPatterns = ['prd', 'prod', 'production', 'acc', 'acceptance', 'tst', 'test', 'stg', 'staging', 'dev'];
      const detectedEnvs = new Set();

      for (const file of diffSummary.files) {
        for (const pattern of envPatterns) {
          if (file.file.includes(`/${pattern}/`) || file.file.startsWith(`${pattern}/`)) {
            const envDir = file.file.substring(0, file.file.indexOf(pattern) + pattern.length);
            detectedEnvs.add(envDir);
            break;
          }
        }
      }

      const autoDetectedEnvs = Array.from(detectedEnvs);
      
      if (autoDetectedEnvs.length > 0) {
        console.log(`Auto-detected environments: ${autoDetectedEnvs.join(', ')}`);
        
        // Re-process with auto-detected environments
        for (const envDir of autoDetectedEnvs) {
          console.log(`\nProcessing environment: ${envDir}`);
          
          const envFiles = diffSummary.files.filter(f => f.file.startsWith(envDir));
          
          if (envFiles.length === 0) continue;

          const jwtFiles = [];

          for (const file of envFiles) {
            if (!shouldCheckFile(file.file)) continue;

            try {
              const content1 = await git.show([`${commit1}:${file.file}`]).catch(() => '');
              const content2 = await git.show([`${commit2}:${file.file}`]).catch(() => '');

              if (!content1 && !content2) continue;

              const isJWT1 = isJWT(content1);
              const isJWT2 = isJWT(content2);

              if (isJWT1 || isJWT2) {
                const json1 = isJWT1 ? decodeJWT(content1) : content1;
                const json2 = isJWT2 ? decodeJWT(content2) : content2;

                const changes = createDiff(json1 || '', json2 || '');

                jwtFiles.push({
                  path: file.file.replace(envDir, ''),
                  fullPath: file.file,
                  changes: changes
                });
              }
            } catch (err) {
              console.error(`    Error processing ${file.file}:`, err.message);
            }
          }

          if (jwtFiles.length > 0) {
            results.push({
              environment: envDir,
              jwtCount: jwtFiles.length,
              jwtFiles: jwtFiles
            });
          }
        }
      }
    }

    const totalJWTs = results.reduce((sum, r) => sum + r.jwtCount, 0);
    
    console.log(`\n=== Summary ===`);
    console.log(`Environments processed: ${results.length}`);
    console.log(`Total JWT files changed: ${totalJWTs}`);

    res.json({
      commit1: commit1,
      commit2: commit2,
      environments: results,
      totalEnvironments: results.length,
      totalJWTs: totalJWTs,
      timestamp: new Date().toISOString()
    });
  } catch (err) {
    console.error('Error:', err);
    res.status(500).json({ error: err.message || '对比失败' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
