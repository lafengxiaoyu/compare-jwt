import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

describe('Git Compare API Test', () => {
  const TEST_REPO_PATH = '/tmp/test-git-compare-repo';
  const API_URL = 'http://localhost:3001/api/git/compare';

  beforeAll(async () => {
    // 创建测试仓库
    await execAsync(`rm -rf ${TEST_REPO_PATH}`);
    await execAsync(`mkdir -p ${TEST_REPO_PATH}`);
    await execAsync(`cd ${TEST_REPO_PATH} && git init`);
    await execAsync(`cd ${TEST_REPO_PATH} && git config user.email "test@test.com"`);
    await execAsync(`cd ${TEST_REPO_PATH} && git config user.name "Test User"`);

    // 第一个 commit：包含 JWT 1.0
    const jwt1 = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJtYW5pZmVzdFZlcnNpb24iOiIxLjAiLCJuYW1lIjoiTW9jayBBUEkgTWFuaWZlc3QiLCJlbnZpcm9ubWVudCI6InByb2R1Y3Rpb24iLCJhcGlzIjpbeyJuYW1lIjoiZ2V0VXNlciIsIm1ldGhvZCI6IkdFVCIsImVuZHBvaW50IjoiL2FwaS92MS91c2Vycy97aWR9IiwiYXV0aCI6IkJlYXJlciJ9LHsibmFtZSI6ImNyZWF0ZU9yZGVyIiwibWV0aG9kIjoiUE9TVCIsImVuZHBvaW50IjoiL2FwaS92MS9vcmRlcnMiLCJhdXRoIjoiQmVhcmVyIn0seyJuYW1lIjoiaGVhbHRoQ2hlY2siLCJtZXRob2QiOiJHRVQiLCJlbmRwb2ludCI6Ii9oZWFsdGgiLCJhdXRoIjoiTm9uZSJ9XSwiaXNzdWVkQXQiOjE3MTAwMDAwMDB9';
    await execAsync(`cd ${TEST_REPO_PATH} && echo '${jwt1}' > jwt.json`);
    await execAsync(`cd ${TEST_REPO_PATH} && git add .`);
    await execAsync(`cd ${TEST_REPO_PATH} && git commit -m "Add JWT v1.0"`);

    // 第二个 commit：包含 JWT 1.1
    const jwt2 = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJtYW5pZmVzdFZlcnNpb24iOiIxLjEiLCJuYW1lIjoiTW9jayBBUEkgTWFuaWZlc3QiLCJlbnZpcm9ubWVudCI6InByb2R1Y3Rpb24iLCJhcGlzIjpbeyJuYW1lIjoiZ2V0VXNlciIsIm1ldGhvZCI6IkdFVCIsImVuZHBvaW50IjoiL2FwaS92MS91c2Vycy97aWR9IiwiYXV0aCI6IkJlYXJlciJ9LHsibmFtZSI6ImNyZWF0ZU9yZGVyIiwibWV0aG9kIjoiUE9TVCIsImVuZHBvaW50IjoiL2FwaS92MS9vcmRlcnMiLCJhdXRoIjoiQmVhcmVyIn0seyJuYW1lIjoiaGVhbHRoQ2hlY2siLCJtZXRob2QiOiJHRVQiLCJlbmRwb2ludCI6Ii9oZWFsdGgiLCJhdXRoIjoiTm9uZSJ9LHsibmFtZSI6ImRlbGV0ZU9yZGVyIiwibWV0aG9kIjoiREVMRVRFIiwiZW5kcG9pbnQiOiIvYXBpL3YxL29yZGVycy97aWR9IiwiYXV0aCI6IkJlYXJlciJ9XSwiaXNzdWVkQXQiOjE3MTAwMDAwMDB9';
    await execAsync(`cd ${TEST_REPO_PATH} && echo '${jwt2}' > jwt.json`);
    await execAsync(`cd ${TEST_REPO_PATH} && git add .`);
    await execAsync(`cd ${TEST_REPO_PATH} && git commit -m "Add JWT v1.1 with deleteOrder API"`);
  }, 30000);

  afterAll(async () => {
    await execAsync(`rm -rf ${TEST_REPO_PATH}`);
  });

  it('should compare two git commits and detect JWT changes', async () => {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        repoPath: TEST_REPO_PATH,
        commit1: 'HEAD~1',
        commit2: 'HEAD',
      }),
    });

    expect(response.ok).toBe(true);
    
    const data = await response.json();
    console.log('\n=== Git Compare API Result ===');
    console.log(`Total files: ${data.totalFiles}`);
    console.log(`Processed files: ${data.processedFiles}`);
    console.log(`JWT files found: ${data.files.length}`);
    
    if (data.files.length > 0) {
      data.files.forEach((file: any, index: number) => {
        console.log(`\nFile ${index + 1}: ${file.path}`);
        console.log(`Changes: ${file.changes.length} parts`);
        
        // 统计差异
        let addedLines = 0;
        let removedLines = 0;
        let hasVersionChange = false;
        let hasNewAPI = false;
        
        file.changes.forEach((change: any) => {
          if (change.added) {
            addedLines += change.value.split('\n').filter((l: string) => l.trim()).length;
            if (change.value.includes('manifestVersion')) hasVersionChange = true;
            if (change.value.includes('deleteOrder')) hasNewAPI = true;
          }
          if (change.removed) {
            removedLines += change.value.split('\n').filter((l: string) => l.trim()).length;
          }
        });
        
        console.log(`  Added lines: ${addedLines}`);
        console.log(`  Removed lines: ${removedLines}`);
        console.log(`  Version change detected: ${hasVersionChange}`);
        console.log(`  New API (deleteOrder) detected: ${hasNewAPI}`);
      });
    }

    expect(data.files).toBeDefined();
    expect(data.totalFiles).toBeGreaterThan(0);
  });

  it('should handle missing parameters', async () => {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        repoPath: TEST_REPO_PATH,
        // missing commit1 and commit2
      }),
    });

    expect(response.ok).toBe(false);
    
    const data = await response.json();
    expect(data.error).toBeDefined();
  });
});
